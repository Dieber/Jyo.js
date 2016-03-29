(function (window, document, Jyo, undefined) {
    "use strict";

    Jyo.ModelMeshPart = function () {
        /// <summary>模型网格部件</summary>
        /// <field name="effect" type="Jyo.Effect">使用的效果对象</field>
        /// <field name="indexBuffer" type="Jyo.IndexBuffer">索引缓冲相关对象</field>
        /// <field name="numVertices" type="Number">[不被使用]顶点数量</field>
        /// <field name="primitiveCount" type="Number">图元数量</field>
        /// <field name="startIndex" type="Number">在索引缓冲区中的起始索引</field>
        /// <field name="tag" type="Object">标签</field>
        /// <field name="vertexBuffer" type="Jyo.VertexBuffer">顶点缓冲相关对象</field>
        /// <field name="vertexOffset" type="Number">顶点在索引缓冲中的偏移量</field>

        this.effect = null;
        this.indexBuffer = null;
        this.numVertices = 0;
        this.primitiveCount = 0;
        this.startIndex = 0;
        this.tag = null;
        this.vertexBuffer = null;
        this.vertexOffset = 0;
    };

    Jyo.ModelBone = function (index, name, transform) {
        /// <summary>模型骨骼</summary>
        /// <field name="name" type="String">骨骼名称</field>
        /// <field name="index" type="Number">骨骼索引</field>
        /// <field name="transform" type="Jyo.Matrix">骨骼矩阵</field>
        /// <field name="parent" type="Jyo.ModelBone">父骨骼</field>
        /// <field name="children" type="Array<Jyo.ModelBone>">子骨骼数组</field>

        this.name = name;
        this.index = index;
        this.transform = transform;
        this.parent = null;
        this.children = [];
    };

    Jyo.ModelMesh = function (renderer) {
        /// <summary>模型网格</summary>
        /// <field name="boundingSphere" type="Jyo.BoundingSphere">包围球对象</field>
        /// <field name="meshParts" type="Jyo.ModelMeshPart">模型部件对象</field>
        /// <field name="name" type="String">网格名称</field>
        /// <field name="parentBone" type="Jyo.ModelBone">父骨骼</field>
        /// <field name="tag" type="Object">标签</field>
        /// <field name="effects" type="Array<Jyo.Effect>">网格内所有部件使用的效果对象数组</field>

        var _this = this;

        this.boundingSphere = null;
        this.meshParts = [];
        this.name = "";
        this.parentBone = null;
        this.tag = null;
        this._renderer = renderer;

        var effects = [];
        Object.defineProperty(this, "effects", {
            get: function () {
                effects.length = 0;
                var len = _this.meshParts.length;
                while (len--) {
                    effects[len] = _this.meshParts[len].effect;
                }
                return effects;
            }
        });
    };

    Jyo.ModelMesh.prototype = {
        draw: Jyo.overload().
              add(null, function () {
                  /// <summary>绘制模型网格</summary>

                  this.draw(this._renderer.context);
              }).
              add("CanvasRenderingContext2D", function (ctx) {
                  /// <summary>绘制模型网格</summary>

                  //console.log("2d绘制模型");
                  //for (var i = 0; i < this.meshParts.length; i++) {
                  //    var part = this.meshParts[i];
                  //    var effect = part.effect;

                  //    if (part.primitiveCount > 0) {

                  //        var shortIndices = part.indexBuffer.indexElementSize == "SixteenBits";

                  //        effect.apply(part);
                  //    }
                  //}
              }).
              add("WebGL2RenderingContext", drawWebGL).
              add("WebGLRenderingContext", drawWebGL)
    };

    function drawWebGL(gl) {
        /// <summary>绘制模型网格</summary>
        /// <param name="gl" type="WebGLRenderingContext">WebGL上下文</param>

        for (var i = 0; i < this.meshParts.length; i++) {
            var part = this.meshParts[i];
            var effect = part.effect;

            if (part.primitiveCount > 0) {
                gl.bindBuffer(gl.ARRAY_BUFFER, part.vertexBuffer.buffer);
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, part.indexBuffer.buffer);

                var shortIndices = part.indexBuffer.indexElementSize == "SixteenBits";

                var indexElementType = shortIndices ? gl.UNSIGNED_SHORT : gl.UNSIGNED_BYTE;
                var indexElementSize = shortIndices ? 2 : 4;
                var indexOffsetInBytes = (part.startIndex * indexElementSize);
                var indexElementCount = part.primitiveCount * 3;

                effect.apply(part);

                gl.drawElements(gl.TRIANGLES, indexElementCount, indexElementType, indexOffsetInBytes);
            }
        }
    }

    var sharedDrawBoneMatrices = [];

    Jyo.Model = function () {
        /// <summary>模型</summary>
        /// <field name="root" type="Jyo.ModelBone">根骨骼</field>
        /// <field name="tag" type="Object">标签</field>
        /// <field name="bones" type="Array<Jyo.ModelBone>">所有骨骼数组</field>
        /// <field name="meshes" type="Array<Jyo.ModelMesh>">所有网格数组</field>
        /// <field name="position" type="Jyo.Vector3">模型位置</field>
        /// <field name="scale" type="Jyo.Vector3">模型缩放</field>
        /// <field name="rotate" type="Jyo.Vector3">模型旋转</field>

        var _this = this;
        this.root = null;
        this.tag = null;
        this.bones = [];
        this.meshes = [];

        this.position = new Jyo.Vector3();
        this.scale = new Jyo.Vector3(1, 1, 1);

        var rotate = new Jyo.Vector3(0, 0, 0);
        Object.defineProperty(this, "rotate", {
            get: function () {
                return rotate;
            },
            set: function (value) {
                rotate.x = value.x % Math.TWO_PI;
                rotate.y = value.y % Math.TWO_PI;
                rotate.z = value.z % Math.TWO_PI;
            }
        });

        Object.defineProperty(this, "boundingSpheres", {
            get: function () {
                var list = [];
                var mesh = null;
                for (var i = 0; i < _this.meshes.length; i++) {
                    mesh = _this.meshes[i];
                    var newPosition = new Jyo.Vector3();
                    Jyo.Vector3.add(mesh.boundingSphere.center, _this.position, newPosition);
                    var sphere = new Jyo.BoundingSphere(newPosition, mesh.boundingSphere.radius);
                    sphere.parent = mesh;
                    list.push(sphere);
                }
                return list;
            }
        });
    };

    Jyo.Model.prototype = {
        draw: Jyo.overload().
              add("Jyo.Matrix, Jyo.Matrix, Jyo.Matrix", function (world, view, projection) {
                  /// <summary>绘制模型</summary>
                  /// <param name="world" type="Jyo.Matrix">世界矩阵</param>
                  /// <param name="view" type="Jyo.Matrix"></param>
                  /// <param name="projection" type="Jyo.Matrix">投影矩阵</param>

                  this.copyAbsoluteBoneTransformsTo(sharedDrawBoneMatrices);

                  var mesh;
                  var effect;
                  for (var i = 0, lenI = this.meshes.length; i < lenI ; i++) {
                      mesh = this.meshes[i];
                      for (var n = 0, effects = mesh.effects, lenN = effects.length; n < lenN; n++) {
                          effect = effects[n];

                          Jyo.Matrix.multiply(sharedDrawBoneMatrices[mesh.parentBone.index], world, effect.world);
                          Jyo.Matrix.multiply(effect.world, Jyo.Matrix.createRotateX(this.rotate.x));
                          Jyo.Matrix.multiply(effect.world, Jyo.Matrix.createRotateY(this.rotate.y));
                          Jyo.Matrix.multiply(effect.world, Jyo.Matrix.createRotateZ(this.rotate.z));
                          Jyo.Matrix.multiply(effect.world, Jyo.Matrix.createScale(this.scale.x, this.scale.y, this.scale.z));
                          Jyo.Matrix.multiply(effect.world, Jyo.Matrix.createTranslation(this.position.x, this.position.y, this.position.z));
                          effect.view = view;
                          effect.projection = projection;
                      }

                      mesh.draw();
                  }
              }),
        copyAbsoluteBoneTransformsTo: function (destinationBoneTransforms) {
            /// <summary>拷贝相对骨骼变换到数组</summary>
            /// <param name="destinationBoneTransforms" type="Array">数组</param>

            var count = this.bones.length;
            for (var index1 = 0; index1 < count; ++index1) {
                var modelBone = (this.bones)[index1];
                if (modelBone.parent == null) {
                    destinationBoneTransforms[index1] = modelBone.transform;
                }
                else {
                    var index2 = modelBone.parent.index;
                    destinationBoneTransforms[index1] = new Jyo.Matrix();
                    Jyo.Matrix.multiply(modelBone.transform, destinationBoneTransforms[index2], destinationBoneTransforms[index1]);
                }
            }
        },
        copyBoneTransformsFrom: function (sourceBoneTransforms) {
            /// <summary>从数组拷入骨骼变换数据</summary>
            /// <param name="sourceBoneTransforms" type="Array">源骨骼变换数组</param>

            var count = this.bones.length;
            for (var i = 0; i < count; i++) {
                this.bones[i].transform = sourceBoneTransforms[i];
            }
        },
        copyBoneTransformsTo: function (destinationBoneTransforms) {
            /// <summary>拷贝骨骼变换数据到数组</summary>
            /// <param name="destinationBoneTransforms" type="Array">数组</param>

            var count = this.bones.length;
            for (var i = 0; i < count; i++) {
                destinationBoneTransforms[i] = this.bones[i].transform;
            }
        }
    };

})(window, document, Jyo);