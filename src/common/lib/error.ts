import { AxiosResponse } from "axios";

export const enum ArweaveErrorType {
  TX_PENDING = "TX_PENDING",
  TX_NOT_FOUND = "TX_NOT_FOUND",
  TX_FAILED = "TX_FAILED",
  TX_INVALID = "TX_INVALID",
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

type AxiosResponseLite = {
  status: number;
  statusText?: string;
  data: { error: string } | any;
};

// Safely get error string
// from an axios response, falling back to
// resp.data, statusText or 'unknown'.
// Note: a wrongly set content-type can
// cause what is a json response to be interepted
// as a string or Buffer, so we handle that too.

export function getError(resp: AxiosResponseLite) {
  let data = resp.data;

  if (typeof resp.data === "string") {
    try {
      data = JSON.parse(resp.data);
    } catch (e) {}
  }

  if (resp.data instanceof ArrayBuffer || resp.data instanceof Uint8Array) {
    try {
      data = JSON.parse(data.toString());
    } catch (e) {}
  }

  return data ? data.error || data : resp.statusText || "unknown";
}
