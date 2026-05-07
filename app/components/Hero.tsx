
export default function Hero() {
    return (
        <section
            id="hero"
            className="section"
            style={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                position: "relative",
                overflow: "hidden",
                paddingTop: "7rem",
            }}
        >
            {/* Background glow blobs */}
            <div
                className="glow-blob"
                style={{
                    width: "500px",
                    height: "500px",
                    background: "radial-gradient(circle, #6366f1, transparent 70%)",
                    top: "-100px",
                    left: "-150px",
                }}
            />
            <div
                className="glow-blob"
                style={{
                    width: "400px",
                    height: "400px",
                    background: "radial-gradient(circle, #8b5cf6, transparent 70%)",
                    bottom: "-80px",
                    right: "-100px",
                    opacity: 0.1,
                }}
            />

            {/* Grid pattern overlay */}
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    backgroundImage:
                        "radial-gradient(circle at 1px 1px, rgba(99,102,241,0.07) 1px, transparent 0)",
                    backgroundSize: "40px 40px",
                    pointerEvents: "none",
                }}
            />

            <div className="container" style={{ position: "relative", zIndex: 2 }}>
                <div className="fade-up fade-up-1">
                    <span
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            fontFamily: "'JetBrains Mono', monospace",
                            fontSize: "0.8rem",
                            color: "var(--accent)",
                            marginBottom: "1.5rem",
                            letterSpacing: "0.05em",
                        }}
                    >
                        <span style={{ width: "1.5rem", height: "1px", background: "var(--accent)", display: "inline-block" }} />
                        Available for work
                        <span
                            style={{
                                width: "8px",
                                height: "8px",
                                borderRadius: "50%",
                                background: "#22c55e",
                                display: "inline-block",
                                boxShadow: "0 0 8px #22c55e",
                            }}
                        />
                    </span>
                </div>

                <h1 className="fade-up fade-up-2" style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)", fontWeight: 900, lineHeight: 1.1, marginBottom: "1.25rem" }}>
                    Hi, I&apos;m{" "}
                    <span className="gradient-text">Aung Kyaw Thu</span>
                </h1>

                <h2
                    className="fade-up fade-up-2"
                    style={{
                        fontSize: "clamp(1.25rem, 3vw, 2rem)",
                        fontWeight: 600,
                        color: "var(--text-secondary)",
                        marginBottom: "1.5rem",
                    }}
                >
                    Full Stack Developer
                </h2>

                <p
                    className="fade-up fade-up-3"
                    style={{
                        maxWidth: "620px",
                        fontSize: "1.05rem",
                        color: "var(--muted)",
                        lineHeight: 1.8,
                        marginBottom: "2.5rem",
                    }}
                >
                    4+ years building scalable, user-focused web applications and business systems.
                    Skilled in <span style={{ color: "var(--accent2)" }}>React / Next.js</span> and{" "}
                    <span style={{ color: "var(--accent2)" }}>PHP / Laravel</span>, with experience in Docker,
                    Kubernetes, and CI/CD pipelines.
                </p>

                <div className="fade-up fade-up-4" style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                    <a href="#contact" className="btn-primary">
                        Get in touch
                        <span>→</span>
                    </a>
                    <a
                        href="/Aung_Kyaw_Thu_Resume.pdf"
                        download="Aung Kyaw Thu Resume.pdf"
                        className="btn-secondary"
                        style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}
                    >
                        ↓ Download CV
                    </a>
                </div>

                {/* Stats */}
                <div
                    className="fade-up fade-up-4"
                    style={{
                        display: "flex",
                        gap: "3rem",
                        marginTop: "4rem",
                        paddingTop: "3rem",
                        borderTop: "1px solid var(--border)",
                        flexWrap: "wrap",
                    }}
                >
                    {[
                        { value: "4+", label: "Years Experience" },
                        { value: "3", label: "Companies" },
                        { value: "10+", label: "Tech Stack" },
                    ].map((stat) => (
                        <div key={stat.label}>
                            <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--heading)" }}>{stat.value}</div>
                            <div style={{ fontSize: "0.875rem", color: "var(--muted)", marginTop: "0.25rem" }}>{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
