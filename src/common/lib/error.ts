import { AxiosResponse } from "axios";

export const enum ArweaveErrorType {
  TX_PENDING = "TX_PENDING",
  TX_NOT_FOUND = "TX_NOT_FOUND",
  TX_FAILED = "TX_FAILED",
  TX_INVALID = "TX_INVALID"
}

export default class ArweaveError extends Error {
  public readonly type: ArweaveErrorType;
  public readonly response?: AxiosResponse;

  constructor(
    type: ArweaveErrorType,
    optional: { message?: string; response?: AxiosResponse } = {}
  ) {
    if (optional.message) {
      super(optional.message);
    } else {
      super();
    }

    this.type = type;
    this.response = optional.response;
  }

  public getType(): ArweaveErrorType {
    return this.type;
  }
}


type AxiosResponseLite = { status: number, statusText?: string, data: { error: string } | any }

// Safely get error string 
// from an axios response, falling back to 
// resp.data, statusText or 'unknown'.
export const getError = (resp: AxiosResponseLite) => 
  resp.data ? 
    (resp.data.error || resp.data) 
    : 
    (resp.statusText || 'unknown' )
