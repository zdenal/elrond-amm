import { ProxyNetworkProvider } from '@elrondnetwork/erdjs-network-providers';
import {
	Address,
	SmartContractAbi,
	AbiRegistry,
	SmartContract,
	ContractFunction,
	ResultsParser
} from '@elrondnetwork/erdjs';

/** @type {import('./$types').PageLoad} */
export async function load() {
	let networkProvider = new ProxyNetworkProvider('https://devnet-gateway.elrond.com');
	let networkConfig = await networkProvider.getNetworkConfig();
	let abiJson = {
		buildInfo: {
			rustc: {
				version: '1.62.0-nightly',
				commitHash: '7c4b47696907d64eff5621a64eb3c6e795a9ec77',
				commitDate: '2022-04-30',
				channel: 'Nightly',
				short: 'rustc 1.62.0-nightly (7c4b47696 2022-04-30)'
			},
			contractCrate: {
				name: 'crowdfunding',
				version: '0.0.0',
				git_version: 'e0427db-modified'
			},
			framework: {
				name: 'elrond-wasm',
				version: '0.32.0'
			}
		},
		name: 'Adder',
		constructor: {
			inputs: [
				{
					name: 'fee',
					type: 'BigUint'
				}
			],
			outputs: []
		},
		endpoints: [
			{
				name: 'getPoolDetail',
				mutability: 'readonly',
				inputs: [],
				outputs: [
					{
						type: 'PoolDetail'
					}
				]
			},
			{
				name: 'faucet',
				mutability: 'mutable',
				inputs: [
					{
						name: 'token1_amount',
						type: 'BigUint'
					},
					{
						name: 'token2_amount',
						type: 'BigUint'
					}
				],
				outputs: []
			},
			{
				name: 'getMyHoldings',
				mutability: 'readonly',
				inputs: [],
				outputs: [
					{
						type: 'tuple<BigUint,BigUint,BigUint>'
					}
				]
			},
			{
				name: 'provide',
				mutability: 'mutable',
				inputs: [
					{
						name: 'token1_amount',
						type: 'BigUint'
					},
					{
						name: 'token2_amount',
						type: 'BigUint'
					}
				],
				outputs: [
					{
						type: 'BigUint'
					}
				]
			},
			{
				name: 'getWithdrawEstimate',
				mutability: 'readonly',
				inputs: [
					{
						name: 'share',
						type: 'BigUint'
					}
				],
				outputs: [
					{
						type: 'tuple<BigUint,BigUint>'
					}
				]
			},
			{
				name: 'withdraw',
				mutability: 'mutable',
				inputs: [
					{
						name: 'share',
						type: 'BigUint'
					}
				],
				outputs: [
					{
						type: 'tuple<BigUint,BigUint>'
					}
				]
			}
		],
		events: [],
		hasCallback: false,
		types: {
			PoolDetail: {
				type: 'struct',
				fields: [
					{
						name: 'token1_total',
						type: 'BigUint'
					},
					{
						name: 'token2_total',
						type: 'BigUint'
					},
					{
						name: 'shares_total',
						type: 'BigUint'
					},
					{
						name: 'fee',
						type: 'BigUint'
					}
				]
			}
		}
	};

	//let jsonContent = await promises.readFile('../output/crowdfunding.abi.json', {
	//encoding: 'utf8'
	//});
	//let json = JSON.parse(jsonContent);
	let abiRegistry = AbiRegistry.create(abiJson);
	let abi = new SmartContractAbi(abiRegistry, ['AMM']);

	console.log(networkConfig.MinGasPrice);
	console.log(networkConfig.ChainID);

	let contractAddress = new Address(
		'erd1qqqqqqqqqqqqqpgqmq04sd9355zryhek7lly4a4sspxdwwg453ds53uesn'
	);
	//let contract = new SmartContract({ address: contractAddress });
	let contract = new SmartContract({ address: contractAddress, abi: abi });

	let query = contract.createQuery({
		func: new ContractFunction('getPoolDetail'),
		args: []
	});

	let parser = new ResultsParser();
	let endpointDefinition = contract.getEndpoint('getPoolDetail');

	let queryResponse = await networkProvider.queryContract(query);
	let { firstValue, secondValue, returnCode } = parser.parseQueryResponse(
		queryResponse,
		endpointDefinition
	);
	console.log('fee is', firstValue.fieldsByName.get('fee').value.value.toNumber());
	//let bundle = parser.parseUntypedQueryResponse(queryResponse);
	//console.log(bundle.returnCode);
	//console.log(bundle.returnMessage);
	//console.log(bundle.values);

	return {
		title: 'Hello world!',
		content: 'Welcome to our blog. Lorem ipsum dolor sit amet...'
	};
}
