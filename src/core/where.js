// Generated by CoffeeScript 1.8.0
var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

define(function(require, exports, module) {
  "use strict";
  var Utils, Where, arrayCheck, dotCheck, isKeyReserved, keywordCheck, numberCheck, objectCheck, regexCheck, reservedKeys, stringCheck, valueCheck;
  Utils = require("lib/utils");
  reservedKeys = ["$gt", "$gte", "$lt", "$lte", "$ne", "$in", "$nin", "$and", "$nor", "$or", "$not", "$exists", "$type", "$mod", "$regex", "$all", "$elemMatch", "$size"];
  isKeyReserved = function(key) {
    return __indexOf.call(reservedKeys, key) >= 0;
  };
  Where = function(data, conditions) {

    /*
     *  如果key中包含dot的话，则执行dotCheck
     *  执行valueCheck
     *  如果返回值为true的话，执行keywordCheck
     */
    var condition, key;
    for (key in conditions) {
      condition = conditions[key];
      if (data == null) {
        if (key === "$exists" && condition === false) {
          continue;
        }
        return false;
      }
      if (key.indexOf(".") !== -1) {
        if (dotCheck(data, key, condition)) {
          continue;
        } else {
          return false;
        }
      }
      if (!valueCheck(data, key, condition)) {
        return false;
      }
      if (!keywordCheck(data, key, condition)) {
        return false;
      }
    }
    return true;
  };
  dotCheck = function(data, key, condition) {
    var firstKey;
    firstKey = key.split(".")[0];
    return Where(data[/\d/.test(firstKey) ? Number(firstKey) : firstKey], new function() {
      this[key.substr(key.indexOf(".") + 1)] = condition;
    });
  };
  valueCheck = function(data, key, condition) {

    /*
     *  如果key是关键字，则返回true
     *  如果condition是数字，则执行numberCheck
     *  如果condition是字符串，则执行stringCheck
     *  如果condition是正则表达式，则执行regexCheck
     *  如果condition是数组，则执行arrayCheck
     *  如果condition是对象，则执行objectCheck
     */
    var d;
    if (isKeyReserved(key)) {
      return true;
    }
    d = data[key];
    if (Utils.isNumber(condition) && !numberCheck(d, condition)) {
      return false;
    }
    if (Utils.isString(condition) && !stringCheck(d, condition)) {
      return false;
    }
    if (Utils.isRegex(condition) && !regexCheck(d, condition)) {
      return false;
    }
    if (Utils.isArray(condition) && !arrayCheck(d, condition)) {
      return false;
    }
    if (Utils.isObject(condition) && !objectCheck(d, condition)) {
      return false;
    }
    return true;
  };
  keywordCheck = function(data, key, condition) {
    var c, d, flag, _i, _j, _k, _l, _len, _len1, _len2, _len3;
    switch (key) {
      case "$gt":
        if (data <= condition) {
          return false;
        }
        break;
      case "$gte":
        if (data < condition) {
          return false;
        }
        break;
      case "$lt":
        if (data >= condition) {
          return false;
        }
        break;
      case "$lte":
        if (data > condition) {
          return false;
        }
        break;
      case "$ne":
        if (data === condition) {
          return false;
        }
        break;
      case "$in":
        if (Utils.isArray(data)) {
          flag = true;
          for (_i = 0, _len = data.length; _i < _len; _i++) {
            d = data[_i];
            if (flag) {
              if ((function() {
                var c, _j, _len1;
                for (_j = 0, _len1 = condition.length; _j < _len1; _j++) {
                  c = condition[_j];
                  if (Utils.isRegex(c) && c.test(d) || (Utils.isEqual(c, d))) {
                    return true;
                  }
                }
                return false;
              })()) {
                flag = false;
              }
            }
          }
          if (flag) {
            return false;
          }
        } else {
          if (!(function() {
            var c, _j, _len1;
            for (_j = 0, _len1 = condition.length; _j < _len1; _j++) {
              c = condition[_j];
              if (Utils.isRegex(c) && c.test(data) || (Utils.isEqual(c, data))) {
                return true;
              }
            }
            return false;
          })()) {
            return false;
          }
        }
        break;
      case "$nin":
        if (__indexOf.call(condition, data) >= 0) {
          return false;
        }
        break;
      case "$exists":
        if (condition !== (data != null)) {
          return false;
        }
        break;
      case "$type":
        if (!Utils.isType(data, condition)) {
          return false;
        }
        break;
      case "$mod":
        if (data % condition[0] !== condition[1]) {
          return false;
        }
        break;
      case "$regex":
        if (!(new RegExp(condition)).test(data)) {
          return false;
        }
        break;
      case "$and":
        for (_j = 0, _len1 = condition.length; _j < _len1; _j++) {
          c = condition[_j];
          if (!Where(data, c)) {
            return false;
          }
        }
        break;
      case "$nor":
        for (_k = 0, _len2 = condition.length; _k < _len2; _k++) {
          c = condition[_k];
          if (Where(data, c)) {
            return false;
          }
        }
        break;
      case "$or":
        if (!(function() {
          var _l, _len3;
          for (_l = 0, _len3 = condition.length; _l < _len3; _l++) {
            c = condition[_l];
            if (Where(data, c)) {
              return true;
            }
          }
          return false;
        })()) {
          return false;
        }
        break;
      case "$not":
        if (Where(data, condition)) {
          return false;
        }
        break;
      case "$all":
        if (!Utils.isArray(data)) {
          return false;
        }
        for (_l = 0, _len3 = condition.length; _l < _len3; _l++) {
          c = condition[_l];
          if (!(function() {
            var _len4, _m;
            for (_m = 0, _len4 = data.length; _m < _len4; _m++) {
              d = data[_m];
              if (Utils.isArray(c) ? keywordCheck(d, key, c) : d === c) {
                return true;
              }
            }
          })()) {
            return false;
          }
        }
        break;
      case "$elemMatch":
        if (!Utils.isArray(data)) {
          return false;
        }
        if (!(function() {
          var _len4, _m;
          for (_m = 0, _len4 = data.length; _m < _len4; _m++) {
            d = data[_m];
            if (Where(d, condition)) {
              return true;
            }
          }
        })()) {
          return false;
        }
        break;
      case "$size":
        if (!Utils.isArray(data)) {
          return false;
        }
        if (data.length !== condition) {
          return false;
        }
    }
    return true;
  };
  numberCheck = function(data, cmpData) {

    /* Number Check
     *  cmpData: 1
     *  data: 1 or [1,2,3]
     */
    if (Utils.isNumber(data) && cmpData === data) {
      return true;
    }
    if (Utils.isArray(data) && (__indexOf.call(data, cmpData) >= 0)) {
      return true;
    }
    return false;
  };
  stringCheck = function(data, cmpData) {

    /* String Check
     *  cmpData: "abc"
     *  data: "abc" or ["abc","aaa","bbbb"]
     */
    if (Utils.isString(data) && cmpData === data) {
      return true;
    }
    if (Utils.isArray(data) && (__indexOf.call(data, cmpData) >= 0)) {
      return true;
    }
    return false;
  };
  regexCheck = function(data, cmpData) {

    /* Regex Check
     *  cmpData: /abc/
     *  data: "abcd" or ["abcdf","aaaa","basc","abce"] or /abc/ or [/abc/,/bce/,/hello.*ld/]
     */
    var d, _i, _len;
    if (Utils.isArray(data)) {
      for (_i = 0, _len = data.length; _i < _len; _i++) {
        d = data[_i];
        if (Utils.isRegex(d)) {
          if (Utils.isEqual(d, cmpData)) {
            return true;
          }
        } else {
          if (cmpData.test(d)) {
            return true;
          }
        }
      }
    } else {
      if (Utils.isRegex(data)) {
        if (Utils.isEqual(data, cmpData)) {
          return true;
        }
      } else {
        if (cmpData.test(data)) {
          return true;
        }
      }
    }
    return false;
  };
  arrayCheck = function(data, cmpData) {
    return Utils.isEqual(data, cmpData);
  };
  objectCheck = function(data, conditions) {
    var c, flag, key;
    flag = true;
    for (key in conditions) {
      c = conditions[key];
      if (!(isKeyReserved(key))) {
        continue;
      }
      flag = false;
      if (!Where(data, new function() {
        this[key] = c;
      })) {
        return false;
      }
    }
    if (flag) {
      return Utils.isEqual(data, conditions);
    } else {
      return true;
    }
  };
  return module.exports = Where;
});