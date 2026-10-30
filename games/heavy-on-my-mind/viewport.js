export function viewportLayout(width,height,touch=false){
 if(width>=480&&height<480)return {header:34,meter:62,meterTop:34,top:96,bottom:56,height:Math.max(1,height-152)};
 const narrow=width<=700,header=narrow?52:60,meter=narrow?104:88,bottom=narrow||touch?116:64;
 return {header,meter,meterTop:header,top:header+meter,bottom,height:Math.max(1,height-header-meter-bottom)};
}
