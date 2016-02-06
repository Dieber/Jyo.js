(function (window, document, Jyo, undefined) {
    "use strict";

    Jyo.UI = function (renderer, inputDevices) {
        /// <summary>UI类</summary>
        /// <param name="renderer" type="Jyo.Renderer">渲染器对象</param>
        /// <param name="inputDevices" type="Array">输入设备数组</param>
        /// <field name="renderer" type="Jyo.Renderer">使用的渲染器对象</field>
        /// <field name="inputDevices" type="Array">使用的输入设备数组</field>
        /// <field name="childControls" type="Array">子控件列表</field>
        /// <field name="width" type="Number">可视宽度</field>
        /// <field name="height" type="Number">可视高度</field>

        Jyo.Object.call(this);

        this.renderer = renderer;
        this.inputDevices = inputDevices;
        this.childControls = [];
        var rect = new Jyo.Rectangle(0, 0, renderer.width, renderer.height);

        renderer.addEventListener("resize", function (c) {
            return function (e) {
                rect.width = e.width;
                rect.height = e.height;
                updateSize.apply(c);
            };
        } (this), false);

        Object.defineProperty(this, "rectangle", {
            get: function () { return rect; }
        });

        Object.defineProperty(this, "left", {
            get: function () { return 0; }
        });

        Object.defineProperty(this, "top", {
            get: function () { return 0; }
        });

        Object.defineProperty(this, "width", {
            get: function () { return renderer.width; }
        });

        Object.defineProperty(this, "height", {
            get: function () { return renderer.height; }
        });

        for (var i = 0; i < inputDevices.length; i++) {
            if (inputDevices[i] instanceof Jyo.Pointer) {
                bindPointer.call(this, inputDevices[i]);
            } else if (inputDevices[i] instanceof Jyo.Keys) {
                bindKyes.call(this, inputDevices[i]);
            }
        }
    };

    function bindPointer(pointer) {
        /// <summary>绑定指针事件</summary>

        var frame = { childControls: [this] };

        var lastTarget = null;
        pointer.addEventListener("pointerstart", function (e) {
            var target = sendPointerEvent(frame, "pointerstart", e);

            lastTarget = target;
        }, false);

        pointer.addEventListener("pointermove", function (e) {
            var target = sendPointerEvent(frame, "pointermove", e);

            lastTarget = target;
        }, false);

        pointer.addEventListener("pointerend", function (e) {
            var target = sendPointerEvent(frame, "pointerend", e);

            lastTarget = target;
        }, false);
    }

    function bindKyes(keys) {
        /// <summary>绑定按键事件</summary>
    }

    function sendPointerEvent(control, eventName, list) {
        /// <summary>发送指针事件</summary>
        /// <param name="control" type="Jyo.UI.Base">控件对象</param>
        /// <param name="eventName" type="String">事件名称</param>
        /// <param name="list" type="Array">指针列表</param>
        /// <returns type="Boolean" />

        var c;
        for (var i = control.childControls.length; i--;) {
            c = control.childControls[i];
            var activeList = [];
            for (var n = 0; n < list.length; n++) {
                if (c.rectangle.intersectsWith(list[n].x, list[n].y)) {
                    activeList.push({
                        x: Math.round(list[n].x - c.left + 1),
                        y: Math.round(list[n].y - c.top + 1)
                    });
                }
            }
            if (activeList.length > 0) {
                if (c.childControls.length == 0) {
                    c.fireEvent(eventName, activeList);
                } else if (!sendPointerEvent(c, eventName, list)) {
                    c.fireEvent(eventName, activeList);
                }
                return c;
            }
        }
    }

    function recursiveRender(control, renderer, x, y) {
        /// <summary>递归渲染控件</summary>
        /// <param name="control" type="Jyo.UI.Base">控件对象</param>
        /// <param name="renderer" type="Jyo.Renderer">渲染器对象</param>

        if (!(control instanceof Jyo.UI.Base) ||
            !control.visible ||
            control.parentControl.width < control.minContainerWidth ||
            control.parentControl.height < control.minContainerHeight) return;

        if (control._needUpdateSize) updateSize.apply(control);
        control.fireEvent("drawfocusrectangle", { renderer: control._subGraphics });
        control.fireEvent("drawbackground", { renderer: control._subGraphics });
        control.fireEvent("paint", { renderer: control._subGraphics });

        x += control.left;
        y += control.top;
        renderer.drawImage(control._subGraphics.canvas, x, y);

        for (var i = 0; i < control.childControls.length; i++) {
            recursiveRender(control.childControls[i], renderer, x, y);
        }
    }

    function recursiveUpdate(control) {
        /// <summary>递归更新控件</summary>
        /// <param name="control" type="Jyo.UI.Base">控件对象</param>

        if (!(control instanceof Jyo.UI.Base)) return;
        control.fireEvent("layout");

        for (var i = 0; i < control.childControls.length; i++) {
            recursiveUpdate(control.childControls[i]);
        }
    }

    function addControl(control) {
        /// <summary>添加一个控件</summary>
        /// <param name="control" type="Jyo.UI.Base">控件对象</param>

        if (!(control instanceof Jyo.UI.Base)) return;

        if (control.parentControl) {
            control.parentControl.removeControl(control);
        }
        this.childControls.push(control);
        control.parentControl = this;
        control.visible = true;
        updateSize.apply(this);
        control.minContainerWidth = control._minContainerWidth;
        control.minContainerHeight = control._minContainerHeight;

        this.fireEvent("controlschanged", { changedControl: control });
    }

    function removeControl(control) {
        /// <summary>移除一个控件</summary>
        /// <param name="control" type="Jyo.UI.Base">控件对象</param>

        if (!(control instanceof Jyo.UI.Base)) return;

        var cc = this.childControls;
        for (var i = cc.length; i--;) {
            if (cc == control) {
                control.parentControl = null;
                control.visible = false;
                cc.remove(i);
                control.minContainerWidth = control.minContainerWidth;
                control.minContainerHeight = control.minContainerHeight;
                break;
            }
        }
        
        this.fireEvent("controlschanged", { changedControl: control });
    }

    Jyo.UI.prototype = Object.create(Jyo.Object.prototype);
    Jyo.UI.prototype.constructor = Jyo.UI;

    var uiPrototypeFns = {
        render: function () {
            /// <summary>执行全部渲染</summary>

            for (var i = 0; i < this.childControls.length; i++) {
                recursiveRender(this.childControls[i], this.renderer, 0, 0);
            }
        },
        update: function () {
            /// <summary>执行全部更新</summary>

            for (var i = 0; i < this.childControls.length; i++) {
                recursiveUpdate(this.childControls[i]);
            }
        },
        addControl: addControl,
        removeControl: removeControl
    };

    for (var i in uiPrototypeFns) {
        Jyo.UI.prototype[i] = uiPrototypeFns[i];
    }

    Jyo.UI.Base = function () {
        /// <summary>基础控件类</summary>
        /// <field name="parentControl" type="Jyo.UI.Base">父控件</field>
        /// <field name="childControls" type="Array">子控件数组</field>
        /// <field name="minContainerWidth" type="Number">要求最小容器宽度</field>
        /// <field name="minContainerHeight" type="Number">要求最小容器高度</field>
        /// <field name="left" type="Number">距离左边距值</field>
        /// <field name="top" type="Number">距离上边距值</field>
        /// <field name="width" type="Number">控件宽度</field>
        /// <field name="height" type="Number">控件高度</field>

        Jyo.Object.call(this);

        var _this = this;
        this.parentControl = null;
        this.childControls = [];
        this.enable = true;
        this._needUpdateSize = false;

        var visible = false;
        Object.defineProperty(this, "visible", {
            get: function () { return visible; },
            set: function (value) {
                _this.fireEvent("visiblechanged", { oldValue: visible, newValue: !!value });
                visible = !!value;
            }
        });

        var rectangle = new Jyo.Rectangle(0, 0, 300, 150);
        Object.defineProperty(this, "rectangle", {
            get: function () { return rectangle; }
        });

        var minContainerWidth = 0;
        Object.defineProperty(this, "minContainerWidth", {
            get: function () { return minContainerWidth; },
            set: function (value) {
                if (typeof value != "number") return;
                if (!!_this.parentControl && _this.parentControl.width < value) _this.visible = false;
                else _this.visible = true;
                minContainerWidth = value;
            }
        });

        var minContainerHeight = 0;
        Object.defineProperty(this, "minContainerHeight", {
            get: function () { return minContainerHeight; },
            set: function (value) {
                if (typeof value != "number") return;
                if (!!_this.parentControl && _this.parentControl.height < value) _this.visible = false;
                else _this.visible = true;
                minContainerHeight = value;
            }
        });

        var left = this._left = 0;
        Object.defineProperty(this, "left", {
            get: function () { return left; },
            set: function (value) {
                var num = _this._numConvert(value, (!!_this.parentControl && _this.parentControl.width) || 300);
                if (typeof num != "number") return;
                rectangle.x = left = num;
                _this._left = value;
            }
        });

        var top = this._top = 0;
        Object.defineProperty(this, "top", {
            get: function () { return top; },
            set: function (value) {
                var num = _this._numConvert(value, (!!_this.parentControl && _this.parentControl.height) || 150);
                if (typeof num != "number") return;
                rectangle.y = top = num;
                _this._top = value;
            }
        });

        var width = this._width = 300;
        Object.defineProperty(this, "width", {
            get: function () { return width; },
            set: function (value) {
                var num = _this._numConvert(value, (!!_this.parentControl && _this.parentControl.width) || 300);
                if (typeof num != "number") return;
                rectangle.width = width = num;
                _this._width = value;
                _this._needUpdateSize = true;
            }
        });

        var height = this._height = 150;
        Object.defineProperty(this, "height", {
            get: function () { return height; },
            set: function (value) {
                var num = _this._numConvert(value, (!!_this.parentControl && _this.parentControl.height) || 150);
                if (typeof num != "number") return;
                rectangle.height = height = num;
                _this._height = value;
                _this._needUpdateSize = true;
            }
        });

        this.createGraphics();
    };

    function updateSize() {
        /// <summary>更新控件尺寸</summary>

        var sg = this._subGraphics;
        if (!!sg) {
            sg.canvas.width = sg.width = this.width;
            sg.canvas.height = sg.height = this.height;
        }

        var c;
        for (var i = this.childControls.length; i--;) {
            c = this.childControls[i];
            c.left = c._left;
            c.top = c._top;
            c.width = c._width;
            c.height = c._height;
            updateSize.apply(c);
        }

        this.fireEvent("resize");

        this._needUpdateSize = false;
    }

    Jyo.UI.Base.prototype = Object.create(Jyo.Object.prototype);
    Jyo.UI.Base.prototype.constructor = Jyo.UI.Base;

    var uiBasePrototypeFns = {
        createGraphics: function () {
            /// <summary>创建一个图形控制器</summary>

            if (!!this._subGraphics) return this._subGraphics;
            var _this = this;
            var canvas = document.createElement("canvas");
            var renderer = new Jyo.Renderer(canvas, "Canvas");
            renderer.fireEvent("resize", {
                width: (renderer.width = _this.width),
                height: (renderer.height = _this.height)
            });
            this._subGraphics = renderer;
            return renderer;
        },
        addControl: addControl,
        removeControl: removeControl,
        _numConvert: function (value, parentNum) {
            /// <summary>百分比、数值统一转换为数值</summary>
            /// <param name="value" type="Any">要进行转换的值</param>
            /// <param name="parentNum" type="Number">父值</param>
            /// <returns type="Number or undefined" />

            value = value.toString();
            var isPercentage = value.lastIndexOf("%") == value.length - 1;
            var v = parseFloat(value);
            if (Number.isNaN(v)) return;
            value = isPercentage ? v / 100 * parentNum : v;
            for (var i = 0, dd = 1; i < 2; i++) dd *= 10;
            return (Math.round(value * dd) / dd);
        }
    };

    for (var i in uiBasePrototypeFns) {
        Jyo.UI.Base.prototype[i] = uiBasePrototypeFns[i];
    }

})(window, document, Jyo);