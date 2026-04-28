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

interface Skill {
    name: string;
    icon: IconType;
    color: string;
}

interface SkillGroup {
    category: string;
    emoji: string;
    skills: Skill[];
}

const skillGroups: SkillGroup[] = [
    {
        category: "Frontend",
        emoji: "🖥️",
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
        category: "Backend",
        emoji: "⚙️",
        skills: [
            { name: "PHP", icon: SiPhp, color: "#8892be" },
            { name: "Laravel", icon: SiLaravel, color: "#ff2d20" },
            { name: "Node.js", icon: SiNodedotjs, color: "#83cd29" },
            { name: "REST APIs", icon: FaServer, color: "#6366f1" },
            { name: "JWT / Auth", icon: FaShieldAlt, color: "#d63aff" },
        ],
    },
    {
        category: "Database & ORM",
        emoji: "🗄️",
        skills: [
            { name: "MySQL", icon: SiMysql, color: "#f29111" },
            { name: "PostgreSQL", icon: SiPostgresql, color: "#336791" },
            { name: "Prisma", icon: SiPrisma, color: "#5a67d8" },
            { name: "Supabase", icon: SiSupabase, color: "#3ecf8e" },
        ],
    },
    {
        category: "DevOps & Tools",
        emoji: "🚀",
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

export default function Skills() {
    return (
        <section id="skills" className="section" style={{ background: "var(--section-alt)" }}>
            <div className="divider" />
            <div className="container" style={{ paddingTop: "4rem" }}>
                {/* Header */}
                <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
                    <div className="section-tag" style={{ justifyContent: "center" }}>
                        ⚡ Tech Stack
                    </div>
                    <h2 className="section-heading" style={{ textAlign: "center" }}>
                        Skills &amp; <span className="gradient-text">Technologies</span>
                    </h2>
                    <p style={{ color: "#64748b", maxWidth: "500px", margin: "0 auto" }}>
                        A collection of tools and technologies I use to build production-grade applications.
                    </p>
                </div>

                {/* Cards grid */}
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                        gap: "1.5rem",
                    }}
                >
                    {skillGroups.map((group) => (
                        <div key={group.category} className="card">
                            {/* Category header */}
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "0.5rem",
                                    fontSize: "0.7rem",
                                    fontWeight: 700,
                                    letterSpacing: "0.12em",
                                    textTransform: "uppercase",
                                    color: "#6366f1",
                                    marginBottom: "1.25rem",
                                    fontFamily: "'JetBrains Mono', monospace",
                                }}
                            >
                                <span style={{ fontSize: "1rem" }}>{group.emoji}</span>
                                {group.category}
                            </div>

                            {/* Skill badges */}
                            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.55rem" }}>
                                {group.skills.map((skill) => {
                                    const Icon = skill.icon;
                                    return (
                                        <span
                                            key={skill.name}
                                            className="skill-badge skill-badge-icon"
                                            style={{ "--skill-color": skill.color } as React.CSSProperties}
                                        >
                                            <Icon
                                                style={{
                                                    fontSize: "1rem",
                                                    flexShrink: 0,
                                                    color: skill.color,
                                                    filter: `drop-shadow(0 0 4px ${skill.color}55)`,
                                                }}
                                            />
                                            {skill.name}
                                        </span>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
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
            `}</style>
        </section>
    );
}
