import Dep from './dep'
import { arrayMethods } from './array'
import {
  def,
  hasOwn,
  isObject,
  isPlainObject,
  hasProto
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

  // value 对象观察类, 
  this.dep = new Dep();

  this.vmCount = 0; // number of vms that has this object as root $data
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
    for (let i = 0; i < keys.length; i++) {
      defineReactive(obj, keys[i], obj[keys[i]]);
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

  // 非对象属性观察类
  const dep = new Dep();
  
  const property = Object.getOwnPropertyDescriptor(obj, key);

  if (property && property.configurable === false) {
    return;
  }

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
      // 返回 getter value or  val
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

export default Observer;
