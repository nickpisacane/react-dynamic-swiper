import React from 'react'
import enzyme, { mount, shallow } from 'enzyme'
import { expect } from 'chai'
import Adapter from 'enzyme-adapter-react-16'

import { Swiper, Slide } from '../../src'
import { events } from '../../src/swiperEvents'

import createSpy from './spy'

enzyme.configure({ adapter: new Adapter() })

const wait = time => new Promise(resolve => setTimeout(resolve, time))

describe('SwiperEvents', () => {
  it('all', () => {
    const target = document.createElement('div')
    document.body.appendChild(target)

    const spies = events.reduce((props, event) => {
      props[event] = createSpy()
      return props
    }, {})

    class Container extends React.Component {
      state = { items: [1, 2, 3] }

      swiper() {
        return this.swiperComponent.swiper()
      }

      render() {
        return (
          <Swiper
            ref={node => this.swiperComponent = node}
            {...spies}
          >
            {this.state.items.map(item => <Slide key={item} />)}
          </Swiper>
        )
      }
    }

    const wrapper = mount(<Container />, { attachTo: target })

    wrapper.instance().swiper().slideNext()
    expect(spies.fromEdge.called).to.equal(true)
    expect(spies.progress.called).to.equal(true)
    expect(spies.transitionStart.called).to.equal(true)
    expect(spies.setTransition.called).to.equal(true)
    expect(spies.setTranslate.called).to.equal(true)
    expect(spies.slideChangeTransitionStart.called).to.equal(true)
    expect(spies.slideNextTransitionStart.called).to.equal(true)
    expect(spies.slideChange.called).to.equal(true)

    wrapper.instance().swiper().slidePrev()
    expect(spies.slideChange.callCount).to.equal(2)
    expect(spies.slidePrevTransitionStart.called).to.equal(true)
    expect(spies.reachBeginning.called).to.equal(true)

    wrapper.instance().swiper().slideTo(2)
    expect(spies.reachEnd.called).to.equal(true)
  })
});
