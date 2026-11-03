import { browser } from '$app/environment';
import logoPaths from '../assets/logo-paths.json';

export interface AnimTransform {
	currX: number;
	currY: number;
	currRot: number;
	currScale: number;
	targetX: number;
	targetY: number;
	targetRot: number;
	targetScale: number;
}

export interface ToeItem {
	def: (typeof pawToes)[number];
	currX: number;
	currY: number;
	currRot: number;
	currScale: number;
	targetX: number;
	targetY: number;
	targetRot: number;
	targetScale: number;
}

export const pawToes = [
	logoPaths['paw-toe-left'],
	logoPaths['paw-toe-center-left'],
	logoPaths['paw-toe-center-right'],
	logoPaths['paw-toe-right']
];

export const pawPad = logoPaths['paw-pad'];
export const textVetCrew = logoPaths['text-vet-crew'];

export class LogoPhysics {
	smoothTiltX = $state(0);
	smoothTiltY = $state(0);
	glowX = $state(50);
	glowY = $state(50);
	targetGlowX = 50;
	targetGlowY = 50;

	normX = 0;
	normY = 0;
	rawSvgX = 485.31;
	rawSvgY = 485.31;
	isHovering = false;

	toes = $state<ToeItem[]>(
		pawToes.map((def) => ({
			def,
			currX: 0,
			currY: 0,
			currRot: 0,
			currScale: 1,
			targetX: 0,
			targetY: 0,
			targetRot: 0,
			targetScale: 1
		}))
	);

	padTransform = $state<AnimTransform>({
		currX: 0,
		currY: 0,
		currRot: 0,
		currScale: 1,
		targetX: 0,
		targetY: 0,
		targetRot: 0,
		targetScale: 1
	});

	textVetCrewTransform = $state<AnimTransform>({
		currX: 0,
		currY: 0,
		currRot: 0,
		currScale: 1,
		targetX: 0,
		targetY: 0,
		targetRot: 0,
		targetScale: 1
	});

	start(svg: SVGSVGElement | null, isMobile: boolean, reducedMotion: boolean): () => void {
		if (!browser) return () => {};

		let animId: number;
		let hasOrientation = false;
		let tiltNormX = 0;
		let tiltNormY = 0;

		const handleOrientation = (e: DeviceOrientationEvent) => {
			if (e.gamma == null || e.beta == null) return;
			hasOrientation = true;
			const gamma = Math.max(-30, Math.min(30, e.gamma));
			const betaDelta = Math.max(-30, Math.min(30, e.beta - 45));
			tiltNormX = gamma / 30;
			tiltNormY = betaDelta / 30;
		};

		const DeviceOrientation = (
			window as unknown as {
				DeviceOrientationEvent?: { requestPermission?: () => Promise<string> };
			}
		).DeviceOrientationEvent;

		if (DeviceOrientation && typeof DeviceOrientation.requestPermission !== 'function') {
			window.addEventListener('deviceorientation', handleOrientation, { passive: true });
		}

		const requestGyroOnce = () => {
			if (DeviceOrientation && typeof DeviceOrientation.requestPermission === 'function') {
				DeviceOrientation.requestPermission()
					.then((state: string) => {
						if (state === 'granted') {
							window.addEventListener('deviceorientation', handleOrientation, { passive: true });
						}
					})
					.catch(() => {});
			}
			window.removeEventListener('pointerdown', requestGyroOnce);
			window.removeEventListener('touchstart', requestGyroOnce);
		};
		window.addEventListener('pointerdown', requestGyroOnce, { passive: true });
		window.addEventListener('touchstart', requestGyroOnce, { passive: true });

		const onPointerMove = (e: PointerEvent) => {
			if (isMobile || e.pointerType === 'touch') {
				this.isHovering = false;
				return;
			}
			const winW = window.innerWidth;
			const winH = window.innerHeight;
			this.normX = (e.clientX / winW) * 2 - 1;
			this.normY = (e.clientY / winH) * 2 - 1;

			if (svg) {
				const rect = svg.getBoundingClientRect();
				this.rawSvgX = ((e.clientX - rect.left) / rect.width) * 970.62;
				this.rawSvgY = ((e.clientY - rect.top) / rect.height) * 970.62;
				this.targetGlowX = Math.max(5, Math.min(95, (this.rawSvgX / 970.62) * 100));
				this.targetGlowY = Math.max(5, Math.min(95, (this.rawSvgY / 970.62) * 100));
			}
			this.isHovering = true;
		};

		const onPointerLeave = () => {
			this.isHovering = false;
		};

		window.addEventListener('pointermove', onPointerMove, { passive: true });
		window.addEventListener('pointerleave', onPointerLeave);

		const loop = (time: number) => {
			if (reducedMotion) {
				this.smoothTiltX = 0;
				this.smoothTiltY = 0;
				this.glowX = 50;
				this.glowY = 50;
				animId = requestAnimationFrame(loop);
				return;
			}

			const idleT = time * 0.001;
			let targetTiltX: number;
			let targetTiltY: number;

			if (isMobile) {
				this.targetGlowX = 50 + Math.sin(idleT * 0.8) * 22;
				this.targetGlowY = 50 + Math.cos(idleT * 0.6) * 18;
				const breathTiltX = Math.sin(idleT * 0.7) * 3.2;
				const breathTiltY = Math.cos(idleT * 0.5) * 3.2;
				targetTiltX = hasOrientation ? -tiltNormY * 6.5 + breathTiltX * 0.35 : breathTiltX;
				targetTiltY = hasOrientation ? tiltNormX * 6.5 + breathTiltY * 0.35 : breathTiltY;

				for (const el of this.toes) {
					el.targetX = hasOrientation ? tiltNormX * 2.5 : 0;
					el.targetY =
						Math.sin(time * 0.0022 + el.def.phase) * 3.2 + (hasOrientation ? -tiltNormY * 2.5 : 0);
					el.targetRot = Math.cos(time * 0.0018 + el.def.phase) * 1.0;
					el.currX += (el.targetX - el.currX) * 0.1;
					el.currY += (el.targetY - el.currY) * 0.1;
					el.currRot += (el.targetRot - el.currRot) * 0.1;
				}
				this.padTransform.targetY = Math.sin(time * 0.002 + pawPad.phase) * 2.5;
				this.padTransform.currY += (this.padTransform.targetY - this.padTransform.currY) * 0.08;
				this.textVetCrewTransform.targetY = Math.sin(time * 0.0018 + textVetCrew.phase) * 2.0;
				this.textVetCrewTransform.currY +=
					(this.textVetCrewTransform.targetY - this.textVetCrewTransform.currY) * 0.08;
			} else {
				const breathTiltX = Math.sin(idleT * 0.6) * 1.8;
				const breathTiltY = Math.cos(idleT * 0.45) * 1.8;
				if (this.isHovering) {
					targetTiltX = -this.normY * 11.5 + breathTiltX * 0.25;
					targetTiltY = this.normX * 11.5 + breathTiltY * 0.25;
				} else {
					targetTiltX = breathTiltX;
					targetTiltY = breathTiltY;
					this.targetGlowX = 50 + Math.sin(idleT * 0.5) * 12;
					this.targetGlowY = 50 + Math.cos(idleT * 0.4) * 10;
				}

				for (const el of this.toes) {
					const idleWave = Math.sin(time * 0.002 + el.def.phase) * 3.0;
					if (this.isHovering) {
						const dx = this.rawSvgX - el.def.cx;
						const dy = this.rawSvgY - el.def.cy;
						const dist = Math.sqrt(dx * dx + dy * dy);
						const radius = 175;
						if (dist < radius) {
							const factor = 1 - dist / radius;
							const angle = Math.atan2(dy, dx);
							el.targetX = -Math.cos(angle) * factor * 16;
							el.targetY = -Math.sin(angle) * factor * 16 + idleWave * 0.3;
							el.targetScale = 1 + factor * 0.1;
						} else {
							el.targetX = 0;
							el.targetY = idleWave;
							el.targetScale = 1;
						}
					} else {
						el.targetX = 0;
						el.targetY = idleWave;
						el.targetScale = 1;
					}
					el.currX += (el.targetX - el.currX) * 0.12;
					el.currY += (el.targetY - el.currY) * 0.12;
					el.currScale += (el.targetScale - el.currScale) * 0.12;
				}

				const padIdle = Math.sin(time * 0.0018 + pawPad.phase) * 2.2;
				this.padTransform.targetY = padIdle;
				this.padTransform.currY += (this.padTransform.targetY - this.padTransform.currY) * 0.1;

				const textIdle = Math.sin(time * 0.0016 + textVetCrew.phase) * 1.8;
				this.textVetCrewTransform.targetY = textIdle;
				this.textVetCrewTransform.currY +=
					(this.textVetCrewTransform.targetY - this.textVetCrewTransform.currY) * 0.1;
			}

			this.smoothTiltX += (targetTiltX - this.smoothTiltX) * 0.08;
			this.smoothTiltY += (targetTiltY - this.smoothTiltY) * 0.08;
			this.glowX += (this.targetGlowX - this.glowX) * 0.06;
			this.glowY += (this.targetGlowY - this.glowY) * 0.06;

			animId = requestAnimationFrame(loop);
		};

		animId = requestAnimationFrame(loop);

		return () => {
			cancelAnimationFrame(animId);
			window.removeEventListener('deviceorientation', handleOrientation);
			window.removeEventListener('pointerdown', requestGyroOnce);
			window.removeEventListener('touchstart', requestGyroOnce);
			window.removeEventListener('pointermove', onPointerMove);
			window.removeEventListener('pointerleave', onPointerLeave);
		};
	}
}
