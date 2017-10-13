import MVVM from 'core/index'
import Watcher from 'core/observer/watcher'

describe('Watcher', () => {

  let vm, spy
  beforeEach(() => {
    vm = new MVVM({
      template: '<div></div>',
      data: {
        a: 1,
        b: {
          c: 2, // watcher value
          d: 4
        },
        c: 'c',
        msg: 'yo'
      }
    }).$mount()
    spy = jasmine.createSpy('watcher')
  })

  it('path', () => {
    const watcher = new Watcher(vm, 'b.c', spy);
    expect(watcher.value).toBe(2);
    vm.b.c = 3;
    // val, oldValue
    expect(watcher.value).toBe(3);    
    expect(spy).toHaveBeenCalledWith(3, 2);
    vm.b = { c: 4 }; // swapping the object
    expect(watcher.value).toBe(4);
    expect(spy).toHaveBeenCalledWith(4, 3);
  });


})