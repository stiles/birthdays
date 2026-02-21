<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import Heatmap from '$lib/components/Heatmap.svelte';
	import Legend from '$lib/components/Legend.svelte';
	import BirthdayPicker from '$lib/components/BirthdayPicker.svelte';
	import ShareCard from '$lib/components/ShareCard.svelte';
	import RankingTables from '$lib/components/RankingTables.svelte';
	import DistributionChart from '$lib/components/DistributionChart.svelte';
	import ZodiacBreakdown from '$lib/components/ZodiacBreakdown.svelte';
	import CompareBirthdays from '$lib/components/CompareBirthdays.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import Tooltip from '$lib/components/Tooltip.svelte';
	import birthdayData from '$lib/data/birthdays.json';
	import type { BirthdayData } from '$lib/types';

	const data = birthdayData as BirthdayData[];

	let selectedDate: { month: number; day: number } | null = $state(null);
	let initialFriendDate: { month: number; day: number } | null = $state(null);
	let hoveredData: BirthdayData | null = $state(null);
	let tooltipX = $state(0);
	let tooltipY = $state(0);
	let tooltipVisible = $state(false);

	let selectedData = $derived(
		selectedDate
			? data.find(d => d.month === selectedDate.month && d.day === selectedDate.day)
			: null
	);

	function handleDateSelect(date: { month: number; day: number } | null) {
		selectedDate = date;
		if (browser) {
			if (date) {
				const hash = `#${date.month}-${date.day}`;
				history.replaceState(null, '', hash);
			} else {
				history.replaceState(null, '', window.location.pathname);
			}
		}
	}

	function handleDateHover(date: BirthdayData | null) {
		hoveredData = date;
		tooltipVisible = !!date;
	}

	function handleMouseMove(e: MouseEvent) {
		tooltipX = e.clientX;
		tooltipY = e.clientY;
	}

	onMount(() => {
		// Parse hash on load - supports both #2-17 and #2-17&9-22 (compare) formats
		const hash = window.location.hash.slice(1);
		if (hash) {
			const parts = hash.split('&');
			
			// Parse first birthday (yours)
			const [month, day] = parts[0].split('-').map(Number);
			if (month >= 1 && month <= 12 && day >= 1 && day <= 31) {
				const dateData = data.find(d => d.month === month && d.day === day);
				if (dateData) {
					selectedDate = { month, day };
				}
			}
			
			// Parse second birthday (friend's) if present
			if (parts[1]) {
				const [friendMonth, friendDay] = parts[1].split('-').map(Number);
				if (friendMonth >= 1 && friendMonth <= 12 && friendDay >= 1 && friendDay <= 31) {
					const friendData = data.find(d => d.month === friendMonth && d.day === friendDay);
					if (friendData) {
						initialFriendDate = { month: friendMonth, day: friendDay };
					}
				}
			}
		}
	});

	const siteUrl = 'https://birthdayrank.com';
	const title = 'How common is your birthday?';
	const description = 'Find out how your birthday ranks among all 366 days, which famous people share it, your zodiac sign popularity, and compare with friends. Explore U.S. birth frequency data from 1994-2014.';
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<meta name="author" content="Matt Stiles" />
	<meta name="robots" content="index, follow" />
	<link rel="canonical" href={siteUrl} />
	
	<!-- Open Graph -->
	<meta property="og:type" content="website" />
	<meta property="og:site_name" content="Birthday Rank" />
	<meta property="og:url" content={siteUrl} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:image" content="{siteUrl}/og-image.png" />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:image:alt" content="Birthday Rank - Find out how common your birthday is" />
	
	<!-- Twitter -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:site" content="@stiles" />
	<meta name="twitter:creator" content="@stiles" />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content="{siteUrl}/og-image.png" />
</svelte:head>

<svelte:window onmousemove={handleMouseMove} />

<nav class="site-header">
	<div class="header-content">
		<a href="/" class="site-logo">BirthdayRank.com</a>
	</div>
</nav>

<main>
	<header>
		<h1>How common is your birthday?</h1>
		<p class="subtitle">
			Explore U.S. birth frequency data from 1994-2014. See how your birthday ranks, discover which celebrities share it, check your zodiac sign's popularity and compare with friends.
		</p>
		<div class="header-cta">
			<span class="header-cta-text">Get a personalized print of your birthday</span>
			<a href="/shop" class="header-cta-btn">
				Order now →
			</a>
		</div>
	</header>

	<section class="picker-section">
		<BirthdayPicker
			{data}
			{selectedDate}
			onDateSelect={handleDateSelect}
		/>
	</section>

	<section class="chart-section">
		<Legend />
		<Heatmap
			{data}
			{selectedDate}
			onDateSelect={handleDateSelect}
			onDateHover={handleDateHover}
		/>
	</section>

	{#if selectedData}
		<section class="share-section">
			<ShareCard data={selectedData} />
		</section>
	{/if}

	<section class="distribution-section">
		<DistributionChart 
			{data} 
			{selectedDate} 
			onDateSelect={handleDateSelect} 
		/>
	</section>

	<section class="compare-section">
		<CompareBirthdays {data} {selectedDate} {initialFriendDate} />
	</section>

	<section class="zodiac-section">
		<ZodiacBreakdown {data} {selectedDate} />
	</section>

	<section class="tables-section">
		<RankingTables {data} />
	</section>
</main>

<Footer />

<Tooltip
	data={hoveredData}
	x={tooltipX}
	y={tooltipY}
	visible={tooltipVisible}
/>

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
		max-width: 900px;
		margin: 0 auto;
		padding: 24px 24px 40px;
	}

	header {
		margin-bottom: 36px;
	}

	h1 {
		font-size: clamp(2rem, 6vw, 3rem);
		font-weight: 700;
		margin: 0 0 16px 0;
		color: var(--color-text);
		line-height: 1.1;
	}

	.subtitle {
		font-size: clamp(1rem, 2.5vw, 1.25rem);
		color: var(--color-text-muted);
		margin: 0 0 20px 0;
		line-height: 1.5;
		max-width: 640px;
	}

	.header-cta {
		display: flex;
		align-items: center;
		gap: 16px;
		margin-top: 20px;
		padding: 14px 20px;
		background: rgba(247, 104, 161, 0.08);
		border: 1px solid rgba(247, 104, 161, 0.3);
		border-radius: 8px;
		max-width: fit-content;
	}

	.header-cta-text {
		font-size: 15px;
		color: var(--color-text-muted);
		font-weight: 500;
	}

	.header-cta-btn {
		flex-shrink: 0;
		padding: 8px 18px;
		font-size: 14px;
		font-weight: 600;
		color: #fff;
		background: var(--color-accent);
		border-radius: 6px;
		text-decoration: none;
		transition: opacity 0.15s ease;
		white-space: nowrap;
	}

	.header-cta-btn:hover {
		opacity: 0.85;
	}

	@media (max-width: 600px) {
		.header-cta {
			flex-direction: column;
			align-items: stretch;
			text-align: center;
			max-width: 100%;
		}
	}

	.picker-section {
		margin-bottom: 32px;
	}

	.chart-section {
		margin-bottom: 40px;
	}

	.share-section {
		margin-bottom: 40px;
	}

	.distribution-section {
		margin-bottom: 40px;
	}

	.compare-section {
		margin-bottom: 40px;
	}

	.zodiac-section {
		margin-bottom: 40px;
	}

	.tables-section {
		margin-bottom: 40px;
	}
</style>
