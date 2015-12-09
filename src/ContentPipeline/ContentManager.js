(function (window, document, Jyo, undefined) {
    "use strict";

    var contentManager = null;

    Jyo.ContentManager = function (rootDirectory, renderer) {
        /// <summary>内容管理器</summary>
        /// <param name="rootDirectory" type="String">资源根目录</param>
        /// <param name="renderer" type="Jyo.Renderer">资源绑定到的渲染器对象</param>

        /// <field name="rootDirectory" type="String">资源根目录</field>
        /// <field name="renderer" type="Jyo.Renderer">资源绑定到的渲染器对象</field>
        /// <field name="isLoadDone" type="Boolean">指示资源是否加载完成</field>
        /// <field name="percent" type="Number">加载完成的百分比</field>
        /// <field name="loadNum" type="Number">总共要加载的文件数量</field>
        /// <field name="loadDoneNum" type="Number">加载完成的文件数量</field>

        if (contentManager) return contentManager;
        contentManager = this;

        this.rootDirectory = rootDirectory;
        this.renderer = renderer;
        this.isLoadDone = false;
        this.percent = 100;
        this.loadNum = 0;
        this.loadDoneNum = 0;

        Jyo.Object.call(this);
    };

    Jyo.ContentManager.prototype = new Jyo.Object({
        load: function (filename) {
            /// <summary>加载资源</summary>
            /// <param name="filename" type="String">文件名</param>
            /// <return type="Object" />

            this.loadNum++;
            this.isLoadDone = false;
            Jyo.Application.fireEvent("wait");
            var _this = this;
            var url = (filename.indexOf("http") == 0 ? filename + ".xnb" : (this.rootDirectory + "/" + filename + ".xnb"));
            return Jyo.ContentManager.ContentReader(this, url, this.renderer, function (obj) {
                obj.fireEvent("load");
                _this.loadDoneNum++;
                _this.checkLoadStatus.call(_this);
            });
        },
        checkLoadStatus: function () {
            /// <summary>检查加载状态</summary>

            if (this.loadDoneNum == this.loadNum) {
                this.isLoadDone = true;
                Jyo.Application.fireEvent("ready");
                this.fireEvent("load");
            }
            this.percent = ((this.loadDoneNum / this.loadNum) | 0) * 100;
        }
    });


})(window, document, Jyo);