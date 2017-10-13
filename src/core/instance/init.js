import { initState } from './state'

let uid = 0;

export default function initMixin (MVVM) {

  MVVM.prototype._init = function (options) {
    const vm = this;
    vm._uid = uid++;
    vm._isMVVM = true;
    vm.$options = options || {};
    
    initState(vm);
    // if (vm.$options.el) {
    //   this.$mount();
    // }
    vm.$mount(vm.$options.el);
  }
  
}
