<script lang="ts">
	import type { BirthdayData } from '$lib/types';
	import { formatDate } from '$lib/utils';
	import famousBirthdaysData from '$lib/data/famous-birthdays.json';

	const ETSY_URL = 'https://birthdayrank.etsy.com';

	interface FamousPerson {
		name: string;
		year?: number;
	}

	interface Props {
		data: BirthdayData[];
		selectedDate?: { month: number; day: number } | null;
		onDateSelect?: (date: { month: number; day: number } | null) => void;
	}

	let {
		data,
		selectedDate = null,
		onDateSelect = () => {}
	}: Props = $props();

	// Format conception date from "4/10" format to "April 10"
	function formatConceptionDate(dateStr: string): string {
		const [month, day] = dateStr.split('/').map(Number);
		const monthNames = [
			'January', 'February', 'March', 'April', 'May', 'June',
			'July', 'August', 'September', 'October', 'November', 'December'
		];
		return `${monthNames[month - 1]} ${day}`;
	}

	// Get 3 random famous people for the selected date
	function getRandomFamousPeople(month: number, day: number): FamousPerson[] {
		const key = `${month}-${day}`;
		const people = (famousBirthdaysData as Record<string, FamousPerson[]>)[key] || [];
		if (people.length <= 3) return people;
		// Shuffle and take 3
		const shuffled = [...people].sort(() => Math.random() - 0.5);
		return shuffled.slice(0, 3);
	}

	function getRarityDescription(rank: number): { label: string; description: string } {
		if (rank <= 15) {
			return {
				label: 'quite common',
				description: "You share your birthday with a lot of people! It's one of the most popular birth dates in the U.S."
			};
		} else if (rank <= 50) {
			return {
				label: 'common',
				description: "Your birthday is popular. You might know someone who shares it."
			};
		} else if (rank <= 120) {
			return {
				label: 'fairly common',
				description: "Your birthday falls on a relatively popular date."
			};
		} else if (rank <= 245) {
			return {
				label: 'about average',
				description: "Your birthday is right in the middle of the pack."
			};
		} else if (rank <= 310) {
			return {
				label: 'uncommon',
				description: "Your birthday is a bit less common than most."
			};
		} else if (rank <= 350) {
			return {
				label: 'rare',
				description: "Not as many people share your birthday. It's one of the least common dates."
			};
		} else {
			return {
				label: 'quite rare',
				description: "Your birthday is one of the rarest! Fewer people are born on this date."
			};
		}
	}

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

	let selectedMonth = $state(0);
	let selectedDay = $state(0);

	let availableDays = $derived(
		selectedMonth
			? Array.from({ length: months[selectedMonth - 1].days }, (_, i) => i + 1)
			: []
	);

	let selectedData = $derived(
		selectedDate
			? data.find(d => d.month === selectedDate.month && d.day === selectedDate.day)
			: null
	);

	let rarity = $derived(selectedData ? getRarityDescription(selectedData.rank) : null);

	let famousPeople = $derived(
		selectedDate ? getRandomFamousPeople(selectedDate.month, selectedDate.day) : []
	);

	// Sync internal state with external selection changes (from heatmap clicks)
	$effect(() => {
		if (selectedDate) {
			selectedMonth = selectedDate.month;
			selectedDay = selectedDate.day;
		}
	});

	// Call onDateSelect when both month and day are selected
	$effect(() => {
		if (selectedMonth && selectedDay && selectedDay <= availableDays.length) {
			const dateData = data.find(d => d.month === selectedMonth && d.day === selectedDay);
			if (dateData) {
				onDateSelect({ month: selectedMonth, day: selectedDay });
			}
		}
	});

	function handleMonthChange(e: Event) {
		const value = parseInt((e.target as HTMLSelectElement).value);
		selectedMonth = value;
		if (selectedDay > availableDays.length) {
			selectedDay = 0;
		}
	}

	function handleDayChange(e: Event) {
		selectedDay = parseInt((e.target as HTMLSelectElement).value);
	}

	function clearSelection() {
		selectedMonth = 0;
		selectedDay = 0;
		onDateSelect(null);
	}
</script>

<div class="picker-container">
	<div class="picker-form">
		<label class="picker-label">
			<span>Your birthday:</span>
			<select value={selectedMonth} onchange={handleMonthChange}>
				<option value={0}>Month</option>
				{#each months as month}
					<option value={month.value}>{month.label}</option>
				{/each}
			</select>
		</label>

		<label class="picker-label">
			<select value={selectedDay} onchange={handleDayChange} disabled={!selectedMonth}>
				<option value={0}>Day</option>
				{#each availableDays as day}
					<option value={day}>{day}</option>
				{/each}
			</select>
		</label>

		{#if selectedDate}
			<button class="clear-btn" onclick={clearSelection} aria-label="Clear selection">
				Clear
			</button>
		{/if}
	</div>

	{#if selectedData && rarity}
		<div class="result">
			<p class="result-headline">
				Your birthday is <strong class="rarity-label">{rarity.label}</strong>
			</p>
		<p class="result-rank">
			<strong>{formatDate(selectedData.month, selectedData.day)}</strong> ranks 
			<strong>{selectedData.rankLabel}</strong> out of 366 days, with an average of 
			<strong>{selectedData.value.toLocaleString()}</strong> births per day. {rarity.description}
		</p>
		<p class="conception-info">
			Based on a typical 40-week pregnancy, you were likely conceived around <strong>{formatConceptionDate(selectedData.conceptionDate)}</strong>.
		</p>
			{#if famousPeople.length > 0}
				<p class="famous-births">
					<strong>Famous births on this day:</strong> {famousPeople.length === 1 
						? famousPeople[0].name 
						: famousPeople.slice(0, -1).map(p => p.name).join(', ') + ' and ' + famousPeople[famousPeople.length - 1].name}.
				</p>
			{/if}

		<div class="print-cta">
			<div class="print-cta-text">
				<strong>Love this?</strong> Get a personalized print of your birthday — ready to frame.
			</div>
			<a href={ETSY_URL} class="print-cta-btn" target="_blank" rel="noopener noreferrer">
				Order a print →
			</a>
		</div>
		</div>
	{/if}
</div>

<style>
	.picker-container {
		margin-bottom: 24px;
	}

	.picker-form {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 12px;
	}

	.picker-label {
		display: flex;
		align-items: center;
		gap: 8px;
		font-size: 16px;
		color: var(--color-text);
	}

	.picker-label span {
		font-weight: 600;
		font-size: 17px;
	}

	select {
		padding: 10px 16px;
		font-size: 16px;
		font-weight: 500;
		border: 2px solid var(--color-border);
		border-radius: 6px;
		background: var(--color-bg);
		color: var(--color-text);
		cursor: pointer;
		transition: border-color 0.15s ease;
	}

	select:hover:not(:disabled) {
		border-color: var(--color-accent);
	}

	select:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	select:focus {
		outline: none;
		border-color: var(--color-accent);
		box-shadow: 0 0 0 3px rgba(247, 104, 161, 0.1);
	}

	.clear-btn {
		padding: 8px 16px;
		font-size: 14px;
		border: 1px solid var(--color-border);
		border-radius: 6px;
		background: transparent;
		color: var(--color-text-muted);
		cursor: pointer;
		transition: all 0.15s ease;
	}

	.clear-btn:hover {
		background: var(--color-border);
		color: var(--color-text);
	}

	.result {
		margin-top: 16px;
		padding: 20px 24px;
		background: var(--color-result-bg);
		border-radius: 8px;
	}

	.result-headline {
		margin: 0 0 12px 0;
		font-size: 24px;
		color: var(--color-text);
	}

	.result-headline .rarity-label {
		color: var(--color-accent);
		/* text-transform: uppercase; */
		letter-spacing: 0.02em;
	}

	.result-rank {
		margin: 0 0 12px 0;
		font-size: 17px;
		color: var(--color-text-muted);
		line-height: 1.5;
	}

	.result-rank strong {
		color: var(--color-text);
	}

	.result-description {
		margin: 0 0 12px 0;
		font-size: 17px;
		color: var(--color-text-muted);
		line-height: 1.5;
	}

	.conception-info {
		margin: 0 0 12px 0;
		font-size: 14px;
		color: var(--color-text-muted);
		line-height: 1.5;
		font-style: italic;
	}

	.conception-info strong {
		color: var(--color-text);
		font-style: normal;
	}

	.famous-births {
		margin: 0;
		padding-top: 12px;
		border-top: 1px solid var(--color-border);
		font-size: 14px;
		color: var(--color-text-muted);
		line-height: 1.5;
	}

	.famous-births strong {
		color: var(--color-text);
	}

	.print-cta {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
		margin-top: 16px;
		padding: 14px 16px;
		background: rgba(247, 104, 161, 0.08);
		border: 1px solid rgba(247, 104, 161, 0.3);
		border-radius: 6px;
	}

	.print-cta-text {
		font-size: 14px;
		color: var(--color-text-muted);
		line-height: 1.4;
	}

	.print-cta-text strong {
		color: var(--color-text);
	}

	.print-cta-btn {
		flex-shrink: 0;
		padding: 8px 16px;
		font-size: 13px;
		font-weight: 600;
		color: #fff;
		background: var(--color-accent);
		border-radius: 6px;
		text-decoration: none;
		transition: opacity 0.15s ease;
		white-space: nowrap;
	}

	.print-cta-btn:hover {
		opacity: 0.85;
	}

	@media (max-width: 480px) {
		.print-cta {
			flex-direction: column;
			align-items: stretch;
			text-align: center;
		}

		.picker-form {
			flex-direction: column;
			align-items: stretch;
		}

		.picker-label {
			flex-direction: column;
			align-items: stretch;
		}

		select {
			width: 100%;
		}
	}
</style>

