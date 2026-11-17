export interface Transport {
  send: (data: Record<string, unknown>) => void | Promise<void>
}

export class BrowserTransport implements Transport {
  constructor(private dsn: string) {}
  async send(data: Record<string, unknown>) {
    try {
      const response = await fetch(this.dsn, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
      })
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }
    } catch (error) {
      // 序列化、网络和 HTTP 错误不再进入全局异常采集链路。
      console.error('上报失败:', error)
    }
  }
}
