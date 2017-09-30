var uid = 0;


/**
 * A dep is an observable that can have multiple
 * directives subscribing to it.
 * 观察员允许多个指令订阅者订阅
 */

function Dep() {
  this.id = uid++;
  this.subs = [];
}

Dep.prototype = {

  constructor: Dep,

  /**
   * @param {Wathcer} sub
   */
  addSub: function (sub) {
    this.subs.push(sub);
  },

  depend: function () {
    if (Dep.target) {
      Dep.target.addDep(this);
    }
  },

  removeSub: function (sub) {
    var index = this.subs.indexOf(sub);
    if (index != -1) {
      this.subs.splice(index, 1);
    }
  },

  notify: function () {
    this.subs.forEach(function (sub) {
      sub.update();
    });
  }
};

// the current target watcher being evaluated.
// this is globally unique because there could be only one
// watcher being evaluated at any time.
Dep.target = null;

export default Dep;
