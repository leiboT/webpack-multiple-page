import {judgeCanvas} from './support';

export default function () {
  if(judgeCanvas()){
    let c = document.createElement('canvas');
    c.setAttribute("class", 'canvas');
    document.body.appendChild(c);
    document.body.addEventListener('touchmove', function (e) {
      e.preventDefault()
    });
    let x = c.getContext('2d'),
      pr = window.devicePixelRatio || 1,
      w = window.innerWidth,
      h = window.innerHeight,
      // 偏移距离
      f = 90,
      // 存储路径坐标
      q,
      m = Math,
      r = 0,
      u = m.PI*2,
      v = m.cos,
      z = m.random;
    c.width = w*pr;
    c.height = h*pr;
    x.scale(pr, pr);
    // 绘制图形的透明度
    x.globalAlpha = 0.8;
    //绘制 init
    function init(){
      x.clearRect(0,0,w,h);
      // 定义第一次和第二次绘制坐标
      q=[{x:0,y:h*.7+f},{x:0,y:h*.7-f}];
      // 只要绘制坐标X轴小于文档区域内宽度加上偏移量，一直调用绘制方法
      while(q[1].x<w+f) draw(q[0], q[1])
    }
    // 绘制方法 --路径绘制
    function draw(i,j){
      x.beginPath();
      x.moveTo(i.x, i.y);
      x.lineTo(j.x, j.y);
      // 生成第二次lineTo坐标
      let k = j.x + (z()*2-0.25)*f,
        n = y(j.y);
      x.lineTo(k, n);
      x.closePath();
      // 16进制颜色递进生成
      r-=u/-50;
      x.fillStyle = '#'+(v(r)*127+128<<16 | v(r+u/3)*127+128<<8 | v(r+u/3*2)*127+128).toString(16);
      x.fill();
      q[0] = q[1];
      q[1] = {x:k,y:n}
    }
    // 坐标y轴生成
    function y(p){
      let t = p + (z()*2-1.1)*f;
      return (t>h||t<0) ? y(p) : t
    }
    document.body.onclick = init;
    document.body.ontouchstart = init;
    init();
  }
}