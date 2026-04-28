"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTheme } from "./ThemeProvider";

const navLinks = [
    { href: "#about", label: "About" },
    { href: "#skills", label: "Skills" },
    { href: "#experience", label: "Experience" },
    { href: "#education", label: "Education" },
    { href: "#contact", label: "Contact" },
];

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const { theme, toggleTheme } = useTheme();

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const isLight = theme === "light";

    return (
        <header
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                zIndex: 100,
                transition: "all 0.3s ease",
                background: scrolled
                    ? isLight
                        ? "rgba(248,250,252,0.88)"
                        : "rgba(10,10,15,0.88)"
                    : "transparent",
                backdropFilter: scrolled ? "blur(20px)" : "none",
                borderBottom: scrolled
                    ? `1px solid var(--border)`
                    : "1px solid transparent",
            }}
        >
            <div
                className="container"
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingTop: "1rem",
                    paddingBottom: "1rem",
                }}
            >
                {/* Logo */}
                <Link href="#" style={{ textDecoration: "none" }}>
                    <span
                        style={{
                            fontFamily: "'JetBrains Mono', monospace",
                            fontWeight: 700,
                            fontSize: "1.15rem",
                            color: "var(--text)",
                            letterSpacing: "-0.02em",
                        }}
                    >
                        AKT<span style={{ color: "#6366f1" }}>.</span>
                    </span>
                </Link>

                {/* Desktop Nav */}
                <nav
                    style={{ display: "flex", gap: "2rem", alignItems: "center" }}
                    className="hidden-mobile"
                >
                    {navLinks.map((link) => (
                        <a key={link.href} href={link.href} className="nav-link">
                            {link.label}
                        </a>
                    ))}

                    {/* Theme Toggle */}
                    <button
                        onClick={toggleTheme}
                        aria-label="Toggle theme"
                        style={{
                            background: "var(--surface2)",
                            border: "1px solid var(--border)",
                            borderRadius: "0.5rem",
                            width: "36px",
                            height: "36px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            fontSize: "1rem",
                            transition: "background 0.2s, border-color 0.2s, transform 0.2s",
                            color: "var(--text)",
                        }}
                        onMouseEnter={(e) => {
                            (e.currentTarget as HTMLButtonElement).style.borderColor = "#6366f1";
                            (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.1)";
                        }}
                        onMouseLeave={(e) => {
                            (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border)";
                            (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
                        }}
                    >
                        {isLight ? "🌙" : "☀️"}
                    </button>

                    <a
                        href="#contact"
                        className="btn-primary"
                        style={{ padding: "0.5rem 1.25rem", fontSize: "0.85rem" }}
                    >
                        Hire Me
                    </a>
                </nav>

                {/* Mobile: Theme + Hamburger */}
                <div
                    className="show-mobile"
                    style={{ display: "none", alignItems: "center", gap: "0.75rem" }}
                >
                    <button
                        onClick={toggleTheme}
                        aria-label="Toggle theme"
                        style={{
                            background: "var(--surface2)",
                            border: "1px solid var(--border)",
                            borderRadius: "0.5rem",
                            width: "36px",
                            height: "36px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            fontSize: "1rem",
                            color: "var(--text)",
                        }}
                    >
                        {isLight ? "🌙" : "☀️"}
                    </button>

                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            color: "var(--text)",
                            fontSize: "1.5rem",
                        }}
                        aria-label="Toggle menu"
                    >
                        {menuOpen ? "✕" : "☰"}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {menuOpen && (
                <div
                    style={{
                        background: isLight ? "rgba(248,250,252,0.97)" : "rgba(10,10,15,0.97)",
                        borderTop: "1px solid var(--border)",
                        padding: "1.5rem",
                        display: "flex",
                        flexDirection: "column",
                        gap: "1.25rem",
                    }}
                >
                    {navLinks.map((link) => (
                        <a
                            key={link.href}
                            href={link.href}
                            className="nav-link"
                            style={{ fontSize: "1rem" }}
                            onClick={() => setMenuOpen(false)}
                        >
                            {link.label}
                        </a>
                    ))}
                    <a
                        href="#contact"
                        className="btn-primary"
                        style={{ width: "fit-content" }}
                        onClick={() => setMenuOpen(false)}
                    >
                        Hire Me
                    </a>
                </div>
            )}

            <style>{`
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
        }
        @media (min-width: 769px) {
          .show-mobile { display: none !important; }
        }
      `}</style>
        </header>
    );
}
