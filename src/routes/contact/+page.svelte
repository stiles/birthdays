<script lang="ts">
	import Footer from '$lib/components/Footer.svelte';

	let name = $state('');
	let email = $state('');
	let message = $state('');
	let isSubmitting = $state(false);
	let submitSuccess = $state(false);
	let submitError = $state('');

	async function handleSubmit(e: Event) {
		e.preventDefault();
		isSubmitting = true;
		submitError = '';
		submitSuccess = false;

		try {
			const response = await fetch('https://formspree.io/f/mqedylpn', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ name, email, message })
			});

			if (response.ok) {
				submitSuccess = true;
				name = '';
				email = '';
				message = '';
			} else {
				submitError = 'Failed to send message. Please try again.';
			}
		} catch (err) {
			submitError = 'An error occurred. Please try again.';
		} finally {
			isSubmitting = false;
		}
	}
</script>

<svelte:head>
	<title>Contact - Birthday Rank</title>
</svelte:head>

<nav class="site-header">
	<div class="header-content">
		<a href="/" class="site-logo">BirthdayRank.com</a>
	</div>
</nav>

<main>
	<header>
		<h1>Contact us</h1>
		<p class="subtitle">
			Have questions about your order or the data? Get in touch.
		</p>
	</header>

	<div class="contact-container">
		{#if submitSuccess}
			<div class="success-message">
				<h2>✓ Message sent!</h2>
				<p>We'll get back to you as soon as possible.</p>
				<button onclick={() => submitSuccess = false} class="btn-secondary">
					Send another message
				</button>
			</div>
		{:else}
			<form onsubmit={handleSubmit}>
				<div class="form-group">
					<label for="name">Name</label>
					<input
						type="text"
						id="name"
						bind:value={name}
						required
						disabled={isSubmitting}
					/>
				</div>

				<div class="form-group">
					<label for="email">Email</label>
					<input
						type="email"
						id="email"
						bind:value={email}
						required
						disabled={isSubmitting}
					/>
				</div>

				<div class="form-group">
					<label for="message">Message</label>
					<textarea
						id="message"
						bind:value={message}
						rows="6"
						required
						disabled={isSubmitting}
					></textarea>
				</div>

				{#if submitError}
					<div class="error-message">{submitError}</div>
				{/if}

				<button type="submit" class="submit-btn" disabled={isSubmitting}>
					{isSubmitting ? 'Sending...' : 'Send message'}
				</button>
			</form>

			<div class="contact-info">
				<h3>Order issues?</h3>
				<p>
					If you haven't received your download link within 1 hour of purchase, please contact us with your order details.
				</p>
			</div>
		{/if}
	</div>
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
		max-width: 600px;
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
	}

	.subtitle {
		font-size: clamp(1rem, 2.5vw, 1.125rem);
		color: var(--color-text-muted);
		margin: 0;
	}

	.contact-container {
		background: var(--color-result-bg);
		padding: 32px;
		border-radius: 12px;
	}

	form {
		margin-bottom: 32px;
	}

	.form-group {
		margin-bottom: 20px;
	}

	label {
		display: block;
		margin-bottom: 6px;
		font-size: 14px;
		font-weight: 600;
		color: var(--color-text);
	}

	input,
	textarea {
		width: 100%;
		padding: 10px 12px;
		font-size: 15px;
		border: 2px solid var(--color-border);
		border-radius: 6px;
		background: var(--color-bg);
		color: var(--color-text);
		font-family: inherit;
		transition: border-color 0.15s ease;
	}

	input:focus,
	textarea:focus {
		outline: none;
		border-color: var(--color-accent);
	}

	input:disabled,
	textarea:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	textarea {
		resize: vertical;
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

	.submit-btn {
		width: 100%;
		padding: 12px;
		font-size: 16px;
		font-weight: 600;
		color: #fff;
		background: var(--color-accent);
		border: none;
		border-radius: 6px;
		cursor: pointer;
		transition: opacity 0.15s ease;
	}

	.submit-btn:hover:not(:disabled) {
		opacity: 0.9;
	}

	.submit-btn:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.success-message {
		text-align: center;
		padding: 40px 20px;
	}

	.success-message h2 {
		font-size: 1.5rem;
		color: var(--color-text);
		margin: 0 0 12px 0;
	}

	.success-message p {
		color: var(--color-text-muted);
		margin: 0 0 24px 0;
	}

	.btn-secondary {
		padding: 10px 20px;
		font-size: 14px;
		font-weight: 600;
		color: var(--color-text);
		background: transparent;
		border: 2px solid var(--color-border);
		border-radius: 6px;
		cursor: pointer;
		transition: border-color 0.15s ease;
	}

	.btn-secondary:hover {
		border-color: var(--color-accent);
	}

	.contact-info {
		padding-top: 24px;
		border-top: 1px solid var(--color-border);
	}

	.contact-info h3 {
		font-size: 1rem;
		font-weight: 600;
		color: var(--color-text);
		margin: 0 0 8px 0;
	}

	.contact-info p {
		font-size: 14px;
		color: var(--color-text-muted);
		line-height: 1.6;
		margin: 0;
	}

	@media (max-width: 600px) {
		.contact-container {
			padding: 24px 20px;
		}
	}
</style>
