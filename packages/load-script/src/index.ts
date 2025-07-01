import { version } from '../package.json';
import { getRemoteString } from './fetch';
import { runUmdScript } from './scripts';

const scriptsCache: Record<string, any> = {};

export async function loadScript(url: string) {
  if (!url) {
    throw new Error(`[@frontendUtils/load-script ${version}]: url is empty`);
  };

  const request = async () => {
    const code = await getRemoteString(url);
    const res = await runUmdScript(url, code);
    return res;
  };

  if (scriptsCache[url]) {
    return scriptsCache[url];
  }

  return (scriptsCache[url] = request());
}

export { getRemoteString, postData, getData } from './fetch';
