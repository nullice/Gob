(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.Gob = factory());
}(this, (function () { 'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

/**
 * Created by nullice on 2017/5/14.
 */

var Gob = function () {

    return this;
};

Gob.prototype.sleep = (() => {
    var _ref = _asyncToGenerator(function* (ms) {
        return new Promise(function (resolve, reject) {
            setTimeout(() => {
                resolve(ms);
            }, ms);
        });
    });

    return function (_x) {
        return _ref.apply(this, arguments);
    };
})();

Gob.prototype.doAsync = _asyncToGenerator(function* () {
    console.log("ssss1");
    var a = yield this.sleep();
    console.log("ssss2", a);
});

return Gob;

})));
