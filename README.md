Inspired by tutorial https://learn.figment.io/tutorials/build-polkadot-amm-using-ink.

# Run FE
In `fe-svelte-kit` directory run:
```
pnpm install
pnpm run dev
```

# Tests

Run test:
NOTE: only my local ... if there is issue with compiling contract (`..unknown command: cargo.`) remove rust from `asdf` as it is in some collision w/ rustup.
```
erdpy contract build
erdpy contract test
```

# Interaction (deploy, querying, ...)
In examples is proxy set to https://devnet-gateway.elrond.com, change it if you want to work
with different chain

## For deploy/upgrade
Run interaction python script w/o `--contract` address arg and chose `1. Deploy`
```
python3 ./interaction/playground.py --pem=./wallet/walletKey.pem --proxy=https://devnet-gateway.elrond.com --contract erd1qqqqqqqqqqqqqpgqmq04sd9355zryhek7lly4a4sspxdwwg453ds53uesn
```

## Once contract is deployed
Once contract is deployed run interaction script w/ contract address you got from deploy step.
The contract is already deployed on address `erd1qqqqqqqqqqqqqpgqmq04sd9355zryhek7lly4a4sspxdwwg453ds53uesn` (devnet) or `erd1qqqqqqqqqqqqqpgqgczuv6u6mgdewj4amsm5nnysk3404md253ds92srw6` (testnet)
```
python3 ./interaction/playground.py --pem=./wallet/walletKey.pem --proxy=https://devnet-gateway.elrond.com --contract CONTRACT_ADDRESS_FROM_DEPLOY_STEP
```

# Docs
- https://docs.rs/elrond-wasm/latest/elrond_wasm/
- https://docs.elrond.com/developers/overview/
- https://docs.elrond.com/sdk-and-tools/erdjs/erdjs/
- https://docs.elrond.com/sdk-and-tools/erdjs/erdjs-cookbook/
- https://medium.com/@henryhienton/how-to-create-a-crypto-wallet-generating-a-pem-file-on-the-elrond-devnet-network-e545ab3a4a11
- https://docs.elrond.com/sdk-and-tools/erdpy/deriving-the-wallet-pem-file/
- https://elrondnetwork.github.io/elrond-sdk-docs/erdjs/latest/modules/typesystem.html
