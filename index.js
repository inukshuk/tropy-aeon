'use strict'

const fs = require('fs')

class AeonPlugin {
  constructor(options, context) {
    this.options = options
    this.context = context
  }

  encode(string) {
    return this.options.quotes ?
      `"${string == null ? '' : string.replace(/"+/, '""')}"` :
      `${string == null ? '' : string.replace(/,/, '')}`
  }

  async export(data) {
    let path = await this.dialog.save({
      defaultPath: this.options.file
    })

    if (!path) return

    this.logger.info('Exporting items to Aeon Timeline...')
    let ws = fs.createWriteStream

    for (let items of data) {
      for (let item of data['@graph']) {
        try {
          ws.write(`${[
            this.encode(item.title),
            this.encode(item.date),
            this.encode([
              item.photos.map(p => p.path).join('|')
            ])
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

  get logger() {
    return this.context.logger
  }
}

module.exports = AeonPlugin
