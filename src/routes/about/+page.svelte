<script lang="ts">
	import Footer from '$lib/components/Footer.svelte';
</script>

<svelte:head>
	<title>About - Birthday Rank</title>
</svelte:head>

<nav class="site-header">
	<div class="header-content">
		<a href="/" class="site-logo">BirthdayRank.com</a>
	</div>
</nav>

<main>
	<h1>About Birthday Rank</h1>

	<section>
		<h2>What is this?</h2>
		<p>
			Birthday Rank is an interactive visualization showing how common (or rare) your birthday is compared to all other days of the year. 
			Ever wondered if your birthday is special? Now you can find out with data.
		</p>
	</section>

	<section>
		<h2>The data</h2>
		<p>
			The visualization is based on U.S. birth records from 1994 to 2014 — a 21-year period covering over 78 million births. 
			The data comes from two authoritative sources:
		</p>
		<ul>
			<li><strong>CDC National Center for Health Statistics (NCHS)</strong> — Birth certificate data</li>
			<li><strong>Social Security Administration (SSA)</strong> — Birth registration records</li>
		</ul>
		<p>
			The dataset was compiled and published by FiveThirtyEight as part of their data journalism work. 
			Famous birthday information comes from the Little-Big-Data project.
		</p>
	</section>

	<section>
		<h2>How it works</h2>
		<p>
			For each day of the year (all 366, including February 29th), we calculated the average number of births per day 
			across the 21-year period. We then ranked all days from most common (#1) to least common (#366).
		</p>
		<p>
			The heatmap uses color to show relative frequency:
		</p>
		<ul>
			<li><strong>Darker purple</strong> = more births (more common birthdays)</li>
			<li><strong>Lighter pink</strong> = fewer births (rarer birthdays)</li>
		</ul>
		<p>
			You'll notice clear patterns — September has the most birthdays (conception around the holidays), 
			while major holidays like Christmas and New Year's Day have far fewer births.
		</p>
	</section>

	<section>
		<h2>Why do some dates have fewer births?</h2>
		<p>
			Several factors affect birth frequency:
		</p>
		<ul>
			<li><strong>Scheduled births</strong> — Doctors and parents often avoid scheduling C-sections and induced labors on holidays</li>
			<li><strong>Hospital staffing</strong> — Reduced medical staff on holidays means fewer elective procedures</li>
			<li><strong>Seasonal conception patterns</strong> — Human behavior follows patterns (hello, Valentine's Day babies in November)</li>
			<li><strong>Cultural preferences</strong> — Some parents specifically request or avoid certain dates</li>
		</ul>
	</section>

	<section>
		<h2>The prints</h2>
		<p>
			Our personalized prints show your specific birthday's rarity, rank, and stats in a beautiful, print-ready format. 
			Each print includes:
		</p>
		<ul>
			<li>Personalized headline showing how common your birthday is</li>
			<li>Your birthday's rank out of 366 days</li>
			<li>Average daily births for your date</li>
			<li>Full year heatmap with your date highlighted</li>
			<li>Famous people who share your birthday</li>
		</ul>
		<p>
			Perfect for framing or giving as a unique gift.
		</p>
	</section>

	<section>
		<h2>Who made this?</h2>
		<p>
			Birthday Rank was created by Matt Stiles, a data journalist and developer. The visualization is built with 
			SvelteKit and D3.js. The print generation uses Puppeteer to create high-quality PDFs.
		</p>
	</section>

	<section>
		<h2>Questions?</h2>
		<p>
			If you have questions about the data, the prints, or anything else, <a href="/contact">contact us</a>.
		</p>
	</section>
</main>

<Footer />

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
		max-width: 800px;
		margin: 0 auto;
		padding: 40px 24px 60px;
	}

	h1 {
		font-size: clamp(2rem, 5vw, 2.5rem);
		font-weight: 700;
		margin: 0 0 40px 0;
		color: var(--color-text);
	}

	section {
		margin-bottom: 40px;
	}

	h2 {
		font-size: 1.5rem;
		font-weight: 600;
		margin: 0 0 12px 0;
		color: var(--color-text);
	}

	p {
		font-size: 16px;
		line-height: 1.7;
		color: var(--color-text-muted);
		margin: 0 0 16px 0;
	}

	ul {
		margin: 0 0 16px 0;
		padding-left: 24px;
	}

	li {
		font-size: 16px;
		line-height: 1.7;
		color: var(--color-text-muted);
		margin-bottom: 8px;
	}

	strong {
		color: var(--color-text);
	}

	a {
		color: var(--color-accent);
		text-decoration: underline;
	}

	a:hover {
		text-decoration: none;
	}
</style>
