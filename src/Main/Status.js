(function (window, document, Jyo, undefined) {
    "use strict";

    Jyo.Status = function () {
        /// <summary>应用状态</summary>

        this.isEnable = false;
        Jyo.Object.call(this);
    };

    Jyo.Status.prototype = new Jyo.Object({
        suppressDraw: function () {
            // 没写完
            _isSuppressDraw = true;
        }
    });


})(window, document, Jyo);