// 项目源码地址：https://raw.githubusercontent.com/lodash/lodash/4.2.0-npm-packages/lodash.chunk/index.js


// 将数组（array）拆分成多个 size 长度的区块，并将这些区块组成一个新数组。 
// 如果array 无法被分割成全部等长的区块，那么最后剩余的元素将组成一个区块。


/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0,
  MAX_SAFE_INTEGER = 9007199254740991,
  MAX_INTEGER = 1.7976931348623157e+308,
  NAN = 0 / 0;

/** `Object#toString` result references. */

// 定义各种Object.toString 返回的字符串名称

var funcTag = '[object Function]',
  genTag = '[object GeneratorFunction]',
  symbolTag = '[object Symbol]';

/** Used to match leading and trailing whitespace. */
// 定义正则，用来匹配 任何空白字符，包括空格、制表符、换页符等等
// 这里的正则是 匹配 空白字符开始的或者空白字符结束的。

var reTrim = /^\s+|\s+$/g;

/** Used to detect bad signed hexadecimal string values. */

// 用于检测有符号的十六进制字符串值
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

/** Used to detect binary string values. */

// 用于检测二进制字符串值
var reIsBinary = /^0b[01]+$/i;

/** Used to detect octal string values. */
// 用于检测八进制字符串值。
var reIsOctal = /^0o[0-7]+$/i;

/** Used to detect unsigned integer values. */
// 用于检测无符号整数值
// 用于匹配0开头或者1-9开头的整数 
// 能够匹配到 0、或者1、避免了01这种
var reIsUint = /^(?:0|[1-9]\d*)$/;

/** Built-in method references without a dependency on `root`. */
// 内建的方法引用不依赖 root的
var freeParseInt = parseInt;

/** Used for built-in method references. */
// 用于内置方法参考
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */

// 内置方法，toString，能够缓存
var objectToString = objectProto.toString;

/* Built-in method references for those with the same name as other `lodash` methods. */
// 为与其他`lodash`方法具有相同名称的内置方法引用。
var nativeCeil = Math.ceil,
  nativeMax = Math.max;

/**
 * The base implementation of `_.slice` without an iteratee call guard.
 * // slice方法的自己实现
 * 
 * @private
 * @param {Array} array The array to slice. 原始数组
 * @param {number} [start=0] The start position. 开始拷贝位置
 * @param {number} [end=array.length] The end position. 结束拷贝位置
 * @returns {Array} Returns the slice of `array`. 返回切分好的数组
 */

// 自定义切割数组函数，接收3个参数，array、start、end
function baseSlice(array, start, end) {

  // 
  var index = -1,
    length = array.length;  // 数组的长度


  // 当开始拷贝位置小于0的时候，取其整数，是否大于数组的长度，如果大于数组的长度，
  // 那么开始位置就为0，否则为 （length + start）相当于从正数 （length + start） 开始。
  if (start < 0) {
    // 这里对start 进行三元表达式比较后在 得到 start最终开始起。
    start = -start > length ? 0 : (length + start);
  }

  // 结束位置，判断是否大于数组的长度，如果大于就是取数组的长度，否则就用end的座位截取结束位置

  end = end > length ? length : end;

  // 判断 end 传入参数是否 为负数
  if (end < 0) {
    // 如果为负数，那么 end = end + length ，相当于length长度-end负数。得到正数的结束位置
    end += length;
  }

  // 这里需要弄懂 >>> 这个表示什么，
  // 取得子数组的长度是多少
  length = start > end ? 0 : ((end - start) >>> 0);
  start >>>= 0;


  // 创建一个  [empty × length] 的空数组，但是长度为5
  var result = Array(length);

  // index的值是从-1开始的。这里++index 表示先++在比较，则第一次 为 0是否小于 length，一致循环下去
  while (++index < length) {
    // 第一次 ++index 后为0，array[index + start] 为原数组的 第start + index 项目。实现了截取复制
    result[index] = array[index + start];
  }

  // 返回部分拷贝的数组。
  return result;
}

/**
 * Checks if `value` is a valid array-like index.
 * 检查 value是否为 是否为有效的index
 * 
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  length = length == null ? MAX_SAFE_INTEGER : length;
  return !!length &&
    (typeof value == 'number' || reIsUint.test(value)) &&
    (value > -1 && value % 1 == 0 && value < length);
}

/**
 * Checks if the given arguments are from an iteratee call.
 * 检查给定的参数是否来自迭代调用
 * @private
 * @param {*} value The potential iteratee value argument.
 * @param {*} index The potential iteratee index or key argument.
 * @param {*} object The potential iteratee object argument.
 * @returns {boolean} Returns `true` if the arguments are from an iteratee call,
 *  else `false`.
 */
function isIterateeCall(value, index, object) {

  // 判断是不是对象，如果不是对象，结束调用
  if (!isObject(object)) {
    return false;
  }
  // 判断 index 类型
  var type = typeof index;
  if (type == 'number'
    ? (isArrayLike(object) && isIndex(index, object.length))
    : (type == 'string' && index in object)
  ) {
    return eq(object[index], value);
  }
  return false;
}

/**
 * Creates an array of elements split into groups the length of `size`.
 * If `array` can't be split evenly, the final chunk will be the remaining
 * elements.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Array
 * @param {Array} array The array to process.
 * @param {number} [size=1] The length of each chunk
 * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`. 可以用作`_.map`等方法的迭代器。
 * @returns {Array} Returns the new array of chunks.
 * @example
 *
 * _.chunk(['a', 'b', 'c', 'd'], 2);
 * // => [['a', 'b'], ['c', 'd']]
 *
 * _.chunk(['a', 'b', 'c', 'd'], 3);
 * // => [['a', 'b', 'c'], ['d']]
 */


/**
 * 接收3个参数，原数组，分割长度，是否用于迭代器
 */
function chunk(array, size, guard) {
  if ((guard ? isIterateeCall(array, size, guard) : size === undefined)) {
    size = 1;
  } else {
    size = nativeMax(toInteger(size), 0);
  }

  // 取得数组的长度
  var length = array ? array.length : 0;

  if (!length || size < 1) {
    return [];
  }
  var index = 0,
    resIndex = 0,
    result = Array(nativeCeil(length / size));  //创建指定 length/size 长度的空数组，


  // 当index小于数组长度的时候，每次index增加size位  
  // 知识点1：循环的时候 index += size ，可以一次增加几位，而不是1位。
  // 知识点2：使用silce分割原数组 

  while (index < length) {
    // 这样就可以出分割的数组，然后 baseSlice 以 index 和 index + size 作为范围的截取 子数组
    result[resIndex++] = baseSlice(array, index, (index += size));
  }

  // 最后返回值。
  return result;
}

/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * 比较两个值以确定它们是否相等。
 * 
 * 
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare. 需要比较参数1
 * @param {*} other The other value to compare. 需要比较阐述2
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`. 返回比较值是否相等 true相等、false不相等
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq(value, other) {
  // 这里要判断是否为 NaN 类型的值，NaN 是唯一不等于自身的值，
  // 第一个 判断2个是否相等，当不相等的时候看他们是否 为NaN ，NaN的特征就是不等于自己，所以2个都要比较
  return value === other || (value !== value && other !== other);
}

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * 判断一个值是否为类数组。
 * 
 * 
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */

function isArrayLike(value) {
  // 多级 && 判断的情况下，是从做到右 判断的，先比较前面两个，然后拿前面2个返回值跟第三个比价
  // 这里 判断是否为 不等于 null、然后在判断 length 是否为 数字
  // 最后判断是否为函数
  return value != null && isLength(value.length) && !isFunction(value);
}

/**
 * Checks if `value` is classified as a `Function` object.
 * 检查一个值是否为函数对象
 * 
 * 
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 8-9 which returns 'object' for typed array and other constructors.
  var tag = isObject(value) ? objectToString.call(value) : '';
  return tag == funcTag || tag == genTag;
}

/**
 * Checks if `value` is a valid array-like length.
 *
 * 判断一个值 是否为一个有效的长度单位。
 * 
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */

function isLength(value) {
  // 当为true的时候，满足条件 1、 为number类型、2、大于-1 3、能够整数1 4、并且小于安全值
  return typeof value == 'number' &&
    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * 检查一个值是否为对象
 * 
 * 
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  // 获取value的 typeof 值，然后 判断是否为 undefined。如果不为undefined的话，在看看是否为 object 或 function
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * 判断一个值是否为符号，通过toString返回值来判断
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && objectToString.call(value) == symbolTag);
}

/**
 * Converts `value` to a finite number.
 *
 * @static
 * @memberOf _
 * @since 4.12.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {number} Returns the converted number.
 * @example
 *
 * _.toFinite(3.2);
 * // => 3.2
 *
 * _.toFinite(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toFinite(Infinity);
 * // => 1.7976931348623157e+308
 *
 * _.toFinite('3.2');
 * // => 3.2
 */
function toFinite(value) {
  if (!value) {
    return value === 0 ? value : 0;
  }
  value = toNumber(value);
  if (value === INFINITY || value === -INFINITY) {
    var sign = (value < 0 ? -1 : 1);
    return sign * MAX_INTEGER;
  }
  return value === value ? value : 0;
}

/**
 * Converts `value` to an integer.
 * 把值转换成整数
 * 
 * **Note:** This method is loosely based on
 * [`ToInteger`](http://www.ecma-international.org/ecma-262/7.0/#sec-tointeger).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {number} Returns the converted integer.
 * @example
 *
 * _.toInteger(3.2);
 * // => 3
 *
 * _.toInteger(Number.MIN_VALUE);
 * // => 0
 *
 * _.toInteger(Infinity);
 * // => 1.7976931348623157e+308
 *
 * _.toInteger('3.2');
 * // => 3
 */
function toInteger(value) {
  var result = toFinite(value),
    remainder = result % 1;

  return result === result ? (remainder ? result - remainder : result) : 0;
}

/**
 * Converts `value` to a number.
 * 把值转换成数字
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 * @example
 *
 * _.toNumber(3.2);
 * // => 3.2
 *
 * _.toNumber(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toNumber(Infinity);
 * // => Infinity
 *
 * _.toNumber('3.2');
 * // => 3.2
 */
function toNumber(value) {
  if (typeof value == 'number') {
    return value;
  }
  if (isSymbol(value)) {
    return NAN;
  }
  if (isObject(value)) {
    var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
    value = isObject(other) ? (other + '') : other;
  }
  if (typeof value != 'string') {
    return value === 0 ? value : +value;
  }
  value = value.replace(reTrim, '');
  var isBinary = reIsBinary.test(value);
  return (isBinary || reIsOctal.test(value))
    ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
    : (reIsBadHex.test(value) ? NAN : +value);
}

module.exports = chunk;