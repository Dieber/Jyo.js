(function (window, document, Jyo, undefined) {
    "use strict";

    document.write('<meta name="viewport" id="viewport" content="width=device-width,initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=0" />');

    /*
        文本探测相关
    */
    var textMetricElement,
        textSizeCatch = { length: 0, firstTime: 0 };

    (function initTextMetricElement() {
        /// <summary>初始化文本探测元素</summary>

        if (textMetricElement) return;
        if (!document.body) return document.addEventListener("DOMContentLoaded", initTextMetricElement);
        textMetricElement = document.createElement("span");
        textMetricElement.style.cssText = ["position: absolute",
                                           "display: inline",
                                           "left: -10000px",
                                           "top: -10000px",
                                           "padding: 0px",
                                           "margin: 0px",
                                           "border: 0",
                                           "background: transparent",
                                           "opacity: 0",
                                           "visibility: hidden",
                                           "color: transparent",
                                           "pointer-events: none"].join(';');
        document.body.appendChild(textMetricElement);
    })();

    Jyo.Renderer = function () {
        /// <signature>
        /// <summary>渲染器构造函数</summary>
        /// <param name="containerId" type="String">容器id</param>
        /// </signature>
        /// <signature>
        /// <summary>渲染器构造函数</summary>
        /// <param name="containerId" type="String">容器id</param>
        /// <param name="assign" type="String">指定使用的渲染器标识名</param>
        /// </signature>

        Jyo.Object.call(this);

        this.x = 0,
        this.y = 0,
        this.minDepth = 0,
        this.maxDepth = 1;

        constructor.apply(this, arguments);
    };

    var constructor = Jyo.overload().
                      add("String", function (containerId) {
                          /// <summary>渲染器构造函数</summary>
                          /// <param name="containerId" type="String">容器id</param>

                          var rendererList = [Jyo.Renderer.WebGL, Jyo.Renderer.Canvas];

                          for (var i = 0; i < rendererList.length; i++) {
                              if (rendererList[i].isSupport !== undefined && rendererList[i].isSupport()) {
                                  this.assign = rendererList[i].assign;
                                  constructor.call(this, containerId, rendererList[i].assign);
                                  break;
                              }
                          }
                      }).
                      add("String, String", function (containerId, assign) {
                          /// <summary>渲染器构造函数</summary>
                          /// <param name="containerId" type="String">容器id</param>
                          /// <param name="assign" type="String">指定使用的渲染器标识名</param>

                          var _this = this,
                              r = Jyo.Renderer;

                          this.assign = assign;

                          initRenderer.call(this, containerId);
                          for (var i in r) {
                              if (!r.isPrototypeOf(i) && r[i].assign == assign) {
                                  this.canvas = addRenderElement.call(this, r[i].tagName);
                                  for (var n in r[i].prototype) {
                                      this[n] = r[i].prototype[n];
                                  }
                                  r[i].apply(this);
                                  this.addEventListener("resize", function (size) {
                                      _this.canvas.width = size.width,
                                      _this.canvas.height = size.height;
                                  });
                                  break;
                              }
                          }
                      }).
                      add("HTMLCanvasElement", function (canvas) {

                          var rendererList = [Jyo.Renderer.WebGL, Jyo.Renderer.Canvas];
                          this.container = null;
                          this.canvas = canvas;
                          for (var i = 0; i < rendererList.length; i++) {
                              if (rendererList[i].isSupport !== undefined && rendererList[i].isSupport()) {
                                  this.assign = rendererList[i].assign;
                                  rendererList[i].apply(this);
                                  break;
                              }
                          }
                      }).
                      add("HTMLCanvasElement, String", function (canvas, assign) {

                          var _this = this,
                                r = Jyo.Renderer;

                          this.container = null;
                          this.canvas = canvas;
                          this.assign = assign;

                          for (var i in r) {
                              if (!r.isPrototypeOf(i) && r[i].assign == assign) {
                                  for (var n in r[i].prototype) {
                                      this[n] = r[i].prototype[n];
                                  }
                                  r[i].apply(this);
                                  break;
                              }
                          }
                      });

    function initRenderer(containerId) {
        /// <summary>初始化渲染器</summary>
        /// <param name="containerId" type="String">容器id</param>

        /*
            获取并设置画布容器
        */
        var c = this.container = document.getElementById(containerId);
        if (!c) throw new Error(String.format("Not found element by id \"{0}\"", containerId));
        c.style.position = "relative";
        c.style.visibility = "hidden";

        window.addEventListener("load", function event() {
            setTimeout(function () {
                c.style.visibility = "visible";
            }, 100);
            window.removeEventListener("load", event, false);
        }, false);

        // 展现画布缩放值
        this._scaling = 1;

        // 画布旋转角度
        this._rotate = 0;

        // 是否可旋转
        this._canRotate;

        this.reset();
    }

    function addRenderElement(tagName) {
        /// <summary>添加渲染元素</summary>
        /// <param name="tagName" type="String">标签名</param>
        /// <returns type="HTMLElement" />

        var element = document.createElement(tagName);
        element.width = this.width;
        element.height = this.height;
        element.style.cssText = [
                                 "position: relative;",
                                 "left: 0px;",
                                 "top: 0px;",
                                 "width: 100%;",
                                 "height: 100%;",
                                 "margin: 0px;",
                                 "padding: 0px;",
                                 "border: 0px;",
                                 "outline: none;",
                                 "cursor: default;",
                                 "-webkit-tap-highlight-color: transparent;",
                                 "-webkit-user-select: none; ",
                                 "-webkit-touch-callout: none;",
                                 "transform: translateZ(0);",
                                 "-webkit-transform: translateZ(0);",
                                 "-moz-transform: translateZ(0);"
        ].join("");
        if (this.container.childNodes.length) {
            this.container.insertBefore(element, this.container.childNodes[0]);
        } else {
            this.container.appendChild(element);
        }
        return element;
    }

    function enableAdaptive(mode) {
        /// <summary>启用适配</summary>
        /// <param name="mode" type="String">模式</param>

        var _this = this,
            c = this.container,
            cs = c.style,
            timer;

        // 设置适配模式
        this._adaptiveMode = mode;

        // 备份当前Css样式
        this._oldStyles = function () {
            var obj = {};
            var type;
            for (var i in cs) i != "length" && isNaN(i) && !!cs[i] && (type = typeof cs[i]) && type != "function" && type != "object" && (obj[i] = cs[i]);
            return obj;
        }();

        var parentElement;
        if ((parentElement = c.parentElement || c.parentNode || document.body) == document.body) {
            // 画布在body元素中则设置全局样式

            var style;
            var fullscreenStr = ["{",
                                 "    position: fixed !important;",
                                 "    left: 0px !important;",
                                 "    top: 0px !important;",
                                 "    bottom: 0px !important;",
                                 "    right: 0px !important;",
                                 "    width: 100% !important;",
                                 "    height: 100% !important;",
                                 "    margin: 0px !important;",
                                 "    padding: 0px !important;",
                                 "    background-color: black;",
                                 "}"].join("");
            var cssText = [
                           "html,body {",
                           "    margin: 0px;",
                           "    padding: 0px;",
                           "    width: 100%;",
                           "    height: 100%;",
                           "    overflow: hidden;",
                           "}",

                           "@viewport {",
                           "    width: device-width;",
                           "    height:device-height;",
                           "    user-zoom: fixed;",
                           "    user-scalable: fixed;" +
                           "}",

                           ":-webkit-full-screen " + fullscreenStr,
                           ":-moz-full-screen " + fullscreenStr,
                           ":-ms-fullscreen " + fullscreenStr,
                           ":full-screen " + fullscreenStr,
                           ":fullscreen " + fullscreenStr
            ].join("");

            if (!!window.attachEvent) {
                style = document.styleSheets["__HTMLStyle__"] || document.createStyleSheet();
                style.owningElement.id = "__HTMLStyle__";
                style.cssText = cssText;
            } else {
                style = document.getElementById("__HTMLStyle__") || document.createElement("style");
                style.id = "__HTMLStyle__";
                style.innerHTML = cssText;
                document.head.appendChild(style);
            }
        }

        this._resizeFun = function resize() {
            /// <summary>重新适配屏幕的函数</summary>
            /// <returns type="Function" />

            if (timer) {
                clearTimeout(timer);
                timer = null;
            }
            timer = setTimeout(function () {
                if (_this._adaptiveMode !== undefined) {
                    adaptive.call(_this, mode, _this.width, _this.height);
                }
            }, 100);

            return resize;
        }();

        window.addEventListener("load", _this._resizeFun, false);
        window.addEventListener("resize", this._resizeFun, false);
    }

    function disableAdaptive() {
        /// <summary>停用适配</summary>

        if (!("_resizeFun" in this)) return;

        var c = this.container,
            cs = c.style,
            ccs = c.currentStyle || document.defaultView.getComputedStyle(c),
            os = this._oldStyles;

        window.removeEventListener("resize", this._resizeFun, false);

        var parentElement;
        if ((parentElement = c.parentElement || c.parentNode || document.body) == document.body) {
            // 画布在body元素中则还原全局样式

            if (!!window.attachEvent) {
                document.styleSheets["__HTMLStyle__"].cssText = "";
            } else if (document.getElementById("__HTMLStyle__")) {
                document.head.removeChild(document.getElementById("__HTMLStyle__"));
            }
        }

        // 还原旧Css样式
        for (var i in os) {
            if (ccs[i] != cs[i]) {
                cs[i] = os[i];
            }
        }
        cs.visibility = "visible";

        // 重置画布缩放
        this._scaling = 1;
        setCanvasScale.apply(this);

        // 消除数据引用，禁止访问
        this._oldStyles = void 0;
        this._resizeFun = void 0;
        this._adaptiveMode = void 0;
        this._marginTop = void 0;
        this._marginLeft = void 0;
    }

    function adaptive(mode, width, height) {
        /// <summary>自适应</summary>
        /// <param name="mode" type="String">适配模式</param>
        /// <param name="width" type="Number">原始宽度</param>
        /// <param name="height" type="Number">原始高度</param>

        var c = this.container,
            cs = c.style,
            parentElement = c.parentElement || c.parentNode || document.body,
            pWidth = parentElement.clientWidth,
            pHeight = parentElement.clientHeight,
            scaling;

        switch (mode) {
            case "contain":
            case "cover":
                // 使用同比缩放

                if (this._canRotate && (pWidth < pHeight && width > height || pHeight < pWidth && height > width)) {
                    // 检查是否需要自动旋转画布

                    this._rotate = 90;

                    pWidth = parentElement.clientHeight,
                    pHeight = parentElement.clientWidth;
                    scaling = this._scaling = (mode == "cover" ? Math.max : Math.min)(pWidth / width, pHeight / height);

                    // 计算旋转后的居中坐标
                    cs.marginTop = (pWidth - height * scaling) / 2 + "px";
                    cs.marginLeft = (pHeight - width * scaling) / 2 + "px";
                } else {
                    this._rotate = 0;

                    scaling = this._scaling = (mode == "cover" ? Math.max : Math.min)(pWidth / width, pHeight / height)

                    // 计算未旋转的居中坐标
                    cs.marginTop = (pHeight - height * scaling) / 2 + "px";
                    cs.marginLeft = (pWidth - width * scaling) / 2 + "px";
                }

                // 应用旋转值
                cs[Jyo.prefix.lowercase + "Transform"] = "rotate(" + this._rotate + "deg)";
                cs["transform"] = "rotate(" + this._rotate + "deg)";

                // 计算画布宽高
                cs.width = (width * scaling) + "px";
                cs.height = (height * scaling) + "px";
                break;
            case "fill":
                // 使用填充缩放

                if (this._canRotate && (pWidth < pHeight && width > height || pHeight < pWidth && height > width)) {
                    this.applyChange("orientation", "landscape");
                } else {
                    this.applyChange("orientation", "portrait");
                }

                this._rotate = 0;

                cs.cssText += ["position: absolute;",
                               "left: 0px;",
                               "top: 0px;",
                               "width: 100%;",
                               "height: 100%;",
                               "margin: 0px;"].join("");

                // 应用旋转值
                cs[Jyo.prefix.lowercase + "Transform"] = "rotate(" + this._rotate + "deg)";
                cs["transform"] = "rotate(" + this._rotate + "deg)";
                break;
        }
        cs.padding = "0px";

        setCanvasScale.apply(this);
    }

    function setCanvasScale() {
        /// <summary>设置画布缩放</summary>

        var c = this.container,
            cvs = this.canvas,
            scaling = this._scaling,
            pfl = Jyo.prefix.lowercase;

        // 针对不同渲染器使用不同设置
        switch (this._assign) {
            case "WebGL":
            case "Canvas":
                var els = c.childNodes,
                    ts = String.format("scale({0},{0})", scaling);

                for (var i = els.length; i--;) {
                    if (typeof els[i].tagName == "undefiend" || typeof els[i].tagName.toLowerCase() != "div") continue;
                    var cs = els[i].style;
                    cs[pfl + "Transform"] = ts;
                    cs["transform"] = ts;
                    cs[pfl + "TransformOrigin"] = "0% 0%";
                    cs["transformOrigin"] = "0% 0%";
                }
                break;
            case "Svg":
                cvs.setAttribute("viewBox", String.format("0 0 {0} {1}", width, height));
                cvs.setAttribute("width", (width * scaling) + "px");
                cvs.setAttribute("height", (height * scaling) + "px");
                break;
        }

        if (typeof this._scaleFun == "function") this._scaleFun(scaling);
    }
    
    Jyo.Renderer.prototype = Object.create(Jyo.Object.prototype);
    Jyo.Renderer.prototype.constructor = Jyo.Renderer;  

    var rendererFns = {
        applyChange: Jyo.overload().
                     add("String, any", function (key, value) {
                         /// <summary>应用设置</summary>
                         /// <param name="key" type="String">要应用更改值的键名称</param>
                         /// <param name="value" type="any">要应用更改的值</param>

                         this.applyChange(JSON.parse('{"' + key + '":"' + value + '"}'));
                     }).
                     add("Object", function (option) {
                         /// <summary>应用设置</summary>
                         /// <param name="option" type="Object">要应用更改的集合对象</param>

                         var c = this.container,
                             o,
                             newSize = {};

                         for (var i in option) {
                             o = option[i];
                             switch (i.trim()) {
                                 case "width":
                                 case "height":
                                     // 更改画布尺寸

                                     if (!isNaN(o)) {
                                         (c.style[i] = (this[i] = newSize[i] = o) + "px");
                                         if ("_adaptiveMode" in this) {
                                             this._oldStyles[i] = c.style[i];
                                             this.applyChange("adaptiveMode", this._adaptiveMode);
                                         }
                                     } else {
                                         console.warn(String.format("Can not set the \"{0}\" for \"{1}\", because the format is incorrect", i, o));
                                     }
                                     break;
                                 case "adaptiveMode":
                                     // 更改适配模式

                                     disableAdaptive.call(this);

                                     switch (o.toString().trim()) {
                                         case "fill":
                                         case "contain":
                                         case "cover":
                                             enableAdaptive.call(this, o.toString().trim());
                                             break;
                                         case "none": break;
                                         default:
                                             console.warn("Adaptive mode is incorrect");
                                             break;
                                     }
                                     break;
                                 case "autoRotate":
                                     // 是否允许自动旋转

                                     var element = document.createElement("div");
                                     this._canRotate = !!o && "borderRadius" in element.style;
                                     break;
                                 case "pointerLock":
                                     // 指针锁定

                                     var _this = this;

                                     c.removeEventListener("mousedown", c.pointerLockFun, false);
                                     c.removeEventListener("pointerdown", c.pointerLockFun, false);
                                     c.removeEventListener("touchstart", c.pointerLockFun, false);

                                     if (!!o) {
                                         c.pointerLockFun = function () {
                                             if (typeof c.requestPointerLock == "function") {
                                                 // 必须先全屏
                                                 _this.applyChange("isFullScreen", true);
                                                 c.requestPointerLock();
                                             }
                                         };
                                         if (typeof c.requestPointerLock != "function") {
                                             console.warn("Unable to lock pointer");
                                         }
                                         c.pointerLockFun();
                                         c.addEventListener("mousedown", c.pointerLockFun, false);
                                         c.addEventListener("pointerdown", c.pointerLockFun, false);
                                         c.addEventListener("touchstart", c.pointerLockFun, false);
                                     } else {
                                         document.exitPointerLock();
                                     }
                                     break;
                                 case "enableContextmenu":
                                     // 更改文本菜单是否可用

                                     this.container.oncontextmenu = !!o ? null : function () { return false; };
                                     break;
                                 case "isFullScreen":
                                     // 更改是否全屏

                                     if (!!o && typeof this.container.requestFullscreen == "function") {
                                         this.container.requestFullscreen();
                                     } else if (typeof document.exitFullscreen == "function") {
                                         // 取消全屏时自动取消屏幕方向锁定
                                         this.applyChange("orientation", "auto");
                                         document.exitFullscreen();
                                     } else {
                                         console.warn("Unable to fullscreen");
                                     }
                                     break;
                                 case "orientation":
                                     // 更改屏幕方向
                                     // landscape为横向
                                     // portrait为纵向

                                     if (o != "portrait" && o != "landscape" && o != "auto") {
                                         console.warn("Unrecognized screen orientation code");
                                         continue;
                                     }

                                     if (typeof screen.lockOrientation != "function") {
                                         console.warn("Unable to lock or unlock the screen orientation");
                                         continue;
                                     }

                                     switch (o) {
                                         case "auto":
                                             // 取消锁定

                                             screen.unlockOrientation();
                                             break;
                                         default:
                                             // 获取锁定

                                             // 必须先全屏
                                             this.applyChange("isFullScreen", true);
                                             screen.lockOrientation(o);
                                             break;
                                     }
                                     break;
                             }
                         }

                         if (newSize.width || newSize.height) {
                             this.fireEvent("resize", {
                                 width: newSize.width || this.width,
                                 height: newSize.height || this.height
                             });
                         }
                     }),
        reset: function () {
            /// <summary>重置</summary>

            var c = this.container,
                   _this = this;

            // 应用默认配置
            this.applyChange({
                /*
                    使用默认画布容器尺寸
                */
                width: parseFloat(c.getAttribute("data-width") || c.getAttribute("width") || c.clientWidth || 128),
                height: parseFloat(c.getAttribute("data-height") || c.getAttribute("height") || c.clientHeight || 128),
                // 不使用自适应缩放
                adaptiveMode: "none",
                // 禁止右键菜单
                enableContextmenu: false,
                // 取消指针锁定
                pointerLock: false,
                // 取消全屏
                isFullScreen: false,
                // 取消屏幕方向锁定
                orientation: "auto",
                // 检测是否可以自动旋转
                autoRotate: function () {
                    var element = document.createElement("div");
                    return "borderRadius" in element.style;
                }()
            });
        },
        getTextSize: function (str, font) {
            /// <summary>获取文本尺寸</summary>
            /// <param name="str" type="String">文本</param>
            /// <param name="font" type="String">字体</param>
            /// <returns type="Object" />

            var appRunTime = Jyo.Application._lastTime;
            if (textSizeCatch.length >= 1000) {
                for (var n in textSizeCatch) {
                    if (!textSizeCatch[n]._lastUseTime) continue;
                    if (appRunTime - textSizeCatch[n]._lastUseTime > 100) {
                        delete textSizeCatch[n];
                        textSizeCatch.length--;
                    }
                }
            }

            var catchStr = str + ";" + font;
            var catchObj;
            if (catchObj = textSizeCatch[catchStr]) {
                catchObj._lastUseTime = appRunTime;
                return catchObj;
            }

            var tme = textMetricElement;
            tme.style.font = font;
            var width = 0,
                   strList = str.split(/\r\n|\r|\n/);
            for (var i = 0; i < strList.length; i++) {
                tme.innerHTML = strList[i];
                width = Math.max(width, tme.offsetWidth);
            }

            catchObj = textSizeCatch[catchStr] = {
                _lastUseTime: appRunTime,
                width: width,
                height: tme.offsetHeight * strList.length
            };
            textSizeCatch.length++;

            return catchObj;
        },
        project: Jyo.overload().
                 add("Jyo.Vector3, Jyo.Matrix, Jyo.Matrix, Jyo.Matrix", function (source, projection, view, world) {
                     /// <summary>将一个Vector3对象从世界空间转换到屏幕空间</summary>
                     /// <param name="source" type="Jyo.Vector3">源坐标</param>
                     /// <param name="projection" type="Jyo.Matrix">投影矩阵</param>
                     /// <param name="view" type="Jyo.Matrix">视图矩阵</param>
                     /// <param name="world" type="Jyo.Matrix">世界矩阵</param>
                     /// <returns type="Jyo.Vector3">

                     var matrix = new Jyo.Matrix();
                     Jyo.Matrix.multiply(world, view, matrix);
                     Jyo.Matrix.multiply(matrix, projection, matrix);

                     var vector = new Jyo.Vector3();
                     Jyo.Vector3.transform(source, matrix, vector);
                     var a = (((source.x * matrix.m14) + (source.y * matrix.m24)) + (source.z * matrix.m34)) + matrix.m44;
                     if (Number.withinEpsilon(a, 1)) {
                         vector.x = vector.x / a;
                         vector.y = vector.y / a;
                         vector.z = vector.z / a;
                     }
                     vector.x = (((vector.x + 1) * 0.5) * this.width) + this.x;
                     vector.y = (((-vector.y + 1) * 0.5) * this.height) + this.y;
                     vector.z = (vector.z * (this.maxDepth - this.minDepth)) + this.minDepth;
                     return vector;
                 }),
        unproject: Jyo.overload().
                   add("Jyo.Vector3, Jyo.Matrix, Jyo.Matrix, Jyo.Matrix", function (source, projection, view, world) {
                       /// <summary>将一个Vector3对象从屏幕空间转换到世界空间</summary>
                       /// <param name="source" type="Jyo.Vector3">源坐标</param>
                       /// <param name="projection" type="Jyo.Matrix">投影矩阵</param>
                       /// <param name="view" type="Jyo.Matrix">视图矩阵</param>
                       /// <param name="world" type="Jyo.Matrix">世界矩阵</param>
                       /// <returns type="Jyo.Vector3">

                       var matrix = new Jyo.Matrix();
                       Jyo.Matrix.multiply(world, view, matrix);
                       Jyo.Matrix.multiply(matrix, projection, matrix)
                       matrix = Jyo.Matrix.inverse(matrix);
                       source.x = (((source.x - this.x) / (this.width)) * 2) - 1;
                       source.y = -((((source.y - this.y) / (this.height)) * 2) - 1);
                       source.z = (source.z - this.minDepth) / (this.maxDepth - this.minDepth);
                       var vector = new Jyo.Vector3();
                       Jyo.Vector3.transform(source, matrix, vector);
                       var a = (((source.x * matrix.m14) + (source.y * matrix.m24)) + (source.z * matrix.m34)) + matrix.m44;
                       if (!Number.withinEpsilon(a, 1)) {
                           vector.x = vector.x / a;
                           vector.y = vector.y / a;
                           vector.z = vector.z / a;
                       }
                       return vector;
                   })
    };
    
    for (var i in rendererFns) {
        Jyo.Renderer.prototype[i] = rendererFns[i];
    }

})(window, document, Jyo);