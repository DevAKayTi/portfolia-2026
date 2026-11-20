"use client";

import React from "react";
import { SUGGESTED_QUESTIONS, type SuggestedQuestion } from "./types";

interface ChatWelcomeProps {
    onSuggest: (text: string) => void;
}

export default function ChatWelcome({ onSuggest }: ChatWelcomeProps) {
    return (
        <div
            style={{
                padding: "1.25rem 1rem",
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                animation: "aiFadeUp 0.4s ease both",
            }}
        >
            {/* Greeting card */}
            <div
                style={{
                    background: "linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(139,92,246,0.08) 100%)",
                    border: "1px solid rgba(99,102,241,0.18)",
                    borderRadius: "0.875rem",
                    padding: "1rem 1.1rem",
                }}
            >
                <div style={{ fontSize: "1.5rem", marginBottom: "0.4rem" }}>👋</div>
                <p style={{
                    fontSize: "0.875rem",
                    color: "var(--text)",
                    lineHeight: 1.6,
                    margin: 0,
                }}>
                    Hi there! I&apos;m a <strong style={{ color: "var(--accent2)" }}>simulated AI assistant</strong> for
                    Aung Kyaw Thu&apos;s portfolio. Ask me anything about his skills, experience, or projects!
                </p>
            </div>

            {/* Suggested questions */}
            <div>
                <p style={{
                    fontSize: "0.72rem",
                    fontWeight: 600,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "var(--muted)",
                    marginBottom: "0.5rem",
                }}>
                    Suggested questions
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                    {SUGGESTED_QUESTIONS.map((q: SuggestedQuestion) => (
                        <SuggestChip key={q.id} text={q.text} onClick={() => onSuggest(q.text)} />
                    ))}
                </div>
            </div>
        </div>
    );
}

function SuggestChip({ text, onClick }: { text: string; onClick: () => void }) {
    const [hov, setHov] = React.useState(false);
    return (
        <button
            onClick={onClick}
            onMouseEnter={() => setHov(true)}
            onMouseLeave={() => setHov(false)}
            style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.5rem 0.75rem",
                borderRadius: "0.6rem",
                border: "1px solid",
                borderColor: hov ? "var(--accent)" : "var(--border)",
                background: hov ? "rgba(99,102,241,0.07)" : "var(--surface2)",
                color: hov ? "var(--accent2)" : "var(--text-secondary)",
                fontSize: "0.82rem",
                cursor: "pointer",
                textAlign: "left",
                width: "100%",
                transition: "border-color 0.18s, background 0.18s, color 0.18s",
            }}
        >
            {/* Arrow icon */}
            <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ flexShrink: 0, opacity: 0.6 }}
            >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
            </svg>
            {text}
        </button>
    );
}
