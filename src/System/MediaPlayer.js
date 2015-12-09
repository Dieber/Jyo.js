(function (window, document, Jyo, undefined) {
    "use strict";

    // 媒体状态
    Jyo.MediaStatus = {
        // 已暂停
        paused: 0x01,
        // 播放中
        playing: 0x02,
        // 已停止
        stopped: 0x04
    };

    var usingSong = null,
        isMuted = false,
        volume = 100;

    Jyo.MediaPlayer = new Jyo.Object({
        state: Jyo.MediaStatus.stopped,
        play: Jyo.overload().
              add("Jyo.Song", function (song) {
                  /// <summary>播放背景音乐</summary>
                  /// <param name="song" type="Jyo.Song">音乐对象</param>

                  if (usingSong && song.id != usingSong.id) {
                      usingSong._events = [];
                      Jyo.MediaPlayer.stop();
                  }

                  if (!song.isLoaded) {
                      if (song.readyPlay) return;
                      song.readyPlay = true;
                      song.addEventListener("load", function loadFun() {
                          Jyo.MediaPlayer.play(song);
                          song.removeEventListener("load", loadFun, false);
                      }, false);
                      return;
                  }

                  usingSong = song;

                  usingSong._audio.muted = isMuted;

                  usingSong._audio.volume = volume / 100;

                  song.addEventListener("ended", function () {
                      if (song.isLoop) {
                          song._audio.currentTime = 0;
                          song._audio.load();
                          song._audio.play();
                      } else {
                          Jyo.MediaPlayer.state = Jyo.MediaStatus.stopped;
                          this.fireEvent("mediaStateChanged");
                      }
                  });

                  song._audio.play();
                  Jyo.MediaPlayer.state = Jyo.MediaStatus.playing;
                  this.fireEvent("mediaStateChanged");
              }),
        pause: function () {
            /// <summary>暂停背景音乐</summary>

            if (!usingSong) return;
            usingSong._audio.pause();
            Jyo.MediaPlayer.state = Jyo.MediaStatus.paused;
            this.fireEvent("mediaStateChanged");
        },
        resume: function () {
            /// <summary>继续播放</summary>

            if (!usingSong) return;
            usingSong._audio.play();
            Jyo.MediaPlayer.state = Jyo.MediaStatus.playing;
            this.fireEvent("mediaStateChanged");
        },
        stop: function () {
            /// <summary>停止播放</summary>

            if (!usingSong) return;
            usingSong._audio.pause();
            usingSong._audio.currentTime = 0;
            Jyo.MediaPlayer.state = Jyo.MediaStatus.stopped;
            this.fireEvent("mediaStateChanged");
        }
    });

    Object.defineProperty(Jyo.MediaPlayer, "isMuted", {
        get: function () {
            return isMuted;
        },
        set: function (value) {
            isMuted = value;
            if (!usingSong) return;
            usingSong._audio.muted = value;
        }
    });

    Object.defineProperty(Jyo.MediaPlayer, "volume", {
        get: function () {
            return volume;
        },
        set: function (value) {
            volume = value;
            if (!usingSong) return;
            usingSong._audio.volume = value / 100;
        }
    });

    Object.defineProperty(Jyo.MediaPlayer, "playPosition", {
        get: function () {
            if (!usingSong) return 0;
            else return usingSong._audio.currentTime;
        },
        set: function (value) {
            if (!usingSong) return;
            else usingSong._audio.currentTime = value;
        }
    });

})(window, document, Jyo);