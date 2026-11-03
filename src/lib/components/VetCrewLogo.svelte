<script lang="ts">
	import { onMount } from 'svelte';
	import { MediaQuery } from 'svelte/reactivity';
	import { LogoPhysics, pawPad, textVetCrew, textEmergency } from './vetCrewLogoPhysics.svelte';

	interface Props {
		compact?: boolean;
		onclick?: () => void;
	}

	let { compact = false, onclick }: Props = $props();

	const isMobile = new MediaQuery('(max-width: 768px), (pointer: coarse)');
	const prefersReducedMotion = new MediaQuery('(prefers-reduced-motion: reduce)');

	let svgElement = $state<SVGSVGElement | null>(null);
	const physics = new LogoPhysics();

	onMount(() => {
		return physics.start(svgElement, isMobile.current, prefersReducedMotion.current);
	});
</script>

<div class="logo-container" class:is-compact={compact} {onclick} role="presentation">
	<div
		class="logo-stage"
		style="transform: perspective(1200px) rotateX({physics.smoothTiltX.toFixed(
			2
		)}deg) rotateY({physics.smoothTiltY.toFixed(2)}deg);"
	>
		<svg
			bind:this={svgElement}
			class="vet-crew-svg"
			viewBox="0 0 970.62 970.62"
			xmlns="http://www.w3.org/2000/svg"
		>
			<defs>
				<radialGradient
					id="specular-highlight"
					cx="{physics.glowX.toFixed(1)}%"
					cy="{physics.glowY.toFixed(1)}%"
					r="75%"
				>
					<stop offset="0%" stop-color="#ffffff" stop-opacity="0.18" />
					<stop offset="40%" stop-color="#ffffff" stop-opacity="0.05" />
					<stop offset="75%" stop-color="#ffffff" stop-opacity="0.0" />
					<stop offset="100%" stop-color="#000000" stop-opacity="0.12" />
				</radialGradient>

				<linearGradient id="rim-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
					<stop offset="0%" stop-color="#598f3a" stop-opacity="0.8" />
					<stop offset="50%" stop-color="#ffb327" stop-opacity="0.4" />
					<stop offset="100%" stop-color="#13371b" stop-opacity="0.9" />
				</linearGradient>

				<filter id="paw-shadow" x="-10%" y="-10%" width="120%" height="120%">
					<feDropShadow
						dx="0"
						dy="8"
						stdDeviation="12"
						flood-color="#000000"
						flood-opacity="0.32"
					/>
				</filter>
			</defs>

			<!-- 1. Background Circle -->
			<circle
				id="bg-circle"
				cx="485.31"
				cy="485.31"
				r="461.76"
				fill="var(--logo-bg-circle)"
				stroke="url(#rim-gradient)"
				stroke-width="5"
			/>

			<!-- 2. Specular Sheen Overlay -->
			<circle
				class="sheen-overlay"
				cx="485.31"
				cy="485.31"
				r="461.76"
				fill="url(#specular-highlight)"
				pointer-events="none"
			/>

			<!-- 3. Logo Content Group -->
			<g id="logo-content" transform="translate(0, 55)">
				<g id="paw" fill="var(--logo-paw)" filter="url(#paw-shadow)">
					{#each physics.toes as toe (toe.def.id)}
						<g
							transform="translate({toe.currX.toFixed(2)}, {toe.currY.toFixed(2)}) translate({toe
								.def.cx}, {toe.def.cy}) rotate({toe.currRot.toFixed(
								2
							)}) scale({toe.currScale.toFixed(3)}) translate(-{toe.def.cx}, -{toe.def.cy})"
						>
							<path id={toe.def.id} d={toe.def.d} />
						</g>
					{/each}

					<g
						transform="translate({physics.padTransform.currX.toFixed(
							2
						)}, {physics.padTransform.currY.toFixed(
							2
						)}) translate({pawPad.cx}, {pawPad.cy}) scale({physics.padTransform.currScale.toFixed(
							3
						)}) translate(-{pawPad.cx}, -{pawPad.cy})"
					>
						<path id={pawPad.id} d={pawPad.d} />
					</g>
				</g>

				<g
					transform="translate(0, {physics.textVetCrewTransform.currY.toFixed(
						2
					)}) translate({textVetCrew.cx}, {textVetCrew.cy}) scale({physics.textVetCrewTransform.currScale.toFixed(
						3
					)}) translate(-{textVetCrew.cx}, -{textVetCrew.cy})"
				>
					<path id="text-vet-crew" fill="var(--logo-vet-crew)" d={textVetCrew.d} />
				</g>

				<g transform="translate(0, {physics.textEmergencyTransform.currY.toFixed(2)})">
					<path id="text-emergency" fill="var(--logo-emergency)" d={textEmergency.d} />
				</g>
			</g>
		</svg>
	</div>
</div>

<style>
	.logo-container {
		--logo-bg-circle: #598f3a;
		--logo-paw: #ffb327;
		--logo-vet-crew: #ffffff;
		--logo-emergency: #ffb327;
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
		cursor: pointer;
		outline: none;
		transition:
			transform 0.65s cubic-bezier(0.16, 1, 0.3, 1),
			filter 0.5s ease;
	}

	:global([data-theme='dark']) .logo-container {
		--logo-bg-circle: #13371b;
		--logo-paw: #ffffff;
		--logo-vet-crew: #ffb327;
		--logo-emergency: #ffb327;
	}

	.logo-stage {
		width: min(72vw, 380px);
		height: min(72vw, 380px);
		max-width: 440px;
		max-height: 440px;
		position: relative;
		transform-style: preserve-3d;
		transition: transform 0.12s linear;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.vet-crew-svg {
		width: 100%;
		height: 100%;
		display: block;
		overflow: visible;
		filter: drop-shadow(0 18px 45px rgba(0, 0, 0, 0.35))
			drop-shadow(0 0 25px rgba(89, 143, 58, 0.25));
		transition: filter 0.5s ease;
	}

	.vet-crew-svg path,
	.vet-crew-svg circle,
	.vet-crew-svg g {
		transition: fill 0.3s ease;
	}

	.sheen-overlay {
		opacity: 0.5;
		mix-blend-mode: overlay;
		transition: opacity 0.3s ease;
	}

	:global([data-theme='light']) .vet-crew-svg {
		filter: drop-shadow(0 20px 40px rgba(19, 55, 27, 0.18))
			drop-shadow(0 4px 12px rgba(0, 0, 0, 0.06));
	}

	.logo-container:hover .vet-crew-svg {
		filter: drop-shadow(0 22px 55px rgba(0, 0, 0, 0.45))
			drop-shadow(0 0 35px rgba(255, 179, 39, 0.35));
	}

	@media (max-width: 600px) {
		.logo-stage {
			width: min(76vw, 290px);
			height: min(76vw, 290px);
		}
	}
</style>
