<script>
	import { form, field } from 'svelte-forms';
	import { required, min } from 'svelte-forms/validators';
	import { debounce } from 'lodash';

	import { getWithdrawEstimate } from '../../contract';
	import { Title, ActionButton, AmountInput, Table, Row } from '../../components';
	import { provider, contractData } from '../../stores';
	import { myHoldings } from '../../store/myHoldings';
	import { toDecimal } from '../../utils';

	export let data;

	const shareAmount = field('shareAmount', 0, [required(), min(1)]);
	const myForm = form(shareAmount);

	let estimatedToken1Amount = '...';
	let estimatedToken2Amount = '...';

	function handleWithdraw() {}
	async function getEstimation() {
		const estimate = await getWithdrawEstimate({
			shareAmount: $shareAmount.value,
			...data.contractData
		});

		estimatedToken1Amount = estimate.token1Amount;
		estimatedToken2Amount = estimate.token2Amount;
	}
	const handleTyping = debounce(getEstimation, 500);
</script>

<div class="flex flex-col space-y-8">
	<div>
		<Title>Withdraw</Title>
	</div>
	<div>
		<AmountInput
			bind:value={$shareAmount.value}
			label="Amount of Shares"
			onTyping={handleTyping}
			currencyName="Balance: {$myHoldings ? toDecimal($myHoldings.sharesAmount) : '...'}"
		/>
	</div>
	<div class="flex flex-col items-center">
		<ActionButton
			label="Withdraw"
			actionMethod={handleWithdraw}
			disabled={!$myForm.valid}
			{provider}
		/>
	</div>
	<div>
		<Table>
			<Row title="Amount of Token1">{estimatedToken1Amount}</Row>
			<Row title="Amount of Token2">{estimatedToken2Amount}</Row>
		</Table>
	</div>
</div>
