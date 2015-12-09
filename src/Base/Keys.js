(function (window, document, Jyo, undefined) {
    "use strict";

    Jyo.Keys = function () {
        /// <signature>
        /// <summary>按键管理器构造函数</summary>
        /// </signature>

        var k = Jyo.Keys;

        this.list = [];

        for (var i = 0; i < Jyo.Keys.processors.length; i++) {
            Jyo.Keys.processors[i].call(this, this.list);
        }
    };

    Jyo.Keys.processors = [];

    // 按键索引表
    var keys = {
        None: 0,
        Back: 8,
        Tab: 9,
        Enter: 13,
        Pause: 19,
        Capslock: 20,
        Kana: 21,
        Kanji: 25,
        Escape: 27,
        Imeconvert: 28,
        Imenoconvert: 29,
        Space: 32,
        Pageup: 33,
        Pagedown: 34,
        End: 35,
        Home: 36,
        Left: 37,
        Up: 38,
        Right: 39,
        Down: 40,
        Select: 41,
        Print: 42,
        Execute: 43,
        Printscreen: 44,
        Insert: 45,
        Del: 46,
        Help: 47,
        D0: 48,
        D1: 49,
        D2: 50,
        D3: 51,
        D4: 52,
        D5: 53,
        D6: 54,
        D7: 55,
        D8: 56,
        D9: 57,
        A: 65,
        B: 66,
        C: 67,
        D: 68,
        E: 69,
        F: 70,
        G: 71,
        H: 72,
        I: 73,
        J: 74,
        K: 75,
        L: 76,
        M: 77,
        N: 78,
        O: 79,
        P: 80,
        Q: 81,
        R: 82,
        S: 83,
        T: 84,
        U: 85,
        V: 86,
        W: 87,
        X: 88,
        Y: 89,
        Z: 90,
        Leftwindows: 91,
        Rightwindows: 92,
        Apps: 93,
        Sleep: 95,
        Numpad0: 96,
        Numpad1: 97,
        Numpad2: 98,
        Numpad3: 99,
        Numpad4: 100,
        Numpad5: 101,
        Numpad6: 102,
        Numpad7: 103,
        Numpad8: 104,
        Numpad9: 105,
        Multiply: 106,
        Add: 107,
        Separator: 108,
        Subtract: 109,
        Decimal: 110,
        Divide: 111,
        F1: 112,
        F2: 113,
        F3: 114,
        F4: 115,
        F5: 116,
        F6: 117,
        F7: 118,
        F8: 119,
        F9: 120,
        F10: 121,
        F11: 122,
        F12: 123,
        F13: 124,
        F14: 125,
        F15: 126,
        F16: 127,
        F17: 128,
        F18: 129,
        F19: 130,
        F20: 131,
        F21: 132,
        F22: 133,
        F23: 134,
        F24: 135,
        Numlock: 144,
        Scroll: 145,
        Leftshift: 160,
        Rightshift: 161,
        Leftcontrol: 162,
        Rightcontrol: 163,
        Leftalt: 164,
        Rightalt: 165,
        Browserback: 166,
        Browserforward: 167,
        Browserrefresh: 168,
        Browserstop: 169,
        Browsersearch: 170,
        Browserfavorites: 171,
        Browserhome: 172,
        Volumemute: 173,
        Volumedown: 174,
        Volumeup: 175,
        Medianexttrack: 176,
        Mediaprevioustrack: 177,
        Mediastop: 178,
        Mediaplaypause: 179,
        Launchmail: 180,
        Selectmedia: 181,
        Launchapplication1: 182,
        Launchapplication2: 183,
        Oemsemicolon: 186,
        Oemplus: 187,
        Oemcomma: 188,
        Oemminus: 189,
        Oemperiod: 190,
        Oemquestion: 191,
        Oemtilde: 192,
        Chatpadgreen: 202,
        Chatpadorange: 203,
        Oemopenbrackets: 219,
        Oempipe: 220,
        Oemclosebrackets: 221,
        Oemquotes: 222,
        Oem8: 223,
        Oembackslash: 226,
        Processkey: 229,
        Oemcopy: 242,
        Oemauto: 243,
        Oemenlw: 244,
        Attn: 246,
        Crsel: 247,
        Exsel: 248,
        Eraseeof: 249,
        Play: 250,
        Zoom: 251,
        Pa1: 253,
        Oemclear: 254
    };

    for (var i in keys) {
        Object.defineProperty(Jyo.Keys, i, {
            get: function () { return keys[i]; }
        });
    }

    Jyo.Keys.prototype = new Jyo.Object({
        isKeyDown: function (keyCode) {
            /// <summary>是否按下了某个键</summary>
            /// <param name="keyCode" type="Number">按键码</param>
            /// <returns type="Boolean" />

            for (var i in keys) {
                if (keys.isPrototypeOf(i) || !keys.hasOwnProperty(i) || keys[i] != keyCode) continue;
                return true;
            }
            return false;
        }
    });

})(window, document, Jyo);