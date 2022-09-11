import { getPoolDetail } from '../contract';

/** @type {import('./$types').PageLoad} */
export async function load({ parent }) {
	const { contractData } = await parent();

	return getPoolDetail(contractData);
}
