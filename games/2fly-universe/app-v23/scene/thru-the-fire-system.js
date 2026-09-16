import { FlagshipSystemBase } from './flagship-system-base.js';
export class ThruTheFireSystem extends FlagshipSystemBase {
  constructor(objectData,labelContainer){super(objectData,labelContainer,{
    radius:1020, focusRadius:4600, axialTilt:0.23, rotationSpeed:0.042,
    albedo:'assets/flagship/fire_albedo.jpg', emissive:'assets/flagship/fire_emissive.jpg', roughness:'assets/flagship/fire_roughness.jpg', normal:'assets/flagship/fire_normal.jpg',
    emissiveColor:0xff5a16, emissiveIntensity:1.55, roughnessValue:0.73, metalness:0.28, normalStrength:0.82,
    lightColor:0xff6b20, rimColor:0xffc36b, lightIntensity:2.5, rimIntensity:1.35, atmosphereColor:0xff7a26, atmosphereOpacity:0.46,
    orbitColor:0xffc08a, orbitRadii:[1900,2700,3600,4550,5600], orbitSpeeds:[0.285,0.20,0.145,0.105,0.078], orbitInclination:220,
    accentHex:0xe45b28, childSize:116, labelColor:'rgba(255,216,192,.94)',
    primaryMoonIds:['FIRE-VIDEO'],
    childLabelOverrides:{'FIRE-VIDEO':'Thru the Fire Music Video'},
    moonOrbitRadius:2550, moonOrbitStep:580, minorOrbitRadius:1760, minorOrbitStep:280, systemGrooveCount:2
  });}
}
