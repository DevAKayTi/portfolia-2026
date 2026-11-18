"use client";

import { useRef, useEffect, useState } from "react";
import { useTheme } from "./ThemeProvider";

/* ── Brand colours for each tag ── */
const tagColors: Record<string, string> = {
    "Laravel": "#ff2d20",
    "MySQL": "#f29111",
    "Prisma": "#5a67d8",
    "Supabase": "#3ecf8e",
    "Node.js": "#83cd29",
    "React": "#61dafb",
    "Next.js": "#a5b4fc",
    "TypeScript": "#3178c6",
    "Vue.js": "#4fc08d",
    "Tailwind CSS": "#38bdf8",
    "Docker": "#2496ed",
    "Kubernetes": "#326ce5",
    "Vercel": "#a0aec0",
    "Figma": "#f24e1e",
    "Git": "#f05032",
    "GitHub": "#a0aec0",
    "Linux": "#fcc624",
    "PlanetScale": "#e2e8f0",
    "CI/CD": "#6366f1",
    "REST APIs": "#6366f1",
    "Project Management": "#a78bfa",
    "System Maintenance": "#34d399",
    "Full Stack": "#60a5fa",
};

const experiences = [
    {
        period: "June 2024 – March 2026",
        role: "Senior Web Developer",
        company: "RITZ Cyber Security",
        current: true,
        nodeColor: "#6366f1",
        highlights: [
            "Conducted direct consultations with clients to define core business logic and translated requirements into functional UI/UX designs using Figma.",
            "Collaborated closely with the Team Lead to architect the system infrastructure and design robust database schemas.",
            "Engineered the admin dashboard and secure backend services using Laravel, facilitating weekly client syncs.",
            "Supervised mobile developers to ensure seamless API integration and actively participated in comprehensive system testing.",
            "Containerized applications using Docker and assisted in writing Kubernetes YAML configurations to streamline the deployment pipeline.",
        ],
        tags: ["Laravel", "Figma", "Docker", "Kubernetes", "MySQL"],
    },
    {
        period: "May 2023 – May 2024",
        role: "Web Developer",
        company: "UTO Trading Company",
        current: false,
        nodeColor: "#8b5cf6",
        highlights: [
            "Spearheaded the transformation of a legacy Google Sheets-based workflow into a fully customized POS, Inventory Management, and Accounting application.",
            "Architected the application using React, Prisma ORM, and PlanetScale for a highly scalable serverless database.",
            "Managed deployment and hosting infrastructure utilizing Vercel, streamlining the CI/CD process.",
        ],
        tags: ["React", "Prisma", "PlanetScale", "Vercel", "CI/CD"],
    },
    {
        period: "March 2022 – November 2023",
        role: "Web Developer",
        company: "I-360 Organization",
        current: false,
        nodeColor: "#a78bfa",
        highlights: [
            "Directed and supervised a third-party development agency during the creation of the organization's website, ensuring alignment with business requirements.",
            "Assumed full ownership of the application post-deployment, actively maintaining the system architecture and engineering new features.",
        ],
        tags: ["Project Management", "System Maintenance", "Full Stack"],
    },
];

/* ────────────────────────────────────────────────────────────────
   Interactive constellation background
   · Floating particles drift slowly
   · Lines drawn between nearby particles
   · Mouse proximity pulls particles toward the cursor and brightens them
   · Theme-aware colours; paused when section is off-screen
   ──────────────────────────────────────────────────────────────── */
function ConstellationBg({ isLight }: { isLight: boolean }) {
    const canvasRef  = useRef<HTMLCanvasElement>(null);
    const mouseRef   = useRef({ x: -9999, y: -9999 });
    const isLightRef = useRef(isLight);
    useEffect(() => { isLightRef.current = isLight; }, [isLight]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        /* ── Particle type ── */
        type P = {
            x: number; y: number;
            vx: number; vy: number;
            r: number;          // base radius
            alpha: number;
            phase: number;      // phase offset for shimmer
        };

        const PARTICLE_COUNT = 55;
        const CONNECT_DIST   = 140;
        const MOUSE_PULL     = 90;   // px — attraction radius
        const MOUSE_FORCE    = 0.012;

        let W = 0, H = 0;
        let particles: P[] = [];
        let animId: number;
        let time = 0;
        let visible = true;

        /* ── Build particles ── */
        const init = () => {
            particles = Array.from({ length: PARTICLE_COUNT }, () => ({
                x:     Math.random() * W,
                y:     Math.random() * H,
                vx:    (Math.random() - 0.5) * 0.3,
                vy:    (Math.random() - 0.5) * 0.3,
                r:     1 + Math.random() * 1.5,
                alpha: 0.3 + Math.random() * 0.5,
                phase: Math.random() * Math.PI * 2,
            }));
        };

        /* ── Resize ── */
        const resize = () => {
            W = canvas.offsetWidth;
            H = canvas.offsetHeight;
            canvas.width  = W;
            canvas.height = H;
            init();
        };
        resize();
        const ro = new ResizeObserver(resize);
        ro.observe(canvas);

        /* ── Mouse tracking ── */
        const onMove = (e: MouseEvent) => {
            const r = canvas.getBoundingClientRect();
            mouseRef.current = { x: e.clientX - r.left, y: e.clientY - r.top };
        };
        const onLeave = () => { mouseRef.current = { x: -9999, y: -9999 }; };
        canvas.addEventListener("mousemove", onMove);
        canvas.style.pointerEvents = "none"; // let events pass to canvas parent for tracking
        window.addEventListener("mousemove", onMove);
        window.addEventListener("mouseleave", onLeave);

        /* ── Visibility observer (pause when off-screen) ── */
        const visObs = new IntersectionObserver(
            ([entry]) => { visible = entry.isIntersecting; },
            { threshold: 0 }
        );
        visObs.observe(canvas);

        /* ── Draw loop ── */
        const draw = () => {
            animId = requestAnimationFrame(draw);
            if (!visible) return;

            const light = isLightRef.current;
            const mx = mouseRef.current.x;
            const my = mouseRef.current.y;

            /* Accent: indigo-purple */
            const AR = 99, AG = 102, AB = 241;

            ctx.clearRect(0, 0, W, H);

            /* Update particles */
            particles.forEach((p) => {
                /* Mouse attraction */
                const dx = mx - p.x;
                const dy = my - p.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < MOUSE_PULL && dist > 1) {
                    p.vx += (dx / dist) * MOUSE_FORCE;
                    p.vy += (dy / dist) * MOUSE_FORCE;
                }

                /* Damping + drift */
                p.vx *= 0.98;
                p.vy *= 0.98;
                p.x  += p.vx;
                p.y  += p.vy;

                /* Soft wrap */
                if (p.x < -20)  p.x = W + 20;
                if (p.x > W+20) p.x = -20;
                if (p.y < -20)  p.y = H + 20;
                if (p.y > H+20) p.y = -20;
            });

            /* Draw connecting lines */
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const a = particles[i], b = particles[j];
                    const dx = a.x - b.x, dy = a.y - b.y;
                    const d  = Math.sqrt(dx * dx + dy * dy);
                    if (d > CONNECT_DIST) continue;

                    const fade  = 1 - d / CONNECT_DIST;
                    const baseA = light ? 0.08 : 0.07;
                    const alpha = baseA * fade * fade;

                    ctx.beginPath();
                    ctx.moveTo(a.x, a.y);
                    ctx.lineTo(b.x, b.y);
                    ctx.strokeStyle = `rgba(${AR},${AG},${AB},${alpha})`;
                    ctx.lineWidth   = 0.8;
                    ctx.stroke();
                }
            }

            /* Draw particles */
            particles.forEach((p) => {
                /* Shimmer */
                const shimmer = 0.5 + 0.5 * Math.sin(time * 1.4 + p.phase);
                /* Mouse proximity brightness boost */
                const dx   = mx - p.x, dy = my - p.y;
                const mdist = Math.sqrt(dx * dx + dy * dy);
                const boost = Math.max(0, 1 - mdist / MOUSE_PULL) * 0.6;
                const a = Math.min(1, (p.alpha + boost) * (0.75 + shimmer * 0.25));

                /* Glow */
                const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4);
                grad.addColorStop(0, `rgba(${AR},${AG},${AB},${a * 0.35})`);
                grad.addColorStop(1, `rgba(${AR},${AG},${AB},0)`);
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2);
                ctx.fillStyle = grad;
                ctx.fill();

                /* Core */
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r * (1 + boost * 0.5), 0, Math.PI * 2);
                ctx.fillStyle = light
                    ? `rgba(${AR},${AG},${AB},${a * 0.7})`
                    : `rgba(180,185,255,${a * 0.8})`;
                ctx.fill();
            });

            /* Soft radial vignette to blend into section bg */
            const vig = ctx.createRadialGradient(W / 2, H / 2, H * 0.1, W / 2, H / 2, H * 0.85);
            vig.addColorStop(0, "rgba(0,0,0,0)");
            vig.addColorStop(1, light ? "rgba(248,248,255,0.55)" : "rgba(5,5,15,0.65)");
            ctx.fillStyle = vig;
            ctx.fillRect(0, 0, W, H);

            time += 0.012;
        };

        draw();

        return () => {
            cancelAnimationFrame(animId);
            ro.disconnect();
            visObs.disconnect();
            window.removeEventListener("mousemove", onMove);
            window.removeEventListener("mouseleave", onLeave);
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
                zIndex: 0,
            }}
        />
    );
}

/* ── Single timeline entry ── */
function TimelineEntry({
    exp,
    idx,
    isLast,
}: {
    exp: typeof experiences[number];
    idx: number;
    isLast: boolean;
}) {
    const { theme } = useTheme();
    const isLight   = theme === "light";
    const [hovered, setHovered]   = useState(false);
    const [visible, setVisible]   = useState(false);
    const entryRef  = useRef<HTMLDivElement>(null);

    /* Each card observes itself — fires when ITS top enters the viewport */
    useEffect(() => {
        const el = entryRef.current;
        if (!el) return;
        const obs = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    obs.disconnect(); // animate once
                }
            },
            { rootMargin: "0px 0px -10% 0px", threshold: 0.12 }
        );
        obs.observe(el);
        return () => obs.disconnect();
    }, []);

    const cardBg = isLight
        ? hovered ? "rgba(99,102,241,0.06)" : "rgba(255,255,255,0.72)"
        : hovered ? "rgba(99,102,241,0.09)" : "rgba(15,15,25,0.68)";
    const cardBorder = hovered
        ? isLight ? "1px solid rgba(99,102,241,0.30)" : "1px solid rgba(99,102,241,0.35)"
        : isLight ? "1px solid rgba(99,102,241,0.12)" : "1px solid rgba(99,102,241,0.15)";
    const cardShadow = hovered
        ? isLight
            ? `0 12px 40px rgba(0,0,0,0.12), 0 0 0 1px rgba(99,102,241,0.08)`
            : `0 12px 40px rgba(0,0,0,0.6), 0 0 20px rgba(99,102,241,0.08)`
        : isLight
            ? "0 4px 20px rgba(0,0,0,0.07)"
            : "0 4px 24px rgba(0,0,0,0.45)";

    return (
        <div
            ref={entryRef}
            className="tl-entry"
            style={{
                display: "grid",
                gridTemplateColumns: "auto 1fr",
                gap: "0 1.75rem",
                /* Slide up + fade in individually */
                opacity:   visible ? 1 : 0,
                transform: visible ? "translateY(0) scale(1)" : "translateY(32px) scale(0.98)",
                transition: "opacity 0.6s cubic-bezier(0.22,1,0.36,1), transform 0.6s cubic-bezier(0.22,1,0.36,1)",
            }}
        >
            {/* ── Spine column ── */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "28px" }}>

                {/* Milestone node */}
                <div
                    className="tl-node"
                    style={{
                        width: "28px",
                        height: "28px",
                        borderRadius: "50%",
                        background: exp.nodeColor,
                        boxShadow: `0 0 0 4px ${exp.nodeColor}22, 0 0 16px ${exp.nodeColor}55`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        position: "relative",
                        zIndex: 1,
                        transition: "box-shadow 0.3s ease, transform 0.3s ease",
                        transform: hovered ? "scale(1.18)" : "scale(1)",
                    }}
                >
                    {/* Inner dot */}
                    <div style={{
                        width: "10px",
                        height: "10px",
                        borderRadius: "50%",
                        background: "#fff",
                        opacity: 0.9,
                    }} />

                    {/* "Current" pulse ring */}
                    {exp.current && (
                        <div className="tl-pulse" style={{
                            position: "absolute",
                            inset: "-4px",
                            borderRadius: "50%",
                            border: `2px solid ${exp.nodeColor}`,
                            opacity: 0.5,
                        }} />
                    )}
                </div>

                {/* Spine segment below the node */}
                {!isLast && (
                    <div style={{
                        flex: 1,
                        width: "2px",
                        marginTop: "6px",
                        background: `linear-gradient(to bottom, ${exp.nodeColor}88, ${experiences[idx + 1].nodeColor}44)`,
                        borderRadius: "2px",
                        minHeight: "2rem",
                    }} />
                )}
            </div>

            {/* ── Card column ── */}
            <div
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                style={{
                    marginBottom: isLast ? 0 : "2.25rem",
                    padding: "1.5rem 1.6rem 1.4rem",
                    borderRadius: "16px",
                    cursor: "default",
                    backdropFilter: "blur(24px) saturate(160%)",
                    WebkitBackdropFilter: "blur(24px) saturate(160%)",
                    background: cardBg,
                    border: cardBorder,
                    boxShadow: cardShadow,
                    transition: "background 0.3s ease, border 0.3s ease, box-shadow 0.3s ease, transform 0.25s ease",
                    // transform: hovered ? "translateY(-2px)" : "translateY(0)",
                    position: "relative",
                    overflow: "hidden",
                }}
            >
                {/* Accent glow strip */}
                {/* <div style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "2px",
                    background: `linear-gradient(90deg, ${exp.nodeColor}, ${exp.nodeColor}00)`,
                    borderRadius: "16px 16px 0 0",
                    opacity: hovered ? 1 : 0.4,
                    transition: "opacity 0.3s ease",
                }} /> */}

                {/* Header */}
                <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    flexWrap: "wrap",
                    gap: "0.5rem",
                    marginBottom: "1rem",
                }}>
                    <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.65rem", flexWrap: "wrap" }}>
                            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--heading)", margin: 0 }}>
                                {exp.role}
                            </h3>
                            {exp.current && (
                                <span style={{
                                    fontSize: "0.68rem",
                                    padding: "0.15rem 0.6rem",
                                    borderRadius: "999px",
                                    background: "rgba(34,197,94,0.12)",
                                    color: "#22c55e",
                                    border: "1px solid rgba(34,197,94,0.28)",
                                    fontWeight: 600,
                                    letterSpacing: "0.06em",
                                }}>
                                    RECENT
                                </span>
                            )}
                        </div>
                        <div style={{
                            color: exp.nodeColor,
                            fontWeight: 600,
                            fontSize: "0.9rem",
                            marginTop: "0.2rem",
                            filter: `drop-shadow(0 0 6px ${exp.nodeColor}44)`,
                        }}>
                            {exp.company}
                        </div>
                    </div>
                    <span style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: "0.78rem",
                        color: "var(--muted)",
                        whiteSpace: "nowrap",
                        marginTop: "0.1rem",
                    }}>
                        {exp.period}
                    </span>
                </div>

                {/* Highlights */}
                <ul style={{ listStyle: "none", padding: 0, margin: "0 0 1.1rem 0" }}>
                    {exp.highlights.map((h, i) => (
                        <li key={i} style={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: "0.55rem",
                            marginBottom: "0.5rem",
                        }}>
                            {/* Chevron icon in the card's node colour */}
                            <svg
                                width="14"
                                height="14"
                                viewBox="0 0 14 14"
                                fill="none"
                                style={{
                                    flexShrink: 0,
                                    marginTop: "0.3rem",
                                    filter: `drop-shadow(0 0 4px ${exp.nodeColor}66)`,
                                }}
                            >
                                <circle cx="7" cy="7" r="6.5" stroke={exp.nodeColor} strokeOpacity="0.25" />
                                <path
                                    d="M5.5 4.5L8.5 7L5.5 9.5"
                                    stroke={exp.nodeColor}
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                            <span style={{
                                color: "var(--muted)",
                                fontSize: "0.875rem",
                                lineHeight: 1.78,
                            }}>
                                {h}
                            </span>
                        </li>
                    ))}
                </ul>

                {/* Tags */}
                <div style={{ display: "flex", gap: "0.45rem", flexWrap: "wrap" }}>
                    {exp.tags.map((tag) => {
                        const c = tagColors[tag] ?? "#6366f1";
                        return (
                            <span key={tag} style={{
                                fontSize: "0.72rem",
                                padding: "0.18rem 0.6rem",
                                borderRadius: "0.3rem",
                                background: `color-mix(in srgb, ${c} 10%, transparent)`,
                                color: c,
                                border: `1px solid color-mix(in srgb, ${c} 32%, transparent)`,
                                fontFamily: "'JetBrains Mono', monospace",
                                textShadow: `0 0 8px color-mix(in srgb, ${c} 35%, transparent)`,
                            }}>
                                {tag}
                            </span>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default function Experience() {
    const { theme } = useTheme();
    const isLight = theme === "light";

    return (
        <section id="experience" className="section" style={{ position: "relative", overflow: "hidden" }}>

            {/* ── Interactive constellation background ── */}
            <ConstellationBg isLight={isLight} />

            <div className="container" style={{ position: "relative", zIndex: 1 }}>

                {/* ── Section header ── */}
                <div style={{ marginBottom: "3.5rem" }}>
                    <div className="section-tag">💼 Career</div>
                    <h2 className="section-heading">
                        Work <span className="gradient-text">Experience</span>
                    </h2>
                    <p style={{ color: "var(--muted)", maxWidth: "500px" }}>
                        A track record of delivering impactful solutions across security, trading, and non-profit sectors.
                    </p>
                </div>

                {/* ── Timeline wrapper ── */}
                <div style={{ position: "relative" }}>

                    {/* Full-height gradient spine behind all nodes */}
                    <div
                        className="tl-spine"
                        style={{
                            position: "absolute",
                            /* align with center of the 28px node column */
                            left: "13px",
                            top: "14px",
                            bottom: "14px",
                            width: "2px",
                            background: isLight
                                ? "linear-gradient(to bottom, #6366f1, #8b5cf6, #a78bfa, transparent)"
                                : "linear-gradient(to bottom, #6366f1aa, #8b5cf688, #a78bfa44, transparent)",
                            borderRadius: "2px",
                            pointerEvents: "none",
                        }}
                    />

                    {/* Entries — each self-observes for its own reveal */}
                    {experiences.map((exp, idx) => (
                        <TimelineEntry
                            key={exp.company}
                            exp={exp}
                            idx={idx}
                            isLast={idx === experiences.length - 1}
                        />
                    ))}
                </div>
            </div>

            <style>{`
                /* Pulse animation for the "current" node */
                @keyframes tlPulse {
                    0%, 100% { transform: scale(1);   opacity: 0.5; }
                    50%       { transform: scale(1.55); opacity: 0;   }
                }
                .tl-pulse { animation: tlPulse 2.4s ease-in-out infinite; }

                /* Respect reduced motion */
                @media (prefers-reduced-motion: reduce) {
                    .tl-entry  { opacity: 1 !important; transform: none !important; transition: none !important; }
                    .tl-pulse  { animation: none; }
                    .tl-node   { transition: none !important; }
                }

                /* Mobile: tighten spine gap */
                @media (max-width: 600px) {
                    .tl-spine { left: 11px !important; }
                }
            `}</style>
        </section>
    );
}
