import Watcher from 'src/core/observer/watcher'
import Compile from 'src/compiler/index'
import { observe } from 'src/core/observer'
import initMixin from './init'

/**
 * Create a MVVM
 * @class
 */
function MVVM(options) {
  if (process.env.NODE_ENV !== 'production' &&
    !(this instanceof MVVM)) {
    console.warn('Vue is a constructor and should be called with the `new` keyword')
  }
  this._init(options);
}

MVVM.prototype = {
  constructor: MVVM,
  $watch: function (key, cb, options) {
    new Watcher(this, key, cb);
  },
  $mount: function (el) {
    el = (el instanceof HTMLElement) ? el : document.querySelector(el || 'body');
    this.$options.el = el;
    if (this.$options.el) {
      this.$compile = new Compile(this.$options.el, this)
    }
    return this;
  }
};

initMixin(MVVM);

export default MVVM;
