"use client";

import { useEffect, useRef, useState } from "react";
import {
    SiHtml5, SiJavascript, SiReact, SiNextdotjs, SiBootstrap, SiTailwindcss,
    SiTypescript, SiVuedotjs,
    SiPhp, SiLaravel,
    SiMysql, SiPrisma, SiPostgresql, SiSupabase,
    SiGit, SiGithub, SiDocker, SiKubernetes, SiLinux, SiVercel, SiFigma,
    SiNodedotjs,
} from "react-icons/si";
import { FaServer, FaShieldAlt, FaCode } from "react-icons/fa";
import type { IconType } from "react-icons";

interface Skill { name: string; icon: IconType; color: string; }
interface SkillGroup { category: string; emoji: string; skills: Skill[]; }

const skillGroups: SkillGroup[] = [
    {
        category: "Frontend", emoji: "🖥️",
        skills: [
            { name: "HTML5", icon: SiHtml5, color: "#e34f26" },
            { name: "CSS3", icon: FaCode, color: "#1572b6" },
            { name: "JavaScript", icon: SiJavascript, color: "#f7df1e" },
            { name: "TypeScript", icon: SiTypescript, color: "#3178c6" },
            { name: "React.js", icon: SiReact, color: "#61dafb" },
            { name: "Next.js", icon: SiNextdotjs, color: "#ffffff" },
            { name: "Vue.js", icon: SiVuedotjs, color: "#4fc08d" },
            { name: "Bootstrap", icon: SiBootstrap, color: "#7952b3" },
            { name: "Tailwind CSS", icon: SiTailwindcss, color: "#38bdf8" },
        ],
    },
    {
        category: "Backend", emoji: "⚙️",
        skills: [
            { name: "PHP", icon: SiPhp, color: "#8892be" },
            { name: "Laravel", icon: SiLaravel, color: "#ff2d20" },
            { name: "Node.js", icon: SiNodedotjs, color: "#83cd29" },
            { name: "REST APIs", icon: FaServer, color: "#6366f1" },
            { name: "JWT / Auth", icon: FaShieldAlt, color: "#d63aff" },
        ],
    },
    {
        category: "Database & ORM", emoji: "🗄️",
        skills: [
            { name: "MySQL", icon: SiMysql, color: "#f29111" },
            { name: "PostgreSQL", icon: SiPostgresql, color: "#336791" },
            { name: "Prisma", icon: SiPrisma, color: "#5a67d8" },
            { name: "Supabase", icon: SiSupabase, color: "#3ecf8e" },
        ],
    },
    {
        category: "DevOps & Tools", emoji: "🚀",
        skills: [
            { name: "Git", icon: SiGit, color: "#f05032" },
            { name: "GitHub", icon: SiGithub, color: "#ffffff" },
            { name: "Docker", icon: SiDocker, color: "#2496ed" },
            { name: "Kubernetes", icon: SiKubernetes, color: "#326ce5" },
            { name: "Linux", icon: SiLinux, color: "#fcc624" },
            { name: "Vercel", icon: SiVercel, color: "#ffffff" },
            { name: "Figma", icon: SiFigma, color: "#f24e1e" },
        ],
    },
];

const progressBars = [
    { name: "Laravel", icon: SiLaravel, color: "#ff2d20", level: 90 },
    { name: "React", icon: SiReact, color: "#61dafb", level: 88 },
    { name: "Next.js", icon: SiNextdotjs, color: "#a5b4fc", level: 85 },
    { name: "TypeScript", icon: SiTypescript, color: "#3178c6", level: 82 },
    { name: "Docker", icon: SiDocker, color: "#2496ed", level: 75 },
    { name: "MySQL", icon: SiMysql, color: "#f29111", level: 85 },
];

function ProgressBar({ name, icon: Icon, color, level, animate }: {
    name: string; icon: IconType; color: string; level: number; animate: boolean;
}) {
    return (
        <div style={{ marginBottom: "1.1rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <Icon style={{ color, fontSize: "0.95rem", filter: `drop-shadow(0 0 4px ${color}66)` }} />
                    <span style={{ fontSize: "0.875rem", fontWeight: 500, color: "var(--text)" }}>{name}</span>
                </div>
                <span style={{
                    fontSize: "0.75rem",
                    fontFamily: "'JetBrains Mono', monospace",
                    color: "var(--muted)",
                    opacity: animate ? 1 : 0,
                    transition: "opacity 0.4s ease 0.6s",
                }}>
                    {level}%
                </span>
            </div>

            {/* Track */}
            <div style={{
                height: "5px",
                borderRadius: "999px",
                background: "var(--border)",
                overflow: "hidden",
            }}>
                {/* Fill */}
                <div style={{
                    height: "100%",
                    borderRadius: "999px",
                    width: animate ? `${level}%` : "0%",
                    background: `linear-gradient(90deg, ${color}99, ${color})`,
                    boxShadow: `0 0 8px ${color}55`,
                    transition: "width 1s cubic-bezier(0.4, 0, 0.2, 1)",
                }} />
            </div>
        </div>
    );
}

export default function Skills() {
    const sectionRef = useRef<HTMLElement>(null);
    const [animate, setAnimate] = useState(false);

    // Trigger progress bar animation when section enters viewport
    useEffect(() => {
        const el = sectionRef.current;
        if (!el) return;
        const obs = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) setAnimate(true); },
            { threshold: 0.2 }
        );
        obs.observe(el);
        return () => obs.disconnect();
    }, []);

    return (
        <section ref={sectionRef} id="skills" className="section" style={{ background: "var(--section-alt)" }}>
            <div className="divider" />
            <div className="container" style={{ paddingTop: "4rem" }}>

                {/* ── Single main header ── */}
                <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
                    <div className="section-tag" style={{ justifyContent: "center" }}>⚡ Tech Stack</div>
                    <h2 className="section-heading" style={{ textAlign: "center" }}>
                        Skills &amp; <span className="gradient-text">Technologies</span>
                    </h2>
                    <p style={{ color: "var(--muted)", maxWidth: "520px", margin: "0 auto", fontSize: "0.95rem", lineHeight: 1.8 }}>
                        A collection of tools and technologies I use to build production-grade applications.
                    </p>
                </div>

                {/* Two-column layout */}
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "1fr auto 1fr",
                    gap: "0 4rem",
                    alignItems: "start",
                }}>

                    {/* ── LEFT: Technical Skills + progress bars ── */}
                    <div>
                        {/* Sub-title */}
                        <p style={{
                            fontSize: "0.7rem",
                            fontWeight: 700,
                            letterSpacing: "0.12em",
                            textTransform: "uppercase",
                            color: "var(--accent2)",
                            fontFamily: "'JetBrains Mono', monospace",
                            marginBottom: "0.5rem",
                        }}>
                            ⚡ Technical Skills
                        </p>
                        <p style={{ color: "var(--muted)", lineHeight: 1.8, marginBottom: "1.75rem", fontSize: "0.9rem" }}>
                            A well-rounded skill set across the full development stack.
                        </p>

                        {progressBars.map((bar) => (
                            <ProgressBar key={bar.name} {...bar} animate={animate} />
                        ))}
                    </div>

                    {/* Vertical divider */}
                    <div style={{
                        width: "1px",
                        alignSelf: "stretch",
                        background: "linear-gradient(to bottom, transparent, var(--border) 15%, var(--border) 85%, transparent)",
                        flexShrink: 0,
                        minHeight: "100%",
                    }} />

                    {/* ── RIGHT: skill badge groups ── */}
                    <div>
                        {/* Sub-title */}
                        <p style={{
                            fontSize: "0.7rem",
                            fontWeight: 700,
                            letterSpacing: "0.12em",
                            textTransform: "uppercase",
                            color: "var(--accent2)",
                            fontFamily: "'JetBrains Mono', monospace",
                            marginBottom: "0.5rem",
                        }}>
                            🛠️ Full Stack
                        </p>
                        <p style={{ color: "var(--muted)", lineHeight: 1.8, marginBottom: "1.75rem", fontSize: "0.9rem" }}>
                            A broad toolkit spanning frontend, backend, database, and DevOps.
                        </p>

                        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem" }}>
                            {skillGroups.map((group) => (
                                <div key={group.category}>
                                    {/* Category label */}
                                    {/* <div style={{
                                        // display: "flex",
                                        alignItems: "center",
                                        gap: "0.5rem",
                                        fontSize: "0.7rem",
                                        fontWeight: 700,
                                        letterSpacing: "0.12em",
                                        textTransform: "uppercase",
                                        color: "#6366f1",
                                        marginBottom: "0.75rem",
                                        fontFamily: "'JetBrains Mono', monospace",
                                    }}>
                                        <div style={{ fontSize: "1rem" }}>{group.emoji}</div>
                                        {group.category}
                                    </div> */}

                                    {/* Badges */}
                                    <div style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "0.4rem",
                                    }}>
                                        {group.skills.map((skill) => {
                                            const Icon = skill.icon;
                                            return (
                                                <span
                                                    key={skill.name}
                                                    className="skill-badge skill-badge-icon"
                                                    style={{ "--skill-color": skill.color, width: "100%", justifyContent: "flex-start" } as React.CSSProperties}
                                                >
                                                    <Icon style={{
                                                        fontSize: "1rem",
                                                        flexShrink: 0,
                                                        color: skill.color,
                                                        filter: `drop-shadow(0 0 4px ${skill.color}55)`,
                                                    }} />
                                                    {skill.name}
                                                </span>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <div className="divider" style={{ marginTop: "4rem" }} />

            <style>{`
                .skill-badge-icon {
                    transition: border-color 0.2s, background 0.2s, color 0.2s, transform 0.15s;
                }
                .skill-badge-icon:hover {
                    border-color: var(--skill-color, var(--accent));
                    background: color-mix(in srgb, var(--skill-color, var(--accent)) 12%, transparent);
                    color: var(--skill-color, var(--accent2));
                    transform: translateY(-2px);
                }
                .skill-badge-icon:hover svg {
                    filter: drop-shadow(0 0 6px var(--skill-color, var(--accent))) !important;
                }
                @media (max-width: 768px) {
                    #skills .container > div {
                        grid-template-columns: 1fr !important;
                    }
                    #skills .skills-divider {
                        display: none !important;
                    }
                }
            `}</style>
        </section>
    );
}
