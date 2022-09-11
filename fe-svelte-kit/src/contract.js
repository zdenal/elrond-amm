import { ProxyNetworkProvider } from '@elrondnetwork/erdjs-network-providers';
import {
	Address,
	SmartContractAbi,
	AbiRegistry,
	SmartContract,
	ContractFunction,
	ResultsParser
} from '@elrondnetwork/erdjs';

import contractAbiJson from '../contract/crowdfunding.abi.json';

const parser = new ResultsParser();

export async function init() {
	const networkProvider = new ProxyNetworkProvider('https://devnet-gateway.elrond.com');
	const networkConfig = await networkProvider.getNetworkConfig();
	const abiRegistry = AbiRegistry.create(contractAbiJson);
	const abi = new SmartContractAbi(abiRegistry, ['AMM']);

	//console.log(networkConfig.MinGasPrice);
	//console.log(networkConfig.ChainID);

	const contractAddress = new Address(
		'erd1qqqqqqqqqqqqqpgqmq04sd9355zryhek7lly4a4sspxdwwg453ds53uesn'
	);
	//const contract = new SmartContract({ address: contractAddress });
	const contract = new SmartContract({ address: contractAddress, abi: abi });
	return { contract, networkProvider, networkConfig };
}

export async function getPoolDetail({ contract, networkProvider }) {
	const functionName = 'getPoolDetail';
	const query = contract.createQuery({
		func: new ContractFunction(functionName),
		args: []
	});

	const endpointDefinition = contract.getEndpoint(functionName);

	const queryResponse = await networkProvider.queryContract(query);
	const { firstValue, secondValue, returnCode } = parser.parseQueryResponse(
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

export async function getMyHoldings({ address, contract, networkProvider }) {
	const functionName = 'getMyHoldings';
	const query = contract.createQuery({
		func: new ContractFunction(functionName),
		caller: new Address(address),
		args: []
	});
	const endpointDefinition = contract.getEndpoint(functionName);

	const queryResponse = await networkProvider.queryContract(query);
	const { firstValue, secondValue, returnCode } = parser.parseQueryResponse(
		queryResponse,
		endpointDefinition
	);

	return {
		token1Amount: firstValue.fieldsByName.get('token1_amount').value.value.toNumber(),
		token2Amount: firstValue.fieldsByName.get('token2_amount').value.value.toNumber(),
		sharesAmount: firstValue.fieldsByName.get('shares_amount').value.value.toNumber()
	};
}

export async function faucet({ token1Amount, token2Amount, address, contract, networkProvider }) {
	const functionName = 'faucet';
	const query = contract.createQuery({
		func: new ContractFunction(functionName),
		caller: new Address(address),
		args: [token1Amount, token2Amount]
	});
	const endpointDefinition = contract.getEndpoint(functionName);

	const queryResponse = await networkProvider.queryContract(query);
	const { firstValue, secondValue, returnCode } = parser.parseQueryResponse(
		queryResponse,
		endpointDefinition
	);

	return ReturnCode;
}
