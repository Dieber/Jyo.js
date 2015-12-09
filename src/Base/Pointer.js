(function (window, document, Jyo, undefined) {
    "use strict";

    Jyo.Pointer = function (renderer) {
        /// <signature>
        /// <summary>指针管理器构造函数</summary>
        /// <param name="renderer" type="Jyo.Renderer">渲染器</param>
        /// </signature>

        var p = Jyo.Pointer;

        this.list = [];

        for (var i = 0; i < Jyo.Pointer.processors.length; i++) {
            Jyo.Pointer.processors[i].call(this, renderer, this.list);
        }

        function pointerLockChange() {
            var el = renderer.container;
            if (document.mozPointerLockElement === el ||
                document.webkitPointerLockElement === el ||
                document.msPointerLockElement === el ||
                document.pointerLockElement === el) {
                renderer.container.isPointerLocked = true;
            } else {
                renderer.container.isPointerLocked = false;
            }
        }

        document.addEventListener('pointerlockchange', pointerLockChange, false);
        document.addEventListener('mspointerlockchange', pointerLockChange, false);
        document.addEventListener('mozpointerlockchange', pointerLockChange, false);
        document.addEventListener('webkitpointerlockchange', pointerLockChange, false);
    };

    Jyo.Pointer.processors = [];

    Jyo.Pointer.prototype = new Jyo.Object();

})(window, document, Jyo);