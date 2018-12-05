export declare class Ar {
    /**
     * Method to take a string value and return a bignumber object.
     *
     * @protected
     * @type {Function}
     * @memberof Arweave
     */
    protected readonly BigNum: Function;
    constructor();
    winstonToAr(winstonString: string, { formatted, decimals, trim }?: {
        formatted?: boolean;
        decimals?: number;
        trim?: boolean;
    }): string;
    arToWinston(arString: string, { formatted }?: {
        formatted?: boolean;
    }): string;
    compare(winstonStringA: string, winstonStringB: string): number;
    isEqual(winstonStringA: string, winstonStringB: string): boolean;
    isLessThan(winstonStringA: string, winstonStringB: string): boolean;
    isGreaterThan(winstonStringA: string, winstonStringB: string): boolean;
    private stringToBigNum;
}
