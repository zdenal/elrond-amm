import { ProxyNetworkProvider } from '@elrondnetwork/erdjs-network-providers';
import {
	Address,
	SmartContractAbi,
	AbiRegistry,
	SmartContract,
	ContractFunction,
	ResultsParser
} from '@elrondnetwork/erdjs';

import contractAbiJson from '../../contract/crowdfunding.abi.json';

/** @type {import('./$types').PageLoad} */
export async function load() {
	let networkProvider = new ProxyNetworkProvider('https://devnet-gateway.elrond.com');
	let networkConfig = await networkProvider.getNetworkConfig();
	let abiRegistry = AbiRegistry.create(contractAbiJson);
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

	return {
		fee: firstValue.fieldsByName.get('fee').value.value.toNumber(),
		token1Total: firstValue.fieldsByName.get('token1_total').value.value.toNumber(),
		token2Total: firstValue.fieldsByName.get('token2_total').value.value.toNumber(),
		sharesTotal: firstValue.fieldsByName.get('shares_total').value.value.toNumber()
	};
}
