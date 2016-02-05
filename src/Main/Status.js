(function (window, document, Jyo, undefined) {
    "use strict";

    Jyo.Status = function () {
        /// <summary>应用状态</summary>

        Jyo.Object.call(this);
        this.isEnable = false;
    };

    Jyo.Status.prototype = Object.create(Jyo.Object.prototype);
    Jyo.Status.prototype.constructor = Jyo.Status;  
    
    var statusFns = {
        suppressDraw: function () {
            /// <summary>跳过一次Draw，直到下次Update</summary>

            _isSuppressDraw = true;
        }
    };

    for (var i in statusFns) {
        Jyo.Status.prototype[i] = statusFns[i];
    }

})(window, document, Jyo);