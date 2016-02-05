(function (window, document, Jyo, undefined) {
    "use strict";

    Jyo.BoundingBox = function () {
        /// <summary>包围盒构造函数</summary>
        /// <returns type="Jyo.BoundingBox" />

        Jyo.Object.call(this);
        constructor.apply(this, arguments);
    };

    Object.defineProperty(Jyo.BoundingBox, "cornerCount", {
        get: function () {
            return 8;
        }
    });

    var constructor = Jyo.overload().
                      add(null, function () {
                          /// <summary>包围盒构造函数</summary>

                          this.min = new Jyo.Vector3();
                          this.max = new Jyo.Vector3();
                      }).
                      add("Jyo.Vector3, Jyo.Vector3", function (min, max) {
                          /// <summary>包围盒构造函数</summary>
                          /// <param name="min" type="Jyo.Vector3">最小三维向量</param>
                          /// <param name="max" type="Jyo.Vector3">最大三维向量</param>
                          /// <returns type="Jyo.BoundingSphere" />

                          this.min = min;
                          this.max = max;
                      });

    var readonly = {
        get maxVector3() {
            return new Jyo.Vector3(Number.MAX_VALUE);
        },
        get minVector3() {
            return new Jyo.Vector3(Number.MIN_VALUE);
        }
    };

    Jyo.BoundingBox.createFromPoints = Jyo.overload().
                                       add("Array", function (points) {
                                           /// <summary>根据顶点数组生成包围盒</summary>
                                           /// <param name="points" type="Array<Vector3>">顶点数组</param>
                                           /// <returns type="Jyo.BoundingBox" />

                                           var empty = true;
                                           var minVec = readonly.maxVector3;
                                           var maxVec = readonly.minVector3;
                                           for (var i = 0, ptVector; i < points.length; i++) {
                                               ptVector = points[i];

                                               minVec.x = (minVec.x < ptVector.x) ? minVec.x : ptVector.x;
                                               minVec.y = (minVec.y < ptVector.y) ? minVec.y : ptVector.y;
                                               minVec.z = (minVec.z < ptVector.z) ? minVec.z : ptVector.z;

                                               maxVec.x = (maxVec.x > ptVector.x) ? maxVec.x : ptVector.x;
                                               maxVec.y = (maxVec.y > ptVector.y) ? maxVec.y : ptVector.y;
                                               maxVec.z = (maxVec.z > ptVector.z) ? maxVec.z : ptVector.z;

                                               empty = false;
                                           }
                                           if (empty) throw new Error("Argument exception");

                                           return new Jyo.BoundingBox(minVec, maxVec);
                                       });

    Jyo.BoundingBox.createFromSphere = Jyo.overload().
                                       add("Jyo.BoundingSphere", function (sphere) {
                                           /// <summary>从包围球创建包围盒</summary>
                                           /// <param name="sphere" type="Jyo.BoundingSphere">包围球对象</param>
                                           /// <returns type="Jyo.BoundingBox" />

                                           var result = new Jyo.BoundingBox();
                                           Jyo.BoundingBox.createFromSphere(sphere, result);
                                           return result;
                                       }).
                                       add("Jyo.BoundingSphere, Jyo.BoundingBox", function (sphere, result) {
                                           /// <summary>从包围球创建包围盒</summary>
                                           /// <param name="sphere" type="Jyo.BoundingSphere">包围球对象</param>
                                           /// <param name="result" type="Jyo.BoundingBox">结果要保存到的包围盒</param>

                                           var corner = new Jyo.Vector3(sphere.radius);
                                           Jyo.Vector3.subtract(sphere.center, corner, result.min);
                                           Jyo.Vector3.add(sphere.center, corner, result.max);
                                       });

    Jyo.BoundingBox.createMerged = Jyo.overload().
                                   add("Jyo.BoundingBox, Jyo.BoundingBox", function (original, additional) {
                                       /// <summary>创建合并后的包围盒</summary>
                                       /// <param name="original" type="Jyo.BoundingBox">源包围盒</param>
                                       /// <param name="additional" type="Jyo.BoundingBox">要添加的包围盒</param>
                                       /// <returns type="Jyo.BoundingBox" />

                                       var result = new Jyo.BoundingBox();
                                       Jyo.BoundingBox.createMerged(original, additional, result);
                                       return result;
                                   }).
                                   add("Jyo.BoundingBox, Jyo.BoundingBox, Jyo.BoundingBox", function (original, additional, result) {
                                       /// <summary>创建合并后的包围盒</summary>
                                       /// <param name="original" type="Jyo.BoundingBox">源包围盒</param>
                                       /// <param name="additional" type="Jyo.BoundingBox">要添加的包围盒</param>
                                       /// <param name="result" type="Jyo.BoundingBox">结果要保存到的包围盒</param>

                                       result.min.x = Math.min(original.min.x, additional.min.x);
                                       result.min.y = Math.min(original.min.y, additional.min.y);
                                       result.min.z = Math.min(original.min.z, additional.min.z);
                                       result.max.x = Math.max(original.max.x, additional.max.x);
                                       result.max.y = Math.max(original.max.y, additional.max.y);
                                       result.max.z = Math.max(original.max.z, additional.max.z);
                                   });

    Jyo.BoundingBox.prototype = Object.create(Jyo.Object.prototype);
    Jyo.BoundingBox.prototype.constructor = Jyo.BoundingBox;
    
    var boundingBoxFns = {
        getCorners: Jyo.overload().
                    add(null, function () {
                        /// <summary>取得拐角数组</summary>
                        /// <returns type="Array" />

                        return [
                            new Jyo.Vector3(this.min.x, this.max.y, this.max.z),
                            new Jyo.Vector3(this.max.x, this.max.y, this.max.z),
                            new Jyo.Vector3(this.max.x, this.min.y, this.max.z),
                            new Jyo.Vector3(this.min.x, this.min.y, this.max.z),
                            new Jyo.Vector3(this.min.x, this.max.y, this.min.z),
                            new Jyo.Vector3(this.max.x, this.max.y, this.min.z),
                            new Jyo.Vector3(this.max.x, this.min.y, this.min.z),
                            new Jyo.Vector3(this.min.x, this.min.y, this.min.z)
                        ];
                    }).
                    add("Array", function (corners) {
                        /// <summary>取得拐角数组</summary>
                        /// <param name="corners" type="Array">保存到的数组</param>

                        if (corners.length < 8) {
                            throw new RangeError("Not Enought Corners");
                        }

                        corners[0].x = this.min.x;
                        corners[0].y = this.max.y;
                        corners[0].z = this.max.z;
                        corners[1].x = this.max.x;
                        corners[1].y = this.max.y;
                        corners[1].z = this.max.z;
                        corners[2].x = this.max.x;
                        corners[2].y = this.min.y;
                        corners[2].z = this.max.z;
                        corners[3].x = this.min.x;
                        corners[3].y = this.min.y;
                        corners[3].z = this.max.z;
                        corners[4].x = this.min.x;
                        corners[4].y = this.max.y;
                        corners[4].z = this.min.z;
                        corners[5].x = this.max.x;
                        corners[5].y = this.max.y;
                        corners[5].z = this.min.z;
                        corners[6].x = this.max.x;
                        corners[6].y = this.min.y;
                        corners[6].z = this.min.z;
                        corners[7].x = this.min.x;
                        corners[7].y = this.min.y;
                        corners[7].z = this.min.z;
                    }),
        intersects: Jyo.overload().
                    add("Jyo.BoundingBox", function (box) {
                        /// <summary>相交检测</summary>
                        /// <param name="box" type="Jyo.BoundingBox">包围盒对象</param>
                        /// <returns type="Boolean" />

                        if ((this.max.x >= box.min.x) && (this.min.x <= box.max.x)) {
                            if ((this.max.y < box.min.y) || (this.min.y > box.max.y)) {
                                return false;
                            }

                            return (this.max.z >= box.min.z) && (this.min.z <= box.max.z);
                        }

                        return false
                    }).
                    add("Jyo.BoundingSphere", function (sphere) {
                        /// <summary>相交检测</summary>
                        /// <param name="sphere" type="Jyo.BoundingSphere">包围球对象</param>
                        /// <returns type="Boolean" />

                        if (sphere.center.x - this.min.x > sphere.radius &&
                            sphere.center.y - this.min.y > sphere.radius &&
                            sphere.center.z - this.min.z > sphere.radius &&
                            this.max.x - sphere.center.x > sphere.radius &&
                            this.max.y - sphere.center.y > sphere.radius &&
                            this.max.z - sphere.center.z > sphere.radius)
                            return true;

                        var dmin = 0;

                        if (sphere.center.x - this.min.x <= sphere.radius)
                            dmin += (sphere.center.x - this.min.x) * (sphere.center.x - this.min.x);
                        else if (this.max.X - sphere.center.x <= sphere.radius)
                            dmin += (sphere.center.x - this.max.x) * (sphere.center.x - this.max.x);

                        if (sphere.center.y - this.min.y <= sphere.radius)
                            dmin += (sphere.center.y - this.min.y) * (sphere.center.y - this.min.y);
                        else if (this.max.y - sphere.center.y <= sphere.radius)
                            dmin += (sphere.center.y - this.max.y) * (sphere.center.y - this.max.y);

                        if (sphere.center.z - this.min.z <= sphere.radius)
                            dmin += (sphere.center.z - this.min.z) * (sphere.center.z - this.min.z);
                        else if (this.max.z - sphere.center.z <= sphere.radius)
                            dmin += (sphere.center.z - this.max.z) * (sphere.center.z - this.max.z);

                        if (dmin <= sphere.radius * sphere.radius)
                            return true;

                        return false;
                    }).
                    add("Jyo.Ray", function (ray) {
                        return ray.intersects(this);
                    })
    };
    
    for (var i in boundingBoxFns) {
        Jyo.BoundingBox.prototype[i] = boundingBoxFns[i];
    }

})(window, document, Jyo);