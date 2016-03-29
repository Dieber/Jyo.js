(function (window, document, Jyo, undefined) {
    "use strict";

    var STACK_DEPTH_LIMIT = 16;

    function matrixMultiply(m1, m2) {
        /// <summary>特制矩阵相乘</summary>
        /// <param name="m1" type="Array">第一个矩阵数组</param>
        /// <param name="m2" type="Array">第二个矩阵数组，结果将影响此数组</param>

        var m10 = m1[0], m11 = m1[1], m12 = m1[2], m13 = m1[3], m14 = m1[4], m15 = m1[5], m16 = m1[6], m17 = m1[7], m18 = m1[8],
            m20 = m2[0], m21 = m2[1], m22 = m2[2], m23 = m2[3], m24 = m2[4], m25 = m2[5], m26 = m2[6], m27 = m2[7], m28 = m2[8];

        m2[0] = m20 * m10 + m23 * m11 + m26 * m12;
        m2[1] = m21 * m10 + m24 * m11 + m27 * m12;
        m2[2] = m22 * m10 + m25 * m11 + m28 * m12;
        m2[3] = m20 * m13 + m23 * m14 + m26 * m15;
        m2[4] = m21 * m13 + m24 * m14 + m27 * m15;
        m2[5] = m22 * m13 + m25 * m14 + m28 * m15;
        m2[6] = m20 * m16 + m23 * m17 + m26 * m18;
        m2[7] = m21 * m16 + m24 * m17 + m27 * m18;
        m2[8] = m22 * m16 + m25 * m17 + m28 * m18;
    };

    Jyo.Transform = function (matrix) {
        /// <signature>
        /// <summary>变换对象构造函数</summary>
        /// <returns type="Jyo.Transform" />
        /// </signature>
        /// <signature>
        /// <summary>变换对象构造函数</summary>
        /// <param  name="matrix" type="Jyo.Matrix">矩阵对象</param>
        /// <returns type="Jyo.Transform" />
        /// </signature>

        /// <field name="translateMatrix" type="Array">平移矩阵数组</field>
        /// <field name="scaleMatrix" type="Array">缩放矩阵数组</field>
        /// <field name="rotateMatrix" type="Array">旋转矩阵数组</field>
        /// <field name="matrixPool" type="Array">矩阵数组池</field>
        /// <field name="matrixCache" type="Array">矩阵缓存数组</field>
        /// <field name="currentStack" type="Number">当前使用索引</field>
        /// <field name="valid" type="Number">有效值</field>

        this.clearStack();
        constructor.apply(this, arguments);
    };

    var constructor = Jyo.overload().
                      add(null, function () {
                          /// <summary>变换对象构造函数</summary>
                          /// <returns type="Jyo.Transform" />

                          this.setIdentity();
                      }).
                      add("Jyo.Matrix", function (matrix) {
                          /// <summary>变换对象构造函数</summary>
                          /// <param  name="matrix" type="Jyo.Matrix">矩阵对象</param>
                          /// <returns type="Jyo.Transform" />

                          this.matrixPool[0] = matrix;
                      });

    Jyo.Transform.prototype = {
        clearStack: function () {
            /// <summary>重置变换对象</summary>

            // 平移矩阵
            this.translateMatrix = this.getIdentity();

            // 缩放矩阵
            this.scaleMatrix = this.getIdentity();

            // 旋转矩阵
            this.rotateMatrix = this.getIdentity();

            this.matrixPool = [];
            this.matrixCache = [];
            this.currentStack = 0;
            this.valid = 0;

            for (var i = 0; i < STACK_DEPTH_LIMIT; i++) {
                this.matrixPool[i] = this.getIdentity();
            }
        },
        getIdentity: function () {
            /// <summary>获得单位矩阵</summary>

            return [1.0, 0.0, 0.0,
               0.0, 1.0, 0.0,
               0.0, 0.0, 1.0];
        },
        setIdentity: function () {
            /// <summary>设置单位矩阵</summary>

            this.matrixPool[this.currentStack] = this.getIdentity();
            if (this.valid === this.currentStack && this.currentStack) {
                this.valid--;
            }
        },
        pushMatrix: function () {
            /// <summary>添加矩阵</summary>

            this.currentStack++;
            this.matrixPool[this.currentStack] = this.getIdentity();
        },
        popMatrix: function () {
            /// <summary>取出矩阵</summary>

            if (this.currentStack === 0) { return; }
            this.currentStack--;
        },
        translate: function (x, y) {
            /// <summary>平移</summary>
            /// <param name="x" type="Number">X坐标</param>
            /// <param name="y" type="Number">Y坐标</param>

            this.translateMatrix[6] = x;
            this.translateMatrix[7] = y;

            matrixMultiply(this.translateMatrix, this.matrixPool[this.currentStack]);
        },
        scale: function (x, y) {
            /// <summary>缩放</summary>
            /// <param name="x" type="Number">横向缩放值</param>
            /// <param name="y" type="Number">纵向缩放值</param>

            this.scaleMatrix[0] = x;
            this.scaleMatrix[4] = y;

            matrixMultiply(this.scaleMatrix, this.matrixPool[this.currentStack]);
        },
        rotate: function (ang) {
            /// <summary>旋转</summary>
            /// <param name="ang" type="Number">旋转值</param>

            var sAng, cAng;

            sAng = Math.sin(-ang);
            cAng = Math.cos(-ang);

            this.rotateMatrix[0] = cAng;
            this.rotateMatrix[3] = sAng;
            this.rotateMatrix[1] = -sAng;
            this.rotateMatrix[4] = cAng;

            matrixMultiply(this.rotateMatrix, this.matrixPool[this.currentStack]);
        }
    };

})(window, document, Jyo);