export function fakePromise(time: number) {
  return new Promise((res) =>
    setTimeout(() => {
      res('')
    }, time),
  )
}
