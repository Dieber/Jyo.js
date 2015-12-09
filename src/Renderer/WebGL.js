/// <reference path="../../WebGLTest/Jyo.js" />

(function (window, document, Jyo, undefined) {
    "use strict";

    // 可能的上下文名称
    var contextList = ["webgl2", "experimental-webgl2", "webgl", "experimental-webgl", "webgl3d", "moz-webgl", "webkit-webgl"];

    // 着色池掩码
    var shaderMask = {
        texture: 1,
        crop: 2,
        path: 4
    };

    // 2D和顶点纹理UV COORDS
    var rectVerts = new Float32Array([
        0, 0, 0, 0,
        0, 1, 0, 1,
        1, 1, 1, 1,
        1, 0, 1, 0
    ]);

    var tempCanvas = document.createElement("canvas");
    var tempCtx = tempCanvas.getContext("2d");

    Jyo.Renderer.WebGL = function () {
        /// <summary>WebGL渲染器</summary>

        var _this = this;
        var ctx;

        for (var i = 0; i < contextList.length; i++) {
            ctx = this.context = this.canvas.getContext(contextList[i], {
                alpha: true,
                depth: true,
                antialias: true,
                premultipliedAlpha: true
            });
            if (this.context) break;
        }
        if (!this.context) throw "Unable to get WebGL context";

        this.fragmentShader = null;
        this.vertexShader = null;
        this.shaderProgram = null;
        this.transform = new Jyo.Transform();
        this.shaderPool = [];

        this.rectVertexPositionBuffer;
        this.rectVertexColorBuffer;

        this.pathVertexPositionBuffer;
        this.pathVertexColorBuffer;

        this.globalAlpha = 1;

        Object.defineProperty(ctx, "globalAlpha", {
            get: function () {
                return _this.globalAlpha;
            },
            set: function (value) {
                _this.globalAlpha = isNaN(value) ? 1.0 : Math.clamp(value, 0, 1);
            }
        });

        init2DShaders.call(this);

        initBuffers.call(this);

        this.addEventListener("resize", function (size) {
            size.width = Math.floor(size.width);
            size.height = Math.floor(size.height);
            ctx.viewport(0, 0, size.width, size.height);
            tempCanvas.width = size.width;
            tempCanvas.height = size.height;
        }, false);

        tempCanvas.width = this.width;
        tempCanvas.height = this.height;

        ctx.viewport(0, 0, this.width, this.height);

        ctx.clearColor(0, 0, 0, 0);

        ctx.enable(ctx.DEPTH_TEST);
        ctx.depthFunc(ctx.LEQUAL);

        ctx.enable(ctx.BLEND);
        ctx.blendFuncSeparate(ctx.SRC_ALPHA, ctx.ONE_MINUS_SRC_ALPHA, ctx.ONE, ctx.ONE_MINUS_SRC_ALPHA);

        this.maxTextureSize = ctx.getParameter(ctx.MAX_TEXTURE_SIZE);

        // 是否开始变换
        this.isBeginConvert = false;

        // 变换参数
        this.convertArrs = {
            rotate: null,
            scaleX: null,
            scaleY: null
        };
    };

    // 要创建的标签名
    Jyo.Renderer.WebGL.tagName = "canvas";
    // 技术名称
    Jyo.Renderer.WebGL.assign = Jyo.Renderer.WebGL.prototype.assign = "WebGL";
    Jyo.Renderer.WebGL.isSupport = function () {
        /// <summary>检测是否支持该渲染器</summary>
        /// <returns type="Boolean" />

        var testCanvas = document.createElement("canvas");
        var gl;

        for (var i = 0; i < contextList.length; i++) {
            gl = testCanvas.getContext(contextList[i]);
            if (gl) break;
        }
        return !!gl;
    };

    function shaderBuilder(ctx, vsStr, fsStr) {
        /// <summary>着色器编译</summary>
        /// <param name="ctx" type="WebGLRenderingContext">WebGL渲染上下文</param>
        /// <param name="vsSource" type="String">顶点着色器代码</param>
        /// <param name="fsSource" type="String">片元着色器代码</param>
        /// <returns type="WebGLProgram" />

        if (!(ctx instanceof WebGLRenderingContext)) {
            throw "Only WebGL can use GLSL";
        }

        /*
            编译片元着色器
        */
        var fragmentShader = ctx.createShader(ctx.FRAGMENT_SHADER);
        ctx.shaderSource(fragmentShader, fsStr);
        ctx.compileShader(fragmentShader);

        if (!ctx.getShaderParameter(fragmentShader, ctx.COMPILE_STATUS)) {
            // 检查片元着色器是否编译出错
            throw "fragment shader error: " + ctx.getShaderInfoLog(fragmentShader);
        }

        /*
            编译顶点着色器
        */
        var vertexShader = ctx.createShader(ctx.VERTEX_SHADER);
        ctx.shaderSource(vertexShader, vsStr);
        ctx.compileShader(vertexShader);

        if (!ctx.getShaderParameter(vertexShader, ctx.COMPILE_STATUS)) {
            // 检查顶点着色器是否编译出错
            throw "vertex shader error: " + ctx.getShaderInfoLog(vertexShader);
        }

        /*
            创建并连接着色程序
        */
        var shaderProgram = ctx.createProgram();
        shaderProgram.fragmentShader = fragmentShader;
        shaderProgram.vertexShader = vertexShader;
        ctx.attachShader(shaderProgram, fragmentShader);
        ctx.attachShader(shaderProgram, vertexShader);
        ctx.linkProgram(shaderProgram);

        if (!ctx.getProgramParameter(shaderProgram, ctx.LINK_STATUS)) {
            // 检查着色程序是否出错
            throw "Could not initialise shaders.";
        }

        return shaderProgram;
    }

    function init2DShaders(transformStackDepth, sm) {
        /// <summary>初始化着色器</summary>
        /// <param name="transformStackDepth" type="Number">变换堆栈深度</param>
        /// <param name="sm" type="Number">着色器掩码</param>

        var ctx = this.context;

        transformStackDepth = transformStackDepth || 1;
        sm = sm || 0;

        // 获取着色器池中相应堆栈深度中的元素
        var storedShader = this.shaderPool[transformStackDepth];

        // 如果着色器池中不存在要获取的元素则创建一个
        if (!storedShader) { storedShader = this.shaderPool[transformStackDepth] = []; }

        storedShader = storedShader[sm];

        if (storedShader) {
            // 存在此ShaderProgram则直接使用

            ctx.useProgram(storedShader);
            this.shaderProgram = storedShader;
            return storedShader;
        } else {
            // 不存在此ShaderProgram则编译

            var shaderProgram = this.shaderProgram = shaderBuilder(ctx, get2DVSSource.call(this, transformStackDepth, sm), get2DFSSource.call(this, sm));

            ctx.useProgram(shaderProgram);

            shaderProgram.vertexPositionAttribute = ctx.getAttribLocation(shaderProgram, "aVertexPosition");
            ctx.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

            shaderProgram.uAlpha = ctx.getUniformLocation(shaderProgram, 'uAlpha');
            shaderProgram.uColor = ctx.getUniformLocation(shaderProgram, 'uColor');
            shaderProgram.uSampler = ctx.getUniformLocation(shaderProgram, 'uSampler');
            shaderProgram.uCropSource = ctx.getUniformLocation(shaderProgram, 'uCropSource');

            shaderProgram.uTransforms = [];
            for (var i = 0; i < transformStackDepth; ++i) {
                shaderProgram.uTransforms[i] = ctx.getUniformLocation(shaderProgram, 'uTransforms[' + i + ']');
            }
            this.shaderPool[transformStackDepth][sm] = shaderProgram;
            return shaderProgram;
        }
    }

    function get2DFSSource(sm) {
        /// <summary>获取片元着色器源代码</summary>
        /// <param name="shaderMask" type="Number">着色器掩码</param>
        /// <returns type="String" />

        var fsSource = [
          "#ifdef GL_ES",
          "#ifdef GL_FRAGMENT_PRECISION_HIGH",
            "precision highp float;",
          "#else",
            "precision mediump float;",
          "#endif",
          "#endif",

          "#define hasTexture " + ((sm & shaderMask.texture) ? "1" : "0"),
          "#define hasCrop " + ((sm & shaderMask.crop) ? "1" : "0"),

          "varying vec4 vColor;",
          "uniform float uAlpha;",

          "#if hasTexture",
            "varying vec2 vTextureCoord;",
            "uniform sampler2D uSampler;",
            "#if hasCrop",
              "uniform vec4 uCropSource;",
            "#endif",
          "#endif",

          "void main(void) {",
            "#if hasTexture",
              "#if hasCrop",
                "gl_FragColor = texture2D(uSampler, vec2(vTextureCoord.x * uCropSource.z, vTextureCoord.y * uCropSource.w) + uCropSource.xy);",
              "#else",
                "gl_FragColor = texture2D(uSampler, vTextureCoord);",
              "#endif",
            "#else",
              "gl_FragColor = vColor;",
            "#endif",
            "gl_FragColor.a *= uAlpha;",
          "}"
        ].join("\n");

        return fsSource;
    }

    function get2DVSSource(stackDepth, sm) {
        /// <summary>获取顶点着色器源代码</summary>
        /// <param name="stackDepth" type="Number">堆栈深度</param>
        /// <param name="shaderMask" type="Number">着色器掩码</param>
        /// <returns type="String" />

        var w = 2 / this.canvas.width, h = -2 / this.canvas.height;

        stackDepth = stackDepth || 1;

        var vsSource = [
          "#define hasTexture " + ((sm & shaderMask.texture) ? "1" : "0"),
          "attribute vec4 aVertexPosition;",

          "#if hasTexture",
          "varying vec2 vTextureCoord;",
          "#endif",

          "uniform vec4 uColor;",
          "uniform mat3 uTransforms[" + stackDepth + "];",

          "varying vec4 vColor;",

          "const mat4 pMatrix = mat4(" + w + ",0,0,0, 0," + h + ",0,0, 0,0,1.0,1.0, -1.0,1.0,0,0);",

          "mat3 crunchStack(void) {",
            "mat3 result = uTransforms[0];",
            "for (int i = 1; i < " + stackDepth + "; ++i) {",
              "result = uTransforms[i] * result;",
            "}",
            "return result;",
          "}",

          "void main(void) {",
            "vec3 position = crunchStack() * vec3(aVertexPosition.x, aVertexPosition.y, 1.0);",
            "gl_Position = pMatrix * vec4(position, 1.0);",
            "vColor = uColor;",
            "#if hasTexture",
              "vTextureCoord = aVertexPosition.zw;",
            "#endif",
          "}"
        ].join("\n");
        return vsSource;
    }

    function initBuffers() {
        /// <summary>初始化缓冲区</summary>

        var ctx = this.context;

        this.rectVertexPositionBuffer = ctx.createBuffer();
        this.rectVertexColorBuffer = ctx.createBuffer();

        this.pathVertexPositionBuffer = ctx.createBuffer();
        this.pathVertexColorBuffer = ctx.createBuffer();

        ctx.bindBuffer(ctx.ARRAY_BUFFER, this.rectVertexPositionBuffer);
        ctx.bufferData(ctx.ARRAY_BUFFER, rectVerts, ctx.STATIC_DRAW);
    }

    function sendTransformStack(sp) {
        /// <summary>传送变换堆栈</summary>
        /// <param name="sp" type="WebGLProgram">着色程序</param>

        var ctx = this.context;
        var stack = this.transform.matrixPool;
        for (var i = 0, maxI = this.transform.currentStack + 1; i < maxI; ++i) {
            ctx.uniformMatrix3fv(sp.uTransforms[i], false, stack[maxI - 1 - i]);
        }
    }

    // 子路径数组
    var subPaths = [];

    function SubPath(x, y) {
        /// <summary>子路径</summmary>
        /// <param name="x" type="Number">X坐标</param>
        /// <param name="y" type="Number">Y坐标</param>

        this.closed = false;
        this.verts = [x, y, 0, 0];
    }

    function beginPath() {
        /// <summary>开始路径</summary>

        subPaths.clear();
    }

    function closePath() {
        if (subPaths.length) {
            // 标记最后一个子路径的关闭
            var prevPath = subPaths[subPaths.length - 1];
            prevPath.closed = true;

            // 使用第一个子路径形成闭合
            subPaths.push(new SubPath(prevPath.verts[0], prevPath.verts[1]));
        }
    }

    function moveTo(x, y) {
        /// <summary>移动到</summary>
        /// <param name="x" type="Number">X坐标</param>
        /// <param name="y" type="Number">Y坐标</param>

        subPaths.push(new SubPath(x, y));
    }

    function lineTo(x, y) {
        /// <summary>连线到</summary>
        /// <param name="x" type="Number">X坐标</param>
        /// <param name="y" type="Number">Y坐标</param>

        if (subPaths.length) {
            subPaths[subPaths.length - 1].verts.push(x, y, 0, 0);
        } else {
            // 如果当前没有任何子路径，则运行moveTo

            this.context.moveTo(x, y);
        }
    }

    function fillSubPath(index, color) {
        /// <summary>填充子路径</summary>
        /// <param name="index" type="Number">索引</param>
        /// <param name="color" type="Array">颜色</param>

        var ctx = this.context;
        var transform = this.transform;
        var shaderProgram = init2DShaders.call(this, transform.currentStack + 2, 0);

        var subPath = subPaths[index];
        var verts = subPath.verts;

        ctx.bindBuffer(ctx.ARRAY_BUFFER, this.pathVertexPositionBuffer);
        ctx.bufferData(ctx.ARRAY_BUFFER, new Float32Array(verts), ctx.STATIC_DRAW);

        ctx.vertexAttribPointer(shaderProgram.vertexPositionAttribute, 4, ctx.FLOAT, false, 0, 0);

        transform.pushMatrix();

        sendTransformStack.call(this, shaderProgram);

        ctx.uniform4f(shaderProgram.uColor, color[0], color[1], color[2], color[3]);
        ctx.uniform1f(shaderProgram.uAlpha, this.globalAlpha);

        ctx.drawArrays(ctx.TRIANGLE_FAN, 0, verts.length / 4);

        transform.popMatrix();
    }

    function fill(color) {
        /// <summary>填充</summary>
        /// <param name="color" type="Jyo.Color">颜色对象</param>

        color = color.toVec4();
        for (var i = 0; i < subPaths.length; i++) {
            fillSubPath.call(this, i, color);
        }
    }

    function strokeSubPath(index, color) {
        /// <summary>绘制子路径样条</summary>
        /// <param name="index" type="Number">索引</param>
        /// <param name="color" type="Array">颜色</param>

        var ctx = this.context;
        var transform = this.transform;
        var shaderProgram = init2DShaders.call(this, transform.currentStack + 2, 0);

        var subPath = subPaths[index];
        var verts = subPath.verts;

        ctx.bindBuffer(ctx.ARRAY_BUFFER, this.pathVertexPositionBuffer);
        ctx.bufferData(ctx.ARRAY_BUFFER, new Float32Array(verts), ctx.STATIC_DRAW);

        ctx.vertexAttribPointer(shaderProgram.vertexPositionAttribute, 4, ctx.FLOAT, false, 0, 0);

        transform.pushMatrix();

        sendTransformStack.call(this, shaderProgram);

        ctx.uniform4f(shaderProgram.uColor, color[0], color[1], color[2], color[3]);
        ctx.uniform1f(shaderProgram.uAlpha, this.globalAlpha);

        if (subPath.closed) {
            ctx.drawArrays(ctx.LINE_LOOP, 0, verts.length / 4);
        } else {
            ctx.drawArrays(ctx.LINE_STRIP, 0, verts.length / 4);
        }

        transform.popMatrix();
    }

    function stroke(color) {
        /// <summary>绘制样条</summary>
        /// <param name="color" type="Jyo.Color">颜色对象</param>

        color = color.toVec4();
        for (var i = 0; i < subPaths.length; i++) {
            strokeSubPath.call(this, i, color);
        }
    }

    Jyo.Renderer.WebGL.prototype = new Jyo.Object({
        _bindTexture: function (image, width, height, texture, repetitionStyle, callback) {
            /// <summary>绑定材质</summary>
            /// <param name="image" type="HTMLElement">图像对象</param>
            /// <param name="width" type="Number">图像宽度</param>
            /// <param name="height" type="Number">图像高度</param>
            /// <param name="texture" type="WebGLTexture">已有材质对象</param>
            /// <param name="repetitionStyle" type="String">说明图像如何贴图</param>
            /// <returns type="WebGLTexture" />

            image = image.object || image;
            var ctx = this.context;

            //if (!!image.glTexture) return image.glTexture;

            if (!texture) {
                // 初始化材质

                if (width > this.maxTextureSize || height > this.maxTextureSize) {
                    var cvs = document.createElement("canvas");

                    cvs.width = Math.min(this.maxTextureSize, width);
                    cvs.height = Math.min(this.maxTextureSize, height);

                    var cvsCtx = cvs.getContext("2d");
                    cvsCtx.drawImage(image, 0, 0, width, height, 0, 0, cvs.width, cvs.height);
                }

                texture = ctx.createTexture();

                ctx.bindTexture(ctx.TEXTURE_2D, texture);
                ctx.texImage2D(ctx.TEXTURE_2D, 0, ctx.RGBA, ctx.RGBA, ctx.UNSIGNED_BYTE, cvs || image);
                switch (repetitionStyle) {
                    case "repeat":
                        ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_S, ctx.REPEAT);
                        ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_T, ctx.REPEAT);
                        break;
                    case "repeat-x":
                        ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_S, ctx.REPEAT);
                        ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_T, ctx.CLAMP_TO_EDGE);
                        break;
                    case "repeat-y":
                        ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_S, ctx.CLAMP_TO_EDGE);
                        ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_T, ctx.REPEAT);
                        break;
                    default:
                        ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_S, ctx.CLAMP_TO_EDGE);
                        ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_T, ctx.CLAMP_TO_EDGE);
                        break;
                }
                ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MAG_FILTER, ctx.NEAREST);

                // Enable Mip mapping on power-of-2 textures
                if (Math.isPowerOfTwo(width) && Math.isPowerOfTwo(height)) {
                    ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MIN_FILTER, ctx.LINEAR_MIPMAP_NEAREST);
                    ctx.generateMipmap(ctx.TEXTURE_2D);
                } else {
                    ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MIN_FILTER, ctx.NEAREST);
                }

                texture.width = width;
                texture.height = height;
            } else {
                ctx.bindTexture(ctx.TEXTURE_2D, texture);
                ctx.texImage2D(ctx.TEXTURE_2D, 0, ctx.RGBA, ctx.RGBA, ctx.UNSIGNED_BYTE, image);
            }

            ctx.bindTexture(ctx.TEXTURE_2D, null);
            return texture;
        },
        _shaderBuilder: function (vsSource, fsSource) {
            /// <summary>着色器编译</summary>
            /// <param name="vsSource" type="String">顶点着色器代码</param>
            /// <param name="fsSource" type="String">片元着色器代码</param>
            /// <returns type="WebGLProgram" />

            return shaderBuilder(this.context, vsSource, fsSource);
        },
        clear: function () {
            /// <summary>清空画布</summary>

            var ctx = this.context;
            ctx.clear(ctx.COLOR_BUFFER_BIT | ctx.DEPTH_BUFFER_BIT);
        },
        beginConvert: function (rotate, scaleX, scaleY) {
            /// <summary>开始变换</summary>
            /// <param name="rotate" type="Number" optional="true">旋转值</param>
            /// <param name="scaleX" type="Number" optional="true">X缩放值</param>
            /// <param name="scaleY" type="Number" optional="true">Y缩放值</param>

            this.isBeginConvert = true;
            this.convertArrs.scaleX = scaleX || 1;
            this.convertArrs.scaleY = scaleY || 1;
            this.convertArrs.rotate = rotate || 0;
        },
        endConvert: function () {
            /// <summary>结束变换</summary>

            this.isBeginConvert = false;
            this.convertArrs.scaleX = 0;
            this.convertArrs.scaleY = 0;
            this.convertArrs.rotate = 0;
        },
        useConvert: function (x, y, w, h, callback) {
            /// <summary>使用变换绘制</summary>
            /// <param name="x" type="Number">X位置</param>
            /// <param name="y" type="Number">Y位置</param>
            /// <param name="w" type="Number">宽度</param>
            /// <param name="h" type="Number">高度</param>
            /// <param name="callback" type="Function">回调函数</param>

            var t = this.convertArrs,
                    ctx = this.context,
                    transform = this.transform;

            var enableDepthTest = ctx.getParameter(ctx.DEPTH_TEST);
            enableDepthTest && ctx.disable(ctx.DEPTH_TEST);

            if (!this.isBeginConvert || (!x && !y && !w && !h)) {
                callback.call(this);
            } else {
                transform.translate(x + w * 0.5, y + h * 0.5);
                transform.scale(t.scaleX, t.scaleY);
                t.rotate && transform.rotate(t.rotate);
                callback.call(this);
                t.rotate && transform.rotate(-t.rotate);
                transform.scale(1 / t.scaleX, 1 / t.scaleY);
                transform.translate(-(x + w * 0.5), -(y + h * 0.5));
            }

            enableDepthTest && ctx.enable(ctx.DEPTH_TEST);
        },
        fillRect: Jyo.overload().
                  add("Jyo.Rectangle", function (rect) {
                      /// <summary>绘制实心矩形</summary>
                      /// <param name="rect" type="Jyo.Rectangle">矩形对象</param>

                      this.fillRect(rect.x, rect.y, rect.width, rect.height, Jyo.Colors.black);
                  }).
                  add("Number, Number, Number, Number", function (x, y, width, height) {
                      /// <summary>绘制实心矩形</summary>
                      /// <param name="x" type="Number">起始X坐标</param>
                      /// <param name="y" type="Number">起始Y坐标</param>
                      /// <param name="width" type="Number">矩形宽度</param>
                      /// <param name="height" type="Number">矩形高度</param>

                      this.fillRect(x, y, width, height, Jyo.Colors.black);
                  }).
                  add("Jyo.Rectangle, Jyo.Color", function (rect, color) {
                      /// <summary>绘制实心矩形</summary>
                      /// <param name="rect" type="Jyo.Rectangle">矩形对象</param>
                      /// <param name="color" type="Jyo.Color">颜色对象</param>

                      this.fillRect(rect.x, rect.y, rect.width, rect.height, color);
                  }).
                  add("Number, Number, Number, Number, String", function (x, y, width, height, colorStr) {
                      /// <summary>绘制实心矩形</summary>
                      /// <param name="x" type="Number">起始X坐标</param>
                      /// <param name="y" type="Number">起始Y坐标</param>
                      /// <param name="width" type="Number">矩形宽度</param>
                      /// <param name="height" type="Number">矩形高度</param>
                      /// <param name="colorStr" type="String">颜色字符串值</param>

                      this.fillRect(x, y, width, height, new Jyo.Color(colorStr));
                  }).
                  add("Jyo.Rectangle, String", function (rect, colorStr) {
                      /// <summary>绘制实心矩形</summary>
                      /// <param name="rect" type="Jyo.Rectangle">矩形对象</param>
                      /// <param name="colorStr" type="String">颜色字符串值</param>

                      this.fillRect(rect.x, rect.y, rect.width, rect.height, new Jyo.Color(colorStr));
                  }).
                  add("Number, Number, Number, Number, Jyo.Color", function (x, y, width, height, color) {
                      /// <summary>绘制实心矩形</summary>
                      /// <param name="x" type="Number">起始X坐标</param>
                      /// <param name="y" type="Number">起始Y坐标</param>
                      /// <param name="width" type="Number">矩形宽度</param>
                      /// <param name="height" type="Number">矩形高度</param>
                      /// <param name="color" type="Jyo.Color">颜色对象</param>

                      var ctx = this.context;
                      var transform = this.transform;
                      var shaderProgram = init2DShaders.call(this, transform.currentStack + 2, 0);
                      color = color.toVec4();

                      this.useConvert(x, y, width, height, function () {
                          ctx.bindBuffer(ctx.ARRAY_BUFFER, this.rectVertexPositionBuffer);
                          ctx.vertexAttribPointer(shaderProgram.vertexPositionAttribute, 4, ctx.FLOAT, false, 0, 0);
                          transform.pushMatrix();
                          if (this.isBeginConvert) {
                              transform.translate(-0.5 * width, -0.5 * height);
                              transform.scale(width, height);
                          }
                          else {
                              transform.translate(x, y);
                              transform.scale(width, height);
                          }
                          sendTransformStack.call(this, shaderProgram);
                          ctx.uniform4f(shaderProgram.uColor, color[0], color[1], color[2], color[3]);
                          ctx.uniform1f(shaderProgram.uAlpha, this.globalAlpha);
                          ctx.drawArrays(ctx.TRIANGLE_FAN, 0, 4);
                          transform.popMatrix();
                      });
                  }),
        drawRect: Jyo.overload().
                  add("Jyo.Rectangle", function (rect) {
                      /// <summary>绘制空心矩形</summary>
                      /// <param name="rect" type="Jyo.Rectangle">矩形对象</param>

                      this.drawRect(rect.x, rect.y, rect.width, rect.height, Jyo.Colors.black, 1);
                  }).
                  add("Jyo.Rectangle, Jyo.Color", function (rect, color) {
                      /// <summary>绘制空心矩形</summary>
                      /// <param name="rect" type="Jyo.Rectangle">矩形对象</param>
                      /// <param name="color" type="Jyo.Color">颜色对象</param>

                      this.drawRect(rect.x, rect.y, rect.width, rect.height, color, 1);
                  }).
                  add("Number, Number, Number, Number, Jyo.Color", function (x, y, width, height, color) {
                      /// <summary>绘制空心矩形</summary>
                      /// <param name="x" type="Number">起始X坐标</param>
                      /// <param name="y" type="Number">起始Y坐标</param>
                      /// <param name="width" type="Number">矩形宽度</param>
                      /// <param name="height" type="Number">矩形高度</param>
                      /// <param name="color" type="Jyo.Color">颜色对象</param>

                      this.drawRect(x, y, width, height, color, 1);
                  }).
                  add("Jyo.Rectangle, String", function (rect, colorStr) {
                      /// <summary>绘制空心矩形</summary>
                      /// <param name="rect" type="Jyo.Rectangle">矩形对象</param>
                      /// <param name="colorStr" type="String">颜色字符串值</param>

                      this.drawRect(rect.x, rect.y, rect.width, rect.height, new Jyo.Color(colorStr), 1);
                  }).
                  add("Number, Number, Number, Number, String", function (x, y, width, height, colorStr) {
                      /// <summary>绘制空心矩形</summary>
                      /// <param name="x" type="Number">起始X坐标</param>
                      /// <param name="y" type="Number">起始Y坐标</param>
                      /// <param name="width" type="Number">矩形宽度</param>
                      /// <param name="height" type="Number">矩形高度</param>
                      /// <param name="colorStr" type="String">颜色字符串值</param>

                      this.drawRect(x, y, width, height, new Jyo.Color(colorStr), 1);
                  }).
                  add("Jyo.Rectangle, Jyo.Color, Number", function (rect, color, lineWidth) {
                      /// <summary>绘制空心矩形</summary>
                      /// <param name="rect" type="Jyo.Rectangle">矩形对象</param>
                      /// <param name="color" type="Jyo.Color">颜色对象</param>
                      /// <param name="lineWidth" type="Number">线条宽度</param>

                      this.drawRect(rect.x, rect.y, rect.width, rect.height, color, lineWidth);
                  }).
                  add("Number, Number, Number, Number, String, Number", function (x, y, width, height, colorStr, lineWidth) {
                      /// <summary>绘制空心矩形</summary>
                      /// <param name="x" type="Number">起始X坐标</param>
                      /// <param name="y" type="Number">起始Y坐标</param>
                      /// <param name="width" type="Number">矩形宽度</param>
                      /// <param name="height" type="Number">矩形高度</param>
                      /// <param name="colorStr" type="String">颜色字符串值</param>
                      /// <param name="lineWidth" type="Number">线条宽度</param>

                      this.drawRect(x, y, width, height, new Jyo.Color(color), lineWidth);
                  }).
                  add("Jyo.Rectangle, String, Number", function (rect, colorStr, lineWidth) {
                      /// <summary>绘制空心矩形</summary>
                      /// <param name="rect" type="Jyo.Rectangle">矩形对象</param>
                      /// <param name="colorStr" type="String">颜色字符串值</param>
                      /// <param name="lineWidth" type="Number">线条宽度</param>

                      this.drawRect(rect.x, rect.y, rect.width, rect.height, new Jyo.Color(colorStr), lineWidth);
                  }).
                  add("Number, Number, Number, Number, Jyo.Color, Number", function (x, y, width, height, color, lineWidth) {
                      /// <summary>绘制空心矩形</summary>
                      /// <param name="x" type="Number">起始X坐标</param>
                      /// <param name="y" type="Number">起始Y坐标</param>
                      /// <param name="width" type="Number">矩形宽度</param>
                      /// <param name="height" type="Number">矩形高度</param>
                      /// <param name="color" type="Jyo.Color">颜色对象</param>
                      /// <param name="lineWidth" type="Number">线条宽度</param>

                      var ctx = this.context;
                      var transform = this.transform;
                      var shaderProgram = init2DShaders.call(this, transform.currentStack + 2, 0);
                      color = color.toVec4();

                      ctx.lineWidth(lineWidth);
                      this.useConvert(x, y, width, height, function () {
                          ctx.bindBuffer(ctx.ARRAY_BUFFER, this.rectVertexPositionBuffer);
                          ctx.vertexAttribPointer(shaderProgram.vertexPositionAttribute, 4, ctx.FLOAT, false, 0, 0);
                          transform.pushMatrix();
                          if (this.isBeginConvert) {
                              width = width - lineWidth,
                              height = height - lineWidth;
                              transform.translate(-0.5 * width, -0.5 * height);
                              transform.scale(width, height);
                          }
                          else {
                              transform.translate(x + lineWidth / 2, y + lineWidth / 2);
                              transform.scale(width - lineWidth, height - lineWidth);
                          }
                          sendTransformStack.call(this, shaderProgram);
                          ctx.uniform4f(shaderProgram.uColor, color[0], color[1], color[2], color[3]);
                          ctx.uniform1f(shaderProgram.uAlpha, this.globalAlpha);
                          ctx.drawArrays(ctx.LINE_LOOP, 0, 4);
                          transform.popMatrix();
                      });
                  }),
        fillRoundRect: Jyo.overload().
                       add("Jyo.Rectangle, Number", function (rect, radius) {
                           /// <summary>绘制实心圆角矩形</summary>
                           /// <param name="rect" type="Jyo.Rectangle">矩形对象</param>
                           /// <param name="radius" type="Number">圆角半径</param>

                           this.fillRoundRect(rect.x, rect.y, rect.width, rect.height, radius, Jyo.Colors.black);
                       }).
                       add("Jyo.Rectangle, Number, String", function (rect, radius, colorStr) {
                           /// <summary>绘制实心圆角矩形</summary>
                           /// <param name="rect" type="Jyo.Rectangle">矩形对象</param>
                           /// <param name="radius" type="Number">圆角半径</param>
                           /// <param name="colorStr" type="String">颜色字符串值</param>

                           this.fillRoundRect(rect.x, rect.y, rect.width, rect.height, radius, new Jyo.Color(colorStr));
                       }).
                       add("Jyo.Rectangle, Number, Jyo.Color", function (rect, radius, color) {
                           /// <summary>绘制实心圆角矩形</summary>
                           /// <param name="rect" type="Jyo.Rectangle">矩形对象</param>
                           /// <param name="radius" type="Number">圆角半径</param>
                           /// <param name="color" type="Jyo.Color">颜色对象</param>

                           this.fillRoundRect(rect.x, rect.y, rect.width, rect.height, radius, color);
                       }).
                       add("Number, Number, Number, Number, Number", function (x, y, width, height, radius) {
                           /// <summary>绘制实心圆角矩形</summary>
                           /// <param name="x" type="Number">起始X坐标</param>
                           /// <param name="y" type="Number">起始Y坐标</param>
                           /// <param name="width" type="Number">矩形宽度</param>
                           /// <param name="height" type="Number">矩形高度</param>
                           /// <param name="radius" type="Number">圆角半径</param>

                           this.fillRoundRect(x, y, width, height, radius, Jyo.Colors.black);
                       }).
                       add("Number, Number, Number, Number, Number, String", function (x, y, width, height, radius, colorStr) {
                           /// <summary>绘制实心矩形</summary>
                           /// <param name="x" type="Number">起始X坐标</param>
                           /// <param name="y" type="Number">起始Y坐标</param>
                           /// <param name="width" type="Number">矩形宽度</param>
                           /// <param name="height" type="Number">矩形高度</param>
                           /// <param name="radius" type="Number">圆角半径</param>
                           /// <param name="colorStr" type="String">颜色字符串值</param>

                           this.fillRoundRect(x, y, width, height, radius, new Jyo.Color(colorStr));
                       }).
                       add("Number, Number, Number, Number, Number, Jyo.Color", function (x, y, width, height, radius, color) {
                           /// <summary>绘制实心圆角矩形</summary>
                           /// <param name="x" type="Number">起始X坐标</param>
                           /// <param name="y" type="Number">起始Y坐标</param>
                           /// <param name="width" type="Number">矩形宽度</param>
                           /// <param name="height" type="Number">矩形高度</param>
                           /// <param name="radius" type="Number">圆角半径</param>
                           /// <param name="color" type="Jyo.Color">颜色对象</param>

                           var ps = [];

                           ps.push(x, y + radius);
                           ps = ps.concat(Math.getBezierCurvePoints(x, y + height - radius, x, y + height, x + radius, y + height));
                           ps = ps.concat(Math.getBezierCurvePoints(x + width - radius, y + height, x + width, y + height, x + width, y + height - radius));
                           ps = ps.concat(Math.getBezierCurvePoints(x + width, y + radius, x + width, y, x + width - radius, y));
                           ps = ps.concat(Math.getBezierCurvePoints(x + radius, y, x, y, x, y + radius));

                           this.fillPolygon(ps, color);
                       }),
        drawRoundRect: Jyo.overload().
                       add("Jyo.Rectangle, Number", function (rect, radius) {
                           /// <summary>绘制实心圆角矩形</summary>
                           /// <param name="rect" type="Jyo.Rectangle">矩形对象</param>
                           /// <param name="radius" type="Number">圆角半径</param>

                           this.drawRoundRect(rect.x, rect.y, rect.width, rect.height, radius, Jyo.Colors.black, 1);
                       }).
                       add("Jyo.Rectangle, Number, Number", function (rect, radius, lineWidth) {
                           /// <summary>绘制实心圆角矩形</summary>
                           /// <param name="rect" type="Jyo.Rectangle">矩形对象</param>
                           /// <param name="radius" type="Number">圆角半径</param>
                           /// <param name="lineWidth" type="Number">线段宽度</param>

                           this.drawRoundRect(rect.x, rect.y, rect.width, rect.height, radius, Jyo.Colors.black, lineWidth);
                       }).
                       add("Jyo.Rectangle, Number, String", function (rect, radius, colorStr) {
                           /// <summary>绘制实心圆角矩形</summary>
                           /// <param name="rect" type="Jyo.Rectangle">矩形对象</param>
                           /// <param name="radius" type="Number">圆角半径</param>
                           /// <param name="colorStr" type="String">颜色字符串值</param>

                           this.drawRoundRect(rect.x, rect.y, rect.width, rect.height, radius, new Jyo.Color(colorStr), 1);
                       }).
                       add("Jyo.Rectangle, Number, String, Number", function (rect, radius, colorStr, lineWidth) {
                           /// <summary>绘制实心圆角矩形</summary>
                           /// <param name="rect" type="Jyo.Rectangle">矩形对象</param>
                           /// <param name="radius" type="Number">圆角半径</param>
                           /// <param name="colorStr" type="String">颜色字符串值</param>
                           /// <param name="lineWidth" type="Number">线段宽度</param>

                           this.drawRoundRect(rect.x, rect.y, rect.width, rect.height, radius, new Jyo.Color(colorStr), lineWidth);
                       }).
                       add("Jyo.Rectangle, Number, Jyo.Color", function (rect, radius, color) {
                           /// <summary>绘制实心圆角矩形</summary>
                           /// <param name="rect" type="Jyo.Rectangle">矩形对象</param>
                           /// <param name="radius" type="Number">圆角半径</param>
                           /// <param name="color" type="Jyo.Color">颜色对象</param>

                           this.drawRoundRect(rect.x, rect.y, rect.width, rect.height, radius, color, 1);
                       }).
                       add("Jyo.Rectangle, Number, Jyo.Color, Number", function (rect, radius, color, lineWidth) {
                           /// <summary>绘制实心圆角矩形</summary>
                           /// <param name="rect" type="Jyo.Rectangle">矩形对象</param>
                           /// <param name="radius" type="Number">圆角半径</param>
                           /// <param name="color" type="Jyo.Color">颜色对象</param>
                           /// <param name="lineWidth" type="Number">线段宽度</param>

                           this.drawRoundRect(rect.x, rect.y, rect.width, rect.height, radius, color, lineWidth);
                       }).
                       add("Number, Number, Number, Number, Number", function (x, y, width, height, radius) {
                           /// <summary>绘制实心圆角矩形</summary>
                           /// <param name="x" type="Number">起始X坐标</param>
                           /// <param name="y" type="Number">起始Y坐标</param>
                           /// <param name="width" type="Number">矩形宽度</param>
                           /// <param name="height" type="Number">矩形高度</param>
                           /// <param name="radius" type="Number">圆角半径</param>

                           this.drawRoundRect(x, y, width, height, radius, Jyo.Colors.black, 1);
                       }).
                       add("Number, Number, Number, Number, Number, Number", function (x, y, width, height, radius, lineWidth) {
                           /// <summary>绘制实心圆角矩形</summary>
                           /// <param name="x" type="Number">起始X坐标</param>
                           /// <param name="y" type="Number">起始Y坐标</param>
                           /// <param name="width" type="Number">矩形宽度</param>
                           /// <param name="height" type="Number">矩形高度</param>
                           /// <param name="radius" type="Number">圆角半径</param>
                           /// <param name="lineWidth" type="Number">线段宽度</param>

                           this.drawRoundRect(x, y, width, height, radius, Jyo.Colors.black, lineWidth);
                       }).
                       add("Number, Number, Number, Number, Number, Jyo.Color", function (x, y, width, height, radius, color) {
                           /// <summary>绘制实心圆角矩形</summary>
                           /// <param name="x" type="Number">起始X坐标</param>
                           /// <param name="y" type="Number">起始Y坐标</param>
                           /// <param name="width" type="Number">矩形宽度</param>
                           /// <param name="height" type="Number">矩形高度</param>
                           /// <param name="radius" type="Number">圆角半径</param>
                           /// <param name="color" type="Jyo.Color">颜色对象</param>

                           this.drawRoundRect(x, y, width, height, radius, color, 1);
                       }).
                       add("Number, Number, Number, Number, Number, String", function (x, y, width, height, radius, colorStr) {
                           /// <summary>绘制实心圆角矩形</summary>
                           /// <param name="x" type="Number">起始X坐标</param>
                           /// <param name="y" type="Number">起始Y坐标</param>
                           /// <param name="width" type="Number">矩形宽度</param>
                           /// <param name="height" type="Number">矩形高度</param>
                           /// <param name="radius" type="Number">圆角半径</param>
                           /// <param name="colorStr" type="String">颜色字符串值</param>

                           this.drawRoundRect(x, y, width, height, radius, new Jyo.Color(colorStr), 1);
                       }).
                       add("Number, Number, Number, Number, Number, String, Number", function (x, y, width, height, radius, colorStr, lineWidth) {
                           /// <summary>绘制实心圆角矩形</summary>
                           /// <param name="x" type="Number">起始X坐标</param>
                           /// <param name="y" type="Number">起始Y坐标</param>
                           /// <param name="width" type="Number">矩形宽度</param>
                           /// <param name="height" type="Number">矩形高度</param>
                           /// <param name="radius" type="Number">圆角半径</param>
                           /// <param name="colorStr" type="String">颜色字符串值</param>
                           /// <param name="lineWidth" type="Number">线段宽度</param>

                           this.drawRoundRect(x, y, width, height, radius, new Jyo.Color(colorStr), lineWidth);
                       }).
                       add("Number, Number, Number, Number, Number, Jyo.Color, Number", function (x, y, width, height, radius, color, lineWidth) {
                           /// <summary>绘制实心圆角矩形</summary>
                           /// <param name="x" type="Number">起始X坐标</param>
                           /// <param name="y" type="Number">起始Y坐标</param>
                           /// <param name="width" type="Number">矩形宽度</param>
                           /// <param name="height" type="Number">矩形高度</param>
                           /// <param name="radius" type="Number">圆角半径</param>
                           /// <param name="color" type="Jyo.Color">颜色对象</param>
                           /// <param name="lineWidth" type="Number">线段宽度</param>

                           var ps = [];

                           ps.push(x, y + radius);
                           ps = ps.concat(Math.getBezierCurvePoints(x, y + height - radius, x, y + height, x + radius, y + height));
                           ps = ps.concat(Math.getBezierCurvePoints(x + width - radius, y + height, x + width, y + height, x + width, y + height - radius));
                           ps = ps.concat(Math.getBezierCurvePoints(x + width, y + radius, x + width, y, x + width - radius, y));
                           ps = ps.concat(Math.getBezierCurvePoints(x + radius, y, x, y, x, y + radius));

                           this.drawPolygon(ps, color);
                       }),
        drawImage: Jyo.overload().
                   add("any, Number, Number", function (element, x, y) {
                       /// <summary>绘制图象</summary>
                       /// <param name="element" type="Object">要绘制的元素</param>
                       /// <param name="x" type="Number">起始X坐标</param>
                       /// <param name="y" type="Number">起始Y坐标</param>

                       var el = element.object || element;
                       var w = el.width,
                           h = el.height;
                       this.drawImage(element, x, y, w, h);
                   }).
                   add("any, Number, Number, Number", function (element, x, y, alpha) {
                       /// <summary>绘制图象</summary>
                       /// <param name="element" type="Object">要绘制的元素</param>
                       /// <param name="x" type="Number">起始X坐标</param>
                       /// <param name="y" type="Number">起始Y坐标</param>
                       /// <param name="alpha" type="Number">Alpha值(取值0-1之间)</param>

                       this.globalAlpha = Math.clamp(alpha, 0, 1);
                       this.drawImage(element, x, y);
                       this.globalAlpha = 1;
                   }).
                   add("any, Jyo.Rectangle", function (element, rect) {
                       /// <summary>绘制图象</summary>
                       /// <param name="element" type="Object">要绘制的元素</param>
                       /// <param name="rect" type="Jyo.Rectangle">矩形对象</param>

                       this.drawImage(element, rect.x, rect.y, rect.width, rect.height);
                   }).
                   add("any, Jyo.Rectangle, Number", function (element, rect, alpha) {
                       /// <summary>绘制图象</summary>
                       /// <param name="element" type="Object">要绘制的元素</param>
                       /// <param name="rect" type="Jyo.Rectangle">矩形对象</param>
                       /// <param name="alpha" type="Number">Alpha值(取值0-1之间)</param>

                       this.globalAlpha = Math.clamp(alpha, 0, 1);
                       this.drawImage(element, rect.x, rect.y, rect.width, rect.height);
                       this.globalAlpha = 1;
                   }).
                   add("any, Jyo.Rectangle, Jyo.Rectangle", function (element, rect, crect) {
                       /// <summary>绘制图象</summary>
                       /// <param name="element" type="Object">要绘制的元素</param>
                       /// <param name="rect" type="Jyo.Rectangle">矩形对象</param>
                       /// <param name="crect" type="Jyo.Rectangle">剪裁矩形对象</param>

                       this.drawImage(element, rect.x, rect.y, rect.width, rect.height, crect.x, crect.y, crect.width, crect.height);
                   }).
                   add("any, Jyo.Rectangle, Jyo.Rectangle, Number ", function (element, rect, crect, alpha) {
                       /// <summary>绘制图象</summary>
                       /// <param name="element" type="Object">要绘制的元素</param>
                       /// <param name="rect" type="Jyo.Rectangle">矩形对象</param>
                       /// <param name="crect" type="Jyo.Rectangle">剪裁矩形对象</param>
                       /// <param name="alpha" type="Number">Alpha值(取值0-1之间)</param>

                       this.globalAlpha = Math.clamp(alpha, 0, 1);
                       this.drawImage(element, rect.x, rect.y, rect.width, rect.height, crect.x, crect.y, crect.width, crect.height);
                       this.globalAlpha = 1;
                   }).
                   add("any, Number, Number, Number, Number", function (element, x, y, width, height) {
                       /// <summary>绘制图象</summary>
                       /// <param name="element" type="Object">要绘制的元素</param>
                       /// <param name="x" type="Number">起始X坐标</param>
                       /// <param name="y" type="Number">起始Y坐标</param>
                       /// <param name="width" type="Number">图像宽度</param>
                       /// <param name="height" type="Number">图像高度</param>

                       element = element.object || element;
                       if (!(element instanceof WebGLTexture)) {
                           if (!element.glTexture) element.glTexture = this._bindTexture(element, element.width, element.height);
                           else this._bindTexture(element, element.width, element.height, element.glTexture);
                           element = element.glTexture;
                       }
                       this.useConvert(x, y, width, height, function () {
                           if (this.isBeginConvert) {
                               x = -0.5 * width;
                               y = -0.5 * height;
                           }

                           var transform = this.transform;
                           var ctx = this.context;

                           transform.pushMatrix();
                           transform.translate(x, y);
                           transform.scale(width, height);

                           var shaderProgram = init2DShaders.call(this, transform.currentStack, shaderMask.texture);
                           ctx.bindBuffer(ctx.ARRAY_BUFFER, this.rectVertexPositionBuffer);
                           ctx.vertexAttribPointer(shaderProgram.vertexPositionAttribute, 4, ctx.FLOAT, false, 0, 0);

                           ctx.bindTexture(ctx.TEXTURE_2D, element);
                           ctx.activeTexture(ctx.TEXTURE0);

                           ctx.uniform1i(shaderProgram.uSampler, 0);
                           ctx.uniform1f(shaderProgram.uAlpha, this.globalAlpha);

                           sendTransformStack.call(this, shaderProgram);
                           ctx.drawArrays(ctx.TRIANGLE_FAN, 0, 4);

                           transform.popMatrix();
                       });
                   }).
                   add("any, Number, Number, Number, Number, Number", function (element, x, y, width, height, alpha) {
                       /// <summary>绘制图象</summary>
                       /// <param name="element" type="Object">要绘制的元素</param>
                       /// <param name="x" type="Number">起始X坐标</param>
                       /// <param name="y" type="Number">起始Y坐标</param>
                       /// <param name="width" type="Number">图像宽度</param>
                       /// <param name="height" type="Number">图像高度</param>
                       /// <param name="alpha" type="Number">Alpha值(取值0-1之间)</param>

                       this.globalAlpha = Math.clamp(alpha, 0, 1);
                       this.drawImage(element, x, y, width, height);
                       this.globalAlpha = 1;
                   }).
                   add("any, Number, Number, Number, Number, Jyo.Rectangle", function (element, x, y, width, height, crect) {
                       /// <summary>绘制图象</summary>
                       /// <param name="element" type="Object">要绘制的元素</param>
                       /// <param name="x" type="Number">起始X坐标</param>
                       /// <param name="y" type="Number">起始Y坐标</param>
                       /// <param name="width" type="Number">图像宽度</param>
                       /// <param name="height" type="Number">图像高度</param>
                       /// <param name="crect" type="Jyo.Rectangle">剪裁矩形对象</param>

                       this.drawImage(element, x, y, width, height, crect.x, crect.y, crect.width, crect.height);
                   }).
                   add("any, Number, Number, Number, Number, Jyo.Rectangle, Number", function (element, x, y, width, height, crect, alpha) {
                       /// <summary>绘制图象</summary>
                       /// <param name="element" type="Object">要绘制的元素</param>
                       /// <param name="x" type="Number">起始X坐标</param>
                       /// <param name="y" type="Number">起始Y坐标</param>
                       /// <param name="width" type="Number">图像宽度</param>
                       /// <param name="height" type="Number">图像高度</param>
                       /// <param name="crect" type="Jyo.Rectangle">剪裁矩形对象</param>
                       /// <param name="alpha" type="Number">Alpha值(取值0-1之间)</param>

                       this.globalAlpha = Math.clamp(alpha, 0, 1);
                       this.drawImage(element, x, y, width, height, crect.x, crect.y, crect.width, crect.height);
                       this.globalAlpha = 1;
                   }).
                   add("any, Jyo.Rectangle, Number, Number, Number, Number", function (element, rect, cx, cy, cwidth, cheight) {
                       /// <summary>绘制图象</summary>
                       /// <param name="element" type="Object">要绘制的元素</param>
                       /// <param name="rect" type="Jyo.Rectangle">矩形对象</param>
                       /// <param name="cx" type="Number">在原图坐标上进行剪裁的起始X坐标</param>
                       /// <param name="cy" type="Number">在原图坐标上进行剪裁的起始Y坐标</param>
                       /// <param name="cwidth" type="Number">在原图坐标上进行剪裁的图像宽度</param>
                       /// <param name="cheight" type="Number">在原图坐标上进行剪裁的图像高度</param>

                       this.drawImage(element, rect.x, rect.y, rect.width, rect.height, cx, cy, cwidth, cheight);
                   }).
                   add("any, Jyo.Rectangle, Number, Number, Number, Number, Number", function (element, rect, cx, cy, cwidth, cheight, alpha) {
                       /// <summary>绘制图象</summary>
                       /// <param name="element" type="Object">要绘制的元素</param>
                       /// <param name="rect" type="Jyo.Rectangle">矩形对象</param>
                       /// <param name="cx" type="Number">在原图坐标上进行剪裁的起始X坐标</param>
                       /// <param name="cy" type="Number">在原图坐标上进行剪裁的起始Y坐标</param>
                       /// <param name="cwidth" type="Number">在原图坐标上进行剪裁的图像宽度</param>
                       /// <param name="cheight" type="Number">在原图坐标上进行剪裁的图像高度</param>
                       /// <param name="alpha" type="Number">Alpha值(取值0-1之间)</param>

                       this.globalAlpha = Math.clamp(alpha, 0, 1);
                       this.drawImage(element, rect.x, rect.y, rect.width, rect.height, cx, cy, cwidth, cheight);
                       this.globalAlpha = 1;
                   }).
                   add("any, Number, Number, Number, Number, Number, Number, Number, Number", function (element, x, y, width, height, cx, cy, cwidth, cheight) {
                       /// <summary>绘制图象</summary>
                       /// <param name="element" type="Object">要绘制的元素</param>
                       /// <param name="x" type="Number">起始X坐标</param>
                       /// <param name="y" type="Number">起始Y坐标</param>
                       /// <param name="width" type="Number">图像宽度</param>
                       /// <param name="height" type="Number">图像高度</param>
                       /// <param name="cx" type="Number">在原图坐标上进行剪裁的起始X坐标</param>
                       /// <param name="cy" type="Number">在原图坐标上进行剪裁的起始Y坐标</param>
                       /// <param name="cwidth" type="Number">在原图坐标上进行剪裁的图像宽度</param>
                       /// <param name="cheight" type="Number">在原图坐标上进行剪裁的图像高度</param>

                       element = element.object || element;
                       if (!(element instanceof WebGLTexture)) {
                           if (!element.glTexture) element.glTexture = this._bindTexture(element, element.width, element.height);
                           else this._bindTexture(element, element.width, element.height, element.glTexture);
                           element = element.glTexture;
                       }
                       this.useConvert(x, y, width, height, function () {
                           if (this.isBeginConvert) {
                               x = -0.5 * width;
                               y = -0.5 * height;
                           }

                           var transform = this.transform;
                           var ctx = this.context;

                           transform.pushMatrix();
                           transform.translate(x, y);
                           transform.scale(width, height);

                           var shaderProgram = init2DShaders.call(this, transform.currentStack, shaderMask.texture | shaderMask.crop);
                           ctx.uniform4f(shaderProgram.uCropSource, cx / element.width, cy / element.height, cwidth / element.width, cheight / element.height);
                           ctx.bindBuffer(ctx.ARRAY_BUFFER, this.rectVertexPositionBuffer);
                           ctx.vertexAttribPointer(shaderProgram.vertexPositionAttribute, 4, ctx.FLOAT, false, 0, 0);

                           ctx.bindTexture(ctx.TEXTURE_2D, element);
                           ctx.activeTexture(ctx.TEXTURE0);

                           ctx.uniform1i(shaderProgram.uSampler, 0);
                           ctx.uniform1f(shaderProgram.uAlpha, this.globalAlpha);

                           sendTransformStack.call(this, shaderProgram);
                           ctx.drawArrays(ctx.TRIANGLE_FAN, 0, 4);

                           transform.popMatrix();
                       });
                   }).
                   add("any, Number, Number, Number, Number, Number, Number, Number, Number, Number", function (element, x, y, width, height, cx, cy, cwidth, cheight, alpha) {
                       /// <summary>绘制图象</summary>
                       /// <param name="element" type="Object">要绘制的元素</param>
                       /// <param name="x" type="Number">起始X坐标</param>
                       /// <param name="y" type="Number">起始Y坐标</param>
                       /// <param name="width" type="Number">图像宽度</param>
                       /// <param name="height" type="Number">图像高度</param>
                       /// <param name="cx" type="Number">在原图坐标上进行剪裁的起始X坐标</param>
                       /// <param name="cy" type="Number">在原图坐标上进行剪裁的起始Y坐标</param>
                       /// <param name="cwidth" type="Number">在原图坐标上进行剪裁的图像宽度</param>
                       /// <param name="cheight" type="Number">在原图坐标上进行剪裁的图像高度</param>
                       /// <param name="alpha" type="Number">Alpha值(取值0-1之间)</param>

                       this.globalAlpha = Math.clamp(alpha, 0, 1);
                       this.drawImage(element, x, y, width, height, cx, cy, cwidth, cheight);
                       this.globalAlpha = 1;
                   }),
        drawText: Jyo.overload().
                  add("any, Number, Number", function (str, x, y) {
                      /// <summary>绘制文字</summary>
                      /// <param name="str" type="String">要显示的文字</param>
                      /// <param name="x" type="Number">起始X坐标</param>
                      /// <param name="y" type="Number">起始Y坐标</param>

                      this.drawText(str, x, y, Jyo.Colors.black, "");
                  }).
                  add("any, Number, Number, Jyo.Color", function (str, x, y, color) {
                      /// <summary>绘制文字</summary>
                      /// <param name="str" type="String">要显示的文字</param>
                      /// <param name="x" type="Number">起始X坐标</param>
                      /// <param name="y" type="Number">起始Y坐标</param>
                      /// <param name="color" type="Jyo.Color">颜色对象</param>

                      this.drawText(str, x, y, color, "");
                  }).
                  add("any, Number, Number, String", function (str, x, y, colorStr) {
                      /// <summary>绘制文字</summary>
                      /// <param name="str" type="String">要显示的文字</param>
                      /// <param name="x" type="Number">起始X坐标</param>
                      /// <param name="y" type="Number">起始Y坐标</param>
                      /// <param name="colorStr" type="String">颜色字符串值</param>

                      this.drawText(str, x, y, new Jyo.Color(colorStr), "");
                  }).
                  add("any, Number, Number, String, String", function (str, x, y, colorStr, font) {
                      /// <summary>绘制文字</summary>
                      /// <param name="str" type="String">要显示的文字</param>
                      /// <param name="x" type="Number">起始X坐标</param>
                      /// <param name="y" type="Number">起始Y坐标</param>
                      /// <param name="colorStr" type="String">颜色字符串值</param>
                      /// <param name="font" type="String">字体字符串值</param>

                      this.drawText(str, x, y, new Jyo.Color(colorStr), font);
                  }).
                  add("any, Number, Number, Jyo.Color, String", function (str, x, y, color, font) {
                      /// <summary>绘制文字</summary>
                      /// <param name="str" type="String">要显示的文字</param>
                      /// <param name="x" type="Number">起始X坐标</param>
                      /// <param name="y" type="Number">起始Y坐标</param>
                      /// <param name="color" type="Jyo.Color">颜色对象</param>
                      /// <param name="font" type="String">字体字符串值</param>

                      var ctx = this.context;
                      font = font || "14px Arial";

                      var strList = (str + "").split(/\r\n|\n|\r/ig);

                      var textSize = this.getTextSize(strList.join("<br/>"), font);
                      tempCtx.clearRect(0, 0, this.width, this.height);
                      tempCtx.fillStyle = color.toRgba() || "#000000";
                      tempCtx.font = font;

                      var fontSize = this.getTextSize(strList[0], ctx.font);
                      for (var i = 0; i < strList.length; i++) {
                          tempCtx.fillText(strList[i], 0, fontSize.height * (i + 0.76));
                      }
                      this.drawImage(tempCanvas, x, y);
                  }),
        drawLine: Jyo.overload().
                  add("Number, Number, Number, Number", function (x1, y1, x2, y2) {
                      /// <summary>绘制线段</summary>
                      /// <param name="x1" type="Number">起始X坐标</param>
                      /// <param name="y1" type="Number">起始Y坐标</param>
                      /// <param name="x2" type="Number">结束X坐标</param>
                      /// <param name="y2" type="Number">结束Y坐标</param>

                      this.drawLine(x1, y1, x2, y2, Jyo.Colors.black, 1);
                  }).
                  add("Number, Number, Number, Number, Jyo.Color", function (x1, y1, x2, y2, color) {
                      /// <summary>绘制线段</summary>
                      /// <param name="x1" type="Number">起始X坐标</param>
                      /// <param name="y1" type="Number">起始Y坐标</param>
                      /// <param name="x2" type="Number">结束X坐标</param>
                      /// <param name="y2" type="Number">结束Y坐标</param>
                      /// <param name="color" type="Jyo.Color">颜色对象</param>

                      this.drawLine(x1, y1, x2, y2, color, 1);
                  }).
                  add("Number, Number, Number, Number, String", function (x1, y1, x2, y2, colorStr) {
                      /// <summary>绘制线段</summary>
                      /// <param name="x1" type="Number">起始X坐标</param>
                      /// <param name="y1" type="Number">起始Y坐标</param>
                      /// <param name="x2" type="Number">结束X坐标</param>
                      /// <param name="y2" type="Number">结束Y坐标</param>
                      /// <param name="colorStr" type="String">颜色字符串值</param>

                      this.drawLine(x1, y1, x2, y2, new Jyo.Color(colorStr), 1);
                  }).
                  add("Number, Number, Number, Number, String, Number", function (x1, y1, x2, y2, colorStr, lineWidth) {
                      /// <summary>绘制线段</summary>
                      /// <param name="x1" type="Number">起始X坐标</param>
                      /// <param name="y1" type="Number">起始Y坐标</param>
                      /// <param name="x2" type="Number">结束X坐标</param>
                      /// <param name="y2" type="Number">结束Y坐标</param>
                      /// <param name="colorStr" type="String">颜色字符串值</param>
                      /// <param name="lineWidth" type="Number">线条宽度</param>

                      this.drawLine(x1, y1, x2, y2, new Jyo.Color(colorStr), lineWidth);
                  }).
                  add("Number, Number, Number, Number, Jyo.Color, Number", function (x1, y1, x2, y2, color, lineWidth) {
                      /// <summary>绘制线段</summary>
                      /// <param name="x1" type="Number">起始X坐标</param>
                      /// <param name="y1" type="Number">起始Y坐标</param>
                      /// <param name="x2" type="Number">结束X坐标</param>
                      /// <param name="y2" type="Number">结束Y坐标</param>
                      /// <param name="color" type="Jyo.Color">颜色对象</param>
                      /// <param name="lineWidth" type="Number">线条宽度</param>

                      var x = Math.min(x1, x2),
                              y = Math.min(y1, y2),
                              width = Math.max(x1, x2) - x,
                              height = Math.max(y1, y2) - y;

                      this.useConvert(x, y, width, height, function () {
                          var ctx = this.context;
                          ctx.lineWidth(lineWidth || 1.0);

                          beginPath.call(this);
                          moveTo.call(this, x1, y1);
                          lineTo.call(this, x2, y2);
                          closePath.call(this);
                          stroke.call(this, color);
                      });
                  }),
        drawPolygon: Jyo.overload().
                     add("Array", function (list) {
                         /// <summary>绘制空心多边形</summary>
                         /// <param name="list" type="Array">顶点列表</param>

                         this.drawPolygon(list, Jyo.Colors.black, 1);
                     }).
                     add("Array, Jyo.Color", function (list, color) {
                         /// <summary>绘制空心多边形</summary>
                         /// <param name="list" type="Array">顶点列表</param>
                         /// <param name="color" type="Jyo.Color">颜色对象</param>

                         this.drawPolygon(list, color, 1);
                     }).
                     add("Array, String", function (list, colorStr) {
                         /// <summary>绘制空心多边形</summary>
                         /// <param name="list" type="Array">顶点列表</param>
                         /// <param name="colorStr" type="String">颜色字符串值</param>

                         this.drawPolygon(list, new Jyo.Color(colorStr), 1);
                     }).
                     add("Array, String, Number", function (list, colorStr, lineWidth) {
                         /// <summary>绘制空心多边形</summary>
                         /// <param name="list" type="Array">顶点列表</param>
                         /// <param name="colorStr" type="String">颜色字符串值</param>
                         /// <param name="lineWidth" type="Number">线条宽度</param>

                         this.drawPolygon(list, new Jyo.Color(colorStr), lineWidth);
                     }).
                     add("Array, Jyo.Color, Number", function (list, color, lineWidth) {
                         /// <summary>绘制空心多边形</summary>
                         /// <param name="list" type="Array">顶点列表</param>
                         /// <param name="color" type="Jyo.Color">颜色对象</param>
                         /// <param name="lineWidth" type="Number">线条宽度</param>

                         if (list.length % 2 != 0) list.length = list.length - 1;
                         if (!list.length) return;

                         var x = list[0], y = list[1], w = list[0], h = list[1];

                         if (this.isBeginConvert) {
                             for (var i = list.length; i > 0; i -= 2) {
                                 x = Math.min(list[i], x);
                                 y = Math.min(list[i + 1], y);
                                 w = Math.max(list[i], w);
                                 h = Math.max(list[i + 1], h);
                             }
                             w -= x, h -= y;
                         }

                         this.useConvert(x, y, w, h, function () {
                             var ctx = this.context;
                             ctx.lineWidth(lineWidth || 1.0);

                             beginPath.call(this);
                             if (this.isBeginConvert) {
                                 for (var i = list.length; i > 0; i -= 2)
                                     lineTo.call(this, (list[i] - x) + (-0.5 * w), (list[i + 1] - y) + (-0.5 * h));
                             } else {
                                 moveTo.call(this, list[0], list[1]);
                                 for (var i = 2, len = list.length; i < len; i += 2)
                                     lineTo.call(this, list[i], list[i + 1]);
                             }
                             closePath.call(this);
                             stroke.call(this, color);
                         });
                     }),
        fillPolygon: Jyo.overload().
                     add("Array", function (list) {
                         /// <summary>绘制实心多边形</summary>
                         /// <param name="list" type="Array">顶点列表</param>

                         this.fillPolygon(list, Jyo.Colors.black);
                     }).
                     add("Array, String", function (list, colorStr) {
                         /// <summary>绘制实心多边形</summary>
                         /// <param name="list" type="Array">顶点列表</param>
                         /// <param name="colorStr" type="String">颜色字符串值</param>

                         this.fillPolygon(list, new Jyo.Color(colorStr));
                     }).
                     add("Array, Jyo.Color", function (list, color) {
                         /// <summary>绘制实心多边形</summary>
                         /// <param name="list" type="Array">顶点列表</param>
                         /// <param name="color" type="Jyo.Color">颜色对象</param>

                         if (list.length % 2 != 0) list.length = list.length - 1;
                         if (!list.length) return;

                         var x = list[0], y = list[1], w = list[0], h = list[1];

                         if (this.isBeginConvert) {
                             for (var i = list.length; i > 0; i -= 2) {
                                 x = Math.min(list[i], x);
                                 y = Math.min(list[i + 1], y);
                                 w = Math.max(list[i], w);
                                 h = Math.max(list[i + 1], h);
                             }
                             w -= x, h -= y;
                         }

                         this.useConvert(x, y, w, h, function () {
                             var ctx = this.context;

                             beginPath.call(this);
                             if (this.isBeginConvert) {
                                 for (var i = list.length; i > 0; i -= 2)
                                     lineTo.call(this, (list[i] - x) + (-0.5 * w), (list[i + 1] - y) + (-0.5 * h));
                             } else {
                                 moveTo.call(this, list[0], list[1]);
                                 for (var i = 2, len = list.length; i < len; i += 2)
                                     lineTo.call(this, list[i], list[i + 1]);
                             }
                             closePath.call(this);
                             fill.call(this, color);
                         });
                     })
    });

})(window, document, Jyo);