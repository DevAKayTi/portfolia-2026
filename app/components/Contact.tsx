"use client";

import { useState } from "react";
import { useTheme } from "./ThemeProvider";
import {
    SiGithub, SiGmail,
} from "react-icons/si";
import { FaLinkedinIn } from "react-icons/fa";
import { FiPhone, FiMapPin, FiCopy, FiCheck, FiArrowUpRight } from "react-icons/fi";

/* ── Contact data ── */
const EMAIL = "devakayti@gmail.com";
const GMAIL_URL =
    `https://mail.google.com/mail/?view=cm&to=${EMAIL}&su=Let%27s%20Work%20Together&body=Hi%20Aung%20Kyaw%20Thu%2C%0A%0AI%20came%20across%20your%20portfolio%20and%20would%20love%20to%20connect.`;

const socialLinks = [
    {
        label: "GitHub",
        handle: "github.com/akayti",
        href: "https://github.com/DevAKayTi",
        Icon: SiGithub,
        color: "#ffffff",
    },
    {
        label: "LinkedIn",
        handle: "in/aung-kyaw-thu-44160125b",
        href: "https://linkedin.com/in/aung-kyaw-thu-44160125b/",
        Icon: FaLinkedinIn,
        color: "#0a66c2",
    },
    {
        label: "Gmail",
        handle: EMAIL,
        href: GMAIL_URL,
        Icon: SiGmail,
        color: "#ea4335",
    },
    {
        label: "Phone",
        handle: "+95 996 512 7172",
        href: "tel:09965127172",
        Icon: FiPhone as any,
        color: "#22c55e",
    },
];

const availability = [
    { dot: "#22c55e", text: "Open to full-time roles" },
    { dot: "#6366f1", text: "Available for freelance projects" },
    { dot: "#f59e0b", text: "Open to technical consultations" },
];

/* ── Copy-to-clipboard hook ── */
function useCopy(text: string) {
    const [copied, setCopied] = useState(false);
    const copy = () => {
        navigator.clipboard.writeText(text).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };
    return { copied, copy };
}

/* ── Social link card ── */
function SocialCard({
    label, handle, href, Icon, color,
}: typeof socialLinks[number]) {
    const { theme } = useTheme();
    const isLight = theme === "light";
    const [hov, setHov] = useState(false);

    return (
        <a
            href={href}
            target={href.startsWith("http") ? "_blank" : undefined}
            rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
            onMouseEnter={() => setHov(true)}
            onMouseLeave={() => setHov(false)}
            style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                padding: "1rem 1.25rem",
                borderRadius: "0.875rem",
                textDecoration: "none",
                background: hov
                    ? isLight ? "rgba(99,102,241,0.06)" : "rgba(99,102,241,0.09)"
                    : "transparent",
                border: hov
                    ? isLight ? "1px solid rgba(99,102,241,0.22)" : "1px solid rgba(99,102,241,0.28)"
                    : isLight ? "1px solid rgba(99,102,241,0.10)" : "1px solid rgba(99,102,241,0.13)",
                backdropFilter: hov ? "blur(20px) saturate(160%)" : "none",
                WebkitBackdropFilter: hov ? "blur(20px) saturate(160%)" : "none",
                transition: "background 0.25s ease, border 0.25s ease, transform 0.25s ease",
                transform: hov ? "translateX(4px)" : "translateX(0)",
            }}
        >
            {/* Icon badge */}
            <div style={{
                width: "40px",
                height: "40px",
                borderRadius: "0.6rem",
                background: `color-mix(in srgb, ${color} 14%, transparent)`,
                border: `1px solid color-mix(in srgb, ${color} 30%, transparent)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                transition: "box-shadow 0.25s ease",
                boxShadow: hov ? `0 0 14px color-mix(in srgb, ${color} 25%, transparent)` : "none",
            }}>
                <Icon style={{ fontSize: "1.1rem", color }} />
            </div>

            {/* Text */}
            <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "var(--muted)",
                    marginBottom: "0.1rem",
                }}>
                    {label}
                </div>
                <div style={{
                    fontSize: "0.875rem",
                    color: "var(--text)",
                    fontFamily: "'JetBrains Mono', monospace",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                }}>
                    {handle}
                </div>
            </div>

            {/* Arrow */}
            <FiArrowUpRight style={{
                fontSize: "1rem",
                color: "var(--muted)",
                flexShrink: 0,
                transition: "transform 0.25s ease, color 0.25s ease",
                transform: hov ? "translate(2px,-2px)" : "none",
                ...(hov && { color: "var(--accent2)" }),
            }} />
        </a>
    );
}

export default function Contact() {
    const { theme } = useTheme();
    const isLight = theme === "light";
    const { copied, copy } = useCopy(EMAIL);

    return (
        <section id="contact" className="section">
            <div className="container">

                {/* ── Section header ── */}
                <div style={{ marginBottom: "3.5rem" }}>
                    <div className="section-tag">📬 Contact</div>
                    <h2 className="section-heading">
                        Let&apos;s Work <span className="gradient-text">Together</span>
                    </h2>
                    <p style={{ color: "var(--muted)", maxWidth: "480px", lineHeight: 1.8 }}>
                        Open to full-time roles, freelance projects, and technical consultations.
                        I typically respond within 24 hours.
                    </p>
                </div>

                {/* ── Two-column layout ── */}
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "2.5rem",
                    alignItems: "start",
                }}>

                    {/* ── LEFT: CTA + availability ── */}
                    <div>
                        {/* Primary CTA card */}
                        <div style={{
                            background: isLight
                                ? "linear-gradient(135deg, rgba(99,102,241,0.09) 0%, rgba(139,92,246,0.06) 100%)"
                                : "linear-gradient(135deg, rgba(99,102,241,0.12) 0%, rgba(139,92,246,0.08) 100%)",
                            border: isLight ? "1px solid rgba(99,102,241,0.18)" : "1px solid rgba(99,102,241,0.22)",
                            borderRadius: "1.25rem",
                            padding: "2rem",
                            marginBottom: "1.5rem",
                            position: "relative",
                            overflow: "hidden",
                        }}>
                            {/* Decorative glow */}
                            <div style={{
                                position: "absolute",
                                top: "-60px",
                                right: "-60px",
                                width: "200px",
                                height: "200px",
                                background: "radial-gradient(circle, rgba(99,102,241,0.2), transparent 70%)",
                                pointerEvents: "none",
                            }} />

                            <div style={{ position: "relative", zIndex: 1 }}>
                                {/* Status indicator */}
                                <div style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "0.5rem",
                                    padding: "0.3rem 0.85rem",
                                    borderRadius: "999px",
                                    background: "rgba(34,197,94,0.10)",
                                    border: "1px solid rgba(34,197,94,0.25)",
                                    marginBottom: "1.25rem",
                                }}>
                                    <span style={{
                                        width: "7px",
                                        height: "7px",
                                        borderRadius: "50%",
                                        background: "#22c55e",
                                        boxShadow: "0 0 6px #22c55e",
                                        animation: "ctaPulse 2s ease-in-out infinite",
                                        display: "inline-block",
                                    }} />
                                    <span style={{ fontSize: "0.75rem", color: "#22c55e", fontWeight: 600 }}>
                                        Available for hire
                                    </span>
                                </div>

                                <h3 style={{
                                    fontSize: "1.3rem",
                                    fontWeight: 700,
                                    color: "var(--heading)",
                                    marginBottom: "0.6rem",
                                    lineHeight: 1.3,
                                }}>
                                    Got a project in mind?
                                </h3>
                                <p style={{
                                    color: "var(--muted)",
                                    fontSize: "0.875rem",
                                    lineHeight: 1.75,
                                    marginBottom: "1.5rem",
                                }}>
                                    Whether it&apos;s a startup MVP, an enterprise system, or anything in between —
                                    let&apos;s build something you&apos;re proud of.
                                </p>

                                {/* CTA button */}
                                <a
                                    href={GMAIL_URL}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn-primary"
                                    style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", fontSize: "0.9rem", padding: "0.75rem 1.5rem" }}
                                >
                                    <SiGmail style={{ fontSize: "1rem" }} />
                                    Send a Message
                                </a>
                            </div>
                        </div>

                        {/* Availability tags */}
                        <div style={{
                            padding: "1.25rem 1.5rem",
                            borderRadius: "0.875rem",
                            border: isLight ? "1px solid rgba(99,102,241,0.12)" : "1px solid rgba(99,102,241,0.14)",
                            background: "transparent",
                        }}>
                            <div style={{
                                fontSize: "0.7rem",
                                fontWeight: 700,
                                letterSpacing: "0.1em",
                                textTransform: "uppercase",
                                color: "var(--muted)",
                                marginBottom: "0.85rem",
                            }}>
                                Currently open to
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: "0.55rem" }}>
                                {availability.map((a) => (
                                    <div key={a.text} style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
                                        <span style={{
                                            width: "8px",
                                            height: "8px",
                                            borderRadius: "50%",
                                            background: a.dot,
                                            boxShadow: `0 0 6px ${a.dot}`,
                                            flexShrink: 0,
                                        }} />
                                        <span style={{ fontSize: "0.875rem", color: "var(--text)" }}>{a.text}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Copy email */}
                        <button
                            onClick={copy}
                            style={{
                                marginTop: "1rem",
                                display: "flex",
                                alignItems: "center",
                                gap: "0.6rem",
                                width: "100%",
                                padding: "0.75rem 1.25rem",
                                borderRadius: "0.875rem",
                                border: isLight ? "1px solid rgba(99,102,241,0.14)" : "1px solid rgba(99,102,241,0.16)",
                                background: "transparent",
                                cursor: "pointer",
                                color: "var(--muted)",
                                fontSize: "0.825rem",
                                fontFamily: "'JetBrains Mono', monospace",
                                transition: "background 0.2s ease, color 0.2s ease",
                            }}
                            onMouseEnter={(e) => {
                                (e.currentTarget as HTMLButtonElement).style.background =
                                    isLight ? "rgba(99,102,241,0.06)" : "rgba(99,102,241,0.09)";
                                (e.currentTarget as HTMLButtonElement).style.color = "var(--text)";
                            }}
                            onMouseLeave={(e) => {
                                (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                                (e.currentTarget as HTMLButtonElement).style.color = "var(--muted)";
                            }}
                        >
                            {copied
                                ? <FiCheck style={{ color: "#22c55e", flexShrink: 0 }} />
                                : <FiCopy style={{ flexShrink: 0 }} />
                            }
                            <span style={{ flex: 1, textAlign: "left", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                {EMAIL}
                            </span>
                            <span style={{ fontSize: "0.72rem", letterSpacing: "0.06em", opacity: 0.6 }}>
                                {copied ? "COPIED!" : "COPY"}
                            </span>
                        </button>
                    </div>

                    {/* ── RIGHT: Social / contact links ── */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>

                        <div style={{
                            fontSize: "0.7rem",
                            fontWeight: 700,
                            letterSpacing: "0.1em",
                            textTransform: "uppercase",
                            color: "var(--muted)",
                            marginBottom: "0.5rem",
                            paddingLeft: "0.25rem",
                        }}>
                            Reach me on
                        </div>

                        {socialLinks.map((s) => (
                            <SocialCard key={s.label} {...s} />
                        ))}

                        {/* Location */}
                        <div style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.75rem",
                            padding: "0.9rem 1.25rem",
                            borderRadius: "0.875rem",
                            border: isLight ? "1px solid rgba(99,102,241,0.10)" : "1px solid rgba(99,102,241,0.13)",
                            marginTop: "0.4rem",
                        }}>
                            <div style={{
                                width: "40px",
                                height: "40px",
                                borderRadius: "0.6rem",
                                background: "rgba(249,115,22,0.12)",
                                border: "1px solid rgba(249,115,22,0.25)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexShrink: 0,
                            }}>
                                <FiMapPin style={{ color: "#f97316", fontSize: "1.1rem" }} />
                            </div>
                            <div>
                                <div style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "0.1rem" }}>Location</div>
                                <div style={{ fontSize: "0.875rem", color: "var(--text)" }}>Yangon, Myanmar · UTC+6:30</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes ctaPulse {
                    0%, 100% { opacity: 1;   transform: scale(1);    }
                    50%       { opacity: 0.5; transform: scale(1.4);  }
                }
                @media (max-width: 768px) {
                    #contact .container > div:last-child {
                        grid-template-columns: 1fr !important;
                    }
                }
            `}</style>
        </section>
    );
}
