"use client";

import { useState } from "react";
import { useTheme } from "./ThemeProvider";

export default function Education() {
    const [hovered, setHovered] = useState(false);
    const { theme } = useTheme();
    const isLight = theme === "light";

    /* Exact same glass values as About.tsx right cards */
    const glassBg = isLight
        ? "rgba(99,102,241,0.06)"
        : "rgba(99,102,241,0.08)";
    const glassBorder = isLight
        ? "1px solid rgba(99,102,241,0.18)"
        : "1px solid rgba(99,102,241,0.22)";

    return (
        <section id="education" className="section" style={{ background: "var(--section-alt)" }}>
            <div className="divider" style={{ background: "transparent" }} />
            <div className="container" style={{ paddingTop: "4rem" }}>
                <div style={{ marginBottom: "3.5rem" }}>
                    <div className="section-tag">🎓 Education</div>
                    <h2 className="section-heading">
                        Academic <span className="gradient-text">Background</span>
                    </h2>
                </div>

                {/* Card — same hover effect as About.tsx right cards */}
                <div
                    onMouseEnter={() => setHovered(true)}
                    onMouseLeave={() => setHovered(false)}
                    style={{
                        display: "flex",
                        gap: "1.75rem",
                        alignItems: "flex-start",
                        flexWrap: "wrap",
                        padding: "1.4rem 1.5rem",
                        borderRadius: "1rem",
                        cursor: "default",
                        background: hovered ? glassBg : "transparent",
                        border: hovered ? glassBorder : "1px solid transparent",
                        backdropFilter: hovered ? "blur(28px) saturate(180%)" : "none",
                        WebkitBackdropFilter: hovered ? "blur(28px) saturate(180%)" : "none",
                        transition: "background 0.3s ease, border 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease, backdrop-filter 0.3s ease",
                    }}
                >
                    {/* Icon — spins/glows on hover, same pattern as About emoji icons */}
                    <span
                        style={{
                            width: "56px",
                            height: "56px",
                            borderRadius: "0.85rem",
                            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "1.5rem",
                            flexShrink: 0,
                            /* Animate on hover like About icons */
                            // transform: hovered ? "rotate(360deg)" : "none",
                            // filter: hovered ? "drop-shadow(0 0 8px rgba(99,102,241,0.4))" : "none",
                            // transition: "transform 0.4s cubic-bezier(0.34,1.2,0.64,1), filter 0.3s ease",
                        }}
                    >
                        🏛️
                    </span>

                    {/* Content */}
                    <div style={{ flex: 1 }}>
                        <div style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                            flexWrap: "wrap",
                            gap: "0.5rem",
                            marginBottom: "0.5rem",
                        }}>
                            <div>
                                <h3 style={{
                                    fontSize: "1.1rem",
                                    fontWeight: 700,
                                    color: hovered ? "var(--heading)" : "var(--text-secondary)",
                                    transition: "color 0.3s ease",
                                }}>
                                    Bachelor of Engineering in Civil Engineering
                                </h3>
                                <div style={{
                                    color: "var(--accent)",
                                    fontWeight: 600,
                                    fontSize: "0.9rem",
                                    marginTop: "0.25rem",
                                }}>
                                    West Yangon Technological University, Yangon
                                </div>
                            </div>
                            <span style={{
                                fontFamily: "'JetBrains Mono', monospace",
                                fontSize: "0.8rem",
                                color: "var(--text-secondary)",
                                whiteSpace: "nowrap",
                            }}>
                                2011 – 2017
                            </span>
                        </div>
                        <p style={{
                            color: "var(--muted)",
                            fontSize: "0.9rem",
                            lineHeight: 1.75,
                            marginTop: "0.75rem",
                        }}>
                            Graduated with a B.E. in Civil Engineering, developing strong analytical and problem-solving
                            skills. Transitioned into software development, applying engineering principles of structured
                            design, systematic testing, and precise documentation to build reliable web applications.
                        </p>
                    </div>
                </div>
            </div>
            <div className="divider" style={{ marginTop: "4rem", background: "transparent" }} />
        </section>
    );
}
