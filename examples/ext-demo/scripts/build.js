
const pkg = require('../package.json')
const exec = require('child_process').exec;

exec(`vue-cli-service build --target lib --filename index --name ${pkg.name} src/index.js`, function (error, stdout, stderr) {
  if (error) {
    console.error('error: ' + error);
    return;
  }
  console.log('stdout: ' + stdout);
  console.log('stderr: ' + typeof stderr)
})