"use client";

import React from "react";
import ChatHeader from "./ChatHeader";
import ChatWelcome from "./ChatWelcome";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";
import type { Message } from "./types";
import { SUGGESTED_QUESTIONS } from "./types";

interface ExpandedChatProps {
    messages: Message[];
    isTyping: boolean;
    inputValue: string;
    messagesEndRef: React.RefObject<HTMLDivElement | null>;
    onInputChange: (val: string) => void;
    onSend: (text: string) => void;
    onCollapse: () => void;
    onClose: () => void;
    onClear: () => void;
}

export default function ExpandedChat({
    messages,
    isTyping,
    inputValue,
    messagesEndRef,
    onInputChange,
    onSend,
    onCollapse,
    onClose,
    onClear,
}: ExpandedChatProps) {
    const hasMessages = messages.length > 0;

    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-label="AI Assistant — Full Screen"
            style={{
                position: "fixed",
                inset: 0,
                zIndex: 1200,
                display: "flex",
                flexDirection: "column",
                background: "var(--bg)",
                animation: "aiExpandIn 0.3s cubic-bezier(0.34,1.1,0.64,1) both",
            }}
        >
            {/* Subtle background detail */}
            <div aria-hidden="true" style={{
                position: "absolute",
                inset: 0,
                pointerEvents: "none",
                backgroundImage:
                    "radial-gradient(ellipse 60% 40% at 70% 10%, rgba(99,102,241,0.07) 0%, transparent 70%)," +
                    "radial-gradient(ellipse 50% 35% at 20% 85%, rgba(139,92,246,0.05) 0%, transparent 70%)",
                zIndex: 0,
            }} />

            {/* Header */}
            <div style={{ position: "relative", zIndex: 2, flexShrink: 0 }}>
                <ChatHeader
                    onMinimize={onCollapse}
                    onExpand={() => {/* already expanded */}}
                    onClose={onClose}
                    onClear={onClear}
                    isExpanded
                />
            </div>

            {/* Content area — centered column, max width */}
            <div style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                minHeight: 0,
                position: "relative",
                zIndex: 1,
            }}>
                <div style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    maxWidth: "760px",
                    width: "100%",
                    margin: "0 auto",
                    padding: "0",
                    minHeight: 0,
                }}>
                    {/* Messages or Welcome */}
                    <div style={{
                        flex: 1,
                        overflowY: "auto",
                        display: "flex",
                        flexDirection: "column",
                        minHeight: 0,
                        paddingBottom: "0.5rem",
                    }}>
                        {!hasMessages ? (
                            <ExpandedWelcome onSuggest={onSend} />
                        ) : (
                            <ChatMessages
                                messages={messages}
                                isTyping={isTyping}
                                messagesEndRef={messagesEndRef}
                            />
                        )}
                    </div>

                    {/* Input */}
                    <div style={{
                        flexShrink: 0,
                        borderTop: "1px solid var(--border)",
                        paddingBottom: "env(safe-area-inset-bottom, 0px)",
                    }}>
                        <ChatInput
                            value={inputValue}
                            onChange={onInputChange}
                            onSend={onSend}
                            isTyping={isTyping}
                            placeholder="Ask me about skills, experience, or projects…"
                        />
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes aiExpandIn {
                    from { opacity: 0; transform: scale(0.98); }
                    to   { opacity: 1; transform: scale(1);    }
                }
            `}</style>
        </div>
    );
}

/* ── Expanded welcome (more spacious than compact) ─────────────── */
function ExpandedWelcome({ onSuggest }: { onSuggest: (t: string) => void }) {
    const [hov, setHov] = React.useState<string | null>(null);

    return (
        <div style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "2rem 1.5rem",
            gap: "1.5rem",
            animation: "aiFadeUp 0.4s ease both",
        }}>
            {/* Avatar hero */}
            <div style={{
                width: "72px",
                height: "72px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, var(--accent) 0%, #8b5cf6 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 0 40px rgba(99,102,241,0.25)",
            }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z" fill="white" opacity="0.95" />
                    <path d="M19 2L19.75 4.25L22 5L19.75 5.75L19 8L18.25 5.75L16 5L18.25 4.25L19 2Z" fill="white" opacity="0.6" />
                    <path d="M5 16L5.5 17.5L7 18L5.5 18.5L5 20L4.5 18.5L3 18L4.5 17.5L5 16Z" fill="white" opacity="0.5" />
                </svg>
            </div>

            {/* Text */}
            <div style={{ textAlign: "center", maxWidth: "480px" }}>
                <h2 style={{
                    fontSize: "1.5rem",
                    fontWeight: 800,
                    color: "var(--heading)",
                    marginBottom: "0.5rem",
                    lineHeight: 1.2,
                }}>
                    How can I help you?
                </h2>
                <p style={{
                    fontSize: "0.9rem",
                    color: "var(--muted)",
                    lineHeight: 1.6,
                }}>
                    I&apos;m a <strong style={{ color: "var(--accent2)" }}>simulated</strong> assistant for Aung Kyaw Thu&apos;s portfolio.
                    Ask me about his skills, experience, or projects.
                </p>
            </div>

            {/* Suggested pills — 2-column grid on desktop */}
            <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                gap: "0.5rem",
                width: "100%",
                maxWidth: "520px",
            }}>
                {SUGGESTED_QUESTIONS.map((q: { id: string; text: string }) => (
                    <button
                        key={q.id}
                        onClick={() => onSuggest(q.text)}
                        onMouseEnter={() => setHov(q.id)}
                        onMouseLeave={() => setHov(null)}
                        style={{
                            padding: "0.65rem 0.9rem",
                            borderRadius: "0.65rem",
                            border: "1px solid",
                            borderColor: hov === q.id ? "var(--accent)" : "var(--border)",
                            background: hov === q.id ? "rgba(99,102,241,0.08)" : "var(--surface)",
                            color: hov === q.id ? "var(--accent2)" : "var(--text-secondary)",
                            fontSize: "0.84rem",
                            cursor: "pointer",
                            textAlign: "left",
                            lineHeight: 1.45,
                            transition: "border-color 0.18s, background 0.18s, color 0.18s",
                        }}
                    >
                        {q.text}
                    </button>
                ))}
            </div>
        </div>
    );
}
