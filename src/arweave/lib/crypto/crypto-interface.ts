
export class Crypto{

    private static subtle: SubtleCrypto = crypto.subtle;

    private driver: SubtleCrypto;

    private config: object;

    constructor(driver?: SubtleCrypto, config?: object){
        console.log('creating crypto');
        this.driver = driver || Crypto.subtle;
        this.config = config || {
            keys: {
                subtle: {
                    name: 'RSA-PSS',
                    modulusLength: 4096,
                    publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
                    hash: {
                        name: 'SHA-256',
                    }
                }
            }
        };
    }

    
    /**
     * Generate a new CryptoKey private key using an Arweave
     * compliant configuration.
     * 
     * @return {Promise<CryptoKey>}
     */
    async key(){
        // let cryptokey = await this.driver
        //     .generateKey(
        //         this.config.keys.subtle,
        //         true,
        //         ['sign']
        //     );

        // return cryptokey.privateKey;
    }

    // /**
    //  * Convert a JWK object into a CryptoKey to use with subtle functions.
    //  * 
    //  * @param {Object} jwk - JWK object
    //  */
    // async jwkToCryptoKey(jwk){
    //     return this.driver.importKey(
    //         'jwk',
    //         jwk,
    //         this.config.keys.subtle,
    //         false,
    //         ['sign']
    //     );
    // }

}
