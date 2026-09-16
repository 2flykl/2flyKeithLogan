import { FlagshipSystemBase } from './flagship-system-base.js';
export class StreamsSystem extends FlagshipSystemBase {
  constructor(objectData,labelContainer){super(objectData,labelContainer,{
    radius:920, focusRadius:4200, axialTilt:0.16, rotationSpeed:0.050,
    albedo:'assets/flagship/streams_albedo.jpg', emissive:'assets/flagship/streams_emissive.jpg', roughness:'assets/flagship/streams_roughness.jpg', normal:'assets/flagship/streams_normal.jpg',
    emissiveColor:0x59c7d8, emissiveIntensity:0.95, roughnessValue:0.62, metalness:0.30, normalStrength:0.72,
    lightColor:0x4fd5e7, rimColor:0xa8f4ff, lightIntensity:1.9, rimIntensity:0.9, atmosphereColor:0x55e8e8, atmosphereOpacity:0.34,
    orbitColor:0x9befff, orbitRadii:[1750,2450,3250,4150,5150], orbitSpeeds:[0.30,0.22,0.16,0.115,0.085], orbitInclination:190,
    accentHex:0x45c9df, childSize:112, labelColor:'rgba(205,244,255,.92)',
    primaryMoonIds:['STREAMS-VIDEO'],
    childLabelOverrides:{'STREAMS-VIDEO':'Streams Music Video'},
    moonOrbitRadius:2300, moonOrbitStep:520, minorOrbitRadius:1650, minorOrbitStep:250, systemGrooveCount:2
  });}
}
