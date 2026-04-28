export default function Footer() {
    const year = new Date().getFullYear();
    return (
        <footer
            style={{
                borderTop: "1px solid var(--border)",
                padding: "2rem 1.5rem",
                textAlign: "center",
                color: "var(--muted)",
                fontSize: "0.85rem",
            }}
        >
            <p>
                © {year} Aung Kyaw Thu. Built with{" "}
                <span style={{ color: "var(--accent)" }}>Next.js</span> &amp;{" "}
                <span style={{ color: "var(--accent)" }}>Tailwind CSS</span>.
            </p>
        </footer>
    );
}
