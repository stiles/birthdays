<script lang="ts">
	import Footer from '$lib/components/Footer.svelte';
</script>

<svelte:head>
	<title>Privacy Policy - Birthday Rank</title>
</svelte:head>

<nav class="site-header">
	<div class="header-content">
		<a href="/" class="site-logo">BirthdayRank.com</a>
	</div>
</nav>

<main>
	<h1>Privacy Policy</h1>
	<p class="last-updated">Last updated: February 21, 2026</p>

	<section>
		<h2>Information we collect</h2>
		<p>
			When you use Birthday Rank, we collect minimal information:
		</p>
		<ul>
			<li>Birthday dates you select (month and day only, no year or personal identification)</li>
			<li>Payment information processed securely through Stripe (we do not store your card details)</li>
			<li>Email address when you make a purchase (to send your download)</li>
			<li>Basic analytics data (page views, browser type) via Google Analytics</li>
		</ul>
	</section>

	<section>
		<h2>How we use your information</h2>
		<ul>
			<li>To fulfill your order and deliver your purchased print</li>
			<li>To improve the website and user experience</li>
			<li>To respond to support inquiries</li>
		</ul>
		<p>
			We do not sell, rent, or share your personal information with third parties for marketing purposes.
		</p>
	</section>

	<section>
		<h2>Payment processing</h2>
		<p>
			All payments are processed securely through Stripe. We never see or store your credit card information. 
			Stripe's privacy policy can be found at <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer">stripe.com/privacy</a>.
		</p>
	</section>

	<section>
		<h2>Cookies and tracking</h2>
		<p>
			We use Google Analytics to understand how visitors use our site. You can opt out of Google Analytics tracking 
			using browser extensions or your browser's privacy settings.
		</p>
	</section>

	<section>
		<h2>Data retention</h2>
		<p>
			Purchase records are retained for accounting and tax purposes. Download links expire after 1 hour for security.
		</p>
	</section>

	<section>
		<h2>Your rights</h2>
		<p>
			You have the right to:
		</p>
		<ul>
			<li>Request access to your personal data</li>
			<li>Request correction or deletion of your data</li>
			<li>Opt out of marketing communications</li>
		</ul>
		<p>
			Contact us at <a href="/contact">our contact page</a> to exercise these rights.
		</p>
	</section>

	<section>
		<h2>Changes to this policy</h2>
		<p>
			We may update this privacy policy from time to time. The "Last updated" date will reflect when changes were made.
		</p>
	</section>

	<section>
		<h2>Contact</h2>
		<p>
			Questions about privacy? <a href="/contact">Contact us</a>.
		</p>
	</section>
</main>

<Footer />

<style>
	.site-header {
		background: var(--color-footer-bg, #0f0d0c);
		border-top: 2px solid var(--color-accent);
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
