const fs = require('fs')
const pkg = require('../package.json')

fs.rmSync('./dist/demo.html')
fs.rmSync('./dist/index.common.js')
fs.rmSync('./dist/index.umd.min.js')

const appendStr = `
(function() {
	if (window) {
		var __pkg = window["${pkg.name}"]
		delete window["${pkg.name}"]
		window["${pkg.name}_${Date.now()}"] = __pkg;
	}
})();
`

fs.appendFileSync('./dist/index.umd.js', appendStr)
