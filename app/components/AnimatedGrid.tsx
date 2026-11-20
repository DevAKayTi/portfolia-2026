"use client";

import { useEffect, useRef } from "react";

interface Node {
    x: number;
    y: number;
    brightness: number;
    targetBrightness: number;
    pulseTimer: number;
    pulseInterval: number;
}

export default function AnimatedGrid() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mouseRef = useRef({ x: -9999, y: -9999 });

    // Track light/dark theme via CSS variable on <html>
    const isLightMode = () =>
        document.documentElement.getAttribute("data-theme") === "light";

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animId: number;
        let time = 0;
        let nodes: Node[] = [];

        const CELL = 48;
        const ACCENT_R = 99, ACCENT_G = 102, ACCENT_B = 241;

        // ── Build node grid ─────────────────────────────────────────
        const buildNodes = () => {
            const cols = Math.ceil(canvas.width / CELL) + 2;
            const rows = Math.ceil(canvas.height / CELL) + 2;
            nodes = [];
            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < cols; c++) {
                    nodes.push({
                        x: c * CELL,
                        y: r * CELL,
                        brightness: 0,
                        targetBrightness: 0,
                        pulseTimer: Math.random() * 60,
                        pulseInterval: 30 + Math.random() * 60,
                    });
                }
            }
        };

        // ── Resize ───────────────────────────────────────────────────
        const resize = () => {
            const { offsetWidth: W, offsetHeight: H } = canvas;
            canvas.width = W;
            canvas.height = H;
            buildNodes();
        };

        resize();
        const ro = new ResizeObserver(resize);
        ro.observe(canvas);

        // ── Mouse tracking ───────────────────────────────────────────
        const onMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            mouseRef.current = {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
            };
        };
        window.addEventListener("mousemove", onMove);

        // ── Draw loop ─────────────────────────────────────────────────
        const draw = () => {
            const W = canvas.width;
            const H = canvas.height;
            const mx = mouseRef.current.x;
            const my = mouseRef.current.y;
            const light = isLightMode();

            ctx.clearRect(0, 0, W, H);

            const cols = Math.ceil(W / CELL) + 2;
            const rows = Math.ceil(H / CELL) + 2;

            // Update node pulses
            nodes.forEach((n) => {
                // Random sparkle pulses
                n.pulseTimer++;
                if (n.pulseTimer >= n.pulseInterval) {
                    n.pulseTimer = 0;
                    n.pulseInterval = 30 + Math.random() * 60;
                    n.targetBrightness = Math.random() > 0.5 ? 0.7 + Math.random() * 0.3 : 0;
                }
                n.brightness += (n.targetBrightness - n.brightness) * 0.14;

                // Mouse proximity boost
                const dx = n.x - mx;
                const dy = n.y - my;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 180) {
                    n.brightness = Math.max(n.brightness, (1 - dist / 180) * 0.45);
                }
            });

            // ── Draw grid lines ──────────────────────────────────────
            // Vertical lines
            for (let c = 0; c < cols; c++) {
                const x = c * CELL;
                for (let r = 0; r < rows - 1; r++) {
                    const y = r * CELL;

                    // Wave modulation along the line
                    const wave = Math.sin(time * 1.2 + r * 0.4 + c * 0.6) * 0.5 + 0.5;

                    // Distance from mouse
                    const dx = x - mx;
                    const dy = (y + CELL / 2) - my;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    const mouseBoost = Math.max(0, 1 - dist / 200) * 0.5;

                    const baseA = light ? 0.07 : 0.04;
                    const alpha = Math.max(0, baseA + wave * 0.04 + mouseBoost);

                    const grad = ctx.createLinearGradient(x, y, x, y + CELL);
                    grad.addColorStop(0, `rgba(${ACCENT_R},${ACCENT_G},${ACCENT_B},${alpha})`);
                    grad.addColorStop(1, `rgba(${ACCENT_R},${ACCENT_G},${ACCENT_B},${alpha * 0.5})`);

                    ctx.beginPath();
                    ctx.moveTo(x, y);
                    ctx.lineTo(x, y + CELL);
                    ctx.strokeStyle = grad;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }

            // Horizontal lines
            for (let r = 0; r < rows; r++) {
                const y = r * CELL;
                for (let c = 0; c < cols - 1; c++) {
                    const x = c * CELL;

                    const wave2 = Math.sin(time * 1.0 + c * 0.4 + r * 0.6) * 0.5 + 0.5;

                    const dx2 = (x + CELL / 2) - mx;
                    const dy2 = y - my;
                    const dist2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);
                    const mouseBoost2 = Math.max(0, 1 - dist2 / 200) * 0.5;

                    const baseA2 = light ? 0.07 : 0.04;
                    const alpha2 = Math.max(0, baseA2 + wave2 * 0.04 + mouseBoost2);

                    const grad2 = ctx.createLinearGradient(x, y, x + CELL, y);
                    grad2.addColorStop(0, `rgba(${ACCENT_R},${ACCENT_G},${ACCENT_B},${alpha2})`);
                    grad2.addColorStop(1, `rgba(${ACCENT_R},${ACCENT_G},${ACCENT_B},${alpha2 * 0.5})`);

                    ctx.beginPath();
                    ctx.moveTo(x, y);
                    ctx.lineTo(x + CELL, y);
                    ctx.strokeStyle = grad2;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }

            // ── Draw intersection nodes ───────────────────────────────
            nodes.forEach((n) => {
                if (n.brightness < 0.01) return;

                // Outer glow
                const glowR = 5 * n.brightness;
                const glow = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, glowR);
                glow.addColorStop(0, `rgba(${ACCENT_R},${ACCENT_G},${ACCENT_B},${n.brightness * 0.18})`);
                glow.addColorStop(1, `rgba(${ACCENT_R},${ACCENT_G},${ACCENT_B},0)`);
                ctx.beginPath();
                ctx.arc(n.x, n.y, glowR, 0, Math.PI * 2);
                ctx.fillStyle = glow;
                ctx.fill();

                // Core dot — pure white hot center (star effect)
                ctx.beginPath();
                ctx.arc(n.x, n.y, 0.4 * n.brightness, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255,255,255,${n.brightness})`;
                ctx.fill();
            });

            // ── Travelling beam (diagonal) ────────────────────────────
            const beamX = ((time * 55) % (W + H)) - H;
            const beamAlpha = 0.04;
            const beamGrad = ctx.createLinearGradient(beamX, 0, beamX + 120, 120);
            beamGrad.addColorStop(0, "transparent");
            beamGrad.addColorStop(0.5, `rgba(${ACCENT_R},${ACCENT_G},${ACCENT_B},${beamAlpha})`);
            beamGrad.addColorStop(1, "transparent");

            ctx.save();
            ctx.translate(beamX + 60, 60);
            ctx.rotate(Math.PI / 4);
            ctx.fillStyle = beamGrad;
            ctx.fillRect(-60, -H * 2, 120, H * 4);
            ctx.restore();

            // ── Vignette mask — theme-aware ───────────────────────────
            const vigColor = light ? "248,250,252" : "10,10,15";
            const vigAlpha = light ? 0.72 : 0.75;
            const vig = ctx.createRadialGradient(W / 2, H / 2, H * 0.2, W / 2, H / 2, H * 0.9);
            vig.addColorStop(0, `rgba(${vigColor},0)`);
            vig.addColorStop(1, `rgba(${vigColor},${vigAlpha})`);
            ctx.fillStyle = vig;
            ctx.fillRect(0, 0, W, H);

            time += 0.01;
            animId = requestAnimationFrame(draw);
        };

        draw();

        return () => {
            cancelAnimationFrame(animId);
            ro.disconnect();
            window.removeEventListener("mousemove", onMove);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                pointerEvents: "none",
                zIndex: 1,
            }}
        />
    );
}
