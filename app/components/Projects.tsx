"use client";

import { useRef, useEffect, useState } from "react";
import { useTheme } from "./ThemeProvider";
import { FiGithub, FiExternalLink, FiArrowUpRight } from "react-icons/fi";
import {
    SiNextdotjs, SiReact, SiLaravel, SiTypescript,
    SiTailwindcss, SiPrisma, SiMysql, SiDocker,
    SiSupabase, SiVercel, SiPhp,
} from "react-icons/si";
import type { IconType } from "react-icons";

/* ── Project data ── */
interface Project {
    title: string;
    description: string;
    longDesc: string;
    tags: { name: string; Icon: IconType; color: string }[];
    github?: string;
    demo?: string;
    featured: boolean;
    status: "live" | "wip" | "archived";
    year: string;
    type: string;
}

const projects: Project[] = [
    {
        title: "ERP & POS System",
        description: "Full-stack enterprise resource planning and point-of-sale platform built from scratch.",
        longDesc:
            "Replaced a legacy Google Sheets workflow with a fully customized POS, Inventory Management, and Accounting application. Architected for high scalability with a serverless database and streamlined CI/CD via Vercel.",
        tags: [
            { name: "React", Icon: SiReact, color: "#61dafb" },
            { name: "Prisma", Icon: SiPrisma, color: "#5a67d8" },
            { name: "TypeScript", Icon: SiTypescript, color: "#3178c6" },
            { name: "Vercel", Icon: SiVercel, color: "#a0aec0" },
        ],
        featured: true,
        status: "live",
        year: "2023",
        type: "Full-Stack Application",
    },
    {
        title: "Cyber Security Admin Dashboard",
        description: "Secure admin dashboard and REST API backend for a cyber-security firm.",
        longDesc:
            "Engineered the full backend and admin interface for RITZ Cyber Security — including client consultation tools, role-based access control, and a containerized deployment pipeline with Docker and Kubernetes.",
        tags: [
            { name: "Laravel", Icon: SiLaravel, color: "#ff2d20" },
            { name: "MySQL", Icon: SiMysql, color: "#f29111" },
            { name: "Docker", Icon: SiDocker, color: "#2496ed" },
            { name: "PHP", Icon: SiPhp, color: "#8892be" },
        ],
        featured: true,
        status: "live",
        year: "2024",
        type: "Backend / DevOps",
    },
    {
        title: "Organisation Website",
        description: "Corporate website for a non-profit organisation — delivered end-to-end.",
        longDesc:
            "Directed and supervised a third-party development agency during the build, then assumed full ownership post-deployment — maintaining the system architecture and shipping new features independently.",
        tags: [
            { name: "Next.js", Icon: SiNextdotjs, color: "#ffffff" },
            { name: "Tailwind CSS", Icon: SiTailwindcss, color: "#38bdf8" },
            { name: "TypeScript", Icon: SiTypescript, color: "#3178c6" },
        ],
        featured: false,
        status: "live",
        year: "2022",
        type: "Web Application",
    },
    {
        title: "Developer Portfolio",
        description: "This portfolio — built with Next.js, TypeScript, and pure CSS animations.",
        longDesc:
            "Hand-crafted without a UI library. Features a canvas-based animated grid, 3D skill cards, timeline experience section, and a constellation background — all with dark/light theme support.",
        tags: [
            { name: "Next.js", Icon: SiNextdotjs, color: "#ffffff" },
            { name: "TypeScript", Icon: SiTypescript, color: "#3178c6" },
            { name: "Tailwind CSS", Icon: SiTailwindcss, color: "#38bdf8" },
            { name: "Vercel", Icon: SiVercel, color: "#a0aec0" },
        ],
        github: "https://github.com/akayti",
        demo: "#hero",
        featured: false,
        status: "live",
        year: "2026",
        type: "Portfolio",
    },
];

/* ── Shared constellation bg (same parameters as Experience) ── */
function ConstellationBg({ isLight }: { isLight: boolean }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const isLightRef = useRef(isLight);
    useEffect(() => { isLightRef.current = isLight; }, [isLight]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        type P = { x: number; y: number; vx: number; vy: number; r: number; alpha: number; phase: number };
        const PC = 50, CD = 140, MP = 90, MF = 0.012;
        let W = 0, H = 0, particles: P[] = [], animId: number, time = 0, visible = true;
        const mouse = { x: -9999, y: -9999 };

        const init = () => {
            particles = Array.from({ length: PC }, () => ({
                x: Math.random() * W, y: Math.random() * H,
                vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
                r: 1 + Math.random() * 1.5, alpha: 0.3 + Math.random() * 0.5,
                phase: Math.random() * Math.PI * 2,
            }));
        };
        const resize = () => {
            W = canvas.offsetWidth; H = canvas.offsetHeight;
            canvas.width = W; canvas.height = H; init();
        };
        resize();
        const ro = new ResizeObserver(resize);
        ro.observe(canvas);

        const onMove = (e: MouseEvent) => {
            const r = canvas.getBoundingClientRect();
            mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
        };
        window.addEventListener("mousemove", onMove);

        const visObs = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { threshold: 0 });
        visObs.observe(canvas);

        const draw = () => {
            animId = requestAnimationFrame(draw);
            if (!visible) return;
            const light = isLightRef.current;
            const AR = 99, AG = 102, AB = 241;
            ctx.clearRect(0, 0, W, H);

            particles.forEach((p) => {
                const dx = mouse.x - p.x, dy = mouse.y - p.y, d = Math.sqrt(dx * dx + dy * dy);
                if (d < MP && d > 1) { p.vx += (dx / d) * MF; p.vy += (dy / d) * MF; }
                p.vx *= 0.98; p.vy *= 0.98; p.x += p.vx; p.y += p.vy;
                if (p.x < -20) p.x = W + 20; if (p.x > W + 20) p.x = -20;
                if (p.y < -20) p.y = H + 20; if (p.y > H + 20) p.y = -20;
            });

            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const a = particles[i], b = particles[j];
                    const dx = a.x - b.x, dy = a.y - b.y, d = Math.sqrt(dx * dx + dy * dy);
                    if (d > CD) continue;
                    const alpha = (light ? 0.08 : 0.07) * Math.pow(1 - d / CD, 2);
                    ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
                    ctx.strokeStyle = `rgba(${AR},${AG},${AB},${alpha})`; ctx.lineWidth = 0.8; ctx.stroke();
                }
            }
            particles.forEach((p) => {
                const shimmer = 0.5 + 0.5 * Math.sin(time * 1.4 + p.phase);
                const dx = mouse.x - p.x, dy = mouse.y - p.y, md = Math.sqrt(dx * dx + dy * dy);
                const boost = Math.max(0, 1 - md / MP) * 0.6;
                const a = Math.min(1, (p.alpha + boost) * (0.75 + shimmer * 0.25));
                const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4);
                g.addColorStop(0, `rgba(${AR},${AG},${AB},${a * 0.35})`); g.addColorStop(1, `rgba(${AR},${AG},${AB},0)`);
                ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2); ctx.fillStyle = g; ctx.fill();
                ctx.beginPath(); ctx.arc(p.x, p.y, p.r * (1 + boost * 0.5), 0, Math.PI * 2);
                ctx.fillStyle = light ? `rgba(${AR},${AG},${AB},${a * 0.7})` : `rgba(180,185,255,${a * 0.8})`; ctx.fill();
            });
            const vig = ctx.createRadialGradient(W / 2, H / 2, H * 0.1, W / 2, H / 2, H * 0.85);
            vig.addColorStop(0, light ? "rgba(255,255,255,1)" : "rgba(0,0,0,0)");
            // vig.addColorStop(1, light ? "rgba(248,250,252,0.72)" : "rgba(5,5,15,0.65)");
            ctx.fillStyle = vig; ctx.fillRect(0, 0, W, H);
            time += 0.012;
        };
        draw();
        return () => { cancelAnimationFrame(animId); ro.disconnect(); visObs.disconnect(); window.removeEventListener("mousemove", onMove); };
    }, []);

    return <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 0 }} />;
}

/* ── Status badge ── */
const statusConfig = {
    live: { label: "Live", dot: "#22c55e", bg: "rgba(34,197,94,0.10)", border: "rgba(34,197,94,0.25)" },
    wip: { label: "WIP", dot: "#f59e0b", bg: "rgba(245,158,11,0.10)", border: "rgba(245,158,11,0.25)" },
    archived: { label: "Archived", dot: "#6b7280", bg: "rgba(107,114,128,0.10)", border: "rgba(107,114,128,0.25)" },
};

/* ── Project card ── */
function ProjectCard({ project, idx }: { project: Project; idx: number }) {
    const { theme } = useTheme();
    const isLight = theme === "light";
    const [hov, setHov] = useState(false);
    const [visible, setVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const st = statusConfig[project.status];

    useEffect(() => {
        const el = ref.current; if (!el) return;
        const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { rootMargin: "0px 0px -8% 0px", threshold: 0.1 });
        obs.observe(el); return () => obs.disconnect();
    }, []);

    return (
        <div
            ref={ref}
            onMouseEnter={() => setHov(true)}
            onMouseLeave={() => setHov(false)}
            style={{
                position: "relative",
                borderRadius: "1.25rem",
                overflow: "hidden",
                /* Background stays constant — no jarring flip on hover */
                background: isLight ? "rgba(255,255,255,0.68)" : "rgba(15,15,25,0.68)",
                border: hov
                    ? isLight ? "1px solid rgba(99,102,241,0.32)" : "1px solid rgba(99,102,241,0.40)"
                    : isLight ? "1px solid rgba(99,102,241,0.12)" : "1px solid rgba(99,102,241,0.15)",
                backdropFilter: "blur(24px) saturate(160%)",
                WebkitBackdropFilter: "blur(24px) saturate(160%)",
                boxShadow: hov
                    ? isLight
                        ? "0 16px 48px rgba(0,0,0,0.11), 0 0 0 1px rgba(99,102,241,0.08)"
                        : "0 16px 48px rgba(0,0,0,0.6), 0 0 24px rgba(99,102,241,0.10)"
                    : isLight
                        ? "0 4px 20px rgba(0,0,0,0.07)"
                        : "0 4px 24px rgba(0,0,0,0.4)",
                transform: visible ? (hov ? "translateY(-4px)" : "translateY(0)") : "translateY(32px) scale(0.97)",
                opacity: visible ? 1 : 0,
                transition: `opacity 0.6s cubic-bezier(0.22,1,0.36,1) ${idx * 0.1}s, transform 0.6s cubic-bezier(0.22,1,0.36,1) ${idx * 0.1}s, border 0.3s ease, box-shadow 0.3s ease`,
            }}
        >
            {/* Top accent line */}
            <div style={{
                position: "absolute", top: 0, left: 0, right: 0, height: "2px",
                background: "linear-gradient(90deg, #6366f1, #8b5cf6, #a78bfa)",
                opacity: hov ? 1 : 0.3,
                transition: "opacity 0.3s ease",
                borderRadius: "1.25rem 1.25rem 0 0",
            }} />

            <div style={{ padding: "1.6rem 1.75rem" }}>
                {/* Header row */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap" }}>
                        {/* Status badge */}
                        <span style={{
                            display: "inline-flex", alignItems: "center", gap: "0.4rem",
                            fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.08em",
                            padding: "0.18rem 0.6rem", borderRadius: "999px",
                            background: st.bg, border: `1px solid ${st.border}`, color: st.dot,
                        }}>
                            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: st.dot, boxShadow: `0 0 5px ${st.dot}` }} />
                            {st.label}
                        </span>
                        {/* Type pill */}
                        <span style={{
                            fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.06em",
                            padding: "0.18rem 0.6rem", borderRadius: "999px",
                            background: "rgba(99,102,241,0.08)", color: "var(--accent2)",
                            border: "1px solid rgba(99,102,241,0.18)",
                        }}>
                            {project.type}
                        </span>
                    </div>
                    {/* Year */}
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.72rem", color: "var(--muted)" }}>
                        {project.year}
                    </span>
                </div>

                {/* Title */}
                <h3 style={{
                    fontSize: "1.1rem", fontWeight: 700,
                    color: hov ? "var(--heading)" : "var(--text)",
                    marginBottom: "0.6rem",
                    transition: "color 0.3s ease",
                }}>
                    {project.title}
                </h3>

                {/* Description */}
                <p style={{ fontSize: "0.875rem", color: "var(--muted)", lineHeight: 1.75, marginBottom: "1.1rem" }}>
                    {/* {hov ? project.longDesc : project.description} */}
                    {project.longDesc}
                </p>

                {/* Tech tags */}
                <div style={{ display: "flex", gap: "0.45rem", flexWrap: "wrap", marginBottom: "1.25rem" }}>
                    {project.tags.map(({ name, Icon, color }) => {
                        // In light mode, white (#fff / #a0aec0) tags are invisible — remap to readable dark colour
                        const effectiveColor = isLight && (color === "#ffffff" || color === "#a0aec0")
                            ? "#4b5563"
                            : color;
                        return (
                            <span key={name} style={{
                                display: "inline-flex", alignItems: "center", gap: "0.35rem",
                                fontSize: "0.72rem", padding: "0.2rem 0.6rem", borderRadius: "0.3rem",
                                fontFamily: "'JetBrains Mono', monospace",
                                background: `color-mix(in srgb, ${effectiveColor} 10%, transparent)`,
                                color: effectiveColor,
                                border: `1px solid color-mix(in srgb, ${effectiveColor} 30%, transparent)`,
                                textShadow: isLight ? "none" : `0 0 8px color-mix(in srgb, ${effectiveColor} 35%, transparent)`,
                            }}>
                                <Icon style={{ fontSize: "0.75rem", flexShrink: 0 }} />
                                {name}
                            </span>
                        );
                    })}
                </div>

                {/* Action links */}
                <div style={{ display: "flex", gap: "0.6rem" }}>
                    {project.github && (
                        <a href={project.github} target="_blank" rel="noopener noreferrer" style={{
                            display: "inline-flex", alignItems: "center", gap: "0.4rem",
                            fontSize: "0.8rem", padding: "0.45rem 0.9rem", borderRadius: "0.5rem",
                            textDecoration: "none",
                            border: isLight ? "1px solid rgba(99,102,241,0.18)" : "1px solid rgba(99,102,241,0.22)",
                            color: "var(--text-secondary)",
                            background: "transparent",
                            transition: "background 0.2s, color 0.2s",
                        }}
                            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(99,102,241,0.08)"; (e.currentTarget as HTMLElement).style.color = "var(--accent2)"; }}
                            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)"; }}
                        >
                            <FiGithub style={{ fontSize: "0.9rem" }} /> Code
                        </a>
                    )}
                    {project.demo && (
                        <a href={project.demo} target={project.demo.startsWith("http") ? "_blank" : undefined} rel={project.demo.startsWith("http") ? "noopener noreferrer" : undefined} style={{
                            display: "inline-flex", alignItems: "center", gap: "0.4rem",
                            fontSize: "0.8rem", padding: "0.45rem 0.9rem", borderRadius: "0.5rem",
                            textDecoration: "none",
                            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                            color: "#fff",
                            border: "1px solid transparent",
                            transition: "opacity 0.2s, transform 0.2s",
                        }}
                            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = "0.88"; (e.currentTarget as HTMLElement).style.transform = "scale(1.03)"; }}
                            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = "1"; (e.currentTarget as HTMLElement).style.transform = "scale(1)"; }}
                        >
                            <FiExternalLink style={{ fontSize: "0.9rem" }} /> Demo
                        </a>
                    )}
                    {!project.github && !project.demo && (
                        <span style={{
                            display: "inline-flex", alignItems: "center", gap: "0.4rem",
                            fontSize: "0.75rem", color: "var(--muted)",
                            fontFamily: "'JetBrains Mono', monospace",
                        }}>
                            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#6b7280", display: "inline-block" }} />
                            Private / NDA
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}

/* ── Main section ── */
export default function Projects() {
    const { theme } = useTheme();
    const isLight = theme === "light";
    const featured = projects.filter(p => p.featured);
    const others = projects.filter(p => !p.featured);

    return (
        <section id="projects" className="section" style={{ position: "relative", overflow: "hidden", background: "var(--bg)" }}>

            {/* Same constellation background as Experience */}
            <ConstellationBg isLight={isLight} />

            <div className="container" style={{ position: "relative", zIndex: 1 }}>

                {/* ── Header ── */}
                <div style={{ marginBottom: "3.5rem" }}>
                    <div className="section-tag">🛠️ Work</div>
                    <h2 className="section-heading">
                        Featured <span className="gradient-text">Projects</span>
                    </h2>
                    <p style={{ color: "var(--muted)", maxWidth: "520px", lineHeight: 1.8 }}>
                        A selection of production systems and applications built across security, commerce, and non-profit sectors.
                    </p>
                </div>

                {/* ── Featured: 2-col grid ── */}
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 1fr)",
                    gap: "1.25rem",
                    marginBottom: "1.25rem",
                }}>
                    {featured.map((p, i) => <ProjectCard key={p.title} project={p} idx={i} />)}
                </div>

                {/* ── Others: 2-col grid ── */}
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 1fr)",
                    gap: "1.25rem",
                }}>
                    {others.map((p, i) => <ProjectCard key={p.title} project={p} idx={featured.length + i} />)}
                </div>

                {/* ── GitHub CTA ── */}
                <div style={{ textAlign: "center", marginTop: "3rem" }}>
                    <a
                        href="https://github.com/akayti"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            display: "inline-flex", alignItems: "center", gap: "0.5rem",
                            fontSize: "0.875rem", padding: "0.7rem 1.5rem", borderRadius: "999px",
                            textDecoration: "none",
                            border: isLight ? "1px solid rgba(99,102,241,0.22)" : "1px solid rgba(99,102,241,0.28)",
                            color: "var(--accent2)",
                            background: isLight ? "rgba(99,102,241,0.05)" : "rgba(99,102,241,0.08)",
                            transition: "background 0.25s ease, transform 0.25s ease",
                        }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = isLight ? "rgba(99,102,241,0.10)" : "rgba(99,102,241,0.14)"; (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = isLight ? "rgba(99,102,241,0.05)" : "rgba(99,102,241,0.08)"; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
                    >
                        <FiGithub style={{ fontSize: "1rem" }} />
                        View all projects on GitHub
                        <FiArrowUpRight style={{ fontSize: "0.9rem" }} />
                    </a>
                </div>
            </div>

            <style>{`
                @media (max-width: 768px) {
                    #projects .container > div[style*="repeat(2"] {
                        grid-template-columns: 1fr !important;
                    }
                }
            `}</style>
        </section>
    );
}
