import React, { Component } from 'react'
import { Swiper, Slide } from '../../lib'
import '../../lib/styles.css'

import './Demo.css'

const OPTION_KEYS = ['navigation', 'pagination', 'scrollBar']

export default class Demo extends Component {
  constructor() {
    super()

    this.decrement = this.decrement.bind(this)
    this.increment = this.increment.bind(this)
    this.state = {
      slideCount: 5,
      options: {
        navigation: true,
        pagination: true,
        scrollBar: false,
      }
    }
  }

  increment(e) {
    e.preventDefault()
    this.setState({ slideCount: this.state.slideCount + 1 })
  }

  decrement(e) {
    e.preventDefault()
    this.setState({ slideCount: this.state.slideCount - 1 })
  }

  toggleOption(prop) {
    this.setState({
      options: Object.assign({}, this.state.options, {
        [prop]: !this.state.options[prop],
      }),
    })
  }

  render() {
    return (
      <div className="Demo">
        <div className="Demo-swiper">
          <Swiper
            swiperOptions={{scrollbarHide: false, loop: true, loopedSlides: 0}}
            {...this.state.options}
          >
            {(new Array(this.state.slideCount).fill(null).map((_, i) => (
              <Slide className="Demo-swiper__slide" key={i}>
                Slide {i + 1}
              </Slide>
            )))}
          </Swiper>
        </div>
        <div className="Demo-info">
          Add and remove slides
        </div>
        <div className="Demo-controls">
          <span className="Demo-controls__control" onClick={this.decrement}>
            -
          </span>
          <span className="Demo-controls__control" onClick={this.increment}>
            +
          </span>
        </div>
        <div className="Demo-options">
          <div className="Demo-info">Toggle Options</div>
          {OPTION_KEYS.map(opt => (
            <div className="Demo-options__checkbox" key={opt}>
              <input
                id={opt}
                type="checkbox"
                checked={this.state.options[opt]}
                onChange={this.toggleOption.bind(this, opt)}
              />
              <label htmlFor={opt}>{opt}</label>

            </div>
          ))}
        </div>
      </div>
    )
  }
}
