/**
 * 将函数延迟执行
 *
 * @param {Function} fn 希望被延迟执行的函数
 * @param {Object} context 执行函数时上下文环境
 * @param {...} args 执行调用多个参数
 * @access public
 * @return {Number} 等待执行的任务数
 *
 * @example
 *
 * var fn = function(){
 *      console.log(2);
 * };
 *
 * nextTick(fn);
 * console.log(1);
 *
 * // 1
 * // 2
 */
'use strict';


(function (global, undefined) {

	var callbacks = []; //等待调用的函数栈
	var running = false; //当前是否正在运行中
	var slice = [].slice;
	var setImmediate = global.setImmediate || function (fn) {
			return global.setTimeout(fn, 0);
		};

	//调用所有在函数栈中的函数
	//如果在执行某函数时又有新的函数被添加进来，
	//该函数也会在本次调用的最后被执行
	function callAllCallbacks() {
		var cbs = callbacks;
		callbacks = [];
		running = false;

		var count = cbs.length;
		for (var index = 0; index < count; index++) {
			var callback = cbs[index];
			var fn = callback[0];
			var context = callback[1];
			fn.apply(context, callback.slice(2));
		}
	}

	function nextTick(fn, context, args) {
		var callback = slice.call(arguments);

		//将函数存放到待调用栈中
		callbacks.push(callback);

		//判断定时器是否启动
		//如果没有启动，则启动计时器
		//如果已经启动，则不需要做什么
		//本次添加的函数会在 callAllCallbacks 时被调用
		if (!running) {
			running = true;
			setImmediate(callAllCallbacks, 0);
		}

		return callbacks.length;
	}

	if (typeof module === 'object' && module && typeof module.exports === 'object') {
		module.exports = nextTick;
	} else if (typeof define === 'function' && define.amd) {
		define('nextTick', [], function () {
			return nextTick;
		});
	} else {
		global.nextTick = nextTick;
	}

})(typeof global === 'object' ? global : window);
