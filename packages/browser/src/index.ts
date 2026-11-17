import { Errors } from './tracing/errors'
import { BrowserTransport } from './transport'

export interface MonitorOptions {
  dsn: string
}

let activeErrors: Errors | undefined

export const init = (options: MonitorOptions) => {
  activeErrors?.destroy()
  const errors = new Errors(new BrowserTransport(options.dsn))
  errors.init()
  activeErrors = errors

  return () => {
    errors.destroy()
    if (activeErrors === errors) activeErrors = undefined
  }
}
