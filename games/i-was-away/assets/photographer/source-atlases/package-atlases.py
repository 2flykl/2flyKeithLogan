from pathlib import Path
from PIL import Image, ImageDraw
import numpy as np
from scipy.ndimage import label
import json, hashlib
ROOT=Path(__file__).resolve().parent.parent
DIRS=['front','front-left','left','rear-left','back','rear-right','right','front-right']
W,H=160,224;BASELINE=212
excluded={'front-left':{5:'Camera missing from visible hand.'}, 'back':{11:'Shoes cropped in source.'},'rear-right':{11:'Shoes cropped in source.'},'right':{11:'Shoes cropped in source.'},'front-right':{7:'Camera missing from visible hand.',15:'Lower legs cropped in source.'}}
report={'runtimeTile':[W,H],'groundPivot':[80,BASELINE],'directions':{}}
for d in DIRS:
 source=ROOT/'source-atlases'/f'{d}.png';im=Image.open(source).convert('RGBA');a=np.asarray(im)[:,:,3];h,w=a.shape
 crops={};boxes={}
 for c in range(4):
  x0=round(c*w/4);x1=round((c+1)*w/4);reg=a[:,x0:x1];yes=(reg>32).sum(axis=1)>3;labs,n=label(yes)
  spans=[]
  for i in range(1,n+1):
   ys=np.where(labs==i)[0]
   if len(ys)>20:spans.append((int(ys.min()),int(ys.max()+1)))
  assert len(spans)==4,(d,c,spans)
  for r,(y0,y1) in enumerate(spans):
   # Crop only separated alpha islands. The source artwork is never synthesized or mirrored.
   y0=max(0,y0-2);y1=min(h,y1+2)
   region=im.crop((x0,y0,x1,y1));alpha=np.asarray(region)[:,:,3];ys,xs=np.where(alpha>32)
   b=(max(0,int(xs.min())-2),max(0,int(ys.min())-2),min(x1-x0,int(xs.max())+3),min(y1-y0,int(ys.max())+3))
   i=r*4+c;crops[i]=region.crop(b);boxes[i]=[x0+b[0],y0+b[1],x0+b[2],y0+b[3]]
 scale=200/float(np.median([crops[i].height for i in range(4)]))
 atlas=Image.new('RGBA',(W*4,H*4)); frames=[]
 for i,img in crops.items():
  if i in excluded.get(d,{}):continue
  s=200/img.height if i in [11,15] else scale
  size=(round(img.width*s),round(img.height*s));assert size[0]<W-8,(d,i,size)
  small=img.resize(size,Image.Resampling.LANCZOS)
  # Grounded bottom-center packing with at least 12 px top/bottom cell gutter.
  x=(W-size[0])//2;y=BASELINE-size[1]
  assert x>=4 and y>=8,(d,i,x,y)
  atlas.alpha_composite(small,(i%4*W+x,i//4*H+y))
  frames.append({'index':i,'sourceBox':boxes[i],'packedBounds':[x,y,x+size[0],y+size[1]],'sourceCell':i})
 file=d+'-compact.webp';atlas.save(ROOT/file,format='WEBP',quality=94,method=6,exact=True)
 # The QA evidence uses a warm grey backing; runtime files retain the genuine source alpha.
 bg=Image.new('RGBA',atlas.size,'#b9b3a3');bg.alpha_composite(atlas);draw=ImageDraw.Draw(bg)
 for i in range(16):
  x=i%4*W;y=i//4*H;draw.rectangle([x,y,x+W-1,y+H-1],outline='#756f61');draw.text((x+5,y+4),str(i),fill='white')
  if i in excluded.get(d,{}):draw.text((x+16,y+H//2),'EXCLUDED',fill='#522d2d')
 bg.convert('RGB').save(ROOT/'qa'/f'{d}-contact.jpg',quality=92)
 report['directions'][d]={'source':f'source-atlases/{d}.png','runtime':file,'sha256':hashlib.sha256((ROOT/file).read_bytes()).hexdigest(),'compressedBytes':(ROOT/file).stat().st_size,'decodedBytes':W*4*H*4*4,'sourceResolution':[w,h],'frames':frames,'excludedFrames':excluded.get(d,{})}
(ROOT/'qa'/'atlas-validation.json').write_text(json.dumps(report,indent=2)+'\n')
# Reviewable all-angle contact sheet for the four core states; no missing slots.
contact=Image.new('RGB',(W*8,H*4+32),'#b9b3a3');draw=ImageDraw.Draw(contact)
for c,d in enumerate(DIRS):
 atlas=Image.open(ROOT/(d+'-compact.webp')).convert('RGBA');draw.text((c*W+8,8),d,fill='#20231f')
 for r,i in enumerate([0,3,9,13]):
  frame=atlas.crop((i%4*W,i//4*H,(i%4+1)*W,(i//4+1)*H));contact.paste(frame,(c*W,r*H+32),frame)
contact.save(ROOT/'qa'/'all-directions-contact.jpg',quality=94)
print('Added compressed bytes',sum(x['compressedBytes'] for x in report['directions'].values()))
print('Decoded bytes',sum(x['decodedBytes'] for x in report['directions'].values()))
