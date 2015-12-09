console.warn("游戏手柄接口未完成");

(function (window, document, Jyo, undefined) {
    "use strict";

    return;

    Jyo.Keys.processors.push(function (list) {
        /// <signature>
        /// <summary>手柄处理器</summary>
        /// <param name="list" type="Array">按键列表</param>
        /// </signature>

        var _this = this;
        if (navigator.getGamepads()) {
            function run() {
                //for (var i = 0; i < list.length; i++) if (list[i].eventSource == "gamepad") {
                //    list.remove(i);
                //    i--;
                //}
                //var gList = getList();
                //for (var i = 0; i < gList.length; i++) list.push(gList[i]);
                list.clear();
                list.push(getList());
                _this.fireEvent("keydown", []);
                requestAnimationFrame(run);
            }
            run();
        }

        function getList() {
            var controllers = navigator.getGamepads(),
                c;

            var list = [];
            for (var j = 0; j < controllers.length; j++) {
                c = controllers[j];
                if (!c) continue;
                list[c.index] = {
                    // 设备名称
                    id: c.id,
                    // 按钮列表
                    buttons: function () {
                        var btnList = [];
                        for (var i = 0; i < c.buttons.length; i++) {
                            var value, pressed, percentage;
                            value = c.buttons[i];
                            pressed = (value == 1.0);
                            if (typeof (value) == "object") {
                                pressed = value.pressed;
                                value = value.value;
                            }
                            percentage = Math.round(value * 100);
                            btnList.push({
                                pressed: pressed,
                                value: value,
                                percentage: percentage
                            });
                        }
                        return btnList;
                    }(),
                    // 摇杆列表
                    axes: function () {
                        var axeList = [];
                        var num = 0;
                        for (var i = 0; i < (2 || c.axes.length) ; i++) {
                            num = c.axes[i].toFixed(4);
                            if (num < -0.5) num = -1;
                            else if (num > 0.5) num = 1;
                            else num = 0;
                            axeList.push(num);
                        }
                        return axeList;
                    }()
                };
            }
            return list;
        }

    });

})(window, document, Jyo);