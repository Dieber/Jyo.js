(function (window, document, Jyo, undefined) {
    "use strict";

    Jyo.BatteryManager = function () {
        /// <summary>电池管理器</summary>
        /// <field name="lowBatteryThreshold" type="Number">低电量阈值百分比</field>
        /// <field name="isCharging" type="Boolean">是否正在充电</field>
        /// <field name="percentage" type="Number">电量百分比</field>
        /// <field name="chargingTime" type="Number">充电剩余时长</field>
        /// <field name="dischargingTime" type="Number">放电剩余时长</field>

        var lowBatteryThreshold = 20;
        Object.defineProperty(this, "lowBatteryThreshold", {
            get: function () { return lowBatteryThreshold; },
            set: function (value) {
                if (typeof value != "number" || value > 50) return;
                if (value < 5) value = 5;
                lowBatteryThreshold = value;
            }
        });

        Object.defineProperty(this, "isCharging", { get: function () { return currentStauts.isCharging; } });
        Object.defineProperty(this, "percentage", { get: function () { return currentStauts.percentage; } });
        Object.defineProperty(this, "chargingTime", { get: function () { return currentStauts.chargingTime; } });
        Object.defineProperty(this, "dischargingTime", { get: function () { return currentStauts.dischargingTime; } });
    };

    Jyo.BatteryManager.prototype = new Jyo.Object();

    Jyo.BatteryManager = new Jyo.BatteryManager();

    // 当前电池状态
    var currentStauts = {
        isCharging: false,
        percentage: 50,
        chargingTime: Infinity,
        dischargingTime: Infinity
    };

    var isEnterLowBattery = false;

    navigator.getBattery().then(function (battery) {
        var bm = Jyo.BatteryManager;

        function statusChange() {
            /// <summary>电池状态改变</summary>
            /// <return type="Object" />

            var oldStauts = {};
            for (var i in currentStauts) { oldStauts[i] = currentStauts[i]; }
            refreshStatus();
            var changedStatus = {};
            for (var i in currentStauts) {
                if (oldStauts[i] != currentStauts[i]) {
                    changedStatus[i] = currentStauts[i];
                }
            }
            if (!currentStauts.isCharging && currentStauts.percentage <= bm.lowBatteryThreshold && !isEnterLowBattery) {
                bm.fireEvent("lowbattery", currentStauts);
                isEnterLowBattery = true;
            } else if (isEnterLowBattery && (currentStauts.isCharging || currentStauts.percentage > bm.lowBatteryThreshold)) {
                bm.fireEvent("normalbattery", currentStauts);
                isEnterLowBattery = false;
            }
            return {
                oldStatus: oldStauts,
                newStatus: currentStauts,
                changedStatus: changedStatus
            };
        }

        function refreshStatus() {
            /// <summary>电池状态刷新</summary>

            currentStauts.isCharging = battery.charging;
            currentStauts.percentage = battery.level * 100;
            currentStauts.chargingTime = battery.chargingTime == Infinity ? 86400 : battery.chargingTime;
            currentStauts.dischargingTime = battery.dischargingTime == Infinity ? 3600 : battery.dischargingTime;
        }

        function checkChange() {
            /// <summary>检查状态更改</summary>

            var changeObj = statusChange();
            var hasNumber = 0;
            for (var i in changeObj.changedStatus) {
                if (!changeObj.changedStatus.isPrototypeOf(i)) {
                    bm.fireEvent("change", changeObj);
                    break;
                }
            }
        }

        if (battery.addEventListener !== undefined) {
            // 电池状态改变时触发事件
            battery.addEventListener('chargingchange', checkChange);
            battery.addEventListener('levelchange', checkChange);
            battery.addEventListener('chargingtimechange', checkChange);
            battery.addEventListener('dischargingtimechange', checkChange);
        }

        window.addEventListener("load", function init() {
            refreshStatus();
            checkChange();
            return init;
        }(), false);
    });

})(window, document, Jyo);