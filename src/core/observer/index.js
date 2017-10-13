import Dep from './dep'
import { arrayMethods } from './array'
import {
  def,
  hasOwn,
  isObject,
  isPlainObject,
  hasProto,
  warn,
  isValidArrayIndex
} from '../util/index'


const arrayKeys = Object.getOwnPropertyNames(arrayMethods)

/**
 * 数据观察员
 * @constructor
 * @export
 * @param {object} value 
 */
export function Observer(value) {

  // 数据观察员的 原始 value
  this.value = value;

  // 数组情况下有用
  this.dep = new Dep();
  this.vmCount = 0; // number of vms that has this object as root $data
  // 循环引用定义
  // 设置__ob__为不可枚举属性
  def(value, '__ob__', this);

  // 重新定义 value的属性描述  
  if (Array.isArray(value)) {
    // 将数组转换为类数组
    const augment = hasProto
    ? protoAugment
    : copyAugment;
    augment(value, arrayMethods, arrayKeys);

    // 将数组中的对象项设置为 object
    this.observeArray(value);
  } else {
    this.walk(value);
  }
}

Observer.prototype = {
  constructor: Observer,
  walk: function (obj) {
    const keys = Object.keys(obj);
    let key;
    for (let i = 0; i < keys.length; i++) {
      key = keys[i];
      defineReactive(obj, key, obj[key]);
    }
  },
  /**
   * Observe a list of Array items.
   * @param {array} items
   */
  observeArray: function (items) {
    for (let i = 0, l = items.length; i < l; i++) {
      observe(items[i]);
    }
  }
};

/**
 * Define a reactive property on an Object.
 */
export function defineReactive(obj, key, val) {
  const property = Object.getOwnPropertyDescriptor(obj, key);
  
  if (property && property.configurable === false) {
    return;
  }

  // 非对象属性观察类
  const dep = new Dep();

  // cater for pre-defined getter/setters
  const getter = property && property.get;
  const setter = property && property.set;
  
  // 深度观察
  let childOb = observe(val);
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter() {
      const value = getter ? getter.call(obj) : val;

      if (Dep.target) {
        
        // 将当前的 watcher 观察员 传递至数据对象的观察集合中
        // 如果已经存在于数据集合中, 则忽略
        dep.depend();
        if (childOb) {
          // 将当前的 watcher 传递给子对象的 数据对象的观察员集合
          childOb.dep.depend();
        }
      }
      // 返回 getter value or val
      return value;
    },
    set: function reactiveSetter(newVal) {
      const value = getter ? getter.call(obj) : val;
      if (newVal === value || (newVal !== newVal && value !== value)) {
        return;
      }
      if (setter) {
        setter.call(obj, newVal);
      } else {
        val = newVal;
      }

      // 如果为对象，则创建新的 __ob__ 对象
      childOb = observe(newVal);
      dep.notify();
    }
  });
}

/**
 * 代理函数
 * 代理创建 Observer 对象
 * Observer 对象附加给 对象属性 __ob__ 中
 */
export function observe(value, asRootData /* 是否为rootData */) {
  if (!isObject(value)) {
    return;
  }
  let ob;
  if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
    ob = value.__ob__
  } else if (!value._isMVVM && Object.isExtensible(value)){
    ob = new Observer(value);
  }
  if (asRootData && ob) {
    ob.vmCount++;
  }
  return ob;
};

/**
 * 
 * Augment an target Object or Array by intercepting
 * the prototype chain using __proto__
 */
function protoAugment (target, src, keys) {
  /* eslint-disable no-proto */
  target.__proto__ = src
  /* eslint-enable no-proto */
}

/**
 * Augment an target Object or Array by defining
 * hidden properties.
 */
/* istanbul ignore next */
function copyAugment (target, src, keys) {
  for (let i = 0, l = keys.length; i < l; i++) {
    const key = keys[i]
    def(target, key, src[key])
  }
}


/**
 * Set a property on an object. Adds the new property and
 * triggers change notification if the property doesn't
 * already exist.
 */
export function set (target, key, val) {
  // 数组或类数组添加项数
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.length = Math.max(target.length, key);
    // set data
    // if target.__ob__ exits
    // trigger target.__ob__.dep.notify() 
    target.splice(key, 1, val);
    return val;
  }

  // 已存在key, 覆盖属性
  if (hasOwn(target, key)) {
    target[key] = val;
    return val;
  }

  // observe 数据对象
  const ob = (target).__ob__;
  // target 为 mvvm 对象 或者 observe 且 ob 的数据为 new MVVM() 的 root
  // vm = new MVVM({data: {}})
  // vm._data or vm
  if (target._isMVVM || (ob && ob.vmCount)) {
    process.env.NODE_ENV !== 'production' && warn(
      'Avoid adding reactive properties to a Vue instance or its root $data ' +
      'at runtime - declare it upfront in the data option.'
    );
    return val;
  }
  // 非 observe 对象, 普通属性赋值
  if (!ob) {
    target[key] = val;
    return val;
  }
  
  defineReactive(ob.value, key, val);
  
  // 针对类数组对象, 通知更新
  ob.dep.notify();
  return val;
}


/**
 * Delete a property and trigger change if necessary.
 */
export function del (target, key) {
  // 类数组移除
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.splice(key, 1);
    return;
  }
  const ob = (target).__ob__;
  if (target._isVue || (ob && ob.vmCount)) {
    process.env.NODE_ENV !== 'production' && warn(
      'Avoid deleting properties on a Vue instance or its root $data ' +
      '- just set it to null.'
    )
    return;
  }
  if (!hasOwn(target, key)) {
    return;
  }
  // 删除属性
  delete target[key];
  
  if (!ob) {
    return;
  }
  ob.dep.notify();
}

export default Observer;
