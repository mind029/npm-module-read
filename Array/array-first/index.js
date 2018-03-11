/*!
 * array-first <https://github.com/jonschlinkert/array-first>
 *
 * Copyright (c) 2014 Jon Schlinkert, contributors.
 * Licensed under the MIT license.
 */

// 引入is-number模块，用于判断是否为数字 
var isNumber = require('is-number');
// 引入数组分割方法
var slice = require('array-slice');

/**
 * 暴露api方法 arrayFirst
 * @param {*} arr 传入数组参数
 * @param {*} num 切割个数
 */
module.exports = function arrayFirst(arr, num) {

  // 这里判断arr参数否位数组，如果不是数组 抛出异常 throw new Error("描述")
  if (!Array.isArray(arr)) {
    throw new Error('array-first expects an array as the first argument.');
  }

  // 判断是否为空数组，如果是空数组，结束函数，return null
  if (arr.length === 0) {
    return null;
  }

  // 到这里说明不是空数组了
  // 调用slice方法开始分割数组，设置开始分割参数，从0开始
  // 调用isNumber()函数判断 参数 num是否为数字，如果是，返回 +num（相当于Number(num)）强制转成数字意思。不是就返回1 
  var first = slice(arr, 0, isNumber(num) ? +num : 1);

  // 当num 等于1 或者不穿的时候，直接返回 传入数组 切割 [1]
  if (+num === 1 || num == null) {
    return first[0];
  }

  // 如果不等于1.就返回所有切割数组。
  return first;
};