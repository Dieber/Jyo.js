(function (window, document, Jyo, undefined) {
    "use strict";

    Jyo.Vector3 = function () {
        /// <summary>三维向量构造函数</summary>
        /// <returns type="Jyo.Vector3" />

        /// <field name="x" type="Number">X坐标</field>
        /// <field name="y" type="Number">Y坐标</field>
        /// <field name="z" type="Number">Z坐标</field>

        constructor.apply(this, arguments);
    };

    var constructor = Jyo.overload().
                      add(null, function () {
                          /// <summary>三维向量构造函数</summary>
                          /// <returns type="Jyo.Vector3" />

                          this.x = 0;
                          this.y = 0;
                          this.z = 0;
                      }).
                      add("Number", function (single) {
                          /// <summary>三维向量构造函数</summary>
                          /// <param  name="single" type="Number">数字</param>
                          /// <returns type="Jyo.Vector3" />

                          this.x = single;
                          this.y = single;
                          this.z = single;
                      }).
                      add("Jyo.Vector3", function (vector3) {
                          /// <summary>三维向量构造函数</summary>
                          /// <param  name="vector3" type="Jyo.Vector3">三维向量对象</param>
                          /// <returns type="Jyo.Vector3" />

                          this.x = vector3.x;
                          this.y = vector3.y;
                          this.z = vector3.z;
                      }).
                      add("Number, Number, Number", function (x, y, z) {
                          /// <summary>三维向量构造函数</summary>
                          /// <param  name="x" type="Number">X坐标</param>
                          /// <param  name="y" type="Number">Y坐标</param>
                          /// <param  name="z" type="Number">Z坐标</param>
                          /// <returns type="Jyo.Vector3" />

                          this.x = x;
                          this.y = y;
                          this.z = z;
                      });

    Jyo.Vector3.normalize = Jyo.overload().
                            add("Jyo.Vector3", function (value) {
                                /// <summary>归一化</summary>
                                /// <param name="value" type="Jyo.Vector3">向量值</param>
                                /// <returns type="Jyo.Vector3" />

                                var factor = Jyo.Vector3.distance(value, attributes.zero);
                                factor = 1 / factor;
                                return new Jyo.Vector3(value.x * factor, value.y * factor, value.z * factor);
                            }).
                            add("Jyo.Vector3, Jyo.Vector3", function (value, result) {
                                /// <summary>归一化</summary>
                                /// <param name="value" type="Jyo.Vector3">向量值</param>
                                /// <param name="result" type="Jyo.Vector3">保存到的结果对象</param>

                                var factor = Jyo.Vector3.distance(value, attributes.zero);
                                factor = 1 / factor;
                                result.x *= factor;
                                result.y *= factor;
                                result.z *= factor;
                            });

    Jyo.Vector3.add = Jyo.overload().
                      add("Jyo.Vector3, Number", function (value, num) {
                          /// <summary>向量相加</summary>
                          /// <param name="value" type="Jyo.Vector3">要进行相加的向量</param>
                          /// <param name="num" type="Number">要进行相加的值</param>
                          /// <returns type="Jyo.Vector3" />

                          value.x += num;
                          value.y += num;
                          value.z += num;
                          return value;
                      }).
                      add("Jyo.Vector3, Number, Jyo.Vector3", function (value, num, result) {
                          /// <summary>向量相加</summary>
                          /// <param name="value" type="Jyo.Vector3">要进行相加的向量</param>
                          /// <param name="num" type="Number">要进行相加的值</param>
                          /// <param name="result" type="Jyo.Vector3">保存到的结果对象</param>

                          result.x = value.x + num;
                          result.y = value.y + num;
                          result.z = value.z + num;
                      }).
                      add("Jyo.Vector3, Jyo.Vector3", function (value1, value2) {
                          /// <summary>向量相加</summary>
                          /// <param name="value1" type="Jyo.Vector3">要进行相加的向量1</param>
                          /// <param name="value2" type="Jyo.Vector3">要进行相加的向量2</param>
                          /// <returns type="Jyo.Vector3" />

                          value1.x += value2.x;
                          value1.y += value2.y;
                          value1.z += value2.z;
                          return value1;
                      }).
                      add("Jyo.Vector3, Jyo.Vector3, Jyo.Vector3", function (value1, value2, result) {
                          /// <summary>向量相加</summary>
                          /// <param name="value1" type="Jyo.Vector3">要进行相加的向量1</param>
                          /// <param name="value2" type="Jyo.Vector3">要进行相加的向量2</param>
                          /// <param name="result" type="Jyo.Vector3">保存到的结果对象</param>

                          result.x = value1.x + value2.x;
                          result.y = value1.y + value2.y;
                          result.z = value1.z + value2.z;
                      });

    Jyo.Vector3.multiply = Jyo.overload().
                         add("Jyo.Vector3, Number", function (value, num) {
                             /// <summary>向量与标量相乘并返回一个新向量</summary>
                             /// <param name="value" type="Jyo.Vector3">要进行相乘的向量</param>
                             /// <param name="num" type="Number">要进行相乘的标量</param>
                             /// <returns type="Jyo.Vector3">

                             value.x *= num;
                             value.y *= num;
                             value.z *= num;
                             return value;
                         }).
                         add("Jyo.Vector3, Number, Jyo.Vector3", function (value, num, result) {
                             /// <summary>向量与标量相乘并保存到结果向量对象中</summary>
                             /// <param name="value" type="Jyo.Vector3">要进行相乘的向量</param>
                             /// <param name="num" type="Number">要进行相乘的标量</param>
                             /// <param name="result" type="Jyo.Vector3">结果向量</param>

                             result.x = value.x * num;
                             result.y = value.y * num;
                             result.z = value.z * num;
                         }).
                         add("Jyo.Vector3, Jyo.Vector3", function (value1, value2) {
                             /// <summary>向量与向量相乘并返回一个新向量</summary>
                             /// <param name="value1" type="Jyo.Vector3">要进行相乘的第一个向量</param>
                             /// <param name="value2" type="Jyo.Vector3">要进行相乘的第二个向量</param>
                             /// <returns type="Jyo.Vector3" />

                             value1.x *= value2.x;
                             value1.y *= value2.y;
                             value1.z *= value2.z;
                             return value1;
                         }).
                         add("Jyo.Vector3, Jyo.Vector3, Jyo.Vector3", function (value1, value2, result) {
                             /// <summary>向量与向量相乘并保存到结果向量中</summary>
                             /// <param name="value1" type="Jyo.Vector3">要进行相乘的第一个向量</param>
                             /// <param name="value2" type="Jyo.Vector3">要进行相乘的第二个向量</param>
                             /// <param name="result" type="Jyo.Vector3">结果向量</param>

                             result.x = value1.x * value2.x;
                             result.y = value1.y * value2.y;
                             result.z = value1.z * value2.z;
                         });

    Jyo.Vector3.subtract = Jyo.overload().
                           add("Jyo.Vector3, Number", function (value, num) {
                               /// <summary>向量与标量相减并返回一个新向量</summary>
                               /// <param name="value" type="Jyo.Vector3">要进行相减的向量</param>
                               /// <param name="num" type="Number">要进行相减的标量</param>
                               /// <returns type="Jyo.Vector3">

                               value.x -= num;
                               value.y -= num;
                               value.z -= num;
                               return value;
                           }).
                           add("Jyo.Vector3, Number, Jyo.Vector3", function (value, num, result) {
                               /// <summary>向量与标量相减并保存到结果向量对象中</summary>
                               /// <param name="value" type="Jyo.Vector3">要进行相减的向量</param>
                               /// <param name="num" type="Number">要进行相减的标量</param>
                               /// <param name="result" type="Jyo.Vector3">结果向量</param>

                               result.x = value.x - num;
                               result.y = value.y - num;
                               result.z = value.z - num;
                           }).
                           add("Jyo.Vector3, Jyo.Vector3", function (value1, value2) {
                               /// <summary>向量与向量相减并返回一个新向量</summary>
                               /// <param name="value1" type="Jyo.Vector3">要进行相减的第一个向量</param>
                               /// <param name="value2" type="Jyo.Vector3">要进行相减的第二个向量</param>
                               /// <returns type="Jyo.Vector3" />

                               value1.x -= value2.x;
                               value1.y -= value2.y;
                               value1.z -= value2.z;
                               return value1;
                           }).
                           add("Jyo.Vector3, Jyo.Vector3, Jyo.Vector3", function (value1, value2, result) {
                               /// <summary>向量与向量相减并保存到结果向量中</summary>
                               /// <param name="value1" type="Jyo.Vector3">要进行相减的第一个向量</param>
                               /// <param name="value2" type="Jyo.Vector3">要进行相减的第二个向量</param>
                               /// <param name="result" type="Jyo.Vector3">结果向量</param>

                               result.x = value1.x - value2.x;
                               result.y = value1.y - value2.y;
                               result.z = value1.z - value2.z;
                           });

    Jyo.Vector3.divide = Jyo.overload().
                         add("Jyo.Vector3, Number", function (value, num) {
                             /// <summary>向量与标量相除并返回一个新向量</summary>
                             /// <param name="value" type="Jyo.Vector3">要进行相除的向量</param>
                             /// <param name="num" type="Number">要进行相除的标量</param>
                             /// <returns type="Jyo.Vector3">

                             var factor = 1 / num;
                             value.x *= factor;
                             value.y *= factor;
                             value.z *= factor;
                             return value;
                         }).
                         add("Jyo.Vector3, Number, Jyo.Vector3", function (value, num, result) {
                             /// <summary>向量与标量相除并保存到结果向量对象中</summary>
                             /// <param name="value" type="Jyo.Vector3">要进行相除的向量</param>
                             /// <param name="num" type="Number">要进行相除的标量</param>
                             /// <param name="result" type="Jyo.Vector3">结果向量</param>

                             var factor = 1 / num;
                             result.x = value.x * factor;
                             result.y = value.y * factor;
                             result.z = value.z * factor;
                         }).
                         add("Jyo.Vector3, Jyo.Vector3", function (value1, value2) {
                             /// <summary>向量与向量相除并返回一个新向量</summary>
                             /// <param name="value1" type="Jyo.Vector3">要进行相除的第一个向量</param>
                             /// <param name="value2" type="Jyo.Vector3">要进行相除的第二个向量</param>
                             /// <returns type="Jyo.Vector3" />

                             value1.x /= value2.x;
                             value1.y /= value2.y;
                             value1.z /= value2.z;
                             return value1;
                         }).
                         add("Jyo.Vector3, Jyo.Vector3, Jyo.Vector3", function (value1, value2, result) {
                             /// <summary>向量与向量相除并保存到结果向量中</summary>
                             /// <param name="value1" type="Jyo.Vector3">要进行相除的第一个向量</param>
                             /// <param name="value2" type="Jyo.Vector3">要进行相除的第二个向量</param>
                             /// <param name="result" type="Jyo.Vector3">结果向量</param>

                             result.x = value1.x / value2.x;
                             result.y = value1.y / value2.y;
                             result.z = value1.z / value2.z;
                         });

    Jyo.Vector3.distance = Jyo.overload().
                           add("Jyo.Vector3, Jyo.Vector3", function (value1, value2) {
                               /// <summary>求两个向量间的距离</summary>
                               /// <param name="value1" type="Jyo.Vector3">第一个向量值</param>
                               /// <param name="value2" type="Jyo.Vector3">第二个向量值</param>
                               /// <returns type="Number" />

                               return Math.sqrt(Jyo.Vector3.distanceSquared(value1, value2));
                           });

    Jyo.Vector3.distanceSquared = Jyo.overload().
                                  add("Jyo.Vector3, Jyo.Vector3", function (value1, value2) {
                                      /// <summary>求两个向量间的平方距离</summary>
                                      /// <param name="value1" type="Jyo.Vector3">第一个向量值</param>
                                      /// <param name="value2" type="Jyo.Vector3">第二个向量值</param>
                                      /// <returns type="Number" />

                                      return (value1.x - value2.x) * (value1.x - value2.x) +
                                             (value1.y - value2.y) * (value1.y - value2.y) +
                                             (value1.z - value2.z) * (value1.z - value2.z);
                                  });

    Jyo.Vector3.dot = Jyo.overload().
                      add("Jyo.Vector3, Jyo.Vector3", function (value1, value2) {
                          /// <summary>求点积，将返回一个-1.0~1.0之间的值</summary>
                          /// <param name="value1" type="Jyo.Vector3">要进行计算的第一个向量</param>
                          /// <param name="value2" type="Jyo.Vector3">要进行计算的第二个向量</param>
                          /// <returns type="Jyo.Vector3" />

                          return value1.x * value2.x + value1.y * value2.y + value1.z * value2.z;
                      });

    Jyo.Vector3.cross = Jyo.overload().
                        add("Jyo.Vector3, Jyo.Vector3", function (value1, value2) {
                            /// <summary>求叉积，两个向量围成的平行四边形的面积，结果将保存到第一个向量中</summary>
                            /// <param name="value1" type="Jyo.Vector3">要进行计算的第一个向量</param>
                            /// <param name="value2" type="Jyo.Vector3">要进行计算的第二个向量</param>
                            /// <returns type="Jyo.Vector3" />

                            Jyo.Vector3.cross(value1, value2, value1);
                            return value1;
                        }).
                        add("Jyo.Vector3, Jyo.Vector3, Jyo.Vector3", function (vector1, vector2, result) {
                            /// <summary>求叉积，两个向量围成的平行四边形的面积</summary>
                            /// <param name="value1" type="Jyo.Vector3">要进行计算的第一个向量</param>
                            /// <param name="value2" type="Jyo.Vector3">要进行计算的第二个向量</param>
                            /// <param name="result" type="Jyo.Vector3">保存到的结果对象</param>

                            var x = vector1.y * vector2.z - vector2.y * vector1.z;
                            var y = -(vector1.x * vector2.z - vector2.x * vector1.z);
                            var z = vector1.x * vector2.y - vector2.x * vector1.y;
                            result.x = x;
                            result.y = y;
                            result.z = z;
                        });

    Jyo.Vector3.transform = Jyo.overload().
                            add("Jyo.Vector3, Jyo.Matrix", function (position, matrix) {
                                /// <summary>变换</summary>
                                /// <param name="position" type="Jyo.Vector3">位置坐标向量，结果将影响此值</param>
                                /// <param name="matrix" type="Jyo.Matrix">变换矩阵</param>
                                /// <returns type="Jyo.Vector3" />

                                Jyo.Vector3.transform(position, matrix, position);
                                return position;
                            }).
                            add("Jyo.Vector3, Jyo.Matrix, Jyo.Vector3", function (position, matrix, result) {
                                /// <summary>变换</summary>
                                /// <param name="position" type="Jyo.Vector3">位置坐标向量</param>
                                /// <param name="matrix" type="Jyo.Matrix">变换矩阵</param>
                                /// <param name="result" type="Jyo.Vector3">结果向量</param>

                                var x = (position.x * matrix.m11) + (position.y * matrix.m21) + (position.z * matrix.m31) + matrix.m41;
                                var y = (position.x * matrix.m12) + (position.y * matrix.m22) + (position.z * matrix.m32) + matrix.m42;
                                var z = (position.x * matrix.m13) + (position.y * matrix.m23) + (position.z * matrix.m33) + matrix.m43;
                                result.x = x;
                                result.y = y;
                                result.z = z;
                            });

    Jyo.Vector3.transformNormal = Jyo.overload().
                                  add("Jyo.Vector3, Jyo.Matrix", function (noraml, matrix) {
                                      /// <summary>变换法线</summary>
                                      /// <param name="normal" type="Jyo.Vector3">法线向量，结果将影响此值</param>
                                      /// <param name="matrix" type="Jyo.Matrix">变换矩阵</param>
                                      /// <returns type="Jyo.Vector3" />

                                      Jyo.Vector3.transformNormal(noraml, matrix, noraml);
                                      return noraml;
                                  }).
                                  add("Jyo.Vector3, Jyo.Matrix, Jyo.Vector3", function (normal, matrix, result) {
                                      /// <summary>变换法线</summary>
                                      /// <param name="normal" type="Jyo.Vector3">法线向量</param>
                                      /// <param name="matrix" type="Jyo.Matrix">变换矩阵</param>
                                      /// <param name="result" type="Jyo.Vector3">结果向量</param>

                                      var x = (normal.x * matrix.m11) + (normal.y * matrix.m21) + (normal.z * matrix.m31);
                                      var y = (normal.x * matrix.m12) + (normal.y * matrix.m22) + (normal.z * matrix.m32);
                                      var z = (normal.x * matrix.m13) + (normal.y * matrix.m23) + (normal.z * matrix.m33);
                                      result.x = x;
                                      result.y = y;
                                      result.z = z;
                                  });

    Jyo.Vector3.transofrmCoordinates = function (vec3, transformation) {
        /// <summary>平移坐标</summary>
        /// <param name="vec3" type="Jyo.Vector3">要平移的坐标</param>
        /// <param name="transformation" type="Jyo.Matrix">平移矩阵</param>
        /// <returns type="Jyo.Vector3" />

        var x = vec3.x * transformation.m11 + vec3.y * transformation.m21 + vec3.z * transformation.m31 + transformation.m41;
        var y = vec3.x * transformation.m12 + vec3.y * transformation.m22 + vec3.z * transformation.m32 + transformation.m42;
        var z = vec3.x * transformation.m13 + vec3.y * transformation.m23 + vec3.z * transformation.m33 + transformation.m43;
        var w = vec3.x * transformation.m14 + vec3.y * transformation.m24 + vec3.z * transformation.m34 + transformation.m44;

        return new Jyo.Vector3(x / w, y / w, z / w);
    };

    Jyo.Vector3.prototype = {
        normalize: Jyo.overload().
                   add(null, function () {
                       /// <summary>归一化</summary>

                       Jyo.Vector3.normalize(this, this);
                   }),
        length: function () {
            /// <summary>求长度</summary>
            /// <returns type="Number" />

            var result = Jyo.Vector3.distanceSquared(this, attributes.zero);
            return Math.sqrt(result);
        },
        toArray: function () {
            /// <summary>转换为数组</summary>

            return [this.x, this.y, this.z];
        },
        equal: function (obj) {
            /// <summary>是否值相等</summary>

            return obj.x == this.x && obj.y == this.y && obj.z == this.z;
        }
    };

    var attributes = {
        get zero() {
            return new Jyo.Vector3(0, 0, 0);
        },
        get one() {
            return new Jyo.Vector3(1, 1, 1);
        },
        get unitX() {
            return new Jyo.Vector3(1, 0, 0);
        },
        get unitY() {
            return new Jyo.Vector3(0, 1, 0);
        },
        get unitZ() {
            return new Jyo.Vector3(0, 0, 1);
        },
        get up() {
            return new Jyo.Vector3(0, 1, 0);
        },
        get down() {
            return new Jyo.Vector3(0, -1, 0);
        },
        get right() {
            return new Jyo.Vector3(1, 0, 0);
        },
        get left() {
            return new Jyo.Vector3(-1, 0, 0);
        },
        get forward() {
            return new Jyo.Vector3(0, 0, -1);
        },
        get backward() {
            return new Jyo.Vector3(0, 0, 1);
        }
    };

    for (var i in attributes) {
        Jyo.Vector3[i] = attributes[i];
    }

})(window, document, Jyo);