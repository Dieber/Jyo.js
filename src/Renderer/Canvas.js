(function (window, document, Jyo, undefined) {
    "use strict";

    Jyo.Renderer.Canvas = function () {
        /// <summary>Canvas渲染器</summary>
        /// <field name="context" type="CanvasRenderingContext2D">2D画布渲染上下文</field>

        Jyo.Object.call(this);

        var _this = this;

        this.context = this.canvas.getContext("2d");

        // 是否开始变换
        this.isBeginTransform = false;

        // 变换参数
        this.convertArrs = {
            rotate: null,
            scaleX: 1,
            scaleY: 1
        };

        this.backCanvas = document.createElement("canvas");
        this.backContext = this.backCanvas.getContext("2d");
    };

    // 要创建的标签名
    Jyo.Renderer.Canvas.tagName = "canvas";
    // 技术名称
    Jyo.Renderer.Canvas.assign = Jyo.Renderer.Canvas.prototype.assign = "Canvas";
    Jyo.Renderer.Canvas.isSupport = function () {
        /// <summary>检测是否支持该渲染器</summary>
        /// <returns type="Boolean" />

        return document.createElement("canvas").getContext !== undefined;
    };

    var tempCanvas = document.createElement("canvas");
    var tempContext = tempCanvas.getContext("2d");

    Jyo.Renderer.Canvas.prototype = Object.create(Jyo.Object.prototype);
    Jyo.Renderer.Canvas.prototype.constructor = Jyo.Renderer.Canvas;

    var canvasFns = {
        clear: function () {
            /// <summary>清空画布</summary>

            this.context.clearRect(0, 0, this.width, this.height);

            if (typeof this.backBuffer != "undefined") {
                this.backContext.putImageData(this.backBuffer, 0, 0);
                // 将后台画布(3D专用)绘制在屏幕上
                this.context.drawImage(this.backCanvas, 0, 0);
                // 清空后台画布
                this.backContext.clearRect(0, 0, this.width, this.height);
            }
        },
        beginTransform: function (rotate, scaleX, scaleY) {
            /// <summary>开始变换</summary>
            /// <param name="rotate" type="Number" optional="true">旋转值</param>
            /// <param name="scaleX" type="Number" optional="true">X缩放值</param>
            /// <param name="scaleY" type="Number" optional="true">Y缩放值</param>

            this.isBeginTransform = true;
            this.convertArrs.scaleX = scaleX || 1;
            this.convertArrs.scaleY = scaleY || 1;
            this.convertArrs.rotate = rotate || 0;
        },
        endTransform: function () {
            /// <summary>结束变换</summary>

            this.isBeginTransform = false;
            this.convertArrs.scaleX = 1;
            this.convertArrs.scaleY = 1;
            this.convertArrs.rotate = 0;
        },
        useTransform: function (x, y, w, h, callback, canRun) {
            /// <summary>使用变换绘制</summary>
            /// <param name="x" type="Number">X位置</param>
            /// <param name="y" type="Number">Y位置</param>
            /// <param name="w" type="Number">宽度</param>
            /// <param name="h" type="Number">高度</param>
            /// <param name="callback" type="Function">回调函数</param>

            var t = this.convertArrs,
                   ctx = this.context;

            if (!canRun && this.isBeginTransform) {
                throw "只有drawImage函数可以使用变换";
            }

            if (!this.isBeginTransform || (!x && !y && !w && !h)) {
                callback.call(this);
            } else {
                ctx.translate(x + w * 0.5, y + h * 0.5);
                ctx.scale(t.scaleX, t.scaleY);
                t.rotate && ctx.rotate(t.rotate);
                callback.call(this);
                t.rotate && ctx.rotate(-t.rotate);
                ctx.scale(1 / t.scaleX, 1 / t.scaleY);
                ctx.translate(-(x + w * 0.5), -(y + h * 0.5));
            }
        },
        fillRect: Jyo.overload().
                  add("Jyo.Rectangle", function (rect) {
                      /// <summary>绘制实心矩形</summary>
                      /// <param name="rect" type="Jyo.Rectangle">矩形对象</param>

                      this.fillRect(rect.x, rect.y, rect.width, rect.height, "");
                  }).
                  add("Number, Number, Number, Number", function (x, y, width, height) {
                      /// <summary>绘制实心矩形</summary>
                      /// <param name="x" type="Number">起始X坐标</param>
                      /// <param name="y" type="Number">起始Y坐标</param>
                      /// <param name="width" type="Number">矩形宽度</param>
                      /// <param name="height" type="Number">矩形高度</param>

                      this.fillRect(x, y, width, height, "");
                  }).
                  add("Jyo.Rectangle, Jyo.Color", function (rect, color) {
                      /// <summary>绘制实心矩形</summary>
                      /// <param name="rect" type="Jyo.Rectangle">矩形对象</param>
                      /// <param name="color" type="Jyo.Color">颜色对象</param>

                      this.fillRect(rect.x, rect.y, rect.width, rect.height, color.toRgba());
                  }).
                  add("Number, Number, Number, Number, Jyo.Color", function (x, y, width, height, color) {
                      /// <summary>绘制实心矩形</summary>
                      /// <param name="x" type="Number">起始X坐标</param>
                      /// <param name="y" type="Number">起始Y坐标</param>
                      /// <param name="width" type="Number">矩形宽度</param>
                      /// <param name="height" type="Number">矩形高度</param>
                      /// <param name="color" type="Jyo.Color">颜色对象</param>

                      this.fillRect(x, y, width, height, color.toRgba());
                  }).
                  add("Jyo.Rectangle, String", function (rect, colorStr) {
                      /// <summary>绘制实心矩形</summary>
                      /// <param name="rect" type="Jyo.Rectangle">矩形对象</param>
                      /// <param name="colorStr" type="String">颜色字符串值</param>

                      this.fillRect(rect.x, rect.y, rect.width, rect.height, colorStr);
                  }).
                  add("Number, Number, Number, Number, String", function (x, y, width, height, colorStr) {
                      /// <summary>绘制实心矩形</summary>
                      /// <param name="x" type="Number">起始X坐标</param>
                      /// <param name="y" type="Number">起始Y坐标</param>
                      /// <param name="width" type="Number">矩形宽度</param>
                      /// <param name="height" type="Number">矩形高度</param>
                      /// <param name="colorStr" type="String">颜色字符串值</param>

                      var ctx = this.context;
                      this.useTransform(x, y, width, height, function () {
                          ctx = this.context;
                          ctx.fillStyle = colorStr;
                          if (this.isBeginTransform) ctx.fillRect(-0.5 * width, -0.5 * height, width, height);
                          else ctx.fillRect(x, y, width, height);
                      });
                  }),
        drawRect: Jyo.overload().
                  add("Jyo.Rectangle", function (rect) {
                      /// <summary>绘制空心矩形</summary>
                      /// <param name="rect" type="Jyo.Rectangle">矩形对象</param>
                      /// <param name="color" type="Jyo.Color">颜色对象</param>

                      this.drawRect(rect.x, rect.y, rect.width, rect.height, Jyo.Colors.black.toRgba(), 1);
                  }).
                  add("Jyo.Rectangle, Jyo.Color", function (rect, color) {
                      /// <summary>绘制空心矩形</summary>
                      /// <param name="rect" type="Jyo.Rectangle">矩形对象</param>
                      /// <param name="color" type="Jyo.Color">颜色对象</param>

                      this.drawRect(rect.x, rect.y, rect.width, rect.height, color.toRgba(), 1);
                  }).
                  add("Number, Number, Number, Number, Jyo.Color", function (x, y, width, height, color) {
                      /// <summary>绘制空心矩形</summary>
                      /// <param name="x" type="Number">起始X坐标</param>
                      /// <param name="y" type="Number">起始Y坐标</param>
                      /// <param name="width" type="Number">矩形宽度</param>
                      /// <param name="height" type="Number">矩形高度</param>
                      /// <param name="color" type="Jyo.Color">颜色对象</param>

                      this.drawRect(x, y, width, height, color.toRgba(), 1);
                  }).
                  add("Jyo.Rectangle, String", function (rect, colorStr) {
                      /// <summary>绘制空心矩形</summary>
                      /// <param name="rect" type="Jyo.Rectangle">矩形对象</param>
                      /// <param name="colorStr" type="String">颜色字符串值</param>

                      this.drawRect(rect.x, rect.y, rect.width, rect.height, colorStr, 1);
                  }).
                  add("Number, Number, Number, Number, String", function (x, y, width, height, colorStr) {
                      /// <summary>绘制空心矩形</summary>
                      /// <param name="x" type="Number">起始X坐标</param>
                      /// <param name="y" type="Number">起始Y坐标</param>
                      /// <param name="width" type="Number">矩形宽度</param>
                      /// <param name="height" type="Number">矩形高度</param>
                      /// <param name="colorStr" type="String">颜色字符串值</param>

                      this.drawRect(x, y, width, height, colorStr, 1);
                  }).
                  add("Jyo.Rectangle, Jyo.Color, Number", function (rect, color, lineWidth) {
                      /// <summary>绘制空心矩形</summary>
                      /// <param name="rect" type="Jyo.Rectangle">矩形对象</param>
                      /// <param name="color" type="Jyo.Color">颜色对象</param>
                      /// <param name="lineWidth" type="Number">线条宽度</param>

                      this.drawRect(rect.x, rect.y, rect.width, rect.height, color.toRgba(), lineWidth);
                  }).
                  add("Number, Number, Number, Number, Jyo.Color, Number", function (x, y, width, height, color, lineWidth) {
                      /// <summary>绘制空心矩形</summary>
                      /// <param name="x" type="Number">起始X坐标</param>
                      /// <param name="y" type="Number">起始Y坐标</param>
                      /// <param name="width" type="Number">矩形宽度</param>
                      /// <param name="height" type="Number">矩形高度</param>
                      /// <param name="color" type="Jyo.Color">颜色对象</param>
                      /// <param name="lineWidth" type="Number">线条宽度</param>

                      this.drawRect(x, y, width, height, color.toRgba(), lineWidth);
                  }).
                  add("Jyo.Rectangle, String, Number", function (rect, colorStr, lineWidth) {
                      /// <summary>绘制空心矩形</summary>
                      /// <param name="rect" type="Jyo.Rectangle">矩形对象</param>
                      /// <param name="colorStr" type="String">颜色字符串值</param>
                      /// <param name="lineWidth" type="Number">线条宽度</param>

                      this.drawRect(rect.x, rect.y, rect.width, rect.height, colorStr, lineWidth);
                  }).
                  add("Number, Number, Number, Number, String, Number", function (x, y, width, height, colorStr, lineWidth) {
                      /// <summary>绘制空心矩形</summary>
                      /// <param name="x" type="Number">起始X坐标</param>
                      /// <param name="y" type="Number">起始Y坐标</param>
                      /// <param name="width" type="Number">矩形宽度</param>
                      /// <param name="height" type="Number">矩形高度</param>
                      /// <param name="colorStr" type="String">颜色字符串值</param>
                      /// <param name="lineWidth" type="Number">线条宽度</param>

                      var ctx = this.context;
                      this.useTransform(x, y, width, height, function () {
                          ctx.lineWidth = lineWidth;
                          ctx.strokeStyle = colorStr;
                          if (this.isBeginTransform) {
                              width = width - lineWidth,
                              height = height - lineWidth;
                              ctx.strokeRect(-0.5 * width, -0.5 * height, width, height);
                          }
                          else ctx.strokeRect(x + lineWidth / 2, y + lineWidth / 2, width - lineWidth, height - lineWidth);
                      });
                  }),
        fillRoundRect: Jyo.overload().
                       add("Jyo.Rectangle, Number", function (rect, radius) {
                           /// <summary>绘制实心圆角矩形</summary>
                           /// <param name="rect" type="Jyo.Rectangle">矩形对象</param>
                           /// <param name="radius" type="Number">圆角半径</param>

                           this.fillRoundRect(rect.x, rect.y, rect.width, rect.height, radius, "");
                       }).
                       add("Jyo.Rectangle, Number, String", function (rect, radius, colorStr) {
                           /// <summary>绘制实心圆角矩形</summary>
                           /// <param name="rect" type="Jyo.Rectangle">矩形对象</param>
                           /// <param name="radius" type="Number">圆角半径</param>
                           /// <param name="colorStr" type="String">颜色字符串值</param>

                           this.fillRoundRect(rect.x, rect.y, rect.width, rect.height, radius, colorStr);
                       }).
                       add("Jyo.Rectangle, Number, Jyo.Color", function (rect, radius, color) {
                           /// <summary>绘制实心圆角矩形</summary>
                           /// <param name="rect" type="Jyo.Rectangle">矩形对象</param>
                           /// <param name="radius" type="Number">圆角半径</param>
                           /// <param name="color" type="Jyo.Color">颜色对象</param>

                           this.fillRoundRect(rect.x, rect.y, rect.width, rect.height, radius, color.toRgba());
                       }).
                       add("Number, Number, Number, Number, Number", function (x, y, width, height, radius) {
                           /// <summary>绘制实心圆角矩形</summary>
                           /// <param name="x" type="Number">起始X坐标</param>
                           /// <param name="y" type="Number">起始Y坐标</param>
                           /// <param name="width" type="Number">矩形宽度</param>
                           /// <param name="height" type="Number">矩形高度</param>
                           /// <param name="radius" type="Number">圆角半径</param>

                           this.fillRoundRect(x, y, width, height, radius, "");
                       }).
                       add("Number, Number, Number, Number, Number, Jyo.Color", function (x, y, width, height, radius, color) {
                           /// <summary>绘制实心圆角矩形</summary>
                           /// <param name="x" type="Number">起始X坐标</param>
                           /// <param name="y" type="Number">起始Y坐标</param>
                           /// <param name="width" type="Number">矩形宽度</param>
                           /// <param name="height" type="Number">矩形高度</param>
                           /// <param name="radius" type="Number">圆角半径</param>
                           /// <param name="color" type="Jyo.Color">颜色对象</param>

                           this.fillRoundRect(x, y, width, height, radius, color.toRgba());
                       }).
                       add("Number, Number, Number, Number, Number, String", function (x, y, width, height, radius, colorStr) {
                           /// <summary>绘制实心矩形</summary>
                           /// <param name="x" type="Number">起始X坐标</param>
                           /// <param name="y" type="Number">起始Y坐标</param>
                           /// <param name="width" type="Number">矩形宽度</param>
                           /// <param name="height" type="Number">矩形高度</param>
                           /// <param name="radius" type="Number">圆角半径</param>
                           /// <param name="colorStr" type="String">颜色字符串值</param>

                           var ps = [];

                           ps.push(x, y + radius);
                           ps = ps.concat(Math.getBezierCurvePoints(x, y + height - radius, x, y + height, x + radius, y + height));
                           ps = ps.concat(Math.getBezierCurvePoints(x + width - radius, y + height, x + width, y + height, x + width, y + height - radius));
                           ps = ps.concat(Math.getBezierCurvePoints(x + width, y + radius, x + width, y, x + width - radius, y));
                           ps = ps.concat(Math.getBezierCurvePoints(x + radius, y, x, y, x, y + radius));

                           this.fillPolygon(ps, colorStr || "#000000");
                       }),
        drawRoundRect: Jyo.overload().
                       add("Jyo.Rectangle, Number", function (rect, radius) {
                           /// <summary>绘制实心圆角矩形</summary>
                           /// <param name="rect" type="Jyo.Rectangle">矩形对象</param>
                           /// <param name="radius" type="Number">圆角半径</param>

                           this.drawRoundRect(rect.x, rect.y, rect.width, rect.height, radius, "", 1);
                       }).
                       add("Jyo.Rectangle, Number, Number", function (rect, radius, lineWidth) {
                           /// <summary>绘制实心圆角矩形</summary>
                           /// <param name="rect" type="Jyo.Rectangle">矩形对象</param>
                           /// <param name="radius" type="Number">圆角半径</param>
                           /// <param name="lineWidth" type="Number">线段宽度</param>

                           this.drawRoundRect(rect.x, rect.y, rect.width, rect.height, radius, "", lineWidth);
                       }).
                       add("Jyo.Rectangle, Number, String", function (rect, radius, colorStr) {
                           /// <summary>绘制实心圆角矩形</summary>
                           /// <param name="rect" type="Jyo.Rectangle">矩形对象</param>
                           /// <param name="radius" type="Number">圆角半径</param>
                           /// <param name="colorStr" type="String">颜色字符串值</param>

                           this.drawRoundRect(rect.x, rect.y, rect.width, rect.height, radius, colorStr, 1);
                       }).
                       add("Jyo.Rectangle, Number, String, Number", function (rect, radius, colorStr, lineWidth) {
                           /// <summary>绘制实心圆角矩形</summary>
                           /// <param name="rect" type="Jyo.Rectangle">矩形对象</param>
                           /// <param name="radius" type="Number">圆角半径</param>
                           /// <param name="colorStr" type="String">颜色字符串值</param>
                           /// <param name="lineWidth" type="Number">线段宽度</param>

                           this.drawRoundRect(rect.x, rect.y, rect.width, rect.height, radius, colorStr, lineWidth);
                       }).
                       add("Jyo.Rectangle, Number, Jyo.Color", function (rect, radius, color) {
                           /// <summary>绘制实心圆角矩形</summary>
                           /// <param name="rect" type="Jyo.Rectangle">矩形对象</param>
                           /// <param name="radius" type="Number">圆角半径</param>
                           /// <param name="color" type="Jyo.Color">颜色对象</param>

                           this.drawRoundRect(rect.x, rect.y, rect.width, rect.height, radius, color.toRgba(), 1);
                       }).
                       add("Jyo.Rectangle, Number, Jyo.Color, Number", function (rect, radius, color, lineWidth) {
                           /// <summary>绘制实心圆角矩形</summary>
                           /// <param name="rect" type="Jyo.Rectangle">矩形对象</param>
                           /// <param name="radius" type="Number">圆角半径</param>
                           /// <param name="color" type="Jyo.Color">颜色对象</param>
                           /// <param name="lineWidth" type="Number">线段宽度</param>

                           this.drawRoundRect(rect.x, rect.y, rect.width, rect.height, radius, color.toRgba(), lineWidth);
                       }).
                       add("Number, Number, Number, Number, Number", function (x, y, width, height, radius) {
                           /// <summary>绘制实心圆角矩形</summary>
                           /// <param name="x" type="Number">起始X坐标</param>
                           /// <param name="y" type="Number">起始Y坐标</param>
                           /// <param name="width" type="Number">矩形宽度</param>
                           /// <param name="height" type="Number">矩形高度</param>
                           /// <param name="radius" type="Number">圆角半径</param>

                           this.drawRoundRect(x, y, width, height, radius, "", 1);
                       }).
                       add("Number, Number, Number, Number, Number, Number", function (x, y, width, height, radius, lineWidth) {
                           /// <summary>绘制实心圆角矩形</summary>
                           /// <param name="x" type="Number">起始X坐标</param>
                           /// <param name="y" type="Number">起始Y坐标</param>
                           /// <param name="width" type="Number">矩形宽度</param>
                           /// <param name="height" type="Number">矩形高度</param>
                           /// <param name="radius" type="Number">圆角半径</param>
                           /// <param name="lineWidth" type="Number">线段宽度</param>

                           this.drawRoundRect(x, y, width, height, radius, "", lineWidth);
                       }).
                       add("Number, Number, Number, Number, Number, Jyo.Color", function (x, y, width, height, radius, color) {
                           /// <summary>绘制实心圆角矩形</summary>
                           /// <param name="x" type="Number">起始X坐标</param>
                           /// <param name="y" type="Number">起始Y坐标</param>
                           /// <param name="width" type="Number">矩形宽度</param>
                           /// <param name="height" type="Number">矩形高度</param>
                           /// <param name="radius" type="Number">圆角半径</param>
                           /// <param name="color" type="Jyo.Color">颜色对象</param>

                           this.drawRoundRect(x, y, width, height, radius, color.toRgba(), 1);
                       }).
                       add("Number, Number, Number, Number, Number, Jyo.Color, Number", function (x, y, width, height, radius, color, lineWidth) {
                           /// <summary>绘制实心圆角矩形</summary>
                           /// <param name="x" type="Number">起始X坐标</param>
                           /// <param name="y" type="Number">起始Y坐标</param>
                           /// <param name="width" type="Number">矩形宽度</param>
                           /// <param name="height" type="Number">矩形高度</param>
                           /// <param name="radius" type="Number">圆角半径</param>
                           /// <param name="color" type="Jyo.Color">颜色对象</param>
                           /// <param name="lineWidth" type="Number">线段宽度</param>

                           this.drawRoundRect(x, y, width, height, radius, color.toRgba(), lineWidth);
                       }).
                       add("Number, Number, Number, Number, Number, String", function (x, y, width, height, radius, colorStr) {
                           /// <summary>绘制实心圆角矩形</summary>
                           /// <param name="x" type="Number">起始X坐标</param>
                           /// <param name="y" type="Number">起始Y坐标</param>
                           /// <param name="width" type="Number">矩形宽度</param>
                           /// <param name="height" type="Number">矩形高度</param>
                           /// <param name="radius" type="Number">圆角半径</param>
                           /// <param name="colorStr" type="String">颜色字符串值</param>

                           this.drawRoundRect(x, y, width, height, radius, colorStr, 1);
                       }).
                       add("Number, Number, Number, Number, Number, String, Number", function (x, y, width, height, radius, colorStr, lineWidth) {
                           /// <summary>绘制实心圆角矩形</summary>
                           /// <param name="x" type="Number">起始X坐标</param>
                           /// <param name="y" type="Number">起始Y坐标</param>
                           /// <param name="width" type="Number">矩形宽度</param>
                           /// <param name="height" type="Number">矩形高度</param>
                           /// <param name="radius" type="Number">圆角半径</param>
                           /// <param name="colorStr" type="String">颜色字符串值</param>
                           /// <param name="lineWidth" type="Number">线段宽度</param>

                           var ps = [];

                           ps.push(x, y + radius);
                           ps = ps.concat(Math.getBezierCurvePoints(x, y + height - radius, x, y + height, x + radius, y + height));
                           ps = ps.concat(Math.getBezierCurvePoints(x + width - radius, y + height, x + width, y + height, x + width, y + height - radius));
                           ps = ps.concat(Math.getBezierCurvePoints(x + width, y + radius, x + width, y, x + width - radius, y));
                           ps = ps.concat(Math.getBezierCurvePoints(x + radius, y, x, y, x, y + radius));

                           this.drawPolygon(ps, colorStr || "#000000", lineWidth);
                       }),
        drawImage: Jyo.overload().
                   add("any, Number, Number", function (element, x, y) {
                       /// <summary>绘制图象</summary>
                       /// <param name="element" type="Object">要绘制的元素</param>
                       /// <param name="x" type="Number">起始X坐标</param>
                       /// <param name="y" type="Number">起始Y坐标</param>

                       element = element.object || element;
                       var w = element.width,
                              h = element.height;
                       this.useTransform(x, y, element.width, element.height, function () {
                           if (this.isBeginTransform) {
                               x = -0.5 * w;
                               y = -0.5 * h;
                           }
                           this.context.drawImage(element, x, y);
                       }, !0);
                   }).
                   add("any, Number, Number, Number", function (element, x, y, alpha) {
                       /// <summary>绘制图象</summary>
                       /// <param name="element" type="Object">要绘制的元素</param>
                       /// <param name="x" type="Number">起始X坐标</param>
                       /// <param name="y" type="Number">起始Y坐标</param>
                       /// <param name="alpha" type="Number">Alpha值(取值0-1之间)</param>

                       var ctx = this.context;
                       ctx.globalAlpha = Math.clamp(alpha, 0, 1);
                       this.drawImage(element, x, y);
                       ctx.globalAlpha = 1;
                   }).
                   add("any, Jyo.Rectangle", function (element, rect) {
                       /// <summary>绘制图象</summary>
                       /// <param name="element" type="Object">要绘制的元素</param>
                       /// <param name="rect" type="Jyo.Rectangle">矩形对象</param>

                       this.drawImage(element, rect.x, rect.y, rect.width, rect.height);
                   }).
                   add("any, Jyo.Rectangle, Number", function (element, rect, alpha) {
                       /// <summary>绘制图象</summary>
                       /// <param name="element" type="Object">要绘制的元素</param>
                       /// <param name="rect" type="Jyo.Rectangle">矩形对象</param>
                       /// <param name="alpha" type="Number">Alpha值(取值0-1之间)</param>

                       var ctx = this.context;
                       ctx.globalAlpha = Math.clamp(alpha, 0, 1);
                       this.drawImage(element, rect.x, rect.y, rect.width, rect.height);
                       ctx.globalAlpha = 1;
                   }).
                   add("any, Jyo.Rectangle, Jyo.Rectangle", function (element, rect, crect) {
                       /// <summary>绘制图象</summary>
                       /// <param name="element" type="Object">要绘制的元素</param>
                       /// <param name="rect" type="Jyo.Rectangle">矩形对象</param>
                       /// <param name="crect" type="Jyo.Rectangle">剪裁矩形对象</param>

                       this.drawImage(element, rect.x, rect.y, rect.width, rect.height, crect.x, crect.y, crect.width, crect.height);
                   }).
                   add("any, Jyo.Rectangle, Jyo.Rectangle, Number ", function (element, rect, crect, alpha) {
                       /// <summary>绘制图象</summary>
                       /// <param name="element" type="Object">要绘制的元素</param>
                       /// <param name="rect" type="Jyo.Rectangle">矩形对象</param>
                       /// <param name="crect" type="Jyo.Rectangle">剪裁矩形对象</param>
                       /// <param name="alpha" type="Number">Alpha值(取值0-1之间)</param>

                       var ctx = this.context;
                       ctx.globalAlpha = Math.clamp(alpha, 0, 1);
                       this.drawImage(element, rect.x, rect.y, rect.width, rect.height, crect.x, crect.y, crect.width, crect.height);
                       ctx.globalAlpha = 1;
                   }).
                   add("any, Number, Number, Number, Number", function (element, x, y, width, height) {
                       /// <summary>绘制图象</summary>
                       /// <param name="element" type="Object">要绘制的元素</param>
                       /// <param name="x" type="Number">起始X坐标</param>
                       /// <param name="y" type="Number">起始Y坐标</param>
                       /// <param name="width" type="Number">图像宽度</param>
                       /// <param name="height" type="Number">图像高度</param>

                       element = element.object || element;
                       this.useTransform(x, y, width, height, function () {
                           if (this.isBeginTransform) {
                               x = -0.5 * width;
                               y = -0.5 * height;
                           }
                           this.context.drawImage(element, x, y, width, height);
                       }, !0);
                   }).
                   add("any, Number, Number, Number, Number, Number", function (element, x, y, width, height, alpha) {
                       /// <summary>绘制图象</summary>
                       /// <param name="element" type="Object">要绘制的元素</param>
                       /// <param name="x" type="Number">起始X坐标</param>
                       /// <param name="y" type="Number">起始Y坐标</param>
                       /// <param name="width" type="Number">图像宽度</param>
                       /// <param name="height" type="Number">图像高度</param>
                       /// <param name="alpha" type="Number">Alpha值(取值0-1之间)</param>

                       var ctx = this.context;
                       ctx.globalAlpha = Math.clamp(alpha, 0, 1);
                       this.drawImage(element, x, y, width, height);
                       ctx.globalAlpha = 1;
                   }).
                   add("any, Number, Number, Number, Number, Jyo.Rectangle", function (element, x, y, width, height, crect) {
                       /// <summary>绘制图象</summary>
                       /// <param name="element" type="Object">要绘制的元素</param>
                       /// <param name="x" type="Number">起始X坐标</param>
                       /// <param name="y" type="Number">起始Y坐标</param>
                       /// <param name="width" type="Number">图像宽度</param>
                       /// <param name="height" type="Number">图像高度</param>
                       /// <param name="crect" type="Jyo.Rectangle">剪裁矩形对象</param>

                       this.drawImage(element, x, y, width, height, crect.x, crect.y, crect.width, crect.height);
                   }).
                   add("any, Number, Number, Number, Number, Jyo.Rectangle, Number", function (element, x, y, width, height, crect, alpha) {
                       /// <summary>绘制图象</summary>
                       /// <param name="element" type="Object">要绘制的元素</param>
                       /// <param name="x" type="Number">起始X坐标</param>
                       /// <param name="y" type="Number">起始Y坐标</param>
                       /// <param name="width" type="Number">图像宽度</param>
                       /// <param name="height" type="Number">图像高度</param>
                       /// <param name="crect" type="Jyo.Rectangle">剪裁矩形对象</param>
                       /// <param name="alpha" type="Number">Alpha值(取值0-1之间)</param>

                       var ctx = this.context;
                       ctx.globalAlpha = Math.clamp(alpha, 0, 1);
                       this.drawImage(element, x, y, width, height, crect.x, crect.y, crect.width, crect.height);
                       ctx.globalAlpha = 1;
                   }).
                   add("any, Jyo.Rectangle, Number, Number, Number, Number", function (element, rect, cx, cy, cwidth, cheight) {
                       /// <summary>绘制图象</summary>
                       /// <param name="element" type="Object">要绘制的元素</param>
                       /// <param name="rect" type="Jyo.Rectangle">矩形对象</param>
                       /// <param name="cx" type="Number">在原图坐标上进行剪裁的起始X坐标</param>
                       /// <param name="cy" type="Number">在原图坐标上进行剪裁的起始Y坐标</param>
                       /// <param name="cwidth" type="Number">在原图坐标上进行剪裁的图像宽度</param>
                       /// <param name="cheight" type="Number">在原图坐标上进行剪裁的图像高度</param>

                       this.drawImage(element, rect.x, rect.y, rect.width, rect.height, cx, cy, cwidth, cheight);
                   }).
                   add("any, Jyo.Rectangle, Number, Number, Number, Number, Number", function (element, rect, cx, cy, cwidth, cheight, alpha) {
                       /// <summary>绘制图象</summary>
                       /// <param name="element" type="Object">要绘制的元素</param>
                       /// <param name="rect" type="Jyo.Rectangle">矩形对象</param>
                       /// <param name="cx" type="Number">在原图坐标上进行剪裁的起始X坐标</param>
                       /// <param name="cy" type="Number">在原图坐标上进行剪裁的起始Y坐标</param>
                       /// <param name="cwidth" type="Number">在原图坐标上进行剪裁的图像宽度</param>
                       /// <param name="cheight" type="Number">在原图坐标上进行剪裁的图像高度</param>
                       /// <param name="alpha" type="Number">Alpha值(取值0-1之间)</param>

                       var ctx = this.context;
                       ctx.globalAlpha = Math.clamp(alpha, 0, 1);
                       this.drawImage(element, rect.x, rect.y, rect.width, rect.height, cx, cy, cwidth, cheight);
                       ctx.globalAlpha = 1;
                   }).
                   add("any, Number, Number, Number, Number, Number, Number, Number, Number", function (element, x, y, width, height, cx, cy, cwidth, cheight) {
                       /// <summary>绘制图象</summary>
                       /// <param name="element" type="Object">要绘制的元素</param>
                       /// <param name="x" type="Number">起始X坐标</param>
                       /// <param name="y" type="Number">起始Y坐标</param>
                       /// <param name="width" type="Number">图像宽度</param>
                       /// <param name="height" type="Number">图像高度</param>
                       /// <param name="cx" type="Number">在原图坐标上进行剪裁的起始X坐标</param>
                       /// <param name="cy" type="Number">在原图坐标上进行剪裁的起始Y坐标</param>
                       /// <param name="cwidth" type="Number">在原图坐标上进行剪裁的图像宽度</param>
                       /// <param name="cheight" type="Number">在原图坐标上进行剪裁的图像高度</param>

                       element = element.object || element;
                       this.useTransform(x, y, width, height, function () {
                           if (this.isBeginTransform) {
                               x = -0.5 * width;
                               y = -0.5 * height;
                           }
                           this.context.drawImage(element, cx, cy, cwidth, cheight, x, y, width, height);
                       }, !0);
                   }).
                   add("any, Number, Number, Number, Number, Number, Number, Number, Number, Number", function (element, x, y, width, height, cx, cy, cwidth, cheight, alpha) {
                       /// <summary>绘制图象</summary>
                       /// <param name="element" type="Object">要绘制的元素</param>
                       /// <param name="x" type="Number">起始X坐标</param>
                       /// <param name="y" type="Number">起始Y坐标</param>
                       /// <param name="width" type="Number">图像宽度</param>
                       /// <param name="height" type="Number">图像高度</param>
                       /// <param name="cx" type="Number">在原图坐标上进行剪裁的起始X坐标</param>
                       /// <param name="cy" type="Number">在原图坐标上进行剪裁的起始Y坐标</param>
                       /// <param name="cwidth" type="Number">在原图坐标上进行剪裁的图像宽度</param>
                       /// <param name="cheight" type="Number">在原图坐标上进行剪裁的图像高度</param>
                       /// <param name="alpha" type="Number">Alpha值(取值0-1之间)</param>

                       var ctx = this.context;
                       ctx.globalAlpha = Math.clamp(alpha, 0, 1);
                       this.drawImage(element, x, y, width, height, cx, cy, cwidth, cheight);
                       ctx.globalAlpha = 1;
                   }),
        drawText: Jyo.overload().
                  add("any, Number, Number", function (str, x, y) {
                      /// <summary>绘制文字</summary>
                      /// <param name="str" type="String">要显示的文字</param>
                      /// <param name="x" type="Number">起始X坐标</param>
                      /// <param name="y" type="Number">起始Y坐标</param>

                      this.drawText(str, x, y, "", "");
                  }).
                  add("any, Number, Number, Jyo.Color", function (str, x, y, color) {
                      /// <summary>绘制文字</summary>
                      /// <param name="str" type="String">要显示的文字</param>
                      /// <param name="x" type="Number">起始X坐标</param>
                      /// <param name="y" type="Number">起始Y坐标</param>
                      /// <param name="color" type="Jyo.Color">颜色对象</param>

                      this.drawText(str, x, y, color.toRgba(), "");
                  }).
                  add("any, Number, Number, String", function (str, x, y, colorStr) {
                      /// <summary>绘制文字</summary>
                      /// <param name="str" type="String">要显示的文字</param>
                      /// <param name="x" type="Number">起始X坐标</param>
                      /// <param name="y" type="Number">起始Y坐标</param>
                      /// <param name="colorStr" type="String">颜色字符串值</param>

                      this.drawText(str, x, y, colorStr, "");
                  }).
                  add("any, Number, Number, Jyo.Color, String", function (str, x, y, color, font) {
                      /// <summary>绘制文字</summary>
                      /// <param name="str" type="String">要显示的文字</param>
                      /// <param name="x" type="Number">起始X坐标</param>
                      /// <param name="y" type="Number">起始Y坐标</param>
                      /// <param name="color" type="Jyo.Color">颜色对象</param>
                      /// <param name="font" type="String">字体字符串值</param>

                      this.drawText(str, x, y, color.toRgba(), font);
                  }).
                  add("any, Number, Number, String, String", function (str, x, y, colorStr, font) {
                      /// <summary>绘制文字</summary>
                      /// <param name="str" type="String">要显示的文字</param>
                      /// <param name="x" type="Number">起始X坐标</param>
                      /// <param name="y" type="Number">起始Y坐标</param>
                      /// <param name="colorStr" type="String">颜色字符串值</param>
                      /// <param name="font" type="String">字体字符串值</param>

                      var ctx = this.context;
                      ctx.fillStyle = colorStr || "#000000";
                      ctx.font = font || "14px Arial";

                      var strList = (str + "").split(/\r\n|\n|\r/ig);
                      var fontSize = this.getTextSize(strList[0], ctx.font);

                      this.useTransform(x, y, fontSize.width, fontSize.height, function () {
                          for (var i = 0; i < strList.length; i++) {
                              ctx.fillText(strList[i], x, y + fontSize.height * (i + 0.76));
                          }
                      });
                  }),
        drawLine: Jyo.overload().
                  add("Number, Number, Number, Number", function (x1, y1, x2, y2) {
                      /// <summary>绘制线段</summary>
                      /// <param name="x1" type="Number">起始X坐标</param>
                      /// <param name="y1" type="Number">起始Y坐标</param>
                      /// <param name="x2" type="Number">结束X坐标</param>
                      /// <param name="y2" type="Number">结束Y坐标</param>

                      this.drawLine(x1, y1, x2, y2, "", 1);
                  }).
                  add("Number, Number, Number, Number, Jyo.Color", function (x1, y1, x2, y2, color) {
                      /// <summary>绘制线段</summary>
                      /// <param name="x1" type="Number">起始X坐标</param>
                      /// <param name="y1" type="Number">起始Y坐标</param>
                      /// <param name="x2" type="Number">结束X坐标</param>
                      /// <param name="y2" type="Number">结束Y坐标</param>
                      /// <param name="color" type="Jyo.Color">颜色对象</param>

                      this.drawLine(x1, y1, x2, y2, color.toRgba(), 1);
                  }).
                  add("Number, Number, Number, Number, String", function (x1, y1, x2, y2, colorStr) {
                      /// <summary>绘制线段</summary>
                      /// <param name="x1" type="Number">起始X坐标</param>
                      /// <param name="y1" type="Number">起始Y坐标</param>
                      /// <param name="x2" type="Number">结束X坐标</param>
                      /// <param name="y2" type="Number">结束Y坐标</param>
                      /// <param name="colorStr" type="String">颜色字符串值</param>

                      this.drawLine(x1, y1, x2, y2, colorStr, 1);
                  }).
                  add("Number, Number, Number, Number, Jyo.Color, Number", function (x1, y1, x2, y2, color, lineWidth) {
                      /// <summary>绘制线段</summary>
                      /// <param name="x1" type="Number">起始X坐标</param>
                      /// <param name="y1" type="Number">起始Y坐标</param>
                      /// <param name="x2" type="Number">结束X坐标</param>
                      /// <param name="y2" type="Number">结束Y坐标</param>
                      /// <param name="color" type="Jyo.Color">颜色对象</param>
                      /// <param name="lineWidth" type="Number">线条宽度</param>

                      this.drawLine(x1, y1, x2, y2, color.toRgba(), lineWidth);
                  }).
                  add("Number, Number, Number, Number, String, Number", function (x1, y1, x2, y2, colorStr, lineWidth) {
                      /// <summary>绘制线段</summary>
                      /// <param name="x1" type="Number">起始X坐标</param>
                      /// <param name="y1" type="Number">起始Y坐标</param>
                      /// <param name="x2" type="Number">结束X坐标</param>
                      /// <param name="y2" type="Number">结束Y坐标</param>
                      /// <param name="colorStr" type="String">颜色字符串值</param>
                      /// <param name="lineWidth" type="Number">线条宽度</param>

                      var ctx = this.context;
                      var x = Math.min(x1, x2),
                             y = Math.min(y1, y2),
                             width = Math.max(x1, x2) - x,
                             height = Math.max(y1, y2) - y;

                      this.useTransform(x, y, width, height, function () {
                          ctx.strokeStyle = colorStr || "#000000";
                          ctx.lineWidth = lineWidth || 1.0;

                          ctx.beginPath();
                          ctx.moveTo(x1, y1);
                          ctx.lineTo(x2, y2);
                          ctx.closePath();
                          ctx.stroke();
                      });
                  }),
        drawPolygon: Jyo.overload().
                     add("Array", function (list) {
                         /// <summary>绘制空心多边形</summary>
                         /// <param name="list" type="Array">顶点列表</param>

                         this.drawPolygon(list, "", 1);
                     }).
                     add("Array, Jyo.Color", function (list, color) {
                         /// <summary>绘制空心多边形</summary>
                         /// <param name="list" type="Array">顶点列表</param>
                         /// <param name="color" type="Jyo.Color">颜色对象</param>

                         this.drawPolygon(list, color.toRgba(), 1);
                     }).
                     add("Array, String", function (list, colorStr) {
                         /// <summary>绘制空心多边形</summary>
                         /// <param name="list" type="Array">顶点列表</param>
                         /// <param name="colorStr" type="String">颜色字符串值</param>

                         this.drawPolygon(list, colorStr, 1);
                     }).
                     add("Array, Jyo.Color, Number", function (list, color, lineWidth) {
                         /// <summary>绘制空心多边形</summary>
                         /// <param name="list" type="Array">顶点列表</param>
                         /// <param name="color" type="Jyo.Color">颜色对象</param>
                         /// <param name="lineWidth" type="Number">线条宽度</param>

                         this.drawPolygon(list, color.toRgba(), lineWidth);
                     }).
                     add("Array, String, Number", function (list, colorStr, lineWidth) {
                         /// <summary>绘制空心多边形</summary>
                         /// <param name="list" type="Array">顶点列表</param>
                         /// <param name="colorStr" type="String">颜色字符串值</param>
                         /// <param name="lineWidth" type="Number">线条宽度</param>

                         if (list.length % 2 != 0) list.length = list.length - 1;
                         if (!list.length) return;

                         var x = list[0], y = list[1], w = list[0], h = list[1];

                         if (this.isBeginTransform) {
                             for (var i = list.length; i > 0; i -= 2) {
                                 x = Math.min(list[i], x);
                                 y = Math.min(list[i + 1], y);
                                 w = Math.max(list[i], w);
                                 h = Math.max(list[i + 1], h);
                             }
                             w -= x, h -= y;
                         }

                         var ctx = this.context;

                         this.useTransform(x, y, w, h, function () {
                             ctx.strokeStyle = colorStr || "#000000";
                             ctx.lineWidth = lineWidth || 1.0;

                             ctx.beginPath();
                             if (this.isBeginTransform) {
                                 for (var i = list.length; i > 0; i -= 2)
                                     ctx.lineTo((list[i] - x) + (-0.5 * w), (list[i + 1] - y) + (-0.5 * h));
                             } else {
                                 ctx.moveTo(list[0], list[1]);
                                 for (var i = 2, len = list.length; i < len; i += 2)
                                     ctx.lineTo(list[i], list[i + 1]);
                             }
                             ctx.closePath();
                             ctx.stroke();
                         });
                     }),
        fillPolygon: Jyo.overload().
                     add("Array", function (list) {
                         /// <summary>绘制实心多边形</summary>
                         /// <param name="list" type="Array">顶点列表</param>

                         this.fillPolygon(list, "");
                     }).
                     add("Array, Jyo.Color", function (list, color) {
                         /// <summary>绘制实心多边形</summary>
                         /// <param name="list" type="Array">顶点列表</param>
                         /// <param name="color" type="Jyo.Color">颜色对象</param>

                         this.fillPolygon(list, color.toRgba());
                     }).
                     add("Array, String", function (list, colorStr) {
                         /// <summary>绘制实心多边形</summary>
                         /// <param name="list" type="Array">顶点列表</param>
                         /// <param name="colorStr" type="String">颜色字符串值</param>

                         if (list.length % 2 != 0) list.length = list.length - 1;
                         if (!list.length) return;

                         var x = list[0], y = list[1], w = list[0], h = list[1];

                         if (this.isBeginTransform) {
                             for (var i = list.length; i > 0; i -= 2) {
                                 x = Math.min(list[i], x);
                                 y = Math.min(list[i + 1], y);
                                 w = Math.max(list[i], w);
                                 h = Math.max(list[i + 1], h);
                             }
                             w -= x, h -= y;
                         }

                         var ctx = this.context;

                         ctx.fillStyle = colorStr || "#000000";

                         this.useTransform(x, y, w, h, function () {
                             ctx.beginPath();
                             if (this.isBeginTransform) {
                                 for (var i = list.length; i > 0; i -= 2)
                                     ctx.lineTo((list[i] - x) + (-0.5 * w), (list[i + 1] - y) + (-0.5 * h));
                             } else {
                                 ctx.moveTo(list[0], list[1]);
                                 for (var i = 2, len = list.length; i < len; i += 2)
                                     ctx.lineTo(list[i], list[i + 1]);
                             }
                             ctx.closePath();
                             ctx.fill();
                         });
                     })
    };

    for (var i in canvasFns) {
        Jyo.Renderer.Canvas.prototype[i] = canvasFns[i];
    }

})(window, document, Jyo);