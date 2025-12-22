<script lang="ts">
	import famousBirthdaysData from '$lib/data/famous-birthdays.json';

	interface FamousPerson {
		name: string;
		year?: number;
	}

	interface Props {
		selectedDate?: { month: number; day: number } | null;
	}

	let { selectedDate = null }: Props = $props();

	let famousPeople = $derived.by(() => {
		if (!selectedDate) return [];
		const key = `${selectedDate.month}-${selectedDate.day}`;
		return (famousBirthdaysData as Record<string, FamousPerson[]>)[key] || [];
	});

	function formatYear(year?: number): string {
		if (!year) return '';
		const currentYear = new Date().getFullYear();
		const age = currentYear - year;
		// If they'd be over 120, they're probably deceased
		if (age > 120) {
			return `b. ${year}`;
		}
		return `${year}`;
	}
</script>

{#if selectedDate && famousPeople.length > 0}
	<div class="famous-birthdays">
		<h3 class="famous-title">Famous people born on this day</h3>
		<ul class="famous-list">
			{#each famousPeople as person}
				<li class="famous-person">
					<span class="person-name">{person.name}</span>
					{#if person.year}
						<span class="person-year">{formatYear(person.year)}</span>
					{/if}
				</li>
			{/each}
		</ul>
	</div>
{/if}

<style>
	.famous-birthdays {
		margin-top: 20px;
		padding: 16px 20px;
		background: var(--color-surface);
		border-radius: 8px;
		border: 1px solid var(--color-border);
	}

	.famous-title {
		margin: 0 0 12px 0;
		font-size: 14px;
		font-weight: 600;
		color: var(--color-text-muted);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.famous-list {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
	}

	.famous-person {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		padding: 6px 12px;
		background: var(--color-bg);
		border-radius: 20px;
		font-size: 14px;
		border: 1px solid var(--color-border);
	}

	.person-name {
		color: var(--color-text);
		font-weight: 500;
	}

	.person-year {
		color: var(--color-text-muted);
		font-size: 12px;
	}

	@media (max-width: 480px) {
		.famous-list {
			flex-direction: column;
		}

		.famous-person {
			justify-content: space-between;
		}
	}
</style>

