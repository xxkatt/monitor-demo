import type { Transport } from '../transport'

function normalizeError(value: unknown) {
  try {
    if (value !== null && typeof value === 'object') {
      const error = value as { name?: unknown; message?: unknown; stack?: unknown }
      return {
        name: typeof error.name === 'string' ? error.name : undefined,
        message:
          typeof error.message === 'string'
            ? error.message
            : (JSON.stringify(value) ?? String(value)),
        stack: typeof error.stack === 'string' ? error.stack : undefined,
      }
    }
    return { message: String(value) }
  } catch {
    return { message: '[Unserializable error]' }
  }
}

export class Errors {
  private initialized = false

  constructor(private transport: Transport) {}

  private async report(data: Record<string, unknown>) {
    try {
      await this.transport.send({
        ...data,
        path: window.location.pathname,
        timestamp: Date.now(),
      })
    } catch {
      // SDK 上报失败不能产生新的全局异常。
    }
  }

  private onError = (event: ErrorEvent) => {
    void this.report({
      type: 'error',
      ...normalizeError(event.error ?? event.message),
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
    })
  }

  private onUnhandledRejection = (event: PromiseRejectionEvent) => {
    void this.report({
      type: 'unhandledrejection',
      ...normalizeError(event.reason),
    })
  }

  init() {
    if (this.initialized || typeof window === 'undefined') return
    window.addEventListener('error', this.onError)
    window.addEventListener('unhandledrejection', this.onUnhandledRejection)
    this.initialized = true
  }

  destroy() {
    if (!this.initialized) return
    window.removeEventListener('error', this.onError)
    window.removeEventListener('unhandledrejection', this.onUnhandledRejection)
    this.initialized = false
  }
}
