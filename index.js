'use strict'

const { createWriteStream } = require('fs')
const { remote } = require('electron')
const { join } = require('path')

class AeonPlugin {
  constructor(options, context) {
    this.options = { ...AeonPlugin.defaults, ...options }
    this.context = context
  }

  encode(string) {
    return this.options.quotes ?
      `"${string == null ? '' : string.replace(/"+/, '""')}"` :
      `${string == null ? '' : string.replace(/,/, '')}`
  }

  async export(data) {
    let path = await this.dialog.save({
      defaultPath: this.defaultPath
    })

    if (!path) return

    this.logger.info('Exporting items to Aeon Timeline...')
    let ws = createWriteStream(path, {
      autoclose: true,
      flags: 'w'
    })

    if (this.options.header) {
      ws.write(`${this.header}\n`)
    }

    for (let items of data) {
      for (let item of items['@graph']) {
        try {
          ws.write(`${[
            this.encode(item.title),
            this.encode(item.date),
            this.encode(item.photo.map(p => p.path).join('|'))
          ].join(',')}\n`)

        } catch (e) {
          this.logger.error(e.message)
        }
      }
    }

    ws.end()
  }

  get dialog() {
    return this.context.require('../dialog')
  }

  get defaultPath() {
    return join(
      remote.app.getPath('home'),
      this.options.file
    )
  }

  get header() {
    return this.options.quotes ?
      '"Title","Start","Links"' :
      'Title,Start,Links'
  }

  get logger() {
    return this.context.logger
  }
}

AeonPlugin.defaults = {
  file: 'tropy-aeon.csv',
  header: false,
  quotes: true
}

module.exports = AeonPlugin
