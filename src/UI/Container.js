(function (window, document, Jyo, undefined) {
    "use strict";

    Jyo.UI.Container = function () {
        /// <summary>容器基础类</summary>
        
        Jyo.UI.Scrollable.call(this);

        var backColor = new Jyo.Color("#F3F3F3");
        Object.defineProperty(this, "backColor", {
            get: function () { return backColor; },
            set: Jyo.overload().
                add("Jyo.Color", function (value) {
                    backColor = value;
                })
        });

        var backgroundImage = null;
        Object.defineProperty(this, "backgroundImage", {
            get: function () { return backgroundImage; },
            set: Jyo.overload().
                add("any", function () {
                    backgroundImage = null;
                    this._backgroundImagePattern = null;
                }).
                add("Jyo.Xnb", function (value) {
                    backgroundImage = value;
                    this._backgroundImagePattern = null;
                }).
                add("HTMLImageElement", function (value) {
                    backgroundImage = value;
                    this._backgroundImagePattern = null;
                }).
                add("HTMLVideoElement", function (value) {
                    backgroundImage = value;
                    this._backgroundImagePattern = null;
                })
        });

        var backgroundImageLayout = "tile";
        Object.defineProperty(this, "backgroundImageLayout", {
            get: function () { return backgroundImageLayout; },
            set: Jyo.overload().
                add("String", function (value) {
                    if (backgroundImageLayoutValues.indexOf(value) < 0) return;
                    backgroundImageLayout = value;
                })
        });

        this.addEventListener("resize", function resize() {

            return resize;
        } (), false);

        this.addEventListener("drawbackground", drawBackground, false);

        this.addEventListener("layout", layout, false);
    };

    function layout(e) {
        /// <summary>布局</summary>
        /// <param name="e" type="Object">参数</param>

    }

    var backgroundImageLayoutValues = ["tile", "none", "center", "stretch", "zoom"];

    function drawBackground(e) {
        /// <summary>绘制背景</summary>
        /// <param name="e" type="Object">参数</param>
        
        var renderer = e.renderer;

        renderer.fillRect(0, 0, this.width, this.height, this.backColor);
        if (!!this.backgroundImage) {
            var img = this.backgroundImage;
            switch (this.backgroundImageLayout) {
                case backgroundImageLayoutValues[0]:
                    // tile
                    var ctx = renderer.context;
                    if (!this._backgroundImagePattern) {
                        this._backgroundImagePattern = ctx.createPattern(img, "repeat");
                    }
                    ctx.rect(0, 0, this.width, this.height);
                    ctx.fillStyle = this._backgroundImagePattern;
                    ctx.fill();
                    break;
                case backgroundImageLayoutValues[1]:
                    // none
                    renderer.drawImage(img, 0, 0);
                    break;
                case backgroundImageLayoutValues[2]:
                    // center
                    renderer.drawImage(img, (this.width - img.width) / 2, (this.height - img.height) / 2);
                    break;
                case backgroundImageLayoutValues[3]:
                    // stretch
                    renderer.drawImage(img, 0, 0, this.width, this.height);
                    break;
                case backgroundImageLayoutValues[4]:
                    // zoom
                    var scale = Math.min(this.width / img.width, this.height / img.height);
                    var width = scale * img.width;
                    var height = scale * img.height;
                    renderer.drawImage(img, (this.width - width) / 2, (this.height - height) / 2, width, height);
                    break;
            }
        }
    }
    
    Jyo.UI.Container.prototype = Object.create(Jyo.UI.Scrollable.prototype);
    Jyo.UI.Container.prototype.constructor = Jyo.UI.Container;  

    var fns = {

    };

    for (var i in fns) {
        Jyo.UI.Container.prototype[i] = fns[i];
    }

})(window, document, Jyo);