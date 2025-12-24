<script lang="ts">
	import type { BirthdayData } from '$lib/types';
	import { formatDate } from '$lib/utils';

	interface Props {
		data: BirthdayData[];
		selectedDate?: { month: number; day: number } | null;
		initialFriendDate?: { month: number; day: number } | null;
	}

	let {
		data,
		selectedDate = null,
		initialFriendDate = null
	}: Props = $props();

	const months = [
		{ value: 1, label: 'January', days: 31 },
		{ value: 2, label: 'February', days: 29 },
		{ value: 3, label: 'March', days: 31 },
		{ value: 4, label: 'April', days: 30 },
		{ value: 5, label: 'May', days: 31 },
		{ value: 6, label: 'June', days: 30 },
		{ value: 7, label: 'July', days: 31 },
		{ value: 8, label: 'August', days: 31 },
		{ value: 9, label: 'September', days: 30 },
		{ value: 10, label: 'October', days: 31 },
		{ value: 11, label: 'November', days: 30 },
		{ value: 12, label: 'December', days: 31 },
	];

	// Friend's birthday selection - initialize from URL if present
	let friendMonth = $state(initialFriendDate?.month ?? 0);
	let friendDay = $state(initialFriendDate?.day ?? 0);

	let friendAvailableDays = $derived(
		friendMonth
			? Array.from({ length: months[friendMonth - 1].days }, (_, i) => i + 1)
			: []
	);

	// Data lookups
	let yourData = $derived(
		selectedDate
			? data.find(d => d.month === selectedDate.month && d.day === selectedDate.day)
			: null
	);

	let friendData = $derived(
		friendMonth && friendDay
			? data.find(d => d.month === friendMonth && d.day === friendDay)
			: null
	);

	// Comparison results
	let comparison = $derived(() => {
		if (!yourData || !friendData) return null;

		const rankDiff = friendData.rank - yourData.rank;
		const birthDiff = yourData.value - friendData.value;

		let winner: 'you' | 'friend' | 'tie';
		let message: string;

		if (yourData.rank === friendData.rank) {
			winner = 'tie';
			message = "You share the same birthday rank!";
		} else if (yourData.rank < friendData.rank) {
			winner = 'you';
			message = `Your birthday is more common by ${Math.abs(rankDiff)} rank${Math.abs(rankDiff) === 1 ? '' : 's'}.`;
		} else {
			winner = 'friend';
			message = `Your friend's birthday is more common by ${Math.abs(rankDiff)} rank${Math.abs(rankDiff) === 1 ? '' : 's'}.`;
		}

		return {
			winner,
			message,
			rankDiff: Math.abs(rankDiff),
			birthDiff: Math.abs(birthDiff)
		};
	});

	function handleFriendMonthChange(e: Event) {
		const value = parseInt((e.target as HTMLSelectElement).value);
		friendMonth = value;
		if (friendDay > friendAvailableDays.length) {
			friendDay = 0;
		}
	}

	function handleFriendDayChange(e: Event) {
		friendDay = parseInt((e.target as HTMLSelectElement).value);
	}

	function clearFriend() {
		friendMonth = 0;
		friendDay = 0;
	}

	// Generate share URL
	let shareUrl = $derived(() => {
		if (!selectedDate || !friendMonth || !friendDay) return '';
		return `https://birthdayrank.com/#${selectedDate.month}-${selectedDate.day}&${friendMonth}-${friendDay}`;
	});

	function copyShareUrl() {
		navigator.clipboard.writeText(shareUrl());
	}
</script>

<div class="compare-container">
	<h3>Compare with a friend</h3>
	<p class="compare-description">
		{#if selectedDate}
			See how your birthday stacks up against someone else's.
		{:else}
			Select your birthday above first, then add a friend's birthday to compare.
		{/if}
	</p>

	{#if selectedDate}
		<div class="compare-grid">
			<!-- Your birthday -->
			<div class="compare-card you">
				<div class="card-header">You</div>
				<div class="card-date">{yourData ? formatDate(yourData.month, yourData.day) : '—'}</div>
				{#if yourData}
					<div class="card-stats">
						<div class="stat">
							<span class="stat-value">{yourData.rankLabel}</span>
							<span class="stat-label">Rank</span>
						</div>
						<div class="stat">
							<span class="stat-value">{yourData.value.toLocaleString()}</span>
							<span class="stat-label">Avg births</span>
						</div>
					</div>
				{/if}
			</div>

			<!-- VS -->
			<div class="compare-vs">vs</div>

			<!-- Friend's birthday -->
			<div class="compare-card friend">
				<div class="card-header">Friend</div>
				{#if friendData}
					<div class="card-date">{formatDate(friendData.month, friendData.day)}</div>
					<div class="card-stats">
						<div class="stat">
							<span class="stat-value">{friendData.rankLabel}</span>
							<span class="stat-label">Rank</span>
						</div>
						<div class="stat">
							<span class="stat-value">{friendData.value.toLocaleString()}</span>
							<span class="stat-label">Avg births</span>
						</div>
					</div>
				{:else}
					<div class="friend-picker">
						<select value={friendMonth} onchange={handleFriendMonthChange}>
							<option value={0}>Month</option>
							{#each months as month}
								<option value={month.value}>{month.label}</option>
							{/each}
						</select>
						<select 
							value={friendDay} 
							onchange={handleFriendDayChange} 
							disabled={!friendMonth}
						>
							<option value={0}>Day</option>
							{#each friendAvailableDays as day}
								<option value={day}>{day}</option>
							{/each}
						</select>
					</div>
				{/if}
			</div>
		</div>

		{#if comparison()}
			{@const comp = comparison()!}
			<div class="compare-result" class:winner-you={comp.winner === 'you'} class:winner-friend={comp.winner === 'friend'}>
				<p class="result-message">{comp.message}</p>
				{#if comp.winner !== 'tie'}
					<p class="result-detail">
						That's a difference of <strong>{comp.birthDiff.toLocaleString()}</strong> average daily births.
					</p>
				{/if}
				<div class="result-actions">
					<button class="clear-friend-btn" onclick={clearFriend}>
						Compare another
					</button>
					<button class="share-btn" onclick={copyShareUrl}>
						Copy link to share
					</button>
				</div>
			</div>
		{/if}
	{:else}
		<div class="select-first">
			<p>Select your birthday above to start comparing.</p>
		</div>
	{/if}
</div>

<style>
	.compare-container {
		margin: 32px 0;
		padding: 24px;
		background: var(--color-result-bg);
		border-radius: 8px;
	}

	h3 {
		font-size: 18px;
		font-weight: 600;
		margin: 0 0 8px 0;
		color: var(--color-text);
	}

	.compare-description {
		font-size: 14px;
		color: var(--color-text-muted);
		margin: 0 0 20px 0;
	}

	.compare-grid {
		display: grid;
		grid-template-columns: 1fr auto 1fr;
		gap: 16px;
		align-items: center;
	}

	.compare-card {
		padding: 16px;
		background: var(--color-bg);
		border-radius: 8px;
		border: 2px solid var(--color-border);
		text-align: center;
	}

	.card-header {
		font-size: 12px;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--color-text-muted);
		margin-bottom: 8px;
	}

	.card-date {
		font-size: 20px;
		font-weight: 700;
		color: var(--color-text);
		margin-bottom: 12px;
	}

	.card-stats {
		display: flex;
		justify-content: center;
		gap: 24px;
	}

	.stat {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.stat-value {
		font-size: 18px;
		font-weight: 600;
		color: var(--color-text);
	}

	.stat-label {
		font-size: 11px;
		color: var(--color-text-muted);
		text-transform: uppercase;
	}

	.compare-vs {
		font-size: 14px;
		font-weight: 700;
		color: var(--color-text-muted);
		text-transform: uppercase;
	}

	.friend-picker {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.friend-picker select {
		padding: 8px 12px;
		font-size: 14px;
		border: 1px solid var(--color-border);
		border-radius: 6px;
		background: var(--color-bg);
		color: var(--color-text);
		cursor: pointer;
	}

	.friend-picker select:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.compare-result {
		margin-top: 20px;
		padding: 16px;
		background: var(--color-bg);
		border-radius: 8px;
		text-align: center;
		border: 2px solid var(--color-border);
	}

	.compare-result.winner-you {
		border-color: var(--color-accent);
		background: rgba(247, 104, 161, 0.08);
	}

	.compare-result.winner-friend {
		border-color: #7c3aed;
		background: rgba(124, 58, 237, 0.08);
	}

	.result-message {
		font-size: 16px;
		font-weight: 600;
		color: var(--color-text);
		margin: 0 0 8px 0;
	}

	.result-detail {
		font-size: 14px;
		color: var(--color-text-muted);
		margin: 0 0 16px 0;
	}

	.result-detail strong {
		color: var(--color-text);
	}

	.result-actions {
		display: flex;
		justify-content: center;
		gap: 12px;
	}

	.clear-friend-btn,
	.share-btn {
		padding: 8px 16px;
		font-size: 13px;
		border-radius: 6px;
		cursor: pointer;
		transition: all 0.15s ease;
	}

	.clear-friend-btn {
		background: transparent;
		border: 1px solid var(--color-border);
		color: var(--color-text-muted);
	}

	.clear-friend-btn:hover {
		background: var(--color-border);
		color: var(--color-text);
	}

	.share-btn {
		background: var(--color-accent);
		border: none;
		color: white;
	}

	.share-btn:hover {
		opacity: 0.9;
	}

	.select-first {
		text-align: center;
		padding: 32px;
		color: var(--color-text-muted);
	}

	@media (max-width: 560px) {
		.compare-grid {
			grid-template-columns: 1fr;
			gap: 12px;
		}

		.compare-vs {
			margin: 4px 0;
		}

		.result-actions {
			flex-direction: column;
		}
	}
</style>

