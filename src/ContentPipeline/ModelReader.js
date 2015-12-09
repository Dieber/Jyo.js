(function (window, document, Jyo, undefined) {
    "use strict";

    Jyo.ContentManager.ModelContentReader = {
        // 是否自定义
        isCustom: false,
        // 程序集
        assemblies: "Microsoft.Xna.Framework.Content.ModelReader",
        read: function (content, xnb, dataView, offset, renderer, callback) {
            /// <summary>读取Model文件</summary>
            /// <param name="content" type="Jyo.ContentManager">资源管理器</param>
            /// <param name="xnb" type="Object">已有Xnb数据结构</param>
            /// <param name="dataView" type="DataView">数据视图</param>
            /// <param name="offset" type="Number">数据偏移量</param>
            /// <param name="renderer" type="Jyo.Renderer">要绑定的渲染器对象</param>
            /// <param name="callback" type="Function">回调函数</param>

            var sharedResourceCount = dataView.read7BitEncodedInt(offset);
            var sharedResourceFixups = [];
            var sharedResources = [];
            offset += 2;

            var model = new Jyo.Model();

            var bones = [];

            // 获取Bone数量
            var boneCount = dataView.getUint32(offset);
            offset += 5;

            for (var i = 0; i < boneCount; i++) {
                var strLength = dataView.read7BitEncodedInt(offset++);
                var name = dataView.getString(offset, strLength);
                offset += strLength;
                var matrix = [];

                for (var n = 0; n < 16; n++) {
                    matrix[n] = Number.getSingle(dataView.getUint32(offset));
                    offset += 4;
                }

                // 填充transform数据
                bones[i] = new Jyo.ModelBone(i, name, new Jyo.Matrix(matrix[0], matrix[1], matrix[2], matrix[3],
                                                            matrix[4], matrix[5], matrix[6], matrix[7],
                                                            matrix[8], matrix[9], matrix[10], matrix[11],
                                                            matrix[12], matrix[13], matrix[14], matrix[15]));

                offset += 1;
            }

            offset--;
            for (var i = 0; i < boneCount; i++) {
                if (boneCount < 255) {
                    bones[i].parent = bones[dataView.getUint8(offset) - 1] || null;
                    offset++;
                } else {
                    bones[i].parent = bones[dataView.getUint32(offset) - 1] || null;
                    offset += 4;
                }
                if (bones[i].parent == bones[i]) bones[i].parent = null;

                var childCount = dataView.getUint32(offset);
                offset += 4;

                for (var n = 0; n < childCount; n++) {
                    if (boneCount < 255) {
                        bones[i].children[n] = bones[dataView.getUint8(offset) - 1] || null;
                        offset++;
                    } else {
                        bones[i].children[n] = bones[dataView.getUint32(offset) - 1] || null;
                        offset += 4;
                    }
                }
            }

            var meshes = [];

            // 获取Mesh数量
            var meshCount = dataView.getUint32(offset);
            offset += 5;

            for (var i = 0; i < meshCount; i++) {
                var strLength = dataView.read7BitEncodedInt(offset++);
                var name = dataView.getString(offset, strLength);
                offset += strLength;

                var mesh = new Jyo.ModelMesh(renderer);
                mesh.name = name;

                if (boneCount < 255) {
                    mesh.parentBone = bones[dataView.getUint8(offset) - 1] || null;
                    offset++;
                } else {
                    mesh.parentBone = bones[dataView.getUint32(offset) - 1] || null;
                    offset += 4;
                }

                var vec3 = new Jyo.Vector3();
                vec3.x = Number.getSingle(dataView.getUint32(offset));
                offset += 4;
                vec3.y = Number.getSingle(dataView.getUint32(offset));
                offset += 4;
                vec3.z = Number.getSingle(dataView.getUint32(offset));
                offset += 4;
                mesh.boundingSphere = new Jyo.BoundingSphere(vec3, Number.getSingle(dataView.getUint32(offset)));
                offset += 4;

                var typeId = dataView.read7BitEncodedInt(offset++);
                if (typeId > 0) {
                    typeId--;
                    if (typeId > xnb.typeReaders.length) {
                        throw "无效的数据读取器指定";
                    }
                    throw "不支持自定义数据标签";
                    mesh.tag = xnb.typeReaders[typeId];
                }

                var parts = [];

                var partCount = dataView.getUint32(offset);
                offset += 4;

                for (var n = 0; n < partCount; n++) {
                    var meshPart = new Jyo.ModelMeshPart();
                    meshPart.vertexOffset = dataView.getUint32(offset);
                    offset += 4;
                    meshPart.numVertices = dataView.getUint32(offset);
                    offset += 4;
                    meshPart.startIndex = dataView.getUint32(offset);
                    offset += 4;
                    meshPart.primitiveCount = dataView.getUint32(offset);
                    offset += 4;

                    typeId = dataView.read7BitEncodedInt(offset++);
                    if (typeId > 0) {
                        typeId--;
                        if (typeId > xnb.typeReaders.length) {
                            throw "无效的数据读取器指定";
                        }
                        throw "不支持自定义数据标签";
                        meshPart.tag = xnb.typeReaders[typeId];
                    }

                    meshPart.vertexBuffer = dataView.read7BitEncodedInt(offset++) - 1;
                    sharedResourceFixups.push({
                        obj: meshPart,
                        name: "vertexBuffer",
                        index: meshPart.vertexBuffer
                    });
                    meshPart.indexBuffer = dataView.read7BitEncodedInt(offset++) - 1;
                    sharedResourceFixups.push({
                        obj: meshPart,
                        name: "indexBuffer",
                        index: meshPart.indexBuffer
                    });
                    meshPart.effect = dataView.read7BitEncodedInt(offset++) - 1;
                    sharedResourceFixups.push({
                        obj: meshPart,
                        name: "effect",
                        index: meshPart.effect
                    });

                    parts.push(meshPart);
                }
                mesh.meshParts = parts;
                meshes.push(mesh);

                offset += 1;
            }

            offset--;
            model.bones = bones;
            model.meshes = meshes;
            if (boneCount < 255) {
                model.root = bones[dataView.getUint8(offset) - 1] || null;
                offset++;
            } else {
                model.root = bones[dataView.getUint32(offset) - 1] || null;
                offset += 4;
            }
            var typeId = dataView.read7BitEncodedInt(offset++);
            if (typeId > 0) {
                typeId--;
                if (typeId > xnb.typeReaders.length) {
                    throw "无效的数据读取器指定";
                }
                throw "不支持自定义数据标签";
                model.tag = xnb.typeReaders[typeId];
            }

            if (sharedResourceCount && sharedResourceFixups.length) {
                for (var i = 0; i < sharedResourceCount; i++) {

                    var typeReaderIndex = dataView.read7BitEncodedInt(offset);
                    offset++;
                    if (typeReaderIndex == 0) {
                        sharedResources[i] = null;
                        continue;
                    }

                    if (typeReaderIndex > xnb.typeReaders.length) {
                        throw "无效的类型读取器指定";
                    }

                    var typeReader = xnb.typeReaders[typeReaderIndex - 1];

                    var r = switchReader(xnb, model, content, renderer, typeReader, dataView, offset);

                    offset = r.offset;

                    // 读取sharedResource数据
                    sharedResources[i] = r.data;
                }
                var srf;
                for (var i = 0; i < sharedResourceFixups.length; i++) {
                    srf = sharedResourceFixups[i];
                    srf.obj[srf.name] = sharedResources[srf.index];
                }
            }

            delete model._refTextures;

            // 数据内容对象
            xnb.type = "model";
            xnb.object = model;
            callback && callback(xnb);
        }
    };

    function switchReader(xnb, model, content, renderer, reader, dataView, offset) {
        if (reader.indexOf("Microsoft.Xna.Framework.Content.VertexBufferReader") != -1) {
            return Jyo.VertexBuffer.read(renderer, dataView, offset);
        }

        if (reader.indexOf("Microsoft.Xna.Framework.Content.IndexBufferReader") != -1) {
            return Jyo.IndexBuffer.read(renderer, dataView, offset);
        }

        if (reader.indexOf("Microsoft.Xna.Framework.Content.BasicEffectReader") != -1) {
            return Jyo.BasicEffect.read(xnb, model, content, renderer, dataView, offset);
        }
    }

})(window, document, Jyo);