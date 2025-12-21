<script lang="ts">
	import type { BirthdayData } from '$lib/types';
	import { formatDate } from '$lib/utils';

	interface Props {
		data: BirthdayData[];
	}

	let { data }: Props = $props();

	const sortedByRank = $derived([...data].sort((a, b) => a.rank - b.rank));
	const mostCommon = $derived(sortedByRank.slice(0, 10));
	const leastCommon = $derived(sortedByRank.slice(-10).reverse());
</script>

<div class="tables-container">
	<div class="table-wrapper">
		<h3>Most common birthdays</h3>
		<table>
			<thead>
				<tr>
					<th>Rank</th>
					<th>Date</th>
					<th>Avg. births</th>
				</tr>
			</thead>
			<tbody>
				{#each mostCommon as item}
					<tr>
						<td class="rank">{item.rankLabel}</td>
						<td class="date">{formatDate(item.month, item.day)}</td>
						<td class="value">{item.value.toLocaleString()}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>

	<div class="table-wrapper">
		<h3>Least common birthdays</h3>
		<table>
			<thead>
				<tr>
					<th>Rank</th>
					<th>Date</th>
					<th>Avg. births</th>
				</tr>
			</thead>
			<tbody>
				{#each leastCommon as item}
					<tr>
						<td class="rank">{item.rankLabel}</td>
						<td class="date">{formatDate(item.month, item.day)}</td>
						<td class="value">{item.value.toLocaleString()}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>

<style>
	.tables-container {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		gap: 32px;
		margin-bottom: 40px;
	}

	.table-wrapper h3 {
		font-family: 'DM Sans', system-ui, sans-serif;
		font-size: 16px;
		font-weight: 600;
		color: var(--color-text);
		margin: 0 0 12px 0;
	}

	table {
		width: 100%;
		border-collapse: collapse;
		font-size: 14px;
	}

	th {
		text-align: left;
		font-weight: 500;
		color: var(--color-text-muted);
		padding: 8px 12px;
		border-bottom: 1px solid var(--color-border);
	}

	th:last-child {
		text-align: right;
	}

	td {
		padding: 10px 12px;
		border-bottom: 1px solid var(--color-border);
		color: var(--color-text);
	}

	td.rank {
		font-weight: 600;
		color: var(--color-accent);
		width: 60px;
	}

	td.date {
		font-weight: 500;
	}

	td.value {
		text-align: right;
		font-variant-numeric: tabular-nums;
		color: var(--color-text-muted);
	}

	tbody tr:hover {
		background: var(--color-result-bg);
	}
</style>

