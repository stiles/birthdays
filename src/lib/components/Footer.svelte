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
					<a href="https://github.com/stiles/birthdays" class="footer-link" target="_blank" rel="noopener noreferrer">Code</a>
					<a href="https://github.com/fivethirtyeight/data/tree/master/births" class="footer-link" target="_blank" rel="noopener noreferrer">Data</a>
					<a href="https://buymeacoffee.com/mattstiles" class="footer-link" target="_blank" rel="noopener noreferrer">Buy me coffee?</a>
				</div>
				<div class="footer-meta">
					Birth data from 1994-2014 via <a href="https://github.com/fivethirtyeight/data/tree/master/births">FiveThirtyEight</a> (CDC NCHS, SSA). Famous birthdays from <a href="https://github.com/richard512/Little-Big-Data">Little-Big-Data</a>.
				</div>
			</div>
			<div class="footer-social">
				<a href="https://github.com/stiles/birthdays" class="footer-social-link" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
					<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
						<path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
					</svg>
				</a>
				<a href="https://x.com/stiles" class="footer-social-link" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)">
					<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
						<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
					</svg>
				</a>
			</div>
		</div>
		<div class="footer-bottom">
			<p class="footer-copyright">&copy; {currentYear} <a href="https://mattstiles.me">Matt Stiles</a> (May 11th)</p>
		</div>
	</div>
</footer>

<style>
	.site-footer {
		background: var(--color-footer-bg, #0f0d0c);
		border-top: 4px solid var(--color-accent);
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

