


/**
 * Callback index.
 */

var count = 0;

/**
 * Noop function.
 */

function noop() {}

/**
 * JSONP handler
 *
 * Options:
 *  - param {String} qs parameter (`callback`)  // 传给后台的参数
 *  - prefix {String} qs parameter (`__jp`) //  // 前缀
 *  - name {String} qs parameter (`prefix` + incr)  // 传给后台函数名，同时也是window全局函数名
 *  - timeout {Number} how long after a timeout error is emitted (`60000`)
 *
 * @param {String} url  // 传入url
 * @param {Object|Function} optional options / callback // 传入配置参数
 * @param {Function} optional callback  // 回到函数
 */




function jsonp(url, opts, fn) {

  // 判断配置是否为函数 
  if ('function' == typeof opts) {
    fn = opts;
    opts = {};
  }

  // 入门没有传配置，自己创建一个空对象，作为初始值
  if (!opts) opts = {};

  // 设置前缀
  var prefix = opts.prefix || '__jp';

  // use the callback name that was passed if one was provided.
  // otherwise generate a unique name by incrementing our counter.
  // 如果没有穿有windows 全局函数名，则使用自定义后缀+count 来组合。其实也可以使用 Date.now() 时间戳来
  var id = opts.name || (prefix + (count++));

  // 判断是否穿有参数名，没有就默认callback、后台就接收这个参数。
  var param = opts.param || 'callback';

  // 超时时间，判断是否有穿有，没有穿的话就6000毫秒
  var timeout = null != opts.timeout ? opts.timeout : 60000;

  // 参数编码
  var enc = encodeURIComponent;

  // 插入的地方
  var target = document.getElementsByTagName('script')[0] || document.head;

  // 创建script标签
  var script;

  // 定时器，
  var timer;




  if (timeout) {
    timer = setTimeout(function () {
      cleanup();
      if (fn) fn(new Error('Timeout'));
    }, timeout);
  }


  /**
   * 清楚函数，删除掉jsonp创建的script标签，和全局window[id]函数
   */
  function cleanup() {
    if (script.parentNode) script.parentNode.removeChild(script);
    window[id] = noop;
    if (timer) clearTimeout(timer);
  }


  /**
   * 清除掉全局window[id] 函数
   */
  function cancel() {
    if (window[id]) {
      cleanup();
    }
  }


  /**
   * 创建jsonp执行函数，这个函数也是后台接收参数，然后 执行的函数，back+'('+ '123123' +')';
   */
  window[id] = function (data) {
    cleanup();
    if (fn) fn(null, data);
  };


  // 对url进行处理，还有对jsonp参数进行转码.
  // add qs component
  url += (~url.indexOf('?') ? '&' : '?') + param + '=' + enc(id);
  url = url.replace('?&', '?');


  // 创建script标签，然后用于追加到网页里面
  // create script
  script = document.createElement('script');

  // 设置跨域url，
  script.src = url;


  // 这里可以增加一些事件、比如加载完成，错误
  // 高级浏览器可以通过onload事件来判断 JavaScript、img是否加载完成、但是ie等低版本的浏览器只能通过
  // onreadystatechange + readyState 的方式来判断。loaded 或者、complete
  script.onload = script.onreadystatechange = function () {
    if ((!this.readyState || this.readyState === "loaded" || this.readyState === "complete")) {
      // 加载完成了
      
      script.onload = script.onreadystatechange = null; //人工回收内存  
      
    }
  };

  
  // 错误事件
  script.onerror = function(){
    fn(new Error('加载脚本出错了'));
  }

  // 把script插入到网页中去，就相当于src调用远程js文件一样，js文件里面的代码就会自动执行。
  // window[id] 这个函数，
  target.parentNode.insertBefore(script, target);

  return cancel;
}


/**
 * 暴露 commonjs对象 方法
 */


if(typeof module !== "undefined" && module.exports){
  module.exports = jsonp;
}



// // 用法

// var url = "https://dc.3.cn/category/get";
// var opts = {
//   // 后台接收参数名
//   param:'callback',
//   // 超时时间
//   timeout:5000
// }

// // 回到函数
// var handler = function (err, data) {
//   if (err) {
//     throw err
//   }
//   console.log("后台传回来的数据", data);
// }

// // 调用jsonp，然后把数据创给handler，完成之后在清除掉 全局函数和script
// var jp = jsonp(url, opts, handler);


