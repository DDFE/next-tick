# next-tick
把一些异步操作整合到下一个CPU时间片执行，比多个异步操作多次调用setTimout(fn,0)的效率要高
