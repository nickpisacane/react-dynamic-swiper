require('babel-register')()

const jsdom = require('jsdom').jsdom
const enzyme = require('enzyme')
const Adapter = require('enzyme-adapter-react-16')


// DOM Stuff
const exposedProperties = ['window', 'navigator', 'document']

global.document = jsdom('');
global.window = document.defaultView;
Object.keys(document.defaultView).forEach((property) => {
  if (typeof global[property] === 'undefined') {
    exposedProperties.push(property)
    global[property] = document.defaultView[property]
  }
})

global.navigator = {
  userAgent: 'node.js'
}

// Enzyme Stuff
enzyme.configure({ adapter: new Adapter() })