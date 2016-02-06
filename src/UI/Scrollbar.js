(function (window, document, Jyo, undefined) {
    "use strict";

    Jyo.UI.Scrollbar = function () {
        /// <summary>滚动条控件</summary>
        /// <field name="direction" type="String">指示这是一个纵向滚动条还是横向滚动条</field>

        Jyo.UI.Base.call(this);

        var direction = "vertical";
        Object.defineProperty(this, "direction", {
            get: function () { return direction; },
            set: function (value) {
                if (value != "vertical" && value != "horizontal") return;
                direction = value;
            }
        });

        this.addEventListener("resize", function resize() {

            return resize;
        } (), false);

        this.addEventListener("layout", layout, false);

        this.addEventListener("drawbackground", drawBackground, false);

        this.addEventListener("visiblechanged", visibleChanged, false);
    };

    function layout(e) {
        /// <summary>布局</summary>
        /// <param name="e" type="Object">参数</param>

    }

    function drawBackground(e) {
        /// <summary>绘制背景</summary>
        /// <param name="e" type="Object">参数</param>

        var renderer = e.renderer;

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