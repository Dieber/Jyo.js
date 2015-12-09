(function (window, document, Jyo, undefined) {
    "use strict";

    Jyo.Color = function () {
        /// <signature>
        /// <summary>颜色构造函数</summary>
        /// <returns type="Jyo.Color"></returns>
        /// </signature>
        /// <signature>
        /// <summary>颜色构造函数</summary>
        /// <param name="color" type="Jyo.Color">颜色对象</param>
        /// <returns type="Jyo.Color"></returns>
        /// </signature>
        /// <signature>
        /// <summary>颜色构造函数</summary>
        /// <param name="colorStr" type="String">颜色值</param>
        /// <returns type="Jyo.Color"></returns>
        /// </signature>
        /// <signature>
        /// <summary>颜色构造函数</summary>
        /// <param name="colorInt" type="Number">十进制颜色值</param>
        /// <returns type="Jyo.Color"></returns>
        /// </signature>
        /// <signature>
        /// <summary>颜色构造函数</summary>
        /// <param name="r" type="Number">红色值</param>
        /// <param name="g" type="Number">绿色值</param>
        /// <param name="b" type="Number">蓝色值</param>
        /// <returns type="Jyo.Color"></returns>
        /// </signature>
        /// <signature>
        /// <summary>颜色构造函数</summary>
        /// <param name="r" type="Number">红色值</param>
        /// <param name="g" type="Number">绿色值</param>
        /// <param name="b" type="Number">蓝色值</param>
        /// <param name="a" type="Number">Alpha值</param>
        /// <returns type="Jyo.Color"></returns>
        /// </signature>

        constructor.apply(this, arguments);
    };

    var SAMPLE_IMAGE_SIZE_BASE = 100;
    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');
    var reList = {
        hex: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
        yuv: /^yuv\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i,
        rgb: /^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*([.\d]+))?\s*\)$/i,
        hsl: /^hsla?\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%(?:\s*,\s*([.\d]+))?\s*\)$/i
    };

    var constructor = Jyo.overload().
                                        add(null, function () {
                                            /// <summary>颜色构造函数</summary>
                                            /// <returns type="Jyo.Color"></returns>

                                            constructor.call(this, 0, 0, 0, 1);
                                        }).
                                        add("Jyo.Color", function (color) {
                                            /// <summary>颜色构造函数</summary>
                                            /// <param name="color" type="Jyo.Color">颜色对象</param>
                                            /// <returns type="Jyo.Color"></returns>

                                            constructor.call(this, color.red, color.green, color.blue, color.alpha);
                                        }).
                                        add("String", function (colorStr) {
                                            /// <summary>颜色构造函数</summary>
                                            /// <param name="colorStr" type="String">颜色值</param>
                                            /// <returns type="Jyo.Color"></returns>

                                            var lowerCase = colorStr.toLowerCase();

                                            var hex, rgb, hsl, yuv;

                                            if (colors[lowerCase] instanceof Jyo.Color) {
                                                // 从颜色表中获取颜色值

                                                constructor.call(this, colors[lowerCase]);
                                            } else if ((hex = lowerCase.match(reList.hex)) && (hex = hex[1])) {
                                                // 检查是否为HEX值

                                                hex = hex.length == 3 ? [hex[0], hex[0], hex[1], hex[1], hex[2], hex[2]].join("") : hex;
                                                constructor.call(this, parseInt(hex, 16));
                                            } else if ((yuv = lowerCase.match(reList.yuv))) {
                                                // 检查是否为YUV值

                                                constructor.call(this,
                                                                 Math.clamp((yuv[1] & 255) + 1.4075 * ((yuv[3] & 255) - 128), 0, 255),
                                                                 Math.clamp((yuv[1] & 255) - 0.3455 * ((yuv[2] & 255) - 128) - 0.7168 * ((yuv[3] & 255) - 128), 0, 255),
                                                                 Math.clamp((yuv[1] & 255) + 1.779 * ((yuv[2] & 255) - 128), 0, 255));
                                            } else if ((rgb = lowerCase.match(reList.rgb))) {
                                                // 检查是否为RGB或RGBA值

                                                if (rgb[4] !== undefined) constructor.call(this, +rgb[1], +rgb[2], +rgb[3], +rgb[4]);
                                                else constructor.call(this, +rgb[1], +rgb[2], +rgb[3]);
                                            } else if ((hsl = lowerCase.match(reList.hsl))) {
                                                // 检查是否为HSL或HSLA值

                                                var r, g, b, a = hsl[4] !== undefined ? +hsl[4] : 1;
                                                var h = +hsl[1] / 360, s = +hsl[2] / 100, l = +hsl[3] / 100;
                                                if (s == 0) {
                                                    r = g = b = l;
                                                } else {
                                                    var hue2rgb = function (p, q, t) {
                                                        if (t < 0) t += 1;
                                                        if (t > 1) t -= 1;
                                                        if (t < 1 / 6) return p + (q - p) * 6 * t;
                                                        if (t < 1 / 2) return q;
                                                        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                                                        return p;
                                                    };
                                                    var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
                                                    var p = 2 * l - q;
                                                    r = hue2rgb(p, q, h + 1 / 3);
                                                    g = hue2rgb(p, q, h);
                                                    b = hue2rgb(p, q, h - 1 / 3);
                                                }
                                                constructor.call(this, Math.round(r * 255), Math.round(g * 255), Math.round(b * 255), a);
                                            }
                                        }).
                                        add("Jyo.Xnb", function (xnb) {
                                            /// <summary>颜色构造函数</summary>
                                            /// <param name="xnb" type="Jyo.Xnb">Xnb图像数据</param>
                                            /// <returns type="Jyo.Color"></returns>

                                            if (xnb.type != "image") return colors.black;
                                            var img = xnb.object;
                                            var sampleImageWidth;
                                            var sampleImageHeight;

                                            if (img.height > img.width) {
                                                sampleImageWidth = Math.floor(SAMPLE_IMAGE_SIZE_BASE * window.devicePixelRatio);
                                                sampleImageHeight = Math.floor(sampleImageWidth * (img.height / img.width));
                                            } else {
                                                sampleImageHeight = Math.floor(SAMPLE_IMAGE_SIZE_BASE * window.devicePixelRatio);
                                                sampleImageWidth = Math.floor(sampleImageHeight * (img.width / img.height));
                                            }

                                            canvas.width = img.width;
                                            canvas.height = img.height;

                                            context.drawImage(img, 0, 0, img.width, img.height);

                                            var data = context.getImageData(0, 0, img.width, img.height).data;
                                            var r = 0, g = 0, b = 0;

                                            // 取所有像素的平均值
                                            for (var row = 0; row < img.height; row++) {
                                                for (var col = 0; col < img.width; col++) {
                                                    r += data[((img.width * row) + col) * 4];
                                                    g += data[((img.width * row) + col) * 4 + 1];
                                                    b += data[((img.width * row) + col) * 4 + 2];
                                                }
                                            }

                                            r /= (img.width * img.height);
                                            g /= (img.width * img.height);
                                            b /= (img.width * img.height);

                                            r = Math.round(r);
                                            g = Math.round(g);
                                            b = Math.round(b);

                                            constructor.call(this, r, g, b);
                                        }).
                                        add("Number", function (colorInt) {
                                            /// <summary>颜色构造函数</summary>
                                            /// <param name="colorInt" type="Number">十进制颜色值</param>
                                            /// <returns type="Jyo.Color"></returns>

                                            constructor.call(this, colorInt >> 16 & 0xFF, colorInt >> 8 & 0xFF, colorInt & 0xFF);
                                        }).
                                        add("Array", function (arr) {
                                            /// <summary>颜色构造函数</summary>
                                            /// <param name="arr" type="Array">四维向量</param>
                                            /// <returns type="Jyo.Color"></returns>

                                            constructor.call(arr[0] * 255, arr[1] * 255, arr[2] * 255, arr[3]);
                                        }).
                                        add("Number,Number,Number", function (r, g, b) {
                                            /// <summary>颜色构造函数</summary>
                                            /// <param name="r" type="Number">红色值</param>
                                            /// <param name="g" type="Number">绿色值</param>
                                            /// <param name="b" type="Number">蓝色值</param>
                                            /// <returns type="Jyo.Color"></returns>

                                            this.red = (r > 255 ? 255 : r < 0 ? 0 : r) << 0;
                                            this.green = (g > 255 ? 255 : g < 0 ? 0 : g) << 0;
                                            this.blue = (b > 255 ? 255 : b < 0 ? 0 : b) << 0;
                                            this.alpha = 1.0;
                                        }).
                                        add("Number,Number,Number,Number", function (r, g, b, a) {
                                            /// <summary>颜色构造函数</summary>
                                            /// <param name="r" type="Number">红色值</param>
                                            /// <param name="g" type="Number">绿色值</param>
                                            /// <param name="b" type="Number">蓝色值</param>
                                            /// <param name="a" type="Number">Alpha值</param>
                                            /// <returns type="Jyo.Color"></returns>

                                            constructor.call(this, r, g, b);
                                            this.alpha = a > 1 ? 1 : a < 0 ? 0 : a;
                                        });

    Jyo.Color.prototype = {
        toInt32: function () {
            /// <summary>转换为32位10进制表示法</summary>
            /// <returns type="Number"></returns>

            return (this.red << 16 | this.green << 8 | this.blue);
        },
        toHex: function () {
            /// <summary>转换为16进制表示法(无法表示Alpha值)</summary>
            /// <returns type="String"></returns>

            return "#" + this.toInt32().toString(16);
        },
        toYuvObj: function () {
            var Y = ((66 * this.red + 129 * this.green + 25 * this.blue + 128) >> 8) + 16;
            var U = ((-38 * this.red - 74 * this.green + 112 * this.blue + 128) >> 8) + 128;
            var V = ((112 * this.red - 94 * this.green - 18 * this.blue + 128) >> 8) + 128;
            return { y: Y, u: U, v: V };
        },
        toYuv: function () {
            var yuv = this.toYuvObj();
            return "yuv(" + yuv.y + "," + yuv.u + "," + yuv.v + ")";
        },
        toRgb: function () {
            /// <summary>转换为RGB表示法</summary>
            /// <returns type="String"></returns>

            return "rgb(" + this.red + "," + this.green + "," + this.blue + ")";
        },
        toRgba: function () {
            /// <summary>转换为RGBA表示法</summary>
            /// <returns type="String"></returns>

            return "rgba(" + this.red + "," + this.green + "," + this.blue + "," + this.alpha + ")";
        },
        toHslObj: function () {
            var r = this.red / 255,
                g = this.green / 255,
                b = this.blue / 255;
            var max = Math.max(r, g, b), min = Math.min(r, g, b);
            var h, s, l = (max + min) / 2;

            if (max == min) {
                h = s = 0;
            } else {
                var d = max - min;
                s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
                switch (max) {
                    case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                    case g: h = (b - r) / d + 2; break;
                    case b: h = (r - g) / d + 4; break;
                }
                h /= 6;
            }
            return { h: ((h * 360) | 0), s: s * 100, l: l * 100 };
        },
        toHsl: function () {
            /// <summary>转换为HSL表示法</summary>
            /// <returns type="String"></returns>

            var hsl = this.toHslObj();
            return "hsl(" + hsl.h + "," + hsl.s + "%," + hsl.l + "%)";
        },
        toHsla: function () {
            /// <summary>转换为HSLA表示法</summary>
            /// <returns type="String"></returns>

            var hsl = this.toHslObj();
            return "hsla(" + hsl.h + "," + hsl.s + "%," + hsl.l + "%," + this.alpha + ")";
        },
        toVec4: function () {
            /// <summary>转换为四维向量表示法</summary>
            /// <returns type="Array"></returns>

            return [this.red / 255, this.green / 255, this.blue / 255, this.alpha];
        }
    };

    var colors = Jyo.Colors = {
        "aliceblue": "#f0f8ff",
        "antiquewhite": "#faebd7",
        "aqua": "#00ffff",
        "aquamarine": "#7fffd4",
        "azure": "#f0ffff",
        "beige": "#f5f5dc",
        "bisque": "#ffe4c4",
        "black": "#000000",
        "blanchedalmond": "#ffebcd",
        "blue": "#0000ff",
        "blueviolet": "#8a2be2",
        "brown": "#a52a2a",
        "burlywood": "#deb887",
        "cadetblue": "#5f9ea0",
        "chartreuse": "#7fff00",
        "chocolate": "#d2691e",
        "coral": "#ff7f50",
        "cornflowerblue": "#6495ed",
        "cornsilk": "#fff8dc",
        "crimson": "#dc143c",
        "cyan": "#00ffff",
        "darkblue": "#00008b",
        "darkcyan": "#008b8b",
        "darkgoldenrod": "#b8860b",
        "darkgray": "#a9a9a9",
        "darkgreen": "#006400",
        "darkgrey": "#a9a9a9",
        "darkkhaki": "#bdb76b",
        "darkmagenta": "#8b008b",
        "darkolivegreen": "#556b2f",
        "darkorange": "#ff8c00",
        "darkorchid": "#9932cc",
        "darkred": "#8b0000",
        "darksalmon": "#e9967a",
        "darkseagreen": "#8fbc8f",
        "darkslateblue": "#483d8b",
        "darkslategray": "#2f4f4f",
        "darkslategrey": "#2f4f4f",
        "darkturquoise": "#00ced1",
        "darkviolet": "#9400d3",
        "deeppink": "#ff1493",
        "deepskyblue": "#00bfff",
        "dimgray": "#696969",
        "dimgrey": "#696969",
        "dodgerblue": "#1e90ff",
        "firebrick": "#b22222",
        "floralwhite": "#fffaf0",
        "forestgreen": "#228b22",
        "fuchsia": "#ff00ff",
        "gainsboro": "#dcdcdc",
        "ghostwhite": "#f8f8ff",
        "gold": "#ffd700",
        "goldenrod": "#daa520",
        "gray": "#808080",
        "green": "#008000",
        "greenyellow": "#adff2f",
        "grey": "#808080",
        "honeydew": "#f0fff0",
        "hotpink": "#ff69b4",
        "indianred": "#cd5c5c",
        "indigo": "#4b0082",
        "ivory": "#fffff0",
        "khaki": "#f0e68c",
        "lavender": "#e6e6fa",
        "lavenderblush": "#fff0f5",
        "lawngreen": "#7cfc00",
        "lemonchiffon": "#fffacd",
        "lightblue": "#add8e6",
        "lightcoral": "#f08080",
        "lightcyan": "#e0ffff",
        "lightgoldenrodyellow": "#fafad2",
        "lightgray": "#d3d3d3",
        "lightgreen": "#90ee90",
        "lightgrey": "#d3d3d3",
        "lightpink": "#ffb6c1",
        "lightsalmon": "#ffa07a",
        "lightseagreen": "#20b2aa",
        "lightskyblue": "#87cefa",
        "lightslategray": "#778899",
        "lightslategrey": "#778899",
        "lightsteelblue": "#b0c4de",
        "lightyellow": "#ffffe0",
        "lime": "#00ff00",
        "limegreen": "#32cd32",
        "linen": "#faf0e6",
        "magenta": "#ff00ff",
        "maroon": "#800000",
        "mediumaquamarine": "#66cdaa",
        "mediumblue": "#0000cd",
        "mediumorchid": "#ba55d3",
        "mediumpurple": "#9370db",
        "mediumseagreen": "#3cb371",
        "mediumslateblue": "#7b68ee",
        "mediumspringgreen": "#00fa9a",
        "mediumturquoise": "#48d1cc",
        "mediumvioletred": "#c71585",
        "midnightblue": "#191970",
        "mintcream": "#f5fffa",
        "mistyrose": "#ffe4e1",
        "moccasin": "#ffe4b5",
        "navajowhite": "#ffdead",
        "navy": "#000080",
        "oldlace": "#fdf5e6",
        "olive": "#808000",
        "olivedrab": "#6b8e23",
        "orange": "#ffa500",
        "orangered": "#ff4500",
        "orchid": "#da70d6",
        "palegoldenrod": "#eee8aa",
        "palegreen": "#98fb98",
        "paleturquoise": "#afeeee",
        "palevioletred": "#db7093",
        "papayawhip": "#ffefd5",
        "peachpuff": "#ffdab9",
        "peru": "#cd853f",
        "pink": "#ffc0cb",
        "plum": "#dda0dd",
        "powderblue": "#b0e0e6",
        "purple": "#800080",
        "red": "#ff0000",
        "rosybrown": "#bc8f8f",
        "royalblue": "#4169e1",
        "saddlebrown": "#8b4513",
        "salmon": "#fa8072",
        "sandybrown": "#f4a460",
        "seagreen": "#2e8b57",
        "seashell": "#fff5ee",
        "sienna": "#a0522d",
        "silver": "#c0c0c0",
        "skyblue": "#87ceeb",
        "slateblue": "#6a5acd",
        "slategray": "#708090",
        "slategrey": "#708090",
        "snow": "#fffafa",
        "springgreen": "#00ff7f",
        "steelblue": "#4682b4",
        "tan": "#d2b48c",
        "teal": "#008080",
        "thistle": "#d8bfd8",
        "tomato": "#ff6347",
        "turquoise": "#40e0d0",
        "transparent": "rgba(0,0,0,0)",
        "violet": "#ee82ee",
        "wheat": "#f5deb3",
        "white": "#ffffff",
        "whitesmoke": "#f5f5f5",
        "yellow": "#ffff00",
        "yellowgreen": "#9acd32"
    };

    for (var i in colors) {
        colors[i] = new Jyo.Color(colors[i]);
    }
    Object.freeze(Jyo.Colors);

})(window, document, Jyo);