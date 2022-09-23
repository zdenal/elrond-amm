import { getPoolDetail } from '../../contract';

/** @type {import('./$types').PageLoad} */
export async function load({ parent }) {
	const { contractData } = await parent();
	const poolDetail = await getPoolDetail(contractData);

	return { contractData, poolDetail };
}
