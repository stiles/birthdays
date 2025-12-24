<script lang="ts">
	import * as d3 from 'd3';
	import type { BirthdayData } from '$lib/types';
	import { formatDate } from '$lib/utils';

	interface Props {
		data: BirthdayData[];
		selectedDate?: { month: number; day: number } | null;
		onDateSelect?: (date: { month: number; day: number }) => void;
	}

	let {
		data,
		selectedDate = null,
		onDateSelect = () => {}
	}: Props = $props();

	// Sort data by rank (most common first)
	let sortedData = $derived([...data].sort((a, b) => a.rank - b.rank));
	
	// Get min/max values for scaling
	let minValue = $derived(Math.min(...data.map(d => d.value)));
	let maxValue = $derived(Math.max(...data.map(d => d.value)));

	// Use same RdPu color scale as heatmap (based on value, not rank)
	const colorScale = d3.scaleThreshold<number, string>()
		.domain([9000, 10500, 10750, 11000, 11250, 11500, 11750, 12000])
		.range([
			'#fff7f3', '#fde0dd', '#fcc5c0', '#fa9fb5',
			'#f768a1', '#dd3497', '#ae017e', '#7a0177', '#49006a'
		]);

	let containerWidth = $state(800);
	let containerRef: HTMLDivElement | null = $state(null);

	$effect(() => {
		if (!containerRef) return;
		const observer = new ResizeObserver(entries => {
			containerWidth = entries[0].contentRect.width;
		});
		observer.observe(containerRef);
		return () => observer.disconnect();
	});

	// Dimensions
	let padding = { top: 20, right: 16, bottom: 30, left: 50 };
	let barWidth = $derived(Math.max(1, (containerWidth - padding.left - padding.right) / 366));
	let chartHeight = 150;

	function getBarHeight(value: number): number {
		const range = maxValue - minValue;
		return ((value - minValue) / range) * (chartHeight - padding.top - padding.bottom);
	}

	function isSelected(d: BirthdayData): boolean {
		return selectedDate?.month === d.month && selectedDate?.day === d.day;
	}

	let hoveredData: BirthdayData | null = $state(null);
</script>

<div class="distribution-container" bind:this={containerRef}>
	<h3>Birth frequency by rank</h3>
	<p class="chart-description">
		All 366 days ranked from most common (left) to least common (right). 
		{#if selectedDate}
			Your birthday is highlighted.
		{:else}
			Select a date to highlight it.
		{/if}
	</p>
	
	<svg 
		width={containerWidth} 
		height={chartHeight}
		role="img"
		aria-label="Distribution chart showing birth frequency for all 366 days"
	>
		<!-- Y-axis labels -->
		<text 
			x={padding.left - 8} 
			y={padding.top + 4} 
			class="axis-label" 
			text-anchor="end"
		>
			{maxValue.toLocaleString()}
		</text>
		<text 
			x={padding.left - 8} 
			y={chartHeight - padding.bottom} 
			class="axis-label" 
			text-anchor="end"
		>
			{minValue.toLocaleString()}
		</text>
		
		<!-- Y-axis title -->
		<text 
			x={12} 
			y={chartHeight / 2} 
			class="axis-title"
			transform="rotate(-90, 12, {chartHeight / 2})"
		>
			Avg. births
		</text>

		<!-- Bars -->
		<g transform="translate({padding.left}, 0)">
			{#each sortedData as d, i}
				{@const barHeight = getBarHeight(d.value)}
				{@const x = i * barWidth}
				{@const y = chartHeight - padding.bottom - barHeight}
				{@const selected = isSelected(d)}
				<rect
					{x}
					{y}
					width={Math.max(1, barWidth - 0.5)}
					height={barHeight}
					fill={selected ? '#e6ff00' : colorScale(d.value)}
					stroke={selected ? '#000' : 'none'}
					stroke-width={selected ? 1 : 0}
					class="bar"
					class:selected
					role="button"
					tabindex="0"
					aria-label="{formatDate(d.month, d.day)}: rank {d.rank}, {d.value.toLocaleString()} births"
					onclick={() => onDateSelect({ month: d.month, day: d.day })}
					onkeydown={(e) => e.key === 'Enter' && onDateSelect({ month: d.month, day: d.day })}
					onmouseenter={() => hoveredData = d}
					onmouseleave={() => hoveredData = null}
				/>
			{/each}
		</g>

		<!-- X-axis labels -->
		<text 
			x={padding.left} 
			y={chartHeight - 8} 
			class="axis-label"
		>
			#1
		</text>
		<text 
			x={containerWidth - padding.right} 
			y={chartHeight - 8} 
			class="axis-label" 
			text-anchor="end"
		>
			#366
		</text>
		<text 
			x={(containerWidth + padding.left - padding.right) / 2} 
			y={chartHeight - 8} 
			class="axis-label" 
			text-anchor="middle"
		>
			Rank (most → least common)
		</text>
	</svg>

	{#if hoveredData}
		<div class="hover-info">
			<strong>{formatDate(hoveredData.month, hoveredData.day)}</strong>: 
			Rank {hoveredData.rankLabel} · {hoveredData.value.toLocaleString()} avg births/day
		</div>
	{/if}
</div>

<style>
	.distribution-container {
		margin: 32px 0;
	}

	h3 {
		font-size: 18px;
		font-weight: 600;
		margin: 0 0 8px 0;
		color: var(--color-text);
	}

	.chart-description {
		font-size: 14px;
		color: var(--color-text-muted);
		margin: 0 0 16px 0;
	}

	svg {
		display: block;
		overflow: hidden;
	}

	.bar {
		cursor: pointer;
		transition: opacity 0.1s ease;
	}

	.bar:hover {
		opacity: 0.8;
	}

	.bar.selected {
		filter: drop-shadow(0 0 4px rgba(230, 255, 0, 0.6));
	}

	.axis-label {
		font-size: 11px;
		fill: var(--color-text-muted);
	}

	.axis-title {
		font-size: 11px;
		fill: var(--color-text-muted);
		text-anchor: middle;
	}

	.hover-info {
		margin-top: 8px;
		padding: 8px 12px;
		background: var(--color-result-bg);
		border-radius: 4px;
		font-size: 13px;
		color: var(--color-text);
	}
</style>

