"use client";

import { useRef, useEffect, useState } from "react";
import { useTheme } from "./ThemeProvider";

/* ── Education data ──────────────────────────────────────────────── */
const highlights = [
    {
        icon: "🏛️",
        label: "Degree",
        value: "Bachelor of Engineering",
        sub: "Civil Engineering",
    },
    {
        icon: "🏫",
        label: "Institution",
        value: "West Yangon Technological University",
        sub: "Yangon, Myanmar",
    },
    {
        icon: "📅",
        label: "Graduated",
        value: "2017",
        sub: "2011 – 2017",
    },
];

const ceSkills = [
    { label: "Structural Analysis", icon: "📐" },
    { label: "Reinforced Concrete Design", icon: "🏗️" },
    { label: "Fluid Mechanics", icon: "💧" },
    { label: "Geotechnical Engineering", icon: "⛏️" },
    { label: "Highway & Transportation", icon: "🛣️" },
    { label: "Engineering Drawing", icon: "📏" },
];

const devSkills = [
    { label: "React & Next.js", color: "#61dafb" },
    { label: "TypeScript", color: "#3178c6" },
    { label: "Laravel & PHP", color: "#ff2d20" },
    { label: "Node.js", color: "#83cd29" },
    { label: "MySQL & Prisma", color: "#f29111" },
    { label: "Docker & Kubernetes", color: "#2496ed" },
];

/* ────────────────────────────────────────────────────────────────
   Diagonal stripes background — pure CSS via inline SVG data URI.
   Completely different from any other section's bg.
   ──────────────────────────────────────────────────────────────── */
function StripeBg({ isLight }: { isLight: boolean }) {
    const color = isLight ? "99,102,241" : "99,102,241";
    const opacity = isLight ? "0.04" : "0.06";
    return (
        <div
            aria-hidden
            style={{
                position: "absolute",
                inset: 0,
                backgroundImage: `repeating-linear-gradient(
                    -45deg,
                    rgba(${color},${opacity}) 0px,
                    rgba(${color},${opacity}) 1px,
                    transparent 1px,
                    transparent 28px
                )`,
                pointerEvents: "none",
                zIndex: 0,
            }}
        />
    );
}

/* ── Scroll-reveal hook ─────────────────────────────────────────── */
function useReveal(delay = 0) {
    const ref = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const obs = new IntersectionObserver(
            ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
            { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
        );
        obs.observe(el);
        return () => obs.disconnect();
    }, []);
    return {
        ref,
        style: {
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(24px)",
            transition: `opacity 0.55s ${delay}s cubic-bezier(0.22,1,0.36,1), transform 0.55s ${delay}s cubic-bezier(0.22,1,0.36,1)`,
        } as React.CSSProperties,
    };
}

/* ── Degree stat card ───────────────────────────────────────────── */
function StatCard({
    item,
    isLight,
    delay,
}: {
    item: typeof highlights[number];
    isLight: boolean;
    delay: number;
}) {
    const [hovered, setHovered] = useState(false);
    const reveal = useReveal(delay);
    return (
        <div
            ref={reveal.ref}
            style={reveal.style}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <div style={{
                padding: "1.3rem 1.4rem",
                borderRadius: "14px",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                background: isLight
                    ? hovered ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.65)"
                    : hovered ? "rgba(20,20,35,0.85)" : "rgba(14,14,24,0.7)",
                border: hovered
                    ? "1px solid rgba(99,102,241,0.35)"
                    : "1px solid rgba(99,102,241,0.14)",
                boxShadow: hovered
                    ? isLight
                        ? "0 8px 32px rgba(99,102,241,0.12)"
                        : "0 8px 32px rgba(0,0,0,0.5)"
                    : "none",
                transition: "all 0.3s ease",
                display: "flex",
                flexDirection: "column" as const,
                gap: "0.3rem",
                height: "100%",
            }}>
                <span style={{ fontSize: "1.5rem", lineHeight: 1 }}>{item.icon}</span>
                <div style={{
                    fontSize: "0.68rem",
                    fontFamily: "'JetBrains Mono', monospace",
                    color: "var(--accent)",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase" as const,
                    marginTop: "0.4rem",
                }}>
                    {item.label}
                </div>
                <div style={{
                    fontWeight: 700,
                    fontSize: "0.95rem",
                    color: "var(--heading)",
                    lineHeight: 1.3,
                }}>
                    {item.value}
                </div>
                <div style={{ fontSize: "0.8rem", color: "var(--muted)" }}>
                    {item.sub}
                </div>
            </div>
        </div>
    );
}

/* ── Main component ─────────────────────────────────────────────── */
export default function Education() {
    const { theme } = useTheme();
    const isLight = theme === "light";

    const headerReveal = useReveal(0);
    const ceReveal = useReveal(0.1);
    const devReveal = useReveal(0.2);
    const bannerReveal = useReveal(0.15);

    return (
        <section
            id="education"
            className="section"
            style={{ position: "relative", overflow: "hidden" }}
        >
            {/* Diagonal stripe background — unique to this section */}
            {/* <StripeBg isLight={isLight} /> */}

            {/* Accent corner glow */}
            <div aria-hidden style={{
                position: "absolute",
                top: "0px",
                right: "-200px",
                width: "420px",
                height: "420px",
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(139,92,246,0.12), transparent 70%)",
                pointerEvents: "none",
                zIndex: 0,
            }} />
            <div aria-hidden style={{
                position: "absolute",
                bottom: "0px",
                left: "-80px",
                width: "320px",
                height: "320px",
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(99,102,241,0.09), transparent 70%)",
                pointerEvents: "none",
                zIndex: 0,
            }} />

            <div className="container" style={{ position: "relative", zIndex: 1 }}>

                {/* ── Section header ── */}
                <div ref={headerReveal.ref} style={{ ...headerReveal.style, marginBottom: "3rem" }}>
                    <div className="section-tag">🎓 Education</div>
                    <h2 className="section-heading">
                        Academic <span className="gradient-text">Background</span>
                    </h2>
                    <p style={{ color: "var(--muted)", maxWidth: "520px" }}>
                        Graduated as a Civil Engineer — then taught myself to code and built a full professional
                        career in software development.
                    </p>
                </div>

                {/* ── Three stat cards ── */}
                <div className="edu-stats" style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: "1rem",
                    marginBottom: "2.5rem",
                }}>
                    {highlights.map((item, i) => (
                        <StatCard key={item.label} item={item} isLight={isLight} delay={i * 0.08} />
                    ))}
                </div>

                {/* ── Career pivot banner ── */}
                <div ref={bannerReveal.ref} style={bannerReveal.style}>
                    <div style={{
                        padding: "1.25rem 1.5rem",
                        borderRadius: "14px",
                        background: isLight
                            ? "linear-gradient(135deg, rgba(99,102,241,0.07), rgba(139,92,246,0.04))"
                            : "linear-gradient(135deg, rgba(99,102,241,0.1), rgba(139,92,246,0.06))",
                        border: "1px solid rgba(99,102,241,0.18)",
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "1rem",
                    }}>
                        {/* Left accent bar */}
                        <div style={{
                            width: "3px",
                            alignSelf: "stretch",
                            borderRadius: "3px",
                            background: "linear-gradient(to bottom, #6366f1, #8b5cf6)",
                            flexShrink: 0,
                        }} />
                        <div>
                            <div style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.5rem",
                                marginBottom: "0.4rem",
                            }}>
                                <span style={{ fontSize: "1rem" }}>⌨️</span>
                                <span style={{
                                    fontFamily: "'JetBrains Mono', monospace",
                                    fontSize: "0.72rem",
                                    color: "#6366f1",
                                    fontWeight: 700,
                                    letterSpacing: "0.1em",
                                    textTransform: "uppercase" as const,
                                }}>
                                    Career Pivot
                                </span>
                            </div>
                            <p style={{
                                color: "var(--muted)",
                                fontSize: "0.875rem",
                                lineHeight: 1.78,
                                margin: 0,
                            }}>
                                After graduating as a Civil Engineer, I taught myself web development from scratch
                                and transitioned into a full-time software engineering career.
                                The engineering discipline —{" "}
                                <strong style={{ color: "var(--text-secondary)" }}>
                                    systematic thinking, structured design, and rigorous problem-solving
                                </strong>{" "}
                                — transferred directly and continues to shape how I architect and build software today.
                            </p>
                        </div>
                    </div>
                </div>

            </div>

            <style>{`
                @media (max-width: 768px) {
                    #education .edu-stats  { grid-template-columns: 1fr !important; }
                    #education .edu-cols   { grid-template-columns: 1fr !important; }
                }
                @media (max-width: 600px) {
                    #education .edu-3cols { grid-template-columns: 1fr !important; }
                }
                @media (prefers-reduced-motion: reduce) {
                    #education * { transition: none !important; }
                }
            `}</style>
        </section>
    );
}
