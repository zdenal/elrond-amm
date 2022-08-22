Inspired by tutorial https://learn.figment.io/tutorials/build-polkadot-amm-using-ink.

# Interaction

## On devnet

Deploy & interact with contract:

```
python3 ./interaction/playground.py --pem=./testnet/wallets/users/alice.pem --proxy=http://localhost:7950
```

Interact with existing contract:

```
python3 ./interaction/playground.py --pem=./testnet/wallets/users/alice.pem --proxy=http://localhost:7950 --contract=erd1...
```

## On testnet

Deploy & interact with contract:

```
python3 ./interaction/playground.py --pem=my.pem --proxy=https://testnet-gateway.elrond.com
```

Interact with existing contract:

```
python3 ./interaction/playground.py --pem=my.pem --proxy=https://testnet-gateway.elrond.com --contract=erd1...
```

# Test

Run test:
```
erdpy contract build
erdpy contract test
```

# Docs
- https://docs.rs/elrond-wasm/latest/elrond_wasm/
- https://docs.elrond.com/developers/overview/
