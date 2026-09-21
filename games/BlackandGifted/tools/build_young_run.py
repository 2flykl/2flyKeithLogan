from pathlib import Path
from PIL import Image,ImageDraw
import json,shutil
root=Path(__file__).resolve().parents[1]
dest=root/'assets/character-repair-v1'
source=dest/'sources/young-run-sheet.png';source.parent.mkdir(exist_ok=True)
im=Image.open(source).convert('RGBA');print(im.size,im.getextrema()[3]);cw,ch=im.width//4,im.height//4
js=(root/'character-metrics.js').read_text();metrics=json.loads(js.split('window.BG_FRAME_METRICS=')[1].split(';')[0]);panthers=js.split(';',1)[1]
preview=Image.new('RGB',(8*150,2*200),(75,75,80))
for gender,row in [('male',0),('female',2)]:
 entries=[]
 for i in range(8):
  cell=im.crop((i%4*cw,(row+i//4)*ch,(i%4+1)*cw,(row+i//4+1)*ch));b=cell.getchannel('A').getbbox();assert b
  # Normalize to the same 512px canvas contract as all existing sprites.
  cell=cell.resize((512,512),Image.Resampling.LANCZOS);b=cell.getchannel('A').point(lambda v:255 if v>24 else 0).getbbox()
  out=dest/f'heroes/{gender}_uncrowned/run/run_{i+1:02}.png';out.parent.mkdir(exist_ok=True);cell.save(out);entries.append((out,b))
  thumb=cell.copy();thumb.thumbnail((150,190));preview.paste(thumb,(i*150,(row//2)*200),thumb)
 ref=max(b[3]-b[1] for f,b in entries)/.94
 for i,(f,b) in enumerate(entries):metrics[f.relative_to(root).as_posix()]={'height':ref,'cx':(b[0]+b[2])/2,'feet':b[3]+(10 if i%4==3 else 0)}
(root/'character-metrics.js').write_text('window.BG_FRAME_METRICS='+json.dumps(metrics,separators=(',',':'))+';'+panthers)
(root/'outputs').mkdir(exist_ok=True);preview.save(root/'outputs/young-run-cycles.png')
h=(root/'index.html').read_text(encoding='utf-8')
for g in ['male','female']:h=h.replace("run:frameSeq('"+g+"_uncrowned','walk',10)","run:frameSeq('"+g+"_uncrowned','run',8)")
h=h.replace('young:{walk:', 'young:{run:[1,2,3,4,5,6,7,8],walk:')
h=h.replace('walking=false){\n  // Complete extracted silhouettes', 'walking=false,join=1){\n  if(join<.38){drawCleanPanther(\'sit\',[4,5,6,11,12,13][Math.min(5,Math.floor(join/.38*6))],x,y,scale);return}\n  // Complete extracted silhouettes')
h=h.replace('pan.b||0,join<.35);','pan.b||0,join<.35,join);')
for name in ['index.html','BLACK_AND_GIFTED_DEMO.html']:(root/name).write_text(h,encoding='utf-8')
(dest/'sources/GENERATION.md').write_text('''# Missing run-cycle source

Built-in image generation tool; one generated sprite sheet, 16 extracted frames.
References: original male_uncrowned/walk/walk_01.png and female_uncrowned/walk/walk_01.png.
Prompt: Preserve the young black silhouettes, hair, clothing, gold boot details and female hoop. Generate a transparent 4-by-4 sheet: eight right-facing male run poses, followed by eight female poses. Alternate contact, compression, passing and flight on each leg. Keep constant limb lengths, generous margins and no crown, scepter, ground, text or new accessories.
''')
print('Added distinct 8-frame young run cycles and panther rise-to-run transition.')