export declare class ArweaveUtils {
    static concatBuffers(buffers: Uint8Array[] | ArrayBuffer[]): Uint8Array;
    static b64UrlToString(b64UrlString: string): string;
    static bufferToString(buffer: Uint8Array | ArrayBuffer): string;
    static stringToBuffer(string: string): Uint8Array;
    static stringToB64Url(string: string): string;
    static b64UrlToBuffer(b64UrlString: string): Uint8Array;
    static bufferTob64(buffer: any): string;
    static bufferTob64Url(buffer: any): string;
    static b64UrlEncode(b64UrlString: string): string;
    static b64UrlDecode(b64UrlString: string): string;
}
