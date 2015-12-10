(function (window, document, Jyo, undefined) {
    "use strict";

    Jyo.Effect = function (renderer) {
        /// <summary>效果</summary>
        /// <field name="program" type="WebGLProgram">GL着色程序对象</field>
        /// <field name="world" type="Jyo.Matrix">世界矩阵</field>
        /// <field name="view" type="Jyo.Matrix">视图矩阵</field>
        /// <field name="projection" type="Jyo.Matrix">透视矩阵</field>

        var _this = this;
        this._renderer = renderer;
        this._program = null;
        this.world = Jyo.Matrix.identity;
        this.view = Jyo.Matrix.identity;
        this.projection = Jyo.Matrix.identity;
        Object.defineProperty(this, "program", {
            get: function () {
                if (!_this._program) {
                    _this.initProgram(renderer.context);
                }
                return _this._program;
            }
        });
    };

    Jyo.Effect.prototype = {
        _initProgram: function (vsSource, fsSource) {
            /// <summary>初始化渲染程序</summary>
            /// <param name="vsSource" type="String">顶点渲染器源码</param>
            /// <param name="fsSource" type="String">片元渲染器源码</param>
            /// <returns type="WebGLProgram" />

            var ctx = this._renderer.context;
            var program = renderer._shaderBuilder(vsSource, fsSource);
            ctx.useProgram(program);
            program.vertexPositionAttribute = ctx.getAttribLocation(program, "aVertexPosition");
            program.vertexNormalAttribute = ctx.getAttribLocation(program, "aVertexNormal");
            program.vertexTextureCoordAttribute = ctx.getAttribLocation(program, "aVertexTextureCoord");
            program.worldMatrixUniform = ctx.getUniformLocation(program, "uWorldMatrix");
            program.projectionMatrixUniform = ctx.getUniformLocation(program, "uProjectionMatrix");
            program.viewMatrixUniform = ctx.getUniformLocation(program, "uViewMatrix");
            this._program = program;
            return program;
        },
        _apply: Jyo.overload().
                add("CanvasRenderingContext2D, Jyo.ModelMeshPart", function (ctx, part) {
                    /// <summary>应用效果</summary>
                    /// <param name="ctx" type="WebGLRenderingContext">2D渲染上下文</param>
                    /// <param name="part" type="Jyo.ModelMeshPart">模型网格部件</param>

                    //console.log("2D模型效果应用");
                }).
                add("WebGLRenderingContext, Jyo.ModelMeshPart", function (gl, part) {
                    /// <summary>应用效果</summary>
                    /// <param name="gl" type="WebGLRenderingContext">WebGL上下文对象</param>
                    /// <param name="part" type="Jyo.ModelMeshPart">模型网格部分对象</param>

                    var program = this.program;

                    gl.useProgram(program);

                    var declaration = part.vertexBuffer.declaration;

                    var vertexOffset = declaration.vertexStride * part.vertexOffset;

                    var positionOffset = 0;
                    var normalOffset = 0;
                    var textureCoordOffset = 0;
                    for (var i in declaration.elements) {
                        var el = declaration.elements[i];
                        var usage = el.vertexElementUsage;
                        if (usage == "Position" && !positionOffset) {
                            positionOffset = el.offset;
                        } else if (usage == "Normal" && !normalOffset) {
                            normalOffset = el.offset;
                        } else if (usage == "TextureCoordinate" && !textureCoordOffset) {
                            textureCoordOffset = el.offset;
                        }
                    }

                    gl.vertexAttribPointer(program.vertexPositionAttribute, 3, gl.FLOAT, false, declaration.vertexStride, positionOffset + vertexOffset);
                    gl.vertexAttribPointer(program.vertexNormalAttribute, 3, gl.FLOAT, false, declaration.vertexStride, normalOffset + vertexOffset);
                    gl.vertexAttribPointer(program.vertexTextureCoordAttribute, 2, gl.FLOAT, false, declaration.vertexStride, textureCoordOffset + vertexOffset);

                    gl.enableVertexAttribArray(program.vertexPositionAttribute);
                    gl.enableVertexAttribArray(program.vertexNormalAttribute);
                    gl.enableVertexAttribArray(program.vertexTextureCoordAttribute);

                    // 世界矩阵设置
                    gl.uniformMatrix4fv(program.worldMatrixUniform, false, this.world.to44Array());

                    // 投影矩阵设置
                    gl.uniformMatrix4fv(program.projectionMatrixUniform, false, this.projection.to44Array());

                    // 视图矩阵设置
                    gl.uniformMatrix4fv(program.viewMatrixUniform, false, this.view.to44Array());
                }),
        destroy: function () {
            /// <summary>销毁</summary>

            var gl = this._renderer.context;
            var program = this.program;
            var fs = program.fragmentShader;
            var vs = program.vertexShader;
            gl.deleteProgram(program);
            gl.deleteShader(fs);
            gl.deleteShader(vs);
            for (var i in this) delete this[i];
        }
    };

})(window, document, Jyo);