import React from 'react'
import { mount, shallow } from 'enzyme'
import { expect } from 'chai'

import Slide from '../../src/Slide'

describe('<Slide/>', function() {
  it('renders <div/> with className "swiper-slide"', () => {
    const wrapper = shallow(<Slide/>)
    const div = wrapper.find('div')
    expect(div).to.have.length(1)
    expect(div.hasClass('swiper-slide')).to.equal(true)
  })
})
