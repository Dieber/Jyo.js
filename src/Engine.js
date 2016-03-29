(function (window, document, Jyo, undefiend) {
    "use strict";

    Jyo.ready = function (callback) {
        if (document.body) return callback(), void 0;
        document.addEventListener("DOMContentLoaded", callback, false);
    };

    Jyo.importScript = function (file, callback, n) {
        /// <summary>导入脚本</summary>
        /// <param name="file" type="String 或者 Array&lt;String&gt;">要导入的文件名称或名称数组</param>
        /// <param name="callback" type="Function" optional="true">回调函数</param>

        n = n || 0;

        var script = document.createElement("script");
        script.onreadystatechange = script.onload = function () {
            if (!this.readyState || 'loaded' === this.readyState || 'complete' === this.readyState) {
                // 判断是否需要导入多个脚本
                if (file instanceof Array && file.length - n > 1) {
                    Jyo.importScript(file, callback, n + 1);
                } else {
                    callback && callback();
                }
                this.onreadystatechange = null;
                this.parentNode.removeChild(this);
            }
        };
        script.src = file instanceof Array ? file[n] : file;

        // 将脚本添加到DOM树中
        var head = document.getElementsByTagName('head')[0];
        !!head ? head.appendChild(script) : document.appendChild(scrip);
    };

    Jyo.loadFile = function (url, syne, type, callback, progressCallback) {
        /// <summary>Ajax加载文件</summary>
        /// <param name="url" type="String">文件地址</param>
        /// <param name="syne" type="Boolean">是否同步加载</param>
        /// <param name="type" type="String">Mime类型</param>
        /// <param name="callback" type="Function">回调函数</param>
        /// <param name="progressCallback" type="Function" optional="true">自定义过程处理函数</param>

        type = type || "text/plain";
        var xmlHttp = new XMLHttpRequest();
        var isText = type.indexOf("text") >= 0;

        xmlHttp.onerror = function (e) {
            if (this.status == 0) {
                return console.error("无法读取跨域或本地文件");
            }
            throw String.format("File \"{0}\" not found", url);
        };

        xmlHttp.onprogress = progressCallback;

        xmlHttp.onreadystatechange = function () {
            if (this.readyState === 4) {
                if (this.status == 404) { return this.onerror(); }
                if ((!isText && !this.response) || (isText && !this.responseText)) { return; }
                (callback instanceof Function) && callback(!isText ? this.response : this.responseText);
            }
        };

        xmlHttp.open('GET', url, !syne);
        if (!isText) {
            // 文本格式不支持设置responseType
            xmlHttp.responseType = type;
        }

        xmlHttp.send(null);

        return xmlHttp;
    };

    if (window.location.protocol.substr(0, 4) === "file") {
        var str = "Exported application won't work until you upload them.(When running on the file:/// protocol, browsers block many features from working for security reasons)";
        console.warn(str);
    }

})(window, document, window.Jyo = {});