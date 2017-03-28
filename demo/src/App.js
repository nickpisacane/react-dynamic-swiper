import React, { Component } from 'react'
import Stargazers from './Stargazers'
import Demo from './Demo'
import './App.css'

export default class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h1 className="App-header__title">
            <a
              target="_blank"
              href="https://github.com/nickpisacane/react-dynamic-swiper"
            >
              React Dynamic Swiper
            </a>
          </h1>
          <Stargazers/>
        </div>
        <div className="App-content App-intro">
          <p>
            Fluid React wrapper around the <a href="http://idangero.us/swiper" target="_blank">iDangerous</a> swiper with auto-magical reinitialization.
          </p>
        </div>
        <Demo />
        <div className="App-content App-footer">
          <a
            target="_blank"
            href="https://github.com/nickpisacane/react-dynamic-swiper"
          >
            Github
          </a>
          <a
            target="_blank"
            href="https://github.com/nickpisacane/react-dynamic-swiper/blob/master/demo/src/Demo.js"
          >
            View Demo Source
          </a>
        </div>
      </div>
    )
  }
}
