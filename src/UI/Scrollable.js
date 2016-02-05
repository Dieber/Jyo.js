(function (window, document, Jyo, undefined) {
    "use strict";

    Jyo.UI.Scrollable = function () {
        /// <summary>滚动基础类</summary>

        Jyo.UI.Base.call(this);

        this.addEventListener("resize", function resize() {

            return resize;
        }(), false);

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

    Jyo.UI.Scrollable.prototype = Object.create(Jyo.UI.Base.prototype);
    Jyo.UI.Scrollable.prototype.constructor = Jyo.UI.Scrollable;

    var fns = {

    };

    for (var i in fns) {
        Jyo.UI.Scrollable.prototype[i] = fns[i];
    }

})(window, document, Jyo);