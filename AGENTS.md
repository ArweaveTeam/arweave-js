# arweave-js

## Rules

- Don't break the public API. Keep changes backwards compatible wherever possible. If a break can't be avoided, say so up front and keep the old form working alongside the new one where you can.
- Support only the current Node.js LTS lines. Don't add workarounds or polyfills for versions past end-of-life. Keep `engines` in `package.json` and the CI matrix in `.github/workflows/test.yaml` in step with each other.
- Don't open a PR to `master` from a branch whose tests are failing.
- Fail loudly. Bad input throws; never return silently corrupted data.
- Keep protocol output byte-compatible. Transaction serialization, signing, deep hashing (`src/common/lib/deepHash.ts`) and chunking (`src/common/lib/merkle.ts`) must produce exactly the bytes the Arweave node expects. A single changed byte makes transactions invalid or changes their IDs, so check any change here against known fixtures.
- No floats for money. Winston and AR amounts stay as strings or `BigNumber`, never JS `number`.
- Keep runtime dependencies to a minimum. There are two today: `asn1.js` and `bignumber.js`. Prefer platform APIs such as WebCrypto and `fetch`. A new runtime dependency needs a stated reason and must load as native ESM in a browser without a bundler.
- No hand-rolled crypto. Use WebCrypto or audited libraries.
