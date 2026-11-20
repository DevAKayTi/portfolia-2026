"use client";

import React from "react";

interface ChatHeaderProps {
    onMinimize: () => void;
    onExpand: () => void;
    onClose: () => void;
    onClear: () => void;
    isExpanded?: boolean;
}

export default function ChatHeader({
    onMinimize,
    onExpand,
    onClose,
    onClear,
    isExpanded = false,
}: ChatHeaderProps) {
    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                padding: isExpanded ? "1rem 1.5rem" : "0.85rem 1rem",
                borderBottom: "1px solid var(--border)",
                background: "var(--surface)",
                flexShrink: 0,
            }}
        >
            {/* Avatar */}
            <div
                style={{
                    width: isExpanded ? "40px" : "34px",
                    height: isExpanded ? "40px" : "34px",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, var(--accent) 0%, #8b5cf6 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    position: "relative",
                }}
            >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path
                        d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z"
                        fill="white" opacity="0.95"
                    />
                    <path
                        d="M19 2L19.75 4.25L22 5L19.75 5.75L19 8L18.25 5.75L16 5L18.25 4.25L19 2Z"
                        fill="white" opacity="0.6"
                    />
                </svg>
                {/* Online dot */}
                <span style={{
                    position: "absolute",
                    bottom: "1px",
                    right: "1px",
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background: "#22c55e",
                    border: "2px solid var(--surface)",
                    boxShadow: "0 0 6px rgba(34,197,94,0.6)",
                }} />
            </div>

            {/* Name + status */}
            <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                    fontSize: isExpanded ? "0.95rem" : "0.875rem",
                    fontWeight: 700,
                    color: "var(--heading)",
                    lineHeight: 1.2,
                }}>
                    AI Assistant
                </div>
                <div style={{
                    fontSize: "0.72rem",
                    color: "#22c55e",
                    marginTop: "0.1rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.3rem",
                }}>
                    <span style={{
                        width: "5px",
                        height: "5px",
                        borderRadius: "50%",
                        background: "#22c55e",
                        display: "inline-block",
                    }} />
                    Online · Powered by AI
                </div>
            </div>

            {/* Controls */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.2rem", flexShrink: 0 }}>
                {/* Clear */}
                <HeaderIconBtn onClick={onClear} title="Clear conversation" label="Clear">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6l-1 14H6L5 6" />
                        <path d="M10 11v6M14 11v6" />
                        <path d="M9 6V4h6v2" />
                    </svg>
                </HeaderIconBtn>

                {/* Expand / Collapse */}
                {!isExpanded ? (
                    <HeaderIconBtn onClick={onExpand} title="Expand to full screen" label="Expand">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="15 3 21 3 21 9" />
                            <polyline points="9 21 3 21 3 15" />
                            <line x1="21" y1="3" x2="14" y2="10" />
                            <line x1="3" y1="21" x2="10" y2="14" />
                        </svg>
                    </HeaderIconBtn>
                ) : (
                    <HeaderIconBtn onClick={onMinimize} title="Return to compact mode" label="Compact">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="4 14 10 14 10 20" />
                            <polyline points="20 10 14 10 14 4" />
                            <line x1="10" y1="14" x2="3" y2="21" />
                            <line x1="21" y1="3" x2="14" y2="10" />
                        </svg>
                    </HeaderIconBtn>
                )}

                {/* Minimize / Close */}
                <HeaderIconBtn onClick={isExpanded ? onMinimize : onClose} title={isExpanded ? "Minimize" : "Close"} label="Close">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                </HeaderIconBtn>
            </div>
        </div>
    );
}

/* ── Small icon button helper ──────────────────────────────────── */
function HeaderIconBtn({
    onClick,
    title,
    label,
    children,
}: {
    onClick: () => void;
    title: string;
    label: string;
    children: React.ReactNode;
}) {
    const [hov, setHov] = React.useState(false);
    return (
        <button
            onClick={onClick}
            title={title}
            aria-label={label}
            onMouseEnter={() => setHov(true)}
            onMouseLeave={() => setHov(false)}
            style={{
                width: "28px",
                height: "28px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "0.4rem",
                border: "none",
                cursor: "pointer",
                background: hov ? "var(--surface2)" : "transparent",
                color: hov ? "var(--text)" : "var(--muted)",
                transition: "background 0.15s, color 0.15s",
            }}
        >
            {children}
        </button>
    );
}
