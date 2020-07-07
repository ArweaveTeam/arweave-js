import Transaction from './transaction';
import * as ArweaveUtils from './utils';
import Api from './api';

// Maximum amount of chunks we will upload in the body.
const MAX_CHUNKS_IN_BODY = 1;

// We assume these errors are intermitment and we can try again after a delay:  
// - not_joined 
// - timeout 
// - data_root_not_found (we may have hit a node that just hasn't seen it yet)
// - exceeds_disk_pool_size_limit
// We also try again after any kind of unexpected network errors

// Errors from /chunk we should never try and continue on.
const FATAL_CHUNK_UPLOAD_ERRORS = ['invalid_json', 'chunk_too_big', 'data_path_too_big', 'offset_too_big', 'data_size_too_big', 'chunk_proof_ratio_not_attractive', 'invalid_proof']

// Amount we will delay on receiving an error response but do want to continue.
const ERROR_DELAY = 1000 * 40;

export interface SerializedUploader {
  chunkIndex: number
  txPosted: boolean
  transaction: any
  lastRequestTimeEnd: number 
  lastResponseStatus: number
  lastResponseError: string
}

// Safely get error from an axios response, 
// falling back to resp.data or 'unknown' 
// if resp.data.error is not available.
const getError = (resp: any) => 
  resp.data ? (resp.data.error || resp.data) : 'unknown'

export class TransactionUploader {

  private chunkIndex: number = 0;
  private txPosted: boolean = false;
  private transaction: Transaction;
  private data: Uint8Array;
  private lastRequestTimeEnd: number = 0;

  public lastResponseStatus: number = 0;
  public lastResponseError: string = ''

  public get isComplete(): boolean {
    return this.chunkIndex === this.transaction.chunks!.chunks.length;
  }

  public get totalChunks(): number {
    return this.transaction.chunks!.chunks.length;
  }

  public get uploadedChunks(): number {
    return this.chunkIndex;
  }

  public get pctComplete(): number {
    return Math.trunc((this.uploadedChunks / this.totalChunks) * 100)
  }

  constructor(private api: Api, transaction: Transaction) {
    if (!transaction.id) {
      throw new Error(`Transaction is not signed`);
    }
    // Make a copy of transaction, zeroing the data so we can serialize.
    this.data = transaction.data;
    this.transaction = new Transaction(Object.assign({}, transaction, { data: new Uint8Array(0) }));
  }

  /**
   * Uploads the next part of the transaction. 
   * On the first call this posts the transaction
   * itself and on any subsequent calls uploads the
   * next chunk until it completes.
   */
  public async uploadChunk(): Promise<void> {

    if (this.isComplete) {
      throw new Error(`Upload is already complete`);
    }

    const delay = this.lastResponseError === '' ? 0 : 
      Math.max(
        (this.lastRequestTimeEnd + ERROR_DELAY) - Date.now(),
        ERROR_DELAY
      );

    if (delay > 0) {
      await new Promise(res => setTimeout(res, delay))
    }

    this.lastResponseError = '';
   
    if (!this.txPosted) {
      await this.postTransaction();
      return;
    }

    // Catch network errors and turn them into objects with status -1 and an error message.
    const resp = await this.api
      .post(`chunk`, this.transaction.getChunk(this.chunkIndex, this.data))
      .catch(e => { 
        console.error(e.message);
        return { status: -1, data: { error: e.message } }
      })
        

    this.lastRequestTimeEnd = Date.now();
    this.lastResponseStatus = resp.status;
    
    if (this.lastResponseStatus == 200) {
      this.chunkIndex++;
    }
    else {
      this.lastResponseError = getError(resp);
      if (FATAL_CHUNK_UPLOAD_ERRORS.includes(this.lastResponseError)) {
        throw new Error(`Fatal error uploading chunk ${this.chunkIndex}: ${this.lastResponseError}`);
      }
    }
  }

  /**
   * Reconstructs an upload from its serialized state and data. 
   * Checks if data matches the expected data_root. 
   * 
   * @param serialized 
   * @param data 
   */
  public static async fromSerialized(api: Api, serialized: SerializedUploader | string, data: Uint8Array) : Promise<TransactionUploader> {
    
    if (typeof serialized === 'string') {
      serialized = JSON.parse(serialized) as SerializedUploader; 
    }
    
    if (!serialized || typeof serialized.chunkIndex !== 'number' || typeof serialized.transaction !== 'object') {
      throw new Error(`Serialized object does not match expected format.`);
    }

    // Everything looks ok, reconstruct the TransactionUpload, 
    // prepare the chunks again and verify the data_root matches
    
    const upload = new TransactionUploader(api, new Transaction(serialized.transaction));

    // Copy the serialized upload information, and data passed in. 
    upload.chunkIndex = serialized.chunkIndex;
    upload.lastRequestTimeEnd = serialized.lastRequestTimeEnd; 
    upload.lastResponseError = serialized.lastResponseError;
    upload.lastResponseStatus = serialized.lastResponseStatus; 
    upload.txPosted = serialized.txPosted;
    upload.data = data;
    
    await upload.transaction.prepareChunks(data);
    
    if (upload.transaction.data_root !== serialized.transaction.data_root) {
      throw new Error(`Data mismatch: Uploader doesn't match provided data.`);
    }
    
    return upload; 
  }

  /**
   * Reconstruct an upload from the tx metadata, ie /tx/<id>. 
   * 
   * @param api 
   * @param id 
   * @param data 
   */
  public static async fromTransactionId(api: Api, id: string): Promise<SerializedUploader> {
    
    const resp = await api.get(`tx/${id}`);
    
    if (resp.status !== 200) {
      throw new Error(`Tx ${id} not found: ${resp.status}`);
    }

    const transaction = resp.data;
    transaction.data = new Uint8Array(0);
    
    const serialized: SerializedUploader = {
      txPosted: true, 
      chunkIndex: 0,
      lastResponseError: '',
      lastRequestTimeEnd: 0,
      lastResponseStatus: 0,
      transaction,
    }

    return serialized;
  }

  public toJSON() {
    return { 
      chunkIndex: this.chunkIndex,
      transaction: this.transaction,
      lastRequestTimeEnd: this.lastRequestTimeEnd,
      lastResponseStatus: this.lastResponseStatus,
      lastResponseError: this.lastResponseError,
      txPosted: this.txPosted
    }
  }

  // POST to /tx
  private async postTransaction(): Promise<void> {
    
    const uploadInBody = this.totalChunks <= MAX_CHUNKS_IN_BODY;
    
    if (uploadInBody) {
      // Post the transaction with data.
      this.transaction.data = this.data;
      const resp = await this.api
        .post(`tx`, this.transaction)
        .catch(e => {
          console.error(e);
          return { status: -1, data: { error: e.message } }
        })

      this.lastRequestTimeEnd = Date.now();
      this.lastResponseStatus = resp.status;
      this.transaction.data = new Uint8Array(0);

      if (resp.status >= 200 && resp.status < 300) {
        // We are complete.
        this.txPosted = true; 
        this.chunkIndex = MAX_CHUNKS_IN_BODY;
        return;
      }
      this.lastResponseError = getError(resp);
      throw new Error(`Unable to upload transaction: ${resp.status}, ${this.lastResponseError}`);
    }

    // Post the transaction with no data.
    const resp = await this.api.post(`tx`, this.transaction);
    this.lastRequestTimeEnd = Date.now();
    this.lastResponseStatus = resp.status;
    if (!(resp.status >= 200 && resp.status < 300)) {
      this.lastResponseError = getError(resp);
      throw new Error(`Unable to upload transaction: ${resp.status}, ${this.lastResponseError}`);
    }
    this.txPosted = true;
  }

  
}
