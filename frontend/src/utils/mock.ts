export const useMocks = import.meta.env.VITE_USE_MOCKS !== 'false'

export function delay<T>(data: T, ms: number): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), ms)
  })
}
