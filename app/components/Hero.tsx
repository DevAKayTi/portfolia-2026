"use client";

import { useEffect, useState } from "react";import AnimatedGrid from "./AnimatedGrid";
import TypewriterText from "./TypewriterText";

/* ── Blinking cursor ── */
function Cursor() {
    const [on, setOn] = useState(true);
    useEffect(() => {
        const t = setInterval(() => setOn((v) => !v), 530);
        return () => clearInterval(t);
    }, []);
    return (
        <span style={{
            display: "inline-block",
            width: "2px",
            height: "1em",
            background: "#6366f1",
            marginLeft: "2px",
            verticalAlign: "text-bottom",
            opacity: on ? 1 : 0,
            transition: "opacity 0.1s",
        }} />
    );
}

/* ── Syntax token colours ── */
const C = {
    keyword: "#c792ea",
    fn: "#82aaff",
    type: "#ffcb6b",
    str: "#c3e88d",
    num: "#f78c6c",
    comment: "#546e7a",
    prop: "#80cbc4",
    punct: "#89ddff",
    plain: "#eeffff",
};

type Tok = { t: string; c: string };
const line = (...parts: Tok[]): Tok[] => parts;
const kw = (t: string): Tok => ({ t, c: C.keyword });
const fn_ = (t: string): Tok => ({ t, c: C.fn });
const typ = (t: string): Tok => ({ t, c: C.type });
const str = (t: string): Tok => ({ t, c: C.str });
const num = (t: string): Tok => ({ t, c: C.num });
const pr = (t: string): Tok => ({ t, c: C.prop });
const pu = (t: string): Tok => ({ t, c: C.punct });
const pl = (t: string): Tok => ({ t, c: C.plain });

const CODE_LINES: Tok[][] = [
    line(kw("const "), fn_("me"), pu(": "), typ("Developer"), pu(" = {")),
    line(pl("  "), pr("name"), pu(": "), str('"Aung Kyaw Thu"'), pu(",")),
    line(pl("  "), pr("role"), pu(": "), str('"Full Stack Developer"'), pu(",")),
    line(pl("  "), pr("Tech stack"), pu(": "), num("10"), str('+'), pu(",")),
    line(pl("  "), pr("years"), pu(": "), num("4"), str('+'), pu(",")),
    line(pl("  "), pr("companies"), pu(": "), num("3"), pu(",")),
    line(pu("};")),
    line(pl("")),
    line(kw("export default "), fn_("me"), pu(";")),
];

/* ── Floating Code Editor Card ── */
function CodeEditorCard() {
    const [visibleLines, setVisibleLines] = useState(0);

    /* Reveal lines one-by-one on mount */
    useEffect(() => {
        let i = 0;
        const t = setInterval(() => {
            i++;
            setVisibleLines(i);
            if (i >= CODE_LINES.length) clearInterval(t);
        }, 60);
        return () => clearInterval(t);
    }, []);

    return (
        <div
            className="code-editor-card"
            style={{
                borderRadius: "16px",
                overflow: "hidden",
                background: "#0d1117",
                border: "1px solid rgba(99,102,241,0.25)",
                boxShadow: "0 24px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(99,102,241,0.1), inset 0 1px 0 rgba(255,255,255,0.05)",
                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                fontSize: "0.78rem",
                lineHeight: 1.65,
                width: "100%",
                maxWidth: "420px",
                animation: "heroFloat 15s ease-in-out infinite",
            }}
        >
            {/* Title bar */}
            <div style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.65rem 1rem",
                background: "#161b22",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
            }}>
                {/* Traffic lights */}
                {["#ff5f56", "#ffbd2e", "#27c93f"].map((c) => (
                    <span key={c} style={{ width: "10px", height: "10px", borderRadius: "50%", background: c, flexShrink: 0 }} />
                ))}
                {/* Tab */}
                <div style={{
                    marginLeft: "0.6rem",
                    padding: "0.2rem 0.9rem",
                    borderRadius: "6px 6px 0 0",
                    background: "#0d1117",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderBottom: "none",
                    color: "#a0aec0",
                    fontSize: "0.72rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.4rem",
                }}>
                    <span style={{ color: "#3178c6" }}>TS</span>
                    developer.ts
                </div>
            </div>

            {/* Code body */}
            <div style={{ padding: "1rem 0", overflowX: "auto" }}>
                {CODE_LINES.map((tokens, lineIdx) => (
                    <div
                        key={lineIdx}
                        style={{
                            display: "flex",
                            padding: "0 1rem 0 0",
                            opacity: lineIdx < visibleLines ? 1 : 0,
                            transform: lineIdx < visibleLines ? "translateX(0)" : "translateX(-6px)",
                            transition: "opacity 0.2s ease, transform 0.2s ease",
                            whiteSpace: "pre",
                            minHeight: "1.4em",
                        }}
                    >
                        {/* Line number */}
                        <span style={{
                            width: "2.5rem",
                            textAlign: "right",
                            paddingRight: "1rem",
                            color: "#3d444d",
                            userSelect: "none",
                            flexShrink: 0,
                        }}>
                            {lineIdx + 1}
                        </span>

                        {/* Tokens */}
                        <span>
                            {tokens.map((tok, ti) => (
                                <span key={ti} style={{ color: tok.c }}>{tok.t}</span>
                            ))}
                            {/* Cursor on last visible line */}
                            {lineIdx === visibleLines - 1 && lineIdx === CODE_LINES.length - 1 && (
                                <Cursor />
                            )}
                        </span>
                    </div>
                ))}
            </div>

            {/* Status bar */}
            <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "0.3rem 1rem",
                background: "#6366f1",
                fontSize: "0.66rem",
                color: "rgba(255,255,255,0.85)",
            }}>
                <span>⎇  main</span>
                <span style={{ display: "flex", gap: "1rem" }}>
                    <span>TypeScript</span>
                    <span>UTF-8</span>
                    <span>Ln {CODE_LINES.length}, Col 1</span>
                </span>
            </div>
        </div>
    );
}

/* ── Stats ── */
const stats = [
    { value: "4+", label: "Years Experience" },
    { value: "3", label: "Companies" },
    { value: "10+", label: "Tech Stack" },
];

export default function Hero() {
    const [isLight, setIsLight] = useState(false);
    useEffect(() => {
        const update = () =>
            setIsLight(document.documentElement.getAttribute("data-theme") === "light");
        update();
        const obs = new MutationObserver(update);
        obs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
        return () => obs.disconnect();
    }, []);

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
            {/* Glow blobs — toned down in light mode */}
            <div className="glow-blob" style={{ width: "500px", height: "500px", background: "radial-gradient(circle,#6366f1,transparent 70%)", top: "-100px", left: "-150px", opacity: isLight ? 0.08 : 1 }} />
            <div className="glow-blob" style={{ width: "400px", height: "400px", background: "radial-gradient(circle,#8b5cf6,transparent 70%)", bottom: "-80px", right: "-100px", opacity: isLight ? 0.06 : 0.1 }} />

            <AnimatedGrid />

            <div className="container" style={{ position: "relative", zIndex: 3, width: "100%" }}>
                {/* Two-column layout */}
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "2fr 1fr",
                    gap: "3rem",
                    alignItems: "center",
                }}>

                    {/* ── LEFT: text + stats ── */}
                    <div>
                        <div className="fade-up fade-up-1">
                            <span style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "0.5rem",
                                fontFamily: "'JetBrains Mono', monospace",
                                fontSize: "0.8rem",
                                color: "var(--accent)",
                                marginBottom: "1.5rem",
                                letterSpacing: "0.05em",
                            }}>
                                <span style={{ width: "1.5rem", height: "1px", background: "var(--accent)", display: "inline-block" }} />
                                Available for work
                                <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#22c55e", display: "inline-block", boxShadow: "0 0 8px #22c55e" }} />
                            </span>
                        </div>

                        <h1 className="fade-up fade-up-2" style={{ fontSize: "clamp(2.2rem,5vw,3.8rem)", fontWeight: 900, lineHeight: 1.1, marginBottom: "1.25rem" }}>
                            Hi, I&apos;m{" "}
                            <span className="gradient-text">Aung Kyaw Thu</span>
                        </h1>

                        <h2 className="fade-up fade-up-2" style={{ fontSize: "clamp(1.1rem,2.5vw,1.65rem)", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "1.5rem" }}>
                            Full Stack <TypewriterText />
                        </h2>

                        <p className="fade-up fade-up-3" style={{ maxWidth: "520px", fontSize: "1rem", color: "var(--muted)", lineHeight: 1.8, marginBottom: "2.5rem" }}>
                            I build modern web applications and business systems.
                            Skilled in <span style={{ color: "var(--accent2)" }}>React / Next.js</span>,{" "}
                            <span style={{ color: "var(--accent2)" }}>PHP / Laravel</span>, with experience in Docker — turning ideas into scalable digital solutions.
                        </p>

                        <div className="fade-up fade-up-4" style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "3rem" }}>
                            <a href="#contact" className="btn-primary">
                                Get in touch <span>→</span>
                            </a>
                            <a href="/Aung_Kyaw_Thu_Resume.pdf" download="Aung Kyaw Thu Resume.pdf" className="btn-secondary" style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}>
                                ↓ Download CV
                            </a>
                        </div>

                        {/* Stats row */}
                        {/* <div className="fade-up fade-up-4" style={{
                            display: "flex",
                            gap: "2.5rem",
                            paddingTop: "2rem",
                            borderTop: "1px solid var(--border)",
                            flexWrap: "wrap",
                        }}>
                            {stats.map((s) => (
                                <div key={s.label}>
                                    <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--heading)" }}>{s.value}</div>
                                    <div style={{ fontSize: "0.825rem", color: "var(--muted)", marginTop: "0.2rem" }}>{s.label}</div>
                                </div>
                            ))}
                        </div> */}
                    </div>

                    {/* ── RIGHT: floating code editor ── */}
                    <div className="fade-up fade-up-3" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <CodeEditorCard />
                    </div>
                </div>
            </div>
            <style>{`
                @keyframes heroFloat {
                    0%, 100% { transform: perspective(1200px) rotateY(16deg) rotateX(8deg) rotateZ(-4deg); }
                    50%       { transform:perspective(1200px) rotateY(-16deg) rotateX(-8deg) rotateZ(4deg); }
                }
                @media (max-width: 900px) {
                    #hero .container > div {
                        grid-template-columns: 1fr !important;
                    }
                    #hero .container > div > div:last-child {
                        display: none !important;
                    }
                }
                @media (prefers-reduced-motion: reduce) {
                    .code-editor-card { animation: none !important; }
                }
            `}</style>
        </section>
    );
}
