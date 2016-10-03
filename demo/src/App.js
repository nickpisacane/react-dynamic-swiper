import React, { Component } from 'react'
import Highlight from 'react-highlight'
import Stargazers from './Stargazers'
import Demo from './Demo'
import './App.css'
import code from './code'

export default class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h1 className="App-header__title">React Dynamic Swiper</h1>
          <Stargazers/>
        </div>
        <Demo />
        <div className="App-example">
          <Highlight className="javascript">
            {code}
          </Highlight>
        </div>
      </div>
    )
  }
}
