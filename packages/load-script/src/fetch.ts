/// <reference types="./types" />
import xhr from 'xhr';

import { version } from '../package.json';

function getError(
  method: string,
  url: string,
  err: Error | null,
  response: any,
  data?: any,
  headers?: Record<string, string>
): Error {
  let msg = `[@frontendUtils/load-script/fetch ${version}]: ${method} ${url} error，statusCode is: ${response?.statusCode}, body is: ${JSON.stringify(response?.body)}`;

  if (data) {
    msg += `, request data is : ${JSON.stringify(data)}`;
  }

  if (headers) {
    msg += `, headers is: ${JSON.stringify(headers)}`;
  }

  return err ?? new Error(msg);
}

export function getRemoteString(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    xhr.get(url, (err, response, body) => {
      if (err || String(response.statusCode)[0] !== '2') {
        reject(getError('GET', url, err, response));
      } else {
        resolve(body);
      }
    });
  });
}

export function postData<T>(url: string, data: Record<string, any>, headers: Record<string, string>): Promise<T> {
  return new Promise((resolve, reject) => {
    xhr.post(
      {
        method: 'POST',
        body: JSON.stringify(data),
        uri: url,
        headers: {
          'Content-Type': 'application/json',
          ...(headers || {})
        }
      },
      (err, response, body) => {
        if (err || String(response.statusCode)[0] !== '2') {
          reject(getError('POST', url, err, response, data, headers));
        } else {
          try {
            resolve(JSON.parse(body));
          } catch {
            resolve(body as unknown as T);
          }
        }
      }
    );
  });
}

export function getData<T>(url: string, headers: Record<string, string> = {}): Promise<T> {
  return new Promise((resolve, reject) => {
    xhr.get(
      {
        method: 'GET',
        uri: url,
        headers: {
          'Content-Type': 'application/json',
          ...headers
        }
      },
      (err, response, body) => {
        if (err || String(response.statusCode)[0] !== '2') {
          reject(getError('GET', url, err, response));
        } else {
          try {
            resolve(JSON.parse(body));
          } catch {
            resolve(body as unknown as T);
          }
        }
      }
    );
  });
}
