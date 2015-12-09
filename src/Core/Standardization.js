(function (window, document, Jyo, undefiend) {
    "use strict";

    var prefix = Jyo.prefix = (function () {
        /// <summary>获取浏览器前缀</summary>
        /// <field name="dom" type="String">浏览器Dom元素前缀</field>
        /// <field name="css" type="String">浏览器Css属性前缀</field>
        /// <field name="js" type="String">浏览器js对象前缀</field>
        /// <field name="lowercase" type="String">浏览器前缀小写</field>

        if (!("getComputedStyle" in window)) {
            return { dom: "", css: "", js: "", lowercase: "" };
        }

        var styles = window.getComputedStyle(document.documentElement, ''),
            pre = (Array.prototype.slice.call(styles).join('').match(/-(moz|webkit|ms)-/))[1],
            dom = ('WebKit|Moz|MS').match(new RegExp('(' + pre + ')', 'i'))[1];
        return { dom: dom, lowercase: pre, css: "-" + pre + "-", js: pre[0].toUpperCase() + pre.substr(1) };
    })();

    if (!String.prototype.ltrim) {
        String.prototype.ltrim = function () {
            /// <summary>清除左侧空白符</summary>
            /// <returns type="String" />

            return this.replace(/^\s+/, "");
        };
    }

    if (!String.prototype.rtrim) {
        String.prototype.rtrim = function () {
            /// <summary>清除右侧空白符</summary>
            /// <returns type="String" />

            return this.replace(/\s+$/, "");
        };
    }

    if (!String.prototype.repeat) {
        String.prototype.repeat = function (count) {
            /// <summary>重复字符串</summary>
            /// <param name="count" type="Number">要重复的次数</param>
            /// <returns type="String" />

            count = count | 0;
            var str = "";
            for (var i = 0; i < count; i++) {
                str += this;
            }
            return str;
        };
    }

    if (!String.prototype.contains) {
        String.prototype.contains = function (searchString, position) {
            /// <summary>检查是否包含某字符串</summary>
            /// <param name="searchString" type="String">要查找的字符串</param>
            /// <param name="position" type="Number" optional="true">查找开始位置</param>
            /// <returns type="Boolean" />

            return String.prototype.indexOf.apply(this, arguments) !== -1;
        };
    }

    if (!Number.isNaN) {
        Number.isNaN = function (value) {
            /// <returns type="Boolean">

            return value + "" === "NaN";
        };
    }

    if (!HTMLCanvasElement.prototype.toBlob) {
        // 让浏览器兼容Canvas的toBlob函数
        Object.defineProperty(HTMLCanvasElement.prototype, 'toBlob', {
            value: function (callback, type, quality) {

                var binStr = atob(this.toDataURL(type, quality).split(',')[1]),
                    len = binStr.length,
                    arr = new Uint8Array(len);

                for (var i = 0; i < len; i++) {
                    arr[i] = binStr.charCodeAt(i);
                }

                callback(new Blob([arr], { type: type || 'image/png' }));
            }
        });
    }

    // 性能
    window.performance = window.performance ||
                         window[prefix.lowercase + "Performance"];

    // 获取用户媒体
    navigator.getUserMedia = navigator.getUserMedia ||
                             navigator[prefix.lowercase + "GetUserMedia"];

    // 获取MIDI数据对象
    navigator.requestMIDIAccess = navigator.requestMIDIAccess ||
                                  navigator[prefix.lowercase + "RequestMIDIAccess"];

    // 电池状态
    if (typeof navigator.getBattery != "function") {
        navigator.getBattery = function () {
            /// <summary>获取电池管理器</summary>

            return {
                then: function (callback) {
                    var battery = navigator.battery || navigator[prefix.lowercase + "Battery"];
                    if (battery !== undefined) callback(battery);
                    else {
                        callback({
                            charging: false,
                            percentage: 50,
                            chargingTime: Infinity,
                            dischargingTime: Infinity
                        });
                    }
                }
            }
        };
    }

    // 震动
    navigator.vibrate = navigator.vibrate || navigator[prefix.lowercase + "Vibrate"] || Function;

    // 游戏手柄
    if (!("getGamepads" in navigator)) {
        navigator.getGamepads = function () {
            return (navigator.msGetGamepads && navigator.msGetGamepads()) ||
                   (navigator.webkitGetGamepads && navigator.webkitGetGamepads()) ||
                   (navigator.mozGetGamepads && navigator.mozGetGamepads()) ||
                   navigator.msGamepads ||
                   navigator.webkitGamepads ||
                   navigator.mozGamepads ||
                   navigator.gamepads;
        };
    }

    // Url操作
    window.URL = window.URL || window[prefix.lowercase + "URL"];

    // 重力感应事件
    window.DeviceMotionEvent = window.DeviceMotionEvent ||
                               window[prefix.lowercase + "DeviceMotionEvent"] ||
                               Function;

    // 获取鼠标锁
    var el = HTMLElement.prototype;
    el.requestPointerLock = el.requestPointerLock ||
                            el[prefix.lowercase + "RequestPointerLock"] ||
                            Function;

    // 退出鼠标锁
    document.exitPointerLock = document.exitPointerLock ||
                               document[prefix.lowercase + "ExitPointerLock"] ||
                                Function;

    // 进入全屏
    el.requestFullscreen = el.requestFullscreen ||
                           el.mozRequestFullScreen ||
                           el[prefix.lowercase + "RequestFullscreen"] ||
                           Function;

    // 退出全屏
    document.exitFullscreen = document.exitFullscreen ||
                              document[prefix.lowercase + "CancelFullScreen"] ||
                              Function;

    // 锁定屏幕方向
    screen.lockOrientation = screen.lockOrientation ||
                             screen[prefix.lowercase + "LockOrientation"] ||
                             Function;

    // 取消锁定屏幕方向
    screen.unlockOrientation = screen.unlockOrientation ||
                               screen[prefix.lowercase + "UnlockOrientation"] ||
                               Function;

    // 音频上下文
    window.AudioContext = window.AudioContext ||
                          window[prefix.lowercase + "AudioContext"];

    // 语音识别
    window.SpeechRecognition = window.SpeechRecognition ||
                               window[prefix.lowercase + "SpeechRecognition"];

    if (!("indexedDB" in window)) {
        // IndexedDB对象
        if ("webkitIndexedDB" in window) {
            window.indexedDB = window.webkitIndexedDB;
            window.IDBKeyRange = window.webkitIDBKeyRange;
            window.IDBTransaction = window.webkitIDBTransaction;
        }
        else if ("mozIndexedDB" in window) {
            window.indexedDB = window.mozIndexedDB;
        }
        else if ("msIndexedDB" in window) {
            window.indexedDB = window.msIndexedDB;
        }
    }

    (function () {
        var lastTime = 0;

        // 获取动画帧
        window.requestAnimationFrame = window.requestAnimationFrame ||
                                       window[prefix.lowercase + "RequestAnimationFrame"] ||
                                       function (callback) { setTimeout(callback, 16.7); };

        // 取消动画帧
        window.cancelAnimationFrame = window.cancelAnimationFrame ||
                                      window[prefix.lowercase + "CancelAnimationFrame"] ||
                                      window[prefix.lowercase + "CancelRequestAnimationFrame"] ||
                                      function (id) { window.clearTimeout(id); };

        if (!("requestAnimationFrame" in window)) {
            window.requestAnimationFrame = function (callback, element) {
                var currTime = new Date().getTime();
                var timeToCall = Math.max(0, 16.7 - (currTime - lastTime));
                var id = window.setTimeout(function () {
                    callback(currTime + timeToCall);
                }, timeToCall);
                lastTime = currTime + timeToCall;
                return id;
            };
        }
        if (!("cancelAnimationFrame" in window)) {
            window.cancelAnimationFrame = function (id) {
                clearTimeout(id);
            };
        }
    }());

})(window, document, Jyo);