import React, { Component, PropTypes, Children } from 'react'
import deepEqual from 'deep-equal'
import invariant from 'invariant'
import cx from 'classnames'

import SwiperLib from './SwiperLib'
import Slide from './Slide'

const BoolOrElementType = PropTypes.oneOfType([
  PropTypes.bool,
  PropTypes.element
])

export default class Swiper extends Component {
  static propTypes = {
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
  _slides = []
  _slideKeys = []

  /**
   * Initialize Swiper instance.
   * @private
   */
  _initSwiper() {
    const {
      swiperOptions, navigation, pagination, scrollBar, onInit
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
    onInit(this._swiper)
  }

  /**
   * Filter non-Slide children.
   * @private
   * @return {Array}
   */
  _getSlideChildren() {
    const { children } = this.props
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
   * Renders `Slide` children, and populates `_slides` with refs.
   * @private
   * @return {Array<Element>}
   */
  _renderSlideChildren() {
    this._slides = []
    return this._getSlideChildren().map((slide, i) => (
      React.cloneElement(slide, {
        ref: node => this._slides[i] = node
      })
    ))
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
    this._initSlideKeys()
  }

  componentWillUnmount() {
    this._swiper.destroy()
  }

  // TODO
  componentWillReceiveProps(nextProps) {

  }

  render() {
    const {
      className, wrapperClassName, pagination, navigation, prevButton,
      nextButton, scrollbar,
    } = this.props

    return (
      <div
        className={cx('swiper-container', className)}
        ref={node => this._container = node}
      >
        <div className={cx('swiper-wrapper', wrapperClassName)}>
          {this._renderSlideChildren()}
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
          naviation,
          'swiper-button-next',
          node => this._nextButton = node,
          nextButton,
        )}

        {this._renderOptional(
          scrollBar,
          'swiper-scrollbar',
          node => this._scrollBar = node,
          typeof scrollbar === 'boolean' ? false : scrollBar,
        )}
      </div>
    )
  }
}
