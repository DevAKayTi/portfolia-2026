"use client";

import { useState } from "react";
import { useTheme } from "./ThemeProvider";

const cards = [
    {
        icon: "🎯",
        title: "Requirement Gathering & UI Design",
        desc: "Direct client consultations, Figma prototyping, and translating business needs into functional interfaces.",
        hoverTransform: "scaleX(-1)",      // flip horizontal
    },
    {
        icon: "⚙️",
        title: "Backend & API Engineering",
        desc: "Building secure, scalable REST APIs and admin dashboards using Laravel, Prisma, and MySQL.",
        hoverTransform: "rotate(360deg)",  // rotate right 180°
    },
    {
        icon: "🚀",
        title: "DevOps & Deployment",
        desc: "Containerizing apps with Docker, writing Kubernetes configs, and managing CI/CD with Vercel.",
        hoverTransform: "rotate(-45deg)",  // rotate left 45°
    },
];

export default function About() {
    const [hovered, setHovered] = useState<string | null>(null);
    const { theme } = useTheme();
    const isLight = theme === "light";

    const glassBg = isLight
        ? "rgba(99,102,241,0.06)"
        : "rgba(99,102,241,0.08)";
    const glassBorder = isLight
        ? "1px solid rgba(99,102,241,0.18)"
        : "1px solid rgba(99,102,241,0.22)";
    const glassShadow = isLight
        ? "0 8px 32px rgba(0,0,0,0.10), inset 0 1px 0 rgba(255,255,255,0.8)"
        : "0 8px 32px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.06)";

    return (
        <section id="about" className="section">
            <div className="container">
                <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: "0 3rem", alignItems: "center" }}>

                    {/* Left: text */}
                    <div>
                        <div className="section-tag">✦ About Me</div>
                        <h2 className="section-heading">
                            Building products that <span className="gradient-text">matter</span>
                        </h2>
                        <p style={{ color: "var(--muted)", lineHeight: 1.9, marginBottom: "1.25rem" }}>
                            I&apos;m a Full Stack Developer based in Yangon, Myanmar, with 4+ years of experience
                            delivering end-to-end web solutions — from requirement gathering and UI/UX design
                            to backend engineering and cloud deployments.
                        </p>
                        <p style={{ color: "var(--muted)", lineHeight: 1.9, marginBottom: "2rem" }}>
                            I&apos;ve led cross-functional teams, built ERP and POS systems from scratch, and
                            containerized production applications with Docker and Kubernetes. I thrive at the
                            intersection of strong engineering fundamentals and business impact.
                        </p>
                    </div>

                    {/* Vertical separator */}
                    <div className="about-divider" style={{
                        width: "1px",
                        alignSelf: "stretch",
                        background: "linear-gradient(to bottom, transparent, var(--border) 20%, var(--border) 80%, transparent)",
                        flexShrink: 0,
                    }} />

                    {/* Right: glass hover cards */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                        {cards.map((item) => {
                            const isHovered = hovered === item.title;
                            return (
                                <div
                                    key={item.title}
                                    onMouseEnter={() => setHovered(item.title)}
                                    onMouseLeave={() => setHovered(null)}
                                    style={{
                                        display: "flex",
                                        gap: "1.25rem",
                                        alignItems: "flex-start",
                                        padding: "1.4rem 1.5rem",
                                        borderRadius: "1rem",
                                        cursor: "default",
                                        // inactive: fully transparent
                                        background: isHovered ? glassBg : "transparent",
                                        border: isHovered ? glassBorder : "1px solid transparent",
                                        // boxShadow:            isHovered ? glassShadow  : "none",
                                        backdropFilter: isHovered ? "blur(28px) saturate(180%)" : "none",
                                        WebkitBackdropFilter: isHovered ? "blur(28px) saturate(180%)" : "none",
                                        // transform:            isHovered ? "translateY(-2px)" : "translateY(0)",
                                        transition: "background 0.3s ease, border 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease, backdrop-filter 0.3s ease",
                                    }}
                                >
                                    <span style={{
                                        fontSize: "1.5rem",
                                        lineHeight: 1,
                                        marginTop: "0.1rem",
                                        flexShrink: 0,
                                        display: "inline-block",
                                        transform: isHovered ? item.hoverTransform : "none",
                                        filter: isHovered ? "drop-shadow(0 0 8px rgba(99,102,241,0.4))" : "none",
                                        transition: "transform 0.4s cubic-bezier(0.34,1.2,0.64,1), filter 0.3s ease",
                                    }}>
                                        {item.icon}
                                    </span>
                                    <div>
                                        <div style={{
                                            fontWeight: 600,
                                            fontSize: "0.95rem",
                                            marginBottom: "0.35rem",
                                            color: isHovered ? "var(--heading)" : "var(--text-secondary)",
                                            transition: "color 0.3s ease",
                                        }}>
                                            {item.title}
                                        </div>
                                        <div style={{
                                            fontSize: "0.875rem",
                                            color: "var(--muted)",
                                            lineHeight: 1.7,
                                        }}>
                                            {item.desc}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            <style>{`
                @media (max-width: 768px) {
                    #about .container > div {
                        grid-template-columns: 1fr !important;
                        gap: 2.5rem !important;
                    }
                    #about .about-divider {
                        display: none !important;
                    }
                }
            `}</style>
        </section>
    );
}
