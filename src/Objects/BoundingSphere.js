(function (window, document, Jyo, undefined) {
    "use strict";

    Jyo.BoundingSphere = function () {
        /// <summary>包围球构造函数</summary>
        /// <returns type="Jyo.BoundingSphere" />

        constructor.apply(this, arguments);
    };

    var constructor = Jyo.overload().
                      add(null, function () {
                          /// <summary>包围球构造函数</summary>

                          this.center = Jyo.Vector3.zero;
                          this.radius = 0;
                      }).
                      add("Jyo.Vector3, Number", function (center, radius) {
                          /// <summary>包围球构造函数</summary>
                          /// <param name="center" type="Jyo.Vector3">三维向量对象</param>
                          /// <param name="radius" type="Number">半径</param>
                          /// <returns type="Jyo.BoundingSphere" />

                          this.center = center;
                          this.radius = radius;
                      });

    Jyo.BoundingSphere.createMerged = Jyo.overload().
                                      add("Jyo.BoundingSphere, Jyo.BoundingSphere", function (original, additional) {
                                          /// <summary>合并包围球</summary>
                                          /// <param name="original" type="Jyo.BoundingSphere">源包围球对象</param>
                                          /// <param name="additional" type="Jyo.BoundingSphere">添加包围球对象</param>
                                          /// <returns type="Jyo.BoundingSphere" />

                                          var result = new Jyo.BoundingSphere();
                                          this.createMerged(original, additional, result);
                                          return result;
                                      }).
                                      add("Jyo.BoundingSphere, Jyo.BoundingSphere, Jyo.BoundingSphere", function (original, additional, result) {
                                          /// <summary>合并包围球</summary>
                                          /// <param name="original" type="Jyo.BoundingSphere">源包围球对象</param>
                                          /// <param name="additional" type="Jyo.BoundingSphere">添加包围球对象</param>
                                          /// <param name="result" type="Jyo.BoundingSphere">结果包围球对象</param>

                                          var ocenterToaCenter = new Jyo.Vector3();
                                          Jyo.Vector3.subtract(additional.center, original.center, ocenterToaCenter);
                                          var distance = ocenterToaCenter.length();
                                          if (distance <= original.radius + additional.radius) {
                                              if (distance <= original.radius - additional.radius) {
                                                  result = original;
                                                  return;
                                              }
                                              if (distance <= additional.radius - original.radius) {
                                                  result = additional;
                                                  return;
                                              }
                                          }

                                          var leftRadius = Math.max(original.radius - distance, additional.radius);
                                          var rightRadius = Math.max(original.radius + distance, additional.radius);
                                          var tempVector3 = new Jyo.Vector3();
                                          Jyo.Vector3.multiply(ocenterToaCenter, (leftRadius - rightRadius) / (2 * ocenterToaCenter.length()), tempVector3);
                                          Jyo.Vector3.add(ocenterToaCenter, tempVector3, ocenterToaCenter);

                                          Jyo.Vector3.add(original.center, ocenterToaCenter, result.center);
                                          result.radius = (leftRadius + rightRadius) / 2;
                                      });

    Jyo.BoundingSphere.createFromBoundingBox = Jyo.overload().
                                               add("Jyo.BoundingBox", function (box) {
                                                   /// <summary>根据包围盒创建包围球</summary>
                                                   /// <param name="box" type="Jyo.BoundingBox">包围盒</param>
                                                   /// <returns type="Jyo.BoundingShpere" />

                                                   var result = new Jyo.BoundingSphere();
                                                   Jyo.BoundingSphere.createFromBoundingBox(box, result);
                                                   return result;
                                               }).
                                               add("Jyo.BoundingBox, Jyo.BoundingSphere", function (box, result) {
                                                   /// <summary>根据包围盒创建包围球</summary>
                                                   /// <param name="box" type="Jyo.BoundingBox">包围盒</param>
                                                   /// <param name="result" type="Jyo.BoundingShpere">结果包围球</param>

                                                   result.center = new Jyo.Vector3((box.min.x + box.max.x) / 2,
                                                                                   (box.min.y + box.max.y) / 2,
                                                                                   (box.min.z + box.max.z) / 2);;
                                                   result.radius = Jyo.Vector3.distance(result.center, box.max);
                                               });

    Jyo.BoundingSphere.createFromPoints = Jyo.overload().
                                          add("Array", function (points) {
                                              /// <summary>根据顶点数组生成包围球</summary>
                                              /// <param name="points" type="Array<Vector3>">顶点数组</param>
                                              /// <returns type="Jyo.BoundingSphere" />

                                              var minx = new Jyo.Vector3(Number.MAX_VALUE);
                                              var maxx = new Jyo.Vector3(-Number.MAX_VALUE);
                                              var miny = new Jyo.Vector3(minx);
                                              var maxy = new Jyo.Vector3(-Number.MAX_VALUE);
                                              var minz = new Jyo.Vector3(minx);
                                              var maxz = new Jyo.Vector3(-Number.MAX_VALUE);

                                              var numPoints = 0;

                                              for (var i = 0, pt; i < points.length; i++) {
                                                  pt = points[i];
                                                  ++numPoints;

                                                  if (pt.x < minx.x) minx = pt;
                                                  if (pt.x > maxx.x) maxx = pt;
                                                  if (pt.y < miny.y) miny = pt;
                                                  if (pt.y > maxy.y) maxy = pt;
                                                  if (pt.z < minz.z) minz = pt;
                                                  if (pt.z > maxz.z) maxz = pt;
                                              }

                                              if (numPoints == 0) throw new Error("You should have at least one point in points.");

                                              var sqDistX = Jyo.Vector3.distanceSquared(maxx, minx);
                                              var sqDistY = Jyo.Vector3.distanceSquared(maxy, miny);
                                              var sqDistZ = Jyo.Vector3.distanceSquared(maxz, minz);

                                              var min = minx;
                                              var max = maxx;
                                              if (sqDistY > sqDistX && sqDistY > sqDistZ) {
                                                  max = maxy;
                                                  min = miny;
                                              }
                                              if (sqDistZ > sqDistX && sqDistZ > sqDistY) {
                                                  max = maxz;
                                                  min = minz;
                                              }

                                              var center = (min + max) * 0.5;
                                              var radius = Jyo.Vector3.distance(max, center);

                                              var sqRadius = radius * radius;
                                              for (var i = 0; i < points.length; i++) {
                                                  pt = points[i];
                                                  var diff = Jyo.Vector3.subtract(pt, center);
                                                  var sqDist = Jyo.Vector3.distanceSquared(diff, Jyo.Vector3.zero);
                                                  if (sqDist > sqRadius) {
                                                      var distance = Math.sqrt(sqDist);
                                                      var direction = Jyo.Vector3.divide(diff, distance);
                                                      var G = Jyo.Vector3.subtract(center, Jyo.Vector3.divide(radius, direction));
                                                      center = Jyo.Vector3.divide(Jyo.Vector3.add(G, pt), 2);
                                                      radius = Jyo.Vector3.distance(pt, center);
                                                      sqRadius = radius * radius;
                                                  }
                                              }

                                              return new Jyo.BoundingSphere(center, radius);
                                          });

    Jyo.BoundingSphere.prototype = new Jyo.Object({
        intersects: Jyo.overload().
                    add("Jyo.BoundingBox", function (box) {
                        /// <summary>相交检测</summary>
                        /// <param name="box" type="Jyo.BoundingBox">包围盒</param>
                        /// <returns type="Boolean" />

                        return box.intersects(this);
                    }).
                    add("Jyo.BoundingSphere", function (sphere) {
                        /// <summary>相交检测</summary>
                        /// <param name="sphere" type="Jyo.BoundingSphere">包围球</param>
                        /// <returns type="Boolean" />

                        return (Jyo.Vector3.distanceSquared(sphere.center, this.center) <= Math.pow(sphere.radius + this.radius, 2))
                    }).
                    add("Jyo.Ray", function (ray) {
                        /// <summary>相交检测</summary>
                        /// <param name="ray" type="Jyo.Ray">射线</param>
                        /// <returns type="Boolean" />

                        return ray.intersects(this);
                    }),
        transform: Jyo.overload().
                   add("Jyo.Matrix", function (matrix) {
                       /// <summary>变换</summary>
                       /// <param name="matrix" type="Jyo.Matrix">矩阵</param>
                       /// <returns type="Jyo.BoundingShpere" />

                       var sphere = new Jyo.BoundingSphere();
                       Jyo.Vector3.transform(this.center, matrix, sphere.center);
                       sphere.radius = this.radius * (Math.sqrt(Math.max(((matrix.m11 * matrix.m11) + (matrix.m12 * matrix.m12)) + (matrix.m13 * matrix.m13), Math.max(((matrix.m21 * matrix.m21) + (matrix.m22 * matrix.m22)) + (matrix.m23 * matrix.m23), ((matrix.m31 * matrix.m31) + (matrix.m32 * matrix.m32)) + (matrix.m33 * matrix.m33)))));
                       return sphere;
                   }).
                   add("Jyo.Matrix, Jyo.BoundingSphere", function (matrix, result) {
                       /// <summary>变换</summary>
                       /// <param name="matrix" type="Jyo.Matrix">矩阵</param>
                       /// <param name="result" type="Jyo.BoundingShpere">结果包围球</param> 

                       Jyo.Vector3.transform(this.center, matrix, result.center);
                       result.radius = this.radius * (Math.sqrt(Math.max(((matrix.m11 * matrix.m11) + (matrix.m12 * matrix.m12)) + (matrix.m13 * matrix.m13), Math.Max(((matrix.m21 * matrix.m21) + (matrix.m22 * matrix.m22)) + (matrix.m23 * matrix.m23), ((matrix.m31 * matrix.m31) + (matrix.m32 * matrix.m32)) + (matrix.m33 * matrix.m33)))));
                   }),
        transformWorld: Jyo.overload().
                        add("Jyo.Matrix", function (transform) {
                            /// <summary>世界变换</summary>
                            /// <param name="transform" type="Jyo.Matrix">矩阵</param>
                            /// <returns type="Jyo.BoundingShpere" />

                            var transformedSphere = new Jyo.BoundingSphere(Jyo.Vector3.zero, 0);
                            var scale3 = new Jyo.Vector3(this.radius, this.radius, this.radius);
                            Jyo.Vector3.transformNormal(scale3, transform);
                            transformedSphere.radius = Math.max(scale3.x, Math.max(scale3.y, scale3.z));
                            transformedSphere.center = new Jyo.Vector3();
                            Jyo.Vector3.transform(this.center, transform, transformedSphere.center);
                            return transformedSphere;
                        })
    });

})(window, document, Jyo);