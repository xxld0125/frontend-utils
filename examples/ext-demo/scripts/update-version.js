const fs = require('fs')
const pkg = require('./package.json')

const versionArr = pkg.version.split('.')
versionArr[2] = Number(versionArr[2]) + 1

pkg.version = versionArr.join('.')

fs.writeFileSync('./package.json', JSON.stringify(pkg, null, 2))
