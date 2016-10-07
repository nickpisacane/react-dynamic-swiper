# react-dynamic-swiper
[![Travis][travis-image]][travis-url]

React wrapper for [iDangerous-Swiper][idangerous-swiper] that auto-magically
reinitializes and updates when configuration changes.

**[Demo](https://nickpisacane.github.io/react-dynamic-swiper)**

# Installation
```sh
$ npm i --save react-dynamic-swiper
```

# Usage
```js
// Basic Usage
function MySwiper() {
  return (
    <Swiper
      swiperOptions={{
        slidesPerView: 42,
      }}
      navigation={false}
      pagination={false}
    >
      <Slide onActive={swiper => console.log('Slide Active!')}/>
    </Swiper>
  )
}

// Advanced Usage
//
// Swiper will automatically update swiper instance when children change (i.e. Slides),
// and/or re-initialize if swiper options change. Also, event handlers
// (`onTouchMove`, `onSlideChangeEnd`, etc.) are delegated. Changing them will
// require no reinitialization, while still functioning as expected.
import React, { Component } from 'react'
import { Swiper, Slide } from 'react-dynamic-swiper'
import 'react-dynamic-swiper/lib/styles.css'

class MySwiper extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      slides: []
    }
  }

  componentWillMount() {
    getAsyncSlideData()
      .then(slides => this.setState({ slides }))
  }

  render() {
    const { slides } = this.state

    return (
      <Swiper
        swiperOptions={{
          slidesPerView: 'auto',
        }}
        nextButton={<MyNextButton/>}
        prevButton={<MyPrevButton/>}
        onTouchMove={(swiper, event) => doSomething()}
      >
        {slides.map(slide => (
          <Slide {...slide}/>
        ))}
      </Swiper>
    )
  }
}
```

# API

##  Swiper

#### Props
* swiperOptions (Object) Options passed to swiper instance.
* wrapperClassName (String) Classname for underlying wrapper element.
* navigation (Boolean) Display navigation elements (`true`)
* nextButton (Element) Navigation next element (`<div className="swiper-button-next" />`)
* nextButton (Element) Navigation previous element (`<div className="swiper-button-prev" />`)
* pagination (Boolean|Element) Pagination is active by default, use `false` to hide. (`<div className="swiper-pagination" />`)
* scrollBar (Boolean|Element) Scrollbar is hidden by default, use `false` to show.
* onInitSwiper (Function) Function invoked every time swiper instance is initialized, invoked will `swiper` as first argument.
* All event handlers are supported as well (i.e. onTouchMove, etc.)
#### Methods
* swiper() Returns underlying swiper instance.

## Slide
#### Props
* onActive (Function) Invoked with swiper instance when `Slide` is active. Not invoked on initialization.

[idangerous-swiper]: http://idangero.us/swiper
[travis-image]: https://travis-ci.org/nickpisacane/react-dynamic-swiper.svg?branch=master
[travis-url]: https://travis-ci.org/nickpisacane/react-dynamic-swiper
