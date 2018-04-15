import React from 'react'
import enzyme, { mount, shallow } from 'enzyme'
import { expect } from 'chai'
import Adapter from 'enzyme-adapter-react-16'

import Slide from '../../src/Slide'

enzyme.configure({ adapter: new Adapter() })

describe('<Slide/>', function() {
  it('renders <div/> with className "swiper-slide"', () => {
    const wrapper = shallow(<Slide/>)
    const div = wrapper.find('div')
    expect(div).to.have.length(1)
    expect(div.hasClass('swiper-slide')).to.equal(true)
  })
})
