(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))i(r);new MutationObserver(r=>{for(const n of r)if(n.type==="childList")for(const s of n.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&i(s)}).observe(document,{childList:!0,subtree:!0});function t(r){const n={};return r.integrity&&(n.integrity=r.integrity),r.referrerPolicy&&(n.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?n.credentials="include":r.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function i(r){if(r.ep)return;r.ep=!0;const n=t(r);fetch(r.href,n)}})();(function(){const a=document.createElement("link").relList;if(a&&a.supports&&a.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))t(i);new MutationObserver(i=>{for(const r of i)if(r.type==="childList")for(const n of r.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&t(n)}).observe(document,{childList:!0,subtree:!0});function e(i){const r={};return i.integrity&&(r.integrity=i.integrity),i.referrerPolicy&&(r.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?r.credentials="include":i.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function t(i){if(i.ep)return;i.ep=!0;const r=e(i);fetch(i.href,r)}})();/**
* @license
* Copyright 2010-2024 Three.js Authors
* SPDX-License-Identifier: MIT
*/const Ki=2,ci=2,Ro=4,Ut="srgb",ea="srgb-linear",lr="linear",Ke="srgb",Un=35048,Dn="300 es";class ta{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[e]===void 0&&(i[e]=[]),i[e].indexOf(t)===-1&&i[e].push(t)}hasEventListener(e,t){if(this._listeners===void 0)return!1;const i=this._listeners;return i[e]!==void 0&&i[e].indexOf(t)!==-1}removeEventListener(e,t){if(this._listeners===void 0)return;const i=this._listeners[e];if(i!==void 0){const r=i.indexOf(t);r!==-1&&i.splice(r,1)}}dispatchEvent(e){if(this._listeners===void 0)return;const t=this._listeners[e.type];if(t!==void 0){e.target=this;const i=t.slice(0);for(let r=0,n=i.length;r<n;r++)i[r].call(this,e);e.target=null}}}const vt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let Nn=1234567;const Ea=Math.PI/180,Aa=180/Math.PI;function ia(){const a=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(vt[a&255]+vt[a>>8&255]+vt[a>>16&255]+vt[a>>24&255]+"-"+vt[e&255]+vt[e>>8&255]+"-"+vt[e>>16&15|64]+vt[e>>24&255]+"-"+vt[t&63|128]+vt[t>>8&255]+"-"+vt[t>>16&255]+vt[t>>24&255]+vt[i&255]+vt[i>>8&255]+vt[i>>16&255]+vt[i>>24&255]).toLowerCase()}function xt(a,e,t){return Math.max(e,Math.min(t,a))}function hn(a,e){return(a%e+e)%e}function Co(a,e,t,i,r){return i+(a-e)*(r-i)/(t-e)}function Po(a,e,t){return a!==e?(t-a)/(e-a):0}function wa(a,e,t){return(1-t)*a+t*e}function Qt(a,e,t,i){return wa(a,e,1-Math.exp(-t*i))}function Lo(a,e=1){return e-Math.abs(hn(a,e*2)-e)}function Io(a,e,t){return a<=e?0:a>=t?1:(a=(a-e)/(t-e),a*a*(3-2*a))}function Uo(a,e,t){return a<=e?0:a>=t?1:(a=(a-e)/(t-e),a*a*a*(a*(a*6-15)+10))}function Do(a,e){return a+Math.floor(Math.random()*(e-a+1))}function No(a,e){return a+Math.random()*(e-a)}function Oo(a){return a*(.5-Math.random())}function Fo(a){a!==void 0&&(Nn=a);let e=Nn+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function zo(a){return a*Ea}function Bo(a){return a*Aa}function ko(a){return(a&a-1)===0&&a!==0}function Go(a){return Math.pow(2,Math.ceil(Math.log(a)/Math.LN2))}function Vo(a){return Math.pow(2,Math.floor(Math.log(a)/Math.LN2))}function Ho(a,e,t,i,r){const n=Math.cos,s=Math.sin,o=n(t/2),l=s(t/2),c=n((e+i)/2),u=s((e+i)/2),d=n((e-i)/2),h=s((e-i)/2),f=n((i-e)/2),_=s((i-e)/2);switch(r){case"XYX":a.set(o*u,l*d,l*h,o*c);break;case"YZY":a.set(l*h,o*u,l*d,o*c);break;case"ZXZ":a.set(l*d,l*h,o*u,o*c);break;case"XZX":a.set(o*u,l*_,l*f,o*c);break;case"YXY":a.set(l*f,o*u,l*_,o*c);break;case"ZYZ":a.set(l*_,l*f,o*u,o*c);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+r)}}function ji(a,e){switch(e.constructor){case Float32Array:return a;case Uint32Array:return a/4294967295;case Uint16Array:return a/65535;case Uint8Array:return a/255;case Int32Array:return Math.max(a/2147483647,-1);case Int16Array:return Math.max(a/32767,-1);case Int8Array:return Math.max(a/127,-1);default:throw new Error("Invalid component type.")}}function St(a,e){switch(e.constructor){case Float32Array:return a;case Uint32Array:return Math.round(a*4294967295);case Uint16Array:return Math.round(a*65535);case Uint8Array:return Math.round(a*255);case Int32Array:return Math.round(a*2147483647);case Int16Array:return Math.round(a*32767);case Int8Array:return Math.round(a*127);default:throw new Error("Invalid component type.")}}const Je={DEG2RAD:Ea,RAD2DEG:Aa,generateUUID:ia,clamp:xt,euclideanModulo:hn,mapLinear:Co,inverseLerp:Po,lerp:wa,damp:Qt,pingpong:Lo,smoothstep:Io,smootherstep:Uo,randInt:Do,randFloat:No,randFloatSpread:Oo,seededRandom:Fo,degToRad:zo,radToDeg:Bo,isPowerOfTwo:ko,ceilPowerOfTwo:Go,floorPowerOfTwo:Vo,setQuaternionFromProperEuler:Ho,normalize:St,denormalize:ji};let Le=class $s{constructor(e=0,t=0){$s.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,i=this.y,r=e.elements;return this.x=r[0]*t+r[3]*i+r[6],this.y=r[1]*t+r[4]*i+r[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(e,Math.min(t,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(xt(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y;return t*t+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const i=Math.cos(t),r=Math.sin(t),n=this.x-e.x,s=this.y-e.y;return this.x=n*i-s*r+e.x,this.y=n*r+s*i+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}};class Ie{constructor(e,t,i,r,n,s,o,l,c){Ie.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,i,r,n,s,o,l,c)}set(e,t,i,r,n,s,o,l,c){const u=this.elements;return u[0]=e,u[1]=r,u[2]=o,u[3]=t,u[4]=n,u[5]=l,u[6]=i,u[7]=s,u[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],this}extractBasis(e,t,i){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,r=t.elements,n=this.elements,s=i[0],o=i[3],l=i[6],c=i[1],u=i[4],d=i[7],h=i[2],f=i[5],_=i[8],v=r[0],m=r[3],p=r[6],w=r[1],b=r[4],S=r[7],N=r[2],R=r[5],A=r[8];return n[0]=s*v+o*w+l*N,n[3]=s*m+o*b+l*R,n[6]=s*p+o*S+l*A,n[1]=c*v+u*w+d*N,n[4]=c*m+u*b+d*R,n[7]=c*p+u*S+d*A,n[2]=h*v+f*w+_*N,n[5]=h*m+f*b+_*R,n[8]=h*p+f*S+_*A,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[1],r=e[2],n=e[3],s=e[4],o=e[5],l=e[6],c=e[7],u=e[8];return t*s*u-t*o*c-i*n*u+i*o*l+r*n*c-r*s*l}invert(){const e=this.elements,t=e[0],i=e[1],r=e[2],n=e[3],s=e[4],o=e[5],l=e[6],c=e[7],u=e[8],d=u*s-o*c,h=o*l-u*n,f=c*n-s*l,_=t*d+i*h+r*f;if(_===0)return this.set(0,0,0,0,0,0,0,0,0);const v=1/_;return e[0]=d*v,e[1]=(r*c-u*i)*v,e[2]=(o*i-r*s)*v,e[3]=h*v,e[4]=(u*t-r*l)*v,e[5]=(r*n-o*t)*v,e[6]=f*v,e[7]=(i*l-c*t)*v,e[8]=(s*t-i*n)*v,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,i,r,n,s,o){const l=Math.cos(n),c=Math.sin(n);return this.set(i*l,i*c,-i*(l*s+c*o)+s+e,-r*c,r*l,-r*(-c*s+l*o)+o+t,0,0,1),this}scale(e,t){return this.premultiply(dr.makeScale(e,t)),this}rotate(e){return this.premultiply(dr.makeRotation(-e)),this}translate(e,t){return this.premultiply(dr.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,i,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,i=e.elements;for(let r=0;r<9;r++)if(t[r]!==i[r])return!1;return!0}fromArray(e,t=0){for(let i=0;i<9;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const dr=new Ie;function Ks(a){for(let e=a.length-1;e>=0;--e)if(a[e]>=65535)return!0;return!1}function Ra(a){return document.createElementNS("http://www.w3.org/1999/xhtml",a)}function Wo(){const a=Ra("canvas");return a.style.display="block",a}const On={};function Ma(a){a in On||(On[a]=!0,console.warn(a))}function Xo(a,e,t){return new Promise(function(i,r){function n(){switch(a.clientWaitSync(e,a.SYNC_FLUSH_COMMANDS_BIT,0)){case a.WAIT_FAILED:r();break;case a.TIMEOUT_EXPIRED:setTimeout(n,t);break;default:i()}}setTimeout(n,t)})}function jo(a){const e=a.elements;e[2]=.5*e[2]+.5*e[3],e[6]=.5*e[6]+.5*e[7],e[10]=.5*e[10]+.5*e[11],e[14]=.5*e[14]+.5*e[15]}function qo(a){const e=a.elements;e[11]===-1?(e[10]=-e[10]-1,e[14]=-e[14]):(e[10]=-e[10],e[14]=-e[14]+1)}const Ve={enabled:!0,workingColorSpace:ea,spaces:{},convert:function(a,e,t){return this.enabled===!1||e===t||!e||!t||(this.spaces[e].transfer===Ke&&(a.r=ei(a.r),a.g=ei(a.g),a.b=ei(a.b)),this.spaces[e].primaries!==this.spaces[t].primaries&&(a.applyMatrix3(this.spaces[e].toXYZ),a.applyMatrix3(this.spaces[t].fromXYZ)),this.spaces[t].transfer===Ke&&(a.r=$i(a.r),a.g=$i(a.g),a.b=$i(a.b))),a},fromWorkingColorSpace:function(a,e){return this.convert(a,this.workingColorSpace,e)},toWorkingColorSpace:function(a,e){return this.convert(a,e,this.workingColorSpace)},getPrimaries:function(a){return this.spaces[a].primaries},getTransfer:function(a){return a===""?lr:this.spaces[a].transfer},getLuminanceCoefficients:function(a,e=this.workingColorSpace){return a.fromArray(this.spaces[e].luminanceCoefficients)},define:function(a){Object.assign(this.spaces,a)},_getMatrix:function(a,e,t){return a.copy(this.spaces[e].toXYZ).multiply(this.spaces[t].fromXYZ)},_getDrawingBufferColorSpace:function(a){return this.spaces[a].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(a=this.workingColorSpace){return this.spaces[a].workingColorSpaceConfig.unpackColorSpace}};function ei(a){return a<.04045?a*.0773993808:Math.pow(a*.9478672986+.0521327014,2.4)}function $i(a){return a<.0031308?a*12.92:1.055*Math.pow(a,.41666)-.055}const Fn=[.64,.33,.3,.6,.15,.06],zn=[.2126,.7152,.0722],Bn=[.3127,.329],kn=new Ie().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Gn=new Ie().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);Ve.define({[ea]:{primaries:Fn,whitePoint:Bn,transfer:lr,toXYZ:kn,fromXYZ:Gn,luminanceCoefficients:zn,workingColorSpaceConfig:{unpackColorSpace:Ut},outputColorSpaceConfig:{drawingBufferColorSpace:Ut}},[Ut]:{primaries:Fn,whitePoint:Bn,transfer:Ke,toXYZ:kn,fromXYZ:Gn,luminanceCoefficients:zn,outputColorSpaceConfig:{drawingBufferColorSpace:Ut}}});let Li;class Yo{static getDataURL(e){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let t;if(e instanceof HTMLCanvasElement)t=e;else{Li===void 0&&(Li=Ra("canvas")),Li.width=e.width,Li.height=e.height;const i=Li.getContext("2d");e instanceof ImageData?i.putImageData(e,0,0):i.drawImage(e,0,0,e.width,e.height),t=Li}return t.width>2048||t.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",e),t.toDataURL("image/jpeg",.6)):t.toDataURL("image/png")}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=Ra("canvas");t.width=e.width,t.height=e.height;const i=t.getContext("2d");i.drawImage(e,0,0,e.width,e.height);const r=i.getImageData(0,0,e.width,e.height),n=r.data;for(let s=0;s<n.length;s++)n[s]=ei(n[s]/255)*255;return i.putImageData(r,0,0),t}else if(e.data){const t=e.data.slice(0);for(let i=0;i<t.length;i++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[i]=Math.floor(ei(t[i]/255)*255):t[i]=ei(t[i]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let $o=0;class Zs{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:$o++}),this.uuid=ia(),this.data=e,this.dataReady=!0,this.version=0}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const i={uuid:this.uuid,url:""},r=this.data;if(r!==null){let n;if(Array.isArray(r)){n=[];for(let s=0,o=r.length;s<o;s++)r[s].isDataTexture?n.push(pr(r[s].image)):n.push(pr(r[s]))}else n=pr(r);i.url=n}return t||(e.images[this.uuid]=i),i}}function pr(a){return typeof HTMLImageElement<"u"&&a instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&a instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&a instanceof ImageBitmap?Yo.getDataURL(a):a.data?{data:Array.from(a.data),width:a.width,height:a.height,type:a.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let Ko=0;class yt extends ta{constructor(e=yt.DEFAULT_IMAGE,t=yt.DEFAULT_MAPPING,i=1001,r=1001,n=1006,s=1008,o=1023,l=1009,c=yt.DEFAULT_ANISOTROPY,u=""){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Ko++}),this.uuid=ia(),this.name="",this.source=new Zs(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=i,this.wrapT=r,this.magFilter=n,this.minFilter=s,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new Le(0,0),this.repeat=new Le(1,1),this.center=new Le(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Ie,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const i={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),t||(e.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==300)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case 1e3:e.x=e.x-Math.floor(e.x);break;case 1001:e.x=e.x<0?0:1;break;case 1002:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case 1e3:e.y=e.y-Math.floor(e.y);break;case 1001:e.y=e.y<0?0:1;break;case 1002:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}yt.DEFAULT_IMAGE=null;yt.DEFAULT_MAPPING=300;yt.DEFAULT_ANISOTROPY=1;let Qe=class Js{constructor(e=0,t=0,i=0,r=1){Js.prototype.isVector4=!0,this.x=e,this.y=t,this.z=i,this.w=r}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,i,r){return this.x=e,this.y=t,this.z=i,this.w=r,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,i=this.y,r=this.z,n=this.w,s=e.elements;return this.x=s[0]*t+s[4]*i+s[8]*r+s[12]*n,this.y=s[1]*t+s[5]*i+s[9]*r+s[13]*n,this.z=s[2]*t+s[6]*i+s[10]*r+s[14]*n,this.w=s[3]*t+s[7]*i+s[11]*r+s[15]*n,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,i,r,n;const s=e.elements,o=s[0],l=s[4],c=s[8],u=s[1],d=s[5],h=s[9],f=s[2],_=s[6],v=s[10];if(Math.abs(l-u)<.01&&Math.abs(c-f)<.01&&Math.abs(h-_)<.01){if(Math.abs(l+u)<.1&&Math.abs(c+f)<.1&&Math.abs(h+_)<.1&&Math.abs(o+d+v-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const p=(o+1)/2,w=(d+1)/2,b=(v+1)/2,S=(l+u)/4,N=(c+f)/4,R=(h+_)/4;return p>w&&p>b?p<.01?(i=0,r=.707106781,n=.707106781):(i=Math.sqrt(p),r=S/i,n=N/i):w>b?w<.01?(i=.707106781,r=0,n=.707106781):(r=Math.sqrt(w),i=S/r,n=R/r):b<.01?(i=.707106781,r=.707106781,n=0):(n=Math.sqrt(b),i=N/n,r=R/n),this.set(i,r,n,t),this}let m=Math.sqrt((_-h)*(_-h)+(c-f)*(c-f)+(u-l)*(u-l));return Math.abs(m)<.001&&(m=1),this.x=(_-h)/m,this.y=(c-f)/m,this.z=(u-l)/m,this.w=Math.acos((o+d+v-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this.w=Math.max(e.w,Math.min(t.w,this.w)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this.w=Math.max(e,Math.min(t,this.w)),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(e,Math.min(t,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this.w=e.w+(t.w-e.w)*i,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}};class Zo extends ta{constructor(e=1,t=1,i={}){super(),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=1,this.scissor=new Qe(0,0,e,t),this.scissorTest=!1,this.viewport=new Qe(0,0,e,t);const r={width:e,height:t,depth:1};i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:1006,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},i);const n=new yt(r,i.mapping,i.wrapS,i.wrapT,i.magFilter,i.minFilter,i.format,i.type,i.anisotropy,i.colorSpace);n.flipY=!1,n.generateMipmaps=i.generateMipmaps,n.internalFormat=i.internalFormat,this.textures=[];const s=i.count;for(let o=0;o<s;o++)this.textures[o]=n.clone(),this.textures[o].isRenderTargetTexture=!0;this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this.depthTexture=i.depthTexture,this.samples=i.samples}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}setSize(e,t,i=1){if(this.width!==e||this.height!==t||this.depth!==i){this.width=e,this.height=t,this.depth=i;for(let r=0,n=this.textures.length;r<n;r++)this.textures[r].image.width=e,this.textures[r].image.height=t,this.textures[r].image.depth=i;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let i=0,r=e.textures.length;i<r;i++)this.textures[i]=e.textures[i].clone(),this.textures[i].isRenderTargetTexture=!0;const t=Object.assign({},e.texture.image);return this.texture.source=new Zs(t),this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class bi extends Zo{constructor(e=1,t=1,i={}){super(e,t,i),this.isWebGLRenderTarget=!0}}class Qs extends yt{constructor(e=null,t=1,i=1,r=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:i,depth:r},this.magFilter=1003,this.minFilter=1003,this.wrapR=1001,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class Jo extends yt{constructor(e=null,t=1,i=1,r=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:i,depth:r},this.magFilter=1003,this.minFilter=1003,this.wrapR=1001,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}let Ca=class{constructor(a=0,e=0,t=0,i=1){this.isQuaternion=!0,this._x=a,this._y=e,this._z=t,this._w=i}static slerpFlat(a,e,t,i,r,n,s){let o=t[i+0],l=t[i+1],c=t[i+2],u=t[i+3];const d=r[n+0],h=r[n+1],f=r[n+2],_=r[n+3];if(s===0){a[e+0]=o,a[e+1]=l,a[e+2]=c,a[e+3]=u;return}if(s===1){a[e+0]=d,a[e+1]=h,a[e+2]=f,a[e+3]=_;return}if(u!==_||o!==d||l!==h||c!==f){let v=1-s;const m=o*d+l*h+c*f+u*_,p=m>=0?1:-1,w=1-m*m;if(w>Number.EPSILON){const S=Math.sqrt(w),N=Math.atan2(S,m*p);v=Math.sin(v*N)/S,s=Math.sin(s*N)/S}const b=s*p;if(o=o*v+d*b,l=l*v+h*b,c=c*v+f*b,u=u*v+_*b,v===1-s){const S=1/Math.sqrt(o*o+l*l+c*c+u*u);o*=S,l*=S,c*=S,u*=S}}a[e]=o,a[e+1]=l,a[e+2]=c,a[e+3]=u}static multiplyQuaternionsFlat(a,e,t,i,r,n){const s=t[i],o=t[i+1],l=t[i+2],c=t[i+3],u=r[n],d=r[n+1],h=r[n+2],f=r[n+3];return a[e]=s*f+c*u+o*h-l*d,a[e+1]=o*f+c*d+l*u-s*h,a[e+2]=l*f+c*h+s*d-o*u,a[e+3]=c*f-s*u-o*d-l*h,a}get x(){return this._x}set x(a){this._x=a,this._onChangeCallback()}get y(){return this._y}set y(a){this._y=a,this._onChangeCallback()}get z(){return this._z}set z(a){this._z=a,this._onChangeCallback()}get w(){return this._w}set w(a){this._w=a,this._onChangeCallback()}set(a,e,t,i){return this._x=a,this._y=e,this._z=t,this._w=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(a){return this._x=a.x,this._y=a.y,this._z=a.z,this._w=a.w,this._onChangeCallback(),this}setFromEuler(a,e=!0){const t=a._x,i=a._y,r=a._z,n=a._order,s=Math.cos,o=Math.sin,l=s(t/2),c=s(i/2),u=s(r/2),d=o(t/2),h=o(i/2),f=o(r/2);switch(n){case"XYZ":this._x=d*c*u+l*h*f,this._y=l*h*u-d*c*f,this._z=l*c*f+d*h*u,this._w=l*c*u-d*h*f;break;case"YXZ":this._x=d*c*u+l*h*f,this._y=l*h*u-d*c*f,this._z=l*c*f-d*h*u,this._w=l*c*u+d*h*f;break;case"ZXY":this._x=d*c*u-l*h*f,this._y=l*h*u+d*c*f,this._z=l*c*f+d*h*u,this._w=l*c*u-d*h*f;break;case"ZYX":this._x=d*c*u-l*h*f,this._y=l*h*u+d*c*f,this._z=l*c*f-d*h*u,this._w=l*c*u+d*h*f;break;case"YZX":this._x=d*c*u+l*h*f,this._y=l*h*u+d*c*f,this._z=l*c*f-d*h*u,this._w=l*c*u-d*h*f;break;case"XZY":this._x=d*c*u-l*h*f,this._y=l*h*u-d*c*f,this._z=l*c*f+d*h*u,this._w=l*c*u+d*h*f;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+n)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(a,e){const t=e/2,i=Math.sin(t);return this._x=a.x*i,this._y=a.y*i,this._z=a.z*i,this._w=Math.cos(t),this._onChangeCallback(),this}setFromRotationMatrix(a){const e=a.elements,t=e[0],i=e[4],r=e[8],n=e[1],s=e[5],o=e[9],l=e[2],c=e[6],u=e[10],d=t+s+u;if(d>0){const h=.5/Math.sqrt(d+1);this._w=.25/h,this._x=(c-o)*h,this._y=(r-l)*h,this._z=(n-i)*h}else if(t>s&&t>u){const h=2*Math.sqrt(1+t-s-u);this._w=(c-o)/h,this._x=.25*h,this._y=(i+n)/h,this._z=(r+l)/h}else if(s>u){const h=2*Math.sqrt(1+s-t-u);this._w=(r-l)/h,this._x=(i+n)/h,this._y=.25*h,this._z=(o+c)/h}else{const h=2*Math.sqrt(1+u-t-s);this._w=(n-i)/h,this._x=(r+l)/h,this._y=(o+c)/h,this._z=.25*h}return this._onChangeCallback(),this}setFromUnitVectors(a,e){let t=a.dot(e)+1;return t<Number.EPSILON?(t=0,Math.abs(a.x)>Math.abs(a.z)?(this._x=-a.y,this._y=a.x,this._z=0,this._w=t):(this._x=0,this._y=-a.z,this._z=a.y,this._w=t)):(this._x=a.y*e.z-a.z*e.y,this._y=a.z*e.x-a.x*e.z,this._z=a.x*e.y-a.y*e.x,this._w=t),this.normalize()}angleTo(a){return 2*Math.acos(Math.abs(xt(this.dot(a),-1,1)))}rotateTowards(a,e){const t=this.angleTo(a);if(t===0)return this;const i=Math.min(1,e/t);return this.slerp(a,i),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(a){return this._x*a._x+this._y*a._y+this._z*a._z+this._w*a._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let a=this.length();return a===0?(this._x=0,this._y=0,this._z=0,this._w=1):(a=1/a,this._x=this._x*a,this._y=this._y*a,this._z=this._z*a,this._w=this._w*a),this._onChangeCallback(),this}multiply(a){return this.multiplyQuaternions(this,a)}premultiply(a){return this.multiplyQuaternions(a,this)}multiplyQuaternions(a,e){const t=a._x,i=a._y,r=a._z,n=a._w,s=e._x,o=e._y,l=e._z,c=e._w;return this._x=t*c+n*s+i*l-r*o,this._y=i*c+n*o+r*s-t*l,this._z=r*c+n*l+t*o-i*s,this._w=n*c-t*s-i*o-r*l,this._onChangeCallback(),this}slerp(a,e){if(e===0)return this;if(e===1)return this.copy(a);const t=this._x,i=this._y,r=this._z,n=this._w;let s=n*a._w+t*a._x+i*a._y+r*a._z;if(s<0?(this._w=-a._w,this._x=-a._x,this._y=-a._y,this._z=-a._z,s=-s):this.copy(a),s>=1)return this._w=n,this._x=t,this._y=i,this._z=r,this;const o=1-s*s;if(o<=Number.EPSILON){const h=1-e;return this._w=h*n+e*this._w,this._x=h*t+e*this._x,this._y=h*i+e*this._y,this._z=h*r+e*this._z,this.normalize(),this}const l=Math.sqrt(o),c=Math.atan2(l,s),u=Math.sin((1-e)*c)/l,d=Math.sin(e*c)/l;return this._w=n*u+this._w*d,this._x=t*u+this._x*d,this._y=i*u+this._y*d,this._z=r*u+this._z*d,this._onChangeCallback(),this}slerpQuaternions(a,e,t){return this.copy(a).slerp(e,t)}random(){const a=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),t=Math.random(),i=Math.sqrt(1-t),r=Math.sqrt(t);return this.set(i*Math.sin(a),i*Math.cos(a),r*Math.sin(e),r*Math.cos(e))}equals(a){return a._x===this._x&&a._y===this._y&&a._z===this._z&&a._w===this._w}fromArray(a,e=0){return this._x=a[e],this._y=a[e+1],this._z=a[e+2],this._w=a[e+3],this._onChangeCallback(),this}toArray(a=[],e=0){return a[e]=this._x,a[e+1]=this._y,a[e+2]=this._z,a[e+3]=this._w,a}fromBufferAttribute(a,e){return this._x=a.getX(e),this._y=a.getY(e),this._z=a.getZ(e),this._w=a.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(a){return this._onChangeCallback=a,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}};class T{constructor(e=0,t=0,i=0){T.prototype.isVector3=!0,this.x=e,this.y=t,this.z=i}set(e,t,i){return i===void 0&&(i=this.z),this.x=e,this.y=t,this.z=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Vn.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Vn.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,i=this.y,r=this.z,n=e.elements;return this.x=n[0]*t+n[3]*i+n[6]*r,this.y=n[1]*t+n[4]*i+n[7]*r,this.z=n[2]*t+n[5]*i+n[8]*r,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,i=this.y,r=this.z,n=e.elements,s=1/(n[3]*t+n[7]*i+n[11]*r+n[15]);return this.x=(n[0]*t+n[4]*i+n[8]*r+n[12])*s,this.y=(n[1]*t+n[5]*i+n[9]*r+n[13])*s,this.z=(n[2]*t+n[6]*i+n[10]*r+n[14])*s,this}applyQuaternion(e){const t=this.x,i=this.y,r=this.z,n=e.x,s=e.y,o=e.z,l=e.w,c=2*(s*r-o*i),u=2*(o*t-n*r),d=2*(n*i-s*t);return this.x=t+l*c+s*d-o*u,this.y=i+l*u+o*c-n*d,this.z=r+l*d+n*u-s*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,i=this.y,r=this.z,n=e.elements;return this.x=n[0]*t+n[4]*i+n[8]*r,this.y=n[1]*t+n[5]*i+n[9]*r,this.z=n[2]*t+n[6]*i+n[10]*r,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(e,Math.min(t,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const i=e.x,r=e.y,n=e.z,s=t.x,o=t.y,l=t.z;return this.x=r*l-n*o,this.y=n*s-i*l,this.z=i*o-r*s,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const i=e.dot(this)/t;return this.copy(e).multiplyScalar(i)}projectOnPlane(e){return fr.copy(this).projectOnVector(e),this.sub(fr)}reflect(e){return this.sub(fr.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(xt(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y,r=this.z-e.z;return t*t+i*i+r*r}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,i){const r=Math.sin(t)*e;return this.x=r*Math.sin(i),this.y=Math.cos(t)*e,this.z=r*Math.cos(i),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,i){return this.x=e*Math.sin(t),this.y=i,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),i=this.setFromMatrixColumn(e,1).length(),r=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=i,this.z=r,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,i=Math.sqrt(1-t*t);return this.x=i*Math.cos(e),this.y=t,this.z=i*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const fr=new T,Vn=new Ca;class Ti{constructor(e=new T(1/0,1/0,1/0),t=new T(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t+=3)this.expandByPoint(kt.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,i=e.count;t<i;t++)this.expandByPoint(kt.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const i=kt.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const i=e.geometry;if(i!==void 0){const n=i.getAttribute("position");if(t===!0&&n!==void 0&&e.isInstancedMesh!==!0)for(let s=0,o=n.count;s<o;s++)e.isMesh===!0?e.getVertexPosition(s,kt):kt.fromBufferAttribute(n,s),kt.applyMatrix4(e.matrixWorld),this.expandByPoint(kt);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Da.copy(e.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),Da.copy(i.boundingBox)),Da.applyMatrix4(e.matrixWorld),this.union(Da)}const r=e.children;for(let n=0,s=r.length;n<s;n++)this.expandByObject(r[n],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,kt),kt.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,i;return e.normal.x>0?(t=e.normal.x*this.min.x,i=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,i=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,i+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,i+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,i+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,i+=e.normal.z*this.min.z),t<=-e.constant&&i>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(ua),Na.subVectors(this.max,ua),Ii.subVectors(e.a,ua),Ui.subVectors(e.b,ua),Di.subVectors(e.c,ua),ii.subVectors(Ui,Ii),ai.subVectors(Di,Ui),fi.subVectors(Ii,Di);let t=[0,-ii.z,ii.y,0,-ai.z,ai.y,0,-fi.z,fi.y,ii.z,0,-ii.x,ai.z,0,-ai.x,fi.z,0,-fi.x,-ii.y,ii.x,0,-ai.y,ai.x,0,-fi.y,fi.x,0];return!mr(t,Ii,Ui,Di,Na)||(t=[1,0,0,0,1,0,0,0,1],!mr(t,Ii,Ui,Di,Na))?!1:(Oa.crossVectors(ii,ai),t=[Oa.x,Oa.y,Oa.z],mr(t,Ii,Ui,Di,Na))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,kt).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(kt).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Yt[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Yt[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Yt[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Yt[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Yt[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Yt[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Yt[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Yt[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Yt),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}}const Yt=[new T,new T,new T,new T,new T,new T,new T,new T],kt=new T,Da=new Ti,Ii=new T,Ui=new T,Di=new T,ii=new T,ai=new T,fi=new T,ua=new T,Na=new T,Oa=new T,mi=new T;function mr(a,e,t,i,r){for(let n=0,s=a.length-3;n<=s;n+=3){mi.fromArray(a,n);const o=r.x*Math.abs(mi.x)+r.y*Math.abs(mi.y)+r.z*Math.abs(mi.z),l=e.dot(mi),c=t.dot(mi),u=i.dot(mi);if(Math.max(-Math.max(l,c,u),Math.min(l,c,u))>o)return!1}return!0}const Qo=new Ti,da=new T,gr=new T;class aa{constructor(e=new T,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const i=this.center;t!==void 0?i.copy(t):Qo.setFromPoints(e).getCenter(i);let r=0;for(let n=0,s=e.length;n<s;n++)r=Math.max(r,i.distanceToSquared(e[n]));return this.radius=Math.sqrt(r),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const i=this.center.distanceToSquared(e);return t.copy(e),i>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;da.subVectors(e,this.center);const t=da.lengthSq();if(t>this.radius*this.radius){const i=Math.sqrt(t),r=(i-this.radius)*.5;this.center.addScaledVector(da,r/i),this.radius+=r}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(gr.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(da.copy(e.center).add(gr)),this.expandByPoint(da.copy(e.center).sub(gr))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}}const $t=new T,vr=new T,Fa=new T,ri=new T,_r=new T,za=new T,xr=new T;class un{constructor(e=new T,t=new T(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,$t)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const i=t.dot(this.direction);return i<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=$t.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):($t.copy(this.origin).addScaledVector(this.direction,t),$t.distanceToSquared(e))}distanceSqToSegment(e,t,i,r){vr.copy(e).add(t).multiplyScalar(.5),Fa.copy(t).sub(e).normalize(),ri.copy(this.origin).sub(vr);const n=e.distanceTo(t)*.5,s=-this.direction.dot(Fa),o=ri.dot(this.direction),l=-ri.dot(Fa),c=ri.lengthSq(),u=Math.abs(1-s*s);let d,h,f,_;if(u>0)if(d=s*l-o,h=s*o-l,_=n*u,d>=0)if(h>=-_)if(h<=_){const v=1/u;d*=v,h*=v,f=d*(d+s*h+2*o)+h*(s*d+h+2*l)+c}else h=n,d=Math.max(0,-(s*h+o)),f=-d*d+h*(h+2*l)+c;else h=-n,d=Math.max(0,-(s*h+o)),f=-d*d+h*(h+2*l)+c;else h<=-_?(d=Math.max(0,-(-s*n+o)),h=d>0?-n:Math.min(Math.max(-n,-l),n),f=-d*d+h*(h+2*l)+c):h<=_?(d=0,h=Math.min(Math.max(-n,-l),n),f=h*(h+2*l)+c):(d=Math.max(0,-(s*n+o)),h=d>0?n:Math.min(Math.max(-n,-l),n),f=-d*d+h*(h+2*l)+c);else h=s>0?-n:n,d=Math.max(0,-(s*h+o)),f=-d*d+h*(h+2*l)+c;return i&&i.copy(this.origin).addScaledVector(this.direction,d),r&&r.copy(vr).addScaledVector(Fa,h),f}intersectSphere(e,t){$t.subVectors(e.center,this.origin);const i=$t.dot(this.direction),r=$t.dot($t)-i*i,n=e.radius*e.radius;if(r>n)return null;const s=Math.sqrt(n-r),o=i-s,l=i+s;return l<0?null:o<0?this.at(l,t):this.at(o,t)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(e.normal)+e.constant)/t;return i>=0?i:null}intersectPlane(e,t){const i=this.distanceToPlane(e);return i===null?null:this.at(i,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let i,r,n,s,o,l;const c=1/this.direction.x,u=1/this.direction.y,d=1/this.direction.z,h=this.origin;return c>=0?(i=(e.min.x-h.x)*c,r=(e.max.x-h.x)*c):(i=(e.max.x-h.x)*c,r=(e.min.x-h.x)*c),u>=0?(n=(e.min.y-h.y)*u,s=(e.max.y-h.y)*u):(n=(e.max.y-h.y)*u,s=(e.min.y-h.y)*u),i>s||n>r||((n>i||isNaN(i))&&(i=n),(s<r||isNaN(r))&&(r=s),d>=0?(o=(e.min.z-h.z)*d,l=(e.max.z-h.z)*d):(o=(e.max.z-h.z)*d,l=(e.min.z-h.z)*d),i>l||o>r)||((o>i||i!==i)&&(i=o),(l<r||r!==r)&&(r=l),r<0)?null:this.at(i>=0?i:r,t)}intersectsBox(e){return this.intersectBox(e,$t)!==null}intersectTriangle(e,t,i,r,n){_r.subVectors(t,e),za.subVectors(i,e),xr.crossVectors(_r,za);let s=this.direction.dot(xr),o;if(s>0){if(r)return null;o=1}else if(s<0)o=-1,s=-s;else return null;ri.subVectors(this.origin,e);const l=o*this.direction.dot(za.crossVectors(ri,za));if(l<0)return null;const c=o*this.direction.dot(_r.cross(ri));if(c<0||l+c>s)return null;const u=-o*ri.dot(xr);return u<0?null:this.at(u/s,n)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}let et=class Zr{constructor(e,t,i,r,n,s,o,l,c,u,d,h,f,_,v,m){Zr.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,i,r,n,s,o,l,c,u,d,h,f,_,v,m)}set(e,t,i,r,n,s,o,l,c,u,d,h,f,_,v,m){const p=this.elements;return p[0]=e,p[4]=t,p[8]=i,p[12]=r,p[1]=n,p[5]=s,p[9]=o,p[13]=l,p[2]=c,p[6]=u,p[10]=d,p[14]=h,p[3]=f,p[7]=_,p[11]=v,p[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Zr().fromArray(this.elements)}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],t[9]=i[9],t[10]=i[10],t[11]=i[11],t[12]=i[12],t[13]=i[13],t[14]=i[14],t[15]=i[15],this}copyPosition(e){const t=this.elements,i=e.elements;return t[12]=i[12],t[13]=i[13],t[14]=i[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,i){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this}makeBasis(e,t,i){return this.set(e.x,t.x,i.x,0,e.y,t.y,i.y,0,e.z,t.z,i.z,0,0,0,0,1),this}extractRotation(e){const t=this.elements,i=e.elements,r=1/Ni.setFromMatrixColumn(e,0).length(),n=1/Ni.setFromMatrixColumn(e,1).length(),s=1/Ni.setFromMatrixColumn(e,2).length();return t[0]=i[0]*r,t[1]=i[1]*r,t[2]=i[2]*r,t[3]=0,t[4]=i[4]*n,t[5]=i[5]*n,t[6]=i[6]*n,t[7]=0,t[8]=i[8]*s,t[9]=i[9]*s,t[10]=i[10]*s,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,i=e.x,r=e.y,n=e.z,s=Math.cos(i),o=Math.sin(i),l=Math.cos(r),c=Math.sin(r),u=Math.cos(n),d=Math.sin(n);if(e.order==="XYZ"){const h=s*u,f=s*d,_=o*u,v=o*d;t[0]=l*u,t[4]=-l*d,t[8]=c,t[1]=f+_*c,t[5]=h-v*c,t[9]=-o*l,t[2]=v-h*c,t[6]=_+f*c,t[10]=s*l}else if(e.order==="YXZ"){const h=l*u,f=l*d,_=c*u,v=c*d;t[0]=h+v*o,t[4]=_*o-f,t[8]=s*c,t[1]=s*d,t[5]=s*u,t[9]=-o,t[2]=f*o-_,t[6]=v+h*o,t[10]=s*l}else if(e.order==="ZXY"){const h=l*u,f=l*d,_=c*u,v=c*d;t[0]=h-v*o,t[4]=-s*d,t[8]=_+f*o,t[1]=f+_*o,t[5]=s*u,t[9]=v-h*o,t[2]=-s*c,t[6]=o,t[10]=s*l}else if(e.order==="ZYX"){const h=s*u,f=s*d,_=o*u,v=o*d;t[0]=l*u,t[4]=_*c-f,t[8]=h*c+v,t[1]=l*d,t[5]=v*c+h,t[9]=f*c-_,t[2]=-c,t[6]=o*l,t[10]=s*l}else if(e.order==="YZX"){const h=s*l,f=s*c,_=o*l,v=o*c;t[0]=l*u,t[4]=v-h*d,t[8]=_*d+f,t[1]=d,t[5]=s*u,t[9]=-o*u,t[2]=-c*u,t[6]=f*d+_,t[10]=h-v*d}else if(e.order==="XZY"){const h=s*l,f=s*c,_=o*l,v=o*c;t[0]=l*u,t[4]=-d,t[8]=c*u,t[1]=h*d+v,t[5]=s*u,t[9]=f*d-_,t[2]=_*d-f,t[6]=o*u,t[10]=v*d+h}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(el,e,tl)}lookAt(e,t,i){const r=this.elements;return Lt.subVectors(e,t),Lt.lengthSq()===0&&(Lt.z=1),Lt.normalize(),ni.crossVectors(i,Lt),ni.lengthSq()===0&&(Math.abs(i.z)===1?Lt.x+=1e-4:Lt.z+=1e-4,Lt.normalize(),ni.crossVectors(i,Lt)),ni.normalize(),Ba.crossVectors(Lt,ni),r[0]=ni.x,r[4]=Ba.x,r[8]=Lt.x,r[1]=ni.y,r[5]=Ba.y,r[9]=Lt.y,r[2]=ni.z,r[6]=Ba.z,r[10]=Lt.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,r=t.elements,n=this.elements,s=i[0],o=i[4],l=i[8],c=i[12],u=i[1],d=i[5],h=i[9],f=i[13],_=i[2],v=i[6],m=i[10],p=i[14],w=i[3],b=i[7],S=i[11],N=i[15],R=r[0],A=r[4],P=r[8],E=r[12],y=r[1],C=r[5],z=r[9],B=r[13],j=r[2],J=r[6],$=r[10],ie=r[14],X=r[3],ee=r[7],de=r[11],we=r[15];return n[0]=s*R+o*y+l*j+c*X,n[4]=s*A+o*C+l*J+c*ee,n[8]=s*P+o*z+l*$+c*de,n[12]=s*E+o*B+l*ie+c*we,n[1]=u*R+d*y+h*j+f*X,n[5]=u*A+d*C+h*J+f*ee,n[9]=u*P+d*z+h*$+f*de,n[13]=u*E+d*B+h*ie+f*we,n[2]=_*R+v*y+m*j+p*X,n[6]=_*A+v*C+m*J+p*ee,n[10]=_*P+v*z+m*$+p*de,n[14]=_*E+v*B+m*ie+p*we,n[3]=w*R+b*y+S*j+N*X,n[7]=w*A+b*C+S*J+N*ee,n[11]=w*P+b*z+S*$+N*de,n[15]=w*E+b*B+S*ie+N*we,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[4],r=e[8],n=e[12],s=e[1],o=e[5],l=e[9],c=e[13],u=e[2],d=e[6],h=e[10],f=e[14],_=e[3],v=e[7],m=e[11],p=e[15];return _*(+n*l*d-r*c*d-n*o*h+i*c*h+r*o*f-i*l*f)+v*(+t*l*f-t*c*h+n*s*h-r*s*f+r*c*u-n*l*u)+m*(+t*c*d-t*o*f-n*s*d+i*s*f+n*o*u-i*c*u)+p*(-r*o*u-t*l*d+t*o*h+r*s*d-i*s*h+i*l*u)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,i){const r=this.elements;return e.isVector3?(r[12]=e.x,r[13]=e.y,r[14]=e.z):(r[12]=e,r[13]=t,r[14]=i),this}invert(){const e=this.elements,t=e[0],i=e[1],r=e[2],n=e[3],s=e[4],o=e[5],l=e[6],c=e[7],u=e[8],d=e[9],h=e[10],f=e[11],_=e[12],v=e[13],m=e[14],p=e[15],w=d*m*c-v*h*c+v*l*f-o*m*f-d*l*p+o*h*p,b=_*h*c-u*m*c-_*l*f+s*m*f+u*l*p-s*h*p,S=u*v*c-_*d*c+_*o*f-s*v*f-u*o*p+s*d*p,N=_*d*l-u*v*l-_*o*h+s*v*h+u*o*m-s*d*m,R=t*w+i*b+r*S+n*N;if(R===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const A=1/R;return e[0]=w*A,e[1]=(v*h*n-d*m*n-v*r*f+i*m*f+d*r*p-i*h*p)*A,e[2]=(o*m*n-v*l*n+v*r*c-i*m*c-o*r*p+i*l*p)*A,e[3]=(d*l*n-o*h*n-d*r*c+i*h*c+o*r*f-i*l*f)*A,e[4]=b*A,e[5]=(u*m*n-_*h*n+_*r*f-t*m*f-u*r*p+t*h*p)*A,e[6]=(_*l*n-s*m*n-_*r*c+t*m*c+s*r*p-t*l*p)*A,e[7]=(s*h*n-u*l*n+u*r*c-t*h*c-s*r*f+t*l*f)*A,e[8]=S*A,e[9]=(_*d*n-u*v*n-_*i*f+t*v*f+u*i*p-t*d*p)*A,e[10]=(s*v*n-_*o*n+_*i*c-t*v*c-s*i*p+t*o*p)*A,e[11]=(u*o*n-s*d*n-u*i*c+t*d*c+s*i*f-t*o*f)*A,e[12]=N*A,e[13]=(u*v*r-_*d*r+_*i*h-t*v*h-u*i*m+t*d*m)*A,e[14]=(_*o*r-s*v*r-_*i*l+t*v*l+s*i*m-t*o*m)*A,e[15]=(s*d*r-u*o*r+u*i*l-t*d*l-s*i*h+t*o*h)*A,this}scale(e){const t=this.elements,i=e.x,r=e.y,n=e.z;return t[0]*=i,t[4]*=r,t[8]*=n,t[1]*=i,t[5]*=r,t[9]*=n,t[2]*=i,t[6]*=r,t[10]*=n,t[3]*=i,t[7]*=r,t[11]*=n,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],i=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],r=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,i,r))}makeTranslation(e,t,i){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,i,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),i=Math.sin(e);return this.set(1,0,0,0,0,t,-i,0,0,i,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,0,i,0,0,1,0,0,-i,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,0,i,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const i=Math.cos(t),r=Math.sin(t),n=1-i,s=e.x,o=e.y,l=e.z,c=n*s,u=n*o;return this.set(c*s+i,c*o-r*l,c*l+r*o,0,c*o+r*l,u*o+i,u*l-r*s,0,c*l-r*o,u*l+r*s,n*l*l+i,0,0,0,0,1),this}makeScale(e,t,i){return this.set(e,0,0,0,0,t,0,0,0,0,i,0,0,0,0,1),this}makeShear(e,t,i,r,n,s){return this.set(1,i,n,0,e,1,s,0,t,r,1,0,0,0,0,1),this}compose(e,t,i){const r=this.elements,n=t._x,s=t._y,o=t._z,l=t._w,c=n+n,u=s+s,d=o+o,h=n*c,f=n*u,_=n*d,v=s*u,m=s*d,p=o*d,w=l*c,b=l*u,S=l*d,N=i.x,R=i.y,A=i.z;return r[0]=(1-(v+p))*N,r[1]=(f+S)*N,r[2]=(_-b)*N,r[3]=0,r[4]=(f-S)*R,r[5]=(1-(h+p))*R,r[6]=(m+w)*R,r[7]=0,r[8]=(_+b)*A,r[9]=(m-w)*A,r[10]=(1-(h+v))*A,r[11]=0,r[12]=e.x,r[13]=e.y,r[14]=e.z,r[15]=1,this}decompose(e,t,i){const r=this.elements;let n=Ni.set(r[0],r[1],r[2]).length();const s=Ni.set(r[4],r[5],r[6]).length(),o=Ni.set(r[8],r[9],r[10]).length();this.determinant()<0&&(n=-n),e.x=r[12],e.y=r[13],e.z=r[14],Gt.copy(this);const l=1/n,c=1/s,u=1/o;return Gt.elements[0]*=l,Gt.elements[1]*=l,Gt.elements[2]*=l,Gt.elements[4]*=c,Gt.elements[5]*=c,Gt.elements[6]*=c,Gt.elements[8]*=u,Gt.elements[9]*=u,Gt.elements[10]*=u,t.setFromRotationMatrix(Gt),i.x=n,i.y=s,i.z=o,this}makePerspective(e,t,i,r,n,s,o=2e3){const l=this.elements,c=2*n/(t-e),u=2*n/(i-r),d=(t+e)/(t-e),h=(i+r)/(i-r);let f,_;if(o===2e3)f=-(s+n)/(s-n),_=-2*s*n/(s-n);else if(o===2001)f=-s/(s-n),_=-s*n/(s-n);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return l[0]=c,l[4]=0,l[8]=d,l[12]=0,l[1]=0,l[5]=u,l[9]=h,l[13]=0,l[2]=0,l[6]=0,l[10]=f,l[14]=_,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(e,t,i,r,n,s,o=2e3){const l=this.elements,c=1/(t-e),u=1/(i-r),d=1/(s-n),h=(t+e)*c,f=(i+r)*u;let _,v;if(o===2e3)_=(s+n)*d,v=-2*d;else if(o===2001)_=n*d,v=-1*d;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return l[0]=2*c,l[4]=0,l[8]=0,l[12]=-h,l[1]=0,l[5]=2*u,l[9]=0,l[13]=-f,l[2]=0,l[6]=0,l[10]=v,l[14]=-_,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(e){const t=this.elements,i=e.elements;for(let r=0;r<16;r++)if(t[r]!==i[r])return!1;return!0}fromArray(e,t=0){for(let i=0;i<16;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e[t+9]=i[9],e[t+10]=i[10],e[t+11]=i[11],e[t+12]=i[12],e[t+13]=i[13],e[t+14]=i[14],e[t+15]=i[15],e}};const Ni=new T,Gt=new et,el=new T(0,0,0),tl=new T(1,1,1),ni=new T,Ba=new T,Lt=new T,Hn=new et,Wn=new Ca;let hi=class eo{constructor(e=0,t=0,i=0,r=eo.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=i,this._order=r}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,i,r=this._order){return this._x=e,this._y=t,this._z=i,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,i=!0){const r=e.elements,n=r[0],s=r[4],o=r[8],l=r[1],c=r[5],u=r[9],d=r[2],h=r[6],f=r[10];switch(t){case"XYZ":this._y=Math.asin(xt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-u,f),this._z=Math.atan2(-s,n)):(this._x=Math.atan2(h,c),this._z=0);break;case"YXZ":this._x=Math.asin(-xt(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(o,f),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-d,n),this._z=0);break;case"ZXY":this._x=Math.asin(xt(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(-d,f),this._z=Math.atan2(-s,c)):(this._y=0,this._z=Math.atan2(l,n));break;case"ZYX":this._y=Math.asin(-xt(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(h,f),this._z=Math.atan2(l,n)):(this._x=0,this._z=Math.atan2(-s,c));break;case"YZX":this._z=Math.asin(xt(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-u,c),this._y=Math.atan2(-d,n)):(this._x=0,this._y=Math.atan2(o,f));break;case"XZY":this._z=Math.asin(-xt(s,-1,1)),Math.abs(s)<.9999999?(this._x=Math.atan2(h,c),this._y=Math.atan2(o,n)):(this._x=Math.atan2(-u,f),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,i===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,i){return Hn.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Hn,t,i)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Wn.setFromEuler(this),this.setFromQuaternion(Wn,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};hi.DEFAULT_ORDER="XYZ";class dn{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let il=0;const Xn=new T,Oi=new Ca,Kt=new et,ka=new T,pa=new T,al=new T,rl=new Ca,jn=new T(1,0,0),qn=new T(0,1,0),Yn=new T(0,0,1),$n={type:"added"},nl={type:"removed"},Fi={type:"childadded",child:null},yr={type:"childremoved",child:null};class Mt extends ta{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:il++}),this.uuid=ia(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Mt.DEFAULT_UP.clone();const e=new T,t=new hi,i=new Ca,r=new T(1,1,1);function n(){i.setFromEuler(t,!1)}function s(){t.setFromQuaternion(i,void 0,!1)}t._onChange(n),i._onChange(s),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:r},modelViewMatrix:{value:new et},normalMatrix:{value:new Ie}}),this.matrix=new et,this.matrixWorld=new et,this.matrixAutoUpdate=Mt.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Mt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new dn,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Oi.setFromAxisAngle(e,t),this.quaternion.multiply(Oi),this}rotateOnWorldAxis(e,t){return Oi.setFromAxisAngle(e,t),this.quaternion.premultiply(Oi),this}rotateX(e){return this.rotateOnAxis(jn,e)}rotateY(e){return this.rotateOnAxis(qn,e)}rotateZ(e){return this.rotateOnAxis(Yn,e)}translateOnAxis(e,t){return Xn.copy(e).applyQuaternion(this.quaternion),this.position.add(Xn.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(jn,e)}translateY(e){return this.translateOnAxis(qn,e)}translateZ(e){return this.translateOnAxis(Yn,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Kt.copy(this.matrixWorld).invert())}lookAt(e,t,i){e.isVector3?ka.copy(e):ka.set(e,t,i);const r=this.parent;this.updateWorldMatrix(!0,!1),pa.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Kt.lookAt(pa,ka,this.up):Kt.lookAt(ka,pa,this.up),this.quaternion.setFromRotationMatrix(Kt),r&&(Kt.extractRotation(r.matrixWorld),Oi.setFromRotationMatrix(Kt),this.quaternion.premultiply(Oi.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent($n),Fi.child=e,this.dispatchEvent(Fi),Fi.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(nl),yr.child=e,this.dispatchEvent(yr),yr.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Kt.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Kt.multiply(e.parent.matrixWorld)),e.applyMatrix4(Kt),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent($n),Fi.child=e,this.dispatchEvent(Fi),Fi.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let i=0,r=this.children.length;i<r;i++){const n=this.children[i].getObjectByProperty(e,t);if(n!==void 0)return n}}getObjectsByProperty(e,t,i=[]){this[e]===t&&i.push(this);const r=this.children;for(let n=0,s=r.length;n<s;n++)r[n].getObjectsByProperty(e,t,i);return i}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(pa,e,al),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(pa,rl,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let i=0,r=t.length;i<r;i++)t[i].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let i=0,r=t.length;i<r;i++)t[i].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let i=0,r=t.length;i<r;i++)t[i].updateMatrixWorld(e)}updateWorldMatrix(e,t){const i=this.parent;if(e===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){const r=this.children;for(let n=0,s=r.length;n<s;n++)r[n].updateWorldMatrix(!1,!0)}}toJSON(e){const t=e===void 0||typeof e=="string",i={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const r={};r.uuid=this.uuid,r.type=this.type,this.name!==""&&(r.name=this.name),this.castShadow===!0&&(r.castShadow=!0),this.receiveShadow===!0&&(r.receiveShadow=!0),this.visible===!1&&(r.visible=!1),this.frustumCulled===!1&&(r.frustumCulled=!1),this.renderOrder!==0&&(r.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(r.matrixAutoUpdate=!1),this.isInstancedMesh&&(r.type="InstancedMesh",r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type="BatchedMesh",r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.visibility=this._visibility,r.active=this._active,r.bounds=this._bounds.map(o=>({boxInitialized:o.boxInitialized,boxMin:o.box.min.toArray(),boxMax:o.box.max.toArray(),sphereInitialized:o.sphereInitialized,sphereRadius:o.sphere.radius,sphereCenter:o.sphere.center.toArray()})),r.maxInstanceCount=this._maxInstanceCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.geometryCount=this._geometryCount,r.matricesTexture=this._matricesTexture.toJSON(e),this._colorsTexture!==null&&(r.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(r.boundingSphere={center:r.boundingSphere.center.toArray(),radius:r.boundingSphere.radius}),this.boundingBox!==null&&(r.boundingBox={min:r.boundingBox.min.toArray(),max:r.boundingBox.max.toArray()}));function n(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=n(e.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const l=o.shapes;if(Array.isArray(l))for(let c=0,u=l.length;c<u;c++){const d=l[c];n(e.shapes,d)}else n(e.shapes,l)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(n(e.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(n(e.materials,this.material[l]));r.material=o}else r.material=n(e.materials,this.material);if(this.children.length>0){r.children=[];for(let o=0;o<this.children.length;o++)r.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){r.animations=[];for(let o=0;o<this.animations.length;o++){const l=this.animations[o];r.animations.push(n(e.animations,l))}}if(t){const o=s(e.geometries),l=s(e.materials),c=s(e.textures),u=s(e.images),d=s(e.shapes),h=s(e.skeletons),f=s(e.animations),_=s(e.nodes);o.length>0&&(i.geometries=o),l.length>0&&(i.materials=l),c.length>0&&(i.textures=c),u.length>0&&(i.images=u),d.length>0&&(i.shapes=d),h.length>0&&(i.skeletons=h),f.length>0&&(i.animations=f),_.length>0&&(i.nodes=_)}return i.object=r,i;function s(o){const l=[];for(const c in o){const u=o[c];delete u.metadata,l.push(u)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let i=0;i<e.children.length;i++){const r=e.children[i];this.add(r.clone())}return this}}Mt.DEFAULT_UP=new T(0,1,0);Mt.DEFAULT_MATRIX_AUTO_UPDATE=!0;Mt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const Vt=new T,Zt=new T,Mr=new T,Jt=new T,zi=new T,Bi=new T,Kn=new T,Sr=new T,br=new T,Er=new T,wr=new Qe,Tr=new Qe,Ar=new Qe;let fa=class qi{constructor(e=new T,t=new T,i=new T){this.a=e,this.b=t,this.c=i}static getNormal(e,t,i,r){r.subVectors(i,t),Vt.subVectors(e,t),r.cross(Vt);const n=r.lengthSq();return n>0?r.multiplyScalar(1/Math.sqrt(n)):r.set(0,0,0)}static getBarycoord(e,t,i,r,n){Vt.subVectors(r,t),Zt.subVectors(i,t),Mr.subVectors(e,t);const s=Vt.dot(Vt),o=Vt.dot(Zt),l=Vt.dot(Mr),c=Zt.dot(Zt),u=Zt.dot(Mr),d=s*c-o*o;if(d===0)return n.set(0,0,0),null;const h=1/d,f=(c*l-o*u)*h,_=(s*u-o*l)*h;return n.set(1-f-_,_,f)}static containsPoint(e,t,i,r){return this.getBarycoord(e,t,i,r,Jt)===null?!1:Jt.x>=0&&Jt.y>=0&&Jt.x+Jt.y<=1}static getInterpolation(e,t,i,r,n,s,o,l){return this.getBarycoord(e,t,i,r,Jt)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(n,Jt.x),l.addScaledVector(s,Jt.y),l.addScaledVector(o,Jt.z),l)}static getInterpolatedAttribute(e,t,i,r,n,s){return wr.setScalar(0),Tr.setScalar(0),Ar.setScalar(0),wr.fromBufferAttribute(e,t),Tr.fromBufferAttribute(e,i),Ar.fromBufferAttribute(e,r),s.setScalar(0),s.addScaledVector(wr,n.x),s.addScaledVector(Tr,n.y),s.addScaledVector(Ar,n.z),s}static isFrontFacing(e,t,i,r){return Vt.subVectors(i,t),Zt.subVectors(e,t),Vt.cross(Zt).dot(r)<0}set(e,t,i){return this.a.copy(e),this.b.copy(t),this.c.copy(i),this}setFromPointsAndIndices(e,t,i,r){return this.a.copy(e[t]),this.b.copy(e[i]),this.c.copy(e[r]),this}setFromAttributeAndIndices(e,t,i,r){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,i),this.c.fromBufferAttribute(e,r),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Vt.subVectors(this.c,this.b),Zt.subVectors(this.a,this.b),Vt.cross(Zt).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return qi.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return qi.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,i,r,n){return qi.getInterpolation(e,this.a,this.b,this.c,t,i,r,n)}containsPoint(e){return qi.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return qi.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const i=this.a,r=this.b,n=this.c;let s,o;zi.subVectors(r,i),Bi.subVectors(n,i),Sr.subVectors(e,i);const l=zi.dot(Sr),c=Bi.dot(Sr);if(l<=0&&c<=0)return t.copy(i);br.subVectors(e,r);const u=zi.dot(br),d=Bi.dot(br);if(u>=0&&d<=u)return t.copy(r);const h=l*d-u*c;if(h<=0&&l>=0&&u<=0)return s=l/(l-u),t.copy(i).addScaledVector(zi,s);Er.subVectors(e,n);const f=zi.dot(Er),_=Bi.dot(Er);if(_>=0&&f<=_)return t.copy(n);const v=f*c-l*_;if(v<=0&&c>=0&&_<=0)return o=c/(c-_),t.copy(i).addScaledVector(Bi,o);const m=u*_-f*d;if(m<=0&&d-u>=0&&f-_>=0)return Kn.subVectors(n,r),o=(d-u)/(d-u+(f-_)),t.copy(r).addScaledVector(Kn,o);const p=1/(m+v+h);return s=v*p,o=h*p,t.copy(i).addScaledVector(zi,s).addScaledVector(Bi,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}};const to={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},si={h:0,s:0,l:0},Ga={h:0,s:0,l:0};function Rr(a,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?a+(e-a)*6*t:t<1/2?e:t<2/3?a+(e-a)*6*(2/3-t):a}class Se{constructor(e,t,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,i)}set(e,t,i){if(t===void 0&&i===void 0){const r=e;r&&r.isColor?this.copy(r):typeof r=="number"?this.setHex(r):typeof r=="string"&&this.setStyle(r)}else this.setRGB(e,t,i);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Ut){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Ve.toWorkingColorSpace(this,t),this}setRGB(e,t,i,r=Ve.workingColorSpace){return this.r=e,this.g=t,this.b=i,Ve.toWorkingColorSpace(this,r),this}setHSL(e,t,i,r=Ve.workingColorSpace){if(e=hn(e,1),t=xt(t,0,1),i=xt(i,0,1),t===0)this.r=this.g=this.b=i;else{const n=i<=.5?i*(1+t):i+t-i*t,s=2*i-n;this.r=Rr(s,n,e+1/3),this.g=Rr(s,n,e),this.b=Rr(s,n,e-1/3)}return Ve.toWorkingColorSpace(this,r),this}setStyle(e,t=Ut){function i(n){n!==void 0&&parseFloat(n)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(e)){let n;const s=r[1],o=r[2];switch(s){case"rgb":case"rgba":if(n=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(n[4]),this.setRGB(Math.min(255,parseInt(n[1],10))/255,Math.min(255,parseInt(n[2],10))/255,Math.min(255,parseInt(n[3],10))/255,t);if(n=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(n[4]),this.setRGB(Math.min(100,parseInt(n[1],10))/100,Math.min(100,parseInt(n[2],10))/100,Math.min(100,parseInt(n[3],10))/100,t);break;case"hsl":case"hsla":if(n=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(n[4]),this.setHSL(parseFloat(n[1])/360,parseFloat(n[2])/100,parseFloat(n[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(e)){const n=r[1],s=n.length;if(s===3)return this.setRGB(parseInt(n.charAt(0),16)/15,parseInt(n.charAt(1),16)/15,parseInt(n.charAt(2),16)/15,t);if(s===6)return this.setHex(parseInt(n,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Ut){const i=to[e.toLowerCase()];return i!==void 0?this.setHex(i,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=ei(e.r),this.g=ei(e.g),this.b=ei(e.b),this}copyLinearToSRGB(e){return this.r=$i(e.r),this.g=$i(e.g),this.b=$i(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Ut){return Ve.fromWorkingColorSpace(_t.copy(this),e),Math.round(xt(_t.r*255,0,255))*65536+Math.round(xt(_t.g*255,0,255))*256+Math.round(xt(_t.b*255,0,255))}getHexString(e=Ut){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=Ve.workingColorSpace){Ve.fromWorkingColorSpace(_t.copy(this),t);const i=_t.r,r=_t.g,n=_t.b,s=Math.max(i,r,n),o=Math.min(i,r,n);let l,c;const u=(o+s)/2;if(o===s)l=0,c=0;else{const d=s-o;switch(c=u<=.5?d/(s+o):d/(2-s-o),s){case i:l=(r-n)/d+(r<n?6:0);break;case r:l=(n-i)/d+2;break;case n:l=(i-r)/d+4;break}l/=6}return e.h=l,e.s=c,e.l=u,e}getRGB(e,t=Ve.workingColorSpace){return Ve.fromWorkingColorSpace(_t.copy(this),t),e.r=_t.r,e.g=_t.g,e.b=_t.b,e}getStyle(e=Ut){Ve.fromWorkingColorSpace(_t.copy(this),e);const t=_t.r,i=_t.g,r=_t.b;return e!==Ut?`color(${e} ${t.toFixed(3)} ${i.toFixed(3)} ${r.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(i*255)},${Math.round(r*255)})`}offsetHSL(e,t,i){return this.getHSL(si),this.setHSL(si.h+e,si.s+t,si.l+i)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,i){return this.r=e.r+(t.r-e.r)*i,this.g=e.g+(t.g-e.g)*i,this.b=e.b+(t.b-e.b)*i,this}lerpHSL(e,t){this.getHSL(si),e.getHSL(Ga);const i=wa(si.h,Ga.h,t),r=wa(si.s,Ga.s,t),n=wa(si.l,Ga.l,t);return this.setHSL(i,r,n),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,i=this.g,r=this.b,n=e.elements;return this.r=n[0]*t+n[3]*i+n[6]*r,this.g=n[1]*t+n[4]*i+n[7]*r,this.b=n[2]*t+n[5]*i+n[8]*r,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const _t=new Se;Se.NAMES=to;let sl=0;class ra extends ta{static get type(){return"Material"}get type(){return this.constructor.type}set type(e){}constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:sl++}),this.uuid=ia(),this.name="",this.blending=1,this.side=0,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=204,this.blendDst=205,this.blendEquation=100,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Se(0,0,0),this.blendAlpha=0,this.depthFunc=3,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=519,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=7680,this.stencilZFail=7680,this.stencilZPass=7680,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const i=e[t];if(i===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}const r=this[t];if(r===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}r&&r.isColor?r.set(i):r&&r.isVector3&&i&&i.isVector3?r.copy(i):this[t]=i}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const i={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(e).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(e).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(e).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(e).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(e).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==1&&(i.blending=this.blending),this.side!==0&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==204&&(i.blendSrc=this.blendSrc),this.blendDst!==205&&(i.blendDst=this.blendDst),this.blendEquation!==100&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==3&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==519&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==7680&&(i.stencilFail=this.stencilFail),this.stencilZFail!==7680&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==7680&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function r(n){const s=[];for(const o in n){const l=n[o];delete l.metadata,s.push(l)}return s}if(t){const n=r(e.textures),s=r(e.images);n.length>0&&(i.textures=n),s.length>0&&(i.images=s)}return i}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let i=null;if(t!==null){const r=t.length;i=new Array(r);for(let n=0;n!==r;++n)i[n]=t[n].clone()}return this.clippingPlanes=i,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}}class Rt extends ra{static get type(){return"MeshBasicMaterial"}constructor(e){super(),this.isMeshBasicMaterial=!0,this.color=new Se(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new hi,this.combine=0,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const ht=new T,Va=new Le;class st{constructor(e,t,i=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=i,this.usage=35044,this.updateRanges=[],this.gpuType=1015,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,i){e*=this.itemSize,i*=t.itemSize;for(let r=0,n=this.itemSize;r<n;r++)this.array[e+r]=t.array[i+r];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,i=this.count;t<i;t++)Va.fromBufferAttribute(this,t),Va.applyMatrix3(e),this.setXY(t,Va.x,Va.y);else if(this.itemSize===3)for(let t=0,i=this.count;t<i;t++)ht.fromBufferAttribute(this,t),ht.applyMatrix3(e),this.setXYZ(t,ht.x,ht.y,ht.z);return this}applyMatrix4(e){for(let t=0,i=this.count;t<i;t++)ht.fromBufferAttribute(this,t),ht.applyMatrix4(e),this.setXYZ(t,ht.x,ht.y,ht.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)ht.fromBufferAttribute(this,t),ht.applyNormalMatrix(e),this.setXYZ(t,ht.x,ht.y,ht.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)ht.fromBufferAttribute(this,t),ht.transformDirection(e),this.setXYZ(t,ht.x,ht.y,ht.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let i=this.array[e*this.itemSize+t];return this.normalized&&(i=ji(i,this.array)),i}setComponent(e,t,i){return this.normalized&&(i=St(i,this.array)),this.array[e*this.itemSize+t]=i,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=ji(t,this.array)),t}setX(e,t){return this.normalized&&(t=St(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=ji(t,this.array)),t}setY(e,t){return this.normalized&&(t=St(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=ji(t,this.array)),t}setZ(e,t){return this.normalized&&(t=St(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=ji(t,this.array)),t}setW(e,t){return this.normalized&&(t=St(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,i){return e*=this.itemSize,this.normalized&&(t=St(t,this.array),i=St(i,this.array)),this.array[e+0]=t,this.array[e+1]=i,this}setXYZ(e,t,i,r){return e*=this.itemSize,this.normalized&&(t=St(t,this.array),i=St(i,this.array),r=St(r,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=r,this}setXYZW(e,t,i,r,n){return e*=this.itemSize,this.normalized&&(t=St(t,this.array),i=St(i,this.array),r=St(r,this.array),n=St(n,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=r,this.array[e+3]=n,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==35044&&(e.usage=this.usage),e}}class io extends st{constructor(e,t,i){super(new Uint16Array(e),t,i)}}class ao extends st{constructor(e,t,i){super(new Uint32Array(e),t,i)}}let lt=class extends st{constructor(a,e,t){super(new Float32Array(a),e,t)}},ol=0;const Nt=new et,Cr=new Mt,ki=new T,It=new Ti,ma=new Ti,ft=new T;let mt=class ro extends ta{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:ol++}),this.uuid=ia(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Ks(e)?ao:io)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,i=0){this.groups.push({start:e,count:t,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const n=new Ie().getNormalMatrix(e);i.applyNormalMatrix(n),i.needsUpdate=!0}const r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(e),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return Nt.makeRotationFromQuaternion(e),this.applyMatrix4(Nt),this}rotateX(e){return Nt.makeRotationX(e),this.applyMatrix4(Nt),this}rotateY(e){return Nt.makeRotationY(e),this.applyMatrix4(Nt),this}rotateZ(e){return Nt.makeRotationZ(e),this.applyMatrix4(Nt),this}translate(e,t,i){return Nt.makeTranslation(e,t,i),this.applyMatrix4(Nt),this}scale(e,t,i){return Nt.makeScale(e,t,i),this.applyMatrix4(Nt),this}lookAt(e){return Cr.lookAt(e),Cr.updateMatrix(),this.applyMatrix4(Cr.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(ki).negate(),this.translate(ki.x,ki.y,ki.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const i=[];for(let r=0,n=e.length;r<n;r++){const s=e[r];i.push(s.x,s.y,s.z||0)}this.setAttribute("position",new lt(i,3))}else{for(let i=0,r=t.count;i<r;i++){const n=e[i];t.setXYZ(i,n.x,n.y,n.z||0)}e.length>t.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Ti);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new T(-1/0,-1/0,-1/0),new T(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let i=0,r=t.length;i<r;i++){const n=t[i];It.setFromBufferAttribute(n),this.morphTargetsRelative?(ft.addVectors(this.boundingBox.min,It.min),this.boundingBox.expandByPoint(ft),ft.addVectors(this.boundingBox.max,It.max),this.boundingBox.expandByPoint(ft)):(this.boundingBox.expandByPoint(It.min),this.boundingBox.expandByPoint(It.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new aa);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new T,1/0);return}if(e){const i=this.boundingSphere.center;if(It.setFromBufferAttribute(e),t)for(let n=0,s=t.length;n<s;n++){const o=t[n];ma.setFromBufferAttribute(o),this.morphTargetsRelative?(ft.addVectors(It.min,ma.min),It.expandByPoint(ft),ft.addVectors(It.max,ma.max),It.expandByPoint(ft)):(It.expandByPoint(ma.min),It.expandByPoint(ma.max))}It.getCenter(i);let r=0;for(let n=0,s=e.count;n<s;n++)ft.fromBufferAttribute(e,n),r=Math.max(r,i.distanceToSquared(ft));if(t)for(let n=0,s=t.length;n<s;n++){const o=t[n],l=this.morphTargetsRelative;for(let c=0,u=o.count;c<u;c++)ft.fromBufferAttribute(o,c),l&&(ki.fromBufferAttribute(e,c),ft.add(ki)),r=Math.max(r,i.distanceToSquared(ft))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=t.position,r=t.normal,n=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new st(new Float32Array(4*i.count),4));const s=this.getAttribute("tangent"),o=[],l=[];for(let P=0;P<i.count;P++)o[P]=new T,l[P]=new T;const c=new T,u=new T,d=new T,h=new Le,f=new Le,_=new Le,v=new T,m=new T;function p(P,E,y){c.fromBufferAttribute(i,P),u.fromBufferAttribute(i,E),d.fromBufferAttribute(i,y),h.fromBufferAttribute(n,P),f.fromBufferAttribute(n,E),_.fromBufferAttribute(n,y),u.sub(c),d.sub(c),f.sub(h),_.sub(h);const C=1/(f.x*_.y-_.x*f.y);isFinite(C)&&(v.copy(u).multiplyScalar(_.y).addScaledVector(d,-f.y).multiplyScalar(C),m.copy(d).multiplyScalar(f.x).addScaledVector(u,-_.x).multiplyScalar(C),o[P].add(v),o[E].add(v),o[y].add(v),l[P].add(m),l[E].add(m),l[y].add(m))}let w=this.groups;w.length===0&&(w=[{start:0,count:e.count}]);for(let P=0,E=w.length;P<E;++P){const y=w[P],C=y.start,z=y.count;for(let B=C,j=C+z;B<j;B+=3)p(e.getX(B+0),e.getX(B+1),e.getX(B+2))}const b=new T,S=new T,N=new T,R=new T;function A(P){N.fromBufferAttribute(r,P),R.copy(N);const E=o[P];b.copy(E),b.sub(N.multiplyScalar(N.dot(E))).normalize(),S.crossVectors(R,E);const y=S.dot(l[P])<0?-1:1;s.setXYZW(P,b.x,b.y,b.z,y)}for(let P=0,E=w.length;P<E;++P){const y=w[P],C=y.start,z=y.count;for(let B=C,j=C+z;B<j;B+=3)A(e.getX(B+0)),A(e.getX(B+1)),A(e.getX(B+2))}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new st(new Float32Array(t.count*3),3),this.setAttribute("normal",i);else for(let h=0,f=i.count;h<f;h++)i.setXYZ(h,0,0,0);const r=new T,n=new T,s=new T,o=new T,l=new T,c=new T,u=new T,d=new T;if(e)for(let h=0,f=e.count;h<f;h+=3){const _=e.getX(h+0),v=e.getX(h+1),m=e.getX(h+2);r.fromBufferAttribute(t,_),n.fromBufferAttribute(t,v),s.fromBufferAttribute(t,m),u.subVectors(s,n),d.subVectors(r,n),u.cross(d),o.fromBufferAttribute(i,_),l.fromBufferAttribute(i,v),c.fromBufferAttribute(i,m),o.add(u),l.add(u),c.add(u),i.setXYZ(_,o.x,o.y,o.z),i.setXYZ(v,l.x,l.y,l.z),i.setXYZ(m,c.x,c.y,c.z)}else for(let h=0,f=t.count;h<f;h+=3)r.fromBufferAttribute(t,h+0),n.fromBufferAttribute(t,h+1),s.fromBufferAttribute(t,h+2),u.subVectors(s,n),d.subVectors(r,n),u.cross(d),i.setXYZ(h+0,u.x,u.y,u.z),i.setXYZ(h+1,u.x,u.y,u.z),i.setXYZ(h+2,u.x,u.y,u.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,i=e.count;t<i;t++)ft.fromBufferAttribute(e,t),ft.normalize(),e.setXYZ(t,ft.x,ft.y,ft.z)}toNonIndexed(){function e(o,l){const c=o.array,u=o.itemSize,d=o.normalized,h=new c.constructor(l.length*u);let f=0,_=0;for(let v=0,m=l.length;v<m;v++){o.isInterleavedBufferAttribute?f=l[v]*o.data.stride+o.offset:f=l[v]*u;for(let p=0;p<u;p++)h[_++]=c[f++]}return new st(h,u,d)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new ro,i=this.index.array,r=this.attributes;for(const o in r){const l=r[o],c=e(l,i);t.setAttribute(o,c)}const n=this.morphAttributes;for(const o in n){const l=[],c=n[o];for(let u=0,d=c.length;u<d;u++){const h=c[u],f=e(h,i);l.push(f)}t.morphAttributes[o]=l}t.morphTargetsRelative=this.morphTargetsRelative;const s=this.groups;for(let o=0,l=s.length;o<l;o++){const c=s[o];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){const e={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const i=this.attributes;for(const l in i){const c=i[l];e.data.attributes[l]=c.toJSON(e.data)}const r={};let n=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],u=[];for(let d=0,h=c.length;d<h;d++){const f=c[d];u.push(f.toJSON(e.data))}u.length>0&&(r[l]=u,n=!0)}n&&(e.data.morphAttributes=r,e.data.morphTargetsRelative=this.morphTargetsRelative);const s=this.groups;s.length>0&&(e.data.groups=JSON.parse(JSON.stringify(s)));const o=this.boundingSphere;return o!==null&&(e.data.boundingSphere={center:o.center.toArray(),radius:o.radius}),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const i=e.index;i!==null&&this.setIndex(i.clone(t));const r=e.attributes;for(const c in r){const u=r[c];this.setAttribute(c,u.clone(t))}const n=e.morphAttributes;for(const c in n){const u=[],d=n[c];for(let h=0,f=d.length;h<f;h++)u.push(d[h].clone(t));this.morphAttributes[c]=u}this.morphTargetsRelative=e.morphTargetsRelative;const s=e.groups;for(let c=0,u=s.length;c<u;c++){const d=s[c];this.addGroup(d.start,d.count,d.materialIndex)}const o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());const l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}};const Zn=new et,gi=new un,Ha=new aa,Jn=new T,Wa=new T,Xa=new T,ja=new T,Pr=new T,qa=new T,Qn=new T,Ya=new T;let Ye=class extends Mt{constructor(a=new mt,e=new Rt){super(),this.isMesh=!0,this.type="Mesh",this.geometry=a,this.material=e,this.updateMorphTargets()}copy(a,e){return super.copy(a,e),a.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=a.morphTargetInfluences.slice()),a.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},a.morphTargetDictionary)),this.material=Array.isArray(a.material)?a.material.slice():a.material,this.geometry=a.geometry,this}updateMorphTargets(){const a=this.geometry.morphAttributes,e=Object.keys(a);if(e.length>0){const t=a[e[0]];if(t!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let i=0,r=t.length;i<r;i++){const n=t[i].name||String(i);this.morphTargetInfluences.push(0),this.morphTargetDictionary[n]=i}}}}getVertexPosition(a,e){const t=this.geometry,i=t.attributes.position,r=t.morphAttributes.position,n=t.morphTargetsRelative;e.fromBufferAttribute(i,a);const s=this.morphTargetInfluences;if(r&&s){qa.set(0,0,0);for(let o=0,l=r.length;o<l;o++){const c=s[o],u=r[o];c!==0&&(Pr.fromBufferAttribute(u,a),n?qa.addScaledVector(Pr,c):qa.addScaledVector(Pr.sub(e),c))}e.add(qa)}return e}raycast(a,e){const t=this.geometry,i=this.material,r=this.matrixWorld;i!==void 0&&(t.boundingSphere===null&&t.computeBoundingSphere(),Ha.copy(t.boundingSphere),Ha.applyMatrix4(r),gi.copy(a.ray).recast(a.near),!(Ha.containsPoint(gi.origin)===!1&&(gi.intersectSphere(Ha,Jn)===null||gi.origin.distanceToSquared(Jn)>(a.far-a.near)**2))&&(Zn.copy(r).invert(),gi.copy(a.ray).applyMatrix4(Zn),!(t.boundingBox!==null&&gi.intersectsBox(t.boundingBox)===!1)&&this._computeIntersections(a,e,gi)))}_computeIntersections(a,e,t){let i;const r=this.geometry,n=this.material,s=r.index,o=r.attributes.position,l=r.attributes.uv,c=r.attributes.uv1,u=r.attributes.normal,d=r.groups,h=r.drawRange;if(s!==null)if(Array.isArray(n))for(let f=0,_=d.length;f<_;f++){const v=d[f],m=n[v.materialIndex],p=Math.max(v.start,h.start),w=Math.min(s.count,Math.min(v.start+v.count,h.start+h.count));for(let b=p,S=w;b<S;b+=3){const N=s.getX(b),R=s.getX(b+1),A=s.getX(b+2);i=$a(this,m,a,t,l,c,u,N,R,A),i&&(i.faceIndex=Math.floor(b/3),i.face.materialIndex=v.materialIndex,e.push(i))}}else{const f=Math.max(0,h.start),_=Math.min(s.count,h.start+h.count);for(let v=f,m=_;v<m;v+=3){const p=s.getX(v),w=s.getX(v+1),b=s.getX(v+2);i=$a(this,n,a,t,l,c,u,p,w,b),i&&(i.faceIndex=Math.floor(v/3),e.push(i))}}else if(o!==void 0)if(Array.isArray(n))for(let f=0,_=d.length;f<_;f++){const v=d[f],m=n[v.materialIndex],p=Math.max(v.start,h.start),w=Math.min(o.count,Math.min(v.start+v.count,h.start+h.count));for(let b=p,S=w;b<S;b+=3){const N=b,R=b+1,A=b+2;i=$a(this,m,a,t,l,c,u,N,R,A),i&&(i.faceIndex=Math.floor(b/3),i.face.materialIndex=v.materialIndex,e.push(i))}}else{const f=Math.max(0,h.start),_=Math.min(o.count,h.start+h.count);for(let v=f,m=_;v<m;v+=3){const p=v,w=v+1,b=v+2;i=$a(this,n,a,t,l,c,u,p,w,b),i&&(i.faceIndex=Math.floor(v/3),e.push(i))}}}};function ll(a,e,t,i,r,n,s,o){let l;if(e.side===1?l=i.intersectTriangle(s,n,r,!0,o):l=i.intersectTriangle(r,n,s,e.side===0,o),l===null)return null;Ya.copy(o),Ya.applyMatrix4(a.matrixWorld);const c=t.ray.origin.distanceTo(Ya);return c<t.near||c>t.far?null:{distance:c,point:Ya.clone(),object:a}}function $a(a,e,t,i,r,n,s,o,l,c){a.getVertexPosition(o,Wa),a.getVertexPosition(l,Xa),a.getVertexPosition(c,ja);const u=ll(a,e,t,i,Wa,Xa,ja,Qn);if(u){const d=new T;fa.getBarycoord(Qn,Wa,Xa,ja,d),r&&(u.uv=fa.getInterpolatedAttribute(r,o,l,c,d,new Le)),n&&(u.uv1=fa.getInterpolatedAttribute(n,o,l,c,d,new Le)),s&&(u.normal=fa.getInterpolatedAttribute(s,o,l,c,d,new T),u.normal.dot(i.direction)>0&&u.normal.multiplyScalar(-1));const h={a:o,b:l,c,normal:new T,materialIndex:0};fa.getNormal(Wa,Xa,ja,h.normal),u.face=h,u.barycoord=d}return u}let pn=class no extends mt{constructor(e=1,t=1,i=1,r=1,n=1,s=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:i,widthSegments:r,heightSegments:n,depthSegments:s};const o=this;r=Math.floor(r),n=Math.floor(n),s=Math.floor(s);const l=[],c=[],u=[],d=[];let h=0,f=0;_("z","y","x",-1,-1,i,t,e,s,n,0),_("z","y","x",1,-1,i,t,-e,s,n,1),_("x","z","y",1,1,e,i,t,r,s,2),_("x","z","y",1,-1,e,i,-t,r,s,3),_("x","y","z",1,-1,e,t,i,r,n,4),_("x","y","z",-1,-1,e,t,-i,r,n,5),this.setIndex(l),this.setAttribute("position",new lt(c,3)),this.setAttribute("normal",new lt(u,3)),this.setAttribute("uv",new lt(d,2));function _(v,m,p,w,b,S,N,R,A,P,E){const y=S/A,C=N/P,z=S/2,B=N/2,j=R/2,J=A+1,$=P+1;let ie=0,X=0;const ee=new T;for(let de=0;de<$;de++){const we=de*C-B;for(let be=0;be<J;be++){const je=be*y-z;ee[v]=je*w,ee[m]=we*b,ee[p]=j,c.push(ee.x,ee.y,ee.z),ee[v]=0,ee[m]=0,ee[p]=R>0?1:-1,u.push(ee.x,ee.y,ee.z),d.push(be/A),d.push(1-de/P),ie+=1}}for(let de=0;de<P;de++)for(let we=0;we<A;we++){const be=h+we+J*de,je=h+we+J*(de+1),Y=h+(we+1)+J*(de+1),re=h+(we+1)+J*de;l.push(be,je,re),l.push(je,Y,re),X+=6}o.addGroup(f,X,E),f+=X,h+=ie}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new no(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}};function Zi(a){const e={};for(const t in a){e[t]={};for(const i in a[t]){const r=a[t][i];r&&(r.isColor||r.isMatrix3||r.isMatrix4||r.isVector2||r.isVector3||r.isVector4||r.isTexture||r.isQuaternion)?r.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][i]=null):e[t][i]=r.clone():Array.isArray(r)?e[t][i]=r.slice():e[t][i]=r}}return e}function bt(a){const e={};for(let t=0;t<a.length;t++){const i=Zi(a[t]);for(const r in i)e[r]=i[r]}return e}function cl(a){const e=[];for(let t=0;t<a.length;t++)e.push(a[t].clone());return e}function so(a){const e=a.getRenderTarget();return e===null?a.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:Ve.workingColorSpace}const hl={clone:Zi,merge:bt};var ul=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,dl=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class wt extends ra{static get type(){return"ShaderMaterial"}constructor(e){super(),this.isShaderMaterial=!0,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=ul,this.fragmentShader=dl,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Zi(e.uniforms),this.uniformsGroups=cl(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const r in this.uniforms){const n=this.uniforms[r].value;n&&n.isTexture?t.uniforms[r]={type:"t",value:n.toJSON(e).uuid}:n&&n.isColor?t.uniforms[r]={type:"c",value:n.getHex()}:n&&n.isVector2?t.uniforms[r]={type:"v2",value:n.toArray()}:n&&n.isVector3?t.uniforms[r]={type:"v3",value:n.toArray()}:n&&n.isVector4?t.uniforms[r]={type:"v4",value:n.toArray()}:n&&n.isMatrix3?t.uniforms[r]={type:"m3",value:n.toArray()}:n&&n.isMatrix4?t.uniforms[r]={type:"m4",value:n.toArray()}:t.uniforms[r]={value:n}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const i={};for(const r in this.extensions)this.extensions[r]===!0&&(i[r]=!0);return Object.keys(i).length>0&&(t.extensions=i),t}}class oo extends Mt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new et,this.projectionMatrix=new et,this.projectionMatrixInverse=new et,this.coordinateSystem=2e3}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const oi=new T,es=new Le,ts=new Le;let Dt=class extends oo{constructor(a=50,e=1,t=.1,i=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=a,this.zoom=1,this.near=t,this.far=i,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(a,e){return super.copy(a,e),this.fov=a.fov,this.zoom=a.zoom,this.near=a.near,this.far=a.far,this.focus=a.focus,this.aspect=a.aspect,this.view=a.view===null?null:Object.assign({},a.view),this.filmGauge=a.filmGauge,this.filmOffset=a.filmOffset,this}setFocalLength(a){const e=.5*this.getFilmHeight()/a;this.fov=Aa*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const a=Math.tan(Ea*.5*this.fov);return .5*this.getFilmHeight()/a}getEffectiveFOV(){return Aa*2*Math.atan(Math.tan(Ea*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(a,e,t){oi.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(oi.x,oi.y).multiplyScalar(-a/oi.z),oi.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(oi.x,oi.y).multiplyScalar(-a/oi.z)}getViewSize(a,e){return this.getViewBounds(a,es,ts),e.subVectors(ts,es)}setViewOffset(a,e,t,i,r,n){this.aspect=a/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=a,this.view.fullHeight=e,this.view.offsetX=t,this.view.offsetY=i,this.view.width=r,this.view.height=n,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const a=this.near;let e=a*Math.tan(Ea*.5*this.fov)/this.zoom,t=2*e,i=this.aspect*t,r=-.5*i;const n=this.view;if(this.view!==null&&this.view.enabled){const o=n.fullWidth,l=n.fullHeight;r+=n.offsetX*i/o,e-=n.offsetY*t/l,i*=n.width/o,t*=n.height/l}const s=this.filmOffset;s!==0&&(r+=a*s/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+i,e,e-t,a,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(a){const e=super.toJSON(a);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}};const Gi=-90,Vi=1;class pl extends Mt{constructor(e,t,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const r=new Dt(Gi,Vi,e,t);r.layers=this.layers,this.add(r);const n=new Dt(Gi,Vi,e,t);n.layers=this.layers,this.add(n);const s=new Dt(Gi,Vi,e,t);s.layers=this.layers,this.add(s);const o=new Dt(Gi,Vi,e,t);o.layers=this.layers,this.add(o);const l=new Dt(Gi,Vi,e,t);l.layers=this.layers,this.add(l);const c=new Dt(Gi,Vi,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[i,r,n,s,o,l]=t;for(const c of t)this.remove(c);if(e===2e3)i.up.set(0,1,0),i.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),n.up.set(0,0,-1),n.lookAt(0,1,0),s.up.set(0,0,1),s.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===2001)i.up.set(0,-1,0),i.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),n.up.set(0,0,1),n.lookAt(0,1,0),s.up.set(0,0,-1),s.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:r}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[n,s,o,l,c,u]=this.children,d=e.getRenderTarget(),h=e.getActiveCubeFace(),f=e.getActiveMipmapLevel(),_=e.xr.enabled;e.xr.enabled=!1;const v=i.texture.generateMipmaps;i.texture.generateMipmaps=!1,e.setRenderTarget(i,0,r),e.render(t,n),e.setRenderTarget(i,1,r),e.render(t,s),e.setRenderTarget(i,2,r),e.render(t,o),e.setRenderTarget(i,3,r),e.render(t,l),e.setRenderTarget(i,4,r),e.render(t,c),i.texture.generateMipmaps=v,e.setRenderTarget(i,5,r),e.render(t,u),e.setRenderTarget(d,h,f),e.xr.enabled=_,i.texture.needsPMREMUpdate=!0}}class lo extends yt{constructor(e,t,i,r,n,s,o,l,c,u){e=e!==void 0?e:[],t=t!==void 0?t:301,super(e,t,i,r,n,s,o,l,c,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class fl extends bi{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const i={width:e,height:e,depth:1},r=[i,i,i,i,i,i];this.texture=new lo(r,t.mapping,t.wrapS,t.wrapT,t.magFilter,t.minFilter,t.format,t.type,t.anisotropy,t.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=t.generateMipmaps!==void 0?t.generateMipmaps:!1,this.texture.minFilter=t.minFilter!==void 0?t.minFilter:1006}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},r=new pn(5,5,5),n=new wt({name:"CubemapFromEquirect",uniforms:Zi(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:1,blending:0});n.uniforms.tEquirect.value=t;const s=new Ye(r,n),o=t.minFilter;return t.minFilter===1008&&(t.minFilter=1006),new pl(1,10,this).update(e,s),t.minFilter=o,s.geometry.dispose(),s.material.dispose(),this}clear(e,t,i,r){const n=e.getRenderTarget();for(let s=0;s<6;s++)e.setRenderTarget(this,s),e.clear(t,i,r);e.setRenderTarget(n)}}const Lr=new T,ml=new T,gl=new Ie;class li{constructor(e=new T(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,i,r){return this.normal.set(e,t,i),this.constant=r,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,i){const r=Lr.subVectors(i,t).cross(ml.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(r,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const i=e.delta(Lr),r=this.normal.dot(i);if(r===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const n=-(e.start.dot(this.normal)+this.constant)/r;return n<0||n>1?null:t.copy(e.start).addScaledVector(i,n)}intersectsLine(e){const t=this.distanceToPoint(e.start),i=this.distanceToPoint(e.end);return t<0&&i>0||i<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const i=t||gl.getNormalMatrix(e),r=this.coplanarPoint(Lr).applyMatrix4(e),n=this.normal.applyMatrix3(i).normalize();return this.constant=-r.dot(n),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const vi=new aa,Ka=new T;class fn{constructor(e=new li,t=new li,i=new li,r=new li,n=new li,s=new li){this.planes=[e,t,i,r,n,s]}set(e,t,i,r,n,s){const o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(i),o[3].copy(r),o[4].copy(n),o[5].copy(s),this}copy(e){const t=this.planes;for(let i=0;i<6;i++)t[i].copy(e.planes[i]);return this}setFromProjectionMatrix(e,t=2e3){const i=this.planes,r=e.elements,n=r[0],s=r[1],o=r[2],l=r[3],c=r[4],u=r[5],d=r[6],h=r[7],f=r[8],_=r[9],v=r[10],m=r[11],p=r[12],w=r[13],b=r[14],S=r[15];if(i[0].setComponents(l-n,h-c,m-f,S-p).normalize(),i[1].setComponents(l+n,h+c,m+f,S+p).normalize(),i[2].setComponents(l+s,h+u,m+_,S+w).normalize(),i[3].setComponents(l-s,h-u,m-_,S-w).normalize(),i[4].setComponents(l-o,h-d,m-v,S-b).normalize(),t===2e3)i[5].setComponents(l+o,h+d,m+v,S+b).normalize();else if(t===2001)i[5].setComponents(o,d,v,b).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),vi.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),vi.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(vi)}intersectsSprite(e){return vi.center.set(0,0,0),vi.radius=.7071067811865476,vi.applyMatrix4(e.matrixWorld),this.intersectsSphere(vi)}intersectsSphere(e){const t=this.planes,i=e.center,r=-e.radius;for(let n=0;n<6;n++)if(t[n].distanceToPoint(i)<r)return!1;return!0}intersectsBox(e){const t=this.planes;for(let i=0;i<6;i++){const r=t[i];if(Ka.x=r.normal.x>0?e.max.x:e.min.x,Ka.y=r.normal.y>0?e.max.y:e.min.y,Ka.z=r.normal.z>0?e.max.z:e.min.z,r.distanceToPoint(Ka)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let i=0;i<6;i++)if(t[i].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function co(){let a=null,e=!1,t=null,i=null;function r(n,s){t(n,s),i=a.requestAnimationFrame(r)}return{start:function(){e!==!0&&t!==null&&(i=a.requestAnimationFrame(r),e=!0)},stop:function(){a.cancelAnimationFrame(i),e=!1},setAnimationLoop:function(n){t=n},setContext:function(n){a=n}}}function vl(a){const e=new WeakMap;function t(o,l){const c=o.array,u=o.usage,d=c.byteLength,h=a.createBuffer();a.bindBuffer(l,h),a.bufferData(l,c,u),o.onUploadCallback();let f;if(c instanceof Float32Array)f=a.FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?f=a.HALF_FLOAT:f=a.UNSIGNED_SHORT;else if(c instanceof Int16Array)f=a.SHORT;else if(c instanceof Uint32Array)f=a.UNSIGNED_INT;else if(c instanceof Int32Array)f=a.INT;else if(c instanceof Int8Array)f=a.BYTE;else if(c instanceof Uint8Array)f=a.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)f=a.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:h,type:f,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:d}}function i(o,l,c){const u=l.array,d=l.updateRanges;if(a.bindBuffer(c,o),d.length===0)a.bufferSubData(c,0,u);else{d.sort((f,_)=>f.start-_.start);let h=0;for(let f=1;f<d.length;f++){const _=d[h],v=d[f];v.start<=_.start+_.count+1?_.count=Math.max(_.count,v.start+v.count-_.start):(++h,d[h]=v)}d.length=h+1;for(let f=0,_=d.length;f<_;f++){const v=d[f];a.bufferSubData(c,v.start*u.BYTES_PER_ELEMENT,u,v.start,v.count)}l.clearUpdateRanges()}l.onUploadCallback()}function r(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function n(o){o.isInterleavedBufferAttribute&&(o=o.data);const l=e.get(o);l&&(a.deleteBuffer(l.buffer),e.delete(o))}function s(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const u=e.get(o);(!u||u.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const c=e.get(o);if(c===void 0)e.set(o,t(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(c.buffer,o,l),c.version=o.version}}return{get:r,remove:n,update:s}}let ho=class uo extends mt{constructor(e=1,t=1,i=1,r=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:i,heightSegments:r};const n=e/2,s=t/2,o=Math.floor(i),l=Math.floor(r),c=o+1,u=l+1,d=e/o,h=t/l,f=[],_=[],v=[],m=[];for(let p=0;p<u;p++){const w=p*h-s;for(let b=0;b<c;b++){const S=b*d-n;_.push(S,-w,0),v.push(0,0,1),m.push(b/o),m.push(1-p/l)}}for(let p=0;p<l;p++)for(let w=0;w<o;w++){const b=w+c*p,S=w+c*(p+1),N=w+1+c*(p+1),R=w+1+c*p;f.push(b,S,R),f.push(S,N,R)}this.setIndex(f),this.setAttribute("position",new lt(_,3)),this.setAttribute("normal",new lt(v,3)),this.setAttribute("uv",new lt(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new uo(e.width,e.height,e.widthSegments,e.heightSegments)}};var _l=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,xl=`#ifdef USE_ALPHAHASH
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
#endif`,yl=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Ml=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Sl=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,bl=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,El=`#ifdef USE_AOMAP
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
#endif`,wl=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Tl=`#ifdef USE_BATCHING
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
#endif`,Al=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Rl=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Cl=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Pl=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,Ll=`#ifdef USE_IRIDESCENCE
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
#endif`,Il=`#ifdef USE_BUMPMAP
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
#endif`,Ul=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,Dl=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Nl=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Ol=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Fl=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,zl=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Bl=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,kl=`#if defined( USE_COLOR_ALPHA )
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
#endif`,Gl=`#define PI 3.141592653589793
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
} // validated`,Vl=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,Hl=`vec3 transformedNormal = objectNormal;
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
#endif`,Wl=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Xl=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,jl=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,ql=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Yl="gl_FragColor = linearToOutputTexel( gl_FragColor );",$l=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Kl=`#ifdef USE_ENVMAP
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
#endif`,Zl=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Jl=`#ifdef USE_ENVMAP
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
#endif`,Ql=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,ec=`#ifdef USE_ENVMAP
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
#endif`,tc=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,ic=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,ac=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,rc=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,nc=`#ifdef USE_GRADIENTMAP
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
}`,sc=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,oc=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,lc=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,cc=`uniform bool receiveShadow;
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
#endif`,hc=`#ifdef USE_ENVMAP
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
#endif`,uc=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,dc=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,pc=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,fc=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,mc=`PhysicalMaterial material;
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
#endif`,gc=`struct PhysicalMaterial {
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
}`,vc=`
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
#endif`,_c=`#if defined( RE_IndirectDiffuse )
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
#endif`,xc=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,yc=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Mc=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Sc=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,bc=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Ec=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,wc=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Tc=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,Ac=`#if defined( USE_POINTS_UV )
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
#endif`,Rc=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Cc=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Pc=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Lc=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Ic=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Uc=`#ifdef USE_MORPHTARGETS
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
#endif`,Dc=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Nc=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,Oc=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,Fc=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,zc=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Bc=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,kc=`#ifdef USE_NORMALMAP
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
#endif`,Gc=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Vc=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Hc=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Wc=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Xc=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,jc=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,qc=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Yc=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,$c=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Kc=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Zc=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Jc=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Qc=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,eh=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,th=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,ih=`float getShadowMask() {
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
}`,ah=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,rh=`#ifdef USE_SKINNING
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
#endif`,nh=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,sh=`#ifdef USE_SKINNING
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
#endif`,oh=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,lh=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,ch=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,hh=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,uh=`#ifdef USE_TRANSMISSION
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
#endif`,dh=`#ifdef USE_TRANSMISSION
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
#endif`,ph=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,fh=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,mh=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,gh=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const vh=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,_h=`uniform sampler2D t2D;
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
}`,xh=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,yh=`#ifdef ENVMAP_TYPE_CUBE
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
}`,Mh=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Sh=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,bh=`#include <common>
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
}`,Eh=`#if DEPTH_PACKING == 3200
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
}`,wh=`#define DISTANCE
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
}`,Th=`#define DISTANCE
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
}`,Ah=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Rh=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Ch=`uniform float scale;
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
}`,Ph=`uniform vec3 diffuse;
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
}`,Lh=`#include <common>
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
}`,Ih=`uniform vec3 diffuse;
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
}`,Uh=`#define LAMBERT
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
}`,Dh=`#define LAMBERT
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
}`,Nh=`#define MATCAP
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
}`,Oh=`#define MATCAP
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
}`,Fh=`#define NORMAL
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
}`,zh=`#define NORMAL
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
}`,Bh=`#define PHONG
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
}`,kh=`#define PHONG
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
}`,Gh=`#define STANDARD
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
}`,Vh=`#define STANDARD
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
}`,Hh=`#define TOON
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
}`,Wh=`#define TOON
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
}`,Xh=`uniform float size;
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
}`,jh=`uniform vec3 diffuse;
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
}`,qh=`#include <common>
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
}`,Yh=`uniform vec3 color;
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
}`,$h=`uniform float rotation;
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
}`,Kh=`uniform vec3 diffuse;
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
}`,Ne={alphahash_fragment:_l,alphahash_pars_fragment:xl,alphamap_fragment:yl,alphamap_pars_fragment:Ml,alphatest_fragment:Sl,alphatest_pars_fragment:bl,aomap_fragment:El,aomap_pars_fragment:wl,batching_pars_vertex:Tl,batching_vertex:Al,begin_vertex:Rl,beginnormal_vertex:Cl,bsdfs:Pl,iridescence_fragment:Ll,bumpmap_pars_fragment:Il,clipping_planes_fragment:Ul,clipping_planes_pars_fragment:Dl,clipping_planes_pars_vertex:Nl,clipping_planes_vertex:Ol,color_fragment:Fl,color_pars_fragment:zl,color_pars_vertex:Bl,color_vertex:kl,common:Gl,cube_uv_reflection_fragment:Vl,defaultnormal_vertex:Hl,displacementmap_pars_vertex:Wl,displacementmap_vertex:Xl,emissivemap_fragment:jl,emissivemap_pars_fragment:ql,colorspace_fragment:Yl,colorspace_pars_fragment:$l,envmap_fragment:Kl,envmap_common_pars_fragment:Zl,envmap_pars_fragment:Jl,envmap_pars_vertex:Ql,envmap_physical_pars_fragment:hc,envmap_vertex:ec,fog_vertex:tc,fog_pars_vertex:ic,fog_fragment:ac,fog_pars_fragment:rc,gradientmap_pars_fragment:nc,lightmap_pars_fragment:sc,lights_lambert_fragment:oc,lights_lambert_pars_fragment:lc,lights_pars_begin:cc,lights_toon_fragment:uc,lights_toon_pars_fragment:dc,lights_phong_fragment:pc,lights_phong_pars_fragment:fc,lights_physical_fragment:mc,lights_physical_pars_fragment:gc,lights_fragment_begin:vc,lights_fragment_maps:_c,lights_fragment_end:xc,logdepthbuf_fragment:yc,logdepthbuf_pars_fragment:Mc,logdepthbuf_pars_vertex:Sc,logdepthbuf_vertex:bc,map_fragment:Ec,map_pars_fragment:wc,map_particle_fragment:Tc,map_particle_pars_fragment:Ac,metalnessmap_fragment:Rc,metalnessmap_pars_fragment:Cc,morphinstance_vertex:Pc,morphcolor_vertex:Lc,morphnormal_vertex:Ic,morphtarget_pars_vertex:Uc,morphtarget_vertex:Dc,normal_fragment_begin:Nc,normal_fragment_maps:Oc,normal_pars_fragment:Fc,normal_pars_vertex:zc,normal_vertex:Bc,normalmap_pars_fragment:kc,clearcoat_normal_fragment_begin:Gc,clearcoat_normal_fragment_maps:Vc,clearcoat_pars_fragment:Hc,iridescence_pars_fragment:Wc,opaque_fragment:Xc,packing:jc,premultiplied_alpha_fragment:qc,project_vertex:Yc,dithering_fragment:$c,dithering_pars_fragment:Kc,roughnessmap_fragment:Zc,roughnessmap_pars_fragment:Jc,shadowmap_pars_fragment:Qc,shadowmap_pars_vertex:eh,shadowmap_vertex:th,shadowmask_pars_fragment:ih,skinbase_vertex:ah,skinning_pars_vertex:rh,skinning_vertex:nh,skinnormal_vertex:sh,specularmap_fragment:oh,specularmap_pars_fragment:lh,tonemapping_fragment:ch,tonemapping_pars_fragment:hh,transmission_fragment:uh,transmission_pars_fragment:dh,uv_pars_fragment:ph,uv_pars_vertex:fh,uv_vertex:mh,worldpos_vertex:gh,background_vert:vh,background_frag:_h,backgroundCube_vert:xh,backgroundCube_frag:yh,cube_vert:Mh,cube_frag:Sh,depth_vert:bh,depth_frag:Eh,distanceRGBA_vert:wh,distanceRGBA_frag:Th,equirect_vert:Ah,equirect_frag:Rh,linedashed_vert:Ch,linedashed_frag:Ph,meshbasic_vert:Lh,meshbasic_frag:Ih,meshlambert_vert:Uh,meshlambert_frag:Dh,meshmatcap_vert:Nh,meshmatcap_frag:Oh,meshnormal_vert:Fh,meshnormal_frag:zh,meshphong_vert:Bh,meshphong_frag:kh,meshphysical_vert:Gh,meshphysical_frag:Vh,meshtoon_vert:Hh,meshtoon_frag:Wh,points_vert:Xh,points_frag:jh,shadow_vert:qh,shadow_frag:Yh,sprite_vert:$h,sprite_frag:Kh},le={common:{diffuse:{value:new Se(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Ie},alphaMap:{value:null},alphaMapTransform:{value:new Ie},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Ie}},envmap:{envMap:{value:null},envMapRotation:{value:new Ie},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Ie}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Ie}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Ie},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Ie},normalScale:{value:new Le(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Ie},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Ie}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Ie}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Ie}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Se(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Se(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Ie},alphaTest:{value:0},uvTransform:{value:new Ie}},sprite:{diffuse:{value:new Se(16777215)},opacity:{value:1},center:{value:new Le(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Ie},alphaMap:{value:null},alphaMapTransform:{value:new Ie},alphaTest:{value:0}}},Xt={basic:{uniforms:bt([le.common,le.specularmap,le.envmap,le.aomap,le.lightmap,le.fog]),vertexShader:Ne.meshbasic_vert,fragmentShader:Ne.meshbasic_frag},lambert:{uniforms:bt([le.common,le.specularmap,le.envmap,le.aomap,le.lightmap,le.emissivemap,le.bumpmap,le.normalmap,le.displacementmap,le.fog,le.lights,{emissive:{value:new Se(0)}}]),vertexShader:Ne.meshlambert_vert,fragmentShader:Ne.meshlambert_frag},phong:{uniforms:bt([le.common,le.specularmap,le.envmap,le.aomap,le.lightmap,le.emissivemap,le.bumpmap,le.normalmap,le.displacementmap,le.fog,le.lights,{emissive:{value:new Se(0)},specular:{value:new Se(1118481)},shininess:{value:30}}]),vertexShader:Ne.meshphong_vert,fragmentShader:Ne.meshphong_frag},standard:{uniforms:bt([le.common,le.envmap,le.aomap,le.lightmap,le.emissivemap,le.bumpmap,le.normalmap,le.displacementmap,le.roughnessmap,le.metalnessmap,le.fog,le.lights,{emissive:{value:new Se(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Ne.meshphysical_vert,fragmentShader:Ne.meshphysical_frag},toon:{uniforms:bt([le.common,le.aomap,le.lightmap,le.emissivemap,le.bumpmap,le.normalmap,le.displacementmap,le.gradientmap,le.fog,le.lights,{emissive:{value:new Se(0)}}]),vertexShader:Ne.meshtoon_vert,fragmentShader:Ne.meshtoon_frag},matcap:{uniforms:bt([le.common,le.bumpmap,le.normalmap,le.displacementmap,le.fog,{matcap:{value:null}}]),vertexShader:Ne.meshmatcap_vert,fragmentShader:Ne.meshmatcap_frag},points:{uniforms:bt([le.points,le.fog]),vertexShader:Ne.points_vert,fragmentShader:Ne.points_frag},dashed:{uniforms:bt([le.common,le.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Ne.linedashed_vert,fragmentShader:Ne.linedashed_frag},depth:{uniforms:bt([le.common,le.displacementmap]),vertexShader:Ne.depth_vert,fragmentShader:Ne.depth_frag},normal:{uniforms:bt([le.common,le.bumpmap,le.normalmap,le.displacementmap,{opacity:{value:1}}]),vertexShader:Ne.meshnormal_vert,fragmentShader:Ne.meshnormal_frag},sprite:{uniforms:bt([le.sprite,le.fog]),vertexShader:Ne.sprite_vert,fragmentShader:Ne.sprite_frag},background:{uniforms:{uvTransform:{value:new Ie},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Ne.background_vert,fragmentShader:Ne.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Ie}},vertexShader:Ne.backgroundCube_vert,fragmentShader:Ne.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Ne.cube_vert,fragmentShader:Ne.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Ne.equirect_vert,fragmentShader:Ne.equirect_frag},distanceRGBA:{uniforms:bt([le.common,le.displacementmap,{referencePosition:{value:new T},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Ne.distanceRGBA_vert,fragmentShader:Ne.distanceRGBA_frag},shadow:{uniforms:bt([le.lights,le.fog,{color:{value:new Se(0)},opacity:{value:1}}]),vertexShader:Ne.shadow_vert,fragmentShader:Ne.shadow_frag}};Xt.physical={uniforms:bt([Xt.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Ie},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Ie},clearcoatNormalScale:{value:new Le(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Ie},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Ie},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Ie},sheen:{value:0},sheenColor:{value:new Se(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Ie},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Ie},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Ie},transmissionSamplerSize:{value:new Le},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Ie},attenuationDistance:{value:0},attenuationColor:{value:new Se(0)},specularColor:{value:new Se(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Ie},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Ie},anisotropyVector:{value:new Le},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Ie}}]),vertexShader:Ne.meshphysical_vert,fragmentShader:Ne.meshphysical_frag};const Za={r:0,b:0,g:0},_i=new hi,Zh=new et;function Jh(a,e,t,i,r,n,s){const o=new Se(0);let l=n===!0?0:1,c,u,d=null,h=0,f=null;function _(w){let b=w.isScene===!0?w.background:null;return b&&b.isTexture&&(b=(w.backgroundBlurriness>0?t:e).get(b)),b}function v(w){let b=!1;const S=_(w);S===null?p(o,l):S&&S.isColor&&(p(S,1),b=!0);const N=a.xr.getEnvironmentBlendMode();N==="additive"?i.buffers.color.setClear(0,0,0,1,s):N==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,s),(a.autoClear||b)&&(i.buffers.depth.setTest(!0),i.buffers.depth.setMask(!0),i.buffers.color.setMask(!0),a.clear(a.autoClearColor,a.autoClearDepth,a.autoClearStencil))}function m(w,b){const S=_(b);S&&(S.isCubeTexture||S.mapping===306)?(u===void 0&&(u=new Ye(new pn(1,1,1),new wt({name:"BackgroundCubeMaterial",uniforms:Zi(Xt.backgroundCube.uniforms),vertexShader:Xt.backgroundCube.vertexShader,fragmentShader:Xt.backgroundCube.fragmentShader,side:1,depthTest:!1,depthWrite:!1,fog:!1})),u.geometry.deleteAttribute("normal"),u.geometry.deleteAttribute("uv"),u.onBeforeRender=function(N,R,A){this.matrixWorld.copyPosition(A.matrixWorld)},Object.defineProperty(u.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),r.update(u)),_i.copy(b.backgroundRotation),_i.x*=-1,_i.y*=-1,_i.z*=-1,S.isCubeTexture&&S.isRenderTargetTexture===!1&&(_i.y*=-1,_i.z*=-1),u.material.uniforms.envMap.value=S,u.material.uniforms.flipEnvMap.value=S.isCubeTexture&&S.isRenderTargetTexture===!1?-1:1,u.material.uniforms.backgroundBlurriness.value=b.backgroundBlurriness,u.material.uniforms.backgroundIntensity.value=b.backgroundIntensity,u.material.uniforms.backgroundRotation.value.setFromMatrix4(Zh.makeRotationFromEuler(_i)),u.material.toneMapped=Ve.getTransfer(S.colorSpace)!==Ke,(d!==S||h!==S.version||f!==a.toneMapping)&&(u.material.needsUpdate=!0,d=S,h=S.version,f=a.toneMapping),u.layers.enableAll(),w.unshift(u,u.geometry,u.material,0,0,null)):S&&S.isTexture&&(c===void 0&&(c=new Ye(new ho(2,2),new wt({name:"BackgroundMaterial",uniforms:Zi(Xt.background.uniforms),vertexShader:Xt.background.vertexShader,fragmentShader:Xt.background.fragmentShader,side:0,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),r.update(c)),c.material.uniforms.t2D.value=S,c.material.uniforms.backgroundIntensity.value=b.backgroundIntensity,c.material.toneMapped=Ve.getTransfer(S.colorSpace)!==Ke,S.matrixAutoUpdate===!0&&S.updateMatrix(),c.material.uniforms.uvTransform.value.copy(S.matrix),(d!==S||h!==S.version||f!==a.toneMapping)&&(c.material.needsUpdate=!0,d=S,h=S.version,f=a.toneMapping),c.layers.enableAll(),w.unshift(c,c.geometry,c.material,0,0,null))}function p(w,b){w.getRGB(Za,so(a)),i.buffers.color.setClear(Za.r,Za.g,Za.b,b,s)}return{getClearColor:function(){return o},setClearColor:function(w,b=1){o.set(w),l=b,p(o,l)},getClearAlpha:function(){return l},setClearAlpha:function(w){l=w,p(o,l)},render:v,addToRenderList:m}}function Qh(a,e){const t=a.getParameter(a.MAX_VERTEX_ATTRIBS),i={},r=h(null);let n=r,s=!1;function o(y,C,z,B,j){let J=!1;const $=d(B,z,C);n!==$&&(n=$,c(n.object)),J=f(y,B,z,j),J&&_(y,B,z,j),j!==null&&e.update(j,a.ELEMENT_ARRAY_BUFFER),(J||s)&&(s=!1,S(y,C,z,B),j!==null&&a.bindBuffer(a.ELEMENT_ARRAY_BUFFER,e.get(j).buffer))}function l(){return a.createVertexArray()}function c(y){return a.bindVertexArray(y)}function u(y){return a.deleteVertexArray(y)}function d(y,C,z){const B=z.wireframe===!0;let j=i[y.id];j===void 0&&(j={},i[y.id]=j);let J=j[C.id];J===void 0&&(J={},j[C.id]=J);let $=J[B];return $===void 0&&($=h(l()),J[B]=$),$}function h(y){const C=[],z=[],B=[];for(let j=0;j<t;j++)C[j]=0,z[j]=0,B[j]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:C,enabledAttributes:z,attributeDivisors:B,object:y,attributes:{},index:null}}function f(y,C,z,B){const j=n.attributes,J=C.attributes;let $=0;const ie=z.getAttributes();for(const X in ie)if(ie[X].location>=0){const ee=j[X];let de=J[X];if(de===void 0&&(X==="instanceMatrix"&&y.instanceMatrix&&(de=y.instanceMatrix),X==="instanceColor"&&y.instanceColor&&(de=y.instanceColor)),ee===void 0||ee.attribute!==de||de&&ee.data!==de.data)return!0;$++}return n.attributesNum!==$||n.index!==B}function _(y,C,z,B){const j={},J=C.attributes;let $=0;const ie=z.getAttributes();for(const X in ie)if(ie[X].location>=0){let ee=J[X];ee===void 0&&(X==="instanceMatrix"&&y.instanceMatrix&&(ee=y.instanceMatrix),X==="instanceColor"&&y.instanceColor&&(ee=y.instanceColor));const de={};de.attribute=ee,ee&&ee.data&&(de.data=ee.data),j[X]=de,$++}n.attributes=j,n.attributesNum=$,n.index=B}function v(){const y=n.newAttributes;for(let C=0,z=y.length;C<z;C++)y[C]=0}function m(y){p(y,0)}function p(y,C){const z=n.newAttributes,B=n.enabledAttributes,j=n.attributeDivisors;z[y]=1,B[y]===0&&(a.enableVertexAttribArray(y),B[y]=1),j[y]!==C&&(a.vertexAttribDivisor(y,C),j[y]=C)}function w(){const y=n.newAttributes,C=n.enabledAttributes;for(let z=0,B=C.length;z<B;z++)C[z]!==y[z]&&(a.disableVertexAttribArray(z),C[z]=0)}function b(y,C,z,B,j,J,$){$===!0?a.vertexAttribIPointer(y,C,z,j,J):a.vertexAttribPointer(y,C,z,B,j,J)}function S(y,C,z,B){v();const j=B.attributes,J=z.getAttributes(),$=C.defaultAttributeValues;for(const ie in J){const X=J[ie];if(X.location>=0){let ee=j[ie];if(ee===void 0&&(ie==="instanceMatrix"&&y.instanceMatrix&&(ee=y.instanceMatrix),ie==="instanceColor"&&y.instanceColor&&(ee=y.instanceColor)),ee!==void 0){const de=ee.normalized,we=ee.itemSize,be=e.get(ee);if(be===void 0)continue;const je=be.buffer,Y=be.type,re=be.bytesPerElement,ve=Y===a.INT||Y===a.UNSIGNED_INT||ee.gpuType===1013;if(ee.isInterleavedBufferAttribute){const se=ee.data,xe=se.stride,Ae=ee.offset;if(se.isInstancedInterleavedBuffer){for(let Ue=0;Ue<X.locationSize;Ue++)p(X.location+Ue,se.meshPerAttribute);y.isInstancedMesh!==!0&&B._maxInstanceCount===void 0&&(B._maxInstanceCount=se.meshPerAttribute*se.count)}else for(let Ue=0;Ue<X.locationSize;Ue++)m(X.location+Ue);a.bindBuffer(a.ARRAY_BUFFER,je);for(let Ue=0;Ue<X.locationSize;Ue++)b(X.location+Ue,we/X.locationSize,Y,de,xe*re,(Ae+we/X.locationSize*Ue)*re,ve)}else{if(ee.isInstancedBufferAttribute){for(let se=0;se<X.locationSize;se++)p(X.location+se,ee.meshPerAttribute);y.isInstancedMesh!==!0&&B._maxInstanceCount===void 0&&(B._maxInstanceCount=ee.meshPerAttribute*ee.count)}else for(let se=0;se<X.locationSize;se++)m(X.location+se);a.bindBuffer(a.ARRAY_BUFFER,je);for(let se=0;se<X.locationSize;se++)b(X.location+se,we/X.locationSize,Y,de,we*re,we/X.locationSize*se*re,ve)}}else if($!==void 0){const de=$[ie];if(de!==void 0)switch(de.length){case 2:a.vertexAttrib2fv(X.location,de);break;case 3:a.vertexAttrib3fv(X.location,de);break;case 4:a.vertexAttrib4fv(X.location,de);break;default:a.vertexAttrib1fv(X.location,de)}}}}w()}function N(){P();for(const y in i){const C=i[y];for(const z in C){const B=C[z];for(const j in B)u(B[j].object),delete B[j];delete C[z]}delete i[y]}}function R(y){if(i[y.id]===void 0)return;const C=i[y.id];for(const z in C){const B=C[z];for(const j in B)u(B[j].object),delete B[j];delete C[z]}delete i[y.id]}function A(y){for(const C in i){const z=i[C];if(z[y.id]===void 0)continue;const B=z[y.id];for(const j in B)u(B[j].object),delete B[j];delete z[y.id]}}function P(){E(),s=!0,n!==r&&(n=r,c(n.object))}function E(){r.geometry=null,r.program=null,r.wireframe=!1}return{setup:o,reset:P,resetDefaultState:E,dispose:N,releaseStatesOfGeometry:R,releaseStatesOfProgram:A,initAttributes:v,enableAttribute:m,disableUnusedAttributes:w}}function eu(a,e,t){let i;function r(c){i=c}function n(c,u){a.drawArrays(i,c,u),t.update(u,i,1)}function s(c,u,d){d!==0&&(a.drawArraysInstanced(i,c,u,d),t.update(u,i,d))}function o(c,u,d){if(d===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,c,0,u,0,d);let h=0;for(let f=0;f<d;f++)h+=u[f];t.update(h,i,1)}function l(c,u,d,h){if(d===0)return;const f=e.get("WEBGL_multi_draw");if(f===null)for(let _=0;_<c.length;_++)s(c[_],u[_],h[_]);else{f.multiDrawArraysInstancedWEBGL(i,c,0,u,0,h,0,d);let _=0;for(let v=0;v<d;v++)_+=u[v]*h[v];t.update(_,i,1)}}this.setMode=r,this.render=n,this.renderInstances=s,this.renderMultiDraw=o,this.renderMultiDrawInstances=l}function tu(a,e,t,i){let r;function n(){if(r!==void 0)return r;if(e.has("EXT_texture_filter_anisotropic")===!0){const A=e.get("EXT_texture_filter_anisotropic");r=a.getParameter(A.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else r=0;return r}function s(A){return!(A!==1023&&i.convert(A)!==a.getParameter(a.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(A){const P=A===1016&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(A!==1009&&i.convert(A)!==a.getParameter(a.IMPLEMENTATION_COLOR_READ_TYPE)&&A!==1015&&!P)}function l(A){if(A==="highp"){if(a.getShaderPrecisionFormat(a.VERTEX_SHADER,a.HIGH_FLOAT).precision>0&&a.getShaderPrecisionFormat(a.FRAGMENT_SHADER,a.HIGH_FLOAT).precision>0)return"highp";A="mediump"}return A==="mediump"&&a.getShaderPrecisionFormat(a.VERTEX_SHADER,a.MEDIUM_FLOAT).precision>0&&a.getShaderPrecisionFormat(a.FRAGMENT_SHADER,a.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp";const u=l(c);u!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",u,"instead."),c=u);const d=t.logarithmicDepthBuffer===!0,h=t.reverseDepthBuffer===!0&&e.has("EXT_clip_control"),f=a.getParameter(a.MAX_TEXTURE_IMAGE_UNITS),_=a.getParameter(a.MAX_VERTEX_TEXTURE_IMAGE_UNITS),v=a.getParameter(a.MAX_TEXTURE_SIZE),m=a.getParameter(a.MAX_CUBE_MAP_TEXTURE_SIZE),p=a.getParameter(a.MAX_VERTEX_ATTRIBS),w=a.getParameter(a.MAX_VERTEX_UNIFORM_VECTORS),b=a.getParameter(a.MAX_VARYING_VECTORS),S=a.getParameter(a.MAX_FRAGMENT_UNIFORM_VECTORS),N=_>0,R=a.getParameter(a.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:n,getMaxPrecision:l,textureFormatReadable:s,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:d,reverseDepthBuffer:h,maxTextures:f,maxVertexTextures:_,maxTextureSize:v,maxCubemapSize:m,maxAttributes:p,maxVertexUniforms:w,maxVaryings:b,maxFragmentUniforms:S,vertexTextures:N,maxSamples:R}}function iu(a){const e=this;let t=null,i=0,r=!1,n=!1;const s=new li,o=new Ie,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(d,h){const f=d.length!==0||h||i!==0||r;return r=h,i=d.length,f},this.beginShadows=function(){n=!0,u(null)},this.endShadows=function(){n=!1},this.setGlobalState=function(d,h){t=u(d,h,0)},this.setState=function(d,h,f){const _=d.clippingPlanes,v=d.clipIntersection,m=d.clipShadows,p=a.get(d);if(!r||_===null||_.length===0||n&&!m)n?u(null):c();else{const w=n?0:i,b=w*4;let S=p.clippingState||null;l.value=S,S=u(_,h,b,f);for(let N=0;N!==b;++N)S[N]=t[N];p.clippingState=S,this.numIntersection=v?this.numPlanes:0,this.numPlanes+=w}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=i>0),e.numPlanes=i,e.numIntersection=0}function u(d,h,f,_){const v=d!==null?d.length:0;let m=null;if(v!==0){if(m=l.value,_!==!0||m===null){const p=f+v*4,w=h.matrixWorldInverse;o.getNormalMatrix(w),(m===null||m.length<p)&&(m=new Float32Array(p));for(let b=0,S=f;b!==v;++b,S+=4)s.copy(d[b]).applyMatrix4(w,o),s.normal.toArray(m,S),m[S+3]=s.constant}l.value=m,l.needsUpdate=!0}return e.numPlanes=v,e.numIntersection=0,m}}function au(a){let e=new WeakMap;function t(s,o){return o===303?s.mapping=301:o===304&&(s.mapping=302),s}function i(s){if(s&&s.isTexture){const o=s.mapping;if(o===303||o===304)if(e.has(s)){const l=e.get(s).texture;return t(l,s.mapping)}else{const l=s.image;if(l&&l.height>0){const c=new fl(l.height);return c.fromEquirectangularTexture(a,s),e.set(s,c),s.addEventListener("dispose",r),t(c.texture,s.mapping)}else return null}}return s}function r(s){const o=s.target;o.removeEventListener("dispose",r);const l=e.get(o);l!==void 0&&(e.delete(o),l.dispose())}function n(){e=new WeakMap}return{get:i,dispose:n}}class ru extends oo{constructor(e=-1,t=1,i=1,r=-1,n=.1,s=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=i,this.bottom=r,this.near=n,this.far=s,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,i,r,n,s){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=r,this.view.width=n,this.view.height=s,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,r=(this.top+this.bottom)/2;let n=i-e,s=i+e,o=r+t,l=r-t;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;n+=c*this.view.offsetX,s=n+c*this.view.width,o-=u*this.view.offsetY,l=o-u*this.view.height}this.projectionMatrix.makeOrthographic(n,s,o,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}const Yi=4,is=[.125,.215,.35,.446,.526,.582],Mi=20,Ir=new ru,as=new Se;let Ur=null,Dr=0,Nr=0,Or=!1;const yi=(1+Math.sqrt(5))/2,Hi=1/yi,rs=[new T(-yi,Hi,0),new T(yi,Hi,0),new T(-Hi,0,yi),new T(Hi,0,yi),new T(0,yi,-Hi),new T(0,yi,Hi),new T(-1,1,-1),new T(1,1,-1),new T(-1,1,1),new T(1,1,1)];class ns{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,i=.1,r=100){Ur=this._renderer.getRenderTarget(),Dr=this._renderer.getActiveCubeFace(),Nr=this._renderer.getActiveMipmapLevel(),Or=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const n=this._allocateTargets();return n.depthBuffer=!0,this._sceneToCubeUV(e,i,r,n),t>0&&this._blur(n,0,0,t),this._applyPMREM(n),this._cleanup(n),n}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=ls(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=os(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(Ur,Dr,Nr),this._renderer.xr.enabled=Or,e.scissorTest=!1,Ja(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===301||e.mapping===302?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Ur=this._renderer.getRenderTarget(),Dr=this._renderer.getActiveCubeFace(),Nr=this._renderer.getActiveMipmapLevel(),Or=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=t||this._allocateTargets();return this._textureToCubeUV(e,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,i={magFilter:1006,minFilter:1006,generateMipmaps:!1,type:1016,format:1023,colorSpace:ea,depthBuffer:!1},r=ss(e,t,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=ss(e,t,i);const{_lodMax:n}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=nu(n)),this._blurMaterial=su(n,e,t)}return r}_compileMaterial(e){const t=new Ye(this._lodPlanes[0],e);this._renderer.compile(t,Ir)}_sceneToCubeUV(e,t,i,r){const n=new Dt(90,1,t,i),s=[1,-1,1,1,1,1],o=[1,1,1,-1,-1,-1],l=this._renderer,c=l.autoClear,u=l.toneMapping;l.getClearColor(as),l.toneMapping=0,l.autoClear=!1;const d=new Rt({name:"PMREM.Background",side:1,depthWrite:!1,depthTest:!1}),h=new Ye(new pn,d);let f=!1;const _=e.background;_?_.isColor&&(d.color.copy(_),e.background=null,f=!0):(d.color.copy(as),f=!0);for(let v=0;v<6;v++){const m=v%3;m===0?(n.up.set(0,s[v],0),n.lookAt(o[v],0,0)):m===1?(n.up.set(0,0,s[v]),n.lookAt(0,o[v],0)):(n.up.set(0,s[v],0),n.lookAt(0,0,o[v]));const p=this._cubeSize;Ja(r,m*p,v>2?p:0,p,p),l.setRenderTarget(r),f&&l.render(h,n),l.render(e,n)}h.geometry.dispose(),h.material.dispose(),l.toneMapping=u,l.autoClear=c,e.background=_}_textureToCubeUV(e,t){const i=this._renderer,r=e.mapping===301||e.mapping===302;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=ls()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=os());const n=r?this._cubemapMaterial:this._equirectMaterial,s=new Ye(this._lodPlanes[0],n),o=n.uniforms;o.envMap.value=e;const l=this._cubeSize;Ja(t,0,0,3*l,2*l),i.setRenderTarget(t),i.render(s,Ir)}_applyPMREM(e){const t=this._renderer,i=t.autoClear;t.autoClear=!1;const r=this._lodPlanes.length;for(let n=1;n<r;n++){const s=Math.sqrt(this._sigmas[n]*this._sigmas[n]-this._sigmas[n-1]*this._sigmas[n-1]),o=rs[(r-n-1)%rs.length];this._blur(e,n-1,n,s,o)}t.autoClear=i}_blur(e,t,i,r,n){const s=this._pingPongRenderTarget;this._halfBlur(e,s,t,i,r,"latitudinal",n),this._halfBlur(s,e,i,i,r,"longitudinal",n)}_halfBlur(e,t,i,r,n,s,o){const l=this._renderer,c=this._blurMaterial;s!=="latitudinal"&&s!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const u=3,d=new Ye(this._lodPlanes[r],c),h=c.uniforms,f=this._sizeLods[i]-1,_=isFinite(n)?Math.PI/(2*f):2*Math.PI/(2*Mi-1),v=n/_,m=isFinite(n)?1+Math.floor(u*v):Mi;m>Mi&&console.warn(`sigmaRadians, ${n}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${Mi}`);const p=[];let w=0;for(let A=0;A<Mi;++A){const P=A/v,E=Math.exp(-P*P/2);p.push(E),A===0?w+=E:A<m&&(w+=2*E)}for(let A=0;A<p.length;A++)p[A]=p[A]/w;h.envMap.value=e.texture,h.samples.value=m,h.weights.value=p,h.latitudinal.value=s==="latitudinal",o&&(h.poleAxis.value=o);const{_lodMax:b}=this;h.dTheta.value=_,h.mipInt.value=b-i;const S=this._sizeLods[r],N=3*S*(r>b-Yi?r-b+Yi:0),R=4*(this._cubeSize-S);Ja(t,N,R,3*S,2*S),l.setRenderTarget(t),l.render(d,Ir)}}function nu(a){const e=[],t=[],i=[];let r=a;const n=a-Yi+1+is.length;for(let s=0;s<n;s++){const o=Math.pow(2,r);t.push(o);let l=1/o;s>a-Yi?l=is[s-a+Yi-1]:s===0&&(l=0),i.push(l);const c=1/(o-2),u=-c,d=1+c,h=[u,u,d,u,d,d,u,u,d,d,u,d],f=6,_=6,v=3,m=2,p=1,w=new Float32Array(v*_*f),b=new Float32Array(m*_*f),S=new Float32Array(p*_*f);for(let R=0;R<f;R++){const A=R%3*2/3-1,P=R>2?0:-1,E=[A,P,0,A+2/3,P,0,A+2/3,P+1,0,A,P,0,A+2/3,P+1,0,A,P+1,0];w.set(E,v*_*R),b.set(h,m*_*R);const y=[R,R,R,R,R,R];S.set(y,p*_*R)}const N=new mt;N.setAttribute("position",new st(w,v)),N.setAttribute("uv",new st(b,m)),N.setAttribute("faceIndex",new st(S,p)),e.push(N),r>Yi&&r--}return{lodPlanes:e,sizeLods:t,sigmas:i}}function ss(a,e,t){const i=new bi(a,e,t);return i.texture.mapping=306,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function Ja(a,e,t,i,r){a.viewport.set(e,t,i,r),a.scissor.set(e,t,i,r)}function su(a,e,t){const i=new Float32Array(Mi),r=new T(0,1,0);return new wt({name:"SphericalGaussianBlur",defines:{n:Mi,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${a}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:r}},vertexShader:mn(),fragmentShader:`

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
		`,blending:0,depthTest:!1,depthWrite:!1})}function os(){return new wt({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:mn(),fragmentShader:`

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
		`,blending:0,depthTest:!1,depthWrite:!1})}function ls(){return new wt({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:mn(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function mn(){return`

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
	`}function ou(a){let e=new WeakMap,t=null;function i(o){if(o&&o.isTexture){const l=o.mapping,c=l===303||l===304,u=l===301||l===302;if(c||u){let d=e.get(o);const h=d!==void 0?d.texture.pmremVersion:0;if(o.isRenderTargetTexture&&o.pmremVersion!==h)return t===null&&(t=new ns(a)),d=c?t.fromEquirectangular(o,d):t.fromCubemap(o,d),d.texture.pmremVersion=o.pmremVersion,e.set(o,d),d.texture;if(d!==void 0)return d.texture;{const f=o.image;return c&&f&&f.height>0||u&&f&&r(f)?(t===null&&(t=new ns(a)),d=c?t.fromEquirectangular(o):t.fromCubemap(o),d.texture.pmremVersion=o.pmremVersion,e.set(o,d),o.addEventListener("dispose",n),d.texture):null}}}return o}function r(o){let l=0;const c=6;for(let u=0;u<c;u++)o[u]!==void 0&&l++;return l===c}function n(o){const l=o.target;l.removeEventListener("dispose",n);const c=e.get(l);c!==void 0&&(e.delete(l),c.dispose())}function s(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:i,dispose:s}}function lu(a){const e={};function t(i){if(e[i]!==void 0)return e[i];let r;switch(i){case"WEBGL_depth_texture":r=a.getExtension("WEBGL_depth_texture")||a.getExtension("MOZ_WEBGL_depth_texture")||a.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":r=a.getExtension("EXT_texture_filter_anisotropic")||a.getExtension("MOZ_EXT_texture_filter_anisotropic")||a.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":r=a.getExtension("WEBGL_compressed_texture_s3tc")||a.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||a.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":r=a.getExtension("WEBGL_compressed_texture_pvrtc")||a.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:r=a.getExtension(i)}return e[i]=r,r}return{has:function(i){return t(i)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(i){const r=t(i);return r===null&&Ma("THREE.WebGLRenderer: "+i+" extension not supported."),r}}}function cu(a,e,t,i){const r={},n=new WeakMap;function s(d){const h=d.target;h.index!==null&&e.remove(h.index);for(const _ in h.attributes)e.remove(h.attributes[_]);for(const _ in h.morphAttributes){const v=h.morphAttributes[_];for(let m=0,p=v.length;m<p;m++)e.remove(v[m])}h.removeEventListener("dispose",s),delete r[h.id];const f=n.get(h);f&&(e.remove(f),n.delete(h)),i.releaseStatesOfGeometry(h),h.isInstancedBufferGeometry===!0&&delete h._maxInstanceCount,t.memory.geometries--}function o(d,h){return r[h.id]===!0||(h.addEventListener("dispose",s),r[h.id]=!0,t.memory.geometries++),h}function l(d){const h=d.attributes;for(const _ in h)e.update(h[_],a.ARRAY_BUFFER);const f=d.morphAttributes;for(const _ in f){const v=f[_];for(let m=0,p=v.length;m<p;m++)e.update(v[m],a.ARRAY_BUFFER)}}function c(d){const h=[],f=d.index,_=d.attributes.position;let v=0;if(f!==null){const w=f.array;v=f.version;for(let b=0,S=w.length;b<S;b+=3){const N=w[b+0],R=w[b+1],A=w[b+2];h.push(N,R,R,A,A,N)}}else if(_!==void 0){const w=_.array;v=_.version;for(let b=0,S=w.length/3-1;b<S;b+=3){const N=b+0,R=b+1,A=b+2;h.push(N,R,R,A,A,N)}}else return;const m=new(Ks(h)?ao:io)(h,1);m.version=v;const p=n.get(d);p&&e.remove(p),n.set(d,m)}function u(d){const h=n.get(d);if(h){const f=d.index;f!==null&&h.version<f.version&&c(d)}else c(d);return n.get(d)}return{get:o,update:l,getWireframeAttribute:u}}function hu(a,e,t){let i;function r(h){i=h}let n,s;function o(h){n=h.type,s=h.bytesPerElement}function l(h,f){a.drawElements(i,f,n,h*s),t.update(f,i,1)}function c(h,f,_){_!==0&&(a.drawElementsInstanced(i,f,n,h*s,_),t.update(f,i,_))}function u(h,f,_){if(_===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,f,0,n,h,0,_);let v=0;for(let m=0;m<_;m++)v+=f[m];t.update(v,i,1)}function d(h,f,_,v){if(_===0)return;const m=e.get("WEBGL_multi_draw");if(m===null)for(let p=0;p<h.length;p++)c(h[p]/s,f[p],v[p]);else{m.multiDrawElementsInstancedWEBGL(i,f,0,n,h,0,v,0,_);let p=0;for(let w=0;w<_;w++)p+=f[w]*v[w];t.update(p,i,1)}}this.setMode=r,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=u,this.renderMultiDrawInstances=d}function uu(a){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function i(n,s,o){switch(t.calls++,s){case a.TRIANGLES:t.triangles+=o*(n/3);break;case a.LINES:t.lines+=o*(n/2);break;case a.LINE_STRIP:t.lines+=o*(n-1);break;case a.LINE_LOOP:t.lines+=o*n;break;case a.POINTS:t.points+=o*n;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",s);break}}function r(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:r,update:i}}function du(a,e,t){const i=new WeakMap,r=new Qe;function n(s,o,l){const c=s.morphTargetInfluences,u=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,d=u!==void 0?u.length:0;let h=i.get(o);if(h===void 0||h.count!==d){let f=function(){P.dispose(),i.delete(o),o.removeEventListener("dispose",f)};h!==void 0&&h.texture.dispose();const _=o.morphAttributes.position!==void 0,v=o.morphAttributes.normal!==void 0,m=o.morphAttributes.color!==void 0,p=o.morphAttributes.position||[],w=o.morphAttributes.normal||[],b=o.morphAttributes.color||[];let S=0;_===!0&&(S=1),v===!0&&(S=2),m===!0&&(S=3);let N=o.attributes.position.count*S,R=1;N>e.maxTextureSize&&(R=Math.ceil(N/e.maxTextureSize),N=e.maxTextureSize);const A=new Float32Array(N*R*4*d),P=new Qs(A,N,R,d);P.type=1015,P.needsUpdate=!0;const E=S*4;for(let y=0;y<d;y++){const C=p[y],z=w[y],B=b[y],j=N*R*4*y;for(let J=0;J<C.count;J++){const $=J*E;_===!0&&(r.fromBufferAttribute(C,J),A[j+$+0]=r.x,A[j+$+1]=r.y,A[j+$+2]=r.z,A[j+$+3]=0),v===!0&&(r.fromBufferAttribute(z,J),A[j+$+4]=r.x,A[j+$+5]=r.y,A[j+$+6]=r.z,A[j+$+7]=0),m===!0&&(r.fromBufferAttribute(B,J),A[j+$+8]=r.x,A[j+$+9]=r.y,A[j+$+10]=r.z,A[j+$+11]=B.itemSize===4?r.w:1)}}h={count:d,texture:P,size:new Le(N,R)},i.set(o,h),o.addEventListener("dispose",f)}if(s.isInstancedMesh===!0&&s.morphTexture!==null)l.getUniforms().setValue(a,"morphTexture",s.morphTexture,t);else{let f=0;for(let v=0;v<c.length;v++)f+=c[v];const _=o.morphTargetsRelative?1:1-f;l.getUniforms().setValue(a,"morphTargetBaseInfluence",_),l.getUniforms().setValue(a,"morphTargetInfluences",c)}l.getUniforms().setValue(a,"morphTargetsTexture",h.texture,t),l.getUniforms().setValue(a,"morphTargetsTextureSize",h.size)}return{update:n}}function pu(a,e,t,i){let r=new WeakMap;function n(l){const c=i.render.frame,u=l.geometry,d=e.get(l,u);if(r.get(d)!==c&&(e.update(d),r.set(d,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",o)===!1&&l.addEventListener("dispose",o),r.get(l)!==c&&(t.update(l.instanceMatrix,a.ARRAY_BUFFER),l.instanceColor!==null&&t.update(l.instanceColor,a.ARRAY_BUFFER),r.set(l,c))),l.isSkinnedMesh){const h=l.skeleton;r.get(h)!==c&&(h.update(),r.set(h,c))}return d}function s(){r=new WeakMap}function o(l){const c=l.target;c.removeEventListener("dispose",o),t.remove(c.instanceMatrix),c.instanceColor!==null&&t.remove(c.instanceColor)}return{update:n,dispose:s}}class po extends yt{constructor(e,t,i,r,n,s,o,l,c,u=1026){if(u!==1026&&u!==1027)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");i===void 0&&u===1026&&(i=1014),i===void 0&&u===1027&&(i=1020),super(null,r,n,s,o,l,u,i,c),this.isDepthTexture=!0,this.image={width:e,height:t},this.magFilter=o!==void 0?o:1003,this.minFilter=l!==void 0?l:1003,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}const fo=new yt,cs=new po(1,1),mo=new Qs,go=new Jo,vo=new lo,hs=[],us=[],ds=new Float32Array(16),ps=new Float32Array(9),fs=new Float32Array(4);function na(a,e,t){const i=a[0];if(i<=0||i>0)return a;const r=e*t;let n=hs[r];if(n===void 0&&(n=new Float32Array(r),hs[r]=n),e!==0){i.toArray(n,0);for(let s=1,o=0;s!==e;++s)o+=t,a[s].toArray(n,o)}return n}function dt(a,e){if(a.length!==e.length)return!1;for(let t=0,i=a.length;t<i;t++)if(a[t]!==e[t])return!1;return!0}function pt(a,e){for(let t=0,i=e.length;t<i;t++)a[t]=e[t]}function cr(a,e){let t=us[e];t===void 0&&(t=new Int32Array(e),us[e]=t);for(let i=0;i!==e;++i)t[i]=a.allocateTextureUnit();return t}function fu(a,e){const t=this.cache;t[0]!==e&&(a.uniform1f(this.addr,e),t[0]=e)}function mu(a,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(a.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(dt(t,e))return;a.uniform2fv(this.addr,e),pt(t,e)}}function gu(a,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(a.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(a.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(dt(t,e))return;a.uniform3fv(this.addr,e),pt(t,e)}}function vu(a,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(a.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(dt(t,e))return;a.uniform4fv(this.addr,e),pt(t,e)}}function _u(a,e){const t=this.cache,i=e.elements;if(i===void 0){if(dt(t,e))return;a.uniformMatrix2fv(this.addr,!1,e),pt(t,e)}else{if(dt(t,i))return;fs.set(i),a.uniformMatrix2fv(this.addr,!1,fs),pt(t,i)}}function xu(a,e){const t=this.cache,i=e.elements;if(i===void 0){if(dt(t,e))return;a.uniformMatrix3fv(this.addr,!1,e),pt(t,e)}else{if(dt(t,i))return;ps.set(i),a.uniformMatrix3fv(this.addr,!1,ps),pt(t,i)}}function yu(a,e){const t=this.cache,i=e.elements;if(i===void 0){if(dt(t,e))return;a.uniformMatrix4fv(this.addr,!1,e),pt(t,e)}else{if(dt(t,i))return;ds.set(i),a.uniformMatrix4fv(this.addr,!1,ds),pt(t,i)}}function Mu(a,e){const t=this.cache;t[0]!==e&&(a.uniform1i(this.addr,e),t[0]=e)}function Su(a,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(a.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(dt(t,e))return;a.uniform2iv(this.addr,e),pt(t,e)}}function bu(a,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(a.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(dt(t,e))return;a.uniform3iv(this.addr,e),pt(t,e)}}function Eu(a,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(a.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(dt(t,e))return;a.uniform4iv(this.addr,e),pt(t,e)}}function wu(a,e){const t=this.cache;t[0]!==e&&(a.uniform1ui(this.addr,e),t[0]=e)}function Tu(a,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(a.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(dt(t,e))return;a.uniform2uiv(this.addr,e),pt(t,e)}}function Au(a,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(a.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(dt(t,e))return;a.uniform3uiv(this.addr,e),pt(t,e)}}function Ru(a,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(a.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(dt(t,e))return;a.uniform4uiv(this.addr,e),pt(t,e)}}function Cu(a,e,t){const i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(a.uniform1i(this.addr,r),i[0]=r);let n;this.type===a.SAMPLER_2D_SHADOW?(cs.compareFunction=515,n=cs):n=fo,t.setTexture2D(e||n,r)}function Pu(a,e,t){const i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(a.uniform1i(this.addr,r),i[0]=r),t.setTexture3D(e||go,r)}function Lu(a,e,t){const i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(a.uniform1i(this.addr,r),i[0]=r),t.setTextureCube(e||vo,r)}function Iu(a,e,t){const i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(a.uniform1i(this.addr,r),i[0]=r),t.setTexture2DArray(e||mo,r)}function Uu(a){switch(a){case 5126:return fu;case 35664:return mu;case 35665:return gu;case 35666:return vu;case 35674:return _u;case 35675:return xu;case 35676:return yu;case 5124:case 35670:return Mu;case 35667:case 35671:return Su;case 35668:case 35672:return bu;case 35669:case 35673:return Eu;case 5125:return wu;case 36294:return Tu;case 36295:return Au;case 36296:return Ru;case 35678:case 36198:case 36298:case 36306:case 35682:return Cu;case 35679:case 36299:case 36307:return Pu;case 35680:case 36300:case 36308:case 36293:return Lu;case 36289:case 36303:case 36311:case 36292:return Iu}}function Du(a,e){a.uniform1fv(this.addr,e)}function Nu(a,e){const t=na(e,this.size,2);a.uniform2fv(this.addr,t)}function Ou(a,e){const t=na(e,this.size,3);a.uniform3fv(this.addr,t)}function Fu(a,e){const t=na(e,this.size,4);a.uniform4fv(this.addr,t)}function zu(a,e){const t=na(e,this.size,4);a.uniformMatrix2fv(this.addr,!1,t)}function Bu(a,e){const t=na(e,this.size,9);a.uniformMatrix3fv(this.addr,!1,t)}function ku(a,e){const t=na(e,this.size,16);a.uniformMatrix4fv(this.addr,!1,t)}function Gu(a,e){a.uniform1iv(this.addr,e)}function Vu(a,e){a.uniform2iv(this.addr,e)}function Hu(a,e){a.uniform3iv(this.addr,e)}function Wu(a,e){a.uniform4iv(this.addr,e)}function Xu(a,e){a.uniform1uiv(this.addr,e)}function ju(a,e){a.uniform2uiv(this.addr,e)}function qu(a,e){a.uniform3uiv(this.addr,e)}function Yu(a,e){a.uniform4uiv(this.addr,e)}function $u(a,e,t){const i=this.cache,r=e.length,n=cr(t,r);dt(i,n)||(a.uniform1iv(this.addr,n),pt(i,n));for(let s=0;s!==r;++s)t.setTexture2D(e[s]||fo,n[s])}function Ku(a,e,t){const i=this.cache,r=e.length,n=cr(t,r);dt(i,n)||(a.uniform1iv(this.addr,n),pt(i,n));for(let s=0;s!==r;++s)t.setTexture3D(e[s]||go,n[s])}function Zu(a,e,t){const i=this.cache,r=e.length,n=cr(t,r);dt(i,n)||(a.uniform1iv(this.addr,n),pt(i,n));for(let s=0;s!==r;++s)t.setTextureCube(e[s]||vo,n[s])}function Ju(a,e,t){const i=this.cache,r=e.length,n=cr(t,r);dt(i,n)||(a.uniform1iv(this.addr,n),pt(i,n));for(let s=0;s!==r;++s)t.setTexture2DArray(e[s]||mo,n[s])}function Qu(a){switch(a){case 5126:return Du;case 35664:return Nu;case 35665:return Ou;case 35666:return Fu;case 35674:return zu;case 35675:return Bu;case 35676:return ku;case 5124:case 35670:return Gu;case 35667:case 35671:return Vu;case 35668:case 35672:return Hu;case 35669:case 35673:return Wu;case 5125:return Xu;case 36294:return ju;case 36295:return qu;case 36296:return Yu;case 35678:case 36198:case 36298:case 36306:case 35682:return $u;case 35679:case 36299:case 36307:return Ku;case 35680:case 36300:case 36308:case 36293:return Zu;case 36289:case 36303:case 36311:case 36292:return Ju}}class ed{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.setValue=Uu(t.type)}}class td{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=Qu(t.type)}}class id{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,i){const r=this.seq;for(let n=0,s=r.length;n!==s;++n){const o=r[n];o.setValue(e,t[o.id],i)}}}const Fr=/(\w+)(\])?(\[|\.)?/g;function ms(a,e){a.seq.push(e),a.map[e.id]=e}function ad(a,e,t){const i=a.name,r=i.length;for(Fr.lastIndex=0;;){const n=Fr.exec(i),s=Fr.lastIndex;let o=n[1];const l=n[2]==="]",c=n[3];if(l&&(o=o|0),c===void 0||c==="["&&s+2===r){ms(t,c===void 0?new ed(o,a,e):new td(o,a,e));break}else{let u=t.map[o];u===void 0&&(u=new id(o),ms(t,u)),t=u}}}class or{constructor(e,t){this.seq=[],this.map={};const i=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let r=0;r<i;++r){const n=e.getActiveUniform(t,r),s=e.getUniformLocation(t,n.name);ad(n,s,this)}}setValue(e,t,i,r){const n=this.map[t];n!==void 0&&n.setValue(e,i,r)}setOptional(e,t,i){const r=t[i];r!==void 0&&this.setValue(e,i,r)}static upload(e,t,i,r){for(let n=0,s=t.length;n!==s;++n){const o=t[n],l=i[o.id];l.needsUpdate!==!1&&o.setValue(e,l.value,r)}}static seqWithValue(e,t){const i=[];for(let r=0,n=e.length;r!==n;++r){const s=e[r];s.id in t&&i.push(s)}return i}}function gs(a,e,t){const i=a.createShader(e);return a.shaderSource(i,t),a.compileShader(i),i}const rd=37297;let nd=0;function sd(a,e){const t=a.split(`
`),i=[],r=Math.max(e-6,0),n=Math.min(e+6,t.length);for(let s=r;s<n;s++){const o=s+1;i.push(`${o===e?">":" "} ${o}: ${t[s]}`)}return i.join(`
`)}const vs=new Ie;function od(a){Ve._getMatrix(vs,Ve.workingColorSpace,a);const e=`mat3( ${vs.elements.map(t=>t.toFixed(4))} )`;switch(Ve.getTransfer(a)){case lr:return[e,"LinearTransferOETF"];case Ke:return[e,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",a),[e,"LinearTransferOETF"]}}function _s(a,e,t){const i=a.getShaderParameter(e,a.COMPILE_STATUS),r=a.getShaderInfoLog(e).trim();if(i&&r==="")return"";const n=/ERROR: 0:(\d+)/.exec(r);if(n){const s=parseInt(n[1]);return t.toUpperCase()+`

`+r+`

`+sd(a.getShaderSource(e),s)}else return r}function ld(a,e){const t=od(e);return[`vec4 ${a}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}function cd(a,e){let t;switch(e){case 1:t="Linear";break;case 2:t="Reinhard";break;case 3:t="Cineon";break;case 4:t="ACESFilmic";break;case 6:t="AgX";break;case 7:t="Neutral";break;case 5:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+a+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const Qa=new T;function hd(){Ve.getLuminanceCoefficients(Qa);const a=Qa.x.toFixed(4),e=Qa.y.toFixed(4),t=Qa.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${a}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function ud(a){return[a.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",a.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Sa).join(`
`)}function dd(a){const e=[];for(const t in a){const i=a[t];i!==!1&&e.push("#define "+t+" "+i)}return e.join(`
`)}function pd(a,e){const t={},i=a.getProgramParameter(e,a.ACTIVE_ATTRIBUTES);for(let r=0;r<i;r++){const n=a.getActiveAttrib(e,r),s=n.name;let o=1;n.type===a.FLOAT_MAT2&&(o=2),n.type===a.FLOAT_MAT3&&(o=3),n.type===a.FLOAT_MAT4&&(o=4),t[s]={type:n.type,location:a.getAttribLocation(e,s),locationSize:o}}return t}function Sa(a){return a!==""}function xs(a,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return a.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function ys(a,e){return a.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const fd=/^[ \t]*#include +<([\w\d./]+)>/gm;function Jr(a){return a.replace(fd,gd)}const md=new Map;function gd(a,e){let t=Ne[e];if(t===void 0){const i=md.get(e);if(i!==void 0)t=Ne[i],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,i);else throw new Error("Can not resolve #include <"+e+">")}return Jr(t)}const vd=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Ms(a){return a.replace(vd,_d)}function _d(a,e,t,i){let r="";for(let n=parseInt(e);n<parseInt(t);n++)r+=i.replace(/\[\s*i\s*\]/g,"[ "+n+" ]").replace(/UNROLLED_LOOP_INDEX/g,n);return r}function Ss(a){let e=`precision ${a.precision} float;
	precision ${a.precision} int;
	precision ${a.precision} sampler2D;
	precision ${a.precision} samplerCube;
	precision ${a.precision} sampler3D;
	precision ${a.precision} sampler2DArray;
	precision ${a.precision} sampler2DShadow;
	precision ${a.precision} samplerCubeShadow;
	precision ${a.precision} sampler2DArrayShadow;
	precision ${a.precision} isampler2D;
	precision ${a.precision} isampler3D;
	precision ${a.precision} isamplerCube;
	precision ${a.precision} isampler2DArray;
	precision ${a.precision} usampler2D;
	precision ${a.precision} usampler3D;
	precision ${a.precision} usamplerCube;
	precision ${a.precision} usampler2DArray;
	`;return a.precision==="highp"?e+=`
#define HIGH_PRECISION`:a.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:a.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function xd(a){let e="SHADOWMAP_TYPE_BASIC";return a.shadowMapType===1?e="SHADOWMAP_TYPE_PCF":a.shadowMapType===2?e="SHADOWMAP_TYPE_PCF_SOFT":a.shadowMapType===3&&(e="SHADOWMAP_TYPE_VSM"),e}function yd(a){let e="ENVMAP_TYPE_CUBE";if(a.envMap)switch(a.envMapMode){case 301:case 302:e="ENVMAP_TYPE_CUBE";break;case 306:e="ENVMAP_TYPE_CUBE_UV";break}return e}function Md(a){let e="ENVMAP_MODE_REFLECTION";if(a.envMap)switch(a.envMapMode){case 302:e="ENVMAP_MODE_REFRACTION";break}return e}function Sd(a){let e="ENVMAP_BLENDING_NONE";if(a.envMap)switch(a.combine){case 0:e="ENVMAP_BLENDING_MULTIPLY";break;case 1:e="ENVMAP_BLENDING_MIX";break;case 2:e="ENVMAP_BLENDING_ADD";break}return e}function bd(a){const e=a.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,i=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:i,maxMip:t}}function Ed(a,e,t,i){const r=a.getContext(),n=t.defines;let s=t.vertexShader,o=t.fragmentShader;const l=xd(t),c=yd(t),u=Md(t),d=Sd(t),h=bd(t),f=ud(t),_=dd(n),v=r.createProgram();let m,p,w=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(m=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,_].filter(Sa).join(`
`),m.length>0&&(m+=`
`),p=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,_].filter(Sa).join(`
`),p.length>0&&(p+=`
`)):(m=[Ss(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,_,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+u:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Sa).join(`
`),p=[Ss(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,_,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+u:"",t.envMap?"#define "+d:"",h?"#define CUBEUV_TEXEL_WIDTH "+h.texelWidth:"",h?"#define CUBEUV_TEXEL_HEIGHT "+h.texelHeight:"",h?"#define CUBEUV_MAX_MIP "+h.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==0?"#define TONE_MAPPING":"",t.toneMapping!==0?Ne.tonemapping_pars_fragment:"",t.toneMapping!==0?cd("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Ne.colorspace_pars_fragment,ld("linearToOutputTexel",t.outputColorSpace),hd(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Sa).join(`
`)),s=Jr(s),s=xs(s,t),s=ys(s,t),o=Jr(o),o=xs(o,t),o=ys(o,t),s=Ms(s),o=Ms(o),t.isRawShaderMaterial!==!0&&(w=`#version 300 es
`,m=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,p=["#define varying in",t.glslVersion===Dn?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===Dn?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);const b=w+m+s,S=w+p+o,N=gs(r,r.VERTEX_SHADER,b),R=gs(r,r.FRAGMENT_SHADER,S);r.attachShader(v,N),r.attachShader(v,R),t.index0AttributeName!==void 0?r.bindAttribLocation(v,0,t.index0AttributeName):t.morphTargets===!0&&r.bindAttribLocation(v,0,"position"),r.linkProgram(v);function A(C){if(a.debug.checkShaderErrors){const z=r.getProgramInfoLog(v).trim(),B=r.getShaderInfoLog(N).trim(),j=r.getShaderInfoLog(R).trim();let J=!0,$=!0;if(r.getProgramParameter(v,r.LINK_STATUS)===!1)if(J=!1,typeof a.debug.onShaderError=="function")a.debug.onShaderError(r,v,N,R);else{const ie=_s(r,N,"vertex"),X=_s(r,R,"fragment");console.error("THREE.WebGLProgram: Shader Error "+r.getError()+" - VALIDATE_STATUS "+r.getProgramParameter(v,r.VALIDATE_STATUS)+`

Material Name: `+C.name+`
Material Type: `+C.type+`

Program Info Log: `+z+`
`+ie+`
`+X)}else z!==""?console.warn("THREE.WebGLProgram: Program Info Log:",z):(B===""||j==="")&&($=!1);$&&(C.diagnostics={runnable:J,programLog:z,vertexShader:{log:B,prefix:m},fragmentShader:{log:j,prefix:p}})}r.deleteShader(N),r.deleteShader(R),P=new or(r,v),E=pd(r,v)}let P;this.getUniforms=function(){return P===void 0&&A(this),P};let E;this.getAttributes=function(){return E===void 0&&A(this),E};let y=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return y===!1&&(y=r.getProgramParameter(v,rd)),y},this.destroy=function(){i.releaseStatesOfProgram(this),r.deleteProgram(v),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=nd++,this.cacheKey=e,this.usedTimes=1,this.program=v,this.vertexShader=N,this.fragmentShader=R,this}let wd=0;class Td{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,i=e.fragmentShader,r=this._getShaderStage(t),n=this._getShaderStage(i),s=this._getShaderCacheForMaterial(e);return s.has(r)===!1&&(s.add(r),r.usedTimes++),s.has(n)===!1&&(s.add(n),n.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const i of t)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let i=t.get(e);return i===void 0&&(i=new Set,t.set(e,i)),i}_getShaderStage(e){const t=this.shaderCache;let i=t.get(e);return i===void 0&&(i=new Ad(e),t.set(e,i)),i}}class Ad{constructor(e){this.id=wd++,this.code=e,this.usedTimes=0}}function Rd(a,e,t,i,r,n,s){const o=new dn,l=new Td,c=new Set,u=[],d=r.logarithmicDepthBuffer,h=r.vertexTextures;let f=r.precision;const _={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function v(E){return c.add(E),E===0?"uv":`uv${E}`}function m(E,y,C,z,B){const j=z.fog,J=B.geometry,$=E.isMeshStandardMaterial?z.environment:null,ie=(E.isMeshStandardMaterial?t:e).get(E.envMap||$),X=ie&&ie.mapping===306?ie.image.height:null,ee=_[E.type];E.precision!==null&&(f=r.getMaxPrecision(E.precision),f!==E.precision&&console.warn("THREE.WebGLProgram.getParameters:",E.precision,"not supported, using",f,"instead."));const de=J.morphAttributes.position||J.morphAttributes.normal||J.morphAttributes.color,we=de!==void 0?de.length:0;let be=0;J.morphAttributes.position!==void 0&&(be=1),J.morphAttributes.normal!==void 0&&(be=2),J.morphAttributes.color!==void 0&&(be=3);let je,Y,re,ve;if(ee){const $e=Xt[ee];je=$e.vertexShader,Y=$e.fragmentShader}else je=E.vertexShader,Y=E.fragmentShader,l.update(E),re=l.getVertexShaderID(E),ve=l.getFragmentShaderID(E);const se=a.getRenderTarget(),xe=a.state.buffers.depth.getReversed(),Ae=B.isInstancedMesh===!0,Ue=B.isBatchedMesh===!0,tt=!!E.map,Be=!!E.matcap,He=!!ie,D=!!E.aoMap,Tt=!!E.lightMap,ze=!!E.bumpMap,Oe=!!E.normalMap,F=!!E.displacementMap,V=!!E.emissiveMap,H=!!E.metalnessMap,x=!!E.roughnessMap,g=E.anisotropy>0,O=E.clearcoat>0,q=E.dispersion>0,Z=E.iridescence>0,K=E.sheen>0,pe=E.transmission>0,ne=g&&!!E.anisotropyMap,he=O&&!!E.clearcoatMap,Fe=O&&!!E.clearcoatNormalMap,ae=O&&!!E.clearcoatRoughnessMap,me=Z&&!!E.iridescenceMap,Te=Z&&!!E.iridescenceThicknessMap,Re=K&&!!E.sheenColorMap,ge=K&&!!E.sheenRoughnessMap,ke=!!E.specularMap,De=!!E.specularColorMap,Ze=!!E.specularIntensityMap,I=pe&&!!E.transmissionMap,ce=pe&&!!E.thicknessMap,W=!!E.gradientMap,Q=!!E.alphaMap,ue=E.alphaTest>0,oe=!!E.alphaHash,Ge=!!E.extensions;let ot=0;E.toneMapped&&(se===null||se.isXRRenderTarget===!0)&&(ot=a.toneMapping);const gt={shaderID:ee,shaderType:E.type,shaderName:E.name,vertexShader:je,fragmentShader:Y,defines:E.defines,customVertexShaderID:re,customFragmentShaderID:ve,isRawShaderMaterial:E.isRawShaderMaterial===!0,glslVersion:E.glslVersion,precision:f,batching:Ue,batchingColor:Ue&&B._colorsTexture!==null,instancing:Ae,instancingColor:Ae&&B.instanceColor!==null,instancingMorph:Ae&&B.morphTexture!==null,supportsVertexTextures:h,outputColorSpace:se===null?a.outputColorSpace:se.isXRRenderTarget===!0?se.texture.colorSpace:ea,alphaToCoverage:!!E.alphaToCoverage,map:tt,matcap:Be,envMap:He,envMapMode:He&&ie.mapping,envMapCubeUVHeight:X,aoMap:D,lightMap:Tt,bumpMap:ze,normalMap:Oe,displacementMap:h&&F,emissiveMap:V,normalMapObjectSpace:Oe&&E.normalMapType===1,normalMapTangentSpace:Oe&&E.normalMapType===0,metalnessMap:H,roughnessMap:x,anisotropy:g,anisotropyMap:ne,clearcoat:O,clearcoatMap:he,clearcoatNormalMap:Fe,clearcoatRoughnessMap:ae,dispersion:q,iridescence:Z,iridescenceMap:me,iridescenceThicknessMap:Te,sheen:K,sheenColorMap:Re,sheenRoughnessMap:ge,specularMap:ke,specularColorMap:De,specularIntensityMap:Ze,transmission:pe,transmissionMap:I,thicknessMap:ce,gradientMap:W,opaque:E.transparent===!1&&E.blending===1&&E.alphaToCoverage===!1,alphaMap:Q,alphaTest:ue,alphaHash:oe,combine:E.combine,mapUv:tt&&v(E.map.channel),aoMapUv:D&&v(E.aoMap.channel),lightMapUv:Tt&&v(E.lightMap.channel),bumpMapUv:ze&&v(E.bumpMap.channel),normalMapUv:Oe&&v(E.normalMap.channel),displacementMapUv:F&&v(E.displacementMap.channel),emissiveMapUv:V&&v(E.emissiveMap.channel),metalnessMapUv:H&&v(E.metalnessMap.channel),roughnessMapUv:x&&v(E.roughnessMap.channel),anisotropyMapUv:ne&&v(E.anisotropyMap.channel),clearcoatMapUv:he&&v(E.clearcoatMap.channel),clearcoatNormalMapUv:Fe&&v(E.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:ae&&v(E.clearcoatRoughnessMap.channel),iridescenceMapUv:me&&v(E.iridescenceMap.channel),iridescenceThicknessMapUv:Te&&v(E.iridescenceThicknessMap.channel),sheenColorMapUv:Re&&v(E.sheenColorMap.channel),sheenRoughnessMapUv:ge&&v(E.sheenRoughnessMap.channel),specularMapUv:ke&&v(E.specularMap.channel),specularColorMapUv:De&&v(E.specularColorMap.channel),specularIntensityMapUv:Ze&&v(E.specularIntensityMap.channel),transmissionMapUv:I&&v(E.transmissionMap.channel),thicknessMapUv:ce&&v(E.thicknessMap.channel),alphaMapUv:Q&&v(E.alphaMap.channel),vertexTangents:!!J.attributes.tangent&&(Oe||g),vertexColors:E.vertexColors,vertexAlphas:E.vertexColors===!0&&!!J.attributes.color&&J.attributes.color.itemSize===4,pointsUvs:B.isPoints===!0&&!!J.attributes.uv&&(tt||Q),fog:!!j,useFog:E.fog===!0,fogExp2:!!j&&j.isFogExp2,flatShading:E.flatShading===!0,sizeAttenuation:E.sizeAttenuation===!0,logarithmicDepthBuffer:d,reverseDepthBuffer:xe,skinning:B.isSkinnedMesh===!0,morphTargets:J.morphAttributes.position!==void 0,morphNormals:J.morphAttributes.normal!==void 0,morphColors:J.morphAttributes.color!==void 0,morphTargetsCount:we,morphTextureStride:be,numDirLights:y.directional.length,numPointLights:y.point.length,numSpotLights:y.spot.length,numSpotLightMaps:y.spotLightMap.length,numRectAreaLights:y.rectArea.length,numHemiLights:y.hemi.length,numDirLightShadows:y.directionalShadowMap.length,numPointLightShadows:y.pointShadowMap.length,numSpotLightShadows:y.spotShadowMap.length,numSpotLightShadowsWithMaps:y.numSpotLightShadowsWithMaps,numLightProbes:y.numLightProbes,numClippingPlanes:s.numPlanes,numClipIntersection:s.numIntersection,dithering:E.dithering,shadowMapEnabled:a.shadowMap.enabled&&C.length>0,shadowMapType:a.shadowMap.type,toneMapping:ot,decodeVideoTexture:tt&&E.map.isVideoTexture===!0&&Ve.getTransfer(E.map.colorSpace)===Ke,decodeVideoTextureEmissive:V&&E.emissiveMap.isVideoTexture===!0&&Ve.getTransfer(E.emissiveMap.colorSpace)===Ke,premultipliedAlpha:E.premultipliedAlpha,doubleSided:E.side===2,flipSided:E.side===1,useDepthPacking:E.depthPacking>=0,depthPacking:E.depthPacking||0,index0AttributeName:E.index0AttributeName,extensionClipCullDistance:Ge&&E.extensions.clipCullDistance===!0&&i.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Ge&&E.extensions.multiDraw===!0||Ue)&&i.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:E.customProgramCacheKey()};return gt.vertexUv1s=c.has(1),gt.vertexUv2s=c.has(2),gt.vertexUv3s=c.has(3),c.clear(),gt}function p(E){const y=[];if(E.shaderID?y.push(E.shaderID):(y.push(E.customVertexShaderID),y.push(E.customFragmentShaderID)),E.defines!==void 0)for(const C in E.defines)y.push(C),y.push(E.defines[C]);return E.isRawShaderMaterial===!1&&(w(y,E),b(y,E),y.push(a.outputColorSpace)),y.push(E.customProgramCacheKey),y.join()}function w(E,y){E.push(y.precision),E.push(y.outputColorSpace),E.push(y.envMapMode),E.push(y.envMapCubeUVHeight),E.push(y.mapUv),E.push(y.alphaMapUv),E.push(y.lightMapUv),E.push(y.aoMapUv),E.push(y.bumpMapUv),E.push(y.normalMapUv),E.push(y.displacementMapUv),E.push(y.emissiveMapUv),E.push(y.metalnessMapUv),E.push(y.roughnessMapUv),E.push(y.anisotropyMapUv),E.push(y.clearcoatMapUv),E.push(y.clearcoatNormalMapUv),E.push(y.clearcoatRoughnessMapUv),E.push(y.iridescenceMapUv),E.push(y.iridescenceThicknessMapUv),E.push(y.sheenColorMapUv),E.push(y.sheenRoughnessMapUv),E.push(y.specularMapUv),E.push(y.specularColorMapUv),E.push(y.specularIntensityMapUv),E.push(y.transmissionMapUv),E.push(y.thicknessMapUv),E.push(y.combine),E.push(y.fogExp2),E.push(y.sizeAttenuation),E.push(y.morphTargetsCount),E.push(y.morphAttributeCount),E.push(y.numDirLights),E.push(y.numPointLights),E.push(y.numSpotLights),E.push(y.numSpotLightMaps),E.push(y.numHemiLights),E.push(y.numRectAreaLights),E.push(y.numDirLightShadows),E.push(y.numPointLightShadows),E.push(y.numSpotLightShadows),E.push(y.numSpotLightShadowsWithMaps),E.push(y.numLightProbes),E.push(y.shadowMapType),E.push(y.toneMapping),E.push(y.numClippingPlanes),E.push(y.numClipIntersection),E.push(y.depthPacking)}function b(E,y){o.disableAll(),y.supportsVertexTextures&&o.enable(0),y.instancing&&o.enable(1),y.instancingColor&&o.enable(2),y.instancingMorph&&o.enable(3),y.matcap&&o.enable(4),y.envMap&&o.enable(5),y.normalMapObjectSpace&&o.enable(6),y.normalMapTangentSpace&&o.enable(7),y.clearcoat&&o.enable(8),y.iridescence&&o.enable(9),y.alphaTest&&o.enable(10),y.vertexColors&&o.enable(11),y.vertexAlphas&&o.enable(12),y.vertexUv1s&&o.enable(13),y.vertexUv2s&&o.enable(14),y.vertexUv3s&&o.enable(15),y.vertexTangents&&o.enable(16),y.anisotropy&&o.enable(17),y.alphaHash&&o.enable(18),y.batching&&o.enable(19),y.dispersion&&o.enable(20),y.batchingColor&&o.enable(21),E.push(o.mask),o.disableAll(),y.fog&&o.enable(0),y.useFog&&o.enable(1),y.flatShading&&o.enable(2),y.logarithmicDepthBuffer&&o.enable(3),y.reverseDepthBuffer&&o.enable(4),y.skinning&&o.enable(5),y.morphTargets&&o.enable(6),y.morphNormals&&o.enable(7),y.morphColors&&o.enable(8),y.premultipliedAlpha&&o.enable(9),y.shadowMapEnabled&&o.enable(10),y.doubleSided&&o.enable(11),y.flipSided&&o.enable(12),y.useDepthPacking&&o.enable(13),y.dithering&&o.enable(14),y.transmission&&o.enable(15),y.sheen&&o.enable(16),y.opaque&&o.enable(17),y.pointsUvs&&o.enable(18),y.decodeVideoTexture&&o.enable(19),y.decodeVideoTextureEmissive&&o.enable(20),y.alphaToCoverage&&o.enable(21),E.push(o.mask)}function S(E){const y=_[E.type];let C;if(y){const z=Xt[y];C=hl.clone(z.uniforms)}else C=E.uniforms;return C}function N(E,y){let C;for(let z=0,B=u.length;z<B;z++){const j=u[z];if(j.cacheKey===y){C=j,++C.usedTimes;break}}return C===void 0&&(C=new Ed(a,y,E,n),u.push(C)),C}function R(E){if(--E.usedTimes===0){const y=u.indexOf(E);u[y]=u[u.length-1],u.pop(),E.destroy()}}function A(E){l.remove(E)}function P(){l.dispose()}return{getParameters:m,getProgramCacheKey:p,getUniforms:S,acquireProgram:N,releaseProgram:R,releaseShaderCache:A,programs:u,dispose:P}}function Cd(){let a=new WeakMap;function e(s){return a.has(s)}function t(s){let o=a.get(s);return o===void 0&&(o={},a.set(s,o)),o}function i(s){a.delete(s)}function r(s,o,l){a.get(s)[o]=l}function n(){a=new WeakMap}return{has:e,get:t,remove:i,update:r,dispose:n}}function Pd(a,e){return a.groupOrder!==e.groupOrder?a.groupOrder-e.groupOrder:a.renderOrder!==e.renderOrder?a.renderOrder-e.renderOrder:a.material.id!==e.material.id?a.material.id-e.material.id:a.z!==e.z?a.z-e.z:a.id-e.id}function bs(a,e){return a.groupOrder!==e.groupOrder?a.groupOrder-e.groupOrder:a.renderOrder!==e.renderOrder?a.renderOrder-e.renderOrder:a.z!==e.z?e.z-a.z:a.id-e.id}function Es(){const a=[];let e=0;const t=[],i=[],r=[];function n(){e=0,t.length=0,i.length=0,r.length=0}function s(d,h,f,_,v,m){let p=a[e];return p===void 0?(p={id:d.id,object:d,geometry:h,material:f,groupOrder:_,renderOrder:d.renderOrder,z:v,group:m},a[e]=p):(p.id=d.id,p.object=d,p.geometry=h,p.material=f,p.groupOrder=_,p.renderOrder=d.renderOrder,p.z=v,p.group=m),e++,p}function o(d,h,f,_,v,m){const p=s(d,h,f,_,v,m);f.transmission>0?i.push(p):f.transparent===!0?r.push(p):t.push(p)}function l(d,h,f,_,v,m){const p=s(d,h,f,_,v,m);f.transmission>0?i.unshift(p):f.transparent===!0?r.unshift(p):t.unshift(p)}function c(d,h){t.length>1&&t.sort(d||Pd),i.length>1&&i.sort(h||bs),r.length>1&&r.sort(h||bs)}function u(){for(let d=e,h=a.length;d<h;d++){const f=a[d];if(f.id===null)break;f.id=null,f.object=null,f.geometry=null,f.material=null,f.group=null}}return{opaque:t,transmissive:i,transparent:r,init:n,push:o,unshift:l,finish:u,sort:c}}function Ld(){let a=new WeakMap;function e(i,r){const n=a.get(i);let s;return n===void 0?(s=new Es,a.set(i,[s])):r>=n.length?(s=new Es,n.push(s)):s=n[r],s}function t(){a=new WeakMap}return{get:e,dispose:t}}function Id(){const a={};return{get:function(e){if(a[e.id]!==void 0)return a[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new T,color:new Se};break;case"SpotLight":t={position:new T,direction:new T,color:new Se,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new T,color:new Se,distance:0,decay:0};break;case"HemisphereLight":t={direction:new T,skyColor:new Se,groundColor:new Se};break;case"RectAreaLight":t={color:new Se,position:new T,halfWidth:new T,halfHeight:new T};break}return a[e.id]=t,t}}}function Ud(){const a={};return{get:function(e){if(a[e.id]!==void 0)return a[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Le};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Le};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Le,shadowCameraNear:1,shadowCameraFar:1e3};break}return a[e.id]=t,t}}}let Dd=0;function Nd(a,e){return(e.castShadow?2:0)-(a.castShadow?2:0)+(e.map?1:0)-(a.map?1:0)}function Od(a){const e=new Id,t=Ud(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)i.probe.push(new T);const r=new T,n=new et,s=new et;function o(c){let u=0,d=0,h=0;for(let E=0;E<9;E++)i.probe[E].set(0,0,0);let f=0,_=0,v=0,m=0,p=0,w=0,b=0,S=0,N=0,R=0,A=0;c.sort(Nd);for(let E=0,y=c.length;E<y;E++){const C=c[E],z=C.color,B=C.intensity,j=C.distance,J=C.shadow&&C.shadow.map?C.shadow.map.texture:null;if(C.isAmbientLight)u+=z.r*B,d+=z.g*B,h+=z.b*B;else if(C.isLightProbe){for(let $=0;$<9;$++)i.probe[$].addScaledVector(C.sh.coefficients[$],B);A++}else if(C.isDirectionalLight){const $=e.get(C);if($.color.copy(C.color).multiplyScalar(C.intensity),C.castShadow){const ie=C.shadow,X=t.get(C);X.shadowIntensity=ie.intensity,X.shadowBias=ie.bias,X.shadowNormalBias=ie.normalBias,X.shadowRadius=ie.radius,X.shadowMapSize=ie.mapSize,i.directionalShadow[f]=X,i.directionalShadowMap[f]=J,i.directionalShadowMatrix[f]=C.shadow.matrix,w++}i.directional[f]=$,f++}else if(C.isSpotLight){const $=e.get(C);$.position.setFromMatrixPosition(C.matrixWorld),$.color.copy(z).multiplyScalar(B),$.distance=j,$.coneCos=Math.cos(C.angle),$.penumbraCos=Math.cos(C.angle*(1-C.penumbra)),$.decay=C.decay,i.spot[v]=$;const ie=C.shadow;if(C.map&&(i.spotLightMap[N]=C.map,N++,ie.updateMatrices(C),C.castShadow&&R++),i.spotLightMatrix[v]=ie.matrix,C.castShadow){const X=t.get(C);X.shadowIntensity=ie.intensity,X.shadowBias=ie.bias,X.shadowNormalBias=ie.normalBias,X.shadowRadius=ie.radius,X.shadowMapSize=ie.mapSize,i.spotShadow[v]=X,i.spotShadowMap[v]=J,S++}v++}else if(C.isRectAreaLight){const $=e.get(C);$.color.copy(z).multiplyScalar(B),$.halfWidth.set(C.width*.5,0,0),$.halfHeight.set(0,C.height*.5,0),i.rectArea[m]=$,m++}else if(C.isPointLight){const $=e.get(C);if($.color.copy(C.color).multiplyScalar(C.intensity),$.distance=C.distance,$.decay=C.decay,C.castShadow){const ie=C.shadow,X=t.get(C);X.shadowIntensity=ie.intensity,X.shadowBias=ie.bias,X.shadowNormalBias=ie.normalBias,X.shadowRadius=ie.radius,X.shadowMapSize=ie.mapSize,X.shadowCameraNear=ie.camera.near,X.shadowCameraFar=ie.camera.far,i.pointShadow[_]=X,i.pointShadowMap[_]=J,i.pointShadowMatrix[_]=C.shadow.matrix,b++}i.point[_]=$,_++}else if(C.isHemisphereLight){const $=e.get(C);$.skyColor.copy(C.color).multiplyScalar(B),$.groundColor.copy(C.groundColor).multiplyScalar(B),i.hemi[p]=$,p++}}m>0&&(a.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=le.LTC_FLOAT_1,i.rectAreaLTC2=le.LTC_FLOAT_2):(i.rectAreaLTC1=le.LTC_HALF_1,i.rectAreaLTC2=le.LTC_HALF_2)),i.ambient[0]=u,i.ambient[1]=d,i.ambient[2]=h;const P=i.hash;(P.directionalLength!==f||P.pointLength!==_||P.spotLength!==v||P.rectAreaLength!==m||P.hemiLength!==p||P.numDirectionalShadows!==w||P.numPointShadows!==b||P.numSpotShadows!==S||P.numSpotMaps!==N||P.numLightProbes!==A)&&(i.directional.length=f,i.spot.length=v,i.rectArea.length=m,i.point.length=_,i.hemi.length=p,i.directionalShadow.length=w,i.directionalShadowMap.length=w,i.pointShadow.length=b,i.pointShadowMap.length=b,i.spotShadow.length=S,i.spotShadowMap.length=S,i.directionalShadowMatrix.length=w,i.pointShadowMatrix.length=b,i.spotLightMatrix.length=S+N-R,i.spotLightMap.length=N,i.numSpotLightShadowsWithMaps=R,i.numLightProbes=A,P.directionalLength=f,P.pointLength=_,P.spotLength=v,P.rectAreaLength=m,P.hemiLength=p,P.numDirectionalShadows=w,P.numPointShadows=b,P.numSpotShadows=S,P.numSpotMaps=N,P.numLightProbes=A,i.version=Dd++)}function l(c,u){let d=0,h=0,f=0,_=0,v=0;const m=u.matrixWorldInverse;for(let p=0,w=c.length;p<w;p++){const b=c[p];if(b.isDirectionalLight){const S=i.directional[d];S.direction.setFromMatrixPosition(b.matrixWorld),r.setFromMatrixPosition(b.target.matrixWorld),S.direction.sub(r),S.direction.transformDirection(m),d++}else if(b.isSpotLight){const S=i.spot[f];S.position.setFromMatrixPosition(b.matrixWorld),S.position.applyMatrix4(m),S.direction.setFromMatrixPosition(b.matrixWorld),r.setFromMatrixPosition(b.target.matrixWorld),S.direction.sub(r),S.direction.transformDirection(m),f++}else if(b.isRectAreaLight){const S=i.rectArea[_];S.position.setFromMatrixPosition(b.matrixWorld),S.position.applyMatrix4(m),s.identity(),n.copy(b.matrixWorld),n.premultiply(m),s.extractRotation(n),S.halfWidth.set(b.width*.5,0,0),S.halfHeight.set(0,b.height*.5,0),S.halfWidth.applyMatrix4(s),S.halfHeight.applyMatrix4(s),_++}else if(b.isPointLight){const S=i.point[h];S.position.setFromMatrixPosition(b.matrixWorld),S.position.applyMatrix4(m),h++}else if(b.isHemisphereLight){const S=i.hemi[v];S.direction.setFromMatrixPosition(b.matrixWorld),S.direction.transformDirection(m),v++}}}return{setup:o,setupView:l,state:i}}function ws(a){const e=new Od(a),t=[],i=[];function r(u){c.camera=u,t.length=0,i.length=0}function n(u){t.push(u)}function s(u){i.push(u)}function o(){e.setup(t)}function l(u){e.setupView(t,u)}const c={lightsArray:t,shadowsArray:i,camera:null,lights:e,transmissionRenderTarget:{}};return{init:r,state:c,setupLights:o,setupLightsView:l,pushLight:n,pushShadow:s}}function Fd(a){let e=new WeakMap;function t(r,n=0){const s=e.get(r);let o;return s===void 0?(o=new ws(a),e.set(r,[o])):n>=s.length?(o=new ws(a),s.push(o)):o=s[n],o}function i(){e=new WeakMap}return{get:t,dispose:i}}class zd extends ra{static get type(){return"MeshDepthMaterial"}constructor(e){super(),this.isMeshDepthMaterial=!0,this.depthPacking=3200,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class Bd extends ra{static get type(){return"MeshDistanceMaterial"}constructor(e){super(),this.isMeshDistanceMaterial=!0,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}const kd=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Gd=`uniform sampler2D shadow_pass;
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
}`;function Vd(a,e,t){let i=new fn;const r=new Le,n=new Le,s=new Qe,o=new zd({depthPacking:3201}),l=new Bd,c={},u=t.maxTextureSize,d={0:1,1:0,2:2},h=new wt({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Le},radius:{value:4}},vertexShader:kd,fragmentShader:Gd}),f=h.clone();f.defines.HORIZONTAL_PASS=1;const _=new mt;_.setAttribute("position",new st(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const v=new Ye(_,h),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=1;let p=this.type;this.render=function(R,A,P){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||R.length===0)return;const E=a.getRenderTarget(),y=a.getActiveCubeFace(),C=a.getActiveMipmapLevel(),z=a.state;z.setBlending(0),z.buffers.color.setClear(1,1,1,1),z.buffers.depth.setTest(!0),z.setScissorTest(!1);const B=p!==3&&this.type===3,j=p===3&&this.type!==3;for(let J=0,$=R.length;J<$;J++){const ie=R[J],X=ie.shadow;if(X===void 0){console.warn("THREE.WebGLShadowMap:",ie,"has no shadow.");continue}if(X.autoUpdate===!1&&X.needsUpdate===!1)continue;r.copy(X.mapSize);const ee=X.getFrameExtents();if(r.multiply(ee),n.copy(X.mapSize),(r.x>u||r.y>u)&&(r.x>u&&(n.x=Math.floor(u/ee.x),r.x=n.x*ee.x,X.mapSize.x=n.x),r.y>u&&(n.y=Math.floor(u/ee.y),r.y=n.y*ee.y,X.mapSize.y=n.y)),X.map===null||B===!0||j===!0){const we=this.type!==3?{minFilter:1003,magFilter:1003}:{};X.map!==null&&X.map.dispose(),X.map=new bi(r.x,r.y,we),X.map.texture.name=ie.name+".shadowMap",X.camera.updateProjectionMatrix()}a.setRenderTarget(X.map),a.clear();const de=X.getViewportCount();for(let we=0;we<de;we++){const be=X.getViewport(we);s.set(n.x*be.x,n.y*be.y,n.x*be.z,n.y*be.w),z.viewport(s),X.updateMatrices(ie,we),i=X.getFrustum(),S(A,P,X.camera,ie,this.type)}X.isPointLightShadow!==!0&&this.type===3&&w(X,P),X.needsUpdate=!1}p=this.type,m.needsUpdate=!1,a.setRenderTarget(E,y,C)};function w(R,A){const P=e.update(v);h.defines.VSM_SAMPLES!==R.blurSamples&&(h.defines.VSM_SAMPLES=R.blurSamples,f.defines.VSM_SAMPLES=R.blurSamples,h.needsUpdate=!0,f.needsUpdate=!0),R.mapPass===null&&(R.mapPass=new bi(r.x,r.y)),h.uniforms.shadow_pass.value=R.map.texture,h.uniforms.resolution.value=R.mapSize,h.uniforms.radius.value=R.radius,a.setRenderTarget(R.mapPass),a.clear(),a.renderBufferDirect(A,null,P,h,v,null),f.uniforms.shadow_pass.value=R.mapPass.texture,f.uniforms.resolution.value=R.mapSize,f.uniforms.radius.value=R.radius,a.setRenderTarget(R.map),a.clear(),a.renderBufferDirect(A,null,P,f,v,null)}function b(R,A,P,E){let y=null;const C=P.isPointLight===!0?R.customDistanceMaterial:R.customDepthMaterial;if(C!==void 0)y=C;else if(y=P.isPointLight===!0?l:o,a.localClippingEnabled&&A.clipShadows===!0&&Array.isArray(A.clippingPlanes)&&A.clippingPlanes.length!==0||A.displacementMap&&A.displacementScale!==0||A.alphaMap&&A.alphaTest>0||A.map&&A.alphaTest>0){const z=y.uuid,B=A.uuid;let j=c[z];j===void 0&&(j={},c[z]=j);let J=j[B];J===void 0&&(J=y.clone(),j[B]=J,A.addEventListener("dispose",N)),y=J}if(y.visible=A.visible,y.wireframe=A.wireframe,E===3?y.side=A.shadowSide!==null?A.shadowSide:A.side:y.side=A.shadowSide!==null?A.shadowSide:d[A.side],y.alphaMap=A.alphaMap,y.alphaTest=A.alphaTest,y.map=A.map,y.clipShadows=A.clipShadows,y.clippingPlanes=A.clippingPlanes,y.clipIntersection=A.clipIntersection,y.displacementMap=A.displacementMap,y.displacementScale=A.displacementScale,y.displacementBias=A.displacementBias,y.wireframeLinewidth=A.wireframeLinewidth,y.linewidth=A.linewidth,P.isPointLight===!0&&y.isMeshDistanceMaterial===!0){const z=a.properties.get(y);z.light=P}return y}function S(R,A,P,E,y){if(R.visible===!1)return;if(R.layers.test(A.layers)&&(R.isMesh||R.isLine||R.isPoints)&&(R.castShadow||R.receiveShadow&&y===3)&&(!R.frustumCulled||i.intersectsObject(R))){R.modelViewMatrix.multiplyMatrices(P.matrixWorldInverse,R.matrixWorld);const z=e.update(R),B=R.material;if(Array.isArray(B)){const j=z.groups;for(let J=0,$=j.length;J<$;J++){const ie=j[J],X=B[ie.materialIndex];if(X&&X.visible){const ee=b(R,X,E,y);R.onBeforeShadow(a,R,A,P,z,ee,ie),a.renderBufferDirect(P,null,z,ee,R,ie),R.onAfterShadow(a,R,A,P,z,ee,ie)}}}else if(B.visible){const j=b(R,B,E,y);R.onBeforeShadow(a,R,A,P,z,j,null),a.renderBufferDirect(P,null,z,j,R,null),R.onAfterShadow(a,R,A,P,z,j,null)}}const C=R.children;for(let z=0,B=C.length;z<B;z++)S(C[z],A,P,E,y)}function N(R){R.target.removeEventListener("dispose",N);for(const A in c){const P=c[A],E=R.target.uuid;E in P&&(P[E].dispose(),delete P[E])}}}const Hd={0:1,2:6,4:7,3:5,1:0,6:2,7:4,5:3};function Wd(a,e){function t(){let I=!1;const ce=new Qe;let W=null;const Q=new Qe(0,0,0,0);return{setMask:function(ue){W!==ue&&!I&&(a.colorMask(ue,ue,ue,ue),W=ue)},setLocked:function(ue){I=ue},setClear:function(ue,oe,Ge,ot,gt){gt===!0&&(ue*=ot,oe*=ot,Ge*=ot),ce.set(ue,oe,Ge,ot),Q.equals(ce)===!1&&(a.clearColor(ue,oe,Ge,ot),Q.copy(ce))},reset:function(){I=!1,W=null,Q.set(-1,0,0,0)}}}function i(){let I=!1,ce=!1,W=null,Q=null,ue=null;return{setReversed:function(oe){if(ce!==oe){const Ge=e.get("EXT_clip_control");ce?Ge.clipControlEXT(Ge.LOWER_LEFT_EXT,Ge.ZERO_TO_ONE_EXT):Ge.clipControlEXT(Ge.LOWER_LEFT_EXT,Ge.NEGATIVE_ONE_TO_ONE_EXT);const ot=ue;ue=null,this.setClear(ot)}ce=oe},getReversed:function(){return ce},setTest:function(oe){oe?se(a.DEPTH_TEST):xe(a.DEPTH_TEST)},setMask:function(oe){W!==oe&&!I&&(a.depthMask(oe),W=oe)},setFunc:function(oe){if(ce&&(oe=Hd[oe]),Q!==oe){switch(oe){case 0:a.depthFunc(a.NEVER);break;case 1:a.depthFunc(a.ALWAYS);break;case 2:a.depthFunc(a.LESS);break;case 3:a.depthFunc(a.LEQUAL);break;case 4:a.depthFunc(a.EQUAL);break;case 5:a.depthFunc(a.GEQUAL);break;case 6:a.depthFunc(a.GREATER);break;case 7:a.depthFunc(a.NOTEQUAL);break;default:a.depthFunc(a.LEQUAL)}Q=oe}},setLocked:function(oe){I=oe},setClear:function(oe){ue!==oe&&(ce&&(oe=1-oe),a.clearDepth(oe),ue=oe)},reset:function(){I=!1,W=null,Q=null,ue=null,ce=!1}}}function r(){let I=!1,ce=null,W=null,Q=null,ue=null,oe=null,Ge=null,ot=null,gt=null;return{setTest:function($e){I||($e?se(a.STENCIL_TEST):xe(a.STENCIL_TEST))},setMask:function($e){ce!==$e&&!I&&(a.stencilMask($e),ce=$e)},setFunc:function($e,zt,qt){(W!==$e||Q!==zt||ue!==qt)&&(a.stencilFunc($e,zt,qt),W=$e,Q=zt,ue=qt)},setOp:function($e,zt,qt){(oe!==$e||Ge!==zt||ot!==qt)&&(a.stencilOp($e,zt,qt),oe=$e,Ge=zt,ot=qt)},setLocked:function($e){I=$e},setClear:function($e){gt!==$e&&(a.clearStencil($e),gt=$e)},reset:function(){I=!1,ce=null,W=null,Q=null,ue=null,oe=null,Ge=null,ot=null,gt=null}}}const n=new t,s=new i,o=new r,l=new WeakMap,c=new WeakMap;let u={},d={},h=new WeakMap,f=[],_=null,v=!1,m=null,p=null,w=null,b=null,S=null,N=null,R=null,A=new Se(0,0,0),P=0,E=!1,y=null,C=null,z=null,B=null,j=null;const J=a.getParameter(a.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let $=!1,ie=0;const X=a.getParameter(a.VERSION);X.indexOf("WebGL")!==-1?(ie=parseFloat(/^WebGL (\d)/.exec(X)[1]),$=ie>=1):X.indexOf("OpenGL ES")!==-1&&(ie=parseFloat(/^OpenGL ES (\d)/.exec(X)[1]),$=ie>=2);let ee=null,de={};const we=a.getParameter(a.SCISSOR_BOX),be=a.getParameter(a.VIEWPORT),je=new Qe().fromArray(we),Y=new Qe().fromArray(be);function re(I,ce,W,Q){const ue=new Uint8Array(4),oe=a.createTexture();a.bindTexture(I,oe),a.texParameteri(I,a.TEXTURE_MIN_FILTER,a.NEAREST),a.texParameteri(I,a.TEXTURE_MAG_FILTER,a.NEAREST);for(let Ge=0;Ge<W;Ge++)I===a.TEXTURE_3D||I===a.TEXTURE_2D_ARRAY?a.texImage3D(ce,0,a.RGBA,1,1,Q,0,a.RGBA,a.UNSIGNED_BYTE,ue):a.texImage2D(ce+Ge,0,a.RGBA,1,1,0,a.RGBA,a.UNSIGNED_BYTE,ue);return oe}const ve={};ve[a.TEXTURE_2D]=re(a.TEXTURE_2D,a.TEXTURE_2D,1),ve[a.TEXTURE_CUBE_MAP]=re(a.TEXTURE_CUBE_MAP,a.TEXTURE_CUBE_MAP_POSITIVE_X,6),ve[a.TEXTURE_2D_ARRAY]=re(a.TEXTURE_2D_ARRAY,a.TEXTURE_2D_ARRAY,1,1),ve[a.TEXTURE_3D]=re(a.TEXTURE_3D,a.TEXTURE_3D,1,1),n.setClear(0,0,0,1),s.setClear(1),o.setClear(0),se(a.DEPTH_TEST),s.setFunc(3),ze(!1),Oe(1),se(a.CULL_FACE),D(0);function se(I){u[I]!==!0&&(a.enable(I),u[I]=!0)}function xe(I){u[I]!==!1&&(a.disable(I),u[I]=!1)}function Ae(I,ce){return d[I]!==ce?(a.bindFramebuffer(I,ce),d[I]=ce,I===a.DRAW_FRAMEBUFFER&&(d[a.FRAMEBUFFER]=ce),I===a.FRAMEBUFFER&&(d[a.DRAW_FRAMEBUFFER]=ce),!0):!1}function Ue(I,ce){let W=f,Q=!1;if(I){W=h.get(ce),W===void 0&&(W=[],h.set(ce,W));const ue=I.textures;if(W.length!==ue.length||W[0]!==a.COLOR_ATTACHMENT0){for(let oe=0,Ge=ue.length;oe<Ge;oe++)W[oe]=a.COLOR_ATTACHMENT0+oe;W.length=ue.length,Q=!0}}else W[0]!==a.BACK&&(W[0]=a.BACK,Q=!0);Q&&a.drawBuffers(W)}function tt(I){return _!==I?(a.useProgram(I),_=I,!0):!1}const Be={100:a.FUNC_ADD,101:a.FUNC_SUBTRACT,102:a.FUNC_REVERSE_SUBTRACT};Be[103]=a.MIN,Be[104]=a.MAX;const He={200:a.ZERO,201:a.ONE,202:a.SRC_COLOR,204:a.SRC_ALPHA,210:a.SRC_ALPHA_SATURATE,208:a.DST_COLOR,206:a.DST_ALPHA,203:a.ONE_MINUS_SRC_COLOR,205:a.ONE_MINUS_SRC_ALPHA,209:a.ONE_MINUS_DST_COLOR,207:a.ONE_MINUS_DST_ALPHA,211:a.CONSTANT_COLOR,212:a.ONE_MINUS_CONSTANT_COLOR,213:a.CONSTANT_ALPHA,214:a.ONE_MINUS_CONSTANT_ALPHA};function D(I,ce,W,Q,ue,oe,Ge,ot,gt,$e){if(I===0){v===!0&&(xe(a.BLEND),v=!1);return}if(v===!1&&(se(a.BLEND),v=!0),I!==5){if(I!==m||$e!==E){if((p!==100||S!==100)&&(a.blendEquation(a.FUNC_ADD),p=100,S=100),$e)switch(I){case 1:a.blendFuncSeparate(a.ONE,a.ONE_MINUS_SRC_ALPHA,a.ONE,a.ONE_MINUS_SRC_ALPHA);break;case 2:a.blendFunc(a.ONE,a.ONE);break;case 3:a.blendFuncSeparate(a.ZERO,a.ONE_MINUS_SRC_COLOR,a.ZERO,a.ONE);break;case 4:a.blendFuncSeparate(a.ZERO,a.SRC_COLOR,a.ZERO,a.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",I);break}else switch(I){case 1:a.blendFuncSeparate(a.SRC_ALPHA,a.ONE_MINUS_SRC_ALPHA,a.ONE,a.ONE_MINUS_SRC_ALPHA);break;case 2:a.blendFunc(a.SRC_ALPHA,a.ONE);break;case 3:a.blendFuncSeparate(a.ZERO,a.ONE_MINUS_SRC_COLOR,a.ZERO,a.ONE);break;case 4:a.blendFunc(a.ZERO,a.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",I);break}w=null,b=null,N=null,R=null,A.set(0,0,0),P=0,m=I,E=$e}return}ue=ue||ce,oe=oe||W,Ge=Ge||Q,(ce!==p||ue!==S)&&(a.blendEquationSeparate(Be[ce],Be[ue]),p=ce,S=ue),(W!==w||Q!==b||oe!==N||Ge!==R)&&(a.blendFuncSeparate(He[W],He[Q],He[oe],He[Ge]),w=W,b=Q,N=oe,R=Ge),(ot.equals(A)===!1||gt!==P)&&(a.blendColor(ot.r,ot.g,ot.b,gt),A.copy(ot),P=gt),m=I,E=!1}function Tt(I,ce){I.side===2?xe(a.CULL_FACE):se(a.CULL_FACE);let W=I.side===1;ce&&(W=!W),ze(W),I.blending===1&&I.transparent===!1?D(0):D(I.blending,I.blendEquation,I.blendSrc,I.blendDst,I.blendEquationAlpha,I.blendSrcAlpha,I.blendDstAlpha,I.blendColor,I.blendAlpha,I.premultipliedAlpha),s.setFunc(I.depthFunc),s.setTest(I.depthTest),s.setMask(I.depthWrite),n.setMask(I.colorWrite);const Q=I.stencilWrite;o.setTest(Q),Q&&(o.setMask(I.stencilWriteMask),o.setFunc(I.stencilFunc,I.stencilRef,I.stencilFuncMask),o.setOp(I.stencilFail,I.stencilZFail,I.stencilZPass)),V(I.polygonOffset,I.polygonOffsetFactor,I.polygonOffsetUnits),I.alphaToCoverage===!0?se(a.SAMPLE_ALPHA_TO_COVERAGE):xe(a.SAMPLE_ALPHA_TO_COVERAGE)}function ze(I){y!==I&&(I?a.frontFace(a.CW):a.frontFace(a.CCW),y=I)}function Oe(I){I!==0?(se(a.CULL_FACE),I!==C&&(I===1?a.cullFace(a.BACK):I===2?a.cullFace(a.FRONT):a.cullFace(a.FRONT_AND_BACK))):xe(a.CULL_FACE),C=I}function F(I){I!==z&&($&&a.lineWidth(I),z=I)}function V(I,ce,W){I?(se(a.POLYGON_OFFSET_FILL),(B!==ce||j!==W)&&(a.polygonOffset(ce,W),B=ce,j=W)):xe(a.POLYGON_OFFSET_FILL)}function H(I){I?se(a.SCISSOR_TEST):xe(a.SCISSOR_TEST)}function x(I){I===void 0&&(I=a.TEXTURE0+J-1),ee!==I&&(a.activeTexture(I),ee=I)}function g(I,ce,W){W===void 0&&(ee===null?W=a.TEXTURE0+J-1:W=ee);let Q=de[W];Q===void 0&&(Q={type:void 0,texture:void 0},de[W]=Q),(Q.type!==I||Q.texture!==ce)&&(ee!==W&&(a.activeTexture(W),ee=W),a.bindTexture(I,ce||ve[I]),Q.type=I,Q.texture=ce)}function O(){const I=de[ee];I!==void 0&&I.type!==void 0&&(a.bindTexture(I.type,null),I.type=void 0,I.texture=void 0)}function q(){try{a.compressedTexImage2D.apply(a,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function Z(){try{a.compressedTexImage3D.apply(a,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function K(){try{a.texSubImage2D.apply(a,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function pe(){try{a.texSubImage3D.apply(a,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function ne(){try{a.compressedTexSubImage2D.apply(a,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function he(){try{a.compressedTexSubImage3D.apply(a,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function Fe(){try{a.texStorage2D.apply(a,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function ae(){try{a.texStorage3D.apply(a,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function me(){try{a.texImage2D.apply(a,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function Te(){try{a.texImage3D.apply(a,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function Re(I){je.equals(I)===!1&&(a.scissor(I.x,I.y,I.z,I.w),je.copy(I))}function ge(I){Y.equals(I)===!1&&(a.viewport(I.x,I.y,I.z,I.w),Y.copy(I))}function ke(I,ce){let W=c.get(ce);W===void 0&&(W=new WeakMap,c.set(ce,W));let Q=W.get(I);Q===void 0&&(Q=a.getUniformBlockIndex(ce,I.name),W.set(I,Q))}function De(I,ce){const W=c.get(ce).get(I);l.get(ce)!==W&&(a.uniformBlockBinding(ce,W,I.__bindingPointIndex),l.set(ce,W))}function Ze(){a.disable(a.BLEND),a.disable(a.CULL_FACE),a.disable(a.DEPTH_TEST),a.disable(a.POLYGON_OFFSET_FILL),a.disable(a.SCISSOR_TEST),a.disable(a.STENCIL_TEST),a.disable(a.SAMPLE_ALPHA_TO_COVERAGE),a.blendEquation(a.FUNC_ADD),a.blendFunc(a.ONE,a.ZERO),a.blendFuncSeparate(a.ONE,a.ZERO,a.ONE,a.ZERO),a.blendColor(0,0,0,0),a.colorMask(!0,!0,!0,!0),a.clearColor(0,0,0,0),a.depthMask(!0),a.depthFunc(a.LESS),s.setReversed(!1),a.clearDepth(1),a.stencilMask(4294967295),a.stencilFunc(a.ALWAYS,0,4294967295),a.stencilOp(a.KEEP,a.KEEP,a.KEEP),a.clearStencil(0),a.cullFace(a.BACK),a.frontFace(a.CCW),a.polygonOffset(0,0),a.activeTexture(a.TEXTURE0),a.bindFramebuffer(a.FRAMEBUFFER,null),a.bindFramebuffer(a.DRAW_FRAMEBUFFER,null),a.bindFramebuffer(a.READ_FRAMEBUFFER,null),a.useProgram(null),a.lineWidth(1),a.scissor(0,0,a.canvas.width,a.canvas.height),a.viewport(0,0,a.canvas.width,a.canvas.height),u={},ee=null,de={},d={},h=new WeakMap,f=[],_=null,v=!1,m=null,p=null,w=null,b=null,S=null,N=null,R=null,A=new Se(0,0,0),P=0,E=!1,y=null,C=null,z=null,B=null,j=null,je.set(0,0,a.canvas.width,a.canvas.height),Y.set(0,0,a.canvas.width,a.canvas.height),n.reset(),s.reset(),o.reset()}return{buffers:{color:n,depth:s,stencil:o},enable:se,disable:xe,bindFramebuffer:Ae,drawBuffers:Ue,useProgram:tt,setBlending:D,setMaterial:Tt,setFlipSided:ze,setCullFace:Oe,setLineWidth:F,setPolygonOffset:V,setScissorTest:H,activeTexture:x,bindTexture:g,unbindTexture:O,compressedTexImage2D:q,compressedTexImage3D:Z,texImage2D:me,texImage3D:Te,updateUBOMapping:ke,uniformBlockBinding:De,texStorage2D:Fe,texStorage3D:ae,texSubImage2D:K,texSubImage3D:pe,compressedTexSubImage2D:ne,compressedTexSubImage3D:he,scissor:Re,viewport:ge,reset:Ze}}function Ts(a,e,t,i){const r=Xd(i);switch(t){case 1021:return a*e;case 1024:return a*e;case 1025:return a*e*2;case 1028:return a*e/r.components*r.byteLength;case 1029:return a*e/r.components*r.byteLength;case 1030:return a*e*2/r.components*r.byteLength;case 1031:return a*e*2/r.components*r.byteLength;case 1022:return a*e*3/r.components*r.byteLength;case 1023:return a*e*4/r.components*r.byteLength;case 1033:return a*e*4/r.components*r.byteLength;case 33776:case 33777:return Math.floor((a+3)/4)*Math.floor((e+3)/4)*8;case 33778:case 33779:return Math.floor((a+3)/4)*Math.floor((e+3)/4)*16;case 35841:case 35843:return Math.max(a,16)*Math.max(e,8)/4;case 35840:case 35842:return Math.max(a,8)*Math.max(e,8)/2;case 36196:case 37492:return Math.floor((a+3)/4)*Math.floor((e+3)/4)*8;case 37496:return Math.floor((a+3)/4)*Math.floor((e+3)/4)*16;case 37808:return Math.floor((a+3)/4)*Math.floor((e+3)/4)*16;case 37809:return Math.floor((a+4)/5)*Math.floor((e+3)/4)*16;case 37810:return Math.floor((a+4)/5)*Math.floor((e+4)/5)*16;case 37811:return Math.floor((a+5)/6)*Math.floor((e+4)/5)*16;case 37812:return Math.floor((a+5)/6)*Math.floor((e+5)/6)*16;case 37813:return Math.floor((a+7)/8)*Math.floor((e+4)/5)*16;case 37814:return Math.floor((a+7)/8)*Math.floor((e+5)/6)*16;case 37815:return Math.floor((a+7)/8)*Math.floor((e+7)/8)*16;case 37816:return Math.floor((a+9)/10)*Math.floor((e+4)/5)*16;case 37817:return Math.floor((a+9)/10)*Math.floor((e+5)/6)*16;case 37818:return Math.floor((a+9)/10)*Math.floor((e+7)/8)*16;case 37819:return Math.floor((a+9)/10)*Math.floor((e+9)/10)*16;case 37820:return Math.floor((a+11)/12)*Math.floor((e+9)/10)*16;case 37821:return Math.floor((a+11)/12)*Math.floor((e+11)/12)*16;case 36492:case 36494:case 36495:return Math.ceil(a/4)*Math.ceil(e/4)*16;case 36283:case 36284:return Math.ceil(a/4)*Math.ceil(e/4)*8;case 36285:case 36286:return Math.ceil(a/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function Xd(a){switch(a){case 1009:case 1010:return{byteLength:1,components:1};case 1012:case 1011:case 1016:return{byteLength:2,components:1};case 1017:case 1018:return{byteLength:2,components:4};case 1014:case 1013:case 1015:return{byteLength:4,components:1};case 35902:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${a}.`)}function jd(a,e,t,i,r,n,s){const o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new Le,u=new WeakMap;let d;const h=new WeakMap;let f=!1;try{f=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function _(x,g){return f?new OffscreenCanvas(x,g):Ra("canvas")}function v(x,g,O){let q=1;const Z=H(x);if((Z.width>O||Z.height>O)&&(q=O/Math.max(Z.width,Z.height)),q<1)if(typeof HTMLImageElement<"u"&&x instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&x instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&x instanceof ImageBitmap||typeof VideoFrame<"u"&&x instanceof VideoFrame){const K=Math.floor(q*Z.width),pe=Math.floor(q*Z.height);d===void 0&&(d=_(K,pe));const ne=g?_(K,pe):d;return ne.width=K,ne.height=pe,ne.getContext("2d").drawImage(x,0,0,K,pe),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+Z.width+"x"+Z.height+") to ("+K+"x"+pe+")."),ne}else return"data"in x&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+Z.width+"x"+Z.height+")."),x;return x}function m(x){return x.generateMipmaps}function p(x){a.generateMipmap(x)}function w(x){return x.isWebGLCubeRenderTarget?a.TEXTURE_CUBE_MAP:x.isWebGL3DRenderTarget?a.TEXTURE_3D:x.isWebGLArrayRenderTarget||x.isCompressedArrayTexture?a.TEXTURE_2D_ARRAY:a.TEXTURE_2D}function b(x,g,O,q,Z=!1){if(x!==null){if(a[x]!==void 0)return a[x];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+x+"'")}let K=g;if(g===a.RED&&(O===a.FLOAT&&(K=a.R32F),O===a.HALF_FLOAT&&(K=a.R16F),O===a.UNSIGNED_BYTE&&(K=a.R8)),g===a.RED_INTEGER&&(O===a.UNSIGNED_BYTE&&(K=a.R8UI),O===a.UNSIGNED_SHORT&&(K=a.R16UI),O===a.UNSIGNED_INT&&(K=a.R32UI),O===a.BYTE&&(K=a.R8I),O===a.SHORT&&(K=a.R16I),O===a.INT&&(K=a.R32I)),g===a.RG&&(O===a.FLOAT&&(K=a.RG32F),O===a.HALF_FLOAT&&(K=a.RG16F),O===a.UNSIGNED_BYTE&&(K=a.RG8)),g===a.RG_INTEGER&&(O===a.UNSIGNED_BYTE&&(K=a.RG8UI),O===a.UNSIGNED_SHORT&&(K=a.RG16UI),O===a.UNSIGNED_INT&&(K=a.RG32UI),O===a.BYTE&&(K=a.RG8I),O===a.SHORT&&(K=a.RG16I),O===a.INT&&(K=a.RG32I)),g===a.RGB_INTEGER&&(O===a.UNSIGNED_BYTE&&(K=a.RGB8UI),O===a.UNSIGNED_SHORT&&(K=a.RGB16UI),O===a.UNSIGNED_INT&&(K=a.RGB32UI),O===a.BYTE&&(K=a.RGB8I),O===a.SHORT&&(K=a.RGB16I),O===a.INT&&(K=a.RGB32I)),g===a.RGBA_INTEGER&&(O===a.UNSIGNED_BYTE&&(K=a.RGBA8UI),O===a.UNSIGNED_SHORT&&(K=a.RGBA16UI),O===a.UNSIGNED_INT&&(K=a.RGBA32UI),O===a.BYTE&&(K=a.RGBA8I),O===a.SHORT&&(K=a.RGBA16I),O===a.INT&&(K=a.RGBA32I)),g===a.RGB&&O===a.UNSIGNED_INT_5_9_9_9_REV&&(K=a.RGB9_E5),g===a.RGBA){const pe=Z?lr:Ve.getTransfer(q);O===a.FLOAT&&(K=a.RGBA32F),O===a.HALF_FLOAT&&(K=a.RGBA16F),O===a.UNSIGNED_BYTE&&(K=pe===Ke?a.SRGB8_ALPHA8:a.RGBA8),O===a.UNSIGNED_SHORT_4_4_4_4&&(K=a.RGBA4),O===a.UNSIGNED_SHORT_5_5_5_1&&(K=a.RGB5_A1)}return(K===a.R16F||K===a.R32F||K===a.RG16F||K===a.RG32F||K===a.RGBA16F||K===a.RGBA32F)&&e.get("EXT_color_buffer_float"),K}function S(x,g){let O;return x?g===null||g===1014||g===1020?O=a.DEPTH24_STENCIL8:g===1015?O=a.DEPTH32F_STENCIL8:g===1012&&(O=a.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):g===null||g===1014||g===1020?O=a.DEPTH_COMPONENT24:g===1015?O=a.DEPTH_COMPONENT32F:g===1012&&(O=a.DEPTH_COMPONENT16),O}function N(x,g){return m(x)===!0||x.isFramebufferTexture&&x.minFilter!==1003&&x.minFilter!==1006?Math.log2(Math.max(g.width,g.height))+1:x.mipmaps!==void 0&&x.mipmaps.length>0?x.mipmaps.length:x.isCompressedTexture&&Array.isArray(x.image)?g.mipmaps.length:1}function R(x){const g=x.target;g.removeEventListener("dispose",R),P(g),g.isVideoTexture&&u.delete(g)}function A(x){const g=x.target;g.removeEventListener("dispose",A),y(g)}function P(x){const g=i.get(x);if(g.__webglInit===void 0)return;const O=x.source,q=h.get(O);if(q){const Z=q[g.__cacheKey];Z.usedTimes--,Z.usedTimes===0&&E(x),Object.keys(q).length===0&&h.delete(O)}i.remove(x)}function E(x){const g=i.get(x);a.deleteTexture(g.__webglTexture);const O=x.source,q=h.get(O);delete q[g.__cacheKey],s.memory.textures--}function y(x){const g=i.get(x);if(x.depthTexture&&(x.depthTexture.dispose(),i.remove(x.depthTexture)),x.isWebGLCubeRenderTarget)for(let q=0;q<6;q++){if(Array.isArray(g.__webglFramebuffer[q]))for(let Z=0;Z<g.__webglFramebuffer[q].length;Z++)a.deleteFramebuffer(g.__webglFramebuffer[q][Z]);else a.deleteFramebuffer(g.__webglFramebuffer[q]);g.__webglDepthbuffer&&a.deleteRenderbuffer(g.__webglDepthbuffer[q])}else{if(Array.isArray(g.__webglFramebuffer))for(let q=0;q<g.__webglFramebuffer.length;q++)a.deleteFramebuffer(g.__webglFramebuffer[q]);else a.deleteFramebuffer(g.__webglFramebuffer);if(g.__webglDepthbuffer&&a.deleteRenderbuffer(g.__webglDepthbuffer),g.__webglMultisampledFramebuffer&&a.deleteFramebuffer(g.__webglMultisampledFramebuffer),g.__webglColorRenderbuffer)for(let q=0;q<g.__webglColorRenderbuffer.length;q++)g.__webglColorRenderbuffer[q]&&a.deleteRenderbuffer(g.__webglColorRenderbuffer[q]);g.__webglDepthRenderbuffer&&a.deleteRenderbuffer(g.__webglDepthRenderbuffer)}const O=x.textures;for(let q=0,Z=O.length;q<Z;q++){const K=i.get(O[q]);K.__webglTexture&&(a.deleteTexture(K.__webglTexture),s.memory.textures--),i.remove(O[q])}i.remove(x)}let C=0;function z(){C=0}function B(){const x=C;return x>=r.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+x+" texture units while this GPU supports only "+r.maxTextures),C+=1,x}function j(x){const g=[];return g.push(x.wrapS),g.push(x.wrapT),g.push(x.wrapR||0),g.push(x.magFilter),g.push(x.minFilter),g.push(x.anisotropy),g.push(x.internalFormat),g.push(x.format),g.push(x.type),g.push(x.generateMipmaps),g.push(x.premultiplyAlpha),g.push(x.flipY),g.push(x.unpackAlignment),g.push(x.colorSpace),g.join()}function J(x,g){const O=i.get(x);if(x.isVideoTexture&&F(x),x.isRenderTargetTexture===!1&&x.version>0&&O.__version!==x.version){const q=x.image;if(q===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(q.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{Y(O,x,g);return}}t.bindTexture(a.TEXTURE_2D,O.__webglTexture,a.TEXTURE0+g)}function $(x,g){const O=i.get(x);if(x.version>0&&O.__version!==x.version){Y(O,x,g);return}t.bindTexture(a.TEXTURE_2D_ARRAY,O.__webglTexture,a.TEXTURE0+g)}function ie(x,g){const O=i.get(x);if(x.version>0&&O.__version!==x.version){Y(O,x,g);return}t.bindTexture(a.TEXTURE_3D,O.__webglTexture,a.TEXTURE0+g)}function X(x,g){const O=i.get(x);if(x.version>0&&O.__version!==x.version){re(O,x,g);return}t.bindTexture(a.TEXTURE_CUBE_MAP,O.__webglTexture,a.TEXTURE0+g)}const ee={1e3:a.REPEAT,1001:a.CLAMP_TO_EDGE,1002:a.MIRRORED_REPEAT},de={1003:a.NEAREST,1004:a.NEAREST_MIPMAP_NEAREST,1005:a.NEAREST_MIPMAP_LINEAR,1006:a.LINEAR,1007:a.LINEAR_MIPMAP_NEAREST,1008:a.LINEAR_MIPMAP_LINEAR},we={512:a.NEVER,519:a.ALWAYS,513:a.LESS,515:a.LEQUAL,514:a.EQUAL,518:a.GEQUAL,516:a.GREATER,517:a.NOTEQUAL};function be(x,g){if(g.type===1015&&e.has("OES_texture_float_linear")===!1&&(g.magFilter===1006||g.magFilter===1007||g.magFilter===1005||g.magFilter===1008||g.minFilter===1006||g.minFilter===1007||g.minFilter===1005||g.minFilter===1008)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),a.texParameteri(x,a.TEXTURE_WRAP_S,ee[g.wrapS]),a.texParameteri(x,a.TEXTURE_WRAP_T,ee[g.wrapT]),(x===a.TEXTURE_3D||x===a.TEXTURE_2D_ARRAY)&&a.texParameteri(x,a.TEXTURE_WRAP_R,ee[g.wrapR]),a.texParameteri(x,a.TEXTURE_MAG_FILTER,de[g.magFilter]),a.texParameteri(x,a.TEXTURE_MIN_FILTER,de[g.minFilter]),g.compareFunction&&(a.texParameteri(x,a.TEXTURE_COMPARE_MODE,a.COMPARE_REF_TO_TEXTURE),a.texParameteri(x,a.TEXTURE_COMPARE_FUNC,we[g.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(g.magFilter===1003||g.minFilter!==1005&&g.minFilter!==1008||g.type===1015&&e.has("OES_texture_float_linear")===!1)return;if(g.anisotropy>1||i.get(g).__currentAnisotropy){const O=e.get("EXT_texture_filter_anisotropic");a.texParameterf(x,O.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(g.anisotropy,r.getMaxAnisotropy())),i.get(g).__currentAnisotropy=g.anisotropy}}}function je(x,g){let O=!1;x.__webglInit===void 0&&(x.__webglInit=!0,g.addEventListener("dispose",R));const q=g.source;let Z=h.get(q);Z===void 0&&(Z={},h.set(q,Z));const K=j(g);if(K!==x.__cacheKey){Z[K]===void 0&&(Z[K]={texture:a.createTexture(),usedTimes:0},s.memory.textures++,O=!0),Z[K].usedTimes++;const pe=Z[x.__cacheKey];pe!==void 0&&(Z[x.__cacheKey].usedTimes--,pe.usedTimes===0&&E(g)),x.__cacheKey=K,x.__webglTexture=Z[K].texture}return O}function Y(x,g,O){let q=a.TEXTURE_2D;(g.isDataArrayTexture||g.isCompressedArrayTexture)&&(q=a.TEXTURE_2D_ARRAY),g.isData3DTexture&&(q=a.TEXTURE_3D);const Z=je(x,g),K=g.source;t.bindTexture(q,x.__webglTexture,a.TEXTURE0+O);const pe=i.get(K);if(K.version!==pe.__version||Z===!0){t.activeTexture(a.TEXTURE0+O);const ne=Ve.getPrimaries(Ve.workingColorSpace),he=g.colorSpace===""?null:Ve.getPrimaries(g.colorSpace),Fe=g.colorSpace===""||ne===he?a.NONE:a.BROWSER_DEFAULT_WEBGL;a.pixelStorei(a.UNPACK_FLIP_Y_WEBGL,g.flipY),a.pixelStorei(a.UNPACK_PREMULTIPLY_ALPHA_WEBGL,g.premultiplyAlpha),a.pixelStorei(a.UNPACK_ALIGNMENT,g.unpackAlignment),a.pixelStorei(a.UNPACK_COLORSPACE_CONVERSION_WEBGL,Fe);let ae=v(g.image,!1,r.maxTextureSize);ae=V(g,ae);const me=n.convert(g.format,g.colorSpace),Te=n.convert(g.type);let Re=b(g.internalFormat,me,Te,g.colorSpace,g.isVideoTexture);be(q,g);let ge;const ke=g.mipmaps,De=g.isVideoTexture!==!0,Ze=pe.__version===void 0||Z===!0,I=K.dataReady,ce=N(g,ae);if(g.isDepthTexture)Re=S(g.format===1027,g.type),Ze&&(De?t.texStorage2D(a.TEXTURE_2D,1,Re,ae.width,ae.height):t.texImage2D(a.TEXTURE_2D,0,Re,ae.width,ae.height,0,me,Te,null));else if(g.isDataTexture)if(ke.length>0){De&&Ze&&t.texStorage2D(a.TEXTURE_2D,ce,Re,ke[0].width,ke[0].height);for(let W=0,Q=ke.length;W<Q;W++)ge=ke[W],De?I&&t.texSubImage2D(a.TEXTURE_2D,W,0,0,ge.width,ge.height,me,Te,ge.data):t.texImage2D(a.TEXTURE_2D,W,Re,ge.width,ge.height,0,me,Te,ge.data);g.generateMipmaps=!1}else De?(Ze&&t.texStorage2D(a.TEXTURE_2D,ce,Re,ae.width,ae.height),I&&t.texSubImage2D(a.TEXTURE_2D,0,0,0,ae.width,ae.height,me,Te,ae.data)):t.texImage2D(a.TEXTURE_2D,0,Re,ae.width,ae.height,0,me,Te,ae.data);else if(g.isCompressedTexture)if(g.isCompressedArrayTexture){De&&Ze&&t.texStorage3D(a.TEXTURE_2D_ARRAY,ce,Re,ke[0].width,ke[0].height,ae.depth);for(let W=0,Q=ke.length;W<Q;W++)if(ge=ke[W],g.format!==1023)if(me!==null)if(De){if(I)if(g.layerUpdates.size>0){const ue=Ts(ge.width,ge.height,g.format,g.type);for(const oe of g.layerUpdates){const Ge=ge.data.subarray(oe*ue/ge.data.BYTES_PER_ELEMENT,(oe+1)*ue/ge.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(a.TEXTURE_2D_ARRAY,W,0,0,oe,ge.width,ge.height,1,me,Ge)}g.clearLayerUpdates()}else t.compressedTexSubImage3D(a.TEXTURE_2D_ARRAY,W,0,0,0,ge.width,ge.height,ae.depth,me,ge.data)}else t.compressedTexImage3D(a.TEXTURE_2D_ARRAY,W,Re,ge.width,ge.height,ae.depth,0,ge.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else De?I&&t.texSubImage3D(a.TEXTURE_2D_ARRAY,W,0,0,0,ge.width,ge.height,ae.depth,me,Te,ge.data):t.texImage3D(a.TEXTURE_2D_ARRAY,W,Re,ge.width,ge.height,ae.depth,0,me,Te,ge.data)}else{De&&Ze&&t.texStorage2D(a.TEXTURE_2D,ce,Re,ke[0].width,ke[0].height);for(let W=0,Q=ke.length;W<Q;W++)ge=ke[W],g.format!==1023?me!==null?De?I&&t.compressedTexSubImage2D(a.TEXTURE_2D,W,0,0,ge.width,ge.height,me,ge.data):t.compressedTexImage2D(a.TEXTURE_2D,W,Re,ge.width,ge.height,0,ge.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):De?I&&t.texSubImage2D(a.TEXTURE_2D,W,0,0,ge.width,ge.height,me,Te,ge.data):t.texImage2D(a.TEXTURE_2D,W,Re,ge.width,ge.height,0,me,Te,ge.data)}else if(g.isDataArrayTexture)if(De){if(Ze&&t.texStorage3D(a.TEXTURE_2D_ARRAY,ce,Re,ae.width,ae.height,ae.depth),I)if(g.layerUpdates.size>0){const W=Ts(ae.width,ae.height,g.format,g.type);for(const Q of g.layerUpdates){const ue=ae.data.subarray(Q*W/ae.data.BYTES_PER_ELEMENT,(Q+1)*W/ae.data.BYTES_PER_ELEMENT);t.texSubImage3D(a.TEXTURE_2D_ARRAY,0,0,0,Q,ae.width,ae.height,1,me,Te,ue)}g.clearLayerUpdates()}else t.texSubImage3D(a.TEXTURE_2D_ARRAY,0,0,0,0,ae.width,ae.height,ae.depth,me,Te,ae.data)}else t.texImage3D(a.TEXTURE_2D_ARRAY,0,Re,ae.width,ae.height,ae.depth,0,me,Te,ae.data);else if(g.isData3DTexture)De?(Ze&&t.texStorage3D(a.TEXTURE_3D,ce,Re,ae.width,ae.height,ae.depth),I&&t.texSubImage3D(a.TEXTURE_3D,0,0,0,0,ae.width,ae.height,ae.depth,me,Te,ae.data)):t.texImage3D(a.TEXTURE_3D,0,Re,ae.width,ae.height,ae.depth,0,me,Te,ae.data);else if(g.isFramebufferTexture){if(Ze)if(De)t.texStorage2D(a.TEXTURE_2D,ce,Re,ae.width,ae.height);else{let W=ae.width,Q=ae.height;for(let ue=0;ue<ce;ue++)t.texImage2D(a.TEXTURE_2D,ue,Re,W,Q,0,me,Te,null),W>>=1,Q>>=1}}else if(ke.length>0){if(De&&Ze){const W=H(ke[0]);t.texStorage2D(a.TEXTURE_2D,ce,Re,W.width,W.height)}for(let W=0,Q=ke.length;W<Q;W++)ge=ke[W],De?I&&t.texSubImage2D(a.TEXTURE_2D,W,0,0,me,Te,ge):t.texImage2D(a.TEXTURE_2D,W,Re,me,Te,ge);g.generateMipmaps=!1}else if(De){if(Ze){const W=H(ae);t.texStorage2D(a.TEXTURE_2D,ce,Re,W.width,W.height)}I&&t.texSubImage2D(a.TEXTURE_2D,0,0,0,me,Te,ae)}else t.texImage2D(a.TEXTURE_2D,0,Re,me,Te,ae);m(g)&&p(q),pe.__version=K.version,g.onUpdate&&g.onUpdate(g)}x.__version=g.version}function re(x,g,O){if(g.image.length!==6)return;const q=je(x,g),Z=g.source;t.bindTexture(a.TEXTURE_CUBE_MAP,x.__webglTexture,a.TEXTURE0+O);const K=i.get(Z);if(Z.version!==K.__version||q===!0){t.activeTexture(a.TEXTURE0+O);const pe=Ve.getPrimaries(Ve.workingColorSpace),ne=g.colorSpace===""?null:Ve.getPrimaries(g.colorSpace),he=g.colorSpace===""||pe===ne?a.NONE:a.BROWSER_DEFAULT_WEBGL;a.pixelStorei(a.UNPACK_FLIP_Y_WEBGL,g.flipY),a.pixelStorei(a.UNPACK_PREMULTIPLY_ALPHA_WEBGL,g.premultiplyAlpha),a.pixelStorei(a.UNPACK_ALIGNMENT,g.unpackAlignment),a.pixelStorei(a.UNPACK_COLORSPACE_CONVERSION_WEBGL,he);const Fe=g.isCompressedTexture||g.image[0].isCompressedTexture,ae=g.image[0]&&g.image[0].isDataTexture,me=[];for(let Q=0;Q<6;Q++)!Fe&&!ae?me[Q]=v(g.image[Q],!0,r.maxCubemapSize):me[Q]=ae?g.image[Q].image:g.image[Q],me[Q]=V(g,me[Q]);const Te=me[0],Re=n.convert(g.format,g.colorSpace),ge=n.convert(g.type),ke=b(g.internalFormat,Re,ge,g.colorSpace),De=g.isVideoTexture!==!0,Ze=K.__version===void 0||q===!0,I=Z.dataReady;let ce=N(g,Te);be(a.TEXTURE_CUBE_MAP,g);let W;if(Fe){De&&Ze&&t.texStorage2D(a.TEXTURE_CUBE_MAP,ce,ke,Te.width,Te.height);for(let Q=0;Q<6;Q++){W=me[Q].mipmaps;for(let ue=0;ue<W.length;ue++){const oe=W[ue];g.format!==1023?Re!==null?De?I&&t.compressedTexSubImage2D(a.TEXTURE_CUBE_MAP_POSITIVE_X+Q,ue,0,0,oe.width,oe.height,Re,oe.data):t.compressedTexImage2D(a.TEXTURE_CUBE_MAP_POSITIVE_X+Q,ue,ke,oe.width,oe.height,0,oe.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):De?I&&t.texSubImage2D(a.TEXTURE_CUBE_MAP_POSITIVE_X+Q,ue,0,0,oe.width,oe.height,Re,ge,oe.data):t.texImage2D(a.TEXTURE_CUBE_MAP_POSITIVE_X+Q,ue,ke,oe.width,oe.height,0,Re,ge,oe.data)}}}else{if(W=g.mipmaps,De&&Ze){W.length>0&&ce++;const Q=H(me[0]);t.texStorage2D(a.TEXTURE_CUBE_MAP,ce,ke,Q.width,Q.height)}for(let Q=0;Q<6;Q++)if(ae){De?I&&t.texSubImage2D(a.TEXTURE_CUBE_MAP_POSITIVE_X+Q,0,0,0,me[Q].width,me[Q].height,Re,ge,me[Q].data):t.texImage2D(a.TEXTURE_CUBE_MAP_POSITIVE_X+Q,0,ke,me[Q].width,me[Q].height,0,Re,ge,me[Q].data);for(let ue=0;ue<W.length;ue++){const oe=W[ue].image[Q].image;De?I&&t.texSubImage2D(a.TEXTURE_CUBE_MAP_POSITIVE_X+Q,ue+1,0,0,oe.width,oe.height,Re,ge,oe.data):t.texImage2D(a.TEXTURE_CUBE_MAP_POSITIVE_X+Q,ue+1,ke,oe.width,oe.height,0,Re,ge,oe.data)}}else{De?I&&t.texSubImage2D(a.TEXTURE_CUBE_MAP_POSITIVE_X+Q,0,0,0,Re,ge,me[Q]):t.texImage2D(a.TEXTURE_CUBE_MAP_POSITIVE_X+Q,0,ke,Re,ge,me[Q]);for(let ue=0;ue<W.length;ue++){const oe=W[ue];De?I&&t.texSubImage2D(a.TEXTURE_CUBE_MAP_POSITIVE_X+Q,ue+1,0,0,Re,ge,oe.image[Q]):t.texImage2D(a.TEXTURE_CUBE_MAP_POSITIVE_X+Q,ue+1,ke,Re,ge,oe.image[Q])}}}m(g)&&p(a.TEXTURE_CUBE_MAP),K.__version=Z.version,g.onUpdate&&g.onUpdate(g)}x.__version=g.version}function ve(x,g,O,q,Z,K){const pe=n.convert(O.format,O.colorSpace),ne=n.convert(O.type),he=b(O.internalFormat,pe,ne,O.colorSpace),Fe=i.get(g),ae=i.get(O);if(ae.__renderTarget=g,!Fe.__hasExternalTextures){const me=Math.max(1,g.width>>K),Te=Math.max(1,g.height>>K);Z===a.TEXTURE_3D||Z===a.TEXTURE_2D_ARRAY?t.texImage3D(Z,K,he,me,Te,g.depth,0,pe,ne,null):t.texImage2D(Z,K,he,me,Te,0,pe,ne,null)}t.bindFramebuffer(a.FRAMEBUFFER,x),Oe(g)?o.framebufferTexture2DMultisampleEXT(a.FRAMEBUFFER,q,Z,ae.__webglTexture,0,ze(g)):(Z===a.TEXTURE_2D||Z>=a.TEXTURE_CUBE_MAP_POSITIVE_X&&Z<=a.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&a.framebufferTexture2D(a.FRAMEBUFFER,q,Z,ae.__webglTexture,K),t.bindFramebuffer(a.FRAMEBUFFER,null)}function se(x,g,O){if(a.bindRenderbuffer(a.RENDERBUFFER,x),g.depthBuffer){const q=g.depthTexture,Z=q&&q.isDepthTexture?q.type:null,K=S(g.stencilBuffer,Z),pe=g.stencilBuffer?a.DEPTH_STENCIL_ATTACHMENT:a.DEPTH_ATTACHMENT,ne=ze(g);Oe(g)?o.renderbufferStorageMultisampleEXT(a.RENDERBUFFER,ne,K,g.width,g.height):O?a.renderbufferStorageMultisample(a.RENDERBUFFER,ne,K,g.width,g.height):a.renderbufferStorage(a.RENDERBUFFER,K,g.width,g.height),a.framebufferRenderbuffer(a.FRAMEBUFFER,pe,a.RENDERBUFFER,x)}else{const q=g.textures;for(let Z=0;Z<q.length;Z++){const K=q[Z],pe=n.convert(K.format,K.colorSpace),ne=n.convert(K.type),he=b(K.internalFormat,pe,ne,K.colorSpace),Fe=ze(g);O&&Oe(g)===!1?a.renderbufferStorageMultisample(a.RENDERBUFFER,Fe,he,g.width,g.height):Oe(g)?o.renderbufferStorageMultisampleEXT(a.RENDERBUFFER,Fe,he,g.width,g.height):a.renderbufferStorage(a.RENDERBUFFER,he,g.width,g.height)}}a.bindRenderbuffer(a.RENDERBUFFER,null)}function xe(x,g){if(g&&g.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(a.FRAMEBUFFER,x),!(g.depthTexture&&g.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const O=i.get(g.depthTexture);O.__renderTarget=g,(!O.__webglTexture||g.depthTexture.image.width!==g.width||g.depthTexture.image.height!==g.height)&&(g.depthTexture.image.width=g.width,g.depthTexture.image.height=g.height,g.depthTexture.needsUpdate=!0),J(g.depthTexture,0);const q=O.__webglTexture,Z=ze(g);if(g.depthTexture.format===1026)Oe(g)?o.framebufferTexture2DMultisampleEXT(a.FRAMEBUFFER,a.DEPTH_ATTACHMENT,a.TEXTURE_2D,q,0,Z):a.framebufferTexture2D(a.FRAMEBUFFER,a.DEPTH_ATTACHMENT,a.TEXTURE_2D,q,0);else if(g.depthTexture.format===1027)Oe(g)?o.framebufferTexture2DMultisampleEXT(a.FRAMEBUFFER,a.DEPTH_STENCIL_ATTACHMENT,a.TEXTURE_2D,q,0,Z):a.framebufferTexture2D(a.FRAMEBUFFER,a.DEPTH_STENCIL_ATTACHMENT,a.TEXTURE_2D,q,0);else throw new Error("Unknown depthTexture format")}function Ae(x){const g=i.get(x),O=x.isWebGLCubeRenderTarget===!0;if(g.__boundDepthTexture!==x.depthTexture){const q=x.depthTexture;if(g.__depthDisposeCallback&&g.__depthDisposeCallback(),q){const Z=()=>{delete g.__boundDepthTexture,delete g.__depthDisposeCallback,q.removeEventListener("dispose",Z)};q.addEventListener("dispose",Z),g.__depthDisposeCallback=Z}g.__boundDepthTexture=q}if(x.depthTexture&&!g.__autoAllocateDepthBuffer){if(O)throw new Error("target.depthTexture not supported in Cube render targets");xe(g.__webglFramebuffer,x)}else if(O){g.__webglDepthbuffer=[];for(let q=0;q<6;q++)if(t.bindFramebuffer(a.FRAMEBUFFER,g.__webglFramebuffer[q]),g.__webglDepthbuffer[q]===void 0)g.__webglDepthbuffer[q]=a.createRenderbuffer(),se(g.__webglDepthbuffer[q],x,!1);else{const Z=x.stencilBuffer?a.DEPTH_STENCIL_ATTACHMENT:a.DEPTH_ATTACHMENT,K=g.__webglDepthbuffer[q];a.bindRenderbuffer(a.RENDERBUFFER,K),a.framebufferRenderbuffer(a.FRAMEBUFFER,Z,a.RENDERBUFFER,K)}}else if(t.bindFramebuffer(a.FRAMEBUFFER,g.__webglFramebuffer),g.__webglDepthbuffer===void 0)g.__webglDepthbuffer=a.createRenderbuffer(),se(g.__webglDepthbuffer,x,!1);else{const q=x.stencilBuffer?a.DEPTH_STENCIL_ATTACHMENT:a.DEPTH_ATTACHMENT,Z=g.__webglDepthbuffer;a.bindRenderbuffer(a.RENDERBUFFER,Z),a.framebufferRenderbuffer(a.FRAMEBUFFER,q,a.RENDERBUFFER,Z)}t.bindFramebuffer(a.FRAMEBUFFER,null)}function Ue(x,g,O){const q=i.get(x);g!==void 0&&ve(q.__webglFramebuffer,x,x.texture,a.COLOR_ATTACHMENT0,a.TEXTURE_2D,0),O!==void 0&&Ae(x)}function tt(x){const g=x.texture,O=i.get(x),q=i.get(g);x.addEventListener("dispose",A);const Z=x.textures,K=x.isWebGLCubeRenderTarget===!0,pe=Z.length>1;if(pe||(q.__webglTexture===void 0&&(q.__webglTexture=a.createTexture()),q.__version=g.version,s.memory.textures++),K){O.__webglFramebuffer=[];for(let ne=0;ne<6;ne++)if(g.mipmaps&&g.mipmaps.length>0){O.__webglFramebuffer[ne]=[];for(let he=0;he<g.mipmaps.length;he++)O.__webglFramebuffer[ne][he]=a.createFramebuffer()}else O.__webglFramebuffer[ne]=a.createFramebuffer()}else{if(g.mipmaps&&g.mipmaps.length>0){O.__webglFramebuffer=[];for(let ne=0;ne<g.mipmaps.length;ne++)O.__webglFramebuffer[ne]=a.createFramebuffer()}else O.__webglFramebuffer=a.createFramebuffer();if(pe)for(let ne=0,he=Z.length;ne<he;ne++){const Fe=i.get(Z[ne]);Fe.__webglTexture===void 0&&(Fe.__webglTexture=a.createTexture(),s.memory.textures++)}if(x.samples>0&&Oe(x)===!1){O.__webglMultisampledFramebuffer=a.createFramebuffer(),O.__webglColorRenderbuffer=[],t.bindFramebuffer(a.FRAMEBUFFER,O.__webglMultisampledFramebuffer);for(let ne=0;ne<Z.length;ne++){const he=Z[ne];O.__webglColorRenderbuffer[ne]=a.createRenderbuffer(),a.bindRenderbuffer(a.RENDERBUFFER,O.__webglColorRenderbuffer[ne]);const Fe=n.convert(he.format,he.colorSpace),ae=n.convert(he.type),me=b(he.internalFormat,Fe,ae,he.colorSpace,x.isXRRenderTarget===!0),Te=ze(x);a.renderbufferStorageMultisample(a.RENDERBUFFER,Te,me,x.width,x.height),a.framebufferRenderbuffer(a.FRAMEBUFFER,a.COLOR_ATTACHMENT0+ne,a.RENDERBUFFER,O.__webglColorRenderbuffer[ne])}a.bindRenderbuffer(a.RENDERBUFFER,null),x.depthBuffer&&(O.__webglDepthRenderbuffer=a.createRenderbuffer(),se(O.__webglDepthRenderbuffer,x,!0)),t.bindFramebuffer(a.FRAMEBUFFER,null)}}if(K){t.bindTexture(a.TEXTURE_CUBE_MAP,q.__webglTexture),be(a.TEXTURE_CUBE_MAP,g);for(let ne=0;ne<6;ne++)if(g.mipmaps&&g.mipmaps.length>0)for(let he=0;he<g.mipmaps.length;he++)ve(O.__webglFramebuffer[ne][he],x,g,a.COLOR_ATTACHMENT0,a.TEXTURE_CUBE_MAP_POSITIVE_X+ne,he);else ve(O.__webglFramebuffer[ne],x,g,a.COLOR_ATTACHMENT0,a.TEXTURE_CUBE_MAP_POSITIVE_X+ne,0);m(g)&&p(a.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(pe){for(let ne=0,he=Z.length;ne<he;ne++){const Fe=Z[ne],ae=i.get(Fe);t.bindTexture(a.TEXTURE_2D,ae.__webglTexture),be(a.TEXTURE_2D,Fe),ve(O.__webglFramebuffer,x,Fe,a.COLOR_ATTACHMENT0+ne,a.TEXTURE_2D,0),m(Fe)&&p(a.TEXTURE_2D)}t.unbindTexture()}else{let ne=a.TEXTURE_2D;if((x.isWebGL3DRenderTarget||x.isWebGLArrayRenderTarget)&&(ne=x.isWebGL3DRenderTarget?a.TEXTURE_3D:a.TEXTURE_2D_ARRAY),t.bindTexture(ne,q.__webglTexture),be(ne,g),g.mipmaps&&g.mipmaps.length>0)for(let he=0;he<g.mipmaps.length;he++)ve(O.__webglFramebuffer[he],x,g,a.COLOR_ATTACHMENT0,ne,he);else ve(O.__webglFramebuffer,x,g,a.COLOR_ATTACHMENT0,ne,0);m(g)&&p(ne),t.unbindTexture()}x.depthBuffer&&Ae(x)}function Be(x){const g=x.textures;for(let O=0,q=g.length;O<q;O++){const Z=g[O];if(m(Z)){const K=w(x),pe=i.get(Z).__webglTexture;t.bindTexture(K,pe),p(K),t.unbindTexture()}}}const He=[],D=[];function Tt(x){if(x.samples>0){if(Oe(x)===!1){const g=x.textures,O=x.width,q=x.height;let Z=a.COLOR_BUFFER_BIT;const K=x.stencilBuffer?a.DEPTH_STENCIL_ATTACHMENT:a.DEPTH_ATTACHMENT,pe=i.get(x),ne=g.length>1;if(ne)for(let he=0;he<g.length;he++)t.bindFramebuffer(a.FRAMEBUFFER,pe.__webglMultisampledFramebuffer),a.framebufferRenderbuffer(a.FRAMEBUFFER,a.COLOR_ATTACHMENT0+he,a.RENDERBUFFER,null),t.bindFramebuffer(a.FRAMEBUFFER,pe.__webglFramebuffer),a.framebufferTexture2D(a.DRAW_FRAMEBUFFER,a.COLOR_ATTACHMENT0+he,a.TEXTURE_2D,null,0);t.bindFramebuffer(a.READ_FRAMEBUFFER,pe.__webglMultisampledFramebuffer),t.bindFramebuffer(a.DRAW_FRAMEBUFFER,pe.__webglFramebuffer);for(let he=0;he<g.length;he++){if(x.resolveDepthBuffer&&(x.depthBuffer&&(Z|=a.DEPTH_BUFFER_BIT),x.stencilBuffer&&x.resolveStencilBuffer&&(Z|=a.STENCIL_BUFFER_BIT)),ne){a.framebufferRenderbuffer(a.READ_FRAMEBUFFER,a.COLOR_ATTACHMENT0,a.RENDERBUFFER,pe.__webglColorRenderbuffer[he]);const Fe=i.get(g[he]).__webglTexture;a.framebufferTexture2D(a.DRAW_FRAMEBUFFER,a.COLOR_ATTACHMENT0,a.TEXTURE_2D,Fe,0)}a.blitFramebuffer(0,0,O,q,0,0,O,q,Z,a.NEAREST),l===!0&&(He.length=0,D.length=0,He.push(a.COLOR_ATTACHMENT0+he),x.depthBuffer&&x.resolveDepthBuffer===!1&&(He.push(K),D.push(K),a.invalidateFramebuffer(a.DRAW_FRAMEBUFFER,D)),a.invalidateFramebuffer(a.READ_FRAMEBUFFER,He))}if(t.bindFramebuffer(a.READ_FRAMEBUFFER,null),t.bindFramebuffer(a.DRAW_FRAMEBUFFER,null),ne)for(let he=0;he<g.length;he++){t.bindFramebuffer(a.FRAMEBUFFER,pe.__webglMultisampledFramebuffer),a.framebufferRenderbuffer(a.FRAMEBUFFER,a.COLOR_ATTACHMENT0+he,a.RENDERBUFFER,pe.__webglColorRenderbuffer[he]);const Fe=i.get(g[he]).__webglTexture;t.bindFramebuffer(a.FRAMEBUFFER,pe.__webglFramebuffer),a.framebufferTexture2D(a.DRAW_FRAMEBUFFER,a.COLOR_ATTACHMENT0+he,a.TEXTURE_2D,Fe,0)}t.bindFramebuffer(a.DRAW_FRAMEBUFFER,pe.__webglMultisampledFramebuffer)}else if(x.depthBuffer&&x.resolveDepthBuffer===!1&&l){const g=x.stencilBuffer?a.DEPTH_STENCIL_ATTACHMENT:a.DEPTH_ATTACHMENT;a.invalidateFramebuffer(a.DRAW_FRAMEBUFFER,[g])}}}function ze(x){return Math.min(r.maxSamples,x.samples)}function Oe(x){const g=i.get(x);return x.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&g.__useRenderToTexture!==!1}function F(x){const g=s.render.frame;u.get(x)!==g&&(u.set(x,g),x.update())}function V(x,g){const O=x.colorSpace,q=x.format,Z=x.type;return x.isCompressedTexture===!0||x.isVideoTexture===!0||O!==ea&&O!==""&&(Ve.getTransfer(O)===Ke?(q!==1023||Z!==1009)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",O)),g}function H(x){return typeof HTMLImageElement<"u"&&x instanceof HTMLImageElement?(c.width=x.naturalWidth||x.width,c.height=x.naturalHeight||x.height):typeof VideoFrame<"u"&&x instanceof VideoFrame?(c.width=x.displayWidth,c.height=x.displayHeight):(c.width=x.width,c.height=x.height),c}this.allocateTextureUnit=B,this.resetTextureUnits=z,this.setTexture2D=J,this.setTexture2DArray=$,this.setTexture3D=ie,this.setTextureCube=X,this.rebindTextures=Ue,this.setupRenderTarget=tt,this.updateRenderTargetMipmap=Be,this.updateMultisampleRenderTarget=Tt,this.setupDepthRenderbuffer=Ae,this.setupFrameBufferTexture=ve,this.useMultisampledRTT=Oe}function qd(a,e){function t(i,r=""){let n;const s=Ve.getTransfer(r);if(i===1009)return a.UNSIGNED_BYTE;if(i===1017)return a.UNSIGNED_SHORT_4_4_4_4;if(i===1018)return a.UNSIGNED_SHORT_5_5_5_1;if(i===35902)return a.UNSIGNED_INT_5_9_9_9_REV;if(i===1010)return a.BYTE;if(i===1011)return a.SHORT;if(i===1012)return a.UNSIGNED_SHORT;if(i===1013)return a.INT;if(i===1014)return a.UNSIGNED_INT;if(i===1015)return a.FLOAT;if(i===1016)return a.HALF_FLOAT;if(i===1021)return a.ALPHA;if(i===1022)return a.RGB;if(i===1023)return a.RGBA;if(i===1024)return a.LUMINANCE;if(i===1025)return a.LUMINANCE_ALPHA;if(i===1026)return a.DEPTH_COMPONENT;if(i===1027)return a.DEPTH_STENCIL;if(i===1028)return a.RED;if(i===1029)return a.RED_INTEGER;if(i===1030)return a.RG;if(i===1031)return a.RG_INTEGER;if(i===1033)return a.RGBA_INTEGER;if(i===33776||i===33777||i===33778||i===33779)if(s===Ke)if(n=e.get("WEBGL_compressed_texture_s3tc_srgb"),n!==null){if(i===33776)return n.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===33777)return n.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===33778)return n.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===33779)return n.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(n=e.get("WEBGL_compressed_texture_s3tc"),n!==null){if(i===33776)return n.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===33777)return n.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===33778)return n.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===33779)return n.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===35840||i===35841||i===35842||i===35843)if(n=e.get("WEBGL_compressed_texture_pvrtc"),n!==null){if(i===35840)return n.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===35841)return n.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===35842)return n.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===35843)return n.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===36196||i===37492||i===37496)if(n=e.get("WEBGL_compressed_texture_etc"),n!==null){if(i===36196||i===37492)return s===Ke?n.COMPRESSED_SRGB8_ETC2:n.COMPRESSED_RGB8_ETC2;if(i===37496)return s===Ke?n.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:n.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(i===37808||i===37809||i===37810||i===37811||i===37812||i===37813||i===37814||i===37815||i===37816||i===37817||i===37818||i===37819||i===37820||i===37821)if(n=e.get("WEBGL_compressed_texture_astc"),n!==null){if(i===37808)return s===Ke?n.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:n.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===37809)return s===Ke?n.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:n.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===37810)return s===Ke?n.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:n.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===37811)return s===Ke?n.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:n.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===37812)return s===Ke?n.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:n.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===37813)return s===Ke?n.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:n.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===37814)return s===Ke?n.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:n.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===37815)return s===Ke?n.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:n.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===37816)return s===Ke?n.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:n.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===37817)return s===Ke?n.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:n.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===37818)return s===Ke?n.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:n.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===37819)return s===Ke?n.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:n.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===37820)return s===Ke?n.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:n.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===37821)return s===Ke?n.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:n.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===36492||i===36494||i===36495)if(n=e.get("EXT_texture_compression_bptc"),n!==null){if(i===36492)return s===Ke?n.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:n.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===36494)return n.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===36495)return n.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===36283||i===36284||i===36285||i===36286)if(n=e.get("EXT_texture_compression_rgtc"),n!==null){if(i===36492)return n.COMPRESSED_RED_RGTC1_EXT;if(i===36284)return n.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===36285)return n.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===36286)return n.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===1020?a.UNSIGNED_INT_24_8:a[i]!==void 0?a[i]:null}return{convert:t}}class Yd extends Dt{constructor(e=[]){super(),this.isArrayCamera=!0,this.cameras=e}}class Ct extends Mt{constructor(){super(),this.isGroup=!0,this.type="Group"}}const $d={type:"move"};class zr{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Ct,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Ct,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new T,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new T),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Ct,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new T,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new T),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const i of e.hand.values())this._getHandJoint(t,i)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,i){let r=null,n=null,s=null;const o=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){s=!0;for(const v of e.hand.values()){const m=t.getJointPose(v,i),p=this._getHandJoint(c,v);m!==null&&(p.matrix.fromArray(m.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=m.radius),p.visible=m!==null}const u=c.joints["index-finger-tip"],d=c.joints["thumb-tip"],h=u.position.distanceTo(d.position),f=.02,_=.005;c.inputState.pinching&&h>f+_?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&h<=f-_&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(n=t.getPose(e.gripSpace,i),n!==null&&(l.matrix.fromArray(n.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,n.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(n.linearVelocity)):l.hasLinearVelocity=!1,n.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(n.angularVelocity)):l.hasAngularVelocity=!1));o!==null&&(r=t.getPose(e.targetRaySpace,i),r===null&&n!==null&&(r=n),r!==null&&(o.matrix.fromArray(r.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,r.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(r.linearVelocity)):o.hasLinearVelocity=!1,r.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(r.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent($d)))}return o!==null&&(o.visible=r!==null),l!==null&&(l.visible=n!==null),c!==null&&(c.visible=s!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const i=new Ct;i.matrixAutoUpdate=!1,i.visible=!1,e.joints[t.jointName]=i,e.add(i)}return e.joints[t.jointName]}}const Kd=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Zd=`
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

}`;class Jd{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t,i){if(this.texture===null){const r=new yt,n=e.properties.get(r);n.__webglTexture=t.texture,(t.depthNear!=i.depthNear||t.depthFar!=i.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=r}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,i=new wt({vertexShader:Kd,fragmentShader:Zd,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new Ye(new ho(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class Qd extends ta{constructor(e,t){super();const i=this;let r=null,n=1,s=null,o="local-floor",l=1,c=null,u=null,d=null,h=null,f=null,_=null;const v=new Jd,m=t.getContextAttributes();let p=null,w=null;const b=[],S=[],N=new Le;let R=null;const A=new Dt;A.viewport=new Qe;const P=new Dt;P.viewport=new Qe;const E=[A,P],y=new Yd;let C=null,z=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Y){let re=b[Y];return re===void 0&&(re=new zr,b[Y]=re),re.getTargetRaySpace()},this.getControllerGrip=function(Y){let re=b[Y];return re===void 0&&(re=new zr,b[Y]=re),re.getGripSpace()},this.getHand=function(Y){let re=b[Y];return re===void 0&&(re=new zr,b[Y]=re),re.getHandSpace()};function B(Y){const re=S.indexOf(Y.inputSource);if(re===-1)return;const ve=b[re];ve!==void 0&&(ve.update(Y.inputSource,Y.frame,c||s),ve.dispatchEvent({type:Y.type,data:Y.inputSource}))}function j(){r.removeEventListener("select",B),r.removeEventListener("selectstart",B),r.removeEventListener("selectend",B),r.removeEventListener("squeeze",B),r.removeEventListener("squeezestart",B),r.removeEventListener("squeezeend",B),r.removeEventListener("end",j),r.removeEventListener("inputsourceschange",J);for(let Y=0;Y<b.length;Y++){const re=S[Y];re!==null&&(S[Y]=null,b[Y].disconnect(re))}C=null,z=null,v.reset(),e.setRenderTarget(p),f=null,h=null,d=null,r=null,w=null,je.stop(),i.isPresenting=!1,e.setPixelRatio(R),e.setSize(N.width,N.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Y){n=Y,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Y){o=Y,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||s},this.setReferenceSpace=function(Y){c=Y},this.getBaseLayer=function(){return h!==null?h:f},this.getBinding=function(){return d},this.getFrame=function(){return _},this.getSession=function(){return r},this.setSession=async function(Y){if(r=Y,r!==null){if(p=e.getRenderTarget(),r.addEventListener("select",B),r.addEventListener("selectstart",B),r.addEventListener("selectend",B),r.addEventListener("squeeze",B),r.addEventListener("squeezestart",B),r.addEventListener("squeezeend",B),r.addEventListener("end",j),r.addEventListener("inputsourceschange",J),m.xrCompatible!==!0&&await t.makeXRCompatible(),R=e.getPixelRatio(),e.getSize(N),r.renderState.layers===void 0){const re={antialias:m.antialias,alpha:!0,depth:m.depth,stencil:m.stencil,framebufferScaleFactor:n};f=new XRWebGLLayer(r,t,re),r.updateRenderState({baseLayer:f}),e.setPixelRatio(1),e.setSize(f.framebufferWidth,f.framebufferHeight,!1),w=new bi(f.framebufferWidth,f.framebufferHeight,{format:1023,type:1009,colorSpace:e.outputColorSpace,stencilBuffer:m.stencil})}else{let re=null,ve=null,se=null;m.depth&&(se=m.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,re=m.stencil?1027:1026,ve=m.stencil?1020:1014);const xe={colorFormat:t.RGBA8,depthFormat:se,scaleFactor:n};d=new XRWebGLBinding(r,t),h=d.createProjectionLayer(xe),r.updateRenderState({layers:[h]}),e.setPixelRatio(1),e.setSize(h.textureWidth,h.textureHeight,!1),w=new bi(h.textureWidth,h.textureHeight,{format:1023,type:1009,depthTexture:new po(h.textureWidth,h.textureHeight,ve,void 0,void 0,void 0,void 0,void 0,void 0,re),stencilBuffer:m.stencil,colorSpace:e.outputColorSpace,samples:m.antialias?4:0,resolveDepthBuffer:h.ignoreDepthValues===!1})}w.isXRRenderTarget=!0,this.setFoveation(l),c=null,s=await r.requestReferenceSpace(o),je.setContext(r),je.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode},this.getDepthTexture=function(){return v.getDepthTexture()};function J(Y){for(let re=0;re<Y.removed.length;re++){const ve=Y.removed[re],se=S.indexOf(ve);se>=0&&(S[se]=null,b[se].disconnect(ve))}for(let re=0;re<Y.added.length;re++){const ve=Y.added[re];let se=S.indexOf(ve);if(se===-1){for(let Ae=0;Ae<b.length;Ae++)if(Ae>=S.length){S.push(ve),se=Ae;break}else if(S[Ae]===null){S[Ae]=ve,se=Ae;break}if(se===-1)break}const xe=b[se];xe&&xe.connect(ve)}}const $=new T,ie=new T;function X(Y,re,ve){$.setFromMatrixPosition(re.matrixWorld),ie.setFromMatrixPosition(ve.matrixWorld);const se=$.distanceTo(ie),xe=re.projectionMatrix.elements,Ae=ve.projectionMatrix.elements,Ue=xe[14]/(xe[10]-1),tt=xe[14]/(xe[10]+1),Be=(xe[9]+1)/xe[5],He=(xe[9]-1)/xe[5],D=(xe[8]-1)/xe[0],Tt=(Ae[8]+1)/Ae[0],ze=Ue*D,Oe=Ue*Tt,F=se/(-D+Tt),V=F*-D;if(re.matrixWorld.decompose(Y.position,Y.quaternion,Y.scale),Y.translateX(V),Y.translateZ(F),Y.matrixWorld.compose(Y.position,Y.quaternion,Y.scale),Y.matrixWorldInverse.copy(Y.matrixWorld).invert(),xe[10]===-1)Y.projectionMatrix.copy(re.projectionMatrix),Y.projectionMatrixInverse.copy(re.projectionMatrixInverse);else{const H=Ue+F,x=tt+F,g=ze-V,O=Oe+(se-V),q=Be*tt/x*H,Z=He*tt/x*H;Y.projectionMatrix.makePerspective(g,O,q,Z,H,x),Y.projectionMatrixInverse.copy(Y.projectionMatrix).invert()}}function ee(Y,re){re===null?Y.matrixWorld.copy(Y.matrix):Y.matrixWorld.multiplyMatrices(re.matrixWorld,Y.matrix),Y.matrixWorldInverse.copy(Y.matrixWorld).invert()}this.updateCamera=function(Y){if(r===null)return;let re=Y.near,ve=Y.far;v.texture!==null&&(v.depthNear>0&&(re=v.depthNear),v.depthFar>0&&(ve=v.depthFar)),y.near=P.near=A.near=re,y.far=P.far=A.far=ve,(C!==y.near||z!==y.far)&&(r.updateRenderState({depthNear:y.near,depthFar:y.far}),C=y.near,z=y.far),A.layers.mask=Y.layers.mask|2,P.layers.mask=Y.layers.mask|4,y.layers.mask=A.layers.mask|P.layers.mask;const se=Y.parent,xe=y.cameras;ee(y,se);for(let Ae=0;Ae<xe.length;Ae++)ee(xe[Ae],se);xe.length===2?X(y,A,P):y.projectionMatrix.copy(A.projectionMatrix),de(Y,y,se)};function de(Y,re,ve){ve===null?Y.matrix.copy(re.matrixWorld):(Y.matrix.copy(ve.matrixWorld),Y.matrix.invert(),Y.matrix.multiply(re.matrixWorld)),Y.matrix.decompose(Y.position,Y.quaternion,Y.scale),Y.updateMatrixWorld(!0),Y.projectionMatrix.copy(re.projectionMatrix),Y.projectionMatrixInverse.copy(re.projectionMatrixInverse),Y.isPerspectiveCamera&&(Y.fov=Aa*2*Math.atan(1/Y.projectionMatrix.elements[5]),Y.zoom=1)}this.getCamera=function(){return y},this.getFoveation=function(){if(!(h===null&&f===null))return l},this.setFoveation=function(Y){l=Y,h!==null&&(h.fixedFoveation=Y),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=Y)},this.hasDepthSensing=function(){return v.texture!==null},this.getDepthSensingMesh=function(){return v.getMesh(y)};let we=null;function be(Y,re){if(u=re.getViewerPose(c||s),_=re,u!==null){const ve=u.views;f!==null&&(e.setRenderTargetFramebuffer(w,f.framebuffer),e.setRenderTarget(w));let se=!1;ve.length!==y.cameras.length&&(y.cameras.length=0,se=!0);for(let Ae=0;Ae<ve.length;Ae++){const Ue=ve[Ae];let tt=null;if(f!==null)tt=f.getViewport(Ue);else{const He=d.getViewSubImage(h,Ue);tt=He.viewport,Ae===0&&(e.setRenderTargetTextures(w,He.colorTexture,h.ignoreDepthValues?void 0:He.depthStencilTexture),e.setRenderTarget(w))}let Be=E[Ae];Be===void 0&&(Be=new Dt,Be.layers.enable(Ae),Be.viewport=new Qe,E[Ae]=Be),Be.matrix.fromArray(Ue.transform.matrix),Be.matrix.decompose(Be.position,Be.quaternion,Be.scale),Be.projectionMatrix.fromArray(Ue.projectionMatrix),Be.projectionMatrixInverse.copy(Be.projectionMatrix).invert(),Be.viewport.set(tt.x,tt.y,tt.width,tt.height),Ae===0&&(y.matrix.copy(Be.matrix),y.matrix.decompose(y.position,y.quaternion,y.scale)),se===!0&&y.cameras.push(Be)}const xe=r.enabledFeatures;if(xe&&xe.includes("depth-sensing")){const Ae=d.getDepthInformation(ve[0]);Ae&&Ae.isValid&&Ae.texture&&v.init(e,Ae,r.renderState)}}for(let ve=0;ve<b.length;ve++){const se=S[ve],xe=b[ve];se!==null&&xe!==void 0&&xe.update(se,re,c||s)}we&&we(Y,re),re.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:re}),_=null}const je=new co;je.setAnimationLoop(be),this.setAnimationLoop=function(Y){we=Y},this.dispose=function(){}}}const xi=new hi,ep=new et;function tp(a,e){function t(m,p){m.matrixAutoUpdate===!0&&m.updateMatrix(),p.value.copy(m.matrix)}function i(m,p){p.color.getRGB(m.fogColor.value,so(a)),p.isFog?(m.fogNear.value=p.near,m.fogFar.value=p.far):p.isFogExp2&&(m.fogDensity.value=p.density)}function r(m,p,w,b,S){p.isMeshBasicMaterial||p.isMeshLambertMaterial?n(m,p):p.isMeshToonMaterial?(n(m,p),d(m,p)):p.isMeshPhongMaterial?(n(m,p),u(m,p)):p.isMeshStandardMaterial?(n(m,p),h(m,p),p.isMeshPhysicalMaterial&&f(m,p,S)):p.isMeshMatcapMaterial?(n(m,p),_(m,p)):p.isMeshDepthMaterial?n(m,p):p.isMeshDistanceMaterial?(n(m,p),v(m,p)):p.isMeshNormalMaterial?n(m,p):p.isLineBasicMaterial?(s(m,p),p.isLineDashedMaterial&&o(m,p)):p.isPointsMaterial?l(m,p,w,b):p.isSpriteMaterial?c(m,p):p.isShadowMaterial?(m.color.value.copy(p.color),m.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function n(m,p){m.opacity.value=p.opacity,p.color&&m.diffuse.value.copy(p.color),p.emissive&&m.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(m.map.value=p.map,t(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.bumpMap&&(m.bumpMap.value=p.bumpMap,t(p.bumpMap,m.bumpMapTransform),m.bumpScale.value=p.bumpScale,p.side===1&&(m.bumpScale.value*=-1)),p.normalMap&&(m.normalMap.value=p.normalMap,t(p.normalMap,m.normalMapTransform),m.normalScale.value.copy(p.normalScale),p.side===1&&m.normalScale.value.negate()),p.displacementMap&&(m.displacementMap.value=p.displacementMap,t(p.displacementMap,m.displacementMapTransform),m.displacementScale.value=p.displacementScale,m.displacementBias.value=p.displacementBias),p.emissiveMap&&(m.emissiveMap.value=p.emissiveMap,t(p.emissiveMap,m.emissiveMapTransform)),p.specularMap&&(m.specularMap.value=p.specularMap,t(p.specularMap,m.specularMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest);const w=e.get(p),b=w.envMap,S=w.envMapRotation;b&&(m.envMap.value=b,xi.copy(S),xi.x*=-1,xi.y*=-1,xi.z*=-1,b.isCubeTexture&&b.isRenderTargetTexture===!1&&(xi.y*=-1,xi.z*=-1),m.envMapRotation.value.setFromMatrix4(ep.makeRotationFromEuler(xi)),m.flipEnvMap.value=b.isCubeTexture&&b.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=p.reflectivity,m.ior.value=p.ior,m.refractionRatio.value=p.refractionRatio),p.lightMap&&(m.lightMap.value=p.lightMap,m.lightMapIntensity.value=p.lightMapIntensity,t(p.lightMap,m.lightMapTransform)),p.aoMap&&(m.aoMap.value=p.aoMap,m.aoMapIntensity.value=p.aoMapIntensity,t(p.aoMap,m.aoMapTransform))}function s(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,p.map&&(m.map.value=p.map,t(p.map,m.mapTransform))}function o(m,p){m.dashSize.value=p.dashSize,m.totalSize.value=p.dashSize+p.gapSize,m.scale.value=p.scale}function l(m,p,w,b){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.size.value=p.size*w,m.scale.value=b*.5,p.map&&(m.map.value=p.map,t(p.map,m.uvTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function c(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.rotation.value=p.rotation,p.map&&(m.map.value=p.map,t(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function u(m,p){m.specular.value.copy(p.specular),m.shininess.value=Math.max(p.shininess,1e-4)}function d(m,p){p.gradientMap&&(m.gradientMap.value=p.gradientMap)}function h(m,p){m.metalness.value=p.metalness,p.metalnessMap&&(m.metalnessMap.value=p.metalnessMap,t(p.metalnessMap,m.metalnessMapTransform)),m.roughness.value=p.roughness,p.roughnessMap&&(m.roughnessMap.value=p.roughnessMap,t(p.roughnessMap,m.roughnessMapTransform)),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)}function f(m,p,w){m.ior.value=p.ior,p.sheen>0&&(m.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),m.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(m.sheenColorMap.value=p.sheenColorMap,t(p.sheenColorMap,m.sheenColorMapTransform)),p.sheenRoughnessMap&&(m.sheenRoughnessMap.value=p.sheenRoughnessMap,t(p.sheenRoughnessMap,m.sheenRoughnessMapTransform))),p.clearcoat>0&&(m.clearcoat.value=p.clearcoat,m.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(m.clearcoatMap.value=p.clearcoatMap,t(p.clearcoatMap,m.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,t(p.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(m.clearcoatNormalMap.value=p.clearcoatNormalMap,t(p.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===1&&m.clearcoatNormalScale.value.negate())),p.dispersion>0&&(m.dispersion.value=p.dispersion),p.iridescence>0&&(m.iridescence.value=p.iridescence,m.iridescenceIOR.value=p.iridescenceIOR,m.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(m.iridescenceMap.value=p.iridescenceMap,t(p.iridescenceMap,m.iridescenceMapTransform)),p.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=p.iridescenceThicknessMap,t(p.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),p.transmission>0&&(m.transmission.value=p.transmission,m.transmissionSamplerMap.value=w.texture,m.transmissionSamplerSize.value.set(w.width,w.height),p.transmissionMap&&(m.transmissionMap.value=p.transmissionMap,t(p.transmissionMap,m.transmissionMapTransform)),m.thickness.value=p.thickness,p.thicknessMap&&(m.thicknessMap.value=p.thicknessMap,t(p.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=p.attenuationDistance,m.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(m.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(m.anisotropyMap.value=p.anisotropyMap,t(p.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=p.specularIntensity,m.specularColor.value.copy(p.specularColor),p.specularColorMap&&(m.specularColorMap.value=p.specularColorMap,t(p.specularColorMap,m.specularColorMapTransform)),p.specularIntensityMap&&(m.specularIntensityMap.value=p.specularIntensityMap,t(p.specularIntensityMap,m.specularIntensityMapTransform))}function _(m,p){p.matcap&&(m.matcap.value=p.matcap)}function v(m,p){const w=e.get(p).light;m.referencePosition.value.setFromMatrixPosition(w.matrixWorld),m.nearDistance.value=w.shadow.camera.near,m.farDistance.value=w.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:r}}function ip(a,e,t,i){let r={},n={},s=[];const o=a.getParameter(a.MAX_UNIFORM_BUFFER_BINDINGS);function l(w,b){const S=b.program;i.uniformBlockBinding(w,S)}function c(w,b){let S=r[w.id];S===void 0&&(_(w),S=u(w),r[w.id]=S,w.addEventListener("dispose",m));const N=b.program;i.updateUBOMapping(w,N);const R=e.render.frame;n[w.id]!==R&&(h(w),n[w.id]=R)}function u(w){const b=d();w.__bindingPointIndex=b;const S=a.createBuffer(),N=w.__size,R=w.usage;return a.bindBuffer(a.UNIFORM_BUFFER,S),a.bufferData(a.UNIFORM_BUFFER,N,R),a.bindBuffer(a.UNIFORM_BUFFER,null),a.bindBufferBase(a.UNIFORM_BUFFER,b,S),S}function d(){for(let w=0;w<o;w++)if(s.indexOf(w)===-1)return s.push(w),w;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function h(w){const b=r[w.id],S=w.uniforms,N=w.__cache;a.bindBuffer(a.UNIFORM_BUFFER,b);for(let R=0,A=S.length;R<A;R++){const P=Array.isArray(S[R])?S[R]:[S[R]];for(let E=0,y=P.length;E<y;E++){const C=P[E];if(f(C,R,E,N)===!0){const z=C.__offset,B=Array.isArray(C.value)?C.value:[C.value];let j=0;for(let J=0;J<B.length;J++){const $=B[J],ie=v($);typeof $=="number"||typeof $=="boolean"?(C.__data[0]=$,a.bufferSubData(a.UNIFORM_BUFFER,z+j,C.__data)):$.isMatrix3?(C.__data[0]=$.elements[0],C.__data[1]=$.elements[1],C.__data[2]=$.elements[2],C.__data[3]=0,C.__data[4]=$.elements[3],C.__data[5]=$.elements[4],C.__data[6]=$.elements[5],C.__data[7]=0,C.__data[8]=$.elements[6],C.__data[9]=$.elements[7],C.__data[10]=$.elements[8],C.__data[11]=0):($.toArray(C.__data,j),j+=ie.storage/Float32Array.BYTES_PER_ELEMENT)}a.bufferSubData(a.UNIFORM_BUFFER,z,C.__data)}}}a.bindBuffer(a.UNIFORM_BUFFER,null)}function f(w,b,S,N){const R=w.value,A=b+"_"+S;if(N[A]===void 0)return typeof R=="number"||typeof R=="boolean"?N[A]=R:N[A]=R.clone(),!0;{const P=N[A];if(typeof R=="number"||typeof R=="boolean"){if(P!==R)return N[A]=R,!0}else if(P.equals(R)===!1)return P.copy(R),!0}return!1}function _(w){const b=w.uniforms;let S=0;const N=16;for(let A=0,P=b.length;A<P;A++){const E=Array.isArray(b[A])?b[A]:[b[A]];for(let y=0,C=E.length;y<C;y++){const z=E[y],B=Array.isArray(z.value)?z.value:[z.value];for(let j=0,J=B.length;j<J;j++){const $=B[j],ie=v($),X=S%N,ee=X%ie.boundary,de=X+ee;S+=ee,de!==0&&N-de<ie.storage&&(S+=N-de),z.__data=new Float32Array(ie.storage/Float32Array.BYTES_PER_ELEMENT),z.__offset=S,S+=ie.storage}}}const R=S%N;return R>0&&(S+=N-R),w.__size=S,w.__cache={},this}function v(w){const b={boundary:0,storage:0};return typeof w=="number"||typeof w=="boolean"?(b.boundary=4,b.storage=4):w.isVector2?(b.boundary=8,b.storage=8):w.isVector3||w.isColor?(b.boundary=16,b.storage=12):w.isVector4?(b.boundary=16,b.storage=16):w.isMatrix3?(b.boundary=48,b.storage=48):w.isMatrix4?(b.boundary=64,b.storage=64):w.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",w),b}function m(w){const b=w.target;b.removeEventListener("dispose",m);const S=s.indexOf(b.__bindingPointIndex);s.splice(S,1),a.deleteBuffer(r[b.id]),delete r[b.id],delete n[b.id]}function p(){for(const w in r)a.deleteBuffer(r[w]);s=[],r={},n={}}return{bind:l,update:c,dispose:p}}class ap{constructor(e={}){const{canvas:t=Wo(),context:i=null,depth:r=!0,stencil:n=!1,alpha:s=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:d=!1,reverseDepthBuffer:h=!1}=e;this.isWebGLRenderer=!0;let f;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");f=i.getContextAttributes().alpha}else f=s;const _=new Uint32Array(4),v=new Int32Array(4);let m=null,p=null;const w=[],b=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=Ut,this.toneMapping=0,this.toneMappingExposure=1;const S=this;let N=!1,R=0,A=0,P=null,E=-1,y=null;const C=new Qe,z=new Qe;let B=null;const j=new Se(0);let J=0,$=t.width,ie=t.height,X=1,ee=null,de=null;const we=new Qe(0,0,$,ie),be=new Qe(0,0,$,ie);let je=!1;const Y=new fn;let re=!1,ve=!1;const se=new et,xe=new et,Ae=new T,Ue=new Qe,tt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Be=!1;function He(){return P===null?X:1}let D=i;function Tt(M,U){return t.getContext(M,U)}try{const M={alpha:!0,depth:r,stencil:n,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:u,failIfMajorPerformanceCaveat:d};if("setAttribute"in t&&t.setAttribute("data-engine","three.js r170"),t.addEventListener("webglcontextlost",Q,!1),t.addEventListener("webglcontextrestored",ue,!1),t.addEventListener("webglcontextcreationerror",oe,!1),D===null){const U="webgl2";if(D=Tt(U,M),D===null)throw Tt(U)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(M){throw console.error("THREE.WebGLRenderer: "+M.message),M}let ze,Oe,F,V,H,x,g,O,q,Z,K,pe,ne,he,Fe,ae,me,Te,Re,ge,ke,De,Ze,I;function ce(){ze=new lu(D),ze.init(),De=new qd(D,ze),Oe=new tu(D,ze,e,De),F=new Wd(D,ze),Oe.reverseDepthBuffer&&h&&F.buffers.depth.setReversed(!0),V=new uu(D),H=new Cd,x=new jd(D,ze,F,H,Oe,De,V),g=new au(S),O=new ou(S),q=new vl(D),Ze=new Qh(D,q),Z=new cu(D,q,V,Ze),K=new pu(D,Z,q,V),Re=new du(D,Oe,x),ae=new iu(H),pe=new Rd(S,g,O,ze,Oe,Ze,ae),ne=new tp(S,H),he=new Ld,Fe=new Fd(ze),Te=new Jh(S,g,O,F,K,f,l),me=new Vd(S,K,Oe),I=new ip(D,V,Oe,F),ge=new eu(D,ze,V),ke=new hu(D,ze,V),V.programs=pe.programs,S.capabilities=Oe,S.extensions=ze,S.properties=H,S.renderLists=he,S.shadowMap=me,S.state=F,S.info=V}ce();const W=new Qd(S,D);this.xr=W,this.getContext=function(){return D},this.getContextAttributes=function(){return D.getContextAttributes()},this.forceContextLoss=function(){const M=ze.get("WEBGL_lose_context");M&&M.loseContext()},this.forceContextRestore=function(){const M=ze.get("WEBGL_lose_context");M&&M.restoreContext()},this.getPixelRatio=function(){return X},this.setPixelRatio=function(M){M!==void 0&&(X=M,this.setSize($,ie,!1))},this.getSize=function(M){return M.set($,ie)},this.setSize=function(M,U,k=!0){if(W.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}$=M,ie=U,t.width=Math.floor(M*X),t.height=Math.floor(U*X),k===!0&&(t.style.width=M+"px",t.style.height=U+"px"),this.setViewport(0,0,M,U)},this.getDrawingBufferSize=function(M){return M.set($*X,ie*X).floor()},this.setDrawingBufferSize=function(M,U,k){$=M,ie=U,X=k,t.width=Math.floor(M*k),t.height=Math.floor(U*k),this.setViewport(0,0,M,U)},this.getCurrentViewport=function(M){return M.copy(C)},this.getViewport=function(M){return M.copy(we)},this.setViewport=function(M,U,k,G){M.isVector4?we.set(M.x,M.y,M.z,M.w):we.set(M,U,k,G),F.viewport(C.copy(we).multiplyScalar(X).round())},this.getScissor=function(M){return M.copy(be)},this.setScissor=function(M,U,k,G){M.isVector4?be.set(M.x,M.y,M.z,M.w):be.set(M,U,k,G),F.scissor(z.copy(be).multiplyScalar(X).round())},this.getScissorTest=function(){return je},this.setScissorTest=function(M){F.setScissorTest(je=M)},this.setOpaqueSort=function(M){ee=M},this.setTransparentSort=function(M){de=M},this.getClearColor=function(M){return M.copy(Te.getClearColor())},this.setClearColor=function(){Te.setClearColor.apply(Te,arguments)},this.getClearAlpha=function(){return Te.getClearAlpha()},this.setClearAlpha=function(){Te.setClearAlpha.apply(Te,arguments)},this.clear=function(M=!0,U=!0,k=!0){let G=0;if(M){let L=!1;if(P!==null){const te=P.texture.format;L=te===1033||te===1031||te===1029}if(L){const te=P.texture.type,fe=te===1009||te===1014||te===1012||te===1020||te===1017||te===1018,_e=Te.getClearColor(),ye=Te.getClearAlpha(),Ce=_e.r,Pe=_e.g,Ee=_e.b;fe?(_[0]=Ce,_[1]=Pe,_[2]=Ee,_[3]=ye,D.clearBufferuiv(D.COLOR,0,_)):(v[0]=Ce,v[1]=Pe,v[2]=Ee,v[3]=ye,D.clearBufferiv(D.COLOR,0,v))}else G|=D.COLOR_BUFFER_BIT}U&&(G|=D.DEPTH_BUFFER_BIT),k&&(G|=D.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),D.clear(G)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",Q,!1),t.removeEventListener("webglcontextrestored",ue,!1),t.removeEventListener("webglcontextcreationerror",oe,!1),he.dispose(),Fe.dispose(),H.dispose(),g.dispose(),O.dispose(),K.dispose(),Ze.dispose(),I.dispose(),pe.dispose(),W.dispose(),W.removeEventListener("sessionstart",wn),W.removeEventListener("sessionend",Tn),ui.stop()};function Q(M){M.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),N=!0}function ue(){console.log("THREE.WebGLRenderer: Context Restored."),N=!1;const M=V.autoReset,U=me.enabled,k=me.autoUpdate,G=me.needsUpdate,L=me.type;ce(),V.autoReset=M,me.enabled=U,me.autoUpdate=k,me.needsUpdate=G,me.type=L}function oe(M){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",M.statusMessage)}function Ge(M){const U=M.target;U.removeEventListener("dispose",Ge),ot(U)}function ot(M){gt(M),H.remove(M)}function gt(M){const U=H.get(M).programs;U!==void 0&&(U.forEach(function(k){pe.releaseProgram(k)}),M.isShaderMaterial&&pe.releaseShaderCache(M))}this.renderBufferDirect=function(M,U,k,G,L,te){U===null&&(U=tt);const fe=L.isMesh&&L.matrixWorld.determinant()<0,_e=wo(M,U,k,G,L);F.setMaterial(G,fe);let ye=k.index,Ce=1;if(G.wireframe===!0){if(ye=Z.getWireframeAttribute(k),ye===void 0)return;Ce=2}const Pe=k.drawRange,Ee=k.attributes.position;let We=Pe.start*Ce,at=(Pe.start+Pe.count)*Ce;te!==null&&(We=Math.max(We,te.start*Ce),at=Math.min(at,(te.start+te.count)*Ce)),ye!==null?(We=Math.max(We,0),at=Math.min(at,ye.count)):Ee!=null&&(We=Math.max(We,0),at=Math.min(at,Ee.count));const rt=at-We;if(rt<0||rt===1/0)return;Ze.setup(L,G,_e,k,ye);let ct,nt=ge;if(ye!==null&&(ct=q.get(ye),nt=ke,nt.setIndex(ct)),L.isMesh)G.wireframe===!0?(F.setLineWidth(G.wireframeLinewidth*He()),nt.setMode(D.LINES)):nt.setMode(D.TRIANGLES);else if(L.isLine){let Me=G.linewidth;Me===void 0&&(Me=1),F.setLineWidth(Me*He()),L.isLineSegments?nt.setMode(D.LINES):L.isLineLoop?nt.setMode(D.LINE_LOOP):nt.setMode(D.LINE_STRIP)}else L.isPoints?nt.setMode(D.POINTS):L.isSprite&&nt.setMode(D.TRIANGLES);if(L.isBatchedMesh)if(L._multiDrawInstances!==null)nt.renderMultiDrawInstances(L._multiDrawStarts,L._multiDrawCounts,L._multiDrawCount,L._multiDrawInstances);else if(ze.get("WEBGL_multi_draw"))nt.renderMultiDraw(L._multiDrawStarts,L._multiDrawCounts,L._multiDrawCount);else{const Me=L._multiDrawStarts,di=L._multiDrawCounts,pi=L._multiDrawCount,Bt=ye?q.get(ye).bytesPerElement:1,Pi=H.get(G).currentProgram.getUniforms();for(let Pt=0;Pt<pi;Pt++)Pi.setValue(D,"_gl_DrawID",Pt),nt.render(Me[Pt]/Bt,di[Pt])}else if(L.isInstancedMesh)nt.renderInstances(We,rt,L.count);else if(k.isInstancedBufferGeometry){const Me=k._maxInstanceCount!==void 0?k._maxInstanceCount:1/0,di=Math.min(k.instanceCount,Me);nt.renderInstances(We,rt,di)}else nt.render(We,rt)};function $e(M,U,k){M.transparent===!0&&M.side===2&&M.forceSinglePass===!1?(M.side=1,M.needsUpdate=!0,Ua(M,U,k),M.side=0,M.needsUpdate=!0,Ua(M,U,k),M.side=2):Ua(M,U,k)}this.compile=function(M,U,k=null){k===null&&(k=M),p=Fe.get(k),p.init(U),b.push(p),k.traverseVisible(function(L){L.isLight&&L.layers.test(U.layers)&&(p.pushLight(L),L.castShadow&&p.pushShadow(L))}),M!==k&&M.traverseVisible(function(L){L.isLight&&L.layers.test(U.layers)&&(p.pushLight(L),L.castShadow&&p.pushShadow(L))}),p.setupLights();const G=new Set;return M.traverse(function(L){if(!(L.isMesh||L.isPoints||L.isLine||L.isSprite))return;const te=L.material;if(te)if(Array.isArray(te))for(let fe=0;fe<te.length;fe++){const _e=te[fe];$e(_e,k,L),G.add(_e)}else $e(te,k,L),G.add(te)}),b.pop(),p=null,G},this.compileAsync=function(M,U,k=null){const G=this.compile(M,U,k);return new Promise(L=>{function te(){if(G.forEach(function(fe){H.get(fe).currentProgram.isReady()&&G.delete(fe)}),G.size===0){L(M);return}setTimeout(te,10)}ze.get("KHR_parallel_shader_compile")!==null?te():setTimeout(te,10)})};let zt=null;function qt(M){zt&&zt(M)}function wn(){ui.stop()}function Tn(){ui.start()}const ui=new co;ui.setAnimationLoop(qt),typeof self<"u"&&ui.setContext(self),this.setAnimationLoop=function(M){zt=M,W.setAnimationLoop(M),M===null?ui.stop():ui.start()},W.addEventListener("sessionstart",wn),W.addEventListener("sessionend",Tn),this.render=function(M,U){if(U!==void 0&&U.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(N===!0)return;if(M.matrixWorldAutoUpdate===!0&&M.updateMatrixWorld(),U.parent===null&&U.matrixWorldAutoUpdate===!0&&U.updateMatrixWorld(),W.enabled===!0&&W.isPresenting===!0&&(W.cameraAutoUpdate===!0&&W.updateCamera(U),U=W.getCamera()),M.isScene===!0&&M.onBeforeRender(S,M,U,P),p=Fe.get(M,b.length),p.init(U),b.push(p),xe.multiplyMatrices(U.projectionMatrix,U.matrixWorldInverse),Y.setFromProjectionMatrix(xe),ve=this.localClippingEnabled,re=ae.init(this.clippingPlanes,ve),m=he.get(M,w.length),m.init(),w.push(m),W.enabled===!0&&W.isPresenting===!0){const te=S.xr.getDepthSensingMesh();te!==null&&ur(te,U,-1/0,S.sortObjects)}ur(M,U,0,S.sortObjects),m.finish(),S.sortObjects===!0&&m.sort(ee,de),Be=W.enabled===!1||W.isPresenting===!1||W.hasDepthSensing()===!1,Be&&Te.addToRenderList(m,M),this.info.render.frame++,re===!0&&ae.beginShadows();const k=p.state.shadowsArray;me.render(k,M,U),re===!0&&ae.endShadows(),this.info.autoReset===!0&&this.info.reset();const G=m.opaque,L=m.transmissive;if(p.setupLights(),U.isArrayCamera){const te=U.cameras;if(L.length>0)for(let fe=0,_e=te.length;fe<_e;fe++){const ye=te[fe];Rn(G,L,M,ye)}Be&&Te.render(M);for(let fe=0,_e=te.length;fe<_e;fe++){const ye=te[fe];An(m,M,ye,ye.viewport)}}else L.length>0&&Rn(G,L,M,U),Be&&Te.render(M),An(m,M,U);P!==null&&(x.updateMultisampleRenderTarget(P),x.updateRenderTargetMipmap(P)),M.isScene===!0&&M.onAfterRender(S,M,U),Ze.resetDefaultState(),E=-1,y=null,b.pop(),b.length>0?(p=b[b.length-1],re===!0&&ae.setGlobalState(S.clippingPlanes,p.state.camera)):p=null,w.pop(),w.length>0?m=w[w.length-1]:m=null};function ur(M,U,k,G){if(M.visible===!1)return;if(M.layers.test(U.layers)){if(M.isGroup)k=M.renderOrder;else if(M.isLOD)M.autoUpdate===!0&&M.update(U);else if(M.isLight)p.pushLight(M),M.castShadow&&p.pushShadow(M);else if(M.isSprite){if(!M.frustumCulled||Y.intersectsSprite(M)){G&&Ue.setFromMatrixPosition(M.matrixWorld).applyMatrix4(xe);const te=K.update(M),fe=M.material;fe.visible&&m.push(M,te,fe,k,Ue.z,null)}}else if((M.isMesh||M.isLine||M.isPoints)&&(!M.frustumCulled||Y.intersectsObject(M))){const te=K.update(M),fe=M.material;if(G&&(M.boundingSphere!==void 0?(M.boundingSphere===null&&M.computeBoundingSphere(),Ue.copy(M.boundingSphere.center)):(te.boundingSphere===null&&te.computeBoundingSphere(),Ue.copy(te.boundingSphere.center)),Ue.applyMatrix4(M.matrixWorld).applyMatrix4(xe)),Array.isArray(fe)){const _e=te.groups;for(let ye=0,Ce=_e.length;ye<Ce;ye++){const Pe=_e[ye],Ee=fe[Pe.materialIndex];Ee&&Ee.visible&&m.push(M,te,Ee,k,Ue.z,Pe)}}else fe.visible&&m.push(M,te,fe,k,Ue.z,null)}}const L=M.children;for(let te=0,fe=L.length;te<fe;te++)ur(L[te],U,k,G)}function An(M,U,k,G){const L=M.opaque,te=M.transmissive,fe=M.transparent;p.setupLightsView(k),re===!0&&ae.setGlobalState(S.clippingPlanes,k),G&&F.viewport(C.copy(G)),L.length>0&&Ia(L,U,k),te.length>0&&Ia(te,U,k),fe.length>0&&Ia(fe,U,k),F.buffers.depth.setTest(!0),F.buffers.depth.setMask(!0),F.buffers.color.setMask(!0),F.setPolygonOffset(!1)}function Rn(M,U,k,G){if((k.isScene===!0?k.overrideMaterial:null)!==null)return;p.state.transmissionRenderTarget[G.id]===void 0&&(p.state.transmissionRenderTarget[G.id]=new bi(1,1,{generateMipmaps:!0,type:ze.has("EXT_color_buffer_half_float")||ze.has("EXT_color_buffer_float")?1016:1009,minFilter:1008,samples:4,stencilBuffer:n,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Ve.workingColorSpace}));const L=p.state.transmissionRenderTarget[G.id],te=G.viewport||C;L.setSize(te.z,te.w);const fe=S.getRenderTarget();S.setRenderTarget(L),S.getClearColor(j),J=S.getClearAlpha(),J<1&&S.setClearColor(16777215,.5),S.clear(),Be&&Te.render(k);const _e=S.toneMapping;S.toneMapping=0;const ye=G.viewport;if(G.viewport!==void 0&&(G.viewport=void 0),p.setupLightsView(G),re===!0&&ae.setGlobalState(S.clippingPlanes,G),Ia(M,k,G),x.updateMultisampleRenderTarget(L),x.updateRenderTargetMipmap(L),ze.has("WEBGL_multisampled_render_to_texture")===!1){let Ce=!1;for(let Pe=0,Ee=U.length;Pe<Ee;Pe++){const We=U[Pe],at=We.object,rt=We.geometry,ct=We.material,nt=We.group;if(ct.side===2&&at.layers.test(G.layers)){const Me=ct.side;ct.side=1,ct.needsUpdate=!0,Cn(at,k,G,rt,ct,nt),ct.side=Me,ct.needsUpdate=!0,Ce=!0}}Ce===!0&&(x.updateMultisampleRenderTarget(L),x.updateRenderTargetMipmap(L))}S.setRenderTarget(fe),S.setClearColor(j,J),ye!==void 0&&(G.viewport=ye),S.toneMapping=_e}function Ia(M,U,k){const G=U.isScene===!0?U.overrideMaterial:null;for(let L=0,te=M.length;L<te;L++){const fe=M[L],_e=fe.object,ye=fe.geometry,Ce=G===null?fe.material:G,Pe=fe.group;_e.layers.test(k.layers)&&Cn(_e,U,k,ye,Ce,Pe)}}function Cn(M,U,k,G,L,te){M.onBeforeRender(S,U,k,G,L,te),M.modelViewMatrix.multiplyMatrices(k.matrixWorldInverse,M.matrixWorld),M.normalMatrix.getNormalMatrix(M.modelViewMatrix),L.onBeforeRender(S,U,k,G,M,te),L.transparent===!0&&L.side===2&&L.forceSinglePass===!1?(L.side=1,L.needsUpdate=!0,S.renderBufferDirect(k,U,G,L,M,te),L.side=0,L.needsUpdate=!0,S.renderBufferDirect(k,U,G,L,M,te),L.side=2):S.renderBufferDirect(k,U,G,L,M,te),M.onAfterRender(S,U,k,G,L,te)}function Ua(M,U,k){U.isScene!==!0&&(U=tt);const G=H.get(M),L=p.state.lights,te=p.state.shadowsArray,fe=L.state.version,_e=pe.getParameters(M,L.state,te,U,k),ye=pe.getProgramCacheKey(_e);let Ce=G.programs;G.environment=M.isMeshStandardMaterial?U.environment:null,G.fog=U.fog,G.envMap=(M.isMeshStandardMaterial?O:g).get(M.envMap||G.environment),G.envMapRotation=G.environment!==null&&M.envMap===null?U.environmentRotation:M.envMapRotation,Ce===void 0&&(M.addEventListener("dispose",Ge),Ce=new Map,G.programs=Ce);let Pe=Ce.get(ye);if(Pe!==void 0){if(G.currentProgram===Pe&&G.lightsStateVersion===fe)return Ln(M,_e),Pe}else _e.uniforms=pe.getUniforms(M),M.onBeforeCompile(_e,S),Pe=pe.acquireProgram(_e,ye),Ce.set(ye,Pe),G.uniforms=_e.uniforms;const Ee=G.uniforms;return(!M.isShaderMaterial&&!M.isRawShaderMaterial||M.clipping===!0)&&(Ee.clippingPlanes=ae.uniform),Ln(M,_e),G.needsLights=Ao(M),G.lightsStateVersion=fe,G.needsLights&&(Ee.ambientLightColor.value=L.state.ambient,Ee.lightProbe.value=L.state.probe,Ee.directionalLights.value=L.state.directional,Ee.directionalLightShadows.value=L.state.directionalShadow,Ee.spotLights.value=L.state.spot,Ee.spotLightShadows.value=L.state.spotShadow,Ee.rectAreaLights.value=L.state.rectArea,Ee.ltc_1.value=L.state.rectAreaLTC1,Ee.ltc_2.value=L.state.rectAreaLTC2,Ee.pointLights.value=L.state.point,Ee.pointLightShadows.value=L.state.pointShadow,Ee.hemisphereLights.value=L.state.hemi,Ee.directionalShadowMap.value=L.state.directionalShadowMap,Ee.directionalShadowMatrix.value=L.state.directionalShadowMatrix,Ee.spotShadowMap.value=L.state.spotShadowMap,Ee.spotLightMatrix.value=L.state.spotLightMatrix,Ee.spotLightMap.value=L.state.spotLightMap,Ee.pointShadowMap.value=L.state.pointShadowMap,Ee.pointShadowMatrix.value=L.state.pointShadowMatrix),G.currentProgram=Pe,G.uniformsList=null,Pe}function Pn(M){if(M.uniformsList===null){const U=M.currentProgram.getUniforms();M.uniformsList=or.seqWithValue(U.seq,M.uniforms)}return M.uniformsList}function Ln(M,U){const k=H.get(M);k.outputColorSpace=U.outputColorSpace,k.batching=U.batching,k.batchingColor=U.batchingColor,k.instancing=U.instancing,k.instancingColor=U.instancingColor,k.instancingMorph=U.instancingMorph,k.skinning=U.skinning,k.morphTargets=U.morphTargets,k.morphNormals=U.morphNormals,k.morphColors=U.morphColors,k.morphTargetsCount=U.morphTargetsCount,k.numClippingPlanes=U.numClippingPlanes,k.numIntersection=U.numClipIntersection,k.vertexAlphas=U.vertexAlphas,k.vertexTangents=U.vertexTangents,k.toneMapping=U.toneMapping}function wo(M,U,k,G,L){U.isScene!==!0&&(U=tt),x.resetTextureUnits();const te=U.fog,fe=G.isMeshStandardMaterial?U.environment:null,_e=P===null?S.outputColorSpace:P.isXRRenderTarget===!0?P.texture.colorSpace:ea,ye=(G.isMeshStandardMaterial?O:g).get(G.envMap||fe),Ce=G.vertexColors===!0&&!!k.attributes.color&&k.attributes.color.itemSize===4,Pe=!!k.attributes.tangent&&(!!G.normalMap||G.anisotropy>0),Ee=!!k.morphAttributes.position,We=!!k.morphAttributes.normal,at=!!k.morphAttributes.color;let rt=0;G.toneMapped&&(P===null||P.isXRRenderTarget===!0)&&(rt=S.toneMapping);const ct=k.morphAttributes.position||k.morphAttributes.normal||k.morphAttributes.color,nt=ct!==void 0?ct.length:0,Me=H.get(G),di=p.state.lights;if(re===!0&&(ve===!0||M!==y)){const At=M===y&&G.id===E;ae.setState(G,M,At)}let pi=!1;G.version===Me.__version?(Me.needsLights&&Me.lightsStateVersion!==di.state.version||Me.outputColorSpace!==_e||L.isBatchedMesh&&Me.batching===!1||!L.isBatchedMesh&&Me.batching===!0||L.isBatchedMesh&&Me.batchingColor===!0&&L.colorTexture===null||L.isBatchedMesh&&Me.batchingColor===!1&&L.colorTexture!==null||L.isInstancedMesh&&Me.instancing===!1||!L.isInstancedMesh&&Me.instancing===!0||L.isSkinnedMesh&&Me.skinning===!1||!L.isSkinnedMesh&&Me.skinning===!0||L.isInstancedMesh&&Me.instancingColor===!0&&L.instanceColor===null||L.isInstancedMesh&&Me.instancingColor===!1&&L.instanceColor!==null||L.isInstancedMesh&&Me.instancingMorph===!0&&L.morphTexture===null||L.isInstancedMesh&&Me.instancingMorph===!1&&L.morphTexture!==null||Me.envMap!==ye||G.fog===!0&&Me.fog!==te||Me.numClippingPlanes!==void 0&&(Me.numClippingPlanes!==ae.numPlanes||Me.numIntersection!==ae.numIntersection)||Me.vertexAlphas!==Ce||Me.vertexTangents!==Pe||Me.morphTargets!==Ee||Me.morphNormals!==We||Me.morphColors!==at||Me.toneMapping!==rt||Me.morphTargetsCount!==nt)&&(pi=!0):(pi=!0,Me.__version=G.version);let Bt=Me.currentProgram;pi===!0&&(Bt=Ua(G,U,L));let Pi=!1,Pt=!1,la=!1;const it=Bt.getUniforms(),Wt=Me.uniforms;if(F.useProgram(Bt.program)&&(Pi=!0,Pt=!0,la=!0),G.id!==E&&(E=G.id,Pt=!0),Pi||y!==M){F.buffers.depth.getReversed()?(se.copy(M.projectionMatrix),jo(se),qo(se),it.setValue(D,"projectionMatrix",se)):it.setValue(D,"projectionMatrix",M.projectionMatrix),it.setValue(D,"viewMatrix",M.matrixWorldInverse);const At=it.map.cameraPosition;At!==void 0&&At.setValue(D,Ae.setFromMatrixPosition(M.matrixWorld)),Oe.logarithmicDepthBuffer&&it.setValue(D,"logDepthBufFC",2/(Math.log(M.far+1)/Math.LN2)),(G.isMeshPhongMaterial||G.isMeshToonMaterial||G.isMeshLambertMaterial||G.isMeshBasicMaterial||G.isMeshStandardMaterial||G.isShaderMaterial)&&it.setValue(D,"isOrthographic",M.isOrthographicCamera===!0),y!==M&&(y=M,Pt=!0,la=!0)}if(L.isSkinnedMesh){it.setOptional(D,L,"bindMatrix"),it.setOptional(D,L,"bindMatrixInverse");const At=L.skeleton;At&&(At.boneTexture===null&&At.computeBoneTexture(),it.setValue(D,"boneTexture",At.boneTexture,x))}L.isBatchedMesh&&(it.setOptional(D,L,"batchingTexture"),it.setValue(D,"batchingTexture",L._matricesTexture,x),it.setOptional(D,L,"batchingIdTexture"),it.setValue(D,"batchingIdTexture",L._indirectTexture,x),it.setOptional(D,L,"batchingColorTexture"),L._colorsTexture!==null&&it.setValue(D,"batchingColorTexture",L._colorsTexture,x));const ca=k.morphAttributes;if((ca.position!==void 0||ca.normal!==void 0||ca.color!==void 0)&&Re.update(L,k,Bt),(Pt||Me.receiveShadow!==L.receiveShadow)&&(Me.receiveShadow=L.receiveShadow,it.setValue(D,"receiveShadow",L.receiveShadow)),G.isMeshGouraudMaterial&&G.envMap!==null&&(Wt.envMap.value=ye,Wt.flipEnvMap.value=ye.isCubeTexture&&ye.isRenderTargetTexture===!1?-1:1),G.isMeshStandardMaterial&&G.envMap===null&&U.environment!==null&&(Wt.envMapIntensity.value=U.environmentIntensity),Pt&&(it.setValue(D,"toneMappingExposure",S.toneMappingExposure),Me.needsLights&&To(Wt,la),te&&G.fog===!0&&ne.refreshFogUniforms(Wt,te),ne.refreshMaterialUniforms(Wt,G,X,ie,p.state.transmissionRenderTarget[M.id]),or.upload(D,Pn(Me),Wt,x)),G.isShaderMaterial&&G.uniformsNeedUpdate===!0&&(or.upload(D,Pn(Me),Wt,x),G.uniformsNeedUpdate=!1),G.isSpriteMaterial&&it.setValue(D,"center",L.center),it.setValue(D,"modelViewMatrix",L.modelViewMatrix),it.setValue(D,"normalMatrix",L.normalMatrix),it.setValue(D,"modelMatrix",L.matrixWorld),G.isShaderMaterial||G.isRawShaderMaterial){const At=G.uniformsGroups;for(let ha=0,ti=At.length;ha<ti;ha++){const In=At[ha];I.update(In,Bt),I.bind(In,Bt)}}return Bt}function To(M,U){M.ambientLightColor.needsUpdate=U,M.lightProbe.needsUpdate=U,M.directionalLights.needsUpdate=U,M.directionalLightShadows.needsUpdate=U,M.pointLights.needsUpdate=U,M.pointLightShadows.needsUpdate=U,M.spotLights.needsUpdate=U,M.spotLightShadows.needsUpdate=U,M.rectAreaLights.needsUpdate=U,M.hemisphereLights.needsUpdate=U}function Ao(M){return M.isMeshLambertMaterial||M.isMeshToonMaterial||M.isMeshPhongMaterial||M.isMeshStandardMaterial||M.isShadowMaterial||M.isShaderMaterial&&M.lights===!0}this.getActiveCubeFace=function(){return R},this.getActiveMipmapLevel=function(){return A},this.getRenderTarget=function(){return P},this.setRenderTargetTextures=function(M,U,k){H.get(M.texture).__webglTexture=U,H.get(M.depthTexture).__webglTexture=k;const G=H.get(M);G.__hasExternalTextures=!0,G.__autoAllocateDepthBuffer=k===void 0,G.__autoAllocateDepthBuffer||ze.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),G.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(M,U){const k=H.get(M);k.__webglFramebuffer=U,k.__useDefaultFramebuffer=U===void 0},this.setRenderTarget=function(M,U=0,k=0){P=M,R=U,A=k;let G=!0,L=null,te=!1,fe=!1;if(M){const _e=H.get(M);if(_e.__useDefaultFramebuffer!==void 0)F.bindFramebuffer(D.FRAMEBUFFER,null),G=!1;else if(_e.__webglFramebuffer===void 0)x.setupRenderTarget(M);else if(_e.__hasExternalTextures)x.rebindTextures(M,H.get(M.texture).__webglTexture,H.get(M.depthTexture).__webglTexture);else if(M.depthBuffer){const Pe=M.depthTexture;if(_e.__boundDepthTexture!==Pe){if(Pe!==null&&H.has(Pe)&&(M.width!==Pe.image.width||M.height!==Pe.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");x.setupDepthRenderbuffer(M)}}const ye=M.texture;(ye.isData3DTexture||ye.isDataArrayTexture||ye.isCompressedArrayTexture)&&(fe=!0);const Ce=H.get(M).__webglFramebuffer;M.isWebGLCubeRenderTarget?(Array.isArray(Ce[U])?L=Ce[U][k]:L=Ce[U],te=!0):M.samples>0&&x.useMultisampledRTT(M)===!1?L=H.get(M).__webglMultisampledFramebuffer:Array.isArray(Ce)?L=Ce[k]:L=Ce,C.copy(M.viewport),z.copy(M.scissor),B=M.scissorTest}else C.copy(we).multiplyScalar(X).floor(),z.copy(be).multiplyScalar(X).floor(),B=je;if(F.bindFramebuffer(D.FRAMEBUFFER,L)&&G&&F.drawBuffers(M,L),F.viewport(C),F.scissor(z),F.setScissorTest(B),te){const _e=H.get(M.texture);D.framebufferTexture2D(D.FRAMEBUFFER,D.COLOR_ATTACHMENT0,D.TEXTURE_CUBE_MAP_POSITIVE_X+U,_e.__webglTexture,k)}else if(fe){const _e=H.get(M.texture),ye=U||0;D.framebufferTextureLayer(D.FRAMEBUFFER,D.COLOR_ATTACHMENT0,_e.__webglTexture,k||0,ye)}E=-1},this.readRenderTargetPixels=function(M,U,k,G,L,te,fe){if(!(M&&M.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let _e=H.get(M).__webglFramebuffer;if(M.isWebGLCubeRenderTarget&&fe!==void 0&&(_e=_e[fe]),_e){F.bindFramebuffer(D.FRAMEBUFFER,_e);try{const ye=M.texture,Ce=ye.format,Pe=ye.type;if(!Oe.textureFormatReadable(Ce)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!Oe.textureTypeReadable(Pe)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}U>=0&&U<=M.width-G&&k>=0&&k<=M.height-L&&D.readPixels(U,k,G,L,De.convert(Ce),De.convert(Pe),te)}finally{const ye=P!==null?H.get(P).__webglFramebuffer:null;F.bindFramebuffer(D.FRAMEBUFFER,ye)}}},this.readRenderTargetPixelsAsync=async function(M,U,k,G,L,te,fe){if(!(M&&M.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let _e=H.get(M).__webglFramebuffer;if(M.isWebGLCubeRenderTarget&&fe!==void 0&&(_e=_e[fe]),_e){const ye=M.texture,Ce=ye.format,Pe=ye.type;if(!Oe.textureFormatReadable(Ce))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!Oe.textureTypeReadable(Pe))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(U>=0&&U<=M.width-G&&k>=0&&k<=M.height-L){F.bindFramebuffer(D.FRAMEBUFFER,_e);const Ee=D.createBuffer();D.bindBuffer(D.PIXEL_PACK_BUFFER,Ee),D.bufferData(D.PIXEL_PACK_BUFFER,te.byteLength,D.STREAM_READ),D.readPixels(U,k,G,L,De.convert(Ce),De.convert(Pe),0);const We=P!==null?H.get(P).__webglFramebuffer:null;F.bindFramebuffer(D.FRAMEBUFFER,We);const at=D.fenceSync(D.SYNC_GPU_COMMANDS_COMPLETE,0);return D.flush(),await Xo(D,at,4),D.bindBuffer(D.PIXEL_PACK_BUFFER,Ee),D.getBufferSubData(D.PIXEL_PACK_BUFFER,0,te),D.deleteBuffer(Ee),D.deleteSync(at),te}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(M,U=null,k=0){M.isTexture!==!0&&(Ma("WebGLRenderer: copyFramebufferToTexture function signature has changed."),U=arguments[0]||null,M=arguments[1]);const G=Math.pow(2,-k),L=Math.floor(M.image.width*G),te=Math.floor(M.image.height*G),fe=U!==null?U.x:0,_e=U!==null?U.y:0;x.setTexture2D(M,0),D.copyTexSubImage2D(D.TEXTURE_2D,k,0,0,fe,_e,L,te),F.unbindTexture()},this.copyTextureToTexture=function(M,U,k=null,G=null,L=0){M.isTexture!==!0&&(Ma("WebGLRenderer: copyTextureToTexture function signature has changed."),G=arguments[0]||null,M=arguments[1],U=arguments[2],L=arguments[3]||0,k=null);let te,fe,_e,ye,Ce,Pe,Ee,We,at;const rt=M.isCompressedTexture?M.mipmaps[L]:M.image;k!==null?(te=k.max.x-k.min.x,fe=k.max.y-k.min.y,_e=k.isBox3?k.max.z-k.min.z:1,ye=k.min.x,Ce=k.min.y,Pe=k.isBox3?k.min.z:0):(te=rt.width,fe=rt.height,_e=rt.depth||1,ye=0,Ce=0,Pe=0),G!==null?(Ee=G.x,We=G.y,at=G.z):(Ee=0,We=0,at=0);const ct=De.convert(U.format),nt=De.convert(U.type);let Me;U.isData3DTexture?(x.setTexture3D(U,0),Me=D.TEXTURE_3D):U.isDataArrayTexture||U.isCompressedArrayTexture?(x.setTexture2DArray(U,0),Me=D.TEXTURE_2D_ARRAY):(x.setTexture2D(U,0),Me=D.TEXTURE_2D),D.pixelStorei(D.UNPACK_FLIP_Y_WEBGL,U.flipY),D.pixelStorei(D.UNPACK_PREMULTIPLY_ALPHA_WEBGL,U.premultiplyAlpha),D.pixelStorei(D.UNPACK_ALIGNMENT,U.unpackAlignment);const di=D.getParameter(D.UNPACK_ROW_LENGTH),pi=D.getParameter(D.UNPACK_IMAGE_HEIGHT),Bt=D.getParameter(D.UNPACK_SKIP_PIXELS),Pi=D.getParameter(D.UNPACK_SKIP_ROWS),Pt=D.getParameter(D.UNPACK_SKIP_IMAGES);D.pixelStorei(D.UNPACK_ROW_LENGTH,rt.width),D.pixelStorei(D.UNPACK_IMAGE_HEIGHT,rt.height),D.pixelStorei(D.UNPACK_SKIP_PIXELS,ye),D.pixelStorei(D.UNPACK_SKIP_ROWS,Ce),D.pixelStorei(D.UNPACK_SKIP_IMAGES,Pe);const la=M.isDataArrayTexture||M.isData3DTexture,it=U.isDataArrayTexture||U.isData3DTexture;if(M.isRenderTargetTexture||M.isDepthTexture){const Wt=H.get(M),ca=H.get(U),At=H.get(Wt.__renderTarget),ha=H.get(ca.__renderTarget);F.bindFramebuffer(D.READ_FRAMEBUFFER,At.__webglFramebuffer),F.bindFramebuffer(D.DRAW_FRAMEBUFFER,ha.__webglFramebuffer);for(let ti=0;ti<_e;ti++)la&&D.framebufferTextureLayer(D.READ_FRAMEBUFFER,D.COLOR_ATTACHMENT0,H.get(M).__webglTexture,L,Pe+ti),M.isDepthTexture?(it&&D.framebufferTextureLayer(D.DRAW_FRAMEBUFFER,D.COLOR_ATTACHMENT0,H.get(U).__webglTexture,L,at+ti),D.blitFramebuffer(ye,Ce,te,fe,Ee,We,te,fe,D.DEPTH_BUFFER_BIT,D.NEAREST)):it?D.copyTexSubImage3D(Me,L,Ee,We,at+ti,ye,Ce,te,fe):D.copyTexSubImage2D(Me,L,Ee,We,at+ti,ye,Ce,te,fe);F.bindFramebuffer(D.READ_FRAMEBUFFER,null),F.bindFramebuffer(D.DRAW_FRAMEBUFFER,null)}else it?M.isDataTexture||M.isData3DTexture?D.texSubImage3D(Me,L,Ee,We,at,te,fe,_e,ct,nt,rt.data):U.isCompressedArrayTexture?D.compressedTexSubImage3D(Me,L,Ee,We,at,te,fe,_e,ct,rt.data):D.texSubImage3D(Me,L,Ee,We,at,te,fe,_e,ct,nt,rt):M.isDataTexture?D.texSubImage2D(D.TEXTURE_2D,L,Ee,We,te,fe,ct,nt,rt.data):M.isCompressedTexture?D.compressedTexSubImage2D(D.TEXTURE_2D,L,Ee,We,rt.width,rt.height,ct,rt.data):D.texSubImage2D(D.TEXTURE_2D,L,Ee,We,te,fe,ct,nt,rt);D.pixelStorei(D.UNPACK_ROW_LENGTH,di),D.pixelStorei(D.UNPACK_IMAGE_HEIGHT,pi),D.pixelStorei(D.UNPACK_SKIP_PIXELS,Bt),D.pixelStorei(D.UNPACK_SKIP_ROWS,Pi),D.pixelStorei(D.UNPACK_SKIP_IMAGES,Pt),L===0&&U.generateMipmaps&&D.generateMipmap(Me),F.unbindTexture()},this.copyTextureToTexture3D=function(M,U,k=null,G=null,L=0){return M.isTexture!==!0&&(Ma("WebGLRenderer: copyTextureToTexture3D function signature has changed."),k=arguments[0]||null,G=arguments[1]||null,M=arguments[2],U=arguments[3],L=arguments[4]||0),Ma('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(M,U,k,G,L)},this.initRenderTarget=function(M){H.get(M).__webglFramebuffer===void 0&&x.setupRenderTarget(M)},this.initTexture=function(M){M.isCubeTexture?x.setTextureCube(M,0):M.isData3DTexture?x.setTexture3D(M,0):M.isDataArrayTexture||M.isCompressedArrayTexture?x.setTexture2DArray(M,0):x.setTexture2D(M,0),F.unbindTexture()},this.resetState=function(){R=0,A=0,P=null,F.reset(),Ze.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return 2e3}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorspace=Ve._getDrawingBufferColorSpace(e),t.unpackColorSpace=Ve._getUnpackColorSpace()}}class gn{constructor(e,t=25e-5){this.isFogExp2=!0,this.name="",this.color=new Se(e),this.density=t}clone(){return new gn(this.color,this.density)}toJSON(){return{type:"FogExp2",name:this.name,color:this.color.getHex(),density:this.density}}}class rp extends Mt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new hi,this.environmentIntensity=1,this.environmentRotation=new hi,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}new T;new T;new T;new T;new Le;new Le;new et;new T;new T;new T;new Le;new Le;new Le;class np extends yt{constructor(e=null,t=1,i=1,r,n,s,o,l,c=1003,u=1003,d,h){super(null,s,o,l,c,u,r,n,d,h),this.isDataTexture=!0,this.image={data:e,width:t,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class As extends st{constructor(e,t,i,r=1){super(e,t,i),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=r}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){const e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}}const Wi=new et,Rs=new et,er=[],Cs=new Ti,sp=new et,ga=new Ye,va=new aa;class Ps extends Ye{constructor(e,t,i){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new As(new Float32Array(i*16),16),this.instanceColor=null,this.morphTexture=null,this.count=i,this.boundingBox=null,this.boundingSphere=null;for(let r=0;r<i;r++)this.setMatrixAt(r,sp)}computeBoundingBox(){const e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new Ti),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let i=0;i<t;i++)this.getMatrixAt(i,Wi),Cs.copy(e.boundingBox).applyMatrix4(Wi),this.boundingBox.union(Cs)}computeBoundingSphere(){const e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new aa),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let i=0;i<t;i++)this.getMatrixAt(i,Wi),va.copy(e.boundingSphere).applyMatrix4(Wi),this.boundingSphere.union(va)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){const i=t.morphTargetInfluences,r=this.morphTexture.source.data.data,n=i.length+1,s=e*n+1;for(let o=0;o<i.length;o++)i[o]=r[s+o]}raycast(e,t){const i=this.matrixWorld,r=this.count;if(ga.geometry=this.geometry,ga.material=this.material,ga.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),va.copy(this.boundingSphere),va.applyMatrix4(i),e.ray.intersectsSphere(va)!==!1))for(let n=0;n<r;n++){this.getMatrixAt(n,Wi),Rs.multiplyMatrices(i,Wi),ga.matrixWorld=Rs,ga.raycast(e,er);for(let s=0,o=er.length;s<o;s++){const l=er[s];l.instanceId=n,l.object=this,t.push(l)}er.length=0}}setColorAt(e,t){this.instanceColor===null&&(this.instanceColor=new As(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3)}setMatrixAt(e,t){t.toArray(this.instanceMatrix.array,e*16)}setMorphAt(e,t){const i=t.morphTargetInfluences,r=i.length+1;this.morphTexture===null&&(this.morphTexture=new np(new Float32Array(r*this.count),r,this.count,1028,1015));const n=this.morphTexture.source.data.data;let s=0;for(let c=0;c<i.length;c++)s+=i[c];const o=this.geometry.morphTargetsRelative?1:1-s,l=r*e;n[l]=o,n.set(i,l+1)}updateMorphTargets(){}dispose(){return this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null),this}}class vn extends ra{static get type(){return"PointsMaterial"}constructor(e){super(),this.isPointsMaterial=!0,this.color=new Se(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}const Ls=new et,Qr=new un,tr=new aa,ir=new T;class Ji extends Mt{constructor(e=new mt,t=new vn){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}raycast(e,t){const i=this.geometry,r=this.matrixWorld,n=e.params.Points.threshold,s=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),tr.copy(i.boundingSphere),tr.applyMatrix4(r),tr.radius+=n,e.ray.intersectsSphere(tr)===!1)return;Ls.copy(r).invert(),Qr.copy(e.ray).applyMatrix4(Ls);const o=n/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=i.index,u=i.attributes.position;if(c!==null){const d=Math.max(0,s.start),h=Math.min(c.count,s.start+s.count);for(let f=d,_=h;f<_;f++){const v=c.getX(f);ir.fromBufferAttribute(u,v),Is(ir,v,l,r,e,t,this)}}else{const d=Math.max(0,s.start),h=Math.min(u.count,s.start+s.count);for(let f=d,_=h;f<_;f++)ir.fromBufferAttribute(u,f),Is(ir,f,l,r,e,t,this)}}updateMorphTargets(){const e=this.geometry.morphAttributes,t=Object.keys(e);if(t.length>0){const i=e[t[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,n=i.length;r<n;r++){const s=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[s]=r}}}}}function Is(a,e,t,i,r,n,s){const o=Qr.distanceSqToPoint(a);if(o<t){const l=new T;Qr.closestPointToPoint(a,l),l.applyMatrix4(i);const c=r.ray.origin.distanceTo(l);if(c<r.near||c>r.far)return;n.push({distance:c,distanceToRay:Math.sqrt(o),point:l,index:e,face:null,faceIndex:null,barycoord:null,object:s})}}class Pa extends mt{constructor(e=1,t=1,i=1,r=32,n=1,s=!1,o=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:i,radialSegments:r,heightSegments:n,openEnded:s,thetaStart:o,thetaLength:l};const c=this;r=Math.floor(r),n=Math.floor(n);const u=[],d=[],h=[],f=[];let _=0;const v=[],m=i/2;let p=0;w(),s===!1&&(e>0&&b(!0),t>0&&b(!1)),this.setIndex(u),this.setAttribute("position",new lt(d,3)),this.setAttribute("normal",new lt(h,3)),this.setAttribute("uv",new lt(f,2));function w(){const S=new T,N=new T;let R=0;const A=(t-e)/i;for(let P=0;P<=n;P++){const E=[],y=P/n,C=y*(t-e)+e;for(let z=0;z<=r;z++){const B=z/r,j=B*l+o,J=Math.sin(j),$=Math.cos(j);N.x=C*J,N.y=-y*i+m,N.z=C*$,d.push(N.x,N.y,N.z),S.set(J,A,$).normalize(),h.push(S.x,S.y,S.z),f.push(B,1-y),E.push(_++)}v.push(E)}for(let P=0;P<r;P++)for(let E=0;E<n;E++){const y=v[E][P],C=v[E+1][P],z=v[E+1][P+1],B=v[E][P+1];(e>0||E!==0)&&(u.push(y,C,B),R+=3),(t>0||E!==n-1)&&(u.push(C,z,B),R+=3)}c.addGroup(p,R,0),p+=R}function b(S){const N=_,R=new Le,A=new T;let P=0;const E=S===!0?e:t,y=S===!0?1:-1;for(let z=1;z<=r;z++)d.push(0,m*y,0),h.push(0,y,0),f.push(.5,.5),_++;const C=_;for(let z=0;z<=r;z++){const B=z/r*l+o,j=Math.cos(B),J=Math.sin(B);A.x=E*J,A.y=m*y,A.z=E*j,d.push(A.x,A.y,A.z),h.push(0,y,0),R.x=j*.5+.5,R.y=J*.5*y+.5,f.push(R.x,R.y),_++}for(let z=0;z<r;z++){const B=N+z,j=C+z;S===!0?u.push(j,j+1,B):u.push(j+1,j,B),P+=3}c.addGroup(p,P,S===!0?1:2),p+=P}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Pa(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}let _n=class _o extends mt{constructor(e=[],t=[],i=1,r=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:t,radius:i,detail:r};const n=[],s=[];o(r),c(i),u(),this.setAttribute("position",new lt(n,3)),this.setAttribute("normal",new lt(n.slice(),3)),this.setAttribute("uv",new lt(s,2)),r===0?this.computeVertexNormals():this.normalizeNormals();function o(w){const b=new T,S=new T,N=new T;for(let R=0;R<t.length;R+=3)f(t[R+0],b),f(t[R+1],S),f(t[R+2],N),l(b,S,N,w)}function l(w,b,S,N){const R=N+1,A=[];for(let P=0;P<=R;P++){A[P]=[];const E=w.clone().lerp(S,P/R),y=b.clone().lerp(S,P/R),C=R-P;for(let z=0;z<=C;z++)z===0&&P===R?A[P][z]=E:A[P][z]=E.clone().lerp(y,z/C)}for(let P=0;P<R;P++)for(let E=0;E<2*(R-P)-1;E++){const y=Math.floor(E/2);E%2===0?(h(A[P][y+1]),h(A[P+1][y]),h(A[P][y])):(h(A[P][y+1]),h(A[P+1][y+1]),h(A[P+1][y]))}}function c(w){const b=new T;for(let S=0;S<n.length;S+=3)b.x=n[S+0],b.y=n[S+1],b.z=n[S+2],b.normalize().multiplyScalar(w),n[S+0]=b.x,n[S+1]=b.y,n[S+2]=b.z}function u(){const w=new T;for(let b=0;b<n.length;b+=3){w.x=n[b+0],w.y=n[b+1],w.z=n[b+2];const S=m(w)/2/Math.PI+.5,N=p(w)/Math.PI+.5;s.push(S,1-N)}_(),d()}function d(){for(let w=0;w<s.length;w+=6){const b=s[w+0],S=s[w+2],N=s[w+4],R=Math.max(b,S,N),A=Math.min(b,S,N);R>.9&&A<.1&&(b<.2&&(s[w+0]+=1),S<.2&&(s[w+2]+=1),N<.2&&(s[w+4]+=1))}}function h(w){n.push(w.x,w.y,w.z)}function f(w,b){const S=w*3;b.x=e[S+0],b.y=e[S+1],b.z=e[S+2]}function _(){const w=new T,b=new T,S=new T,N=new T,R=new Le,A=new Le,P=new Le;for(let E=0,y=0;E<n.length;E+=9,y+=6){w.set(n[E+0],n[E+1],n[E+2]),b.set(n[E+3],n[E+4],n[E+5]),S.set(n[E+6],n[E+7],n[E+8]),R.set(s[y+0],s[y+1]),A.set(s[y+2],s[y+3]),P.set(s[y+4],s[y+5]),N.copy(w).add(b).add(S).divideScalar(3);const C=m(N);v(R,y+0,w,C),v(A,y+2,b,C),v(P,y+4,S,C)}}function v(w,b,S,N){N<0&&w.x===1&&(s[b]=w.x-1),S.x===0&&S.z===0&&(s[b]=N/2/Math.PI+.5)}function m(w){return Math.atan2(w.z,-w.x)}function p(w){return Math.atan2(-w.y,Math.sqrt(w.x*w.x+w.z*w.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new _o(e.vertices,e.indices,e.radius,e.details)}};class xn extends _n{constructor(e=1,t=0){const i=(1+Math.sqrt(5))/2,r=1/i,n=[-1,-1,-1,-1,-1,1,-1,1,-1,-1,1,1,1,-1,-1,1,-1,1,1,1,-1,1,1,1,0,-r,-i,0,-r,i,0,r,-i,0,r,i,-r,-i,0,-r,i,0,r,-i,0,r,i,0,-i,0,-r,i,0,-r,-i,0,r,i,0,r],s=[3,11,7,3,7,15,3,15,13,7,19,17,7,17,6,7,6,15,17,4,8,17,8,10,17,10,6,8,0,16,8,16,2,8,2,10,0,12,1,0,1,18,0,18,16,6,10,2,6,2,13,6,13,15,2,16,18,2,18,3,2,3,13,18,1,9,18,9,11,18,11,3,4,14,12,4,12,0,4,0,8,11,9,5,11,5,19,11,19,7,19,5,14,19,14,4,19,4,17,1,12,14,1,14,5,1,5,9];super(n,s,e,t),this.type="DodecahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new xn(e.radius,e.detail)}}class Qi extends _n{constructor(e=1,t=0){const i=(1+Math.sqrt(5))/2,r=[-1,i,0,1,i,0,-1,-i,0,1,-i,0,0,-1,i,0,1,i,0,-1,-i,0,1,-i,i,0,-1,i,0,1,-i,0,-1,-i,0,1],n=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(r,n,e,t),this.type="IcosahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new Qi(e.radius,e.detail)}}class Ei extends _n{constructor(e=1,t=0){const i=[1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],r=[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2];super(i,r,e,t),this.type="OctahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new Ei(e.radius,e.detail)}}class Ai extends mt{constructor(e=.5,t=1,i=32,r=1,n=0,s=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:e,outerRadius:t,thetaSegments:i,phiSegments:r,thetaStart:n,thetaLength:s},i=Math.max(3,i),r=Math.max(1,r);const o=[],l=[],c=[],u=[];let d=e;const h=(t-e)/r,f=new T,_=new Le;for(let v=0;v<=r;v++){for(let m=0;m<=i;m++){const p=n+m/i*s;f.x=d*Math.cos(p),f.y=d*Math.sin(p),l.push(f.x,f.y,f.z),c.push(0,0,1),_.x=(f.x/t+1)/2,_.y=(f.y/t+1)/2,u.push(_.x,_.y)}d+=h}for(let v=0;v<r;v++){const m=v*(i+1);for(let p=0;p<i;p++){const w=p+m,b=w,S=w+i+1,N=w+i+2,R=w+1;o.push(b,S,R),o.push(S,N,R)}}this.setIndex(o),this.setAttribute("position",new lt(l,3)),this.setAttribute("normal",new lt(c,3)),this.setAttribute("uv",new lt(u,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Ai(e.innerRadius,e.outerRadius,e.thetaSegments,e.phiSegments,e.thetaStart,e.thetaLength)}}class Et extends mt{constructor(e=1,t=32,i=16,r=0,n=Math.PI*2,s=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:i,phiStart:r,phiLength:n,thetaStart:s,thetaLength:o},t=Math.max(3,Math.floor(t)),i=Math.max(2,Math.floor(i));const l=Math.min(s+o,Math.PI);let c=0;const u=[],d=new T,h=new T,f=[],_=[],v=[],m=[];for(let p=0;p<=i;p++){const w=[],b=p/i;let S=0;p===0&&s===0?S=.5/t:p===i&&l===Math.PI&&(S=-.5/t);for(let N=0;N<=t;N++){const R=N/t;d.x=-e*Math.cos(r+R*n)*Math.sin(s+b*o),d.y=e*Math.cos(s+b*o),d.z=e*Math.sin(r+R*n)*Math.sin(s+b*o),_.push(d.x,d.y,d.z),h.copy(d).normalize(),v.push(h.x,h.y,h.z),m.push(R+S,1-b),w.push(c++)}u.push(w)}for(let p=0;p<i;p++)for(let w=0;w<t;w++){const b=u[p][w+1],S=u[p][w],N=u[p+1][w],R=u[p+1][w+1];(p!==0||s>0)&&f.push(b,S,R),(p!==i-1||l<Math.PI)&&f.push(S,N,R)}this.setIndex(f),this.setAttribute("position",new lt(_,3)),this.setAttribute("normal",new lt(v,3)),this.setAttribute("uv",new lt(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Et(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}class wi extends mt{constructor(e=1,t=.4,i=12,r=48,n=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:i,tubularSegments:r,arc:n},i=Math.floor(i),r=Math.floor(r);const s=[],o=[],l=[],c=[],u=new T,d=new T,h=new T;for(let f=0;f<=i;f++)for(let _=0;_<=r;_++){const v=_/r*n,m=f/i*Math.PI*2;d.x=(e+t*Math.cos(m))*Math.cos(v),d.y=(e+t*Math.cos(m))*Math.sin(v),d.z=t*Math.sin(m),o.push(d.x,d.y,d.z),u.x=e*Math.cos(v),u.y=e*Math.sin(v),h.subVectors(d,u).normalize(),l.push(h.x,h.y,h.z),c.push(_/r),c.push(f/i)}for(let f=1;f<=i;f++)for(let _=1;_<=r;_++){const v=(r+1)*f+_-1,m=(r+1)*(f-1)+_-1,p=(r+1)*(f-1)+_,w=(r+1)*f+_;s.push(v,m,w),s.push(m,p,w)}this.setIndex(s),this.setAttribute("position",new lt(o,3)),this.setAttribute("normal",new lt(l,3)),this.setAttribute("uv",new lt(c,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new wi(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc)}}class Ft extends ra{static get type(){return"MeshStandardMaterial"}constructor(e){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.color=new Se(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Se(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=0,this.normalScale=new Le(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new hi,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}const Us={enabled:!1,files:{},add:function(a,e){this.enabled!==!1&&(this.files[a]=e)},get:function(a){if(this.enabled!==!1)return this.files[a]},remove:function(a){delete this.files[a]},clear:function(){this.files={}}};class op{constructor(e,t,i){const r=this;let n=!1,s=0,o=0,l;const c=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=i,this.itemStart=function(u){o++,n===!1&&r.onStart!==void 0&&r.onStart(u,s,o),n=!0},this.itemEnd=function(u){s++,r.onProgress!==void 0&&r.onProgress(u,s,o),s===o&&(n=!1,r.onLoad!==void 0&&r.onLoad())},this.itemError=function(u){r.onError!==void 0&&r.onError(u)},this.resolveURL=function(u){return l?l(u):u},this.setURLModifier=function(u){return l=u,this},this.addHandler=function(u,d){return c.push(u,d),this},this.removeHandler=function(u){const d=c.indexOf(u);return d!==-1&&c.splice(d,2),this},this.getHandler=function(u){for(let d=0,h=c.length;d<h;d+=2){const f=c[d],_=c[d+1];if(f.global&&(f.lastIndex=0),f.test(u))return _}return null}}}const lp=new op;class yn{constructor(e){this.manager=e!==void 0?e:lp,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(e,t){const i=this;return new Promise(function(r,n){i.load(e,r,t,n)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}}yn.DEFAULT_MATERIAL_NAME="__DEFAULT";class cp extends yn{constructor(e){super(e)}load(e,t,i,r){this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const n=this,s=Us.get(e);if(s!==void 0)return n.manager.itemStart(e),setTimeout(function(){t&&t(s),n.manager.itemEnd(e)},0),s;const o=Ra("img");function l(){u(),Us.add(e,this),t&&t(this),n.manager.itemEnd(e)}function c(d){u(),r&&r(d),n.manager.itemError(e),n.manager.itemEnd(e)}function u(){o.removeEventListener("load",l,!1),o.removeEventListener("error",c,!1)}return o.addEventListener("load",l,!1),o.addEventListener("error",c,!1),e.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(o.crossOrigin=this.crossOrigin),n.manager.itemStart(e),o.src=e,o}}class hp extends yn{constructor(e){super(e)}load(e,t,i,r){const n=new yt,s=new cp(this.manager);return s.setCrossOrigin(this.crossOrigin),s.setPath(this.path),s.load(e,function(o){n.image=o,n.needsUpdate=!0,t!==void 0&&t(n)},i,r),n}}class xo extends Mt{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new Se(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(t.object.target=this.target.uuid),t}}const Br=new et,Ds=new T,Ns=new T;class up{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Le(512,512),this.map=null,this.mapPass=null,this.matrix=new et,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new fn,this._frameExtents=new Le(1,1),this._viewportCount=1,this._viewports=[new Qe(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,i=this.matrix;Ds.setFromMatrixPosition(e.matrixWorld),t.position.copy(Ds),Ns.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Ns),t.updateMatrixWorld(),Br.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Br),i.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),i.multiply(Br)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}const Os=new et,_a=new T,kr=new T;class dp extends up{constructor(){super(new Dt(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new Le(4,2),this._viewportCount=6,this._viewports=[new Qe(2,1,1,1),new Qe(0,1,1,1),new Qe(3,1,1,1),new Qe(1,1,1,1),new Qe(3,0,1,1),new Qe(1,0,1,1)],this._cubeDirections=[new T(1,0,0),new T(-1,0,0),new T(0,0,1),new T(0,0,-1),new T(0,1,0),new T(0,-1,0)],this._cubeUps=[new T(0,1,0),new T(0,1,0),new T(0,1,0),new T(0,1,0),new T(0,0,1),new T(0,0,-1)]}updateMatrices(e,t=0){const i=this.camera,r=this.matrix,n=e.distance||i.far;n!==i.far&&(i.far=n,i.updateProjectionMatrix()),_a.setFromMatrixPosition(e.matrixWorld),i.position.copy(_a),kr.copy(i.position),kr.add(this._cubeDirections[t]),i.up.copy(this._cubeUps[t]),i.lookAt(kr),i.updateMatrixWorld(),r.makeTranslation(-_a.x,-_a.y,-_a.z),Os.multiplyMatrices(i.projectionMatrix,i.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Os)}}class hr extends xo{constructor(e,t,i=0,r=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=i,this.decay=r,this.shadow=new dp}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}}class pp extends xo{constructor(e,t){super(e,t),this.isAmbientLight=!0,this.type="AmbientLight"}}const Fs=new et;class fp{constructor(e,t,i=0,r=1/0){this.ray=new un(e,t),this.near=i,this.far=r,this.camera=null,this.layers=new dn,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,(t.near+t.far)/(t.near-t.far)).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):console.error("THREE.Raycaster: Unsupported camera type: "+t.type)}setFromXRController(e){return Fs.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(Fs),this}intersectObject(e,t=!0,i=[]){return en(e,this,i,t),i.sort(zs),i}intersectObjects(e,t=!0,i=[]){for(let r=0,n=e.length;r<n;r++)en(e[r],this,i,t);return i.sort(zs),i}}function zs(a,e){return a.distance-e.distance}function en(a,e,t,i){let r=!0;if(a.layers.test(e.layers)&&a.raycast(e,t)===!1&&(r=!1),r===!0&&i===!0){const n=a.children;for(let s=0,o=n.length;s<o;s++)en(n[s],e,t,!0)}}class mp{constructor(e=1,t=0,i=0){return this.radius=e,this.phi=t,this.theta=i,this}set(e,t,i){return this.radius=e,this.phi=t,this.theta=i,this}copy(e){return this.radius=e.radius,this.phi=e.phi,this.theta=e.theta,this}makeSafe(){return this.phi=Math.max(1e-6,Math.min(Math.PI-1e-6,this.phi)),this}setFromVector3(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}setFromCartesianCoords(e,t,i){return this.radius=Math.sqrt(e*e+t*t+i*i),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(e,i),this.phi=Math.acos(xt(t/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"170"}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="170");(function(){const a=document.createElement("link").relList;if(a&&a.supports&&a.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))t(i);new MutationObserver(i=>{for(const r of i)if(r.type==="childList")for(const n of r.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&t(n)}).observe(document,{childList:!0,subtree:!0});function e(i){const r={};return i.integrity&&(r.integrity=i.integrity),i.referrerPolicy&&(r.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?r.credentials="include":i.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function t(i){if(i.ep)return;i.ep=!0;const r=e(i);fetch(i.href,r)}})();let Ht=null,Mn=!1,tn=null,an=0,rn=!1;function gp(a){const e=Math.min(window.devicePixelRatio,2);return Ht=new ap({canvas:a,antialias:e<2,alpha:!1,powerPreference:"high-performance",stencil:!1,depth:!0}),Ht.setPixelRatio(e),Ht.setSize(a.clientWidth,a.clientHeight,!1),Ht.outputColorSpace=Ut,Ht.toneMapping=Ro,Ht.toneMappingExposure=1.1,Ht.shadowMap.enabled=!1,new ResizeObserver(t=>{const i=t[0];if(!i||!Ht)return;const{width:r,height:n}=i.contentRect,s=Math.min(window.devicePixelRatio,2);Ht.setSize(r,n,!1),Ht.setPixelRatio(s),window.dispatchEvent(new CustomEvent("universe-resize",{detail:{width:r,height:n}}))}).observe(a),document.addEventListener("visibilitychange",()=>{rn=document.hidden,!rn&&Mn&&Sn()}),Ht}function vp(a){tn=a,Mn=!0,an=performance.now(),Sn()}function Sn(){if(!Mn||rn)return;requestAnimationFrame(Sn);const a=performance.now(),e=Math.min((a-an)/1e3,.05);an=a,tn&&tn(e)}const qe={G2025:{id:"G2025",title:"2025–2029",primaryColor:3201168,accentColor:6356944,nebulaColor:538656,dustColor:269328,starTint:10551256,worldOffset:[0,0,0],scale:1.55,texturePath:"assets/galaxies/galaxy_2025_2029.png",status:"showcase"},G2020:{id:"G2020",title:"2020–2024",primaryColor:2652360,accentColor:5286128,nebulaColor:532544,dustColor:266270,starTint:11065599,worldOffset:[50800,21700,13e3],scale:1.06,texturePath:"assets/galaxies/galaxy_2020_2024.png",status:"known"},G2015:{id:"G2015",title:"2015–2019",primaryColor:6308032,accentColor:9461992,nebulaColor:2099280,dustColor:1049640,starTint:13674751,worldOffset:[44600,-18600,-17400],scale:1.01,texturePath:"assets/galaxies/galaxy_2015_2019.png",status:"known"},G2010:{id:"G2010",title:"2010–2014",primaryColor:1751224,accentColor:4251856,nebulaColor:671808,dustColor:530464,starTint:10551264,worldOffset:[-7400,32200,-47100],scale:.96,texturePath:"assets/galaxies/galaxy_2010_2014.png",status:"known"},G2005:{id:"G2005",title:"2005–2009",primaryColor:12869674,accentColor:14710848,nebulaColor:9052224,dustColor:4001808,starTint:16760960,worldOffset:[-40300,-20500,11200],scale:.92,texturePath:"assets/galaxies/galaxy_2005_2009.png",status:"known"},G2000:{id:"G2000",title:"2000–2004",primaryColor:12877098,accentColor:15247434,nebulaColor:8007696,dustColor:4004360,starTint:16769184,worldOffset:[-55800,14900,-31e3],scale:.88,texturePath:"assets/galaxies/galaxy_2000_2004.png",status:"known"},G2030:{id:"G2030",title:"2030–2034 UNCHARTED",primaryColor:4214896,accentColor:6320272,nebulaColor:1054760,dustColor:527380,starTint:8429760,worldOffset:[11200,-38400,-55800],scale:.84,texturePath:"assets/galaxies/galaxy_2030_2034.png",status:"uncharted"}},ar={position:[0,34e3,92e3],target:[0,0,0]},nn=[[-7200,0,-4e3],[0,0,6500],[8e3,0,-3200]],_p=180,xp=6500,yp=500,Gr=window.matchMedia("(prefers-reduced-motion: reduce)").matches,Mp=6e3;class Sp{camera;target=new T;fly=null;historyStack=[];isDragging=!1;leftDragMoved=!1;suppressNextLeftClick=!1;prevMouse=new Le;spherical=new mp;tmpVec=new T;canvas;zoomAnchor=null;velTheta=0;velPhi=0;velRadius=0;DAMPING=.11;lastUserActivity=performance.now();isIdleDrifting=!1;driftTime=0;travelVelocity=new T;thrustCandidate=!1;thrusting=!1;flightMode=!1;thrustStart=0;thrustPointer=new Le;thrustDirection=new T;suppressNextClick=!1;baseFov=55;warpFactor=0;WHEEL_DEFAULT=34e-5;WHEEL_SPEED=34e-5;keys=new Set;wormholeActive=!1;wormholeCooldownUntil=0;nextWormholeCheck=0;activeHyperGalaxy=null;boundaryInfluence=0;localGalaxyId=null;localGalaxyInfluence=0;selectedTarget=null;selectedTargetLabel="";UNIVERSE_SAFE_RADIUS=112e3;UNIVERSE_RETURN_RADIUS=148e3;UNIVERSE_MAX_RADIUS=19e4;constructor(e){this.canvas=e,this.camera=new Dt(this.baseFov,window.innerWidth/window.innerHeight,10,2e6);const[t,i,r]=ar.position,[n,s,o]=ar.target;this.camera.position.set(t,i,r),this.target.set(n,s,o),this.camera.lookAt(this.target),this.tmpVec.subVectors(this.camera.position,this.target),this.spherical.setFromVector3(this.tmpVec),this.thrustPointer.set(window.innerWidth*.5,window.innerHeight*.5),this._bindEvents(e),window.addEventListener("universe-resize",l=>{const c=l;this.camera.aspect=c.detail.width/c.detail.height,this.camera.updateProjectionMatrix()})}_onActivity(){this.lastUserActivity=performance.now(),this.isIdleDrifting&&(this.isIdleDrifting=!1)}_isTypingTarget(e){const t=e?.target?.tagName?.toLowerCase?.();return t==="input"||t==="textarea"||e?.target?.isContentEditable}_bindEvents(e){const t=()=>this._onActivity();window.addEventListener("pointermove",t,{passive:!0}),window.addEventListener("wheel",t,{passive:!0}),window.addEventListener("touchstart",t,{passive:!0}),e.addEventListener("contextmenu",n=>{n.preventDefault()}),e.addEventListener("mousedown",n=>{if(this._onActivity(),this.thrustPointer.set(n.clientX,n.clientY),n.button===0){this.isDragging=!0,this.leftDragMoved=!1,this.prevMouse.set(n.clientX,n.clientY),this.velTheta=0,this.velPhi=0;return}n.button===2&&(n.preventDefault(),this._startThrust())}),e.addEventListener("mousemove",n=>{if(this.thrustPointer.set(n.clientX,n.clientY),!this.isDragging)return;this._onActivity();const s=n.clientX-this.prevMouse.x,o=n.clientY-this.prevMouse.y;if(Math.abs(s)+Math.abs(o)>3&&(this.leftDragMoved=!0),this.localGalaxyId&&qe[this.localGalaxyId]){const l=new T(...qe[this.localGalaxyId].worldOffset);this.target.copy(l),this.tmpVec.subVectors(this.camera.position,this.target),this.spherical.setFromVector3(this.tmpVec),this.spherical.theta-=s*68e-5,this.spherical.phi=Je.clamp(this.spherical.phi-o*64e-5,.05,Math.PI-.05),this.tmpVec.setFromSpherical(this.spherical).add(this.target),this.camera.position.copy(this.tmpVec),this.camera.lookAt(this.target)}else this.spherical.theta-=s*68e-5,this.spherical.phi=Je.clamp(this.spherical.phi-o*64e-5,.05,Math.PI-.05);this.velTheta=0,this.velPhi=0,this.prevMouse.set(n.clientX,n.clientY)}),window.addEventListener("mouseup",n=>{n.button===0&&(this.suppressNextLeftClick=this.leftDragMoved,this.isDragging=!1,this.leftDragMoved=!1,this.velTheta=0,this.velPhi=0),n.button===2&&this._stopThrust()}),e.addEventListener("wheel",n=>this._onWheel(n),{passive:!1}),e.addEventListener("dblclick",n=>this._onDblClick(n));let i=0,r=[];e.addEventListener("touchstart",n=>{this._onActivity(),r=Array.from(n.touches),r.length===1?(this.isDragging=!0,this.prevMouse.set(r[0].clientX,r[0].clientY),this.velTheta=0,this.velPhi=0):r.length===2&&(this.isDragging=!1,i=Bs(r))},{passive:!0}),e.addEventListener("touchmove",n=>{if(this._onActivity(),r=Array.from(n.touches),r.length===1&&this.isDragging){const s=r[0].clientX-this.prevMouse.x,o=r[0].clientY-this.prevMouse.y;if(this.localGalaxyId&&qe[this.localGalaxyId]){const l=new T(...qe[this.localGalaxyId].worldOffset);this.target.copy(l),this.tmpVec.subVectors(this.camera.position,this.target),this.spherical.setFromVector3(this.tmpVec),this.spherical.theta-=s*72e-5,this.spherical.phi=Je.clamp(this.spherical.phi-o*67e-5,.05,Math.PI-.05),this.tmpVec.setFromSpherical(this.spherical).add(this.target),this.camera.position.copy(this.tmpVec),this.camera.lookAt(this.target)}else this.spherical.theta-=s*72e-5,this.spherical.phi=Je.clamp(this.spherical.phi-o*67e-5,.05,Math.PI-.05);this.velTheta=0,this.velPhi=0,this.prevMouse.set(r[0].clientX,r[0].clientY)}else if(r.length===2){const s=Bs(r),o=i-s,l=this.zoomAnchor?.x??(r[0].clientX+r[1].clientX)*.5,c=this.zoomAnchor?.y??(r[0].clientY+r[1].clientY)*.5;this._zoomTowardAnchor(o*34e-5,l,c),i=s}},{passive:!0}),e.addEventListener("touchend",()=>{this.isDragging=!1,this.velTheta=0,this.velPhi=0}),window.addEventListener("keydown",n=>{this._isTypingTarget(n)||(n.key==="Escape"&&window.dispatchEvent(new CustomEvent("universe-esc")),["KeyW","KeyA","KeyS","KeyD","KeyQ","KeyE"].includes(n.code)&&(n.preventDefault(),this.keys.add(n.code),this._onActivity()))}),window.addEventListener("keyup",n=>{this.keys.delete(n.code)}),window.addEventListener("blur",()=>{this.keys.clear(),this.isDragging=!1,this._stopThrust(!0)})}_startThrust(){this.thrusting||(this.flightMode=!0,this.thrusting=!0,this.thrustStart=performance.now(),this.thrustDirection.set(0,0,0),this.nextWormholeCheck=this.thrustStart+8500,window.dispatchEvent(new CustomEvent("universe-thrust-state",{detail:{active:!0,flightMode:!0,targeted:!!this.selectedTarget}})))}_stopThrust(e=!1){if(!this.thrusting&&!e)return;const t=this.thrusting?performance.now()-this.thrustStart:0;if(this.thrusting&&!e&&t<220){const i=this.selectedTarget?this.selectedTarget.clone().sub(this.camera.position).normalize():this._screenRayDirection(this.thrustPointer.x,this.thrustPointer.y),r=this.travelVelocity.dot(i);r<0&&this.travelVelocity.addScaledVector(i,-r),this.travelVelocity.addScaledVector(i,2600)}this.thrusting=!1,this.flightMode=!1,this.travelVelocity.multiplyScalar(e?0:.34),window.dispatchEvent(new CustomEvent("universe-thrust-state",{detail:{active:!1,flightMode:!1}}))}_orbit(e,t){this.velTheta-=e,this.velPhi-=t}_onWheel(e){e.preventDefault(),this._onActivity();const t=e.clientX,i=e.clientY,r=Je.clamp(e.deltaY,-120,120)*this.WHEEL_SPEED;this._zoomTowardAnchor(r,t,i)}_zoom(e){const t=Je.clamp(e,-.032,.032);this.velRadius+=t*this.spherical.radius*.065}_screenPointToFocusPoint(e,t){const i=this.canvas.getBoundingClientRect(),r=(e-i.left)/i.width*2-1,n=-((t-i.top)/i.height*2-1),s=new T(r,n,.5).unproject(this.camera),o=s.sub(this.camera.position).normalize(),l=this.camera.getWorldDirection(new T),c=l.dot(o);if(Math.abs(c)>1e-6){const u=l.dot(this.target.clone().sub(this.camera.position))/c;if(u>0)return this.camera.position.clone().addScaledVector(o,u)}return this.target.clone().addScaledVector(o,Math.max(this.spherical.radius*.65,3500))}_screenRayDirection(e,t){const i=this.canvas.getBoundingClientRect(),r=(e-i.left)/i.width*2-1,n=-((t-i.top)/i.height*2-1);return new T(r,n,.5).unproject(this.camera).sub(this.camera.position).normalize()}_updateKeyboard(e){if(this.keys.size===0)return;const t=this.camera.getWorldDirection(new T).normalize(),i=new T().crossVectors(t,this.camera.up).normalize(),r=this.camera.up.clone().normalize(),n=new T;if(this.keys.has("KeyW")&&n.add(t),this.keys.has("KeyS")&&n.sub(t),this.keys.has("KeyD")&&n.add(i),this.keys.has("KeyA")&&n.sub(i),this.keys.has("KeyE")&&n.add(r),this.keys.has("KeyQ")&&n.sub(r),n.lengthSq()===0)return;n.normalize();const s=this.flightMode?3200:1500;this.target.addScaledVector(n,s*e)}_maybeWormhole(e){if(!this.thrusting||this.wormholeActive)return;const t=performance.now();if((t-this.thrustStart)/1e3<7||t<this.wormholeCooldownUntil||t<this.nextWormholeCheck||(this.nextWormholeCheck=t+1400,Math.random()>.34))return;this.wormholeActive=!0,this.wormholeCooldownUntil=t+12e3;const r=new T(Math.random()*2-1,Math.random()*1.4-.7,Math.random()*2-1).normalize(),n=18e3+Math.random()*52e3,s=r.multiplyScalar(n),o=this.camera.position.clone().sub(this.target);window.dispatchEvent(new CustomEvent("universe-wormhole",{detail:{state:"enter"}})),setTimeout(()=>{this.target.copy(s),this.camera.position.copy(s).add(o),this.tmpVec.subVectors(this.camera.position,this.target),this.spherical.setFromVector3(this.tmpVec);const l=new T(Math.random()*2-1,Math.random()-.5,Math.random()*2-1).normalize();this.travelVelocity.copy(l).multiplyScalar(Math.max(8500,this.travelVelocity.length()*.72)),this.thrustDirection.copy(l),window.dispatchEvent(new CustomEvent("universe-wormhole",{detail:{state:"exit"}})),setTimeout(()=>{this.wormholeActive=!1},850)},380)}_updateHyperlapse(){if(!this.thrusting||this.warpFactor<.42){if(this.activeHyperGalaxy){const i=qe[this.activeHyperGalaxy];window.dispatchEvent(new CustomEvent("universe-hyperlapse",{detail:{state:"exit",galaxyId:this.activeHyperGalaxy,title:i?.title,accentColor:i?.accentColor}})),this.activeHyperGalaxy=null}return 1}let e=null,t=1/0;for(const[i,r]of Object.entries(qe)){const[n,s,o]=r.worldOffset,l=this.camera.position.distanceTo(new T(n,s,o)),c=12800*(r.scale??1);l<c&&l<t&&(t=l,e=i)}if(e!==this.activeHyperGalaxy){if(this.activeHyperGalaxy){const i=qe[this.activeHyperGalaxy];window.dispatchEvent(new CustomEvent("universe-hyperlapse",{detail:{state:"exit",galaxyId:this.activeHyperGalaxy,title:i?.title,accentColor:i?.accentColor}}))}if(this.activeHyperGalaxy=e,e){const i=qe[e];window.dispatchEvent(new CustomEvent("universe-hyperlapse",{detail:{state:"enter",galaxyId:e,title:i.title,accentColor:i.accentColor}}))}}return e?.32:1}_updateThrust(e){if(this.flightMode&&this.thrusting){const n=(performance.now()-this.thrustStart)/1e3,s=this.selectedTarget?this.selectedTarget.clone().sub(this.camera.position).normalize():this._screenRayDirection(this.thrustPointer.x,this.thrustPointer.y);this.thrustDirection.lengthSq()===0?this.thrustDirection.copy(s):this.thrustDirection.lerp(s,Je.clamp(e*11,0,1)).normalize();const o=this.travelVelocity.dot(this.thrustDirection);o<0&&this.travelVelocity.addScaledVector(this.thrustDirection,-o);const l=n<5.2?0:Je.clamp((n-5.2)/5.8,0,1),c=11800+24200*l;this.travelVelocity.lerp(this.thrustDirection.clone().multiplyScalar(c),Je.clamp(e*22,0,1)),this.warpFactor=Qt(this.warpFactor,l,3.2,e),this._maybeWormhole(e)}else{const n=Math.exp(-5.2*e);this.travelVelocity.multiplyScalar(n),this.travelVelocity.length()<22&&this.travelVelocity.set(0,0,0),this.warpFactor=Qt(this.warpFactor,0,5.5,e)}const t=this._updateHyperlapse(),i=1+this.warpFactor*.15-(this.activeHyperGalaxy?.06:0);this.camera.fov=Qt(this.camera.fov,this.baseFov*i,7,e),this.camera.updateProjectionMatrix();const r=this.travelVelocity.clone().multiplyScalar(e*t);this.target.add(r),this.camera.position.add(r)}setSelectedTarget(e,t=""){this.selectedTarget=e?new T(e.x,e.y,e.z):null,this.selectedTargetLabel=t||"",window.dispatchEvent(new CustomEvent("universe-selection-state",{detail:{active:!!this.selectedTarget,label:this.selectedTargetLabel,world:this.selectedTarget?{x:this.selectedTarget.x,y:this.selectedTarget.y,z:this.selectedTarget.z}:null}}))}clearSelectedTarget(){this.setSelectedTarget(null,"")}_applyGalaxyGravity(e){let t=null,i=1/0,r=0;for(const[u,d]of Object.entries(qe)){const[h,f,_]=d.worldOffset,v=this.camera.position.distanceTo(new T(h,f,_)),m=13200*(d.scale??1);v<i&&(i=v,t=u,r=m)}if(!t)return this.localGalaxyId=null,this.localGalaxyInfluence=Qt(this.localGalaxyInfluence,0,2.4,e),0;const n=qe[t],s=new T(...n.worldOffset),o=r*1.18,l=r*.66,c=r*1.34;if(this.localGalaxyId===null&&i<o)this.localGalaxyId=t,window.dispatchEvent(new CustomEvent("universe-galaxy-threshold",{detail:{state:"enter",galaxyId:t,title:n.title,accentColor:n.accentColor}}));else if(this.localGalaxyId&&this.localGalaxyId!==t&&i<o*.72){const u=qe[this.localGalaxyId];u&&window.dispatchEvent(new CustomEvent("universe-galaxy-threshold",{detail:{state:"exit",galaxyId:this.localGalaxyId,title:u.title,accentColor:u.accentColor}})),this.localGalaxyId=t,window.dispatchEvent(new CustomEvent("universe-galaxy-threshold",{detail:{state:"enter",galaxyId:t,title:n.title,accentColor:n.accentColor}}))}if(this.localGalaxyId===t){if(i>c)return window.dispatchEvent(new CustomEvent("universe-galaxy-threshold",{detail:{state:"exit",galaxyId:t,title:n.title,accentColor:n.accentColor}})),this.localGalaxyId=null,this.localGalaxyInfluence=Qt(this.localGalaxyInfluence,0,2.2,e),this.localGalaxyInfluence;const u=Je.clamp((o-i)/(o-l),0,1);this.localGalaxyInfluence=Qt(this.localGalaxyInfluence,.18+.3*u,1.6,e);const d=this.camera.position.clone().sub(s);if(d.lengthSq()>1){d.normalize();const h=this.travelVelocity.dot(d);if(!this.thrusting&&h>0){const f=Je.clamp((i-l)/(c-l),0,1),_=.035+.095*f;this.travelVelocity.addScaledVector(d,-h*Je.clamp(e*_,0,.012));const v=230-70*f;h>v&&this.travelVelocity.addScaledVector(d,-(h-v)*Je.clamp(e*.55,0,.025))}}}else this.localGalaxyInfluence=Qt(this.localGalaxyInfluence,0,2.2,e);return this.localGalaxyInfluence}_applyBoundary(e){const t=new T(0,0,0),i=this.camera.position.length(),r=Je.clamp((i-this.UNIVERSE_SAFE_RADIUS)/(this.UNIVERSE_RETURN_RADIUS-this.UNIVERSE_SAFE_RADIUS),0,1),n=Je.clamp((i-this.UNIVERSE_RETURN_RADIUS)/(this.UNIVERSE_MAX_RADIUS-this.UNIVERSE_RETURN_RADIUS),0,1),s=this.selectedTarget?0:Math.max(r*.45,n);if(this.boundaryInfluence=Qt(this.boundaryInfluence,s,2.4,e),this.boundaryInfluence>.001){const o=t.clone().sub(this.camera.position).normalize();if(this.travelVelocity.lerp(o.clone().multiplyScalar(Math.max(this.travelVelocity.length(),2400)),Je.clamp(this.boundaryInfluence*e*2.6,0,.22)),i>this.UNIVERSE_MAX_RADIUS){const l=this.camera.position.clone().normalize().multiplyScalar(this.UNIVERSE_MAX_RADIUS-9e3);this.camera.position.lerp(l,Je.clamp(e*2.2,0,.16)),this.target.lerp(t,Je.clamp(e*1.6,0,.12))}window.dispatchEvent(new CustomEvent("universe-boundary",{detail:{influence:this.boundaryInfluence,distance:i}}))}return this.boundaryInfluence}_zoomTowardAnchor(e,t,i){const r=Je.clamp(e,-.05,.05),n=this._screenPointToFocusPoint(t,i),s=Je.clamp(-r*4.2,-.18,.18),o=n.clone().sub(this.camera.position),l=Math.max(320,Math.min(this.spherical.radius*.16,6500)),c=o.length()*Math.abs(s);c>0&&(o.normalize().multiplyScalar(Math.min(l,c)),s<0&&o.negate(),this.camera.position.add(o),this.target.add(o.clone().multiplyScalar(.72))),this.tmpVec.subVectors(this.camera.position,this.target),this.spherical.setFromVector3(this.tmpVec),this._zoom(r*.72)}setZoomAnchor(e,t){const i=this._screenPointToFocusPoint(e,t);return this.zoomAnchor={x:e,y:t,world:i.clone()},i}clearZoomAnchor(){this.zoomAnchor=null}isNearZoomAnchor(e,t,i=48){return!!this.zoomAnchor&&Math.hypot(e-this.zoomAnchor.x,t-this.zoomAnchor.y)<=i}commitZoomAnchor(){this.zoomAnchor&&(this._zoomTowardAnchor(-.03,this.zoomAnchor.x,this.zoomAnchor.y),this._zoomTowardAnchor(-.03,this.zoomAnchor.x,this.zoomAnchor.y))}gentleZoomTowardPoint(e,t){const i=this._screenPointToFocusPoint(e,t),r=this.camera.position.clone().sub(this.target),n=this.target.clone().lerp(i,.28),s=Math.max(1200,Math.min(this.spherical.radius*.9,26e4)),o=n.clone().add(r.setLength(s));this.flyTo(o,n,{duration:850,saveHistory:!0})}smallBoostTowardPoint(e,t){if(this.fly||this.thrusting)return;const i=this._screenRayDirection(e,t),r=Math.max(900,Math.min(this.spherical.radius*.085,4200)),n=i.clone().multiplyScalar(r),s=this.camera.position.clone().add(n),o=this.target.clone().add(n);this.flyTo(s,o,{duration:420,saveHistory:!0})}_onDblClick(e){this._onActivity()}consumeThrustClick(){return this.suppressNextClick?(this.suppressNextClick=!1,!0):!1}consumeOrbitClick(){return this.suppressNextLeftClick?(this.suppressNextLeftClick=!1,!0):!1}update(e){if(this.fly){this._updateFly(e);return}const t=performance.now();!Gr&&!this.isDragging&&!this.thrusting&&this.travelVelocity.length()<1&&t-this.lastUserActivity>Mp&&(this.isIdleDrifting=!0),this._updateKeyboard(e),this._updateThrust(e),this._applyGalaxyGravity(e),this.isIdleDrifting?(this.driftTime+=e,this.spherical.theta+=e*.014,this.spherical.phi=Je.clamp(this.spherical.phi+Math.sin(this.driftTime*.2)*2e-4,.05,Math.PI-.05)):(this.spherical.theta+=this.velTheta,this.spherical.phi=Je.clamp(this.spherical.phi+this.velPhi,.05,Math.PI-.05),this.spherical.radius=Je.clamp(this.spherical.radius+this.velRadius,150,32e4),this.velTheta*=1-this.DAMPING,this.velPhi*=1-this.DAMPING,this.velRadius*=1-this.DAMPING),this.tmpVec.setFromSpherical(this.spherical).add(this.target),this.camera.position.copy(this.tmpVec);const i=this._applyBoundary(e);if(i>.001){const r=this.target.clone().lerp(new T(0,0,0),Je.clamp(i*.92,0,.92));this.camera.lookAt(r)}else this.camera.lookAt(this.target)}_updateFly(e){if(!this.fly)return;const t=16;this.fly.elapsed+=t;const i=Gr?1:Math.min(this.fly.elapsed/this.fly.duration,1),r=bp(i);if(this.camera.position.lerpVectors(this.fly.startPos,this.fly.endPos,r),this.target.lerpVectors(this.fly.startTarget,this.fly.endTarget,r),this.camera.lookAt(this.target),i>=1){const n=this.fly.onDone;this.fly=null,this.tmpVec.subVectors(this.camera.position,this.target),this.spherical.setFromVector3(this.tmpVec),this.velTheta=0,this.velPhi=0,this.velRadius=0,this.travelVelocity.set(0,0,0),this.warpFactor=0,n?.()}}flyTo(e,t,i={}){i.saveHistory&&this.historyStack.push(this.snapshot());const r=Gr?200:i.duration??1100;this.travelVelocity.set(0,0,0),this.thrustCandidate=!1,this.thrusting=!1,this.fly={startPos:this.camera.position.clone(),startTarget:this.target.clone(),endPos:new T(e.x,e.y,e.z),endTarget:new T(t.x,t.y,t.z),elapsed:0,duration:r,onDone:i.onDone}}travelToObject(e,t=1200,i={}){t=Math.max(t,1450);const r=new T(t*.82,t*.54,t*.82),n={x:e.x+r.x,y:e.y+r.y,z:e.z+r.z};this.flyTo(n,e,{duration:1200,saveHistory:!0,...i})}resetToHome(e={}){const[t,i,r]=ar.position,[n,s,o]=ar.target;this.flightMode=!1,this.clearSelectedTarget(),this._stopThrust(!0),this.flyTo({x:t,y:i,z:r},{x:n,y:s,z:o},{duration:1400,saveHistory:!0,...e})}returnToPrevious(e={}){const t=this.historyStack.pop();return t?(this.restoreSnapshot(t,!0),!0):!1}hasHistory(){return this.historyStack.length>0}snapshot(){return{position:[this.camera.position.x,this.camera.position.y,this.camera.position.z],target:[this.target.x,this.target.y,this.target.z],zoom:this.spherical.radius}}restoreSnapshot(e,t=!0){const i={x:e.position[0],y:e.position[1],z:e.position[2]},r={x:e.target[0],y:e.target[1],z:e.target[2]};t?this.flyTo(i,r,{duration:800}):(this.travelVelocity.set(0,0,0),this.camera.position.set(i.x,i.y,i.z),this.target.set(r.x,r.y,r.z),this.camera.lookAt(this.target),this.tmpVec.subVectors(this.camera.position,this.target),this.spherical.setFromVector3(this.tmpVec))}getTarget(){return this.target.clone()}getRadius(){return this.spherical.radius}isBusy(){return this.fly!==null}}function bp(a){return a<.5?4*a*a*a:1-Math.pow(-2*a+2,3)/2}function Bs(a){const e=a[1].clientX-a[0].clientX,t=a[1].clientY-a[0].clientY;return Math.sqrt(e*e+t*t)}const rr=6e4;class Ep{group;starsMesh;dustMesh;constructor(){this.group=new Ct,this._buildStarfield(),this._buildDust()}_buildStarfield(){const e=new mt,t=new Float32Array(rr*3),i=new Float32Array(rr*3),r=new Float32Array(rr),n=6e5,s=[new Se(16774632),new Se(15266047),new Se(16769200),new Se(11589887),new Se(16765136)];for(let l=0;l<rr;l++){const c=l*3,u=Math.random()*Math.PI*2,d=Math.pow(Math.random(),.5)*n,h=(Math.random()-.5)*n*.35;t[c]=Math.cos(u)*d,t[c+1]=h,t[c+2]=Math.sin(u)*d;const f=s[Math.floor(Math.random()*s.length)];i[c]=f.r,i[c+1]=f.g,i[c+2]=f.b,r[l]=.5+Math.random()*2.5}e.setAttribute("position",new st(t,3)),e.setAttribute("color",new st(i,3)),e.setAttribute("size",new st(r,1));const o=new wt({uniforms:{time:{value:0}},vertexShader:`
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
      `,transparent:!0,depthWrite:!1,blending:ci});this.starsMesh=new Ji(e,o),this.starsMesh.renderOrder=-10,this.group.add(this.starsMesh)}_buildDust(){const e=new mt,t=new Float32Array(1e4*3),i=25e4;for(let n=0;n<1e4;n++){const s=n*3;t[s]=(Math.random()-.5)*i,t[s+1]=(Math.random()-.5)*i*.2,t[s+2]=(Math.random()-.5)*i}e.setAttribute("position",new st(t,3));const r=new vn({color:3491944,size:90,transparent:!0,opacity:.05,depthWrite:!1,blending:ci});this.dustMesh=new Ji(e,r),this.dustMesh.renderOrder=-9,this.group.add(this.dustMesh)}update(e){const t=this.starsMesh.material;t.uniforms.time.value=e,this.dustMesh.position.y=Math.sin(e*.03)*150}dispose(){this.starsMesh.geometry.dispose(),this.starsMesh.material.dispose(),this.dustMesh.geometry.dispose(),this.dustMesh.material.dispose()}}new hp;const wp=3e4,Tp=15e4,Ap=6e3,Rp=22e3;class Cp{constructor(e,t){this.data=e,this.group=new Ct,this.labelContainer=t;const i=qe[e.id];if(!i)return;const[r,n,s]=i.worldOffset;this.group.position.set(r,n,s),this.group.scale.setScalar(i.scale??1),this.radius=i.status==="showcase"?10500:i.status==="uncharted"?7600:9e3,this._buildMist(i),this._buildCore(i),this._buildRegionMarkers(i),this._buildLeds(i),this._buildSelectionVolume(i),this._buildPerimeter(i),this._buildLabel(),this._buildRegionLabels()}group;selectMesh=null;perimeterShell=null;labelEls=[];labelContainer;orbitRings=[];gasLayers=[];gasMats=[];ledPivots=[];galaxyLight;coreMaterial;radius=9e3;thresholdState=!1;_buildMist(e){const t=e.status==="showcase",i=e.status==="uncharted",r=t?8200:i?2800:5200,n=t?5:4,s=t?9800:i?6900:8200,o=t?1750:i?900:1250,l=new Se(e.primaryColor),c=new Se(e.accentColor),u=new Se(e.starTint);for(let d=0;d<3;d++){const h=Math.floor(r*(d===0?1:d===1?.55:.28)),f=new mt,_=new Float32Array(h*3),v=new Float32Array(h*3),m=new Float32Array(h);for(let b=0;b<h;b++){const S=b%n,N=Math.pow(Math.random(),.66)*s,R=S*Math.PI*2/n+N*.00105+(Math.random()-.5)*(.2+N/s*.42)+(d-1)*.06,A=N+(Math.random()-.5)*(420+d*180);_[b*3]=Math.cos(R)*A,_[b*3+1]=(Math.random()-.5)*o*(.22+.78*N/s)+(d-1)*170,_[b*3+2]=Math.sin(R)*A;const P=l.clone().lerp(c,.28+N/s*.58);Math.random()<.1&&P.lerp(u,.7),v[b*3]=P.r,v[b*3+1]=P.g,v[b*3+2]=P.b,m[b]=(t?30:22)+Math.random()*(d===0?64:38)}f.setAttribute("position",new st(_,3)),f.setAttribute("color",new st(v,3)),f.setAttribute("size",new st(m,1));const p=new wt({uniforms:{time:{value:0},globalAlpha:{value:i?.28:d===0?.72:d===1?.36:.2}},vertexShader:"attribute float size;attribute vec3 color;uniform float time;uniform float globalAlpha;varying vec3 vColor;varying float vAlpha;void main(){vColor=color;float pulse=.84+.16*sin(time*.45+position.x*.0015+position.z*.001);vAlpha=globalAlpha*pulse;vec4 mv=modelViewMatrix*vec4(position,1.0);gl_Position=projectionMatrix*mv;gl_PointSize=clamp(size*(620.0/-mv.z),.45,18.0);}",fragmentShader:"varying vec3 vColor;varying float vAlpha;void main(){vec2 uv=gl_PointCoord-.5;float d=length(uv);if(d>.5)discard;float soft=smoothstep(.5,.02,d);float core=smoothstep(.18,0.0,d);gl_FragColor=vec4(vColor*(.78+core*.7),soft*vAlpha);}",transparent:!0,depthWrite:!1,blending:ci}),w=new Ji(f,p);w.rotation.x=.13+(d-1)*.03,w.rotation.z=(d-1)*.025,this.group.add(w),this.gasLayers.push(w),this.gasMats.push(p)}}_buildCore(e){const t=e.status==="showcase",i=new mt,r=t?1700:900,n=new Float32Array(r*3),s=new Float32Array(r),o=t?2900:2300;for(let d=0;d<r;d++){const h=Math.random()*Math.PI*2,f=Math.pow(Math.random(),1.75)*o;n[d*3]=Math.cos(h)*f,n[d*3+1]=(Math.random()-.5)*460,n[d*3+2]=Math.sin(h)*f,s[d]=(t?34:24)+Math.random()*86}i.setAttribute("position",new st(n,3)),i.setAttribute("size",new st(s,1));const l=new Se(e.starTint),c=new wt({uniforms:{color:{value:l},time:{value:0},globalAlpha:{value:1}},vertexShader:"attribute float size;uniform float time;uniform float globalAlpha;varying float vAlpha;void main(){vAlpha=(.4+.28*sin(time*.6+position.x*.0018))*globalAlpha;vec4 mv=modelViewMatrix*vec4(position,1.0);gl_Position=projectionMatrix*mv;gl_PointSize=clamp(size*(620.0/-mv.z),.5,20.0);}",fragmentShader:"uniform vec3 color;varying float vAlpha;void main(){vec2 uv=gl_PointCoord-.5;float d=length(uv);if(d>.5)discard;float a=smoothstep(.5,0.0,d)*vAlpha;gl_FragColor=vec4(color,a);}",transparent:!0,depthWrite:!1,blending:ci}),u=new Ji(i,c);this.coreMaterial=c,this.group.add(u),this.galaxyLight=new hr(e.primaryColor,t?1.25:.58,26e3),this.group.add(this.galaxyLight)}_buildLeds(e){const t=e.status==="showcase"?18:12;for(let i=0;i<t;i++){const r=new Ct,n=i/t*Math.PI*2+i%3*.17,s=this.radius*(.82+i%4*.045),o=new Et(52+i%3*16,12,10),l=new Rt({color:i%2?e.accentColor:e.starTint,transparent:!0,opacity:.62,depthWrite:!1,blending:ci}),c=new Ye(o,l);c.position.set(Math.cos(n)*s,Math.sin(n*1.7)*this.radius*.16,Math.sin(n)*s),r.add(c),r.rotation.x=(i%5-2)*.035,this.group.add(r),this.ledPivots.push({pivot:r,node:c,speed:.12+i%4*.035})}}_buildRegionMarkers(e){for(const t of nn){const i=new Ai(650,720,64),r=new Rt({color:e.accentColor,transparent:!0,opacity:.11,side:Ki,depthWrite:!1}),n=new Ye(i,r);n.position.set(t[0],t[1],t[2]),n.rotation.x=-Math.PI/2,this.orbitRings.push(n),this.group.add(n)}}_buildSelectionVolume(e){const t=new Et(this.radius*.78,22,14),i=new Rt({color:e.accentColor,transparent:!0,opacity:.001,depthWrite:!1}),r=new Ye(t,i);r.scale.y=.34,r.userData.galaxyId=this.data.id,r.userData.title=this.data.title,this.selectMesh=r,this.group.add(r)}_buildPerimeter(e){const t=new Et(this.radius*1.09,52,28),i=new Rt({color:e.accentColor,transparent:!0,opacity:.045,wireframe:!0,depthWrite:!1,side:Ki}),r=new Ye(t,i);r.scale.y=.3,r.visible=!1,r.renderOrder=-1,this.perimeterShell=r,this.group.add(r)}setResidencyActive(e){this.perimeterShell&&(this.perimeterShell.visible=!!e,this.perimeterShell.material.opacity=e?.055:0)}getSelectionMesh(){return this.selectMesh}_buildLabel(){const e=qe[this.data.id],t=e?.status==="showcase",i=e?.status==="uncharted",r=document.createElement("div");r.className="universe-label galaxy-label",r.dataset.galaxyId=this.data.id,r.innerHTML=`<span class="label-era" style="${t?"color:#60ffd0;font-weight:bold;":i?"color:#6080a0;":""}">${t?"✦ ":""}${this.data.title}${i?" — UNCHARTED":""}</span>`,r.style.cssText="position:absolute;top:0;left:0;pointer-events:none;font-family:'Space Mono',monospace;font-size:clamp(10px,1.3vw,14px);letter-spacing:.18em;text-transform:uppercase;color:rgba(200,220,255,0);white-space:nowrap;transform:translate(-50%,-50%);transition:color .3s;user-select:none;",this.labelContainer.appendChild(r);const n=new T(0,1800,0);this.labelEls.push({el:r,pos:n,kind:"galaxy"})}_buildRegionLabels(){const e=this.data.regions;for(let t=0;t<e.length;t++){const i=e[t],r=nn[t]??[0,0,0],n=document.createElement("div");n.className="universe-label region-label",n.dataset.regionId=i.id,n.innerHTML=`<span style="font-weight:600;color:#c0e0ff;">${i.title}</span>${i.subtitle?`<br/><span style="font-size:.8em;opacity:.7;font-weight:normal;">${i.subtitle}</span>`:""}`,n.style.cssText="position:absolute;top:0;left:0;pointer-events:none;font-family:'Space Grotesk',sans-serif;font-size:clamp(8px,.95vw,11px);letter-spacing:.12em;text-transform:uppercase;color:rgba(180,200,240,0);white-space:nowrap;transform:translate(-50%,-50%);transition:color .3s;user-select:none;text-align:center;",this.labelContainer.appendChild(n);const s=new T(r[0],r[1]+750,r[2]);this.labelEls.push({el:n,pos:s,kind:"region"})}}updateLabels(e,t,i){const{width:r,height:n}=t.domElement.getBoundingClientRect();for(const{el:s,pos:o,kind:l}of this.labelEls){const c=new T().copy(o);this.group.localToWorld(c);const u=i.distanceTo(c);let d=0;l==="galaxy"?d=ks(u,Tp,wp):d=ks(u,Rp,Ap);const h=c.clone().project(e),f=(h.x*.5+.5)*r,_=(-(h.y*.5)+.5)*n;h.z>1||d<.02?(s.style.opacity="0",s.style.pointerEvents="none"):(s.style.opacity=String(d),s.style.left=`${f}px`,s.style.top=`${_}px`)}}update(e,t){const i=this.group.getWorldPosition(new T),r=t?i.distanceTo(t):1e9,n=this.radius*(this.group.scale.x||1),s=r<n*1.02;s!==this.thresholdState&&(this.thresholdState=s);for(let o=0;o<this.gasLayers.length;o++){this.gasLayers[o].rotation.y=e*(o===0?.0032:o===1?-.0017:.0011),this.gasLayers[o].rotation.z=Math.sin(e*.045+o)*.008;const l=this.gasMats[o];l.uniforms.time.value=e;const c=o===0?.72:o===1?.36:.2;l.uniforms.globalAlpha.value=(s?c*.16:c)*(qe[this.data.id]?.status==="uncharted"?.55:1)}this.coreMaterial&&(this.coreMaterial.uniforms.time.value=e,this.coreMaterial.uniforms.globalAlpha.value=s?.42:1);for(const o of this.orbitRings)o.material.opacity=(s?.035:.09)+.025*Math.sin(e*.45);for(const o of this.ledPivots)o.pivot.rotation.y+=o.speed*.003,o.pivot.rotation.x+=o.speed*.001,o.node.material.opacity=(s?.2:.58)+.1*Math.sin(e*.8+o.speed*20);this.perimeterShell&&this.perimeterShell.visible&&(this.perimeterShell.rotation.y+=8e-4,this.perimeterShell.material.opacity=.038+.018*(.5+.5*Math.sin(e*.7))),this.galaxyLight.intensity=(qe[this.data.id]?.status==="showcase"?1.25:.58)*(s?.45:1)}getId(){return this.data.id}distanceTo(e){return this.group.getWorldPosition(new T).distanceTo(e)}getShellBoundaryRadius(){return this.radius*(this.group.scale.x||1)}dispose(){for(const{el:e}of this.labelEls)e.remove();for(const e of this.gasLayers)e.geometry.dispose(),e.material.dispose();this.coreMaterial?.dispose()}}class Pp{constructor(e){this.galaxyId=e,this.group=new Ct;const t=qe[e];if(!t)return;this.group.position.set(...t.worldOffset);const i=[{r:520,o:2600,s:.045},{r:300,o:4200,s:-.06},{r:185,o:5700,s:.035}];for(let r=0;r<i.length;r++){const n=i[r],s=new Ct,o=new Et(n.r,24,18),l=new Rt({color:r===0?t.accentColor:r===1?t.starTint:t.primaryColor,transparent:!0,opacity:r===2?.7:.9,depthWrite:!0}),c=new Ye(o,l);c.position.x=n.o,c.userData.archiveOrbit=!0,c.userData.title=r===0?"ERA ARCHIVE WORLD":r===1?"ERA MEMORY MOON":"ERA SIGNAL RELIC",s.rotation.x=(r-1)*.19,s.rotation.z=r*.42,s.add(c),this.group.add(s),this.clickTargets.push(c),this.orbiters.push({pivot:s,body:c,speed:n.s})}}group;galaxyId;clickTargets=[];orbiters=[];update(e){for(const t of this.orbiters)t.pivot.rotation.y+=e*t.speed,t.body.rotation.y+=e*.12}getHit(e){const t=e.intersectObjects(this.clickTargets,!1);if(!t.length)return null;const i=t[0].object,r=new T;return i.getWorldPosition(r),{title:String(i.userData.title??"ARCHIVE OBJECT"),worldPos:r}}}function ks(a,e,t){return a>=e?0:a<=t?1:1-(a-t)/(e-t)}const Lp=3e3,Ip=6e4;class Up{group;instancedFar;instancedMid;nearMeshes=new Map;stars=[];dummy=new Mt;labelContainer;labelEls=new Map;myStarId=null;constructor(e){this.group=new Ct,this.labelContainer=e,this._buildFarInstanced(),this._buildMidInstanced()}_buildFarInstanced(){const e=new Et(30,4,4),t=new Rt({color:16777215,transparent:!0,opacity:.7});this.instancedFar=new Ps(e,t,25e3),this.instancedFar.instanceMatrix.setUsage(Un),this.instancedFar.count=0,this.group.add(this.instancedFar)}_buildMidInstanced(){const e=new Et(60,6,6),t=new Rt({color:16777215});this.instancedMid=new Ps(e,t,25e3),this.instancedMid.instanceMatrix.setUsage(Un),this.instancedMid.count=0,this.instancedMid.visible=!1,this.group.add(this.instancedMid)}setStars(e,t=null){this.stars=e,this.myStarId=t,this._rebuildFar()}_rebuildFar(){const e=new Se;let t=0;for(const i of this.stars){if(t>=25e3)break;this.dummy.position.set(i.x,i.y,i.z),this.dummy.scale.setScalar(i.id===this.myStarId?1.8:1),this.dummy.updateMatrix(),this.instancedFar.setMatrixAt(t,this.dummy.matrix);const r=qe[i.galaxyId],n=r?new Se(r.starTint):e.set(16777215);i.id===this.myStarId&&n.setHex(16766720),this.instancedFar.setColorAt(t,n),t++}this.instancedFar.count=t,this.instancedFar.instanceMatrix.needsUpdate=!0,this.instancedFar.instanceColor&&(this.instancedFar.instanceColor.needsUpdate=!0)}update(e,t,i){const{width:r,height:n}=i.domElement.getBoundingClientRect(),s=e.length();this.instancedFar.visible=!0,this.instancedMid.visible=!1;for(const o of this.stars){const l=new T(o.x,o.y,o.z),c=e.distanceTo(l);c<Lp?(this._ensureNearMesh(o),this._updateLabel(o,l,t,r,n,c)):(this._removeNearMesh(o.id),this._updateLabel(o,l,t,r,n,c))}s<3e4||e.distanceTo(this.group.position)<Ip}_ensureNearMesh(e){if(this.nearMeshes.has(e.id))return;const t=new Et(80,12,12),i=qe[e.galaxyId],r=i?i.starTint:16777215,n=new Ft({color:r,emissive:r,emissiveIntensity:.6,roughness:.1,metalness:.4}),s=new Ye(t,n);s.position.set(e.x,e.y,e.z),s.userData.starId=e.id,this.group.add(s),this.nearMeshes.set(e.id,s)}_removeNearMesh(e){const t=this.nearMeshes.get(e);t&&(this.group.remove(t),t.material.dispose(),t.geometry.dispose(),this.nearMeshes.delete(e))}_updateLabel(e,t,i,r,n,s){const o=1-Math.min(1,Math.max(0,(s-1200)/2800));if(o<.02){const h=this.labelEls.get(e.id);h&&(h.style.opacity="0");return}let l=this.labelEls.get(e.id);l||(l=document.createElement("div"),l.className="universe-label star-label",l.style.cssText=`
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
      `,l.textContent=e.displayName,this.labelContainer.appendChild(l),this.labelEls.set(e.id,l));const c=t.clone().project(i),u=(c.x*.5+.5)*r,d=(-(c.y*.5)+.5)*n;c.z>1?l.style.opacity="0":(l.style.opacity=String(o),l.style.left=`${u}px`,l.style.top=`${d}px`)}getClickTarget(e){const t=Array.from(this.nearMeshes.values()),i=e.intersectObjects(t);if(i.length>0){const n=i[0].object.userData.starId;return n?{starId:n}:null}const r=e.intersectObject(this.instancedFar);if(r.length>0&&r[0].instanceId!==void 0){const n=this.stars[r[0].instanceId];return n?{starId:n.id}:null}return null}addStar(e){this.stars.push(e),this._rebuildFar()}dispose(){for(const[,e]of this.labelEls)e.remove();this.instancedFar.dispose(),this.instancedMid.dispose();for(const[,e]of this.nearMeshes)e.geometry.dispose(),e.material.dispose()}}const Gs=[800,1300,1900,2600],Dp=[.35,.22,.14,.09];class Np{group;planetMesh;children=[];labelContainer;time=0;objectData;onObjectClick=null;clickTargets=[];constructor(e,t){this.objectData=e,this.labelContainer=t,this.group=new Ct,this.group.position.set(e.position.x,e.position.y,e.position.z);const i=qe.G2020;i&&(this.group.position.x+=i.worldOffset[0],this.group.position.z+=i.worldOffset[2]),this._buildPlanet(),this._buildOrbitRings(),this._buildChildren()}_buildPlanet(){const e=new Et(420,48,48),t=new wt({uniforms:{time:{value:0},deepColor:{value:new Se(268328)},shallowColor:{value:new Se(673904)},rimColor:{value:new Se(2150608)}},vertexShader:`
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
      `,transparent:!1});this.planetMesh=new Ye(e,t),this.planetMesh.userData.objectId=this.objectData.id,this.group.add(this.planetMesh),this.clickTargets.push(this.planetMesh);const i=new hr(2138320,1.2,5e3);this.group.add(i)}_buildOrbitRings(){for(const e of Gs){const t=new Ai(e-4,e+4,96),i=new Rt({color:1720416,transparent:!0,opacity:.25,side:Ki,depthWrite:!1}),r=new Ye(t,i);r.rotation.x=-Math.PI/2,this.group.add(r)}}_buildChildren(){const e=this.objectData.children??[],t={audio:"♪",video:"▶",playable:"⚡",archive:"◈"},i={audio:16765056,video:16744544,playable:8454016,archive:12632319};for(let r=0;r<e.length;r++){const n=e[r],s=1+Math.max(0,e.length-3)*.16,o=(Gs[r]??800+r*500)*s,l=Dp[r]??.08,c=r/e.length*Math.PI*2,u=(r%2===0?1:-1)*(r*60),d=n.mediaKind??"archive",h=i[d]??16777215;let f;d==="playable"?f=new Qi(90,1):d==="audio"?f=new wi(60,22,12,40):d==="video"?f=new Pa(0,80,160,8):f=new Ei(70,0);const _=new Ft({color:h,emissive:h,emissiveIntensity:.3,roughness:.3,metalness:.6}),v=new Ye(f,_);v.position.set(Math.cos(c)*o,u,Math.sin(c)*o),v.userData.childId=n.id,v.userData.contentStatus=n.contentStatus,this.group.add(v),this.clickTargets.push(v);const m=document.createElement("div");m.className="universe-label streams-child-label",m.style.cssText=`
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
      `,m.innerHTML=`<span>${t[d]??"○"}</span><br/><span>${n.title}</span>`,this.labelContainer.appendChild(m),this.children.push({id:n.id,title:n.title,mediaKind:d,contentStatus:n.contentStatus??"awaiting-source",mesh:v,orbitRadius:o,orbitSpeed:l,orbitAngle:c,orbitY:u,labelEl:m})}}update(e,t,i){this.time+=e;const r=this.planetMesh.material;r.uniforms.time.value=this.time,this.planetMesh.rotation.y+=e*.06;for(const n of this.children)n.orbitAngle+=e*n.orbitSpeed,n.mesh.position.set(Math.cos(n.orbitAngle)*n.orbitRadius,n.orbitY,Math.sin(n.orbitAngle)*n.orbitRadius),n.mesh.rotation.y+=e*.5,n.mesh.rotation.x+=e*.3;this._updateLabels(t,i)}_updateLabels(e,t){const{width:i,height:r}=t.domElement.getBoundingClientRect(),n=new T;e.getWorldPosition(n);for(const s of this.children){const o=new T;s.mesh.getWorldPosition(o);const l=n.distanceTo(o),c=800,u=1-Math.min(1,Math.max(0,(l-c)/(3500-c))),d=o.clone().project(e),h=(d.x*.5+.5)*i,f=(-(d.y*.5)+.5)*r;d.z>1||u<.02?s.labelEl.style.opacity="0":(s.labelEl.style.opacity=String(u),s.labelEl.style.left=`${h}px`,s.labelEl.style.top=`${f}px`)}}getChildData(e){return this.children.find(t=>t.id===e)}getPlanetWorldPos(){const e=new T;return this.planetMesh.getWorldPosition(e),e}dispose(){for(const e of this.children)e.mesh.geometry.dispose(),e.mesh.material.dispose(),e.labelEl.remove();this.planetMesh.geometry.dispose(),this.planetMesh.material.dispose()}}class Op{group;planetMesh;emberParticles;children=[];labelContainer;time=0;objectData;clickTargets=[];constructor(e,t){this.objectData=e,this.labelContainer=t,this.group=new Ct;const[i,r,n]=qe.G2025?.worldOffset??[0,0,0];this.group.position.set(i+e.position.x,r+e.position.y,n+e.position.z),this._buildMoltenPlanet(),this._buildEmbers(),this._buildOrbitRings(),this._buildChildren()}_buildMoltenPlanet(){const e=new Et(450,48,48),t=new wt({uniforms:{time:{value:0},crustColor:{value:new Se(1574918)},moltenColor:{value:new Se(14965544)},emberGlow:{value:new Se(16750848)}},vertexShader:`
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
      `});this.planetMesh=new Ye(e,t),this.planetMesh.userData.objectId=this.objectData.id,this.group.add(this.planetMesh),this.clickTargets.push(this.planetMesh);const i=new hr(14965544,1.5,6e3);this.group.add(i)}_buildEmbers(){const e=new mt,t=new Float32Array(600*3),i=new Float32Array(600);for(let n=0;n<600;n++){const s=Math.random()*Math.PI*2,o=Math.acos(Math.random()*2-1),l=470+Math.random()*350;t[n*3]=l*Math.sin(o)*Math.cos(s),t[n*3+1]=l*Math.sin(o)*Math.sin(s),t[n*3+2]=l*Math.cos(o),i[n]=4+Math.random()*12}e.setAttribute("position",new st(t,3)),e.setAttribute("size",new st(i,1));const r=new wt({uniforms:{time:{value:0}},vertexShader:`
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
      `,transparent:!0,depthWrite:!1,blending:ci});this.emberParticles=new Ji(e,r),this.group.add(this.emberParticles)}_buildOrbitRings(){const e=[900,1500,2200];for(const t of e){const i=new Ai(t-5,t+5,64),r=new Rt({color:14965544,transparent:!0,opacity:.2,side:Ki,depthWrite:!1}),n=new Ye(i,r);n.rotation.x=-Math.PI/2,this.group.add(n)}}_buildChildren(){const e=this.objectData.children??[],t=[900,1500,2200,2900],i=[.3,.2,.14,.09];for(let r=0;r<e.length;r++){const n=e[r],s=1+Math.max(0,e.length-3)*.16,o=(t[r]??1e3+r*600)*s,l=i[r]??.1,c=r/e.length*Math.PI*2,u=n.mediaKind??"archive";let d,h;u==="playable"?(d=new Ei(95,1),h=new Ft({color:16737826,emissive:16729088,emissiveIntensity:.5,roughness:.2,metalness:.8})):u==="audio"?(d=new wi(65,24,12,36),h=new Ft({color:16755268,emissive:16737792,emissiveIntensity:.3})):u==="video"?(d=new Pa(0,85,170,8),h=new Ft({color:16729139,emissive:13378065,emissiveIntensity:.3})):(d=new Qi(75,0),h=new Ft({color:13399893,roughness:.4}));const f=new Ye(d,h);f.position.set(Math.cos(c)*o,0,Math.sin(c)*o),f.userData.childId=n.id,f.userData.contentStatus=n.contentStatus,this.group.add(f),this.clickTargets.push(f);const _=document.createElement("div");_.className="universe-label fire-child-label",_.style.cssText=`
        position:absolute;top:0;left:0;pointer-events:none;
        font-family:'Space Grotesk',sans-serif;font-size:clamp(8px,0.9vw,11px);
        letter-spacing:0.1em;text-transform:uppercase;color:rgba(255,200,180,0);
        white-space:nowrap;transform:translate(-50%,-130%);transition:color 0.3s;
        user-select:none;text-align:center;line-height:1.4;
      `;const v=u==="playable"?"◇ SATELLITE":u==="audio"?"♪ AUDIO":u==="video"?"▶ VIDEO":"◐ ARCHIVE";_.innerHTML=`<span>${v}</span><br/><span>${n.title}</span>`,this.labelContainer.appendChild(_),this.children.push({id:n.id,title:n.title,mediaKind:u,contentStatus:n.contentStatus??"live",mesh:f,orbitRadius:o,orbitSpeed:l,orbitAngle:c,labelEl:_})}}update(e,t,i){this.time+=e;const r=this.planetMesh.material;r.uniforms.time.value=this.time,this.planetMesh.rotation.y+=e*.05;const n=this.emberParticles.material;n.uniforms.time.value=this.time;for(const s of this.children)s.orbitAngle+=e*s.orbitSpeed,s.mesh.position.set(Math.cos(s.orbitAngle)*s.orbitRadius,Math.sin(this.time*.5+s.orbitRadius)*40,Math.sin(s.orbitAngle)*s.orbitRadius),s.mesh.rotation.y+=e*.6;this._updateLabels(t,i)}_updateLabels(e,t){const{width:i,height:r}=t.domElement.getBoundingClientRect(),n=new T;e.getWorldPosition(n);for(const s of this.children){const o=new T;s.mesh.getWorldPosition(o);const l=n.distanceTo(o),c=900,u=1-Math.min(1,Math.max(0,(l-c)/(3800-c))),d=o.clone().project(e),h=(d.x*.5+.5)*i,f=(-(d.y*.5)+.5)*r;d.z>1||u<.02?s.labelEl.style.opacity="0":(s.labelEl.style.opacity=String(u),s.labelEl.style.left=`${h}px`,s.labelEl.style.top=`${f}px`)}}getChildData(e){return this.children.find(t=>t.id===e)}getPlanetWorldPos(){const e=new T;return this.planetMesh.getWorldPosition(e),e}dispose(){for(const e of this.children)e.mesh.geometry.dispose(),e.mesh.material.dispose(),e.labelEl.remove();this.planetMesh.geometry.dispose(),this.planetMesh.material.dispose()}}class Fp{group;planetMesh;cloudMesh;birdParticles;children=[];labelContainer;time=0;objectData;clickTargets=[];constructor(e,t){this.objectData=e,this.labelContainer=t,this.group=new Ct;const[i,r,n]=qe.G2025?.worldOffset??[0,0,0];this.group.position.set(i+e.position.x,r+e.position.y,n+e.position.z),this._buildSunrisePlanet(),this._buildClouds(),this._buildBirdParticles(),this._buildOrbitRings(),this._buildChildren()}_buildSunrisePlanet(){const e=new Et(460,48,48),t=new wt({uniforms:{time:{value:0},goldColor:{value:new Se(13732918)},earthColor:{value:new Se(2823945)},greenTone:{value:new Se(3829824)},sunRay:{value:new Se(16769184)}},vertexShader:`
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
      `});this.planetMesh=new Ye(e,t),this.planetMesh.userData.objectId=this.objectData.id,this.group.add(this.planetMesh),this.clickTargets.push(this.planetMesh);const i=new hr(13732918,1.6,7e3);this.group.add(i)}_buildClouds(){const e=new Et(480,36,36),t=new Rt({color:16772560,transparent:!0,opacity:.18,depthWrite:!1,blending:ci});this.cloudMesh=new Ye(e,t),this.group.add(this.cloudMesh)}_buildBirdParticles(){const e=new mt,t=new Float32Array(300*3);for(let r=0;r<300;r++){const n=Math.random()*Math.PI*2,s=520+Math.random()*400;t[r*3]=Math.cos(n)*s,t[r*3+1]=(Math.random()-.5)*300,t[r*3+2]=Math.sin(n)*s}e.setAttribute("position",new st(t,3));const i=new vn({color:16765072,size:14,transparent:!0,opacity:.45,blending:ci,depthWrite:!1});this.birdParticles=new Ji(e,i),this.group.add(this.birdParticles)}_buildOrbitRings(){const e=[950,1400,1900,2400,2900];for(const t of e){const i=new Ai(t-4,t+4,64),r=new Rt({color:13732918,transparent:!0,opacity:.22,side:Ki,depthWrite:!1}),n=new Ye(i,r);n.rotation.x=-Math.PI/2,this.group.add(n)}}_buildChildren(){const e=this.objectData.children??[];for(let t=0;t<e.length;t++){const i=e[t],r=1+Math.max(0,e.length-3)*.14,n=(950+t%5*540)*r,s=.25-t%5*.035,o=t/e.length*Math.PI*2,l=i.mediaKind??"archive";let c,u;l==="playable"?(c=new xn(90,0),u=new Ft({color:13732918,emissive:16755268,emissiveIntensity:.5,roughness:.25,metalness:.7})):l==="audio"?(c=new wi(60,20,12,32),u=new Ft({color:16758852,emissive:13399808,emissiveIntensity:.3})):l==="video"?(c=new Et(65,16,16),u=new Ft({color:14716976,emissive:11161616,emissiveIntensity:.3})):(c=new Ei(70,0),u=new Ft({color:12089392,roughness:.4}));const d=new Ye(c,u);d.position.set(Math.cos(o)*n,(t%2===0?1:-1)*(t*30),Math.sin(o)*n),d.userData.childId=i.id,d.userData.contentStatus=i.contentStatus,d.userData.mediaUrl=i.mediaUrl,d.userData.posterUrl=i.posterUrl,this.group.add(d),this.clickTargets.push(d);const h=document.createElement("div");h.className="universe-label africa-child-label",h.style.cssText=`
        position:absolute;top:0;left:0;pointer-events:none;
        font-family:'Space Grotesk',sans-serif;font-size:clamp(8px,0.85vw,10px);
        letter-spacing:0.1em;text-transform:uppercase;color:rgba(255,230,190,0);
        white-space:nowrap;transform:translate(-50%,-130%);transition:color 0.3s;
        user-select:none;text-align:center;line-height:1.4;
      `;const f=l==="playable"?"◇ SATELLITE":l==="audio"?"♪ AUDIO":l==="video"?"▶ DOC":"◐ ARCHIVE";h.innerHTML=`<span>${f}</span><br/><span>${i.title}</span>`,this.labelContainer.appendChild(h),this.children.push({id:i.id,title:i.title,mediaKind:l,contentStatus:i.contentStatus??"live",mediaUrl:i.mediaUrl,posterUrl:i.posterUrl,mesh:d,orbitRadius:n,orbitSpeed:s,orbitAngle:o,labelEl:h})}}update(e,t,i){this.time+=e;const r=this.planetMesh.material;r.uniforms.time.value=this.time,this.planetMesh.rotation.y+=e*.04,this.cloudMesh.rotation.y+=e*.07,this.birdParticles.rotation.y+=e*.12;for(const n of this.children)n.orbitAngle+=e*n.orbitSpeed,n.mesh.position.set(Math.cos(n.orbitAngle)*n.orbitRadius,Math.sin(this.time*.4+n.orbitRadius)*35,Math.sin(n.orbitAngle)*n.orbitRadius),n.mesh.rotation.y+=e*.5;this._updateLabels(t,i)}_updateLabels(e,t){const{width:i,height:r}=t.domElement.getBoundingClientRect(),n=new T;e.getWorldPosition(n);for(const s of this.children){const o=new T;s.mesh.getWorldPosition(o);const l=n.distanceTo(o),c=900,u=1-Math.min(1,Math.max(0,(l-c)/(3800-c))),d=o.clone().project(e),h=(d.x*.5+.5)*i,f=(-(d.y*.5)+.5)*r;d.z>1||u<.02?s.labelEl.style.opacity="0":(s.labelEl.style.opacity=String(u),s.labelEl.style.left=`${h}px`,s.labelEl.style.top=`${f}px`)}}getChildData(e){return this.children.find(t=>t.id===e)}getPlanetWorldPos(){const e=new T;return this.planetMesh.getWorldPosition(e),e}dispose(){for(const e of this.children)e.mesh.geometry.dispose(),e.mesh.material.dispose(),e.labelEl.remove();this.planetMesh.geometry.dispose(),this.planetMesh.material.dispose(),this.cloudMesh.geometry.dispose(),this.cloudMesh.material.dispose()}}class zp{group;planetMeshes=[];children=[];labelContainer;time=0;clickTargets=[];constructor(e,t){this.labelContainer=t,this.group=new Ct;const[i,r,n]=qe.G2025?.worldOffset??[0,0,0];this.group.position.set(i,r,n);for(const s of e)s.id==="OBJ-FIRE"||s.id==="OBJ-AFRICA"||s.id==="OBJ-STREAMS"||this._buildSystem(s)}_buildSystem(e){const t=new T(e.position.x,e.position.y,e.position.z),i=e.accentColor?parseInt(e.accentColor.replace("#","0x"),16):4227264;let r;e.id==="OBJ-EBONY"?r=new Qi(360,3):e.id==="OBJ-AVIATOR"?r=new wi(260,90,16,48):e.id==="OBJ-AWAY"?r=new Et(320,32,32):r=new Ei(280,2);const n=new Ft({color:i,emissive:i,emissiveIntensity:.35,roughness:.25,metalness:.65}),s=new Ye(r,n);s.position.copy(t),s.userData.objectId=e.id,this.group.add(s),this.planetMeshes.push(s),this.clickTargets.push(s);const o=new Ai(650,660,48),l=new Rt({color:i,transparent:!0,opacity:.2,side:Ki,depthWrite:!1}),c=new Ye(o,l);if(c.position.copy(t),c.rotation.x=-Math.PI/2,this.group.add(c),e.children){const u=[700,1100,1600];for(let d=0;d<e.children.length;d++){const h=e.children[d],f=1+Math.max(0,e.children.length-2)*.18,_=(u[d]??800+d*500)*f,v=d/e.children.length*Math.PI*2,m=h.mediaKind??"archive";let p;m==="playable"?p=new Ei(75,1):m==="audio"?p=new wi(50,16,12,28):m==="video"?p=new Pa(0,70,140,8):p=new Qi(60,0);const w=new Ft({color:i,emissive:i,emissiveIntensity:.4,roughness:.3,metalness:.6}),b=new Ye(p,w);b.position.set(t.x+Math.cos(v)*_,t.y,t.z+Math.sin(v)*_),b.userData.childId=h.id,b.userData.contentStatus=h.contentStatus,b.userData.mediaUrl=h.mediaUrl,this.group.add(b),this.clickTargets.push(b);const S=document.createElement("div");S.className="universe-label frontier-child-label",S.style.cssText=`
          position:absolute;top:0;left:0;pointer-events:none;
          font-family:'Space Grotesk',sans-serif;font-size:clamp(8px,0.85vw,10px);
          letter-spacing:0.1em;text-transform:uppercase;color:rgba(220,240,255,0);
          white-space:nowrap;transform:translate(-50%,-130%);transition:color 0.3s;
          user-select:none;text-align:center;line-height:1.4;
        `;const N=m==="playable"?"◇ SATELLITE":m==="audio"?"♪ AUDIO":m==="video"?"▶ VIDEO":"◐ ARCHIVE";S.innerHTML=`<span>${N}</span><br/><span>${h.title}</span>`,this.labelContainer.appendChild(S),this.children.push({id:h.id,title:h.title,mediaKind:m,contentStatus:h.contentStatus??"live",mediaUrl:h.mediaUrl,mesh:b,orbitRadius:_,orbitSpeed:.2+d%3*.08,orbitAngle:v,parentPos:t,labelEl:S})}}}update(e,t,i){this.time+=e;for(const r of this.planetMeshes)r.rotation.y+=e*.1,r.rotation.x+=e*.05;for(const r of this.children)r.orbitAngle+=e*r.orbitSpeed,r.mesh.position.set(r.parentPos.x+Math.cos(r.orbitAngle)*r.orbitRadius,r.parentPos.y+Math.sin(this.time*.5+r.orbitRadius)*25,r.parentPos.z+Math.sin(r.orbitAngle)*r.orbitRadius),r.mesh.rotation.y+=e*.6;this._updateLabels(t,i)}_updateLabels(e,t){const{width:i,height:r}=t.domElement.getBoundingClientRect(),n=new T;e.getWorldPosition(n);for(const s of this.children){const o=new T;s.mesh.getWorldPosition(o);const l=n.distanceTo(o),c=900,u=1-Math.min(1,Math.max(0,(l-c)/(3800-c))),d=o.clone().project(e),h=(d.x*.5+.5)*i,f=(-(d.y*.5)+.5)*r;d.z>1||u<.02?s.labelEl.style.opacity="0":(s.labelEl.style.opacity=String(u),s.labelEl.style.left=`${h}px`,s.labelEl.style.top=`${f}px`)}}getChildData(e){return this.children.find(t=>t.id===e)}dispose(){for(const e of this.children)e.mesh.geometry.dispose(),e.mesh.material.dispose(),e.labelEl.remove();for(const e of this.planetMeshes)e.geometry.dispose(),e.material.dispose()}}function Bp(){try{const a=localStorage.getItem("universe_my_stars_map");if(a)return JSON.parse(a)}catch{const a=localStorage.getItem("universe_my_star_id");if(a)return{G2025:a}}return{}}const Vs=Bp(),Ot={navContext:{level:"universe"},cameraSnapshot:null,selectedObjectId:null,selectedStarId:null,activeOverlay:"none",overlayData:null,audioState:"silent",muted:!!localStorage.getItem("universe_muted"),currentGalaxyId:"G2025",placementMode:!1,myStarId:Object.values(Vs)[0]??null,myStarsMap:Vs,stars:[],loaded:!1},ba=new Map,sn=new Set;function Hs(a,e,t){const i=ba.get(a);i&&i.forEach(r=>r(e,t)),sn.forEach(r=>r())}const Xe={get(a){return Ot[a]},set(a,e){const t=Ot[a];t!==e&&(Ot[a]=e,Hs(a,e,t))},patch(a){for(const[e,t]of Object.entries(a)){const i=Ot[e];i!==t&&(Ot[e]=t,Hs(e,t,i))}},subscribe(a,e){return ba.has(a)||ba.set(a,new Set),ba.get(a).add(e),()=>ba.get(a).delete(e)},on(a){return sn.add(a),()=>sn.delete(a)},getState(){return{...Ot}},toggleMute(){const a=!Ot.muted;a?localStorage.setItem("universe_muted","1"):localStorage.removeItem("universe_muted"),this.set("muted",a)},pushCameraSnapshot(a){this.set("cameraSnapshot",a)},popCameraSnapshot(){return Ot.cameraSnapshot},setMyStarId(a){localStorage.setItem("universe_my_star_id",a),this.set("myStarId",a)},setMyStarForGalaxy(a,e){const t={...Ot.myStarsMap,[a]:e};this.set("myStarsMap",t),this.set("myStarId",e)},hasStarInGalaxy(a){return!!Ot.myStarsMap[a]},getMyStarForGalaxy(a){return Ot.myStarsMap[a]??null},addStar(a){const e=[...Ot.stars,a];this.set("stars",e)}},kp=1500;class Gp{ambientLayers=new Map;activeRegionTheme=null;masterMuted;masterVol=.22;_rafId=0;isDucked=!1;REGION_TRACKS={fire:"https://static.wixstatic.com/mp3/85e419_7810e2c471ce46b5a1c5a664b8307995.mp3",africa:"https://static.wixstatic.com/mp3/85e419_f92713dc5c48443ca1c191bbbb0aec04.mp3",frontier:"https://static.wixstatic.com/mp3/85e419_7be9c7aa18ad4a6db00fd1af6ee7dbcd.mp3"};constructor(){this.masterMuted=!!localStorage.getItem("universe_muted"),this._tick=this._tick.bind(this),requestAnimationFrame(this._tick)}unlock(){if(!this.masterMuted)for(const e of this.ambientLayers.values())e.el.paused&&e.targetVol>0&&e.el.play().catch(()=>{})}setRegionTheme(e){if(this.activeRegionTheme===e)return;this.activeRegionTheme=e;const t=e?this.REGION_TRACKS[e]:null;for(const[i,r]of this.ambientLayers)i!==t&&(r.targetVol=0);if(t){let i=this.ambientLayers.get(t);if(!i){const r=new Audio(t);r.loop=!0,r.volume=0,r.preload="auto",i={src:t,el:r,targetVol:0,currentVol:0},this.ambientLayers.set(t,i)}i.targetVol=this.masterMuted||this.isDucked?0:this.masterVol,!this.masterMuted&&i.el.paused&&i.el.play().catch(()=>{})}}duckAmbient(){this.isDucked=!0;for(const e of this.ambientLayers.values())e.targetVol=e.targetVol>0?this.masterVol*.08:0}restoreAmbient(){if(this.isDucked=!1,!this.masterMuted)for(const e of this.ambientLayers.values()){const t=this.activeRegionTheme&&this.REGION_TRACKS[this.activeRegionTheme]===e.src;e.targetVol=t?this.masterVol:0}}setMuted(e){this.masterMuted=e;for(const t of this.ambientLayers.values())e?(t.targetVol=0,t.el.pause()):this.activeRegionTheme&&this.REGION_TRACKS[this.activeRegionTheme]===t.src&&(t.targetVol=this.masterVol,t.el.play().catch(()=>{}))}_tick(){this._rafId=requestAnimationFrame(this._tick);const e=16/kp;for(const t of this.ambientLayers.values()){const i=t.targetVol-t.currentVol;Math.abs(i)>.001&&(t.currentVol+=i*e*6,t.el.volume=Math.max(0,Math.min(1,t.currentVol)))}}dispose(){cancelAnimationFrame(this._rafId);for(const e of this.ambientLayers.values())e.el.pause()}}const ut=new Gp;let jt=null;async function Vp(){if(jt)return jt;const a=await fetch("./data/seed_universe.json");if(!a.ok)throw new Error(`Failed to load seed data: ${a.status}`);return jt=await a.json(),jt}const bn=new Map,Hp=new Map,Ws=new Map;function Wp(a){const e=new Map;for(const t of a.celestialObjects??[]){const i=1+(t.children?.length??0);e.set(t.galaxyId,(e.get(t.galaxyId)??0)+i)}for(const[t,i]of e){const r=qe[t];if(r){const s=Je.clamp(1+(i-4)*.018,1,1.48);r.scale*=s}const n=Je.clamp(1+(i-4)*.022,1,1.55);for(const s of a.celestialObjects??[])s.galaxyId===t&&s.position&&(s.position.x*=n,s.position.z*=n)}for(const t of a.galaxies){bn.set(t.id,t);for(const i of t.regions)Hp.set(i.id,{...i,galaxyId:t.id})}for(const t of a.celestialObjects)if(Ws.set(t.id,t),t.children)for(const i of t.children)Ws.set(i.id,{...i,galaxyId:t.galaxyId,regionId:t.regionId,position:{...t.position}})}function on(){return jt?jt.galaxies:[]}function ln(a){return bn.get(a)?.regions??[]}function yo(){return jt?jt.celestialObjects:[]}function Xp(){return jt?jt.demoStars:[]}function jp(){return Xp().map(a=>({id:a.id,galaxyId:a.galaxyId,regionId:a.regionId,clusterId:a.clusterId,x:a.x,y:a.y,z:a.z,displayName:a.displayName,message:a.message,createdAt:"2025-01-01T00:00:00Z",isDemo:!0}))}function Ta(a){return qe[a]?.worldOffset??[0,0,0]}function Mo(a,e){const t=Ta(a),i=ln(a).findIndex(n=>n.id===e),r=nn[Math.max(0,i)];return[t[0]+r[0],t[1]+r[1],t[2]+r[2]]}function qp(a){const e=Ta(a.galaxyId);return[e[0]+a.position.x,e[1]+a.position.y,e[2]+a.position.z]}function En(a){const e=bn.get(a);return e?`${e.title} Galaxy`:a}function Yp(a){return`${Math.max(1,Math.round(a*.085))} AU`}const Xs="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";function $p(a=21){const e=crypto.getRandomValues(new Uint8Array(a));return Array.from(e,t=>Xs[t%Xs.length]).join("")}const Xi=500;class Kp{cells=new Map;key(e,t,i){return`${Math.floor(e/Xi)},${Math.floor(t/Xi)},${Math.floor(i/Xi)}`}insert(e){const t=this.key(e.x,e.y,e.z);this.cells.has(t)||this.cells.set(t,[]),this.cells.get(t).push(e)}checkCollision(e,t,i,r){const n=Math.floor(e/Xi),s=Math.floor(t/Xi),o=Math.floor(i/Xi);for(let l=-1;l<=1;l++)for(let c=-1;c<=1;c++)for(let u=-1;u<=1;u++){const d=`${n+l},${s+c},${o+u}`,h=this.cells.get(d);if(h){for(const f of h)if(Math.sqrt((f.x-e)**2+(f.y-t)**2+(f.z-i)**2)<r)return!0}}return!1}rebuild(e){this.cells.clear();for(const t of e)this.insert(t)}}const Vr="universe_stars",js="universe_my_stars_map",qs="universe_last_place",Zp=1e3*30;class Jp{grid=new Kp;stars=[];loaded=!1;async loadStars(){if(this.loaded)return this.stars;const e=jp();let t=[];try{const i=localStorage.getItem(Vr);i&&(t=JSON.parse(i))}catch{t=[]}return this.stars=[...e,...t],this.grid.rebuild(this.stars),this.loaded=!0,this.stars}getMyStarsMap(){try{const e=localStorage.getItem(js);if(e)return JSON.parse(e)}catch{const e=localStorage.getItem("universe_my_star_id");if(e)return{G2025:e}}return{}}hasStarInGalaxy(e){return!!this.getMyStarsMap()[e]}getMyStarId(e){const t=this.getMyStarsMap();return e?t[e]??null:Object.values(t)[0]??null}async placestar(e){if(this.hasStarInGalaxy(e.galaxyId))return{success:!1,error:"already-placed-in-galaxy"};const t=localStorage.getItem(qs);if(t&&Date.now()-parseInt(t)<Zp)return{success:!1,error:"rate-limit"};if(this.grid.checkCollision(e.x,e.y,e.z,_p))return{success:!1,error:"collision"};const i=Mo(e.galaxyId,e.regionId),r=e.x-i[0],n=e.z-i[2];if(Math.sqrt(r*r+n*n)>xp||Math.abs(e.y-i[1])>yp)return{success:!1,error:"collision"};const s={id:$p(),galaxyId:e.galaxyId,regionId:e.regionId,x:e.x,y:e.y,z:e.z,displayName:Hr(e.displayName),starName:e.starName?Hr(e.starName):void 0,message:e.message?Hr(e.message):void 0,signatureDataUrl:e.signatureDataUrl,createdAt:new Date().toISOString(),isDemo:!1};this.stars.push(s),this.grid.insert(s);try{const o=localStorage.getItem(Vr),l=o?JSON.parse(o):[];l.push(s),localStorage.setItem(Vr,JSON.stringify(l));const c=this.getMyStarsMap();c[e.galaxyId]=s.id,localStorage.setItem(js,JSON.stringify(c)),localStorage.setItem(qs,String(Date.now()))}catch{}return Xe.setMyStarForGalaxy(e.galaxyId,s.id),{success:!0,star:s}}async getStarById(e){return await this.loadStars(),this.stars.find(t=>t.id===e)??null}}function Hr(a){return a.replace(/<[^>]*>/g,"").trim().slice(0,280)}const Si=new Jp;class Qp{el;galaxyLabel;muteBtn;placeBtn;resetBtn;returnBtn;tourBtn;breadcrumb;callbacks;constructor(e,t){this.callbacks=t,this.el=document.createElement("div"),this.el.id="universe-hud",this.el.setAttribute("role","navigation"),this.el.setAttribute("aria-label","Universe navigation"),this.el.style.cssText=`
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
          style="${nr("rgba(255,255,255,0.05)","#4080c0")}"
          aria-label="Reset Camera to Universe Composition"
          title="Reset View to Default Universe Composition"
        >⌂ RESET VIEW</button>
        <button
          id="hud-return"
          type="button"
          style="${nr("rgba(255,255,255,0.05)","#4080c0")} display:none;"
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
          style="${nr("rgba(40,100,160,0.4)","#70c0ff")}"
          aria-label="Take me somewhere guided tour"
          title="Cinematic flight to a featured universe destination"
        >✦ TAKE ME SOMEWHERE</button>

        <button
          id="hud-place"
          type="button"
          style="${nr("rgba(20,60,100,0.6)","#5090c0")}"
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
    `,e.appendChild(this.el),this.galaxyLabel=this.el.querySelector("#hud-galaxy-name"),this.breadcrumb=this.el.querySelector("#hud-breadcrumb"),this.muteBtn=this.el.querySelector("#hud-mute"),this.placeBtn=this.el.querySelector("#hud-place"),this.resetBtn=this.el.querySelector("#hud-reset"),this.returnBtn=this.el.querySelector("#hud-return"),this.tourBtn=this.el.querySelector("#hud-tour"),this._bindEvents(),this._syncMute(),Xe.subscribe("currentGalaxyId",i=>{this.galaxyLabel.textContent=i?En(i):"",this._syncStarButton()}),Xe.subscribe("navContext",i=>{this.breadcrumb.textContent=i.level.toUpperCase()}),Xe.subscribe("muted",()=>this._syncMute()),Xe.subscribe("myStarsMap",()=>this._syncStarButton()),this._syncStarButton()}_syncStarButton(){const e=Xe.get("currentGalaxyId")??"G2025",t=Si.getMyStarId(e);t?(this.placeBtn.textContent="✦ VIEW YOUR STAR",this.placeBtn.style.color="#ffd700",this.placeBtn.style.background="rgba(100,80,10,0.6)",this.placeBtn.dataset.action="view",this.placeBtn.dataset.starId=t):(this.placeBtn.textContent="✦ PLACE STAR",this.placeBtn.style.color="#5090c0",this.placeBtn.style.background="rgba(20,60,100,0.6)",this.placeBtn.dataset.action="place",delete this.placeBtn.dataset.starId)}_bindEvents(){this.resetBtn.addEventListener("click",()=>{ut.unlock(),this.callbacks.onResetView()}),this.returnBtn.addEventListener("click",()=>{ut.unlock(),this.callbacks.onReturnPrevious()}),this.tourBtn.addEventListener("click",()=>{ut.unlock(),this.callbacks.onTakeTour()}),this.muteBtn.addEventListener("click",()=>{ut.unlock(),Xe.toggleMute(),ut.setMuted(Xe.get("muted"))}),this.placeBtn.addEventListener("click",()=>{ut.unlock();const e=this.placeBtn.dataset.action,t=this.placeBtn.dataset.starId;e==="view"&&t?this.callbacks.onViewMyStar(t):(Xe.set("placementMode",!0),window.dispatchEvent(new CustomEvent("universe-start-placement")))}),document.getElementById("universe-canvas")?.addEventListener("click",()=>{ut.unlock()},{once:!0})}setReturnAvailable(e){this.returnBtn.style.display=e?"inline-block":"none"}_syncMute(){const e=Xe.get("muted");this.muteBtn.textContent=e?"♪̶":"♪",this.muteBtn.setAttribute("aria-label",e?"Unmute":"Mute"),this.muteBtn.style.color=e?"#2a3848":"#4a85b0"}setPlacementMode(e){e?(this.placeBtn.textContent="✦ PLACING…",this.placeBtn.style.color="#60c080"):this._syncStarButton()}dispose(){this.el.remove()}}function nr(a,e){return`
    font-family:'Space Grotesk',sans-serif;
    font-size:0.65rem;letter-spacing:0.12em;text-transform:uppercase;
    background:${a};
    border:1px solid rgba(80,160,240,0.25);
    border-radius:4px;
    color:${e};
    padding:6px 12px;
    cursor:pointer;
    transition:background 0.2s, color 0.2s;
    white-space:nowrap;
  `}class ef{el;openBtn;panel;activeTab="map";isOpen=!1;callbacks;constructor(e,t){this.callbacks=t,this.el=document.createElement("div"),this.el.id="galactic-navigator-wrap",this.el.style.cssText=`
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
    `,document.head.appendChild(e)}_bindEvents(){this.openBtn.addEventListener("click",()=>{this.isOpen=!this.isOpen,this.panel.style.display=this.isOpen?"flex":"none",this.isOpen&&this.render()})}render(){const e=Xe.get("currentGalaxyId")??"G2025",t=on().find(i=>i.id===e);t&&ln(e),this.panel.innerHTML=`
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
    `,this.panel.querySelectorAll(".nav-tab-btn").forEach(i=>{i.addEventListener("click",r=>{const n=r.currentTarget.dataset.tab;this.activeTab=n,this.render()})}),this.panel.querySelectorAll(".nav-tree-item").forEach(i=>{i.addEventListener("click",r=>{const n=r.currentTarget,s=n.dataset.type,o=n.dataset.id,l=n.dataset.parentId;s==="galaxy"&&o?this.callbacks.onTravelToGalaxy(o):s==="region"&&o&&l?this.callbacks.onTravelToRegion(l,o):s==="object"&&o&&this.callbacks.onTravelToObject(o)})}),this._updateTelemetry()}_renderMapHTML(){const e=on(),t=Xe.get("currentGalaxyId")??"G2025",i=yo();return`
      <div style="font-family:'Space Mono',monospace;font-size:0.65rem;color:#4a6888;letter-spacing:0.1em;margin-bottom:8px;">
        KNOWN GALAXIES (CLICK TO TRAVEL)
      </div>
      <div style="display:flex;flex-direction:column;gap:4px;">
        ${e.map(r=>{const n=r.id===t,s=r.id==="G2025",o=ln(r.id);return`
            <div class="nav-tree-item ${n?"active":""}" data-type="galaxy" data-id="${r.id}">
              <span>${s?"✦ ":""}${r.title}</span>
              <span style="font-size:0.6rem;opacity:0.6;">${s?"SHOWCASE":"KNOWN"}</span>
            </div>
            ${n?`
              <div style="margin-left:12px;padding-left:8px;border-left:1px solid rgba(80,160,240,0.2);display:flex;flex-direction:column;gap:2px;margin-bottom:6px;">
                ${o.map(l=>`
                  <div class="nav-tree-item" data-type="region" data-id="${l.id}" data-parent-id="${r.id}">
                    <span>↳ ${l.title}</span>
                  </div>
                `).join("")}
                ${i.filter(l=>l.galaxyId===r.id).map(l=>`
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
    `}_updateTelemetry(){const e=this.panel.querySelector("#telemetry-au");if(e){const t=Xe.get("cameraSnapshot"),i=t?Math.hypot(...t.position):48e3;e.textContent=Yp(i)}}dispose(){this.el.remove()}}const So=[];let cn={type:"universe"};function Wr(a){const e=a.replace(/^#\/?/,"");if(!e||e==="universe")return{type:"universe"};const[t,i]=e.split("/");return t==="galaxy"&&i?{type:"galaxy",galaxyId:i}:t==="object"&&i?{type:"object",objectId:i}:t==="star"&&i?{type:"star",starId:i}:{type:"universe"}}function Xr(a){cn=a,So.forEach(e=>e(a))}const jr={init(){window.addEventListener("hashchange",()=>{Xr(Wr(window.location.hash))}),Xr(Wr(window.location.hash))},on(a){So.push(a),a(cn)},navigate(a,e=!0){let t="";a.type==="universe"?t="#universe":a.type==="galaxy"?t=`#galaxy/${a.galaxyId}`:a.type==="object"?t=`#object/${a.objectId}`:a.type==="star"&&(t=`#star/${a.starId}`),e?(history.pushState(null,"",t),Xr(Wr(t))):history.replaceState(null,"",t)},back(){history.back()},current(){return cn}};function Ri(a,e){const t=document.createElement("div");return t.id=a,t.className=`overlay-panel ${e}`,t.setAttribute("role","dialog"),t.setAttribute("aria-modal","true"),t.style.cssText=`
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
  `,t}function Ci(){if(document.getElementById("overlay-styles"))return;const a=document.createElement("style");a.id="overlay-styles",a.textContent=`
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
  `,document.head.appendChild(a)}function sa(a){const e=a.querySelectorAll('button,a,[tabindex]:not([tabindex="-1"]),input,textarea,select'),t=e[0],i=e[e.length-1];function r(n){n.key==="Tab"&&(n.shiftKey?document.activeElement===t&&(n.preventDefault(),i?.focus()):document.activeElement===i&&(n.preventDefault(),t?.focus()))}return a.addEventListener("keydown",r),t?.focus(),()=>a.removeEventListener("keydown",r)}function oa(a,e){function t(i){i.key==="Escape"&&e()}return window.addEventListener("keydown",t),()=>window.removeEventListener("keydown",t)}function La(a,e){const t=document.createElement("button");return t.className="overlay-close-btn",t.type="button",t.setAttribute("aria-label","Close"),t.innerHTML="×",t.addEventListener("click",e),a.appendChild(t),t}function tf(a,e,t){Ci(),ut.duckAmbient();const i=Ri("audio-overlay","audio-overlay");i.setAttribute("aria-label",`Audio: ${e.title}`);const r=!e.mediaUrl||e.contentStatus==="awaiting-source";i.innerHTML=`
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
      ${r?`
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
  `,of();const n=()=>{i.style.animation="overlay-out 0.2s ease forwards",setTimeout(()=>{i.remove(),ut.restoreAmbient(),t()},200)};La(i.firstElementChild,n);const s=oa(i,n),o=sa(i);if(i.addEventListener("mousedown",l=>{l.target===i&&n()}),a.appendChild(i),a.setAttribute("aria-hidden","false"),!r){const l=i.querySelector("#spatial-audio");l?.play().catch(()=>{}),l?.addEventListener("play",()=>ut.duckAmbient()),l?.addEventListener("pause",()=>ut.restoreAmbient())}return()=>{s(),o(),n()}}function af(a,e,t){Ci(),ut.duckAmbient();const i=Ri("video-overlay","video-overlay");i.setAttribute("aria-label",`Video: ${e.title}`),i.style.background="rgba(0,0,0,0.92)";const r=!e.mediaUrl||e.contentStatus==="awaiting-source";i.innerHTML=`
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
        ${r?`
          <div style="text-align:center;color:#3a5060;padding:32px;">
            <div style="font-size:2.5rem;margin-bottom:16px;" aria-hidden="true">▶</div>
            <p style="font-family:'Space Mono',monospace;font-size:0.7rem;letter-spacing:0.1em;">
              VIDEO SOURCE PENDING<br/>contentStatus: "awaiting-source"
            </p>
          </div>
        `:e.mediaUrl?.includes("youtube")||e.mediaUrl?.includes("youtu.be")?`
          <iframe
            src="${sf(e.mediaUrl)}"
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
  `;const n=()=>{i.style.animation="overlay-out 0.2s ease forwards",setTimeout(()=>{i.remove(),ut.restoreAmbient(),t()},200)};La(i,n);const s=oa(i,n),o=sa(i);return i.addEventListener("mousedown",l=>{l.target===i&&n()}),a.appendChild(i),()=>{s(),o(),n()}}function rf(a,e,t){Ci(),ut.duckAmbient();const i=Ri("playable-overlay","playable-overlay");i.setAttribute("aria-label",`Playable Experience: ${e.title}`),i.style.background="rgba(0,0,0,0.98)",i.style.padding="0";const r=e.mediaUrl??"/games/streams/";i.innerHTML=`
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
        src="${r}"
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
  `;const n=()=>{i.style.animation="overlay-out 0.15s ease forwards",setTimeout(()=>{i.remove(),ut.restoreAmbient(),t()},150)};i.querySelector("#exit-playable")?.addEventListener("click",n);const s=oa(i,n);a.appendChild(i);const o=l=>{(l.data==="UNIVERSE_EXIT"||l.data?.type==="UNIVERSE_EXIT")&&n()};return window.addEventListener("message",o),()=>{s(),window.removeEventListener("message",o),n()}}function nf(a,e,t){Ci();const i=Ri("archive-overlay","archive-overlay");i.setAttribute("aria-label",`Archive: ${e.title}`),i.innerHTML=`
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
  `;const r=()=>{i.style.animation="overlay-out 0.2s ease forwards",setTimeout(()=>{i.remove(),t()},200)};La(i.firstElementChild,r);const n=oa(i,r),s=sa(i);return i.addEventListener("mousedown",o=>{o.target===i&&r()}),a.appendChild(i),()=>{n(),s(),r()}}function sf(a){const e=a.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);return e?`https://www.youtube.com/embed/${e[1]}?autoplay=1`:a}function of(){if(document.getElementById("orbit-anim"))return;const a=document.createElement("style");a.id="orbit-anim",a.textContent=`
    @keyframes orbit-pulse {
      0%,100% { box-shadow:0 0 20px rgba(32,200,200,0.1); }
      50% { box-shadow:0 0 40px rgba(32,200,200,0.25); }
    }
    @keyframes orbit-spin {
      to { transform:rotate(360deg); }
    }
  `,document.head.appendChild(a)}function lf(a,e,t){Ci();const i=Ri("star-card-overlay","star-card-overlay");i.setAttribute("aria-label",`Star Card: ${e.displayName}`),i.style.background="rgba(0,2,10,0.92)";const r=document.createElement("canvas");r.width=1080,r.height=1350,r.style.display="none",document.body.appendChild(r),$r(r,e,1080,1350);const n=document.createElement("canvas");n.width=1080,n.height=1920,n.style.display="none",document.body.appendChild(n),$r(n,e,1080,1920);const s=document.createElement("canvas");s.width=360,s.height=450,s.style.cssText="border-radius:8px;max-width:100%;",$r(s,e,360,450);const o=`${location.origin}${location.pathname}#star/${e.id}`;i.innerHTML=`
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
        <button id="dl-card" type="button" style="${Yr()}">DOWNLOAD CARD (1080×1350)</button>
        <button id="dl-story" type="button" style="${Yr()}">DOWNLOAD STORY (1080×1920)</button>
        <button id="copy-link" type="button" style="${Yr("rgba(20,60,20,0.6)")}">COPY SHARE LINK</button>
      </div>
      <p id="copy-confirm" style="color:#60c070;font-size:0.75rem;min-height:18px;"></p>
    </div>
  `;const l=i.querySelector("#star-card-preview-wrap");l&&l.appendChild(s),i.querySelector("#dl-card")?.addEventListener("click",()=>{Ys(r,`2fly-star-${e.id.slice(0,8)}-card.png`)}),i.querySelector("#dl-story")?.addEventListener("click",()=>{Ys(n,`2fly-star-${e.id.slice(0,8)}-story.png`)}),i.querySelector("#copy-link")?.addEventListener("click",async()=>{try{await navigator.clipboard.writeText(o);const h=i.querySelector("#copy-confirm");h&&(h.textContent="Link copied!",setTimeout(()=>{h.textContent=""},2e3))}catch{const h=i.querySelector("#copy-confirm");h&&(h.textContent=o)}});const c=()=>{i.remove(),r.remove(),n.remove(),s.remove(),t()};La(i.firstElementChild,c);const u=oa(i,c),d=sa(i);return i.addEventListener("mousedown",h=>{h.target===i&&c()}),a.appendChild(i),()=>{u(),d(),c()}}function qr(a,e,t){Ci();const i=Ri("star-view-overlay","star-view-overlay");i.setAttribute("aria-label",`Star: ${e.displayName}`);const r=qe[e.galaxyId],n=r?"#"+r.primaryColor.toString(16).padStart(6,"0"):"#4080c0",s=En(e.galaxyId);i.innerHTML=`
    <div style="
      position:relative;
      background:radial-gradient(ellipse at 50% 30%, rgba(${xa(r?.primaryColor??2121888)},0.12) 0%, rgba(0,4,12,0.95) 70%);
      border:1px solid rgba(${xa(r?.primaryColor??2121888)},0.2);
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
          border-left:2px solid rgba(${xa(r?.primaryColor??2121888)},0.3);
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
        ${sr("GALAXY",s)}
        ${sr("ARRIVED",bo(e.createdAt))}
        ${sr("STAR ID",e.id.slice(0,14)+"…")}
        ${sr("COORDINATES",`${e.x.toFixed(0)}, ${e.y.toFixed(0)}, ${e.z.toFixed(0)}`)}
      </div>
      <button id="star-place-cta" type="button" style="
        margin-top:8px;
        padding:12px 28px;
        background:rgba(${xa(r?.primaryColor??2121888)},0.15);
        border:1px solid rgba(${xa(r?.primaryColor??2121888)},0.35);
        border-radius:6px;
        color:#c0d0f0;
        font-family:'Space Grotesk',sans-serif;
        font-size:0.8rem;letter-spacing:0.12em;text-transform:uppercase;
        cursor:pointer;
        transition:background 0.2s;
      ">PLACE YOUR STAR →</button>
    </div>
  `;const o=()=>{i.style.animation="overlay-out 0.2s ease forwards",setTimeout(()=>{i.remove(),t()},200)};i.querySelector("#star-place-cta")?.addEventListener("click",()=>{o(),Xe.set("placementMode",!0),window.dispatchEvent(new CustomEvent("universe-start-placement"))}),La(i.firstElementChild,o);const l=oa(i,o),c=sa(i);return i.addEventListener("mousedown",u=>{u.target===i&&o()}),a.appendChild(i),()=>{l(),c(),o()}}async function cf(a,e,t){const i=window.matchMedia("(prefers-reduced-motion: reduce)").matches,r=document.createElement("div");r.style.cssText=`
    position:fixed;inset:0;
    background:rgba(0,2,8,0.92);
    display:flex;flex-direction:column;
    align-items:center;justify-content:center;
    z-index:200;
    font-family:'Space Mono',monospace;
    text-align:center;gap:16px;
    transition:opacity 0.5s;
  `,r.innerHTML=`
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
  `,a.appendChild(r);const n=i?400:2500;await new Promise(s=>setTimeout(s,n)),r.style.opacity="0",await new Promise(s=>setTimeout(s,500)),r.remove(),t()}function Yr(a="rgba(20,40,80,0.6)"){return["display:inline-block;","padding:10px 16px;",`background:${a};`,"border:1px solid rgba(80,140,220,0.25);","border-radius:6px;","color:#a0b8d8;","font-family:'Space Grotesk',sans-serif;","font-size:0.72rem;","letter-spacing:0.1em;","text-transform:uppercase;","cursor:pointer;","transition:background 0.2s;"].join("")}function $r(a,e,t,i){const r=a.getContext("2d");if(!r)return;a.width=t,a.height=i;const n=qe[e.galaxyId],s=r.createRadialGradient(t*.5,i*.3,0,t*.5,i*.3,i*.7),o=n?"#"+n.primaryColor.toString(16).padStart(6,"0"):"#204080";s.addColorStop(0,`${o}22`),s.addColorStop(.6,"#020810"),s.addColorStop(1,"#010408"),r.fillStyle=s,r.fillRect(0,0,t,i),r.globalAlpha=.5;for(let f=0;f<300;f++){const _=Math.random()*t,v=Math.random()*i,m=Math.random()*1.2+.3;r.fillStyle="#ffffff",r.beginPath(),r.arc(_,v,m,0,Math.PI*2),r.fill()}r.globalAlpha=1;const l=t/1080,c=80*l;r.font=`${c}px serif`,r.textAlign="center",r.fillStyle="#ffd700",r.shadowColor="#ffd700",r.shadowBlur=40*l,r.fillText("✦",t*.5,i*.25),r.shadowBlur=0,r.font=`${11*l}px 'Arial', sans-serif`,r.fillStyle=o,r.letterSpacing=`${3*l}px`,r.fillText("2FLY UNIVERSE",t*.5,i*.32),r.font=`bold ${28*l}px 'Arial', sans-serif`,r.fillStyle="#f0f4ff",r.letterSpacing="0px",r.fillText(e.displayName.toUpperCase(),t*.5,i*.4),e.starName&&(r.font=`${16*l}px 'Arial', sans-serif`,r.fillStyle="#7080a0",r.fillText(`"${e.starName}"`,t*.5,i*.45)),e.message&&(r.font=`italic ${13*l}px 'Arial', sans-serif`,r.fillStyle="#5a7090",hf(r,`"${e.message}"`,t*.5,i*.52,t*.75,18*l));const u=i*.72,d=20*l;r.font=`${10*l}px 'Courier New', monospace`,r.textAlign="center";const h=[`GALAXY: ${En(e.galaxyId).toUpperCase()}`,`ARRIVED: ${bo(e.createdAt)}`,`ID: ${e.id.slice(0,20)}`,`COORDS: ${e.x.toFixed(0)}, ${e.y.toFixed(0)}, ${e.z.toFixed(0)}`];r.fillStyle="#2a4060",h.forEach((f,_)=>r.fillText(f,t*.5,u+_*d)),r.font=`${9*l}px 'Arial', sans-serif`,r.fillStyle="#1a3050",r.fillText("2FLYKEITHLOGAN.COM/UNIVERSE",t*.5,i*.94),r.strokeStyle=`${o}33`,r.lineWidth=2*l,r.strokeRect(20*l,20*l,t-40*l,i-40*l)}function hf(a,e,t,i,r,n){const s=e.split(" ");let o="",l=i;for(const c of s){const u=o+c+" ";a.measureText(u).width>r&&o.length?(a.fillText(o,t,l),o=c+" ",l+=n):o=u}a.fillText(o,t,l)}function Ys(a,e){const t=document.createElement("a");t.href=a.toDataURL("image/png"),t.download=e,t.click()}function sr(a,e){return`
    <div style="
      background:rgba(255,255,255,0.02);
      border:1px solid rgba(255,255,255,0.05);
      border-radius:6px;
      padding:10px 12px;
    ">
      <div style="font-size:0.6rem;letter-spacing:0.15em;color:#3a5070;
        text-transform:uppercase;font-family:'Space Mono',monospace;margin-bottom:4px;">${a}</div>
      <div style="font-size:0.78rem;color:#8090b0;word-break:break-all;">${e}</div>
    </div>
  `}function bo(a){try{return new Date(a).toLocaleDateString("en-US",{year:"numeric",month:"short",day:"numeric"})}catch{return a}}function xa(a){const e=a>>16&255,t=a>>8&255,i=a&255;return`${e},${t},${i}`}const Eo=document.createElement("style");Eo.textContent=`
  @keyframes star-pulse {
    0%,100% { text-shadow:0 0 10px currentColor,0 0 20px currentColor; }
    50% { text-shadow:0 0 20px currentColor,0 0 40px currentColor,0 0 60px currentColor; }
  }
`;document.head.appendChild(Eo);function uf(a,e,t){Ci();const i=Ri("star-placement-overlay","star-placement-overlay");i.setAttribute("aria-label","Place Your Star in the 2Fly Universe"),i.style.background="rgba(0,2,8,0.88)";let r="info",n="",s="",o="",l=!1;function c(){i.innerHTML=df(r,e,n,s,o,l),h(),sa(i)}function u(){return n.trim().length>0||s.trim().length>0||o.trim().length>0}function d(){if(r==="info"){const m=i.querySelector("#place-display-name"),p=i.querySelector("#place-star-name"),w=i.querySelector("#place-message");m&&(n=m.value.trim()),p&&(s=p.value.trim()),w&&(o=w.value.trim())}u()?(l=!0,c()):v(!1)}function h(){if(i.querySelector("#place-back-header")?.addEventListener("click",()=>f()),i.querySelector("#place-close")?.addEventListener("click",()=>d()),l){i.querySelector("#unsaved-keep")?.addEventListener("click",()=>{l=!1,c()}),i.querySelector("#unsaved-discard")?.addEventListener("click",()=>{v(!1)});return}r==="info"&&i.querySelector("#place-next")?.addEventListener("click",()=>{const m=(i.querySelector("#place-display-name")?.value??"").trim(),p=(i.querySelector("#place-star-name")?.value??"").trim(),w=(i.querySelector("#place-message")?.value??"").trim();if(!m){const b=i.querySelector("#place-error");b&&(b.textContent="Display name is required.");return}n=m,s=p,o=w,r="confirm",c()}),r==="confirm"&&(i.querySelector("#place-back")?.addEventListener("click",()=>f()),i.querySelector("#place-confirm")?.addEventListener("click",async()=>{const m=i.querySelector("#place-confirm");m&&(m.disabled=!0,m.textContent="PLACING…");const p={galaxyId:e.galaxyId,regionId:e.regionId,x:e.x,y:e.y,z:e.z,displayName:n,starName:s||void 0,message:o||void 0},w=await Si.placestar(p);if(w.success&&w.star)Xe.setMyStarForGalaxy(w.star.galaxyId,w.star.id),Xe.addStar(w.star),r="ignition",c(),setTimeout(()=>{w.star&&lf(a,w.star,()=>v(!0))},2200);else{const b={collision:"That location is too close to another star. Please choose a different spot.","already-placed-in-galaxy":"You have already placed a star in this era galaxy.","already-placed":"You have already placed a star in this era galaxy.","rate-limit":"Please wait a moment before placing again.","server-error":"An error occurred. Please try again."};r="info",c();const S=i.querySelector("#place-error");S&&(S.textContent=b[w.error??"server-error"]??"An error occurred.")}}))}function f(){if(l){l=!1,c();return}r==="confirm"?(r="info",c()):r==="info"&&d()}const _=m=>{m.key==="Escape"&&(m.stopPropagation(),f())};window.addEventListener("keydown",_);function v(m){window.removeEventListener("keydown",_),i.style.animation="overlay-out 0.2s ease forwards",setTimeout(()=>{i.remove(),t(m)},200)}return c(),a.appendChild(i),()=>{window.removeEventListener("keydown",_),v(!1)}}function df(a,e,t,i,r,n){const s=`${e.x.toFixed(0)}, ${e.y.toFixed(0)}, ${e.z.toFixed(0)}`;if(n)return`
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
          <button id="unsaved-keep" type="button" style="${ya("#182838","#203850")}">
            KEEP EDITING
          </button>
          <button id="unsaved-discard" type="button" style="${ya("#801828","#a02038")} color:#ffd0d8;">
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
  `;return a==="info"?`
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
          style="${Kr()}"
          autocomplete="name" required />
      </label>
      <label style="display:block;margin-bottom:16px;">
        <span style="font-size:0.7rem;letter-spacing:0.12em;color:#6090b8;text-transform:uppercase;
          display:block;margin-bottom:6px;">Star Name (optional)</span>
        <input id="place-star-name" type="text" maxlength="60"
          placeholder="Name your star"
          value="${i}"
          style="${Kr()}" />
      </label>
      <label style="display:block;margin-bottom:24px;">
        <span style="font-size:0.7rem;letter-spacing:0.12em;color:#6090b8;text-transform:uppercase;
          display:block;margin-bottom:6px;">Message (optional)</span>
        <textarea id="place-message" maxlength="280" rows="3"
          placeholder="Leave a message for the Universe…"
          style="${Kr()} resize:vertical;height:80px;"
        >${r}</textarea>
      </label>
      <button id="place-next" type="button" style="${ya("#1a60c0","#2080e0")} width:100%;">
        PREVIEW MY STAR →
      </button>
    </div>
  `:a==="confirm"?`
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
      ${r?`<p style="color:#5a7898;font-size:0.8rem;font-style:italic;margin-bottom:8px;">"${r}"</p>`:""}
      <p style="color:#3a5878;font-size:0.75rem;font-family:'Space Mono',monospace;margin-bottom:20px;">
        Coordinates: ${s}
      </p>
      <p style="color:#4a6888;font-size:0.75rem;margin-bottom:24px;line-height:1.6;">
        Your star is permanent. Confirm to ignite your light in this era galaxy.
      </p>
      <div style="display:flex;gap:12px;justify-content:center;">
        <button id="place-back" type="button" style="${ya("#1a2030","#202840")}">← BACK</button>
        <button id="place-confirm" type="button" style="${ya("#104080","#1060b0")}">IGNITE MY STAR ✦</button>
      </div>
    </div>
  `:a==="ignition"?`
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
  `:""}function Kr(){return`
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
  `}function ya(a,e){return`
    display:inline-block;
    padding:12px 20px;
    background:${a};
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
  `}async function pf(a){const e=document.getElementById("overlay-layer"),t=document.getElementById("ui-layer"),i=document.getElementById("css3d-layer"),r=document.getElementById("loading-status"),n=gp(a),s=new rp;s.fog=new gn(1032,15e-7);const o=new Sp(a),l=new fp,c=new Le;r&&(r.textContent="Loading Universe data…");const u=await Vp();Wp(u),r&&(r.textContent="Building 3D galaxies…"),await new Promise(F=>setTimeout(F,0));const d=new Ep;s.add(d.group);const h=[];for(const F of on()){const V=new Cp(F,i);s.add(V.group),h.push(V)}const f=[];for(const F of["G2000","G2005","G2010","G2015","G2020","G2030"]){const V=new Pp(F);s.add(V.group),f.push(V)}r&&(r.textContent="Placing visitor star clusters…"),await new Promise(F=>setTimeout(F,0));const _=new Up(i);s.add(_.group);const v=await Si.loadStars();Xe.set("stars",v),_.setStars(v,Xe.get("myStarId"));let m=null,p=null,w=null,b=null;const S=yo(),N=S.find(F=>F.id==="OBJ-FIRE");N&&(p=new Op(N,i),s.add(p.group));const R=S.find(F=>F.id==="OBJ-AFRICA");R&&(w=new Fp(R,i),s.add(w.group));const A=S.find(F=>F.id==="OBJ-STREAMS");A&&(m=new Np(A,i),s.add(m.group)),b=new zp(S,i),s.add(b.group);const P=new Qp(t,{onResetView:()=>{o.resetToHome(),P.setReturnAvailable(o.hasHistory())},onReturnPrevious:()=>{o.returnToPrevious(),P.setReturnAvailable(o.hasHistory())},onTakeTour:()=>{Be()},onViewMyStar:async F=>{const V=await Si.getStarById(F);V&&o.travelToObject({x:V.x,y:V.y,z:V.z},600,{onDone:()=>{we((H,x)=>qr(H,V,x))}})}});new ef(t,{onTravelToGalaxy:F=>{const[V,H,x]=Ta(F);o.travelToObject({x:V,y:H,z:x},14e3),P.setReturnAvailable(o.hasHistory())},onTravelToRegion:(F,V)=>{const[H,x,g]=Mo(F,V);o.travelToObject({x:H,y:x,z:g},4500),P.setReturnAvailable(o.hasHistory())},onTravelToObject:F=>{const V=S.find(H=>H.id===F);if(V){const[H,x,g]=qp(V);o.travelToObject({x:H,y:x,z:g},1600),P.setReturnAvailable(o.hasHistory())}}});const E=new pp(659224,1.1);s.add(E);let y=!1;window.addEventListener("universe-thrust-state",F=>{y=!!F.detail?.active});const C=document.createElement("div");C.id="flight-mode-hud",C.style.cssText="position:fixed;right:18px;bottom:18px;z-index:72;padding:9px 12px;border:1px solid rgba(120,190,255,.28);border-radius:999px;background:rgba(5,12,24,.68);backdrop-filter:blur(10px);font:600 10px 'Space Mono',monospace;letter-spacing:.12em;color:#9db8ca;pointer-events:none;opacity:.78;transition:.2s ease;",C.textContent="HOLD RIGHT MOUSE · THRUST",t.appendChild(C),window.addEventListener("universe-thrust-state",F=>{const V=!!F.detail?.active;C.textContent=V?"THRUST ACTIVE · FOLLOW THE MOUSE":"HOLD RIGHT MOUSE · THRUST",C.style.color=V?"#60ffd0":"#9db8ca",C.style.borderColor=V?"rgba(96,255,208,.5)":"rgba(120,190,255,.28)"});const z=document.createElement("div");z.id="galaxy-selector-circle",z.style.cssText="position:fixed;z-index:74;width:48px;height:48px;border:2px solid rgba(210,220,230,.72);border-radius:50%;pointer-events:none;transform:translate(-50%,-50%);opacity:0;box-shadow:0 0 18px rgba(210,220,230,.25),inset 0 0 12px rgba(210,220,230,.12);transition:opacity .16s ease,width .16s ease,height .16s ease;",t.appendChild(z);let B=null;window.addEventListener("universe-selection-state",F=>{const V=F.detail;V?.active&&V.world?(B=new T(V.world.x,V.world.y,V.world.z),z.style.opacity="1"):(B=null,z.style.opacity="0")});function j(){if(B&&!y){const F=B.clone().project(o.camera),V=(F.x*.5+.5)*window.innerWidth,H=(-F.y*.5+.5)*window.innerHeight;F.z>-1&&F.z<1&&V>-60&&V<window.innerWidth+60&&H>-60&&H<window.innerHeight+60?(z.style.left=V+"px",z.style.top=H+"px",z.style.opacity="1"):z.style.opacity="0"}else z.style.opacity="0";requestAnimationFrame(j)}requestAnimationFrame(j);const J=document.createElement("div");J.id="travel-hint-hud",J.style.cssText="position:fixed;left:50%;bottom:18px;transform:translateX(-50%);z-index:73;padding:8px 14px;border:1px solid rgba(96,255,208,.28);border-radius:999px;background:rgba(4,12,24,.62);backdrop-filter:blur(10px);font:600 10px 'Space Mono',monospace;letter-spacing:.14em;color:#9de8d9;pointer-events:none;opacity:0;transition:.18s ease;max-width:70vw;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;",t.appendChild(J);let $=0;function ie(F){return qe[F]?.title||F||"GALAXY"}function X(){const F=o.selectedTargetLabel||"";let V="";y?V=F?`TRAVELING TOWARD · ${F}`:o.localGalaxyId?`TRAVELING THROUGH · ${ie(o.localGalaxyId)}`:$>.08?"RETURNING TOWARD · GALAXY CLUSTER":"TRAVELING THROUGH · DEEP SPACE":V=F?o.localGalaxyId?`SELECTED · ${F} · CLICK AGAIN TO OPEN`:`TRAVEL TARGET · ${F}`:o.localGalaxyId?`NAVIGATING · ${ie(o.localGalaxyId)}`:$>.08?"DEEP SPACE · GALAXY CLUSTER AHEAD":"",J.textContent=V,J.style.opacity=V?"1":"0",requestAnimationFrame(X)}requestAnimationFrame(X),window.addEventListener("universe-wormhole",F=>{const V=F.detail?.state,H=document.getElementById("wormhole-flash")||document.createElement("div");H.id="wormhole-flash",H.style.cssText="position:fixed;inset:-12%;z-index:95;pointer-events:none;background:repeating-radial-gradient(ellipse at center,rgba(122,86,255,.5) 0 2%,rgba(50,220,255,.18) 3% 5%,transparent 7% 10%);mix-blend-mode:screen;opacity:0;transform:scale(.5) rotate(0deg);transition:opacity .22s,transform .85s cubic-bezier(.2,.8,.2,1);",H.parentNode||t.appendChild(H),requestAnimationFrame(()=>{H.style.opacity=V==="enter"?"1":".65",H.style.transform=V==="enter"?"scale(2.6) rotate(26deg)":"scale(4.2) rotate(70deg)"}),setTimeout(()=>{H.style.opacity="0",setTimeout(()=>H.remove(),500)},V==="enter"?620:420)}),window.addEventListener("universe-hyperlapse",F=>{const V=F.detail;if(!V)return;let H=document.getElementById("galaxy-hyperlapse-frame");if(V.state==="enter"){H=document.createElement("div"),H.id="galaxy-hyperlapse-frame";const x="#"+Number(V.accentColor??6356944).toString(16).padStart(6,"0");H.style.cssText=`position:fixed;inset:0;z-index:78;pointer-events:none;border:2px solid ${x}88;box-shadow:inset 0 0 90px ${x}38;display:grid;place-items:end center;padding-bottom:12vh;opacity:0;transition:opacity .18s;`,H.innerHTML=`<div style="font:700 11px 'Space Mono',monospace;letter-spacing:.24em;color:${x};text-shadow:0 0 18px ${x};">HYPERLAPSE · ${V.title??"GALAXY"}</div>`,t.appendChild(H),requestAnimationFrame(()=>H.style.opacity="1")}else H&&(H.style.opacity="0",setTimeout(()=>H.remove(),720))});let ee=null;window.addEventListener("universe-boundary",F=>{const V=Number(F.detail?.influence??0);$=V,V>.08?(ee||(ee=document.createElement("div"),ee.id="universe-return-field",ee.style.cssText="position:fixed;left:50%;top:9%;transform:translateX(-50%);z-index:76;padding:8px 12px;border-radius:999px;background:rgba(6,12,24,.62);border:1px solid rgba(150,180,255,.3);font:600 10px 'Space Mono',monospace;letter-spacing:.14em;color:#aabbd8;pointer-events:none;",t.appendChild(ee)),ee.textContent=V>.72?"OUTER LIMIT · RETURN VECTOR LOCKED":"DEEP SPACE · CENTER PULL ACTIVE",ee.style.opacity=String(Math.min(1,V*1.4))):ee&&(ee.remove(),ee=null)}),window.addEventListener("universe-galaxy-threshold",F=>{const V=F.detail;if(!V)return;const H="#"+Number(V.accentColor??6356944).toString(16).padStart(6,"0");for(const g of h)g.setResidencyActive?.(V.state==="enter"&&g.getId()===V.galaxyId);const x=document.createElement("div");x.style.cssText=`position:fixed;inset:0;pointer-events:none;z-index:70;display:grid;place-items:center;background:radial-gradient(circle at center,${H}28 0%,${H}14 34%,transparent 70%);border:2px solid ${H}45;box-shadow:inset 0 0 85px ${H}26;mix-blend-mode:screen;opacity:0;transition:opacity .28s ease,transform .85s ease;transform:scale(${V.state==="enter"?.98:1.03});`,x.innerHTML=`<div style="text-align:center;font-family:'Space Mono',monospace;text-transform:uppercase;color:${H};text-shadow:0 0 24px ${H};"><div style="font-size:clamp(1.45rem,4.2vw,3.5rem);font-weight:800;letter-spacing:.14em;line-height:1.05;">${V.title??"GALAXY"}</div><div style="margin-top:.55rem;font-size:.68rem;letter-spacing:.25em;opacity:.82;">${V.state==="enter"?"ENTERING GALAXY":"LEAVING GALAXY"}</div></div>`,t.appendChild(x),requestAnimationFrame(()=>{x.style.opacity="1",x.style.transform="scale(1)"}),setTimeout(()=>{x.style.opacity="0",x.style.transform=V.state==="enter"?"scale(1.045)":"scale(.97)",setTimeout(()=>x.remove(),520)},860)});let de=null;function we(F){de&&(de(),de=null);const V=o.snapshot();Xe.pushCameraSnapshot(V),e.setAttribute("aria-hidden","false"),e.classList.add("overlay-active"),de=F(e,()=>{e.setAttribute("aria-hidden","true"),e.classList.remove("overlay-active"),de=null;const H=Xe.popCameraSnapshot();H&&o.restoreSnapshot(H)})}let be=null,je=null,Y="";function re(F,V){if(be&&be!==F){const H=be.userData.__selectBaseScale;H&&be.scale.copy(H);const x=be.material;x&&be.userData.__selectBaseEmissive!==void 0&&x.emissive&&x.emissive.setHex(be.userData.__selectBaseEmissive)}if(be=F,F){F.userData.__selectBaseScale||(F.userData.__selectBaseScale=F.scale.clone()),F.scale.copy(F.userData.__selectBaseScale).multiplyScalar(1.12);const H=F.material;H&&H.emissive&&(F.userData.__selectBaseEmissive===void 0&&(F.userData.__selectBaseEmissive=H.emissive.getHex()),H.emissive.setHex(16777215))}V&&He(V),clearTimeout(je),je=setTimeout(()=>{if(be){const H=be.userData.__selectBaseScale;H&&be.scale.copy(H);const x=be.material;x&&be.userData.__selectBaseEmissive!==void 0&&x.emissive&&x.emissive.setHex(be.userData.__selectBaseEmissive),be=null}},2400)}function ve(F,V){return F?.title||F?.name||V?.userData?.title||V?.userData?.objectId||"ORBIT OBJECT"}a.addEventListener("click",F=>{if(o.consumeThrustClick?.()||o.consumeOrbitClick?.()||de||Xe.get("placementMode"))return;c.x=F.clientX/window.innerWidth*2-1,c.y=-(F.clientY/window.innerHeight)*2+1,l.setFromCamera(c,o.camera);for(const x of h){if(o.localGalaxyId===x.getId())continue;const g=x.getSelectionMesh?.();if(!g)continue;if(l.intersectObject(g,!1).length){const q=x.group.getWorldPosition(new T),Z=qe[x.getId()];Y=`galaxy:${x.getId()}`,re(null,(Z?.title||x.getId())+" · SELECTED"),o.setSelectedTarget(q,Z?.title||x.getId());return}}const V=[[p,"OBJ-FIRE","THRU THE FIRE"],[w,"OBJ-AFRICA","I WOKE UP IN AFRICA"],[m,"OBJ-STREAMS","STREAMS"],[b,null,null]];for(const[x,g,O]of V){if(!x)continue;const q=l.intersectObjects(x.clickTargets);if(!q.length)continue;const Z=q[0].object,K=Z.userData.childId,pe=Z.userData.objectId;if(K){const ne=x.getChildData(K),he=ve(ne,Z),Fe=`child:${K}`;if(Y===Fe&&ne){tt(ne),He(he+" · OPENING");return}re(Z,he);const ae=new T;Z.getWorldPosition(ae),o.setSelectedTarget(ae,he),Y=Fe,He(he+" · SELECTED · CLICK AGAIN TO OPEN");return}if(pe){const ne=O||ve(null,Z),he=`object:${pe}`;re(Z,ne);const Fe=new T;Z.getWorldPosition(Fe),o.setSelectedTarget(Fe,ne),Y=he,He(ne+" · SELECTED");return}}for(const x of f){const g=x.getHit(l);if(g){const O=`archive:${g.title}`;if(Y===O){He(g.title+" — ARCHIVE NOT YET CURATED");return}re(g.object??null,g.title+" — ARCHIVE NOT YET CURATED"),o.setSelectedTarget(g.worldPos,g.title),Y=O,He(g.title+" · SELECTED");return}}const H=_.getClickTarget(l);if(H){const x=Xe.get("stars").find(g=>g.id===H.starId);if(x){const g=`star:${x.id}`;if(o.setSelectedTarget(new T(x.x,x.y,x.z),x.name||"STAR"),Y===g){we((O,q)=>qr(O,x,q)),He((x.name||"STAR")+" · OPENING");return}Y=g,He((x.name||"STAR")+" · SELECTED · CLICK AGAIN TO OPEN");return}}Y="",o.clearSelectedTarget(),P.setReturnAvailable(o.hasHistory())});let se=null,xe=null;function Ae(){xe&&(xe.remove(),xe=null)}function Ue(){Ae(),Xe.set("placementMode",!1),P.setPlacementMode(!1),se&&o.restoreSnapshot(se,!0)}window.addEventListener("universe-start-placement",()=>{se=o.snapshot(),Ae(),xe=document.createElement("div"),xe.id="placement-mode-banner",xe.style.cssText=`
      position:fixed;top:16px;left:50%;transform:translateX(-50%);
      background:rgba(2,10,24,0.92);border:1px solid rgba(96,255,208,0.4);
      border-radius:8px;padding:8px 16px;display:flex;align-items:center;gap:12px;
      z-index:60;font-family:'Space Mono',monospace;font-size:0.7rem;color:#60ffd0;
      box-shadow:0 8px 32px rgba(0,0,0,0.6);
    `,xe.innerHTML=`
      <span>✦ PLACING STAR — CLICK ANYWHERE TO CHOOSE COORDINATE</span>
      <button id="cancel-placement-banner-btn" type="button" style="
        background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.2);
        border-radius:4px;color:#8ab4d4;padding:4px 10px;cursor:pointer;
        font-family:'Space Mono',monospace;font-size:0.65rem;
      ">← CANCEL</button>
    `,t.appendChild(xe),xe.querySelector("#cancel-placement-banner-btn")?.addEventListener("click",()=>{Ue()})}),window.addEventListener("keydown",F=>{F.key==="Escape"&&Xe.get("placementMode")&&Ue()}),a.addEventListener("click",F=>{if(!Xe.get("placementMode"))return;Ae(),c.x=F.clientX/window.innerWidth*2-1,c.y=-(F.clientY/window.innerHeight)*2+1,l.setFromCamera(c,o.camera);const V=new li(new T(0,1,0),0),H=new T;if(l.ray.intersectPlane(V,H),!H)return;let x="G2025",g="G2025-R3",O=1/0;for(const q of Object.keys(qe)){const[Z,,K]=Ta(q),pe=Math.sqrt((H.x-Z)**2+(H.z-K)**2);pe<O&&(O=pe,x=q,g=`${q}-R1`)}Xe.set("placementMode",!1),P.setPlacementMode(!1),we((q,Z)=>uf(q,{galaxyId:x,regionId:g,x:H.x,y:H.y+50,z:H.z},K=>{if(K){const pe=Si.getMyStarId();pe&&Si.getStarById(pe).then(ne=>{ne&&(_.addStar(ne),o.travelToObject({x:ne.x,y:ne.y,z:ne.z},600))})}else se&&o.restoreSnapshot(se,!0);Z()}))});function tt(F){if(!F)return;const V=F.mediaKind;we(V==="audio"?(H,x)=>tf(H,F,x):V==="video"?(H,x)=>af(H,F,x):V==="playable"?(H,x)=>rf(H,F,x):(H,x)=>nf(H,F,x))}function Be(){const F=[{name:"Thru the Fire System",pos:p?.getPlanetWorldPos()??{x:-4500,y:40,z:-2500}},{name:"I Woke Up in Africa System",pos:w?.getPlanetWorldPos()??{x:0,y:40,z:4e3}},{name:"Streams System",pos:m?.getPlanetWorldPos()??{x:4e3,y:40,z:-2e3}}],V=F[Math.floor(Math.random()*F.length)];o.travelToObject(V.pos,1500,{onDone:()=>{He(`DESTINATION ARRIVED — ${V.name}`)}}),P.setReturnAvailable(!0)}function He(F){const V=document.createElement("div");V.style.cssText=`
      position:absolute;top:70px;left:50%;transform:translateX(-50%);
      background:rgba(2,10,24,0.9);border:1px solid rgba(80,160,240,0.3);
      border-radius:6px;padding:8px 16px;font-family:'Space Mono',monospace;
      font-size:0.65rem;letter-spacing:0.15em;color:#8ab4d4;
      text-transform:uppercase;pointer-events:none;z-index:60;
      animation:fade-in-text 0.3s ease;
    `,V.textContent=F,t.appendChild(V),setTimeout(()=>V.remove(),3e3)}let D=!1;function Tt(){if(D)return;D=!0;const F=document.createElement("div");if(F.style.cssText=`
      position:fixed;inset:0;pointer-events:none;z-index:90;
      display:flex;flex-direction:column;align-items:center;justify-content:center;
      text-align:center;font-family:'Space Mono',monospace;
      animation:title-fade 3.5s ease forwards;
    `,F.innerHTML=`
      <div style="font-size:0.7rem;letter-spacing:0.3em;color:#4090c0;margin-bottom:8px;text-transform:uppercase;">
        2FLY UNIVERSE
      </div>
      <div style="font-size:clamp(1.2rem,3vw,2rem);letter-spacing:0.2em;color:#60ffd0;font-weight:bold;margin-bottom:8px;">
        2025 — 2029
      </div>
      <div style="font-size:0.75rem;letter-spacing:0.2em;color:#4a7898;text-transform:uppercase;">
        THE CURRENT GALAXY
      </div>
    `,!document.getElementById("title-anim-style")){const V=document.createElement("style");V.id="title-anim-style",V.textContent=`
        @keyframes galaxy-shell-cascade {
          0%,100% { filter:brightness(.82); transform:scale(1); }
          50% { filter:brightness(1.22); transform:scale(1.006); }
        }
        @keyframes title-fade {
          0% { opacity:0; transform:scale(0.96); }
          20% { opacity:1; transform:scale(1); }
          75% { opacity:1; transform:scale(1); }
          100% { opacity:0; transform:scale(1.04); }
        }
      `,document.head.appendChild(V)}e.appendChild(F),setTimeout(()=>F.remove(),3600)}setTimeout(Tt,1e3),jr.init(),jr.on(async F=>{if(F.type==="star"&&F.starId){const V=await Si.getStarById(F.starId);V&&await cf(e,V,()=>{o.travelToObject({x:V.x,y:V.y,z:V.z},700,{onDone:()=>{we((H,x)=>qr(H,V,x))}})})}if(F.type==="galaxy"&&F.galaxyId){const[V,H,x]=Ta(F.galaxyId);o.travelToObject({x:V,y:H,z:x},12e3),Xe.set("currentGalaxyId",F.galaxyId)}F.type==="universe"&&o.resetToHome()}),window.addEventListener("universe-esc",()=>{if(de){de();return}jr.back()});let ze=0;vp(F=>{ze+=F,o.update(F);const V=o.camera.position;let H=null,x=1/0;for(const[g,O]of Object.entries(qe)){const[q,Z,K]=O.worldOffset,pe=Math.hypot(V.x-q,V.y-Z,V.z-K);pe<x&&(x=pe,H=g)}H!==Xe.get("currentGalaxyId")&&Xe.set("currentGalaxyId",H),V.distanceTo(new T(-4500,40,-2500))<4e3?ut.setRegionTheme("fire"):V.distanceTo(new T(0,40,4e3))<4e3?ut.setRegionTheme("africa"):V.distanceTo(new T(4e3,40,-2e3))<4500?ut.setRegionTheme("frontier"):ut.setRegionTheme(null),d.update(ze);for(const g of f)g.update(F);for(const g of h)g.update(ze,V),g.updateLabels(o.camera,n,V);p?.update(F,o.camera,n),w?.update(F,o.camera,n),m?.update(F,o.camera,n),b?.update(F,o.camera,n),_.update(V,o.camera,n),n.render(s,o.camera)}),Xe.set("loaded",!0);const Oe=document.getElementById("loading-screen");Oe&&(Oe.style.transition="opacity 0.8s",Oe.style.opacity="0",setTimeout(()=>Oe.remove(),800))}async function ff(){const a=document.getElementById("universe-canvas");if(!a)throw new Error("No canvas element found");try{await pf(a)}catch(e){if(console.error("[2Fly Universe] Fatal init error:",e),document.getElementById("loading-screen")){const t=document.getElementById("loading-status");t&&(t.textContent="Universe failed to initialize. Please refresh.",t.style.color="#f06060")}}}ff();
