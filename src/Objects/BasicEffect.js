(function (window, document, Jyo, undefined) {
    "use strict";

    Jyo.BasicEffect = function (renderer) {
        /// <summary>基础效果器</summary>
        /// <param name="renderer" type="Jyo.Renderer">渲染器对象</param>
        /// <field name="diffuseColor" type="Jyo.Vector3">漫反射颜色</field>
        /// <field name="emissiveColor" type="Jyo.Vector3">自发光颜色</field>
        /// <field name="specularColor" type="Jyo.Vector3">镜面反射颜色</field>
        /// <field name="specularPower" type="Number">反射力度</field>
        /// <field name="lightDirection" type="Jyo.Vector3">光照方向</field>
        /// <field name="alpha" type="Number">透明度</field>
        /// <field name="vertexColorEnable" type="Boolean">是否开启顶点颜色</field>

        Jyo.Effect.call(this, renderer);

        this.diffuseColor = new Jyo.Vector3();
        this.emissiveColor = new Jyo.Vector3();
        this.specularColor = new Jyo.Vector3();
        this.specularPower = 0;
        this.lightDirection = new Jyo.Vector3(0.0, 0.5, 5.0);
        this.alpha = 1;
        this.vertexColorEnable = false;
    };

    // 顶点着色器代码
    var vsSource = [
        "attribute vec3 aVertexPosition;",
        "attribute vec3 aVertexNormal;",
        "attribute vec2 aVertexTextureCoord;",

        "uniform mat4 uWorldMatrix;",
        "uniform mat4 uProjectionMatrix;",
        "uniform mat4 uViewMatrix;",

        "varying vec4 vWorldSpaceNormal;",
        "varying vec2 vVertexTextureCoord;",
        "varying vec3 vVertexNormal;",

        "void main() {",
            "vVertexNormal = aVertexNormal;",
            "vWorldSpaceNormal = uWorldMatrix * vec4(aVertexNormal, 0.0);",
            "vVertexTextureCoord = aVertexTextureCoord;",
            "gl_Position = uProjectionMatrix * uViewMatrix * uWorldMatrix * vec4(aVertexPosition, 1.0);",
        "}"
    ].join("\n");

    // 片元着色器代码
    var fsSource = [
        "#ifdef GL_ES",
        "#ifdef GL_FRAGMENT_PRECISION_HIGH",
            "precision highp float;",
        "#else",
            "precision mediump float;",
        "#endif",
        "#endif",

        "varying vec4 vWorldSpaceNormal;",
        "varying vec2 vVertexTextureCoord;",
        "varying vec3 vVertexNormal;",

        "uniform sampler2D uDiffuseSampler;",
        "uniform sampler2D uEmissiveSampler;",

        "uniform mat4 uInvMatrix;",
        "uniform vec3 uLightDirection;",
        "uniform vec3 uEyeDirection;",
        "uniform vec4 uAmbientColor;",

        "void main() {",

            "vec4 color = texture2D(uDiffuseSampler, vVertexTextureCoord);",
            "vec4 color1 = texture2D(uEmissiveSampler, vVertexTextureCoord);",

            "color = vec4(max(color.rgb,color1.rgb),1);",

            "vec3  invLight  = normalize(uInvMatrix * vec4(uLightDirection, 0.0)).xyz;",
            "vec3  invEye    = normalize(uInvMatrix * vec4(uEyeDirection, 0.0)).xyz;",
            "vec3  halfLE    = normalize(invLight + invEye);",
            "float diffuse   = clamp(dot(vVertexNormal, invLight), 0.6, 1.0);",
            "float specular  = pow(clamp(dot(vVertexNormal, halfLE), 0.0, 0.6), 50.0);",
            "vec4  destColor = color * vec4(vec3(diffuse), 1) - vec4(vec3(0.05,0.05,0.06), 1.0) + uAmbientColor;",
            "gl_FragColor = destColor;",
        "}"
    ].join("\n");

    // 着色程序对象
    var program = null;

    Jyo.BasicEffect.read = function (xnb, model, content, renderer, dataView, offset) {
        /// <summary>读取基础效果</summary>
        /// <param name="xnb" type="Jyo.Xnb">Xnb对象</param>
        /// <param name="model" type="Jyo.Model">模型对象</param>
        /// <param name="content" type="Jyo.ContentManager">内容管理器</param>
        /// <param name="renderer" type="Jyo.Renderer">渲染器对象</param>
        /// <param name="dataView" type="DataView">数据视图</param>
        /// <param name="offset" type="Number">数据偏移量</param>

        var basicEffect = new Jyo.BasicEffect(renderer);

        var refTextures = model._refTextures = model._refTextures || [];

        var strLength = dataView.read7BitEncodedInt(offset++);
        var textureRef = dataView.getString(offset, strLength);
        offset += strLength;
        if (textureRef) {
            hasTexture: {
                for (var i = 0; i < refTextures.length; i++) {
                    if (refTextures[i].name == textureRef) {
                        basicEffect.texture = refTextures[i].texture;
                        break hasTexture;
                    }
                }
                var path = xnb.filename.replace(content.rootDirectory + "/", "").split("/");
                path[path.length - 1] = textureRef;
                var textureObj = {
                    name: textureRef,
                    texture: content.load(path.join("/"))
                };
                basicEffect.texture = textureObj.texture;
            }
            refTextures.push(textureObj);
            basicEffect.textureEnable = true;
        } else {
            basicEffect.textureEnable = false;
        }

        basicEffect.diffuseColor.x = Number.getSingle(dataView.getUint32(offset));
        offset += 4;
        basicEffect.diffuseColor.y = Number.getSingle(dataView.getUint32(offset));
        offset += 4;
        basicEffect.diffuseColor.z = Number.getSingle(dataView.getUint32(offset));
        offset += 4;

        basicEffect.emissiveColor.x = Number.getSingle(dataView.getUint32(offset));
        offset += 4;
        basicEffect.emissiveColor.y = Number.getSingle(dataView.getUint32(offset));
        offset += 4;
        basicEffect.emissiveColor.z = Number.getSingle(dataView.getUint32(offset));
        offset += 4;

        basicEffect.specularColor.x = Number.getSingle(dataView.getUint32(offset));
        offset += 4;
        basicEffect.specularColor.y = Number.getSingle(dataView.getUint32(offset));
        offset += 4;
        basicEffect.specularColor.z = Number.getSingle(dataView.getUint32(offset));
        offset += 4;

        basicEffect.specularPower = Number.getSingle(dataView.getUint32(offset));
        offset += 4;

        basicEffect.alpha = Number.getSingle(dataView.getUint32(offset));
        offset += 4;

        basicEffect.vertexColorEnable = !!dataView.getUint8(offset++);

        return {
            data: basicEffect,
            offset: offset
        };
    };

    Jyo.BasicEffect.prototype = Object.create(Jyo.Effect.prototype);
    Jyo.BasicEffect.prototype.constructor = Jyo.BasicEffect;

    Jyo.BasicEffect.prototype.initProgram = function (ctx) {
        /// <summary>初始化着色程序</summary>
        /// <param name="ctx" type="WebGLRenderingContext">WebGL渲染上下文</param>

        program = this._initProgram(vsSource, fsSource);

        program.diffuseSamplerUniform = ctx.getUniformLocation(program, "uDiffuseSampler");
        program.emissiveSamplerUniform = ctx.getUniformLocation(program, "uEmissiveSampler");

        program.invMatrixUniform = ctx.getUniformLocation(program, "uInvMatrix");
        program.lightDirectionUniform = ctx.getUniformLocation(program, "uLightDirection");
        program.eyeDirectionUniform = ctx.getUniformLocation(program, "uEyeDirection");
        program.ambientColorUniform = ctx.getUniformLocation(program, "uAmbientColor");
    };

    Jyo.BasicEffect.prototype.apply = Jyo.overload().
                                      add("Jyo.ModelMeshPart", function (part) {
                                          /// <summary>应用效果</summary>
                                          /// <param name="part" type="Jyo.ModelMeshPart">模型网格部件</param>

                                          var ctx = this._renderer.context;
                                          this._apply.call(this, ctx, part);
                                          this.apply.call(this, ctx, part);
                                          return true;
                                      }).
                                      add("CanvasRenderingContext2D, Jyo.ModelMeshPart", function (ctx, part) {
                                          /// <summary>应用效果</summary>
                                          /// <param name="ctx" type="WebGLRenderingContext">2D渲染上下文</param>
                                          /// <param name="part" type="Jyo.ModelMeshPart">模型网格部件</param>

                                          //console.log("2D模型效果应用");
                                      }).
                                      add("WebGL2RenderingContext, Jyo.ModelMeshPart", applyWebGL).
                                      add("WebGLRenderingContext, Jyo.ModelMeshPart", applyWebGL);

    function applyWebGL(gl, part) {
        /// <summary>应用效果</summary>
        /// <param name="gl" type="WebGLRenderingContext">WebGL渲染上下文</param>
        /// <param name="part" type="Jyo.ModelMeshPart">模型网格部件</param>

        var program = this.program;

        gl.uniformMatrix4fv(program.invMatrixUniform, false, Jyo.Matrix.inverse(this.world).to44Array());
        gl.uniform3fv(program.lightDirectionUniform, this.lightDirection.toArray());
        gl.uniform3fv(program.eyeDirectionUniform, this.view.eyeDirection.toArray());
        gl.uniform4fv(program.ambientColorUniform, [30 / 255, 30 / 255, 30 / 255, 1.0]);

        imageBreak: if (part.effect.textureEnable) {
            gl.activeTexture(gl.TEXTURE0);

            var element = part.effect.texture.object || part.effect.texture;
            if ((element instanceof Jyo.Xnb) && element.type !== "image") {
                break imageBreak;
            }

            if (!!element.glTexture) {
                element = element.glTexture;
            } else if (!(element instanceof WebGLTexture)) {
                if (!element.glTexture) element.glTexture = this._renderer._bindTexture(element, element.width, element.height, null);
                else this._renderer._bindTexture(element, element.width, element.height, element.glTexture);
                element = element.glTexture;
            }

            gl.bindTexture(gl.TEXTURE_2D, element);
            gl.uniform1i(program.diffuseSamplerUniform, 0.5);
            gl.uniform1i(program.emissiveSamplerUniform, 0);
        }
    }

})(window, document, Jyo);