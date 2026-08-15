import json, random, math, sys
count=int(sys.argv[1]) if len(sys.argv)>1 else 20000
rng=random.Random(42)
rows=[]
for i in range(count):
    a=rng.random()*math.tau
    r=1000+12000*math.sqrt(rng.random())
    rows.append({"id":f"STRESS-{i:08d}","x":math.cos(a)*r,"y":(rng.random()-.5)*1200,"z":math.sin(a)*r})
json.dump(rows,open("stress_stars.json","w"),separators=(",",":"))
print(f"Wrote {count} stars")
