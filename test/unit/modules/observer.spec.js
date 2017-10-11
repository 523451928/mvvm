import MVVM from 'mvvm'
import {
  Observer,
  observe,
} from 'core/observer/index'

describe('Observer', () => {
  it('create on non-observables', () => {
    // skip primitive value
    const ob1 = observe(1)
    expect(ob1).toBeUndefined()
    // avoid mvvm instance
    const ob2 = observe(new MVVM())
    expect(ob2).toBeUndefined()
    // avoid frozen objects
    const ob3 = observe(Object.freeze({}))
    expect(ob3).toBeUndefined()
  });


  it('create on object', () => {
    // on object
    const obj = {
      a: {},
      b: {}
    }
    const ob1 = observe(obj)
    expect(ob1 instanceof Observer).toBe(true)
    expect(ob1.value).toBe(obj)
    expect(obj.__ob__).toBe(ob1)
    // should've walked children
    expect(obj.a.__ob__ instanceof Observer).toBe(true)
    expect(obj.b.__ob__ instanceof Observer).toBe(true)
    // should return existing ob on already observed objects
    const ob2 = observe(obj)
    expect(ob2).toBe(ob1)
  });

  it('create on already observed object', () => {
    // on object
    const obj = {}
    let val = 0
    let getCount = 0
    Object.defineProperty(obj, 'a', {
      configurable: true,
      enumerable: true,
      get () {
        getCount++
        return val
      },
      set (v) { val = v }
    });

    const ob1 = observe(obj);
    expect(ob1 instanceof Observer).toBe(true);
    expect(ob1.value).toBe(obj);
    expect(obj.__ob__).toBe(ob1);

    // 重新定义 obj时 触发原有的 get
    getCount = 0;
    // Each read of 'a' should result in only one get underlying get call
    obj.a;
    expect(getCount).toBe(1);
    obj.a;
    expect(getCount).toBe(2);

    // should return existing ob on already observed objects
    const ob2 = observe(obj);
    expect(ob2).toBe(ob1);

    // should call underlying setter
    obj.a = 10;
    expect(val).toBe(10);
  });
  
  it('create on property with only getter', () => {
    // on object
    const obj = {}
    Object.defineProperty(obj, 'a', {
      configurable: true,
      enumerable: true,
      get () { return 123;}
    })
    
    const ob1 = observe(obj)
    expect(ob1 instanceof Observer).toBe(true)
    expect(ob1.value).toBe(obj)
    expect(obj.__ob__).toBe(ob1)

    // should be able to read
    expect(obj.a).toBe(123)

    // should return existing ob on already observed objects
    const ob2 = observe(obj)
    expect(ob2).toBe(ob1)
    // since there is no setter, you shouldn't be able to write to it
    // PhantomJS throws when a property with no setter is set
    // but other real browsers don't
    try {
      obj.a = 101
    } catch (e) {}
    expect(obj.a).toBe(123)
  })
});
