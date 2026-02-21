<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { formatDate } from '$lib/utils';

	let isLoading = $state(true);
	let errorMessage = $state('');
	let downloadToken = $state('');
	let month = $state(0);
	let day = $state(0);

	onMount(async () => {
		const sessionId = $page.url.searchParams.get('session_id');
		
		if (!sessionId) {
			errorMessage = 'No session ID provided';
			isLoading = false;
			return;
		}

		try {
			const response = await fetch(`/api/verify-session?session_id=${sessionId}`);
			const result = await response.json();

			if (response.ok && result.success) {
				month = result.month;
				day = result.day;
				downloadToken = result.token;
				isLoading = false;
			} else {
				errorMessage = result.error || 'Failed to verify payment';
				isLoading = false;
			}
		} catch (err) {
			errorMessage = 'An error occurred while verifying your payment';
			isLoading = false;
		}
	});

	function handleDownload() {
		if (downloadToken && month && day) {
			const downloadUrl = `/api/download?token=${encodeURIComponent(downloadToken)}&month=${month}&day=${day}`;
			window.location.href = downloadUrl;
		}
	}
</script>

<svelte:head>
	<title>Purchase Complete - Birthday Rank</title>
</svelte:head>

<nav class="site-header">
	<div class="header-content">
		<a href="/" class="site-logo">BirthdayRank.com</a>
	</div>
</nav>

<main>
	{#if isLoading}
		<div class="loading-container">
			<div class="spinner"></div>
			<p>Verifying your payment...</p>
		</div>
	{:else if errorMessage}
		<div class="error-container">
			<h1>❌ Something went wrong</h1>
			<p class="error-text">{errorMessage}</p>
			<a href="/shop" class="btn-secondary">Back to Shop</a>
		</div>
	{:else}
		<div class="success-container">
			<div class="success-icon">✓</div>
			<h1>Payment successful!</h1>
			<p class="success-message">
				Your personalized birthday print for <strong>{formatDate(month, day)}</strong> is ready to download.
			</p>

			<div class="download-section">
				<button class="download-btn" onclick={handleDownload}>
					Download Your Print (PDF)
				</button>
				<p class="download-note">
					Click the button above to download your high-resolution PDF. You can print it at home or take it to a professional printer.
				</p>
			</div>

			<div class="next-steps">
				<h2>What's next?</h2>
				<ul>
					<li>Download your PDF (link expires in 1 hour)</li>
					<li>Print at 10" × 8" for best results</li>
					<li>Frame it or give it as a gift</li>
					<li>Share it on social media and tag us!</li>
				</ul>
			</div>

			<div class="footer-links">
				<a href="/">Back to Birthday Rank</a>
				<span>•</span>
				<a href="/shop">Buy Another Print</a>
			</div>
		</div>
	{/if}
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
		max-width: 600px;
		margin: 0 auto;
		padding: 60px 24px;
		text-align: center;
	}

	.loading-container {
		padding: 40px 0;
	}

	.spinner {
		width: 48px;
		height: 48px;
		margin: 0 auto 20px;
		border: 4px solid var(--color-border);
		border-top-color: var(--color-accent);
		border-radius: 50%;
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		to { transform: rotate(360deg); }
	}

	.loading-container p {
		color: var(--color-text-muted);
		font-size: 16px;
	}

	.error-container {
		padding: 40px 0;
	}

	h1 {
		font-size: clamp(1.75rem, 5vw, 2.5rem);
		font-weight: 700;
		margin: 0 0 16px 0;
		color: var(--color-text);
	}

	.error-text {
		font-size: 16px;
		color: var(--color-text-muted);
		margin: 0 0 32px 0;
	}

	.btn-secondary {
		display: inline-block;
		padding: 12px 24px;
		font-size: 16px;
		font-weight: 600;
		color: var(--color-text);
		background: transparent;
		border: 2px solid var(--color-border);
		border-radius: 8px;
		text-decoration: none;
		transition: border-color 0.15s ease;
	}

	.btn-secondary:hover {
		border-color: var(--color-accent);
	}

	.success-container {
		padding: 20px 0;
	}

	.success-icon {
		width: 80px;
		height: 80px;
		margin: 0 auto 24px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 48px;
		color: #fff;
		background: var(--color-accent);
		border-radius: 50%;
	}

	.success-message {
		font-size: 18px;
		color: var(--color-text-muted);
		margin: 0 0 40px 0;
		line-height: 1.6;
	}

	.success-message strong {
		color: var(--color-text);
	}

	.download-section {
		margin-bottom: 48px;
	}

	.download-btn {
		width: 100%;
		max-width: 400px;
		padding: 18px 32px;
		font-size: 18px;
		font-weight: 600;
		color: #fff;
		background: var(--color-accent);
		border: none;
		border-radius: 8px;
		cursor: pointer;
		transition: opacity 0.15s ease;
		margin-bottom: 16px;
	}

	.download-btn:hover {
		opacity: 0.9;
	}

	.download-note {
		font-size: 14px;
		color: var(--color-text-muted);
		margin: 0;
	}

	.next-steps {
		background: var(--color-result-bg);
		padding: 28px;
		border-radius: 12px;
		margin-bottom: 32px;
	}

	h2 {
		font-size: 1.25rem;
		font-weight: 600;
		margin: 0 0 16px 0;
		color: var(--color-text);
	}

	ul {
		text-align: left;
		margin: 0;
		padding-left: 24px;
	}

	li {
		font-size: 15px;
		color: var(--color-text-muted);
		line-height: 1.8;
	}

	.footer-links {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 12px;
		font-size: 14px;
	}

	.footer-links a {
		color: var(--color-accent);
		text-decoration: none;
	}

	.footer-links a:hover {
		text-decoration: underline;
	}

	.footer-links span {
		color: var(--color-text-muted);
	}
</style>
