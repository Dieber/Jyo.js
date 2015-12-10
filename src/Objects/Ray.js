(function (window, document, Jyo, undefined) {
    "use strict";

    Jyo.Ray = function () {
        /// <summary>射线构造函数</summary>
        /// <field name="position" type="Jyo.Vector3">射线位置</field>
        /// <field name="direction" type="Jyo.Vector3">射线方向</field>
        /// <returns type="Jyo.BoundingSphere" />

        constructor.apply(this, arguments);
    };

    var constructor = Jyo.overload().
                      add("Jyo.Vector3, Jyo.Vector3", function (position, direction) {
                          /// <summary>射线构造函数</summary>
                          /// <param name="position" type="Jyo.Vector3">射线起点坐标向量</param>
                          /// <param name="direction" type="Jyo.Vector3">射线射向坐标向量</param>
                          /// <returns type="Jyo.Ray" />

                          this.position = position;
                          this.direction = direction;
                      });

    var EPSILON = 1e-6;

    Jyo.Ray.prototype = new Object({
        intersects: Jyo.overload().
                    add("Jyo.BoundingBox", function (box) {
                        /// <summary>判断是否相交</summary>
                        /// <param name="box" type="Jyo.BoundingBox">包围盒</param>
                        /// <returns type="Number?" />

                        var tMin = null,
                            tMax = null;

                        var directionX = this.direction.x,
                            directionY = this.direction.y,
                            directionZ = this.direction.z,
                            positionX = this.position.x,
                            positionY = this.position.y,
                            positionZ = this.position.z;

                        if (Math.abs(directionX) < EPSILON) {
                            if (positionX < box.min.x || positionX > box.max.x) {
                                return null;
                            }
                        } else {
                            tMin = (box.min.x - positionX) / directionX;
                            tMax = (box.max.x - positionX) / directionX;

                            if (tMin > tMax) {
                                var temp = tMin;
                                tMin = tMax;
                                tMax = temp;
                            }
                        }

                        if (Math.abs(directionY) < EPSILON) {
                            if (positionY < box.min.y || positionY > box.max.y) {
                                return null;
                            }
                        }
                        else {
                            var tMinY = (box.min.y - positionY) / directionY;
                            var tMaxY = (box.max.y - positionY) / directionY;

                            if (tMinY > tMaxY) {
                                var temp = tMinY;
                                tMinY = tMaxY;
                                tMaxY = temp;
                            }

                            if ((!isNaN(tMin) && tMin > tMaxY) || (!isNaN(tMax) && tMinY > tMax)) {
                                return null;
                            }

                            if (isNaN(tMin) || tMinY > tMin) tMin = tMinY;
                            if (isNaN(tMax) || tMaxY < tMax) tMax = tMaxY;
                        }

                        if (Math.abs(directionZ) < EPSILON) {
                            if (positionZ < box.min.z || positionZ > box.max.z) {
                                return null;
                            }
                        } else {
                            var tMinZ = (box.min.z - positionZ) / directionZ;
                            var tMaxZ = (box.max.z - positionZ) / directionZ;

                            if (tMinZ > tMaxZ) {
                                var temp = tMinZ;
                                tMinZ = tMaxZ;
                                tMaxZ = temp;
                            }

                            if ((!isNaN(tMin) && tMin > tMaxZ) || (!isNaN(tMax) && tMinZ > tMax)) {
                                return null;
                            }

                            if (isNaN(tMin) || tMinZ > tMin) tMin = tMinZ;
                            if (isNaN(tMax) || tMaxZ < tMaxZ) tMax = tMaxZ;
                        }

                        if ((!isNaN(tMin) && tMin < 0) && tMax > 0) {
                            return 0;
                        }

                        if (tMin < 0) return null;

                        return tMin;
                    }).
                    add("Jyo.BoundingSphere", function (sphere) {
                        /// <summary>判断是否相交</summary>
                        /// <param name="sphere" type="Jyo.BoundingSphere">包围球对象</param>
                        /// <returns type="Number?" />

                        var difference = new Jyo.Vector3();
                        Jyo.Vector3.subtract(sphere.center, this.position, difference);

                        var differenceLengthSquared = Jyo.Vector3.distanceSquared(difference, Jyo.Vector3.zero);
                        var sphereRadiusSquared = sphere.radius * sphere.radius;

                        var distanceAlongRay;

                        if (differenceLengthSquared < sphereRadiusSquared) {
                            return 0;
                        }

                        distanceAlongRay = Jyo.Vector3.dot(this.direction, difference);

                        if (distanceAlongRay < 0) {
                            return null;
                        }

                        var dist = sphereRadiusSquared + distanceAlongRay * distanceAlongRay - differenceLengthSquared;

                        return (dist < 0) ? null : distanceAlongRay - Math.sqrt(dist);
                    })
    });

})(window, document, Jyo);