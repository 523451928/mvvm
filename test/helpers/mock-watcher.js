
window.mockWatcher = function () {

  const watcher = {
    name: 'mock-watcher',
    deps: [],
    addDep (dep) {
      this.deps.push(dep);
      dep.addSub(this);
    },
    update: jasmine.createSpy()
  };

  return watcher;
}