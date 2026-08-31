import Transaction, { Tag } from "./transaction";
import { SignatureOptions } from "./crypto/crypto-interface";

/**
 * Permissions used by injected browser wallets (ArConnect, Wander, Arweave.app).
 * arweave-js only requests ACCESS_ADDRESS and SIGN_TRANSACTION.
 */
export type WalletPermission =
  | "ACCESS_ADDRESS"
  | "ACCESS_PUBLIC_KEY"
  | "ACCESS_ALL_ADDRESSES"
  | "SIGN_TRANSACTION"
  | "ENCRYPT"
  | "DECRYPT"
  | "SIGNATURE"
  | "ACCESS_ARWEAVE_CONFIG"
  | "DISPATCH"
  | "ACCESS_TOKENS";

/** Fields copied from a wallet `sign()` result onto the local Transaction. */
export interface ExternalWalletSignedTransaction {
  id: string;
  owner: string;
  reward?: string;
  tags?: Tag[];
  signature: string;
}

/**
 * Minimum API an injected `window.arweaveWallet` must provide for
 * `jwk: "use_wallet"` address lookup and transaction signing.
 */
export interface ExternalWallet {
  connect(permissions: WalletPermission[]): Promise<void>;
  getPermissions(): Promise<WalletPermission[]>;
  getActiveAddress(): Promise<string>;
  sign(
    transaction: Transaction,
    options?: SignatureOptions
  ): Promise<ExternalWalletSignedTransaction>;
}

declare global {
  interface Window {
    arweaveWallet: ExternalWallet;
  }
  var arweaveWallet: ExternalWallet;
}
