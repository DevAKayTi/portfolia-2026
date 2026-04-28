export default function About() {
    return (
        <section id="about" className="section">
            <div className="container">
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "center" }}>
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
                        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                            <a href="https://linkedin.com/in/aung-kyaw-thu-44160125b/" target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ fontSize: "0.85rem", padding: "0.6rem 1.25rem" }}>
                                LinkedIn ↗
                            </a>
                            <a href="tel:09965127172" className="btn-secondary" style={{ fontSize: "0.85rem", padding: "0.6rem 1.25rem" }}>
                                09965127172
                            </a>
                        </div>
                    </div>

                    {/* Right: info cards */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                        {[
                            {
                                icon: "🎯",
                                title: "Requirement Gathering & UI Design",
                                desc: "Direct client consultations, Figma prototyping, and translating business needs into functional interfaces.",
                            },
                            {
                                icon: "⚙️",
                                title: "Backend & API Engineering",
                                desc: "Building secure, scalable REST APIs and admin dashboards using Laravel, Prisma, and MySQL.",
                            },
                            {
                                icon: "🚀",
                                title: "DevOps & Deployment",
                                desc: "Containerizing apps with Docker, writing Kubernetes configs, and managing CI/CD with Vercel.",
                            },
                        ].map((item) => (
                            <div key={item.title} className="card" style={{ display: "flex", gap: "1.25rem", alignItems: "flex-start", padding: "1.5rem" }}>
                                <span style={{ fontSize: "1.5rem", lineHeight: 1 }}>{item.icon}</span>
                                <div>
                                    <div style={{ fontWeight: 600, fontSize: "0.95rem", marginBottom: "0.35rem", color: "var(--heading)" }}>{item.title}</div>
                                    <div style={{ fontSize: "0.875rem", color: "var(--muted)", lineHeight: 1.7 }}>{item.desc}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <style>{`
        @media (max-width: 768px) {
          #about .container > div {
            grid-template-columns: 1fr !important;
            gap: 2.5rem !important;
          }
        }
      `}</style>
        </section>
    );
}
