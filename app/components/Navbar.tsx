"use client";

import { useState, useEffect, useRef } from "react";
import { useTheme } from "./ThemeProvider";

const navLinks = [
    { href: "#hero",       label: "Home"       },
    { href: "#about",      label: "About"      },
    { href: "#skills",     label: "Skills"     },
    { href: "#experience", label: "Experience" },
    { href: "#education",  label: "Education"  },
    { href: "#contact",    label: "Contact"    },
];

export default function Navbar() {
    const [activeSection, setActiveSection] = useState("hero");
    const [menuOpen, setMenuOpen]           = useState(false);
    const { theme, toggleTheme }            = useTheme();

    // refs for each desktop link element
    const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);
    // the sliding pill
    const pillRef  = useRef<HTMLSpanElement>(null);

    const isLight = theme === "light";

    // ── Track active section ──────────────────────────────────────
    useEffect(() => {
        const ids = navLinks.map((l) => l.href.replace("#", ""));
        const observers: IntersectionObserver[] = [];

        ids.forEach((id) => {
            const el = document.getElementById(id);
            if (!el) return;
            const obs = new IntersectionObserver(
                ([entry]) => { if (entry.isIntersecting) setActiveSection(id); },
                { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
            );
            obs.observe(el);
            observers.push(obs);
        });

        return () => observers.forEach((o) => o.disconnect());
    }, []);

    // ── Slide the pill to the active link ────────────────────────
    useEffect(() => {
        const idx   = navLinks.findIndex((l) => l.href === `#${activeSection}`);
        const link  = linkRefs.current[idx];
        const pill  = pillRef.current;
        if (!link || !pill) return;

        const parent = link.offsetParent as HTMLElement | null;
        if (!parent) return;

        const linkRect   = link.getBoundingClientRect();
        const parentRect = parent.getBoundingClientRect();

        pill.style.width  = `${linkRect.width}px`;
        pill.style.left   = `${linkRect.left - parentRect.left}px`;
        pill.style.opacity = "1";
    }, [activeSection]);

    /* ── glass values ── */
    const glassBg     = isLight
        ? "rgba(255,255,255,0.62)"
        : "rgba(18,18,26,0.60)";
    const glassBorder = isLight
        ? "1px solid rgba(255,255,255,0.75)"
        : "1px solid rgba(255,255,255,0.09)";
    const glassShadow = isLight
        ? "0 8px 32px rgba(0,0,0,0.10), inset 0 1px 0 rgba(255,255,255,0.8)"
        : "0 8px 32px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.06)";

    const pillBg = isLight
        ? "rgba(99,102,241,0.12)"
        : "rgba(99,102,241,0.18)";

    const mobileLinkStyle = (id: string): React.CSSProperties => {
        const isActive = activeSection === id;
        return {
            padding:        "0.75rem 1rem",
            borderRadius:   "0.75rem",
            fontSize:       "0.95rem",
            fontWeight:     isActive ? 600 : 500,
            color:          isActive ? "var(--accent2)" : "var(--text)",
            background:     isActive
                ? isLight ? "rgba(99,102,241,0.10)" : "rgba(99,102,241,0.14)"
                : "transparent",
            textDecoration: "none",
            transition:     "background 0.2s, color 0.2s",
            display:        "flex",
            alignItems:     "center",
            gap:            "0.5rem",
        };
    };

    return (
        <>
            {/* ── Desktop: floating pill nav ───────────────────────── */}
            <header
                className="navbar-desktop"
                style={{
                    position:             "fixed",
                    top:                  "16px",
                    left:                 "50%",
                    transform:            "translateX(-50%)",
                    zIndex:               100,
                    display:              "flex",
                    alignItems:           "center",
                    gap:                  "0",
                    padding:              "0.45rem 0.6rem",
                    borderRadius:         "999px",
                    background:           glassBg,
                    border:               glassBorder,
                    boxShadow:            glassShadow,
                    backdropFilter:       "blur(28px) saturate(180%)",
                    WebkitBackdropFilter: "blur(28px) saturate(180%)",
                    transition:           "background 0.35s ease",
                    whiteSpace:           "nowrap",
                }}
            >
                {/* Sliding background pill */}
                <span
                    ref={pillRef}
                    style={{
                        position:     "absolute",
                        top:          "50%",
                        transform:    "translateY(-50%)",
                        height:       "calc(100% - 10px)",
                        borderRadius: "999px",
                        background:   pillBg,
                        border:       `1px solid ${isLight ? "rgba(99,102,241,0.2)" : "rgba(99,102,241,0.25)"}`,
                        boxShadow:    "0 0 12px rgba(99,102,241,0.15)",
                        pointerEvents:"none",
                        // start hidden; JS will position it
                        opacity:      0,
                        left:         0,
                        width:        0,
                        // smooth slide
                        transition:   "left 0.32s cubic-bezier(0.34,1.2,0.64,1), width 0.32s cubic-bezier(0.34,1.2,0.64,1), opacity 0.2s ease",
                        zIndex:       0,
                    }}
                />

                {navLinks.map((link, i) => {
                    const id       = link.href.replace("#", "");
                    const isActive = activeSection === id;
                    return (
                        <a
                            key={link.href}
                            href={link.href}
                            ref={(el) => { linkRefs.current[i] = el; }}
                            style={{
                                position:       "relative",
                                zIndex:         1,
                                display:        "inline-flex",
                                alignItems:     "center",
                                padding:        "0.38rem 0.95rem",
                                borderRadius:   "999px",
                                fontSize:       "0.875rem",
                                fontWeight:     isActive ? 600 : 500,
                                color:          isActive ? "var(--accent2)" : "var(--text-secondary)",
                                textDecoration: "none",
                                transition:     "color 0.25s ease",
                                letterSpacing:  "-0.01em",
                                background:     "transparent",
                                border:         "none",
                            }}
                            onMouseEnter={(e) => {
                                if (!isActive)
                                    (e.currentTarget as HTMLAnchorElement).style.color = "var(--text)";
                            }}
                            onMouseLeave={(e) => {
                                if (!isActive)
                                    (e.currentTarget as HTMLAnchorElement).style.color = "var(--text-secondary)";
                            }}
                        >
                            {link.label}
                        </a>
                    );
                })}

                {/* Divider */}
                <span style={{
                    width:      "1px",
                    height:     "16px",
                    background: "var(--border)",
                    margin:     "0 0.4rem",
                    flexShrink: 0,
                    position:   "relative",
                    zIndex:     1,
                }} />

                {/* Theme toggle */}
                <button
                    onClick={toggleTheme}
                    aria-label="Toggle theme"
                    style={{
                        position:       "relative",
                        zIndex:         1,
                        display:        "inline-flex",
                        alignItems:     "center",
                        justifyContent: "center",
                        width:          "32px",
                        height:         "32px",
                        borderRadius:   "999px",
                        border:         "none",
                        background:     "transparent",
                        cursor:         "pointer",
                        fontSize:       "0.95rem",
                        color:          "var(--text)",
                        transition:     "background 0.2s, transform 0.2s",
                        flexShrink:     0,
                    }}
                    onMouseEnter={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.background = isLight
                            ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.09)";
                        (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.12)";
                    }}
                    onMouseLeave={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                        (e.currentTarget as HTMLButtonElement).style.transform  = "scale(1)";
                    }}
                >
                    {isLight ? "🌙" : "☀️"}
                </button>
            </header>

            {/* ── Mobile: full-width bar ───────────────────────────── */}
            <header
                className="navbar-mobile"
                style={{
                    position:             "fixed",
                    top:                  0,
                    left:                 0,
                    right:                0,
                    zIndex:               100,
                    display:              "flex",
                    alignItems:           "center",
                    justifyContent:       "space-between",
                    padding:              "0.75rem 1.25rem",
                    background:           glassBg,
                    borderBottom:         glassBorder,
                    boxShadow:            glassShadow,
                    backdropFilter:       "blur(28px) saturate(180%)",
                    WebkitBackdropFilter: "blur(28px) saturate(180%)",
                    transition:           "background 0.35s ease",
                }}
            >
                <a href="#hero" style={{ textDecoration: "none" }}>
                    <span style={{
                        fontFamily:    "'JetBrains Mono', monospace",
                        fontWeight:    700,
                        fontSize:      "1rem",
                        color:         "var(--heading)",
                        letterSpacing: "-0.02em",
                    }}>
                        AKT<span style={{ color: "var(--accent)" }}>.</span>
                    </span>
                </a>

                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <button
                        onClick={toggleTheme}
                        aria-label="Toggle theme"
                        style={{
                            background: "transparent", border: "none", cursor: "pointer",
                            fontSize: "1rem", color: "var(--text)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            width: "32px", height: "32px", borderRadius: "50%",
                        }}
                    >
                        {isLight ? "🌙" : "☀️"}
                    </button>
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        aria-label="Toggle menu"
                        style={{
                            background: "transparent", border: "none", cursor: "pointer",
                            color: "var(--text)", fontSize: "1.4rem",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            width: "32px", height: "32px",
                        }}
                    >
                        {menuOpen ? "✕" : "☰"}
                    </button>
                </div>
            </header>

            {/* ── Mobile dropdown ──────────────────────────────────── */}
            {menuOpen && (
                <div
                    className="navbar-mobile"
                    style={{
                        position:             "fixed",
                        top:                  "60px",
                        left:                 "12px",
                        right:                "12px",
                        zIndex:               99,
                        borderRadius:         "1.25rem",
                        background:           glassBg,
                        border:               glassBorder,
                        boxShadow:            glassShadow,
                        backdropFilter:       "blur(28px) saturate(180%)",
                        WebkitBackdropFilter: "blur(28px) saturate(180%)",
                        padding:              "0.5rem",
                        display:              "flex",
                        flexDirection:        "column",
                        gap:                  "0.15rem",
                    }}
                >
                    {navLinks.map((link) => {
                        const id = link.href.replace("#", "");
                        return (
                            <a
                                key={link.href}
                                href={link.href}
                                onClick={() => setMenuOpen(false)}
                                style={mobileLinkStyle(id)}
                            >
                                {link.label}
                                {activeSection === id && (
                                    <span style={{
                                        marginLeft:   "auto",
                                        width:        "6px",
                                        height:       "6px",
                                        borderRadius: "50%",
                                        background:   "var(--accent)",
                                        boxShadow:    "0 0 6px var(--accent)",
                                        flexShrink:   0,
                                    }} />
                                )}
                            </a>
                        );
                    })}
                </div>
            )}

            <style>{`
                @media (min-width: 769px) {
                    .navbar-mobile { display: none !important; }
                }
                @media (max-width: 768px) {
                    .navbar-desktop { display: none !important; }
                }
            `}</style>
        </>
    );
}
