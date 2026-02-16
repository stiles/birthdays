<script lang="ts">
	import type { BirthdayData } from '$lib/types';

	interface Props {
		data: BirthdayData[];
		selectedDate?: { month: number; day: number } | null;
	}

	let {
		data,
		selectedDate = null
	}: Props = $props();

	interface ZodiacSign {
		name: string;
		symbol: string;
		startMonth: number;
		startDay: number;
		endMonth: number;
		endDay: number;
	}

	const zodiacSigns: ZodiacSign[] = [
		{ name: 'Capricorn', symbol: '♑', startMonth: 12, startDay: 22, endMonth: 1, endDay: 19 },
		{ name: 'Aquarius', symbol: '♒', startMonth: 1, startDay: 20, endMonth: 2, endDay: 18 },
		{ name: 'Pisces', symbol: '♓', startMonth: 2, startDay: 19, endMonth: 3, endDay: 20 },
		{ name: 'Aries', symbol: '♈', startMonth: 3, startDay: 21, endMonth: 4, endDay: 19 },
		{ name: 'Taurus', symbol: '♉', startMonth: 4, startDay: 20, endMonth: 5, endDay: 20 },
		{ name: 'Gemini', symbol: '♊', startMonth: 5, startDay: 21, endMonth: 6, endDay: 20 },
		{ name: 'Cancer', symbol: '♋', startMonth: 6, startDay: 21, endMonth: 7, endDay: 22 },
		{ name: 'Leo', symbol: '♌', startMonth: 7, startDay: 23, endMonth: 8, endDay: 22 },
		{ name: 'Virgo', symbol: '♍', startMonth: 8, startDay: 23, endMonth: 9, endDay: 22 },
		{ name: 'Libra', symbol: '♎', startMonth: 9, startDay: 23, endMonth: 10, endDay: 22 },
		{ name: 'Scorpio', symbol: '♏', startMonth: 10, startDay: 23, endMonth: 11, endDay: 21 },
		{ name: 'Sagittarius', symbol: '♐', startMonth: 11, startDay: 22, endMonth: 12, endDay: 21 }
	];

	function getZodiacSign(month: number, day: number): ZodiacSign | null {
		for (const sign of zodiacSigns) {
			// Handle signs that span year boundary (Capricorn)
			if (sign.startMonth > sign.endMonth) {
				if ((month === sign.startMonth && day >= sign.startDay) ||
					(month === sign.endMonth && day <= sign.endDay)) {
					return sign;
				}
			} else {
				if ((month === sign.startMonth && day >= sign.startDay) ||
					(month === sign.endMonth && day <= sign.endDay) ||
					(month > sign.startMonth && month < sign.endMonth)) {
					return sign;
				}
			}
		}
		return null;
	}

	// Calculate total births per zodiac sign
	let zodiacStats = $derived(() => {
		const stats = new Map<string, { sign: ZodiacSign; totalBirths: number; dayCount: number }>();
		
		for (const sign of zodiacSigns) {
			stats.set(sign.name, { sign, totalBirths: 0, dayCount: 0 });
		}

		for (const d of data) {
			const sign = getZodiacSign(d.month, d.day);
			if (sign) {
				const current = stats.get(sign.name)!;
				current.totalBirths += d.value;
				current.dayCount += 1;
			}
		}

		return Array.from(stats.values())
			.map(s => ({
				...s,
				avgBirths: s.dayCount > 0 ? Math.round(s.totalBirths / s.dayCount) : 0
			}))
			.sort((a, b) => b.avgBirths - a.avgBirths);
	});

	let maxAvg = $derived(Math.max(...zodiacStats().map(s => s.avgBirths)));

	let selectedSign = $derived(
		selectedDate ? getZodiacSign(selectedDate.month, selectedDate.day) : null
	);

	// Zero-based bar width (proper bar chart scaling)
	function getBarWidth(avgBirths: number): number {
		return maxAvg > 0 ? (avgBirths / maxAvg) * 100 : 0;
	}
</script>

<div class="zodiac-container">
	<h3>Zodiac sign popularity</h3>
	<p class="zodiac-description">
		Average daily births by astrological sign.
		{#if selectedSign}
			You're a <strong>{selectedSign.name}</strong>.
		{/if}
	</p>

	<div class="zodiac-chart">
		{#each zodiacStats() as stat}
			{@const isSelected = selectedSign?.name === stat.sign.name}
			<div class="zodiac-row" class:selected={isSelected}>
				<div class="zodiac-label">
					<span class="zodiac-name">{stat.sign.name}</span>
				</div>
				<div class="zodiac-bar-container">
					<div 
						class="zodiac-bar"
						style="width: {getBarWidth(stat.avgBirths)}%"
						class:most-common={stat === zodiacStats()[0]}
						class:least-common={stat === zodiacStats()[zodiacStats().length - 1]}
					></div>
				</div>
				<div class="zodiac-value">
					{stat.avgBirths.toLocaleString()}
				</div>
			</div>
		{/each}
	</div>

	<p class="zodiac-footnote">
		<strong>{zodiacStats()[0].sign.name}</strong> is the most common sign, 
		while <strong>{zodiacStats()[zodiacStats().length - 1].sign.name}</strong> is the least common.
	</p>
</div>

<style>
	.zodiac-container {
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

	.zodiac-description {
		font-size: 14px;
		color: var(--color-text-muted);
		margin: 0 0 20px 0;
	}

	.zodiac-description strong {
		color: var(--color-text);
	}

	.zodiac-chart {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.zodiac-row {
		display: grid;
		grid-template-columns: 120px 1fr 70px;
		align-items: center;
		gap: 12px;
		padding: 6px 8px;
		border-radius: 4px;
		transition: background 0.15s ease;
	}

	.zodiac-row.selected {
		background: rgba(255, 255, 255, 0.08);
	}

	.zodiac-label {
		display: flex;
		align-items: center;
	}

	.zodiac-name {
		font-size: 14px;
		color: var(--color-text);
	}

	.zodiac-bar-container {
		height: 20px;
		background: var(--color-border);
		border-radius: 3px;
		overflow: hidden;
	}

	.zodiac-bar {
		height: 100%;
		background: var(--color-text-muted);
		border-radius: 3px;
		transition: width 0.3s ease;
	}

	.zodiac-bar.most-common {
		background: var(--color-text);
	}

	.zodiac-bar.least-common {
		background: var(--color-text-muted);
	}

	.zodiac-value {
		font-size: 13px;
		color: var(--color-text-muted);
		text-align: right;
		font-variant-numeric: tabular-nums;
	}

	.zodiac-footnote {
		margin: 16px 0 0 0;
		font-size: 13px;
		color: var(--color-text-muted);
	}

	.zodiac-footnote strong {
		color: var(--color-text);
	}

	@media (max-width: 480px) {
		.zodiac-row {
			grid-template-columns: 100px 1fr 60px;
			gap: 8px;
		}

		.zodiac-name {
			font-size: 13px;
		}

		.zodiac-value {
			font-size: 12px;
		}
	}
</style>

