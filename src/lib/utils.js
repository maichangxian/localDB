// Generated by CoffeeScript 1.7.1
define(function(require, exports, module) {
  'use strict';
  var ObjectID, Utils, eq, toString, _isType;
  ObjectID = require('lib/bson');
  Utils = {};
  toString = Object.prototype.toString;

  /*
   *  isEqual function is implemented by underscore and I just rewrite in my project.
   *  https://github.com/jashkenas/underscore/blob/master/underscore.js
   */
  eq = function(a, b, aStack, bStack) {
    var aCtor, areArrays, bCtor, className, key, keys, length, result, size;
    if (a === b) {
      return a !== 0 || 1 / a === 1 / b;
    }
    if (a === null && b === void 0) {
      return false;
    }
    if (a === void 0 && b === null) {
      return false;
    }
    className = toString.call(a);
    if (className !== toString.call(b)) {
      return false;
    }
    switch (className) {
      case '[object RegExp]':
        return '' + a === '' + b;
      case '[object String]':
        return '' + a === '' + b;
      case '[object Number]':
        if (+a !== +a) {
          return +b !== +b;
        }
        if (+a === 0) {
          return 1 / +a === 1 / b;
        } else {
          return +a === +b;
        }
      case '[object Date]':
        return +a === +b;
      case '[object Boolean]':
        return +a === +b;
    }
    areArrays = className === '[object Array]';
    if (!areArrays) {
      if (typeof a !== 'object' || typeof b !== 'object') {
        return false;
      }
      aCtor = a.constructor;
      bCtor = b.constructor;
      if ((aCtor !== bCtor) && !(Utils.isFunction(aCtor) && aCtor instanceof aCtor && Utils.isFunction(bCtor) && bCtor instanceof bCtor) && ('constructor' in a && 'constructor' in b)) {
        return false;
      }
    }
    length = aStack.length;
    while (length--) {
      if (aStack[length] === a) {
        return bStack[length] === b;
      }
    }
    aStack.push(a);
    bStack.push(b);
    if (areArrays) {
      size = a.length;
      result = size === b.length;
      if (result) {
        while (size--) {
          if (!(result = eq(a[size], b[size], aStack, bStack))) {
            break;
          }
        }
      }
    } else {
      keys = Utils.keys(a);
      size = keys.length;
      result = Utils.keys(b).length === size;
      if (result) {
        while (size--) {
          key = keys[size];
          if (!(result = Utils.has(b, key) && eq(a[key], b[key], aStack, bStack))) {
            break;
          }
        }
      }
    }
    aStack.pop();
    bStack.pop();
    return result;
  };
  _isType = function(type) {
    return function(obj) {
      return toString.call(obj).toLowerCase() === ("[object " + type + "]").toLowerCase();
    };
  };
  Utils.isType = function(ele, type) {
    return _isType(type)(ele);
  };
  Utils.isObject = _isType("object");
  Utils.isString = _isType("string");
  Utils.isNumber = _isType("number");
  Utils.isArray = _isType("array");
  Utils.isFunction = _isType("function");
  Utils.isRegex = _isType("regexp");
  Utils.keys = function(obj) {
    if (!Utils.isObject(obj)) {
      return [];
    }
    if (Object.keys) {
      return Object.keys(obj);
    }
  };
  Utils.has = function(obj, key) {
    return obj !== null && obj !== void 0 && Object.prototype.hasOwnProperty.call(obj, key);
  };
  Utils.isEqual = function(a, b) {
    return eq(a, b, [], []);
  };
  Utils.createObjectId = function() {
    return (new ObjectID()).inspect();
  };
  Utils.stringify = function(arr) {
    if ((arr == null) || !Utils.isArray(arr)) {
      return "[]";
    }
    return JSON.stringify(arr, function(key, value) {
      if (Utils.isRegex(value) || Utils.isFunction(value)) {
        return value.toString();
      }
      return value;
    });
  };
  Utils.parse = function(str) {
    if ((str == null) || !Utils.isString(str)) {
      return [];
    }
    return JSON.parse(str, function(key, value) {
      var v;
      try {
        v = eval(value);
      } catch (_error) {}
      if ((v != null) && Utils.isRegex(v)) {
        return v;
      }
      try {
        v = eval("(" + value + ")");
      } catch (_error) {}
      if ((v != null) && Utils.isFunction(v)) {
        return v;
      }
      return value;
    });
  };
  Utils.parseParas = function(paras) {
    var callback, options;
    options = {};
    callback = null;
    if (paras.length === 1) {
      if (Utils.isObject(paras[0])) {
        options = paras[0];
      } else if (Utils.isFunction(paras[0])) {
        callback = paras[0];
      }
    } else if (paras.length === 2) {
      if (Utils.isObject(paras[0])) {
        options = paras[0];
      }
      if (Utils.isFunction(paras[1])) {
        callback = paras[1];
      }
    }
    return [options, callback];
  };
  Utils.getTimestamp = function(objectId) {
    return (new ObjectID(objectId)).getTimestamp();
  };
  Utils.getTime = function(objectId) {
    return (new ObjectID(objectId)).getTime();
  };
  return module.exports = Utils;
});