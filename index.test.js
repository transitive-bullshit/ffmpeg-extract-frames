'use strict'

const { test } = require('ava')
const path = require('path')
const sharp = require('sharp')
const tempy = require('tempy')

const extractFrames = require('.')

const fixturesPath = path.join(__dirname, `media`)
const input = path.join(fixturesPath, '1.mp4')

test('jpg + offsets', async (t) => {
  const folder = tempy.directory()
  const filename = 'test-%i.jpg'

  const filePattern = await extractFrames({
    log: console.log,
    input,
    folder,
    filename,
    offsets: [
      0,
      1200,
      3200
    ]
  })

  for (let i = 1; i <= 3; ++i) {
    const file = filePattern.replace('%i', i)
    const image = await sharp(file).metadata()

    t.deepEqual(image.width, 640)
    t.deepEqual(image.height, 360)
    t.deepEqual(image.channels, 3)
    t.deepEqual(image.format, 'jpeg')
  }
})

test('png + timestamps', async (t) => {
  const folder = tempy.directory()
  const filename = 'test-%i.png'

  const filePattern = await extractFrames({
    log: console.log,
    input,
    folder,
    filename,
    timestamps: [
      '0%',
      '25%',
      '60%',
      '95%'
    ]
  })

  for (let i = 1; i <= 4; ++i) {
    const file = filePattern.replace('%i', i)
    const image = await sharp(file).metadata()

    t.deepEqual(image.width, 640)
    t.deepEqual(image.height, 360)
    t.deepEqual(image.channels, 3)
    t.deepEqual(image.format, 'png')
  }
})
