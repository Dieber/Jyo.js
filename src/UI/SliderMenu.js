(function (window, document, Jyo, undefined) {
    "use strict";

    Jyo.UI.SliderMenu = function () {
        /// <summary>滑动侧边栏</summary>

        Jyo.UI.Container.call(this);

        var _this = this;
        this.left = "-80%";
        this.width = "80%";
        this.height = "100%";
        this.showOrHideSpped = 30;

        var location = "left";
        Object.defineProperty(this, "location", {
            get: function () { return location; },
            set: Jyo.overload().
                add("String", function (value) {
                    switch (value) {
                        case "left":
                        case "right":
                            location = value;
                            break;
                        default: return;
                    }
                })
        });

        this.addEventListener("resize", function resize() {
            _this.location = location;
            return resize;
        }(), false);

        this.addEventListener("layout", layout, false);

        this.addEventListener("pointerstart", function (e) {
            console.log("在滑动菜单按下了" + JSON.stringify(e));
        }, false);

        this.addEventListener("pointermove", function (e) {
            //console.log("在滑动菜单移动了" + JSON.stringify(e));
        }, false);

        this.addEventListener("pointerend", function (e) {
            console.log("在滑动菜单弹起了" + JSON.stringify(e));
        }, false);
    };

    function layout(e) {
        /// <summary>布局</summary>
        /// <param name="e" type="Object">参数</param>

        if (this._showing) updateShowing.call(this);
        else if (this._hidding) updateHidding.call(this);
    }

    function updateShowing() {
        /// <summar>显示数据更新</summary>

        var isOver = false;
        switch (this.location) {
            case "left":
                this.left += this.width / this.showOrHideSpped;
                if (this.left >= this._overValue) isOver = true;
                break;
            case "right":
                this.left -= this.width / this.showOrHideSpped;
                if (this.left <= this._overValue) isOver = true;
                break;
        }
        if (isOver) {
            this.left = this._overValue;
            delete this._overValue;
            delete this._showing;
        }
    }

    function updateHidding() {
        /// <summar>隐藏数据更新</summary>

        var isOver = false;
        switch (this.location) {
            case "left":
                this.left -= this.width / this.showOrHideSpped;
                if (this.left <= this._overValue) isOver = true;
                break;
            case "right":
                this.left += this.width / this.showOrHideSpped;
                if (this.left >= this._overValue) isOver = true;
                break;
        }
        if (isOver) {
            this.left = this._overValue;
            delete this._overValue;
            delete this._hidding;
        }
    }

    Jyo.UI.SliderMenu.prototype = Object.create(Jyo.UI.Container.prototype);
    Jyo.UI.SliderMenu.constructor = Jyo.UI.SliderMenu;

    var fns = {
        show: function (overValue) {
            /// <summary>显示侧边栏</summary>
            /// <param name="overValue" type="Number or String">目标位置</param>

            if (!!this._showing || !!this._hidding || !this.visible) return;
            this._showing = true;
            if (typeof overValue != "undefined") {
                var num = this._numConvert(overValue, this.parentControl.width);
                if (typeof num == "number") {
                    this._overValue = num;
                    return;
                }
            }
            this._overValue = this.location == "left" ? 0 : this.parentControl.width - this.width;
        },
        hide: function (overValue) {
            /// <summary>隐藏侧边栏</summary>
            /// <param name="overValue" type="Number or String">目标位置</param>

            if (!!this._showing || !!this._hidding || !this.visible) return;
            this._hidding = true;
            if (typeof overValue != "undefined") {
                var num = this._numConvert(overValue, this.parentControl.width);
                if (typeof num == "number") {
                    this._overValue = num;
                    return;
                }
            }
            this._overValue = this.location == "left" ? -this.width - 1 : this.parentControl.width;
        }
    };

    for (var i in fns) {
        Jyo.UI.SliderMenu.prototype[i] = fns[i];
    }

})(window, document, Jyo);