import { ProxyNetworkProvider } from '@elrondnetwork/erdjs-network-providers';
import { Address, SmartContract, ContractFunction, ResultsParser } from '@elrondnetwork/erdjs';

/** @type {import('./$types').PageLoad} */
export async function load() {
	let networkProvider = new ProxyNetworkProvider('https://devnet-gateway.elrond.com');
	let networkConfig = await networkProvider.getNetworkConfig();
	console.log(networkConfig.MinGasPrice);
	console.log(networkConfig.ChainID);

	let contractAddress = new Address(
		'erd1qqqqqqqqqqqqqpgqmq04sd9355zryhek7lly4a4sspxdwwg453ds53uesn'
	);
	let contract = new SmartContract({ address: contractAddress });

	let query = contract.createQuery({
		func: new ContractFunction('getPoolDetail'),
		args: []
	});

	let parser = new ResultsParser();

	let queryResponse = await networkProvider.queryContract(query);
	let bundle = parser.parseUntypedQueryResponse(queryResponse);
	console.log(bundle.returnCode);
	console.log(bundle.returnMessage);
	console.log(bundle.values);

	return {
		title: 'Hello world!',
		content: 'Welcome to our blog. Lorem ipsum dolor sit amet...'
	};
}
