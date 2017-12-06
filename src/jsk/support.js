// 判断是否支持canvas
function judgeCanvas(){
  let elem = document.createElement('canvas');
  return !!(elem.getContext && elem.getContext('2d'));
}
// 判断是否支持全屏
function judgeRequestFullscreenSupport(){
  if (document.documentElement.requestFullscreen) {
    return true;
  } else if (document.documentElement.mozRequestFullScreen) {
    return true;
  } else if (document.documentElement.webkitRequestFullscreen) {
    return true;
  } else if (document.documentElement.msRequestFullscreen) {
    return true;
  }else {
    return false;
  }
}
// 判断是否支持调用用户媒体设备
function judgeGetUserMedia(){
  if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    return true;
  } else if(navigator.getUserMedia) { // 标准写法
    return true;
  } else if(navigator.webkitGetUserMedia) { // Webkit
    return true;
  } else if(navigator.mozGetUserMedia) { // Mozilla
    return true;
  }else {
    return false;
  }
}
export {judgeCanvas, judgeGetUserMedia, judgeRequestFullscreenSupport}