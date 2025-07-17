import { version } from '../package.json';
import Sandbox from './sandbox';
import { rawWindow } from './utils';

// 全局变量
const globalKeyToBeCached =
  'window,self,globalThis,Array,Object,String,Boolean,Math,Number,Symbol,Date,Promise,Function,Proxy,WeakMap,WeakSet,Set,Map,Reflect,Element,Node,Document,RegExp,Error,TypeError,JSON,isNaN,parseFloat,parseInt,performance,console,decodeURI,encodeURI,decodeURIComponent,encodeURIComponent,location,navigator,undefined';

// 绑定 window 代理
function bindScope(code: string): string {
  return `;(function(proxyWindow){with(proxyWindow.__EXT_MICRO_APP_WINDOW__){(function(${globalKeyToBeCached}){;

/********** 实际代码 ***************/
${code}
/********* 实际代码结束 ***************/

}).call(proxyWindow,${globalKeyToBeCached})}})(this.__EXT_MICRO_APP_PROXY_WINDOW__);`;
}

// 通过 new Function 的方式执行
function runCode2Function(code: string): void {
  const code2Function = new Function(code);
  code2Function.call(window);
}

// 执行脚本
export async function runScript(url: string, code: string) {
  const sandbox = new Sandbox();
  (rawWindow as any).__EXT_MICRO_APP_PROXY_WINDOW__ = sandbox.proxyWindow;
  code = bindScope(code);
  try {
    runCode2Function(code);
  } catch (e: any) {
    console.error(
      `[@yunke/load-script ${version}]: 代码执行报错。localStorage.setItem('ext-debug', true) 更加详细的查看错误堆栈。`
    );
    throw new Error(
      `[@yunke/load-script ${version}]: 代码执行报错，JS 链接为 ${url}，具体原因为 ${e.name} ${e.message}`
    );
  }
  if (!sandbox.injectedKeys.size) return;

  return [...sandbox.injectedKeys].reduce(
    (acc, key) => {
      acc[key] = sandbox.microAppWindow[key];
      return acc;
    },
    {} as Record<PropertyKey, any>
  );
}

// 获取 umd 对象
export async function runUmdScript(url: string, code: string) {
  const obj = await runScript(url, code);
  console.error('===runUmdScript', obj);
  if (!obj) return undefined;

  const keys = Object.keys(obj);
  if (keys.length === 0) return undefined;
  return obj[keys[keys.length - 1] as keyof typeof obj];
}
