const experiences = [
    {
        period: "June 2024 – March 2026",
        role: "Senior Web Developer",
        company: "RITZ Cyber Security",
        current: true,
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
        highlights: [
            "Directed and supervised a third-party development agency during the creation of the organization's website, ensuring alignment with business requirements.",
            "Assumed full ownership of the application post-deployment, actively maintaining the system architecture and engineering new features.",
        ],
        tags: ["Project Management", "System Maintenance", "Full Stack"],
    },
];

export default function Experience() {
    return (
        <section id="experience" className="section">
            <div className="container">
                <div style={{ marginBottom: "3.5rem" }}>
                    <div className="section-tag">💼 Career</div>
                    <h2 className="section-heading">
                        Work <span className="gradient-text">Experience</span>
                    </h2>
                    <p style={{ color: "var(--muted)", maxWidth: "500px" }}>
                        A track record of delivering impactful solutions across security, trading, and non-profit sectors.
                    </p>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                    {experiences.map((exp) => (
                        <div
                            key={exp.company}
                            className="card"
                            style={{ position: "relative", paddingLeft: "2.5rem" }}
                        >
                            {/* Timeline accent bar */}
                            <div
                                style={{
                                    position: "absolute",
                                    left: 0,
                                    top: 0,
                                    bottom: 0,
                                    width: "3px",
                                    background: exp.current
                                        ? "linear-gradient(to bottom, #6366f1, #8b5cf6)"
                                        : "linear-gradient(to bottom, rgba(99,102,241,0.4), transparent)",
                                    borderRadius: "3px",
                                }}
                            />

                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "flex-start",
                                    flexWrap: "wrap",
                                    gap: "0.75rem",
                                    marginBottom: "1rem",
                                }}
                            >
                                <div>
                                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
                                        <h3 style={{ fontSize: "1.15rem", fontWeight: 700, color: "var(--heading)" }}>
                                            {exp.role}
                                        </h3>
                                        {exp.current && (
                                            <span
                                                style={{
                                                    fontSize: "0.7rem",
                                                    padding: "0.2rem 0.65rem",
                                                    borderRadius: "999px",
                                                    background: "rgba(34,197,94,0.12)",
                                                    color: "#22c55e",
                                                    border: "1px solid rgba(34,197,94,0.25)",
                                                    fontWeight: 600,
                                                    letterSpacing: "0.05em",
                                                }}
                                            >
                                                RECENT
                                            </span>
                                        )}
                                    </div>
                                    <div style={{ color: "var(--accent)", fontWeight: 600, fontSize: "0.925rem", marginTop: "0.2rem" }}>
                                        {exp.company}
                                    </div>
                                </div>
                                <span
                                    style={{
                                        fontFamily: "'JetBrains Mono', monospace",
                                        fontSize: "0.8rem",
                                        color: "var(--text-secondary)",
                                        whiteSpace: "nowrap",
                                    }}
                                >
                                    {exp.period}
                                </span>
                            </div>

                            <ul style={{ paddingLeft: "1.25rem", marginBottom: "1.25rem" }}>
                                {exp.highlights.map((h, i) => (
                                    <li
                                        key={i}
                                        style={{
                                            color: "var(--muted)",
                                            fontSize: "0.9rem",
                                            lineHeight: 1.75,
                                            marginBottom: "0.5rem",
                                        }}
                                    >
                                        {h}
                                    </li>
                                ))}
                            </ul>

                            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                                {exp.tags.map((tag) => (
                                    <span
                                        key={tag}
                                        style={{
                                            fontSize: "0.75rem",
                                            padding: "0.2rem 0.65rem",
                                            borderRadius: "0.35rem",
                                            background: "rgba(99,102,241,0.08)",
                                            color: "var(--accent2)",
                                            border: "1px solid rgba(99,102,241,0.2)",
                                            fontFamily: "'JetBrains Mono', monospace",
                                        }}
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
