from pathlib import Path
root=Path(__file__).resolve().parents[1]
required=['index.html','game-rev8.js','styles.css','assets/backgrounds/runway_final.jpg','assets/backgrounds/maze_final.jpg','assets/backgrounds/boss_final.jpg','assets/production/run_back_0.png','assets/production/run_front_0.png','assets/production/piano_drive_0.png','assets/production/aim_up_fire_0.png','assets/production/platform_0.png','assets/production/route_ramp_0.png']
missing=[x for x in required if not (root/x).exists()]
assert not missing,missing
js=(root/'game-rev8.js').read_text()
for token in ['runway_final.jpg','maze_final.jpg','boss_final.jpg','runBack','runFront','pianoDrive','aimFire','platforms','route_ramp','floorBroken','cam.tz']:
 assert token in js,token
assert 'drawCover(im(\'runway\')' in js
print('REV8 ASSET/STRUCTURE PASS',len(required),'critical assets')
