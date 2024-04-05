import { Env } from "@/app/type"


const defaultConfig = {
  env: Env.dev,
}

class CoreInfo {

  private __locaStorageKey = 'coreInfo'
  
  private state: {
    env: Env
  }

  constructor() {
    this.state = defaultConfig
    this.setup()
  }

  public setup() {
    try {
      const localStorageResult = localStorage.getItem(this.__locaStorageKey)
      
      let pageInitState: CoreInfo['state']
      if (!localStorageResult) {
        const state = this.getInitialState()
        this.saveLocal(state)
        pageInitState = state
      } else {
        pageInitState = JSON.parse(localStorageResult)
      }

      this.state = pageInitState
      console.log('[CoreInfo-setup]', this.state, '[' + new Date().toLocaleString() + ']')
    } catch (error) {
      //
    }
  }

  private saveLocal(state: CoreInfo['state']) {
    localStorage.setItem(this.__locaStorageKey, JSON.stringify(state))
  }

  private getInitialState() {
    return defaultConfig
  }

  public getSettingFormInitialValue() {
    const { env } = this.state
  
    return {
      env
    }
  }

  public syncSettingFormValue(value: Partial<CoreInfo['state']>) {
   
    const nextSate = {
      ...this.state,
      ...value
    }

    this.state = nextSate
    this.saveLocal(nextSate)
  }
}

export const coreInfo = new CoreInfo()
