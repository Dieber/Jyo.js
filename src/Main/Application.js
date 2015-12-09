(function (window, document, Jyo, undefined) {
    "use strict";

    var isEnable = false,
        isPause = false,
        isAutoPause = false,
        isWaiting = false,
        pauseTime = 0;

    Jyo.Application = function () {
        /// <summary>应用程序</summary>
        /// <field name="fps" type="Number">每秒帧数</field>
        /// <field name="isFixedTimeStep" type="Boolean">是否使用固定时间步长</field>
        /// <field name="targetElapsedTime" type="Number">当isFixedTimeStep为true时Update调用间的目标时间</field>

        var _this = this;
        Object.defineProperty(this, "isEnable", {
            get: function () { return isEnable; },
            set: function (value) {
                if (!!value == isEnable) return;
                if (isEnable = !!value) {
                    _this.run();
                } else {
                    _this.exit();
                }
                isEnable = value;
            }
        });

        Object.defineProperty(this, "isPause", {
            get: function () { return isPause; },
            set: function (value) {
                if (!isEnable) return;
                if (!!value == isPause) return;
                if (isPause = !!value) {
                    _this.pause();
                } else {
                    _this.run();
                }
                isPause = value;
            }
        });

        // 当前状态
        this._currentStatus = null;

        // 每秒帧数
        this.fps = 0;

        // 统计帧数
        this._fpsNum = 0;

        // 上一个Fps统计时间点
        this._previousFrameTimeStamp = 0;

        // 最后一个更新绘制时间点
        this._lastTime = 0;

        // 是否使用固定时间步长
        this.isFixedTimeStep = false;

        // 当isFixedTimeStep为true时Update调用间的目标时间
        this.targetElapsedTime = 30;

        // 游戏主计时器
        this._mainTimer = null;

        // 调用update的计时器
        this._updateTimer = null;

        this.addEventListener("ready", function () {
            isWaiting = false;
            _this._currentStatus && _this._currentStatus.fireEvent("ready");
        });

        this.addEventListener("wait", function () {
            isWaiting = true;
        });
    };

    function fpsStatistics(currentTime) {
        /// <summary>FPS统计</summary>
        /// <param name="currentTime" type="Number">游戏当前时间</param>

        if (currentTime === undefined) currentTime = Date.now();
        this._lastTime = currentTime = currentTime | 0;

        if (this._previousFrameTimeStamp > currentTime) this._previousFrameTimeStamp = 0;

        if (currentTime - this._previousFrameTimeStamp >= 1000) {
            this._previousFrameTimeStamp = currentTime;

            // 更新Fps
            this.fps = this._fpsNum;
            this._fpsNum = 0;
        }

        this._fpsNum++;
    }

    Jyo.Application.prototype = new Jyo.Object({
        run: function () {
            /// <summary>启动应用程序</summary>

            var _this = this;

            if (isPause) {
                isAutoPause = false;
                isPause = false;
                if (_this._currentStatus) {
                    _this._currentStatus.fireEvent("continue", { pauseTime: Date.now() - pauseTime });
                }
            }

            isEnable = true;

            if (this.isFixedTimeStep && status.update) {
                this._updateTimer = setInterval(function () {
                    var status = _this._currentStatus;
                    !isPause && status.fireEvent("update", Date.now());
                }, this.targetElapsedTime);
            }

            function renderLoop(currentTime) {
                currentTime = (currentTime || Date.now()) | 0;
                var status = _this._currentStatus;
                if (status && !isPause) {
                    if (isWaiting) {
                        status.fireEvent("waiting", currentTime);
                    } else {
                        !_this.isFixedTimeStep && status.fireEvent("update", currentTime);
                        status.fireEvent("draw", currentTime);
                    }
                }
                fpsStatistics.call(_this, currentTime);
                _this._mainTimer = window.requestAnimationFrame(renderLoop);
            };

            renderLoop();
        },
        pause: function () {
            /// <summary>暂停应用程序</summary>

            isPause = true;

            cancelAnimationFrame(this._mainTimer)
            this._mainTimer = null;
            clearInterval(this._updateTimer);
            this._updateTimer = null;

            if (this._currentStatus) {
                pauseTime = Date.now();
                this._currentStatus.fireEvent("pause");
            }
        },
        exit: function () {
            /// <summary>退出应用程序</summary>

            cancelAnimationFrame(this._mainTimer)
            this._mainTimer = null;
            clearInterval(this._updateTimer);
            this._updateTimer = null;
            isEnable = false;
        },
        changeStatus: function (status) {
            /// <summary>更改状态</summary>
            /// <param name="status" type="Jyo.Status">要更改的状态</param>

            if (this._currentStatus) {
                this._currentStatus.fireEvent("unload");
                this._currentStatus.isEnable = false;
            }
            if (!status) return;
            this._currentStatus = status;
            this._currentStatus.isEnable = true;
            this._currentStatus.fireEvent("load");
        }
    });

    Jyo.Application = new Jyo.Application();

    function onVisibilityChanged() {
        if (document.hidden || document.mozHidden || document.webkitHidden || document.msHidden) {
            Jyo.Application.fireEvent("activated");
            if (isPause) return;
            isAutoPause = true;
            isEnable && !isPause && Jyo.Application.pause();
        }
        else {
            Jyo.Application.fireEvent("deactivated");
            isEnable && isPause && isAutoPause && Jyo.Application.run();
        }
    };
    document.addEventListener("visibilitychange", onVisibilityChanged, false);
    document.addEventListener("mozvisibilitychange", onVisibilityChanged, false);
    document.addEventListener("webkitvisibilitychange", onVisibilityChanged, false);
    document.addEventListener("msvisibilitychange", onVisibilityChanged, false);

})(window, document, Jyo);