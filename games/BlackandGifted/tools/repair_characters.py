"""Deterministic, non-destructive sprite repair. Pillow + numpy; no external services."""
from pathlib import Path
import json, statistics, hashlib, sys
import numpy as np
from PIL import Image, ImageFilter, ImageDraw

ROOT=Path(sys.argv[1]) if len(sys.argv)>1 else Path(__file__).resolve().parents[1]
DEST=ROOT/'assets/character-repair-v1'
DEST.mkdir(parents=True,exist_ok=True)

def components(mask):
    # Run-length connected components: diagonal neighbours count as connected.
    parent=[]; runs=[]; prev=[]
    def find(a):
        while parent[a]!=a: parent[a]=parent[parent[a]];a=parent[a]
        return a
    for y,row in enumerate(mask):
        edges=np.diff(np.pad(row.astype(np.int8),(1,1)))
        cur=[]
        for x0,x1 in zip(np.where(edges==1)[0],np.where(edges==-1)[0]):
            k=len(parent);parent.append(k)
            for a,b,j in prev:
                if b>=x0 and a<=x1: parent[find(k)]=find(j)
            cur.append((int(x0),int(x1),k));runs.append((y,int(x0),int(x1),k))
        prev=cur
    groups={}
    for y,a,b,k in runs:groups.setdefault(find(k),[]).append((y,a,b))
    return sorted(groups.values(),key=lambda g:sum(b-a for y,a,b in g),reverse=True)

def component_mask(size,group):
    a=np.zeros(size,dtype=np.uint8)
    for y,x0,x1 in group:a[y,x0:x1]=255
    return Image.fromarray(a)

def clean(im,panther=False):
    a=np.array(im); groups=components(a[:,:,3]>24)
    core=component_mask(a.shape[:2],groups[0])
    # Keep detached crown points/hair/jewellery within 12 pixels of the body.
    nearby=np.array(core.filter(ImageFilter.MaxFilter(25)))>0
    keep=np.zeros(a.shape[:2],dtype=bool)
    for g in groups:
        if any(nearby[y,x0:x1].any() for y,x0,x1 in g):
            for y,x0,x1 in g:keep[y,x0:x1]=True
    support=Image.fromarray((keep*255).astype(np.uint8)).filter(ImageFilter.MaxFilter(3))
    keep=np.array(support)>0
    removed=int(np.count_nonzero((a[:,:,3]>0)&~keep));a[~keep]=0
    if panther:
        edge=np.array(Image.fromarray(a[:,:,3]).filter(ImageFilter.MinFilter(3)))<64
        neutral=(a[:,:,:3].min(2)>150)&(np.ptp(a[:,:,:3].astype(int),axis=2)<55)
        a[edge&neutral,3]=0
    a[a[:,:,3]==0,:3]=0
    return Image.fromarray(a),removed

metrics={}; audit=[]; cleaned={}
for f in sorted((ROOT/'assets/characters').rglob('*.png')):
    im=Image.open(f).convert('RGBA'); fixed,removed=clean(im)
    rel=f.relative_to(ROOT/'assets/characters');out=DEST/'heroes'/rel;out.parent.mkdir(parents=True,exist_ok=True);fixed.save(out)
    box=fixed.getchannel('A').point(lambda a:255 if a>24 else 0).getbbox()
    cleaned[str(rel)]=(fixed,box)
    audit.append({'source':f.relative_to(ROOT).as_posix(),'output':out.relative_to(ROOT).as_posix(),'removedPixels':removed,'bounds':box,'sourceSHA256':hashlib.sha256(f.read_bytes()).hexdigest()})

for form in sorted((ROOT/'assets/characters').iterdir()):
    idle=[b[3]-b[1] for k,(im,b) in cleaned.items() if k.startswith(form.name+'/idle/')]
    if not idle: # Windows Path strings use backslashes.
        idle=[b[3]-b[1] for k,(im,b) in cleaned.items() if Path(k).parts[:2]==(form.name,'idle')]
    height=statistics.median(idle)
    for state in form.iterdir():
        entries=[(k,im,b) for k,(im,b) in cleaned.items() if Path(k).parts[:2]==(form.name,state.name)]
        if not entries:continue
        # Jump_01 is the standing reference, never the tallest accessory/stray pixel.
        reference=entries[0][2][3]-entries[0][2][1] if state.name=='jump' else height
        for k,im,b in entries:
            alpha=np.array(im)[:,:,3]; top,bottom=b[1],b[3]
            # Anchor torso, excluding hands, long hair and the scepter at either edge.
            band=alpha[int(top+(bottom-top)*.32):int(top+(bottom-top)*.56)]
            weights=band.sum(0);cx=float(np.dot(np.arange(im.width),weights)/max(1,weights.sum()))
            rel=(Path('assets/character-repair-v1/heroes')/k).as_posix()
            metrics[rel]={'height':reference,'cx':round(cx,2),'feet':bottom}

panthers={}
for state in ['sit','run']:
    im=Image.open(ROOT/f'assets/art/panther_{state}_states_clean.png').convert('RGBA');a=np.array(im)
    groups=[g for g in components(a[:,:,3]>24) if sum(b-a for y,a,b in g)>6000]
    # Sort by authored row, then x; use whole connected silhouettes, never a grid crop.
    groups.sort(key=lambda g:(min(y for y,a,b in g)//(440 if state=='sit' else 256),min(a for y,a,b in g)))
    panthers[state]=[]
    for i,g in enumerate(groups):
        mask=component_mask(a.shape[:2],g).filter(ImageFilter.MaxFilter(3));v=a.copy();v[np.array(mask)==0]=0
        frame,_=clean(Image.fromarray(v),True);box=frame.getbbox();frame=frame.crop(box)
        canvas=Image.new('RGBA',(frame.width+24,frame.height+24));canvas.alpha_composite(frame,(12,12))
        out=DEST/'panthers'/f'{state}_{i+1:02}.png';out.parent.mkdir(exist_ok=True);canvas.save(out)
        panthers[state].append({'path':out.relative_to(ROOT).as_posix(),'width':canvas.width,'height':canvas.height,'feet':canvas.height-12,'bodyHeight':frame.height})

(ROOT/'character-metrics.js').write_text('window.BG_FRAME_METRICS='+json.dumps(metrics,separators=(',',':'))+';\nwindow.BG_PANTHER_FRAMES='+json.dumps(panthers,separators=(',',':'))+';\n',encoding='utf-8')
(DEST/'audit.json').write_text(json.dumps({'heroes':audit,'panthers':panthers,'regenerated':0},indent=2))
print(json.dumps({'heroFrames':len(audit),'framesWithRemovedDebris':sum(x['removedPixels']>0 for x in audit),'removedPixels':sum(x['removedPixels'] for x in audit),'panthers':{k:len(v) for k,v in panthers.items()}}))
