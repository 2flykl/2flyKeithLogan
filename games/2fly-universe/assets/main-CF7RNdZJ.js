(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))i(a);new MutationObserver(a=>{for(const n of a)if(n.type==="childList")for(const s of n.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&i(s)}).observe(document,{childList:!0,subtree:!0});function t(a){const n={};return a.integrity&&(n.integrity=a.integrity),a.referrerPolicy&&(n.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?n.credentials="include":a.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function i(a){if(a.ep)return;a.ep=!0;const n=t(a);fetch(a.href,n)}})();/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Ur=2,Si=2,Wo=4,Et="srgb",ar="srgb-linear",va="linear",$e="srgb",Xn=35048,jn="300 es";class nr{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[e]===void 0&&(i[e]=[]),i[e].indexOf(t)===-1&&i[e].push(t)}hasEventListener(e,t){if(this._listeners===void 0)return!1;const i=this._listeners;return i[e]!==void 0&&i[e].indexOf(t)!==-1}removeEventListener(e,t){if(this._listeners===void 0)return;const i=this._listeners[e];if(i!==void 0){const a=i.indexOf(t);a!==-1&&i.splice(a,1)}}dispatchEvent(e){if(this._listeners===void 0)return;const t=this._listeners[e.type];if(t!==void 0){e.target=this;const i=t.slice(0);for(let a=0,n=i.length;a<n;a++)i[a].call(this,e);e.target=null}}}const _t=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let Yn=1234567;const Rr=Math.PI/180,Ir=180/Math.PI;function ei(){const r=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(_t[r&255]+_t[r>>8&255]+_t[r>>16&255]+_t[r>>24&255]+"-"+_t[e&255]+_t[e>>8&255]+"-"+_t[e>>16&15|64]+_t[e>>24&255]+"-"+_t[t&63|128]+_t[t>>8&255]+"-"+_t[t>>16&255]+_t[t>>24&255]+_t[i&255]+_t[i>>8&255]+_t[i>>16&255]+_t[i>>24&255]).toLowerCase()}function xt(r,e,t){return Math.max(e,Math.min(t,r))}function bn(r,e){return(r%e+e)%e}function Xo(r,e,t,i,a){return i+(r-e)*(a-i)/(t-e)}function jo(r,e,t){return r!==e?(t-r)/(e-r):0}function Cr(r,e,t){return(1-t)*r+t*e}function Yo(r,e,t,i){return Cr(r,e,1-Math.exp(-t*i))}function $o(r,e=1){return e-Math.abs(bn(r,e*2)-e)}function qo(r,e,t){return r<=e?0:r>=t?1:(r=(r-e)/(t-e),r*r*(3-2*r))}function Ko(r,e,t){return r<=e?0:r>=t?1:(r=(r-e)/(t-e),r*r*r*(r*(r*6-15)+10))}function Zo(r,e){return r+Math.floor(Math.random()*(e-r+1))}function Jo(r,e){return r+Math.random()*(e-r)}function Qo(r){return r*(.5-Math.random())}function el(r){r!==void 0&&(Yn=r);let e=Yn+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function tl(r){return r*Rr}function il(r){return r*Ir}function rl(r){return(r&r-1)===0&&r!==0}function al(r){return Math.pow(2,Math.ceil(Math.log(r)/Math.LN2))}function nl(r){return Math.pow(2,Math.floor(Math.log(r)/Math.LN2))}function sl(r,e,t,i,a){const n=Math.cos,s=Math.sin,o=n(t/2),l=s(t/2),c=n((e+i)/2),h=s((e+i)/2),d=n((e-i)/2),u=s((e-i)/2),f=n((i-e)/2),g=s((i-e)/2);switch(a){case"XYX":r.set(o*h,l*d,l*u,o*c);break;case"YZY":r.set(l*u,o*h,l*d,o*c);break;case"ZXZ":r.set(l*d,l*u,o*h,o*c);break;case"XZX":r.set(o*h,l*g,l*f,o*c);break;case"YXY":r.set(l*f,o*h,l*g,o*c);break;case"ZYZ":r.set(l*g,l*f,o*h,o*c);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+a)}}function Ht(r,e){switch(e.constructor){case Float32Array:return r;case Uint32Array:return r/4294967295;case Uint16Array:return r/65535;case Uint8Array:return r/255;case Int32Array:return Math.max(r/2147483647,-1);case Int16Array:return Math.max(r/32767,-1);case Int8Array:return Math.max(r/127,-1);default:throw new Error("Invalid component type.")}}function Ye(r,e){switch(e.constructor){case Float32Array:return r;case Uint32Array:return Math.round(r*4294967295);case Uint16Array:return Math.round(r*65535);case Uint8Array:return Math.round(r*255);case Int32Array:return Math.round(r*2147483647);case Int16Array:return Math.round(r*32767);case Int8Array:return Math.round(r*127);default:throw new Error("Invalid component type.")}}const ba={DEG2RAD:Rr,RAD2DEG:Ir,generateUUID:ei,clamp:xt,euclideanModulo:bn,mapLinear:Xo,inverseLerp:jo,lerp:Cr,damp:Yo,pingpong:$o,smoothstep:qo,smootherstep:Ko,randInt:Zo,randFloat:Jo,randFloatSpread:Qo,seededRandom:el,degToRad:tl,radToDeg:il,isPowerOfTwo:rl,ceilPowerOfTwo:al,floorPowerOfTwo:nl,setQuaternionFromProperEuler:sl,normalize:Ye,denormalize:Ht};let Ie=class co{constructor(e=0,t=0){co.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,i=this.y,a=e.elements;return this.x=a[0]*t+a[3]*i+a[6],this.y=a[1]*t+a[4]*i+a[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(e,Math.min(t,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(xt(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y;return t*t+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const i=Math.cos(t),a=Math.sin(t),n=this.x-e.x,s=this.y-e.y;return this.x=n*i-s*a+e.x,this.y=n*a+s*i+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}};class De{constructor(e,t,i,a,n,s,o,l,c){De.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,i,a,n,s,o,l,c)}set(e,t,i,a,n,s,o,l,c){const h=this.elements;return h[0]=e,h[1]=a,h[2]=o,h[3]=t,h[4]=n,h[5]=l,h[6]=i,h[7]=s,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],this}extractBasis(e,t,i){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,a=t.elements,n=this.elements,s=i[0],o=i[3],l=i[6],c=i[1],h=i[4],d=i[7],u=i[2],f=i[5],g=i[8],_=a[0],m=a[3],p=a[6],S=a[1],E=a[4],M=a[7],N=a[2],A=a[5],w=a[8];return n[0]=s*_+o*S+l*N,n[3]=s*m+o*E+l*A,n[6]=s*p+o*M+l*w,n[1]=c*_+h*S+d*N,n[4]=c*m+h*E+d*A,n[7]=c*p+h*M+d*w,n[2]=u*_+f*S+g*N,n[5]=u*m+f*E+g*A,n[8]=u*p+f*M+g*w,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[1],a=e[2],n=e[3],s=e[4],o=e[5],l=e[6],c=e[7],h=e[8];return t*s*h-t*o*c-i*n*h+i*o*l+a*n*c-a*s*l}invert(){const e=this.elements,t=e[0],i=e[1],a=e[2],n=e[3],s=e[4],o=e[5],l=e[6],c=e[7],h=e[8],d=h*s-o*c,u=o*l-h*n,f=c*n-s*l,g=t*d+i*u+a*f;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const _=1/g;return e[0]=d*_,e[1]=(a*c-h*i)*_,e[2]=(o*i-a*s)*_,e[3]=u*_,e[4]=(h*t-a*l)*_,e[5]=(a*n-o*t)*_,e[6]=f*_,e[7]=(i*l-c*t)*_,e[8]=(s*t-i*n)*_,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,i,a,n,s,o){const l=Math.cos(n),c=Math.sin(n);return this.set(i*l,i*c,-i*(l*s+c*o)+s+e,-a*c,a*l,-a*(-c*s+l*o)+o+t,0,0,1),this}scale(e,t){return this.premultiply(Sa.makeScale(e,t)),this}rotate(e){return this.premultiply(Sa.makeRotation(-e)),this}translate(e,t){return this.premultiply(Sa.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,i,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,i=e.elements;for(let a=0;a<9;a++)if(t[a]!==i[a])return!1;return!0}fromArray(e,t=0){for(let i=0;i<9;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const Sa=new De;function ho(r){for(let e=r.length-1;e>=0;--e)if(r[e]>=65535)return!0;return!1}function Lr(r){return document.createElementNS("http://www.w3.org/1999/xhtml",r)}function ol(){const r=Lr("canvas");return r.style.display="block",r}const $n={};function Tr(r){r in $n||($n[r]=!0,console.warn(r))}function ll(r,e,t){return new Promise(function(i,a){function n(){switch(r.clientWaitSync(e,r.SYNC_FLUSH_COMMANDS_BIT,0)){case r.WAIT_FAILED:a();break;case r.TIMEOUT_EXPIRED:setTimeout(n,t);break;default:i()}}setTimeout(n,t)})}function cl(r){const e=r.elements;e[2]=.5*e[2]+.5*e[3],e[6]=.5*e[6]+.5*e[7],e[10]=.5*e[10]+.5*e[11],e[14]=.5*e[14]+.5*e[15]}function hl(r){const e=r.elements;e[11]===-1?(e[10]=-e[10]-1,e[14]=-e[14]):(e[10]=-e[10],e[14]=-e[14]+1)}const Ge={enabled:!0,workingColorSpace:ar,spaces:{},convert:function(r,e,t){return this.enabled===!1||e===t||!e||!t||(this.spaces[e].transfer===$e&&(r.r=ti(r.r),r.g=ti(r.g),r.b=ti(r.b)),this.spaces[e].primaries!==this.spaces[t].primaries&&(r.applyMatrix3(this.spaces[e].toXYZ),r.applyMatrix3(this.spaces[t].fromXYZ)),this.spaces[t].transfer===$e&&(r.r=tr(r.r),r.g=tr(r.g),r.b=tr(r.b))),r},fromWorkingColorSpace:function(r,e){return this.convert(r,this.workingColorSpace,e)},toWorkingColorSpace:function(r,e){return this.convert(r,e,this.workingColorSpace)},getPrimaries:function(r){return this.spaces[r].primaries},getTransfer:function(r){return r===""?va:this.spaces[r].transfer},getLuminanceCoefficients:function(r,e=this.workingColorSpace){return r.fromArray(this.spaces[e].luminanceCoefficients)},define:function(r){Object.assign(this.spaces,r)},_getMatrix:function(r,e,t){return r.copy(this.spaces[e].toXYZ).multiply(this.spaces[t].fromXYZ)},_getDrawingBufferColorSpace:function(r){return this.spaces[r].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(r=this.workingColorSpace){return this.spaces[r].workingColorSpaceConfig.unpackColorSpace}};function ti(r){return r<.04045?r*.0773993808:Math.pow(r*.9478672986+.0521327014,2.4)}function tr(r){return r<.0031308?r*12.92:1.055*Math.pow(r,.41666)-.055}const qn=[.64,.33,.3,.6,.15,.06],Kn=[.2126,.7152,.0722],Zn=[.3127,.329],Jn=new De().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Qn=new De().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);Ge.define({[ar]:{primaries:qn,whitePoint:Zn,transfer:va,toXYZ:Jn,fromXYZ:Qn,luminanceCoefficients:Kn,workingColorSpaceConfig:{unpackColorSpace:Et},outputColorSpaceConfig:{drawingBufferColorSpace:Et}},[Et]:{primaries:qn,whitePoint:Zn,transfer:$e,toXYZ:Jn,fromXYZ:Qn,luminanceCoefficients:Kn,outputColorSpaceConfig:{drawingBufferColorSpace:Et}}});let Di;class ul{static getDataURL(e){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let t;if(e instanceof HTMLCanvasElement)t=e;else{Di===void 0&&(Di=Lr("canvas")),Di.width=e.width,Di.height=e.height;const i=Di.getContext("2d");e instanceof ImageData?i.putImageData(e,0,0):i.drawImage(e,0,0,e.width,e.height),t=Di}return t.width>2048||t.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",e),t.toDataURL("image/jpeg",.6)):t.toDataURL("image/png")}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=Lr("canvas");t.width=e.width,t.height=e.height;const i=t.getContext("2d");i.drawImage(e,0,0,e.width,e.height);const a=i.getImageData(0,0,e.width,e.height),n=a.data;for(let s=0;s<n.length;s++)n[s]=ti(n[s]/255)*255;return i.putImageData(a,0,0),t}else if(e.data){const t=e.data.slice(0);for(let i=0;i<t.length;i++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[i]=Math.floor(ti(t[i]/255)*255):t[i]=ti(t[i]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let dl=0;class uo{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:dl++}),this.uuid=ei(),this.data=e,this.dataReady=!0,this.version=0}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const i={uuid:this.uuid,url:""},a=this.data;if(a!==null){let n;if(Array.isArray(a)){n=[];for(let s=0,o=a.length;s<o;s++)a[s].isDataTexture?n.push(Ea(a[s].image)):n.push(Ea(a[s]))}else n=Ea(a);i.url=n}return t||(e.images[this.uuid]=i),i}}function Ea(r){return typeof HTMLImageElement<"u"&&r instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&r instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&r instanceof ImageBitmap?ul.getDataURL(r):r.data?{data:Array.from(r.data),width:r.width,height:r.height,type:r.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let pl=0;class yt extends nr{constructor(e=yt.DEFAULT_IMAGE,t=yt.DEFAULT_MAPPING,i=1001,a=1001,n=1006,s=1008,o=1023,l=1009,c=yt.DEFAULT_ANISOTROPY,h=""){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:pl++}),this.uuid=ei(),this.name="",this.source=new uo(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=i,this.wrapT=a,this.magFilter=n,this.minFilter=s,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new Ie(0,0),this.repeat=new Ie(1,1),this.center=new Ie(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new De,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const i={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),t||(e.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==300)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case 1e3:e.x=e.x-Math.floor(e.x);break;case 1001:e.x=e.x<0?0:1;break;case 1002:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case 1e3:e.y=e.y-Math.floor(e.y);break;case 1001:e.y=e.y<0?0:1;break;case 1002:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}yt.DEFAULT_IMAGE=null;yt.DEFAULT_MAPPING=300;yt.DEFAULT_ANISOTROPY=1;let Ke=class po{constructor(e=0,t=0,i=0,a=1){po.prototype.isVector4=!0,this.x=e,this.y=t,this.z=i,this.w=a}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,i,a){return this.x=e,this.y=t,this.z=i,this.w=a,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,i=this.y,a=this.z,n=this.w,s=e.elements;return this.x=s[0]*t+s[4]*i+s[8]*a+s[12]*n,this.y=s[1]*t+s[5]*i+s[9]*a+s[13]*n,this.z=s[2]*t+s[6]*i+s[10]*a+s[14]*n,this.w=s[3]*t+s[7]*i+s[11]*a+s[15]*n,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,i,a,n;const s=e.elements,o=s[0],l=s[4],c=s[8],h=s[1],d=s[5],u=s[9],f=s[2],g=s[6],_=s[10];if(Math.abs(l-h)<.01&&Math.abs(c-f)<.01&&Math.abs(u-g)<.01){if(Math.abs(l+h)<.1&&Math.abs(c+f)<.1&&Math.abs(u+g)<.1&&Math.abs(o+d+_-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const p=(o+1)/2,S=(d+1)/2,E=(_+1)/2,M=(l+h)/4,N=(c+f)/4,A=(u+g)/4;return p>S&&p>E?p<.01?(i=0,a=.707106781,n=.707106781):(i=Math.sqrt(p),a=M/i,n=N/i):S>E?S<.01?(i=.707106781,a=0,n=.707106781):(a=Math.sqrt(S),i=M/a,n=A/a):E<.01?(i=.707106781,a=.707106781,n=0):(n=Math.sqrt(E),i=N/n,a=A/n),this.set(i,a,n,t),this}let m=Math.sqrt((g-u)*(g-u)+(c-f)*(c-f)+(h-l)*(h-l));return Math.abs(m)<.001&&(m=1),this.x=(g-u)/m,this.y=(c-f)/m,this.z=(h-l)/m,this.w=Math.acos((o+d+_-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this.w=Math.max(e.w,Math.min(t.w,this.w)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this.w=Math.max(e,Math.min(t,this.w)),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(e,Math.min(t,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this.w=e.w+(t.w-e.w)*i,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}};class fl extends nr{constructor(e=1,t=1,i={}){super(),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=1,this.scissor=new Ke(0,0,e,t),this.scissorTest=!1,this.viewport=new Ke(0,0,e,t);const a={width:e,height:t,depth:1};i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:1006,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},i);const n=new yt(a,i.mapping,i.wrapS,i.wrapT,i.magFilter,i.minFilter,i.format,i.type,i.anisotropy,i.colorSpace);n.flipY=!1,n.generateMipmaps=i.generateMipmaps,n.internalFormat=i.internalFormat,this.textures=[];const s=i.count;for(let o=0;o<s;o++)this.textures[o]=n.clone(),this.textures[o].isRenderTargetTexture=!0;this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this.depthTexture=i.depthTexture,this.samples=i.samples}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}setSize(e,t,i=1){if(this.width!==e||this.height!==t||this.depth!==i){this.width=e,this.height=t,this.depth=i;for(let a=0,n=this.textures.length;a<n;a++)this.textures[a].image.width=e,this.textures[a].image.height=t,this.textures[a].image.depth=i;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let i=0,a=e.textures.length;i<a;i++)this.textures[i]=e.textures[i].clone(),this.textures[i].isRenderTargetTexture=!0;const t=Object.assign({},e.texture.image);return this.texture.source=new uo(t),this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Ei extends fl{constructor(e=1,t=1,i={}){super(e,t,i),this.isWebGLRenderTarget=!0}}class fo extends yt{constructor(e=null,t=1,i=1,a=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:i,depth:a},this.magFilter=1003,this.minFilter=1003,this.wrapR=1001,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class ml extends yt{constructor(e=null,t=1,i=1,a=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:i,depth:a},this.magFilter=1003,this.minFilter=1003,this.wrapR=1001,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}let Nr=class{constructor(e=0,t=0,i=0,a=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=i,this._w=a}static slerpFlat(e,t,i,a,n,s,o){let l=i[a+0],c=i[a+1],h=i[a+2],d=i[a+3];const u=n[s+0],f=n[s+1],g=n[s+2],_=n[s+3];if(o===0){e[t+0]=l,e[t+1]=c,e[t+2]=h,e[t+3]=d;return}if(o===1){e[t+0]=u,e[t+1]=f,e[t+2]=g,e[t+3]=_;return}if(d!==_||l!==u||c!==f||h!==g){let m=1-o;const p=l*u+c*f+h*g+d*_,S=p>=0?1:-1,E=1-p*p;if(E>Number.EPSILON){const N=Math.sqrt(E),A=Math.atan2(N,p*S);m=Math.sin(m*A)/N,o=Math.sin(o*A)/N}const M=o*S;if(l=l*m+u*M,c=c*m+f*M,h=h*m+g*M,d=d*m+_*M,m===1-o){const N=1/Math.sqrt(l*l+c*c+h*h+d*d);l*=N,c*=N,h*=N,d*=N}}e[t]=l,e[t+1]=c,e[t+2]=h,e[t+3]=d}static multiplyQuaternionsFlat(e,t,i,a,n,s){const o=i[a],l=i[a+1],c=i[a+2],h=i[a+3],d=n[s],u=n[s+1],f=n[s+2],g=n[s+3];return e[t]=o*g+h*d+l*f-c*u,e[t+1]=l*g+h*u+c*d-o*f,e[t+2]=c*g+h*f+o*u-l*d,e[t+3]=h*g-o*d-l*u-c*f,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,i,a){return this._x=e,this._y=t,this._z=i,this._w=a,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const i=e._x,a=e._y,n=e._z,s=e._order,o=Math.cos,l=Math.sin,c=o(i/2),h=o(a/2),d=o(n/2),u=l(i/2),f=l(a/2),g=l(n/2);switch(s){case"XYZ":this._x=u*h*d+c*f*g,this._y=c*f*d-u*h*g,this._z=c*h*g+u*f*d,this._w=c*h*d-u*f*g;break;case"YXZ":this._x=u*h*d+c*f*g,this._y=c*f*d-u*h*g,this._z=c*h*g-u*f*d,this._w=c*h*d+u*f*g;break;case"ZXY":this._x=u*h*d-c*f*g,this._y=c*f*d+u*h*g,this._z=c*h*g+u*f*d,this._w=c*h*d-u*f*g;break;case"ZYX":this._x=u*h*d-c*f*g,this._y=c*f*d+u*h*g,this._z=c*h*g-u*f*d,this._w=c*h*d+u*f*g;break;case"YZX":this._x=u*h*d+c*f*g,this._y=c*f*d+u*h*g,this._z=c*h*g-u*f*d,this._w=c*h*d-u*f*g;break;case"XZY":this._x=u*h*d-c*f*g,this._y=c*f*d-u*h*g,this._z=c*h*g+u*f*d,this._w=c*h*d+u*f*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+s)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const i=t/2,a=Math.sin(i);return this._x=e.x*a,this._y=e.y*a,this._z=e.z*a,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,i=t[0],a=t[4],n=t[8],s=t[1],o=t[5],l=t[9],c=t[2],h=t[6],d=t[10],u=i+o+d;if(u>0){const f=.5/Math.sqrt(u+1);this._w=.25/f,this._x=(h-l)*f,this._y=(n-c)*f,this._z=(s-a)*f}else if(i>o&&i>d){const f=2*Math.sqrt(1+i-o-d);this._w=(h-l)/f,this._x=.25*f,this._y=(a+s)/f,this._z=(n+c)/f}else if(o>d){const f=2*Math.sqrt(1+o-i-d);this._w=(n-c)/f,this._x=(a+s)/f,this._y=.25*f,this._z=(l+h)/f}else{const f=2*Math.sqrt(1+d-i-o);this._w=(s-a)/f,this._x=(n+c)/f,this._y=(l+h)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let i=e.dot(t)+1;return i<Number.EPSILON?(i=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=i):(this._x=0,this._y=-e.z,this._z=e.y,this._w=i)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=i),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(xt(this.dot(e),-1,1)))}rotateTowards(e,t){const i=this.angleTo(e);if(i===0)return this;const a=Math.min(1,t/i);return this.slerp(e,a),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const i=e._x,a=e._y,n=e._z,s=e._w,o=t._x,l=t._y,c=t._z,h=t._w;return this._x=i*h+s*o+a*c-n*l,this._y=a*h+s*l+n*o-i*c,this._z=n*h+s*c+i*l-a*o,this._w=s*h-i*o-a*l-n*c,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);const i=this._x,a=this._y,n=this._z,s=this._w;let o=s*e._w+i*e._x+a*e._y+n*e._z;if(o<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,o=-o):this.copy(e),o>=1)return this._w=s,this._x=i,this._y=a,this._z=n,this;const l=1-o*o;if(l<=Number.EPSILON){const f=1-t;return this._w=f*s+t*this._w,this._x=f*i+t*this._x,this._y=f*a+t*this._y,this._z=f*n+t*this._z,this.normalize(),this}const c=Math.sqrt(l),h=Math.atan2(c,o),d=Math.sin((1-t)*h)/c,u=Math.sin(t*h)/c;return this._w=s*d+this._w*u,this._x=i*d+this._x*u,this._y=a*d+this._y*u,this._z=n*d+this._z*u,this._onChangeCallback(),this}slerpQuaternions(e,t,i){return this.copy(e).slerp(t,i)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),i=Math.random(),a=Math.sqrt(1-i),n=Math.sqrt(i);return this.set(a*Math.sin(e),a*Math.cos(e),n*Math.sin(t),n*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}};class R{constructor(e=0,t=0,i=0){R.prototype.isVector3=!0,this.x=e,this.y=t,this.z=i}set(e,t,i){return i===void 0&&(i=this.z),this.x=e,this.y=t,this.z=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(es.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(es.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,i=this.y,a=this.z,n=e.elements;return this.x=n[0]*t+n[3]*i+n[6]*a,this.y=n[1]*t+n[4]*i+n[7]*a,this.z=n[2]*t+n[5]*i+n[8]*a,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,i=this.y,a=this.z,n=e.elements,s=1/(n[3]*t+n[7]*i+n[11]*a+n[15]);return this.x=(n[0]*t+n[4]*i+n[8]*a+n[12])*s,this.y=(n[1]*t+n[5]*i+n[9]*a+n[13])*s,this.z=(n[2]*t+n[6]*i+n[10]*a+n[14])*s,this}applyQuaternion(e){const t=this.x,i=this.y,a=this.z,n=e.x,s=e.y,o=e.z,l=e.w,c=2*(s*a-o*i),h=2*(o*t-n*a),d=2*(n*i-s*t);return this.x=t+l*c+s*d-o*h,this.y=i+l*h+o*c-n*d,this.z=a+l*d+n*h-s*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,i=this.y,a=this.z,n=e.elements;return this.x=n[0]*t+n[4]*i+n[8]*a,this.y=n[1]*t+n[5]*i+n[9]*a,this.z=n[2]*t+n[6]*i+n[10]*a,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(e,Math.min(t,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const i=e.x,a=e.y,n=e.z,s=t.x,o=t.y,l=t.z;return this.x=a*l-n*o,this.y=n*s-i*l,this.z=i*o-a*s,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const i=e.dot(this)/t;return this.copy(e).multiplyScalar(i)}projectOnPlane(e){return Ta.copy(this).projectOnVector(e),this.sub(Ta)}reflect(e){return this.sub(Ta.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(xt(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y,a=this.z-e.z;return t*t+i*i+a*a}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,i){const a=Math.sin(t)*e;return this.x=a*Math.sin(i),this.y=Math.cos(t)*e,this.z=a*Math.cos(i),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,i){return this.x=e*Math.sin(t),this.y=i,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),i=this.setFromMatrixColumn(e,1).length(),a=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=i,this.z=a,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,i=Math.sqrt(1-t*t);return this.x=i*Math.cos(e),this.y=t,this.z=i*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Ta=new R,es=new Nr;class Ai{constructor(e=new R(1/0,1/0,1/0),t=new R(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t+=3)this.expandByPoint(Ft.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,i=e.count;t<i;t++)this.expandByPoint(Ft.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const i=Ft.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const i=e.geometry;if(i!==void 0){const n=i.getAttribute("position");if(t===!0&&n!==void 0&&e.isInstancedMesh!==!0)for(let s=0,o=n.count;s<o;s++)e.isMesh===!0?e.getVertexPosition(s,Ft):Ft.fromBufferAttribute(n,s),Ft.applyMatrix4(e.matrixWorld),this.expandByPoint(Ft);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),kr.copy(e.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),kr.copy(i.boundingBox)),kr.applyMatrix4(e.matrixWorld),this.union(kr)}const a=e.children;for(let n=0,s=a.length;n<s;n++)this.expandByObject(a[n],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,Ft),Ft.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,i;return e.normal.x>0?(t=e.normal.x*this.min.x,i=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,i=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,i+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,i+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,i+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,i+=e.normal.z*this.min.z),t<=-e.constant&&i>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(pr),Hr.subVectors(this.max,pr),Ui.subVectors(e.a,pr),Ni.subVectors(e.b,pr),Oi.subVectors(e.c,pr),ri.subVectors(Ni,Ui),ai.subVectors(Oi,Ni),fi.subVectors(Ui,Oi);let t=[0,-ri.z,ri.y,0,-ai.z,ai.y,0,-fi.z,fi.y,ri.z,0,-ri.x,ai.z,0,-ai.x,fi.z,0,-fi.x,-ri.y,ri.x,0,-ai.y,ai.x,0,-fi.y,fi.x,0];return!wa(t,Ui,Ni,Oi,Hr)||(t=[1,0,0,0,1,0,0,0,1],!wa(t,Ui,Ni,Oi,Hr))?!1:(Gr.crossVectors(ri,ai),t=[Gr.x,Gr.y,Gr.z],wa(t,Ui,Ni,Oi,Hr))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Ft).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(Ft).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(qt[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),qt[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),qt[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),qt[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),qt[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),qt[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),qt[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),qt[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(qt),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}}const qt=[new R,new R,new R,new R,new R,new R,new R,new R],Ft=new R,kr=new Ai,Ui=new R,Ni=new R,Oi=new R,ri=new R,ai=new R,fi=new R,pr=new R,Hr=new R,Gr=new R,mi=new R;function wa(r,e,t,i,a){for(let n=0,s=r.length-3;n<=s;n+=3){mi.fromArray(r,n);const o=a.x*Math.abs(mi.x)+a.y*Math.abs(mi.y)+a.z*Math.abs(mi.z),l=e.dot(mi),c=t.dot(mi),h=i.dot(mi);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>o)return!1}return!0}const gl=new Ai,fr=new R,Aa=new R;class sr{constructor(e=new R,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const i=this.center;t!==void 0?i.copy(t):gl.setFromPoints(e).getCenter(i);let a=0;for(let n=0,s=e.length;n<s;n++)a=Math.max(a,i.distanceToSquared(e[n]));return this.radius=Math.sqrt(a),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const i=this.center.distanceToSquared(e);return t.copy(e),i>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;fr.subVectors(e,this.center);const t=fr.lengthSq();if(t>this.radius*this.radius){const i=Math.sqrt(t),a=(i-this.radius)*.5;this.center.addScaledVector(fr,a/i),this.radius+=a}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Aa.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(fr.copy(e.center).add(Aa)),this.expandByPoint(fr.copy(e.center).sub(Aa))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}}const Kt=new R,Ra=new R,Vr=new R,ni=new R,Ca=new R,Wr=new R,Pa=new R;class Sn{constructor(e=new R,t=new R(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Kt)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const i=t.dot(this.direction);return i<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=Kt.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Kt.copy(this.origin).addScaledVector(this.direction,t),Kt.distanceToSquared(e))}distanceSqToSegment(e,t,i,a){Ra.copy(e).add(t).multiplyScalar(.5),Vr.copy(t).sub(e).normalize(),ni.copy(this.origin).sub(Ra);const n=e.distanceTo(t)*.5,s=-this.direction.dot(Vr),o=ni.dot(this.direction),l=-ni.dot(Vr),c=ni.lengthSq(),h=Math.abs(1-s*s);let d,u,f,g;if(h>0)if(d=s*l-o,u=s*o-l,g=n*h,d>=0)if(u>=-g)if(u<=g){const _=1/h;d*=_,u*=_,f=d*(d+s*u+2*o)+u*(s*d+u+2*l)+c}else u=n,d=Math.max(0,-(s*u+o)),f=-d*d+u*(u+2*l)+c;else u=-n,d=Math.max(0,-(s*u+o)),f=-d*d+u*(u+2*l)+c;else u<=-g?(d=Math.max(0,-(-s*n+o)),u=d>0?-n:Math.min(Math.max(-n,-l),n),f=-d*d+u*(u+2*l)+c):u<=g?(d=0,u=Math.min(Math.max(-n,-l),n),f=u*(u+2*l)+c):(d=Math.max(0,-(s*n+o)),u=d>0?n:Math.min(Math.max(-n,-l),n),f=-d*d+u*(u+2*l)+c);else u=s>0?-n:n,d=Math.max(0,-(s*u+o)),f=-d*d+u*(u+2*l)+c;return i&&i.copy(this.origin).addScaledVector(this.direction,d),a&&a.copy(Ra).addScaledVector(Vr,u),f}intersectSphere(e,t){Kt.subVectors(e.center,this.origin);const i=Kt.dot(this.direction),a=Kt.dot(Kt)-i*i,n=e.radius*e.radius;if(a>n)return null;const s=Math.sqrt(n-a),o=i-s,l=i+s;return l<0?null:o<0?this.at(l,t):this.at(o,t)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(e.normal)+e.constant)/t;return i>=0?i:null}intersectPlane(e,t){const i=this.distanceToPlane(e);return i===null?null:this.at(i,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let i,a,n,s,o,l;const c=1/this.direction.x,h=1/this.direction.y,d=1/this.direction.z,u=this.origin;return c>=0?(i=(e.min.x-u.x)*c,a=(e.max.x-u.x)*c):(i=(e.max.x-u.x)*c,a=(e.min.x-u.x)*c),h>=0?(n=(e.min.y-u.y)*h,s=(e.max.y-u.y)*h):(n=(e.max.y-u.y)*h,s=(e.min.y-u.y)*h),i>s||n>a||((n>i||isNaN(i))&&(i=n),(s<a||isNaN(a))&&(a=s),d>=0?(o=(e.min.z-u.z)*d,l=(e.max.z-u.z)*d):(o=(e.max.z-u.z)*d,l=(e.min.z-u.z)*d),i>l||o>a)||((o>i||i!==i)&&(i=o),(l<a||a!==a)&&(a=l),a<0)?null:this.at(i>=0?i:a,t)}intersectsBox(e){return this.intersectBox(e,Kt)!==null}intersectTriangle(e,t,i,a,n){Ca.subVectors(t,e),Wr.subVectors(i,e),Pa.crossVectors(Ca,Wr);let s=this.direction.dot(Pa),o;if(s>0){if(a)return null;o=1}else if(s<0)o=-1,s=-s;else return null;ni.subVectors(this.origin,e);const l=o*this.direction.dot(Wr.crossVectors(ni,Wr));if(l<0)return null;const c=o*this.direction.dot(Ca.cross(ni));if(c<0||l+c>s)return null;const h=-o*ni.dot(Pa);return h<0?null:this.at(h/s,n)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}let Je=class hn{constructor(e,t,i,a,n,s,o,l,c,h,d,u,f,g,_,m){hn.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,i,a,n,s,o,l,c,h,d,u,f,g,_,m)}set(e,t,i,a,n,s,o,l,c,h,d,u,f,g,_,m){const p=this.elements;return p[0]=e,p[4]=t,p[8]=i,p[12]=a,p[1]=n,p[5]=s,p[9]=o,p[13]=l,p[2]=c,p[6]=h,p[10]=d,p[14]=u,p[3]=f,p[7]=g,p[11]=_,p[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new hn().fromArray(this.elements)}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],t[9]=i[9],t[10]=i[10],t[11]=i[11],t[12]=i[12],t[13]=i[13],t[14]=i[14],t[15]=i[15],this}copyPosition(e){const t=this.elements,i=e.elements;return t[12]=i[12],t[13]=i[13],t[14]=i[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,i){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this}makeBasis(e,t,i){return this.set(e.x,t.x,i.x,0,e.y,t.y,i.y,0,e.z,t.z,i.z,0,0,0,0,1),this}extractRotation(e){const t=this.elements,i=e.elements,a=1/Fi.setFromMatrixColumn(e,0).length(),n=1/Fi.setFromMatrixColumn(e,1).length(),s=1/Fi.setFromMatrixColumn(e,2).length();return t[0]=i[0]*a,t[1]=i[1]*a,t[2]=i[2]*a,t[3]=0,t[4]=i[4]*n,t[5]=i[5]*n,t[6]=i[6]*n,t[7]=0,t[8]=i[8]*s,t[9]=i[9]*s,t[10]=i[10]*s,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,i=e.x,a=e.y,n=e.z,s=Math.cos(i),o=Math.sin(i),l=Math.cos(a),c=Math.sin(a),h=Math.cos(n),d=Math.sin(n);if(e.order==="XYZ"){const u=s*h,f=s*d,g=o*h,_=o*d;t[0]=l*h,t[4]=-l*d,t[8]=c,t[1]=f+g*c,t[5]=u-_*c,t[9]=-o*l,t[2]=_-u*c,t[6]=g+f*c,t[10]=s*l}else if(e.order==="YXZ"){const u=l*h,f=l*d,g=c*h,_=c*d;t[0]=u+_*o,t[4]=g*o-f,t[8]=s*c,t[1]=s*d,t[5]=s*h,t[9]=-o,t[2]=f*o-g,t[6]=_+u*o,t[10]=s*l}else if(e.order==="ZXY"){const u=l*h,f=l*d,g=c*h,_=c*d;t[0]=u-_*o,t[4]=-s*d,t[8]=g+f*o,t[1]=f+g*o,t[5]=s*h,t[9]=_-u*o,t[2]=-s*c,t[6]=o,t[10]=s*l}else if(e.order==="ZYX"){const u=s*h,f=s*d,g=o*h,_=o*d;t[0]=l*h,t[4]=g*c-f,t[8]=u*c+_,t[1]=l*d,t[5]=_*c+u,t[9]=f*c-g,t[2]=-c,t[6]=o*l,t[10]=s*l}else if(e.order==="YZX"){const u=s*l,f=s*c,g=o*l,_=o*c;t[0]=l*h,t[4]=_-u*d,t[8]=g*d+f,t[1]=d,t[5]=s*h,t[9]=-o*h,t[2]=-c*h,t[6]=f*d+g,t[10]=u-_*d}else if(e.order==="XZY"){const u=s*l,f=s*c,g=o*l,_=o*c;t[0]=l*h,t[4]=-d,t[8]=c*h,t[1]=u*d+_,t[5]=s*h,t[9]=f*d-g,t[2]=g*d-f,t[6]=o*h,t[10]=_*d+u}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(_l,e,vl)}lookAt(e,t,i){const a=this.elements;return At.subVectors(e,t),At.lengthSq()===0&&(At.z=1),At.normalize(),si.crossVectors(i,At),si.lengthSq()===0&&(Math.abs(i.z)===1?At.x+=1e-4:At.z+=1e-4,At.normalize(),si.crossVectors(i,At)),si.normalize(),Xr.crossVectors(At,si),a[0]=si.x,a[4]=Xr.x,a[8]=At.x,a[1]=si.y,a[5]=Xr.y,a[9]=At.y,a[2]=si.z,a[6]=Xr.z,a[10]=At.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,a=t.elements,n=this.elements,s=i[0],o=i[4],l=i[8],c=i[12],h=i[1],d=i[5],u=i[9],f=i[13],g=i[2],_=i[6],m=i[10],p=i[14],S=i[3],E=i[7],M=i[11],N=i[15],A=a[0],w=a[4],P=a[8],b=a[12],x=a[1],C=a[5],F=a[9],k=a[13],X=a[2],K=a[6],j=a[10],ee=a[14],W=a[3],ae=a[7],pe=a[11],Ae=a[15];return n[0]=s*A+o*x+l*X+c*W,n[4]=s*w+o*C+l*K+c*ae,n[8]=s*P+o*F+l*j+c*pe,n[12]=s*b+o*k+l*ee+c*Ae,n[1]=h*A+d*x+u*X+f*W,n[5]=h*w+d*C+u*K+f*ae,n[9]=h*P+d*F+u*j+f*pe,n[13]=h*b+d*k+u*ee+f*Ae,n[2]=g*A+_*x+m*X+p*W,n[6]=g*w+_*C+m*K+p*ae,n[10]=g*P+_*F+m*j+p*pe,n[14]=g*b+_*k+m*ee+p*Ae,n[3]=S*A+E*x+M*X+N*W,n[7]=S*w+E*C+M*K+N*ae,n[11]=S*P+E*F+M*j+N*pe,n[15]=S*b+E*k+M*ee+N*Ae,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[4],a=e[8],n=e[12],s=e[1],o=e[5],l=e[9],c=e[13],h=e[2],d=e[6],u=e[10],f=e[14],g=e[3],_=e[7],m=e[11],p=e[15];return g*(+n*l*d-a*c*d-n*o*u+i*c*u+a*o*f-i*l*f)+_*(+t*l*f-t*c*u+n*s*u-a*s*f+a*c*h-n*l*h)+m*(+t*c*d-t*o*f-n*s*d+i*s*f+n*o*h-i*c*h)+p*(-a*o*h-t*l*d+t*o*u+a*s*d-i*s*u+i*l*h)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,i){const a=this.elements;return e.isVector3?(a[12]=e.x,a[13]=e.y,a[14]=e.z):(a[12]=e,a[13]=t,a[14]=i),this}invert(){const e=this.elements,t=e[0],i=e[1],a=e[2],n=e[3],s=e[4],o=e[5],l=e[6],c=e[7],h=e[8],d=e[9],u=e[10],f=e[11],g=e[12],_=e[13],m=e[14],p=e[15],S=d*m*c-_*u*c+_*l*f-o*m*f-d*l*p+o*u*p,E=g*u*c-h*m*c-g*l*f+s*m*f+h*l*p-s*u*p,M=h*_*c-g*d*c+g*o*f-s*_*f-h*o*p+s*d*p,N=g*d*l-h*_*l-g*o*u+s*_*u+h*o*m-s*d*m,A=t*S+i*E+a*M+n*N;if(A===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const w=1/A;return e[0]=S*w,e[1]=(_*u*n-d*m*n-_*a*f+i*m*f+d*a*p-i*u*p)*w,e[2]=(o*m*n-_*l*n+_*a*c-i*m*c-o*a*p+i*l*p)*w,e[3]=(d*l*n-o*u*n-d*a*c+i*u*c+o*a*f-i*l*f)*w,e[4]=E*w,e[5]=(h*m*n-g*u*n+g*a*f-t*m*f-h*a*p+t*u*p)*w,e[6]=(g*l*n-s*m*n-g*a*c+t*m*c+s*a*p-t*l*p)*w,e[7]=(s*u*n-h*l*n+h*a*c-t*u*c-s*a*f+t*l*f)*w,e[8]=M*w,e[9]=(g*d*n-h*_*n-g*i*f+t*_*f+h*i*p-t*d*p)*w,e[10]=(s*_*n-g*o*n+g*i*c-t*_*c-s*i*p+t*o*p)*w,e[11]=(h*o*n-s*d*n-h*i*c+t*d*c+s*i*f-t*o*f)*w,e[12]=N*w,e[13]=(h*_*a-g*d*a+g*i*u-t*_*u-h*i*m+t*d*m)*w,e[14]=(g*o*a-s*_*a-g*i*l+t*_*l+s*i*m-t*o*m)*w,e[15]=(s*d*a-h*o*a+h*i*l-t*d*l-s*i*u+t*o*u)*w,this}scale(e){const t=this.elements,i=e.x,a=e.y,n=e.z;return t[0]*=i,t[4]*=a,t[8]*=n,t[1]*=i,t[5]*=a,t[9]*=n,t[2]*=i,t[6]*=a,t[10]*=n,t[3]*=i,t[7]*=a,t[11]*=n,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],i=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],a=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,i,a))}makeTranslation(e,t,i){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,i,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),i=Math.sin(e);return this.set(1,0,0,0,0,t,-i,0,0,i,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,0,i,0,0,1,0,0,-i,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,0,i,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const i=Math.cos(t),a=Math.sin(t),n=1-i,s=e.x,o=e.y,l=e.z,c=n*s,h=n*o;return this.set(c*s+i,c*o-a*l,c*l+a*o,0,c*o+a*l,h*o+i,h*l-a*s,0,c*l-a*o,h*l+a*s,n*l*l+i,0,0,0,0,1),this}makeScale(e,t,i){return this.set(e,0,0,0,0,t,0,0,0,0,i,0,0,0,0,1),this}makeShear(e,t,i,a,n,s){return this.set(1,i,n,0,e,1,s,0,t,a,1,0,0,0,0,1),this}compose(e,t,i){const a=this.elements,n=t._x,s=t._y,o=t._z,l=t._w,c=n+n,h=s+s,d=o+o,u=n*c,f=n*h,g=n*d,_=s*h,m=s*d,p=o*d,S=l*c,E=l*h,M=l*d,N=i.x,A=i.y,w=i.z;return a[0]=(1-(_+p))*N,a[1]=(f+M)*N,a[2]=(g-E)*N,a[3]=0,a[4]=(f-M)*A,a[5]=(1-(u+p))*A,a[6]=(m+S)*A,a[7]=0,a[8]=(g+E)*w,a[9]=(m-S)*w,a[10]=(1-(u+_))*w,a[11]=0,a[12]=e.x,a[13]=e.y,a[14]=e.z,a[15]=1,this}decompose(e,t,i){const a=this.elements;let n=Fi.set(a[0],a[1],a[2]).length();const s=Fi.set(a[4],a[5],a[6]).length(),o=Fi.set(a[8],a[9],a[10]).length();this.determinant()<0&&(n=-n),e.x=a[12],e.y=a[13],e.z=a[14],zt.copy(this);const l=1/n,c=1/s,h=1/o;return zt.elements[0]*=l,zt.elements[1]*=l,zt.elements[2]*=l,zt.elements[4]*=c,zt.elements[5]*=c,zt.elements[6]*=c,zt.elements[8]*=h,zt.elements[9]*=h,zt.elements[10]*=h,t.setFromRotationMatrix(zt),i.x=n,i.y=s,i.z=o,this}makePerspective(e,t,i,a,n,s,o=2e3){const l=this.elements,c=2*n/(t-e),h=2*n/(i-a),d=(t+e)/(t-e),u=(i+a)/(i-a);let f,g;if(o===2e3)f=-(s+n)/(s-n),g=-2*s*n/(s-n);else if(o===2001)f=-s/(s-n),g=-s*n/(s-n);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return l[0]=c,l[4]=0,l[8]=d,l[12]=0,l[1]=0,l[5]=h,l[9]=u,l[13]=0,l[2]=0,l[6]=0,l[10]=f,l[14]=g,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(e,t,i,a,n,s,o=2e3){const l=this.elements,c=1/(t-e),h=1/(i-a),d=1/(s-n),u=(t+e)*c,f=(i+a)*h;let g,_;if(o===2e3)g=(s+n)*d,_=-2*d;else if(o===2001)g=n*d,_=-1*d;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return l[0]=2*c,l[4]=0,l[8]=0,l[12]=-u,l[1]=0,l[5]=2*h,l[9]=0,l[13]=-f,l[2]=0,l[6]=0,l[10]=_,l[14]=-g,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(e){const t=this.elements,i=e.elements;for(let a=0;a<16;a++)if(t[a]!==i[a])return!1;return!0}fromArray(e,t=0){for(let i=0;i<16;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e[t+9]=i[9],e[t+10]=i[10],e[t+11]=i[11],e[t+12]=i[12],e[t+13]=i[13],e[t+14]=i[14],e[t+15]=i[15],e}};const Fi=new R,zt=new Je,_l=new R(0,0,0),vl=new R(1,1,1),si=new R,Xr=new R,At=new R,ts=new Je,is=new Nr;let hi=class mo{constructor(e=0,t=0,i=0,a=mo.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=i,this._order=a}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,i,a=this._order){return this._x=e,this._y=t,this._z=i,this._order=a,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,i=!0){const a=e.elements,n=a[0],s=a[4],o=a[8],l=a[1],c=a[5],h=a[9],d=a[2],u=a[6],f=a[10];switch(t){case"XYZ":this._y=Math.asin(xt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,f),this._z=Math.atan2(-s,n)):(this._x=Math.atan2(u,c),this._z=0);break;case"YXZ":this._x=Math.asin(-xt(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,f),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-d,n),this._z=0);break;case"ZXY":this._x=Math.asin(xt(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(-d,f),this._z=Math.atan2(-s,c)):(this._y=0,this._z=Math.atan2(l,n));break;case"ZYX":this._y=Math.asin(-xt(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(u,f),this._z=Math.atan2(l,n)):(this._x=0,this._z=Math.atan2(-s,c));break;case"YZX":this._z=Math.asin(xt(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-d,n)):(this._x=0,this._y=Math.atan2(o,f));break;case"XZY":this._z=Math.asin(-xt(s,-1,1)),Math.abs(s)<.9999999?(this._x=Math.atan2(u,c),this._y=Math.atan2(o,n)):(this._x=Math.atan2(-h,f),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,i===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,i){return ts.makeRotationFromQuaternion(e),this.setFromRotationMatrix(ts,t,i)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return is.setFromEuler(this),this.setFromQuaternion(is,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};hi.DEFAULT_ORDER="XYZ";class En{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let xl=0;const rs=new R,zi=new Nr,Zt=new Je,jr=new R,mr=new R,yl=new R,Ml=new Nr,as=new R(1,0,0),ns=new R(0,1,0),ss=new R(0,0,1),os={type:"added"},bl={type:"removed"},Bi={type:"childadded",child:null},Ia={type:"childremoved",child:null};class ft extends nr{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:xl++}),this.uuid=ei(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=ft.DEFAULT_UP.clone();const e=new R,t=new hi,i=new Nr,a=new R(1,1,1);function n(){i.setFromEuler(t,!1)}function s(){t.setFromQuaternion(i,void 0,!1)}t._onChange(n),i._onChange(s),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:a},modelViewMatrix:{value:new Je},normalMatrix:{value:new De}}),this.matrix=new Je,this.matrixWorld=new Je,this.matrixAutoUpdate=ft.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=ft.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new En,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return zi.setFromAxisAngle(e,t),this.quaternion.multiply(zi),this}rotateOnWorldAxis(e,t){return zi.setFromAxisAngle(e,t),this.quaternion.premultiply(zi),this}rotateX(e){return this.rotateOnAxis(as,e)}rotateY(e){return this.rotateOnAxis(ns,e)}rotateZ(e){return this.rotateOnAxis(ss,e)}translateOnAxis(e,t){return rs.copy(e).applyQuaternion(this.quaternion),this.position.add(rs.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(as,e)}translateY(e){return this.translateOnAxis(ns,e)}translateZ(e){return this.translateOnAxis(ss,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Zt.copy(this.matrixWorld).invert())}lookAt(e,t,i){e.isVector3?jr.copy(e):jr.set(e,t,i);const a=this.parent;this.updateWorldMatrix(!0,!1),mr.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Zt.lookAt(mr,jr,this.up):Zt.lookAt(jr,mr,this.up),this.quaternion.setFromRotationMatrix(Zt),a&&(Zt.extractRotation(a.matrixWorld),zi.setFromRotationMatrix(Zt),this.quaternion.premultiply(zi.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(os),Bi.child=e,this.dispatchEvent(Bi),Bi.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(bl),Ia.child=e,this.dispatchEvent(Ia),Ia.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Zt.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Zt.multiply(e.parent.matrixWorld)),e.applyMatrix4(Zt),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(os),Bi.child=e,this.dispatchEvent(Bi),Bi.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let i=0,a=this.children.length;i<a;i++){const n=this.children[i].getObjectByProperty(e,t);if(n!==void 0)return n}}getObjectsByProperty(e,t,i=[]){this[e]===t&&i.push(this);const a=this.children;for(let n=0,s=a.length;n<s;n++)a[n].getObjectsByProperty(e,t,i);return i}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(mr,e,yl),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(mr,Ml,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let i=0,a=t.length;i<a;i++)t[i].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let i=0,a=t.length;i<a;i++)t[i].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let i=0,a=t.length;i<a;i++)t[i].updateMatrixWorld(e)}updateWorldMatrix(e,t){const i=this.parent;if(e===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){const a=this.children;for(let n=0,s=a.length;n<s;n++)a[n].updateWorldMatrix(!1,!0)}}toJSON(e){const t=e===void 0||typeof e=="string",i={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const a={};a.uuid=this.uuid,a.type=this.type,this.name!==""&&(a.name=this.name),this.castShadow===!0&&(a.castShadow=!0),this.receiveShadow===!0&&(a.receiveShadow=!0),this.visible===!1&&(a.visible=!1),this.frustumCulled===!1&&(a.frustumCulled=!1),this.renderOrder!==0&&(a.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(a.userData=this.userData),a.layers=this.layers.mask,a.matrix=this.matrix.toArray(),a.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(a.matrixAutoUpdate=!1),this.isInstancedMesh&&(a.type="InstancedMesh",a.count=this.count,a.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(a.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(a.type="BatchedMesh",a.perObjectFrustumCulled=this.perObjectFrustumCulled,a.sortObjects=this.sortObjects,a.drawRanges=this._drawRanges,a.reservedRanges=this._reservedRanges,a.visibility=this._visibility,a.active=this._active,a.bounds=this._bounds.map(o=>({boxInitialized:o.boxInitialized,boxMin:o.box.min.toArray(),boxMax:o.box.max.toArray(),sphereInitialized:o.sphereInitialized,sphereRadius:o.sphere.radius,sphereCenter:o.sphere.center.toArray()})),a.maxInstanceCount=this._maxInstanceCount,a.maxVertexCount=this._maxVertexCount,a.maxIndexCount=this._maxIndexCount,a.geometryInitialized=this._geometryInitialized,a.geometryCount=this._geometryCount,a.matricesTexture=this._matricesTexture.toJSON(e),this._colorsTexture!==null&&(a.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(a.boundingSphere={center:a.boundingSphere.center.toArray(),radius:a.boundingSphere.radius}),this.boundingBox!==null&&(a.boundingBox={min:a.boundingBox.min.toArray(),max:a.boundingBox.max.toArray()}));function n(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?a.background=this.background.toJSON():this.background.isTexture&&(a.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(a.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){a.geometry=n(e.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const l=o.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){const d=l[c];n(e.shapes,d)}else n(e.shapes,l)}}if(this.isSkinnedMesh&&(a.bindMode=this.bindMode,a.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(n(e.skeletons,this.skeleton),a.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(n(e.materials,this.material[l]));a.material=o}else a.material=n(e.materials,this.material);if(this.children.length>0){a.children=[];for(let o=0;o<this.children.length;o++)a.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){a.animations=[];for(let o=0;o<this.animations.length;o++){const l=this.animations[o];a.animations.push(n(e.animations,l))}}if(t){const o=s(e.geometries),l=s(e.materials),c=s(e.textures),h=s(e.images),d=s(e.shapes),u=s(e.skeletons),f=s(e.animations),g=s(e.nodes);o.length>0&&(i.geometries=o),l.length>0&&(i.materials=l),c.length>0&&(i.textures=c),h.length>0&&(i.images=h),d.length>0&&(i.shapes=d),u.length>0&&(i.skeletons=u),f.length>0&&(i.animations=f),g.length>0&&(i.nodes=g)}return i.object=a,i;function s(o){const l=[];for(const c in o){const h=o[c];delete h.metadata,l.push(h)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let i=0;i<e.children.length;i++){const a=e.children[i];this.add(a.clone())}return this}}ft.DEFAULT_UP=new R(0,1,0);ft.DEFAULT_MATRIX_AUTO_UPDATE=!0;ft.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const Bt=new R,Jt=new R,La=new R,Qt=new R,ki=new R,Hi=new R,ls=new R,Da=new R,Ua=new R,Na=new R,Oa=new Ke,Fa=new Ke,za=new Ke;let Ji=class Qi{constructor(e=new R,t=new R,i=new R){this.a=e,this.b=t,this.c=i}static getNormal(e,t,i,a){a.subVectors(i,t),Bt.subVectors(e,t),a.cross(Bt);const n=a.lengthSq();return n>0?a.multiplyScalar(1/Math.sqrt(n)):a.set(0,0,0)}static getBarycoord(e,t,i,a,n){Bt.subVectors(a,t),Jt.subVectors(i,t),La.subVectors(e,t);const s=Bt.dot(Bt),o=Bt.dot(Jt),l=Bt.dot(La),c=Jt.dot(Jt),h=Jt.dot(La),d=s*c-o*o;if(d===0)return n.set(0,0,0),null;const u=1/d,f=(c*l-o*h)*u,g=(s*h-o*l)*u;return n.set(1-f-g,g,f)}static containsPoint(e,t,i,a){return this.getBarycoord(e,t,i,a,Qt)===null?!1:Qt.x>=0&&Qt.y>=0&&Qt.x+Qt.y<=1}static getInterpolation(e,t,i,a,n,s,o,l){return this.getBarycoord(e,t,i,a,Qt)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(n,Qt.x),l.addScaledVector(s,Qt.y),l.addScaledVector(o,Qt.z),l)}static getInterpolatedAttribute(e,t,i,a,n,s){return Oa.setScalar(0),Fa.setScalar(0),za.setScalar(0),Oa.fromBufferAttribute(e,t),Fa.fromBufferAttribute(e,i),za.fromBufferAttribute(e,a),s.setScalar(0),s.addScaledVector(Oa,n.x),s.addScaledVector(Fa,n.y),s.addScaledVector(za,n.z),s}static isFrontFacing(e,t,i,a){return Bt.subVectors(i,t),Jt.subVectors(e,t),Bt.cross(Jt).dot(a)<0}set(e,t,i){return this.a.copy(e),this.b.copy(t),this.c.copy(i),this}setFromPointsAndIndices(e,t,i,a){return this.a.copy(e[t]),this.b.copy(e[i]),this.c.copy(e[a]),this}setFromAttributeAndIndices(e,t,i,a){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,i),this.c.fromBufferAttribute(e,a),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Bt.subVectors(this.c,this.b),Jt.subVectors(this.a,this.b),Bt.cross(Jt).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return Qi.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return Qi.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,i,a,n){return Qi.getInterpolation(e,this.a,this.b,this.c,t,i,a,n)}containsPoint(e){return Qi.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return Qi.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const i=this.a,a=this.b,n=this.c;let s,o;ki.subVectors(a,i),Hi.subVectors(n,i),Da.subVectors(e,i);const l=ki.dot(Da),c=Hi.dot(Da);if(l<=0&&c<=0)return t.copy(i);Ua.subVectors(e,a);const h=ki.dot(Ua),d=Hi.dot(Ua);if(h>=0&&d<=h)return t.copy(a);const u=l*d-h*c;if(u<=0&&l>=0&&h<=0)return s=l/(l-h),t.copy(i).addScaledVector(ki,s);Na.subVectors(e,n);const f=ki.dot(Na),g=Hi.dot(Na);if(g>=0&&f<=g)return t.copy(n);const _=f*c-l*g;if(_<=0&&c>=0&&g<=0)return o=c/(c-g),t.copy(i).addScaledVector(Hi,o);const m=h*g-f*d;if(m<=0&&d-h>=0&&f-g>=0)return ls.subVectors(n,a),o=(d-h)/(d-h+(f-g)),t.copy(a).addScaledVector(ls,o);const p=1/(m+_+u);return s=_*p,o=u*p,t.copy(i).addScaledVector(ki,s).addScaledVector(Hi,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}};const go={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},oi={h:0,s:0,l:0},Yr={h:0,s:0,l:0};function Ba(r,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?r+(e-r)*6*t:t<1/2?e:t<2/3?r+(e-r)*6*(2/3-t):r}class Me{constructor(e,t,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,i)}set(e,t,i){if(t===void 0&&i===void 0){const a=e;a&&a.isColor?this.copy(a):typeof a=="number"?this.setHex(a):typeof a=="string"&&this.setStyle(a)}else this.setRGB(e,t,i);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Et){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Ge.toWorkingColorSpace(this,t),this}setRGB(e,t,i,a=Ge.workingColorSpace){return this.r=e,this.g=t,this.b=i,Ge.toWorkingColorSpace(this,a),this}setHSL(e,t,i,a=Ge.workingColorSpace){if(e=bn(e,1),t=xt(t,0,1),i=xt(i,0,1),t===0)this.r=this.g=this.b=i;else{const n=i<=.5?i*(1+t):i+t-i*t,s=2*i-n;this.r=Ba(s,n,e+1/3),this.g=Ba(s,n,e),this.b=Ba(s,n,e-1/3)}return Ge.toWorkingColorSpace(this,a),this}setStyle(e,t=Et){function i(n){n!==void 0&&parseFloat(n)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let a;if(a=/^(\w+)\(([^\)]*)\)/.exec(e)){let n;const s=a[1],o=a[2];switch(s){case"rgb":case"rgba":if(n=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(n[4]),this.setRGB(Math.min(255,parseInt(n[1],10))/255,Math.min(255,parseInt(n[2],10))/255,Math.min(255,parseInt(n[3],10))/255,t);if(n=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(n[4]),this.setRGB(Math.min(100,parseInt(n[1],10))/100,Math.min(100,parseInt(n[2],10))/100,Math.min(100,parseInt(n[3],10))/100,t);break;case"hsl":case"hsla":if(n=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(n[4]),this.setHSL(parseFloat(n[1])/360,parseFloat(n[2])/100,parseFloat(n[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(a=/^\#([A-Fa-f\d]+)$/.exec(e)){const n=a[1],s=n.length;if(s===3)return this.setRGB(parseInt(n.charAt(0),16)/15,parseInt(n.charAt(1),16)/15,parseInt(n.charAt(2),16)/15,t);if(s===6)return this.setHex(parseInt(n,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Et){const i=go[e.toLowerCase()];return i!==void 0?this.setHex(i,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=ti(e.r),this.g=ti(e.g),this.b=ti(e.b),this}copyLinearToSRGB(e){return this.r=tr(e.r),this.g=tr(e.g),this.b=tr(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Et){return Ge.fromWorkingColorSpace(vt.copy(this),e),Math.round(xt(vt.r*255,0,255))*65536+Math.round(xt(vt.g*255,0,255))*256+Math.round(xt(vt.b*255,0,255))}getHexString(e=Et){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=Ge.workingColorSpace){Ge.fromWorkingColorSpace(vt.copy(this),t);const i=vt.r,a=vt.g,n=vt.b,s=Math.max(i,a,n),o=Math.min(i,a,n);let l,c;const h=(o+s)/2;if(o===s)l=0,c=0;else{const d=s-o;switch(c=h<=.5?d/(s+o):d/(2-s-o),s){case i:l=(a-n)/d+(a<n?6:0);break;case a:l=(n-i)/d+2;break;case n:l=(i-a)/d+4;break}l/=6}return e.h=l,e.s=c,e.l=h,e}getRGB(e,t=Ge.workingColorSpace){return Ge.fromWorkingColorSpace(vt.copy(this),t),e.r=vt.r,e.g=vt.g,e.b=vt.b,e}getStyle(e=Et){Ge.fromWorkingColorSpace(vt.copy(this),e);const t=vt.r,i=vt.g,a=vt.b;return e!==Et?`color(${e} ${t.toFixed(3)} ${i.toFixed(3)} ${a.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(i*255)},${Math.round(a*255)})`}offsetHSL(e,t,i){return this.getHSL(oi),this.setHSL(oi.h+e,oi.s+t,oi.l+i)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,i){return this.r=e.r+(t.r-e.r)*i,this.g=e.g+(t.g-e.g)*i,this.b=e.b+(t.b-e.b)*i,this}lerpHSL(e,t){this.getHSL(oi),e.getHSL(Yr);const i=Cr(oi.h,Yr.h,t),a=Cr(oi.s,Yr.s,t),n=Cr(oi.l,Yr.l,t);return this.setHSL(i,a,n),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,i=this.g,a=this.b,n=e.elements;return this.r=n[0]*t+n[3]*i+n[6]*a,this.g=n[1]*t+n[4]*i+n[7]*a,this.b=n[2]*t+n[5]*i+n[8]*a,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const vt=new Me;Me.NAMES=go;let Sl=0;class Ri extends nr{static get type(){return"Material"}get type(){return this.constructor.type}set type(e){}constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Sl++}),this.uuid=ei(),this.name="",this.blending=1,this.side=0,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=204,this.blendDst=205,this.blendEquation=100,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Me(0,0,0),this.blendAlpha=0,this.depthFunc=3,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=519,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=7680,this.stencilZFail=7680,this.stencilZPass=7680,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const i=e[t];if(i===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}const a=this[t];if(a===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}a&&a.isColor?a.set(i):a&&a.isVector3&&i&&i.isVector3?a.copy(i):this[t]=i}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const i={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(e).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(e).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(e).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(e).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(e).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==1&&(i.blending=this.blending),this.side!==0&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==204&&(i.blendSrc=this.blendSrc),this.blendDst!==205&&(i.blendDst=this.blendDst),this.blendEquation!==100&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==3&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==519&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==7680&&(i.stencilFail=this.stencilFail),this.stencilZFail!==7680&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==7680&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function a(n){const s=[];for(const o in n){const l=n[o];delete l.metadata,s.push(l)}return s}if(t){const n=a(e.textures),s=a(e.images);n.length>0&&(i.textures=n),s.length>0&&(i.images=s)}return i}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let i=null;if(t!==null){const a=t.length;i=new Array(a);for(let n=0;n!==a;++n)i[n]=t[n].clone()}return this.clippingPlanes=i,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}}class Yt extends Ri{static get type(){return"MeshBasicMaterial"}constructor(e){super(),this.isMeshBasicMaterial=!0,this.color=new Me(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new hi,this.combine=0,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const ct=new R,$r=new Ie;class ot{constructor(e,t,i=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=i,this.usage=35044,this.updateRanges=[],this.gpuType=1015,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,i){e*=this.itemSize,i*=t.itemSize;for(let a=0,n=this.itemSize;a<n;a++)this.array[e+a]=t.array[i+a];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,i=this.count;t<i;t++)$r.fromBufferAttribute(this,t),$r.applyMatrix3(e),this.setXY(t,$r.x,$r.y);else if(this.itemSize===3)for(let t=0,i=this.count;t<i;t++)ct.fromBufferAttribute(this,t),ct.applyMatrix3(e),this.setXYZ(t,ct.x,ct.y,ct.z);return this}applyMatrix4(e){for(let t=0,i=this.count;t<i;t++)ct.fromBufferAttribute(this,t),ct.applyMatrix4(e),this.setXYZ(t,ct.x,ct.y,ct.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)ct.fromBufferAttribute(this,t),ct.applyNormalMatrix(e),this.setXYZ(t,ct.x,ct.y,ct.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)ct.fromBufferAttribute(this,t),ct.transformDirection(e),this.setXYZ(t,ct.x,ct.y,ct.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let i=this.array[e*this.itemSize+t];return this.normalized&&(i=Ht(i,this.array)),i}setComponent(e,t,i){return this.normalized&&(i=Ye(i,this.array)),this.array[e*this.itemSize+t]=i,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=Ht(t,this.array)),t}setX(e,t){return this.normalized&&(t=Ye(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=Ht(t,this.array)),t}setY(e,t){return this.normalized&&(t=Ye(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=Ht(t,this.array)),t}setZ(e,t){return this.normalized&&(t=Ye(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=Ht(t,this.array)),t}setW(e,t){return this.normalized&&(t=Ye(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,i){return e*=this.itemSize,this.normalized&&(t=Ye(t,this.array),i=Ye(i,this.array)),this.array[e+0]=t,this.array[e+1]=i,this}setXYZ(e,t,i,a){return e*=this.itemSize,this.normalized&&(t=Ye(t,this.array),i=Ye(i,this.array),a=Ye(a,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=a,this}setXYZW(e,t,i,a,n){return e*=this.itemSize,this.normalized&&(t=Ye(t,this.array),i=Ye(i,this.array),a=Ye(a,this.array),n=Ye(n,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=a,this.array[e+3]=n,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==35044&&(e.usage=this.usage),e}}class _o extends ot{constructor(e,t,i){super(new Uint16Array(e),t,i)}}class vo extends ot{constructor(e,t,i){super(new Uint32Array(e),t,i)}}let nt=class extends ot{constructor(e,t,i){super(new Float32Array(e),t,i)}},El=0;const Lt=new Je,ka=new ft,Gi=new R,Rt=new Ai,gr=new Ai,pt=new R;let mt=class xo extends nr{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:El++}),this.uuid=ei(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(ho(e)?vo:_o)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,i=0){this.groups.push({start:e,count:t,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const n=new De().getNormalMatrix(e);i.applyNormalMatrix(n),i.needsUpdate=!0}const a=this.attributes.tangent;return a!==void 0&&(a.transformDirection(e),a.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return Lt.makeRotationFromQuaternion(e),this.applyMatrix4(Lt),this}rotateX(e){return Lt.makeRotationX(e),this.applyMatrix4(Lt),this}rotateY(e){return Lt.makeRotationY(e),this.applyMatrix4(Lt),this}rotateZ(e){return Lt.makeRotationZ(e),this.applyMatrix4(Lt),this}translate(e,t,i){return Lt.makeTranslation(e,t,i),this.applyMatrix4(Lt),this}scale(e,t,i){return Lt.makeScale(e,t,i),this.applyMatrix4(Lt),this}lookAt(e){return ka.lookAt(e),ka.updateMatrix(),this.applyMatrix4(ka.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Gi).negate(),this.translate(Gi.x,Gi.y,Gi.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const i=[];for(let a=0,n=e.length;a<n;a++){const s=e[a];i.push(s.x,s.y,s.z||0)}this.setAttribute("position",new nt(i,3))}else{for(let i=0,a=t.count;i<a;i++){const n=e[i];t.setXYZ(i,n.x,n.y,n.z||0)}e.length>t.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Ai);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new R(-1/0,-1/0,-1/0),new R(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let i=0,a=t.length;i<a;i++){const n=t[i];Rt.setFromBufferAttribute(n),this.morphTargetsRelative?(pt.addVectors(this.boundingBox.min,Rt.min),this.boundingBox.expandByPoint(pt),pt.addVectors(this.boundingBox.max,Rt.max),this.boundingBox.expandByPoint(pt)):(this.boundingBox.expandByPoint(Rt.min),this.boundingBox.expandByPoint(Rt.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new sr);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new R,1/0);return}if(e){const i=this.boundingSphere.center;if(Rt.setFromBufferAttribute(e),t)for(let n=0,s=t.length;n<s;n++){const o=t[n];gr.setFromBufferAttribute(o),this.morphTargetsRelative?(pt.addVectors(Rt.min,gr.min),Rt.expandByPoint(pt),pt.addVectors(Rt.max,gr.max),Rt.expandByPoint(pt)):(Rt.expandByPoint(gr.min),Rt.expandByPoint(gr.max))}Rt.getCenter(i);let a=0;for(let n=0,s=e.count;n<s;n++)pt.fromBufferAttribute(e,n),a=Math.max(a,i.distanceToSquared(pt));if(t)for(let n=0,s=t.length;n<s;n++){const o=t[n],l=this.morphTargetsRelative;for(let c=0,h=o.count;c<h;c++)pt.fromBufferAttribute(o,c),l&&(Gi.fromBufferAttribute(e,c),pt.add(Gi)),a=Math.max(a,i.distanceToSquared(pt))}this.boundingSphere.radius=Math.sqrt(a),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=t.position,a=t.normal,n=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new ot(new Float32Array(4*i.count),4));const s=this.getAttribute("tangent"),o=[],l=[];for(let P=0;P<i.count;P++)o[P]=new R,l[P]=new R;const c=new R,h=new R,d=new R,u=new Ie,f=new Ie,g=new Ie,_=new R,m=new R;function p(P,b,x){c.fromBufferAttribute(i,P),h.fromBufferAttribute(i,b),d.fromBufferAttribute(i,x),u.fromBufferAttribute(n,P),f.fromBufferAttribute(n,b),g.fromBufferAttribute(n,x),h.sub(c),d.sub(c),f.sub(u),g.sub(u);const C=1/(f.x*g.y-g.x*f.y);isFinite(C)&&(_.copy(h).multiplyScalar(g.y).addScaledVector(d,-f.y).multiplyScalar(C),m.copy(d).multiplyScalar(f.x).addScaledVector(h,-g.x).multiplyScalar(C),o[P].add(_),o[b].add(_),o[x].add(_),l[P].add(m),l[b].add(m),l[x].add(m))}let S=this.groups;S.length===0&&(S=[{start:0,count:e.count}]);for(let P=0,b=S.length;P<b;++P){const x=S[P],C=x.start,F=x.count;for(let k=C,X=C+F;k<X;k+=3)p(e.getX(k+0),e.getX(k+1),e.getX(k+2))}const E=new R,M=new R,N=new R,A=new R;function w(P){N.fromBufferAttribute(a,P),A.copy(N);const b=o[P];E.copy(b),E.sub(N.multiplyScalar(N.dot(b))).normalize(),M.crossVectors(A,b);const x=M.dot(l[P])<0?-1:1;s.setXYZW(P,E.x,E.y,E.z,x)}for(let P=0,b=S.length;P<b;++P){const x=S[P],C=x.start,F=x.count;for(let k=C,X=C+F;k<X;k+=3)w(e.getX(k+0)),w(e.getX(k+1)),w(e.getX(k+2))}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new ot(new Float32Array(t.count*3),3),this.setAttribute("normal",i);else for(let u=0,f=i.count;u<f;u++)i.setXYZ(u,0,0,0);const a=new R,n=new R,s=new R,o=new R,l=new R,c=new R,h=new R,d=new R;if(e)for(let u=0,f=e.count;u<f;u+=3){const g=e.getX(u+0),_=e.getX(u+1),m=e.getX(u+2);a.fromBufferAttribute(t,g),n.fromBufferAttribute(t,_),s.fromBufferAttribute(t,m),h.subVectors(s,n),d.subVectors(a,n),h.cross(d),o.fromBufferAttribute(i,g),l.fromBufferAttribute(i,_),c.fromBufferAttribute(i,m),o.add(h),l.add(h),c.add(h),i.setXYZ(g,o.x,o.y,o.z),i.setXYZ(_,l.x,l.y,l.z),i.setXYZ(m,c.x,c.y,c.z)}else for(let u=0,f=t.count;u<f;u+=3)a.fromBufferAttribute(t,u+0),n.fromBufferAttribute(t,u+1),s.fromBufferAttribute(t,u+2),h.subVectors(s,n),d.subVectors(a,n),h.cross(d),i.setXYZ(u+0,h.x,h.y,h.z),i.setXYZ(u+1,h.x,h.y,h.z),i.setXYZ(u+2,h.x,h.y,h.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,i=e.count;t<i;t++)pt.fromBufferAttribute(e,t),pt.normalize(),e.setXYZ(t,pt.x,pt.y,pt.z)}toNonIndexed(){function e(o,l){const c=o.array,h=o.itemSize,d=o.normalized,u=new c.constructor(l.length*h);let f=0,g=0;for(let _=0,m=l.length;_<m;_++){o.isInterleavedBufferAttribute?f=l[_]*o.data.stride+o.offset:f=l[_]*h;for(let p=0;p<h;p++)u[g++]=c[f++]}return new ot(u,h,d)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new xo,i=this.index.array,a=this.attributes;for(const o in a){const l=a[o],c=e(l,i);t.setAttribute(o,c)}const n=this.morphAttributes;for(const o in n){const l=[],c=n[o];for(let h=0,d=c.length;h<d;h++){const u=c[h],f=e(u,i);l.push(f)}t.morphAttributes[o]=l}t.morphTargetsRelative=this.morphTargetsRelative;const s=this.groups;for(let o=0,l=s.length;o<l;o++){const c=s[o];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){const e={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const i=this.attributes;for(const l in i){const c=i[l];e.data.attributes[l]=c.toJSON(e.data)}const a={};let n=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],h=[];for(let d=0,u=c.length;d<u;d++){const f=c[d];h.push(f.toJSON(e.data))}h.length>0&&(a[l]=h,n=!0)}n&&(e.data.morphAttributes=a,e.data.morphTargetsRelative=this.morphTargetsRelative);const s=this.groups;s.length>0&&(e.data.groups=JSON.parse(JSON.stringify(s)));const o=this.boundingSphere;return o!==null&&(e.data.boundingSphere={center:o.center.toArray(),radius:o.radius}),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const i=e.index;i!==null&&this.setIndex(i.clone(t));const a=e.attributes;for(const c in a){const h=a[c];this.setAttribute(c,h.clone(t))}const n=e.morphAttributes;for(const c in n){const h=[],d=n[c];for(let u=0,f=d.length;u<f;u++)h.push(d[u].clone(t));this.morphAttributes[c]=h}this.morphTargetsRelative=e.morphTargetsRelative;const s=e.groups;for(let c=0,h=s.length;c<h;c++){const d=s[c];this.addGroup(d.start,d.count,d.materialIndex)}const o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());const l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}};const cs=new Je,gi=new Sn,qr=new sr,hs=new R,Kr=new R,Zr=new R,Jr=new R,Ha=new R,Qr=new R,us=new R,ea=new R;let Ze=class extends ft{constructor(e=new mt,t=new Yt){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,t=Object.keys(e);if(t.length>0){const i=e[t[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let a=0,n=i.length;a<n;a++){const s=i[a].name||String(a);this.morphTargetInfluences.push(0),this.morphTargetDictionary[s]=a}}}}getVertexPosition(e,t){const i=this.geometry,a=i.attributes.position,n=i.morphAttributes.position,s=i.morphTargetsRelative;t.fromBufferAttribute(a,e);const o=this.morphTargetInfluences;if(n&&o){Qr.set(0,0,0);for(let l=0,c=n.length;l<c;l++){const h=o[l],d=n[l];h!==0&&(Ha.fromBufferAttribute(d,e),s?Qr.addScaledVector(Ha,h):Qr.addScaledVector(Ha.sub(t),h))}t.add(Qr)}return t}raycast(e,t){const i=this.geometry,a=this.material,n=this.matrixWorld;a!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),qr.copy(i.boundingSphere),qr.applyMatrix4(n),gi.copy(e.ray).recast(e.near),!(qr.containsPoint(gi.origin)===!1&&(gi.intersectSphere(qr,hs)===null||gi.origin.distanceToSquared(hs)>(e.far-e.near)**2))&&(cs.copy(n).invert(),gi.copy(e.ray).applyMatrix4(cs),!(i.boundingBox!==null&&gi.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(e,t,gi)))}_computeIntersections(e,t,i){let a;const n=this.geometry,s=this.material,o=n.index,l=n.attributes.position,c=n.attributes.uv,h=n.attributes.uv1,d=n.attributes.normal,u=n.groups,f=n.drawRange;if(o!==null)if(Array.isArray(s))for(let g=0,_=u.length;g<_;g++){const m=u[g],p=s[m.materialIndex],S=Math.max(m.start,f.start),E=Math.min(o.count,Math.min(m.start+m.count,f.start+f.count));for(let M=S,N=E;M<N;M+=3){const A=o.getX(M),w=o.getX(M+1),P=o.getX(M+2);a=ta(this,p,e,i,c,h,d,A,w,P),a&&(a.faceIndex=Math.floor(M/3),a.face.materialIndex=m.materialIndex,t.push(a))}}else{const g=Math.max(0,f.start),_=Math.min(o.count,f.start+f.count);for(let m=g,p=_;m<p;m+=3){const S=o.getX(m),E=o.getX(m+1),M=o.getX(m+2);a=ta(this,s,e,i,c,h,d,S,E,M),a&&(a.faceIndex=Math.floor(m/3),t.push(a))}}else if(l!==void 0)if(Array.isArray(s))for(let g=0,_=u.length;g<_;g++){const m=u[g],p=s[m.materialIndex],S=Math.max(m.start,f.start),E=Math.min(l.count,Math.min(m.start+m.count,f.start+f.count));for(let M=S,N=E;M<N;M+=3){const A=M,w=M+1,P=M+2;a=ta(this,p,e,i,c,h,d,A,w,P),a&&(a.faceIndex=Math.floor(M/3),a.face.materialIndex=m.materialIndex,t.push(a))}}else{const g=Math.max(0,f.start),_=Math.min(l.count,f.start+f.count);for(let m=g,p=_;m<p;m+=3){const S=m,E=m+1,M=m+2;a=ta(this,s,e,i,c,h,d,S,E,M),a&&(a.faceIndex=Math.floor(m/3),t.push(a))}}}};function Tl(r,e,t,i,a,n,s,o){let l;if(e.side===1?l=i.intersectTriangle(s,n,a,!0,o):l=i.intersectTriangle(a,n,s,e.side===0,o),l===null)return null;ea.copy(o),ea.applyMatrix4(r.matrixWorld);const c=t.ray.origin.distanceTo(ea);return c<t.near||c>t.far?null:{distance:c,point:ea.clone(),object:r}}function ta(r,e,t,i,a,n,s,o,l,c){r.getVertexPosition(o,Kr),r.getVertexPosition(l,Zr),r.getVertexPosition(c,Jr);const h=Tl(r,e,t,i,Kr,Zr,Jr,us);if(h){const d=new R;Ji.getBarycoord(us,Kr,Zr,Jr,d),a&&(h.uv=Ji.getInterpolatedAttribute(a,o,l,c,d,new Ie)),n&&(h.uv1=Ji.getInterpolatedAttribute(n,o,l,c,d,new Ie)),s&&(h.normal=Ji.getInterpolatedAttribute(s,o,l,c,d,new R),h.normal.dot(i.direction)>0&&h.normal.multiplyScalar(-1));const u={a:o,b:l,c,normal:new R,materialIndex:0};Ji.getNormal(Kr,Zr,Jr,u.normal),h.face=u,h.barycoord=d}return h}let Tn=class yo extends mt{constructor(e=1,t=1,i=1,a=1,n=1,s=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:i,widthSegments:a,heightSegments:n,depthSegments:s};const o=this;a=Math.floor(a),n=Math.floor(n),s=Math.floor(s);const l=[],c=[],h=[],d=[];let u=0,f=0;g("z","y","x",-1,-1,i,t,e,s,n,0),g("z","y","x",1,-1,i,t,-e,s,n,1),g("x","z","y",1,1,e,i,t,a,s,2),g("x","z","y",1,-1,e,i,-t,a,s,3),g("x","y","z",1,-1,e,t,i,a,n,4),g("x","y","z",-1,-1,e,t,-i,a,n,5),this.setIndex(l),this.setAttribute("position",new nt(c,3)),this.setAttribute("normal",new nt(h,3)),this.setAttribute("uv",new nt(d,2));function g(_,m,p,S,E,M,N,A,w,P,b){const x=M/w,C=N/P,F=M/2,k=N/2,X=A/2,K=w+1,j=P+1;let ee=0,W=0;const ae=new R;for(let pe=0;pe<j;pe++){const Ae=pe*C-k;for(let Z=0;Z<K;Z++){const re=Z*x-F;ae[_]=re*S,ae[m]=Ae*E,ae[p]=X,c.push(ae.x,ae.y,ae.z),ae[_]=0,ae[m]=0,ae[p]=A>0?1:-1,h.push(ae.x,ae.y,ae.z),d.push(Z/w),d.push(1-pe/P),ee+=1}}for(let pe=0;pe<P;pe++)for(let Ae=0;Ae<w;Ae++){const Z=u+Ae+K*pe,re=u+Ae+K*(pe+1),O=u+(Ae+1)+K*(pe+1),G=u+(Ae+1)+K*pe;l.push(Z,re,G),l.push(re,O,G),W+=6}o.addGroup(f,W,b),f+=W,u+=ee}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new yo(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}};function ir(r){const e={};for(const t in r){e[t]={};for(const i in r[t]){const a=r[t][i];a&&(a.isColor||a.isMatrix3||a.isMatrix4||a.isVector2||a.isVector3||a.isVector4||a.isTexture||a.isQuaternion)?a.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][i]=null):e[t][i]=a.clone():Array.isArray(a)?e[t][i]=a.slice():e[t][i]=a}}return e}function bt(r){const e={};for(let t=0;t<r.length;t++){const i=ir(r[t]);for(const a in i)e[a]=i[a]}return e}function wl(r){const e=[];for(let t=0;t<r.length;t++)e.push(r[t].clone());return e}function Mo(r){const e=r.getRenderTarget();return e===null?r.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:Ge.workingColorSpace}const Al={clone:ir,merge:bt};var Rl=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Cl=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Tt extends Ri{static get type(){return"ShaderMaterial"}constructor(e){super(),this.isShaderMaterial=!0,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Rl,this.fragmentShader=Cl,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=ir(e.uniforms),this.uniformsGroups=wl(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const a in this.uniforms){const n=this.uniforms[a].value;n&&n.isTexture?t.uniforms[a]={type:"t",value:n.toJSON(e).uuid}:n&&n.isColor?t.uniforms[a]={type:"c",value:n.getHex()}:n&&n.isVector2?t.uniforms[a]={type:"v2",value:n.toArray()}:n&&n.isVector3?t.uniforms[a]={type:"v3",value:n.toArray()}:n&&n.isVector4?t.uniforms[a]={type:"v4",value:n.toArray()}:n&&n.isMatrix3?t.uniforms[a]={type:"m3",value:n.toArray()}:n&&n.isMatrix4?t.uniforms[a]={type:"m4",value:n.toArray()}:t.uniforms[a]={value:n}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const i={};for(const a in this.extensions)this.extensions[a]===!0&&(i[a]=!0);return Object.keys(i).length>0&&(t.extensions=i),t}}class bo extends ft{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Je,this.projectionMatrix=new Je,this.projectionMatrixInverse=new Je,this.coordinateSystem=2e3}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const li=new R,ds=new Ie,ps=new Ie;let Ct=class extends bo{constructor(e=50,t=1,i=.1,a=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=i,this.far=a,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=Ir*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(Rr*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Ir*2*Math.atan(Math.tan(Rr*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,i){li.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(li.x,li.y).multiplyScalar(-e/li.z),li.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(li.x,li.y).multiplyScalar(-e/li.z)}getViewSize(e,t){return this.getViewBounds(e,ds,ps),t.subVectors(ps,ds)}setViewOffset(e,t,i,a,n,s){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=a,this.view.width=n,this.view.height=s,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(Rr*.5*this.fov)/this.zoom,i=2*t,a=this.aspect*i,n=-.5*a;const s=this.view;if(this.view!==null&&this.view.enabled){const l=s.fullWidth,c=s.fullHeight;n+=s.offsetX*a/l,t-=s.offsetY*i/c,a*=s.width/l,i*=s.height/c}const o=this.filmOffset;o!==0&&(n+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(n,n+a,t,t-i,e,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}};const Vi=-90,Wi=1;class Pl extends ft{constructor(e,t,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const a=new Ct(Vi,Wi,e,t);a.layers=this.layers,this.add(a);const n=new Ct(Vi,Wi,e,t);n.layers=this.layers,this.add(n);const s=new Ct(Vi,Wi,e,t);s.layers=this.layers,this.add(s);const o=new Ct(Vi,Wi,e,t);o.layers=this.layers,this.add(o);const l=new Ct(Vi,Wi,e,t);l.layers=this.layers,this.add(l);const c=new Ct(Vi,Wi,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[i,a,n,s,o,l]=t;for(const c of t)this.remove(c);if(e===2e3)i.up.set(0,1,0),i.lookAt(1,0,0),a.up.set(0,1,0),a.lookAt(-1,0,0),n.up.set(0,0,-1),n.lookAt(0,1,0),s.up.set(0,0,1),s.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===2001)i.up.set(0,-1,0),i.lookAt(-1,0,0),a.up.set(0,-1,0),a.lookAt(1,0,0),n.up.set(0,0,1),n.lookAt(0,1,0),s.up.set(0,0,-1),s.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:a}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[n,s,o,l,c,h]=this.children,d=e.getRenderTarget(),u=e.getActiveCubeFace(),f=e.getActiveMipmapLevel(),g=e.xr.enabled;e.xr.enabled=!1;const _=i.texture.generateMipmaps;i.texture.generateMipmaps=!1,e.setRenderTarget(i,0,a),e.render(t,n),e.setRenderTarget(i,1,a),e.render(t,s),e.setRenderTarget(i,2,a),e.render(t,o),e.setRenderTarget(i,3,a),e.render(t,l),e.setRenderTarget(i,4,a),e.render(t,c),i.texture.generateMipmaps=_,e.setRenderTarget(i,5,a),e.render(t,h),e.setRenderTarget(d,u,f),e.xr.enabled=g,i.texture.needsPMREMUpdate=!0}}class So extends yt{constructor(e,t,i,a,n,s,o,l,c,h){e=e!==void 0?e:[],t=t!==void 0?t:301,super(e,t,i,a,n,s,o,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class Il extends Ei{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const i={width:e,height:e,depth:1},a=[i,i,i,i,i,i];this.texture=new So(a,t.mapping,t.wrapS,t.wrapT,t.magFilter,t.minFilter,t.format,t.type,t.anisotropy,t.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=t.generateMipmaps!==void 0?t.generateMipmaps:!1,this.texture.minFilter=t.minFilter!==void 0?t.minFilter:1006}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},a=new Tn(5,5,5),n=new Tt({name:"CubemapFromEquirect",uniforms:ir(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:1,blending:0});n.uniforms.tEquirect.value=t;const s=new Ze(a,n),o=t.minFilter;return t.minFilter===1008&&(t.minFilter=1006),new Pl(1,10,this).update(e,s),t.minFilter=o,s.geometry.dispose(),s.material.dispose(),this}clear(e,t,i,a){const n=e.getRenderTarget();for(let s=0;s<6;s++)e.setRenderTarget(this,s),e.clear(t,i,a);e.setRenderTarget(n)}}const Ga=new R,Ll=new R,Dl=new De;class ci{constructor(e=new R(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,i,a){return this.normal.set(e,t,i),this.constant=a,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,i){const a=Ga.subVectors(i,t).cross(Ll.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(a,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const i=e.delta(Ga),a=this.normal.dot(i);if(a===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const n=-(e.start.dot(this.normal)+this.constant)/a;return n<0||n>1?null:t.copy(e.start).addScaledVector(i,n)}intersectsLine(e){const t=this.distanceToPoint(e.start),i=this.distanceToPoint(e.end);return t<0&&i>0||i<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const i=t||Dl.getNormalMatrix(e),a=this.coplanarPoint(Ga).applyMatrix4(e),n=this.normal.applyMatrix3(i).normalize();return this.constant=-a.dot(n),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const _i=new sr,ia=new R;class wn{constructor(e=new ci,t=new ci,i=new ci,a=new ci,n=new ci,s=new ci){this.planes=[e,t,i,a,n,s]}set(e,t,i,a,n,s){const o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(i),o[3].copy(a),o[4].copy(n),o[5].copy(s),this}copy(e){const t=this.planes;for(let i=0;i<6;i++)t[i].copy(e.planes[i]);return this}setFromProjectionMatrix(e,t=2e3){const i=this.planes,a=e.elements,n=a[0],s=a[1],o=a[2],l=a[3],c=a[4],h=a[5],d=a[6],u=a[7],f=a[8],g=a[9],_=a[10],m=a[11],p=a[12],S=a[13],E=a[14],M=a[15];if(i[0].setComponents(l-n,u-c,m-f,M-p).normalize(),i[1].setComponents(l+n,u+c,m+f,M+p).normalize(),i[2].setComponents(l+s,u+h,m+g,M+S).normalize(),i[3].setComponents(l-s,u-h,m-g,M-S).normalize(),i[4].setComponents(l-o,u-d,m-_,M-E).normalize(),t===2e3)i[5].setComponents(l+o,u+d,m+_,M+E).normalize();else if(t===2001)i[5].setComponents(o,d,_,E).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),_i.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),_i.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(_i)}intersectsSprite(e){return _i.center.set(0,0,0),_i.radius=.7071067811865476,_i.applyMatrix4(e.matrixWorld),this.intersectsSphere(_i)}intersectsSphere(e){const t=this.planes,i=e.center,a=-e.radius;for(let n=0;n<6;n++)if(t[n].distanceToPoint(i)<a)return!1;return!0}intersectsBox(e){const t=this.planes;for(let i=0;i<6;i++){const a=t[i];if(ia.x=a.normal.x>0?e.max.x:e.min.x,ia.y=a.normal.y>0?e.max.y:e.min.y,ia.z=a.normal.z>0?e.max.z:e.min.z,a.distanceToPoint(ia)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let i=0;i<6;i++)if(t[i].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function Eo(){let r=null,e=!1,t=null,i=null;function a(n,s){t(n,s),i=r.requestAnimationFrame(a)}return{start:function(){e!==!0&&t!==null&&(i=r.requestAnimationFrame(a),e=!0)},stop:function(){r.cancelAnimationFrame(i),e=!1},setAnimationLoop:function(n){t=n},setContext:function(n){r=n}}}function Ul(r){const e=new WeakMap;function t(o,l){const c=o.array,h=o.usage,d=c.byteLength,u=r.createBuffer();r.bindBuffer(l,u),r.bufferData(l,c,h),o.onUploadCallback();let f;if(c instanceof Float32Array)f=r.FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?f=r.HALF_FLOAT:f=r.UNSIGNED_SHORT;else if(c instanceof Int16Array)f=r.SHORT;else if(c instanceof Uint32Array)f=r.UNSIGNED_INT;else if(c instanceof Int32Array)f=r.INT;else if(c instanceof Int8Array)f=r.BYTE;else if(c instanceof Uint8Array)f=r.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)f=r.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:u,type:f,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:d}}function i(o,l,c){const h=l.array,d=l.updateRanges;if(r.bindBuffer(c,o),d.length===0)r.bufferSubData(c,0,h);else{d.sort((f,g)=>f.start-g.start);let u=0;for(let f=1;f<d.length;f++){const g=d[u],_=d[f];_.start<=g.start+g.count+1?g.count=Math.max(g.count,_.start+_.count-g.start):(++u,d[u]=_)}d.length=u+1;for(let f=0,g=d.length;f<g;f++){const _=d[f];r.bufferSubData(c,_.start*h.BYTES_PER_ELEMENT,h,_.start,_.count)}l.clearUpdateRanges()}l.onUploadCallback()}function a(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function n(o){o.isInterleavedBufferAttribute&&(o=o.data);const l=e.get(o);l&&(r.deleteBuffer(l.buffer),e.delete(o))}function s(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const h=e.get(o);(!h||h.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const c=e.get(o);if(c===void 0)e.set(o,t(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(c.buffer,o,l),c.version=o.version}}return{get:a,remove:n,update:s}}let To=class wo extends mt{constructor(e=1,t=1,i=1,a=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:i,heightSegments:a};const n=e/2,s=t/2,o=Math.floor(i),l=Math.floor(a),c=o+1,h=l+1,d=e/o,u=t/l,f=[],g=[],_=[],m=[];for(let p=0;p<h;p++){const S=p*u-s;for(let E=0;E<c;E++){const M=E*d-n;g.push(M,-S,0),_.push(0,0,1),m.push(E/o),m.push(1-p/l)}}for(let p=0;p<l;p++)for(let S=0;S<o;S++){const E=S+c*p,M=S+c*(p+1),N=S+1+c*(p+1),A=S+1+c*p;f.push(E,M,A),f.push(M,N,A)}this.setIndex(f),this.setAttribute("position",new nt(g,3)),this.setAttribute("normal",new nt(_,3)),this.setAttribute("uv",new nt(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new wo(e.width,e.height,e.widthSegments,e.heightSegments)}};var Nl=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Ol=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,Fl=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,zl=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Bl=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,kl=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Hl=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,Gl=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Vl=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,Wl=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Xl=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,jl=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Yl=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,$l=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,ql=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,Kl=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,Zl=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Jl=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Ql=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,ec=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,tc=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,ic=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,rc=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,ac=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,nc=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,sc=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,oc=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,lc=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,cc=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,hc=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,uc="gl_FragColor = linearToOutputTexel( gl_FragColor );",dc=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,pc=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,fc=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,mc=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,gc=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,_c=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,vc=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,xc=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,yc=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Mc=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,bc=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,Sc=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Ec=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Tc=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,wc=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,Ac=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,Rc=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Cc=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Pc=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Ic=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Lc=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,Dc=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,Uc=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,Nc=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,Oc=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Fc=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,zc=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Bc=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,kc=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Hc=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Gc=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Vc=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,Wc=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Xc=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,jc=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Yc=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,$c=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,qc=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Kc=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,Zc=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Jc=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,Qc=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,eh=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,th=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,ih=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,rh=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,ah=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,nh=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,sh=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,oh=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,lh=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,ch=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,hh=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,uh=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,dh=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,ph=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,fh=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,mh=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,gh=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,_h=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,vh=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,xh=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,yh=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Mh=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,bh=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Sh=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,Eh=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Th=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,wh=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Ah=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,Rh=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,Ch=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
		
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
		
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		
		#else
		
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,Ph=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Ih=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Lh=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,Dh=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const Uh=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Nh=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Oh=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Fh=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,zh=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Bh=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,kh=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,Hh=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,Gh=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,Vh=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,Wh=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Xh=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,jh=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Yh=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,$h=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,qh=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Kh=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Zh=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Jh=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,Qh=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,eu=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,tu=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,iu=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,ru=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,au=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,nu=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,su=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,ou=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,lu=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,cu=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,hu=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,uu=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,du=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,pu=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Ne={alphahash_fragment:Nl,alphahash_pars_fragment:Ol,alphamap_fragment:Fl,alphamap_pars_fragment:zl,alphatest_fragment:Bl,alphatest_pars_fragment:kl,aomap_fragment:Hl,aomap_pars_fragment:Gl,batching_pars_vertex:Vl,batching_vertex:Wl,begin_vertex:Xl,beginnormal_vertex:jl,bsdfs:Yl,iridescence_fragment:$l,bumpmap_pars_fragment:ql,clipping_planes_fragment:Kl,clipping_planes_pars_fragment:Zl,clipping_planes_pars_vertex:Jl,clipping_planes_vertex:Ql,color_fragment:ec,color_pars_fragment:tc,color_pars_vertex:ic,color_vertex:rc,common:ac,cube_uv_reflection_fragment:nc,defaultnormal_vertex:sc,displacementmap_pars_vertex:oc,displacementmap_vertex:lc,emissivemap_fragment:cc,emissivemap_pars_fragment:hc,colorspace_fragment:uc,colorspace_pars_fragment:dc,envmap_fragment:pc,envmap_common_pars_fragment:fc,envmap_pars_fragment:mc,envmap_pars_vertex:gc,envmap_physical_pars_fragment:Ac,envmap_vertex:_c,fog_vertex:vc,fog_pars_vertex:xc,fog_fragment:yc,fog_pars_fragment:Mc,gradientmap_pars_fragment:bc,lightmap_pars_fragment:Sc,lights_lambert_fragment:Ec,lights_lambert_pars_fragment:Tc,lights_pars_begin:wc,lights_toon_fragment:Rc,lights_toon_pars_fragment:Cc,lights_phong_fragment:Pc,lights_phong_pars_fragment:Ic,lights_physical_fragment:Lc,lights_physical_pars_fragment:Dc,lights_fragment_begin:Uc,lights_fragment_maps:Nc,lights_fragment_end:Oc,logdepthbuf_fragment:Fc,logdepthbuf_pars_fragment:zc,logdepthbuf_pars_vertex:Bc,logdepthbuf_vertex:kc,map_fragment:Hc,map_pars_fragment:Gc,map_particle_fragment:Vc,map_particle_pars_fragment:Wc,metalnessmap_fragment:Xc,metalnessmap_pars_fragment:jc,morphinstance_vertex:Yc,morphcolor_vertex:$c,morphnormal_vertex:qc,morphtarget_pars_vertex:Kc,morphtarget_vertex:Zc,normal_fragment_begin:Jc,normal_fragment_maps:Qc,normal_pars_fragment:eh,normal_pars_vertex:th,normal_vertex:ih,normalmap_pars_fragment:rh,clearcoat_normal_fragment_begin:ah,clearcoat_normal_fragment_maps:nh,clearcoat_pars_fragment:sh,iridescence_pars_fragment:oh,opaque_fragment:lh,packing:ch,premultiplied_alpha_fragment:hh,project_vertex:uh,dithering_fragment:dh,dithering_pars_fragment:ph,roughnessmap_fragment:fh,roughnessmap_pars_fragment:mh,shadowmap_pars_fragment:gh,shadowmap_pars_vertex:_h,shadowmap_vertex:vh,shadowmask_pars_fragment:xh,skinbase_vertex:yh,skinning_pars_vertex:Mh,skinning_vertex:bh,skinnormal_vertex:Sh,specularmap_fragment:Eh,specularmap_pars_fragment:Th,tonemapping_fragment:wh,tonemapping_pars_fragment:Ah,transmission_fragment:Rh,transmission_pars_fragment:Ch,uv_pars_fragment:Ph,uv_pars_vertex:Ih,uv_vertex:Lh,worldpos_vertex:Dh,background_vert:Uh,background_frag:Nh,backgroundCube_vert:Oh,backgroundCube_frag:Fh,cube_vert:zh,cube_frag:Bh,depth_vert:kh,depth_frag:Hh,distanceRGBA_vert:Gh,distanceRGBA_frag:Vh,equirect_vert:Wh,equirect_frag:Xh,linedashed_vert:jh,linedashed_frag:Yh,meshbasic_vert:$h,meshbasic_frag:qh,meshlambert_vert:Kh,meshlambert_frag:Zh,meshmatcap_vert:Jh,meshmatcap_frag:Qh,meshnormal_vert:eu,meshnormal_frag:tu,meshphong_vert:iu,meshphong_frag:ru,meshphysical_vert:au,meshphysical_frag:nu,meshtoon_vert:su,meshtoon_frag:ou,points_vert:lu,points_frag:cu,shadow_vert:hu,shadow_frag:uu,sprite_vert:du,sprite_frag:pu},oe={common:{diffuse:{value:new Me(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new De},alphaMap:{value:null},alphaMapTransform:{value:new De},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new De}},envmap:{envMap:{value:null},envMapRotation:{value:new De},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new De}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new De}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new De},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new De},normalScale:{value:new Ie(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new De},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new De}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new De}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new De}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Me(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Me(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new De},alphaTest:{value:0},uvTransform:{value:new De}},sprite:{diffuse:{value:new Me(16777215)},opacity:{value:1},center:{value:new Ie(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new De},alphaMap:{value:null},alphaMapTransform:{value:new De},alphaTest:{value:0}}},Xt={basic:{uniforms:bt([oe.common,oe.specularmap,oe.envmap,oe.aomap,oe.lightmap,oe.fog]),vertexShader:Ne.meshbasic_vert,fragmentShader:Ne.meshbasic_frag},lambert:{uniforms:bt([oe.common,oe.specularmap,oe.envmap,oe.aomap,oe.lightmap,oe.emissivemap,oe.bumpmap,oe.normalmap,oe.displacementmap,oe.fog,oe.lights,{emissive:{value:new Me(0)}}]),vertexShader:Ne.meshlambert_vert,fragmentShader:Ne.meshlambert_frag},phong:{uniforms:bt([oe.common,oe.specularmap,oe.envmap,oe.aomap,oe.lightmap,oe.emissivemap,oe.bumpmap,oe.normalmap,oe.displacementmap,oe.fog,oe.lights,{emissive:{value:new Me(0)},specular:{value:new Me(1118481)},shininess:{value:30}}]),vertexShader:Ne.meshphong_vert,fragmentShader:Ne.meshphong_frag},standard:{uniforms:bt([oe.common,oe.envmap,oe.aomap,oe.lightmap,oe.emissivemap,oe.bumpmap,oe.normalmap,oe.displacementmap,oe.roughnessmap,oe.metalnessmap,oe.fog,oe.lights,{emissive:{value:new Me(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Ne.meshphysical_vert,fragmentShader:Ne.meshphysical_frag},toon:{uniforms:bt([oe.common,oe.aomap,oe.lightmap,oe.emissivemap,oe.bumpmap,oe.normalmap,oe.displacementmap,oe.gradientmap,oe.fog,oe.lights,{emissive:{value:new Me(0)}}]),vertexShader:Ne.meshtoon_vert,fragmentShader:Ne.meshtoon_frag},matcap:{uniforms:bt([oe.common,oe.bumpmap,oe.normalmap,oe.displacementmap,oe.fog,{matcap:{value:null}}]),vertexShader:Ne.meshmatcap_vert,fragmentShader:Ne.meshmatcap_frag},points:{uniforms:bt([oe.points,oe.fog]),vertexShader:Ne.points_vert,fragmentShader:Ne.points_frag},dashed:{uniforms:bt([oe.common,oe.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Ne.linedashed_vert,fragmentShader:Ne.linedashed_frag},depth:{uniforms:bt([oe.common,oe.displacementmap]),vertexShader:Ne.depth_vert,fragmentShader:Ne.depth_frag},normal:{uniforms:bt([oe.common,oe.bumpmap,oe.normalmap,oe.displacementmap,{opacity:{value:1}}]),vertexShader:Ne.meshnormal_vert,fragmentShader:Ne.meshnormal_frag},sprite:{uniforms:bt([oe.sprite,oe.fog]),vertexShader:Ne.sprite_vert,fragmentShader:Ne.sprite_frag},background:{uniforms:{uvTransform:{value:new De},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Ne.background_vert,fragmentShader:Ne.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new De}},vertexShader:Ne.backgroundCube_vert,fragmentShader:Ne.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Ne.cube_vert,fragmentShader:Ne.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Ne.equirect_vert,fragmentShader:Ne.equirect_frag},distanceRGBA:{uniforms:bt([oe.common,oe.displacementmap,{referencePosition:{value:new R},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Ne.distanceRGBA_vert,fragmentShader:Ne.distanceRGBA_frag},shadow:{uniforms:bt([oe.lights,oe.fog,{color:{value:new Me(0)},opacity:{value:1}}]),vertexShader:Ne.shadow_vert,fragmentShader:Ne.shadow_frag}};Xt.physical={uniforms:bt([Xt.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new De},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new De},clearcoatNormalScale:{value:new Ie(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new De},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new De},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new De},sheen:{value:0},sheenColor:{value:new Me(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new De},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new De},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new De},transmissionSamplerSize:{value:new Ie},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new De},attenuationDistance:{value:0},attenuationColor:{value:new Me(0)},specularColor:{value:new Me(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new De},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new De},anisotropyVector:{value:new Ie},anisotropyMap:{value:null},anisotropyMapTransform:{value:new De}}]),vertexShader:Ne.meshphysical_vert,fragmentShader:Ne.meshphysical_frag};const ra={r:0,b:0,g:0},vi=new hi,fu=new Je;function mu(r,e,t,i,a,n,s){const o=new Me(0);let l=n===!0?0:1,c,h,d=null,u=0,f=null;function g(S){let E=S.isScene===!0?S.background:null;return E&&E.isTexture&&(E=(S.backgroundBlurriness>0?t:e).get(E)),E}function _(S){let E=!1;const M=g(S);M===null?p(o,l):M&&M.isColor&&(p(M,1),E=!0);const N=r.xr.getEnvironmentBlendMode();N==="additive"?i.buffers.color.setClear(0,0,0,1,s):N==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,s),(r.autoClear||E)&&(i.buffers.depth.setTest(!0),i.buffers.depth.setMask(!0),i.buffers.color.setMask(!0),r.clear(r.autoClearColor,r.autoClearDepth,r.autoClearStencil))}function m(S,E){const M=g(E);M&&(M.isCubeTexture||M.mapping===306)?(h===void 0&&(h=new Ze(new Tn(1,1,1),new Tt({name:"BackgroundCubeMaterial",uniforms:ir(Xt.backgroundCube.uniforms),vertexShader:Xt.backgroundCube.vertexShader,fragmentShader:Xt.backgroundCube.fragmentShader,side:1,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(N,A,w){this.matrixWorld.copyPosition(w.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),a.update(h)),vi.copy(E.backgroundRotation),vi.x*=-1,vi.y*=-1,vi.z*=-1,M.isCubeTexture&&M.isRenderTargetTexture===!1&&(vi.y*=-1,vi.z*=-1),h.material.uniforms.envMap.value=M,h.material.uniforms.flipEnvMap.value=M.isCubeTexture&&M.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=E.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=E.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(fu.makeRotationFromEuler(vi)),h.material.toneMapped=Ge.getTransfer(M.colorSpace)!==$e,(d!==M||u!==M.version||f!==r.toneMapping)&&(h.material.needsUpdate=!0,d=M,u=M.version,f=r.toneMapping),h.layers.enableAll(),S.unshift(h,h.geometry,h.material,0,0,null)):M&&M.isTexture&&(c===void 0&&(c=new Ze(new To(2,2),new Tt({name:"BackgroundMaterial",uniforms:ir(Xt.background.uniforms),vertexShader:Xt.background.vertexShader,fragmentShader:Xt.background.fragmentShader,side:0,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),a.update(c)),c.material.uniforms.t2D.value=M,c.material.uniforms.backgroundIntensity.value=E.backgroundIntensity,c.material.toneMapped=Ge.getTransfer(M.colorSpace)!==$e,M.matrixAutoUpdate===!0&&M.updateMatrix(),c.material.uniforms.uvTransform.value.copy(M.matrix),(d!==M||u!==M.version||f!==r.toneMapping)&&(c.material.needsUpdate=!0,d=M,u=M.version,f=r.toneMapping),c.layers.enableAll(),S.unshift(c,c.geometry,c.material,0,0,null))}function p(S,E){S.getRGB(ra,Mo(r)),i.buffers.color.setClear(ra.r,ra.g,ra.b,E,s)}return{getClearColor:function(){return o},setClearColor:function(S,E=1){o.set(S),l=E,p(o,l)},getClearAlpha:function(){return l},setClearAlpha:function(S){l=S,p(o,l)},render:_,addToRenderList:m}}function gu(r,e){const t=r.getParameter(r.MAX_VERTEX_ATTRIBS),i={},a=u(null);let n=a,s=!1;function o(x,C,F,k,X){let K=!1;const j=d(k,F,C);n!==j&&(n=j,c(n.object)),K=f(x,k,F,X),K&&g(x,k,F,X),X!==null&&e.update(X,r.ELEMENT_ARRAY_BUFFER),(K||s)&&(s=!1,M(x,C,F,k),X!==null&&r.bindBuffer(r.ELEMENT_ARRAY_BUFFER,e.get(X).buffer))}function l(){return r.createVertexArray()}function c(x){return r.bindVertexArray(x)}function h(x){return r.deleteVertexArray(x)}function d(x,C,F){const k=F.wireframe===!0;let X=i[x.id];X===void 0&&(X={},i[x.id]=X);let K=X[C.id];K===void 0&&(K={},X[C.id]=K);let j=K[k];return j===void 0&&(j=u(l()),K[k]=j),j}function u(x){const C=[],F=[],k=[];for(let X=0;X<t;X++)C[X]=0,F[X]=0,k[X]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:C,enabledAttributes:F,attributeDivisors:k,object:x,attributes:{},index:null}}function f(x,C,F,k){const X=n.attributes,K=C.attributes;let j=0;const ee=F.getAttributes();for(const W in ee)if(ee[W].location>=0){const ae=X[W];let pe=K[W];if(pe===void 0&&(W==="instanceMatrix"&&x.instanceMatrix&&(pe=x.instanceMatrix),W==="instanceColor"&&x.instanceColor&&(pe=x.instanceColor)),ae===void 0||ae.attribute!==pe||pe&&ae.data!==pe.data)return!0;j++}return n.attributesNum!==j||n.index!==k}function g(x,C,F,k){const X={},K=C.attributes;let j=0;const ee=F.getAttributes();for(const W in ee)if(ee[W].location>=0){let ae=K[W];ae===void 0&&(W==="instanceMatrix"&&x.instanceMatrix&&(ae=x.instanceMatrix),W==="instanceColor"&&x.instanceColor&&(ae=x.instanceColor));const pe={};pe.attribute=ae,ae&&ae.data&&(pe.data=ae.data),X[W]=pe,j++}n.attributes=X,n.attributesNum=j,n.index=k}function _(){const x=n.newAttributes;for(let C=0,F=x.length;C<F;C++)x[C]=0}function m(x){p(x,0)}function p(x,C){const F=n.newAttributes,k=n.enabledAttributes,X=n.attributeDivisors;F[x]=1,k[x]===0&&(r.enableVertexAttribArray(x),k[x]=1),X[x]!==C&&(r.vertexAttribDivisor(x,C),X[x]=C)}function S(){const x=n.newAttributes,C=n.enabledAttributes;for(let F=0,k=C.length;F<k;F++)C[F]!==x[F]&&(r.disableVertexAttribArray(F),C[F]=0)}function E(x,C,F,k,X,K,j){j===!0?r.vertexAttribIPointer(x,C,F,X,K):r.vertexAttribPointer(x,C,F,k,X,K)}function M(x,C,F,k){_();const X=k.attributes,K=F.getAttributes(),j=C.defaultAttributeValues;for(const ee in K){const W=K[ee];if(W.location>=0){let ae=X[ee];if(ae===void 0&&(ee==="instanceMatrix"&&x.instanceMatrix&&(ae=x.instanceMatrix),ee==="instanceColor"&&x.instanceColor&&(ae=x.instanceColor)),ae!==void 0){const pe=ae.normalized,Ae=ae.itemSize,Z=e.get(ae);if(Z===void 0)continue;const re=Z.buffer,O=Z.type,G=Z.bytesPerElement,ne=O===r.INT||O===r.UNSIGNED_INT||ae.gpuType===1013;if(ae.isInterleavedBufferAttribute){const te=ae.data,he=te.stride,be=ae.offset;if(te.isInstancedInterleavedBuffer){for(let Ce=0;Ce<W.locationSize;Ce++)p(W.location+Ce,te.meshPerAttribute);x.isInstancedMesh!==!0&&k._maxInstanceCount===void 0&&(k._maxInstanceCount=te.meshPerAttribute*te.count)}else for(let Ce=0;Ce<W.locationSize;Ce++)m(W.location+Ce);r.bindBuffer(r.ARRAY_BUFFER,re);for(let Ce=0;Ce<W.locationSize;Ce++)E(W.location+Ce,Ae/W.locationSize,O,pe,he*G,(be+Ae/W.locationSize*Ce)*G,ne)}else{if(ae.isInstancedBufferAttribute){for(let te=0;te<W.locationSize;te++)p(W.location+te,ae.meshPerAttribute);x.isInstancedMesh!==!0&&k._maxInstanceCount===void 0&&(k._maxInstanceCount=ae.meshPerAttribute*ae.count)}else for(let te=0;te<W.locationSize;te++)m(W.location+te);r.bindBuffer(r.ARRAY_BUFFER,re);for(let te=0;te<W.locationSize;te++)E(W.location+te,Ae/W.locationSize,O,pe,Ae*G,Ae/W.locationSize*te*G,ne)}}else if(j!==void 0){const pe=j[ee];if(pe!==void 0)switch(pe.length){case 2:r.vertexAttrib2fv(W.location,pe);break;case 3:r.vertexAttrib3fv(W.location,pe);break;case 4:r.vertexAttrib4fv(W.location,pe);break;default:r.vertexAttrib1fv(W.location,pe)}}}}S()}function N(){P();for(const x in i){const C=i[x];for(const F in C){const k=C[F];for(const X in k)h(k[X].object),delete k[X];delete C[F]}delete i[x]}}function A(x){if(i[x.id]===void 0)return;const C=i[x.id];for(const F in C){const k=C[F];for(const X in k)h(k[X].object),delete k[X];delete C[F]}delete i[x.id]}function w(x){for(const C in i){const F=i[C];if(F[x.id]===void 0)continue;const k=F[x.id];for(const X in k)h(k[X].object),delete k[X];delete F[x.id]}}function P(){b(),s=!0,n!==a&&(n=a,c(n.object))}function b(){a.geometry=null,a.program=null,a.wireframe=!1}return{setup:o,reset:P,resetDefaultState:b,dispose:N,releaseStatesOfGeometry:A,releaseStatesOfProgram:w,initAttributes:_,enableAttribute:m,disableUnusedAttributes:S}}function _u(r,e,t){let i;function a(c){i=c}function n(c,h){r.drawArrays(i,c,h),t.update(h,i,1)}function s(c,h,d){d!==0&&(r.drawArraysInstanced(i,c,h,d),t.update(h,i,d))}function o(c,h,d){if(d===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,c,0,h,0,d);let u=0;for(let f=0;f<d;f++)u+=h[f];t.update(u,i,1)}function l(c,h,d,u){if(d===0)return;const f=e.get("WEBGL_multi_draw");if(f===null)for(let g=0;g<c.length;g++)s(c[g],h[g],u[g]);else{f.multiDrawArraysInstancedWEBGL(i,c,0,h,0,u,0,d);let g=0;for(let _=0;_<d;_++)g+=h[_]*u[_];t.update(g,i,1)}}this.setMode=a,this.render=n,this.renderInstances=s,this.renderMultiDraw=o,this.renderMultiDrawInstances=l}function vu(r,e,t,i){let a;function n(){if(a!==void 0)return a;if(e.has("EXT_texture_filter_anisotropic")===!0){const w=e.get("EXT_texture_filter_anisotropic");a=r.getParameter(w.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else a=0;return a}function s(w){return!(w!==1023&&i.convert(w)!==r.getParameter(r.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(w){const P=w===1016&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(w!==1009&&i.convert(w)!==r.getParameter(r.IMPLEMENTATION_COLOR_READ_TYPE)&&w!==1015&&!P)}function l(w){if(w==="highp"){if(r.getShaderPrecisionFormat(r.VERTEX_SHADER,r.HIGH_FLOAT).precision>0&&r.getShaderPrecisionFormat(r.FRAGMENT_SHADER,r.HIGH_FLOAT).precision>0)return"highp";w="mediump"}return w==="mediump"&&r.getShaderPrecisionFormat(r.VERTEX_SHADER,r.MEDIUM_FLOAT).precision>0&&r.getShaderPrecisionFormat(r.FRAGMENT_SHADER,r.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp";const h=l(c);h!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);const d=t.logarithmicDepthBuffer===!0,u=t.reverseDepthBuffer===!0&&e.has("EXT_clip_control"),f=r.getParameter(r.MAX_TEXTURE_IMAGE_UNITS),g=r.getParameter(r.MAX_VERTEX_TEXTURE_IMAGE_UNITS),_=r.getParameter(r.MAX_TEXTURE_SIZE),m=r.getParameter(r.MAX_CUBE_MAP_TEXTURE_SIZE),p=r.getParameter(r.MAX_VERTEX_ATTRIBS),S=r.getParameter(r.MAX_VERTEX_UNIFORM_VECTORS),E=r.getParameter(r.MAX_VARYING_VECTORS),M=r.getParameter(r.MAX_FRAGMENT_UNIFORM_VECTORS),N=g>0,A=r.getParameter(r.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:n,getMaxPrecision:l,textureFormatReadable:s,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:d,reverseDepthBuffer:u,maxTextures:f,maxVertexTextures:g,maxTextureSize:_,maxCubemapSize:m,maxAttributes:p,maxVertexUniforms:S,maxVaryings:E,maxFragmentUniforms:M,vertexTextures:N,maxSamples:A}}function xu(r){const e=this;let t=null,i=0,a=!1,n=!1;const s=new ci,o=new De,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(d,u){const f=d.length!==0||u||i!==0||a;return a=u,i=d.length,f},this.beginShadows=function(){n=!0,h(null)},this.endShadows=function(){n=!1},this.setGlobalState=function(d,u){t=h(d,u,0)},this.setState=function(d,u,f){const g=d.clippingPlanes,_=d.clipIntersection,m=d.clipShadows,p=r.get(d);if(!a||g===null||g.length===0||n&&!m)n?h(null):c();else{const S=n?0:i,E=S*4;let M=p.clippingState||null;l.value=M,M=h(g,u,E,f);for(let N=0;N!==E;++N)M[N]=t[N];p.clippingState=M,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=S}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=i>0),e.numPlanes=i,e.numIntersection=0}function h(d,u,f,g){const _=d!==null?d.length:0;let m=null;if(_!==0){if(m=l.value,g!==!0||m===null){const p=f+_*4,S=u.matrixWorldInverse;o.getNormalMatrix(S),(m===null||m.length<p)&&(m=new Float32Array(p));for(let E=0,M=f;E!==_;++E,M+=4)s.copy(d[E]).applyMatrix4(S,o),s.normal.toArray(m,M),m[M+3]=s.constant}l.value=m,l.needsUpdate=!0}return e.numPlanes=_,e.numIntersection=0,m}}function yu(r){let e=new WeakMap;function t(s,o){return o===303?s.mapping=301:o===304&&(s.mapping=302),s}function i(s){if(s&&s.isTexture){const o=s.mapping;if(o===303||o===304)if(e.has(s)){const l=e.get(s).texture;return t(l,s.mapping)}else{const l=s.image;if(l&&l.height>0){const c=new Il(l.height);return c.fromEquirectangularTexture(r,s),e.set(s,c),s.addEventListener("dispose",a),t(c.texture,s.mapping)}else return null}}return s}function a(s){const o=s.target;o.removeEventListener("dispose",a);const l=e.get(o);l!==void 0&&(e.delete(o),l.dispose())}function n(){e=new WeakMap}return{get:i,dispose:n}}class Mu extends bo{constructor(e=-1,t=1,i=1,a=-1,n=.1,s=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=i,this.bottom=a,this.near=n,this.far=s,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,i,a,n,s){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=a,this.view.width=n,this.view.height=s,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,a=(this.top+this.bottom)/2;let n=i-e,s=i+e,o=a+t,l=a-t;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;n+=c*this.view.offsetX,s=n+c*this.view.width,o-=h*this.view.offsetY,l=o-h*this.view.height}this.projectionMatrix.makeOrthographic(n,s,o,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}const er=4,fs=[.125,.215,.35,.446,.526,.582],Mi=20,Va=new Mu,ms=new Me;let Wa=null,Xa=0,ja=0,Ya=!1;const yi=(1+Math.sqrt(5))/2,Xi=1/yi,gs=[new R(-yi,Xi,0),new R(yi,Xi,0),new R(-Xi,0,yi),new R(Xi,0,yi),new R(0,yi,-Xi),new R(0,yi,Xi),new R(-1,1,-1),new R(1,1,-1),new R(-1,1,1),new R(1,1,1)];class _s{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,i=.1,a=100){Wa=this._renderer.getRenderTarget(),Xa=this._renderer.getActiveCubeFace(),ja=this._renderer.getActiveMipmapLevel(),Ya=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const n=this._allocateTargets();return n.depthBuffer=!0,this._sceneToCubeUV(e,i,a,n),t>0&&this._blur(n,0,0,t),this._applyPMREM(n),this._cleanup(n),n}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=ys(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=xs(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(Wa,Xa,ja),this._renderer.xr.enabled=Ya,e.scissorTest=!1,aa(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===301||e.mapping===302?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Wa=this._renderer.getRenderTarget(),Xa=this._renderer.getActiveCubeFace(),ja=this._renderer.getActiveMipmapLevel(),Ya=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=t||this._allocateTargets();return this._textureToCubeUV(e,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,i={magFilter:1006,minFilter:1006,generateMipmaps:!1,type:1016,format:1023,colorSpace:ar,depthBuffer:!1},a=vs(e,t,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=vs(e,t,i);const{_lodMax:n}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=bu(n)),this._blurMaterial=Su(n,e,t)}return a}_compileMaterial(e){const t=new Ze(this._lodPlanes[0],e);this._renderer.compile(t,Va)}_sceneToCubeUV(e,t,i,a){const n=new Ct(90,1,t,i),s=[1,-1,1,1,1,1],o=[1,1,1,-1,-1,-1],l=this._renderer,c=l.autoClear,h=l.toneMapping;l.getClearColor(ms),l.toneMapping=0,l.autoClear=!1;const d=new Yt({name:"PMREM.Background",side:1,depthWrite:!1,depthTest:!1}),u=new Ze(new Tn,d);let f=!1;const g=e.background;g?g.isColor&&(d.color.copy(g),e.background=null,f=!0):(d.color.copy(ms),f=!0);for(let _=0;_<6;_++){const m=_%3;m===0?(n.up.set(0,s[_],0),n.lookAt(o[_],0,0)):m===1?(n.up.set(0,0,s[_]),n.lookAt(0,o[_],0)):(n.up.set(0,s[_],0),n.lookAt(0,0,o[_]));const p=this._cubeSize;aa(a,m*p,_>2?p:0,p,p),l.setRenderTarget(a),f&&l.render(u,n),l.render(e,n)}u.geometry.dispose(),u.material.dispose(),l.toneMapping=h,l.autoClear=c,e.background=g}_textureToCubeUV(e,t){const i=this._renderer,a=e.mapping===301||e.mapping===302;a?(this._cubemapMaterial===null&&(this._cubemapMaterial=ys()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=xs());const n=a?this._cubemapMaterial:this._equirectMaterial,s=new Ze(this._lodPlanes[0],n),o=n.uniforms;o.envMap.value=e;const l=this._cubeSize;aa(t,0,0,3*l,2*l),i.setRenderTarget(t),i.render(s,Va)}_applyPMREM(e){const t=this._renderer,i=t.autoClear;t.autoClear=!1;const a=this._lodPlanes.length;for(let n=1;n<a;n++){const s=Math.sqrt(this._sigmas[n]*this._sigmas[n]-this._sigmas[n-1]*this._sigmas[n-1]),o=gs[(a-n-1)%gs.length];this._blur(e,n-1,n,s,o)}t.autoClear=i}_blur(e,t,i,a,n){const s=this._pingPongRenderTarget;this._halfBlur(e,s,t,i,a,"latitudinal",n),this._halfBlur(s,e,i,i,a,"longitudinal",n)}_halfBlur(e,t,i,a,n,s,o){const l=this._renderer,c=this._blurMaterial;s!=="latitudinal"&&s!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const h=3,d=new Ze(this._lodPlanes[a],c),u=c.uniforms,f=this._sizeLods[i]-1,g=isFinite(n)?Math.PI/(2*f):2*Math.PI/(2*Mi-1),_=n/g,m=isFinite(n)?1+Math.floor(h*_):Mi;m>Mi&&console.warn(`sigmaRadians, ${n}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${Mi}`);const p=[];let S=0;for(let w=0;w<Mi;++w){const P=w/_,b=Math.exp(-P*P/2);p.push(b),w===0?S+=b:w<m&&(S+=2*b)}for(let w=0;w<p.length;w++)p[w]=p[w]/S;u.envMap.value=e.texture,u.samples.value=m,u.weights.value=p,u.latitudinal.value=s==="latitudinal",o&&(u.poleAxis.value=o);const{_lodMax:E}=this;u.dTheta.value=g,u.mipInt.value=E-i;const M=this._sizeLods[a],N=3*M*(a>E-er?a-E+er:0),A=4*(this._cubeSize-M);aa(t,N,A,3*M,2*M),l.setRenderTarget(t),l.render(d,Va)}}function bu(r){const e=[],t=[],i=[];let a=r;const n=r-er+1+fs.length;for(let s=0;s<n;s++){const o=Math.pow(2,a);t.push(o);let l=1/o;s>r-er?l=fs[s-r+er-1]:s===0&&(l=0),i.push(l);const c=1/(o-2),h=-c,d=1+c,u=[h,h,d,h,d,d,h,h,d,d,h,d],f=6,g=6,_=3,m=2,p=1,S=new Float32Array(_*g*f),E=new Float32Array(m*g*f),M=new Float32Array(p*g*f);for(let A=0;A<f;A++){const w=A%3*2/3-1,P=A>2?0:-1,b=[w,P,0,w+2/3,P,0,w+2/3,P+1,0,w,P,0,w+2/3,P+1,0,w,P+1,0];S.set(b,_*g*A),E.set(u,m*g*A);const x=[A,A,A,A,A,A];M.set(x,p*g*A)}const N=new mt;N.setAttribute("position",new ot(S,_)),N.setAttribute("uv",new ot(E,m)),N.setAttribute("faceIndex",new ot(M,p)),e.push(N),a>er&&a--}return{lodPlanes:e,sizeLods:t,sigmas:i}}function vs(r,e,t){const i=new Ei(r,e,t);return i.texture.mapping=306,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function aa(r,e,t,i,a){r.viewport.set(e,t,i,a),r.scissor.set(e,t,i,a)}function Su(r,e,t){const i=new Float32Array(Mi),a=new R(0,1,0);return new Tt({name:"SphericalGaussianBlur",defines:{n:Mi,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${r}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:a}},vertexShader:An(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function xs(){return new Tt({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:An(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function ys(){return new Tt({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:An(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function An(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function Eu(r){let e=new WeakMap,t=null;function i(o){if(o&&o.isTexture){const l=o.mapping,c=l===303||l===304,h=l===301||l===302;if(c||h){let d=e.get(o);const u=d!==void 0?d.texture.pmremVersion:0;if(o.isRenderTargetTexture&&o.pmremVersion!==u)return t===null&&(t=new _s(r)),d=c?t.fromEquirectangular(o,d):t.fromCubemap(o,d),d.texture.pmremVersion=o.pmremVersion,e.set(o,d),d.texture;if(d!==void 0)return d.texture;{const f=o.image;return c&&f&&f.height>0||h&&f&&a(f)?(t===null&&(t=new _s(r)),d=c?t.fromEquirectangular(o):t.fromCubemap(o),d.texture.pmremVersion=o.pmremVersion,e.set(o,d),o.addEventListener("dispose",n),d.texture):null}}}return o}function a(o){let l=0;const c=6;for(let h=0;h<c;h++)o[h]!==void 0&&l++;return l===c}function n(o){const l=o.target;l.removeEventListener("dispose",n);const c=e.get(l);c!==void 0&&(e.delete(l),c.dispose())}function s(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:i,dispose:s}}function Tu(r){const e={};function t(i){if(e[i]!==void 0)return e[i];let a;switch(i){case"WEBGL_depth_texture":a=r.getExtension("WEBGL_depth_texture")||r.getExtension("MOZ_WEBGL_depth_texture")||r.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":a=r.getExtension("EXT_texture_filter_anisotropic")||r.getExtension("MOZ_EXT_texture_filter_anisotropic")||r.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":a=r.getExtension("WEBGL_compressed_texture_s3tc")||r.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||r.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":a=r.getExtension("WEBGL_compressed_texture_pvrtc")||r.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:a=r.getExtension(i)}return e[i]=a,a}return{has:function(i){return t(i)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(i){const a=t(i);return a===null&&Tr("THREE.WebGLRenderer: "+i+" extension not supported."),a}}}function wu(r,e,t,i){const a={},n=new WeakMap;function s(d){const u=d.target;u.index!==null&&e.remove(u.index);for(const g in u.attributes)e.remove(u.attributes[g]);for(const g in u.morphAttributes){const _=u.morphAttributes[g];for(let m=0,p=_.length;m<p;m++)e.remove(_[m])}u.removeEventListener("dispose",s),delete a[u.id];const f=n.get(u);f&&(e.remove(f),n.delete(u)),i.releaseStatesOfGeometry(u),u.isInstancedBufferGeometry===!0&&delete u._maxInstanceCount,t.memory.geometries--}function o(d,u){return a[u.id]===!0||(u.addEventListener("dispose",s),a[u.id]=!0,t.memory.geometries++),u}function l(d){const u=d.attributes;for(const g in u)e.update(u[g],r.ARRAY_BUFFER);const f=d.morphAttributes;for(const g in f){const _=f[g];for(let m=0,p=_.length;m<p;m++)e.update(_[m],r.ARRAY_BUFFER)}}function c(d){const u=[],f=d.index,g=d.attributes.position;let _=0;if(f!==null){const S=f.array;_=f.version;for(let E=0,M=S.length;E<M;E+=3){const N=S[E+0],A=S[E+1],w=S[E+2];u.push(N,A,A,w,w,N)}}else if(g!==void 0){const S=g.array;_=g.version;for(let E=0,M=S.length/3-1;E<M;E+=3){const N=E+0,A=E+1,w=E+2;u.push(N,A,A,w,w,N)}}else return;const m=new(ho(u)?vo:_o)(u,1);m.version=_;const p=n.get(d);p&&e.remove(p),n.set(d,m)}function h(d){const u=n.get(d);if(u){const f=d.index;f!==null&&u.version<f.version&&c(d)}else c(d);return n.get(d)}return{get:o,update:l,getWireframeAttribute:h}}function Au(r,e,t){let i;function a(u){i=u}let n,s;function o(u){n=u.type,s=u.bytesPerElement}function l(u,f){r.drawElements(i,f,n,u*s),t.update(f,i,1)}function c(u,f,g){g!==0&&(r.drawElementsInstanced(i,f,n,u*s,g),t.update(f,i,g))}function h(u,f,g){if(g===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,f,0,n,u,0,g);let _=0;for(let m=0;m<g;m++)_+=f[m];t.update(_,i,1)}function d(u,f,g,_){if(g===0)return;const m=e.get("WEBGL_multi_draw");if(m===null)for(let p=0;p<u.length;p++)c(u[p]/s,f[p],_[p]);else{m.multiDrawElementsInstancedWEBGL(i,f,0,n,u,0,_,0,g);let p=0;for(let S=0;S<g;S++)p+=f[S]*_[S];t.update(p,i,1)}}this.setMode=a,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=h,this.renderMultiDrawInstances=d}function Ru(r){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function i(n,s,o){switch(t.calls++,s){case r.TRIANGLES:t.triangles+=o*(n/3);break;case r.LINES:t.lines+=o*(n/2);break;case r.LINE_STRIP:t.lines+=o*(n-1);break;case r.LINE_LOOP:t.lines+=o*n;break;case r.POINTS:t.points+=o*n;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",s);break}}function a(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:a,update:i}}function Cu(r,e,t){const i=new WeakMap,a=new Ke;function n(s,o,l){const c=s.morphTargetInfluences,h=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,d=h!==void 0?h.length:0;let u=i.get(o);if(u===void 0||u.count!==d){let f=function(){P.dispose(),i.delete(o),o.removeEventListener("dispose",f)};u!==void 0&&u.texture.dispose();const g=o.morphAttributes.position!==void 0,_=o.morphAttributes.normal!==void 0,m=o.morphAttributes.color!==void 0,p=o.morphAttributes.position||[],S=o.morphAttributes.normal||[],E=o.morphAttributes.color||[];let M=0;g===!0&&(M=1),_===!0&&(M=2),m===!0&&(M=3);let N=o.attributes.position.count*M,A=1;N>e.maxTextureSize&&(A=Math.ceil(N/e.maxTextureSize),N=e.maxTextureSize);const w=new Float32Array(N*A*4*d),P=new fo(w,N,A,d);P.type=1015,P.needsUpdate=!0;const b=M*4;for(let x=0;x<d;x++){const C=p[x],F=S[x],k=E[x],X=N*A*4*x;for(let K=0;K<C.count;K++){const j=K*b;g===!0&&(a.fromBufferAttribute(C,K),w[X+j+0]=a.x,w[X+j+1]=a.y,w[X+j+2]=a.z,w[X+j+3]=0),_===!0&&(a.fromBufferAttribute(F,K),w[X+j+4]=a.x,w[X+j+5]=a.y,w[X+j+6]=a.z,w[X+j+7]=0),m===!0&&(a.fromBufferAttribute(k,K),w[X+j+8]=a.x,w[X+j+9]=a.y,w[X+j+10]=a.z,w[X+j+11]=k.itemSize===4?a.w:1)}}u={count:d,texture:P,size:new Ie(N,A)},i.set(o,u),o.addEventListener("dispose",f)}if(s.isInstancedMesh===!0&&s.morphTexture!==null)l.getUniforms().setValue(r,"morphTexture",s.morphTexture,t);else{let f=0;for(let _=0;_<c.length;_++)f+=c[_];const g=o.morphTargetsRelative?1:1-f;l.getUniforms().setValue(r,"morphTargetBaseInfluence",g),l.getUniforms().setValue(r,"morphTargetInfluences",c)}l.getUniforms().setValue(r,"morphTargetsTexture",u.texture,t),l.getUniforms().setValue(r,"morphTargetsTextureSize",u.size)}return{update:n}}function Pu(r,e,t,i){let a=new WeakMap;function n(l){const c=i.render.frame,h=l.geometry,d=e.get(l,h);if(a.get(d)!==c&&(e.update(d),a.set(d,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",o)===!1&&l.addEventListener("dispose",o),a.get(l)!==c&&(t.update(l.instanceMatrix,r.ARRAY_BUFFER),l.instanceColor!==null&&t.update(l.instanceColor,r.ARRAY_BUFFER),a.set(l,c))),l.isSkinnedMesh){const u=l.skeleton;a.get(u)!==c&&(u.update(),a.set(u,c))}return d}function s(){a=new WeakMap}function o(l){const c=l.target;c.removeEventListener("dispose",o),t.remove(c.instanceMatrix),c.instanceColor!==null&&t.remove(c.instanceColor)}return{update:n,dispose:s}}class Ao extends yt{constructor(e,t,i,a,n,s,o,l,c,h=1026){if(h!==1026&&h!==1027)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");i===void 0&&h===1026&&(i=1014),i===void 0&&h===1027&&(i=1020),super(null,a,n,s,o,l,h,i,c),this.isDepthTexture=!0,this.image={width:e,height:t},this.magFilter=o!==void 0?o:1003,this.minFilter=l!==void 0?l:1003,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}const Ro=new yt,Ms=new Ao(1,1),Co=new fo,Po=new ml,Io=new So,bs=[],Ss=[],Es=new Float32Array(16),Ts=new Float32Array(9),ws=new Float32Array(4);function or(r,e,t){const i=r[0];if(i<=0||i>0)return r;const a=e*t;let n=bs[a];if(n===void 0&&(n=new Float32Array(a),bs[a]=n),e!==0){i.toArray(n,0);for(let s=1,o=0;s!==e;++s)o+=t,r[s].toArray(n,o)}return n}function ut(r,e){if(r.length!==e.length)return!1;for(let t=0,i=r.length;t<i;t++)if(r[t]!==e[t])return!1;return!0}function dt(r,e){for(let t=0,i=e.length;t<i;t++)r[t]=e[t]}function xa(r,e){let t=Ss[e];t===void 0&&(t=new Int32Array(e),Ss[e]=t);for(let i=0;i!==e;++i)t[i]=r.allocateTextureUnit();return t}function Iu(r,e){const t=this.cache;t[0]!==e&&(r.uniform1f(this.addr,e),t[0]=e)}function Lu(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(r.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(ut(t,e))return;r.uniform2fv(this.addr,e),dt(t,e)}}function Du(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(r.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(r.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(ut(t,e))return;r.uniform3fv(this.addr,e),dt(t,e)}}function Uu(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(r.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(ut(t,e))return;r.uniform4fv(this.addr,e),dt(t,e)}}function Nu(r,e){const t=this.cache,i=e.elements;if(i===void 0){if(ut(t,e))return;r.uniformMatrix2fv(this.addr,!1,e),dt(t,e)}else{if(ut(t,i))return;ws.set(i),r.uniformMatrix2fv(this.addr,!1,ws),dt(t,i)}}function Ou(r,e){const t=this.cache,i=e.elements;if(i===void 0){if(ut(t,e))return;r.uniformMatrix3fv(this.addr,!1,e),dt(t,e)}else{if(ut(t,i))return;Ts.set(i),r.uniformMatrix3fv(this.addr,!1,Ts),dt(t,i)}}function Fu(r,e){const t=this.cache,i=e.elements;if(i===void 0){if(ut(t,e))return;r.uniformMatrix4fv(this.addr,!1,e),dt(t,e)}else{if(ut(t,i))return;Es.set(i),r.uniformMatrix4fv(this.addr,!1,Es),dt(t,i)}}function zu(r,e){const t=this.cache;t[0]!==e&&(r.uniform1i(this.addr,e),t[0]=e)}function Bu(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(r.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(ut(t,e))return;r.uniform2iv(this.addr,e),dt(t,e)}}function ku(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(r.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(ut(t,e))return;r.uniform3iv(this.addr,e),dt(t,e)}}function Hu(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(r.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(ut(t,e))return;r.uniform4iv(this.addr,e),dt(t,e)}}function Gu(r,e){const t=this.cache;t[0]!==e&&(r.uniform1ui(this.addr,e),t[0]=e)}function Vu(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(r.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(ut(t,e))return;r.uniform2uiv(this.addr,e),dt(t,e)}}function Wu(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(r.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(ut(t,e))return;r.uniform3uiv(this.addr,e),dt(t,e)}}function Xu(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(r.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(ut(t,e))return;r.uniform4uiv(this.addr,e),dt(t,e)}}function ju(r,e,t){const i=this.cache,a=t.allocateTextureUnit();i[0]!==a&&(r.uniform1i(this.addr,a),i[0]=a);let n;this.type===r.SAMPLER_2D_SHADOW?(Ms.compareFunction=515,n=Ms):n=Ro,t.setTexture2D(e||n,a)}function Yu(r,e,t){const i=this.cache,a=t.allocateTextureUnit();i[0]!==a&&(r.uniform1i(this.addr,a),i[0]=a),t.setTexture3D(e||Po,a)}function $u(r,e,t){const i=this.cache,a=t.allocateTextureUnit();i[0]!==a&&(r.uniform1i(this.addr,a),i[0]=a),t.setTextureCube(e||Io,a)}function qu(r,e,t){const i=this.cache,a=t.allocateTextureUnit();i[0]!==a&&(r.uniform1i(this.addr,a),i[0]=a),t.setTexture2DArray(e||Co,a)}function Ku(r){switch(r){case 5126:return Iu;case 35664:return Lu;case 35665:return Du;case 35666:return Uu;case 35674:return Nu;case 35675:return Ou;case 35676:return Fu;case 5124:case 35670:return zu;case 35667:case 35671:return Bu;case 35668:case 35672:return ku;case 35669:case 35673:return Hu;case 5125:return Gu;case 36294:return Vu;case 36295:return Wu;case 36296:return Xu;case 35678:case 36198:case 36298:case 36306:case 35682:return ju;case 35679:case 36299:case 36307:return Yu;case 35680:case 36300:case 36308:case 36293:return $u;case 36289:case 36303:case 36311:case 36292:return qu}}function Zu(r,e){r.uniform1fv(this.addr,e)}function Ju(r,e){const t=or(e,this.size,2);r.uniform2fv(this.addr,t)}function Qu(r,e){const t=or(e,this.size,3);r.uniform3fv(this.addr,t)}function ed(r,e){const t=or(e,this.size,4);r.uniform4fv(this.addr,t)}function td(r,e){const t=or(e,this.size,4);r.uniformMatrix2fv(this.addr,!1,t)}function id(r,e){const t=or(e,this.size,9);r.uniformMatrix3fv(this.addr,!1,t)}function rd(r,e){const t=or(e,this.size,16);r.uniformMatrix4fv(this.addr,!1,t)}function ad(r,e){r.uniform1iv(this.addr,e)}function nd(r,e){r.uniform2iv(this.addr,e)}function sd(r,e){r.uniform3iv(this.addr,e)}function od(r,e){r.uniform4iv(this.addr,e)}function ld(r,e){r.uniform1uiv(this.addr,e)}function cd(r,e){r.uniform2uiv(this.addr,e)}function hd(r,e){r.uniform3uiv(this.addr,e)}function ud(r,e){r.uniform4uiv(this.addr,e)}function dd(r,e,t){const i=this.cache,a=e.length,n=xa(t,a);ut(i,n)||(r.uniform1iv(this.addr,n),dt(i,n));for(let s=0;s!==a;++s)t.setTexture2D(e[s]||Ro,n[s])}function pd(r,e,t){const i=this.cache,a=e.length,n=xa(t,a);ut(i,n)||(r.uniform1iv(this.addr,n),dt(i,n));for(let s=0;s!==a;++s)t.setTexture3D(e[s]||Po,n[s])}function fd(r,e,t){const i=this.cache,a=e.length,n=xa(t,a);ut(i,n)||(r.uniform1iv(this.addr,n),dt(i,n));for(let s=0;s!==a;++s)t.setTextureCube(e[s]||Io,n[s])}function md(r,e,t){const i=this.cache,a=e.length,n=xa(t,a);ut(i,n)||(r.uniform1iv(this.addr,n),dt(i,n));for(let s=0;s!==a;++s)t.setTexture2DArray(e[s]||Co,n[s])}function gd(r){switch(r){case 5126:return Zu;case 35664:return Ju;case 35665:return Qu;case 35666:return ed;case 35674:return td;case 35675:return id;case 35676:return rd;case 5124:case 35670:return ad;case 35667:case 35671:return nd;case 35668:case 35672:return sd;case 35669:case 35673:return od;case 5125:return ld;case 36294:return cd;case 36295:return hd;case 36296:return ud;case 35678:case 36198:case 36298:case 36306:case 35682:return dd;case 35679:case 36299:case 36307:return pd;case 35680:case 36300:case 36308:case 36293:return fd;case 36289:case 36303:case 36311:case 36292:return md}}class _d{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.setValue=Ku(t.type)}}class vd{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=gd(t.type)}}class xd{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,i){const a=this.seq;for(let n=0,s=a.length;n!==s;++n){const o=a[n];o.setValue(e,t[o.id],i)}}}const $a=/(\w+)(\])?(\[|\.)?/g;function As(r,e){r.seq.push(e),r.map[e.id]=e}function yd(r,e,t){const i=r.name,a=i.length;for($a.lastIndex=0;;){const n=$a.exec(i),s=$a.lastIndex;let o=n[1];const l=n[2]==="]",c=n[3];if(l&&(o=o|0),c===void 0||c==="["&&s+2===a){As(t,c===void 0?new _d(o,r,e):new vd(o,r,e));break}else{let h=t.map[o];h===void 0&&(h=new xd(o),As(t,h)),t=h}}}class ga{constructor(e,t){this.seq=[],this.map={};const i=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let a=0;a<i;++a){const n=e.getActiveUniform(t,a),s=e.getUniformLocation(t,n.name);yd(n,s,this)}}setValue(e,t,i,a){const n=this.map[t];n!==void 0&&n.setValue(e,i,a)}setOptional(e,t,i){const a=t[i];a!==void 0&&this.setValue(e,i,a)}static upload(e,t,i,a){for(let n=0,s=t.length;n!==s;++n){const o=t[n],l=i[o.id];l.needsUpdate!==!1&&o.setValue(e,l.value,a)}}static seqWithValue(e,t){const i=[];for(let a=0,n=e.length;a!==n;++a){const s=e[a];s.id in t&&i.push(s)}return i}}function Rs(r,e,t){const i=r.createShader(e);return r.shaderSource(i,t),r.compileShader(i),i}const Md=37297;let bd=0;function Sd(r,e){const t=r.split(`
`),i=[],a=Math.max(e-6,0),n=Math.min(e+6,t.length);for(let s=a;s<n;s++){const o=s+1;i.push(`${o===e?">":" "} ${o}: ${t[s]}`)}return i.join(`
`)}const Cs=new De;function Ed(r){Ge._getMatrix(Cs,Ge.workingColorSpace,r);const e=`mat3( ${Cs.elements.map(t=>t.toFixed(4))} )`;switch(Ge.getTransfer(r)){case va:return[e,"LinearTransferOETF"];case $e:return[e,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",r),[e,"LinearTransferOETF"]}}function Ps(r,e,t){const i=r.getShaderParameter(e,r.COMPILE_STATUS),a=r.getShaderInfoLog(e).trim();if(i&&a==="")return"";const n=/ERROR: 0:(\d+)/.exec(a);if(n){const s=parseInt(n[1]);return t.toUpperCase()+`

`+a+`

`+Sd(r.getShaderSource(e),s)}else return a}function Td(r,e){const t=Ed(e);return[`vec4 ${r}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}function wd(r,e){let t;switch(e){case 1:t="Linear";break;case 2:t="Reinhard";break;case 3:t="Cineon";break;case 4:t="ACESFilmic";break;case 6:t="AgX";break;case 7:t="Neutral";break;case 5:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+r+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const na=new R;function Ad(){Ge.getLuminanceCoefficients(na);const r=na.x.toFixed(4),e=na.y.toFixed(4),t=na.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${r}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function Rd(r){return[r.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",r.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(wr).join(`
`)}function Cd(r){const e=[];for(const t in r){const i=r[t];i!==!1&&e.push("#define "+t+" "+i)}return e.join(`
`)}function Pd(r,e){const t={},i=r.getProgramParameter(e,r.ACTIVE_ATTRIBUTES);for(let a=0;a<i;a++){const n=r.getActiveAttrib(e,a),s=n.name;let o=1;n.type===r.FLOAT_MAT2&&(o=2),n.type===r.FLOAT_MAT3&&(o=3),n.type===r.FLOAT_MAT4&&(o=4),t[s]={type:n.type,location:r.getAttribLocation(e,s),locationSize:o}}return t}function wr(r){return r!==""}function Is(r,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return r.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function Ls(r,e){return r.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const Id=/^[ \t]*#include +<([\w\d./]+)>/gm;function un(r){return r.replace(Id,Dd)}const Ld=new Map;function Dd(r,e){let t=Ne[e];if(t===void 0){const i=Ld.get(e);if(i!==void 0)t=Ne[i],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,i);else throw new Error("Can not resolve #include <"+e+">")}return un(t)}const Ud=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Ds(r){return r.replace(Ud,Nd)}function Nd(r,e,t,i){let a="";for(let n=parseInt(e);n<parseInt(t);n++)a+=i.replace(/\[\s*i\s*\]/g,"[ "+n+" ]").replace(/UNROLLED_LOOP_INDEX/g,n);return a}function Us(r){let e=`precision ${r.precision} float;
	precision ${r.precision} int;
	precision ${r.precision} sampler2D;
	precision ${r.precision} samplerCube;
	precision ${r.precision} sampler3D;
	precision ${r.precision} sampler2DArray;
	precision ${r.precision} sampler2DShadow;
	precision ${r.precision} samplerCubeShadow;
	precision ${r.precision} sampler2DArrayShadow;
	precision ${r.precision} isampler2D;
	precision ${r.precision} isampler3D;
	precision ${r.precision} isamplerCube;
	precision ${r.precision} isampler2DArray;
	precision ${r.precision} usampler2D;
	precision ${r.precision} usampler3D;
	precision ${r.precision} usamplerCube;
	precision ${r.precision} usampler2DArray;
	`;return r.precision==="highp"?e+=`
#define HIGH_PRECISION`:r.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:r.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function Od(r){let e="SHADOWMAP_TYPE_BASIC";return r.shadowMapType===1?e="SHADOWMAP_TYPE_PCF":r.shadowMapType===2?e="SHADOWMAP_TYPE_PCF_SOFT":r.shadowMapType===3&&(e="SHADOWMAP_TYPE_VSM"),e}function Fd(r){let e="ENVMAP_TYPE_CUBE";if(r.envMap)switch(r.envMapMode){case 301:case 302:e="ENVMAP_TYPE_CUBE";break;case 306:e="ENVMAP_TYPE_CUBE_UV";break}return e}function zd(r){let e="ENVMAP_MODE_REFLECTION";if(r.envMap)switch(r.envMapMode){case 302:e="ENVMAP_MODE_REFRACTION";break}return e}function Bd(r){let e="ENVMAP_BLENDING_NONE";if(r.envMap)switch(r.combine){case 0:e="ENVMAP_BLENDING_MULTIPLY";break;case 1:e="ENVMAP_BLENDING_MIX";break;case 2:e="ENVMAP_BLENDING_ADD";break}return e}function kd(r){const e=r.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,i=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:i,maxMip:t}}function Hd(r,e,t,i){const a=r.getContext(),n=t.defines;let s=t.vertexShader,o=t.fragmentShader;const l=Od(t),c=Fd(t),h=zd(t),d=Bd(t),u=kd(t),f=Rd(t),g=Cd(n),_=a.createProgram();let m,p,S=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(m=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(wr).join(`
`),m.length>0&&(m+=`
`),p=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(wr).join(`
`),p.length>0&&(p+=`
`)):(m=[Us(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(wr).join(`
`),p=[Us(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+h:"",t.envMap?"#define "+d:"",u?"#define CUBEUV_TEXEL_WIDTH "+u.texelWidth:"",u?"#define CUBEUV_TEXEL_HEIGHT "+u.texelHeight:"",u?"#define CUBEUV_MAX_MIP "+u.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==0?"#define TONE_MAPPING":"",t.toneMapping!==0?Ne.tonemapping_pars_fragment:"",t.toneMapping!==0?wd("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Ne.colorspace_pars_fragment,Td("linearToOutputTexel",t.outputColorSpace),Ad(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(wr).join(`
`)),s=un(s),s=Is(s,t),s=Ls(s,t),o=un(o),o=Is(o,t),o=Ls(o,t),s=Ds(s),o=Ds(o),t.isRawShaderMaterial!==!0&&(S=`#version 300 es
`,m=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,p=["#define varying in",t.glslVersion===jn?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===jn?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);const E=S+m+s,M=S+p+o,N=Rs(a,a.VERTEX_SHADER,E),A=Rs(a,a.FRAGMENT_SHADER,M);a.attachShader(_,N),a.attachShader(_,A),t.index0AttributeName!==void 0?a.bindAttribLocation(_,0,t.index0AttributeName):t.morphTargets===!0&&a.bindAttribLocation(_,0,"position"),a.linkProgram(_);function w(C){if(r.debug.checkShaderErrors){const F=a.getProgramInfoLog(_).trim(),k=a.getShaderInfoLog(N).trim(),X=a.getShaderInfoLog(A).trim();let K=!0,j=!0;if(a.getProgramParameter(_,a.LINK_STATUS)===!1)if(K=!1,typeof r.debug.onShaderError=="function")r.debug.onShaderError(a,_,N,A);else{const ee=Ps(a,N,"vertex"),W=Ps(a,A,"fragment");console.error("THREE.WebGLProgram: Shader Error "+a.getError()+" - VALIDATE_STATUS "+a.getProgramParameter(_,a.VALIDATE_STATUS)+`

Material Name: `+C.name+`
Material Type: `+C.type+`

Program Info Log: `+F+`
`+ee+`
`+W)}else F!==""?console.warn("THREE.WebGLProgram: Program Info Log:",F):(k===""||X==="")&&(j=!1);j&&(C.diagnostics={runnable:K,programLog:F,vertexShader:{log:k,prefix:m},fragmentShader:{log:X,prefix:p}})}a.deleteShader(N),a.deleteShader(A),P=new ga(a,_),b=Pd(a,_)}let P;this.getUniforms=function(){return P===void 0&&w(this),P};let b;this.getAttributes=function(){return b===void 0&&w(this),b};let x=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return x===!1&&(x=a.getProgramParameter(_,Md)),x},this.destroy=function(){i.releaseStatesOfProgram(this),a.deleteProgram(_),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=bd++,this.cacheKey=e,this.usedTimes=1,this.program=_,this.vertexShader=N,this.fragmentShader=A,this}let Gd=0;class Vd{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,i=e.fragmentShader,a=this._getShaderStage(t),n=this._getShaderStage(i),s=this._getShaderCacheForMaterial(e);return s.has(a)===!1&&(s.add(a),a.usedTimes++),s.has(n)===!1&&(s.add(n),n.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const i of t)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let i=t.get(e);return i===void 0&&(i=new Set,t.set(e,i)),i}_getShaderStage(e){const t=this.shaderCache;let i=t.get(e);return i===void 0&&(i=new Wd(e),t.set(e,i)),i}}class Wd{constructor(e){this.id=Gd++,this.code=e,this.usedTimes=0}}function Xd(r,e,t,i,a,n,s){const o=new En,l=new Vd,c=new Set,h=[],d=a.logarithmicDepthBuffer,u=a.vertexTextures;let f=a.precision;const g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function _(b){return c.add(b),b===0?"uv":`uv${b}`}function m(b,x,C,F,k){const X=F.fog,K=k.geometry,j=b.isMeshStandardMaterial?F.environment:null,ee=(b.isMeshStandardMaterial?t:e).get(b.envMap||j),W=ee&&ee.mapping===306?ee.image.height:null,ae=g[b.type];b.precision!==null&&(f=a.getMaxPrecision(b.precision),f!==b.precision&&console.warn("THREE.WebGLProgram.getParameters:",b.precision,"not supported, using",f,"instead."));const pe=K.morphAttributes.position||K.morphAttributes.normal||K.morphAttributes.color,Ae=pe!==void 0?pe.length:0;let Z=0;K.morphAttributes.position!==void 0&&(Z=1),K.morphAttributes.normal!==void 0&&(Z=2),K.morphAttributes.color!==void 0&&(Z=3);let re,O,G,ne;if(ae){const je=Xt[ae];re=je.vertexShader,O=je.fragmentShader}else re=b.vertexShader,O=b.fragmentShader,l.update(b),G=l.getVertexShaderID(b),ne=l.getFragmentShaderID(b);const te=r.getRenderTarget(),he=r.state.buffers.depth.getReversed(),be=k.isInstancedMesh===!0,Ce=k.isBatchedMesh===!0,Ve=!!b.map,Oe=!!b.matcap,st=!!ee,U=!!b.aoMap,It=!!b.lightMap,Fe=!!b.bumpMap,ze=!!b.normalMap,Te=!!b.displacementMap,Qe=!!b.emissiveMap,Se=!!b.metalnessMap,T=!!b.roughnessMap,v=b.anisotropy>0,z=b.clearcoat>0,$=b.dispersion>0,J=b.iridescence>0,Y=b.sheen>0,ve=b.transmission>0,ce=v&&!!b.anisotropyMap,ge=z&&!!b.clearcoatMap,He=z&&!!b.clearcoatNormalMap,ie=z&&!!b.clearcoatRoughnessMap,fe=J&&!!b.iridescenceMap,we=J&&!!b.iridescenceThicknessMap,Re=Y&&!!b.sheenColorMap,me=Y&&!!b.sheenRoughnessMap,Be=!!b.specularMap,Ue=!!b.specularColorMap,qe=!!b.specularIntensityMap,L=ve&&!!b.transmissionMap,le=ve&&!!b.thicknessMap,V=!!b.gradientMap,q=!!b.alphaMap,ue=b.alphaTest>0,se=!!b.alphaHash,ke=!!b.extensions;let at=0;b.toneMapped&&(te===null||te.isXRRenderTarget===!0)&&(at=r.toneMapping);const gt={shaderID:ae,shaderType:b.type,shaderName:b.name,vertexShader:re,fragmentShader:O,defines:b.defines,customVertexShaderID:G,customFragmentShaderID:ne,isRawShaderMaterial:b.isRawShaderMaterial===!0,glslVersion:b.glslVersion,precision:f,batching:Ce,batchingColor:Ce&&k._colorsTexture!==null,instancing:be,instancingColor:be&&k.instanceColor!==null,instancingMorph:be&&k.morphTexture!==null,supportsVertexTextures:u,outputColorSpace:te===null?r.outputColorSpace:te.isXRRenderTarget===!0?te.texture.colorSpace:ar,alphaToCoverage:!!b.alphaToCoverage,map:Ve,matcap:Oe,envMap:st,envMapMode:st&&ee.mapping,envMapCubeUVHeight:W,aoMap:U,lightMap:It,bumpMap:Fe,normalMap:ze,displacementMap:u&&Te,emissiveMap:Qe,normalMapObjectSpace:ze&&b.normalMapType===1,normalMapTangentSpace:ze&&b.normalMapType===0,metalnessMap:Se,roughnessMap:T,anisotropy:v,anisotropyMap:ce,clearcoat:z,clearcoatMap:ge,clearcoatNormalMap:He,clearcoatRoughnessMap:ie,dispersion:$,iridescence:J,iridescenceMap:fe,iridescenceThicknessMap:we,sheen:Y,sheenColorMap:Re,sheenRoughnessMap:me,specularMap:Be,specularColorMap:Ue,specularIntensityMap:qe,transmission:ve,transmissionMap:L,thicknessMap:le,gradientMap:V,opaque:b.transparent===!1&&b.blending===1&&b.alphaToCoverage===!1,alphaMap:q,alphaTest:ue,alphaHash:se,combine:b.combine,mapUv:Ve&&_(b.map.channel),aoMapUv:U&&_(b.aoMap.channel),lightMapUv:It&&_(b.lightMap.channel),bumpMapUv:Fe&&_(b.bumpMap.channel),normalMapUv:ze&&_(b.normalMap.channel),displacementMapUv:Te&&_(b.displacementMap.channel),emissiveMapUv:Qe&&_(b.emissiveMap.channel),metalnessMapUv:Se&&_(b.metalnessMap.channel),roughnessMapUv:T&&_(b.roughnessMap.channel),anisotropyMapUv:ce&&_(b.anisotropyMap.channel),clearcoatMapUv:ge&&_(b.clearcoatMap.channel),clearcoatNormalMapUv:He&&_(b.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:ie&&_(b.clearcoatRoughnessMap.channel),iridescenceMapUv:fe&&_(b.iridescenceMap.channel),iridescenceThicknessMapUv:we&&_(b.iridescenceThicknessMap.channel),sheenColorMapUv:Re&&_(b.sheenColorMap.channel),sheenRoughnessMapUv:me&&_(b.sheenRoughnessMap.channel),specularMapUv:Be&&_(b.specularMap.channel),specularColorMapUv:Ue&&_(b.specularColorMap.channel),specularIntensityMapUv:qe&&_(b.specularIntensityMap.channel),transmissionMapUv:L&&_(b.transmissionMap.channel),thicknessMapUv:le&&_(b.thicknessMap.channel),alphaMapUv:q&&_(b.alphaMap.channel),vertexTangents:!!K.attributes.tangent&&(ze||v),vertexColors:b.vertexColors,vertexAlphas:b.vertexColors===!0&&!!K.attributes.color&&K.attributes.color.itemSize===4,pointsUvs:k.isPoints===!0&&!!K.attributes.uv&&(Ve||q),fog:!!X,useFog:b.fog===!0,fogExp2:!!X&&X.isFogExp2,flatShading:b.flatShading===!0,sizeAttenuation:b.sizeAttenuation===!0,logarithmicDepthBuffer:d,reverseDepthBuffer:he,skinning:k.isSkinnedMesh===!0,morphTargets:K.morphAttributes.position!==void 0,morphNormals:K.morphAttributes.normal!==void 0,morphColors:K.morphAttributes.color!==void 0,morphTargetsCount:Ae,morphTextureStride:Z,numDirLights:x.directional.length,numPointLights:x.point.length,numSpotLights:x.spot.length,numSpotLightMaps:x.spotLightMap.length,numRectAreaLights:x.rectArea.length,numHemiLights:x.hemi.length,numDirLightShadows:x.directionalShadowMap.length,numPointLightShadows:x.pointShadowMap.length,numSpotLightShadows:x.spotShadowMap.length,numSpotLightShadowsWithMaps:x.numSpotLightShadowsWithMaps,numLightProbes:x.numLightProbes,numClippingPlanes:s.numPlanes,numClipIntersection:s.numIntersection,dithering:b.dithering,shadowMapEnabled:r.shadowMap.enabled&&C.length>0,shadowMapType:r.shadowMap.type,toneMapping:at,decodeVideoTexture:Ve&&b.map.isVideoTexture===!0&&Ge.getTransfer(b.map.colorSpace)===$e,decodeVideoTextureEmissive:Qe&&b.emissiveMap.isVideoTexture===!0&&Ge.getTransfer(b.emissiveMap.colorSpace)===$e,premultipliedAlpha:b.premultipliedAlpha,doubleSided:b.side===2,flipSided:b.side===1,useDepthPacking:b.depthPacking>=0,depthPacking:b.depthPacking||0,index0AttributeName:b.index0AttributeName,extensionClipCullDistance:ke&&b.extensions.clipCullDistance===!0&&i.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(ke&&b.extensions.multiDraw===!0||Ce)&&i.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:b.customProgramCacheKey()};return gt.vertexUv1s=c.has(1),gt.vertexUv2s=c.has(2),gt.vertexUv3s=c.has(3),c.clear(),gt}function p(b){const x=[];if(b.shaderID?x.push(b.shaderID):(x.push(b.customVertexShaderID),x.push(b.customFragmentShaderID)),b.defines!==void 0)for(const C in b.defines)x.push(C),x.push(b.defines[C]);return b.isRawShaderMaterial===!1&&(S(x,b),E(x,b),x.push(r.outputColorSpace)),x.push(b.customProgramCacheKey),x.join()}function S(b,x){b.push(x.precision),b.push(x.outputColorSpace),b.push(x.envMapMode),b.push(x.envMapCubeUVHeight),b.push(x.mapUv),b.push(x.alphaMapUv),b.push(x.lightMapUv),b.push(x.aoMapUv),b.push(x.bumpMapUv),b.push(x.normalMapUv),b.push(x.displacementMapUv),b.push(x.emissiveMapUv),b.push(x.metalnessMapUv),b.push(x.roughnessMapUv),b.push(x.anisotropyMapUv),b.push(x.clearcoatMapUv),b.push(x.clearcoatNormalMapUv),b.push(x.clearcoatRoughnessMapUv),b.push(x.iridescenceMapUv),b.push(x.iridescenceThicknessMapUv),b.push(x.sheenColorMapUv),b.push(x.sheenRoughnessMapUv),b.push(x.specularMapUv),b.push(x.specularColorMapUv),b.push(x.specularIntensityMapUv),b.push(x.transmissionMapUv),b.push(x.thicknessMapUv),b.push(x.combine),b.push(x.fogExp2),b.push(x.sizeAttenuation),b.push(x.morphTargetsCount),b.push(x.morphAttributeCount),b.push(x.numDirLights),b.push(x.numPointLights),b.push(x.numSpotLights),b.push(x.numSpotLightMaps),b.push(x.numHemiLights),b.push(x.numRectAreaLights),b.push(x.numDirLightShadows),b.push(x.numPointLightShadows),b.push(x.numSpotLightShadows),b.push(x.numSpotLightShadowsWithMaps),b.push(x.numLightProbes),b.push(x.shadowMapType),b.push(x.toneMapping),b.push(x.numClippingPlanes),b.push(x.numClipIntersection),b.push(x.depthPacking)}function E(b,x){o.disableAll(),x.supportsVertexTextures&&o.enable(0),x.instancing&&o.enable(1),x.instancingColor&&o.enable(2),x.instancingMorph&&o.enable(3),x.matcap&&o.enable(4),x.envMap&&o.enable(5),x.normalMapObjectSpace&&o.enable(6),x.normalMapTangentSpace&&o.enable(7),x.clearcoat&&o.enable(8),x.iridescence&&o.enable(9),x.alphaTest&&o.enable(10),x.vertexColors&&o.enable(11),x.vertexAlphas&&o.enable(12),x.vertexUv1s&&o.enable(13),x.vertexUv2s&&o.enable(14),x.vertexUv3s&&o.enable(15),x.vertexTangents&&o.enable(16),x.anisotropy&&o.enable(17),x.alphaHash&&o.enable(18),x.batching&&o.enable(19),x.dispersion&&o.enable(20),x.batchingColor&&o.enable(21),b.push(o.mask),o.disableAll(),x.fog&&o.enable(0),x.useFog&&o.enable(1),x.flatShading&&o.enable(2),x.logarithmicDepthBuffer&&o.enable(3),x.reverseDepthBuffer&&o.enable(4),x.skinning&&o.enable(5),x.morphTargets&&o.enable(6),x.morphNormals&&o.enable(7),x.morphColors&&o.enable(8),x.premultipliedAlpha&&o.enable(9),x.shadowMapEnabled&&o.enable(10),x.doubleSided&&o.enable(11),x.flipSided&&o.enable(12),x.useDepthPacking&&o.enable(13),x.dithering&&o.enable(14),x.transmission&&o.enable(15),x.sheen&&o.enable(16),x.opaque&&o.enable(17),x.pointsUvs&&o.enable(18),x.decodeVideoTexture&&o.enable(19),x.decodeVideoTextureEmissive&&o.enable(20),x.alphaToCoverage&&o.enable(21),b.push(o.mask)}function M(b){const x=g[b.type];let C;if(x){const F=Xt[x];C=Al.clone(F.uniforms)}else C=b.uniforms;return C}function N(b,x){let C;for(let F=0,k=h.length;F<k;F++){const X=h[F];if(X.cacheKey===x){C=X,++C.usedTimes;break}}return C===void 0&&(C=new Hd(r,x,b,n),h.push(C)),C}function A(b){if(--b.usedTimes===0){const x=h.indexOf(b);h[x]=h[h.length-1],h.pop(),b.destroy()}}function w(b){l.remove(b)}function P(){l.dispose()}return{getParameters:m,getProgramCacheKey:p,getUniforms:M,acquireProgram:N,releaseProgram:A,releaseShaderCache:w,programs:h,dispose:P}}function jd(){let r=new WeakMap;function e(s){return r.has(s)}function t(s){let o=r.get(s);return o===void 0&&(o={},r.set(s,o)),o}function i(s){r.delete(s)}function a(s,o,l){r.get(s)[o]=l}function n(){r=new WeakMap}return{has:e,get:t,remove:i,update:a,dispose:n}}function Yd(r,e){return r.groupOrder!==e.groupOrder?r.groupOrder-e.groupOrder:r.renderOrder!==e.renderOrder?r.renderOrder-e.renderOrder:r.material.id!==e.material.id?r.material.id-e.material.id:r.z!==e.z?r.z-e.z:r.id-e.id}function Ns(r,e){return r.groupOrder!==e.groupOrder?r.groupOrder-e.groupOrder:r.renderOrder!==e.renderOrder?r.renderOrder-e.renderOrder:r.z!==e.z?e.z-r.z:r.id-e.id}function Os(){const r=[];let e=0;const t=[],i=[],a=[];function n(){e=0,t.length=0,i.length=0,a.length=0}function s(d,u,f,g,_,m){let p=r[e];return p===void 0?(p={id:d.id,object:d,geometry:u,material:f,groupOrder:g,renderOrder:d.renderOrder,z:_,group:m},r[e]=p):(p.id=d.id,p.object=d,p.geometry=u,p.material=f,p.groupOrder=g,p.renderOrder=d.renderOrder,p.z=_,p.group=m),e++,p}function o(d,u,f,g,_,m){const p=s(d,u,f,g,_,m);f.transmission>0?i.push(p):f.transparent===!0?a.push(p):t.push(p)}function l(d,u,f,g,_,m){const p=s(d,u,f,g,_,m);f.transmission>0?i.unshift(p):f.transparent===!0?a.unshift(p):t.unshift(p)}function c(d,u){t.length>1&&t.sort(d||Yd),i.length>1&&i.sort(u||Ns),a.length>1&&a.sort(u||Ns)}function h(){for(let d=e,u=r.length;d<u;d++){const f=r[d];if(f.id===null)break;f.id=null,f.object=null,f.geometry=null,f.material=null,f.group=null}}return{opaque:t,transmissive:i,transparent:a,init:n,push:o,unshift:l,finish:h,sort:c}}function $d(){let r=new WeakMap;function e(i,a){const n=r.get(i);let s;return n===void 0?(s=new Os,r.set(i,[s])):a>=n.length?(s=new Os,n.push(s)):s=n[a],s}function t(){r=new WeakMap}return{get:e,dispose:t}}function qd(){const r={};return{get:function(e){if(r[e.id]!==void 0)return r[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new R,color:new Me};break;case"SpotLight":t={position:new R,direction:new R,color:new Me,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new R,color:new Me,distance:0,decay:0};break;case"HemisphereLight":t={direction:new R,skyColor:new Me,groundColor:new Me};break;case"RectAreaLight":t={color:new Me,position:new R,halfWidth:new R,halfHeight:new R};break}return r[e.id]=t,t}}}function Kd(){const r={};return{get:function(e){if(r[e.id]!==void 0)return r[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ie};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ie};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ie,shadowCameraNear:1,shadowCameraFar:1e3};break}return r[e.id]=t,t}}}let Zd=0;function Jd(r,e){return(e.castShadow?2:0)-(r.castShadow?2:0)+(e.map?1:0)-(r.map?1:0)}function Qd(r){const e=new qd,t=Kd(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)i.probe.push(new R);const a=new R,n=new Je,s=new Je;function o(c){let h=0,d=0,u=0;for(let b=0;b<9;b++)i.probe[b].set(0,0,0);let f=0,g=0,_=0,m=0,p=0,S=0,E=0,M=0,N=0,A=0,w=0;c.sort(Jd);for(let b=0,x=c.length;b<x;b++){const C=c[b],F=C.color,k=C.intensity,X=C.distance,K=C.shadow&&C.shadow.map?C.shadow.map.texture:null;if(C.isAmbientLight)h+=F.r*k,d+=F.g*k,u+=F.b*k;else if(C.isLightProbe){for(let j=0;j<9;j++)i.probe[j].addScaledVector(C.sh.coefficients[j],k);w++}else if(C.isDirectionalLight){const j=e.get(C);if(j.color.copy(C.color).multiplyScalar(C.intensity),C.castShadow){const ee=C.shadow,W=t.get(C);W.shadowIntensity=ee.intensity,W.shadowBias=ee.bias,W.shadowNormalBias=ee.normalBias,W.shadowRadius=ee.radius,W.shadowMapSize=ee.mapSize,i.directionalShadow[f]=W,i.directionalShadowMap[f]=K,i.directionalShadowMatrix[f]=C.shadow.matrix,S++}i.directional[f]=j,f++}else if(C.isSpotLight){const j=e.get(C);j.position.setFromMatrixPosition(C.matrixWorld),j.color.copy(F).multiplyScalar(k),j.distance=X,j.coneCos=Math.cos(C.angle),j.penumbraCos=Math.cos(C.angle*(1-C.penumbra)),j.decay=C.decay,i.spot[_]=j;const ee=C.shadow;if(C.map&&(i.spotLightMap[N]=C.map,N++,ee.updateMatrices(C),C.castShadow&&A++),i.spotLightMatrix[_]=ee.matrix,C.castShadow){const W=t.get(C);W.shadowIntensity=ee.intensity,W.shadowBias=ee.bias,W.shadowNormalBias=ee.normalBias,W.shadowRadius=ee.radius,W.shadowMapSize=ee.mapSize,i.spotShadow[_]=W,i.spotShadowMap[_]=K,M++}_++}else if(C.isRectAreaLight){const j=e.get(C);j.color.copy(F).multiplyScalar(k),j.halfWidth.set(C.width*.5,0,0),j.halfHeight.set(0,C.height*.5,0),i.rectArea[m]=j,m++}else if(C.isPointLight){const j=e.get(C);if(j.color.copy(C.color).multiplyScalar(C.intensity),j.distance=C.distance,j.decay=C.decay,C.castShadow){const ee=C.shadow,W=t.get(C);W.shadowIntensity=ee.intensity,W.shadowBias=ee.bias,W.shadowNormalBias=ee.normalBias,W.shadowRadius=ee.radius,W.shadowMapSize=ee.mapSize,W.shadowCameraNear=ee.camera.near,W.shadowCameraFar=ee.camera.far,i.pointShadow[g]=W,i.pointShadowMap[g]=K,i.pointShadowMatrix[g]=C.shadow.matrix,E++}i.point[g]=j,g++}else if(C.isHemisphereLight){const j=e.get(C);j.skyColor.copy(C.color).multiplyScalar(k),j.groundColor.copy(C.groundColor).multiplyScalar(k),i.hemi[p]=j,p++}}m>0&&(r.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=oe.LTC_FLOAT_1,i.rectAreaLTC2=oe.LTC_FLOAT_2):(i.rectAreaLTC1=oe.LTC_HALF_1,i.rectAreaLTC2=oe.LTC_HALF_2)),i.ambient[0]=h,i.ambient[1]=d,i.ambient[2]=u;const P=i.hash;(P.directionalLength!==f||P.pointLength!==g||P.spotLength!==_||P.rectAreaLength!==m||P.hemiLength!==p||P.numDirectionalShadows!==S||P.numPointShadows!==E||P.numSpotShadows!==M||P.numSpotMaps!==N||P.numLightProbes!==w)&&(i.directional.length=f,i.spot.length=_,i.rectArea.length=m,i.point.length=g,i.hemi.length=p,i.directionalShadow.length=S,i.directionalShadowMap.length=S,i.pointShadow.length=E,i.pointShadowMap.length=E,i.spotShadow.length=M,i.spotShadowMap.length=M,i.directionalShadowMatrix.length=S,i.pointShadowMatrix.length=E,i.spotLightMatrix.length=M+N-A,i.spotLightMap.length=N,i.numSpotLightShadowsWithMaps=A,i.numLightProbes=w,P.directionalLength=f,P.pointLength=g,P.spotLength=_,P.rectAreaLength=m,P.hemiLength=p,P.numDirectionalShadows=S,P.numPointShadows=E,P.numSpotShadows=M,P.numSpotMaps=N,P.numLightProbes=w,i.version=Zd++)}function l(c,h){let d=0,u=0,f=0,g=0,_=0;const m=h.matrixWorldInverse;for(let p=0,S=c.length;p<S;p++){const E=c[p];if(E.isDirectionalLight){const M=i.directional[d];M.direction.setFromMatrixPosition(E.matrixWorld),a.setFromMatrixPosition(E.target.matrixWorld),M.direction.sub(a),M.direction.transformDirection(m),d++}else if(E.isSpotLight){const M=i.spot[f];M.position.setFromMatrixPosition(E.matrixWorld),M.position.applyMatrix4(m),M.direction.setFromMatrixPosition(E.matrixWorld),a.setFromMatrixPosition(E.target.matrixWorld),M.direction.sub(a),M.direction.transformDirection(m),f++}else if(E.isRectAreaLight){const M=i.rectArea[g];M.position.setFromMatrixPosition(E.matrixWorld),M.position.applyMatrix4(m),s.identity(),n.copy(E.matrixWorld),n.premultiply(m),s.extractRotation(n),M.halfWidth.set(E.width*.5,0,0),M.halfHeight.set(0,E.height*.5,0),M.halfWidth.applyMatrix4(s),M.halfHeight.applyMatrix4(s),g++}else if(E.isPointLight){const M=i.point[u];M.position.setFromMatrixPosition(E.matrixWorld),M.position.applyMatrix4(m),u++}else if(E.isHemisphereLight){const M=i.hemi[_];M.direction.setFromMatrixPosition(E.matrixWorld),M.direction.transformDirection(m),_++}}}return{setup:o,setupView:l,state:i}}function Fs(r){const e=new Qd(r),t=[],i=[];function a(h){c.camera=h,t.length=0,i.length=0}function n(h){t.push(h)}function s(h){i.push(h)}function o(){e.setup(t)}function l(h){e.setupView(t,h)}const c={lightsArray:t,shadowsArray:i,camera:null,lights:e,transmissionRenderTarget:{}};return{init:a,state:c,setupLights:o,setupLightsView:l,pushLight:n,pushShadow:s}}function ep(r){let e=new WeakMap;function t(a,n=0){const s=e.get(a);let o;return s===void 0?(o=new Fs(r),e.set(a,[o])):n>=s.length?(o=new Fs(r),s.push(o)):o=s[n],o}function i(){e=new WeakMap}return{get:t,dispose:i}}class tp extends Ri{static get type(){return"MeshDepthMaterial"}constructor(e){super(),this.isMeshDepthMaterial=!0,this.depthPacking=3200,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class ip extends Ri{static get type(){return"MeshDistanceMaterial"}constructor(e){super(),this.isMeshDistanceMaterial=!0,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}const rp=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,ap=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function np(r,e,t){let i=new wn;const a=new Ie,n=new Ie,s=new Ke,o=new tp({depthPacking:3201}),l=new ip,c={},h=t.maxTextureSize,d={0:1,1:0,2:2},u=new Tt({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Ie},radius:{value:4}},vertexShader:rp,fragmentShader:ap}),f=u.clone();f.defines.HORIZONTAL_PASS=1;const g=new mt;g.setAttribute("position",new ot(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const _=new Ze(g,u),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=1;let p=this.type;this.render=function(A,w,P){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||A.length===0)return;const b=r.getRenderTarget(),x=r.getActiveCubeFace(),C=r.getActiveMipmapLevel(),F=r.state;F.setBlending(0),F.buffers.color.setClear(1,1,1,1),F.buffers.depth.setTest(!0),F.setScissorTest(!1);const k=p!==3&&this.type===3,X=p===3&&this.type!==3;for(let K=0,j=A.length;K<j;K++){const ee=A[K],W=ee.shadow;if(W===void 0){console.warn("THREE.WebGLShadowMap:",ee,"has no shadow.");continue}if(W.autoUpdate===!1&&W.needsUpdate===!1)continue;a.copy(W.mapSize);const ae=W.getFrameExtents();if(a.multiply(ae),n.copy(W.mapSize),(a.x>h||a.y>h)&&(a.x>h&&(n.x=Math.floor(h/ae.x),a.x=n.x*ae.x,W.mapSize.x=n.x),a.y>h&&(n.y=Math.floor(h/ae.y),a.y=n.y*ae.y,W.mapSize.y=n.y)),W.map===null||k===!0||X===!0){const Ae=this.type!==3?{minFilter:1003,magFilter:1003}:{};W.map!==null&&W.map.dispose(),W.map=new Ei(a.x,a.y,Ae),W.map.texture.name=ee.name+".shadowMap",W.camera.updateProjectionMatrix()}r.setRenderTarget(W.map),r.clear();const pe=W.getViewportCount();for(let Ae=0;Ae<pe;Ae++){const Z=W.getViewport(Ae);s.set(n.x*Z.x,n.y*Z.y,n.x*Z.z,n.y*Z.w),F.viewport(s),W.updateMatrices(ee,Ae),i=W.getFrustum(),M(w,P,W.camera,ee,this.type)}W.isPointLightShadow!==!0&&this.type===3&&S(W,P),W.needsUpdate=!1}p=this.type,m.needsUpdate=!1,r.setRenderTarget(b,x,C)};function S(A,w){const P=e.update(_);u.defines.VSM_SAMPLES!==A.blurSamples&&(u.defines.VSM_SAMPLES=A.blurSamples,f.defines.VSM_SAMPLES=A.blurSamples,u.needsUpdate=!0,f.needsUpdate=!0),A.mapPass===null&&(A.mapPass=new Ei(a.x,a.y)),u.uniforms.shadow_pass.value=A.map.texture,u.uniforms.resolution.value=A.mapSize,u.uniforms.radius.value=A.radius,r.setRenderTarget(A.mapPass),r.clear(),r.renderBufferDirect(w,null,P,u,_,null),f.uniforms.shadow_pass.value=A.mapPass.texture,f.uniforms.resolution.value=A.mapSize,f.uniforms.radius.value=A.radius,r.setRenderTarget(A.map),r.clear(),r.renderBufferDirect(w,null,P,f,_,null)}function E(A,w,P,b){let x=null;const C=P.isPointLight===!0?A.customDistanceMaterial:A.customDepthMaterial;if(C!==void 0)x=C;else if(x=P.isPointLight===!0?l:o,r.localClippingEnabled&&w.clipShadows===!0&&Array.isArray(w.clippingPlanes)&&w.clippingPlanes.length!==0||w.displacementMap&&w.displacementScale!==0||w.alphaMap&&w.alphaTest>0||w.map&&w.alphaTest>0){const F=x.uuid,k=w.uuid;let X=c[F];X===void 0&&(X={},c[F]=X);let K=X[k];K===void 0&&(K=x.clone(),X[k]=K,w.addEventListener("dispose",N)),x=K}if(x.visible=w.visible,x.wireframe=w.wireframe,b===3?x.side=w.shadowSide!==null?w.shadowSide:w.side:x.side=w.shadowSide!==null?w.shadowSide:d[w.side],x.alphaMap=w.alphaMap,x.alphaTest=w.alphaTest,x.map=w.map,x.clipShadows=w.clipShadows,x.clippingPlanes=w.clippingPlanes,x.clipIntersection=w.clipIntersection,x.displacementMap=w.displacementMap,x.displacementScale=w.displacementScale,x.displacementBias=w.displacementBias,x.wireframeLinewidth=w.wireframeLinewidth,x.linewidth=w.linewidth,P.isPointLight===!0&&x.isMeshDistanceMaterial===!0){const F=r.properties.get(x);F.light=P}return x}function M(A,w,P,b,x){if(A.visible===!1)return;if(A.layers.test(w.layers)&&(A.isMesh||A.isLine||A.isPoints)&&(A.castShadow||A.receiveShadow&&x===3)&&(!A.frustumCulled||i.intersectsObject(A))){A.modelViewMatrix.multiplyMatrices(P.matrixWorldInverse,A.matrixWorld);const F=e.update(A),k=A.material;if(Array.isArray(k)){const X=F.groups;for(let K=0,j=X.length;K<j;K++){const ee=X[K],W=k[ee.materialIndex];if(W&&W.visible){const ae=E(A,W,b,x);A.onBeforeShadow(r,A,w,P,F,ae,ee),r.renderBufferDirect(P,null,F,ae,A,ee),A.onAfterShadow(r,A,w,P,F,ae,ee)}}}else if(k.visible){const X=E(A,k,b,x);A.onBeforeShadow(r,A,w,P,F,X,null),r.renderBufferDirect(P,null,F,X,A,null),A.onAfterShadow(r,A,w,P,F,X,null)}}const C=A.children;for(let F=0,k=C.length;F<k;F++)M(C[F],w,P,b,x)}function N(A){A.target.removeEventListener("dispose",N);for(const w in c){const P=c[w],b=A.target.uuid;b in P&&(P[b].dispose(),delete P[b])}}}const sp={0:1,2:6,4:7,3:5,1:0,6:2,7:4,5:3};function op(r,e){function t(){let L=!1;const le=new Ke;let V=null;const q=new Ke(0,0,0,0);return{setMask:function(ue){V!==ue&&!L&&(r.colorMask(ue,ue,ue,ue),V=ue)},setLocked:function(ue){L=ue},setClear:function(ue,se,ke,at,gt){gt===!0&&(ue*=at,se*=at,ke*=at),le.set(ue,se,ke,at),q.equals(le)===!1&&(r.clearColor(ue,se,ke,at),q.copy(le))},reset:function(){L=!1,V=null,q.set(-1,0,0,0)}}}function i(){let L=!1,le=!1,V=null,q=null,ue=null;return{setReversed:function(se){if(le!==se){const ke=e.get("EXT_clip_control");le?ke.clipControlEXT(ke.LOWER_LEFT_EXT,ke.ZERO_TO_ONE_EXT):ke.clipControlEXT(ke.LOWER_LEFT_EXT,ke.NEGATIVE_ONE_TO_ONE_EXT);const at=ue;ue=null,this.setClear(at)}le=se},getReversed:function(){return le},setTest:function(se){se?te(r.DEPTH_TEST):he(r.DEPTH_TEST)},setMask:function(se){V!==se&&!L&&(r.depthMask(se),V=se)},setFunc:function(se){if(le&&(se=sp[se]),q!==se){switch(se){case 0:r.depthFunc(r.NEVER);break;case 1:r.depthFunc(r.ALWAYS);break;case 2:r.depthFunc(r.LESS);break;case 3:r.depthFunc(r.LEQUAL);break;case 4:r.depthFunc(r.EQUAL);break;case 5:r.depthFunc(r.GEQUAL);break;case 6:r.depthFunc(r.GREATER);break;case 7:r.depthFunc(r.NOTEQUAL);break;default:r.depthFunc(r.LEQUAL)}q=se}},setLocked:function(se){L=se},setClear:function(se){ue!==se&&(le&&(se=1-se),r.clearDepth(se),ue=se)},reset:function(){L=!1,V=null,q=null,ue=null,le=!1}}}function a(){let L=!1,le=null,V=null,q=null,ue=null,se=null,ke=null,at=null,gt=null;return{setTest:function(je){L||(je?te(r.STENCIL_TEST):he(r.STENCIL_TEST))},setMask:function(je){le!==je&&!L&&(r.stencilMask(je),le=je)},setFunc:function(je,Nt,$t){(V!==je||q!==Nt||ue!==$t)&&(r.stencilFunc(je,Nt,$t),V=je,q=Nt,ue=$t)},setOp:function(je,Nt,$t){(se!==je||ke!==Nt||at!==$t)&&(r.stencilOp(je,Nt,$t),se=je,ke=Nt,at=$t)},setLocked:function(je){L=je},setClear:function(je){gt!==je&&(r.clearStencil(je),gt=je)},reset:function(){L=!1,le=null,V=null,q=null,ue=null,se=null,ke=null,at=null,gt=null}}}const n=new t,s=new i,o=new a,l=new WeakMap,c=new WeakMap;let h={},d={},u=new WeakMap,f=[],g=null,_=!1,m=null,p=null,S=null,E=null,M=null,N=null,A=null,w=new Me(0,0,0),P=0,b=!1,x=null,C=null,F=null,k=null,X=null;const K=r.getParameter(r.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let j=!1,ee=0;const W=r.getParameter(r.VERSION);W.indexOf("WebGL")!==-1?(ee=parseFloat(/^WebGL (\d)/.exec(W)[1]),j=ee>=1):W.indexOf("OpenGL ES")!==-1&&(ee=parseFloat(/^OpenGL ES (\d)/.exec(W)[1]),j=ee>=2);let ae=null,pe={};const Ae=r.getParameter(r.SCISSOR_BOX),Z=r.getParameter(r.VIEWPORT),re=new Ke().fromArray(Ae),O=new Ke().fromArray(Z);function G(L,le,V,q){const ue=new Uint8Array(4),se=r.createTexture();r.bindTexture(L,se),r.texParameteri(L,r.TEXTURE_MIN_FILTER,r.NEAREST),r.texParameteri(L,r.TEXTURE_MAG_FILTER,r.NEAREST);for(let ke=0;ke<V;ke++)L===r.TEXTURE_3D||L===r.TEXTURE_2D_ARRAY?r.texImage3D(le,0,r.RGBA,1,1,q,0,r.RGBA,r.UNSIGNED_BYTE,ue):r.texImage2D(le+ke,0,r.RGBA,1,1,0,r.RGBA,r.UNSIGNED_BYTE,ue);return se}const ne={};ne[r.TEXTURE_2D]=G(r.TEXTURE_2D,r.TEXTURE_2D,1),ne[r.TEXTURE_CUBE_MAP]=G(r.TEXTURE_CUBE_MAP,r.TEXTURE_CUBE_MAP_POSITIVE_X,6),ne[r.TEXTURE_2D_ARRAY]=G(r.TEXTURE_2D_ARRAY,r.TEXTURE_2D_ARRAY,1,1),ne[r.TEXTURE_3D]=G(r.TEXTURE_3D,r.TEXTURE_3D,1,1),n.setClear(0,0,0,1),s.setClear(1),o.setClear(0),te(r.DEPTH_TEST),s.setFunc(3),Fe(!1),ze(1),te(r.CULL_FACE),U(0);function te(L){h[L]!==!0&&(r.enable(L),h[L]=!0)}function he(L){h[L]!==!1&&(r.disable(L),h[L]=!1)}function be(L,le){return d[L]!==le?(r.bindFramebuffer(L,le),d[L]=le,L===r.DRAW_FRAMEBUFFER&&(d[r.FRAMEBUFFER]=le),L===r.FRAMEBUFFER&&(d[r.DRAW_FRAMEBUFFER]=le),!0):!1}function Ce(L,le){let V=f,q=!1;if(L){V=u.get(le),V===void 0&&(V=[],u.set(le,V));const ue=L.textures;if(V.length!==ue.length||V[0]!==r.COLOR_ATTACHMENT0){for(let se=0,ke=ue.length;se<ke;se++)V[se]=r.COLOR_ATTACHMENT0+se;V.length=ue.length,q=!0}}else V[0]!==r.BACK&&(V[0]=r.BACK,q=!0);q&&r.drawBuffers(V)}function Ve(L){return g!==L?(r.useProgram(L),g=L,!0):!1}const Oe={100:r.FUNC_ADD,101:r.FUNC_SUBTRACT,102:r.FUNC_REVERSE_SUBTRACT};Oe[103]=r.MIN,Oe[104]=r.MAX;const st={200:r.ZERO,201:r.ONE,202:r.SRC_COLOR,204:r.SRC_ALPHA,210:r.SRC_ALPHA_SATURATE,208:r.DST_COLOR,206:r.DST_ALPHA,203:r.ONE_MINUS_SRC_COLOR,205:r.ONE_MINUS_SRC_ALPHA,209:r.ONE_MINUS_DST_COLOR,207:r.ONE_MINUS_DST_ALPHA,211:r.CONSTANT_COLOR,212:r.ONE_MINUS_CONSTANT_COLOR,213:r.CONSTANT_ALPHA,214:r.ONE_MINUS_CONSTANT_ALPHA};function U(L,le,V,q,ue,se,ke,at,gt,je){if(L===0){_===!0&&(he(r.BLEND),_=!1);return}if(_===!1&&(te(r.BLEND),_=!0),L!==5){if(L!==m||je!==b){if((p!==100||M!==100)&&(r.blendEquation(r.FUNC_ADD),p=100,M=100),je)switch(L){case 1:r.blendFuncSeparate(r.ONE,r.ONE_MINUS_SRC_ALPHA,r.ONE,r.ONE_MINUS_SRC_ALPHA);break;case 2:r.blendFunc(r.ONE,r.ONE);break;case 3:r.blendFuncSeparate(r.ZERO,r.ONE_MINUS_SRC_COLOR,r.ZERO,r.ONE);break;case 4:r.blendFuncSeparate(r.ZERO,r.SRC_COLOR,r.ZERO,r.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",L);break}else switch(L){case 1:r.blendFuncSeparate(r.SRC_ALPHA,r.ONE_MINUS_SRC_ALPHA,r.ONE,r.ONE_MINUS_SRC_ALPHA);break;case 2:r.blendFunc(r.SRC_ALPHA,r.ONE);break;case 3:r.blendFuncSeparate(r.ZERO,r.ONE_MINUS_SRC_COLOR,r.ZERO,r.ONE);break;case 4:r.blendFunc(r.ZERO,r.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",L);break}S=null,E=null,N=null,A=null,w.set(0,0,0),P=0,m=L,b=je}return}ue=ue||le,se=se||V,ke=ke||q,(le!==p||ue!==M)&&(r.blendEquationSeparate(Oe[le],Oe[ue]),p=le,M=ue),(V!==S||q!==E||se!==N||ke!==A)&&(r.blendFuncSeparate(st[V],st[q],st[se],st[ke]),S=V,E=q,N=se,A=ke),(at.equals(w)===!1||gt!==P)&&(r.blendColor(at.r,at.g,at.b,gt),w.copy(at),P=gt),m=L,b=!1}function It(L,le){L.side===2?he(r.CULL_FACE):te(r.CULL_FACE);let V=L.side===1;le&&(V=!V),Fe(V),L.blending===1&&L.transparent===!1?U(0):U(L.blending,L.blendEquation,L.blendSrc,L.blendDst,L.blendEquationAlpha,L.blendSrcAlpha,L.blendDstAlpha,L.blendColor,L.blendAlpha,L.premultipliedAlpha),s.setFunc(L.depthFunc),s.setTest(L.depthTest),s.setMask(L.depthWrite),n.setMask(L.colorWrite);const q=L.stencilWrite;o.setTest(q),q&&(o.setMask(L.stencilWriteMask),o.setFunc(L.stencilFunc,L.stencilRef,L.stencilFuncMask),o.setOp(L.stencilFail,L.stencilZFail,L.stencilZPass)),Qe(L.polygonOffset,L.polygonOffsetFactor,L.polygonOffsetUnits),L.alphaToCoverage===!0?te(r.SAMPLE_ALPHA_TO_COVERAGE):he(r.SAMPLE_ALPHA_TO_COVERAGE)}function Fe(L){x!==L&&(L?r.frontFace(r.CW):r.frontFace(r.CCW),x=L)}function ze(L){L!==0?(te(r.CULL_FACE),L!==C&&(L===1?r.cullFace(r.BACK):L===2?r.cullFace(r.FRONT):r.cullFace(r.FRONT_AND_BACK))):he(r.CULL_FACE),C=L}function Te(L){L!==F&&(j&&r.lineWidth(L),F=L)}function Qe(L,le,V){L?(te(r.POLYGON_OFFSET_FILL),(k!==le||X!==V)&&(r.polygonOffset(le,V),k=le,X=V)):he(r.POLYGON_OFFSET_FILL)}function Se(L){L?te(r.SCISSOR_TEST):he(r.SCISSOR_TEST)}function T(L){L===void 0&&(L=r.TEXTURE0+K-1),ae!==L&&(r.activeTexture(L),ae=L)}function v(L,le,V){V===void 0&&(ae===null?V=r.TEXTURE0+K-1:V=ae);let q=pe[V];q===void 0&&(q={type:void 0,texture:void 0},pe[V]=q),(q.type!==L||q.texture!==le)&&(ae!==V&&(r.activeTexture(V),ae=V),r.bindTexture(L,le||ne[L]),q.type=L,q.texture=le)}function z(){const L=pe[ae];L!==void 0&&L.type!==void 0&&(r.bindTexture(L.type,null),L.type=void 0,L.texture=void 0)}function $(){try{r.compressedTexImage2D.apply(r,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function J(){try{r.compressedTexImage3D.apply(r,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function Y(){try{r.texSubImage2D.apply(r,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function ve(){try{r.texSubImage3D.apply(r,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function ce(){try{r.compressedTexSubImage2D.apply(r,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function ge(){try{r.compressedTexSubImage3D.apply(r,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function He(){try{r.texStorage2D.apply(r,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function ie(){try{r.texStorage3D.apply(r,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function fe(){try{r.texImage2D.apply(r,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function we(){try{r.texImage3D.apply(r,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function Re(L){re.equals(L)===!1&&(r.scissor(L.x,L.y,L.z,L.w),re.copy(L))}function me(L){O.equals(L)===!1&&(r.viewport(L.x,L.y,L.z,L.w),O.copy(L))}function Be(L,le){let V=c.get(le);V===void 0&&(V=new WeakMap,c.set(le,V));let q=V.get(L);q===void 0&&(q=r.getUniformBlockIndex(le,L.name),V.set(L,q))}function Ue(L,le){const V=c.get(le).get(L);l.get(le)!==V&&(r.uniformBlockBinding(le,V,L.__bindingPointIndex),l.set(le,V))}function qe(){r.disable(r.BLEND),r.disable(r.CULL_FACE),r.disable(r.DEPTH_TEST),r.disable(r.POLYGON_OFFSET_FILL),r.disable(r.SCISSOR_TEST),r.disable(r.STENCIL_TEST),r.disable(r.SAMPLE_ALPHA_TO_COVERAGE),r.blendEquation(r.FUNC_ADD),r.blendFunc(r.ONE,r.ZERO),r.blendFuncSeparate(r.ONE,r.ZERO,r.ONE,r.ZERO),r.blendColor(0,0,0,0),r.colorMask(!0,!0,!0,!0),r.clearColor(0,0,0,0),r.depthMask(!0),r.depthFunc(r.LESS),s.setReversed(!1),r.clearDepth(1),r.stencilMask(4294967295),r.stencilFunc(r.ALWAYS,0,4294967295),r.stencilOp(r.KEEP,r.KEEP,r.KEEP),r.clearStencil(0),r.cullFace(r.BACK),r.frontFace(r.CCW),r.polygonOffset(0,0),r.activeTexture(r.TEXTURE0),r.bindFramebuffer(r.FRAMEBUFFER,null),r.bindFramebuffer(r.DRAW_FRAMEBUFFER,null),r.bindFramebuffer(r.READ_FRAMEBUFFER,null),r.useProgram(null),r.lineWidth(1),r.scissor(0,0,r.canvas.width,r.canvas.height),r.viewport(0,0,r.canvas.width,r.canvas.height),h={},ae=null,pe={},d={},u=new WeakMap,f=[],g=null,_=!1,m=null,p=null,S=null,E=null,M=null,N=null,A=null,w=new Me(0,0,0),P=0,b=!1,x=null,C=null,F=null,k=null,X=null,re.set(0,0,r.canvas.width,r.canvas.height),O.set(0,0,r.canvas.width,r.canvas.height),n.reset(),s.reset(),o.reset()}return{buffers:{color:n,depth:s,stencil:o},enable:te,disable:he,bindFramebuffer:be,drawBuffers:Ce,useProgram:Ve,setBlending:U,setMaterial:It,setFlipSided:Fe,setCullFace:ze,setLineWidth:Te,setPolygonOffset:Qe,setScissorTest:Se,activeTexture:T,bindTexture:v,unbindTexture:z,compressedTexImage2D:$,compressedTexImage3D:J,texImage2D:fe,texImage3D:we,updateUBOMapping:Be,uniformBlockBinding:Ue,texStorage2D:He,texStorage3D:ie,texSubImage2D:Y,texSubImage3D:ve,compressedTexSubImage2D:ce,compressedTexSubImage3D:ge,scissor:Re,viewport:me,reset:qe}}function zs(r,e,t,i){const a=lp(i);switch(t){case 1021:return r*e;case 1024:return r*e;case 1025:return r*e*2;case 1028:return r*e/a.components*a.byteLength;case 1029:return r*e/a.components*a.byteLength;case 1030:return r*e*2/a.components*a.byteLength;case 1031:return r*e*2/a.components*a.byteLength;case 1022:return r*e*3/a.components*a.byteLength;case 1023:return r*e*4/a.components*a.byteLength;case 1033:return r*e*4/a.components*a.byteLength;case 33776:case 33777:return Math.floor((r+3)/4)*Math.floor((e+3)/4)*8;case 33778:case 33779:return Math.floor((r+3)/4)*Math.floor((e+3)/4)*16;case 35841:case 35843:return Math.max(r,16)*Math.max(e,8)/4;case 35840:case 35842:return Math.max(r,8)*Math.max(e,8)/2;case 36196:case 37492:return Math.floor((r+3)/4)*Math.floor((e+3)/4)*8;case 37496:return Math.floor((r+3)/4)*Math.floor((e+3)/4)*16;case 37808:return Math.floor((r+3)/4)*Math.floor((e+3)/4)*16;case 37809:return Math.floor((r+4)/5)*Math.floor((e+3)/4)*16;case 37810:return Math.floor((r+4)/5)*Math.floor((e+4)/5)*16;case 37811:return Math.floor((r+5)/6)*Math.floor((e+4)/5)*16;case 37812:return Math.floor((r+5)/6)*Math.floor((e+5)/6)*16;case 37813:return Math.floor((r+7)/8)*Math.floor((e+4)/5)*16;case 37814:return Math.floor((r+7)/8)*Math.floor((e+5)/6)*16;case 37815:return Math.floor((r+7)/8)*Math.floor((e+7)/8)*16;case 37816:return Math.floor((r+9)/10)*Math.floor((e+4)/5)*16;case 37817:return Math.floor((r+9)/10)*Math.floor((e+5)/6)*16;case 37818:return Math.floor((r+9)/10)*Math.floor((e+7)/8)*16;case 37819:return Math.floor((r+9)/10)*Math.floor((e+9)/10)*16;case 37820:return Math.floor((r+11)/12)*Math.floor((e+9)/10)*16;case 37821:return Math.floor((r+11)/12)*Math.floor((e+11)/12)*16;case 36492:case 36494:case 36495:return Math.ceil(r/4)*Math.ceil(e/4)*16;case 36283:case 36284:return Math.ceil(r/4)*Math.ceil(e/4)*8;case 36285:case 36286:return Math.ceil(r/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function lp(r){switch(r){case 1009:case 1010:return{byteLength:1,components:1};case 1012:case 1011:case 1016:return{byteLength:2,components:1};case 1017:case 1018:return{byteLength:2,components:4};case 1014:case 1013:case 1015:return{byteLength:4,components:1};case 35902:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${r}.`)}function cp(r,e,t,i,a,n,s){const o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new Ie,h=new WeakMap;let d;const u=new WeakMap;let f=!1;try{f=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(T,v){return f?new OffscreenCanvas(T,v):Lr("canvas")}function _(T,v,z){let $=1;const J=Se(T);if((J.width>z||J.height>z)&&($=z/Math.max(J.width,J.height)),$<1)if(typeof HTMLImageElement<"u"&&T instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&T instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&T instanceof ImageBitmap||typeof VideoFrame<"u"&&T instanceof VideoFrame){const Y=Math.floor($*J.width),ve=Math.floor($*J.height);d===void 0&&(d=g(Y,ve));const ce=v?g(Y,ve):d;return ce.width=Y,ce.height=ve,ce.getContext("2d").drawImage(T,0,0,Y,ve),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+J.width+"x"+J.height+") to ("+Y+"x"+ve+")."),ce}else return"data"in T&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+J.width+"x"+J.height+")."),T;return T}function m(T){return T.generateMipmaps}function p(T){r.generateMipmap(T)}function S(T){return T.isWebGLCubeRenderTarget?r.TEXTURE_CUBE_MAP:T.isWebGL3DRenderTarget?r.TEXTURE_3D:T.isWebGLArrayRenderTarget||T.isCompressedArrayTexture?r.TEXTURE_2D_ARRAY:r.TEXTURE_2D}function E(T,v,z,$,J=!1){if(T!==null){if(r[T]!==void 0)return r[T];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+T+"'")}let Y=v;if(v===r.RED&&(z===r.FLOAT&&(Y=r.R32F),z===r.HALF_FLOAT&&(Y=r.R16F),z===r.UNSIGNED_BYTE&&(Y=r.R8)),v===r.RED_INTEGER&&(z===r.UNSIGNED_BYTE&&(Y=r.R8UI),z===r.UNSIGNED_SHORT&&(Y=r.R16UI),z===r.UNSIGNED_INT&&(Y=r.R32UI),z===r.BYTE&&(Y=r.R8I),z===r.SHORT&&(Y=r.R16I),z===r.INT&&(Y=r.R32I)),v===r.RG&&(z===r.FLOAT&&(Y=r.RG32F),z===r.HALF_FLOAT&&(Y=r.RG16F),z===r.UNSIGNED_BYTE&&(Y=r.RG8)),v===r.RG_INTEGER&&(z===r.UNSIGNED_BYTE&&(Y=r.RG8UI),z===r.UNSIGNED_SHORT&&(Y=r.RG16UI),z===r.UNSIGNED_INT&&(Y=r.RG32UI),z===r.BYTE&&(Y=r.RG8I),z===r.SHORT&&(Y=r.RG16I),z===r.INT&&(Y=r.RG32I)),v===r.RGB_INTEGER&&(z===r.UNSIGNED_BYTE&&(Y=r.RGB8UI),z===r.UNSIGNED_SHORT&&(Y=r.RGB16UI),z===r.UNSIGNED_INT&&(Y=r.RGB32UI),z===r.BYTE&&(Y=r.RGB8I),z===r.SHORT&&(Y=r.RGB16I),z===r.INT&&(Y=r.RGB32I)),v===r.RGBA_INTEGER&&(z===r.UNSIGNED_BYTE&&(Y=r.RGBA8UI),z===r.UNSIGNED_SHORT&&(Y=r.RGBA16UI),z===r.UNSIGNED_INT&&(Y=r.RGBA32UI),z===r.BYTE&&(Y=r.RGBA8I),z===r.SHORT&&(Y=r.RGBA16I),z===r.INT&&(Y=r.RGBA32I)),v===r.RGB&&z===r.UNSIGNED_INT_5_9_9_9_REV&&(Y=r.RGB9_E5),v===r.RGBA){const ve=J?va:Ge.getTransfer($);z===r.FLOAT&&(Y=r.RGBA32F),z===r.HALF_FLOAT&&(Y=r.RGBA16F),z===r.UNSIGNED_BYTE&&(Y=ve===$e?r.SRGB8_ALPHA8:r.RGBA8),z===r.UNSIGNED_SHORT_4_4_4_4&&(Y=r.RGBA4),z===r.UNSIGNED_SHORT_5_5_5_1&&(Y=r.RGB5_A1)}return(Y===r.R16F||Y===r.R32F||Y===r.RG16F||Y===r.RG32F||Y===r.RGBA16F||Y===r.RGBA32F)&&e.get("EXT_color_buffer_float"),Y}function M(T,v){let z;return T?v===null||v===1014||v===1020?z=r.DEPTH24_STENCIL8:v===1015?z=r.DEPTH32F_STENCIL8:v===1012&&(z=r.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):v===null||v===1014||v===1020?z=r.DEPTH_COMPONENT24:v===1015?z=r.DEPTH_COMPONENT32F:v===1012&&(z=r.DEPTH_COMPONENT16),z}function N(T,v){return m(T)===!0||T.isFramebufferTexture&&T.minFilter!==1003&&T.minFilter!==1006?Math.log2(Math.max(v.width,v.height))+1:T.mipmaps!==void 0&&T.mipmaps.length>0?T.mipmaps.length:T.isCompressedTexture&&Array.isArray(T.image)?v.mipmaps.length:1}function A(T){const v=T.target;v.removeEventListener("dispose",A),P(v),v.isVideoTexture&&h.delete(v)}function w(T){const v=T.target;v.removeEventListener("dispose",w),x(v)}function P(T){const v=i.get(T);if(v.__webglInit===void 0)return;const z=T.source,$=u.get(z);if($){const J=$[v.__cacheKey];J.usedTimes--,J.usedTimes===0&&b(T),Object.keys($).length===0&&u.delete(z)}i.remove(T)}function b(T){const v=i.get(T);r.deleteTexture(v.__webglTexture);const z=T.source,$=u.get(z);delete $[v.__cacheKey],s.memory.textures--}function x(T){const v=i.get(T);if(T.depthTexture&&(T.depthTexture.dispose(),i.remove(T.depthTexture)),T.isWebGLCubeRenderTarget)for(let $=0;$<6;$++){if(Array.isArray(v.__webglFramebuffer[$]))for(let J=0;J<v.__webglFramebuffer[$].length;J++)r.deleteFramebuffer(v.__webglFramebuffer[$][J]);else r.deleteFramebuffer(v.__webglFramebuffer[$]);v.__webglDepthbuffer&&r.deleteRenderbuffer(v.__webglDepthbuffer[$])}else{if(Array.isArray(v.__webglFramebuffer))for(let $=0;$<v.__webglFramebuffer.length;$++)r.deleteFramebuffer(v.__webglFramebuffer[$]);else r.deleteFramebuffer(v.__webglFramebuffer);if(v.__webglDepthbuffer&&r.deleteRenderbuffer(v.__webglDepthbuffer),v.__webglMultisampledFramebuffer&&r.deleteFramebuffer(v.__webglMultisampledFramebuffer),v.__webglColorRenderbuffer)for(let $=0;$<v.__webglColorRenderbuffer.length;$++)v.__webglColorRenderbuffer[$]&&r.deleteRenderbuffer(v.__webglColorRenderbuffer[$]);v.__webglDepthRenderbuffer&&r.deleteRenderbuffer(v.__webglDepthRenderbuffer)}const z=T.textures;for(let $=0,J=z.length;$<J;$++){const Y=i.get(z[$]);Y.__webglTexture&&(r.deleteTexture(Y.__webglTexture),s.memory.textures--),i.remove(z[$])}i.remove(T)}let C=0;function F(){C=0}function k(){const T=C;return T>=a.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+T+" texture units while this GPU supports only "+a.maxTextures),C+=1,T}function X(T){const v=[];return v.push(T.wrapS),v.push(T.wrapT),v.push(T.wrapR||0),v.push(T.magFilter),v.push(T.minFilter),v.push(T.anisotropy),v.push(T.internalFormat),v.push(T.format),v.push(T.type),v.push(T.generateMipmaps),v.push(T.premultiplyAlpha),v.push(T.flipY),v.push(T.unpackAlignment),v.push(T.colorSpace),v.join()}function K(T,v){const z=i.get(T);if(T.isVideoTexture&&Te(T),T.isRenderTargetTexture===!1&&T.version>0&&z.__version!==T.version){const $=T.image;if($===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if($.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{O(z,T,v);return}}t.bindTexture(r.TEXTURE_2D,z.__webglTexture,r.TEXTURE0+v)}function j(T,v){const z=i.get(T);if(T.version>0&&z.__version!==T.version){O(z,T,v);return}t.bindTexture(r.TEXTURE_2D_ARRAY,z.__webglTexture,r.TEXTURE0+v)}function ee(T,v){const z=i.get(T);if(T.version>0&&z.__version!==T.version){O(z,T,v);return}t.bindTexture(r.TEXTURE_3D,z.__webglTexture,r.TEXTURE0+v)}function W(T,v){const z=i.get(T);if(T.version>0&&z.__version!==T.version){G(z,T,v);return}t.bindTexture(r.TEXTURE_CUBE_MAP,z.__webglTexture,r.TEXTURE0+v)}const ae={1e3:r.REPEAT,1001:r.CLAMP_TO_EDGE,1002:r.MIRRORED_REPEAT},pe={1003:r.NEAREST,1004:r.NEAREST_MIPMAP_NEAREST,1005:r.NEAREST_MIPMAP_LINEAR,1006:r.LINEAR,1007:r.LINEAR_MIPMAP_NEAREST,1008:r.LINEAR_MIPMAP_LINEAR},Ae={512:r.NEVER,519:r.ALWAYS,513:r.LESS,515:r.LEQUAL,514:r.EQUAL,518:r.GEQUAL,516:r.GREATER,517:r.NOTEQUAL};function Z(T,v){if(v.type===1015&&e.has("OES_texture_float_linear")===!1&&(v.magFilter===1006||v.magFilter===1007||v.magFilter===1005||v.magFilter===1008||v.minFilter===1006||v.minFilter===1007||v.minFilter===1005||v.minFilter===1008)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),r.texParameteri(T,r.TEXTURE_WRAP_S,ae[v.wrapS]),r.texParameteri(T,r.TEXTURE_WRAP_T,ae[v.wrapT]),(T===r.TEXTURE_3D||T===r.TEXTURE_2D_ARRAY)&&r.texParameteri(T,r.TEXTURE_WRAP_R,ae[v.wrapR]),r.texParameteri(T,r.TEXTURE_MAG_FILTER,pe[v.magFilter]),r.texParameteri(T,r.TEXTURE_MIN_FILTER,pe[v.minFilter]),v.compareFunction&&(r.texParameteri(T,r.TEXTURE_COMPARE_MODE,r.COMPARE_REF_TO_TEXTURE),r.texParameteri(T,r.TEXTURE_COMPARE_FUNC,Ae[v.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(v.magFilter===1003||v.minFilter!==1005&&v.minFilter!==1008||v.type===1015&&e.has("OES_texture_float_linear")===!1)return;if(v.anisotropy>1||i.get(v).__currentAnisotropy){const z=e.get("EXT_texture_filter_anisotropic");r.texParameterf(T,z.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(v.anisotropy,a.getMaxAnisotropy())),i.get(v).__currentAnisotropy=v.anisotropy}}}function re(T,v){let z=!1;T.__webglInit===void 0&&(T.__webglInit=!0,v.addEventListener("dispose",A));const $=v.source;let J=u.get($);J===void 0&&(J={},u.set($,J));const Y=X(v);if(Y!==T.__cacheKey){J[Y]===void 0&&(J[Y]={texture:r.createTexture(),usedTimes:0},s.memory.textures++,z=!0),J[Y].usedTimes++;const ve=J[T.__cacheKey];ve!==void 0&&(J[T.__cacheKey].usedTimes--,ve.usedTimes===0&&b(v)),T.__cacheKey=Y,T.__webglTexture=J[Y].texture}return z}function O(T,v,z){let $=r.TEXTURE_2D;(v.isDataArrayTexture||v.isCompressedArrayTexture)&&($=r.TEXTURE_2D_ARRAY),v.isData3DTexture&&($=r.TEXTURE_3D);const J=re(T,v),Y=v.source;t.bindTexture($,T.__webglTexture,r.TEXTURE0+z);const ve=i.get(Y);if(Y.version!==ve.__version||J===!0){t.activeTexture(r.TEXTURE0+z);const ce=Ge.getPrimaries(Ge.workingColorSpace),ge=v.colorSpace===""?null:Ge.getPrimaries(v.colorSpace),He=v.colorSpace===""||ce===ge?r.NONE:r.BROWSER_DEFAULT_WEBGL;r.pixelStorei(r.UNPACK_FLIP_Y_WEBGL,v.flipY),r.pixelStorei(r.UNPACK_PREMULTIPLY_ALPHA_WEBGL,v.premultiplyAlpha),r.pixelStorei(r.UNPACK_ALIGNMENT,v.unpackAlignment),r.pixelStorei(r.UNPACK_COLORSPACE_CONVERSION_WEBGL,He);let ie=_(v.image,!1,a.maxTextureSize);ie=Qe(v,ie);const fe=n.convert(v.format,v.colorSpace),we=n.convert(v.type);let Re=E(v.internalFormat,fe,we,v.colorSpace,v.isVideoTexture);Z($,v);let me;const Be=v.mipmaps,Ue=v.isVideoTexture!==!0,qe=ve.__version===void 0||J===!0,L=Y.dataReady,le=N(v,ie);if(v.isDepthTexture)Re=M(v.format===1027,v.type),qe&&(Ue?t.texStorage2D(r.TEXTURE_2D,1,Re,ie.width,ie.height):t.texImage2D(r.TEXTURE_2D,0,Re,ie.width,ie.height,0,fe,we,null));else if(v.isDataTexture)if(Be.length>0){Ue&&qe&&t.texStorage2D(r.TEXTURE_2D,le,Re,Be[0].width,Be[0].height);for(let V=0,q=Be.length;V<q;V++)me=Be[V],Ue?L&&t.texSubImage2D(r.TEXTURE_2D,V,0,0,me.width,me.height,fe,we,me.data):t.texImage2D(r.TEXTURE_2D,V,Re,me.width,me.height,0,fe,we,me.data);v.generateMipmaps=!1}else Ue?(qe&&t.texStorage2D(r.TEXTURE_2D,le,Re,ie.width,ie.height),L&&t.texSubImage2D(r.TEXTURE_2D,0,0,0,ie.width,ie.height,fe,we,ie.data)):t.texImage2D(r.TEXTURE_2D,0,Re,ie.width,ie.height,0,fe,we,ie.data);else if(v.isCompressedTexture)if(v.isCompressedArrayTexture){Ue&&qe&&t.texStorage3D(r.TEXTURE_2D_ARRAY,le,Re,Be[0].width,Be[0].height,ie.depth);for(let V=0,q=Be.length;V<q;V++)if(me=Be[V],v.format!==1023)if(fe!==null)if(Ue){if(L)if(v.layerUpdates.size>0){const ue=zs(me.width,me.height,v.format,v.type);for(const se of v.layerUpdates){const ke=me.data.subarray(se*ue/me.data.BYTES_PER_ELEMENT,(se+1)*ue/me.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(r.TEXTURE_2D_ARRAY,V,0,0,se,me.width,me.height,1,fe,ke)}v.clearLayerUpdates()}else t.compressedTexSubImage3D(r.TEXTURE_2D_ARRAY,V,0,0,0,me.width,me.height,ie.depth,fe,me.data)}else t.compressedTexImage3D(r.TEXTURE_2D_ARRAY,V,Re,me.width,me.height,ie.depth,0,me.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Ue?L&&t.texSubImage3D(r.TEXTURE_2D_ARRAY,V,0,0,0,me.width,me.height,ie.depth,fe,we,me.data):t.texImage3D(r.TEXTURE_2D_ARRAY,V,Re,me.width,me.height,ie.depth,0,fe,we,me.data)}else{Ue&&qe&&t.texStorage2D(r.TEXTURE_2D,le,Re,Be[0].width,Be[0].height);for(let V=0,q=Be.length;V<q;V++)me=Be[V],v.format!==1023?fe!==null?Ue?L&&t.compressedTexSubImage2D(r.TEXTURE_2D,V,0,0,me.width,me.height,fe,me.data):t.compressedTexImage2D(r.TEXTURE_2D,V,Re,me.width,me.height,0,me.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Ue?L&&t.texSubImage2D(r.TEXTURE_2D,V,0,0,me.width,me.height,fe,we,me.data):t.texImage2D(r.TEXTURE_2D,V,Re,me.width,me.height,0,fe,we,me.data)}else if(v.isDataArrayTexture)if(Ue){if(qe&&t.texStorage3D(r.TEXTURE_2D_ARRAY,le,Re,ie.width,ie.height,ie.depth),L)if(v.layerUpdates.size>0){const V=zs(ie.width,ie.height,v.format,v.type);for(const q of v.layerUpdates){const ue=ie.data.subarray(q*V/ie.data.BYTES_PER_ELEMENT,(q+1)*V/ie.data.BYTES_PER_ELEMENT);t.texSubImage3D(r.TEXTURE_2D_ARRAY,0,0,0,q,ie.width,ie.height,1,fe,we,ue)}v.clearLayerUpdates()}else t.texSubImage3D(r.TEXTURE_2D_ARRAY,0,0,0,0,ie.width,ie.height,ie.depth,fe,we,ie.data)}else t.texImage3D(r.TEXTURE_2D_ARRAY,0,Re,ie.width,ie.height,ie.depth,0,fe,we,ie.data);else if(v.isData3DTexture)Ue?(qe&&t.texStorage3D(r.TEXTURE_3D,le,Re,ie.width,ie.height,ie.depth),L&&t.texSubImage3D(r.TEXTURE_3D,0,0,0,0,ie.width,ie.height,ie.depth,fe,we,ie.data)):t.texImage3D(r.TEXTURE_3D,0,Re,ie.width,ie.height,ie.depth,0,fe,we,ie.data);else if(v.isFramebufferTexture){if(qe)if(Ue)t.texStorage2D(r.TEXTURE_2D,le,Re,ie.width,ie.height);else{let V=ie.width,q=ie.height;for(let ue=0;ue<le;ue++)t.texImage2D(r.TEXTURE_2D,ue,Re,V,q,0,fe,we,null),V>>=1,q>>=1}}else if(Be.length>0){if(Ue&&qe){const V=Se(Be[0]);t.texStorage2D(r.TEXTURE_2D,le,Re,V.width,V.height)}for(let V=0,q=Be.length;V<q;V++)me=Be[V],Ue?L&&t.texSubImage2D(r.TEXTURE_2D,V,0,0,fe,we,me):t.texImage2D(r.TEXTURE_2D,V,Re,fe,we,me);v.generateMipmaps=!1}else if(Ue){if(qe){const V=Se(ie);t.texStorage2D(r.TEXTURE_2D,le,Re,V.width,V.height)}L&&t.texSubImage2D(r.TEXTURE_2D,0,0,0,fe,we,ie)}else t.texImage2D(r.TEXTURE_2D,0,Re,fe,we,ie);m(v)&&p($),ve.__version=Y.version,v.onUpdate&&v.onUpdate(v)}T.__version=v.version}function G(T,v,z){if(v.image.length!==6)return;const $=re(T,v),J=v.source;t.bindTexture(r.TEXTURE_CUBE_MAP,T.__webglTexture,r.TEXTURE0+z);const Y=i.get(J);if(J.version!==Y.__version||$===!0){t.activeTexture(r.TEXTURE0+z);const ve=Ge.getPrimaries(Ge.workingColorSpace),ce=v.colorSpace===""?null:Ge.getPrimaries(v.colorSpace),ge=v.colorSpace===""||ve===ce?r.NONE:r.BROWSER_DEFAULT_WEBGL;r.pixelStorei(r.UNPACK_FLIP_Y_WEBGL,v.flipY),r.pixelStorei(r.UNPACK_PREMULTIPLY_ALPHA_WEBGL,v.premultiplyAlpha),r.pixelStorei(r.UNPACK_ALIGNMENT,v.unpackAlignment),r.pixelStorei(r.UNPACK_COLORSPACE_CONVERSION_WEBGL,ge);const He=v.isCompressedTexture||v.image[0].isCompressedTexture,ie=v.image[0]&&v.image[0].isDataTexture,fe=[];for(let q=0;q<6;q++)!He&&!ie?fe[q]=_(v.image[q],!0,a.maxCubemapSize):fe[q]=ie?v.image[q].image:v.image[q],fe[q]=Qe(v,fe[q]);const we=fe[0],Re=n.convert(v.format,v.colorSpace),me=n.convert(v.type),Be=E(v.internalFormat,Re,me,v.colorSpace),Ue=v.isVideoTexture!==!0,qe=Y.__version===void 0||$===!0,L=J.dataReady;let le=N(v,we);Z(r.TEXTURE_CUBE_MAP,v);let V;if(He){Ue&&qe&&t.texStorage2D(r.TEXTURE_CUBE_MAP,le,Be,we.width,we.height);for(let q=0;q<6;q++){V=fe[q].mipmaps;for(let ue=0;ue<V.length;ue++){const se=V[ue];v.format!==1023?Re!==null?Ue?L&&t.compressedTexSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+q,ue,0,0,se.width,se.height,Re,se.data):t.compressedTexImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+q,ue,Be,se.width,se.height,0,se.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Ue?L&&t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+q,ue,0,0,se.width,se.height,Re,me,se.data):t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+q,ue,Be,se.width,se.height,0,Re,me,se.data)}}}else{if(V=v.mipmaps,Ue&&qe){V.length>0&&le++;const q=Se(fe[0]);t.texStorage2D(r.TEXTURE_CUBE_MAP,le,Be,q.width,q.height)}for(let q=0;q<6;q++)if(ie){Ue?L&&t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+q,0,0,0,fe[q].width,fe[q].height,Re,me,fe[q].data):t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+q,0,Be,fe[q].width,fe[q].height,0,Re,me,fe[q].data);for(let ue=0;ue<V.length;ue++){const se=V[ue].image[q].image;Ue?L&&t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+q,ue+1,0,0,se.width,se.height,Re,me,se.data):t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+q,ue+1,Be,se.width,se.height,0,Re,me,se.data)}}else{Ue?L&&t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+q,0,0,0,Re,me,fe[q]):t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+q,0,Be,Re,me,fe[q]);for(let ue=0;ue<V.length;ue++){const se=V[ue];Ue?L&&t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+q,ue+1,0,0,Re,me,se.image[q]):t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+q,ue+1,Be,Re,me,se.image[q])}}}m(v)&&p(r.TEXTURE_CUBE_MAP),Y.__version=J.version,v.onUpdate&&v.onUpdate(v)}T.__version=v.version}function ne(T,v,z,$,J,Y){const ve=n.convert(z.format,z.colorSpace),ce=n.convert(z.type),ge=E(z.internalFormat,ve,ce,z.colorSpace),He=i.get(v),ie=i.get(z);if(ie.__renderTarget=v,!He.__hasExternalTextures){const fe=Math.max(1,v.width>>Y),we=Math.max(1,v.height>>Y);J===r.TEXTURE_3D||J===r.TEXTURE_2D_ARRAY?t.texImage3D(J,Y,ge,fe,we,v.depth,0,ve,ce,null):t.texImage2D(J,Y,ge,fe,we,0,ve,ce,null)}t.bindFramebuffer(r.FRAMEBUFFER,T),ze(v)?o.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER,$,J,ie.__webglTexture,0,Fe(v)):(J===r.TEXTURE_2D||J>=r.TEXTURE_CUBE_MAP_POSITIVE_X&&J<=r.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&r.framebufferTexture2D(r.FRAMEBUFFER,$,J,ie.__webglTexture,Y),t.bindFramebuffer(r.FRAMEBUFFER,null)}function te(T,v,z){if(r.bindRenderbuffer(r.RENDERBUFFER,T),v.depthBuffer){const $=v.depthTexture,J=$&&$.isDepthTexture?$.type:null,Y=M(v.stencilBuffer,J),ve=v.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,ce=Fe(v);ze(v)?o.renderbufferStorageMultisampleEXT(r.RENDERBUFFER,ce,Y,v.width,v.height):z?r.renderbufferStorageMultisample(r.RENDERBUFFER,ce,Y,v.width,v.height):r.renderbufferStorage(r.RENDERBUFFER,Y,v.width,v.height),r.framebufferRenderbuffer(r.FRAMEBUFFER,ve,r.RENDERBUFFER,T)}else{const $=v.textures;for(let J=0;J<$.length;J++){const Y=$[J],ve=n.convert(Y.format,Y.colorSpace),ce=n.convert(Y.type),ge=E(Y.internalFormat,ve,ce,Y.colorSpace),He=Fe(v);z&&ze(v)===!1?r.renderbufferStorageMultisample(r.RENDERBUFFER,He,ge,v.width,v.height):ze(v)?o.renderbufferStorageMultisampleEXT(r.RENDERBUFFER,He,ge,v.width,v.height):r.renderbufferStorage(r.RENDERBUFFER,ge,v.width,v.height)}}r.bindRenderbuffer(r.RENDERBUFFER,null)}function he(T,v){if(v&&v.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(r.FRAMEBUFFER,T),!(v.depthTexture&&v.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const z=i.get(v.depthTexture);z.__renderTarget=v,(!z.__webglTexture||v.depthTexture.image.width!==v.width||v.depthTexture.image.height!==v.height)&&(v.depthTexture.image.width=v.width,v.depthTexture.image.height=v.height,v.depthTexture.needsUpdate=!0),K(v.depthTexture,0);const $=z.__webglTexture,J=Fe(v);if(v.depthTexture.format===1026)ze(v)?o.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER,r.DEPTH_ATTACHMENT,r.TEXTURE_2D,$,0,J):r.framebufferTexture2D(r.FRAMEBUFFER,r.DEPTH_ATTACHMENT,r.TEXTURE_2D,$,0);else if(v.depthTexture.format===1027)ze(v)?o.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER,r.DEPTH_STENCIL_ATTACHMENT,r.TEXTURE_2D,$,0,J):r.framebufferTexture2D(r.FRAMEBUFFER,r.DEPTH_STENCIL_ATTACHMENT,r.TEXTURE_2D,$,0);else throw new Error("Unknown depthTexture format")}function be(T){const v=i.get(T),z=T.isWebGLCubeRenderTarget===!0;if(v.__boundDepthTexture!==T.depthTexture){const $=T.depthTexture;if(v.__depthDisposeCallback&&v.__depthDisposeCallback(),$){const J=()=>{delete v.__boundDepthTexture,delete v.__depthDisposeCallback,$.removeEventListener("dispose",J)};$.addEventListener("dispose",J),v.__depthDisposeCallback=J}v.__boundDepthTexture=$}if(T.depthTexture&&!v.__autoAllocateDepthBuffer){if(z)throw new Error("target.depthTexture not supported in Cube render targets");he(v.__webglFramebuffer,T)}else if(z){v.__webglDepthbuffer=[];for(let $=0;$<6;$++)if(t.bindFramebuffer(r.FRAMEBUFFER,v.__webglFramebuffer[$]),v.__webglDepthbuffer[$]===void 0)v.__webglDepthbuffer[$]=r.createRenderbuffer(),te(v.__webglDepthbuffer[$],T,!1);else{const J=T.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,Y=v.__webglDepthbuffer[$];r.bindRenderbuffer(r.RENDERBUFFER,Y),r.framebufferRenderbuffer(r.FRAMEBUFFER,J,r.RENDERBUFFER,Y)}}else if(t.bindFramebuffer(r.FRAMEBUFFER,v.__webglFramebuffer),v.__webglDepthbuffer===void 0)v.__webglDepthbuffer=r.createRenderbuffer(),te(v.__webglDepthbuffer,T,!1);else{const $=T.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,J=v.__webglDepthbuffer;r.bindRenderbuffer(r.RENDERBUFFER,J),r.framebufferRenderbuffer(r.FRAMEBUFFER,$,r.RENDERBUFFER,J)}t.bindFramebuffer(r.FRAMEBUFFER,null)}function Ce(T,v,z){const $=i.get(T);v!==void 0&&ne($.__webglFramebuffer,T,T.texture,r.COLOR_ATTACHMENT0,r.TEXTURE_2D,0),z!==void 0&&be(T)}function Ve(T){const v=T.texture,z=i.get(T),$=i.get(v);T.addEventListener("dispose",w);const J=T.textures,Y=T.isWebGLCubeRenderTarget===!0,ve=J.length>1;if(ve||($.__webglTexture===void 0&&($.__webglTexture=r.createTexture()),$.__version=v.version,s.memory.textures++),Y){z.__webglFramebuffer=[];for(let ce=0;ce<6;ce++)if(v.mipmaps&&v.mipmaps.length>0){z.__webglFramebuffer[ce]=[];for(let ge=0;ge<v.mipmaps.length;ge++)z.__webglFramebuffer[ce][ge]=r.createFramebuffer()}else z.__webglFramebuffer[ce]=r.createFramebuffer()}else{if(v.mipmaps&&v.mipmaps.length>0){z.__webglFramebuffer=[];for(let ce=0;ce<v.mipmaps.length;ce++)z.__webglFramebuffer[ce]=r.createFramebuffer()}else z.__webglFramebuffer=r.createFramebuffer();if(ve)for(let ce=0,ge=J.length;ce<ge;ce++){const He=i.get(J[ce]);He.__webglTexture===void 0&&(He.__webglTexture=r.createTexture(),s.memory.textures++)}if(T.samples>0&&ze(T)===!1){z.__webglMultisampledFramebuffer=r.createFramebuffer(),z.__webglColorRenderbuffer=[],t.bindFramebuffer(r.FRAMEBUFFER,z.__webglMultisampledFramebuffer);for(let ce=0;ce<J.length;ce++){const ge=J[ce];z.__webglColorRenderbuffer[ce]=r.createRenderbuffer(),r.bindRenderbuffer(r.RENDERBUFFER,z.__webglColorRenderbuffer[ce]);const He=n.convert(ge.format,ge.colorSpace),ie=n.convert(ge.type),fe=E(ge.internalFormat,He,ie,ge.colorSpace,T.isXRRenderTarget===!0),we=Fe(T);r.renderbufferStorageMultisample(r.RENDERBUFFER,we,fe,T.width,T.height),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0+ce,r.RENDERBUFFER,z.__webglColorRenderbuffer[ce])}r.bindRenderbuffer(r.RENDERBUFFER,null),T.depthBuffer&&(z.__webglDepthRenderbuffer=r.createRenderbuffer(),te(z.__webglDepthRenderbuffer,T,!0)),t.bindFramebuffer(r.FRAMEBUFFER,null)}}if(Y){t.bindTexture(r.TEXTURE_CUBE_MAP,$.__webglTexture),Z(r.TEXTURE_CUBE_MAP,v);for(let ce=0;ce<6;ce++)if(v.mipmaps&&v.mipmaps.length>0)for(let ge=0;ge<v.mipmaps.length;ge++)ne(z.__webglFramebuffer[ce][ge],T,v,r.COLOR_ATTACHMENT0,r.TEXTURE_CUBE_MAP_POSITIVE_X+ce,ge);else ne(z.__webglFramebuffer[ce],T,v,r.COLOR_ATTACHMENT0,r.TEXTURE_CUBE_MAP_POSITIVE_X+ce,0);m(v)&&p(r.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(ve){for(let ce=0,ge=J.length;ce<ge;ce++){const He=J[ce],ie=i.get(He);t.bindTexture(r.TEXTURE_2D,ie.__webglTexture),Z(r.TEXTURE_2D,He),ne(z.__webglFramebuffer,T,He,r.COLOR_ATTACHMENT0+ce,r.TEXTURE_2D,0),m(He)&&p(r.TEXTURE_2D)}t.unbindTexture()}else{let ce=r.TEXTURE_2D;if((T.isWebGL3DRenderTarget||T.isWebGLArrayRenderTarget)&&(ce=T.isWebGL3DRenderTarget?r.TEXTURE_3D:r.TEXTURE_2D_ARRAY),t.bindTexture(ce,$.__webglTexture),Z(ce,v),v.mipmaps&&v.mipmaps.length>0)for(let ge=0;ge<v.mipmaps.length;ge++)ne(z.__webglFramebuffer[ge],T,v,r.COLOR_ATTACHMENT0,ce,ge);else ne(z.__webglFramebuffer,T,v,r.COLOR_ATTACHMENT0,ce,0);m(v)&&p(ce),t.unbindTexture()}T.depthBuffer&&be(T)}function Oe(T){const v=T.textures;for(let z=0,$=v.length;z<$;z++){const J=v[z];if(m(J)){const Y=S(T),ve=i.get(J).__webglTexture;t.bindTexture(Y,ve),p(Y),t.unbindTexture()}}}const st=[],U=[];function It(T){if(T.samples>0){if(ze(T)===!1){const v=T.textures,z=T.width,$=T.height;let J=r.COLOR_BUFFER_BIT;const Y=T.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,ve=i.get(T),ce=v.length>1;if(ce)for(let ge=0;ge<v.length;ge++)t.bindFramebuffer(r.FRAMEBUFFER,ve.__webglMultisampledFramebuffer),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0+ge,r.RENDERBUFFER,null),t.bindFramebuffer(r.FRAMEBUFFER,ve.__webglFramebuffer),r.framebufferTexture2D(r.DRAW_FRAMEBUFFER,r.COLOR_ATTACHMENT0+ge,r.TEXTURE_2D,null,0);t.bindFramebuffer(r.READ_FRAMEBUFFER,ve.__webglMultisampledFramebuffer),t.bindFramebuffer(r.DRAW_FRAMEBUFFER,ve.__webglFramebuffer);for(let ge=0;ge<v.length;ge++){if(T.resolveDepthBuffer&&(T.depthBuffer&&(J|=r.DEPTH_BUFFER_BIT),T.stencilBuffer&&T.resolveStencilBuffer&&(J|=r.STENCIL_BUFFER_BIT)),ce){r.framebufferRenderbuffer(r.READ_FRAMEBUFFER,r.COLOR_ATTACHMENT0,r.RENDERBUFFER,ve.__webglColorRenderbuffer[ge]);const He=i.get(v[ge]).__webglTexture;r.framebufferTexture2D(r.DRAW_FRAMEBUFFER,r.COLOR_ATTACHMENT0,r.TEXTURE_2D,He,0)}r.blitFramebuffer(0,0,z,$,0,0,z,$,J,r.NEAREST),l===!0&&(st.length=0,U.length=0,st.push(r.COLOR_ATTACHMENT0+ge),T.depthBuffer&&T.resolveDepthBuffer===!1&&(st.push(Y),U.push(Y),r.invalidateFramebuffer(r.DRAW_FRAMEBUFFER,U)),r.invalidateFramebuffer(r.READ_FRAMEBUFFER,st))}if(t.bindFramebuffer(r.READ_FRAMEBUFFER,null),t.bindFramebuffer(r.DRAW_FRAMEBUFFER,null),ce)for(let ge=0;ge<v.length;ge++){t.bindFramebuffer(r.FRAMEBUFFER,ve.__webglMultisampledFramebuffer),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0+ge,r.RENDERBUFFER,ve.__webglColorRenderbuffer[ge]);const He=i.get(v[ge]).__webglTexture;t.bindFramebuffer(r.FRAMEBUFFER,ve.__webglFramebuffer),r.framebufferTexture2D(r.DRAW_FRAMEBUFFER,r.COLOR_ATTACHMENT0+ge,r.TEXTURE_2D,He,0)}t.bindFramebuffer(r.DRAW_FRAMEBUFFER,ve.__webglMultisampledFramebuffer)}else if(T.depthBuffer&&T.resolveDepthBuffer===!1&&l){const v=T.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT;r.invalidateFramebuffer(r.DRAW_FRAMEBUFFER,[v])}}}function Fe(T){return Math.min(a.maxSamples,T.samples)}function ze(T){const v=i.get(T);return T.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&v.__useRenderToTexture!==!1}function Te(T){const v=s.render.frame;h.get(T)!==v&&(h.set(T,v),T.update())}function Qe(T,v){const z=T.colorSpace,$=T.format,J=T.type;return T.isCompressedTexture===!0||T.isVideoTexture===!0||z!==ar&&z!==""&&(Ge.getTransfer(z)===$e?($!==1023||J!==1009)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",z)),v}function Se(T){return typeof HTMLImageElement<"u"&&T instanceof HTMLImageElement?(c.width=T.naturalWidth||T.width,c.height=T.naturalHeight||T.height):typeof VideoFrame<"u"&&T instanceof VideoFrame?(c.width=T.displayWidth,c.height=T.displayHeight):(c.width=T.width,c.height=T.height),c}this.allocateTextureUnit=k,this.resetTextureUnits=F,this.setTexture2D=K,this.setTexture2DArray=j,this.setTexture3D=ee,this.setTextureCube=W,this.rebindTextures=Ce,this.setupRenderTarget=Ve,this.updateRenderTargetMipmap=Oe,this.updateMultisampleRenderTarget=It,this.setupDepthRenderbuffer=be,this.setupFrameBufferTexture=ne,this.useMultisampledRTT=ze}function hp(r,e){function t(i,a=""){let n;const s=Ge.getTransfer(a);if(i===1009)return r.UNSIGNED_BYTE;if(i===1017)return r.UNSIGNED_SHORT_4_4_4_4;if(i===1018)return r.UNSIGNED_SHORT_5_5_5_1;if(i===35902)return r.UNSIGNED_INT_5_9_9_9_REV;if(i===1010)return r.BYTE;if(i===1011)return r.SHORT;if(i===1012)return r.UNSIGNED_SHORT;if(i===1013)return r.INT;if(i===1014)return r.UNSIGNED_INT;if(i===1015)return r.FLOAT;if(i===1016)return r.HALF_FLOAT;if(i===1021)return r.ALPHA;if(i===1022)return r.RGB;if(i===1023)return r.RGBA;if(i===1024)return r.LUMINANCE;if(i===1025)return r.LUMINANCE_ALPHA;if(i===1026)return r.DEPTH_COMPONENT;if(i===1027)return r.DEPTH_STENCIL;if(i===1028)return r.RED;if(i===1029)return r.RED_INTEGER;if(i===1030)return r.RG;if(i===1031)return r.RG_INTEGER;if(i===1033)return r.RGBA_INTEGER;if(i===33776||i===33777||i===33778||i===33779)if(s===$e)if(n=e.get("WEBGL_compressed_texture_s3tc_srgb"),n!==null){if(i===33776)return n.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===33777)return n.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===33778)return n.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===33779)return n.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(n=e.get("WEBGL_compressed_texture_s3tc"),n!==null){if(i===33776)return n.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===33777)return n.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===33778)return n.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===33779)return n.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===35840||i===35841||i===35842||i===35843)if(n=e.get("WEBGL_compressed_texture_pvrtc"),n!==null){if(i===35840)return n.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===35841)return n.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===35842)return n.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===35843)return n.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===36196||i===37492||i===37496)if(n=e.get("WEBGL_compressed_texture_etc"),n!==null){if(i===36196||i===37492)return s===$e?n.COMPRESSED_SRGB8_ETC2:n.COMPRESSED_RGB8_ETC2;if(i===37496)return s===$e?n.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:n.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(i===37808||i===37809||i===37810||i===37811||i===37812||i===37813||i===37814||i===37815||i===37816||i===37817||i===37818||i===37819||i===37820||i===37821)if(n=e.get("WEBGL_compressed_texture_astc"),n!==null){if(i===37808)return s===$e?n.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:n.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===37809)return s===$e?n.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:n.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===37810)return s===$e?n.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:n.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===37811)return s===$e?n.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:n.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===37812)return s===$e?n.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:n.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===37813)return s===$e?n.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:n.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===37814)return s===$e?n.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:n.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===37815)return s===$e?n.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:n.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===37816)return s===$e?n.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:n.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===37817)return s===$e?n.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:n.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===37818)return s===$e?n.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:n.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===37819)return s===$e?n.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:n.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===37820)return s===$e?n.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:n.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===37821)return s===$e?n.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:n.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===36492||i===36494||i===36495)if(n=e.get("EXT_texture_compression_bptc"),n!==null){if(i===36492)return s===$e?n.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:n.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===36494)return n.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===36495)return n.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===36283||i===36284||i===36285||i===36286)if(n=e.get("EXT_texture_compression_rgtc"),n!==null){if(i===36492)return n.COMPRESSED_RED_RGTC1_EXT;if(i===36284)return n.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===36285)return n.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===36286)return n.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===1020?r.UNSIGNED_INT_24_8:r[i]!==void 0?r[i]:null}return{convert:t}}class up extends Ct{constructor(e=[]){super(),this.isArrayCamera=!0,this.cameras=e}}class Gt extends ft{constructor(){super(),this.isGroup=!0,this.type="Group"}}const dp={type:"move"};class qa{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Gt,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Gt,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new R,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new R),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Gt,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new R,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new R),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const i of e.hand.values())this._getHandJoint(t,i)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,i){let a=null,n=null,s=null;const o=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){s=!0;for(const _ of e.hand.values()){const m=t.getJointPose(_,i),p=this._getHandJoint(c,_);m!==null&&(p.matrix.fromArray(m.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=m.radius),p.visible=m!==null}const h=c.joints["index-finger-tip"],d=c.joints["thumb-tip"],u=h.position.distanceTo(d.position),f=.02,g=.005;c.inputState.pinching&&u>f+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&u<=f-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(n=t.getPose(e.gripSpace,i),n!==null&&(l.matrix.fromArray(n.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,n.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(n.linearVelocity)):l.hasLinearVelocity=!1,n.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(n.angularVelocity)):l.hasAngularVelocity=!1));o!==null&&(a=t.getPose(e.targetRaySpace,i),a===null&&n!==null&&(a=n),a!==null&&(o.matrix.fromArray(a.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,a.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(a.linearVelocity)):o.hasLinearVelocity=!1,a.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(a.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(dp)))}return o!==null&&(o.visible=a!==null),l!==null&&(l.visible=n!==null),c!==null&&(c.visible=s!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const i=new Gt;i.matrixAutoUpdate=!1,i.visible=!1,e.joints[t.jointName]=i,e.add(i)}return e.joints[t.jointName]}}const pp=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,fp=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class mp{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t,i){if(this.texture===null){const a=new yt,n=e.properties.get(a);n.__webglTexture=t.texture,(t.depthNear!=i.depthNear||t.depthFar!=i.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=a}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,i=new Tt({vertexShader:pp,fragmentShader:fp,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new Ze(new To(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class gp extends nr{constructor(e,t){super();const i=this;let a=null,n=1,s=null,o="local-floor",l=1,c=null,h=null,d=null,u=null,f=null,g=null;const _=new mp,m=t.getContextAttributes();let p=null,S=null;const E=[],M=[],N=new Ie;let A=null;const w=new Ct;w.viewport=new Ke;const P=new Ct;P.viewport=new Ke;const b=[w,P],x=new up;let C=null,F=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(O){let G=E[O];return G===void 0&&(G=new qa,E[O]=G),G.getTargetRaySpace()},this.getControllerGrip=function(O){let G=E[O];return G===void 0&&(G=new qa,E[O]=G),G.getGripSpace()},this.getHand=function(O){let G=E[O];return G===void 0&&(G=new qa,E[O]=G),G.getHandSpace()};function k(O){const G=M.indexOf(O.inputSource);if(G===-1)return;const ne=E[G];ne!==void 0&&(ne.update(O.inputSource,O.frame,c||s),ne.dispatchEvent({type:O.type,data:O.inputSource}))}function X(){a.removeEventListener("select",k),a.removeEventListener("selectstart",k),a.removeEventListener("selectend",k),a.removeEventListener("squeeze",k),a.removeEventListener("squeezestart",k),a.removeEventListener("squeezeend",k),a.removeEventListener("end",X),a.removeEventListener("inputsourceschange",K);for(let O=0;O<E.length;O++){const G=M[O];G!==null&&(M[O]=null,E[O].disconnect(G))}C=null,F=null,_.reset(),e.setRenderTarget(p),f=null,u=null,d=null,a=null,S=null,re.stop(),i.isPresenting=!1,e.setPixelRatio(A),e.setSize(N.width,N.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(O){n=O,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(O){o=O,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||s},this.setReferenceSpace=function(O){c=O},this.getBaseLayer=function(){return u!==null?u:f},this.getBinding=function(){return d},this.getFrame=function(){return g},this.getSession=function(){return a},this.setSession=async function(O){if(a=O,a!==null){if(p=e.getRenderTarget(),a.addEventListener("select",k),a.addEventListener("selectstart",k),a.addEventListener("selectend",k),a.addEventListener("squeeze",k),a.addEventListener("squeezestart",k),a.addEventListener("squeezeend",k),a.addEventListener("end",X),a.addEventListener("inputsourceschange",K),m.xrCompatible!==!0&&await t.makeXRCompatible(),A=e.getPixelRatio(),e.getSize(N),a.renderState.layers===void 0){const G={antialias:m.antialias,alpha:!0,depth:m.depth,stencil:m.stencil,framebufferScaleFactor:n};f=new XRWebGLLayer(a,t,G),a.updateRenderState({baseLayer:f}),e.setPixelRatio(1),e.setSize(f.framebufferWidth,f.framebufferHeight,!1),S=new Ei(f.framebufferWidth,f.framebufferHeight,{format:1023,type:1009,colorSpace:e.outputColorSpace,stencilBuffer:m.stencil})}else{let G=null,ne=null,te=null;m.depth&&(te=m.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,G=m.stencil?1027:1026,ne=m.stencil?1020:1014);const he={colorFormat:t.RGBA8,depthFormat:te,scaleFactor:n};d=new XRWebGLBinding(a,t),u=d.createProjectionLayer(he),a.updateRenderState({layers:[u]}),e.setPixelRatio(1),e.setSize(u.textureWidth,u.textureHeight,!1),S=new Ei(u.textureWidth,u.textureHeight,{format:1023,type:1009,depthTexture:new Ao(u.textureWidth,u.textureHeight,ne,void 0,void 0,void 0,void 0,void 0,void 0,G),stencilBuffer:m.stencil,colorSpace:e.outputColorSpace,samples:m.antialias?4:0,resolveDepthBuffer:u.ignoreDepthValues===!1})}S.isXRRenderTarget=!0,this.setFoveation(l),c=null,s=await a.requestReferenceSpace(o),re.setContext(a),re.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(a!==null)return a.environmentBlendMode},this.getDepthTexture=function(){return _.getDepthTexture()};function K(O){for(let G=0;G<O.removed.length;G++){const ne=O.removed[G],te=M.indexOf(ne);te>=0&&(M[te]=null,E[te].disconnect(ne))}for(let G=0;G<O.added.length;G++){const ne=O.added[G];let te=M.indexOf(ne);if(te===-1){for(let be=0;be<E.length;be++)if(be>=M.length){M.push(ne),te=be;break}else if(M[be]===null){M[be]=ne,te=be;break}if(te===-1)break}const he=E[te];he&&he.connect(ne)}}const j=new R,ee=new R;function W(O,G,ne){j.setFromMatrixPosition(G.matrixWorld),ee.setFromMatrixPosition(ne.matrixWorld);const te=j.distanceTo(ee),he=G.projectionMatrix.elements,be=ne.projectionMatrix.elements,Ce=he[14]/(he[10]-1),Ve=he[14]/(he[10]+1),Oe=(he[9]+1)/he[5],st=(he[9]-1)/he[5],U=(he[8]-1)/he[0],It=(be[8]+1)/be[0],Fe=Ce*U,ze=Ce*It,Te=te/(-U+It),Qe=Te*-U;if(G.matrixWorld.decompose(O.position,O.quaternion,O.scale),O.translateX(Qe),O.translateZ(Te),O.matrixWorld.compose(O.position,O.quaternion,O.scale),O.matrixWorldInverse.copy(O.matrixWorld).invert(),he[10]===-1)O.projectionMatrix.copy(G.projectionMatrix),O.projectionMatrixInverse.copy(G.projectionMatrixInverse);else{const Se=Ce+Te,T=Ve+Te,v=Fe-Qe,z=ze+(te-Qe),$=Oe*Ve/T*Se,J=st*Ve/T*Se;O.projectionMatrix.makePerspective(v,z,$,J,Se,T),O.projectionMatrixInverse.copy(O.projectionMatrix).invert()}}function ae(O,G){G===null?O.matrixWorld.copy(O.matrix):O.matrixWorld.multiplyMatrices(G.matrixWorld,O.matrix),O.matrixWorldInverse.copy(O.matrixWorld).invert()}this.updateCamera=function(O){if(a===null)return;let G=O.near,ne=O.far;_.texture!==null&&(_.depthNear>0&&(G=_.depthNear),_.depthFar>0&&(ne=_.depthFar)),x.near=P.near=w.near=G,x.far=P.far=w.far=ne,(C!==x.near||F!==x.far)&&(a.updateRenderState({depthNear:x.near,depthFar:x.far}),C=x.near,F=x.far),w.layers.mask=O.layers.mask|2,P.layers.mask=O.layers.mask|4,x.layers.mask=w.layers.mask|P.layers.mask;const te=O.parent,he=x.cameras;ae(x,te);for(let be=0;be<he.length;be++)ae(he[be],te);he.length===2?W(x,w,P):x.projectionMatrix.copy(w.projectionMatrix),pe(O,x,te)};function pe(O,G,ne){ne===null?O.matrix.copy(G.matrixWorld):(O.matrix.copy(ne.matrixWorld),O.matrix.invert(),O.matrix.multiply(G.matrixWorld)),O.matrix.decompose(O.position,O.quaternion,O.scale),O.updateMatrixWorld(!0),O.projectionMatrix.copy(G.projectionMatrix),O.projectionMatrixInverse.copy(G.projectionMatrixInverse),O.isPerspectiveCamera&&(O.fov=Ir*2*Math.atan(1/O.projectionMatrix.elements[5]),O.zoom=1)}this.getCamera=function(){return x},this.getFoveation=function(){if(!(u===null&&f===null))return l},this.setFoveation=function(O){l=O,u!==null&&(u.fixedFoveation=O),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=O)},this.hasDepthSensing=function(){return _.texture!==null},this.getDepthSensingMesh=function(){return _.getMesh(x)};let Ae=null;function Z(O,G){if(h=G.getViewerPose(c||s),g=G,h!==null){const ne=h.views;f!==null&&(e.setRenderTargetFramebuffer(S,f.framebuffer),e.setRenderTarget(S));let te=!1;ne.length!==x.cameras.length&&(x.cameras.length=0,te=!0);for(let be=0;be<ne.length;be++){const Ce=ne[be];let Ve=null;if(f!==null)Ve=f.getViewport(Ce);else{const st=d.getViewSubImage(u,Ce);Ve=st.viewport,be===0&&(e.setRenderTargetTextures(S,st.colorTexture,u.ignoreDepthValues?void 0:st.depthStencilTexture),e.setRenderTarget(S))}let Oe=b[be];Oe===void 0&&(Oe=new Ct,Oe.layers.enable(be),Oe.viewport=new Ke,b[be]=Oe),Oe.matrix.fromArray(Ce.transform.matrix),Oe.matrix.decompose(Oe.position,Oe.quaternion,Oe.scale),Oe.projectionMatrix.fromArray(Ce.projectionMatrix),Oe.projectionMatrixInverse.copy(Oe.projectionMatrix).invert(),Oe.viewport.set(Ve.x,Ve.y,Ve.width,Ve.height),be===0&&(x.matrix.copy(Oe.matrix),x.matrix.decompose(x.position,x.quaternion,x.scale)),te===!0&&x.cameras.push(Oe)}const he=a.enabledFeatures;if(he&&he.includes("depth-sensing")){const be=d.getDepthInformation(ne[0]);be&&be.isValid&&be.texture&&_.init(e,be,a.renderState)}}for(let ne=0;ne<E.length;ne++){const te=M[ne],he=E[ne];te!==null&&he!==void 0&&he.update(te,G,c||s)}Ae&&Ae(O,G),G.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:G}),g=null}const re=new Eo;re.setAnimationLoop(Z),this.setAnimationLoop=function(O){Ae=O},this.dispose=function(){}}}const xi=new hi,_p=new Je;function vp(r,e){function t(m,p){m.matrixAutoUpdate===!0&&m.updateMatrix(),p.value.copy(m.matrix)}function i(m,p){p.color.getRGB(m.fogColor.value,Mo(r)),p.isFog?(m.fogNear.value=p.near,m.fogFar.value=p.far):p.isFogExp2&&(m.fogDensity.value=p.density)}function a(m,p,S,E,M){p.isMeshBasicMaterial||p.isMeshLambertMaterial?n(m,p):p.isMeshToonMaterial?(n(m,p),d(m,p)):p.isMeshPhongMaterial?(n(m,p),h(m,p)):p.isMeshStandardMaterial?(n(m,p),u(m,p),p.isMeshPhysicalMaterial&&f(m,p,M)):p.isMeshMatcapMaterial?(n(m,p),g(m,p)):p.isMeshDepthMaterial?n(m,p):p.isMeshDistanceMaterial?(n(m,p),_(m,p)):p.isMeshNormalMaterial?n(m,p):p.isLineBasicMaterial?(s(m,p),p.isLineDashedMaterial&&o(m,p)):p.isPointsMaterial?l(m,p,S,E):p.isSpriteMaterial?c(m,p):p.isShadowMaterial?(m.color.value.copy(p.color),m.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function n(m,p){m.opacity.value=p.opacity,p.color&&m.diffuse.value.copy(p.color),p.emissive&&m.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(m.map.value=p.map,t(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.bumpMap&&(m.bumpMap.value=p.bumpMap,t(p.bumpMap,m.bumpMapTransform),m.bumpScale.value=p.bumpScale,p.side===1&&(m.bumpScale.value*=-1)),p.normalMap&&(m.normalMap.value=p.normalMap,t(p.normalMap,m.normalMapTransform),m.normalScale.value.copy(p.normalScale),p.side===1&&m.normalScale.value.negate()),p.displacementMap&&(m.displacementMap.value=p.displacementMap,t(p.displacementMap,m.displacementMapTransform),m.displacementScale.value=p.displacementScale,m.displacementBias.value=p.displacementBias),p.emissiveMap&&(m.emissiveMap.value=p.emissiveMap,t(p.emissiveMap,m.emissiveMapTransform)),p.specularMap&&(m.specularMap.value=p.specularMap,t(p.specularMap,m.specularMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest);const S=e.get(p),E=S.envMap,M=S.envMapRotation;E&&(m.envMap.value=E,xi.copy(M),xi.x*=-1,xi.y*=-1,xi.z*=-1,E.isCubeTexture&&E.isRenderTargetTexture===!1&&(xi.y*=-1,xi.z*=-1),m.envMapRotation.value.setFromMatrix4(_p.makeRotationFromEuler(xi)),m.flipEnvMap.value=E.isCubeTexture&&E.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=p.reflectivity,m.ior.value=p.ior,m.refractionRatio.value=p.refractionRatio),p.lightMap&&(m.lightMap.value=p.lightMap,m.lightMapIntensity.value=p.lightMapIntensity,t(p.lightMap,m.lightMapTransform)),p.aoMap&&(m.aoMap.value=p.aoMap,m.aoMapIntensity.value=p.aoMapIntensity,t(p.aoMap,m.aoMapTransform))}function s(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,p.map&&(m.map.value=p.map,t(p.map,m.mapTransform))}function o(m,p){m.dashSize.value=p.dashSize,m.totalSize.value=p.dashSize+p.gapSize,m.scale.value=p.scale}function l(m,p,S,E){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.size.value=p.size*S,m.scale.value=E*.5,p.map&&(m.map.value=p.map,t(p.map,m.uvTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function c(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.rotation.value=p.rotation,p.map&&(m.map.value=p.map,t(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function h(m,p){m.specular.value.copy(p.specular),m.shininess.value=Math.max(p.shininess,1e-4)}function d(m,p){p.gradientMap&&(m.gradientMap.value=p.gradientMap)}function u(m,p){m.metalness.value=p.metalness,p.metalnessMap&&(m.metalnessMap.value=p.metalnessMap,t(p.metalnessMap,m.metalnessMapTransform)),m.roughness.value=p.roughness,p.roughnessMap&&(m.roughnessMap.value=p.roughnessMap,t(p.roughnessMap,m.roughnessMapTransform)),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)}function f(m,p,S){m.ior.value=p.ior,p.sheen>0&&(m.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),m.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(m.sheenColorMap.value=p.sheenColorMap,t(p.sheenColorMap,m.sheenColorMapTransform)),p.sheenRoughnessMap&&(m.sheenRoughnessMap.value=p.sheenRoughnessMap,t(p.sheenRoughnessMap,m.sheenRoughnessMapTransform))),p.clearcoat>0&&(m.clearcoat.value=p.clearcoat,m.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(m.clearcoatMap.value=p.clearcoatMap,t(p.clearcoatMap,m.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,t(p.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(m.clearcoatNormalMap.value=p.clearcoatNormalMap,t(p.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===1&&m.clearcoatNormalScale.value.negate())),p.dispersion>0&&(m.dispersion.value=p.dispersion),p.iridescence>0&&(m.iridescence.value=p.iridescence,m.iridescenceIOR.value=p.iridescenceIOR,m.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(m.iridescenceMap.value=p.iridescenceMap,t(p.iridescenceMap,m.iridescenceMapTransform)),p.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=p.iridescenceThicknessMap,t(p.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),p.transmission>0&&(m.transmission.value=p.transmission,m.transmissionSamplerMap.value=S.texture,m.transmissionSamplerSize.value.set(S.width,S.height),p.transmissionMap&&(m.transmissionMap.value=p.transmissionMap,t(p.transmissionMap,m.transmissionMapTransform)),m.thickness.value=p.thickness,p.thicknessMap&&(m.thicknessMap.value=p.thicknessMap,t(p.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=p.attenuationDistance,m.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(m.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(m.anisotropyMap.value=p.anisotropyMap,t(p.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=p.specularIntensity,m.specularColor.value.copy(p.specularColor),p.specularColorMap&&(m.specularColorMap.value=p.specularColorMap,t(p.specularColorMap,m.specularColorMapTransform)),p.specularIntensityMap&&(m.specularIntensityMap.value=p.specularIntensityMap,t(p.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,p){p.matcap&&(m.matcap.value=p.matcap)}function _(m,p){const S=e.get(p).light;m.referencePosition.value.setFromMatrixPosition(S.matrixWorld),m.nearDistance.value=S.shadow.camera.near,m.farDistance.value=S.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:a}}function xp(r,e,t,i){let a={},n={},s=[];const o=r.getParameter(r.MAX_UNIFORM_BUFFER_BINDINGS);function l(S,E){const M=E.program;i.uniformBlockBinding(S,M)}function c(S,E){let M=a[S.id];M===void 0&&(g(S),M=h(S),a[S.id]=M,S.addEventListener("dispose",m));const N=E.program;i.updateUBOMapping(S,N);const A=e.render.frame;n[S.id]!==A&&(u(S),n[S.id]=A)}function h(S){const E=d();S.__bindingPointIndex=E;const M=r.createBuffer(),N=S.__size,A=S.usage;return r.bindBuffer(r.UNIFORM_BUFFER,M),r.bufferData(r.UNIFORM_BUFFER,N,A),r.bindBuffer(r.UNIFORM_BUFFER,null),r.bindBufferBase(r.UNIFORM_BUFFER,E,M),M}function d(){for(let S=0;S<o;S++)if(s.indexOf(S)===-1)return s.push(S),S;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function u(S){const E=a[S.id],M=S.uniforms,N=S.__cache;r.bindBuffer(r.UNIFORM_BUFFER,E);for(let A=0,w=M.length;A<w;A++){const P=Array.isArray(M[A])?M[A]:[M[A]];for(let b=0,x=P.length;b<x;b++){const C=P[b];if(f(C,A,b,N)===!0){const F=C.__offset,k=Array.isArray(C.value)?C.value:[C.value];let X=0;for(let K=0;K<k.length;K++){const j=k[K],ee=_(j);typeof j=="number"||typeof j=="boolean"?(C.__data[0]=j,r.bufferSubData(r.UNIFORM_BUFFER,F+X,C.__data)):j.isMatrix3?(C.__data[0]=j.elements[0],C.__data[1]=j.elements[1],C.__data[2]=j.elements[2],C.__data[3]=0,C.__data[4]=j.elements[3],C.__data[5]=j.elements[4],C.__data[6]=j.elements[5],C.__data[7]=0,C.__data[8]=j.elements[6],C.__data[9]=j.elements[7],C.__data[10]=j.elements[8],C.__data[11]=0):(j.toArray(C.__data,X),X+=ee.storage/Float32Array.BYTES_PER_ELEMENT)}r.bufferSubData(r.UNIFORM_BUFFER,F,C.__data)}}}r.bindBuffer(r.UNIFORM_BUFFER,null)}function f(S,E,M,N){const A=S.value,w=E+"_"+M;if(N[w]===void 0)return typeof A=="number"||typeof A=="boolean"?N[w]=A:N[w]=A.clone(),!0;{const P=N[w];if(typeof A=="number"||typeof A=="boolean"){if(P!==A)return N[w]=A,!0}else if(P.equals(A)===!1)return P.copy(A),!0}return!1}function g(S){const E=S.uniforms;let M=0;const N=16;for(let w=0,P=E.length;w<P;w++){const b=Array.isArray(E[w])?E[w]:[E[w]];for(let x=0,C=b.length;x<C;x++){const F=b[x],k=Array.isArray(F.value)?F.value:[F.value];for(let X=0,K=k.length;X<K;X++){const j=k[X],ee=_(j),W=M%N,ae=W%ee.boundary,pe=W+ae;M+=ae,pe!==0&&N-pe<ee.storage&&(M+=N-pe),F.__data=new Float32Array(ee.storage/Float32Array.BYTES_PER_ELEMENT),F.__offset=M,M+=ee.storage}}}const A=M%N;return A>0&&(M+=N-A),S.__size=M,S.__cache={},this}function _(S){const E={boundary:0,storage:0};return typeof S=="number"||typeof S=="boolean"?(E.boundary=4,E.storage=4):S.isVector2?(E.boundary=8,E.storage=8):S.isVector3||S.isColor?(E.boundary=16,E.storage=12):S.isVector4?(E.boundary=16,E.storage=16):S.isMatrix3?(E.boundary=48,E.storage=48):S.isMatrix4?(E.boundary=64,E.storage=64):S.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",S),E}function m(S){const E=S.target;E.removeEventListener("dispose",m);const M=s.indexOf(E.__bindingPointIndex);s.splice(M,1),r.deleteBuffer(a[E.id]),delete a[E.id],delete n[E.id]}function p(){for(const S in a)r.deleteBuffer(a[S]);s=[],a={},n={}}return{bind:l,update:c,dispose:p}}class yp{constructor(e={}){const{canvas:t=ol(),context:i=null,depth:a=!0,stencil:n=!1,alpha:s=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:d=!1,reverseDepthBuffer:u=!1}=e;this.isWebGLRenderer=!0;let f;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");f=i.getContextAttributes().alpha}else f=s;const g=new Uint32Array(4),_=new Int32Array(4);let m=null,p=null;const S=[],E=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=Et,this.toneMapping=0,this.toneMappingExposure=1;const M=this;let N=!1,A=0,w=0,P=null,b=-1,x=null;const C=new Ke,F=new Ke;let k=null;const X=new Me(0);let K=0,j=t.width,ee=t.height,W=1,ae=null,pe=null;const Ae=new Ke(0,0,j,ee),Z=new Ke(0,0,j,ee);let re=!1;const O=new wn;let G=!1,ne=!1;const te=new Je,he=new Je,be=new R,Ce=new Ke,Ve={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Oe=!1;function st(){return P===null?W:1}let U=i;function It(y,D){return t.getContext(y,D)}try{const y={alpha:!0,depth:a,stencil:n,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:d};if("setAttribute"in t&&t.setAttribute("data-engine","three.js r170"),t.addEventListener("webglcontextlost",q,!1),t.addEventListener("webglcontextrestored",ue,!1),t.addEventListener("webglcontextcreationerror",se,!1),U===null){const D="webgl2";if(U=It(D,y),U===null)throw It(D)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(y){throw console.error("THREE.WebGLRenderer: "+y.message),y}let Fe,ze,Te,Qe,Se,T,v,z,$,J,Y,ve,ce,ge,He,ie,fe,we,Re,me,Be,Ue,qe,L;function le(){Fe=new Tu(U),Fe.init(),Ue=new hp(U,Fe),ze=new vu(U,Fe,e,Ue),Te=new op(U,Fe),ze.reverseDepthBuffer&&u&&Te.buffers.depth.setReversed(!0),Qe=new Ru(U),Se=new jd,T=new cp(U,Fe,Te,Se,ze,Ue,Qe),v=new yu(M),z=new Eu(M),$=new Ul(U),qe=new gu(U,$),J=new wu(U,$,Qe,qe),Y=new Pu(U,J,$,Qe),Re=new Cu(U,ze,T),ie=new xu(Se),ve=new Xd(M,v,z,Fe,ze,qe,ie),ce=new vp(M,Se),ge=new $d,He=new ep(Fe),we=new mu(M,v,z,Te,Y,f,l),fe=new np(M,Y,ze),L=new xp(U,Qe,ze,Te),me=new _u(U,Fe,Qe),Be=new Au(U,Fe,Qe),Qe.programs=ve.programs,M.capabilities=ze,M.extensions=Fe,M.properties=Se,M.renderLists=ge,M.shadowMap=fe,M.state=Te,M.info=Qe}le();const V=new gp(M,U);this.xr=V,this.getContext=function(){return U},this.getContextAttributes=function(){return U.getContextAttributes()},this.forceContextLoss=function(){const y=Fe.get("WEBGL_lose_context");y&&y.loseContext()},this.forceContextRestore=function(){const y=Fe.get("WEBGL_lose_context");y&&y.restoreContext()},this.getPixelRatio=function(){return W},this.setPixelRatio=function(y){y!==void 0&&(W=y,this.setSize(j,ee,!1))},this.getSize=function(y){return y.set(j,ee)},this.setSize=function(y,D,B=!0){if(V.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}j=y,ee=D,t.width=Math.floor(y*W),t.height=Math.floor(D*W),B===!0&&(t.style.width=y+"px",t.style.height=D+"px"),this.setViewport(0,0,y,D)},this.getDrawingBufferSize=function(y){return y.set(j*W,ee*W).floor()},this.setDrawingBufferSize=function(y,D,B){j=y,ee=D,W=B,t.width=Math.floor(y*B),t.height=Math.floor(D*B),this.setViewport(0,0,y,D)},this.getCurrentViewport=function(y){return y.copy(C)},this.getViewport=function(y){return y.copy(Ae)},this.setViewport=function(y,D,B,H){y.isVector4?Ae.set(y.x,y.y,y.z,y.w):Ae.set(y,D,B,H),Te.viewport(C.copy(Ae).multiplyScalar(W).round())},this.getScissor=function(y){return y.copy(Z)},this.setScissor=function(y,D,B,H){y.isVector4?Z.set(y.x,y.y,y.z,y.w):Z.set(y,D,B,H),Te.scissor(F.copy(Z).multiplyScalar(W).round())},this.getScissorTest=function(){return re},this.setScissorTest=function(y){Te.setScissorTest(re=y)},this.setOpaqueSort=function(y){ae=y},this.setTransparentSort=function(y){pe=y},this.getClearColor=function(y){return y.copy(we.getClearColor())},this.setClearColor=function(){we.setClearColor.apply(we,arguments)},this.getClearAlpha=function(){return we.getClearAlpha()},this.setClearAlpha=function(){we.setClearAlpha.apply(we,arguments)},this.clear=function(y=!0,D=!0,B=!0){let H=0;if(y){let I=!1;if(P!==null){const Q=P.texture.format;I=Q===1033||Q===1031||Q===1029}if(I){const Q=P.texture.type,de=Q===1009||Q===1014||Q===1012||Q===1020||Q===1017||Q===1018,_e=we.getClearColor(),xe=we.getClearAlpha(),Pe=_e.r,Le=_e.g,Ee=_e.b;de?(g[0]=Pe,g[1]=Le,g[2]=Ee,g[3]=xe,U.clearBufferuiv(U.COLOR,0,g)):(_[0]=Pe,_[1]=Le,_[2]=Ee,_[3]=xe,U.clearBufferiv(U.COLOR,0,_))}else H|=U.COLOR_BUFFER_BIT}D&&(H|=U.DEPTH_BUFFER_BIT),B&&(H|=U.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),U.clear(H)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",q,!1),t.removeEventListener("webglcontextrestored",ue,!1),t.removeEventListener("webglcontextcreationerror",se,!1),ge.dispose(),He.dispose(),Se.dispose(),v.dispose(),z.dispose(),Y.dispose(),qe.dispose(),L.dispose(),ve.dispose(),V.dispose(),V.removeEventListener("sessionstart",Fn),V.removeEventListener("sessionend",zn),ui.stop()};function q(y){y.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),N=!0}function ue(){console.log("THREE.WebGLRenderer: Context Restored."),N=!1;const y=Qe.autoReset,D=fe.enabled,B=fe.autoUpdate,H=fe.needsUpdate,I=fe.type;le(),Qe.autoReset=y,fe.enabled=D,fe.autoUpdate=B,fe.needsUpdate=H,fe.type=I}function se(y){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",y.statusMessage)}function ke(y){const D=y.target;D.removeEventListener("dispose",ke),at(D)}function at(y){gt(y),Se.remove(y)}function gt(y){const D=Se.get(y).programs;D!==void 0&&(D.forEach(function(B){ve.releaseProgram(B)}),y.isShaderMaterial&&ve.releaseShaderCache(y))}this.renderBufferDirect=function(y,D,B,H,I,Q){D===null&&(D=Ve);const de=I.isMesh&&I.matrixWorld.determinant()<0,_e=Ho(y,D,B,H,I);Te.setMaterial(H,de);let xe=B.index,Pe=1;if(H.wireframe===!0){if(xe=J.getWireframeAttribute(B),xe===void 0)return;Pe=2}const Le=B.drawRange,Ee=B.attributes.position;let We=Le.start*Pe,tt=(Le.start+Le.count)*Pe;Q!==null&&(We=Math.max(We,Q.start*Pe),tt=Math.min(tt,(Q.start+Q.count)*Pe)),xe!==null?(We=Math.max(We,0),tt=Math.min(tt,xe.count)):Ee!=null&&(We=Math.max(We,0),tt=Math.min(tt,Ee.count));const it=tt-We;if(it<0||it===1/0)return;qe.setup(I,H,_e,B,xe);let lt,rt=me;if(xe!==null&&(lt=$.get(xe),rt=Be,rt.setIndex(lt)),I.isMesh)H.wireframe===!0?(Te.setLineWidth(H.wireframeLinewidth*st()),rt.setMode(U.LINES)):rt.setMode(U.TRIANGLES);else if(I.isLine){let ye=H.linewidth;ye===void 0&&(ye=1),Te.setLineWidth(ye*st()),I.isLineSegments?rt.setMode(U.LINES):I.isLineLoop?rt.setMode(U.LINE_LOOP):rt.setMode(U.LINE_STRIP)}else I.isPoints?rt.setMode(U.POINTS):I.isSprite&&rt.setMode(U.TRIANGLES);if(I.isBatchedMesh)if(I._multiDrawInstances!==null)rt.renderMultiDrawInstances(I._multiDrawStarts,I._multiDrawCounts,I._multiDrawCount,I._multiDrawInstances);else if(Fe.get("WEBGL_multi_draw"))rt.renderMultiDraw(I._multiDrawStarts,I._multiDrawCounts,I._multiDrawCount);else{const ye=I._multiDrawStarts,di=I._multiDrawCounts,pi=I._multiDrawCount,Ot=xe?$.get(xe).bytesPerElement:1,Li=Se.get(H).currentProgram.getUniforms();for(let wt=0;wt<pi;wt++)Li.setValue(U,"_gl_DrawID",wt),rt.render(ye[wt]/Ot,di[wt])}else if(I.isInstancedMesh)rt.renderInstances(We,it,I.count);else if(B.isInstancedBufferGeometry){const ye=B._maxInstanceCount!==void 0?B._maxInstanceCount:1/0,di=Math.min(B.instanceCount,ye);rt.renderInstances(We,it,di)}else rt.render(We,it)};function je(y,D,B){y.transparent===!0&&y.side===2&&y.forceSinglePass===!1?(y.side=1,y.needsUpdate=!0,Br(y,D,B),y.side=0,y.needsUpdate=!0,Br(y,D,B),y.side=2):Br(y,D,B)}this.compile=function(y,D,B=null){B===null&&(B=y),p=He.get(B),p.init(D),E.push(p),B.traverseVisible(function(I){I.isLight&&I.layers.test(D.layers)&&(p.pushLight(I),I.castShadow&&p.pushShadow(I))}),y!==B&&y.traverseVisible(function(I){I.isLight&&I.layers.test(D.layers)&&(p.pushLight(I),I.castShadow&&p.pushShadow(I))}),p.setupLights();const H=new Set;return y.traverse(function(I){if(!(I.isMesh||I.isPoints||I.isLine||I.isSprite))return;const Q=I.material;if(Q)if(Array.isArray(Q))for(let de=0;de<Q.length;de++){const _e=Q[de];je(_e,B,I),H.add(_e)}else je(Q,B,I),H.add(Q)}),E.pop(),p=null,H},this.compileAsync=function(y,D,B=null){const H=this.compile(y,D,B);return new Promise(I=>{function Q(){if(H.forEach(function(de){Se.get(de).currentProgram.isReady()&&H.delete(de)}),H.size===0){I(y);return}setTimeout(Q,10)}Fe.get("KHR_parallel_shader_compile")!==null?Q():setTimeout(Q,10)})};let Nt=null;function $t(y){Nt&&Nt(y)}function Fn(){ui.stop()}function zn(){ui.start()}const ui=new Eo;ui.setAnimationLoop($t),typeof self<"u"&&ui.setContext(self),this.setAnimationLoop=function(y){Nt=y,V.setAnimationLoop(y),y===null?ui.stop():ui.start()},V.addEventListener("sessionstart",Fn),V.addEventListener("sessionend",zn),this.render=function(y,D){if(D!==void 0&&D.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(N===!0)return;if(y.matrixWorldAutoUpdate===!0&&y.updateMatrixWorld(),D.parent===null&&D.matrixWorldAutoUpdate===!0&&D.updateMatrixWorld(),V.enabled===!0&&V.isPresenting===!0&&(V.cameraAutoUpdate===!0&&V.updateCamera(D),D=V.getCamera()),y.isScene===!0&&y.onBeforeRender(M,y,D,P),p=He.get(y,E.length),p.init(D),E.push(p),he.multiplyMatrices(D.projectionMatrix,D.matrixWorldInverse),O.setFromProjectionMatrix(he),ne=this.localClippingEnabled,G=ie.init(this.clippingPlanes,ne),m=ge.get(y,S.length),m.init(),S.push(m),V.enabled===!0&&V.isPresenting===!0){const Q=M.xr.getDepthSensingMesh();Q!==null&&Ma(Q,D,-1/0,M.sortObjects)}Ma(y,D,0,M.sortObjects),m.finish(),M.sortObjects===!0&&m.sort(ae,pe),Oe=V.enabled===!1||V.isPresenting===!1||V.hasDepthSensing()===!1,Oe&&we.addToRenderList(m,y),this.info.render.frame++,G===!0&&ie.beginShadows();const B=p.state.shadowsArray;fe.render(B,y,D),G===!0&&ie.endShadows(),this.info.autoReset===!0&&this.info.reset();const H=m.opaque,I=m.transmissive;if(p.setupLights(),D.isArrayCamera){const Q=D.cameras;if(I.length>0)for(let de=0,_e=Q.length;de<_e;de++){const xe=Q[de];kn(H,I,y,xe)}Oe&&we.render(y);for(let de=0,_e=Q.length;de<_e;de++){const xe=Q[de];Bn(m,y,xe,xe.viewport)}}else I.length>0&&kn(H,I,y,D),Oe&&we.render(y),Bn(m,y,D);P!==null&&(T.updateMultisampleRenderTarget(P),T.updateRenderTargetMipmap(P)),y.isScene===!0&&y.onAfterRender(M,y,D),qe.resetDefaultState(),b=-1,x=null,E.pop(),E.length>0?(p=E[E.length-1],G===!0&&ie.setGlobalState(M.clippingPlanes,p.state.camera)):p=null,S.pop(),S.length>0?m=S[S.length-1]:m=null};function Ma(y,D,B,H){if(y.visible===!1)return;if(y.layers.test(D.layers)){if(y.isGroup)B=y.renderOrder;else if(y.isLOD)y.autoUpdate===!0&&y.update(D);else if(y.isLight)p.pushLight(y),y.castShadow&&p.pushShadow(y);else if(y.isSprite){if(!y.frustumCulled||O.intersectsSprite(y)){H&&Ce.setFromMatrixPosition(y.matrixWorld).applyMatrix4(he);const Q=Y.update(y),de=y.material;de.visible&&m.push(y,Q,de,B,Ce.z,null)}}else if((y.isMesh||y.isLine||y.isPoints)&&(!y.frustumCulled||O.intersectsObject(y))){const Q=Y.update(y),de=y.material;if(H&&(y.boundingSphere!==void 0?(y.boundingSphere===null&&y.computeBoundingSphere(),Ce.copy(y.boundingSphere.center)):(Q.boundingSphere===null&&Q.computeBoundingSphere(),Ce.copy(Q.boundingSphere.center)),Ce.applyMatrix4(y.matrixWorld).applyMatrix4(he)),Array.isArray(de)){const _e=Q.groups;for(let xe=0,Pe=_e.length;xe<Pe;xe++){const Le=_e[xe],Ee=de[Le.materialIndex];Ee&&Ee.visible&&m.push(y,Q,Ee,B,Ce.z,Le)}}else de.visible&&m.push(y,Q,de,B,Ce.z,null)}}const I=y.children;for(let Q=0,de=I.length;Q<de;Q++)Ma(I[Q],D,B,H)}function Bn(y,D,B,H){const I=y.opaque,Q=y.transmissive,de=y.transparent;p.setupLightsView(B),G===!0&&ie.setGlobalState(M.clippingPlanes,B),H&&Te.viewport(C.copy(H)),I.length>0&&zr(I,D,B),Q.length>0&&zr(Q,D,B),de.length>0&&zr(de,D,B),Te.buffers.depth.setTest(!0),Te.buffers.depth.setMask(!0),Te.buffers.color.setMask(!0),Te.setPolygonOffset(!1)}function kn(y,D,B,H){if((B.isScene===!0?B.overrideMaterial:null)!==null)return;p.state.transmissionRenderTarget[H.id]===void 0&&(p.state.transmissionRenderTarget[H.id]=new Ei(1,1,{generateMipmaps:!0,type:Fe.has("EXT_color_buffer_half_float")||Fe.has("EXT_color_buffer_float")?1016:1009,minFilter:1008,samples:4,stencilBuffer:n,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Ge.workingColorSpace}));const I=p.state.transmissionRenderTarget[H.id],Q=H.viewport||C;I.setSize(Q.z,Q.w);const de=M.getRenderTarget();M.setRenderTarget(I),M.getClearColor(X),K=M.getClearAlpha(),K<1&&M.setClearColor(16777215,.5),M.clear(),Oe&&we.render(B);const _e=M.toneMapping;M.toneMapping=0;const xe=H.viewport;if(H.viewport!==void 0&&(H.viewport=void 0),p.setupLightsView(H),G===!0&&ie.setGlobalState(M.clippingPlanes,H),zr(y,B,H),T.updateMultisampleRenderTarget(I),T.updateRenderTargetMipmap(I),Fe.has("WEBGL_multisampled_render_to_texture")===!1){let Pe=!1;for(let Le=0,Ee=D.length;Le<Ee;Le++){const We=D[Le],tt=We.object,it=We.geometry,lt=We.material,rt=We.group;if(lt.side===2&&tt.layers.test(H.layers)){const ye=lt.side;lt.side=1,lt.needsUpdate=!0,Hn(tt,B,H,it,lt,rt),lt.side=ye,lt.needsUpdate=!0,Pe=!0}}Pe===!0&&(T.updateMultisampleRenderTarget(I),T.updateRenderTargetMipmap(I))}M.setRenderTarget(de),M.setClearColor(X,K),xe!==void 0&&(H.viewport=xe),M.toneMapping=_e}function zr(y,D,B){const H=D.isScene===!0?D.overrideMaterial:null;for(let I=0,Q=y.length;I<Q;I++){const de=y[I],_e=de.object,xe=de.geometry,Pe=H===null?de.material:H,Le=de.group;_e.layers.test(B.layers)&&Hn(_e,D,B,xe,Pe,Le)}}function Hn(y,D,B,H,I,Q){y.onBeforeRender(M,D,B,H,I,Q),y.modelViewMatrix.multiplyMatrices(B.matrixWorldInverse,y.matrixWorld),y.normalMatrix.getNormalMatrix(y.modelViewMatrix),I.onBeforeRender(M,D,B,H,y,Q),I.transparent===!0&&I.side===2&&I.forceSinglePass===!1?(I.side=1,I.needsUpdate=!0,M.renderBufferDirect(B,D,H,I,y,Q),I.side=0,I.needsUpdate=!0,M.renderBufferDirect(B,D,H,I,y,Q),I.side=2):M.renderBufferDirect(B,D,H,I,y,Q),y.onAfterRender(M,D,B,H,I,Q)}function Br(y,D,B){D.isScene!==!0&&(D=Ve);const H=Se.get(y),I=p.state.lights,Q=p.state.shadowsArray,de=I.state.version,_e=ve.getParameters(y,I.state,Q,D,B),xe=ve.getProgramCacheKey(_e);let Pe=H.programs;H.environment=y.isMeshStandardMaterial?D.environment:null,H.fog=D.fog,H.envMap=(y.isMeshStandardMaterial?z:v).get(y.envMap||H.environment),H.envMapRotation=H.environment!==null&&y.envMap===null?D.environmentRotation:y.envMapRotation,Pe===void 0&&(y.addEventListener("dispose",ke),Pe=new Map,H.programs=Pe);let Le=Pe.get(xe);if(Le!==void 0){if(H.currentProgram===Le&&H.lightsStateVersion===de)return Vn(y,_e),Le}else _e.uniforms=ve.getUniforms(y),y.onBeforeCompile(_e,M),Le=ve.acquireProgram(_e,xe),Pe.set(xe,Le),H.uniforms=_e.uniforms;const Ee=H.uniforms;return(!y.isShaderMaterial&&!y.isRawShaderMaterial||y.clipping===!0)&&(Ee.clippingPlanes=ie.uniform),Vn(y,_e),H.needsLights=Vo(y),H.lightsStateVersion=de,H.needsLights&&(Ee.ambientLightColor.value=I.state.ambient,Ee.lightProbe.value=I.state.probe,Ee.directionalLights.value=I.state.directional,Ee.directionalLightShadows.value=I.state.directionalShadow,Ee.spotLights.value=I.state.spot,Ee.spotLightShadows.value=I.state.spotShadow,Ee.rectAreaLights.value=I.state.rectArea,Ee.ltc_1.value=I.state.rectAreaLTC1,Ee.ltc_2.value=I.state.rectAreaLTC2,Ee.pointLights.value=I.state.point,Ee.pointLightShadows.value=I.state.pointShadow,Ee.hemisphereLights.value=I.state.hemi,Ee.directionalShadowMap.value=I.state.directionalShadowMap,Ee.directionalShadowMatrix.value=I.state.directionalShadowMatrix,Ee.spotShadowMap.value=I.state.spotShadowMap,Ee.spotLightMatrix.value=I.state.spotLightMatrix,Ee.spotLightMap.value=I.state.spotLightMap,Ee.pointShadowMap.value=I.state.pointShadowMap,Ee.pointShadowMatrix.value=I.state.pointShadowMatrix),H.currentProgram=Le,H.uniformsList=null,Le}function Gn(y){if(y.uniformsList===null){const D=y.currentProgram.getUniforms();y.uniformsList=ga.seqWithValue(D.seq,y.uniforms)}return y.uniformsList}function Vn(y,D){const B=Se.get(y);B.outputColorSpace=D.outputColorSpace,B.batching=D.batching,B.batchingColor=D.batchingColor,B.instancing=D.instancing,B.instancingColor=D.instancingColor,B.instancingMorph=D.instancingMorph,B.skinning=D.skinning,B.morphTargets=D.morphTargets,B.morphNormals=D.morphNormals,B.morphColors=D.morphColors,B.morphTargetsCount=D.morphTargetsCount,B.numClippingPlanes=D.numClippingPlanes,B.numIntersection=D.numClipIntersection,B.vertexAlphas=D.vertexAlphas,B.vertexTangents=D.vertexTangents,B.toneMapping=D.toneMapping}function Ho(y,D,B,H,I){D.isScene!==!0&&(D=Ve),T.resetTextureUnits();const Q=D.fog,de=H.isMeshStandardMaterial?D.environment:null,_e=P===null?M.outputColorSpace:P.isXRRenderTarget===!0?P.texture.colorSpace:ar,xe=(H.isMeshStandardMaterial?z:v).get(H.envMap||de),Pe=H.vertexColors===!0&&!!B.attributes.color&&B.attributes.color.itemSize===4,Le=!!B.attributes.tangent&&(!!H.normalMap||H.anisotropy>0),Ee=!!B.morphAttributes.position,We=!!B.morphAttributes.normal,tt=!!B.morphAttributes.color;let it=0;H.toneMapped&&(P===null||P.isXRRenderTarget===!0)&&(it=M.toneMapping);const lt=B.morphAttributes.position||B.morphAttributes.normal||B.morphAttributes.color,rt=lt!==void 0?lt.length:0,ye=Se.get(H),di=p.state.lights;if(G===!0&&(ne===!0||y!==x)){const St=y===x&&H.id===b;ie.setState(H,y,St)}let pi=!1;H.version===ye.__version?(ye.needsLights&&ye.lightsStateVersion!==di.state.version||ye.outputColorSpace!==_e||I.isBatchedMesh&&ye.batching===!1||!I.isBatchedMesh&&ye.batching===!0||I.isBatchedMesh&&ye.batchingColor===!0&&I.colorTexture===null||I.isBatchedMesh&&ye.batchingColor===!1&&I.colorTexture!==null||I.isInstancedMesh&&ye.instancing===!1||!I.isInstancedMesh&&ye.instancing===!0||I.isSkinnedMesh&&ye.skinning===!1||!I.isSkinnedMesh&&ye.skinning===!0||I.isInstancedMesh&&ye.instancingColor===!0&&I.instanceColor===null||I.isInstancedMesh&&ye.instancingColor===!1&&I.instanceColor!==null||I.isInstancedMesh&&ye.instancingMorph===!0&&I.morphTexture===null||I.isInstancedMesh&&ye.instancingMorph===!1&&I.morphTexture!==null||ye.envMap!==xe||H.fog===!0&&ye.fog!==Q||ye.numClippingPlanes!==void 0&&(ye.numClippingPlanes!==ie.numPlanes||ye.numIntersection!==ie.numIntersection)||ye.vertexAlphas!==Pe||ye.vertexTangents!==Le||ye.morphTargets!==Ee||ye.morphNormals!==We||ye.morphColors!==tt||ye.toneMapping!==it||ye.morphTargetsCount!==rt)&&(pi=!0):(pi=!0,ye.__version=H.version);let Ot=ye.currentProgram;pi===!0&&(Ot=Br(H,D,I));let Li=!1,wt=!1,hr=!1;const et=Ot.getUniforms(),Wt=ye.uniforms;if(Te.useProgram(Ot.program)&&(Li=!0,wt=!0,hr=!0),H.id!==b&&(b=H.id,wt=!0),Li||x!==y){Te.buffers.depth.getReversed()?(te.copy(y.projectionMatrix),cl(te),hl(te),et.setValue(U,"projectionMatrix",te)):et.setValue(U,"projectionMatrix",y.projectionMatrix),et.setValue(U,"viewMatrix",y.matrixWorldInverse);const St=et.map.cameraPosition;St!==void 0&&St.setValue(U,be.setFromMatrixPosition(y.matrixWorld)),ze.logarithmicDepthBuffer&&et.setValue(U,"logDepthBufFC",2/(Math.log(y.far+1)/Math.LN2)),(H.isMeshPhongMaterial||H.isMeshToonMaterial||H.isMeshLambertMaterial||H.isMeshBasicMaterial||H.isMeshStandardMaterial||H.isShaderMaterial)&&et.setValue(U,"isOrthographic",y.isOrthographicCamera===!0),x!==y&&(x=y,wt=!0,hr=!0)}if(I.isSkinnedMesh){et.setOptional(U,I,"bindMatrix"),et.setOptional(U,I,"bindMatrixInverse");const St=I.skeleton;St&&(St.boneTexture===null&&St.computeBoneTexture(),et.setValue(U,"boneTexture",St.boneTexture,T))}I.isBatchedMesh&&(et.setOptional(U,I,"batchingTexture"),et.setValue(U,"batchingTexture",I._matricesTexture,T),et.setOptional(U,I,"batchingIdTexture"),et.setValue(U,"batchingIdTexture",I._indirectTexture,T),et.setOptional(U,I,"batchingColorTexture"),I._colorsTexture!==null&&et.setValue(U,"batchingColorTexture",I._colorsTexture,T));const ur=B.morphAttributes;if((ur.position!==void 0||ur.normal!==void 0||ur.color!==void 0)&&Re.update(I,B,Ot),(wt||ye.receiveShadow!==I.receiveShadow)&&(ye.receiveShadow=I.receiveShadow,et.setValue(U,"receiveShadow",I.receiveShadow)),H.isMeshGouraudMaterial&&H.envMap!==null&&(Wt.envMap.value=xe,Wt.flipEnvMap.value=xe.isCubeTexture&&xe.isRenderTargetTexture===!1?-1:1),H.isMeshStandardMaterial&&H.envMap===null&&D.environment!==null&&(Wt.envMapIntensity.value=D.environmentIntensity),wt&&(et.setValue(U,"toneMappingExposure",M.toneMappingExposure),ye.needsLights&&Go(Wt,hr),Q&&H.fog===!0&&ce.refreshFogUniforms(Wt,Q),ce.refreshMaterialUniforms(Wt,H,W,ee,p.state.transmissionRenderTarget[y.id]),ga.upload(U,Gn(ye),Wt,T)),H.isShaderMaterial&&H.uniformsNeedUpdate===!0&&(ga.upload(U,Gn(ye),Wt,T),H.uniformsNeedUpdate=!1),H.isSpriteMaterial&&et.setValue(U,"center",I.center),et.setValue(U,"modelViewMatrix",I.modelViewMatrix),et.setValue(U,"normalMatrix",I.normalMatrix),et.setValue(U,"modelMatrix",I.matrixWorld),H.isShaderMaterial||H.isRawShaderMaterial){const St=H.uniformsGroups;for(let dr=0,ii=St.length;dr<ii;dr++){const Wn=St[dr];L.update(Wn,Ot),L.bind(Wn,Ot)}}return Ot}function Go(y,D){y.ambientLightColor.needsUpdate=D,y.lightProbe.needsUpdate=D,y.directionalLights.needsUpdate=D,y.directionalLightShadows.needsUpdate=D,y.pointLights.needsUpdate=D,y.pointLightShadows.needsUpdate=D,y.spotLights.needsUpdate=D,y.spotLightShadows.needsUpdate=D,y.rectAreaLights.needsUpdate=D,y.hemisphereLights.needsUpdate=D}function Vo(y){return y.isMeshLambertMaterial||y.isMeshToonMaterial||y.isMeshPhongMaterial||y.isMeshStandardMaterial||y.isShadowMaterial||y.isShaderMaterial&&y.lights===!0}this.getActiveCubeFace=function(){return A},this.getActiveMipmapLevel=function(){return w},this.getRenderTarget=function(){return P},this.setRenderTargetTextures=function(y,D,B){Se.get(y.texture).__webglTexture=D,Se.get(y.depthTexture).__webglTexture=B;const H=Se.get(y);H.__hasExternalTextures=!0,H.__autoAllocateDepthBuffer=B===void 0,H.__autoAllocateDepthBuffer||Fe.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),H.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(y,D){const B=Se.get(y);B.__webglFramebuffer=D,B.__useDefaultFramebuffer=D===void 0},this.setRenderTarget=function(y,D=0,B=0){P=y,A=D,w=B;let H=!0,I=null,Q=!1,de=!1;if(y){const _e=Se.get(y);if(_e.__useDefaultFramebuffer!==void 0)Te.bindFramebuffer(U.FRAMEBUFFER,null),H=!1;else if(_e.__webglFramebuffer===void 0)T.setupRenderTarget(y);else if(_e.__hasExternalTextures)T.rebindTextures(y,Se.get(y.texture).__webglTexture,Se.get(y.depthTexture).__webglTexture);else if(y.depthBuffer){const Le=y.depthTexture;if(_e.__boundDepthTexture!==Le){if(Le!==null&&Se.has(Le)&&(y.width!==Le.image.width||y.height!==Le.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");T.setupDepthRenderbuffer(y)}}const xe=y.texture;(xe.isData3DTexture||xe.isDataArrayTexture||xe.isCompressedArrayTexture)&&(de=!0);const Pe=Se.get(y).__webglFramebuffer;y.isWebGLCubeRenderTarget?(Array.isArray(Pe[D])?I=Pe[D][B]:I=Pe[D],Q=!0):y.samples>0&&T.useMultisampledRTT(y)===!1?I=Se.get(y).__webglMultisampledFramebuffer:Array.isArray(Pe)?I=Pe[B]:I=Pe,C.copy(y.viewport),F.copy(y.scissor),k=y.scissorTest}else C.copy(Ae).multiplyScalar(W).floor(),F.copy(Z).multiplyScalar(W).floor(),k=re;if(Te.bindFramebuffer(U.FRAMEBUFFER,I)&&H&&Te.drawBuffers(y,I),Te.viewport(C),Te.scissor(F),Te.setScissorTest(k),Q){const _e=Se.get(y.texture);U.framebufferTexture2D(U.FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_CUBE_MAP_POSITIVE_X+D,_e.__webglTexture,B)}else if(de){const _e=Se.get(y.texture),xe=D||0;U.framebufferTextureLayer(U.FRAMEBUFFER,U.COLOR_ATTACHMENT0,_e.__webglTexture,B||0,xe)}b=-1},this.readRenderTargetPixels=function(y,D,B,H,I,Q,de){if(!(y&&y.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let _e=Se.get(y).__webglFramebuffer;if(y.isWebGLCubeRenderTarget&&de!==void 0&&(_e=_e[de]),_e){Te.bindFramebuffer(U.FRAMEBUFFER,_e);try{const xe=y.texture,Pe=xe.format,Le=xe.type;if(!ze.textureFormatReadable(Pe)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!ze.textureTypeReadable(Le)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}D>=0&&D<=y.width-H&&B>=0&&B<=y.height-I&&U.readPixels(D,B,H,I,Ue.convert(Pe),Ue.convert(Le),Q)}finally{const xe=P!==null?Se.get(P).__webglFramebuffer:null;Te.bindFramebuffer(U.FRAMEBUFFER,xe)}}},this.readRenderTargetPixelsAsync=async function(y,D,B,H,I,Q,de){if(!(y&&y.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let _e=Se.get(y).__webglFramebuffer;if(y.isWebGLCubeRenderTarget&&de!==void 0&&(_e=_e[de]),_e){const xe=y.texture,Pe=xe.format,Le=xe.type;if(!ze.textureFormatReadable(Pe))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!ze.textureTypeReadable(Le))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(D>=0&&D<=y.width-H&&B>=0&&B<=y.height-I){Te.bindFramebuffer(U.FRAMEBUFFER,_e);const Ee=U.createBuffer();U.bindBuffer(U.PIXEL_PACK_BUFFER,Ee),U.bufferData(U.PIXEL_PACK_BUFFER,Q.byteLength,U.STREAM_READ),U.readPixels(D,B,H,I,Ue.convert(Pe),Ue.convert(Le),0);const We=P!==null?Se.get(P).__webglFramebuffer:null;Te.bindFramebuffer(U.FRAMEBUFFER,We);const tt=U.fenceSync(U.SYNC_GPU_COMMANDS_COMPLETE,0);return U.flush(),await ll(U,tt,4),U.bindBuffer(U.PIXEL_PACK_BUFFER,Ee),U.getBufferSubData(U.PIXEL_PACK_BUFFER,0,Q),U.deleteBuffer(Ee),U.deleteSync(tt),Q}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(y,D=null,B=0){y.isTexture!==!0&&(Tr("WebGLRenderer: copyFramebufferToTexture function signature has changed."),D=arguments[0]||null,y=arguments[1]);const H=Math.pow(2,-B),I=Math.floor(y.image.width*H),Q=Math.floor(y.image.height*H),de=D!==null?D.x:0,_e=D!==null?D.y:0;T.setTexture2D(y,0),U.copyTexSubImage2D(U.TEXTURE_2D,B,0,0,de,_e,I,Q),Te.unbindTexture()},this.copyTextureToTexture=function(y,D,B=null,H=null,I=0){y.isTexture!==!0&&(Tr("WebGLRenderer: copyTextureToTexture function signature has changed."),H=arguments[0]||null,y=arguments[1],D=arguments[2],I=arguments[3]||0,B=null);let Q,de,_e,xe,Pe,Le,Ee,We,tt;const it=y.isCompressedTexture?y.mipmaps[I]:y.image;B!==null?(Q=B.max.x-B.min.x,de=B.max.y-B.min.y,_e=B.isBox3?B.max.z-B.min.z:1,xe=B.min.x,Pe=B.min.y,Le=B.isBox3?B.min.z:0):(Q=it.width,de=it.height,_e=it.depth||1,xe=0,Pe=0,Le=0),H!==null?(Ee=H.x,We=H.y,tt=H.z):(Ee=0,We=0,tt=0);const lt=Ue.convert(D.format),rt=Ue.convert(D.type);let ye;D.isData3DTexture?(T.setTexture3D(D,0),ye=U.TEXTURE_3D):D.isDataArrayTexture||D.isCompressedArrayTexture?(T.setTexture2DArray(D,0),ye=U.TEXTURE_2D_ARRAY):(T.setTexture2D(D,0),ye=U.TEXTURE_2D),U.pixelStorei(U.UNPACK_FLIP_Y_WEBGL,D.flipY),U.pixelStorei(U.UNPACK_PREMULTIPLY_ALPHA_WEBGL,D.premultiplyAlpha),U.pixelStorei(U.UNPACK_ALIGNMENT,D.unpackAlignment);const di=U.getParameter(U.UNPACK_ROW_LENGTH),pi=U.getParameter(U.UNPACK_IMAGE_HEIGHT),Ot=U.getParameter(U.UNPACK_SKIP_PIXELS),Li=U.getParameter(U.UNPACK_SKIP_ROWS),wt=U.getParameter(U.UNPACK_SKIP_IMAGES);U.pixelStorei(U.UNPACK_ROW_LENGTH,it.width),U.pixelStorei(U.UNPACK_IMAGE_HEIGHT,it.height),U.pixelStorei(U.UNPACK_SKIP_PIXELS,xe),U.pixelStorei(U.UNPACK_SKIP_ROWS,Pe),U.pixelStorei(U.UNPACK_SKIP_IMAGES,Le);const hr=y.isDataArrayTexture||y.isData3DTexture,et=D.isDataArrayTexture||D.isData3DTexture;if(y.isRenderTargetTexture||y.isDepthTexture){const Wt=Se.get(y),ur=Se.get(D),St=Se.get(Wt.__renderTarget),dr=Se.get(ur.__renderTarget);Te.bindFramebuffer(U.READ_FRAMEBUFFER,St.__webglFramebuffer),Te.bindFramebuffer(U.DRAW_FRAMEBUFFER,dr.__webglFramebuffer);for(let ii=0;ii<_e;ii++)hr&&U.framebufferTextureLayer(U.READ_FRAMEBUFFER,U.COLOR_ATTACHMENT0,Se.get(y).__webglTexture,I,Le+ii),y.isDepthTexture?(et&&U.framebufferTextureLayer(U.DRAW_FRAMEBUFFER,U.COLOR_ATTACHMENT0,Se.get(D).__webglTexture,I,tt+ii),U.blitFramebuffer(xe,Pe,Q,de,Ee,We,Q,de,U.DEPTH_BUFFER_BIT,U.NEAREST)):et?U.copyTexSubImage3D(ye,I,Ee,We,tt+ii,xe,Pe,Q,de):U.copyTexSubImage2D(ye,I,Ee,We,tt+ii,xe,Pe,Q,de);Te.bindFramebuffer(U.READ_FRAMEBUFFER,null),Te.bindFramebuffer(U.DRAW_FRAMEBUFFER,null)}else et?y.isDataTexture||y.isData3DTexture?U.texSubImage3D(ye,I,Ee,We,tt,Q,de,_e,lt,rt,it.data):D.isCompressedArrayTexture?U.compressedTexSubImage3D(ye,I,Ee,We,tt,Q,de,_e,lt,it.data):U.texSubImage3D(ye,I,Ee,We,tt,Q,de,_e,lt,rt,it):y.isDataTexture?U.texSubImage2D(U.TEXTURE_2D,I,Ee,We,Q,de,lt,rt,it.data):y.isCompressedTexture?U.compressedTexSubImage2D(U.TEXTURE_2D,I,Ee,We,it.width,it.height,lt,it.data):U.texSubImage2D(U.TEXTURE_2D,I,Ee,We,Q,de,lt,rt,it);U.pixelStorei(U.UNPACK_ROW_LENGTH,di),U.pixelStorei(U.UNPACK_IMAGE_HEIGHT,pi),U.pixelStorei(U.UNPACK_SKIP_PIXELS,Ot),U.pixelStorei(U.UNPACK_SKIP_ROWS,Li),U.pixelStorei(U.UNPACK_SKIP_IMAGES,wt),I===0&&D.generateMipmaps&&U.generateMipmap(ye),Te.unbindTexture()},this.copyTextureToTexture3D=function(y,D,B=null,H=null,I=0){return y.isTexture!==!0&&(Tr("WebGLRenderer: copyTextureToTexture3D function signature has changed."),B=arguments[0]||null,H=arguments[1]||null,y=arguments[2],D=arguments[3],I=arguments[4]||0),Tr('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(y,D,B,H,I)},this.initRenderTarget=function(y){Se.get(y).__webglFramebuffer===void 0&&T.setupRenderTarget(y)},this.initTexture=function(y){y.isCubeTexture?T.setTextureCube(y,0):y.isData3DTexture?T.setTexture3D(y,0):y.isDataArrayTexture||y.isCompressedArrayTexture?T.setTexture2DArray(y,0):T.setTexture2D(y,0),Te.unbindTexture()},this.resetState=function(){A=0,w=0,P=null,Te.reset(),qe.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return 2e3}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorspace=Ge._getDrawingBufferColorSpace(e),t.unpackColorSpace=Ge._getUnpackColorSpace()}}class Rn{constructor(e,t=25e-5){this.isFogExp2=!0,this.name="",this.color=new Me(e),this.density=t}clone(){return new Rn(this.color,this.density)}toJSON(){return{type:"FogExp2",name:this.name,color:this.color.getHex(),density:this.density}}}class Mp extends ft{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new hi,this.environmentIntensity=1,this.environmentRotation=new hi,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}class bp{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=35044,this.updateRanges=[],this.version=0,this.uuid=ei()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,i){e*=this.stride,i*=t.stride;for(let a=0,n=this.stride;a<n;a++)this.array[e+a]=t.array[i+a];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=ei()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),i=new this.constructor(t,this.stride);return i.setUsage(this.usage),i}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){return e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=ei()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const Mt=new R;class _a{constructor(e,t,i,a=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=i,this.normalized=a}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,i=this.data.count;t<i;t++)Mt.fromBufferAttribute(this,t),Mt.applyMatrix4(e),this.setXYZ(t,Mt.x,Mt.y,Mt.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)Mt.fromBufferAttribute(this,t),Mt.applyNormalMatrix(e),this.setXYZ(t,Mt.x,Mt.y,Mt.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)Mt.fromBufferAttribute(this,t),Mt.transformDirection(e),this.setXYZ(t,Mt.x,Mt.y,Mt.z);return this}getComponent(e,t){let i=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(i=Ht(i,this.array)),i}setComponent(e,t,i){return this.normalized&&(i=Ye(i,this.array)),this.data.array[e*this.data.stride+this.offset+t]=i,this}setX(e,t){return this.normalized&&(t=Ye(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=Ye(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=Ye(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=Ye(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=Ht(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=Ht(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=Ht(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=Ht(t,this.array)),t}setXY(e,t,i){return e=e*this.data.stride+this.offset,this.normalized&&(t=Ye(t,this.array),i=Ye(i,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=i,this}setXYZ(e,t,i,a){return e=e*this.data.stride+this.offset,this.normalized&&(t=Ye(t,this.array),i=Ye(i,this.array),a=Ye(a,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=i,this.data.array[e+2]=a,this}setXYZW(e,t,i,a,n){return e=e*this.data.stride+this.offset,this.normalized&&(t=Ye(t,this.array),i=Ye(i,this.array),a=Ye(a,this.array),n=Ye(n,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=i,this.data.array[e+2]=a,this.data.array[e+3]=n,this}clone(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let i=0;i<this.count;i++){const a=i*this.data.stride+this.offset;for(let n=0;n<this.itemSize;n++)t.push(this.data.array[a+n])}return new ot(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new _a(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let i=0;i<this.count;i++){const a=i*this.data.stride+this.offset;for(let n=0;n<this.itemSize;n++)t.push(this.data.array[a+n])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}class Lo extends Ri{static get type(){return"SpriteMaterial"}constructor(e){super(),this.isSpriteMaterial=!0,this.color=new Me(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.rotation=e.rotation,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}let ji;const _r=new R,Yi=new R,$i=new R,qi=new Ie,vr=new Ie,Do=new Je,sa=new R,xr=new R,oa=new R,Bs=new Ie,Ka=new Ie,ks=new Ie;class Sp extends ft{constructor(e=new Lo){if(super(),this.isSprite=!0,this.type="Sprite",ji===void 0){ji=new mt;const t=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),i=new bp(t,5);ji.setIndex([0,1,2,0,2,3]),ji.setAttribute("position",new _a(i,3,0,!1)),ji.setAttribute("uv",new _a(i,2,3,!1))}this.geometry=ji,this.material=e,this.center=new Ie(.5,.5)}raycast(e,t){e.camera===null&&console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),Yi.setFromMatrixScale(this.matrixWorld),Do.copy(e.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(e.camera.matrixWorldInverse,this.matrixWorld),$i.setFromMatrixPosition(this.modelViewMatrix),e.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&Yi.multiplyScalar(-$i.z);const i=this.material.rotation;let a,n;i!==0&&(n=Math.cos(i),a=Math.sin(i));const s=this.center;la(sa.set(-.5,-.5,0),$i,s,Yi,a,n),la(xr.set(.5,-.5,0),$i,s,Yi,a,n),la(oa.set(.5,.5,0),$i,s,Yi,a,n),Bs.set(0,0),Ka.set(1,0),ks.set(1,1);let o=e.ray.intersectTriangle(sa,xr,oa,!1,_r);if(o===null&&(la(xr.set(-.5,.5,0),$i,s,Yi,a,n),Ka.set(0,1),o=e.ray.intersectTriangle(sa,oa,xr,!1,_r),o===null))return;const l=e.ray.origin.distanceTo(_r);l<e.near||l>e.far||t.push({distance:l,point:_r.clone(),uv:Ji.getInterpolation(_r,sa,xr,oa,Bs,Ka,ks,new Ie),face:null,object:this})}copy(e,t){return super.copy(e,t),e.center!==void 0&&this.center.copy(e.center),this.material=e.material,this}}function la(r,e,t,i,a,n){qi.subVectors(r,t).addScalar(.5).multiply(i),a!==void 0?(vr.x=n*qi.x-a*qi.y,vr.y=a*qi.x+n*qi.y):vr.copy(qi),r.copy(e),r.x+=vr.x,r.y+=vr.y,r.applyMatrix4(Do)}class Ep extends yt{constructor(e=null,t=1,i=1,a,n,s,o,l,c=1003,h=1003,d,u){super(null,s,o,l,c,h,a,n,d,u),this.isDataTexture=!0,this.image={data:e,width:t,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Hs extends ot{constructor(e,t,i,a=1){super(e,t,i),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=a}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){const e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}}const Ki=new Je,Gs=new Je,ca=[],Vs=new Ai,Tp=new Je,yr=new Ze,Mr=new sr;class Ws extends Ze{constructor(e,t,i){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new Hs(new Float32Array(i*16),16),this.instanceColor=null,this.morphTexture=null,this.count=i,this.boundingBox=null,this.boundingSphere=null;for(let a=0;a<i;a++)this.setMatrixAt(a,Tp)}computeBoundingBox(){const e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new Ai),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let i=0;i<t;i++)this.getMatrixAt(i,Ki),Vs.copy(e.boundingBox).applyMatrix4(Ki),this.boundingBox.union(Vs)}computeBoundingSphere(){const e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new sr),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let i=0;i<t;i++)this.getMatrixAt(i,Ki),Mr.copy(e.boundingSphere).applyMatrix4(Ki),this.boundingSphere.union(Mr)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){const i=t.morphTargetInfluences,a=this.morphTexture.source.data.data,n=i.length+1,s=e*n+1;for(let o=0;o<i.length;o++)i[o]=a[s+o]}raycast(e,t){const i=this.matrixWorld,a=this.count;if(yr.geometry=this.geometry,yr.material=this.material,yr.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Mr.copy(this.boundingSphere),Mr.applyMatrix4(i),e.ray.intersectsSphere(Mr)!==!1))for(let n=0;n<a;n++){this.getMatrixAt(n,Ki),Gs.multiplyMatrices(i,Ki),yr.matrixWorld=Gs,yr.raycast(e,ca);for(let s=0,o=ca.length;s<o;s++){const l=ca[s];l.instanceId=n,l.object=this,t.push(l)}ca.length=0}}setColorAt(e,t){this.instanceColor===null&&(this.instanceColor=new Hs(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3)}setMatrixAt(e,t){t.toArray(this.instanceMatrix.array,e*16)}setMorphAt(e,t){const i=t.morphTargetInfluences,a=i.length+1;this.morphTexture===null&&(this.morphTexture=new Ep(new Float32Array(a*this.count),a,this.count,1028,1015));const n=this.morphTexture.source.data.data;let s=0;for(let c=0;c<i.length;c++)s+=i[c];const o=this.geometry.morphTargetsRelative?1:1-s,l=a*e;n[l]=o,n.set(i,l+1)}updateMorphTargets(){}dispose(){return this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null),this}}class Cn extends Ri{static get type(){return"PointsMaterial"}constructor(e){super(),this.isPointsMaterial=!0,this.color=new Me(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}const Xs=new Je,dn=new Sn,ha=new sr,ua=new R;class Dr extends ft{constructor(e=new mt,t=new Cn){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}raycast(e,t){const i=this.geometry,a=this.matrixWorld,n=e.params.Points.threshold,s=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),ha.copy(i.boundingSphere),ha.applyMatrix4(a),ha.radius+=n,e.ray.intersectsSphere(ha)===!1)return;Xs.copy(a).invert(),dn.copy(e.ray).applyMatrix4(Xs);const o=n/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=i.index,h=i.attributes.position;if(c!==null){const d=Math.max(0,s.start),u=Math.min(c.count,s.start+s.count);for(let f=d,g=u;f<g;f++){const _=c.getX(f);ua.fromBufferAttribute(h,_),js(ua,_,l,a,e,t,this)}}else{const d=Math.max(0,s.start),u=Math.min(h.count,s.start+s.count);for(let f=d,g=u;f<g;f++)ua.fromBufferAttribute(h,f),js(ua,f,l,a,e,t,this)}}updateMorphTargets(){const e=this.geometry.morphAttributes,t=Object.keys(e);if(t.length>0){const i=e[t[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let a=0,n=i.length;a<n;a++){const s=i[a].name||String(a);this.morphTargetInfluences.push(0),this.morphTargetDictionary[s]=a}}}}}function js(r,e,t,i,a,n,s){const o=dn.distanceSqToPoint(r);if(o<t){const l=new R;dn.closestPointToPoint(r,l),l.applyMatrix4(i);const c=a.ray.origin.distanceTo(l);if(c<a.near||c>a.far)return;n.push({distance:c,distanceToRay:Math.sqrt(o),point:l,index:e,face:null,faceIndex:null,barycoord:null,object:s})}}class Or extends mt{constructor(e=1,t=1,i=1,a=32,n=1,s=!1,o=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:i,radialSegments:a,heightSegments:n,openEnded:s,thetaStart:o,thetaLength:l};const c=this;a=Math.floor(a),n=Math.floor(n);const h=[],d=[],u=[],f=[];let g=0;const _=[],m=i/2;let p=0;S(),s===!1&&(e>0&&E(!0),t>0&&E(!1)),this.setIndex(h),this.setAttribute("position",new nt(d,3)),this.setAttribute("normal",new nt(u,3)),this.setAttribute("uv",new nt(f,2));function S(){const M=new R,N=new R;let A=0;const w=(t-e)/i;for(let P=0;P<=n;P++){const b=[],x=P/n,C=x*(t-e)+e;for(let F=0;F<=a;F++){const k=F/a,X=k*l+o,K=Math.sin(X),j=Math.cos(X);N.x=C*K,N.y=-x*i+m,N.z=C*j,d.push(N.x,N.y,N.z),M.set(K,w,j).normalize(),u.push(M.x,M.y,M.z),f.push(k,1-x),b.push(g++)}_.push(b)}for(let P=0;P<a;P++)for(let b=0;b<n;b++){const x=_[b][P],C=_[b+1][P],F=_[b+1][P+1],k=_[b][P+1];(e>0||b!==0)&&(h.push(x,C,k),A+=3),(t>0||b!==n-1)&&(h.push(C,F,k),A+=3)}c.addGroup(p,A,0),p+=A}function E(M){const N=g,A=new Ie,w=new R;let P=0;const b=M===!0?e:t,x=M===!0?1:-1;for(let F=1;F<=a;F++)d.push(0,m*x,0),u.push(0,x,0),f.push(.5,.5),g++;const C=g;for(let F=0;F<=a;F++){const k=F/a*l+o,X=Math.cos(k),K=Math.sin(k);w.x=b*K,w.y=m*x,w.z=b*X,d.push(w.x,w.y,w.z),u.push(0,x,0),A.x=X*.5+.5,A.y=K*.5*x+.5,f.push(A.x,A.y),g++}for(let F=0;F<a;F++){const k=N+F,X=C+F;M===!0?h.push(X,X+1,k):h.push(X+1,X,k),P+=3}c.addGroup(p,P,M===!0?1:2),p+=P}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Or(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}let Pn=class Uo extends mt{constructor(e=[],t=[],i=1,a=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:t,radius:i,detail:a};const n=[],s=[];o(a),c(i),h(),this.setAttribute("position",new nt(n,3)),this.setAttribute("normal",new nt(n.slice(),3)),this.setAttribute("uv",new nt(s,2)),a===0?this.computeVertexNormals():this.normalizeNormals();function o(S){const E=new R,M=new R,N=new R;for(let A=0;A<t.length;A+=3)f(t[A+0],E),f(t[A+1],M),f(t[A+2],N),l(E,M,N,S)}function l(S,E,M,N){const A=N+1,w=[];for(let P=0;P<=A;P++){w[P]=[];const b=S.clone().lerp(M,P/A),x=E.clone().lerp(M,P/A),C=A-P;for(let F=0;F<=C;F++)F===0&&P===A?w[P][F]=b:w[P][F]=b.clone().lerp(x,F/C)}for(let P=0;P<A;P++)for(let b=0;b<2*(A-P)-1;b++){const x=Math.floor(b/2);b%2===0?(u(w[P][x+1]),u(w[P+1][x]),u(w[P][x])):(u(w[P][x+1]),u(w[P+1][x+1]),u(w[P+1][x]))}}function c(S){const E=new R;for(let M=0;M<n.length;M+=3)E.x=n[M+0],E.y=n[M+1],E.z=n[M+2],E.normalize().multiplyScalar(S),n[M+0]=E.x,n[M+1]=E.y,n[M+2]=E.z}function h(){const S=new R;for(let E=0;E<n.length;E+=3){S.x=n[E+0],S.y=n[E+1],S.z=n[E+2];const M=m(S)/2/Math.PI+.5,N=p(S)/Math.PI+.5;s.push(M,1-N)}g(),d()}function d(){for(let S=0;S<s.length;S+=6){const E=s[S+0],M=s[S+2],N=s[S+4],A=Math.max(E,M,N),w=Math.min(E,M,N);A>.9&&w<.1&&(E<.2&&(s[S+0]+=1),M<.2&&(s[S+2]+=1),N<.2&&(s[S+4]+=1))}}function u(S){n.push(S.x,S.y,S.z)}function f(S,E){const M=S*3;E.x=e[M+0],E.y=e[M+1],E.z=e[M+2]}function g(){const S=new R,E=new R,M=new R,N=new R,A=new Ie,w=new Ie,P=new Ie;for(let b=0,x=0;b<n.length;b+=9,x+=6){S.set(n[b+0],n[b+1],n[b+2]),E.set(n[b+3],n[b+4],n[b+5]),M.set(n[b+6],n[b+7],n[b+8]),A.set(s[x+0],s[x+1]),w.set(s[x+2],s[x+3]),P.set(s[x+4],s[x+5]),N.copy(S).add(E).add(M).divideScalar(3);const C=m(N);_(A,x+0,S,C),_(w,x+2,E,C),_(P,x+4,M,C)}}function _(S,E,M,N){N<0&&S.x===1&&(s[E]=S.x-1),M.x===0&&M.z===0&&(s[E]=N/2/Math.PI+.5)}function m(S){return Math.atan2(S.z,-S.x)}function p(S){return Math.atan2(-S.y,Math.sqrt(S.x*S.x+S.z*S.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Uo(e.vertices,e.indices,e.radius,e.details)}};class In extends Pn{constructor(e=1,t=0){const i=(1+Math.sqrt(5))/2,a=1/i,n=[-1,-1,-1,-1,-1,1,-1,1,-1,-1,1,1,1,-1,-1,1,-1,1,1,1,-1,1,1,1,0,-a,-i,0,-a,i,0,a,-i,0,a,i,-a,-i,0,-a,i,0,a,-i,0,a,i,0,-i,0,-a,i,0,-a,-i,0,a,i,0,a],s=[3,11,7,3,7,15,3,15,13,7,19,17,7,17,6,7,6,15,17,4,8,17,8,10,17,10,6,8,0,16,8,16,2,8,2,10,0,12,1,0,1,18,0,18,16,6,10,2,6,2,13,6,13,15,2,16,18,2,18,3,2,3,13,18,1,9,18,9,11,18,11,3,4,14,12,4,12,0,4,0,8,11,9,5,11,5,19,11,19,7,19,5,14,19,14,4,19,4,17,1,12,14,1,14,5,1,5,9];super(n,s,e,t),this.type="DodecahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new In(e.radius,e.detail)}}class rr extends Pn{constructor(e=1,t=0){const i=(1+Math.sqrt(5))/2,a=[-1,i,0,1,i,0,-1,-i,0,1,-i,0,0,-1,i,0,1,i,0,-1,-i,0,1,-i,i,0,-1,i,0,1,-i,0,-1,-i,0,1],n=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(a,n,e,t),this.type="IcosahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new rr(e.radius,e.detail)}}class Ti extends Pn{constructor(e=1,t=0){const i=[1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],a=[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2];super(i,a,e,t),this.type="OctahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new Ti(e.radius,e.detail)}}class Ci extends mt{constructor(e=.5,t=1,i=32,a=1,n=0,s=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:e,outerRadius:t,thetaSegments:i,phiSegments:a,thetaStart:n,thetaLength:s},i=Math.max(3,i),a=Math.max(1,a);const o=[],l=[],c=[],h=[];let d=e;const u=(t-e)/a,f=new R,g=new Ie;for(let _=0;_<=a;_++){for(let m=0;m<=i;m++){const p=n+m/i*s;f.x=d*Math.cos(p),f.y=d*Math.sin(p),l.push(f.x,f.y,f.z),c.push(0,0,1),g.x=(f.x/t+1)/2,g.y=(f.y/t+1)/2,h.push(g.x,g.y)}d+=u}for(let _=0;_<a;_++){const m=_*(i+1);for(let p=0;p<i;p++){const S=p+m,E=S,M=S+i+1,N=S+i+2,A=S+1;o.push(E,M,A),o.push(M,N,A)}}this.setIndex(o),this.setAttribute("position",new nt(l,3)),this.setAttribute("normal",new nt(c,3)),this.setAttribute("uv",new nt(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Ci(e.innerRadius,e.outerRadius,e.thetaSegments,e.phiSegments,e.thetaStart,e.thetaLength)}}class Vt extends mt{constructor(e=1,t=32,i=16,a=0,n=Math.PI*2,s=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:i,phiStart:a,phiLength:n,thetaStart:s,thetaLength:o},t=Math.max(3,Math.floor(t)),i=Math.max(2,Math.floor(i));const l=Math.min(s+o,Math.PI);let c=0;const h=[],d=new R,u=new R,f=[],g=[],_=[],m=[];for(let p=0;p<=i;p++){const S=[],E=p/i;let M=0;p===0&&s===0?M=.5/t:p===i&&l===Math.PI&&(M=-.5/t);for(let N=0;N<=t;N++){const A=N/t;d.x=-e*Math.cos(a+A*n)*Math.sin(s+E*o),d.y=e*Math.cos(s+E*o),d.z=e*Math.sin(a+A*n)*Math.sin(s+E*o),g.push(d.x,d.y,d.z),u.copy(d).normalize(),_.push(u.x,u.y,u.z),m.push(A+M,1-E),S.push(c++)}h.push(S)}for(let p=0;p<i;p++)for(let S=0;S<t;S++){const E=h[p][S+1],M=h[p][S],N=h[p+1][S],A=h[p+1][S+1];(p!==0||s>0)&&f.push(E,M,A),(p!==i-1||l<Math.PI)&&f.push(M,N,A)}this.setIndex(f),this.setAttribute("position",new nt(g,3)),this.setAttribute("normal",new nt(_,3)),this.setAttribute("uv",new nt(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Vt(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}class wi extends mt{constructor(e=1,t=.4,i=12,a=48,n=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:i,tubularSegments:a,arc:n},i=Math.floor(i),a=Math.floor(a);const s=[],o=[],l=[],c=[],h=new R,d=new R,u=new R;for(let f=0;f<=i;f++)for(let g=0;g<=a;g++){const _=g/a*n,m=f/i*Math.PI*2;d.x=(e+t*Math.cos(m))*Math.cos(_),d.y=(e+t*Math.cos(m))*Math.sin(_),d.z=t*Math.sin(m),o.push(d.x,d.y,d.z),h.x=e*Math.cos(_),h.y=e*Math.sin(_),u.subVectors(d,h).normalize(),l.push(u.x,u.y,u.z),c.push(g/a),c.push(f/i)}for(let f=1;f<=i;f++)for(let g=1;g<=a;g++){const _=(a+1)*f+g-1,m=(a+1)*(f-1)+g-1,p=(a+1)*(f-1)+g,S=(a+1)*f+g;s.push(_,m,S),s.push(m,p,S)}this.setIndex(s),this.setAttribute("position",new nt(o,3)),this.setAttribute("normal",new nt(l,3)),this.setAttribute("uv",new nt(c,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new wi(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc)}}class Ut extends Ri{static get type(){return"MeshStandardMaterial"}constructor(e){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.color=new Me(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Me(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=0,this.normalScale=new Ie(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new hi,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}const Ys={enabled:!1,files:{},add:function(r,e){this.enabled!==!1&&(this.files[r]=e)},get:function(r){if(this.enabled!==!1)return this.files[r]},remove:function(r){delete this.files[r]},clear:function(){this.files={}}};class wp{constructor(e,t,i){const a=this;let n=!1,s=0,o=0,l;const c=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=i,this.itemStart=function(h){o++,n===!1&&a.onStart!==void 0&&a.onStart(h,s,o),n=!0},this.itemEnd=function(h){s++,a.onProgress!==void 0&&a.onProgress(h,s,o),s===o&&(n=!1,a.onLoad!==void 0&&a.onLoad())},this.itemError=function(h){a.onError!==void 0&&a.onError(h)},this.resolveURL=function(h){return l?l(h):h},this.setURLModifier=function(h){return l=h,this},this.addHandler=function(h,d){return c.push(h,d),this},this.removeHandler=function(h){const d=c.indexOf(h);return d!==-1&&c.splice(d,2),this},this.getHandler=function(h){for(let d=0,u=c.length;d<u;d+=2){const f=c[d],g=c[d+1];if(f.global&&(f.lastIndex=0),f.test(h))return g}return null}}}const Ap=new wp;class Ln{constructor(e){this.manager=e!==void 0?e:Ap,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(e,t){const i=this;return new Promise(function(a,n){i.load(e,a,t,n)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}}Ln.DEFAULT_MATERIAL_NAME="__DEFAULT";class Rp extends Ln{constructor(e){super(e)}load(e,t,i,a){this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const n=this,s=Ys.get(e);if(s!==void 0)return n.manager.itemStart(e),setTimeout(function(){t&&t(s),n.manager.itemEnd(e)},0),s;const o=Lr("img");function l(){h(),Ys.add(e,this),t&&t(this),n.manager.itemEnd(e)}function c(d){h(),a&&a(d),n.manager.itemError(e),n.manager.itemEnd(e)}function h(){o.removeEventListener("load",l,!1),o.removeEventListener("error",c,!1)}return o.addEventListener("load",l,!1),o.addEventListener("error",c,!1),e.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(o.crossOrigin=this.crossOrigin),n.manager.itemStart(e),o.src=e,o}}class Cp extends Ln{constructor(e){super(e)}load(e,t,i,a){const n=new yt,s=new Rp(this.manager);return s.setCrossOrigin(this.crossOrigin),s.setPath(this.path),s.load(e,function(o){n.image=o,n.needsUpdate=!0,t!==void 0&&t(n)},i,a),n}}class No extends ft{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new Me(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(t.object.target=this.target.uuid),t}}const Za=new Je,$s=new R,qs=new R;class Pp{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Ie(512,512),this.map=null,this.mapPass=null,this.matrix=new Je,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new wn,this._frameExtents=new Ie(1,1),this._viewportCount=1,this._viewports=[new Ke(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,i=this.matrix;$s.setFromMatrixPosition(e.matrixWorld),t.position.copy($s),qs.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(qs),t.updateMatrixWorld(),Za.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Za),i.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),i.multiply(Za)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}const Ks=new Je,br=new R,Ja=new R;class Ip extends Pp{constructor(){super(new Ct(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new Ie(4,2),this._viewportCount=6,this._viewports=[new Ke(2,1,1,1),new Ke(0,1,1,1),new Ke(3,1,1,1),new Ke(1,1,1,1),new Ke(3,0,1,1),new Ke(1,0,1,1)],this._cubeDirections=[new R(1,0,0),new R(-1,0,0),new R(0,0,1),new R(0,0,-1),new R(0,1,0),new R(0,-1,0)],this._cubeUps=[new R(0,1,0),new R(0,1,0),new R(0,1,0),new R(0,1,0),new R(0,0,1),new R(0,0,-1)]}updateMatrices(e,t=0){const i=this.camera,a=this.matrix,n=e.distance||i.far;n!==i.far&&(i.far=n,i.updateProjectionMatrix()),br.setFromMatrixPosition(e.matrixWorld),i.position.copy(br),Ja.copy(i.position),Ja.add(this._cubeDirections[t]),i.up.copy(this._cubeUps[t]),i.lookAt(Ja),i.updateMatrixWorld(),a.makeTranslation(-br.x,-br.y,-br.z),Ks.multiplyMatrices(i.projectionMatrix,i.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Ks)}}class ya extends No{constructor(e,t,i=0,a=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=i,this.decay=a,this.shadow=new Ip}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}}class Lp extends No{constructor(e,t){super(e,t),this.isAmbientLight=!0,this.type="AmbientLight"}}const Zs=new Je;class Dp{constructor(e,t,i=0,a=1/0){this.ray=new Sn(e,t),this.near=i,this.far=a,this.camera=null,this.layers=new En,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,(t.near+t.far)/(t.near-t.far)).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):console.error("THREE.Raycaster: Unsupported camera type: "+t.type)}setFromXRController(e){return Zs.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(Zs),this}intersectObject(e,t=!0,i=[]){return pn(e,this,i,t),i.sort(Js),i}intersectObjects(e,t=!0,i=[]){for(let a=0,n=e.length;a<n;a++)pn(e[a],this,i,t);return i.sort(Js),i}}function Js(r,e){return r.distance-e.distance}function pn(r,e,t,i){let a=!0;if(r.layers.test(e.layers)&&r.raycast(e,t)===!1&&(a=!1),a===!0&&i===!0){const n=r.children;for(let s=0,o=n.length;s<o;s++)pn(n[s],e,t,!0)}}class Up{constructor(e=1,t=0,i=0){return this.radius=e,this.phi=t,this.theta=i,this}set(e,t,i){return this.radius=e,this.phi=t,this.theta=i,this}copy(e){return this.radius=e.radius,this.phi=e.phi,this.theta=e.theta,this}makeSafe(){return this.phi=Math.max(1e-6,Math.min(Math.PI-1e-6,this.phi)),this}setFromVector3(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}setFromCartesianCoords(e,t,i){return this.radius=Math.sqrt(e*e+t*t+i*i),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(e,i),this.phi=Math.acos(xt(t/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"170"}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="170");(function(){const r=document.createElement("link").relList;if(r&&r.supports&&r.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))t(i);new MutationObserver(i=>{for(const a of i)if(a.type==="childList")for(const n of a.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&t(n)}).observe(document,{childList:!0,subtree:!0});function e(i){const a={};return i.integrity&&(a.integrity=i.integrity),i.referrerPolicy&&(a.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?a.credentials="include":i.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function t(i){if(i.ep)return;i.ep=!0;const a=e(i);fetch(i.href,a)}})();let kt=null,Dn=!1,fn=null,mn=0,gn=!1;function Np(r){const e=Math.min(window.devicePixelRatio,2);return kt=new yp({canvas:r,antialias:e<2,alpha:!1,powerPreference:"high-performance",stencil:!1,depth:!0}),kt.setPixelRatio(e),kt.setSize(r.clientWidth,r.clientHeight,!1),kt.outputColorSpace=Et,kt.toneMapping=Wo,kt.toneMappingExposure=1.1,kt.shadowMap.enabled=!1,new ResizeObserver(t=>{const i=t[0];if(!i||!kt)return;const{width:a,height:n}=i.contentRect,s=Math.min(window.devicePixelRatio,2);kt.setSize(a,n,!1),kt.setPixelRatio(s),window.dispatchEvent(new CustomEvent("universe-resize",{detail:{width:a,height:n}}))}).observe(r),document.addEventListener("visibilitychange",()=>{gn=document.hidden,!gn&&Dn&&Un()}),kt}function Op(r){fn=r,Dn=!0,mn=performance.now(),Un()}function Un(){if(!Dn||gn)return;requestAnimationFrame(Un);const r=performance.now(),e=Math.min((r-mn)/1e3,.05);mn=r,fn&&fn(e)}const Pt={G2025:{id:"G2025",title:"2025–2029",primaryColor:3201168,accentColor:6356944,nebulaColor:538656,dustColor:269328,starTint:10551256,worldOffset:[0,0,0],scale:1.3,texturePath:"assets/galaxies/galaxy_2025_2029.png",status:"showcase"},G2020:{id:"G2020",title:"2020–2024",primaryColor:2652360,accentColor:5286128,nebulaColor:532544,dustColor:266270,starTint:11065599,worldOffset:[32800,14e3,8400],scale:1,texturePath:"assets/galaxies/galaxy_2020_2024.png",status:"known"},G2015:{id:"G2015",title:"2015–2019",primaryColor:6308032,accentColor:9461992,nebulaColor:2099280,dustColor:1049640,starTint:13674751,worldOffset:[28800,-12e3,-11200],scale:.95,texturePath:"assets/galaxies/galaxy_2015_2019.png",status:"known"},G2010:{id:"G2010",title:"2010–2014",primaryColor:1751224,accentColor:4251856,nebulaColor:671808,dustColor:530464,starTint:10551264,worldOffset:[-4800,20800,-30400],scale:.9,texturePath:"assets/galaxies/galaxy_2010_2014.png",status:"known"},G2005:{id:"G2005",title:"2005–2009",primaryColor:12869674,accentColor:14710848,nebulaColor:9052224,dustColor:4001808,starTint:16760960,worldOffset:[-26e3,-13200,7200],scale:.85,texturePath:"assets/galaxies/galaxy_2005_2009.png",status:"known"},G2000:{id:"G2000",title:"2000–2004",primaryColor:12877098,accentColor:15247434,nebulaColor:8007696,dustColor:4004360,starTint:16769184,worldOffset:[-36e3,9600,-2e4],scale:.8,texturePath:"assets/galaxies/galaxy_2000_2004.png",status:"known"},G2030:{id:"G2030",title:"2030–2034 UNCHARTED",primaryColor:4214896,accentColor:6320272,nebulaColor:1054760,dustColor:527380,starTint:8429760,worldOffset:[7200,-24800,-36e3],scale:.75,texturePath:"assets/galaxies/galaxy_2030_2034.png",status:"uncharted"}},da={position:[0,22e3,58e3],target:[0,0,0]},_n=[[-4500,0,-2500],[0,0,4e3],[5e3,0,-2e3]],Fp=180,zp=4500,Bp=400,Qa=window.matchMedia("(prefers-reduced-motion: reduce)").matches,kp=6e3;class Hp{camera;target=new R;fly=null;historyStack=[];isDragging=!1;prevMouse=new Ie;spherical=new Up;tmpVec=new R;canvas;zoomAnchor=null;velTheta=0;velPhi=0;velRadius=0;DAMPING=.11;lastUserActivity=performance.now();isIdleDrifting=!1;driftTime=0;constructor(e){this.canvas=e,this.camera=new Ct(55,window.innerWidth/window.innerHeight,10,2e6);const[t,i,a]=da.position,[n,s,o]=da.target;this.camera.position.set(t,i,a),this.target.set(n,s,o),this.camera.lookAt(this.target),this.tmpVec.subVectors(this.camera.position,this.target),this.spherical.setFromVector3(this.tmpVec),this._bindEvents(e),window.addEventListener("universe-resize",l=>{const c=l;this.camera.aspect=c.detail.width/c.detail.height,this.camera.updateProjectionMatrix()})}_onActivity(){this.lastUserActivity=performance.now(),this.isIdleDrifting&&(this.isIdleDrifting=!1)}_bindEvents(e){const t=()=>this._onActivity();window.addEventListener("pointermove",t,{passive:!0}),window.addEventListener("wheel",t,{passive:!0}),window.addEventListener("keydown",t,{passive:!0}),window.addEventListener("touchstart",t,{passive:!0}),e.addEventListener("mousedown",n=>{this._onActivity(),this.isDragging=!0,this.prevMouse.set(n.clientX,n.clientY)}),e.addEventListener("mousemove",n=>{if(!this.isDragging)return;this._onActivity();const s=n.clientX-this.prevMouse.x,o=n.clientY-this.prevMouse.y;this._orbit(s*.00042,o*.0004),this.prevMouse.set(n.clientX,n.clientY)}),window.addEventListener("mouseup",()=>{this.isDragging=!1}),e.addEventListener("wheel",n=>this._onWheel(n),{passive:!1}),e.addEventListener("dblclick",n=>this._onDblClick(n));let i=0,a=[];e.addEventListener("touchstart",n=>{this._onActivity(),a=Array.from(n.touches),a.length===1?(this.isDragging=!0,this.prevMouse.set(a[0].clientX,a[0].clientY)):a.length===2&&(this.isDragging=!1,i=Qs(a))},{passive:!0}),e.addEventListener("touchmove",n=>{if(this._onActivity(),a=Array.from(n.touches),a.length===1&&this.isDragging){const s=a[0].clientX-this.prevMouse.x,o=a[0].clientY-this.prevMouse.y;this._orbit(s*.00048,o*.00044),this.prevMouse.set(a[0].clientX,a[0].clientY)}else if(a.length===2){const s=Qs(a),o=i-s,n=this.zoomAnchor?.x??(a[0].clientX+a[1].clientX)*.5,l=this.zoomAnchor?.y??(a[0].clientY+a[1].clientY)*.5;this._zoomTowardAnchor(o*.00034,n,l),i=s}},{passive:!0}),e.addEventListener("touchend",()=>{this.isDragging=!1}),window.addEventListener("keydown",n=>{n.key==="Escape"&&window.dispatchEvent(new CustomEvent("universe-esc"))})}_orbit(e,t){this.velTheta-=e,this.velPhi-=t}_onWheel(e){e.preventDefault(),this._onActivity();const t=this.zoomAnchor?.x??e.clientX,i=this.zoomAnchor?.y??e.clientY,a=ba.clamp(e.deltaY,-120,120)*.0001625;this._zoomTowardAnchor(a,t,i)}_zoom(e){const t=ba.clamp(e,-.032,.032);this.velRadius+=t*this.spherical.radius*.065}_screenPointToFocusPoint(e,t){const i=this.canvas.getBoundingClientRect(),a=(e-i.left)/i.width*2-1,n=-((t-i.top)/i.height*2-1),s=new R(a,n,.5).unproject(this.camera),o=s.sub(this.camera.position).normalize(),l=this.camera.getWorldDirection(new R),c=l.dot(o);if(Math.abs(c)>1e-6){const h=l.dot(this.target.clone().sub(this.camera.position))/c;if(h>0)return this.camera.position.clone().addScaledVector(o,h)}return this.target.clone().addScaledVector(o,Math.max(this.spherical.radius*.65,3500))}_zoomTowardAnchor(e,t,i){const a=ba.clamp(e,-.032,.032),n=this._screenPointToFocusPoint(t,i),s=ba.clamp(-a*2.6,-.085,.085),o=n.clone().sub(this.target).multiplyScalar(s),l=Math.max(180,Math.min(this.spherical.radius*.095,3e3));o.length()>l&&o.setLength(l),this.camera.position.add(o),this.tmpVec.subVectors(this.camera.position,this.target),this.spherical.setFromVector3(this.tmpVec),this._zoom(a)}setZoomAnchor(e,t){const i=this._screenPointToFocusPoint(e,t);return this.zoomAnchor={x:e,y:t,world:i.clone()},i}clearZoomAnchor(){this.zoomAnchor=null}isNearZoomAnchor(e,t,i=48){return!!this.zoomAnchor&&Math.hypot(e-this.zoomAnchor.x,t-this.zoomAnchor.y)<=i}commitZoomAnchor(){this.zoomAnchor&&(this._zoomTowardAnchor(-.03,this.zoomAnchor.x,this.zoomAnchor.y),this._zoomTowardAnchor(-.03,this.zoomAnchor.x,this.zoomAnchor.y))}gentleZoomTowardPoint(e,t){const i=this._screenPointToFocusPoint(e,t),a=this.camera.position.clone().sub(this.target),n=this.target.clone().lerp(i,.28),s=Math.max(700,Math.min(this.spherical.radius*.9,26e4)),o=n.clone().add(a.setLength(s));this.flyTo(o,n,{duration:850,saveHistory:!0})}_onDblClick(e){this._onActivity()}update(e){if(this.fly){this._updateFly(e);return}const t=performance.now();!Qa&&!this.isDragging&&t-this.lastUserActivity>kp&&(this.isIdleDrifting=!0),this.isIdleDrifting?(this.driftTime+=e,this.spherical.theta+=e*.014,this.spherical.phi=ba.clamp(this.spherical.phi+Math.sin(this.driftTime*.2)*2e-4,.05,Math.PI-.05)):(this.spherical.theta+=this.velTheta,this.spherical.phi=ba.clamp(this.spherical.phi+this.velPhi,.05,Math.PI-.05),this.spherical.radius=ba.clamp(this.spherical.radius+this.velRadius,150,32e4),this.velTheta*=1-this.DAMPING,this.velPhi*=1-this.DAMPING,this.velRadius*=1-this.DAMPING),this.tmpVec.setFromSpherical(this.spherical).add(this.target),this.camera.position.copy(this.tmpVec),this.camera.lookAt(this.target)}_updateFly(e){if(!this.fly)return;const t=16;this.fly.elapsed+=t;const i=Qa?1:Math.min(this.fly.elapsed/this.fly.duration,1),a=Gp(i);if(this.camera.position.lerpVectors(this.fly.startPos,this.fly.endPos,a),this.target.lerpVectors(this.fly.startTarget,this.fly.endTarget,a),this.camera.lookAt(this.target),i>=1){const n=this.fly.onDone;this.fly=null,this.tmpVec.subVectors(this.camera.position,this.target),this.spherical.setFromVector3(this.tmpVec),this.velTheta=0,this.velPhi=0,this.velRadius=0,n?.()}}flyTo(e,t,i={}){i.saveHistory&&this.historyStack.push(this.snapshot());const a=Qa?200:i.duration??1100;this.fly={startPos:this.camera.position.clone(),startTarget:this.target.clone(),endPos:new R(e.x,e.y,e.z),endTarget:new R(t.x,t.y,t.z),elapsed:0,duration:a,onDone:i.onDone}}travelToObject(e,t=1200,i={}){const a=new R(t*.7,t*.45,t*.7),n={x:e.x+a.x,y:e.y+a.y,z:e.z+a.z};this.flyTo(n,e,{duration:1200,saveHistory:!0,...i})}resetToHome(e={}){const[t,i,a]=da.position,[n,s,o]=da.target;this.flyTo({x:t,y:i,z:a},{x:n,y:s,z:o},{duration:1400,saveHistory:!0,...e})}returnToPrevious(e={}){const t=this.historyStack.pop();return t?(this.restoreSnapshot(t,!0),!0):!1}hasHistory(){return this.historyStack.length>0}snapshot(){return{position:[this.camera.position.x,this.camera.position.y,this.camera.position.z],target:[this.target.x,this.target.y,this.target.z],zoom:this.spherical.radius}}restoreSnapshot(e,t=!0){const i={x:e.position[0],y:e.position[1],z:e.position[2]},a={x:e.target[0],y:e.target[1],z:e.target[2]};t?this.flyTo(i,a,{duration:800}):(this.camera.position.set(i.x,i.y,i.z),this.target.set(a.x,a.y,a.z),this.camera.lookAt(this.target),this.tmpVec.subVectors(this.camera.position,this.target),this.spherical.setFromVector3(this.tmpVec))}getTarget(){return this.target.clone()}getRadius(){return this.spherical.radius}isBusy(){return this.fly!==null}}function Gp(r){return r<.5?4*r*r*r:1-Math.pow(-2*r+2,3)/2}function Qs(r){const e=r[1].clientX-r[0].clientX,t=r[1].clientY-r[0].clientY;return Math.sqrt(e*e+t*t)}const pa=6e4;class Vp{group;starsMesh;dustMesh;constructor(){this.group=new Gt,this._buildStarfield(),this._buildDust()}_buildStarfield(){const e=new mt,t=new Float32Array(pa*3),i=new Float32Array(pa*3),a=new Float32Array(pa),n=6e5,s=[new Me(16774632),new Me(15266047),new Me(16769200),new Me(11589887),new Me(16765136)];for(let l=0;l<pa;l++){const c=l*3,h=Math.random()*Math.PI*2,d=Math.pow(Math.random(),.5)*n,u=(Math.random()-.5)*n*.35;t[c]=Math.cos(h)*d,t[c+1]=u,t[c+2]=Math.sin(h)*d;const f=s[Math.floor(Math.random()*s.length)];i[c]=f.r,i[c+1]=f.g,i[c+2]=f.b,a[l]=.5+Math.random()*2.5}e.setAttribute("position",new ot(t,3)),e.setAttribute("color",new ot(i,3)),e.setAttribute("size",new ot(a,1));const o=new Tt({uniforms:{time:{value:0}},vertexShader:`
        attribute float size;
        attribute vec3 color;
        varying vec3 vColor;
        uniform float time;
        void main() {
          vColor = color;
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * mv;
          float twinkle = 1.0 + 0.15 * sin(time * 2.0 + position.x * 0.001 + position.z * 0.001);
          gl_PointSize = size * twinkle * (300.0 / -mv.z);
          gl_PointSize = clamp(gl_PointSize, 0.3, 4.0);
        }
      `,fragmentShader:`
        varying vec3 vColor;
        void main() {
          vec2 uv = gl_PointCoord - 0.5;
          float d = length(uv);
          if (d > 0.5) discard;
          float alpha = smoothstep(0.5, 0.0, d);
          gl_FragColor = vec4(vColor * (0.7 + alpha * 0.3), alpha);
        }
      `,transparent:!0,depthWrite:!1,blending:Si});this.starsMesh=new Dr(e,o),this.starsMesh.renderOrder=-10,this.group.add(this.starsMesh)}_buildDust(){const e=new mt,t=new Float32Array(1e4*3),i=25e4;for(let n=0;n<1e4;n++){const s=n*3;t[s]=(Math.random()-.5)*i,t[s+1]=(Math.random()-.5)*i*.2,t[s+2]=(Math.random()-.5)*i}e.setAttribute("position",new ot(t,3));const a=new Cn({color:3491944,size:90,transparent:!0,opacity:.05,depthWrite:!1,blending:Si});this.dustMesh=new Dr(e,a),this.dustMesh.renderOrder=-9,this.group.add(this.dustMesh)}update(e){const t=this.starsMesh.material;t.uniforms.time.value=e,this.dustMesh.position.y=Math.sin(e*.03)*150}dispose(){this.starsMesh.geometry.dispose(),this.starsMesh.material.dispose(),this.dustMesh.geometry.dispose(),this.dustMesh.material.dispose()}}const Wp=new Cp,Xp=3e4,jp=15e4,Yp=6e3,$p=22e3;class qp{constructor(e,t){this.data=e,this.group=new Gt,this.labelContainer=t;const i=Pt[e.id];if(!i)return;const[a,n,s]=i.worldOffset;this.group.position.set(a,n,s),this.group.scale.setScalar(i.scale??1),this.radius=i.status==="showcase"?10500:i.status==="uncharted"?7600:9000,this._buildMist(i),this._buildCore(i),this._buildRegionMarkers(i),this._buildLeds(i),this._buildLabel(),this._buildRegionLabels()}group;labelEls=[];labelContainer;orbitRings=[];gasLayers=[];gasMats=[];ledPivots=[];galaxyLight;coreMaterial;radius=9000;thresholdState=!1;_buildMist(e){const t=e.status==="showcase",i=e.status==="uncharted",a=t?8200:i?2800:5200,n=t?5:4,s=t?9800:i?6900:8200,o=t?1750:i?900:1250,l=new Me(e.primaryColor),c=new Me(e.accentColor),h=new Me(e.starTint);for(let d=0;d<3;d++){const u=Math.floor(a*(d===0?1:d===1?.55:.28)),f=new mt,g=new Float32Array(u*3),_=new Float32Array(u*3),m=new Float32Array(u);for(let p=0;p<u;p++){const S=p%n,E=Math.pow(Math.random(),.66)*s,M=S*Math.PI*2/n+E*.00105+(Math.random()-.5)*(.2+E/s*.42)+(d-1)*.06,N=E+(Math.random()-.5)*(420+d*180);g[p*3]=Math.cos(M)*N,g[p*3+1]=(Math.random()-.5)*o*(.22+.78*E/s)+(d-1)*170,g[p*3+2]=Math.sin(M)*N;const A=l.clone().lerp(c,.28+E/s*.58);Math.random()<.1&&A.lerp(h,.7),_[p*3]=A.r,_[p*3+1]=A.g,_[p*3+2]=A.b,m[p]=(t?30:22)+Math.random()*(d===0?64:38)}f.setAttribute("position",new ot(g,3)),f.setAttribute("color",new ot(_,3)),f.setAttribute("size",new ot(m,1));const y=new Tt({uniforms:{time:{value:0},globalAlpha:{value:i?.28:d===0?.72:d===1?.36:.2}},vertexShader:`attribute float size;attribute vec3 color;uniform float time;uniform float globalAlpha;varying vec3 vColor;varying float vAlpha;void main(){vColor=color;float pulse=.84+.16*sin(time*.45+position.x*.0015+position.z*.001);vAlpha=globalAlpha*pulse;vec4 mv=modelViewMatrix*vec4(position,1.0);gl_Position=projectionMatrix*mv;gl_PointSize=clamp(size*(620.0/-mv.z),.45,18.0);}`,fragmentShader:`varying vec3 vColor;varying float vAlpha;void main(){vec2 uv=gl_PointCoord-.5;float d=length(uv);if(d>.5)discard;float soft=smoothstep(.5,.02,d);float core=smoothstep(.18,0.0,d);gl_FragColor=vec4(vColor*(.78+core*.7),soft*vAlpha);}`,transparent:!0,depthWrite:!1,blending:Si}),v=new Dr(f,y);v.rotation.x=.13+(d-1)*.03,v.rotation.z=(d-1)*.025,this.group.add(v),this.gasLayers.push(v),this.gasMats.push(y)}}_buildCore(e){const t=e.status==="showcase",i=new mt,a=t?1700:900,n=new Float32Array(a*3),s=new Float32Array(a),o=t?2900:2300;for(let l=0;l<a;l++){const c=Math.random()*Math.PI*2,h=Math.pow(Math.random(),1.75)*o;n[l*3]=Math.cos(c)*h,n[l*3+1]=(Math.random()-.5)*460,n[l*3+2]=Math.sin(c)*h,s[l]=(t?34:24)+Math.random()*86}i.setAttribute("position",new ot(n,3)),i.setAttribute("size",new ot(s,1));const l=new Me(e.starTint),c=new Tt({uniforms:{color:{value:l},time:{value:0},globalAlpha:{value:1}},vertexShader:`attribute float size;uniform float time;uniform float globalAlpha;varying float vAlpha;void main(){vAlpha=(.4+.28*sin(time*.6+position.x*.0018))*globalAlpha;vec4 mv=modelViewMatrix*vec4(position,1.0);gl_Position=projectionMatrix*mv;gl_PointSize=clamp(size*(620.0/-mv.z),.5,20.0);}`,fragmentShader:`uniform vec3 color;varying float vAlpha;void main(){vec2 uv=gl_PointCoord-.5;float d=length(uv);if(d>.5)discard;float a=smoothstep(.5,0.0,d)*vAlpha;gl_FragColor=vec4(color,a);}`,transparent:!0,depthWrite:!1,blending:Si}),h=new Dr(i,c);this.coreMaterial=c,this.group.add(h),this.galaxyLight=new ya(e.primaryColor,t?1.25:.58,26e3),this.group.add(this.galaxyLight)}_buildLeds(e){const t=e.status==="showcase"?18:12;for(let i=0;i<t;i++){const a=new Gt,n=(i/t)*Math.PI*2+(i%3)*.17,s=this.radius*(.82+(i%4)*.045),o=new Vt(52+(i%3)*16,12,10),l=new Yt({color:i%2?e.accentColor:e.starTint,transparent:!0,opacity:.62,depthWrite:!1,blending:Si}),c=new Ze(o,l);c.position.set(Math.cos(n)*s,(Math.sin(n*1.7))*this.radius*.16,Math.sin(n)*s),a.add(c),a.rotation.x=(i%5-2)*.035,this.group.add(a),this.ledPivots.push({pivot:a,node:c,speed:.12+(i%4)*.035})}}_buildRegionMarkers(e){for(const t of _n){const i=new Ci(650,720,64),a=new Yt({color:e.accentColor,transparent:!0,opacity:.11,side:Ur,depthWrite:!1}),n=new Ze(i,a);n.position.set(t[0],t[1],t[2]),n.rotation.x=-Math.PI/2,this.orbitRings.push(n),this.group.add(n)}}_buildLabel(){const e=Pt[this.data.id],t=e?.status==="showcase",i=e?.status==="uncharted",a=document.createElement("div");a.className="universe-label galaxy-label",a.dataset.galaxyId=this.data.id,a.innerHTML=`<span class="label-era" style="${t?"color:#60ffd0;font-weight:bold;":i?"color:#6080a0;":""}">${t?"✦ ":""}${this.data.title}${i?" — UNCHARTED":""}</span>`,a.style.cssText=`position:absolute;top:0;left:0;pointer-events:none;font-family:'Space Mono',monospace;font-size:clamp(10px,1.3vw,14px);letter-spacing:.18em;text-transform:uppercase;color:rgba(200,220,255,0);white-space:nowrap;transform:translate(-50%,-50%);transition:color .3s;user-select:none;`,this.labelContainer.appendChild(a);const n=new R(0,1800,0);this.labelEls.push({el:a,pos:n,kind:"galaxy"})}_buildRegionLabels(){const e=this.data.regions;for(let t=0;t<e.length;t++){const i=e[t],a=_n[t]??[0,0,0],n=document.createElement("div");n.className="universe-label region-label",n.dataset.regionId=i.id,n.innerHTML=`<span style="font-weight:600;color:#c0e0ff;">${i.title}</span>${i.subtitle?`<br/><span style="font-size:.8em;opacity:.7;font-weight:normal;">${i.subtitle}</span>`:""}`,n.style.cssText=`position:absolute;top:0;left:0;pointer-events:none;font-family:'Space Grotesk',sans-serif;font-size:clamp(8px,.95vw,11px);letter-spacing:.12em;text-transform:uppercase;color:rgba(180,200,240,0);white-space:nowrap;transform:translate(-50%,-50%);transition:color .3s;user-select:none;text-align:center;`,this.labelContainer.appendChild(n);const s=new R(a[0],a[1]+750,a[2]);this.labelEls.push({el:n,pos:s,kind:"region"})}}updateLabels(e,t,i){const{width:a,height:n}=t.domElement.getBoundingClientRect();for(const{el:s,pos:o,kind:l}of this.labelEls){const c=new R().copy(o);this.group.localToWorld(c);const h=i.distanceTo(c);let d=0;l==="galaxy"?d=eo(h,jp,Xp):d=eo(h,$p,Yp);const u=c.clone().project(e),f=(u.x*.5+.5)*a,g=(-(u.y*.5)+.5)*n;u.z>1||d<.02?(s.style.opacity="0",s.style.pointerEvents="none"):(s.style.opacity=String(d),s.style.left=`${f}px`,s.style.top=`${g}px`)}}update(e,t){const i=this.group.getWorldPosition(new R),a=t?i.distanceTo(t):1e9,n=this.radius*(this.group.scale.x||1),s=a<n*1.02;if(s!==this.thresholdState){this.thresholdState=s;const o=Pt[this.data.id];window.dispatchEvent(new CustomEvent("universe-galaxy-threshold",{detail:{galaxyId:this.data.id,title:this.data.title,state:s?"enter":"exit",primaryColor:o.primaryColor,accentColor:o.accentColor}}))}for(let o=0;o<this.gasLayers.length;o++){this.gasLayers[o].rotation.y=e*(o===0?.0032:o===1?-.0017:.0011),this.gasLayers[o].rotation.z=Math.sin(e*.045+o)*.008;const l=this.gasMats[o];l.uniforms.time.value=e;const c=o===0?.72:o===1?.36:.2;l.uniforms.globalAlpha.value=(s?c*.16:c)*(Pt[this.data.id]?.status==="uncharted"?.55:1)}this.coreMaterial&&(this.coreMaterial.uniforms.time.value=e,this.coreMaterial.uniforms.globalAlpha.value=s?.42:1);for(const o of this.orbitRings)o.material.opacity=(s?.035:.09)+.025*Math.sin(e*.45);for(const o of this.ledPivots)o.pivot.rotation.y+=o.speed*.003,o.pivot.rotation.x+=o.speed*.001,o.node.material.opacity=(s?.2:.58)+.1*Math.sin(e*.8+o.speed*20);this.galaxyLight.intensity=(Pt[this.data.id]?.status==="showcase"?1.25:.58)*(s?.45:1)}getId(){return this.data.id}distanceTo(e){return this.group.getWorldPosition(new R).distanceTo(e)}getShellBoundaryRadius(){return this.radius*(this.group.scale.x||1)}dispose(){for(const{el:e}of this.labelEls)e.remove();for(const e of this.gasLayers)e.geometry.dispose(),e.material.dispose();this.coreMaterial?.dispose()}}class QArchiveOrbit{constructor(e){this.galaxyId=e,this.group=new Gt;const t=Pt[e];if(!t)return;this.group.position.set(...t.worldOffset);const i=[{r:520,o:2600,s:.045},{r:300,o:4200,s:-.06},{r:185,o:5700,s:.035}];for(let a=0;a<i.length;a++){const n=i[a],s=new Gt,o=new Vt(n.r,24,18),l=new Yt({color:a===0?t.accentColor:a===1?t.starTint:t.primaryColor,transparent:!0,opacity:a===2?.7:.9,depthWrite:!0}),c=new Ze(o,l);c.position.x=n.o,c.userData.archiveOrbit=!0,c.userData.title=a===0?"ERA ARCHIVE WORLD":a===1?"ERA MEMORY MOON":"ERA SIGNAL RELIC",s.rotation.x=(a-1)*.19,s.rotation.z=a*.42,s.add(c),this.group.add(s),this.clickTargets.push(c),this.orbiters.push({pivot:s,body:c,speed:n.s})}}group;galaxyId;clickTargets=[];orbiters=[];update(e){for(const t of this.orbiters)t.pivot.rotation.y+=e*t.speed,t.body.rotation.y+=e*.12}getHit(e){const t=e.intersectObjects(this.clickTargets,!1);if(!t.length)return null;const i=t[0].object,a=new R;i.getWorldPosition(a);return{title:String(i.userData.title??"ARCHIVE OBJECT"),worldPos:a}}}function eo(r,e,t){return r>=e?0:r<=t?1:1-(r-t)/(e-t)}const Kp=3e3,Zp=6e4;class Jp{group;instancedFar;instancedMid;nearMeshes=new Map;stars=[];dummy=new ft;labelContainer;labelEls=new Map;myStarId=null;constructor(e){this.group=new Gt,this.labelContainer=e,this._buildFarInstanced(),this._buildMidInstanced()}_buildFarInstanced(){const e=new Vt(30,4,4),t=new Yt({color:16777215,transparent:!0,opacity:.7});this.instancedFar=new Ws(e,t,25e3),this.instancedFar.instanceMatrix.setUsage(Xn),this.instancedFar.count=0,this.group.add(this.instancedFar)}_buildMidInstanced(){const e=new Vt(60,6,6),t=new Yt({color:16777215});this.instancedMid=new Ws(e,t,25e3),this.instancedMid.instanceMatrix.setUsage(Xn),this.instancedMid.count=0,this.instancedMid.visible=!1,this.group.add(this.instancedMid)}setStars(e,t=null){this.stars=e,this.myStarId=t,this._rebuildFar()}_rebuildFar(){const e=new Me;let t=0;for(const i of this.stars){if(t>=25e3)break;this.dummy.position.set(i.x,i.y,i.z),this.dummy.scale.setScalar(i.id===this.myStarId?1.8:1),this.dummy.updateMatrix(),this.instancedFar.setMatrixAt(t,this.dummy.matrix);const a=Pt[i.galaxyId],n=a?new Me(a.starTint):e.set(16777215);i.id===this.myStarId&&n.setHex(16766720),this.instancedFar.setColorAt(t,n),t++}this.instancedFar.count=t,this.instancedFar.instanceMatrix.needsUpdate=!0,this.instancedFar.instanceColor&&(this.instancedFar.instanceColor.needsUpdate=!0)}update(e,t,i){const{width:a,height:n}=i.domElement.getBoundingClientRect(),s=e.length();this.instancedFar.visible=!0,this.instancedMid.visible=!1;for(const o of this.stars){const l=new R(o.x,o.y,o.z),c=e.distanceTo(l);c<Kp?(this._ensureNearMesh(o),this._updateLabel(o,l,t,a,n,c)):(this._removeNearMesh(o.id),this._updateLabel(o,l,t,a,n,c))}s<3e4||e.distanceTo(this.group.position)<Zp}_ensureNearMesh(e){if(this.nearMeshes.has(e.id))return;const t=new Vt(80,12,12),i=Pt[e.galaxyId],a=i?i.starTint:16777215,n=new Ut({color:a,emissive:a,emissiveIntensity:.6,roughness:.1,metalness:.4}),s=new Ze(t,n);s.position.set(e.x,e.y,e.z),s.userData.starId=e.id,this.group.add(s),this.nearMeshes.set(e.id,s)}_removeNearMesh(e){const t=this.nearMeshes.get(e);t&&(this.group.remove(t),t.material.dispose(),t.geometry.dispose(),this.nearMeshes.delete(e))}_updateLabel(e,t,i,a,n,s){const o=1-Math.min(1,Math.max(0,(s-1200)/2800));if(o<.02){const u=this.labelEls.get(e.id);u&&(u.style.opacity="0");return}let l=this.labelEls.get(e.id);l||(l=document.createElement("div"),l.className="universe-label star-label",l.style.cssText=`
        position:absolute;top:0;left:0;
        pointer-events:none;
        font-family:'Space Grotesk',sans-serif;
        font-size:clamp(7px,0.75vw,10px);
        letter-spacing:0.1em;
        color:#e0eeff;
        white-space:nowrap;
        transform:translate(-50%,-100%);
        padding-bottom:4px;
        user-select:none;
      `,l.textContent=e.displayName,this.labelContainer.appendChild(l),this.labelEls.set(e.id,l));const c=t.clone().project(i),h=(c.x*.5+.5)*a,d=(-(c.y*.5)+.5)*n;c.z>1?l.style.opacity="0":(l.style.opacity=String(o),l.style.left=`${h}px`,l.style.top=`${d}px`)}getClickTarget(e){const t=Array.from(this.nearMeshes.values()),i=e.intersectObjects(t);if(i.length>0){const n=i[0].object.userData.starId;return n?{starId:n}:null}const a=e.intersectObject(this.instancedFar);if(a.length>0&&a[0].instanceId!==void 0){const n=this.stars[a[0].instanceId];return n?{starId:n.id}:null}return null}addStar(e){this.stars.push(e),this._rebuildFar()}dispose(){for(const[,e]of this.labelEls)e.remove();this.instancedFar.dispose(),this.instancedMid.dispose();for(const[,e]of this.nearMeshes)e.geometry.dispose(),e.material.dispose()}}const to=[800,1300,1900,2600],Qp=[.35,.22,.14,.09];class ef{group;planetMesh;children=[];labelContainer;time=0;objectData;onObjectClick=null;clickTargets=[];constructor(e,t){this.objectData=e,this.labelContainer=t,this.group=new Gt,this.group.position.set(e.position.x,e.position.y,e.position.z);const i=Pt.G2020;i&&(this.group.position.x+=i.worldOffset[0],this.group.position.z+=i.worldOffset[2]),this._buildPlanet(),this._buildOrbitRings(),this._buildChildren()}_buildPlanet(){const e=new Vt(420,48,48),t=new Tt({uniforms:{time:{value:0},deepColor:{value:new Me(268328)},shallowColor:{value:new Me(673904)},rimColor:{value:new Me(2150608)}},vertexShader:`
        varying vec3 vNormal;
        varying vec3 vPos;
        uniform float time;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vPos = position;
          vec3 displaced = position + normal * (
            15.0 * sin(position.y * 0.008 + time * 1.2) *
            cos(position.x * 0.006 + time * 0.8)
          );
          gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
        }
      `,fragmentShader:`
        uniform vec3 deepColor;
        uniform vec3 shallowColor;
        uniform vec3 rimColor;
        uniform float time;
        varying vec3 vNormal;
        varying vec3 vPos;
        void main() {
          vec3 viewDir = normalize(cameraPosition - vPos);
          float rim = 1.0 - max(0.0, dot(vNormal, viewDir));
          rim = pow(rim, 3.0);
          float wave = 0.5 + 0.5 * sin(vPos.y * 0.01 + vPos.x * 0.008 + time * 0.9);
          vec3 waterColor = mix(deepColor, shallowColor, wave);
          vec3 final = mix(waterColor, rimColor, rim * 0.7);
          gl_FragColor = vec4(final, 1.0);
        }
      `,transparent:!1});this.planetMesh=new Ze(e,t),this.planetMesh.userData.objectId=this.objectData.id,this.group.add(this.planetMesh),this.clickTargets.push(this.planetMesh);const i=new ya(2138320,1.2,5e3);this.group.add(i)}_buildOrbitRings(){for(const e of to){const t=new Ci(e-4,e+4,96),i=new Yt({color:1720416,transparent:!0,opacity:.25,side:Ur,depthWrite:!1}),a=new Ze(t,i);a.rotation.x=-Math.PI/2,this.group.add(a)}}_buildChildren(){const e=this.objectData.children??[],t={audio:"♪",video:"▶",playable:"⚡",archive:"◈"},i={audio:16765056,video:16744544,playable:8454016,archive:12632319};for(let a=0;a<e.length;a++){const n=e[a],s=to[a]??800+a*500,o=Qp[a]??.08,l=a/e.length*Math.PI*2,c=(a%2===0?1:-1)*(a*60),h=n.mediaKind??"archive",d=i[h]??16777215;let u;h==="playable"?u=new rr(90,1):h==="audio"?u=new wi(60,22,12,40):h==="video"?u=new Or(0,80,160,8):u=new Ti(70,0);const f=new Ut({color:d,emissive:d,emissiveIntensity:.3,roughness:.3,metalness:.6}),g=new Ze(u,f);g.position.set(Math.cos(l)*s,c,Math.sin(l)*s),g.userData.childId=n.id,g.userData.contentStatus=n.contentStatus,this.group.add(g),this.clickTargets.push(g);const _=document.createElement("div");_.className="universe-label streams-child-label",_.style.cssText=`
        position:absolute;top:0;left:0;
        pointer-events:none;
        font-family:'Space Grotesk',sans-serif;
        font-size:clamp(8px,0.9vw,11px);
        letter-spacing:0.1em;
        text-transform:uppercase;
        color:rgba(220,240,255,0);
        white-space:nowrap;
        transform:translate(-50%,-130%);
        transition:color 0.3s;
        user-select:none;
        text-align:center;
        line-height:1.4;
      `,_.innerHTML=`<span>${t[h]??"○"}</span><br/><span>${n.title}</span>`,this.labelContainer.appendChild(_),this.children.push({id:n.id,title:n.title,mediaKind:h,contentStatus:n.contentStatus??"awaiting-source",mesh:g,orbitRadius:s,orbitSpeed:o,orbitAngle:l,orbitY:c,labelEl:_})}}update(e,t,i){this.time+=e;const a=this.planetMesh.material;a.uniforms.time.value=this.time,this.planetMesh.rotation.y+=e*.06;for(const n of this.children)n.orbitAngle+=e*n.orbitSpeed,n.mesh.position.set(Math.cos(n.orbitAngle)*n.orbitRadius,n.orbitY,Math.sin(n.orbitAngle)*n.orbitRadius),n.mesh.rotation.y+=e*.5,n.mesh.rotation.x+=e*.3;this._updateLabels(t,i)}_updateLabels(e,t){const{width:i,height:a}=t.domElement.getBoundingClientRect(),n=new R;e.getWorldPosition(n);for(const s of this.children){const o=new R;s.mesh.getWorldPosition(o);const l=n.distanceTo(o),c=800,h=1-Math.min(1,Math.max(0,(l-c)/(3500-c))),d=o.clone().project(e),u=(d.x*.5+.5)*i,f=(-(d.y*.5)+.5)*a;d.z>1||h<.02?s.labelEl.style.opacity="0":(s.labelEl.style.opacity=String(h),s.labelEl.style.left=`${u}px`,s.labelEl.style.top=`${f}px`)}}getChildData(e){return this.children.find(t=>t.id===e)}getPlanetWorldPos(){const e=new R;return this.planetMesh.getWorldPosition(e),e}dispose(){for(const e of this.children)e.mesh.geometry.dispose(),e.mesh.material.dispose(),e.labelEl.remove();this.planetMesh.geometry.dispose(),this.planetMesh.material.dispose()}}class tf{group;planetMesh;emberParticles;children=[];labelContainer;time=0;objectData;clickTargets=[];constructor(e,t){this.objectData=e,this.labelContainer=t,this.group=new Gt;const[i,a,n]=Pt.G2025?.worldOffset??[0,0,0];this.group.position.set(i+e.position.x,a+e.position.y,n+e.position.z),this._buildMoltenPlanet(),this._buildEmbers(),this._buildOrbitRings(),this._buildChildren()}_buildMoltenPlanet(){const e=new Vt(450,48,48),t=new Tt({uniforms:{time:{value:0},crustColor:{value:new Me(1574918)},moltenColor:{value:new Me(14965544)},emberGlow:{value:new Me(16750848)}},vertexShader:`
        varying vec3 vNormal;
        varying vec3 vPos;
        uniform float time;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vPos = position;
          vec3 displaced = position + normal * (
            18.0 * sin(position.y * 0.007 + time * 1.5) *
            cos(position.z * 0.009 + time * 1.1)
          );
          gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
        }
      `,fragmentShader:`
        uniform vec3 crustColor;
        uniform vec3 moltenColor;
        uniform vec3 emberGlow;
        uniform float time;
        varying vec3 vNormal;
        varying vec3 vPos;
        void main() {
          vec3 viewDir = normalize(cameraPosition - vPos);
          float rim = 1.0 - max(0.0, dot(vNormal, viewDir));
          rim = pow(rim, 2.5);
          float heat = 0.5 + 0.5 * sin(vPos.x * 0.01 + vPos.y * 0.008 + time * 1.2);
          heat *= smoothstep(0.2, 0.8, sin(vPos.z * 0.012 + time * 0.7));
          vec3 base = mix(crustColor, moltenColor, heat);
          vec3 final = mix(base, emberGlow, rim * 0.85);
          gl_FragColor = vec4(final, 1.0);
        }
      `});this.planetMesh=new Ze(e,t),this.planetMesh.userData.objectId=this.objectData.id,this.group.add(this.planetMesh),this.clickTargets.push(this.planetMesh);const i=new ya(14965544,1.5,6e3);this.group.add(i)}_buildEmbers(){const e=new mt,t=new Float32Array(600*3),i=new Float32Array(600);for(let n=0;n<600;n++){const s=Math.random()*Math.PI*2,o=Math.acos(Math.random()*2-1),l=470+Math.random()*350;t[n*3]=l*Math.sin(o)*Math.cos(s),t[n*3+1]=l*Math.sin(o)*Math.sin(s),t[n*3+2]=l*Math.cos(o),i[n]=4+Math.random()*12}e.setAttribute("position",new ot(t,3)),e.setAttribute("size",new ot(i,1));const a=new Tt({uniforms:{time:{value:0}},vertexShader:`
        attribute float size;
        uniform float time;
        varying float vAlpha;
        void main() {
          vec3 p = position;
          p.y += sin(time * 2.0 + position.x * 0.01) * 30.0;
          vAlpha = 0.4 + 0.4 * sin(time * 3.0 + position.z * 0.02);
          vec4 mv = modelViewMatrix * vec4(p, 1.0);
          gl_Position = projectionMatrix * mv;
          gl_PointSize = size * (350.0 / -mv.z);
        }
      `,fragmentShader:`
        varying float vAlpha;
        void main() {
          vec2 uv = gl_PointCoord - 0.5;
          if (length(uv) > 0.5) discard;
          gl_FragColor = vec4(1.0, 0.45, 0.15, vAlpha);
        }
      `,transparent:!0,depthWrite:!1,blending:Si});this.emberParticles=new Dr(e,a),this.group.add(this.emberParticles)}_buildOrbitRings(){const e=[900,1500,2200];for(const t of e){const i=new Ci(t-5,t+5,64),a=new Yt({color:14965544,transparent:!0,opacity:.2,side:Ur,depthWrite:!1}),n=new Ze(i,a);n.rotation.x=-Math.PI/2,this.group.add(n)}}_buildChildren(){const e=this.objectData.children??[],t=[900,1500,2200,2900],i=[.3,.2,.14,.09];for(let a=0;a<e.length;a++){const n=e[a],s=t[a]??1e3+a*600,o=i[a]??.1,l=a/e.length*Math.PI*2,c=n.mediaKind??"archive";let h,d;c==="playable"?(h=new Ti(95,1),d=new Ut({color:16737826,emissive:16729088,emissiveIntensity:.5,roughness:.2,metalness:.8})):c==="audio"?(h=new wi(65,24,12,36),d=new Ut({color:16755268,emissive:16737792,emissiveIntensity:.3})):c==="video"?(h=new Or(0,85,170,8),d=new Ut({color:16729139,emissive:13378065,emissiveIntensity:.3})):(h=new rr(75,0),d=new Ut({color:13399893,roughness:.4}));const u=new Ze(h,d);u.position.set(Math.cos(l)*s,0,Math.sin(l)*s),u.userData.childId=n.id,u.userData.contentStatus=n.contentStatus,this.group.add(u),this.clickTargets.push(u);const f=document.createElement("div");f.className="universe-label fire-child-label",f.style.cssText=`
        position:absolute;top:0;left:0;pointer-events:none;
        font-family:'Space Grotesk',sans-serif;font-size:clamp(8px,0.9vw,11px);
        letter-spacing:0.1em;text-transform:uppercase;color:rgba(255,200,180,0);
        white-space:nowrap;transform:translate(-50%,-130%);transition:color 0.3s;
        user-select:none;text-align:center;line-height:1.4;
      `;const g=c==="playable"?"◇ SATELLITE":c==="audio"?"♪ AUDIO":c==="video"?"▶ VIDEO":"◐ ARCHIVE";f.innerHTML=`<span>${g}</span><br/><span>${n.title}</span>`,this.labelContainer.appendChild(f),this.children.push({id:n.id,title:n.title,mediaKind:c,contentStatus:n.contentStatus??"live",mesh:u,orbitRadius:s,orbitSpeed:o,orbitAngle:l,labelEl:f})}}update(e,t,i){this.time+=e;const a=this.planetMesh.material;a.uniforms.time.value=this.time,this.planetMesh.rotation.y+=e*.05;const n=this.emberParticles.material;n.uniforms.time.value=this.time;for(const s of this.children)s.orbitAngle+=e*s.orbitSpeed,s.mesh.position.set(Math.cos(s.orbitAngle)*s.orbitRadius,Math.sin(this.time*.5+s.orbitRadius)*40,Math.sin(s.orbitAngle)*s.orbitRadius),s.mesh.rotation.y+=e*.6;this._updateLabels(t,i)}_updateLabels(e,t){const{width:i,height:a}=t.domElement.getBoundingClientRect(),n=new R;e.getWorldPosition(n);for(const s of this.children){const o=new R;s.mesh.getWorldPosition(o);const l=n.distanceTo(o),c=900,h=1-Math.min(1,Math.max(0,(l-c)/(3800-c))),d=o.clone().project(e),u=(d.x*.5+.5)*i,f=(-(d.y*.5)+.5)*a;d.z>1||h<.02?s.labelEl.style.opacity="0":(s.labelEl.style.opacity=String(h),s.labelEl.style.left=`${u}px`,s.labelEl.style.top=`${f}px`)}}getChildData(e){return this.children.find(t=>t.id===e)}getPlanetWorldPos(){const e=new R;return this.planetMesh.getWorldPosition(e),e}dispose(){for(const e of this.children)e.mesh.geometry.dispose(),e.mesh.material.dispose(),e.labelEl.remove();this.planetMesh.geometry.dispose(),this.planetMesh.material.dispose()}}class rf{group;planetMesh;cloudMesh;birdParticles;children=[];labelContainer;time=0;objectData;clickTargets=[];constructor(e,t){this.objectData=e,this.labelContainer=t,this.group=new Gt;const[i,a,n]=Pt.G2025?.worldOffset??[0,0,0];this.group.position.set(i+e.position.x,a+e.position.y,n+e.position.z),this._buildSunrisePlanet(),this._buildClouds(),this._buildBirdParticles(),this._buildOrbitRings(),this._buildChildren()}_buildSunrisePlanet(){const e=new Vt(460,48,48),t=new Tt({uniforms:{time:{value:0},goldColor:{value:new Me(13732918)},earthColor:{value:new Me(2823945)},greenTone:{value:new Me(3829824)},sunRay:{value:new Me(16769184)}},vertexShader:`
        varying vec3 vNormal;
        varying vec3 vPos;
        uniform float time;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vPos = position;
          vec3 displaced = position + normal * (
            14.0 * sin(position.y * 0.008 + time * 0.8) *
            cos(position.x * 0.006 + time * 0.6)
          );
          gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
        }
      `,fragmentShader:`
        uniform vec3 goldColor;
        uniform vec3 earthColor;
        uniform vec3 greenTone;
        uniform vec3 sunRay;
        uniform float time;
        varying vec3 vNormal;
        varying vec3 vPos;
        void main() {
          vec3 viewDir = normalize(cameraPosition - vPos);
          float rim = 1.0 - max(0.0, dot(vNormal, viewDir));
          rim = pow(rim, 2.2);
          float elevation = 0.5 + 0.5 * sin(vPos.y * 0.008 + vPos.x * 0.006 + time * 0.4);
          vec3 terrain = mix(earthColor, greenTone, smoothstep(0.3, 0.7, elevation));
          vec3 base = mix(terrain, goldColor, 0.4);
          vec3 final = mix(base, sunRay, rim * 0.75);
          gl_FragColor = vec4(final, 1.0);
        }
      `});this.planetMesh=new Ze(e,t),this.planetMesh.userData.objectId=this.objectData.id,this.group.add(this.planetMesh),this.clickTargets.push(this.planetMesh);const i=new ya(13732918,1.6,7e3);this.group.add(i)}_buildClouds(){const e=new Vt(480,36,36),t=new Yt({color:16772560,transparent:!0,opacity:.18,depthWrite:!1,blending:Si});this.cloudMesh=new Ze(e,t),this.group.add(this.cloudMesh)}_buildBirdParticles(){const e=new mt,t=new Float32Array(300*3);for(let a=0;a<300;a++){const n=Math.random()*Math.PI*2,s=520+Math.random()*400;t[a*3]=Math.cos(n)*s,t[a*3+1]=(Math.random()-.5)*300,t[a*3+2]=Math.sin(n)*s}e.setAttribute("position",new ot(t,3));const i=new Cn({color:16765072,size:14,transparent:!0,opacity:.45,blending:Si,depthWrite:!1});this.birdParticles=new Dr(e,i),this.group.add(this.birdParticles)}_buildOrbitRings(){const e=[950,1400,1900,2400,2900];for(const t of e){const i=new Ci(t-4,t+4,64),a=new Yt({color:13732918,transparent:!0,opacity:.22,side:Ur,depthWrite:!1}),n=new Ze(i,a);n.rotation.x=-Math.PI/2,this.group.add(n)}}_buildChildren(){const e=this.objectData.children??[];for(let t=0;t<e.length;t++){const i=e[t],a=950+t%5*480,n=.25-t%5*.035,s=t/e.length*Math.PI*2,o=i.mediaKind??"archive";let l,c;o==="playable"?(l=new In(90,0),c=new Ut({color:13732918,emissive:16755268,emissiveIntensity:.5,roughness:.25,metalness:.7})):o==="audio"?(l=new wi(60,20,12,32),c=new Ut({color:16758852,emissive:13399808,emissiveIntensity:.3})):o==="video"?(l=new Vt(65,16,16),c=new Ut({color:14716976,emissive:11161616,emissiveIntensity:.3})):(l=new Ti(70,0),c=new Ut({color:12089392,roughness:.4}));const h=new Ze(l,c);h.position.set(Math.cos(s)*a,(t%2===0?1:-1)*(t*30),Math.sin(s)*a),h.userData.childId=i.id,h.userData.contentStatus=i.contentStatus,h.userData.mediaUrl=i.mediaUrl,h.userData.posterUrl=i.posterUrl,this.group.add(h),this.clickTargets.push(h);const d=document.createElement("div");d.className="universe-label africa-child-label",d.style.cssText=`
        position:absolute;top:0;left:0;pointer-events:none;
        font-family:'Space Grotesk',sans-serif;font-size:clamp(8px,0.85vw,10px);
        letter-spacing:0.1em;text-transform:uppercase;color:rgba(255,230,190,0);
        white-space:nowrap;transform:translate(-50%,-130%);transition:color 0.3s;
        user-select:none;text-align:center;line-height:1.4;
      `;const u=o==="playable"?"◇ SATELLITE":o==="audio"?"♪ AUDIO":o==="video"?"▶ DOC":"◐ ARCHIVE";d.innerHTML=`<span>${u}</span><br/><span>${i.title}</span>`,this.labelContainer.appendChild(d),this.children.push({id:i.id,title:i.title,mediaKind:o,contentStatus:i.contentStatus??"live",mediaUrl:i.mediaUrl,posterUrl:i.posterUrl,mesh:h,orbitRadius:a,orbitSpeed:n,orbitAngle:s,labelEl:d})}}update(e,t,i){this.time+=e;const a=this.planetMesh.material;a.uniforms.time.value=this.time,this.planetMesh.rotation.y+=e*.04,this.cloudMesh.rotation.y+=e*.07,this.birdParticles.rotation.y+=e*.12;for(const n of this.children)n.orbitAngle+=e*n.orbitSpeed,n.mesh.position.set(Math.cos(n.orbitAngle)*n.orbitRadius,Math.sin(this.time*.4+n.orbitRadius)*35,Math.sin(n.orbitAngle)*n.orbitRadius),n.mesh.rotation.y+=e*.5;this._updateLabels(t,i)}_updateLabels(e,t){const{width:i,height:a}=t.domElement.getBoundingClientRect(),n=new R;e.getWorldPosition(n);for(const s of this.children){const o=new R;s.mesh.getWorldPosition(o);const l=n.distanceTo(o),c=900,h=1-Math.min(1,Math.max(0,(l-c)/(3800-c))),d=o.clone().project(e),u=(d.x*.5+.5)*i,f=(-(d.y*.5)+.5)*a;d.z>1||h<.02?s.labelEl.style.opacity="0":(s.labelEl.style.opacity=String(h),s.labelEl.style.left=`${u}px`,s.labelEl.style.top=`${f}px`)}}getChildData(e){return this.children.find(t=>t.id===e)}getPlanetWorldPos(){const e=new R;return this.planetMesh.getWorldPosition(e),e}dispose(){for(const e of this.children)e.mesh.geometry.dispose(),e.mesh.material.dispose(),e.labelEl.remove();this.planetMesh.geometry.dispose(),this.planetMesh.material.dispose(),this.cloudMesh.geometry.dispose(),this.cloudMesh.material.dispose()}}class af{group;planetMeshes=[];children=[];labelContainer;time=0;clickTargets=[];constructor(e,t){this.labelContainer=t,this.group=new Gt;const[i,a,n]=Pt.G2025?.worldOffset??[0,0,0];this.group.position.set(i,a,n);for(const s of e)s.id==="OBJ-FIRE"||s.id==="OBJ-AFRICA"||s.id==="OBJ-STREAMS"||this._buildSystem(s)}_buildSystem(e){const t=new R(e.position.x,e.position.y,e.position.z),i=e.accentColor?parseInt(e.accentColor.replace("#","0x"),16):4227264;let a;e.id==="OBJ-EBONY"?a=new rr(360,3):e.id==="OBJ-AVIATOR"?a=new wi(260,90,16,48):e.id==="OBJ-AWAY"?a=new Vt(320,32,32):a=new Ti(280,2);const n=new Ut({color:i,emissive:i,emissiveIntensity:.35,roughness:.25,metalness:.65}),s=new Ze(a,n);s.position.copy(t),s.userData.objectId=e.id,this.group.add(s),this.planetMeshes.push(s),this.clickTargets.push(s);const o=new Ci(650,660,48),l=new Yt({color:i,transparent:!0,opacity:.2,side:Ur,depthWrite:!1}),c=new Ze(o,l);if(c.position.copy(t),c.rotation.x=-Math.PI/2,this.group.add(c),e.children){const h=[700,1100,1600];for(let d=0;d<e.children.length;d++){const u=e.children[d],f=h[d]??800+d*450,g=d/e.children.length*Math.PI*2,_=u.mediaKind??"archive";let m;_==="playable"?m=new Ti(75,1):_==="audio"?m=new wi(50,16,12,28):_==="video"?m=new Or(0,70,140,8):m=new rr(60,0);const p=new Ut({color:i,emissive:i,emissiveIntensity:.4,roughness:.3,metalness:.6}),S=new Ze(m,p);S.position.set(t.x+Math.cos(g)*f,t.y,t.z+Math.sin(g)*f),S.userData.childId=u.id,S.userData.contentStatus=u.contentStatus,S.userData.mediaUrl=u.mediaUrl,this.group.add(S),this.clickTargets.push(S);const E=document.createElement("div");E.className="universe-label frontier-child-label",E.style.cssText=`
          position:absolute;top:0;left:0;pointer-events:none;
          font-family:'Space Grotesk',sans-serif;font-size:clamp(8px,0.85vw,10px);
          letter-spacing:0.1em;text-transform:uppercase;color:rgba(220,240,255,0);
          white-space:nowrap;transform:translate(-50%,-130%);transition:color 0.3s;
          user-select:none;text-align:center;line-height:1.4;
        `;const M=_==="playable"?"◇ SATELLITE":_==="audio"?"♪ AUDIO":_==="video"?"▶ VIDEO":"◐ ARCHIVE";E.innerHTML=`<span>${M}</span><br/><span>${u.title}</span>`,this.labelContainer.appendChild(E),this.children.push({id:u.id,title:u.title,mediaKind:_,contentStatus:u.contentStatus??"live",mediaUrl:u.mediaUrl,mesh:S,orbitRadius:f,orbitSpeed:.2+d%3*.08,orbitAngle:g,parentPos:t,labelEl:E})}}}update(e,t,i){this.time+=e;for(const a of this.planetMeshes)a.rotation.y+=e*.1,a.rotation.x+=e*.05;for(const a of this.children)a.orbitAngle+=e*a.orbitSpeed,a.mesh.position.set(a.parentPos.x+Math.cos(a.orbitAngle)*a.orbitRadius,a.parentPos.y+Math.sin(this.time*.5+a.orbitRadius)*25,a.parentPos.z+Math.sin(a.orbitAngle)*a.orbitRadius),a.mesh.rotation.y+=e*.6;this._updateLabels(t,i)}_updateLabels(e,t){const{width:i,height:a}=t.domElement.getBoundingClientRect(),n=new R;e.getWorldPosition(n);for(const s of this.children){const o=new R;s.mesh.getWorldPosition(o);const l=n.distanceTo(o),c=900,h=1-Math.min(1,Math.max(0,(l-c)/(3800-c))),d=o.clone().project(e),u=(d.x*.5+.5)*i,f=(-(d.y*.5)+.5)*a;d.z>1||h<.02?s.labelEl.style.opacity="0":(s.labelEl.style.opacity=String(h),s.labelEl.style.left=`${u}px`,s.labelEl.style.top=`${f}px`)}}getChildData(e){return this.children.find(t=>t.id===e)}dispose(){for(const e of this.children)e.mesh.geometry.dispose(),e.mesh.material.dispose(),e.labelEl.remove();for(const e of this.planetMeshes)e.geometry.dispose(),e.material.dispose()}}function nf(){try{const r=localStorage.getItem("universe_my_stars_map");if(r)return JSON.parse(r)}catch{const r=localStorage.getItem("universe_my_star_id");if(r)return{G2025:r}}return{}}const io=nf(),Dt={navContext:{level:"universe"},cameraSnapshot:null,selectedObjectId:null,selectedStarId:null,activeOverlay:"none",overlayData:null,audioState:"silent",muted:!!localStorage.getItem("universe_muted"),currentGalaxyId:"G2025",placementMode:!1,myStarId:Object.values(io)[0]??null,myStarsMap:io,stars:[],loaded:!1},Ar=new Map,vn=new Set;function ro(r,e,t){const i=Ar.get(r);i&&i.forEach(a=>a(e,t)),vn.forEach(a=>a())}const Xe={get(r){return Dt[r]},set(r,e){const t=Dt[r];t!==e&&(Dt[r]=e,ro(r,e,t))},patch(r){for(const[e,t]of Object.entries(r)){const i=Dt[e];i!==t&&(Dt[e]=t,ro(e,t,i))}},subscribe(r,e){return Ar.has(r)||Ar.set(r,new Set),Ar.get(r).add(e),()=>Ar.get(r).delete(e)},on(r){return vn.add(r),()=>vn.delete(r)},getState(){return{...Dt}},toggleMute(){const r=!Dt.muted;r?localStorage.setItem("universe_muted","1"):localStorage.removeItem("universe_muted"),this.set("muted",r)},pushCameraSnapshot(r){this.set("cameraSnapshot",r)},popCameraSnapshot(){return Dt.cameraSnapshot},setMyStarId(r){localStorage.setItem("universe_my_star_id",r),this.set("myStarId",r)},setMyStarForGalaxy(r,e){const t={...Dt.myStarsMap,[r]:e};this.set("myStarsMap",t),this.set("myStarId",e)},hasStarInGalaxy(r){return!!Dt.myStarsMap[r]},getMyStarForGalaxy(r){return Dt.myStarsMap[r]??null},addStar(r){const e=[...Dt.stars,r];this.set("stars",e)}},sf=1500;class of{ambientLayers=new Map;activeRegionTheme=null;masterMuted;masterVol=.22;_rafId=0;isDucked=!1;REGION_TRACKS={fire:"https://static.wixstatic.com/mp3/85e419_7810e2c471ce46b5a1c5a664b8307995.mp3",africa:"https://static.wixstatic.com/mp3/85e419_f92713dc5c48443ca1c191bbbb0aec04.mp3",frontier:"https://static.wixstatic.com/mp3/85e419_7be9c7aa18ad4a6db00fd1af6ee7dbcd.mp3"};constructor(){this.masterMuted=!!localStorage.getItem("universe_muted"),this._tick=this._tick.bind(this),requestAnimationFrame(this._tick)}unlock(){if(!this.masterMuted)for(const e of this.ambientLayers.values())e.el.paused&&e.targetVol>0&&e.el.play().catch(()=>{})}setRegionTheme(e){if(this.activeRegionTheme===e)return;this.activeRegionTheme=e;const t=e?this.REGION_TRACKS[e]:null;for(const[i,a]of this.ambientLayers)i!==t&&(a.targetVol=0);if(t){let i=this.ambientLayers.get(t);if(!i){const a=new Audio(t);a.loop=!0,a.volume=0,a.preload="auto",i={src:t,el:a,targetVol:0,currentVol:0},this.ambientLayers.set(t,i)}i.targetVol=this.masterMuted||this.isDucked?0:this.masterVol,!this.masterMuted&&i.el.paused&&i.el.play().catch(()=>{})}}duckAmbient(){this.isDucked=!0;for(const e of this.ambientLayers.values())e.targetVol=e.targetVol>0?this.masterVol*.08:0}restoreAmbient(){if(this.isDucked=!1,!this.masterMuted)for(const e of this.ambientLayers.values()){const t=this.activeRegionTheme&&this.REGION_TRACKS[this.activeRegionTheme]===e.src;e.targetVol=t?this.masterVol:0}}setMuted(e){this.masterMuted=e;for(const t of this.ambientLayers.values())e?(t.targetVol=0,t.el.pause()):this.activeRegionTheme&&this.REGION_TRACKS[this.activeRegionTheme]===t.src&&(t.targetVol=this.masterVol,t.el.play().catch(()=>{}))}_tick(){this._rafId=requestAnimationFrame(this._tick);const e=16/sf;for(const t of this.ambientLayers.values()){const i=t.targetVol-t.currentVol;Math.abs(i)>.001&&(t.currentVol+=i*e*6,t.el.volume=Math.max(0,Math.min(1,t.currentVol)))}}dispose(){cancelAnimationFrame(this._rafId);for(const e of this.ambientLayers.values())e.el.pause()}}const ht=new of;let jt=null;async function lf(){if(jt)return jt;const r=await fetch("./data/seed_universe.json");if(!r.ok)throw new Error(`Failed to load seed data: ${r.status}`);return jt=await r.json(),jt}const Nn=new Map,cf=new Map,ao=new Map;function hf(r){for(const e of r.galaxies){Nn.set(e.id,e);for(const t of e.regions)cf.set(t.id,{...t,galaxyId:e.id})}for(const e of r.celestialObjects)if(ao.set(e.id,e),e.children)for(const t of e.children)ao.set(t.id,{...t,galaxyId:e.galaxyId,regionId:e.regionId,position:{...e.position}})}function xn(){return jt?jt.galaxies:[]}function yn(r){return Nn.get(r)?.regions??[]}function Oo(){return jt?jt.celestialObjects:[]}function uf(){return jt?jt.demoStars:[]}function df(){return uf().map(r=>({id:r.id,galaxyId:r.galaxyId,regionId:r.regionId,clusterId:r.clusterId,x:r.x,y:r.y,z:r.z,displayName:r.displayName,message:r.message,createdAt:"2025-01-01T00:00:00Z",isDemo:!0}))}function Pr(r){return Pt[r]?.worldOffset??[0,0,0]}function Fo(r,e){const t=Pr(r),i=yn(r).findIndex(n=>n.id===e),a=_n[Math.max(0,i)];return[t[0]+a[0],t[1]+a[1],t[2]+a[2]]}function pf(r){const e=Pr(r.galaxyId);return[e[0]+r.position.x,e[1]+r.position.y,e[2]+r.position.z]}function On(r){const e=Nn.get(r);return e?`${e.title} Galaxy`:r}function ff(r){return`${Math.max(1,Math.round(r*.085))} AU`}const no="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";function mf(r=21){const e=crypto.getRandomValues(new Uint8Array(r));return Array.from(e,t=>no[t%no.length]).join("")}const Zi=500;class gf{cells=new Map;key(e,t,i){return`${Math.floor(e/Zi)},${Math.floor(t/Zi)},${Math.floor(i/Zi)}`}insert(e){const t=this.key(e.x,e.y,e.z);this.cells.has(t)||this.cells.set(t,[]),this.cells.get(t).push(e)}checkCollision(e,t,i,a){const n=Math.floor(e/Zi),s=Math.floor(t/Zi),o=Math.floor(i/Zi);for(let l=-1;l<=1;l++)for(let c=-1;c<=1;c++)for(let h=-1;h<=1;h++){const d=`${n+l},${s+c},${o+h}`,u=this.cells.get(d);if(u){for(const f of u)if(Math.sqrt((f.x-e)**2+(f.y-t)**2+(f.z-i)**2)<a)return!0}}return!1}rebuild(e){this.cells.clear();for(const t of e)this.insert(t)}}const en="universe_stars",so="universe_my_stars_map",oo="universe_last_place",_f=1e3*30;class vf{grid=new gf;stars=[];loaded=!1;async loadStars(){if(this.loaded)return this.stars;const e=df();let t=[];try{const i=localStorage.getItem(en);i&&(t=JSON.parse(i))}catch{t=[]}return this.stars=[...e,...t],this.grid.rebuild(this.stars),this.loaded=!0,this.stars}getMyStarsMap(){try{const e=localStorage.getItem(so);if(e)return JSON.parse(e)}catch{const e=localStorage.getItem("universe_my_star_id");if(e)return{G2025:e}}return{}}hasStarInGalaxy(e){return!!this.getMyStarsMap()[e]}getMyStarId(e){const t=this.getMyStarsMap();return e?t[e]??null:Object.values(t)[0]??null}async placestar(e){if(this.hasStarInGalaxy(e.galaxyId))return{success:!1,error:"already-placed-in-galaxy"};const t=localStorage.getItem(oo);if(t&&Date.now()-parseInt(t)<_f)return{success:!1,error:"rate-limit"};if(this.grid.checkCollision(e.x,e.y,e.z,Fp))return{success:!1,error:"collision"};const i=Fo(e.galaxyId,e.regionId),a=e.x-i[0],n=e.z-i[2];if(Math.sqrt(a*a+n*n)>zp||Math.abs(e.y-i[1])>Bp)return{success:!1,error:"collision"};const s={id:mf(),galaxyId:e.galaxyId,regionId:e.regionId,x:e.x,y:e.y,z:e.z,displayName:tn(e.displayName),starName:e.starName?tn(e.starName):void 0,message:e.message?tn(e.message):void 0,signatureDataUrl:e.signatureDataUrl,createdAt:new Date().toISOString(),isDemo:!1};this.stars.push(s),this.grid.insert(s);try{const o=localStorage.getItem(en),l=o?JSON.parse(o):[];l.push(s),localStorage.setItem(en,JSON.stringify(l));const c=this.getMyStarsMap();c[e.galaxyId]=s.id,localStorage.setItem(so,JSON.stringify(c)),localStorage.setItem(oo,String(Date.now()))}catch{}return Xe.setMyStarForGalaxy(e.galaxyId,s.id),{success:!0,star:s}}async getStarById(e){return await this.loadStars(),this.stars.find(t=>t.id===e)??null}}function tn(r){return r.replace(/<[^>]*>/g,"").trim().slice(0,280)}const bi=new vf;class xf{el;galaxyLabel;muteBtn;placeBtn;resetBtn;returnBtn;tourBtn;breadcrumb;callbacks;constructor(e,t){this.callbacks=t,this.el=document.createElement("div"),this.el.id="universe-hud",this.el.setAttribute("role","navigation"),this.el.setAttribute("aria-label","Universe navigation"),this.el.style.cssText=`
      position:absolute;
      top:0;left:0;right:0;
      display:flex;
      align-items:center;
      justify-content:space-between;
      padding:env(safe-area-inset-top,12px) 20px 12px;
      padding-top:max(env(safe-area-inset-top),12px);
      background:linear-gradient(to bottom,rgba(0,4,12,0.85) 0%,transparent 100%);
      pointer-events:none;
      z-index:50;
      gap:12px;
    `,this.el.innerHTML=`
      <div style="display:flex;align-items:center;gap:12px;pointer-events:auto;flex-wrap:wrap;">
        <a
          id="hud-exit"
          href="../../index.html"
          style="
            font-family:'Space Mono',monospace;
            font-size:0.65rem;
            letter-spacing:0.18em;
            color:#3a6080;
            text-decoration:none;
            text-transform:uppercase;
            transition:color 0.2s;
            padding:6px 0;
          "
          aria-label="Exit Universe and return to main site"
        >← SITE</a>
        <div id="hud-breadcrumb" style="
          font-family:'Space Mono',monospace;
          font-size:0.6rem;
          letter-spacing:0.15em;
          color:#2a4858;
          text-transform:uppercase;
        ">UNIVERSE</div>
        <button
          id="hud-reset"
          type="button"
          style="${fa("rgba(255,255,255,0.05)","#4080c0")}"
          aria-label="Reset Camera to Universe Composition"
          title="Reset View to Default Universe Composition"
        >⌂ RESET VIEW</button>
        <button
          id="hud-return"
          type="button"
          style="${fa("rgba(255,255,255,0.05)","#4080c0")} display:none;"
          aria-label="Return to Previous Location"
        >← RETURN</button>
      </div>

      <div id="hud-galaxy-name" style="
        font-family:'Space Mono',monospace;
        font-size:0.65rem;
        letter-spacing:0.2em;
        color:#4a78a0;
        text-transform:uppercase;
        text-align:center;
        flex:1;
        pointer-events:none;
      "></div>

      <div style="display:flex;align-items:center;gap:10px;pointer-events:auto;">
        <button
          id="hud-tour"
          type="button"
          style="${fa("rgba(40,100,160,0.4)","#70c0ff")}"
          aria-label="Take me somewhere guided tour"
          title="Cinematic flight to a featured universe destination"
        >✦ TAKE ME SOMEWHERE</button>

        <button
          id="hud-place"
          type="button"
          style="${fa("rgba(20,60,100,0.6)","#5090c0")}"
          aria-label="Place or view your star"
        >✦ PLACE STAR</button>

        <button
          id="hud-mute"
          type="button"
          style="
            background:rgba(255,255,255,0.04);
            border:1px solid rgba(255,255,255,0.08);
            border-radius:50%;
            width:32px;height:32px;
            color:#3a6080;
            cursor:pointer;
            font-size:0.85rem;
            display:flex;align-items:center;justify-content:center;
            transition:background 0.2s, color 0.2s;
          "
          aria-label="Toggle sound"
        >♪</button>
      </div>
    `,e.appendChild(this.el),this.galaxyLabel=this.el.querySelector("#hud-galaxy-name"),this.breadcrumb=this.el.querySelector("#hud-breadcrumb"),this.muteBtn=this.el.querySelector("#hud-mute"),this.placeBtn=this.el.querySelector("#hud-place"),this.resetBtn=this.el.querySelector("#hud-reset"),this.returnBtn=this.el.querySelector("#hud-return"),this.tourBtn=this.el.querySelector("#hud-tour"),this._bindEvents(),this._syncMute(),Xe.subscribe("currentGalaxyId",i=>{this.galaxyLabel.textContent=i?On(i):"",this._syncStarButton()}),Xe.subscribe("navContext",i=>{this.breadcrumb.textContent=i.level.toUpperCase()}),Xe.subscribe("muted",()=>this._syncMute()),Xe.subscribe("myStarsMap",()=>this._syncStarButton()),this._syncStarButton()}_syncStarButton(){const e=Xe.get("currentGalaxyId")??"G2025",t=bi.getMyStarId(e);t?(this.placeBtn.textContent="✦ VIEW YOUR STAR",this.placeBtn.style.color="#ffd700",this.placeBtn.style.background="rgba(100,80,10,0.6)",this.placeBtn.dataset.action="view",this.placeBtn.dataset.starId=t):(this.placeBtn.textContent="✦ PLACE STAR",this.placeBtn.style.color="#5090c0",this.placeBtn.style.background="rgba(20,60,100,0.6)",this.placeBtn.dataset.action="place",delete this.placeBtn.dataset.starId)}_bindEvents(){this.resetBtn.addEventListener("click",()=>{ht.unlock(),this.callbacks.onResetView()}),this.returnBtn.addEventListener("click",()=>{ht.unlock(),this.callbacks.onReturnPrevious()}),this.tourBtn.addEventListener("click",()=>{ht.unlock(),this.callbacks.onTakeTour()}),this.muteBtn.addEventListener("click",()=>{ht.unlock(),Xe.toggleMute(),ht.setMuted(Xe.get("muted"))}),this.placeBtn.addEventListener("click",()=>{ht.unlock();const e=this.placeBtn.dataset.action,t=this.placeBtn.dataset.starId;e==="view"&&t?this.callbacks.onViewMyStar(t):(Xe.set("placementMode",!0),window.dispatchEvent(new CustomEvent("universe-start-placement")))}),document.getElementById("universe-canvas")?.addEventListener("click",()=>{ht.unlock()},{once:!0})}setReturnAvailable(e){this.returnBtn.style.display=e?"inline-block":"none"}_syncMute(){const e=Xe.get("muted");this.muteBtn.textContent=e?"♪̶":"♪",this.muteBtn.setAttribute("aria-label",e?"Unmute":"Mute"),this.muteBtn.style.color=e?"#2a3848":"#4a85b0"}setPlacementMode(e){e?(this.placeBtn.textContent="✦ PLACING…",this.placeBtn.style.color="#60c080"):this._syncStarButton()}dispose(){this.el.remove()}}function fa(r,e){return`
    font-family:'Space Grotesk',sans-serif;
    font-size:0.65rem;letter-spacing:0.12em;text-transform:uppercase;
    background:${r};
    border:1px solid rgba(80,160,240,0.25);
    border-radius:4px;
    color:${e};
    padding:6px 12px;
    cursor:pointer;
    transition:background 0.2s, color 0.2s;
    white-space:nowrap;
  `}class yf{el;openBtn;panel;activeTab="map";isOpen=!1;callbacks;constructor(e,t){this.callbacks=t,this.el=document.createElement("div"),this.el.id="galactic-navigator-wrap",this.el.style.cssText=`
      position:absolute;
      bottom:24px;
      left:20px;
      z-index:40;
      font-family:'Space Grotesk',sans-serif;
      pointer-events:none;
    `,this.openBtn=document.createElement("button"),this.openBtn.type="button",this.openBtn.id="nav-open-btn",this.openBtn.setAttribute("aria-label","Open Galactic Navigator"),this.openBtn.style.cssText=`
      pointer-events:auto;
      background:rgba(2,10,24,0.85);
      border:1px solid rgba(80,160,240,0.3);
      border-radius:8px;
      color:#8ab4d4;
      font-family:'Space Mono',monospace;
      font-size:0.7rem;
      letter-spacing:0.15em;
      padding:10px 16px;
      cursor:pointer;
      display:flex;
      align-items:center;
      gap:8px;
      backdrop-filter:blur(8px);
      transition:background 0.2s, border-color 0.2s;
    `,this.openBtn.innerHTML="<span>⛯</span> <span>GALACTIC NAVIGATOR</span>",this.panel=document.createElement("div"),this.panel.id="nav-panel",this.panel.style.cssText=`
      pointer-events:auto;
      display:none;
      width:340px;
      max-width:90vw;
      max-height:75vh;
      background:linear-gradient(135deg, rgba(2,10,24,0.92) 0%, rgba(4,16,36,0.94) 100%);
      border:1px solid rgba(80,160,240,0.35);
      border-radius:12px;
      box-shadow:0 8px 32px rgba(0,0,0,0.6);
      backdrop-filter:blur(12px);
      overflow:hidden;
      flex-direction:column;
      margin-bottom:12px;
      animation:nav-slide-up 0.25s cubic-bezier(0.16,1,0.3,1);
    `,this.el.appendChild(this.panel),this.el.appendChild(this.openBtn),e.appendChild(this.el),this._injectStyles(),this._bindEvents(),this.render(),Xe.on(()=>{this.isOpen&&this._updateTelemetry()})}_injectStyles(){if(document.getElementById("nav-styles"))return;const e=document.createElement("style");e.id="nav-styles",e.textContent=`
      @keyframes nav-slide-up {
        from { opacity:0; transform:translateY(12px); }
        to { opacity:1; transform:translateY(0); }
      }
      .nav-tab-btn {
        flex:1;
        padding:10px;
        background:none;
        border:none;
        border-bottom:2px solid transparent;
        color:#4a6888;
        font-family:'Space Mono',monospace;
        font-size:0.65rem;
        letter-spacing:0.15em;
        text-transform:uppercase;
        cursor:pointer;
        transition:color 0.2s, border-color 0.2s;
      }
      .nav-tab-btn.active {
        color:#8ab4d4;
        border-bottom-color:#4090d0;
      }
      .nav-tree-item {
        padding:6px 12px;
        border-radius:4px;
        cursor:pointer;
        font-size:0.75rem;
        color:#7090b0;
        display:flex;
        align-items:center;
        justify-content:space-between;
        transition:background 0.15s, color 0.15s;
      }
      .nav-tree-item:hover {
        background:rgba(80,160,240,0.12);
        color:#e0f0ff;
      }
      .nav-tree-item.active {
        background:rgba(80,160,240,0.2);
        color:#8ab4d4;
        font-weight:600;
      }
    `,document.head.appendChild(e)}_bindEvents(){this.openBtn.addEventListener("click",()=>{this.isOpen=!this.isOpen,this.panel.style.display=this.isOpen?"flex":"none",this.isOpen&&this.render()})}render(){const e=Xe.get("currentGalaxyId")??"G2025",t=xn().find(i=>i.id===e);t&&yn(e),this.panel.innerHTML=`
      <div style="display:flex;border-bottom:1px solid rgba(255,255,255,0.08);background:rgba(0,0,0,0.2);">
        <button type="button" class="nav-tab-btn ${this.activeTab==="map"?"active":""}" data-tab="map">⛯ MAP</button>
        <button type="button" class="nav-tab-btn ${this.activeTab==="legend"?"active":""}" data-tab="legend">✧ LEGEND</button>
      </div>

      <!-- YOU ARE HERE TELEMETRY -->
      <div id="nav-telemetry" style="
        padding:12px 16px;
        background:rgba(80,160,240,0.05);
        border-bottom:1px solid rgba(255,255,255,0.06);
        font-family:'Space Mono',monospace;
        font-size:0.65rem;
      ">
        <div style="color:#4080c0;letter-spacing:0.15em;margin-bottom:4px;font-weight:bold;">YOU ARE HERE</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:4px;color:#7090b0;">
          <div>GALAXY: <strong style="color:#c0d8f0;">${t?.title??"2025–2029"}</strong></div>
          <div>AU: <strong id="telemetry-au" style="color:#c0d8f0;">427 AU</strong></div>
        </div>
      </div>

      <div style="padding:12px 16px;overflow-y:auto;flex:1;">
        ${this.activeTab==="map"?this._renderMapHTML():this._renderLegendHTML()}
      </div>
    `,this.panel.querySelectorAll(".nav-tab-btn").forEach(i=>{i.addEventListener("click",a=>{const n=a.currentTarget.dataset.tab;this.activeTab=n,this.render()})}),this.panel.querySelectorAll(".nav-tree-item").forEach(i=>{i.addEventListener("click",a=>{const n=a.currentTarget,s=n.dataset.type,o=n.dataset.id,l=n.dataset.parentId;s==="galaxy"&&o?this.callbacks.onTravelToGalaxy(o):s==="region"&&o&&l?this.callbacks.onTravelToRegion(l,o):s==="object"&&o&&this.callbacks.onTravelToObject(o)})}),this._updateTelemetry()}_renderMapHTML(){const e=xn(),t=Xe.get("currentGalaxyId")??"G2025",i=Oo();return`
      <div style="font-family:'Space Mono',monospace;font-size:0.65rem;color:#4a6888;letter-spacing:0.1em;margin-bottom:8px;">
        KNOWN GALAXIES (CLICK TO TRAVEL)
      </div>
      <div style="display:flex;flex-direction:column;gap:4px;">
        ${e.map(a=>{const n=a.id===t,s=a.id==="G2025",o=yn(a.id);return`
            <div class="nav-tree-item ${n?"active":""}" data-type="galaxy" data-id="${a.id}">
              <span>${s?"✦ ":""}${a.title}</span>
              <span style="font-size:0.6rem;opacity:0.6;">${s?"SHOWCASE":"KNOWN"}</span>
            </div>
            ${n?`
              <div style="margin-left:12px;padding-left:8px;border-left:1px solid rgba(80,160,240,0.2);display:flex;flex-direction:column;gap:2px;margin-bottom:6px;">
                ${o.map(l=>`
                  <div class="nav-tree-item" data-type="region" data-id="${l.id}" data-parent-id="${a.id}">
                    <span>↳ ${l.title}</span>
                  </div>
                `).join("")}
                ${i.filter(l=>l.galaxyId===a.id).map(l=>`
                  <div class="nav-tree-item" data-type="object" data-id="${l.id}">
                    <span style="color:#50a0d0;">● ${l.title}</span>
                    <span style="font-size:0.6rem;opacity:0.6;">${l.kind.toUpperCase()}</span>
                  </div>
                `).join("")}
              </div>
            `:""}
          `}).join("")}
      </div>
    `}_renderLegendHTML(){return`
      <div style="display:flex;flex-direction:column;gap:8px;">
        ${[{icon:"✦",label:"STAR",desc:"Visitor in the Universe"},{icon:"☀",label:"SUN",desc:"Era-defining work / event"},{icon:"●",label:"PLANET",desc:"Major work / history"},{icon:"◐",label:"MOON",desc:"Related artifact"},{icon:"◇",label:"SATELLITE",desc:"Interactive / external media"},{icon:"☄",label:"COMET",desc:"Theme / person crossing eras"},{icon:"✧",label:"NEBULA",desc:"Creative period"},{icon:"✺",label:"SUPERNOVA",desc:"Transformative event"},{icon:"·",label:"ASTEROID",desc:"Small archival artifact"}].map(e=>`
          <div style="display:flex;align-items:center;gap:12px;padding:6px;border-bottom:1px solid rgba(255,255,255,0.04);">
            <span style="font-size:1.1rem;color:#8ab4d4;width:24px;text-align:center;">${e.icon}</span>
            <div>
              <div style="font-family:'Space Mono',monospace;font-size:0.65rem;color:#c0d8f0;letter-spacing:0.1em;">${e.label}</div>
              <div style="font-size:0.7rem;color:#5a7898;">${e.desc}</div>
            </div>
          </div>
        `).join("")}
      </div>
    `}_updateTelemetry(){const e=this.panel.querySelector("#telemetry-au");if(e){const t=Xe.get("cameraSnapshot"),i=t?Math.hypot(...t.position):48e3;e.textContent=ff(i)}}dispose(){this.el.remove()}}const zo=[];let Mn={type:"universe"};function rn(r){const e=r.replace(/^#\/?/,"");if(!e||e==="universe")return{type:"universe"};const[t,i]=e.split("/");return t==="galaxy"&&i?{type:"galaxy",galaxyId:i}:t==="object"&&i?{type:"object",objectId:i}:t==="star"&&i?{type:"star",starId:i}:{type:"universe"}}function an(r){Mn=r,zo.forEach(e=>e(r))}const nn={init(){window.addEventListener("hashchange",()=>{an(rn(window.location.hash))}),an(rn(window.location.hash))},on(r){zo.push(r),r(Mn)},navigate(r,e=!0){let t="";r.type==="universe"?t="#universe":r.type==="galaxy"?t=`#galaxy/${r.galaxyId}`:r.type==="object"?t=`#object/${r.objectId}`:r.type==="star"&&(t=`#star/${r.starId}`),e?(history.pushState(null,"",t),an(rn(t))):history.replaceState(null,"",t)},back(){history.back()},current(){return Mn}};function Pi(r,e){const t=document.createElement("div");return t.id=r,t.className=`overlay-panel ${e}`,t.setAttribute("role","dialog"),t.setAttribute("aria-modal","true"),t.style.cssText=`
    position:absolute;
    inset:0;
    display:flex;
    align-items:center;
    justify-content:center;
    background:rgba(0,4,12,0.82);
    backdrop-filter:blur(4px);
    -webkit-backdrop-filter:blur(4px);
    z-index:100;
    animation:overlay-in 0.25s ease;
  `,t}function Ii(){if(document.getElementById("overlay-styles"))return;const r=document.createElement("style");r.id="overlay-styles",r.textContent=`
    @keyframes overlay-in {
      from { opacity:0; transform:scale(0.97); }
      to   { opacity:1; transform:scale(1); }
    }
    @keyframes overlay-out {
      from { opacity:1; }
      to   { opacity:0; }
    }
    @media (prefers-reduced-motion:reduce) {
      @keyframes overlay-in { from { opacity:0; } to { opacity:1; } }
      @keyframes overlay-out { from { opacity:1; } to { opacity:0; } }
    }
    .overlay-panel { font-family:'Space Grotesk',sans-serif; }
    .overlay-close-btn {
      position:absolute;top:20px;right:20px;
      background:rgba(255,255,255,0.06);
      border:1px solid rgba(255,255,255,0.12);
      color:#a0b8d0;
      width:36px;height:36px;
      border-radius:50%;
      cursor:pointer;
      font-size:1rem;
      display:flex;align-items:center;justify-content:center;
      transition:background 0.2s,color 0.2s;
      line-height:1;
    }
    .overlay-close-btn:hover { background:rgba(255,255,255,0.12); color:#fff; }
    .overlay-close-btn:focus-visible { outline:2px solid #4090d0; outline-offset:2px; }
  `,document.head.appendChild(r)}function lr(r){const e=r.querySelectorAll('button,a,[tabindex]:not([tabindex="-1"]),input,textarea,select'),t=e[0],i=e[e.length-1];function a(n){n.key==="Tab"&&(n.shiftKey?document.activeElement===t&&(n.preventDefault(),i?.focus()):document.activeElement===i&&(n.preventDefault(),t?.focus()))}return r.addEventListener("keydown",a),t?.focus(),()=>r.removeEventListener("keydown",a)}function cr(r,e){function t(i){i.key==="Escape"&&e()}return window.addEventListener("keydown",t),()=>window.removeEventListener("keydown",t)}function Fr(r,e){const t=document.createElement("button");return t.className="overlay-close-btn",t.type="button",t.setAttribute("aria-label","Close"),t.innerHTML="×",t.addEventListener("click",e),r.appendChild(t),t}function Mf(r,e,t){Ii(),ht.duckAmbient();const i=Pi("audio-overlay","audio-overlay");i.setAttribute("aria-label",`Audio: ${e.title}`);const a=!e.mediaUrl||e.contentStatus==="awaiting-source";i.innerHTML=`
    <div style="
      position:relative;
      background:linear-gradient(135deg,#030d18 0%,#061828 60%,#020a10 100%);
      border:1px solid rgba(32,160,208,0.2);
      border-radius:16px;
      padding:48px 40px 36px;
      max-width:480px;
      width:90vw;
      text-align:center;
    ">
      <div style="
        width:120px;height:120px;
        border-radius:50%;
        border:2px solid rgba(32,200,200,0.3);
        display:flex;align-items:center;justify-content:center;
        margin:0 auto 24px;
        position:relative;
        animation:orbit-pulse 3s ease-in-out infinite;
      ">
        <span style="font-size:2.5rem;" aria-hidden="true">♪</span>
        <div style="
          position:absolute;inset:-20px;
          border:1px solid rgba(32,200,200,0.1);
          border-radius:50%;
          animation:orbit-spin 8s linear infinite;
        "></div>
      </div>
      <p style="font-size:0.7rem;letter-spacing:0.2em;color:#4090b0;margin-bottom:8px;text-transform:uppercase;">
        Streams / Audio
      </p>
      <h2 style="font-family:'Space Mono',monospace;font-size:1.1rem;letter-spacing:0.1em;margin-bottom:16px;color:#c8e8f8;">
        ${e.title}
      </h2>
      ${a?`
        <p style="color:#4a6878;font-size:0.8rem;letter-spacing:0.08em;margin-bottom:24px;">
          AUDIO SOURCE PENDING — RECORD MARKED AWAITING-SOURCE
        </p>
        <div style="
          background:rgba(8,40,60,0.6);
          border:1px dashed rgba(32,120,160,0.25);
          border-radius:8px;
          padding:16px;
          color:#3a6878;
          font-size:0.75rem;
          font-family:'Space Mono',monospace;
          letter-spacing:0.05em;
        ">
          contentStatus: "awaiting-source"<br/>
          No media URL has been assigned yet.<br/>
          This record will activate when a real source is supplied.
        </div>
      `:`
        <audio
          id="spatial-audio"
          controls
          style="width:100%;border-radius:8px;margin-bottom:16px;accent-color:#20c0c0;"
          src="${e.mediaUrl}"
        ></audio>
      `}
    </div>
  `,wf();const n=()=>{i.style.animation="overlay-out 0.2s ease forwards",setTimeout(()=>{i.remove(),ht.restoreAmbient(),t()},200)};Fr(i.firstElementChild,n);const s=cr(i,n),o=lr(i);if(i.addEventListener("mousedown",l=>{l.target===i&&n()}),r.appendChild(i),r.setAttribute("aria-hidden","false"),!a){const l=i.querySelector("#spatial-audio");l?.play().catch(()=>{}),l?.addEventListener("play",()=>ht.duckAmbient()),l?.addEventListener("pause",()=>ht.restoreAmbient())}return()=>{s(),o(),n()}}function bf(r,e,t){Ii(),ht.duckAmbient();const i=Pi("video-overlay","video-overlay");i.setAttribute("aria-label",`Video: ${e.title}`),i.style.background="rgba(0,0,0,0.92)";const a=!e.mediaUrl||e.contentStatus==="awaiting-source";i.innerHTML=`
    <div style="
      position:relative;
      max-width:820px;width:92vw;
    ">
      <p style="
        font-family:'Space Mono',monospace;
        font-size:0.65rem;letter-spacing:0.2em;color:#4090b0;
        text-align:center;margin-bottom:12px;text-transform:uppercase;
      ">
        Streams / Video
      </p>
      <h2 style="
        font-family:'Space Mono',monospace;font-size:1rem;letter-spacing:0.08em;
        color:#c8e8f8;text-align:center;margin-bottom:16px;
      ">
        ${e.title}
      </h2>
      <div style="
        aspect-ratio:16/9;
        background:#020810;
        border:1px solid rgba(255,100,60,0.15);
        border-radius:8px;
        display:flex;align-items:center;justify-content:center;
        overflow:hidden;
      ">
        ${a?`
          <div style="text-align:center;color:#3a5060;padding:32px;">
            <div style="font-size:2.5rem;margin-bottom:16px;" aria-hidden="true">▶</div>
            <p style="font-family:'Space Mono',monospace;font-size:0.7rem;letter-spacing:0.1em;">
              VIDEO SOURCE PENDING<br/>contentStatus: "awaiting-source"
            </p>
          </div>
        `:e.mediaUrl?.includes("youtube")||e.mediaUrl?.includes("youtu.be")?`
          <iframe
            src="${Tf(e.mediaUrl)}"
            style="width:100%;height:100%;border:none;"
            allow="autoplay;encrypted-media"
            allowfullscreen
            title="${e.title}"
          ></iframe>
        `:`
          <video
            controls autoplay
            style="width:100%;height:100%;"
            src="${e.mediaUrl}"
            ${e.posterUrl?`poster="${e.posterUrl}"`:""}
          ></video>
        `}
      </div>
    </div>
  `;const n=()=>{i.style.animation="overlay-out 0.2s ease forwards",setTimeout(()=>{i.remove(),ht.restoreAmbient(),t()},200)};Fr(i,n);const s=cr(i,n),o=lr(i);return i.addEventListener("mousedown",l=>{l.target===i&&n()}),r.appendChild(i),()=>{s(),o(),n()}}function Sf(r,e,t){Ii(),ht.duckAmbient();const i=Pi("playable-overlay","playable-overlay");i.setAttribute("aria-label",`Playable Experience: ${e.title}`),i.style.background="rgba(0,0,0,0.98)",i.style.padding="0";const a=e.mediaUrl??"/games/streams/";i.innerHTML=`
    <div style="position:relative;width:100%;height:100%;">
      <div style="
        position:absolute;top:0;left:0;right:0;
        display:flex;align-items:center;justify-content:between;
        padding:10px 16px;
        background:rgba(0,4,8,0.9);
        z-index:10;
        gap:16px;
      ">
        <span style="
          font-family:'Space Mono',monospace;
          font-size:0.6rem;letter-spacing:0.2em;color:#4090b0;
          flex:1;text-transform:uppercase;
        ">
          2FLY UNIVERSE — ${e.title}
        </span>
        <button
          id="exit-playable"
          type="button"
          style="
            font-family:'Space Grotesk',sans-serif;
            font-size:0.7rem;letter-spacing:0.12em;text-transform:uppercase;
            background:rgba(255,255,255,0.06);
            border:1px solid rgba(255,255,255,0.15);
            color:#a0c0d8;
            padding:6px 14px;border-radius:4px;
            cursor:pointer;
            transition:background 0.2s;
          "
          aria-label="Exit experience and return to Universe"
        >
          EXIT UNIVERSE
        </button>
      </div>
      <iframe
        id="playable-frame"
        src="${a}"
        style="
          position:absolute;inset:40px 0 0 0;
          width:100%;
          height:calc(100% - 40px);
          border:none;
          background:#000;
        "
        title="${e.title}"
        allow="autoplay"
        sandbox="allow-scripts allow-same-origin allow-forms"
      ></iframe>
    </div>
  `;const n=()=>{i.style.animation="overlay-out 0.15s ease forwards",setTimeout(()=>{i.remove(),ht.restoreAmbient(),t()},150)};i.querySelector("#exit-playable")?.addEventListener("click",n);const s=cr(i,n);r.appendChild(i);const o=l=>{(l.data==="UNIVERSE_EXIT"||l.data?.type==="UNIVERSE_EXIT")&&n()};return window.addEventListener("message",o),()=>{s(),window.removeEventListener("message",o),n()}}function Ef(r,e,t){Ii();const i=Pi("archive-overlay","archive-overlay");i.setAttribute("aria-label",`Archive: ${e.title}`),i.innerHTML=`
    <div style="
      position:relative;
      background:linear-gradient(135deg,#040810 0%,#080c18 100%);
      border:1px solid rgba(160,160,255,0.15);
      border-radius:16px;
      padding:48px 40px 36px;
      max-width:560px;width:90vw;
    ">
      <p style="font-size:0.65rem;letter-spacing:0.2em;color:#6060c0;margin-bottom:8px;text-transform:uppercase;font-family:'Space Mono',monospace;">
        Streams / Archive
      </p>
      <h2 style="font-family:'Space Mono',monospace;font-size:1.1rem;letter-spacing:0.1em;margin-bottom:20px;color:#c0c8f8;">
        ${e.title}
      </h2>
      ${e.contentStatus==="awaiting-source"?`
        <div style="
          background:rgba(20,20,60,0.5);
          border:1px dashed rgba(80,80,180,0.25);
          border-radius:8px;
          padding:20px;
          color:#4a4a90;
          font-size:0.75rem;
          font-family:'Space Mono',monospace;
          letter-spacing:0.05em;
          line-height:1.7;
        ">
          ARTIFACT RECORD — DOSSIER PENDING<br/>
          contentStatus: "awaiting-source"<br/><br/>
          This archive object is reserved for artwork,<br/>
          documentation, and archival materials.<br/>
          Content will appear when assigned to this record.
        </div>
      `:`<p style="color:#8090a8;font-size:0.9rem;line-height:1.7;">${e.description??"Archive record."}</p>`}
    </div>
  `;const a=()=>{i.style.animation="overlay-out 0.2s ease forwards",setTimeout(()=>{i.remove(),t()},200)};Fr(i.firstElementChild,a);const n=cr(i,a),s=lr(i);return i.addEventListener("mousedown",o=>{o.target===i&&a()}),r.appendChild(i),()=>{n(),s(),a()}}function Tf(r){const e=r.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);return e?`https://www.youtube.com/embed/${e[1]}?autoplay=1`:r}function wf(){if(document.getElementById("orbit-anim"))return;const r=document.createElement("style");r.id="orbit-anim",r.textContent=`
    @keyframes orbit-pulse {
      0%,100% { box-shadow:0 0 20px rgba(32,200,200,0.1); }
      50% { box-shadow:0 0 40px rgba(32,200,200,0.25); }
    }
    @keyframes orbit-spin {
      to { transform:rotate(360deg); }
    }
  `,document.head.appendChild(r)}function Af(r,e,t){Ii();const i=Pi("star-card-overlay","star-card-overlay");i.setAttribute("aria-label",`Star Card: ${e.displayName}`),i.style.background="rgba(0,2,10,0.92)";const a=document.createElement("canvas");a.width=1080,a.height=1350,a.style.display="none",document.body.appendChild(a),ln(a,e,1080,1350);const n=document.createElement("canvas");n.width=1080,n.height=1920,n.style.display="none",document.body.appendChild(n),ln(n,e,1080,1920);const s=document.createElement("canvas");s.width=360,s.height=450,s.style.cssText="border-radius:8px;max-width:100%;",ln(s,e,360,450);const o=`${location.origin}${location.pathname}#star/${e.id}`;i.innerHTML=`
    <div style="
      position:relative;
      background:linear-gradient(135deg,#020610 0%,#040a1c 100%);
      border:1px solid rgba(255,200,50,0.15);
      border-radius:16px;
      padding:48px 32px 32px;
      max-width:480px;width:92vw;
      text-align:center;
    ">
      <p style="font-size:0.65rem;letter-spacing:0.2em;color:#c8a040;margin-bottom:16px;
        text-transform:uppercase;font-family:'Space Mono',monospace;">
        ✦ Your Star Card
      </p>
      <div id="star-card-preview-wrap" style="margin-bottom:20px;"></div>
      <h2 style="font-family:'Space Mono',monospace;font-size:1rem;letter-spacing:0.08em;
        margin-bottom:6px;color:#f8e080;">
        ${e.displayName}
      </h2>
      ${e.starName?`<p style="color:#9080a0;font-size:0.8rem;margin-bottom:4px;">"${e.starName}"</p>`:""}
      <p style="color:#3a5070;font-size:0.7rem;font-family:'Space Mono',monospace;margin-bottom:20px;">
        ID: ${e.id.slice(0,16)}…
      </p>
      <p style="color:#4a6888;font-size:0.75rem;margin-bottom:4px;">Share your star:</p>
      <div style="
        background:rgba(255,255,255,0.03);
        border:1px solid rgba(255,255,255,0.08);
        border-radius:6px;
        padding:8px 12px;
        font-family:'Space Mono',monospace;
        font-size:0.65rem;
        color:#4a6888;
        margin-bottom:20px;
        word-break:break-all;
      ">${o}</div>
      <div style="display:flex;flex-wrap:wrap;gap:10px;justify-content:center;margin-bottom:16px;">
        <button id="dl-card" type="button" style="${on()}">DOWNLOAD CARD (1080×1350)</button>
        <button id="dl-story" type="button" style="${on()}">DOWNLOAD STORY (1080×1920)</button>
        <button id="copy-link" type="button" style="${on("rgba(20,60,20,0.6)")}">COPY SHARE LINK</button>
      </div>
      <p id="copy-confirm" style="color:#60c070;font-size:0.75rem;min-height:18px;"></p>
    </div>
  `;const l=i.querySelector("#star-card-preview-wrap");l&&l.appendChild(s),i.querySelector("#dl-card")?.addEventListener("click",()=>{lo(a,`2fly-star-${e.id.slice(0,8)}-card.png`)}),i.querySelector("#dl-story")?.addEventListener("click",()=>{lo(n,`2fly-star-${e.id.slice(0,8)}-story.png`)}),i.querySelector("#copy-link")?.addEventListener("click",async()=>{try{await navigator.clipboard.writeText(o);const u=i.querySelector("#copy-confirm");u&&(u.textContent="Link copied!",setTimeout(()=>{u.textContent=""},2e3))}catch{const u=i.querySelector("#copy-confirm");u&&(u.textContent=o)}});const c=()=>{i.remove(),a.remove(),n.remove(),s.remove(),t()};Fr(i.firstElementChild,c);const h=cr(i,c),d=lr(i);return i.addEventListener("mousedown",u=>{u.target===i&&c()}),r.appendChild(i),()=>{h(),d(),c()}}function sn(r,e,t){Ii();const i=Pi("star-view-overlay","star-view-overlay");i.setAttribute("aria-label",`Star: ${e.displayName}`);const a=Pt[e.galaxyId],n=a?"#"+a.primaryColor.toString(16).padStart(6,"0"):"#4080c0",s=On(e.galaxyId);i.innerHTML=`
    <div style="
      position:relative;
      background:radial-gradient(ellipse at 50% 30%, rgba(${Sr(a?.primaryColor??2121888)},0.12) 0%, rgba(0,4,12,0.95) 70%);
      border:1px solid rgba(${Sr(a?.primaryColor??2121888)},0.2);
      border-radius:20px;
      padding:60px 40px 40px;
      max-width:500px;width:92vw;
      text-align:center;
    ">
      <div style="
        font-size:3rem;margin-bottom:20px;
        text-shadow:0 0 30px ${n};
        animation:star-pulse 3s ease-in-out infinite;
      " aria-hidden="true">✦</div>
      <p style="font-size:0.65rem;letter-spacing:0.2em;color:${n};margin-bottom:8px;
        text-transform:uppercase;font-family:'Space Mono',monospace;">
        Star — ${s}
      </p>
      <h2 style="font-family:'Space Mono',monospace;font-size:1.2rem;letter-spacing:0.08em;
        margin-bottom:6px;color:#f0f4ff;">
        ${e.displayName}
      </h2>
      ${e.starName?`<p style="color:#7080a0;font-size:0.85rem;margin-bottom:12px;">"${e.starName}"</p>`:""}
      ${e.message?`
        <blockquote style="
          color:#8090a8;font-size:0.85rem;font-style:italic;
          margin:0 0 20px;padding:12px 16px;
          border-left:2px solid rgba(${Sr(a?.primaryColor??2121888)},0.3);
          text-align:left;border-radius:0 8px 8px 0;
          background:rgba(255,255,255,0.02);
        ">
          "${e.message}"
        </blockquote>
      `:""}
      <div style="
        display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:20px 0;
        text-align:left;
      ">
        ${ma("GALAXY",s)}
        ${ma("ARRIVED",Bo(e.createdAt))}
        ${ma("STAR ID",e.id.slice(0,14)+"…")}
        ${ma("COORDINATES",`${e.x.toFixed(0)}, ${e.y.toFixed(0)}, ${e.z.toFixed(0)}`)}
      </div>
      <button id="star-place-cta" type="button" style="
        margin-top:8px;
        padding:12px 28px;
        background:rgba(${Sr(a?.primaryColor??2121888)},0.15);
        border:1px solid rgba(${Sr(a?.primaryColor??2121888)},0.35);
        border-radius:6px;
        color:#c0d0f0;
        font-family:'Space Grotesk',sans-serif;
        font-size:0.8rem;letter-spacing:0.12em;text-transform:uppercase;
        cursor:pointer;
        transition:background 0.2s;
      ">PLACE YOUR STAR →</button>
    </div>
  `;const o=()=>{i.style.animation="overlay-out 0.2s ease forwards",setTimeout(()=>{i.remove(),t()},200)};i.querySelector("#star-place-cta")?.addEventListener("click",()=>{o(),Xe.set("placementMode",!0),window.dispatchEvent(new CustomEvent("universe-start-placement"))}),Fr(i.firstElementChild,o);const l=cr(i,o),c=lr(i);return i.addEventListener("mousedown",h=>{h.target===i&&o()}),r.appendChild(i),()=>{l(),c(),o()}}async function Rf(r,e,t){const i=window.matchMedia("(prefers-reduced-motion: reduce)").matches,a=document.createElement("div");a.style.cssText=`
    position:fixed;inset:0;
    background:rgba(0,2,8,0.92);
    display:flex;flex-direction:column;
    align-items:center;justify-content:center;
    z-index:200;
    font-family:'Space Mono',monospace;
    text-align:center;gap:16px;
    transition:opacity 0.5s;
  `,a.innerHTML=`
    <p style="font-size:0.6rem;letter-spacing:0.3em;color:#2060a0;text-transform:uppercase;">
      DESTINATION RECEIVED
    </p>
    <div style="font-size:0.8rem;letter-spacing:0.1em;color:#4090c0;">
      INITIATING APPROACH SEQUENCE
    </div>
    <div style="
      font-size:2rem;color:#ffd700;
      animation:star-pulse 2s ease-in-out infinite;
    " aria-hidden="true">✦</div>
    <p style="font-size:0.7rem;color:#3a6080;max-width:300px;line-height:1.6;">
      Flying to ${e.displayName}'s star in the<br/>2Fly Universe…
    </p>
  `,r.appendChild(a);const n=i?400:2500;await new Promise(s=>setTimeout(s,n)),a.style.opacity="0",await new Promise(s=>setTimeout(s,500)),a.remove(),t()}function on(r="rgba(20,40,80,0.6)"){return["display:inline-block;","padding:10px 16px;",`background:${r};`,"border:1px solid rgba(80,140,220,0.25);","border-radius:6px;","color:#a0b8d8;","font-family:'Space Grotesk',sans-serif;","font-size:0.72rem;","letter-spacing:0.1em;","text-transform:uppercase;","cursor:pointer;","transition:background 0.2s;"].join("")}function ln(r,e,t,i){const a=r.getContext("2d");if(!a)return;r.width=t,r.height=i;const n=Pt[e.galaxyId],s=a.createRadialGradient(t*.5,i*.3,0,t*.5,i*.3,i*.7),o=n?"#"+n.primaryColor.toString(16).padStart(6,"0"):"#204080";s.addColorStop(0,`${o}22`),s.addColorStop(.6,"#020810"),s.addColorStop(1,"#010408"),a.fillStyle=s,a.fillRect(0,0,t,i),a.globalAlpha=.5;for(let f=0;f<300;f++){const g=Math.random()*t,_=Math.random()*i,m=Math.random()*1.2+.3;a.fillStyle="#ffffff",a.beginPath(),a.arc(g,_,m,0,Math.PI*2),a.fill()}a.globalAlpha=1;const l=t/1080,c=80*l;a.font=`${c}px serif`,a.textAlign="center",a.fillStyle="#ffd700",a.shadowColor="#ffd700",a.shadowBlur=40*l,a.fillText("✦",t*.5,i*.25),a.shadowBlur=0,a.font=`${11*l}px 'Arial', sans-serif`,a.fillStyle=o,a.letterSpacing=`${3*l}px`,a.fillText("2FLY UNIVERSE",t*.5,i*.32),a.font=`bold ${28*l}px 'Arial', sans-serif`,a.fillStyle="#f0f4ff",a.letterSpacing="0px",a.fillText(e.displayName.toUpperCase(),t*.5,i*.4),e.starName&&(a.font=`${16*l}px 'Arial', sans-serif`,a.fillStyle="#7080a0",a.fillText(`"${e.starName}"`,t*.5,i*.45)),e.message&&(a.font=`italic ${13*l}px 'Arial', sans-serif`,a.fillStyle="#5a7090",Cf(a,`"${e.message}"`,t*.5,i*.52,t*.75,18*l));const h=i*.72,d=20*l;a.font=`${10*l}px 'Courier New', monospace`,a.textAlign="center";const u=[`GALAXY: ${On(e.galaxyId).toUpperCase()}`,`ARRIVED: ${Bo(e.createdAt)}`,`ID: ${e.id.slice(0,20)}`,`COORDS: ${e.x.toFixed(0)}, ${e.y.toFixed(0)}, ${e.z.toFixed(0)}`];a.fillStyle="#2a4060",u.forEach((f,g)=>a.fillText(f,t*.5,h+g*d)),a.font=`${9*l}px 'Arial', sans-serif`,a.fillStyle="#1a3050",a.fillText("2FLYKEITHLOGAN.COM/UNIVERSE",t*.5,i*.94),a.strokeStyle=`${o}33`,a.lineWidth=2*l,a.strokeRect(20*l,20*l,t-40*l,i-40*l)}function Cf(r,e,t,i,a,n){const s=e.split(" ");let o="",l=i;for(const c of s){const h=o+c+" ";r.measureText(h).width>a&&o.length?(r.fillText(o,t,l),o=c+" ",l+=n):o=h}r.fillText(o,t,l)}function lo(r,e){const t=document.createElement("a");t.href=r.toDataURL("image/png"),t.download=e,t.click()}function ma(r,e){return`
    <div style="
      background:rgba(255,255,255,0.02);
      border:1px solid rgba(255,255,255,0.05);
      border-radius:6px;
      padding:10px 12px;
    ">
      <div style="font-size:0.6rem;letter-spacing:0.15em;color:#3a5070;
        text-transform:uppercase;font-family:'Space Mono',monospace;margin-bottom:4px;">${r}</div>
      <div style="font-size:0.78rem;color:#8090b0;word-break:break-all;">${e}</div>
    </div>
  `}function Bo(r){try{return new Date(r).toLocaleDateString("en-US",{year:"numeric",month:"short",day:"numeric"})}catch{return r}}function Sr(r){const e=r>>16&255,t=r>>8&255,i=r&255;return`${e},${t},${i}`}const ko=document.createElement("style");ko.textContent=`
  @keyframes star-pulse {
    0%,100% { text-shadow:0 0 10px currentColor,0 0 20px currentColor; }
    50% { text-shadow:0 0 20px currentColor,0 0 40px currentColor,0 0 60px currentColor; }
  }
`;document.head.appendChild(ko);function Pf(r,e,t){Ii();const i=Pi("star-placement-overlay","star-placement-overlay");i.setAttribute("aria-label","Place Your Star in the 2Fly Universe"),i.style.background="rgba(0,2,8,0.88)";let a="info",n="",s="",o="",l=!1;function c(){i.innerHTML=If(a,e,n,s,o,l),u(),lr(i)}function h(){return n.trim().length>0||s.trim().length>0||o.trim().length>0}function d(){if(a==="info"){const m=i.querySelector("#place-display-name"),p=i.querySelector("#place-star-name"),S=i.querySelector("#place-message");m&&(n=m.value.trim()),p&&(s=p.value.trim()),S&&(o=S.value.trim())}h()?(l=!0,c()):_(!1)}function u(){if(i.querySelector("#place-back-header")?.addEventListener("click",()=>f()),i.querySelector("#place-close")?.addEventListener("click",()=>d()),l){i.querySelector("#unsaved-keep")?.addEventListener("click",()=>{l=!1,c()}),i.querySelector("#unsaved-discard")?.addEventListener("click",()=>{_(!1)});return}a==="info"&&i.querySelector("#place-next")?.addEventListener("click",()=>{const m=(i.querySelector("#place-display-name")?.value??"").trim(),p=(i.querySelector("#place-star-name")?.value??"").trim(),S=(i.querySelector("#place-message")?.value??"").trim();if(!m){const E=i.querySelector("#place-error");E&&(E.textContent="Display name is required.");return}n=m,s=p,o=S,a="confirm",c()}),a==="confirm"&&(i.querySelector("#place-back")?.addEventListener("click",()=>f()),i.querySelector("#place-confirm")?.addEventListener("click",async()=>{const m=i.querySelector("#place-confirm");m&&(m.disabled=!0,m.textContent="PLACING…");const p={galaxyId:e.galaxyId,regionId:e.regionId,x:e.x,y:e.y,z:e.z,displayName:n,starName:s||void 0,message:o||void 0},S=await bi.placestar(p);if(S.success&&S.star)Xe.setMyStarForGalaxy(S.star.galaxyId,S.star.id),Xe.addStar(S.star),a="ignition",c(),setTimeout(()=>{S.star&&Af(r,S.star,()=>_(!0))},2200);else{const E={collision:"That location is too close to another star. Please choose a different spot.","already-placed-in-galaxy":"You have already placed a star in this era galaxy.","already-placed":"You have already placed a star in this era galaxy.","rate-limit":"Please wait a moment before placing again.","server-error":"An error occurred. Please try again."};a="info",c();const M=i.querySelector("#place-error");M&&(M.textContent=E[S.error??"server-error"]??"An error occurred.")}}))}function f(){if(l){l=!1,c();return}a==="confirm"?(a="info",c()):a==="info"&&d()}const g=m=>{m.key==="Escape"&&(m.stopPropagation(),f())};window.addEventListener("keydown",g);function _(m){window.removeEventListener("keydown",g),i.style.animation="overlay-out 0.2s ease forwards",setTimeout(()=>{i.remove(),t(m)},200)}return c(),r.appendChild(i),()=>{window.removeEventListener("keydown",g),_(!1)}}function If(r,e,t,i,a,n){const s=`${e.x.toFixed(0)}, ${e.y.toFixed(0)}, ${e.z.toFixed(0)}`;if(n)return`
      <div style="
        position:relative;
        background:linear-gradient(135deg,#0a0408 0%,#180812 100%);
        border:1px solid rgba(240,100,120,0.3);
        border-radius:16px;
        padding:40px 32px 32px;
        max-width:400px;width:90vw;
        text-align:center;
        box-shadow:0 12px 40px rgba(0,0,0,0.8);
      ">
        <div style="font-size:2rem;margin-bottom:12px;color:#f06080;" aria-hidden="true">⚠️</div>
        <h3 style="font-family:'Space Mono',monospace;font-size:1rem;letter-spacing:0.08em;
          margin-bottom:12px;color:#f8d0d8;">
          Discard this unfinished star?
        </h3>
        <p style="font-size:0.78rem;color:#a87888;margin-bottom:24px;line-height:1.5;">
          You have unsaved star information. Leaving now will discard your current entries.
        </p>
        <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;">
          <button id="unsaved-keep" type="button" style="${Er("#182838","#203850")}">
            KEEP EDITING
          </button>
          <button id="unsaved-discard" type="button" style="${Er("#801828","#a02038")} color:#ffd0d8;">
            DISCARD & RETURN
          </button>
        </div>
      </div>
    `;const o=`
    <div style="
      position:absolute;top:16px;left:16px;right:16px;
      display:flex;align-items:center;justify-content:space-between;
      pointer-events:auto;z-index:10;
    ">
      <button id="place-back-header" type="button" aria-label="Go Back"
        style="
          background:rgba(255,255,255,0.06);
          border:1px solid rgba(255,255,255,0.12);
          border-radius:4px;
          color:#8ab4d4;
          font-family:'Space Mono',monospace;
          font-size:0.65rem;
          letter-spacing:0.1em;
          padding:6px 12px;
          cursor:pointer;
          min-height:36px;
          display:flex;align-items:center;gap:4px;
        ">← BACK</button>

      <button id="place-close" type="button" aria-label="Cancel star placement"
        style="
          background:rgba(255,255,255,0.06);
          border:1px solid rgba(255,255,255,0.12);
          border-radius:4px;
          color:#8ab4d4;
          font-family:'Space Mono',monospace;
          font-size:0.65rem;
          letter-spacing:0.1em;
          padding:6px 12px;
          cursor:pointer;
          min-height:36px;
        ">CANCEL ×</button>
    </div>
  `;return r==="info"?`
    <div style="
      position:relative;
      background:linear-gradient(135deg,#020610 0%,#040c1e 100%);
      border:1px solid rgba(100,160,255,0.15);
      border-radius:16px;
      padding:60px 32px 32px;
      max-width:440px;width:90vw;
    ">
      ${o}
      <p style="font-size:0.65rem;letter-spacing:0.2em;color:#4070c0;margin-bottom:8px;
        text-transform:uppercase;font-family:'Space Mono',monospace;">
        PLACE YOUR STAR
      </p>
      <h2 style="font-family:'Space Mono',monospace;font-size:1rem;letter-spacing:0.08em;
        margin-bottom:6px;color:#c0d8f8;">
        Mark Your Place in the Universe
      </h2>
      <p style="font-size:0.75rem;color:#4a6888;margin-bottom:20px;line-height:1.6;">
        Coordinates: ${s}
      </p>
      <div id="place-error" role="alert" style="color:#f06060;font-size:0.78rem;
        margin-bottom:12px;min-height:18px;"></div>
      <label style="display:block;margin-bottom:16px;">
        <span style="font-size:0.7rem;letter-spacing:0.12em;color:#6090b8;text-transform:uppercase;
          display:block;margin-bottom:6px;">Display Name *</span>
        <input id="place-display-name" type="text" maxlength="60"
          placeholder="Your name or alias"
          value="${t}"
          style="${cn()}"
          autocomplete="name" required />
      </label>
      <label style="display:block;margin-bottom:16px;">
        <span style="font-size:0.7rem;letter-spacing:0.12em;color:#6090b8;text-transform:uppercase;
          display:block;margin-bottom:6px;">Star Name (optional)</span>
        <input id="place-star-name" type="text" maxlength="60"
          placeholder="Name your star"
          value="${i}"
          style="${cn()}" />
      </label>
      <label style="display:block;margin-bottom:24px;">
        <span style="font-size:0.7rem;letter-spacing:0.12em;color:#6090b8;text-transform:uppercase;
          display:block;margin-bottom:6px;">Message (optional)</span>
        <textarea id="place-message" maxlength="280" rows="3"
          placeholder="Leave a message for the Universe…"
          style="${cn()} resize:vertical;height:80px;"
        >${a}</textarea>
      </label>
      <button id="place-next" type="button" style="${Er("#1a60c0","#2080e0")} width:100%;">
        PREVIEW MY STAR →
      </button>
    </div>
  `:r==="confirm"?`
    <div style="
      position:relative;
      background:linear-gradient(135deg,#020610 0%,#040c1e 100%);
      border:1px solid rgba(100,200,255,0.2);
      border-radius:16px;
      padding:60px 32px 32px;
      max-width:440px;width:90vw;
      text-align:center;
    ">
      ${o}
      <div style="font-size:2.8rem;margin-bottom:12px;color:#ffd700;" aria-hidden="true">✦</div>
      <p style="font-size:0.65rem;letter-spacing:0.2em;color:#4070c0;margin-bottom:8px;
        text-transform:uppercase;font-family:'Space Mono',monospace;">Confirm Placement</p>
      <h2 style="font-family:'Space Mono',monospace;font-size:1.1rem;letter-spacing:0.08em;
        margin-bottom:16px;color:#c0d8f8;">
        ${t}
      </h2>
      ${i?`<p style="color:#7090b0;font-size:0.85rem;margin-bottom:8px;">Star: "${i}"</p>`:""}
      ${a?`<p style="color:#5a7898;font-size:0.8rem;font-style:italic;margin-bottom:8px;">"${a}"</p>`:""}
      <p style="color:#3a5878;font-size:0.75rem;font-family:'Space Mono',monospace;margin-bottom:20px;">
        Coordinates: ${s}
      </p>
      <p style="color:#4a6888;font-size:0.75rem;margin-bottom:24px;line-height:1.6;">
        Your star is permanent. Confirm to ignite your light in this era galaxy.
      </p>
      <div style="display:flex;gap:12px;justify-content:center;">
        <button id="place-back" type="button" style="${Er("#1a2030","#202840")}">← BACK</button>
        <button id="place-confirm" type="button" style="${Er("#104080","#1060b0")}">IGNITE MY STAR ✦</button>
      </div>
    </div>
  `:r==="ignition"?`
    <div style="
      display:flex;flex-direction:column;align-items:center;justify-content:center;
      gap:24px;padding:60px;text-align:center;
    ">
      <div style="
        width:80px;height:80px;
        border-radius:50%;
        background:radial-gradient(circle,#ffd700 0%,#ff8800 40%,transparent 70%);
        animation:star-ignite 2s ease-out forwards;
        box-shadow:0 0 60px #ffd700, 0 0 120px #ff8800;
      " aria-hidden="true"></div>
      <p style="font-family:'Space Mono',monospace;font-size:0.8rem;letter-spacing:0.2em;
        color:#ffd070;text-transform:uppercase;animation:fade-in-text 0.8s 0.5s both;">
        ${t} — Your star ignites
      </p>
    </div>
  `:""}function cn(){return`
    width:100%;
    background:rgba(255,255,255,0.04);
    border:1px solid rgba(80,120,200,0.2);
    border-radius:6px;
    color:#c8d8f0;
    font-family:'Space Grotesk',sans-serif;
    font-size:0.9rem;
    padding:10px 14px;
    outline:none;
    transition:border-color 0.2s;
    box-sizing:border-box;
  `}function Er(r,e){return`
    display:inline-block;
    padding:12px 20px;
    background:${r};
    border:1px solid rgba(80,140,220,0.3);
    border-radius:6px;
    color:#a0d0f0;
    font-family:'Space Grotesk',sans-serif;
    font-size:0.75rem;
    letter-spacing:0.12em;
    text-transform:uppercase;
    cursor:pointer;
    transition:background 0.2s;
    --hover-bg:${e};
  `}async function Lf(r){const e=document.getElementById("overlay-layer"),t=document.getElementById("ui-layer"),i=document.getElementById("css3d-layer"),a=document.getElementById("loading-status"),n=Np(r),s=new Mp;s.fog=new Rn(1032,15e-7);const o=new Hp(r),l=new Dp,c=new Ie;a&&(a.textContent="Loading Universe data…");const h=await lf();hf(h),a&&(a.textContent="Building 3D galaxies…"),await new Promise(Z=>setTimeout(Z,0));const d=new Vp;s.add(d.group);const u=[];for(const Z of xn()){const re=new qp(Z,i);s.add(re.group),u.push(re)}const H=[];for(const Z of ["G2000","G2005","G2010","G2015","G2020","G2030"]){const re=new QArchiveOrbit(Z);s.add(re.group),H.push(re)}a&&(a.textContent="Placing visitor star clusters…"),await new Promise(Z=>setTimeout(Z,0));const f=new Jp(i);s.add(f.group);const g=await bi.loadStars();Xe.set("stars",g),f.setStars(g,Xe.get("myStarId"));let _=null,m=null,p=null,S=null;const E=Oo(),M=E.find(Z=>Z.id==="OBJ-FIRE");M&&(m=new tf(M,i),s.add(m.group));const N=E.find(Z=>Z.id==="OBJ-AFRICA");N&&(p=new rf(N,i),s.add(p.group));const A=E.find(Z=>Z.id==="OBJ-STREAMS");A&&(_=new ef(A,i),s.add(_.group)),S=new af(E,i),s.add(S.group);const w=new xf(t,{onResetView:()=>{o.resetToHome(),w.setReturnAvailable(o.hasHistory())},onReturnPrevious:()=>{o.returnToPrevious(),w.setReturnAvailable(o.hasHistory())},onTakeTour:()=>{j()},onViewMyStar:async Z=>{const re=await bi.getStarById(Z);re&&o.travelToObject({x:re.x,y:re.y,z:re.z},600,{onDone:()=>{x((O,G)=>sn(O,re,G))}})}});new yf(t,{onTravelToGalaxy:Z=>{const[re,O,G]=Pr(Z);o.travelToObject({x:re,y:O,z:G},14e3),w.setReturnAvailable(o.hasHistory())},onTravelToRegion:(Z,re)=>{const[O,G,ne]=Fo(Z,re);o.travelToObject({x:O,y:G,z:ne},4500),w.setReturnAvailable(o.hasHistory())},onTravelToObject:Z=>{const re=E.find(O=>O.id===Z);if(re){const[O,G,ne]=pf(re);o.travelToObject({x:O,y:G,z:ne},1600),w.setReturnAvailable(o.hasHistory())}}});const P=new Lp(659224,1.1);s.add(P);const q=document.createElement("div");q.id="gray-world-selector";q.setAttribute("aria-hidden","true");q.style.cssText="position:fixed;left:50%;top:50%;width:34px;height:34px;border-radius:50%;border:1px solid rgba(165,175,185,.68);box-shadow:0 0 14px rgba(150,170,190,.16),inset 0 0 10px rgba(210,220,230,.05);transform:translate(-50%,-50%);pointer-events:none;z-index:35;opacity:0;transition:opacity .18s ease;";q.innerHTML='<span style="position:absolute;left:50%;top:50%;width:4px;height:4px;border-radius:50%;background:rgba(205,215,225,.75);transform:translate(-50%,-50%);"></span>';t.appendChild(q);let selectorPinned=!1;r.addEventListener("pointermove",Z=>{selectorPinned||(q.style.left=Z.clientX+"px",q.style.top=Z.clientY+"px",q.style.opacity=".82")}),r.addEventListener("pointerleave",()=>{selectorPinned||(q.style.opacity="0")});window.addEventListener("universe-galaxy-threshold",Z=>{const re=Z.detail;if(!re)return;const O=document.createElement("div"),G="#"+Number(re.accentColor).toString(16).padStart(6,"0");O.style.cssText=`position:fixed;inset:0;pointer-events:none;z-index:70;display:grid;place-items:center;background:radial-gradient(circle at center,${G}38 0%,${G}18 26%,transparent 68%);mix-blend-mode:screen;opacity:0;transition:opacity .22s ease,transform 1.1s ease;transform:scale(${re.state==="enter"?.96:1.05});`,O.innerHTML=`<div style="font-family:'Space Mono',monospace;letter-spacing:.22em;text-transform:uppercase;color:${G};text-shadow:0 0 18px ${G};font-size:.72rem;">${re.state==="enter"?"CROSSING GALAXY MIST":"RETURNING TO DEEP SPACE"}</div>`,t.appendChild(O),requestAnimationFrame(()=>{O.style.opacity="1",O.style.transform="scale(1)"}),setTimeout(()=>{O.style.opacity="0",O.style.transform=re.state==="enter"?"scale(1.06)":"scale(.96)",setTimeout(()=>O.remove(),700)},520)});let b=null;function x(Z){b&&(b(),b=null);const re=o.snapshot();Xe.pushCameraSnapshot(re),e.setAttribute("aria-hidden","false"),e.classList.add("overlay-active"),b=Z(e,()=>{e.setAttribute("aria-hidden","true"),e.classList.remove("overlay-active"),b=null;const O=Xe.popCameraSnapshot();O&&o.restoreSnapshot(O)})}r.addEventListener("click",Z=>{if(b||Xe.get("placementMode"))return;if(c.x=Z.clientX/window.innerWidth*2-1,c.y=-(Z.clientY/window.innerHeight)*2+1,l.setFromCamera(c,o.camera),m){const O=l.intersectObjects(m.clickTargets);if(O.length>0){const G=O[0].object,ne=G.userData.childId;if(ne){const te=m.getChildData(ne);if(te){const he=new R;G.getWorldPosition(he),Z.detail>=2?o.travelToObject(he,420):o.travelToObject(he,600,{onDone:()=>K(te)})}return}if(G.userData.objectId==="OBJ-FIRE"){o.travelToObject(m.getPlanetWorldPos(),Z.detail>=2?1000:1500);return}}}if(p){const O=l.intersectObjects(p.clickTargets);if(O.length>0){const G=O[0].object,ne=G.userData.childId;if(ne){const te=p.getChildData(ne);if(te){const he=new R;G.getWorldPosition(he),Z.detail>=2?o.travelToObject(he,420):o.travelToObject(he,600,{onDone:()=>K(te)})}return}if(G.userData.objectId==="OBJ-AFRICA"){o.travelToObject(p.getPlanetWorldPos(),Z.detail>=2?1000:1500);return}}}if(_){const O=l.intersectObjects(_.clickTargets);if(O.length>0){const G=O[0].object,ne=G.userData.childId;if(ne){const te=_.getChildData(ne);if(te){const he=new R;G.getWorldPosition(he),Z.detail>=2?o.travelToObject(he,420):o.travelToObject(he,600,{onDone:()=>K(te)})}return}if(G.userData.objectId==="OBJ-STREAMS"){o.travelToObject(_.getPlanetWorldPos(),Z.detail>=2?1000:1500);return}}}if(S){const O=l.intersectObjects(S.clickTargets);if(O.length>0){const G=O[0].object,ne=G.userData.childId,te=G.userData.objectId;if(ne){const he=S.getChildData(ne);if(he){const be=new R;G.getWorldPosition(be),Z.detail>=2?o.travelToObject(be,420):o.travelToObject(be,600,{onDone:()=>K(he)})}return}if(te){const he=new R;G.getWorldPosition(he),o.travelToObject(he,Z.detail>=2?920:1400);return}}}for(const O of H){const G=O.getHit(l);if(G){o.travelToObject(G.worldPos,Z.detail>=2?1100:1700,{onDone:()=>ee(G.title+" — ARCHIVE NOT YET CURATED")}),w.setReturnAvailable(!0);return}}const re=f.getClickTarget(l);if(re){const O=Xe.get("stars").find(G=>G.id===re.starId);if(O){x((G,ne)=>sn(G,O,ne));return}}const O=o.isNearZoomAnchor(Z.clientX,Z.clientY,48),G=o.setZoomAnchor(Z.clientX,Z.clientY);q.style.left=Z.clientX+"px",q.style.top=Z.clientY+"px",q.style.opacity=".96",selectorPinned=!0;if(Z.detail>=2){o.gentleZoomTowardPoint(Z.clientX,Z.clientY),w.setReturnAvailable(o.hasHistory());return}O&&(o.commitZoomAnchor(),w.setReturnAvailable(o.hasHistory()))});let C=null,F=null;function k(){F&&(F.remove(),F=null)}function X(){k(),Xe.set("placementMode",!1),w.setPlacementMode(!1),C&&o.restoreSnapshot(C,!0)}window.addEventListener("universe-start-placement",()=>{C=o.snapshot(),k(),F=document.createElement("div"),F.id="placement-mode-banner",F.style.cssText=`
      position:fixed;top:16px;left:50%;transform:translateX(-50%);
      background:rgba(2,10,24,0.92);border:1px solid rgba(96,255,208,0.4);
      border-radius:8px;padding:8px 16px;display:flex;align-items:center;gap:12px;
      z-index:60;font-family:'Space Mono',monospace;font-size:0.7rem;color:#60ffd0;
      box-shadow:0 8px 32px rgba(0,0,0,0.6);
    `,F.innerHTML=`
      <span>✦ PLACING STAR — CLICK ANYWHERE TO CHOOSE COORDINATE</span>
      <button id="cancel-placement-banner-btn" type="button" style="
        background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.2);
        border-radius:4px;color:#8ab4d4;padding:4px 10px;cursor:pointer;
        font-family:'Space Mono',monospace;font-size:0.65rem;
      ">← CANCEL</button>
    `,t.appendChild(F),F.querySelector("#cancel-placement-banner-btn")?.addEventListener("click",()=>{X()})}),window.addEventListener("keydown",Z=>{Z.key==="Escape"&&Xe.get("placementMode")&&X()}),r.addEventListener("click",Z=>{if(!Xe.get("placementMode"))return;k(),c.x=Z.clientX/window.innerWidth*2-1,c.y=-(Z.clientY/window.innerHeight)*2+1,l.setFromCamera(c,o.camera);const re=new ci(new R(0,1,0),0),O=new R;if(l.ray.intersectPlane(re,O),!O)return;let G="G2025",ne="G2025-R3",te=1/0;for(const he of Object.keys(Pt)){const[be,,Ce]=Pr(he),Ve=Math.sqrt((O.x-be)**2+(O.z-Ce)**2);Ve<te&&(te=Ve,G=he,ne=`${he}-R1`)}Xe.set("placementMode",!1),w.setPlacementMode(!1),x((he,be)=>Pf(he,{galaxyId:G,regionId:ne,x:O.x,y:O.y+50,z:O.z},Ce=>{if(Ce){const Ve=bi.getMyStarId();Ve&&bi.getStarById(Ve).then(Oe=>{Oe&&(f.addStar(Oe),o.travelToObject({x:Oe.x,y:Oe.y,z:Oe.z},600))})}else C&&o.restoreSnapshot(C,!0);be()}))});function K(Z){if(!Z)return;const re=Z.mediaKind;x(re==="audio"?(O,G)=>Mf(O,Z,G):re==="video"?(O,G)=>bf(O,Z,G):re==="playable"?(O,G)=>Sf(O,Z,G):(O,G)=>Ef(O,Z,G))}function j(){const Z=[{name:"Thru the Fire System",pos:m?.getPlanetWorldPos()??{x:-4500,y:40,z:-2500}},{name:"I Woke Up in Africa System",pos:p?.getPlanetWorldPos()??{x:0,y:40,z:4e3}},{name:"Streams System",pos:_?.getPlanetWorldPos()??{x:4e3,y:40,z:-2e3}}],re=Z[Math.floor(Math.random()*Z.length)];o.travelToObject(re.pos,1500,{onDone:()=>{ee(`DESTINATION ARRIVED — ${re.name}`)}}),w.setReturnAvailable(!0)}function ee(Z){const re=document.createElement("div");re.style.cssText=`
      position:absolute;top:70px;left:50%;transform:translateX(-50%);
      background:rgba(2,10,24,0.9);border:1px solid rgba(80,160,240,0.3);
      border-radius:6px;padding:8px 16px;font-family:'Space Mono',monospace;
      font-size:0.65rem;letter-spacing:0.15em;color:#8ab4d4;
      text-transform:uppercase;pointer-events:none;z-index:60;
      animation:fade-in-text 0.3s ease;
    `,re.textContent=Z,t.appendChild(re),setTimeout(()=>re.remove(),3e3)}let W=!1;function ae(){if(W)return;W=!0;const Z=document.createElement("div");if(Z.style.cssText=`
      position:fixed;inset:0;pointer-events:none;z-index:90;
      display:flex;flex-direction:column;align-items:center;justify-content:center;
      text-align:center;font-family:'Space Mono',monospace;
      animation:title-fade 3.5s ease forwards;
    `,Z.innerHTML=`
      <div style="font-size:0.7rem;letter-spacing:0.3em;color:#4090c0;margin-bottom:8px;text-transform:uppercase;">
        2FLY UNIVERSE
      </div>
      <div style="font-size:clamp(1.2rem,3vw,2rem);letter-spacing:0.2em;color:#60ffd0;font-weight:bold;margin-bottom:8px;">
        2025 — 2029
      </div>
      <div style="font-size:0.75rem;letter-spacing:0.2em;color:#4a7898;text-transform:uppercase;">
        THE CURRENT GALAXY
      </div>
    `,!document.getElementById("title-anim-style")){const re=document.createElement("style");re.id="title-anim-style",re.textContent=`
        @keyframes title-fade {
          0% { opacity:0; transform:scale(0.96); }
          20% { opacity:1; transform:scale(1); }
          75% { opacity:1; transform:scale(1); }
          100% { opacity:0; transform:scale(1.04); }
        }
      `,document.head.appendChild(re)}e.appendChild(Z),setTimeout(()=>Z.remove(),3600)}setTimeout(ae,1e3),nn.init(),nn.on(async Z=>{if(Z.type==="star"&&Z.starId){const re=await bi.getStarById(Z.starId);re&&await Rf(e,re,()=>{o.travelToObject({x:re.x,y:re.y,z:re.z},700,{onDone:()=>{x((O,G)=>sn(O,re,G))}})})}if(Z.type==="galaxy"&&Z.galaxyId){const[re,O,G]=Pr(Z.galaxyId);o.travelToObject({x:re,y:O,z:G},12e3),Xe.set("currentGalaxyId",Z.galaxyId)}Z.type==="universe"&&o.resetToHome()}),window.addEventListener("universe-esc",()=>{if(b){b();return}nn.back()});let pe=0;Op(Z=>{pe+=Z,o.update(Z);const re=o.camera.position;let O=null,G=1/0;for(const[ne,te]of Object.entries(Pt)){const[he,be,Ce]=te.worldOffset,Ve=Math.hypot(re.x-he,re.y-be,re.z-Ce);Ve<G&&(G=Ve,O=ne)}O!==Xe.get("currentGalaxyId")&&Xe.set("currentGalaxyId",O),re.distanceTo(new R(-4500,40,-2500))<4e3?ht.setRegionTheme("fire"):re.distanceTo(new R(0,40,4e3))<4e3?ht.setRegionTheme("africa"):re.distanceTo(new R(4e3,40,-2e3))<4500?ht.setRegionTheme("frontier"):ht.setRegionTheme(null),d.update(pe);for(const ne of H)ne.update(Z);for(const ne of u)ne.update(pe,re),ne.updateLabels(o.camera,n,re);m?.update(Z,o.camera,n),p?.update(Z,o.camera,n),_?.update(Z,o.camera,n),S?.update(Z,o.camera,n),f.update(re,o.camera,n),n.render(s,o.camera)}),Xe.set("loaded",!0);const Ae=document.getElementById("loading-screen");Ae&&(Ae.style.transition="opacity 0.8s",Ae.style.opacity="0",setTimeout(()=>Ae.remove(),800))}async function Df(){const r=document.getElementById("universe-canvas");if(!r)throw new Error("No canvas element found");try{await Lf(r)}catch(e){if(console.error("[2Fly Universe] Fatal init error:",e),document.getElementById("loading-screen")){const t=document.getElementById("loading-status");t&&(t.textContent="Universe failed to initialize. Please refresh.",t.style.color="#f06060")}}}Df();
