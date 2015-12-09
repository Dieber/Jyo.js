(function (window, document, Jyo, undefined) {
    "use strict";

    Jyo.Rectangle = function () {
        /// <signature>
        /// <summary>矩形对象</summary>
        /// </signature>
        /// <signature>
        /// <summary>矩形对象</summary>
        /// <param name="x" type="Number">X坐标</param>
        /// <param name="y" type="Number">Y坐标</param>
        /// <param name="width" type="Number">宽度</param>
        /// <param name="height" type="Number">高度</param>
        /// </signature>

        /// <field name="x" type="Number">X坐标</field>
        /// <field name="y" type="Number">Y坐标</field>
        /// <field name="width" type="Number">宽度</field>
        /// <field name="height" type="Number">高度</field>

        constructor.apply(this, arguments);
    };

    var constructor = Jyo.overload().
                      add(null, function () {
                          /// <summary>矩形对象</summary>

                          this.x = 0,
                          this.y = 0,
                          this.width = 0,
                          this.height = 0;
                      }).
                      add("Number, Number, Number, Number", function (x, y, width, height) {
                          /// <summary>矩形对象</summary>
                          /// <param name="x" type="Number">X坐标</param>
                          /// <param name="y" type="Number">Y坐标</param>
                          /// <param name="width" type="Number">宽度</param>
                          /// <param name="height" type="Number">高度</param>

                          this.x = x,
                          this.y = y,
                          this.width = width,
                          this.height = height;
                      });

    Jyo.Rectangle.intersect = Jyo.overload().
                                 add("Jyo.Rectangle, Jyo.Rectangle", function (rect1, rect2) {
                                     /// <summary>找到相交的矩形</summary>
                                     /// <param name="rect1" type="Jyo.Rectangle">要检测的第一个矩形</param>
                                     /// <param name="rect2" type="Jyo.Rectangle">要检测的第二个矩形</param>
                                     /// <returns type="Jyo.Rectangle" />

                                     return Jyo.Rectangle.intersect(rect1.x, rect1.y, rect1.width, rect1.height,
                                                                    rect2.x, rect2.y, rect2.width, rect2.height);
                                 }).
                                 add("Number, Number, Number, Number, Number, Number, Number, Number", function (x1, y1, width1, height1, x2, y2, width2, height2) {
                                     /// <summary>找到相交的矩形</summary>
                                     /// <param name="x1" type="Number">第一个矩形的X坐标</param>
                                     /// <param name="y1" type="Number">第一个矩形的Y坐标</param>
                                     /// <param name="width1" type="Number">第一个矩形的宽度</param>
                                     /// <param name="height1" type="Number">第一个矩形的高度</param>
                                     /// <param name="x2" type="Number">第二个矩形的X坐标</param>
                                     /// <param name="y2" type="Number">第二个矩形的Y坐标</param>
                                     /// <param name="width2" type="Number">第二个矩形的宽度</param>
                                     /// <param name="height2" type="Number">第二个矩形的高度</param>
                                     /// <returns type="Jyo.Rectangle" />

                                     var x = Math.max(x1, x2),
                                         y = Math.max(y1, y2),
                                         width = x1 + width1 < x2 + width2 ? x1 + width1 : x2 + width2 - x,
                                         height = y1 + height1 < y2 + height2 ? y1 + height1 : y2 + height2 - y;
                                     if (width < 0 || height < 0) width = height = 0;
                                     return new Jyo.Rectangle(x, y, width, height);
                                 });

    Jyo.Rectangle.prototype = {
        intersect: Jyo.overload().
                   add("Jyo.Rectangle", function (rect) {
                       /// <summary>找到相交的矩形并储存结果</summary>
                       /// <param name="rect" type="Jyo.Rectangle">矩形对象<param>

                       rect = Jyo.Rectangle.intersect(this, rect);
                       this.x = rect.x,
                       this.y = rect.y,
                       this.width = rect.width,
                       this.height = rect.height;
                   }).
                   add("Number, Number, Number, Number", function (x, y, width, height) {
                       /// <summary>找到相交的矩形并储存结果</summary>
                       /// <param name="x" type="Number">X坐标<param>
                       /// <param name="y" type="Number">Y坐标<param>
                       /// <param name="width" type="Number">宽度<param>
                       /// <param name="height" type="Number">高度<param>

                       var rect = Jyo.Rectangle.intersect(this.x, this.y, this.width, this.height, x, y, width, height);
                       this.x = rect.x,
                       this.y = rect.y,
                       this.width = rect.width,
                       this.height = rect.height;
                   }),
        intersectsWith: Jyo.overload().
                   add("Jyo.Rectangle", function (rect) {
                       /// <summary>检测是否与矩形相交</summary>
                       /// <param name="rect" type="Jyo.Rectangle">矩形对象<param>
                       /// <returns type="Boolean" />

                       return this.intersectsWith(rect.x, rect.y, rect.width, rect.height);
                   }).
                   add("Number, Number", function (x, y) {
                       /// <summary>检测是否与点相交</summary>
                       /// <param name="x" type="Number">X坐标<param>
                       /// <param name="y" type="Number">Y坐标<param>
                       /// <returns type="Boolean" />

                       return this.intersectsWith(x, y, 1, 1);
                   }).
                   add("Number, Number, Number, Number", function (x, y, width, height) {
                       /// <summary>检测是否与矩形相交</summary>
                       /// <param name="x" type="Number">X坐标<param>
                       /// <param name="y" type="Number">Y坐标<param>
                       /// <param name="width" type="Number">宽度<param>
                       /// <param name="height" type="Number">高度<param>
                       /// <returns type="Boolean" />

                       return !(this.x + this.width < x || x + width < this.x || this.y + this.height < y || y + height < this.y);
                   }),
        equals: function (obj) {
            /// <summary>检测是否相等</summary>
            /// <param name="obj" type="Jyo.Object">要进行比对的对象</param>
            /// <returns type="Boolean" />

            for (var i in this) {
                if (this.isPrototypeOf(i) || !this.hasOwnProperty(i)) continue;
                if (this[i] != obj[i]) return false;
            }
            return true;
        }
    };

})(window, document, Jyo);