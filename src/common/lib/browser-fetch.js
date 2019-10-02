'use strict'

if (!window.fetch) {
  require('whatwg-fetch')
}

module.exports = window.fetch
