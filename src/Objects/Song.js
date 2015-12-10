(function (window, document, Jyo, undefined) {
    "use strict";

    Jyo.Song = function () {
        /// <summary>音乐对象</summary>
        /// <field name="isLoaded" type="Boolean">是否加载完毕</field>
        /// <field name="duration" type="Number">音乐时长</field>
        /// <field name="playCound" type="Number">播放次数</field>
        /// <field name="id" type="Number">随机ID</field>
        /// <field name="isLoop" type="Boolean">是否循环</field>

        this.isLoaded = false;
        this.duration = Infinity;
        this.playCound = 0;
        this.id = +new Date();
        this.isLoop = false;
    };

    Jyo.Song.prototype = new Jyo.Object();

    Jyo.Object.call(Jyo.Song, {
        fromUri: function (uri) {
            /// <summary>从虚拟根路径读取资源</summary>
            /// <param name="uri" type="String">虚拟根路径</param>

            var song = new Jyo.Song();
            var a = song._audio = new Audio(uri);

            a.addEventListener("loadedmetadata", function canplayFun() {
                song.duration = this.duration;
                song.isLoaded = true;
                song.fireEvent("load");
                a.removeEventListener("loadedmetadata", canplayFun, false);
            }, false);

            a.addEventListener("error", function () {
                song.fireEvent("error");
            }, false);

            a.addEventListener("play", function () {
                song.playCound++;
                song.fireEvent("play");
            }, false);

            a.addEventListener("ended", function () {
                this.pause();
                this.currentTime = 0;
                song.fireEvent("ended");
            }, false);

            a.load();

            return song;
        }
    });

})(window, document, Jyo);