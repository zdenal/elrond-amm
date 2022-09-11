import { ProxyNetworkProvider } from '@elrondnetwork/erdjs-network-providers';
import {
	Address,
	Account,
	SmartContractAbi,
	AbiRegistry,
	SmartContract,
	ContractFunction,
	ResultsParser,
	BigIntValue
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

export async function faucet({
	token1Amount,
	token2Amount,
	contract,
	provider,
	networkProvider,
	networkConfig
}) {
	const functionName = 'faucet';
	const caller = new Address(provider.account.address);
	const accountOnNetwork = await networkProvider.getAccount(caller);
	console.log(accountOnNetwork);
	const tx = contract.call({
		func: new ContractFunction(functionName),
		gasLimit: networkConfig.MinGasLimit + 3000000,
		chainID: networkConfig.ChainID,
		caller: caller,
		args: [new BigIntValue(token1Amount), new BigIntValue(token2Amount)]
	});
	tx.setNonce(accountOnNetwork.nonce);
	const signedTx = await provider.signTransaction(tx);
	const hash = await networkProvider.sendTransaction(signedTx);

	return hash;
}
