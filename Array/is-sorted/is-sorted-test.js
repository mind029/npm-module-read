var sorted = require('./is-sorted')

// 从大到小排序
console.log(sorted([3, 2, 1], function (a, b) { return b - a })) // true

// 从小到达排序
console.log(sorted([1,2,3],function (a, b) { return a - b }));