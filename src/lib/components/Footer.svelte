<script lang="ts">
	const currentYear = new Date().getFullYear();
</script>

<footer class="site-footer">
	<div class="footer-content">
		<div class="footer-main">
			<div class="footer-info">
				<h3 class="footer-title">Birthday Rank</h3>
				<p class="footer-description">
					An interactive visualization showing the relative frequency of birthdays in the United States, built with SvelteKit and D3.
				</p>
				<div class="footer-links">
					<a href="/about" class="footer-link">About</a>
					<a href="/shop" class="footer-link">Shop prints</a>
					<a href="/contact" class="footer-link">Contact</a>
					<a href="/privacy" class="footer-link">Privacy</a>
					<a href="/terms" class="footer-link">Terms</a>
				</div>
				<div class="footer-meta">
					Birth data from 1994-2014 via FiveThirtyEight (CDC NCHS, SSA). Famous birthdays from Little-Big-Data.
				</div>
			</div>
		</div>
		<div class="footer-bottom">
			<p class="footer-copyright">&copy; {currentYear} Birthday Rank</p>
		</div>
	</div>
</footer>

<style>
	.site-footer {
		background: var(--color-footer-bg, #0f0d0c);
		border-top: 2px solid var(--color-accent);
		margin-top: 60px;
	}

	.footer-content {
		max-width: 900px;
		margin: 0 auto;
		padding: 40px 24px 24px;
	}

	.footer-main {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: 32px;
		margin-bottom: 24px;
	}

	.footer-info {
		flex: 1;
	}

	.footer-title {
		font-family: 'Fraunces', Georgia, serif;
		font-size: 20px;
		font-weight: 700;
		color: var(--color-text);
		margin: 0 0 12px 0;
	}

	.footer-description {
		font-size: 14px;
		color: var(--color-text-muted);
		margin: 0 0 16px 0;
		line-height: 1.5;
		max-width: 500px;
	}

	.footer-links {
		display: flex;
		flex-wrap: wrap;
		gap: 8px 20px;
		margin-bottom: 16px;
	}

	.footer-link {
		font-size: 14px;
		font-weight: 500;
		color: var(--color-accent);
		text-decoration: none;
	}

	.footer-link:hover {
		text-decoration: underline;
	}

	.footer-meta {
		font-size: 13px;
		color: var(--color-text-muted);
		opacity: 0.7;
	}

	.footer-meta a {
		color: var(--color-text-muted);
		text-decoration: underline;
	}

	.footer-meta a:hover {
		color: var(--color-text);
	}

	.footer-social {
		display: flex;
		gap: 16px;
	}

	.footer-social-link {
		color: var(--color-text-muted);
		transition: color 0.15s ease;
	}

	.footer-social-link:hover {
		color: var(--color-text);
	}

	.footer-bottom {
		padding-top: 20px;
		border-top: 1px solid var(--color-border);
		text-align: center;
	}

	.footer-copyright {
		font-size: 13px;
		color: var(--color-text-muted);
		margin: 0;
	}

	.footer-copyright a {
		color: var(--color-accent);
		text-decoration: none;
	}

	.footer-copyright a:hover {
		text-decoration: underline;
	}

	@media (max-width: 600px) {
		.footer-main {
			flex-direction: column;
		}

		.footer-social {
			order: -1;
		}
	}
</style>

