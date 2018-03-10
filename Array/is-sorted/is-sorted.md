
项目地址：https://github.com/dcousens/is-sorted

介绍：一个小模块,以检查是否一个数组进行排序。

用法：

```

var sorted = require('is-sorted')

console.log(sorted([1, 2, 3]))
// => true

console.log(sorted([3, 1, 2]))
// => false

// supports custom comparators
console.log(sorted([3, 2, 1], function (a, b) { return b - a })
// => true

```

阅读笔记看源，请看 is-sorted.js

