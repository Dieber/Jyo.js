(function (window, document, Jyo, undefined) {
    "use strict";

    Jyo.Keys.processors.push(function (list) {
        /// <signature>
        /// <summary>键盘处理器</summary>
        /// <param name="list" type="Array">按键列表</param>
        /// </signature>

        var _this = this;

        // 监听键盘按下事件
        document.addEventListener("keydown", function (e) {
            var changeList = [],
                e = e || event,
                curKey = e.keyCode || e.which || e.charCode;

            e.preventDefault();

            for (var i = list.length; i--;) if (list[i].code == curKey) { return; }

            var object = {
                code: curKey,
                time: Date.now()
            };
            list.push(object);
            changeList.push(object);

            _this.fireEvent("keydown", changeList);
        }, false);

        // 监听键盘抬起事件
        document.addEventListener("keyup", function (e) {
            var changeList = [],
                    e = e || event,
                    curKey = e.keyCode || e.which || e.charCode;

            e.preventDefault();

            for (var i = 0; i < list.length; i++) {
                if (list[i].code == curKey) {
                    changeList.push(list[i]);
                    list.remove(i);
                    i--;
                }
            }

            _this.fireEvent("keyup", changeList);
        });

        // 页面失去焦点
        window.addEventListener("blur", function () {
            list.clear();
            _this.fireEvent("keyup", list);
        }, false);
    });

})(window, document, Jyo);