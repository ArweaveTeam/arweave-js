const B64js = require('base64-js');

export class Utils {

    /**
     * 
     */
    public static b64UrlToString(b64UrlString: string){

        let buffer = Utils.b64UrlToBuffer(b64UrlString);

        if (process.env) {
            return new (require('util').TextDecoder)('utf-8', {fatal: true}).decode(buffer);
        }

        return new TextDecoder('utf-8', {fatal: true}).decode(buffer);
    }

    public static b64UrlToBuffer(b64UrlString: string){
        return B64js.toByteArray(Utils.b64UrlDecode(b64UrlString));
    }
    
    /**
     * @param {string}
     * 
     * @return {string}
     */
    private static b64UrlEncode(b64UrlString: string) {
        return b64UrlString.replace(/\+/g, "-").replace(/\//g, "_").replace(/\=/g, "");
    }

    /**
     * @param {string}
     * 
     * @return {string}
     */
    private static b64UrlDecode(b64UrlString: string) {
        b64UrlString = b64UrlString.replace(/\-/g, "+").replace(/\_/g, "/");
        let padding;
        b64UrlString.length % 4 == 0 ? padding = 0 : padding = 4 - (b64UrlString.length % 4);
        return b64UrlString.concat("=".repeat(padding));
    }

}