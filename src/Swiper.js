import React, { Component, PropTypes, Children } from 'react'
import deepEqual from 'deep-equal'
import cx from 'classnames'
import omit from 'lodash.omit'

import SwiperLib from './SwiperLib'
import Slide from './Slide'
import { events, EventPropTypes } from './swiperEvents'

const FuncElementType = PropTypes.oneOfType([
  PropTypes.func,
  PropTypes.element
])
const BoolOrFuncElementType = PropTypes.oneOfType([
  PropTypes.bool,
  FuncElementType
])

export default class Swiper extends Component {
  static propTypes = Object.assign({
    containerClassName: PropTypes.string,
    wrapperClassName: PropTypes.string,
    swiperOptions: PropTypes.object,
    navigation: PropTypes.bool,
    prevButton: FuncElementType,
    nextButton: FuncElementType,
    pagination: BoolOrFuncElementType,
    scrollBar: BoolOrFuncElementType,
    onInitSwiper: PropTypes.func
  }, EventPropTypes)

  static defaultProps = {
    swiperOptions: {},
    navigation: true,
    pagination: true,
    scrollBar: false,
    onInitSwiper: () => {}
  }

  _swiper = null
  _nextButton = null
  _prevButton = null
  _pagination = null
  _scrollBar = null
  _container = null
  _slidesCount = 0

  /**
   * Keep a reference of the `_swiper` in state so we can re-render when
   * it changes.
   */
  state = {
    swiper: null
  }

  /**
   * Initialize Swiper instance.
   * @private
   */
  _initSwiper () {
    const {
      swiperOptions,
      navigation,
      pagination,
      scrollBar,
      onInitSwiper
    } = this.props
    const opts = {}
    const activeIndex = this._swiper ? this._swiper.activeIndex : 0

    if (pagination) opts.pagination = this._pagination
    if (scrollBar) opts.scrollbar = this._scrollBar
    if (navigation) {
      opts.prevButton = this._prevButton
      opts.nextButton = this._nextButton
    }

    this._swiper = new SwiperLib(
      this._container,
      Object.assign(opts, swiperOptions)
    )

    if (activeIndex) {
      const index = Math.min(activeIndex, this._getSlideChildren().length - 1)
      this._swiper.slideTo(index, 0, false)
    }

    this._swiper.on('onSlideChangeEnd', () => {
      const activeSlide = this._getSlideChildren()[this._swiper.activeIndex]
      if (activeSlide && activeSlide.props.onActive) {
        activeSlide.props.onActive(this._swiper)
      }
    })

    this._delegateSwiperEvents()
    this.setState({ swiper: this._swiper })
    onInitSwiper(this._swiper)
  }

  /**
   * Delegates all swiper events to event handlers passed in props.
   * @private
   */
  _delegateSwiperEvents () {
    events.forEach(event => {
      this._swiper.on(event, function () {
        if (this.props[event] && typeof this.props[event] === 'function') {
          this.props[event].apply(null, arguments)
        }
      }.bind(this))
    })
  }

  /**
   * Filter out non-Slide children.
   * @private
   * @param {?Array<Element>} Children Child elements, if omitted uses own children.
   * @return {Array}
   */
  _getSlideChildren (children) {
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
   * @param  {Element|Function}  node      Optional element. If `node` is a
   *                                       function, `swiper` instance will be
   *                                       passed as an argument.
   * @return {Element}
   */
  _renderOptional (predicate, className, refFn, node) {
    if (!predicate) return null
    if (node) {
      const _node = typeof node === 'function'
        ? node(this.state.swiper)
        : node
      return React.cloneElement(_node, { ref: refFn })
    }
    return <div className={className} ref={refFn} />
  }

  /**
   * Determines whether `swiper` should be re-initialized, or not, based on
   * `prevProps`.
   * @private
   * @param  {Object} prevProps Previous props.
   * @return {Boolean}
   */
  _shouldReInitialize (prevProps) {
    return !deepEqual(prevProps.swiperOptions, this.props.swiperOptions) ||
      prevProps.navigation !== this.props.navigation ||
      prevProps.nextButton !== this.props.nextButton ||
      prevProps.prevButton !== this.props.prevButton ||
      prevProps.pagination !== this.props.pagination ||
      prevProps.scrollBar !== this.props.scrollBar
  }

  /**
   * Get props
   * @param {Object} props Props to filter
   * @return {Object}
   */
  _getNormProps (props) {
    return omit(props, events.concat([
      'containerClassName',
      'wrapperClassName',
      'swiperOptions',
      'navigation',
      'prevButton',
      'nextButton',
      'pagination',
      'scrollBar',
      'onInitSwiper'
    ]))
  }

  /**
   * Access internal Swiper instance.
   * @return {Swiper}
   */
  swiper () {
    return this._swiper
  }

  componentDidMount () {
    this._initSwiper()
    this._slidesCount = this._getSlideChildren().length
  }

  componentWillUnmount () {
    this._swiper.destroy()
  }

  componentDidUpdate (prevProps) {
    const shouldReInitialize = this._shouldReInitialize(prevProps)
    const nextSlidesCount = this._getSlideChildren().length

    if (shouldReInitialize) {
      this._slidesCount = nextSlidesCount
      this._swiper.destroy(true, true)
      return this._initSwiper()
    }

    if (nextSlidesCount !== this._slidesCount) {
      const index = Math.min(this._swiper.activeIndex, nextSlidesCount - 1)
      this._swiper.update()
      this._slidesCount = nextSlidesCount
      this._swiper.slideTo(index, 0, false)
    }
  }

  render () {
    const {
      pagination,
      navigation,
      prevButton,
      nextButton,
      scrollBar,
      wrapperClassName,
      containerClassName,
      ...rest
    } = this.props

    return (
      <div {...this._getNormProps(rest)}>
        <div
          className={cx('swiper-container', containerClassName)}
          ref={node => { this._container = node }}
        >
          <div className={cx('swiper-wrapper', wrapperClassName)}>
            {this._getSlideChildren()}
          </div>

          {this._renderOptional(
            pagination,
            'swiper-pagination',
            node => { this._pagination = node },
            typeof pagination === 'boolean' ? false : pagination
          )}

          {this._renderOptional(
            navigation,
            'swiper-button-prev',
            node => { this._prevButton = node },
            prevButton
          )}

          {this._renderOptional(
            navigation,
            'swiper-button-next',
            node => { this._nextButton = node },
            nextButton
          )}

          {this._renderOptional(
            scrollBar,
            'swiper-scrollbar',
            node => { this._scrollBar = node },
            typeof scrollBar === 'boolean' ? false : scrollBar
          )}
        </div>
      </div>
    )
  }
}
