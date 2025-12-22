<script lang="ts">
	import type { BirthdayData } from '$lib/types';
	import { formatDate } from '$lib/utils';

	interface Props {
		data: BirthdayData;
		siteUrl?: string;
	}

	let { data, siteUrl = 'https://birthdayrank.com' }: Props = $props();

	let canvas: HTMLCanvasElement;
	let downloading = $state(false);
	let copied = $state(false);

	const shareUrl = $derived(`${siteUrl}#${data.month}-${data.day}`);
	const shareText = $derived(
		`My birthday (${formatDate(data.month, data.day)}) ranks ${data.rankLabel} out of 366! How common is yours?`
	);

	function drawCard(): HTMLCanvasElement {
		const width = 1200;
		const height = 675; // 16:9
		
		canvas.width = width;
		canvas.height = height;
		
		const ctx = canvas.getContext('2d')!;
		
		// Background gradient
		const gradient = ctx.createLinearGradient(0, 0, width, height);
		gradient.addColorStop(0, '#1a1614');
		gradient.addColorStop(1, '#2a2320');
		ctx.fillStyle = gradient;
		ctx.fillRect(0, 0, width, height);
		
		// Decorative accent bar
		ctx.fillStyle = '#f768a1';
		ctx.fillRect(0, 0, 8, height);
		
		// "My birthday" label
		ctx.fillStyle = '#a89f97';
		ctx.font = '500 32px system-ui, -apple-system, sans-serif';
		ctx.fillText('My birthday', 80, 120);
		
		// Date
		ctx.fillStyle = '#f5f0eb';
		ctx.font = '700 72px system-ui, -apple-system, sans-serif';
		ctx.fillText(formatDate(data.month, data.day), 80, 200);
		
		// "ranks" label
		ctx.fillStyle = '#a89f97';
		ctx.font = '500 32px system-ui, -apple-system, sans-serif';
		ctx.fillText('ranks', 80, 300);
		
		// Rank number - big and pink
		ctx.fillStyle = '#f768a1';
		ctx.font = '700 180px system-ui, -apple-system, sans-serif';
		ctx.fillText(data.rankLabel, 80, 480);
		
		// "out of 366"
		ctx.fillStyle = '#a89f97';
		ctx.font = '500 48px system-ui, -apple-system, sans-serif';
		ctx.fillText('out of 366', 80, 550);
		
		// CTA
		ctx.fillStyle = '#6b6158';
		ctx.font = '400 28px system-ui, -apple-system, sans-serif';
		ctx.fillText('Find yours at birthdayrank.com', 80, 630);
		
		// Small heatmap preview decoration (right side)
		const colors = ['#fff7f3', '#fde0dd', '#fcc5c0', '#fa9fb5', '#f768a1', '#dd3497', '#ae017e', '#7a0177', '#49006a'];
		const cellSize = 28;
		const startX = width - 380;
		const startY = 180;
		
		for (let row = 0; row < 12; row++) {
			for (let col = 0; col < 10; col++) {
				const colorIndex = Math.floor(Math.random() * colors.length);
				ctx.fillStyle = colors[colorIndex];
				ctx.fillRect(startX + col * cellSize, startY + row * cellSize, cellSize - 2, cellSize - 2);
			}
		}
		
		return canvas;
	}

	async function downloadImage() {
		downloading = true;
		try {
			drawCard();
			const link = document.createElement('a');
			link.download = `birthday-rank-${data.month}-${data.day}.png`;
			link.href = canvas.toDataURL('image/png');
			link.click();
		} finally {
			downloading = false;
		}
	}

	function shareTwitter() {
		const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
		window.open(url, '_blank', 'width=550,height=420');
	}

	function shareFacebook() {
		const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`;
		window.open(url, '_blank', 'width=550,height=420');
	}

	async function copyLink() {
		await navigator.clipboard.writeText(shareUrl);
		copied = true;
		setTimeout(() => copied = false, 2000);
	}
</script>

<div class="share-container">
	<canvas bind:this={canvas} class="hidden-canvas"></canvas>
	
	<h3 class="share-title">Share your result</h3>
	<p class="share-subtitle">Challenge your friends to find out how their birthday ranks!</p>
	
	<div class="share-buttons">
		<button class="share-btn primary" onclick={downloadImage} disabled={downloading}>
			<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
				<polyline points="7 10 12 15 17 10"/>
				<line x1="12" y1="15" x2="12" y2="3"/>
			</svg>
			{downloading ? 'Saving...' : 'Save image'}
		</button>
		
		<button class="share-btn" onclick={shareTwitter}>
			<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
				<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
			</svg>
			Post on X
		</button>
		
		<button class="share-btn" onclick={shareFacebook}>
			<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
				<path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
			</svg>
			Facebook
		</button>
		
		<button class="share-btn" onclick={copyLink}>
			<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
				<path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
			</svg>
			{copied ? 'Copied!' : 'Copy link'}
		</button>
	</div>
</div>

<style>
	.share-container {
		padding: 24px;
		background: var(--color-result-bg);
		border-radius: 12px;
	}

	.hidden-canvas {
		display: none;
	}

	.share-title {
		font-family: 'Fraunces', Georgia, serif;
		font-size: 20px;
		font-weight: 700;
		color: var(--color-text);
		margin: 0 0 8px 0;
	}

	.share-subtitle {
		font-size: 15px;
		color: var(--color-text-muted);
		margin: 0 0 20px 0;
	}

	.share-buttons {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 10px;
	}

	.share-btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		padding: 12px 16px;
		font-size: 14px;
		font-weight: 500;
		border: 1px solid var(--color-border);
		border-radius: 8px;
		background: var(--color-bg);
		color: var(--color-text);
		cursor: pointer;
		transition: all 0.15s ease;
	}

	.share-btn:hover {
		background: var(--color-border);
	}

	.share-btn:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.share-btn.primary {
		background: var(--color-accent);
		border-color: var(--color-accent);
		color: white;
	}

	.share-btn.primary:hover:not(:disabled) {
		filter: brightness(1.1);
		background: var(--color-accent);
	}

	@media (max-width: 600px) {
		.share-container {
			padding: 20px;
		}

		.share-buttons {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media (max-width: 400px) {
		.share-buttons {
			grid-template-columns: 1fr;
		}
	}
</style>
