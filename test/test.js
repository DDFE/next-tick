/**
 * Created by huangyi on 15/11/20.
 */

var expect = require('chai').expect;
var nextTick = require('../src/nextTick');

describe('next-tick', function () {
	it('callback length should equal to the nextTick called time', function (done) {
		var fn1 = function () {
			console.log(1);
		};

		expect(nextTick(fn1)).to.equal(1);

		function A() {
			this.hehe = 'hehe';
		}

		var fn2 = function () {
			console.log(this.hehe);
		};

		var a = new A();

		expect(nextTick(fn2, a)).to.equal(2);

		var fn3 = function (a, b) {
			console.log(a);
			console.log(b);
		};

		expect(nextTick(fn3, null, 'a', 'b')).to.equal(3);

		var fn4 = function () {

			expect(nextTick(function () {
				console.log(5);
			})).to.equal(1);

			console.log(4);

			done();
		};

		expect(nextTick(fn4)).to.equal(4);
	});
});