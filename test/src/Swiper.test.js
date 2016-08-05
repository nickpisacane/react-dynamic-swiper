import React from 'react'
import { mount, shallow } from 'enzyme'
import { expect } from 'chai'
import sinon from 'sinon'

import { Swiper, Slide } from '../../src'
import { events } from '../../src/swiperEvents'

describe('<Swiper/>', function() {
  it('renders <div/> with class "swiper-container"', () => {
    const wrapper = shallow(<Swiper/>)
    expect(wrapper.find('div').first().hasClass('swiper-container'))
      .to.equal(true)
  })

  it('renders <div/> with class "swiper-wrapper" in container', () => {
    const wrapper = shallow(<Swiper/>)
    const $swiperWrapper = wrapper.find('div.swiper-wrapper')
    expect($swiperWrapper).to.have.length(1)
    expect($swiperWrapper.parent().hasClass('swiper-container'))
      .to.equal(true)
  })

  it('renders wrapper with class "swiper-wrapper" and wrapperClassName', () => {
    const wrapper = shallow(<Swiper wrapperClassName="foo"/>)
    const $swiperWrapper = wrapper.find('div.swiper-wrapper')
    expect($swiperWrapper.hasClass('foo')).to.equal(true)
  })

  it('only renders <Slide/> children in wrapper', () => {
    const wrapper = shallow(
      <Swiper>
        <Slide testProp="foo"/>
        <Slide testProp="foo"/>
        <div/>
      </Swiper>
    )

    const $swiperWrapper = wrapper.find('.swiper-wrapper')
    expect($swiperWrapper.children()).to.have.length(2)
    $swiperWrapper.children().forEach(slide => {
      expect(slide.prop('testProp')).to.equal('foo')
    })
  })

  it('renders pagination by default', () => {
    const wrapper = shallow(<Swiper/>)
    expect(wrapper.find('.swiper-pagination')).to.have.length(1)
  })

  it('doesn\'t render pagination when prop is false', () => {
    const wrapper = shallow(<Swiper pagination={false}/>)
    expect(wrapper.find('.swiper-pagination')).to.have.length(0)
  })

  it('renders custom pagination element', () => {
    const wrapper = shallow(<Swiper pagination={<div className="foo"/>}/>)
    expect(wrapper.find('.swiper-pagination')).to.have.length(0)
    expect(wrapper.find('.foo')).to.have.length(1)
  })

  it('renders navigation buttons by default', () => {
    const wrapper = shallow(<Swiper/>)
    '.swiper-button-prev .swiper-button-next'.split(' ').forEach(selector => {
      expect(wrapper.find(selector)).to.have.length(1)
    })
  })

  it('doesn\'t render navigation buttons when navigation is false', () => {
    const wrapper = shallow(<Swiper navigation={false}/>)
    '.swiper-button-prev .swiper-button-next'.split(' ').forEach(selector => {
      expect(wrapper.find(selector)).to.have.length(0)
    })
  })

  it('renders custom navigation buttons', () => {
    const wrapper = shallow(
      <Swiper
        prevButton={<div className="prev"/>}
        nextButton={<div className="next"/>}
        navigation={true}
      />
    )

    '.swiper-button-prev:.prev .swiper-button-next:.next'.split(' ')
      .map(s => s.split(':'))
      .forEach(([nope, yep]) => {
        expect(wrapper.find(nope)).to.have.length(0)
        expect(wrapper.find(yep)).to.have.length(1)
      })
  })

  it('doesn\'t render scrollBar by default', () => {
    const wrapper = shallow(<Swiper/>)
    expect(wrapper.find('.swiper-scrollbar')).to.have.length(0)
  })

  it('renders scrollBar when prop scrollBar is true', () => {
    const wrapper = shallow(<Swiper scrollBar={true}/>)
    expect(wrapper.find('.swiper-scrollbar')).to.have.length(1)
  })

  it('renders custom scrollBar element', () => {
    const wrapper = shallow(<Swiper scrollBar={<div className="foo"/>}/>)
    expect(wrapper.find('.swiper-scrollbar')).to.have.length(0)
    expect(wrapper.find('.foo')).to.have.length(1)
  })

  it('passes swiper options to swiper instance', () => {
    const wrapper = mount(<Swiper swiperOptions={{slidesPerView: 42}}/>)
    expect(wrapper.instance().swiper().params.slidesPerView).to.equal(42)
  })

  it('calls `onInitSwiper` on mount, and re-initialization', () => {
    const onInitSwiper = sinon.spy()
    const wrapper = mount(<Swiper onInitSwiper={onInitSwiper}/>)
    expect(onInitSwiper.called).to.equal(true)
    expect(onInitSwiper.calledWith(wrapper.instance().swiper())).to.equal(true)

    wrapper.setProps({
      swiperOptions: {
        slidesPerView: 'auto'
      }
    })

    expect(onInitSwiper.callCount).to.equal(2)
  })

  itReInitializes({
    propName: 'swiperOptions',
    props: { swiperOptions: {slidesPerView: 1} },
    nextProps: { swiperOptions: {slidesPerView: 42} },
    before: wrapper => {
      expect(wrapper.instance().swiper().params.slidesPerView).to.equal(1)
    },
    after: wrapper => {
      expect(wrapper.instance().swiper().params.slidesPerView).to.equal(42)
    }
  })

  itReInitializes({
    propName: 'navigation',
    props: { navigation: false },
    nextProps: { navigation: true },
  })

  itReInitializes({
    propName: 'prevButton|nextButton',
    props: { navigation: false },
    nextProps: {
      navigation: true,
      prevButton: <div className="prev"/>,
      nextButton: <div className="next"/>,
    },
    before: wrapper => {
      const swiper = wrapper.instance().swiper()
      expect(swiper.params.nextButton).to.equal(null)
      expect(swiper.params.prevButton).to.equal(null)
    },
    after: wrapper => {
      const swiper = wrapper.instance().swiper()
      expect(swiper.params.prevButton).to.equal(wrapper.instance()._prevButton)
      expect(swiper.params.nextButton).to.equal(wrapper.instance()._nextButton)
    }
  })

  itReInitializes({
    propName: 'scrollBar',
    props: { scrollBar: true },
    nextProps: { scrollBar: false },
  })

  it('syncs <Slide/> children with swiper instance', () => {
    class Container extends React.Component {
      state = { items: [1, 2, 3] }

      swiper() {
        return this.swiperComponent.swiper()
      }

      render() {
        return (
          <Swiper ref={node => this.swiperComponent = node}>
            {this.state.items.map(item => <Slide key={item} />)}
          </Swiper>
        )
      }
    }

    const wrapper = mount(<Container/>)
    expect(wrapper.instance().swiper().slides).to.have.length(3)

    wrapper.setState({
      items: [1, 2, 3, 4, 5, 6]
    })

    expect(wrapper.instance().swiper().slides).to.have.length(6)
  })

  it('invokes <Slide/> childrens onActive if provided', () => {
    const spy = sinon.spy()
    const wrapper = mount(
      <Swiper>
        <Slide onActive={spy} />
      </Swiper>
    )

    wrapper.instance().swiper().emit('onSlideChangeEnd')
    expect(spy.called).to.equal(true)
  })

  it('invokes swiper event handlers passed in props', () => {
    const handlers = events.reduce((obj, event) => {
      obj[event] = sinon.spy()
      return obj
    }, {})

    const wrapper = mount(<Swiper {...handlers}/>)
    const swiper = wrapper.instance().swiper()
    events.forEach(event => swiper.emit(event))

    events.forEach(event => {
      expect(handlers[event].called).to.equal(true)
    })
  })
})

function itReInitializes(options = {}) {
  options = Object.assign({
    props: {},
    nextProps: {},
    before: () => {},
    after: () => {},
  }, options)

  it(`re-initializes swiper when ${options.propName} changes`, () => {
    const onInitSwiper = sinon.spy()
    const wrapper = mount(<Swiper {...options.props} onInitSwiper={onInitSwiper}/>)
    options.before(wrapper)
    wrapper.setProps(options.nextProps)
    expect(onInitSwiper.callCount).to.equal(2)
    options.after(wrapper)
  })
}
