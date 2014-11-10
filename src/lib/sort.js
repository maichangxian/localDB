// Generated by CoffeeScript 1.8.0
define(function(require, exports, module) {
  'use strict';
  var Sort, Utils;
  Utils = require('lib/utils');
  Sort = {};

  /*
    * 快速排序
    * @param array 待排序数组
    * @param key 排序字段
    * @param order 排序方式（1:升序，-1降序）
   */
  Sort.quickSort = function(array, key, order) {
    var compareValue, leftArr, pointCompareValue, pointValue, rightArr, value, _i, _len;
    if (array.length <= 1) {
      return array;
    }
    pointValue = array.splice(0, 1)[0];
    pointCompareValue = Utils.getSubValue(pointValue, key);
    leftArr = [];
    rightArr = [];
    for (_i = 0, _len = array.length; _i < _len; _i++) {
      value = array[_i];
      compareValue = Utils.getSubValue(value, key);
      if ((compareValue == null) || compareValue < pointCompareValue) {
        leftArr.push(value);
      } else {
        rightArr.push(value);
      }
    }
    if (order >= 1) {
      return Sort.quickSort(leftArr, key, order).concat([pointValue], Sort.quickSort(rightArr, key, order));
    } else {
      return Sort.quickSort(rightArr, key, order).concat([pointValue], Sort.quickSort(leftArr, key, order));
    }
  };

  /*
    * 数据排序
   */
  Sort.sort = function(data, sortObj) {
    var key, order, result, sort, sortArr, _i, _len;
    sortArr = [];
    for (key in sortObj) {
      order = sortObj[key];
      sortArr.unshift({
        key: key,
        order: order
      });
    }
    result = data;
    for (_i = 0, _len = sortArr.length; _i < _len; _i++) {
      sort = sortArr[_i];
      result = Sort.quickSort(result, sort.key, sort.order);
      console.log(result);
    }
    return result;
  };
  return module.exports = Sort;
});