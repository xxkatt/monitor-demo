import type { Transport } from '../transport'

export class Errors {
  constructor(private transport: Transport) {}

  init() {
    window.addEventListener('error', (event) => {
      const error = event.error
      const payload = {
        type: error.type,
        message: error.message,
        stack: error.stack,
        path: window.location.pathname,
      }
      this.transport.send(payload)
    })

    window.addEventListener('unhandledrejection', (event) => {
      const error = event.reason
      const payload = {
        type: 'unhandledrejection',
        message: error.message,
        stack: error.stack,
        path: window.location.pathname,
      }
      this.transport.send(payload)
    })
  }
}
