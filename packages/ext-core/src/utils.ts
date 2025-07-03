export function debug(...msg: any[]): void {
  if (localStorage.getItem('ext-debug')) {
    console.log.apply(window, msg);
  }
}
