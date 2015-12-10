(function (window, document, Jyo, undefined) {
    "use strict";

    Jyo.VertexBuffer = function (declaration, vertexCount, buffer, arr) {
        /// <summary>顶点缓冲区</summary>
        /// <param name="declaration" type="Object"></param>
        /// <param name="vertexCount" type="Number">顶点数量</param>
        /// <param name="buffer" type="WebGLBuffer">GL缓冲区对象</param>
        /// <param name="arr" type="Array">原始数据</param>

        /// <field name="declaration" type="Object">声明对象</field>
        /// <field name="vertexCount" type="Number">顶点数量</field>
        /// <field name="bufferUsage" type="String">缓冲区用处</field>
        /// <field name="buffer" type="WebGLBuffer">GL缓冲区对象</field>

        this.declaration = declaration;
        this.vertexCount = vertexCount;
        this.bufferUsage = "None";
        this.buffer = buffer;
        this._arr = arr;
    };

    console.warn("顶点缓冲区对象getData函数实现错误");
    // 8 8 8 8 8 8 8 8 1 1 1 1
    // 0 0 0 1 1 1 2 2 3 3 3 3
    // 错误例子：declaration中如果有color则会出现问题

    Jyo.VertexBuffer.prototype = {
        getData: Jyo.overload().
                 add("Array", function (data) {

                     // 元素所占用的字节数
                     var elementSizeInByte = 8;
                     this.getData(0, data, 0, data.length, elementSizeInByte);
                 }).
                 add("Array, Number, Number", function (data, startIndex, elementCount) {

                     // 元素所占用的字节数
                     var elementSizeInByte = 8;
                     this.getData(0, data, startIndex, elementCount, elementSizeInByte);
                 }).
                 add("Number, Array, Number, Number, Number", function (offsetInBytes, data, startIndex, elementCount, vertexStride) {
                     
                     // 元素所占用的字节数
                     var elementSizeInByte = 8;

                     if (vertexStride == 0) vertexStride = elementSizeInBytes;

                     // 将字节数转换为元素数
                     offsetInBytes /= elementSizeInByte;
                     vertexStride /= elementSizeInByte;

                     data.length = 0;
                     for (var i = offsetInBytes, n = 0; n < elementCount * vertexStride / 3 ; i += vertexStride, n++) {
                         data.push(this._arr[i], this._arr[i + 1], this._arr[i + 2]);
                     }
                 })
    };

    var vertexElementFormat = ["Single", "Vector2", "Vector3", "Vector4", "Color", "Byte4", "Short2", "Short4", "NormalizedShort2", "NormalizedShort4", "HalfVector2", "HalfVector4"];
    var vertexElementUsage = ["Position", "Color", "TextureCoordinate", "Normal", "Binormal", "Tangent", "BlendIndices", "BlendWeight", "Depth", "Fog", "PointSize", "Sample", "TessellateFactor"];

    function bindBuffer(renderer, vertexFloatData) {
        /// <summary>绑定缓冲区</summary>
        /// <param name="renderer" type="Jyo.Renderer">渲染器对象</param>
        /// <returns type="Object" />

        var ctx = renderer.context;
        var arr = new Float32Array(vertexFloatData);
        if (ctx instanceof WebGLRenderingContext) {
            var buffer = ctx.createBuffer();
            ctx.bindBuffer(ctx.ARRAY_BUFFER, buffer);
            ctx.bufferData(ctx.ARRAY_BUFFER, arr, ctx.STATIC_DRAW);
            ctx.bindBuffer(ctx.ARRAY_BUFFER, null);
            return buffer;
        }

        return arr;
    }

    Jyo.VertexBuffer.read = function (renderer, dataView, offset) {
        /// <summary>读取顶点缓冲区</summary>
        /// <param name="renderer" type="Jyo.Renderer">渲染器对象</param>
        /// <param name="dataView" type="DataView">数据视图对象</param>
        /// <param name="offset" type="Number">数据偏移量</param>

        var ctx = renderer.context;

        var vertexDeclaration = {};
        var vertexStride = dataView.getUint32(offset);
        offset += 4;
        var elementCount = dataView.getUint32(offset);
        offset += 4;
        var elements = [];
        for (var i = 0; i < elementCount; i++) {
            var dOffset = dataView.getUint32(offset);
            offset += 4;
            var elementFormat = vertexElementFormat[dataView.getUint32(offset)];
            offset += 4;
            var elementUsage = vertexElementUsage[dataView.getUint32(offset)];
            offset += 4;
            var usageIndex = dataView.getUint32(offset);
            offset += 4;

            elements[i] = {
                offset: dOffset,
                usageIndex: usageIndex,
                vertexElementFormat: elementFormat,
                vertexElementUsage: elementUsage
            };
        }
        vertexDeclaration.elements = elements;
        vertexDeclaration.vertexStride = vertexStride;

        var vertexCount = dataView.getUint32(offset);
        offset += 4;

        var vertexFloatData = function (len) {
            var list = [];
            for (var i = 0; i < len; i++) {
                list[i] = Number.getSingle(dataView.getUint32(offset));
                if (isNaN(list[i])) { list[i] = 0; }
                offset += 4;
            }
            return list;
        }(vertexCount * vertexStride / 4);

        var buffer = bindBuffer(renderer, vertexFloatData);

        var vertexBuffer = new Jyo.VertexBuffer(vertexDeclaration, vertexCount, buffer, vertexFloatData);

        return {
            offset: offset,
            data: vertexBuffer
        }
    };

})(window, document, Jyo);