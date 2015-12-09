(function (window, document, Jyo, undefined) {
    "use strict";

    // iPad需要额外做一些加减法
    var isIpad = navigator.userAgent.indexOf("iPad") >= 0;

    document.addEventListener("touchmove", function (e) {
        // 阻止屏幕滑动

        e.preventDefault();
    }, false);

    document.addEventListener("touchstart", function (e) {
        // 阻止屏幕滑动

        e.preventDefault();
    }, false);

    document.addEventListener("touchend", function (e) {
        // 阻止屏幕滑动

        e.preventDefault();
    }, false);

    Jyo.Pointer.processors.push(function (renderer, list) {
        /// <signature>
        /// <summary>触摸处理器</summary>
        /// <param name="renderer" type="Jyo.Renderer">渲染器</param>
        /// <param name="list" type="Array">指针列表</param>
        /// </signature>

        var _this = this,
            el = renderer.container;

        // 监听触摸按下事件
        el.addEventListener("touchstart", function (e) {
            var changeList = [];
            var vector2 = { x: 0, y: 0 },
                scaling = renderer.height / el.clientHeight,
                ct = e.changedTouches;

            for (var i = 0; i < ct.length; i++) {
                calcPosition(scaling, ct, i, vector2);
                var object = {
                    id: ct[i].identifier,
                    x: vector2.x,
                    y: vector2.y,
                    beginTime: Date.now()
                };
                list.push(object);
                changeList.push(object);
            }

            if (!changeList.length) return;
            _this.fireEvent("pointerstart", changeList);
        }, false);

        // 监听触摸移动事件
        el.addEventListener("touchmove", function (e) {
            e.preventDefault();

            var changeList = [];
            var vector2 = { x: 0, y: 0 },
                scaling = renderer.height / el.clientHeight,
                ct = e.changedTouches;

            for (var i = 0; i < list.length; i++) {
                for (var n = 0; n < ct.length; n++) {
                    calcPosition(scaling, ct, n, vector2);
                    if (ct[n].identifier == list[i].id) {
                        list[i].x = vector2.x,
                        list[i].y = vector2.y;
                        changeList.push(list[i]);
                        break;
                    }
                }
            }

            if (!changeList.length) return;
            _this.fireEvent("pointermove", changeList);
        }, false);

        function calcPosition(scaling, ct, n, vector2) {
            /// <summary>计算触摸坐标</summary>
            /// <param name="scaling" type="Number">缩放值</param>
            /// <param name="ct" type="Array">触摸更改列表</param>
            /// <param name="n" type="Number">当前遍历索引</param>
            /// <param name="vector2" type="Object">向量对象</param>

            if (renderer.assign == "Css") {
                scaling = 1 / scaling;
                vector2.x = ct[n].pageX * scaling,
                vector2.y = ct[n].pageY * scaling;
            } else if (renderer._rotate == 90) {
                var br = el.getBoundingClientRect();
                vector2.x = ((ct[n].pageY - br.top) * scaling | 0) + (isIpad ? 12 : 0),
                vector2.y = renderer.height - ((ct[n].pageX - br.left) * scaling | 0);
            }
            else {
                if (renderer._adaptiveMode == "none" || renderer._adaptiveMode == "fill") {
                    vector2.x = (ct[n].pageX * (renderer.width / el.offsetWidth));
                    vector2.y = (ct[n].pageY * (renderer.height / el.offsetHeight)) + (isIpad ? 10 : 0);
                } else {
                    vector2.x = ((ct[n].pageX - el.offsetLeft) * scaling) | 0,
                    vector2.y = (((ct[n].pageY - el.offsetTop) * scaling) | 0) + (isIpad ? 10 : 0);
                }
            }
        }

        function end(e) {
            /// <summary>结束触摸事件触发函数</summary>
            var changeList = [],
                ct = e.changedTouches;

            for (var i = 0; i < list.length; i++) {
                for (var n = 0; n < ct.length; n++) {
                    if (ct[n].identifier == list[i].id) {
                        changeList.push(list[i]);
                        list.remove(i);
                    }
                }
            }

            if (!changeList.length) return;
            _this.fireEvent("pointerend", changeList);
        }

        // 监听触摸抬起事件
        el.addEventListener("touchend", end, false);

        // 监听触摸取消事件
        el.addEventListener("touchcancel", end, false);
    });

})(window, document, Jyo);