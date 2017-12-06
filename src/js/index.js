import '../stylus/index.stylus';

window.onload = function (){
    console.log('项目源码:https://github.com/leiboT/webpack-multiple-page');
    // 全屏切换
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
    // 生成切换元素
    if(judgeRequestFullscreenSupport()){
        let btn = document.createElement('button');
        btn.textContent = '全屏切换';
        btn.setAttribute('class', 'full-screen-toggle');
        btn.onclick = function (e){
            e.stopPropagation();
            ToggleFullscreen();
        };
        document.getElementsByClassName('content-wrapper')[0].appendChild(btn);
    }
    let judge = true;
    // 切换
    function ToggleFullscreen() {
        judge ? launchFullscreen(document.documentElement) : exitFullscreen();
        judge = !judge;
    }
    // 全屏
    function launchFullscreen(element) {
        if(element.requestFullscreen) {
            element.requestFullscreen();
        } else if(element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        } else if(element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen();
        } else if(element.msRequestFullscreen) {
            element.msRequestFullscreen();
        }
    }
    // 取消全屏
    function exitFullscreen() {
        if(document.exitFullscreen) {
            document.exitFullscreen();
        } else if(document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if(document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        }
    }

    // 背景绘制canvas
     // 判断是否支持canvas
    function judgeCanvas(){
        let elem = document.createElement('canvas');
        return !!(elem.getContext && elem.getContext('2d'));
    }
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

    // 调用摄像头
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
        // 如果支持调用就绑定调用并触发video play
    if(judgeGetUserMedia()){
        let video = document.createElement('video');
        video.setAttribute('class', 'video');
        document.getElementsByClassName('content-wrapper')[0].appendChild(video);
        if(judgeCanvas()){
            // 生成照片容器
            let canvas = document.createElement('canvas');
            canvas.setAttribute("class", 'photo-canvas');
            canvas.setAttribute("width", '100');
            canvas.setAttribute("height", '100');
            let context = canvas.getContext('2d');
            document.body.appendChild(canvas);

            // 生成拍照button
            let photoBtn = document.createElement('button');
            photoBtn.textContent = '拍张照片嘛';
            photoBtn.setAttribute('class', 'photo-btn');
            photoBtn.onclick = function (e){
                e.stopPropagation();
                context.drawImage(video, 0, 0, 100, 100);
            };
            document.getElementsByClassName('content-wrapper')[0].appendChild(photoBtn);
        }
        let mediaConfig =  { video: true };
        let errBack = function(e) {
            console.log('An error has occurred!', e)
        };

        if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia(mediaConfig).then(function (stream) {
                video.src = window.URL.createObjectURL(stream);
                video.play();
            });
        } else if(navigator.getUserMedia) { // 标准写法
            navigator.getUserMedia(mediaConfig, function(stream) {
                video.src = stream;
                video.play();
            }, errBack);
        } else if(navigator.webkitGetUserMedia) { // Webkit
            navigator.webkitGetUserMedia(mediaConfig, function(stream){
                video.src = window.webkitURL.createObjectURL(stream);
                video.play();
            }, errBack);
        } else if(navigator.mozGetUserMedia) { // Mozilla
            navigator.mozGetUserMedia(mediaConfig, function(stream){
                video.src = window.URL.createObjectURL(stream);
                video.play();
            }, errBack);
        }
    }
};