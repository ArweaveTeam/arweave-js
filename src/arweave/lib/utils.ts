const B64js = require('base64-js');
const TextEncoder = require('util').TextEncoder;
export class ArweaveUtils {

    public static concatBuffers(buffers: Uint8Array[]): any {
        let total_length = 0;

        for(let i = 0; i < buffers.length; i++) {
            total_length += buffers[i].byteLength;
        }

        let temp = new Uint8Array(total_length);
        let offset = 0;

        temp.set(new Uint8Array(buffers[0]), offset);
        offset += buffers[0].byteLength;

        for(let i = 1; i < buffers.length; i++) {
            temp.set(new Uint8Array(buffers[i]), offset);
            offset += buffers[i].byteLength;
        }

        return temp;
    }

    /**
     * 
     */
    public static b64UrlToString(b64UrlString: string): string{

        let buffer = ArweaveUtils.b64UrlToBuffer(b64UrlString);

        return new TextDecoder('utf-8', {fatal: true}).decode(buffer);
    }

    public static stringToBuffer(string: string): any{

        return new TextEncoder().encode(string);
    }


    public static b64UrlToBuffer(b64UrlString: string): any{
        return B64js.toByteArray(ArweaveUtils.b64UrlDecode(b64UrlString));
    }


    /**
     * @param {ArrayBuffer}
     * 
     * @return {String}
     */
    public static bufferTob64(buffer: any): string {
        return B64js.fromByteArray(new Uint8Array(buffer));
    }
    
    /**
     * @param {string}
     * 
     * @return {string}
     */
    private static b64UrlEncode(b64UrlString: string): string {
        return b64UrlString.replace(/\+/g, "-").replace(/\//g, "_").replace(/\=/g, "");
    }

    /**
     * @param {string}
     * 
     * @return {string}
     */
    private static b64UrlDecode(b64UrlString: string): string {
        b64UrlString = b64UrlString.replace(/\-/g, "+").replace(/\_/g, "/");
        let padding;
        b64UrlString.length % 4 == 0 ? padding = 0 : padding = 4 - (b64UrlString.length % 4);
        return b64UrlString.concat("=".repeat(padding));
    }

}