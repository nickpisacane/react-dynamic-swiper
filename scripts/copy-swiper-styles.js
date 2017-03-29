#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

const PROJECT_ROOT = path.normalize(path.join(__dirname, '..'))
const SWIPER_CSS = path.normalize(
  path.join(PROJECT_ROOT, 'node_modules', 'swiper', 'dist', 'css', 'swiper.css')
)


if (!fs.existsSync(SWIPER_CSS)) {
  console.log('Swiper not intstalled...running npm i ')
  execSync('npm i', {
    cwd: path.normalize(path.join(__dirname, '..'))
  })
}

fs.createReadStream(SWIPER_CSS)
  .pipe(fs.createWriteStream(path.join(PROJECT_ROOT, 'src', 'styles.css')))
  .on('error', err => {
    console.error('Failed to copy styles')
    process.nextTick(() => { throw err })
  })
