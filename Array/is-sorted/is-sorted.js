/**
 * cmd模块风格，有一个内置函数
 * 通过module.exports 暴露api函数。
 * 以检查是否一个数组进行排序
 */


/**
 * 内置比较函数，返回 参数 a - b 的结果
 * @param a 
 * @param b 
 */
function defaultComparator (a, b) {
  return a - b
}



/**
 * cmd 导出模块 
 * @param array 传入数组作为参数1
 * @param comparator  比较函数
 */
module.exports = function checksort (array, comparator) {

  // 这里是判断是否有默认值，使用 || ，当第一个参数为 真值 判断， 的时候返回第一个的值，否则返回第二个值
  // 这里就是判断是否传了比较函数进来，如果没传，就用模块内置函数。defaultComparator
  comparator = comparator || defaultComparator

  // 遍历第一个参数数组的值  ,比较第 i-1 和 i 个的值 的大小，
  // 默认阈值：前面的数必须要小于后面一个数，否则就返回false，结束。
  for (var i = 1, length = array.length; i < length; ++i) {
    if (comparator(array[i - 1], array[i]) > 0) return false
  }

  // 说明前面的穿入的数组都符合比较函数的规则。
  return true
}