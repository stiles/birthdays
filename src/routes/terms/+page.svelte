<script lang="ts">
	import Footer from '$lib/components/Footer.svelte';
</script>

<svelte:head>
	<title>Terms of Service - Birthday Rank</title>
</svelte:head>

<nav class="site-header">
	<div class="header-content">
		<a href="/" class="site-logo">BirthdayRank.com</a>
	</div>
</nav>

<main>
	<h1>Terms of Service</h1>
	<p class="last-updated">Last updated: February 21, 2026</p>

	<section>
		<h2>Agreement to terms</h2>
		<p>
			By accessing Birthday Rank and purchasing digital products, you agree to these Terms of Service. 
			If you do not agree, please do not use our service.
		</p>
	</section>

	<section>
		<h2>Product description</h2>
		<p>
			Birthday Rank sells personalized digital print files (PDFs) showing birthday rarity statistics based on 
			U.S. birth data from 1994-2014. Files are delivered electronically via download link.
		</p>
		<p>
			The data visualizations are based on publicly available CDC and Social Security Administration data, 
			processed and presented by Birthday Rank.
		</p>
	</section>

	<section>
		<h2>Purchase and payment</h2>
		<ul>
			<li>All prices are in U.S. dollars</li>
			<li>Payment is processed securely through Stripe</li>
			<li>You will receive a download link within 1 hour of purchase</li>
			<li>Download links expire after 1 hour for security reasons</li>
		</ul>
	</section>

	<section>
		<h2>Refund policy</h2>
		<p>
			Due to the nature of digital products, all sales are final once the download link has been accessed. 
			If you experience technical issues preventing download, please <a href="/contact">contact us</a> within 24 hours of purchase.
		</p>
	</section>

	<section>
		<h2>License and usage</h2>
		<p>
			When you purchase a print, you receive a personal, non-transferable license to:
		</p>
		<ul>
			<li>Download and print the file for personal use</li>
			<li>Print physical copies for yourself or as gifts</li>
		</ul>
		<p>
			You may not:
		</p>
		<ul>
			<li>Resell, redistribute, or share the digital file</li>
			<li>Use the print for commercial purposes</li>
			<li>Modify the print and claim it as your own work</li>
		</ul>
	</section>

	<section>
		<h2>Intellectual property</h2>
		<p>
			The Birthday Rank website, visualizations, and design are protected by copyright and owned by Matt Stiles. 
			The underlying birth data is from public sources (CDC, SSA via FiveThirtyEight).
		</p>
	</section>

	<section>
		<h2>Disclaimer</h2>
		<p>
			Birthday Rank provides data visualizations for entertainment and informational purposes. While we strive 
			for accuracy, we make no warranties about the completeness or reliability of the data.
		</p>
		<p>
			The service is provided "as is" without warranties of any kind, express or implied.
		</p>
	</section>

	<section>
		<h2>Limitation of liability</h2>
		<p>
			Birthday Rank shall not be liable for any indirect, incidental, special, or consequential damages arising 
			from your use of the service or purchase of products.
		</p>
	</section>

	<section>
		<h2>Changes to terms</h2>
		<p>
			We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting. 
			Your continued use of the service constitutes acceptance of modified terms.
		</p>
	</section>

	<section>
		<h2>Governing law</h2>
		<p>
			These terms are governed by the laws of the United States. Any disputes shall be resolved in applicable courts.
		</p>
	</section>

	<section>
		<h2>Contact</h2>
		<p>
			Questions about these terms? <a href="/contact">Contact us</a>.
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
		margin: 0 0 8px 0;
		color: var(--color-text);
	}

	.last-updated {
		font-size: 14px;
		color: var(--color-text-muted);
		margin: 0 0 40px 0;
	}

	section {
		margin-bottom: 32px;
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

	a {
		color: var(--color-accent);
		text-decoration: underline;
	}

	a:hover {
		text-decoration: none;
	}
</style>
