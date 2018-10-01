const isBrowser =
  typeof window === 'object' &&
  typeof document === 'object' &&
  typeof navigator === 'object'

export default (() => {
  if (isBrowser) {
    const _Swiper = require('swiper')
    return typeof _Swiper.default !== 'undefined' ? _Swiper.default : _Swiper
  }
  return function Swiper () {}
})()
