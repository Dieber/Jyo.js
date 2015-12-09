(function (window, document, Jyo, undefined) {
    "use strict";

    Jyo.IndexBuffer = function (indexCount, buffer, indexElementSize) {
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
        if (ctx instanceof WebGLRenderingContext) {
            var buffer = ctx.createBuffer();
            ctx.bindBuffer(ctx.ELEMENT_ARRAY_BUFFER, buffer);
            ctx.bufferData(ctx.ELEMENT_ARRAY_BUFFER, arr, ctx.STATIC_DRAW);
            ctx.bindBuffer(ctx.ELEMENT_ARRAY_BUFFER, null);
            return buffer;
        }

        return arr;
    }

    Jyo.IndexBuffer.read = function (renderer, dataView, offset) {
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