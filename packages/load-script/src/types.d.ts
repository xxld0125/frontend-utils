declare module 'xhr' {
  interface XhrResponse {
    statusCode: number;
    body?: string;
  }

  type XhrCallback = (error: Error | null, response: XhrResponse, body: string) => void;

  interface XhrOptions {
    method: string;
    uri: string;
    body?: string;
    headers?: Record<string, string>;
  }

  interface Xhr {
    get(url: string, callback: XhrCallback): void;
    get(options: XhrOptions, callback: XhrCallback): void;
    post(options: XhrOptions, callback: XhrCallback): void;
  }

  declare const xhr: Xhr;
  export default xhr;
}
