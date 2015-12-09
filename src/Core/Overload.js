(function (window, document, Jyo, undefiend) {
    "use strict";

    var any = "[object Unkonw]";

    function getType(str) {
        /// <summary>根据字符串获取Js可用于判断的类型</summary>
        /// <param name="str" type="String"></param>
        /// <returns type="any" />

        if (!str || !str.toString().trim()) return undefiend;
        str = str.toString().trim();

        switch (str) {
            case "Number":
            case "String":
            case "Boolean":
            case "Function":
            case "Object":
                return str.toLowerCase();
            case "Null":
                return Object;
            case "undefiend":
                throw new Error("Invalid type");
            case "any":
                return any;
                //case "Object":
                //case "Function":
            default:
                return eval(str);
        }

    }

    function processParams(s) {
        /// <summary>处理参数</summary>

        var pList = null;
        if (s) {
            pList = s.split(",");
            for (var i = pList.length; i--;) {
                pList[i] = getType(pList[i]);
            }
        }
        return pList;
    }

    Jyo.overload = function () {
        /// <summary>创建重载对象</summary>
        /// <returns type="Function" />

        var _paramList = [],
            _functionList = [];

        var overloadFunction = function () {
            /// <summary>调用重载函数</summary>

            var len = _paramList.length,
                pList = null;

            if (!len) throw new Error("Function not implemented");

            while (len--) {
                pList = _paramList[len];
                if (pList !== null && !(pList instanceof Array)) {
                    pList = _paramList[len] = processParams(pList);
                }

                if (!arguments.length && !pList) return _functionList[len].apply(this, arguments);
                else if (arguments.length && !pList || arguments.length != pList.length) continue;

                for (var i = 0; i < arguments.length; i++) {
                    var isOK = typeof pList[i] === "string";
                    if (!isOK) isOK = !(arguments[i] instanceof pList[i]);

                    if (pList[i] !== any && typeof arguments[i] !== pList[i] && isOK) break;

                    if (i === arguments.length - 1) return _functionList[len].apply(this, arguments);
                }
            }
            throw new Error("Invalid parameter");
        };

        overloadFunction.add = function (str, fun) {
            /// <summary>添加重载函数</summary>
            /// <param name="str" type="String">参数列表字符串</param>
            /// <param name="fun" type="Function">重载调用的函数</param>
            /// <returns type="OverloadFunction" />

            _paramList.push(str);
            _functionList.push(fun);

            return overloadFunction;
        };

        return overloadFunction;
    };

})(window, document, Jyo);