# ffmpeg-extract-frames

> Extracts screenshots from a video using [fluent-ffmpeg](https://github.com/fluent-ffmpeg/node-fluent-ffmpeg).

[![NPM](https://img.shields.io/npm/v/ffmpeg-extract-frames.svg)](https://www.npmjs.com/package/ffmpeg-extract-frames) [![Build Status](https://travis-ci.org/transitive-bullshit/ffmpeg-extract-frames.svg?branch=master)](https://travis-ci.org/transitive-bullshit/ffmpeg-extract-frames) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save ffmpeg-extract-frames
# or
yarn add ffmpeg-extract-frames
```

## Usage

```js
const extractFrames = require('ffmpeg-extract-frames')

// extract 3 frames at 1s, 2s, and 3.5s respectively
const filePattern = await extractFrames({
  input: 'media/1.mp4',
  folder: '.',
  filename: 'screenshot-%i.jpg',
  offsets: [
    1000,
    2000,
    3500
  ]
})

// filePattern = './screenshot-%i.jpg'
// generated screenshots:
// `./screenshot-1.jpg
// `./screenshot-2.jpg
// `./screenshot-3.jpg
```

## API

### extractFrames(options)

Extracts one or more frames from a video file. Returns a `Promise` for the full path pattern of the output screenshots.

#### options

##### input

Type: `String`

Path or URL to a video file.

##### folder

Type: `String`

Output directory.

##### filename

Type: `String`

Output file pattern including a `%i` 

##### offsets

Type: `Array<Number>`

Array of seek offset to take the screenshot from in milliseconds.

Note: you must pass either `offsets` or `timestamps`, with `timestamps` taking precedence.

##### timestamps

Type: `Array<Number|String>`

Same as fluent-ffmpeg's [screenshots.timestamps](https://github.com/fluent-ffmpeg/node-fluent-ffmpeg#screenshotsoptions-dirname-generate-thumbnails).

Note: you must pass either `offsets` or `timestamps`, with `timestamps` taking precedence.

##### log

Type: `Function`
Default: `noop`

Optional function to log the underlying ffmpeg command (like `console.log`).

## Related

- [ffmpeg-extract-frame](https://github.com/transitive-bullshit/ffmpeg-extract-frame) extracts a single frame from a video.
- [fluent-ffmpeg](https://github.com/fluent-ffmpeg/node-fluent-ffmpeg)

## License

MIT © [Travis Fischer](https://github.com/transitive-bullshit)
