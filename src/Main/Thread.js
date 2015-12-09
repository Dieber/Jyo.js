(function (window, document, Jyo, undefined) {
    "use strict";

    function ThreadError(message, e) {
        this.name = 'ThreadError';
        this.message = message || (e && e.message) || 'ThreadError';
        if (!!e) this.message = "lineNo:" + e.lineno + "    colNo:" + e.colno + "    msg:" + this.message;
        this.stack = (new Error()).stack;
    }
    ThreadError.prototype = Object.create(Error.prototype);
    ThreadError.prototype.constructor = ThreadError;

    Jyo.Thread = function () {
        /// <summary>线程对象</summary>

        constructor.apply(this, arguments);

        Jyo.Object.call(this);
    };

    var constructor = Jyo.overload().
                      add("Function", function (fn) {
                          this._worker = null;

                          // 消息处理
                          var messageProcess = [
                                // 统一用法
                                'send = postMessage;',
                                'postMessage = void 0;',

                                'var __messages__ = function () {',
                                '    console.warn("Message reception function is not implemented.");',
                                '    __messages__ = Function;',
                                '};',
                                'onmessage = function (e) {',
                                '    __messages__ && __messages__(e.data);',
                                '};',
                                'Object.defineProperty(self, "onmessage", {',
                                '    set: function (value) {',
                                '        __messages__ = value;',
                                '    },',
                                '    get: function () {',
                                '        return __messages__;',
                                '    }',
                                '});', '', ''
                          ].join("\r\n");

                          // 睡眠处理
                          var sleepProcess = [
                                'function sleep(time) {',
                                '    var sleepTime = Date.now();',
                                '    while (true) {',
                                '        if (Date.now() - sleepTime >= time) {',
                                '            break;',
                                '        }',
                                '    }',
                                '}', '', ''
                          ].join("\r\n");

                          var workerBlob = new Blob([messageProcess, sleepProcess, "(" + fn + ")();"], { type: "text/javascript" });
                          this._callUrl = window.URL.createObjectURL(workerBlob);
                      });

    Jyo.Thread.prototype = new Jyo.Object({
        start: function () {
            /// <summary>开启线程</summary>

            var _this = this;
            this._worker = new Worker(this._callUrl);
            this._worker.onerror = function (e) {
                _this.abort();
                if (e.message.split(":")[0].split(" ")[1] == "ReferenceError") {
                    throw new ThreadError('Use of undefined or cross-thread object: ' + e.message.split(' ')[2], e);
                }
                throw new ThreadError(null, e);
            };

            this._worker.addEventListener("message", function (e) {
                _this.fireEvent("message", e.data);
            }, false);
        },
        abort: function () {
            /// <summary>中止线程</summary>

            this._worker && this._worker.terminate();
            this._worker = null;
        },
        send: function (obj) {
            /// <summary>发送数据给线程</summary>

            if (!this._worker) {
                throw "Thread not activated.";
            }
            this._worker.postMessage(obj);
        }
    });

})(window, document, Jyo);