<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import birthdayData from '$lib/data/birthdays.json';
	import famousBirthdaysData from '$lib/data/famous-birthdays.json';
	import type { BirthdayData } from '$lib/types';
	import { formatDate } from '$lib/utils';

	const data = birthdayData as BirthdayData[];

	interface FamousPerson {
		name: string;
		year?: number;
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
	let isProcessing = $state(false);
	let errorMessage = $state('');

	let availableDays = $derived(
		selectedMonth
			? Array.from({ length: months[selectedMonth - 1].days }, (_, i) => i + 1)
			: []
	);

	let selectedData = $derived(
		selectedMonth && selectedDay
			? data.find(d => d.month === selectedMonth && d.day === selectedDay)
			: null
	);

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

	function getRandomFamousPeople(month: number, day: number): FamousPerson[] {
		const key = `${month}-${day}`;
		const people = (famousBirthdaysData as Record<string, FamousPerson[]>)[key] || [];
		if (people.length <= 3) return people;
		const shuffled = [...people].sort(() => Math.random() - 0.5);
		return shuffled.slice(0, 3);
	}

	let rarity = $derived(selectedData ? getRarityDescription(selectedData.rank) : null);
	let famousPeople = $derived(
		selectedMonth && selectedDay ? getRandomFamousPeople(selectedMonth, selectedDay) : []
	);

	onMount(() => {
		if (browser) {
			const monthParam = $page.url.searchParams.get('month');
			const dayParam = $page.url.searchParams.get('day');
			if (monthParam && dayParam) {
				const month = parseInt(monthParam);
				const day = parseInt(dayParam);
				if (month >= 1 && month <= 12 && day >= 1 && day <= 31) {
					selectedMonth = month;
					selectedDay = day;
				}
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

	async function handleCheckout() {
		if (!selectedMonth || !selectedDay || !selectedData) return;

		isProcessing = true;
		errorMessage = '';

		try {
			const response = await fetch('/api/create-checkout', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ month: selectedMonth, day: selectedDay })
			});

			const result = await response.json();

			if (response.ok && result.url) {
				window.location.href = result.url;
			} else {
				errorMessage = result.error || 'Failed to create checkout session';
				isProcessing = false;
			}
		} catch (err) {
			errorMessage = 'An error occurred. Please try again.';
			isProcessing = false;
		}
	}
</script>

<svelte:head>
	<title>Shop Birthday Prints - Birthday Rank</title>
	<meta name="description" content="Get a personalized, print-ready birthday rarity visualization based on 21 years of U.S. birth data." />
</svelte:head>

<nav class="site-header">
	<div class="header-content">
		<a href="/" class="site-logo">BirthdayRank.com</a>
	</div>
</nav>

<main>
	<header>
		<h1>Get your personalized birthday print</h1>
		<p class="subtitle">
			High-resolution, vector-based PDF that prints beautifully at any size — perfect for framing.
		</p>
	</header>

	<div class="shop-container">
		<div class="picker-section">
			<h2>Select your birthday</h2>
			<div class="picker-form">
				<label class="picker-label">
					<span>Month:</span>
					<select value={selectedMonth} onchange={handleMonthChange}>
						<option value={0}>Select month</option>
						{#each months as month}
							<option value={month.value}>{month.label}</option>
						{/each}
					</select>
				</label>

				<label class="picker-label">
					<span>Day:</span>
					<select value={selectedDay} onchange={handleDayChange} disabled={!selectedMonth}>
						<option value={0}>Select day</option>
						{#each availableDays as day}
							<option value={day}>{day}</option>
						{/each}
					</select>
				</label>
			</div>

			{#if selectedData && rarity}
				<div class="preview">
					<h3>An example of what you'll get</h3>
					
					<div class="example-image">
						<img src="/exmaple.png" alt="Example birthday print showing heatmap and stats" />
						<p class="example-caption">Sample print showing the complete design</p>
					</div>

					<div class="text-preview-section">
						<h4>Your personalized text will say:</h4>
						<div class="preview-content">
							<p class="preview-headline">
								Your birthday is <strong class="rarity-label">{rarity.label}</strong>
							</p>
							<p class="preview-details">
								<strong>{formatDate(selectedData.month, selectedData.day)}</strong> ranks 
								<strong>{selectedData.rankLabel}</strong> out of 366 days, with an average of 
								<strong>{selectedData.value.toLocaleString()}</strong> births per day.
							</p>
							{#if famousPeople.length > 0}
								<p class="preview-famous">
									<strong>Famous births:</strong> {famousPeople.length === 1 
										? famousPeople[0].name 
										: famousPeople.slice(0, -1).map(p => p.name).join(', ') + ' and ' + famousPeople[famousPeople.length - 1].name}
								</p>
							{/if}
						</div>
					</div>

					<div class="what-you-get">
						<h4>What's included:</h4>
						<ul>
							<li>Vector-based PDF (3000px × 2400px) — prints crisp at any size</li>
							<li>Optimized for 10" × 8" (scales beautifully to larger sizes)</li>
							<li>Personalized headline showing your birthday's rarity</li>
							<li>Full year heatmap with your date highlighted in yellow</li>
							<li>Famous people who share your birthday</li>
							<li>Data sources cited (CDC NCHS, SSA)</li>
						</ul>
					</div>

					<div class="trust-section">
						<p class="trust-text">
							<strong>How is this made?</strong> Our prints are generated from 21 years of U.S. birth data (1994-2014). 
							<a href="/about" target="_blank">Learn more about our data and methodology →</a>
						</p>
					</div>

					<div class="checkout-section">
						<div class="price">
							<span class="price-label">Price:</span>
							<span class="price-amount">$10</span>
						</div>

						{#if errorMessage}
							<div class="error-message">{errorMessage}</div>
						{/if}

						<button 
							class="checkout-btn" 
							onclick={handleCheckout}
							disabled={isProcessing}
						>
							{isProcessing ? 'Processing...' : 'Buy Now'}
						</button>

						<p class="secure-note">
							🔒 Secure checkout powered by Stripe
						</p>
					</div>
				</div>
			{/if}
		</div>
	</div>
</main>

<style>
	.site-header {
		background: var(--color-footer-bg, #0f0d0c);
		border-bottom: 2px solid var(--color-accent);
	}

	.header-content {
		max-width: 900px;
		margin: 0 auto;
		padding: 16px 24px;
	}

	.site-logo {
		font-family: 'Fraunces', Georgia, serif;
		font-size: 18px;
		font-weight: 700;
		color: var(--color-text);
		text-decoration: none;
	}

	.site-logo:hover {
		color: var(--color-accent);
	}

	main {
		max-width: 700px;
		margin: 0 auto;
		padding: 24px 24px 60px;
	}

	header {
		margin-bottom: 40px;
		text-align: center;
	}

	h1 {
		font-size: clamp(1.75rem, 5vw, 2.5rem);
		font-weight: 700;
		margin: 0 0 12px 0;
		color: var(--color-text);
		line-height: 1.1;
	}

	.subtitle {
		font-size: clamp(1rem, 2.5vw, 1.125rem);
		color: var(--color-text-muted);
		margin: 0;
		line-height: 1.5;
	}

	.shop-container {
		background: var(--color-result-bg);
		border-radius: 12px;
		padding: 32px;
	}

	h2 {
		font-size: 1.5rem;
		font-weight: 600;
		margin: 0 0 20px 0;
		color: var(--color-text);
	}

	.picker-form {
		display: flex;
		gap: 16px;
		margin-bottom: 32px;
	}

	.picker-label {
		display: flex;
		flex-direction: column;
		gap: 8px;
		flex: 1;
	}

	.picker-label span {
		font-size: 14px;
		font-weight: 600;
		color: var(--color-text);
	}

	select {
		padding: 12px 16px;
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

	.preview {
		padding-top: 32px;
		border-top: 1px solid var(--color-border);
	}

	h3 {
		font-size: 1.25rem;
		font-weight: 600;
		margin: 0 0 16px 0;
		color: var(--color-text);
	}

	.example-image {
		margin-bottom: 24px;
		text-align: center;
	}

	.example-image img {
		width: 100%;
		max-width: 600px;
		height: auto;
		border-radius: 8px;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
		margin-bottom: 8px;
	}

	.example-caption {
		font-size: 13px;
		color: var(--color-text-muted);
		font-style: italic;
		margin: 0;
	}

	.text-preview-section {
		margin-bottom: 24px;
	}

	.text-preview-section h4 {
		font-size: 1rem;
		font-weight: 600;
		color: var(--color-text);
		margin: 0 0 12px 0;
	}

	.preview-content {
		background: var(--color-bg);
		padding: 20px;
		border-radius: 8px;
		margin-bottom: 24px;
	}

	.preview-headline {
		font-size: 1.25rem;
		margin: 0 0 12px 0;
		color: var(--color-text);
	}

	.rarity-label {
		color: var(--color-accent);
	}

	.preview-details {
		font-size: 15px;
		color: var(--color-text-muted);
		margin: 0 0 12px 0;
		line-height: 1.5;
	}

	.preview-details strong {
		color: var(--color-text);
	}

	.preview-famous {
		font-size: 14px;
		color: var(--color-text-muted);
		margin: 0;
		padding-top: 12px;
		border-top: 1px solid var(--color-border);
	}

	.preview-famous strong {
		color: var(--color-text);
	}

	.what-you-get {
		background: rgba(247, 104, 161, 0.05);
		padding: 20px;
		border-radius: 8px;
		margin-bottom: 24px;
	}

	h4 {
		font-size: 1rem;
		font-weight: 600;
		margin: 0 0 12px 0;
		color: var(--color-text);
	}

	ul {
		margin: 0;
		padding-left: 20px;
	}

	li {
		font-size: 14px;
		color: var(--color-text-muted);
		line-height: 1.7;
	}

	.trust-section {
		background: var(--color-bg);
		padding: 16px 20px;
		border-radius: 8px;
		border: 1px solid var(--color-border);
		margin-bottom: 24px;
	}

	.trust-text {
		font-size: 14px;
		color: var(--color-text-muted);
		line-height: 1.6;
		margin: 0;
	}

	.trust-text strong {
		color: var(--color-text);
	}

	.trust-text a {
		color: var(--color-accent);
		text-decoration: none;
		font-weight: 500;
	}

	.trust-text a:hover {
		text-decoration: underline;
	}

	.checkout-section {
		text-align: center;
	}

	.price {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 12px;
		margin-bottom: 20px;
	}

	.price-label {
		font-size: 18px;
		color: var(--color-text-muted);
	}

	.price-amount {
		font-size: 32px;
		font-weight: 700;
		color: var(--color-accent);
	}

	.error-message {
		padding: 12px;
		margin-bottom: 16px;
		background: rgba(220, 38, 38, 0.1);
		border: 1px solid rgba(220, 38, 38, 0.3);
		border-radius: 6px;
		color: #dc2626;
		font-size: 14px;
	}

	.checkout-btn {
		width: 100%;
		max-width: 300px;
		padding: 16px 32px;
		font-size: 18px;
		font-weight: 600;
		color: #fff;
		background: var(--color-accent);
		border: none;
		border-radius: 8px;
		cursor: pointer;
		transition: opacity 0.15s ease;
	}

	.checkout-btn:hover:not(:disabled) {
		opacity: 0.9;
	}

	.checkout-btn:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.secure-note {
		margin-top: 12px;
		font-size: 13px;
		color: var(--color-text-muted);
	}

	@media (max-width: 600px) {
		.shop-container {
			padding: 24px 20px;
		}

		.picker-form {
			flex-direction: column;
		}
	}
</style>
