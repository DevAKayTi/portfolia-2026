"use client";

import React, { useRef } from "react";

interface ChatInputProps {
    value: string;
    onChange: (val: string) => void;
    onSend: (text: string) => void;
    isTyping: boolean;
    placeholder?: string;
}

export default function ChatInput({
    value,
    onChange,
    onSend,
    isTyping,
    placeholder = "Ask me anything…",
}: ChatInputProps) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [focused, setFocused] = React.useState(false);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleSend = () => {
        if (!value.trim() || isTyping) return;
        onSend(value);
    };

    // Auto-resize textarea
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        onChange(e.target.value);
        const ta = textareaRef.current;
        if (ta) {
            ta.style.height = "auto";
            ta.style.height = `${Math.min(ta.scrollHeight, 120)}px`;
        }
    };

    const canSend = value.trim().length > 0 && !isTyping;

    return (
        <div
            style={{
                padding: "0.75rem 1rem",
                borderTop: "1px solid var(--border)",
                background: "var(--surface)",
                flexShrink: 0,
            }}
        >
            {/* Hint */}
            <p style={{
                fontSize: "0.68rem",
                color: "var(--text-dim)",
                marginBottom: "0.5rem",
                textAlign: "center",
            }}>
                ⚡ Simulated responses · Enter to send · Shift+Enter for newline
            </p>

            <div
                style={{
                    display: "flex",
                    alignItems: "flex-end",
                    gap: "0.5rem",
                    background: "var(--surface2)",
                    border: "1px solid",
                    borderColor: focused ? "var(--accent)" : "var(--border)",
                    borderRadius: "0.75rem",
                    padding: "0.5rem 0.5rem 0.5rem 0.75rem",
                    transition: "border-color 0.18s",
                    boxShadow: focused ? "0 0 0 3px rgba(99,102,241,0.1)" : "none",
                }}
            >
                <textarea
                    ref={textareaRef}
                    value={value}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    placeholder={placeholder}
                    rows={1}
                    disabled={isTyping}
                    aria-label="Message input"
                    style={{
                        flex: 1,
                        resize: "none",
                        border: "none",
                        outline: "none",
                        background: "transparent",
                        color: "var(--text)",
                        fontSize: "0.875rem",
                        lineHeight: 1.5,
                        fontFamily: "inherit",
                        maxHeight: "120px",
                        overflowY: "auto",
                        paddingTop: "0.1rem",
                        caretColor: "var(--accent)",
                    }}
                />

                {/* Send button */}
                <button
                    onClick={handleSend}
                    disabled={!canSend}
                    aria-label="Send message"
                    style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "0.5rem",
                        border: "none",
                        cursor: canSend ? "pointer" : "not-allowed",
                        background: canSend ? "var(--accent)" : "var(--surface)",
                        color: canSend ? "#fff" : "var(--text-dim)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        transition: "background 0.2s, transform 0.15s",
                        transform: canSend ? "scale(1)" : "scale(0.92)",
                    }}
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <line x1="22" y1="2" x2="11" y2="13" />
                        <polygon points="22 2 15 22 11 13 2 9 22 2" />
                    </svg>
                </button>
            </div>
        </div>
    );
}
