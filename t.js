/*Basic Functions*/
var $ = new Object();
window.ntnum = 0;
window.totalnt = 0;
var SC = function(e) {
    if (e == 'body') {
        return document.body;
    } else {
        return document.getElementById(e);
    }
}
$.aj = function(p, d, sf, m) { /*(path,data,success or fail,method)*/
    var xhr = new XMLHttpRequest();
    var hm = '';
    for (var ap in d) {
        hm = hm + ap + '=' + d[ap] + '&';
    }
    hm = hm.substring(0, hm.length - 1);
    if (m !== 'multipart/form-data') {
        xhr.open('post', p, true);
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.send(hm);
    } else {
        xhr.open(m, p, true);
        xhr.send(d);
    }
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            sf.success(xhr.responseText);
        } else if (xhr.readyState == 4 && xhr.status !== 200) {
            sf.failed(xhr.status);
        }
    };
} /*Main program*/
var recent = '';
var lock = 'false';
var lockaction = '';
var cooldown = false;
var cooltm; /*cooldown timer*/

function c() { /*checker*/
    var v = SC('p').value;
    if (v !== recent) {
        recent = v;
        up(v); /*upload*/
    }
}
var tm;
SC('p').addEventListener('input', function() {
    if (tm) {
        clearTimeout(tm);
    }
    tm = setTimeout(c, 1000);
});

function up(c, l = false) { /*Uploader*/
    var ucode = ocode;
    if (!l) {
        ucode = '';
    }
    $.aj('./x.php?a=up', {
        t: c,
        i: id,
        l: lock,
        code: ucode
    }, {
        success: function(m) {
            if (m == 'success') {
                console.log('Successfully saved.');
            } else if (m == 'lock') {
                lockaction = '';
                lock = 'true';
                console.log('Locked.');
                notice('文字已被锁定');
            } else if (m == 'failunlock') {
                notice('Can\'t be unlocked.');
                console.log('Can\'t be unlocked.');
            } else if (m == 'limit') {
                console.log('Limited.');
            } else {
                notice('同步失败');
                console.log('Unknown problem.');
            }
        },
        failed: function(m) {
            notice('网络出错');
            console.log('Failed to save because of the network.');
        }
    }, 'post');
}

function optcode() { /*get operation code*/
    return Math.random().toString(36).substr(2);
}

function syn() { /*Synchronizer*/
    $.aj('./x.php?a=gt', {
        i: id
    }, {
        success: function(m) {
            if (m !== 'new') {
                SC('p').value = m;
                recent = m;
            } else {
                SC('p').value = '';
                notice('新文本');
                console.log('New text.');
            }
        },
        failed: function(m) {
            notice('装载文本失败');
            SC('p').value = '加载失败.Load failed.';
            console.log('Failed to load.');
            clearInterval(tm);
        }
    }, 'post');
}
if (id !== undefined && id !== null) {
    syn();
} /*Locker*/
var ocode = optcode(); /*getcode*/

function locker() {
    if (!cooltm || !cooldown) {
        clearInterval(cooltm);
        cooldown = true;
        cooltm = setTimeout(function() {
            cooldown = false;
        }, 2000);
        var v = SC('p').value;
        if (lock == 'false') {
            lock = 'true';
            notice('Locked.');
            play('./lock.wav');
            console.log('Action:lock');
        } else {
            lock = 'false';
            notice('Unlock...');
            play('./unlock.mp3');
            lockaction = 'unlock';
            console.log('Action:unlock');
        }
        up(v, true);
    }
}
document.onkeydown = function(e) {
    var keyCode = e.keyCode || e.which || e.charCode;
    var ctrlKey = e.ctrlKey;
    if (ctrlKey && keyCode == 76) {
        locker();
        e.preventDefault();
        return false;
    }
    return true;
} /*ShakeJudge thanks: https://www.cnblogs.com/xupeiyu/p/4233235.html */
var shakeThreshold = 8000; // 定义一个摇动的阈值
var lastUpdate = 0; // 记录上一次摇动的时间
var x, y, z, lastX, lastY, lastZ; // 定义x、y、z记录三个轴的数据以及上一次触发的数据
// 监听传感器运动事件
if (window.DeviceMotionEvent) {
    window.addEventListener('devicemotion', deviceMotionHandler, false);
} else {
    alert('本设备不支持devicemotion事件，无法锁定');
}
// 运动传感器处理

function deviceMotionHandler(eventData) {
    var acceleration = eventData.accelerationIncludingGravity; // 获取含重力的加速度
    var curTime = new Date().getTime();
    // 100毫秒进行一次位置判断
    if ((curTime - lastUpdate) > 100) {
        var diffTime = curTime - lastUpdate;
        lastUpdate = curTime;
        x = acceleration.x;
        y = acceleration.y;
        z = acceleration.z;
        var speed = Math.abs(x + y + z - lastX - lastY - lastZ) / diffTime * 10000;
        // 前后x, y, z间的差值的绝对值和时间比率超过了预设的阈值，则判断设备进行了摇晃操作
        if (speed > shakeThreshold) {
            locker();
        }
        lastX = x;
        lastY = y;
        lastZ = z;
    }
} /*Notice*/

function notice(t) {
    SC('n').style.zIndex = 2;
    var nn = window.ntnum;
    var i = document.createElement('p');
    i.id = 'nt' + nn;
    i.className = 'nt';
    i.innerHTML = t;
    i.style.opacity = 0;
    SC('n').appendChild(i);
    (function(nn) {
        setTimeout(function() {
            SC('nt' + nn).style.opacity = 1;
        }, 50)
    })(nn);
    (function(nn) {
        setTimeout(function() {
            SC('nt' + nn).style.opacity = 0;
        }, 1250)
    })(nn);
    (function(i) {
        setTimeout(function() {
            SC('n').removeChild(i);
            window.totalnt -= 1;
        }, 2250)
    })(i);
    window.ntnum += 1;
    window.totalnt += 1;
}
setInterval(function() {
    if (window.totalnt <= 0) {
        SC('n').style.zIndex = -1;
    }
}, 500); /*初始化音频*/
var audios = document.createElement('audio');
audios.setAttribute('autoplay', 'autoplay');

function play(u) {
    audios.setAttribute('src', u);
}