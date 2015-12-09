(function (window, document, Jyo, undefined) {
    "use strict";

    Jyo.Xnb = function () {
        /// <summary>Xnb数据对象</summary>
        /// <field name="filename" type="String">文件名称</field>
        /// <field name="type" type="String">文件类型</field>
        /// <field name="targetPlatform" type="String">目标平台</field>
        /// <field name="xnaVersion" type="String">对应的Xna版本</field>
        /// <field name="compressionMode" type="Number">压缩模式</field>
        /// <field name="sourceFileSize" type="Number">压缩后的文件大小</field>
        /// <field name="typeReaderCount" type="Number">类型读取器数量</field>
        /// <field name="typeReaders" type="Array">类型读取器列表</field>
        /// <field name="contentCount" type="Number">内容数量</field>
        /// <field name="uncompressedFileSize" type="Number">未压缩的文件大小</field>
        /// <field name="content" type="Object">文件内容对象</field>

        this.filename = "";
        this.type = "unknow";
        this.targetPlatform = "Windows";
        this.xnaVersion = "Xna4.0";
        this.compressionMode = 0x00;
        this.sourceFileSize = 0;
        this.typeReaderCount = 1;
        this.typeReaders = [];
        this.contentCount = 1;
        this.uncompressedFileSize = 0;

        Jyo.Object.call(this);
    };

    Jyo.Xnb.prototype = new Jyo.Object({
        destroy: function () {
            for (var i in this) delete this[i];
        }
    });

})(window, document, Jyo);