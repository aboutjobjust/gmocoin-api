import { HttpHeader, ArrowedHttpMethod } from './types';

export const toSha256 = async (key: string, value: string): Promise<string> => {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(key);
  const valueData = encoder.encode(value);

  // Import the key for use with HMAC
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: { name: 'SHA-256' } },
    false,
    ['sign']
  );

  // Generate HMAC
  const signature = await crypto.subtle.sign('HMAC', cryptoKey, valueData);

  // Convert the ArrayBuffer to a hexadecimal string
  return Array.from(new Uint8Array(signature))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
};

export const makeAuthHeader = async (
  apiKey: string,
  secretKey: string,
  method: ArrowedHttpMethod,
  path: string,
  params?: {},
  body?: {},
): Promise<HttpHeader> => {
  const timestamp = Date.now().toString();
  const bodyAsString = body ? JSON.stringify(body) : '';
  const text = `${timestamp}${method}${path}${bodyAsString}`;
  const signature = await toSha256(secretKey, text);

  return {
    'API-KEY': apiKey,
    'API-TIMESTAMP': timestamp,
    'API-SIGN': signature,
  };
};
