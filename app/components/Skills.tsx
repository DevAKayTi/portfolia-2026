const skills = [
    { category: "Frontend", items: ["HTML5 / CSS3", "JavaScript (ES6+)", "React.js", "Next.js", "Bootstrap", "Tailwind CSS"] },
    { category: "Backend", items: ["PHP", "Laravel", "RESTful APIs", "JSON"] },
    { category: "Database & ORM", items: ["MySQL", "Prisma", "PlanetScale"] },
    { category: "DevOps & Tools", items: ["Git", "Docker", "Kubernetes", "Linux", "Vercel", "Figma"] },
];

export default function Skills() {
    return (
        <section id="skills" className="section" style={{ background: "var(--section-alt)" }}>
            <div className="divider" />
            <div className="container" style={{ paddingTop: "4rem" }}>
                <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
                    <div className="section-tag" style={{ justifyContent: "center" }}>⚡ Tech Stack</div>
                    <h2 className="section-heading" style={{ textAlign: "center" }}>
                        Skills &amp; <span className="gradient-text">Technologies</span>
                    </h2>
                    <p style={{ color: "#64748b", maxWidth: "500px", margin: "0 auto" }}>
                        A collection of tools and technologies I use to build production-grade applications.
                    </p>
                </div>

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                        gap: "1.5rem",
                    }}
                >
                    {skills.map((group) => (
                        <div key={group.category} className="card">
                            <div
                                style={{
                                    fontSize: "0.7rem",
                                    fontWeight: 700,
                                    letterSpacing: "0.12em",
                                    textTransform: "uppercase",
                                    color: "#6366f1",
                                    marginBottom: "1.25rem",
                                    fontFamily: "'JetBrains Mono', monospace",
                                }}
                            >
                                {group.category}
                            </div>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.6rem" }}>
                                {group.items.map((skill) => (
                                    <span key={skill} className="skill-badge">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="divider" style={{ marginTop: "4rem" }} />
        </section>
    );
}
