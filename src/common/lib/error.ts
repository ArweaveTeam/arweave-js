export const enum ArweaveErrorType {
  TX_PENDING = "TX_PENDING",
  TX_NOT_FOUND = "TX_NOT_FOUND",
  TX_FAILED = "TX_FAILED",
  TX_INVALID = "TX_INVALID"
}

export default class ArweaveError extends Error {
  public readonly type: ArweaveErrorType;
  public readonly response?: Response;

  constructor(
    type: ArweaveErrorType,
    optional: { message?: string; response?: Response } = {}
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
