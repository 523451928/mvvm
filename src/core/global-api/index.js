import config from '../config'
import { set, del } from '../observer/index'

export function initGlobalAPI (MVVM) {
  
  // config
  const configDef = {}
  configDef.get = () => config
  if (process.env.NODE_ENV !== 'production') {
    configDef.set = () => {
      warn(
        'Do not replace the MVVM.config object, set individual fields instead.'
      )
    }
  }
  
  Object.defineProperty(MVVM, 'config', configDef)

}