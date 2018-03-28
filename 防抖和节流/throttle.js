

/**
 * 节流函数，作用在delay时间内，只触发一次fn函数，
 * 用途：用在 需要控制重复触发的地方、比如 鼠标滚动、scroll、浏览器窗口变化 等等。ajax多个请求。
 * 
 * 思路：接收2个参数，fn为需要包装的方法，delay为延迟多少秒执行。
 * 
 * 1、定义一个定时器，timer。
 * 2、返回函数每次执行都判断这个定时器是否存在，如果存在就 return 掉
 * 
 * 3、 如果不存在（比如第一次），就设置这个定时器
 * 
 * 4、当delay时间到的时候，执行 fn方法，然后 清除 clearTimeout(timer) 定时器、设置为 timer = null
 * 
 * 
 * @param {*} fn fn为需要包装的方法
 * @param {*} delay delay为延迟多少秒执行。
 * 
 * 
 * 用法：看最后面的例子
 */
function throttle(fn, delay) {
  var timer;

  return function () {
    var context = this,
      args = arguments;

    if (timer) {
      return
    }

    timer = setTimeout(function () {
      // 执行自定义函数
      fn.apply(context, args);

      // 清除定时器
      clearTimeout(timer);
      timer = null;

    }, delay);
  }
}



//  详细用法

var handler = throttle(function (num) {
  console.log(num);
}, 500)

/**
 * 这里面虽然我们调用了5000多次，但是其实只执行了
 * 10次而已
 */
for (var i = 0; i < 5000; i++) {
  (function(i){
    setTimeout(function(){
      handler(i);
    },i)
  })(i)
}

