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

import contractAbiJson from '../contract/amm.abi.json';
import { PRECISION } from './utils';

const parser = new ResultsParser();
const ADDITIONAL_GAS = 4700000;

export async function init() {
	const networkProvider = new ProxyNetworkProvider('https://testnet-gateway.elrond.com');
	const networkConfig = await networkProvider.getNetworkConfig();
	const abiRegistry = AbiRegistry.create(contractAbiJson);
	const abi = new SmartContractAbi(abiRegistry, ['AMM']);

	//console.log(networkConfig.MinGasPrice);
	//console.log(networkConfig.ChainID);

	const contractAddress = new Address(
		// devnet
		//'erd1qqqqqqqqqqqqqpgqmq04sd9355zryhek7lly4a4sspxdwwg453ds53uesn'
		// testnet
		'erd1qqqqqqqqqqqqqpgqgczuv6u6mgdewj4amsm5nnysk3404md253ds92srw6'
	);
	//const contract = new SmartContract({ address: contractAddress });
	const contract = new SmartContract({ address: contractAddress, abi: abi });
	return { contract, networkProvider, networkConfig };
}

export async function getPoolDetail({ contract, networkProvider }) {
	const { firstValue, secondValue, returnCode } = await makeQuery({
		functionName: 'getPoolDetail',
		args: [],
		contract,
		networkProvider
	});

	return {
		fee: firstValue.fieldsByName.get('fee').value.value.toNumber(),
		token1Total: firstValue.fieldsByName.get('token1_total').value.value.toNumber(),
		token2Total: firstValue.fieldsByName.get('token2_total').value.value.toNumber(),
		sharesTotal: firstValue.fieldsByName.get('shares_total').value.value.toNumber()
	};
}

export async function getMyHoldings({ address, contract, networkProvider }) {
	const { firstValue, secondValue, returnCode } = await makeQuery({
		functionName: 'getMyHoldings',
		caller: new Address(address),
		args: [],
		contract,
		networkProvider
	});

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
	return await makeCall({
		functionName: 'faucet',
		gasLimit: networkConfig.MinGasLimit + ADDITIONAL_GAS,
		args: [new BigIntValue(token1Amount), new BigIntValue(token2Amount)],
		contract,
		provider,
		networkProvider,
		networkConfig
	});
}

export async function provide({
	token1Amount,
	token2Amount,
	contract,
	provider,
	networkProvider,
	networkConfig
}) {
	console.log(token1Amount);
	console.log(token2Amount);
	console.log(provider);
	return await makeCall({
		functionName: 'provide',
		gasLimit: networkConfig.MinGasLimit + ADDITIONAL_GAS,
		args: [new BigIntValue(token1Amount), new BigIntValue(token2Amount)],
		contract,
		provider,
		networkProvider,
		networkConfig
	});
}

export async function getWithdrawEstimate({ shareAmount, contract, networkProvider }) {
	const { firstValue, secondValue, returnCode } = await makeQuery({
		functionName: 'getWithdrawEstimate',
		args: [new BigIntValue(shareAmount * PRECISION)],
		contract,
		networkProvider
	});

	return {
		token1Amount: firstValue?.fields[0].value.value.toNumber() || 0,
		token2Amount: firstValue?.fields[1].value.value.toNumber() || 0
	};
}

export async function getToken2ProvideEstimate({ token1Amount, contract, networkProvider }) {
	const { firstValue, secondValue, returnCode } = await makeQuery({
		functionName: 'getToken2ProvideEstimate',
		args: [new BigIntValue(token1Amount)],
		contract,
		networkProvider
	});

	return firstValue?.value.toNumber() || 0;
}

export async function getToken1ProvideEstimate({ token2Amount, contract, networkProvider }) {
	const { firstValue, secondValue, returnCode } = await makeQuery({
		functionName: 'getToken1ProvideEstimate',
		args: [new BigIntValue(token2Amount)],
		contract,
		networkProvider
	});

	return firstValue?.value.toNumber() || 0;
}

export async function getSwapToken1Estimate({ token1Amount, contract, networkProvider }) {
	const { firstValue, secondValue, returnCode } = await makeQuery({
		functionName: 'getSwapToken1Estimate',
		args: [new BigIntValue(token1Amount)],
		contract,
		networkProvider
	});

	return {
		estimatedToken2Amount: firstValue?.fields[0].value.value.toNumber() || 0,
		feeAmount: firstValue?.fields[1].value.value.toNumber() || 0
	};
}

export async function getSwapToken2Estimate({ token2Amount, contract, networkProvider }) {
	const { firstValue, secondValue, returnCode } = await makeQuery({
		functionName: 'getSwapToken2Estimate',
		args: [new BigIntValue(token2Amount)],
		contract,
		networkProvider
	});

	return {
		estimatedToken1Amount: firstValue?.fields[0].value.value.toNumber() || 0,
		feeAmount: firstValue?.fields[1].value.value.toNumber() || 0
	};
}

export async function swapToken1({
	amount,
	minAmount,
	contract,
	provider,
	networkProvider,
	networkConfig
}) {
	return await makeCall({
		functionName: 'swapToken1',
		gasLimit: networkConfig.MinGasLimit + ADDITIONAL_GAS,
		args: [new BigIntValue(amount), new BigIntValue(minAmount)],
		contract,
		provider,
		networkProvider,
		networkConfig
	});
}

export async function swapToken2({
	amount,
	minAmount,
	contract,
	provider,
	networkProvider,
	networkConfig
}) {
	return await makeCall({
		functionName: 'swapToken2',
		gasLimit: networkConfig.MinGasLimit + ADDITIONAL_GAS,
		args: [new BigIntValue(amount), new BigIntValue(minAmount)],
		contract,
		provider,
		networkProvider,
		networkConfig
	});
}

export async function withdraw({
	shareAmount,
	contract,
	provider,
	networkProvider,
	networkConfig
}) {
	return await makeCall({
		functionName: 'withdraw',
		gasLimit: networkConfig.MinGasLimit + ADDITIONAL_GAS,
		args: [new BigIntValue(shareAmount * PRECISION)],
		contract,
		provider,
		networkProvider,
		networkConfig
	});
}

async function makeQuery({ functionName, contract, args, caller, networkProvider }) {
	const query = contract.createQuery({ func: new ContractFunction(functionName), args, caller });
	const endpointDefinition = contract.getEndpoint(functionName);

	const queryResponse = await networkProvider.queryContract(query);
	return parser.parseQueryResponse(queryResponse, endpointDefinition);
}

async function makeCall({
	functionName,
	gasLimit,
	args,
	contract,
	provider,
	networkProvider,
	networkConfig
}) {
	const caller = new Address(provider.account.address);
	const accountOnNetwork = await networkProvider.getAccount(caller);
	const tx = contract.call({
		func: new ContractFunction(functionName),
		chainID: networkConfig.ChainID,
		gasLimit,
		caller,
		args
	});
	tx.setNonce(accountOnNetwork.nonce);
	const signedTx = await provider.signTransaction(tx);
	const hash = await networkProvider.sendTransaction(signedTx);

	return hash;
}
