"use client";

import { useEffect, useRef } from "react";

// ── Physics constants ──────────────────────────────────────────────────────
const GRAVITY = 0.07;
const DAMPING = 0.982;
const MOUSE_RADIUS = 140;
const MOUSE_STRENGTH = 7;
const BOUNCE_WALL = 0.58;
const BOUNCE_ORB = 0.60;
const MIN_SPEED = 0.25;

// ── Skill orbs ─────────────────────────────────────────────────────────────
const ORB_DATA = [
    { label: "React", color: "#61dafb", glow: "rgba(97,218,251,0.4)" },
    { label: "Next.js", color: "#a5b4fc", glow: "rgba(165,180,252,0.3)" },
    { label: "TypeScript", color: "#3178c6", glow: "rgba(49,120,198,0.45)" },
    { label: "Laravel", color: "#ff2d20", glow: "rgba(255,45,32,0.38)" },
    { label: "PHP", color: "#8892be", glow: "rgba(136,146,190,0.38)" },
    { label: "Docker", color: "#2496ed", glow: "rgba(36,150,237,0.38)" },
    { label: "Postgres", color: "#5bc0de", glow: "rgba(91,192,222,0.4)" },
    { label: "K8s", color: "#326ce5", glow: "rgba(50,108,229,0.38)" },
    { label: "Tailwind", color: "#38bdf8", glow: "rgba(56,189,248,0.38)" },
    { label: "Node.js", color: "#83cd29", glow: "rgba(131,205,41,0.38)" },
    { label: "MySQL", color: "#f29111", glow: "rgba(242,145,17,0.38)" },
    { label: "Git", color: "#f05032", glow: "rgba(240,80,50,0.38)" },
];

interface Orb {
    x: number; y: number;
    vx: number; vy: number;
    r: number;
    label: string;
    color: string;
    glow: string;
    mass: number;
    alpha: number;
}

function makeOrbs(w: number, h: number): Orb[] {
    return ORB_DATA.map(() => {
        const r = 34 + Math.random() * 14;
        return {
            x: r + Math.random() * (w - r * 2),
            y: r + Math.random() * (h * 0.75),
            vx: (Math.random() - 0.5) * 2.8,
            vy: (Math.random() - 0.5) * 2 + 0.4,
            r,
            label: ORB_DATA[ORB_DATA.indexOf(ORB_DATA.find(o => o.label === ORB_DATA[ORB_DATA.indexOf(ORB_DATA[0])].label)!)].label,
            color: "",
            glow: "",
            mass: r * r,
            alpha: 0,
        };
    }).map((o, i) => ({ ...o, label: ORB_DATA[i].label, color: ORB_DATA[i].color, glow: ORB_DATA[i].glow }));
}

function collide(a: Orb, b: Orb) {
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const dist = Math.sqrt(dx * dx + dy * dy) || 0.001;
    const over = a.r + b.r - dist;
    if (over <= 0) return;

    const nx = dx / dist;
    const ny = dy / dist;
    const sep = over / 2;
    a.x -= nx * sep; a.y -= ny * sep;
    b.x += nx * sep; b.y += ny * sep;

    const dvx = b.vx - a.vx;
    const dvy = b.vy - a.vy;
    const dot = dvx * nx + dvy * ny;
    if (dot > 0) return;

    const imp = (2 * dot * BOUNCE_ORB) / (a.mass + b.mass);
    a.vx += imp * b.mass * nx; a.vy += imp * b.mass * ny;
    b.vx -= imp * a.mass * nx; b.vy -= imp * a.mass * ny;
}

export default function PhysicsCanvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const wrapRef = useRef<HTMLDivElement>(null);
    const mouse = useRef({ x: -9999, y: -9999 });
    const orbs = useRef<Orb[]>([]);
    const raf = useRef(0);

    useEffect(() => {
        const canvas = canvasRef.current!;
        const wrap = wrapRef.current!;
        const ctx = canvas.getContext("2d")!;
        let w = 0, h = 0;

        const resize = () => {
            w = canvas.width = wrap.offsetWidth;
            h = canvas.height = wrap.offsetHeight;
            if (orbs.current.length === 0) orbs.current = makeOrbs(w, h);
        };
        resize();
        const ro = new ResizeObserver(resize);
        ro.observe(wrap);

        // ── Listeners ─────────────────────────────────────────────────────────
        const onMove = (e: MouseEvent | TouchEvent) => {
            const rect = canvas.getBoundingClientRect();
            const cx = "touches" in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
            const cy = "touches" in e ? e.touches[0].clientY : (e as MouseEvent).clientY;
            mouse.current = { x: cx - rect.left, y: cy - rect.top };
        };
        const onLeave = () => { mouse.current = { x: -9999, y: -9999 }; };
        const onClick = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            const cx = e.clientX - rect.left;
            const cy = e.clientY - rect.top;
            orbs.current.forEach(o => {
                const dx = o.x - cx, dy = o.y - cy;
                const d = Math.sqrt(dx * dx + dy * dy) || 1;
                const f = Math.min(320 / d, 14);
                o.vx += (dx / d) * f;
                o.vy += (dy / d) * f;
            });
        };

        canvas.addEventListener("mousemove", onMove as EventListener);
        canvas.addEventListener("touchmove", onMove as EventListener, { passive: true });
        canvas.addEventListener("mouseleave", onLeave);
        canvas.addEventListener("touchend", onLeave);
        canvas.addEventListener("click", onClick);

        // ── Draw one orb ──────────────────────────────────────────────────────
        const drawOrb = (o: Orb) => {
            ctx.save();
            ctx.globalAlpha = o.alpha;

            // Soft outer glow
            const halo = ctx.createRadialGradient(o.x, o.y, o.r * 0.3, o.x, o.y, o.r * 2.0);
            halo.addColorStop(0, o.glow);
            halo.addColorStop(1, "transparent");
            ctx.beginPath();
            ctx.arc(o.x, o.y, o.r * 2.0, 0, Math.PI * 2);
            ctx.fillStyle = halo;
            ctx.globalAlpha = o.alpha * 0.55;
            ctx.fill();

            // Glassy body
            ctx.globalAlpha = o.alpha;
            ctx.beginPath();
            ctx.arc(o.x, o.y, o.r, 0, Math.PI * 2);
            const body = ctx.createRadialGradient(
                o.x - o.r * 0.3, o.y - o.r * 0.3, o.r * 0.05,
                o.x, o.y, o.r
            );
            body.addColorStop(0, "rgba(255,255,255,0.22)");
            body.addColorStop(0.45, o.color + "1a");
            body.addColorStop(1, o.color + "40");
            ctx.fillStyle = body;
            ctx.fill();

            // Rim
            ctx.strokeStyle = o.color + "88";
            ctx.lineWidth = 1.5;
            ctx.stroke();

            // Top specular
            ctx.beginPath();
            ctx.arc(o.x - o.r * 0.25, o.y - o.r * 0.32, o.r * 0.28, 0, Math.PI * 2);
            const spec = ctx.createRadialGradient(
                o.x - o.r * 0.28, o.y - o.r * 0.35, 0,
                o.x - o.r * 0.25, o.y - o.r * 0.32, o.r * 0.28
            );
            spec.addColorStop(0, "rgba(255,255,255,0.35)");
            spec.addColorStop(1, "transparent");
            ctx.fillStyle = spec;
            ctx.fill();

            // Label
            ctx.globalAlpha = o.alpha;
            ctx.fillStyle = o.color;
            ctx.font = `600 ${Math.round(o.r * 0.37)}px 'JetBrains Mono', monospace`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.shadowColor = o.color;
            ctx.shadowBlur = 6;
            ctx.fillText(o.label, o.x, o.y);
            ctx.shadowBlur = 0;

            ctx.restore();
        };

        // ── Main loop ─────────────────────────────────────────────────────────
        const tick = () => {
            ctx.clearRect(0, 0, w, h);
            const mx = mouse.current.x, my = mouse.current.y;

            orbs.current.forEach(o => {
                if (o.alpha < 1) o.alpha = Math.min(1, o.alpha + 0.012);

                o.vy += GRAVITY;

                const dx = o.x - mx, dy = o.y - my;
                const d = Math.sqrt(dx * dx + dy * dy);
                if (d < MOUSE_RADIUS && d > 0) {
                    const f = ((MOUSE_RADIUS - d) / MOUSE_RADIUS) * MOUSE_STRENGTH;
                    o.vx += (dx / d) * f;
                    o.vy += (dy / d) * f;
                }

                o.vx *= DAMPING;
                o.vy *= DAMPING;

                const sp = Math.sqrt(o.vx * o.vx + o.vy * o.vy);
                if (sp < MIN_SPEED && sp > 0) {
                    o.vx = (o.vx / sp) * MIN_SPEED;
                    o.vy = (o.vy / sp) * MIN_SPEED;
                }

                o.x += o.vx;
                o.y += o.vy;

                // Wall bounce
                if (o.x - o.r < 0) { o.x = o.r; o.vx = Math.abs(o.vx) * BOUNCE_WALL; }
                if (o.x + o.r > w) { o.x = w - o.r; o.vx = -Math.abs(o.vx) * BOUNCE_WALL; }
                if (o.y - o.r < 0) { o.y = o.r; o.vy = Math.abs(o.vy) * BOUNCE_WALL; }
                if (o.y + o.r > h) { o.y = h - o.r; o.vy = -Math.abs(o.vy) * BOUNCE_WALL; o.vx *= 0.97; }
            });

            for (let i = 0; i < orbs.current.length; i++)
                for (let j = i + 1; j < orbs.current.length; j++)
                    collide(orbs.current[i], orbs.current[j]);

            orbs.current.forEach(drawOrb);
            raf.current = requestAnimationFrame(tick);
        };
        tick();

        return () => {
            cancelAnimationFrame(raf.current);
            ro.disconnect();
            canvas.removeEventListener("mousemove", onMove as EventListener);
            canvas.removeEventListener("touchmove", onMove as EventListener);
            canvas.removeEventListener("mouseleave", onLeave);
            canvas.removeEventListener("touchend", onLeave);
            canvas.removeEventListener("click", onClick);
        };
    }, []);

    return (
        <div
            ref={wrapRef}
            style={{
                position: "absolute",
                inset: 0,
                zIndex: 1,
                pointerEvents: "none",   // let clicks pass through to text
            }}
        >
            <canvas
                ref={canvasRef}
                style={{
                    width: "100%",
                    height: "100%",
                    cursor: "crosshair",
                    pointerEvents: "all",  // canvas itself captures mouse
                }}
            />
        </div>
    );
}
