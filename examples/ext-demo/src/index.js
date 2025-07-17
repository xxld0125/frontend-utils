import HelloWorld from './HelloWorld'

async function extFn(data, timeout = 1000) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(data);
    }, timeout);
  })
}

export default {
  HelloWorld,
  extFn
};
