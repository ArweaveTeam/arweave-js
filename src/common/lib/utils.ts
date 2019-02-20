import * as B64js from "base64-js";

export type Base64UrlString = string;

export function concatBuffers(
  buffers: Uint8Array[] | ArrayBuffer[]
): Uint8Array {
  let total_length = 0;

  for (let i = 0; i < buffers.length; i++) {
    total_length += buffers[i].byteLength;
  }

  let temp = new Uint8Array(total_length);
  let offset = 0;

  temp.set(new Uint8Array(buffers[0]), offset);
  offset += buffers[0].byteLength;

  for (let i = 1; i < buffers.length; i++) {
    temp.set(new Uint8Array(buffers[i]), offset);
    offset += buffers[i].byteLength;
  }

  return temp;
}

export function b64UrlToString(b64UrlString: string): string {
  let buffer = b64UrlToBuffer(b64UrlString);

  // TextEncoder will be available in browsers, but not in node
  if (typeof TextDecoder == "undefined") {
    const TextDecoder = require("util").TextDecoder;
    return new TextDecoder("utf-8", { fatal: true }).decode(buffer);
  }

  return new TextDecoder("utf-8", { fatal: true }).decode(buffer);
}

export function bufferToString(buffer: Uint8Array | ArrayBuffer): string {
  // TextEncoder will be available in browsers, but not in node
  if (typeof TextDecoder == "undefined") {
    const TextDecoder = require("util").TextDecoder;
    return new TextDecoder("utf-8", { fatal: true }).decode(buffer);
  }

  return new TextDecoder("utf-8", { fatal: true }).decode(buffer);
}

export function stringToBuffer(string: string): Uint8Array {
  // TextEncoder will be available in browsers, but not in node
  if (typeof TextEncoder == "undefined") {
    const TextEncoder = require("util").TextEncoder;
    return new TextEncoder().encode(string);
  }
  return new TextEncoder().encode(string);
}

export function stringToB64Url(string: string): string {
  return bufferTob64Url(stringToBuffer(string));
}

export function b64UrlToBuffer(b64UrlString: string): Uint8Array {
  return new Uint8Array(B64js.toByteArray(b64UrlDecode(b64UrlString)));
}

export function bufferTob64(buffer: any): string {
  return B64js.fromByteArray(new Uint8Array(buffer));
}

export function bufferTob64Url(buffer: any): string {
  return b64UrlEncode(bufferTob64(buffer));
}

export function b64UrlEncode(b64UrlString: string): string {
  return b64UrlString
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/\=/g, "");
}

export function b64UrlDecode(b64UrlString: string): string {
  b64UrlString = b64UrlString.replace(/\-/g, "+").replace(/\_/g, "/");
  let padding;
  b64UrlString.length % 4 == 0
    ? (padding = 0)
    : (padding = 4 - (b64UrlString.length % 4));
  return b64UrlString.concat("=".repeat(padding));
}
