(function (window, document, Jyo, undefined) {
    "use strict";

    // 颜色格式
    var surfaceFormats = [
        "Color",
        "Bgr565",
        "Bgra5551",
        "Bgra4444",
        "Dxt1",
        "Dxt3",
        "Dxt5",
        "NormalizedByte2",
        "NormalizedByte4",
        "Rgba1010102",
        "Rg32",
        "Rgba64",
        "Alpha8",
        "Single",
        "Vector2",
        "Vector4",
        "HalfSingle",
        "HalfVector2",
        "HalfVector4",
        "HdrBlendable"
    ];

    Jyo.ContentManager.Texture2DContentReader = {
        // 是否自定义
        isCustom: false,
        // 程序集
        assemblies: "Microsoft.Xna.Framework.Content.Texture2DReader",
        read: function (content, xnb, dataView, offset, renderer, callback) {
            /// <summary>读取Texture2D文件</summary>
            /// <param name="content" type="Jyo.ContentManager">资源管理器</param>
            /// <param name="xnb" type="Object">已有Xnb数据结构</param>
            /// <param name="dataView" type="DataView">数据视图</param>
            /// <param name="offset" type="Number">数据偏移量</param>
            /// <param name="renderer" type="Jyo.Renderer">要绑定的渲染器对象</param>
            /// <param name="callback" type="Function">回调函数</param>

            if (xnb.compressionMode == 0) offset += 5;

            // 表面类型
            var surfaceFormat = surfaceFormats[dataView.getUint32(offset)];

            // 图像宽度
            var width = dataView.getUint32(offset + 4);

            // 图像高度
            var height = dataView.getUint32(offset + 8);

            // Mip数量
            var mipCount = dataView.getUint32(offset + 12);

            // 数据大小
            var dataSize = dataView.getUint32(offset + 16);

            // 还原图像数据
            var canvas = document.createElement("canvas");

            canvas.width = width;
            canvas.height = height;
            var ctx = canvas.getContext("2d");
            ctx.msImageSmoothingEnabled = false;
            ctx.imageSmoothingEnabled = false;
            var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            var pixs = imageData.data;
            for (var i = 0; i < dataSize; i++) {
                pixs[i] = dataView.getUint8(offset + 20 + i);
            }

            ctx.putImageData(imageData, 0, 0);

            xnb.map = map;

            canvas.toBlob(function (blob) {
                // 数据内容对象
                xnb.type = "image",
                xnb.surfaceFormat = surfaceFormat,
                xnb.width = width,
                xnb.height = height,
                xnb.mipCount = mipCount,
                xnb.dataSize = dataSize;
                xnb.object = canvas;

                callback && callback(xnb);
            });
        }
    };

    function map(tu, tv) {
        /// <summary>返回对应UV产生的纹理坐标的像素颜色</summary>
        /// <param name="tu" type="Number">材质水平方向U</param>
        /// <param name="tv" type="Number">材质垂直方向V</param>
        /// </returns type="Jyo.Color" />

        // 如有必要使用%操作符进行运算
        var u = Math.floor(Math.abs((tu * xnb.width) % xnb.width));
        var v = Math.floor(Math.abs((tv * xnb.height) % xnb.height));
        var pos = (u + v * xnb.width) * 4;

        var r = imageData.data[pos];
        var g = imageData.data[pos + 1];
        var b = imageData.data[pos + 2];
        var a = imageData.data[pos + 3];

        return new Jyo.Color(r, g, b, a / 255);
    }

})(window, document, Jyo);