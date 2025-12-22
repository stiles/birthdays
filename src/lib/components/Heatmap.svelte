<script lang="ts">
	import { onMount } from 'svelte';
	import * as d3 from 'd3';
	import type { BirthdayData } from '$lib/types';

	interface Props {
		data: BirthdayData[];
		selectedDate?: { month: number; day: number } | null;
		onDateSelect?: (date: { month: number; day: number } | null) => void;
		onDateHover?: (date: BirthdayData | null) => void;
	}

	let {
		data,
		selectedDate = null,
		onDateSelect = () => {},
		onDateHover = () => {}
	}: Props = $props();

	let container: HTMLDivElement;
	let width = $state(0);

	const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
	const days = Array.from({ length: 31 }, (_, i) => i + 1);

	// Breakpoint for switching to vertical layout
	const MOBILE_BREAKPOINT = 500;

	// RdPu color scale matching original
	const colorScale = d3.scaleThreshold<number, string>()
		.domain([9000, 10500, 10750, 11000, 11250, 11500, 11750, 12000])
		.range([
			'#fff7f3', '#fde0dd', '#fcc5c0', '#fa9fb5',
			'#f768a1', '#dd3497', '#ae017e', '#7a0177', '#49006a'
		]);

	function getDataForDate(month: number, day: number): BirthdayData | undefined {
		return data.find(d => d.month === month && d.day === day);
	}

	function isSelected(month: number, day: number): boolean {
		return selectedDate?.month === month && selectedDate?.day === day;
	}

	function handleClick(month: number, day: number) {
		const dateData = getDataForDate(month, day);
		if (!dateData) return;

		if (isSelected(month, day)) {
			onDateSelect(null);
		} else {
			onDateSelect({ month, day });
		}
	}

	function handleMouseEnter(month: number, day: number) {
		const dateData = getDataForDate(month, day);
		onDateHover(dateData || null);
	}

	function handleMouseLeave() {
		onDateHover(null);
	}

	onMount(() => {
		const resizeObserver = new ResizeObserver(entries => {
			for (const entry of entries) {
				width = entry.contentRect.width;
			}
		});
		resizeObserver.observe(container);
		return () => resizeObserver.disconnect();
	});

	// Responsive layout calculations
	let isVertical = $derived(width < MOBILE_BREAKPOINT);
	
	// Desktop: 31 columns (days), 12 rows (months)
	// Mobile: 12 columns (months), 31 rows (days)
	let gridSize = $derived(
		isVertical
			? Math.max(12, Math.floor((width - 28) / 12))  // 12 month columns
			: Math.max(12, Math.floor((width - 40) / 31))  // 31 day columns
	);
	
	let chartWidth = $derived(isVertical ? gridSize * 12 : gridSize * 31);
	let chartHeight = $derived(isVertical ? gridSize * 31 : gridSize * 12);
	let labelOffset = $derived(isVertical ? 24 : 40);
</script>

<div class="heatmap-container" bind:this={container}>
	{#if width > 0}
		<svg
			width={width}
			height={chartHeight + 30}
			role="img"
			aria-label="Birthday frequency heatmap showing relative popularity of each birth date"
		>
			{#if isVertical}
				<!-- VERTICAL LAYOUT (Mobile): Months across, days down -->
				
				<!-- Month labels across top -->
				<g class="month-labels" transform="translate({labelOffset}, 0)">
					{#each months as month, i}
						<text
							x={i * gridSize + gridSize / 2}
							y="12"
							text-anchor="middle"
							class="axis-label"
						>
							{month.charAt(0)}
						</text>
					{/each}
				</g>

				<!-- Day labels and grid -->
				<g class="chart" transform="translate({labelOffset}, 20)">
					{#each days as day, dayIndex}
						<!-- Day label on left -->
						<text
							x="-6"
							y={dayIndex * gridSize + gridSize / 2 + 4}
							text-anchor="end"
							class="axis-label"
						>
							{day}
						</text>

						<!-- Month cells for this day -->
						{#each months as month, monthIndex}
							{@const dateData = getDataForDate(monthIndex + 1, day)}
							{#if dateData}
								<rect
									x={monthIndex * gridSize}
									y={dayIndex * gridSize}
									width={gridSize}
									height={gridSize}
									fill={colorScale(dateData.value)}
									class="date-cell"
									class:selected={isSelected(monthIndex + 1, day)}
									role="button"
									tabindex="0"
									aria-label="{month} {day}: {dateData.value.toLocaleString()} average births, ranked {dateData.rankLabel}"
									onclick={() => handleClick(monthIndex + 1, day)}
									onkeydown={(e) => e.key === 'Enter' && handleClick(monthIndex + 1, day)}
									onmouseenter={() => handleMouseEnter(monthIndex + 1, day)}
									onmouseleave={handleMouseLeave}
								/>
							{/if}
						{/each}
					{/each}
				</g>

				<!-- Selection highlight overlay (renders on top) -->
				{#if selectedDate}
					{@const selDay = selectedDate.day}
					{@const selMonth = selectedDate.month}
					<rect
						x={labelOffset + (selMonth - 1) * gridSize}
						y={20 + (selDay - 1) * gridSize}
						width={gridSize}
						height={gridSize}
						fill="none"
						class="selection-highlight"
						pointer-events="none"
					/>
				{/if}
			{:else}
				<!-- HORIZONTAL LAYOUT (Desktop): Days across, months down -->
				
				<!-- Day labels across top -->
				<g class="day-labels" transform="translate({labelOffset}, 0)">
					{#each days as day}
						<text
							x={(day - 1) * gridSize + gridSize / 2}
							y="12"
							text-anchor="middle"
							class="axis-label"
						>
							{day}
						</text>
					{/each}
				</g>

				<!-- Month labels and grid -->
				<g class="chart" transform="translate({labelOffset}, 20)">
					{#each months as month, monthIndex}
						<!-- Month label on left -->
						<text
							x="-6"
							y={monthIndex * gridSize + gridSize / 2 + 4}
							text-anchor="end"
							class="axis-label"
						>
							{month}
						</text>

						<!-- Day cells for this month -->
						{#each days as day}
							{@const dateData = getDataForDate(monthIndex + 1, day)}
							{#if dateData}
								<rect
									x={(day - 1) * gridSize}
									y={monthIndex * gridSize}
									width={gridSize}
									height={gridSize}
									fill={colorScale(dateData.value)}
									class="date-cell"
									class:selected={isSelected(monthIndex + 1, day)}
									role="button"
									tabindex="0"
									aria-label="{month} {day}: {dateData.value.toLocaleString()} average births, ranked {dateData.rankLabel}"
									onclick={() => handleClick(monthIndex + 1, day)}
									onkeydown={(e) => e.key === 'Enter' && handleClick(monthIndex + 1, day)}
									onmouseenter={() => handleMouseEnter(monthIndex + 1, day)}
									onmouseleave={handleMouseLeave}
								/>
							{/if}
						{/each}
					{/each}
				</g>

				<!-- Selection highlight overlay (renders on top) -->
				{#if selectedDate}
					{@const selDay = selectedDate.day}
					{@const selMonth = selectedDate.month}
					<rect
						x={labelOffset + (selDay - 1) * gridSize}
						y={20 + (selMonth - 1) * gridSize}
						width={gridSize}
						height={gridSize}
						fill="none"
						class="selection-highlight"
						pointer-events="none"
					/>
				{/if}
			{/if}
		</svg>
	{/if}
</div>

<style>
	.heatmap-container {
		width: 100%;
	}

	svg {
		display: block;
	}

	.axis-label {
		font-size: 11px;
		fill: var(--color-text-muted);
		font-variant-numeric: tabular-nums;
	}

	.date-cell {
		stroke: var(--color-bg);
		stroke-width: 1px;
		cursor: pointer;
		transition: opacity 0.15s ease;
	}

	.date-cell:hover {
		opacity: 0.85;
		stroke: var(--color-text);
		stroke-width: 2px;
	}

	.date-cell:focus {
		outline: none;
		stroke: var(--color-text);
		stroke-width: 2px;
	}

	.selection-highlight {
		stroke: #e6ff00;
		stroke-width: 3px;
	}
</style>
