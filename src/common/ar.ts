import { BigNumber } from "bignumber.js";

export default class Ar {
  /**
   * Method to take a string value and return a bignumber object.
   *
   * @protected
   * @type {Function}
   * @memberof Arweave
   */
  protected readonly BigNum: Function;

  constructor() {
    // Configure and assign the constructor function for the bignumber library.
    this.BigNum = (value: string, decimals: number): BigNumber => {
      let instance = BigNumber.clone({ DECIMAL_PLACES: decimals });
      return new instance(value);
    };
  }

  public winstonToAr(
    winstonString: string,
    { formatted = false, decimals = 12, trim = true } = {}
  ) {
    let number = this.stringToBigNum(winstonString, decimals).shiftedBy(-12);

    return formatted ? number.toFormat(decimals) : number.toFixed(decimals);
  }

  public arToWinston(arString: string, { formatted = false } = {}) {
    let number = this.stringToBigNum(arString).shiftedBy(12);

    return formatted ? number.toFormat() : number.toFixed(0);
  }

  public compare(winstonStringA: string, winstonStringB: string): number {
    let a = this.stringToBigNum(winstonStringA);
    let b = this.stringToBigNum(winstonStringB);

    return a.comparedTo(b);
  }

  public isEqual(winstonStringA: string, winstonStringB: string): boolean {
    return this.compare(winstonStringA, winstonStringB) === 0;
  }

  public isLessThan(winstonStringA: string, winstonStringB: string): boolean {
    let a = this.stringToBigNum(winstonStringA);
    let b = this.stringToBigNum(winstonStringB);

    return a.isLessThan(b);
  }

  public isGreaterThan(
    winstonStringA: string,
    winstonStringB: string
  ): boolean {
    let a = this.stringToBigNum(winstonStringA);
    let b = this.stringToBigNum(winstonStringB);

    return a.isGreaterThan(b);
  }

  public add(winstonStringA: string, winstonStringB: string): string {
    let a = this.stringToBigNum(winstonStringA);
    let b = this.stringToBigNum(winstonStringB);

    return a.plus(winstonStringB).toFixed(0);
  }

  public sub(winstonStringA: string, winstonStringB: string): string {
    let a = this.stringToBigNum(winstonStringA);
    let b = this.stringToBigNum(winstonStringB);
    return a.minus(winstonStringB).toFixed(0);
  }

  private stringToBigNum(
    stringValue: string,
    decimalPlaces: number = 12
  ): BigNumber {
    return this.BigNum(stringValue, decimalPlaces);
  }
}
