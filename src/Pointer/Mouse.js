(function (window, document, Jyo, undefined) {
    "use strict";

    Jyo.Pointer.processors.push(function (renderer, list) {
        /// <signature>
        /// <summary>鼠标处理器</summary>
        /// <param name="renderer" type="Jyo.Renderer">渲染器</param>
        /// <param name="list" type="Array">指针列表</param>
        /// </signature>

        var _this = this,
            el = renderer.container;

        // 监听鼠标按下事件
        el.addEventListener("mousedown", function (e) {
            var changeList = [];
            var vector2 = { x: 0, y: 0 },
                scaling = renderer.height / el.clientHeight;

            var id = getId(e);

            calcPosition(e, scaling, vector2);
            var object = {
                id: id,
                x: vector2.x,
                y: vector2.y,
                beginTime: Date.now()
            };
            list.push(object);
            changeList.push(object);

            _this.fireEvent("pointerstart", changeList);
        }, false);

        // 监听鼠标移动事件
        el.addEventListener("mousemove", function (e) {
            e.preventDefault();

            var changeList = [];
            var vector2 = { x: 0, y: 0 },
                scaling = renderer.height / el.clientHeight;

            calcPosition(e, scaling, vector2);
            list[0] = {
                id: -4,
                x: vector2.x,
                y: vector2.y,
                beginTime: Date.now()
            };
            changeList.push(list[0]);

            if (!changeList.length) return;
            _this.fireEvent("pointermove", changeList);
        }, false);

        function calcPosition(e, scaling, vector2) {
            /// <summary>计算鼠标坐标</summary>
            /// <param name="e" type="Object">参数对象</param>
            /// <param name="scaling" type="Number">缩放值</param>
            /// <param name="vector2" type="Object">向量对象</param>

            if (el.isPointerLocked) {
                vector2.x = e.movementX || e.mozMovementX || e.webkitMovementX || 0;
                vector2.y = e.movementY || e.mozMovementY || e.webkitMovementY || 0;
                return;
            }

            if (renderer.assign == "Css") {
                scaling = 1 / scaling;
                vector2.x = e.pageX * scaling,
                vector2.y = e.pageY * scaling;
            } else if (renderer._rotate == 90) {
                var br = el.getBoundingClientRect();
                vector2.x = ((e.pageY - br.top) * scaling | 0),
                vector2.y = renderer.height - ((e.pageX - br.left) * scaling | 0);
            } else {
                if (renderer._adaptiveMode == "none" || renderer._adaptiveMode == "fill") {
                    vector2.x = (e.pageX * (renderer.width / el.offsetWidth));
                    vector2.y = (e.pageY * (renderer.height / el.offsetHeight));
                } else {
                    vector2.x = ((e.pageX - el.offsetLeft) * scaling) | 0,
                    vector2.y = (((e.pageY - el.offsetTop) * scaling) | 0);
                }
            }
        }

        // 监听鼠标抬起事件
        el.addEventListener("mouseup", function (e) {
            var changeList = [];

            for (var i = 0; i < list.length; i++) {
                if (list[i].id == getId(e)) {
                    changeList.push(list[i]);
                    list.remove(i);
                    i--;
                }
            }

            if (!changeList.length) return;
            _this.fireEvent("pointerend", changeList);
        }, false);

        // 监听鼠标移出事件
        el.addEventListener("mouseout", function (e) {
            var changeList = [];

            for (var i = 0; i < list.length; i++) {
                if (list[i].id < 0) {
                    changeList.push(list[i]);
                    list.remove(i);
                    i--;
                }
            }

            //if (!changeList.length) return;
            //_this.fireEvent("pointerend", changeList);
        }, false);
    });

    function getId(e) {
        /// <summary>获取鼠标id</summary>
        /// <param name="e" type="MouseEvent">鼠标事件状态</param>
        /// <returns type="Number" />

        if (!+"\v1") {
            switch (e.button) {
                case 1: return -1;// 左键
                case 2: return -3;// 右键
                case 4: return -2;// 中键
            }
        }
        else {
            switch (e.which) {
                case 1: return -1;// 左键
                case 2: return -2;// 中键
                case 3: return -3;// 右键
            }
        }
    }

})(window, document, Jyo);