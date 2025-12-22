<script lang="ts">
	// RdPu color scale matching heatmap
	const colors = [
		'#fff7f3', '#fde0dd', '#fcc5c0', '#fa9fb5',
		'#f768a1', '#dd3497', '#ae017e', '#7a0177', '#49006a'
	];
</script>

<div class="legend">
	<div class="legend-labels">
		<span class="legend-label-text">Least common</span>
		<span class="legend-label-text">Most common</span>
	</div>
	<div class="legend-scale">
		{#each colors as color}
			<span class="legend-swatch" style="background: {color}"></span>
		{/each}
	</div>
	<p class="legend-caption">Average daily U.S. births, 1994-2014</p>
</div>

<style>
	.legend {
		display: flex;
		flex-direction: column;
		gap: 6px;
		margin-bottom: 20px;
		max-width: 50%;
	}

	@media (max-width: 600px) {
		.legend {
			max-width: 100%;
		}
	}

	.legend-labels {
		display: flex;
		justify-content: space-between;
	}

	.legend-label-text {
		font-size: 13px;
		font-weight: 500;
		color: var(--color-text);
	}

	.legend-scale {
		display: flex;
		gap: 0;
	}

	.legend-swatch {
		display: block;
		flex: 1;
		height: 16px;
	}

	.legend-swatch:first-child {
		border-radius: 4px 0 0 4px;
	}

	.legend-swatch:last-child {
		border-radius: 0 4px 4px 0;
	}

	.legend-caption {
		font-size: 12px;
		color: var(--color-text-muted);
		margin: 4px 0 0 0;
		text-align: center;
	}
</style>
