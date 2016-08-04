import React, { Component, PropTypes, Children } from 'react'
import deepEqual from 'deep-equal'
import cx from 'classnames'

import SwiperLib from './SwiperLib'
import Slide from './Slide'

const BoolOrElementType = PropTypes.oneOfType([
  PropTypes.bool,
  PropTypes.element
])

export default class Swiper extends Component {
  static propTypes = {
    wrapperClassName: PropTypes.string,
    swiperOptions: PropTypes.object,
    navigation: PropTypes.bool,
    prevButton: PropTypes.element,
    nextButton: PropTypes.element,
    pagination: BoolOrElementType,
    scrollBar: BoolOrElementType,
    onInit: PropTypes.func,
  }

  static defaultProps = {
    swiperOptions: {},
    navigation: true,
    pagination: true,
    scrollBar: false,
    onInit: () => {},
  }

  _swiper = null
  _nextButton = null
  _prevButton = null
  _pagination = null
  _scrollBar = null
  _container = null
  _slidesCount = 0

  /**
   * Initialize Swiper instance.
   * @private
   */
  _initSwiper() {
    const {
      swiperOptions, navigation, pagination, scrollBar, onInit,
    } = this.props
    const opts = {}

    if (pagination) opts.pagination = this._pagination
    if (scrollBar) opts.scrollbar = this._scrollbar
    if (navigation) {
      opts.prevButton = this._prevButton
      opts.nextButton = this._nextButton
    }

    this._swiper = new SwiperLib(
      this._container,
      Object.assign(opts, swiperOptions)
    )

    this._swiper.on('slideChangeEnd', () => {
      const activeSlide = this._getSlideChildren()[this._swiper.activeIndex]
      if (activeSlide && activeSlide.props.onActive) {
          activeSlide.props.onActive(this._swiper)
      }
    })
    onInit(this._swiper)
  }

  /**
   * Filter out non-Slide children.
   * @private
   * @param {?Array<Element>} Children Child elements, if omitted uses own children.
   * @return {Array}
   */
  _getSlideChildren(children) {
    children = children || this.props.children
    return Children.toArray(children)
      .filter(child => child.type === Slide)
  }

  /**
   * Render an optional element. If predicate is false returns `null`, if true
   * renders a cloned `node` (if truthy), or a `div` with the given `className`.
   * @private
   * @param  {Boolean}  predicate Should render?
   * @param  {String}   className Classname for `div`
   * @param  {Function} refFn     Function for `ref` of cloned `node` or `div`
   * @param  {Element}  node      Optional element.
   * @return {Element}
   */
  _renderOptional(predicate, className, refFn, node) {
    if (!predicate) return null
    if (node) return React.cloneElement(node, { ref: refFn })
    return <div className={className} ref={refFn}/>
  }

  /**
   * Determines whether `swiper` should be re-initialized, or not, based on
   * `prevProps`.
   * @private
   * @param  {Object} prevProps Previous props.
   * @return {Boolean}
   */
  _shouldReInitialize(prevProps) {
    return !deepEqual(prevProps.swiperOptions, this.props.swiperOptions) ||
      prevProps.navigation !== this.props.navigation ||
      prevProps.nextButton !== this.props.nextButton ||
      prevProps.prevButton !== this.props.prevButton ||
      prevProps.pagintion !== this.props.pagination ||
      prevProps.scrollBar !== this.props.scrollbar
  }

  /**
   * Access internal Swiper instance.
   * @return {Swiper}
   */
  swiper() {
    return this._swiper
  }

  componentDidMount() {
    this._initSwiper()
    this._slidesCount = this._getSlideChildren().length
  }

  componentWillUnmount() {
    this._swiper.destroy()
  }

  componentDidUpdate(prevProps) {
    const shouldReInitialize = this._shouldReInitialize(prevProps)
    const nextSlidesCount = this._getSlideChildren().length

    if (shouldReInitialize) {
      this._slidesCount = nextSlidesCount
      this._swiper.destroy(true, true)
      return this._initSwiper()
    }

    if (nextSlidesCount !== this._slidesCount) {
      this.swiper().update()
      this._slidesCount = nextSlidesCount
    }
  }

  render() {
    const {
      className, wrapperClassName, pagination, navigation, prevButton,
      nextButton, scrollBar,
    } = this.props

    return (
      <div
        className={cx('swiper-container', className)}
        ref={node => this._container = node}
      >
        <div className={cx('swiper-wrapper', wrapperClassName)}>
          {this._getSlideChildren()}
        </div>

        {this._renderOptional(
          pagination,
          'swiper-pagination',
          node => this._pagination = node,
          typeof pagination === 'boolean' ? false : pagination,
        )}

        {this._renderOptional(
          navigation,
          'swiper-button-prev',
          node => this._prevButton = node,
          prevButton,
        )}

        {this._renderOptional(
          navigation,
          'swiper-button-next',
          node => this._nextButton = node,
          nextButton,
        )}

        {this._renderOptional(
          scrollBar,
          'swiper-scrollbar',
          node => this._scrollBar = node,
          typeof scrollBar === 'boolean' ? false : scrollBar,
        )}
      </div>
    )
  }
}
