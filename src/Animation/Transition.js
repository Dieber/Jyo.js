(function (window, document, Jyo, undefined) {

    Jyo.Transition = function (renderer) {
        /// <summary>转场动画</summary>
        /// <param name="renderer" type="Jyo.Renderer">渲染器对象</param>

        Jyo.Object.call(this);

        this.renderer = renderer;

        /*
            设置过渡用画布
        */
        var osCvs = document.createElement("canvas");
        var tsCvs = document.createElement("canvas");

        // 当前偏移量
        this.currentOffset = 255;

        // 是否正在执行
        this.isRun = false;

        // 是否允许更新
        this.canUpdate = false;

        /*
            设置旧场景图画布
        */
        this.oldScreenCanvas = new Jyo.Xnb();
        this.oldScreenCanvas.object = osCvs;
        this.oldScreenContext = osCvs.getContext("2d");
        this.oldPixelData = null;

        /*
            设置过渡图画布
        */
        this.transitionCanvas = tsCvs;
        this.transitionContext = tsCvs.getContext("2d");

        // 过渡Alpha数组
        this.transitionAlphaArray = null;
    };

    Jyo.Transition.prototype = new Jyo.Object({
        begin: function (img, time, delay) {
            /// <summary>开始转场动画</summary>
            /// <param name="img" type="Jyo.Xnb">图像Xnb对象</param>
            /// <param name="time" type="Number">总时长(毫秒)</param>
            /// <param name="delay" type="Number" optional="true">延迟时长(毫秒)</param>

            var _this = this;
            var renderer = this.renderer;
            var osCvs = this.oldScreenCanvas.object;
            var tsCvx = this.transitionCanvas;

            this.oldPixelData = null;
            this.transitionAlphaArray = null;

            this.canUpdate = false;
            this.currentOffset = 255;
            this.isRun = true;
            this.time = time;

            // 设置画布大小
            osCvs.width = tsCvx.width = renderer.width;
            osCvs.height = tsCvx.height = renderer.height;

            // 绘制预设图
            this.oldScreenContext.drawImage(renderer.canvas, 0, 0);
            this.transitionContext.drawImage(img, 0, 0, renderer.width, renderer.height);

            /* 预先对过渡图进行灰度计算 */
            var pix = this.transitionContext.getImageData(0, 0, renderer.width, renderer.height);
            var iD = pix.data;
            var i = iD.length;
            while ((i -= 4) > 0) {
                iD[i + 3] = iD[i] * 0.3 + iD[i + 1] * 0.59 + iD[i + 2] * 0.11;
            }
            _this.transitionAlphaArray = iD;

            if (typeof delay != "undefined") {
                setTimeout(function () {
                    _this.canUpdate = true;
                }, delay);
            } else {
                _this.canUpdate = true;
            }

            setTimeout(function () {
                _this.fireEvent("begin");
            }, 0);
        },
        draw: function () {
            /// <summary>绘制过渡动画</summary>

            if (!this.isRun) return;

            var renderer = this.renderer;

            if (this.transitionAlphaArray) {
                var osCtx = this.oldScreenContext;
                var tArr = this.transitionAlphaArray;
                var pix = this.oldPixelData;

                if (!pix) {
                    this.oldPixelData = pix = osCtx.getImageData(0, 0, renderer.width, renderer.height);
                }
                var iD = pix.data;

                var i = iD.length;
                while ((i -= 4) > 0) {
                    if (tArr[i + 3] > this.currentOffset) {
                        iD[i + 3] = this.currentOffset;
                    }
                }
                osCtx.putImageData(pix, 0, 0);
            }

            renderer.drawImage(this.oldScreenCanvas, 0, 0);
        },
        update: function (currentTime) {
            /// <summary>更新过渡动画</summary>
            /// <param name="currentTime" type="Number">当前时间</param>

            if (!this.isRun || !this.canUpdate) return;
            if (!this.beginTime) {
                this.beginTime = currentTime;
                return;
            }

            var timeSpan = currentTime - this.beginTime;
            if (timeSpan < this.time) {
                this.currentOffset = 255 - (timeSpan / this.time * 255) | 0;
            } else {
                delete this.beginTime;
                this.canUpdate = false;
                this.isRun = false;

                this.fireEvent("end");
            }
        }
    });

})(window, document, Jyo);