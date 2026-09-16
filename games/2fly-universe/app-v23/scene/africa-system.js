import { FlagshipSystemBase } from './flagship-system-base.js';
export class AfricaSystem extends FlagshipSystemBase {
  constructor(objectData,labelContainer){super(objectData,labelContainer,{
    radius:1120, focusRadius:5200, axialTilt:0.31, rotationSpeed:0.037,
    albedo:'assets/flagship/africa_albedo.jpg', emissive:'assets/flagship/africa_emissive.jpg', roughness:'assets/flagship/africa_roughness.jpg', normal:'assets/flagship/africa_normal.jpg',
    emissiveColor:0xe3a63b, emissiveIntensity:1.22, roughnessValue:0.68, metalness:0.22, normalStrength:0.66,
    lightColor:0xf1b84b, rimColor:0x7fd18f, lightIntensity:2.3, rimIntensity:1.1, atmosphereColor:0xd8ad55, atmosphereOpacity:0.42,
    orbitColor:0xffe0a0, orbitRadii:[2100,2900,3800,4800,5900,7050], orbitSpeeds:[0.26,0.195,0.148,0.112,0.086,0.068], orbitInclination:260,
    accentHex:0xd18c36, childSize:116, labelColor:'rgba(255,232,188,.95)',
    primaryMoonIds:['AFRICA-PLAY','AFRICA-DOC-INTRO'],
    childLabelOverrides:{'AFRICA-PLAY':'Black & Gifted Playable','AFRICA-DOC-INTRO':'The Intro'},
    moonOrbitRadius:2700, moonOrbitStep:760, minorOrbitRadius:1880, minorOrbitStep:300, systemGrooveCount:2
  });}
}
