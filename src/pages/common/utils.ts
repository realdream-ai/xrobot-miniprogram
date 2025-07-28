
export class TimeoutError extends Error {
  name = 'TimeoutError'
}

export function waitTimeout<T = any>(timeout: number) {
  return new Promise<T>((_, reject) => {
    setTimeout(() => reject(new TimeoutError('timeout')), timeout)
  })
}
