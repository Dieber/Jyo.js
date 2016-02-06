(function (window, document, Jyo, undefined) {
    "use strict";

    Jyo.UI.Scrollable = function () {
        /// <summary>滚动基础类</summary>
        /// <field name="verticalScroll" type="Boolean">纵向滚动条</field>
        /// <field name="horizontalScroll" type="Boolean">横向滚动条</field>
        /// <field name="autoSize" type="Boolean">是否自动设置尺寸</field>
        /// <field name="autoScroll" type="Boolean">是否自动判断是否出现滚动条</field>

        Jyo.UI.Base.call(this);

        var verticalScroll = false;
        Object.defineProperty(this, "verticalScroll", {
            get: function () { return verticalScroll; },
            set: function (value) {
                verticalScroll = !!value;
                setScrollbar.call(this);
            }
        });

        var verticalScrollbar = new Jyo.UI.Scrollbar();
        verticalScrollbar.direction = "vertical";
        Object.defineProperty(this, "verticalScrollbar", {
            get: function () { return verticalScrollbar; }
        });
        this.addControl(verticalScrollbar);

        var horizontalScroll = false;
        Object.defineProperty(this, "horizontalScroll", {
            get: function () { return horizontalScroll; },
            set: function (value) {
                horizontalScroll = !!value;
                setScrollbar.call(this);
            }
        });

        var horizontalScrollbar = new Jyo.UI.Scrollbar();
        horizontalScrollbar.direction = "horizontal";
        Object.defineProperty(this, "horizontalScrollbar", {
            get: function () { return horizontalScrollbar; }
        });
        this.addControl(horizontalScrollbar);

        var autoSize = false;
        Object.defineProperty(this, "autoSize", {
            get: function () { return autoSize; },
            set: function (value) {
                autoSize = !!value;
                setScrollbar.call(this);
            }
        });

        var autoScroll = false;
        Object.defineProperty(this, "autoScroll", {
            get: function () { return autoScroll; },
            set: function (value) {
                autoScroll = !!value;
                setScrollbar.call(this);
            }
        });

        this.addEventListener("resize", function resize() {

            return resize;
        } (), false);

        this.addEventListener("layout", layout, false);

        this.addEventListener("drawbackground", drawBackground, false);

        this.addEventListener("visiblechanged", visibleChanged, false);

        this.addEventListener("controlschanged", function (e) {
            var size = getInnerSize.call(this);
            this.horizontalScroll = size.width > this.width;
            this.verticalScroll = size.height > this.height;
            this.childControls.sort(function (a, b) {
                if (a instanceof Jyo.UI.Scrollbar) return 1;
                return 0;
            });
        }, false);
        
        setScrollbar.call(this);
    };

    function layout(e) {
        /// <summary>布局</summary>
        /// <param name="e" type="Object">参数</param>

    }

    function drawBackground(e) {
        /// <summary>绘制背景</summary>
        /// <param name="e" type="Object">参数</param>

        var renderer = e.renderer;

    }

    function visibleChanged(e) {
        /// <summary>可视状态更改</summary>
        /// <param name="e" type="Object">参数</param>

    }

    function getInnerSize() {
        /// <summary>获取内部尺寸</summary>
        /// <returns type="Object" />
        
        var size = { width: 0, height: 0 };

        var cc = this.childControls;
        for (var i in cc) {
            size.width = Math.max(size.width, cc[i].x + cc[i].width);
            size.height = Math.max(size.height, cc[i].y + cc[i].height);
        }
        return size;
    }

    function setScrollbar() {
        /// <summary>设置滚动条</summary>
    
        if (!!this.autoSize || !this.autoScroll) {
            this.verticalScrollbar.visible = false;
            this.horizontalScrollbar.visible = false;
        } else {
            if (this.verticalScroll) this.verticalScrollbar.visible = true;
            else this.verticalScrollbar.visible = false;
            if (this.horizontalScroll) this.horizontalScrollbar.visible = true;
            else this.horizontalScrollbar.visible = false;
        }
    }

    Jyo.UI.Scrollable.prototype = Object.create(Jyo.UI.Base.prototype);
    Jyo.UI.Scrollable.prototype.constructor = Jyo.UI.Scrollable;

    var fns = {

    };

    for (var i in fns) {
        Jyo.UI.Scrollable.prototype[i] = fns[i];
    }

})(window, document, Jyo);