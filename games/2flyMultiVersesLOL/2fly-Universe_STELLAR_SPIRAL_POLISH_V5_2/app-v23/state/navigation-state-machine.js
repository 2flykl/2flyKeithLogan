export class NavigationStateMachine {
  constructor(){this.mode='deep-space';this.galaxyId=null;this.objectId=null;}
  setGalaxy(galaxyId){const next=galaxyId?'galaxy-residency':'deep-space';this._set(next,{galaxyId:galaxyId||null,objectId:null});}
  setPlanet(objectId,galaxyId='G2025'){this._set('planet-focus',{galaxyId,objectId});}
  setMedia(objectId,galaxyId='G2025'){this._set('media-focus',{galaxyId,objectId});}
  leavePlanet(){this._set(this.galaxyId?'galaxy-residency':'deep-space',{objectId:null});}
  _set(mode,patch={}){const changed=mode!==this.mode||('galaxyId'in patch&&patch.galaxyId!==this.galaxyId)||('objectId'in patch&&patch.objectId!==this.objectId);this.mode=mode;if('galaxyId'in patch)this.galaxyId=patch.galaxyId;if('objectId'in patch)this.objectId=patch.objectId;if(changed)window.dispatchEvent(new CustomEvent('2fly-navigation-state',{detail:this.snapshot()}));}
  snapshot(){return{mode:this.mode,galaxyId:this.galaxyId,objectId:this.objectId};}
}
