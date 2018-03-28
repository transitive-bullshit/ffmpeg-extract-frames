'use strict'

const ffmpeg = require('fluent-ffmpeg')
const path = require('path')
const noop = () => { }

module.exports = (opts) => {
  const {
    log = noop,
    input,
    timestamps,
    offsets,
    folder,
    filename
  } = opts

  if (!timestamps && !offsets) {
    throw new Error('missing required screenshot timestamps or offsets')
  }

  const framePattern = path.join(folder, filename)

  return new Promise((resolve, reject) => {
    ffmpeg(input)
      .on('start', (cmd) => log({ cmd }))
      .on('end', () => resolve(framePattern))
      .on('error', (err) => reject(err))
      .screenshots({
        folder,
        filename,
        timestamps: timestamps || offsets.map((offset) => offset / 1000)
      })
  })
}
