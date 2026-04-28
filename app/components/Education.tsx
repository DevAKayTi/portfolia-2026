export default function Education() {
    return (
        <section id="education" className="section" style={{ background: "var(--section-alt)" }}>
            <div className="divider" />
            <div className="container" style={{ paddingTop: "4rem" }}>
                <div style={{ marginBottom: "3.5rem" }}>
                    <div className="section-tag">🎓 Education</div>
                    <h2 className="section-heading">
                        Academic <span className="gradient-text">Background</span>
                    </h2>
                </div>

                <div className="card" style={{ display: "flex", gap: "2rem", alignItems: "flex-start", flexWrap: "wrap" }}>
                    {/* Icon */}
                    <div
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
                        }}
                    >
                        🏛️
                    </div>

                    <div style={{ flex: 1 }}>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "flex-start",
                                flexWrap: "wrap",
                                gap: "0.5rem",
                                marginBottom: "0.5rem",
                            }}
                        >
                            <div>
                                <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--heading)" }}>
                                    Bachelor of Engineering in Civil Engineering
                                </h3>
                                <div style={{ color: "var(--accent)", fontWeight: 600, fontSize: "0.9rem", marginTop: "0.25rem" }}>
                                    West Yangon Technological University, Yangon
                                </div>
                            </div>
                            <span
                                style={{
                                    fontFamily: "'JetBrains Mono', monospace",
                                    fontSize: "0.8rem",
                                    color: "var(--text-secondary)",
                                }}
                            >
                                2011 – 2017
                            </span>
                        </div>
                        <p style={{ color: "var(--muted)", fontSize: "0.9rem", lineHeight: 1.75, marginTop: "0.75rem" }}>
                            Graduated with a B.E. in Civil Engineering, developing strong analytical and problem-solving
                            skills. Transitioned into software development, applying engineering principles of structured
                            design, systematic testing, and precise documentation to build reliable web applications.
                        </p>
                    </div>
                </div>
            </div>
            <div className="divider" style={{ marginTop: "4rem" }} />
        </section>
    );
}
