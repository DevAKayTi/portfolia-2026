"use client";

import React from "react";
import ChatHeader from "./ChatHeader";
import ChatWelcome from "./ChatWelcome";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";
import type { Message } from "./types";

interface ChatWindowProps {
    messages: Message[];
    isTyping: boolean;
    inputValue: string;
    messagesEndRef: React.RefObject<HTMLDivElement | null>;
    onInputChange: (val: string) => void;
    onSend: (text: string) => void;
    onMinimize: () => void;
    onExpand: () => void;
    onClose: () => void;
    onClear: () => void;
    visible: boolean;
}

export default function ChatWindow({
    messages,
    isTyping,
    inputValue,
    messagesEndRef,
    onInputChange,
    onSend,
    onMinimize,
    onExpand,
    onClose,
    onClear,
    visible,
}: ChatWindowProps) {
    const hasMessages = messages.length > 0;

    return (
        <>
            {/* Backdrop (mobile tap-to-close) */}
            {visible && (
                <div
                    onClick={onClose}
                    aria-hidden="true"
                    className="ai-window-backdrop"
                    style={{
                        position: "fixed",
                        inset: 0,
                        zIndex: 1000,
                        background: "transparent",
                        display: "none", // shown via media query
                    }}
                />
            )}

            <div
                role="dialog"
                aria-modal="true"
                aria-label="AI Assistant Chat"
                style={{
                    position: "fixed",
                    bottom: "90px",
                    right: "24px",
                    zIndex: 1001,
                    width: "min(400px, calc(100vw - 32px))",
                    height: "min(560px, calc(100dvh - 120px))",
                    borderRadius: "1.1rem",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    background: "var(--surface)",
                    border: "1px solid var(--border)",
                    boxShadow: "0 24px 80px rgba(0,0,0,0.35), 0 0 0 1px rgba(99,102,241,0.08)",
                    // glassmorphism
                    backdropFilter: "blur(16px) saturate(160%)",
                    WebkitBackdropFilter: "blur(16px) saturate(160%)",
                    // entrance animation
                    animation: visible ? "aiWindowIn 0.3s cubic-bezier(0.34,1.4,0.64,1) both" : "aiWindowOut 0.2s ease both",
                    pointerEvents: visible ? "auto" : "none",
                    opacity: visible ? 1 : 0,
                }}
            >
                {/* Header */}
                <ChatHeader
                    onMinimize={onMinimize}
                    onExpand={onExpand}
                    onClose={onClose}
                    onClear={onClear}
                />

                {/* Body: welcome or messages */}
                <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", minHeight: 0 }}>
                    {!hasMessages ? (
                        <ChatWelcome onSuggest={onSend} />
                    ) : (
                        <ChatMessages
                            messages={messages}
                            isTyping={isTyping}
                            messagesEndRef={messagesEndRef}
                        />
                    )}
                </div>

                {/* Input */}
                <ChatInput
                    value={inputValue}
                    onChange={onInputChange}
                    onSend={onSend}
                    isTyping={isTyping}
                />
            </div>

            <style>{`
                @keyframes aiWindowIn {
                    from { opacity: 0; transform: translateY(16px) scale(0.97); }
                    to   { opacity: 1; transform: translateY(0)   scale(1);    }
                }
                @keyframes aiWindowOut {
                    from { opacity: 1; transform: translateY(0)   scale(1);    }
                    to   { opacity: 0; transform: translateY(12px) scale(0.97); }
                }
                @media (max-width: 480px) {
                    .ai-window-backdrop { display: block !important; }
                }
            `}</style>
        </>
    );
}
