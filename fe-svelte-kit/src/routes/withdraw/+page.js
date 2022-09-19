/** @type {import('./$types').PageLoad} */
export async function load({ parent }) {
	const { contractData } = await parent();

	return { contractData };
}
