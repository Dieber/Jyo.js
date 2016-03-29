(function (window, document, Jyo, undefined) {
    "use strict";

<<<<<<< HEAD
    Jyo.UI.Scrollbar = function (control) {
        /// <summary>滚动条控件</summary>
        /// <field name="direction" type="String">指示这是一个纵向滚动条还是横向滚动条</field>
        /// <field name="both" type="Boolean">是否同时显示横竖滚动条</field>

        Jyo.UI.Base.call(this);

        this._control = control;

=======
    Jyo.UI.Scrollbar = function () {
        /// <summary>滚动条控件</summary>
        /// <field name="direction" type="String">指示这是一个纵向滚动条还是横向滚动条</field>

        Jyo.UI.Base.call(this);

>>>>>>> 037aa92d2c5e6ee5700a2602d459bd6abf972268
        var direction = "vertical";
        Object.defineProperty(this, "direction", {
            get: function () { return direction; },
            set: function (value) {
                if (value != "vertical" && value != "horizontal") return;
<<<<<<< HEAD
                switch (direction = value) {
                    case "vertical":
                        this.width = 5;
                        break;
                    case "horizontal":
                        this.height = 5;
                        break;
                }
            }
        });

        this.backColor = new Jyo.Color(0, 0, 0, 0.6);

        this.addEventListener("resize", function resize() {

            return resize;
        }(), false);
=======
                direction = value;
            }
        });

        this.addEventListener("resize", function resize() {

            return resize;
        } (), false);

        this.addEventListener("layout", layout, false);
>>>>>>> 037aa92d2c5e6ee5700a2602d459bd6abf972268

        this.addEventListener("drawbackground", drawBackground, false);

        this.addEventListener("visiblechanged", visibleChanged, false);
    };

<<<<<<< HEAD
=======
    function layout(e) {
        /// <summary>布局</summary>
        /// <param name="e" type="Object">参数</param>

    }

>>>>>>> 037aa92d2c5e6ee5700a2602d459bd6abf972268
    function drawBackground(e) {
        /// <summary>绘制背景</summary>
        /// <param name="e" type="Object">参数</param>

        var renderer = e.renderer;
<<<<<<< HEAD
        var c = this._control;

        switch (this.direction) {
            case "vertical":
                // 绘制纵向滚动条

                renderer.fillRect(0, 0, 3, c.height, Jyo.Colors.red);
                break;
            case "horizontal":
                // 绘制横向滚动条
                break;
        }
=======

>>>>>>> 037aa92d2c5e6ee5700a2602d459bd6abf972268
    }

    function visibleChanged(e) {
        /// <summary>可视状态更改</summary>
        /// <param name="e" type="Object">参数</param>

    }

    Jyo.UI.Scrollbar.prototype = Object.create(Jyo.UI.Base.prototype);
    Jyo.UI.Scrollbar.prototype.constructor = Jyo.UI.Scrollbar;

    var fns = {

    };

    for (var i in fns) {
        Jyo.UI.Scrollbar.prototype[i] = fns[i];
    }

})(window, document, Jyo);