<script lang="ts">
	import type { BirthdayData } from '$lib/types';
	import { formatDate } from '$lib/utils';

	interface Props {
		data?: BirthdayData | null;
		x?: number;
		y?: number;
		visible?: boolean;
	}

	let { data = null, x = 0, y = 0, visible = false }: Props = $props();
</script>

{#if visible && data}
	<div
		class="tooltip"
		style="left: {x}px; top: {y}px;"
		role="tooltip"
	>
		<p class="tooltip-date">{formatDate(data.month, data.day)}</p>
		<p class="tooltip-value">{data.value.toLocaleString()} avg births</p>
		<p class="tooltip-rank">Rank: {data.rankLabel}</p>
	</div>
{/if}

<style>
	.tooltip {
		position: fixed;
		z-index: 1000;
		padding: 10px 14px;
		background: var(--color-tooltip-bg);
		color: var(--color-tooltip-text);
		border-radius: 6px;
		font-size: 13px;
		pointer-events: none;
		transform: translate(-50%, -100%);
		margin-top: -12px;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
		white-space: nowrap;
	}

	.tooltip::after {
		content: '';
		position: absolute;
		top: 100%;
		left: 50%;
		transform: translateX(-50%);
		border: 6px solid transparent;
		border-top-color: var(--color-tooltip-bg);
	}

	.tooltip-date {
		margin: 0 0 4px 0;
		font-weight: 600;
	}

	.tooltip-value {
		margin: 0 0 2px 0;
		color: var(--color-tooltip-muted);
	}

	.tooltip-rank {
		margin: 0;
		color: var(--color-tooltip-muted);
	}
</style>

