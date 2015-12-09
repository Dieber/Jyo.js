(function (window, document, Jyo, undefined) {
    "use strict";

    Jyo.ContentManager.SoundEffectContentReader = {
        // 是否自定义
        isCustom: true,
        // 程序集
        assemblies: "SoundEffect",
        read: function (content, xnb, dataView, offset, renderer, callback) {
            /// <summary>读取声音文件</summary>
            /// <param name="content" type="Jyo.ContentManager">资源管理器</param>
            /// <param name="xnb" type="Object">已有Xnb数据结构</param>
            /// <param name="dataView" type="DataView">数据视图</param>
            /// <param name="offset" type="Number">数据偏移量</param>
            /// <param name="renderer" type="Jyo.Renderer">要绑定的渲染器对象</param>
            /// <param name="callback" type="Function">回调函数</param>

            var dataSize = dataView.getUint32(offset),
                audio = { _canPlay: false },
                buffer = new Uint8Array(dataView.buffer, offset + 4, dataSize);

            if (false && AudioContext !== undefined) {
                var context = new AudioContext(),
                    source = null,
                    audioBuffer = null;

                audio.stop = function () {
                    /// <summary>停止播放</summary>

                    if (source) {
                        if (typeof source.noteOff == "function") source.noteOff(0);
                        else source.stop();
                        source = null;
                    }
                };

                audio.play = function () {
                    /// <summary>开始播放</summary>

                    if (!this._canPlay) return;
                    source = context.createBufferSource();
                    source.buffer = audioBuffer;
                    source.loop = false;
                    source.connect(context.destination);
                    if (typeof source.noteOn == "function") source.noteOn(0);
                    else source.start();
                };

                context.decodeAudioData(buffer.buffer, function (buffer) { //解码成功时的回调函数
                    audio._canPlay = true;
                    audioBuffer = buffer;
                    callback && callback(xnb);
                }, function (e) { //解码出错时的回调函数
                    console.warn('Error decoding file', e);
                    callback && callback(xnb);
                });
            } else {
                audio = new Audio(URL.createObjectURL(new Blob([buffer], { type: "audio/mp3" })));
                audio.stop = function () {
                    audio.pause();
                    audio.currentTime = 0;
                };
            }

            xnb.type = "soundEffect",
            xnb.dataSize = dataSize,
            xnb.object = audio;

            if (audio._canPlay === undefined) {
                callback && callback(xnb);
            }
        }
    };

})(window, document, Jyo);