/*
 * @Descripttion: 
 * @version: 
 * @Author: Chris
 * @Date: 2019-06-12 18:37:12
 * @LastEditors  : sueRimn
 * @LastEditTime : 2020-01-12 20:28:41
 */

Function.prototype.myCall = function () {
  var ctx = arguments[0] || window;
  ctx.fn = this;
  var args = [];
  var len = arguments.length;
  for (var i = 1; i < len; i++) {
    args.push('arguments[' + i + ']');
  }
  //args-->['arguments[1]','arguments[2]',...]
  var result = eval('ctx.fn(' + args.join(',') + ')');
  delete ctx.fn;
  return result;
}

Function.prototype.myApply = function (ctx, arr) {
  var ctx = ctx || window;
  ctx.fn = this;
  if (!arr) {
    var result = ctx.fn();
    delete ctx.fn;
    return result;
  } else {
    var len = arr.length,
      args = [];
    for (var i = 0; i < len; i++) {
      args.push('arguments[' + i + ']');
    }
    var result = eval('ctx.fn(' + args.join(',') + ')');
    delete ctx.fn;
    return result;
  }
}
Function.prototype.myBind = function (target = window) {
  var self = this
  var args = [].slice.call(arguments, 1)
  var temp = function () { }
  var f = function () {
    var _args = [].slice.call(arguments, 0)
    return self.apply(this instanceof temp ? this : target, args.concat(_args))
  }
  temp.prototype = self.prototype
  f.prototype = new temp()
  return f
}
//---------------------------------------------------------------------
// 深度克隆
function deepClone (origin, target) {
  var target = target || {},
    toStr = Object.prototype.toString,
    arrStr = '[object Array]';

  for (var prop in origin) {
    if (origin.hasOwnProperty(prop)) {
      if (origin[prop] !== 'null' && typeof (origin[prop]) == 'object') {
        if (toStr.call(origin[prop]) == arrStr) {
          target[prop] = []
        } else {
          target[prop] = {}
        }
        deepClone(origin[prop], target[prop])
      }
    } else {
      target[prop] = origin[prop];
    }
  }
  return target;
}

// ---------------------------------------------------------------------------
// 继承 圣杯模式
function inherit (Target, Origin) {
  function F () { };
  F.prototype = Origin.prototype;
  Target.prototype = new F();
  Target.prototype.constrctor = Target;
  Target.prototype.uber = Origin.prototype;
}

// var inherit = (function () {
//     var F = function () {};
//     return function (Target, Origin) {
//         F.prototype = Origin.prototype;
//         Target.prototype = new F();
//         Target.prototype.constrctor = Target;
//         Target.prototype.uber = Origin.prototype;
//     }
// })()

// ------------------------------------------


/**
 * @name: 固定参数柯里化函数
 * @test: test font
 * @msg: 传入一个需要固定参数的函数
 * @param {fn} 
 * @return: 
 */
function FixedParamCurry (fn) {
  var arg = [].slice.call(arguments, 1);
  return function () {
    var newArg = arg.concat([].slice.call(arguments, 0));
    return fn.apply(this, newArg);
  }
}

/**
 * @name: 柯里化函数
 * @test: test font
 * @msg: 传入一个固定参数的函数，最后一个传入的时候必须把函数的参数凑齐
 * @param {type} 
 * @return: 返回一个新的函数，
 */
function Curry (fn, length) {
  var length = length || fn.length;
  return function () {
    if (arguments.length < length) {
      var combined = [fn].concat([].slice.call(arguments, 0));
      return Curry(FixedParamCurry.apply(this, combined), length - arguments.length);
    } else {
      return fn.apply(this, arguments);
    }
  }
}


//fn(1,2,3,4)  fn(1)(2)(3)(4)  fn(1,2)(3,4)
/* 柯里化案例*/
// function ajax(type,url,data){
//     // var xhr=new XMLHttpRequest();
//     // xhr.open(type,url,true);
//     // xhr.send(data);
//     console.log(type);
//     console.log(url);
//     console.log(data);
// }
// //虽然ajax这个函数非常通用，但是重复调用时参数冗余
// // ajax('POST','www.test1.com','name=chris');
// // ajax('POST','www.test2.com','name=chris');
// // ajax('POST','www.test3.com','name=chris');
// //利用柯里化curry
// var ajaxCurry = Curry(ajax);
// //以post请求的函数
// var post = ajaxCurry('post');

// post('www.test1.com','name=chris');

// //以post 请求于 www.test.com 的数据 函数
// var postFromTest = post('www.test.com');

// postFromTest('name=chris001');
//---------------------------------------------------------------------


//数组扁平化  -->将一个维度很深的数组  展开成一位数组
function flatten (arr) {
  var arr = arr || [],
    resArr = [],
    len = arr.length;
  for (var i = 0; i < len; i++) {
    if (isArray(arr[i])) {
      resArr = resArr.concat(flatten(arr[i]));
    } else {
      resArr.push(arr[i])
    }
  }
  return resArr;
}

function isArray (arr) {
  var arrStr = '[object Array]';
  return Object.prototype.toString.call(arr) == arrStr;
}

Array.prototype.flatten = function () {
  var resArr = [];
  // var len = this.length;
  // for(var i = 0; i < len; i++) {
  //     if(isArray(this[i])) {
  //         resArr = resArr.concat(this[i].flatten());
  //     }else{
  //         resArr.push(this[i])
  //     }
  // }
  this.forEach(function (item) {
    Object.prototype.toString.call(item) == '[object Array]' ? resArr = resArr.concat(item.flatten()) : resArr.push(item);
  })
  return resArr;
}

function newFlatten (arr) {
  var arr = arr || [];
  return arr.reduce(function (prev, next) {
    return Object.prototype.toString.call(next) == '[object Array]' ? prev.concat(newFlatten(next)) : prev.concat(next);
  }, [])
}

const flattenNew = arr => arr.reduce((prev, next) => Object.prototype.toString.call(next) == '[object Array]' ? prev.concat(flattenNew(next)) : prev.concat(next), [])
//---------------------------------------------------------------------


//惰性函数  利用闭包  改变函数主体
//eg:记录函数首次调用时间

// var test = function(){
//     var t = new Date().getTime();
//     test = function(){
//         return t;
//     }
//     return test();
// }

//实例
// function addEvent(dom , type , handler){
//     if(dom.addEventListener){
//         dom.addEventListener(type,handler,false);
//         addEvent = function(dom , type , handler){
//             dom.addEventListener(type,handler,false);
//         }
//     }else{
//         dom.attachEvent('on'+type,handler);
//         addEvent = function(dom , type , handler){
//             dom.attachEvent('on'+type,handler);
//         }
//     }
// }
//-----------------------------------------------------------


//函数组合   高阶函数思想
//案例
// function compose(f,g){
//     return function(x){
//         return f(g(x))
//     }
// }

function toUpperCase (str) {
  return str.toUpperCase();
}

function add (str) {
  return str + '!';
}
var f = compose1(add, toUpperCase);
// console.log(f('asd'));

// 普遍意义的函数组合

function compose () {
  var args = Array.prototype.slice.call(arguments);
  var len = args.length - 1; //最后一个函数
  return function (x) {
    var result = args[len](x);
    while (len--) {
      result = args[len](result);
    }
    return result;
  }
}

function compose1 () {
  var args = Array.prototype.slice.call(arguments);
  return function (x) {
    return args.reduceRight(function (res, cb) {
      return cb(res)
    }, x)
  }
}

// 函数组合 自左向右
function compose2 () {
  var args = Array.prototype.slice.call(arguments);
  return function (x) {
    return args.reduce(function (res, cb) {
      return cb(res)
    }, x)
  }
}

// -----------------------------------------------------------
// 纯函数   没有借助外界变量




//--------------------------------------------------------------
// 函数记忆 

function factorial (n) {
  if (n == 0 || n == 1) {
    return 1;
  } else {
    return n * factorial(n - 1);
  }
}

// 记忆函数
function memorize (fn) {
  var cache = {};
  return function () {
    var key = arguments.length + Array.prototype.join.call(arguments);
    if (cache[key]) {
      return cache[key]
    } else {
      cache[key] = fn.apply(this, arguments);
      return cache[key]
    }
  }
}


// ----------------------------------------------

// ajax.open(method,url,true)  方法post  get  请求地址  异步true 同步false
// ajax.send() 发送
// onreadystatechange  监听数据  返回4  数据已经请求回来了





function ajaxFn (method, url, callBack, data, flag = true) {
  let xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHttp')
  method = method.toUpperCase();
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && xhr.status == 200) {
      callBack(xhr.responseText);
    }
  }
  if (method == 'GET') {
    xhr.open(method, url + '?' + data, flag);
    xhr.send();
  } else if (method == 'POST') {
    xhr.open(method, url, flag);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
    xhr.send(data);
  }
}

// 复制到粘贴板
copyShaneUrl(shareLink) {
  var input = document.createElement('input') // 直接构建input
  input.value = shareLink // 设置内容
  document.body.appendChild(input) // 添加临时实例
  input.select() // 选择实例内容
  document.execCommand('Copy') // 执行复制
  document.body.removeChild(input) // 删除临时实例
}