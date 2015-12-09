(function (window, document, Jyo, undefiend) {

    // 两个数之间的最小间隔
    Number.EPSILON = Number.EPSILON || 2.220446049250313e-16;

    Number.withinEpsilon = function (a, b) {
        /// <summary>是否在Epsilon范围内</summary>
        /// <param name="a" type="Number">测试值1</param>
        /// <param name="b" type="Number">测试值2</param>
        /// <returns type="Boolean" />

        var num = a - b;
        return ((-1.401298E-45 <= num) && (num <= Number.EPSILON));
    };

    Number.getSingle = function () {
        var t = new Uint8Array(4);
        var dv = new DataView(t.buffer);
        return function (value) {
            /// <summary>获取单精度浮点数</summary>
            /// <param name="value" type="Number">要进行转换的数</param>
            /// <returns type="Number" />

            dv.setUint32(0, value);
            return dv.getFloat32(0);
        };
    }();

    Number.prototype.prefixInteger = function (length) {
        /// <summary>用0补全位数</summary>
        /// <param name="length" type="Number">要补全的位数</param>
        /// <returns type="Number" />

        return (this / Math.pow(10, length)).toFixed(length).substr(2);
    };

    Number.prototype.toRadian = function () {
        /// <summary>角度转弧度</summary>
        /// <returns type="Number" />

        return this * Math.PI / 180;
    };

    Number.prototype.toDegrees = function () {
        /// <summary>弧度转角度</summary>
        /// <returns type="Number" />

        return this * 180 / Math.PI;
    };

    Number.prototype.toUInt = function () {
        /// <summary>转换为32位无符号整数</summary>
        /// <returns type="Number" />

        return this < 0 ? this + 4294967296 : this;
    };

    Number.prototype.bytes32 = function () {
        /// <summary>转换为32位bytes</summary>
        /// <returns type="Array" />

        return [(this >>> 24) & 0xff, (this >>> 16) & 0xff, (this >>> 8) & 0xff, this & 0xff];
    };

    Number.prototype.bytes32sw = function () {
        /// <summary>转换为倒置32位bytes</summary>
        /// <returns type="Array" />

        return [this & 0xff, (this >>> 8) & 0xff, (this >>> 16) & 0xff, (this >>> 24) & 0xff];
    };

    Number.prototype.bytes16 = function () {
        /// <summary>转换为16位bytes</summary>
        /// <returns type="Array" />

        return [(this >>> 8) & 0xff, this & 0xff];
    };

    Number.prototype.bytes16sw = function () {
        /// <summary>转换为倒置16位bytes</summary>
        /// <returns type="Array" />

        return [this & 0xff, (this >>> 8) & 0xff];
    };

    Array.prototype.shuffle = function () {
        /// <summary>洗牌</summary>
        /// <returns type="Array" />

        for (var i = this.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = this[i];
            this[i] = this[j];
            this[j] = temp;
        }
        return this;
    };

    Array.prototype.pdf2cdf = function () {
        /// <summary>将概率密度转换为累计分布</summary>
        /// <returns type="Array" />

        var cdf = this.slice();

        for (var i = 1; i < cdf.length - 1; i++) cdf[i] += cdf[i - 1];

        // Force set last cdf to 1, preventing floating-point summing error in the loop.
        cdf[cdf.length - 1] = 1;

        return cdf;
    };

    Array.prototype.discreteSampling = function () {
        /// <summary>离散采样</summary>
        /// <returns type="Number" />

        var y = Math.random();
        for (var x in this) {
            if (y < this[x]) return x;
        }

        return -1; // should never runs here, assuming last element in cdf is 1
    };

    Array.prototype.random = function (probabilityTable) {
        /// <summary>随机抽取元素</summary>
        /// <param name="probabilityTable" type="Array" optional="true">概率数组(长度必须和本数组一致)</param>
        /// <returns type="Object" />

        if (probabilityTable != undefined &&
            probabilityTable instanceof Array) {
            var targetCdf = probabilityTable.pdf2cdf();
            return this[targetCdf.discreteSampling()];
        } else {
            return this[Math.floor(Math.random() * this.length)];
        }
    };

    Array.prototype.insert = function (index, value) {
        /// <summary>插入项</summary>
        /// <param name="index" type="Number">索引</param>
        /// <param name="value" type="Object">元素</param>
        /// <returns type="Array" />

        if (index > this.length) index = this.length;
        if (index < -this.length) index = 0;
        if (index < 0) index = this.length + index;
        for (var i = this.length; i > index; i--) {
            this[i] = this[i - 1];
        }
        this[index] = value;
        return this;
    };

    Array.prototype.remove = function (index) {
        /// <summary>移除项</summary>
        /// <param name="index" type="Number">索引</param>
        /// <returns type="Array" />

        if (isNaN(index) || index > this.length) return;
        this.splice(index, 1);
    };

    Array.prototype.clear = function () {
        /// <summary>清空数组</summary>

        this.length = 0;
    };

    Array.prototype.adler32 = function (start, len) {
        /// <summary>计算Adler32校验和</summary>
        /// <param name="start" type="Number">起始位置</param>
        /// <param name="len" type="Number">长度</param>
        /// <returns type="Number" />

        switch (arguments.length) { case 0: start = 0; case 1: len = this.length - start; }
        var a = 1, b = 0;
        for (var i = 0; i < len; i++) {
            a = (a + this[start + i]) % 65521; b = (b + a) % 65521;
        }
        return ((b << 16) | a).toUInt();
    };

    Array.prototype.crc32 = function (start, len) {
        /// <summary>计算CRC32校验和</summary>
        /// <param name="start" type="Number">起始位置</param>
        /// <param name="len" type="Number">长度</param>
        /// <returns type="Number" />

        switch (arguments.length) { case 0: start = 0; case 1: len = this.length - start; }
        var table = arguments.callee.crctable;
        if (!table) {
            table = [];
            var c;
            for (var n = 0; n < 256; n++) {
                c = n;
                for (var k = 0; k < 8; k++)
                    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
                table[n] = c.toUInt();
            }
            arguments.callee.crctable = table;
        }
        var c = 0xffffffff;
        for (var i = 0; i < len; i++) c = table[(c ^ this[start + i]) & 0xff] ^ (c >>> 8);
        return (c ^ 0xffffffff).toUInt();
    };

    String.format = function (str, args) {
        /// <summary>格式化字符串</summary>
        /// <param name="str" type="String">要格式化的字符串</param>
        /// <param name="args" type="[..]">其余参数</param>
        /// <returns type="String" />

        var tempStr = str,
            reg;
        for (var i = 0; i < arguments.length; i++) {
            reg = new RegExp("\\{" + i + "\\}", "g");
            tempStr = tempStr.replace(reg, arguments[i + 1]);
        }
        return tempStr;
    };

    String.prototype.cutString = function (number) {
        /// <summary>按字数分隔字符串</summary>
        /// <param name="number" type="Number">字数</param>
        /// <returns type="Array">

        var str = this;
        var str1 = "";
        var strs = [];
        var num = 0;
        if (str.length / number > 0)
            num = str.length / number + 1;
        else
            num = str.length / number;
        for (var i = 0 ; i < num ; i++) {
            str1 = str.substr(0, number);
            str = str.substr(number, str.length);
            strs[i] = str1;
        }
        return strs.slice(0, strs.length - 1);
    };

    // 两倍PI
    Math.TWO_PI = 2.0 * Math.PI;

    // PI的一半
    Math.HALF_PI = Math.PI / 2.0;

    Math.clamp = function (value, min, max) {
        /// <summary>范围限制</summary>
        /// <param name="value" type="Number">要收紧的数</param>
        /// <param name="min" type="Number">最小值</param>
        /// <param name="max" type="Number">最大值</param>
        /// <returns type="Number" />

        return this.max(this.min(value, max), min);
    };

    Math.lerp = function (value1, value2, amount) {
        /// <summary>线性插值</summary>
        /// <param name="value1" type="Number">第一个值</param>
        /// <param name="value2" type="Number">第二个值</param>
        /// <param name="amount" type="Number">量</param>
        /// <returns type="Number" />

        return value1 + (value2 - value1) * amount;
    };

    Math.barycentric = function (value1, value2, value3, amount1, amount2) {
        /// <summary>重心计算</summary>
        /// <param name="value1" type="Number">第一个值</param>
        /// <param name="value2" type="Number">第二个值</param>
        /// <param name="value3" type="Number">第三个值</param>
        /// <param name="amount1" type="Number">第一个量</param>
        /// <param name="amount2" type="Number">第二个量</param>
        /// <returns type="Number" />

        return value1 + (value2 - value1) * amount1 + (value3 - value1) * amount2;
    };

    Math.catmullRom = function (value1, value2, value3, value4, amount) {
        /// <summary>CatmullRom样条插值</summary>
        /// <param name="value1" type="Number">第一个值</param>
        /// <param name="value2" type="Number">第二个值</param>
        /// <param name="value3" type="Number">第三个值</param>
        /// <param name="amount" type="Number">量</param>
        /// <returns type="Number" />

        var amountSquared = amount * amount;
        var amountCubed = amountSquared * amount;
        return (0.5 * (2.0 * value2 + (value3 - value1) * amount + (2.0 * value1 - 5.0 * value2 + 4.0 * value3 - value4) * amountSquared + (3.0 * value2 - value1 - 3.0 * value3 + value4) * amountCubed));
    };

    Math.hermite = function (value1, tangent1, value2, tangent2, amount) {
        /// <summary>艾米插值</summary>
        /// <param name="value1" type="Number">第一个值</param>
        /// <param name="tangent1" type="Number">第一个正切</param>
        /// <param name="value2" type="Number">第二个值</param>
        /// <param name="value2" type="Number">第二个正切</param>
        /// <param name="amount" type="Number">量</param>
        /// <returns type="Number" />

        switch (amount) {
            case 0:
                return value1;
            case 1:
                return value2;
        }

        var v1 = value1, v2 = value2, t1 = tangent1, t2 = tangent2, s = amount;
        var sCubed = s * s * s;
        var sSquared = s * s;
        return (2 * v1 - 2 * v2 + t2 + t1) * sCubed + (3 * v2 - 3 * v1 - 2 * t1 - t2) * sSquared + t1 * s + v1;
    };

    Math.smoothStep = function (value1, value2, amount) {
        /// <summary>返回0和1之间平滑的艾米插值</summary>
        /// <param name="value1" type="Number">第一个值</param>
        /// <param name="value2" type="Number">第二个值</param>
        /// <param name="amount" type="Number">量</param>
        /// <returns type="Number" />

        return Math.hermite(value1, 0, value2, 0, Math.clamp(amount, 0, 1));
    };

    Math.isPowerOfTwo = function (value) {
        /// <summary>是否为2的幂</summary>
        /// <param name="value" type="Number">要判断的值</param>
        /// <returns type="Boolean" />

        return (value > 0) && ((value & (value - 1)) === 0);
    };

    Math.IEEERemainder = function (x, y) {
        /// <summary>返回一指定数字被另一指定数字相除的余数</summary>
        /// <param name="x" type="Number">被除数</param>
        /// <param name="y" type="Number">除数</param>
        /// <returns type="Number" />

        if (y === 0.0)
            return NaN;

        var result = x - y * this.round(x / y);
        if (result !== 0.0)
            return result;

        if (x <= 0.0)
            return -0;
        else
            return 0;
    };

    Math.wrapAngle = function wrapAngle(angle) {
        /// <summary>卷角</summary>
        /// <param name="angle" type="Number">角度</param>
        /// <returns type="Number" />

        var pi2 = Math.TWO_PI;

        angle = this.IEEERemainder(angle, pi2);

        if (angle <= -this.PI)
            angle += pi2;
        else if (angle > this.PI)
            angle -= pi2;

        return angle;
    };

    Math.fround = Math.fround || function (x) {
        /// <summary>将数字转换为离它最近的单精度浮点数形式的数字</summary>
        /// <param name="x" type="Number">任意的数字</param>
        /// <returns type="Number" />

        return new Float32Array([x])[0];
    };

    Math.getRotatePoint = function (centerX, centerY, x, y, angle) {
        /// <summary>获取旋转点向量</summary>
        /// <param name="centerX" type="Number">旋转中心点X坐标</param>
        /// <param name="centerY" type="Number">旋转中心点Y坐标</param>
        /// <param name="x" type="Number">要旋转的点X坐标</param>
        /// <param name="y" type="Number">要旋转的点Y坐标</param>
        /// <param name="angle" type="Number">要旋转的角度</param>
        /// <returns type="Object" />

        angle += 90;
        angle = -angle;
        var angleHude = angle.toRadian();
        return {
            x: (x - centerX) * Math.cos(angleHude) + (y - centerY) * Math.sin(angleHude) + centerX,
            y: -(x - centerX) * Math.sin(angleHude) + (y - centerY) * Math.cos(angleHude) + centerY
        };
    };

    Math.getBezierCurvePoints = function (fromX, fromY, cpX, cpY, toX, toY) {
        /// <summary>获取贝塞尔曲线点数组</summary>
        /// <returns type="Array" />

        var xa, ya, xb, yb, x, y, n = 20, points = [];

        function getPt(n1, n2, perc) {
            var diff = n2 - n1;
            return n1 + (diff * perc);
        }

        var j = 0;
        for (var i = 0; i <= n; i++) {
            j = i / n;

            // The Green Line
            xa = getPt(fromX, cpX, j);
            ya = getPt(fromY, cpY, j);
            xb = getPt(cpX, toX, j);
            yb = getPt(cpY, toY, j);

            // The Black Dot
            x = getPt(xa, xb, j);
            y = getPt(ya, yb, j);

            points.push(x, y);
        }
        return points;
    };

    Math.distance = function () {
        /// <signature>
        /// <summary>计算距离</summary>
        /// <param name="p1" type="Number">坐标1</param>
        /// <param name="p2" type="Number">坐标2</param>
        /// <returns type="Number" />
        /// </signature>
        /// <signature>
        /// <summary>计算距离</summary>
        /// <param name="p1X" type="Number">向量1X坐标</param>
        /// <param name="p1Y" type="Number">向量1Y坐标</param>
        /// <param name="p2X" type="Number">向量2X坐标</param>
        /// <param name="p2Y" type="Number">向量2Y坐标</param>
        /// <returns type="Number" />
        /// </signature>
        /// <signature>
        /// <summary>计算距离</summary>
        /// <param name="p1X" type="Number">向量1X坐标</param>
        /// <param name="p1Y" type="Number">向量1Y坐标</param>
        /// <param name="p1Z" type="Number">向量1Z坐标</param>
        /// <param name="p2X" type="Number">向量2X坐标</param>
        /// <param name="p2Y" type="Number">向量2Y坐标</param>
        /// <param name="p2Z" type="Number">向量2Z坐标</param>
        /// <returns type="Number" />
        /// </signature>

        switch (arguments.length) {
            case 2:
                return Math.abs(arguments[0] - arguments[1]);
                break;
            case 4:
                var dx = arguments[2] - arguments[0],
                    dy = arguments[3] - arguments[1];
                return Math.sqrt(dx * dx + dy * dy);
            case 6:
                var dx = arguments[3] - arguments[0],
                    dy = arguments[4] - arguments[1],
                    dz = arguments[5] - arguments[2];
                return Math.sqrt(dx * dx + dy * dy + dz * dz);
            default:
                return NaN;
        }
    };

    Math.accelerationVector = function (fromX, fromY, toX, toY, speed) {
        /// <summary>计算加速度向量</summary>
        /// <param name="fromX" type="Number">向量1X坐标</param>
        /// <param name="fromY" type="Number">向量1Y坐标</param>
        /// <param name="toX" type="Number">向量2X坐标</param>
        /// <param name="toY" type="Number">向量2Y坐标</param>
        /// <param name="speed" type="Number">速度</param>
        /// <returns type="Object" />

        var angle = Math.getPointingRotation(fromX, fromY, toX, toY);

        return {
            x: Math.cos(angle) * speed,
            y: Math.sin(angle) * speed
        };
    };

    Math.getPointingRotation = function (originX, originY, targetX, targetY) {
        /// <summary>获取指向旋转角度值</summary>
        /// <param name="originX" type="Number">源向量X坐标</param>
        /// <param name="originY" type="Number">源向量Y坐标</param>
        /// <param name="targetX" type="Number">目标向量X坐标</param>
        /// <param name="targetY" type="Number">目标向量Y坐标</param>
        /// <returns type="Number" />

        return Math.atan2(targetY - originY, targetX - originX);
    };

    Math.gcd = function (a, b) {
        /// <summary>求最大公约数</summary>
        /// <param name="a" type="Number">数字1</param>
        /// <param name="b" type="Number">数字2</param>
        /// <returns type="Number" />

        if (b > a) return gcd(b, a)
        if (b === 0) return a
        return Math.gcd(b, a % b)
    };

    Math.lcm = function (a, b) {
        /// <summary>求最小公倍数</summary>
        /// <param name="a" type="Number">数字1</param>
        /// <param name="b" type="Number">数字2</param>
        /// <returns type="Number" />

        a = Math.max(a, [b, b = Math.min(a, b)][0]);
        return function (p) {
            while (b != 0) a = [b, b = Math.max(a, b) % b][0];
            return p / a;
        }(a * b);
    };

    Math.arctg = function (value) {
        /// <summary>反正切</summary>
        /// <param name="value" type="Number">计算值</param>
        /// <returns type="Number" />

        return Math.atan2(value) / Math.PI * 180;
    };

    if ("DataView" in window) {
        (DataView.prototype.getString = function (pos, length) {
            /// <summary>获取特定字符串</summary>
            /// <param name="pos" type="Number">起始点</param>
            /// <param name="length" type="Number">获取长度</param>
            /// <returns type="String" />

            var str = "";
            var u8 = new Uint8Array(1);
            for (var i = pos; i < pos + length; i++) {
                u8[0] = this.getUint8(i);
                if (u8[0] == 0) break;
                str += String.fromCharCode(u8[0]);
            }
            return str;
        });

        var getUint32 = DataView.prototype.getUint32;
        DataView.prototype.getUint32 = function (offset) {
            /// <summary>以大端字节序输出32位无符号整数</summary>
            /// <param nmae="offset" type="Number">数据位置偏移</param>

            if (DataView.littleEndian) {
                return getUint32.call(this, offset, true);
            }
            return getUint32.call(this, offset);
        };

        // 是否为小端Bytes
        DataView.littleEndian = (function () {
            var buffer = new ArrayBuffer(2);
            new DataView(buffer).setInt16(0, 256, true);
            return new Int16Array(buffer)[0] === 256;
        })();

        DataView.prototype.read7BitEncodedInt = function (pos) {
            /// <summary>读取7Bit编码整数</summary>
            /// <param name="pos" type="Number">数据位置偏移</param>

            var result = 0;
            var bitsRead = 0;
            var value;

            do {
                value = this.getUint8(pos);
                result |= (value & 0x7f) << bitsRead;
                bitsRead += 7;
            }
            while (value & 0x80);

            return result;
        };

    }

})(window, document, Jyo);