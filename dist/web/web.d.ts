import { Arweave } from "./arweave/arweave";
import { ApiConfig } from "./arweave/lib/api";
interface GlobalArweave {
    init(apiConfig: ApiConfig): Arweave;
}
declare global {
    interface Window {
        Arweave: GlobalArweave;
    }
}
export declare function init(apiConfig?: ApiConfig): Arweave;
export {};
