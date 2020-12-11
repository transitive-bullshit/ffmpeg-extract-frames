'use strict'

const ffmpeg = require('fluent-ffmpeg')
const path = require('path')
const probe = require('ffmpeg-probe')

const noop = () => { }

const applyVFList = (cmd, list) => {
  if (!Array.isArray(list) || list.length === 0) {
    return
  }
  cmd.outputOptions([
    '-vf', list.join(',')
  ])
}

module.exports = async (opts) => {
  const {
    log = noop,

    // required
    input,
    output,

    // optional
    timestamps,
    offsets,
    fps,
    numFrames,
    ffmpegPath,
    forceSARRatio,
    startOffset,
    duration,
  } = opts

  if (!input) throw new Error('missing required input')
  if (!output) throw new Error('missing required output')

  const outputPath = path.parse(output)

  if (ffmpegPath) {
    ffmpeg.setFfmpegPath(ffmpegPath)
  }

  const cmd = ffmpeg(input)
    .on('start', (cmd) => log({ cmd }))

  const vfList = []

  if (Boolean(forceSARRatio)) {
    vfList.push('scale=iw*sar:ih')
  }
  
  if (startOffset) {
    cmd.addInputOptions(["-ss", parseInt(startOffset, 10)]);
  }

  if (duration) {
    cmd.addInputOptions(["-t", parseInt(duration, 10)]);
  }

  if (timestamps || offsets) {
    const folder = outputPath.dir
    const filename = outputPath.base

    applyVFList(cmd, vfList)

    return new Promise((resolve, reject) => {
      cmd
        .on('end', () => resolve(output))
        .on('error', (err) => reject(err))
        .screenshots({
          folder,
          filename,
          timestamps: timestamps || offsets.map((offset) => offset / 1000)
        })
    })
  } else {
    if (fps) {
      cmd.outputOptions([
        '-r', Math.max(1, fps | 0)
      ])
    } else if (numFrames) {
      const info = await probe(input)
      let numFramesTotal = parseInt(info.streams[0].nb_frames)
      if (isNaN(numFramesTotal)) {
        numFramesTotal = Math.ceil((info.duration / 1000) * info.fps);
      }
      const nthFrame = (numFramesTotal / numFrames) | 0

      cmd.outputOptions([
        '-vsync', 'vfr',
      ])
      vfList.push(`select=not(mod(n\\,${nthFrame}))`)
    }

    if (outputPath.ext === '.raw') {
      cmd.outputOptions([
        '-pix_fmt', 'rgba'
      ])
    }


    applyVFList(cmd, vfList)

    return new Promise((resolve, reject) => {
      cmd
        .on('end', () => resolve(output))
        .on('error', (err) => reject(err))
        .output(output)
        .run()
    })
  }
}
