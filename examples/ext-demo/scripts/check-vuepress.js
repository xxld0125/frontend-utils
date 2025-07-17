const exec = require('child_process').exec;

exec('vuepress -v', (err) => {
  if (err) {
    console.log('\u001b[31m启动 dev 失败：\r\n\r\n请先执行 `yarn global add vuepress` 或者 `npm install -g vuepress` 全局安装vuepress.\u001b[39m\r\n');
    process.exit(-1)
  }
})
