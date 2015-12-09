(function (window, document, Jyo, undefined) {
    "use strict";

    Jyo.Matrix = function (renderer) {
        /// <signature>
        /// <summary>零矩阵对象构造函数</summary>
        /// <returns type="Jyo.Matrix" />
        /// </signature>
        /// <signature>
        /// <summary>矩阵对象构造函数</summary>
        /// <param  name="m11" type="Number">矩阵中的一行第一列的值</param>
        /// <param  name="m12" type="Number">矩阵中的一行第二列的值</param>
        /// <param  name="m13" type="Number">矩阵中的一行第三列的值</param>
        /// <param  name="m14" type="Number">矩阵中的一行第四列的值</param>
        /// <param  name="m21" type="Number">矩阵中的二行第一列的值</param>
        /// <param  name="m22" type="Number">矩阵中的二行第二列的值</param>
        /// <param  name="m23" type="Number">矩阵中的二行第三列的值</param>
        /// <param  name="m24" type="Number">矩阵中的二行第四列的值</param>
        /// <param  name="m31" type="Number">矩阵中的三行第一列的值</param>
        /// <param  name="m32" type="Number">矩阵中的三行第二列的值</param>
        /// <param  name="m33" type="Number">矩阵中的三行第三列的值</param>
        /// <param  name="m34" type="Number">矩阵中的三行第四列的值</param>
        /// <param  name="m41" type="Number">矩阵中的四行第一列的值</param>
        /// <param  name="m42" type="Number">矩阵中的四行第二列的值</param>
        /// <param  name="m43" type="Number">矩阵中的四行第三列的值</param>
        /// <param  name="m44" type="Number">矩阵中的四行第四列的值</param>
        /// <returns type="Jyo.Matrix" />
        /// </signature>

        var _this = this;

        this.length = 16;
        constructor.apply(this, arguments);

        Object.defineProperty(this, "m11", {
            get: function () {
                return _this[0];
            },
            set: function (value) {
                _this[0] = value;
            }
        });

        Object.defineProperty(this, "m12", {
            get: function () {
                return _this[1];
            },
            set: function (value) {
                _this[1] = value;
            }
        });

        Object.defineProperty(this, "m13", {
            get: function () {
                return _this[2];
            },
            set: function (value) {
                _this[2] = value;
            }
        });

        Object.defineProperty(this, "m14", {
            get: function () {
                return _this[3];
            },
            set: function (value) {
                _this[3] = value;
            }
        });

        Object.defineProperty(this, "m21", {
            get: function () {
                return _this[4];
            },
            set: function (value) {
                _this[4] = value;
            }
        });

        Object.defineProperty(this, "m22", {
            get: function () {
                return _this[5];
            },
            set: function (value) {
                _this[5] = value;
            }
        });

        Object.defineProperty(this, "m23", {
            get: function () {
                return _this[6];
            },
            set: function (value) {
                _this[6] = value;
            }
        });

        Object.defineProperty(this, "m24", {
            get: function () {
                return _this[7];
            },
            set: function (value) {
                _this[7] = value;
            }
        });

        Object.defineProperty(this, "m31", {
            get: function () {
                return _this[8];
            },
            set: function (value) {
                _this[8] = value;
            }
        });

        Object.defineProperty(this, "m32", {
            get: function () {
                return _this[9];
            },
            set: function (value) {
                _this[9] = value;
            }
        });

        Object.defineProperty(this, "m33", {
            get: function () {
                return _this[10];
            },
            set: function (value) {
                _this[10] = value;
            }
        });

        Object.defineProperty(this, "m34", {
            get: function () {
                return _this[11];
            },
            set: function (value) {
                _this[11] = value;
            }
        });

        Object.defineProperty(this, "m41", {
            get: function () {
                return _this[12];
            },
            set: function (value) {
                _this[12] = value;
            }
        });

        Object.defineProperty(this, "m42", {
            get: function () {
                return _this[13];
            },
            set: function (value) {
                _this[13] = value;
            }
        });

        Object.defineProperty(this, "m43", {
            get: function () {
                return _this[14];
            },
            set: function (value) {
                _this[14] = value;
            }
        });

        Object.defineProperty(this, "m44", {
            get: function () {
                return _this[15];
            },
            set: function (value) {
                _this[15] = value;
            }
        });

        Object.defineProperty(this, "backward", {
            get: function () {
                return new Jyo.Vector3(this[8], this[9], this[10]);
            },
            set: function (value) {
                this[8] = value.x;
                this[9] = value.y;
                this[10] = value.z;
            }
        });

        Object.defineProperty(this, "down", {
            get: function () {
                return new Jyo.Vector3(-this[4], -this[5], -this[6]);
            },
            set: function (value) {
                this[4] = -value.x;
                this[5] = -value.y;
                this[6] = -value.z;
            }
        });

        Object.defineProperty(this, "forward", {
            get: function () {
                return new Jyo.Vector3(-this[8], -this[9], -this[10]);
            },
            set: function (value) {
                this[8] = -value.x;
                this[9] = -value.y;
                this[10] = -value.z;
            }
        });

        Object.defineProperty(this, "left", {
            get: function () {
                return new Jyo.Vector3(-this[0], -this[1], -this[2]);
            },
            set: function (value) {
                this[0] = -value.x;
                this[1] = -value.y;
                this[2] = -value.z;
            }
        });

        Object.defineProperty(this, "right", {
            get: function () {
                return new Jyo.Vector3(this[0], this[1], this[2]);
            },
            set: function (value) {
                this[0] = value.x;
                this[1] = value.y;
                this[2] = value.z;
            }
        });

        Object.defineProperty(this, "translation", {
            get: function () {
                return new Jyo.Vector3(this[12], this[13], this[14]);
            },
            set: function (value) {
                this[12] = value.x;
                this[13] = value.y;
                this[14] = value.z;
            }
        });

        Object.defineProperty(this, "scale", {
            get: function () {
                return new Jyo.Vector3(this[0], this[5], this[10]);
            },
            set: function (value) {
                this[0] = value.x;
                this[5] = value.y;
                this[10] = value.z;
            }
        });

        Object.defineProperty(this, "up", {
            get: function () {
                return new Jyo.Vector3(this[4], this[5], this[6]);
            },
            set: function (value) {
                this[4] = value.x;
                this[5] = value.y;
                this[6] = value.z;
            }
        });
    };

    var constructor = Jyo.overload().
                      add(null, function () {
                          /// <summary>矩阵对象构造函数</summary>
                          /// <returns type="Jyo.Matrix" />

                          this[0] = this[5] = this[10] = this[15] = 1;
                          this[1] = this[2] = this[3] = this[4] = this[6] = this[7] = this[8] = this[9] = this[11] = this[12] = this[13] = this[14] = 0;
                      }).
                      add("Jyo.Matrix", function (matrix) {
                          /// <summary>矩阵对象构造函数</summary>
                          /// <param  name="matrix" type="Jyo.Matrix">要复制的矩阵</param>
                          /// <returns type="Jyo.Matrix" />

                          for (var i = 0 ; i < this.length; i++) {
                              this[i] = matrix[i];
                          }
                      }).
                      add("Number" + ", Number".repeat(8), function () {
                          /// <summary>矩阵对象构造函数</summary>
                          /// <param  name="m11" type="Number">矩阵中的一行第一列的值</param>
                          /// <param  name="m12" type="Number">矩阵中的一行第二列的值</param>
                          /// <param  name="m13" type="Number">矩阵中的一行第三列的值</param>
                          /// <param  name="m14" type="Number">矩阵中的一行第四列的值</param>
                          /// <param  name="m21" type="Number">矩阵中的二行第一列的值</param>
                          /// <param  name="m22" type="Number">矩阵中的二行第二列的值</param>
                          /// <param  name="m23" type="Number">矩阵中的二行第三列的值</param>
                          /// <param  name="m24" type="Number">矩阵中的二行第四列的值</param>
                          /// <param  name="m31" type="Number">矩阵中的三行第一列的值</param>
                          /// <param  name="m32" type="Number">矩阵中的三行第二列的值</param>
                          /// <param  name="m33" type="Number">矩阵中的三行第三列的值</param>
                          /// <param  name="m34" type="Number">矩阵中的三行第四列的值</param>
                          /// <returns type="Jyo.Matrix" />

                          this[0] = arguments[0];
                          this[1] = arguments[1];
                          this[2] = arguments[2];
                          this[4] = arguments[3];
                          this[5] = arguments[4];
                          this[6] = arguments[5];
                          this[8] = arguments[6];
                          this[9] = arguments[7];
                          this[10] = arguments[8];
                          this[3] = this[7] = this[11] = this[12] = this[13] = this[14] = 0;
                          this[15] = 1;
                      }).
                      add("Number" + ", Number".repeat(15), function () {
                          /// <summary>矩阵对象构造函数</summary>
                          /// <param  name="m11" type="Number">矩阵中的一行第一列的值</param>
                          /// <param  name="m12" type="Number">矩阵中的一行第二列的值</param>
                          /// <param  name="m13" type="Number">矩阵中的一行第三列的值</param>
                          /// <param  name="m14" type="Number">矩阵中的一行第四列的值</param>
                          /// <param  name="m21" type="Number">矩阵中的二行第一列的值</param>
                          /// <param  name="m22" type="Number">矩阵中的二行第二列的值</param>
                          /// <param  name="m23" type="Number">矩阵中的二行第三列的值</param>
                          /// <param  name="m24" type="Number">矩阵中的二行第四列的值</param>
                          /// <param  name="m31" type="Number">矩阵中的三行第一列的值</param>
                          /// <param  name="m32" type="Number">矩阵中的三行第二列的值</param>
                          /// <param  name="m33" type="Number">矩阵中的三行第三列的值</param>
                          /// <param  name="m34" type="Number">矩阵中的三行第四列的值</param>
                          /// <param  name="m41" type="Number">矩阵中的四行第一列的值</param>
                          /// <param  name="m42" type="Number">矩阵中的四行第二列的值</param>
                          /// <param  name="m43" type="Number">矩阵中的四行第三列的值</param>
                          /// <param  name="m44" type="Number">矩阵中的四行第四列的值</param>
                          /// <returns type="Jyo.Matrix" />

                          for (var i = 0; i < this.length; i++) {
                              this[i] = arguments[i];
                          }
                      });

    // 矩阵相加
    Jyo.Matrix.add = Jyo.overload().
                     add("Jyo.Matrix, Jyo.Matrix", function (matrix1, matrix2) {
                         /// <summary>矩阵相加</summary>
                         /// <param name="matrix1" type="Jyo.Matrix">源矩阵</param>
                         /// <param name="matrix2" type="Jyo.Matrix">源矩阵</param>
                         /// <returns type="Jyo.Matrix"></returns>

                         for (var i = 0; i < this.length; i++) {
                             matrix1[i] += matrix2[i];
                         }
                         return matrix1;
                     }).
                     add("Jyo.Matrix, Jyo.Matrix, Jyo.Matrix", function (matrix1, matrix2, result) {
                         /// <summary>矩阵相加</summary>
                         /// <param name="matrix1" type="Jyo.Matrix">源矩阵</param>
                         /// <param name="matrix2" type="Jyo.Matrix">源矩阵</param>
                         /// <param name="result" type="Jyo.Matrix">结果矩阵</param>

                         for (var i = 0; i < this.length; i++) {
                             result[i] = matrix1[i] + matrix2[i];
                         }
                     });

    // 矩阵相减
    Jyo.Matrix.subtract = Jyo.overload().
                          add("Jyo.Matrix, Jyo.Matrix", function (matrix1, matrix2) {
                              /// <summary>矩阵相减</summary>
                              /// <param name="matrix1" type="Jyo.Matrix">源矩阵</param>
                              /// <param name="matrix2" type="Jyo.Matrix">源矩阵</param>
                              /// <returns type="Jyo.Matrix"></returns>

                              for (var i = 0; i < this.length; i++) {
                                  matrix1[i] -= matrix2[i];
                              }
                              return matrix1;
                          }).
                          add("Jyo.Matrix, Jyo.Matrix, Jyo.Matrix", function (matrix1, matrix2, result) {
                              /// <summary>矩阵相加</summary>
                              /// <param name="matrix1" type="Jyo.Matrix">源矩阵</param>
                              /// <param name="matrix2" type="Jyo.Matrix">源矩阵</param>
                              /// <param name="result" type="Jyo.Matrix">结果矩阵</param>

                              for (var i = 0; i < this.length; i++) {
                                  result[i] = matrix1[i] - matrix2[i];
                              }
                          });

    // 矩阵相乘
    Jyo.Matrix.multiply = Jyo.overload().
                          add("Jyo.Matrix, Jyo.Matrix", function (matrix1, matrix2) {
                              /// <summary>矩阵相乘</summary>
                              /// <param name="matrix1" type="Jyo.Matrix">源矩阵</param>
                              /// <param name="matrix2" type="Jyo.Matrix">源矩阵</param>
                              /// <returns type="Jyo.Matrix"></returns>

                              var m11 = (((matrix1[0] * matrix2[0]) + (matrix1[1] * matrix2[4])) + (matrix1[2] * matrix2[8])) + (matrix1[3] * matrix2[12]);
                              var m12 = (((matrix1[0] * matrix2[1]) + (matrix1[1] * matrix2[5])) + (matrix1[2] * matrix2[9])) + (matrix1[3] * matrix2[13]);
                              var m13 = (((matrix1[0] * matrix2[2]) + (matrix1[1] * matrix2[6])) + (matrix1[2] * matrix2[10])) + (matrix1[3] * matrix2[14]);
                              var m14 = (((matrix1[0] * matrix2[3]) + (matrix1[1] * matrix2[7])) + (matrix1[2] * matrix2[11])) + (matrix1[3] * matrix2[15]);
                              var m21 = (((matrix1[4] * matrix2[0]) + (matrix1[5] * matrix2[4])) + (matrix1[6] * matrix2[8])) + (matrix1[7] * matrix2[12]);
                              var m22 = (((matrix1[4] * matrix2[1]) + (matrix1[5] * matrix2[5])) + (matrix1[6] * matrix2[9])) + (matrix1[7] * matrix2[13]);
                              var m23 = (((matrix1[4] * matrix2[2]) + (matrix1[5] * matrix2[6])) + (matrix1[6] * matrix2[10])) + (matrix1[7] * matrix2[14]);
                              var m24 = (((matrix1[4] * matrix2[3]) + (matrix1[5] * matrix2[7])) + (matrix1[6] * matrix2[11])) + (matrix1[7] * matrix2[15]);
                              var m31 = (((matrix1[8] * matrix2[0]) + (matrix1[9] * matrix2[4])) + (matrix1[10] * matrix2[8])) + (matrix1[11] * matrix2[12]);
                              var m32 = (((matrix1[8] * matrix2[1]) + (matrix1[9] * matrix2[5])) + (matrix1[10] * matrix2[9])) + (matrix1[11] * matrix2[13]);
                              var m33 = (((matrix1[8] * matrix2[2]) + (matrix1[9] * matrix2[6])) + (matrix1[10] * matrix2[10])) + (matrix1[11] * matrix2[14]);
                              var m34 = (((matrix1[8] * matrix2[3]) + (matrix1[9] * matrix2[7])) + (matrix1[10] * matrix2[11])) + (matrix1[11] * matrix2[15]);
                              var m41 = (((matrix1[12] * matrix2[0]) + (matrix1[13] * matrix2[4])) + (matrix1[14] * matrix2[8])) + (matrix1[15] * matrix2[12]);
                              var m42 = (((matrix1[12] * matrix2[1]) + (matrix1[13] * matrix2[5])) + (matrix1[14] * matrix2[9])) + (matrix1[15] * matrix2[13]);
                              var m43 = (((matrix1[12] * matrix2[2]) + (matrix1[13] * matrix2[6])) + (matrix1[14] * matrix2[10])) + (matrix1[15] * matrix2[14]);
                              var m44 = (((matrix1[12] * matrix2[3]) + (matrix1[13] * matrix2[7])) + (matrix1[14] * matrix2[11])) + (matrix1[15] * matrix2[15]);
                              matrix1[0] = m11;
                              matrix1[1] = m12;
                              matrix1[2] = m13;
                              matrix1[3] = m14;
                              matrix1[4] = m21;
                              matrix1[5] = m22;
                              matrix1[6] = m23;
                              matrix1[7] = m24;
                              matrix1[8] = m31;
                              matrix1[9] = m32;
                              matrix1[10] = m33;
                              matrix1[11] = m34;
                              matrix1[12] = m41;
                              matrix1[13] = m42;
                              matrix1[14] = m43;
                              matrix1[15] = m44;
                              return matrix1;
                          }).
                          add("Jyo.Matrix, Jyo.Matrix, Jyo.Matrix", function (matrix1, matrix2, result) {
                              /// <summary>矩阵相加</summary>
                              /// <param name="matrix1" type="Jyo.Matrix">源矩阵</param>
                              /// <param name="matrix2" type="Jyo.Matrix">源矩阵</param>
                              /// <param name="result" type="Jyo.Matrix">结果矩阵</param>

                              var m11 = (((matrix1[0] * matrix2[0]) + (matrix1[1] * matrix2[4])) + (matrix1[2] * matrix2[8])) + (matrix1[3] * matrix2[12]);
                              var m12 = (((matrix1[0] * matrix2[1]) + (matrix1[1] * matrix2[5])) + (matrix1[2] * matrix2[9])) + (matrix1[3] * matrix2[13]);
                              var m13 = (((matrix1[0] * matrix2[2]) + (matrix1[1] * matrix2[6])) + (matrix1[2] * matrix2[10])) + (matrix1[3] * matrix2[14]);
                              var m14 = (((matrix1[0] * matrix2[3]) + (matrix1[1] * matrix2[7])) + (matrix1[2] * matrix2[11])) + (matrix1[3] * matrix2[15]);
                              var m21 = (((matrix1[4] * matrix2[0]) + (matrix1[5] * matrix2[4])) + (matrix1[6] * matrix2[8])) + (matrix1[7] * matrix2[12]);
                              var m22 = (((matrix1[4] * matrix2[1]) + (matrix1[5] * matrix2[5])) + (matrix1[6] * matrix2[9])) + (matrix1[7] * matrix2[13]);
                              var m23 = (((matrix1[4] * matrix2[2]) + (matrix1[5] * matrix2[6])) + (matrix1[6] * matrix2[10])) + (matrix1[7] * matrix2[14]);
                              var m24 = (((matrix1[4] * matrix2[3]) + (matrix1[5] * matrix2[7])) + (matrix1[6] * matrix2[11])) + (matrix1[7] * matrix2[15]);
                              var m31 = (((matrix1[8] * matrix2[0]) + (matrix1[9] * matrix2[4])) + (matrix1[10] * matrix2[8])) + (matrix1[11] * matrix2[12]);
                              var m32 = (((matrix1[8] * matrix2[1]) + (matrix1[9] * matrix2[5])) + (matrix1[10] * matrix2[9])) + (matrix1[11] * matrix2[13]);
                              var m33 = (((matrix1[8] * matrix2[2]) + (matrix1[9] * matrix2[6])) + (matrix1[10] * matrix2[10])) + (matrix1[11] * matrix2[14]);
                              var m34 = (((matrix1[8] * matrix2[3]) + (matrix1[9] * matrix2[7])) + (matrix1[10] * matrix2[11])) + (matrix1[11] * matrix2[15]);
                              var m41 = (((matrix1[12] * matrix2[0]) + (matrix1[13] * matrix2[4])) + (matrix1[14] * matrix2[8])) + (matrix1[15] * matrix2[12]);
                              var m42 = (((matrix1[12] * matrix2[1]) + (matrix1[13] * matrix2[5])) + (matrix1[14] * matrix2[9])) + (matrix1[15] * matrix2[13]);
                              var m43 = (((matrix1[12] * matrix2[2]) + (matrix1[13] * matrix2[6])) + (matrix1[14] * matrix2[10])) + (matrix1[15] * matrix2[14]);
                              var m44 = (((matrix1[12] * matrix2[3]) + (matrix1[13] * matrix2[7])) + (matrix1[14] * matrix2[11])) + (matrix1[15] * matrix2[15]);
                              result[0] = m11;
                              result[1] = m12;
                              result[2] = m13;
                              result[3] = m14;
                              result[4] = m21;
                              result[5] = m22;
                              result[6] = m23;
                              result[7] = m24;
                              result[8] = m31;
                              result[9] = m32;
                              result[10] = m33;
                              result[11] = m34;
                              result[12] = m41;
                              result[13] = m42;
                              result[14] = m43;
                              result[15] = m44;
                          }).
                          add("Jyo.Matrix, Number", function (matrix1, scaleFactor) {
                              /// <summary>由标量值乘以一个矩阵</summary>
                              /// <param name="matrix1" type="Number">源矩阵</param>
                              /// <param name="scaleFactor" type="Number">标量值</param>
                              /// <returns type="Jyo.Matrix"></returns>

                              for (var i = 0; i < this.length; i++) {
                                  matrix1[i] *= scaleFactor;
                              }
                              return matrix1;
                          }).
                          add("Jyo.Matrix, Number, Jyo.Matrix", function (matrix1, scaleFactor, result) {
                              /// <summary>由标量值乘以一个矩阵</summary>
                              /// <param name="matrix1" type="Number">源矩阵</param>
                              /// <param name="scaleFactor" type="Number">标量值</param>
                              /// <param name="result" type="Jyo.Matrix">结果矩阵</param>

                              for (var i = 0; i < this.length; i++) {
                                  result[i] = matrix1[i] * scaleFactor;
                              }
                          });

    // 矩阵相除
    Jyo.Matrix.divide = Jyo.overload().
                        add("Jyo.Matrix, Jyo.Matrix", function (matrix1, matrix2) {
                            /// <summary>矩阵相除</summary>
                            /// <param name="matrix1" type="Jyo.Matrix">源矩阵</param>
                            /// <param name="matrix2" type="Jyo.Matrix">源矩阵</param>
                            /// <returns type="Jyo.Matrix"></returns>

                            for (var i = 0; i < this.length; i++) {
                                matrix1[i] /= matrix2[i];
                            }
                            return matrix1;
                        }).
                        add("Jyo.Matrix, Jyo.Matrix, Jyo.Matrix", function (matrix1, matrix2, result) {
                            /// <summary>矩阵相加</summary>
                            /// <param name="matrix1" type="Jyo.Matrix">源矩阵</param>
                            /// <param name="matrix2" type="Jyo.Matrix">源矩阵</param>
                            /// <param name="result" type="Jyo.Matrix">结果矩阵</param>

                            for (var i = 0; i < this.length; i++) {
                                result[i] = matrix1[i] / matrix2[i];
                            }
                        }).
                        add("Jyo.Matrix, Number", function (matrix1, divider) {
                            /// <summary>由标量值为被除数计算一个矩阵</summary>
                            /// <param name="matrix1" type="Number">源矩阵</param>
                            /// <param name="divider" type="Number">标量值</param>
                            /// <returns type="Jyo.Matrix"></returns>

                            var num = 1 / divider;
                            for (var i = 0; i < this.length; i++) {
                                matrix1[i] *= num;
                            }
                            return matrix1;
                        }).
                        add("Jyo.Matrix, Number, Jyo.Matrix", function (matrix1, divider, result) {
                            /// <summary>由标量值乘以一个矩阵</summary>
                            /// <param name="matrix1" type="Number">源矩阵</param>
                            /// <param name="divider" type="Number">标量值</param>
                            /// <param name="result" type="Jyo.Matrix">结果矩阵</param>

                            var num = 1 / divider;
                            for (var i = 0; i < this.length; i++) {
                                result[i] = matrix1[i] / num;
                            }
                        });

    // 矩阵转置
    Jyo.Matrix.transpose = Jyo.overload().
                           add("Jyo.Matrix", function (matrix) {
                               /// <summary>转置矩阵的行和列</summary>
                               /// <param name="matrix" type="Jyo.Matrix">源矩阵</param>

                               var arr = [this[0], this[4], this[8], this[12],
                                          this[1], this[5], this[9], this[13],
                                          this[2], this[6], this[10], this[14],
                                          this[3], this[7], this[11], this[15]];

                               for (var i = 0; i < arr.length; i++) {
                                   this[i] = arr[i];
                               }
                               return matrix;
                           }).
                           add("Jyo.Matrix, Jyo.Matrix", function (martix, result) {
                               var arr = [this[0], this[4], this[8], this[12],
                                          this[1], this[5], this[9], this[13],
                                          this[2], this[6], this[10], this[14],
                                          this[3], this[7], this[11], this[15]];

                               for (var i = 0; i < arr.length; i++) {
                                   result[i] = arr[i];
                               }
                           });

    // 矩阵求逆
    Jyo.Matrix.inverse = Jyo.overload().
                         add("Jyo.Matrix", function (matrix) {
                             var result = new Jyo.Matrix();
                             Jyo.Matrix.inverse(matrix, result);
                             return result;
                         }).
                         add("Jyo.Matrix, Jyo.Matrix", function (matrix, result) {
                             var a = matrix[0], b = matrix[1], c = matrix[2], d = matrix[3],
                                 e = matrix[4], f = matrix[5], g = matrix[6], h = matrix[7],
                                 i = matrix[8], j = matrix[9], k = matrix[10], l = matrix[11],
                                 m = matrix[12], n = matrix[13], o = matrix[14], p = matrix[15],
                                 q = a * f - b * e, r = a * g - c * e,
                                 s = a * h - d * e, t = b * g - c * f,
                                 u = b * h - d * f, v = c * h - d * g,
                                 w = i * n - j * m, x = i * o - k * m,
                                 y = i * p - l * m, z = j * o - k * n,
                                 A = j * p - l * n, B = k * p - l * o,
                                 ivd = 1 / (q * B - r * A + s * z + t * y - u * x + v * w);
                             result[0] = (f * B - g * A + h * z) * ivd;
                             result[1] = (-b * B + c * A - d * z) * ivd;
                             result[2] = (n * v - o * u + p * t) * ivd;
                             result[3] = (-j * v + k * u - l * t) * ivd;
                             result[4] = (-e * B + g * y - h * x) * ivd;
                             result[5] = (a * B - c * y + d * x) * ivd;
                             result[6] = (-m * v + o * s - p * r) * ivd;
                             result[7] = (i * v - k * s + l * r) * ivd;
                             result[8] = (e * A - f * y + h * w) * ivd;
                             result[9] = (-a * A + b * y - d * w) * ivd;
                             result[10] = (m * u - n * s + p * q) * ivd;
                             result[11] = (-i * u + j * s - l * q) * ivd;
                             result[12] = (-e * z + f * x - g * w) * ivd;
                             result[13] = (a * z - b * x + c * w) * ivd;
                             result[14] = (-m * t + n * r - o * q) * ivd;
                             result[15] = (i * t - j * r + k * q) * ivd;
                         });

    // 透视投影矩阵
    Jyo.Matrix.createPerspectiveFieldOfView = Jyo.overload().
                                              add("Number, Number, Number, Number", function (fovy, aspect, near, far) {
                                                  /// <summary>创建透视投影矩阵</summary>
                                                  /// <param name="fovy" type="Number">垂直可视区域</param>
                                                  /// <param name="aspect" type="Number">宽高比</param>
                                                  /// <param name="near" type="Number">视锥体的近边界</param>
                                                  /// <param name="far" type="Number">视锥体的远边界</param>
                                                  /// <returns type="Jyo.Matrix" />

                                                  var f = 1.0 / Math.tan(fovy / 2);
                                                  var nf = 1 / (near - far);

                                                  return new Jyo.Matrix(f / aspect, 0, 0, 0,
                                                                        0, f, 0, 0,
                                                                        0, 0, (far + near) * nf, -1,
                                                                        0, 0, (2 * far * near) * nf, 0);
                                              });

    // 正交投影矩阵
    Jyo.Matrix.createOrthographicOffCenter = Jyo.overload().
                                             add("Number, Number, Number, Number, Number, Number", function (left, right, bottom, top, near, far) {
                                                 /// <summary>创建正交投影矩阵</summary>
                                                 /// <param name="left" type="Number">视锥体的左边界</param>
                                                 /// <param name="right" type="Number">视锥体的右边界</param>
                                                 /// <param name="bottom" type="Number">视锥体的下边界</param>
                                                 /// <param name="top" type="Number">视锥体的上边界</param>
                                                 /// <param name="near" type="Number">视锥体的近边界</param>
                                                 /// <param name="far" type="Number">视锥体的远边界</param>
                                                 /// <returns type="Jyo.Matrix" />

                                                 var lr = 1 / (left - right);
                                                 var bt = 1 / (bottom - top);
                                                 var nf = 1 / (near - far);

                                                 return new Jyo.Matrix(-2 * lr, 0, 0, 0,
                                                                       0, -2 * bt, 0, 0,
                                                                       0, 0, 2 * nf, 0,
                                                                       (left + right) * lr, (top + bottom) * bt, (far + near) * nf, 1);
                                             });

    // 创建世界矩阵
    Jyo.Matrix.createWorld = Jyo.overload().
                             add("Jyo.Vector3, Jyo.Vector3, Jyo.Vector3", function (position, forward, up) {
                                 var ret = new Jyo.Matrix();
                                 Jyo.Matrix.createWorld(position, forward, up, ret);
                                 return ret;
                             }).
                             add("Jyo.Vector3, Jyo.Vector3, Jyo.Vector3, Jyo.Matrix", function (position, forward, up, result) {
                                 var x = new Jyo.Vector3();
                                 var y = new Jyo.Vector3();
                                 var z = new Jyo.Vector3();
                                 Jyo.Vector3.normalize(forward, z);
                                 Jyo.Vector3.cross(forward, up, x);
                                 Jyo.Vector3.cross(x, forward, y);
                                 x.normalize();
                                 y.normalize();

                                 result = new Jyo.Matrix();
                                 result.right = x;
                                 result.up = y;
                                 result.forward = z;
                                 result.translation = position;
                                 result[15] = 1;
                             });

    // 创建视图矩阵
    Jyo.Matrix.createLookAt = Jyo.overload().
                        add("Jyo.Vector3, Jyo.Vector3, Jyo.Vector3", function (cameraPosition, cameraTarget, cameraUpVector) {
                            /// <summary>创建视图矩阵</summary>
                            /// <param name="cameraPosition" type="Jyo.Vector3">眼睛位置</param>
                            /// <param name="cameraTarget" type="Jyo.Vector3">视图中心</param>
                            /// <param name="cameraUpVector" type="Jyo.Vector3">上向量</param>
                            /// <returns type="Jyo.Matrix" />

                            var matrix = new Jyo.Matrix();
                            Jyo.Matrix.createLookAt(cameraPosition, cameraTarget, cameraUpVector, matrix);
                            return matrix;
                        }).
                        add("Jyo.Vector3, Jyo.Vector3, Jyo.Vector3, Jyo.Matrix", function (cameraPosition, cameraTarget, cameraUpVector, result) {
                            /// <summary>创建视图矩阵</summary>
                            /// <param name="cameraPosition" type="Jyo.Vector3">眼睛位置</param>
                            /// <param name="cameraTarget" type="Jyo.Vector3">视图中心</param>
                            /// <param name="cameraUpVector" type="Jyo.Vector3">上向量</param>
                            /// <param name="result" type="Jyo.Matrix">结果矩阵</param>

                            if (cameraPosition.x == cameraTarget.x && cameraPosition.y == cameraTarget.y && cameraPosition.z == cameraTarget.z) {
                                return result = Jyo.Matrix.identity;
                            }

                            result.eyeDirection = cameraPosition;

                            var z0, z1, z2, x0, x1, x2, y0, y1, y2, len;

                            //vec3.direction(cameraPosition, cameraTarget, z);
                            z0 = cameraPosition.x - cameraTarget.x;
                            z1 = cameraPosition.y - cameraTarget.y;
                            z2 = cameraPosition.z - cameraTarget.z;

                            // normalize (no check needed for 0 because of early return)
                            len = 1 / Math.sqrt(z0 * z0 + z1 * z1 + z2 * z2);
                            z0 *= len;
                            z1 *= len;
                            z2 *= len;

                            //vec3.normalize(vec3.cross(cameraUpVector, z, x));
                            x0 = cameraUpVector.y * z2 - cameraUpVector.z * z1;
                            x1 = cameraUpVector.z * z0 - cameraUpVector.x * z2;
                            x2 = cameraUpVector.x * z1 - cameraUpVector.y * z0;
                            len = Math.sqrt(x0 * x0 + x1 * x1 + x2 * x2);
                            if (!len) {
                                x0 = 0;
                                x1 = 0;
                                x2 = 0;
                            } else {
                                len = 1 / len;
                                x0 *= len;
                                x1 *= len;
                                x2 *= len;
                            };

                            //vec3.normalize(vec3.cross(z, x, y));
                            y0 = z1 * x2 - z2 * x1;
                            y1 = z2 * x0 - z0 * x2;
                            y2 = z0 * x1 - z1 * x0;

                            len = Math.sqrt(y0 * y0 + y1 * y1 + y2 * y2);
                            if (!len) {
                                y0 = 0;
                                y1 = 0;
                                y2 = 0;
                            } else {
                                len = 1 / len;
                                y0 *= len;
                                y1 *= len;
                                y2 *= len;
                            }

                            result[0] = x0;
                            result[1] = y0;
                            result[2] = z0;
                            result[3] = 0;
                            result[4] = x1;
                            result[5] = y1;
                            result[6] = z1;
                            result[7] = 0;
                            result[8] = x2;
                            result[9] = y2;
                            result[10] = z2;
                            result[11] = 0;
                            result[12] = -(x0 * cameraPosition.x + x1 * cameraPosition.y + x2 * cameraPosition.z);
                            result[13] = -(y0 * cameraPosition.x + y1 * cameraPosition.y + y2 * cameraPosition.z);
                            result[14] = -(z0 * cameraPosition.x + z1 * cameraPosition.y + z2 * cameraPosition.z);
                            result[15] = 1;

                            return result;
                        });

    // 围绕X轴旋转的矩阵
    Jyo.Matrix.createRotateX = Jyo.overload().
                               add("Number", function (radians) {
                                   /// <summary>创建围绕X轴旋转的矩阵</summary>
                                   /// <param name="radians" type="Number">弧度</param>
                                   /// <returns type="Jyo.Matrix" />

                                   return new Jyo.Matrix(1, 0, 0, 0,
                                                          0, Math.cos(radians), -(Math.sin(radians)), 0,
                                                          0, Math.sin(radians), Math.cos(radians), 0,
                                                          0, 0, 0, 1);
                               });

    // 围绕Y轴旋转的矩阵
    Jyo.Matrix.createRotateY = Jyo.overload().
                               add("Number", function (radians) {
                                   /// <summary>创建围绕Y轴旋转的矩阵</summary>
                                   /// <param name="radians" type="Number">弧度</param>
                                   /// <returns type="Jyo.Matrix" />

                                   return new Jyo.Matrix(Math.cos(radians), 0, Math.sin(radians), 0,
                                                          0, 1, 0, 0,
                                                          -(Math.sin(radians)), 0, Math.cos(radians), 0,
                                                          0, 0, 0, 1);
                               });

    // 围绕Z轴旋转的矩阵
    Jyo.Matrix.createRotateZ = Jyo.overload().
                               add("Number", function (radians) {
                                   /// <summary>创建围绕Z轴旋转的矩阵</summary>
                                   /// <param name="radians" type="Number">弧度</param>
                                   /// <returns type="Jyo.Matrix" />

                                   return new Jyo.Matrix(Math.cos(radians), -(Math.sin(radians)), 0, 0,
                                                          Math.sin(radians), Math.cos(radians), 0, 0,
                                                          0, 0, 1, 0,
                                                          0, 0, 0, 1);
                               });

    // 平移矩阵
    Jyo.Matrix.createTranslation = Jyo.overload().
                                   add("Jyo.Vector3", function (vec3) {
                                       return Jyo.Matrix.createTranslation(vec3.x, vec3.y, vec3.z);
                                   }).
                                   add("Number, Number, Number", function (x, y, z) {
                                       /// <summary>创建平移矩阵</summary>
                                       /// <param name="x" type="Number">平移X</param>
                                       /// <param name="y" type="Number">平移Y</param>
                                       /// <param name="z" type="Number">平移Z</param>
                                       /// <returns type="Jyo.Matrix" />

                                       return new Jyo.Matrix(1, 0, 0, 0,
                                                             0, 1, 0, 0,
                                                             0, 0, 1, 0,
                                                             x, y, z, 1);
                                   });

    // 缩放矩阵
    Jyo.Matrix.createScale = Jyo.overload().
                             add("Jyo.Vector3", function (vec3) {
                                 return Jyo.Matrix.createScale(vec3.x, vec3.y, vec3.z);
                             }).
                             add("Number", function (scale) {
                                 return Jyo.Matrix.createScale(scale, scale, scale);
                             }).
                             add("Number, Number, Number", function (scaleX, scaleY, scaleZ) {
                                 /// <summary>创建缩放矩阵</summary>
                                 /// <param name="scaleX" type="Number">X缩放</param>
                                 /// <param name="scaleY" type="Number">Y缩放</param>
                                 /// <param name="scaleZ" type="Number">Z缩放</param>
                                 /// <returns type="Jyo.Matrix" />

                                 return new Jyo.Matrix(scaleX, 0, 0, 0,
                                                       0, scaleY, 0, 0,
                                                       0, 0, scaleZ, 0,
                                                       0, 0, 0, 1);
                             });

    Jyo.Matrix.prototype = {
        to44Array: function () {
            /// <summary>将矩阵对象转换为4x4数组</summary>
            /// <returns type="Array" />

            return Array.prototype.slice.call(this);
        },
        to33Array: function () {
            /// <summary>将矩阵对象转换为3x3数组</summary>
            /// <returns type="Array" />

            return [this[0], this[1], this[2], this[4], this[5], this[6], this[8], this[9], this[10]]
        }
    };

    Object.defineProperty(Jyo.Matrix, "identity", {
        get: function () {
            /// <summary>单位矩阵实例</summary>
            /// <returns type="Jyo.Matrix" />

            return new Jyo.Matrix(1, 0, 0, 0,
                                  0, 1, 0, 0,
                                  0, 0, 1, 0,
                                  0, 0, 0, 1);
        }
    });
})(window, document, Jyo);