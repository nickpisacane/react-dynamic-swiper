import PropTypes from 'prop-types';

export const events = [
  'onInit',
  'onSlideChangeStart',
  'onSlideChangeEnd',
  'onSlideNextStart',
  'onSlideNextEnd',
  'onSlidePrevStart',
  'onSlidePrevEnd',
  'onTransitionStart',
  'onTransitionEnd',
  'onTouchStart',
  'onTouchMove',
  'onTouchMoveOpposite',
  'onSliderMove',
  'onTouchEnd',
  'onClick',
  'onTap',
  'onDoubleTap',
  'onImagesReady',
  'onProgress',
  'onReachBeginning',
  'onReachEnd',
  'onDestroy',
  'onSetTranslate',
  'onSetTransition',
  'onAutoplay',
  'onAutoplayStart',
  'onAutoplayStop',
  'onLazyImageLoad',
  'onLazyImageReady',
  'onPaginationRendered'
]

export const EventPropTypes = events.reduce((obj, event) => {
  obj[event] = PropTypes.func
  return obj
}, {})
