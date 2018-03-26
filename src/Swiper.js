import React, { Component, Children, cloneElement } from 'react'
import { createPortal } from 'react-dom'
import PropTypes from 'prop-types'
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
    loop: PropTypes.bool,
    onInitSwiper: PropTypes.func
  }, EventPropTypes)

  static defaultProps = {
    swiperOptions: {},
    navigation: true,
    pagination: true,
    scrollBar: false,
    loop: false,
    onInitSwiper: () => {}
  }

  _swiper = null
  _nextButton = null
  _prevButton = null
  _pagination = null
  _scrollBar = null
  _container = null
  _slidesCount = 0
  _activeIndex = 0

  /**
   * Keep a reference of the `_swiper` in state so we can re-render when
   * it changes.
   */
  state = {
    swiper: null,
    duplicates: []
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
      paginationType,
      scrollBar,
      scrollBarHide,
      onInitSwiper,
      loop
    } = this.props
    const opts = {}

    if (pagination) {
      opts.pagination = opts.pagination || {}
      Object.assign(opts.pagination, {
        el: this._pagination
      })
    }
    if (scrollBar) {
      opts.scrollbar = opts.scrollbar || {}
      Object.assign(opts.scrollbar, {
        el: this._scrollBar,
        hide: scrollBarHide
      })
    }
    if (navigation) {
      opts.navigation = opts.navigation || {}
      Object.assign(opts.navigation, {
        prevEl: this._prevButton,
        nextEl: this._nextButton
      })
    }
    if (loop) {
      opts.loop = true
    } else {
      if (opts.loop) {
        throw new Error(
          `react-dynamic-swiper: Do not use "loop" on the "swiperOptions", ` +
          `use the "loop" prop on the Swiper component directly.`
        )
      }
    }

    this._swiper = new SwiperLib(
      this._container,
      Object.assign(opts, swiperOptions)
    )

    this._swiper.on('slideChange', () => {
      this._activeIndex = this._swiper.activeIndex
      const activeSlide = this._getSlideChildren()[this._swiper.activeIndex]
      if (activeSlide && activeSlide.props.onActive) {
        activeSlide.props.onActive(this._swiper)
      }
    })

    if (this._activeIndex) {
      const index = Math.min(this._activeIndex, this._getSlideChildren().length - 1)
      this._swiper.slideTo(index, 0, false)
    }

    this._delegateSwiperEvents()
    this._createDuplicates()
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
      prevProps.scrollBar !== this.props.scrollBar ||
      prevProps.loop !== this.props.loop
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

  _reInit() {
    this._swiper.destroy(true, true)
    // debugger
    this._initSwiper()
  }

  _renderDuplicates () {
    const slides = this._getSlideChildren()
    return this.state.duplicates.map(portal => (
      createPortal(cloneElement(slides[portal.index], {
        isPortaled: true
      }), portal.container)
    ))
  }

  _createDuplicates () {
    if (this.props.loop) {
      // @see: https://github.com/nolimits4web/swiper/blob/master/src/components/core/loop/loopCreate.js
      const {slideDuplicateClass} = this._swiper.params

      const duplicates = [].slice.call(
        this._container.querySelectorAll(`.${slideDuplicateClass}`)
      ).map(dupe => {
        console.log(dupe.innerHTML)
        // NOTE: When iDangerous-Swiper creates the duplicates it deeply clones
        // the nodes. Thus, before rendering the portals we must clear the
        // content. Dirty, but I do not see another possible way.
        dupe.innerHTML = ''


        return {
          container: dupe,
          // @see: https://github.com/nolimits4web/swiper/blob/master/src/components/core/loop/loopCreate.js#L37
          index: parseInt(dupe.getAttribute('data-swiper-slide-index'), 10)
        }
      })

      this.setState({ duplicates })
    }
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
    const oldSlidesCount = this._slidesCount

    this._slidesCount = nextSlidesCount

    if (shouldReInitialize) {
      // NOTE: When in loop mode, the slide indexes are actually different. The
      // 0th index is actually the first duplicate, thus it is essentially like
      // a 1-based index mode (the old 0th is the 1st, so on and so forth). Thus,
      // to account for this upon re-initialization, increment the current 
      // `_activeIndex` if going into a loop mode, and decrement if going out
      // of a loop mode.
      if (prevProps.loop !== this.props.loop) {
        this._activeIndex += this.props.loop ? 1 : -1
      }
      return this._reInit()
    }
    
    if (nextSlidesCount !== oldSlidesCount) {
      // NOTE: `swiper.update()` doesn't seem to work when updating slides in
      // loop mode. If so, is this a bug in iDangerous Swiper, or is this our
      // only option?
      if (this.props.loop) {
        return this._reInit()
      }

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

          {this._renderDuplicates()}
        </div>
      </div>
    )
  }
}
