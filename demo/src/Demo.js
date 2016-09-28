import React, { Component } from 'react'
import { Swiper, Slide } from '../../lib'
import '../../lib/styles.css'

import './Demo.css'

export default class Demo extends Component {
  constructor(props, context) {
    super(props, context)
    this.decrement = this.decrement.bind(this)
    this.increment = this.increment.bind(this)
    this.state = {
      slideCount: 5,
    }
  }

  increment() {
    this.setState({ slideCount: this.state.slideCount + 1 })
  }

  decrement() {
    this.setState({ slideCount: this.state.slideCount - 1 })
  }

  render() {
    return (
      <div className="Demo">
        <div className="Demo-swiper">
          <Swiper>
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
      </div>
    )
  }
}
