(function (window, document, Jyo, undefined) {
    "use strict";

    Jyo.IndexBuffer = function (indexCount, buffer, indexElementSize) {
        /// <summary>索引缓冲区</summary>
        /// <param name="indexCount" type="Number">索引数量</param>
        /// <param name="buffer" type="ArrayBuffer">缓冲区数组</param>
        /// <param name="indexElementSize" type="Number">索引元素大小</param>

        /// <field name="bufferUsage" type="String">缓冲区用处</field>
        /// <field name="indexCount" type="Number">索引数量</field>
        /// <field name="indexElementSize" type="Number">索引元素数量</field>
        /// <field name="buffer" type="WebGLBuffer">GL缓冲区对象</field>

        this.bufferUsage = "None";
        this.indexCount = indexCount;
        this.indexElementSize = indexElementSize;
        this.buffer = buffer;
    };

    function bindBuffer(renderer, indexData, is16Bit) {
        /// <summary>绑定缓冲区</summary>
        /// <param name="renderer" type="Jyo.Renderer">渲染器对象</param>
        /// <returns type="Object" />

        var ctx = renderer.context;
        var arr = new (is16Bit ? Int16Array : Int32Array)(indexData);
        if (ctx instanceof WebGLRenderingContext || ctx instanceof WebGL2RenderingContext) {
            var buffer = ctx.createBuffer();
            ctx.bindBuffer(ctx.ELEMENT_ARRAY_BUFFER, buffer);
            ctx.bufferData(ctx.ELEMENT_ARRAY_BUFFER, arr, ctx.STATIC_DRAW);
            ctx.bindBuffer(ctx.ELEMENT_ARRAY_BUFFER, null);
            return buffer;
        }

        return arr;
    }

    Jyo.IndexBuffer.read = function (renderer, dataView, offset) {
        /// <summary>读取索引缓冲</summary>
        /// <param name="renderer" type="Jyo.Renderer">渲染器对象</param>
        /// <param name="dataView" type="DataView">数据视图对象</param>
        /// <param name="offset" type="Number">数据偏移量</param>

        var is16Bit = !!dataView.getUint8(offset++);
        var dataSize = dataView.getUint32(offset);
        offset += 4;
        var count = dataSize / (is16Bit ? 2 : 4);

        var indexData = [];

        for (var i = 0; i < count; i++) {
            if (is16Bit) {

                var x = dataView.getUint8(offset);
                offset++;
                var y = dataView.getUint8(offset);
                offset++;

                indexData[i] = x | y << 8;
            } else {

                var a = dataView.getUint8(offset);
                offset++;
                var b = dataView.getUint8(offset);
                offset++;
                var c = dataView.getUint8(offset);
                offset++;
                var d = dataView.getUint8(offset);
                offset++;

                indexData[i] = a | b << 8 | c << 16 | d << 24;
            }
        }

        var buffer = bindBuffer(renderer, indexData, is16Bit);

        var indexBuffer = new Jyo.IndexBuffer(count, buffer, is16Bit ? "SixteenBits" : "ThirtyTwoBits");
        return {
            offset: offset,
            data: indexBuffer
        }
    };

})(window, document, Jyo);