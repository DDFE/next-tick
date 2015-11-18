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
(function (window, undefined) {

	var callbacks = []; //等待调用的函数栈
	var running = false; //当前是否正在运行中
	var slice = [].slice;

	//调用所有在函数栈中的函数
	//如果在执行某函数时又有新的函数被添加进来，
	//该函数也会在本次调用的最后被执行
	function callAllCallbacks() {
		var count = callbacks.length;
		for (var index = 0; index < count; index++) {

			var callback = callbacks[index];
			var fn = callback[0];
			var context = callback[1];
			var args = callback[2];
			fn.apply(context, args);
		}
		//删除已经调用过的函数
		callbacks.splice(0, count);

		//判断是否还有函数需要执行
		//函数可能在 callAllCallbacks 调用的过程中被添加到 callbacks 数组
		//所以需要再次判断
		if (callbacks.length) {
			setTimeout(callAllCallbacks, 0);
		} else {
			running = false;
		}
	}

	function nextTick(fn, context) {

		context = context || window;

		var callback = [fn, context, slice.call(arguments, 2)];

		//将函数存放到待调用栈中
		callbacks.push(callback);

		//判断定时器是否启动
		//如果没有启动，则启动计时器
		//如果已经启动，则不需要做什么
		//本次添加的函数会在 callAllCallbacks 时被调用
		if (!running) {
			running = true;
			setTimeout(callAllCallbacks, 0);
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
		window.nextTick = nextTick;
	}

})(window);
