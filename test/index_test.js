'use strict'

const assert = require('assert')

describe('AeonPlugin', () => {
  const AeonPlugin = require('../index')

  it('exists', () => {
    assert.equal(typeof AeonPlugin, 'function')
  })

  it('responds to export hook', () => {
    assert.equal(typeof (new AeonPlugin).export, 'function')
  })
})
