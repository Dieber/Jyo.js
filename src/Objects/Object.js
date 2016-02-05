(function (window, document, Jyo, undefined) {
    "use strict";

    Jyo.Object = function (obj) {
        /// <summary>引擎自定义对象基类</summary>
        
        this._events = {};

        for (var i in obj) this[i] = obj[i];
    };

    Jyo.Object.prototype = {
        addEventListener: function (type, listener, capture) {
            /// <summary>添加事件侦听器</summary>
            /// <param name="type" type="String">事件名称</param>
            /// <param name="listener" type="Function">触发的函数</param>
            /// <param name="capture" type="Boolean">是否在捕获阶段触发</param>
            
            if (typeof type != "string" || typeof listener != "function") return this;
            var evn = this._events[type];
            if (evn === undefined) evn = (this._events[type] = []);
            if (!!capture) evn.push(listener);
            else evn.insert(0, listener);
            return this;
        },
        removeEventListener: function (type, listener, capture) {
            /// <summary>移除事件侦听器</summary>
            /// <param name="type" type="String">事件名称</param>
            /// <param name="listener" type="Function">触发的函数</param>
            /// <param name="capture" type="Boolean">是否在捕获阶段触发</param>

            if (typeof type != "string" || typeof listener != "function") return this;
            var evn = this._events[type];
            if (evn === undefined) return this;

            for (var i = 0, len = evn.length; i < len; i++) {
                if (evn[i] == listener) {
                    this._events[type] = evn.remove(i);
                    if (!this._events[type] || this._events[type].length == 0) {
                        delete this._events[type];
                    }
                    break;
                }
            }
            return this;
        },
        fireEvent: function (type, e) {
            /// <summary>触发事件</summary>
            /// <param name="type" type="String">事件名称</param>
            /// <param name="e" type="Object">附加参数对象</param>

            var evn = this._events[type];
            var dom0 = this["on" + type.toLowerCase()];
            dom0 && dom0.call(this, e);

            if (!evn || evn.length <= 0) return this;

            var isStop = false;
            try {
                // IE下的window.event为只读
                window.event = {
                    stopPropagation: function () { isStop = true; }
                };
            } catch (e) { }

            for (var i = 0, len = evn.length; i < len; i++) {
                if (evn[i].call(this, e) === false || isStop) break;
            }
            return this;
        },
        equals: function (obj) {
            /// <summary>检测是否相等</summary>
            /// <param name="obj" type="Jyo.Object">要进行比对的对象</param>
            /// <returns type="Boolean" />

            if (this._canNew) Jyo.Object.call(this);

            return obj === this;
        }
    };


})(window, document, Jyo);