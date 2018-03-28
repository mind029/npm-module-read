/**
 * 防抖函数：只有当不在触发函数后，再执行一次函数
 * 
 * 思路：利用 clearTimeout() 方法能够阻止 未到达delay的 setTimeout() 允许，
 * 
 * 1、每次进来、判断 timer 是否为空，如果不为空就清除掉 他，那么后面的 setTimeout 就不会执行了
 * 
 * @param {*} fn fn为需要包装的方法
 * @param {*} delay 多少秒内，只要触发了都不执行
 * 
 */

function debounce(fn, delay) {

  // 利用闭包，timer作为判断标志
  var timer;


  return function () {
    var context = this,
      args = arguments;

    // 这里做判断，没次进来都会判断当前是否有定时器，如果有就清空掉。
    // 所以后面后面的 setTimeout 没用了
    // 不在进来的时候，后面定义的setTimeout 就可以延迟执行了。
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }

    // 每次进来都设置 timer ，主要不清空就执行
    timer = setTimeout(function () {
      // 执行自定义函数
      fn.apply(context, args);
    }, delay)

  }
}


// 用法:

var handler = debounce(function (i) {
  console.log(i);
}, 500);


// 这里只会触发一次，因为在2000时间内一致调用 handler方法。
for (var i = 0; i < 2000; i++) {
  handler(i);
}
