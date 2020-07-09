# debug-cli

Just some very quick scripts to test things around chunk uploading and downloading. 

For many of these, you'll need a wallet with funds, just store it as an environment var:

```bash
export WALLET_JSON=$(cat path/to/keyfile.json)
``` 

## Upload a file via chunks and print progress.

```bash
./test-chunk-upload.js <file> 
```

## Redo an upload from file and txid ( tx must be mined)

```bash
./test-chunk-resume-id.js <file> <txid>
```

## Resume an upload from a progress.json file

```bash
./test-chunk-resume-js <file> <progress.file.json> 
```

## Download all chunks from a txid

```bash
./test-chunk-dl.js <txid>
```
