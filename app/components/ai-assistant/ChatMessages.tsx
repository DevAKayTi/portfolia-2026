"use client";

import React from "react";
import type { Message } from "./types";

interface ChatMessagesProps {
    messages: Message[];
    isTyping: boolean;
    messagesEndRef: React.RefObject<HTMLDivElement | null>;
}

/* Render **bold** markdown in content */
function renderContent(text: string) {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
            return <strong key={i} style={{ color: "var(--accent2)", fontWeight: 700 }}>{part.slice(2, -2)}</strong>;
        }
        return <span key={i}>{part}</span>;
    });
}

function formatTime(date: Date) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function ChatMessages({ messages, isTyping, messagesEndRef }: ChatMessagesProps) {
    return (
        <div
            role="log"
            aria-live="polite"
            aria-label="Conversation"
            style={{
                flex: 1,
                overflowY: "auto",
                padding: "0.75rem 1rem",
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
                scrollBehavior: "smooth",
            }}
        >
            {messages.map((msg) => (
                <MessageBubble key={msg.id} message={msg} />
            ))}

            {/* Typing indicator */}
            {isTyping && (
                <div
                    style={{
                        display: "flex",
                        alignItems: "flex-end",
                        gap: "0.5rem",
                        animation: "aiFadeUp 0.2s ease both",
                    }}
                >
                    <AssistantAvatar />
                    <div
                        style={{
                            padding: "0.6rem 0.9rem",
                            borderRadius: "1rem 1rem 1rem 2px",
                            background: "var(--surface2)",
                            border: "1px solid var(--border)",
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                            height: "36px",
                        }}
                    >
                        {[0, 1, 2].map((i) => (
                            <span
                                key={i}
                                style={{
                                    width: "6px",
                                    height: "6px",
                                    borderRadius: "50%",
                                    background: "var(--muted)",
                                    display: "inline-block",
                                    animation: `aiTypingDot 1.2s ${i * 0.2}s ease-in-out infinite`,
                                }}
                            />
                        ))}
                    </div>
                </div>
            )}

            <div ref={messagesEndRef} style={{ height: "1px" }} />

            <style>{`
                @keyframes aiTypingDot {
                    0%, 60%, 100% { transform: translateY(0);    opacity: 0.4; }
                    30%           { transform: translateY(-5px);  opacity: 1;   }
                }
                @keyframes aiFadeUp {
                    from { opacity: 0; transform: translateY(8px); }
                    to   { opacity: 1; transform: translateY(0);   }
                }
            `}</style>
        </div>
    );
}

/* ── Individual bubble ─────────────────────────────────────────── */
function MessageBubble({ message }: { message: Message }) {
    const isUser = message.role === "user";
    return (
        <div
            style={{
                display: "flex",
                flexDirection: isUser ? "row-reverse" : "row",
                alignItems: "flex-end",
                gap: "0.5rem",
                animation: "aiFadeUp 0.25s ease both",
            }}
        >
            {!isUser && <AssistantAvatar />}

            <div style={{ maxWidth: "80%", display: "flex", flexDirection: "column", alignItems: isUser ? "flex-end" : "flex-start" }}>
                <div
                    style={{
                        padding: "0.6rem 0.9rem",
                        borderRadius: isUser
                            ? "1rem 1rem 2px 1rem"
                            : "1rem 1rem 1rem 2px",
                        background: isUser
                            ? "var(--accent)"
                            : "var(--surface2)",
                        border: isUser ? "none" : "1px solid var(--border)",
                        color: isUser ? "#fff" : "var(--text)",
                        fontSize: "0.875rem",
                        lineHeight: 1.6,
                        wordBreak: "break-word",
                    }}
                >
                    {renderContent(message.content)}
                </div>
                <span style={{
                    fontSize: "0.68rem",
                    color: "var(--text-dim)",
                    marginTop: "0.25rem",
                    paddingLeft: isUser ? 0 : "0.1rem",
                    paddingRight: isUser ? "0.1rem" : 0,
                }}>
                    {formatTime(message.timestamp)}
                </span>
            </div>
        </div>
    );
}

/* ── Small AI avatar ───────────────────────────────────────────── */
function AssistantAvatar() {
    return (
        <div style={{
            width: "26px",
            height: "26px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, var(--accent) 0%, #8b5cf6 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            marginBottom: "2px",
        }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z" fill="white" opacity="0.95" />
            </svg>
        </div>
    );
}
