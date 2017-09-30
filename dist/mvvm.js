(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["MVVM"] = factory();
	else
		root["MVVM"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__dep__ = __webpack_require__(1);


function Watcher(vm, expOrFn, cb) {
    this.cb = cb;
    this.vm = vm;
    this.expOrFn = expOrFn;
    this.depIds = {};

    if (typeof expOrFn === 'function') {
        this.getter = expOrFn;
    } else {
        this.getter = this.parseGetter(expOrFn);
    }

    this.value = this.get();
}

Watcher.prototype = {
    update: function update() {
        this.run();
    },
    run: function run() {
        var value = this.get();
        var oldVal = this.value;
        if (value !== oldVal) {
            this.value = value;
            this.cb.call(this.vm, value, oldVal);
        }
    },
    addDep: function addDep(dep) {
        // 1. 每次调用run()的时候会触发相应属性的getter
        // getter里面会触发dep.depend()，继而触发这里的addDep
        // 2. 假如相应属性的dep.id已经在当前watcher的depIds里，说明不是一个新的属性，仅仅是改变了其值而已
        // 则不需要将当前watcher添加到该属性的dep里
        // 3. 假如相应属性是新的属性，则将当前watcher添加到新属性的dep里
        // 如通过 vm.child = {name: 'a'} 改变了 child.name 的值，child.name 就是个新属性
        // 则需要将当前watcher(child.name)加入到新的 child.name 的dep里
        // 因为此时 child.name 是个新值，之前的 setter、dep 都已经失效，如果不把 watcher 加入到新的 child.name 的dep中
        // 通过 child.name = xxx 赋值的时候，对应的 watcher 就收不到通知，等于失效了
        // 4. 每个子属性的watcher在添加到子属性的dep的同时，也会添加到父属性的dep
        // 监听子属性的同时监听父属性的变更，这样，父属性改变时，子属性的watcher也能收到通知进行update
        // 这一步是在 this.get() --> this.getVMVal() 里面完成，forEach时会从父级开始取值，间接调用了它的getter
        // 触发了addDep(), 在整个forEach过程，当前wacher都会加入到每个父级过程属性的dep
        // 例如：当前watcher的是'child.child.name', 那么child, child.child, child.child.name这三个属性的dep都会加入当前watcher
        if (!this.depIds.hasOwnProperty(dep.id)) {
            dep.addSub(this);
            this.depIds[dep.id] = dep;
        }
    },
    get: function get() {
        __WEBPACK_IMPORTED_MODULE_0__dep__["a" /* default */].target = this;
        var value = this.getter.call(this.vm, this.vm);
        __WEBPACK_IMPORTED_MODULE_0__dep__["a" /* default */].target = null;
        return value;
    },

    parseGetter: function parseGetter(exp) {
        if (/[^\w.$]/.test(exp)) return;

        var exps = exp.split('.');

        return function (obj) {
            for (var i = 0, len = exps.length; i < len; i++) {
                if (!obj) return;
                obj = obj[exps[i]];
            }
            return obj;
        };
    }
};

/* harmony default export */ __webpack_exports__["a"] = (Watcher);

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var uid = 0;

function Dep() {
    this.id = uid++;
    this.subs = [];
}

Dep.prototype = {
    addSub: function addSub(sub) {
        this.subs.push(sub);
    },

    depend: function depend() {
        Dep.target.addDep(this);
    },

    removeSub: function removeSub(sub) {
        var index = this.subs.indexOf(sub);
        if (index != -1) {
            this.subs.splice(index, 1);
        }
    },

    notify: function notify() {
        this.subs.forEach(function (sub) {
            sub.update();
        });
    }
};

Dep.target = null;

/* harmony default export */ __webpack_exports__["a"] = (Dep);

/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__instance_index__ = __webpack_require__(3);


// add prototype
Object.defineProperty(__WEBPACK_IMPORTED_MODULE_0__instance_index__["a" /* default */].prototype, '$isServer', {
  get: function get() {
    return typeof window === 'undefined';
  }
});

__WEBPACK_IMPORTED_MODULE_0__instance_index__["a" /* default */].version = '1.0.0';

/* harmony default export */ __webpack_exports__["default"] = (__WEBPACK_IMPORTED_MODULE_0__instance_index__["a" /* default */]);

/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_src_compiler_index__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_src_core_observer_watcher__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_src_core_observer__ = __webpack_require__(5);
var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };





function MVVM(options) {

    if ("production".NODE_ENV !== 'production' && !(this instanceof MVVM)) {
        console.warn('Vue is a constructor and should be called with the `new` keyword');
    }

    this.$options = options || {};
    var data = this._data = this.$options.data;
    var me = this;

    // 数据代理
    // 实现 vm.xxx -> vm._data.xxx
    Object.keys(data).forEach(function (key) {
        me._proxyData(key);
    });

    this._initComputed();

    Object(__WEBPACK_IMPORTED_MODULE_2_src_core_observer__["a" /* observe */])(data, this);

    this.$compile = new __WEBPACK_IMPORTED_MODULE_0_src_compiler_index__["a" /* default */](this.$options.el || document.body, this);
    console.log(this.$compile.$fragment);
}

MVVM.prototype = {
    $watch: function $watch(key, cb, options) {
        new __WEBPACK_IMPORTED_MODULE_1_src_core_observer_watcher__["a" /* default */](this, key, cb);
    },

    _proxyData: function _proxyData(key, setter, getter) {
        var me = this;
        setter = setter || Object.defineProperty(me, key, {
            configurable: false,
            enumerable: true,
            get: function proxyGetter() {
                return me._data[key];
            },
            set: function proxySetter(newVal) {
                me._data[key] = newVal;
            }
        });
    },

    _initComputed: function _initComputed() {
        var me = this;
        var computed = this.$options.computed;
        if ((typeof computed === 'undefined' ? 'undefined' : _typeof(computed)) === 'object') {
            Object.keys(computed).forEach(function (key) {
                Object.defineProperty(me, key, {
                    get: typeof computed[key] === 'function' ? computed[key] : computed[key].get,
                    set: function set() {}
                });
            });
        }
    }
};

/* harmony default export */ __webpack_exports__["a"] = (MVVM);

/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__core_observer_watcher__ = __webpack_require__(0);


function Compile(el, vm) {
    this.$vm = vm;
    this.$el = this.isElementNode(el) ? el : document.querySelector(el);
    this.$template = vm.$options.template;

    if (this.$el) {
        this.$fragment = this.$template ? this.template2Fragment(this.$template) : this.node2Fragment(this.$el);
        this.init();
        this.$el.appendChild(this.$fragment);
    }
}

Compile.prototype = {
    createFragment: function createFragment(html) {
        var child;
        var fragment = document.createDocumentFragment();
        var el = document.createElement('div');

        el.innerHTML = html;
        while (child = el.firstChild) {
            fragment.appendChild(child);
        }
        return fragment;
    },
    template2Fragment: function template2Fragment(template) {
        var el = template.charAt(0) === '#' ? document.body.querySelector(template) : null;
        if (!el) {
            return this.createFragment(template);
        }
        if (el.tagName === 'SCRIPT') {
            return this.createFragment(el.innerHTML);
        } else {
            return this.node2Fragment(el);
        }
    },
    node2Fragment: function node2Fragment(el) {
        var fragment = document.createDocumentFragment(),
            child;

        // 将原生节点拷贝到fragment
        while (child = el.firstChild) {
            fragment.appendChild(child);
        }
        return fragment;
    },

    init: function init() {
        this.compileElement(this.$fragment);
    },

    compileElement: function compileElement(el) {
        var childNodes = el.childNodes,
            me = this;

        [].slice.call(childNodes).forEach(function (node) {
            var text = node.textContent;
            var reg = /\{\{(.*)\}\}/;

            if (me.isElementNode(node)) {
                me.compile(node);
            } else if (me.isTextNode(node) && reg.test(text)) {
                me.compileText(node, RegExp.$1);
            }

            if (node.childNodes && node.childNodes.length) {
                me.compileElement(node);
            }
        });
    },

    compile: function compile(node) {
        var nodeAttrs = node.attributes,
            me = this;

        [].slice.call(nodeAttrs).forEach(function (attr) {
            var attrName = attr.name;
            if (me.isDirective(attrName)) {
                var exp = attr.value;
                var dir = attrName.substring(2);
                // 事件指令
                if (me.isEventDirective(dir)) {
                    compileUtil.eventHandler(node, me.$vm, exp, dir);
                    // 普通指令
                } else {
                    compileUtil[dir] && compileUtil[dir](node, me.$vm, exp);
                }

                node.removeAttribute(attrName);
            }
        });
    },

    compileText: function compileText(node, exp) {
        compileUtil.text(node, this.$vm, exp);
    },

    isDirective: function isDirective(attr) {
        return attr.indexOf('v-') == 0;
    },

    isEventDirective: function isEventDirective(dir) {
        return dir.indexOf('on') === 0;
    },

    isElementNode: function isElementNode(node) {
        return node.nodeType == 1;
    },

    isTextNode: function isTextNode(node) {
        return node.nodeType == 3;
    }
};

// 指令处理集合
var compileUtil = {
    text: function text(node, vm, exp) {
        this.bind(node, vm, exp, 'text');
    },

    html: function html(node, vm, exp) {
        this.bind(node, vm, exp, 'html');
    },

    model: function model(node, vm, exp) {
        this.bind(node, vm, exp, 'model');

        var me = this,
            val = this._getVMVal(vm, exp);
        node.addEventListener('input', function (e) {
            var newValue = e.target.value;
            if (val === newValue) {
                return;
            }

            me._setVMVal(vm, exp, newValue);
            val = newValue;
        });
    },

    class: function _class(node, vm, exp) {
        this.bind(node, vm, exp, 'class');
    },

    bind: function bind(node, vm, exp, dir) {
        var updaterFn = updater[dir + 'Updater'];

        updaterFn && updaterFn(node, this._getVMVal(vm, exp));

        new __WEBPACK_IMPORTED_MODULE_0__core_observer_watcher__["a" /* default */](vm, exp, function (value, oldValue) {
            updaterFn && updaterFn(node, value, oldValue);
        });
    },

    // 事件处理
    eventHandler: function eventHandler(node, vm, exp, dir) {
        var eventType = dir.split(':')[1],
            fn = vm.$options.methods && vm.$options.methods[exp];

        if (eventType && fn) {
            node.addEventListener(eventType, fn.bind(vm), false);
        }
    },

    _getVMVal: function _getVMVal(vm, exp) {
        var val = vm;
        exp = exp.split('.');
        exp.forEach(function (k) {
            val = val[k];
        });
        return val;
    },

    _setVMVal: function _setVMVal(vm, exp, value) {
        var val = vm;
        exp = exp.split('.');
        exp.forEach(function (k, i) {
            // 非最后一个key，更新val的值
            if (i < exp.length - 1) {
                val = val[k];
            } else {
                val[k] = value;
            }
        });
    }
};

var updater = {
    textUpdater: function textUpdater(node, value) {
        node.textContent = typeof value == 'undefined' ? '' : value;
    },

    htmlUpdater: function htmlUpdater(node, value) {
        node.innerHTML = typeof value == 'undefined' ? '' : value;
    },

    classUpdater: function classUpdater(node, value, oldValue) {
        var className = node.className;
        className = className.replace(oldValue, '').replace(/\s$/, '');

        var space = className && String(value) ? ' ' : '';

        node.className = className + space + value;
    },

    modelUpdater: function modelUpdater(node, value, oldValue) {
        node.value = typeof value == 'undefined' ? '' : value;
    }
};

/* harmony default export */ __webpack_exports__["a"] = (Compile);

/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return observe; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__dep__ = __webpack_require__(1);
var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };



function Observer(data) {
    this.data = data;
    this.walk(data);
}

Observer.prototype = {
    walk: function walk(data) {
        var me = this;
        Object.keys(data).forEach(function (key) {
            me.convert(key, data[key]);
        });
    },
    convert: function convert(key, val) {
        this.defineReactive(this.data, key, val);
    },

    defineReactive: function defineReactive(data, key, val) {
        var dep = new __WEBPACK_IMPORTED_MODULE_0__dep__["a" /* default */]();
        var childObj = observe(val);

        Object.defineProperty(data, key, {
            enumerable: true, // 可枚举
            configurable: false, // 不能再define
            get: function get() {
                if (__WEBPACK_IMPORTED_MODULE_0__dep__["a" /* default */].target) {
                    dep.depend();
                }
                return val;
            },
            set: function set(newVal) {
                if (newVal === val) {
                    return;
                }
                val = newVal;
                // 新的值是object的话，进行监听
                childObj = observe(newVal);
                // 通知订阅者
                dep.notify();
            }
        });
    }
};

function observe(value, vm) {
    if (!value || (typeof value === 'undefined' ? 'undefined' : _typeof(value)) !== 'object') {
        return;
    }

    return new Observer(value);
};



/* unused harmony default export */ var _unused_webpack_default_export = (Observer);

/***/ })
/******/ ]);
});