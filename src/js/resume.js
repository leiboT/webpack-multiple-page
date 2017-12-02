import '../stylus/icon.stylus';
import '../stylus/resume.stylus';
import '../csslib/bootstrap.css';
import '../media/ry.mp3';
import '../media/ry.ogg';
import '../media/zmz.mp3';
import '../media/zmz.ogg';
import BScroll from 'better-scroll';

window.onload = function (){
    console.log('项目源码:https://github.com/leiboT/webpack-multiple-page');
    let resizeTimer = false;
    window.onresize = function (){
        if(!resizeTimer){
            resizeTimer = true;
            setTimeout(function(){
                window.location.reload();
                resizeTimer = false;
            }, 500);
        }
    };
    //事件盒子 --根据终端进行切换
    let events = {
        "start" :"mousedown",
        "move" :"mousemove",
        "end" :"mouseup",
    };
    //是否为移动端flag
    let isMobile = false;

    //判断客户端类型
    function judge (){
        let browser = {
            versions: function() {
                let u = navigator.userAgent, app = navigator.appVersion;
                return {//移动终端浏览器版本信息
                    trident: u.indexOf('Trident') > -1, //IE内核
                    presto: u.indexOf('Presto') > -1, //opera内核
                    webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
                    gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
                    mobile: !!u.match(/AppleWebKit.*Mobile.*/) || !!u.match(/AppleWebKit/), //是否为移动终端
                    ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
                    android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
                    iPhone: u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1, //是否为iPhone或者QQHD浏览器
                    iPad: u.indexOf('iPad') > -1, //是否iPad
                    webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部
                };
            }(),
            language: (navigator.browserLanguage || navigator.language).toLowerCase()
        };
        let li = document.getElementsByClassName("qq")[0];
        let q = li.querySelector("a");
        if (browser.versions.ios || browser.versions.android || browser.versions.iPhone || browser.versions.iPad) {
            isMobile = true;
            q.href = "mqqwpa://im/chat?chat_type=wpa&uin=1062177416&version=1&src_type=web&web_src=oicqzone.com";
            events.start = "touchstart";
            events.move = "touchmove";
            events.end = "touchend";
        }else{
            q.href = "tencent://message/?Menu=yes&uin=1062177416";
        }
    }
    judge();

    let scrollWrapper = document.getElementsByClassName('scroll-wrapper')[0]; //启动滑动的层
    let containerWrapper = scrollWrapper.querySelector('.container-wrapper'); //溢出层
    let scrollWrapperH = scrollWrapper.offsetHeight;
    let containerWrapperH = containerWrapper.offsetHeight;
    let distance = scrollWrapperH - containerWrapperH;
    //模拟ios硬件加速--上拉下拉
    let resumeScroll = new BScroll(scrollWrapper, {
        probeType: 3,
        click: true
    });
    if(resumeScroll){
        resumeScroll.refresh();
    }


    //添加播放器
    if(document.createElement('video').canPlayType && !isMobile){
        let audio = document.createElement("audio");
        audio.setAttribute('id', 'my-audio');
        audio.autobuffer = true;
        //audio.src = 'media/sx.flac';
        //audio.setAttribute('autoplay','autoplay');
        document.body.appendChild(audio);
        //将播放控件显示
        let audioWrapper = document.getElementsByClassName('audio-wrapper')[0];
        audioWrapper.setAttribute('style', "transform: translate3D(0,100%,0)");
        //监听滑动层，实时获取位置
        resumeScroll.on('scroll', (pos) => {
            if(scrollWrapperH > containerWrapperH){
                return;
            }
            pos.y <= distance ? audioWrapper.style = "transform: translate3D(0,100%,0)" : audioWrapper.style = "transform: translate3D(0,0,0)";
        });
        //音乐数据
        let musicList = [
            {
                'name': '造梦者',
                'author': '以冬',
                'flag': 'zmz'
            },
            {
                'name': '热勇',
                'author': '栗先达',
                'flag': 'ry'
            }
        ];
        audioCtr(audio, audioWrapper, musicList);
    }

    //播放控件事件处理
    function audioCtr (audio, audioWrapper, musicList){

        //播放进度条元素
        let timeWrapper = document.getElementsByClassName('time-wrapper')[0];
        let name = timeWrapper.querySelector('.name');
        let timeLength = timeWrapper.querySelector('.time-length');
        //存储资源秒数
        let dataDuration = 0;
        //加载或者变更音乐处理
        function loadChangeMusic (index){
            audio.innerHTML = "<source src="+"media/"+musicList[index].flag +".mp3"+" type='audio/mpeg'>" +
                "<source src="+"media/"+ musicList[index].flag +".ogg"+" type='audio/ogg'>";

            name.textContent = musicList[index].name+"-"+musicList[index].author;
            //重点 --哇 今晚被这一句坑惨 资源切换记住加上load();
            audio.load();
            audio.addEventListener("canplay", function(){
                dataDuration = audio.duration;
                dataDuration ? audioWrapper.style = "transform: translate3D(0,0,0)" : audioWrapper.style = "display: none;";
                timeLength.textContent = parseInt(audio.duration/60)+":"+Math.round(audio.duration%60);
            });
        }

        let musicIndex = 0; //音乐列表索引
        loadChangeMusic(musicIndex);
        let musicMaxLength = musicList.length - 1; //音乐列表最大长度


        let l = 0; //播放进度存储比率，供播放进度条调用
        let p = 0.5; //声音进度存储比率，默认为0.5（与控件条设置的默认宽度比有关），供声音及控件位置调用

        //保留切换前播放状态
        let paused = audio.paused;
        //定时器
        let timer = null;

        //播放进度条--拖动
        let timeBar = timeWrapper.querySelector('.time-bar');
        let timeMoveBar = timeBar.querySelector('.time-move-bar');
        let tw = timeBar.offsetWidth; //播放条宽度
        let wLeft = getRect(timeBar).left; //播放条距离视口左侧距离
        //拖动以及点击播放条处理函数
        function timeDrag (e){
            e = e || window.event;
            if(dataDuration) {
                audio.pause();
                let x = isMobile ? e.touches[0].pageX - wLeft : e.clientX - wLeft;
                x < 0 && (x = 0);
                x > tw && (x = tw);
                l = (x / tw).toFixed(2);
                timeMoveBar.style = 'width:' + l * 100 + '%';
                audio.currentTime = dataDuration * l;
            }
        }
        timeBar.addEventListener(events.start, function (){
            this.addEventListener(events.move, timeDrag, false);
        },false);
        timeBar.addEventListener(events.end, function (){
            paused ? audio.pause() : audio.play();
            this.removeEventListener(events.move, timeDrag, false);
        },false);

        //暂停播放，前进，后退处理
        document.getElementsByClassName('play-wrapper')[0].addEventListener('click',function(e){
            e = e || window.event;
            let target = e.target;
            let classStr = target.getAttribute('class');
            if (classStr.indexOf('backward') !== -1){
                //切换需先暂停
                audio.pause();
                musicIndex --;
                musicIndex < 0 && (musicIndex = musicMaxLength);
                loadChangeMusic(musicIndex);
                //重置播放状态
                timeMoveBar.style = 'width: 0%';
                paused ? audio.pause() : audio.play();
            }else if(classStr.indexOf('forward')  !== -1){
                //切换需先暂停
                audio.pause();
                musicIndex ++;
                musicIndex > musicMaxLength && (musicIndex = 0);
                loadChangeMusic(musicIndex);
                //重置播放状态
                timeMoveBar.style = 'width: 0%';
                paused ? audio.pause() : audio.play();
            }else if(classStr.indexOf('glyphicon-play')  !== -1 || classStr.indexOf('glyphicon-pause')  !== -1){
                if (classStr.indexOf('glyphicon-play') > 0){
                    classStr = classStr.replace(/glyphicon-play/, 'glyphicon-pause');
                    audio.play();
                    paused = false;
                    timer = setInterval(function(){
                        let currentTime = audio.currentTime;
                        if(currentTime >= (dataDuration-1)){
                            clearInterval(timer);
                            timeMoveBar.style = 'width: 0%';
                            classStr = classStr.replace(/glyphicon-pause/, 'glyphicon-play');
                            target.setAttribute('class', classStr);
                            paused = true;
                        }else {
                            timeMoveBar.style = 'width:' + (currentTime/dataDuration)*100 + '%';
                        }
                    },1000)
                }else{
                    clearInterval(timer);
                    timer = null;
                    classStr = classStr.replace(/glyphicon-pause/, 'glyphicon-play');
                    audio.pause();
                    paused = true;
                }
                target.setAttribute('class', classStr);
            }
        },false);

        //音量控制--点击喇叭
        let volumeWrapper = document.getElementsByClassName('volume-wrapper')[0];
        volumeWrapper.addEventListener('click',function(e){
            e = e || window.event;
            let target = e.target;
            let classStr = target.getAttribute('class');
            if(classStr.indexOf('glyphicon-volume-up') !== -1 || classStr.indexOf('glyphicon-volume-off') !== -1){
                if (classStr.indexOf('glyphicon-volume-up') > 0){
                    classStr = classStr.replace(/glyphicon-volume-up/, 'glyphicon-volume-off');
                    audio.muted = true;
                }else{
                    classStr = classStr.replace(/glyphicon-volume-off/, 'glyphicon-volume-up');
                    audio.muted = false;
                    audio.volume = p;
                }
                target.setAttribute('class', classStr);
            }
        },false);

        //音量控制--拖动
        let volumeBar = volumeWrapper.querySelector('.volume-bar');
        let volumeMoveBar = volumeBar.querySelector('.volume-move-bar');
        let vw = 150; //volumeBar 的宽
        //获取元素位置信息(加上兼容性处理,主要是左上角坐标起点)
        function getRect (element) {
            let rect = element.getBoundingClientRect();
            let top = document.documentElement.clientTop;
            let left= document.documentElement.clientLeft;
            return{
                top: rect.top - top, //如果是IE7以下那么 结果为 ‘2 - 2’。 不是为IE的话 结果是 ‘ 0 - 0 ’； 不管哪种方式，结果最终就是0
                bottom: rect.bottom - top,
                left: rect.left - left,
                right : rect.right - left
            }
        }
        let vLeft = getRect(volumeBar).left; //音量条距离视口左侧距离
        //拖动以及点击音量条处理函数
        function volumeDrag (e){
            e = e || window.event;
            let x = isMobile ? e.touches[0].pageX - vLeft : e.clientX - vLeft;
            x < 0 && (x = 0);
            x > vw && (x = vw);
            p = (x/vw).toFixed(2);
            volumeMoveBar.style = 'width:'+ p*100 +'%';
            audio.volume = p;
        }
        //重写addEventListener -- 判断元素添加了哪些事件类型 (想了想有判断但是用不到，先注释掉吧)
        // Element.prototype._addEventListener = Element.prototype.addEventListener;
        // Element.prototype.addEventListener = function (type, callback, flag){
        //     if (typeof this.eventMarks === 'undefined'){
        //         this.eventMarks = [];
        //     }
        //     this.eventMarks.push(arguments);
        //     this._addEventListener(type, callback, flag);
        //     return this;
        // };
        volumeBar.addEventListener(events.start, function (){
            this.addEventListener(events.move, volumeDrag, false);
        },false);
        volumeBar.addEventListener(events.end, function (){
            this.removeEventListener(events.move, volumeDrag, false);
        },false);
        // volumeBar.addEventListener('mouseleave', function (){
        //     //console.log(this.eventMarks);
        //     this.removeEventListener('mousemove', volumeDrag, false);
        // });
        volumeBar.addEventListener('click', volumeDrag ,false);
    }
};