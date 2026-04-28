const contacts = [
    {
        icon: "📞",
        label: "Phone",
        value: "09965127172",
        href: "tel:09965127172",
    },
    {
        icon: "✉️",
        label: "Gmail",
        value: "devakayti@gmail.com",
        href: "https://mail.google.com/mail/?view=cm&to=devakayti@gmail.com&su=Let%27s%20Work%20Together&body=Hi%20Aung%20Kyaw%20Thu%2C%0A%0AI%20came%20across%20your%20portfolio%20and%20would%20love%20to%20connect.",
    },
    {
        label: "LinkedIn",
        value: "linkedin.com/in/aung-kyaw-thu-44160125b",
        href: "https://linkedin.com/in/aung-kyaw-thu-44160125b/",
    },
    // {
    //     icon: "📍",
    //     label: "Location",
    //     value: "Thingangyan Township, Yangon",
    //     href: "#",
    // },
];

export default function Contact() {
    return (
        <section id="contact" className="section">
            <div className="container">
                {/* CTA Banner */}
                <div
                    style={{
                        background: "linear-gradient(135deg, rgba(99,102,241,0.12) 0%, rgba(139,92,246,0.08) 100%)",
                        border: "1px solid rgba(99,102,241,0.2)",
                        borderRadius: "1.5rem",
                        padding: "4rem 3rem",
                        textAlign: "center",
                        position: "relative",
                        overflow: "hidden",
                        marginBottom: "3rem",
                    }}
                >
                    <div
                        className="glow-blob"
                        style={{
                            width: "300px",
                            height: "300px",
                            background: "radial-gradient(circle, #6366f1, transparent 70%)",
                            top: "-100px",
                            left: "50%",
                            transform: "translateX(-50%)",
                        }}
                    />
                    <div style={{ position: "relative", zIndex: 1 }}>
                        <div className="section-tag" style={{ justifyContent: "center" }}>📬 Contact</div>
                        <h2 className="section-heading" style={{ textAlign: "center" }}>
                            Let&apos;s Work <span className="gradient-text">Together</span>
                        </h2>
                        <p style={{ color: "var(--muted)", maxWidth: "480px", margin: "0 auto 2rem", lineHeight: 1.8 }}>
                            Open to full-time roles, freelance projects, and technical consultations.
                            Let&apos;s build something great.
                        </p>
                        <a
                            href="https://mail.google.com/mail/?view=cm&to=devakayti@gmail.com&su=Let%27s%20Work%20Together&body=Hi%20Aung%20Kyaw%20Thu%2C%0A%0AI%20came%20across%20your%20portfolio%20and%20would%20love%20to%20connect."
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-primary"
                            style={{ display: "inline-flex", fontSize: "1rem", padding: "0.85rem 2rem" }}
                        >
                            Send a Message ✉️
                        </a>
                    </div>
                </div>

                {/* Contact pills */}
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                        gap: "1rem",
                    }}
                >
                    {contacts.map((c) => (
                        <a
                            key={c.label}
                            href={c.href}
                            target={c.href.startsWith("http") ? "_blank" : undefined}
                            rel={c.href.startsWith("http") ? "noopener noreferrer" : undefined}
                            className="contact-pill"
                        >
                            <span style={{ fontSize: "1.5rem" }}>{c.icon}</span>
                            <div>
                                <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                                    {c.label}
                                </div>
                                <div style={{ fontSize: "0.9rem", color: "var(--text)", marginTop: "0.1rem" }}>{c.value}</div>
                            </div>
                            <span style={{ marginLeft: "auto", color: "var(--text-secondary)" }}>↗</span>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
}
