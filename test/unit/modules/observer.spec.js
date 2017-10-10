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
  
});
