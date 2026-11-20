"use client";

import React from "react";

interface ChatTriggerProps {
    onClick: () => void;
}

export default function ChatTrigger({ onClick }: ChatTriggerProps) {
    const [hovered, setHovered] = React.useState(false);
    const [showTooltip, setShowTooltip] = React.useState(false);
    const tooltipTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleMouseEnter = () => {
        setHovered(true);
        tooltipTimer.current = setTimeout(() => setShowTooltip(true), 400);
    };

    const handleMouseLeave = () => {
        setHovered(false);
        setShowTooltip(false);
        if (tooltipTimer.current) clearTimeout(tooltipTimer.current);
    };

    return (
        <>
            {/* Tooltip */}
            <div
                role="tooltip"
                style={{
                    position: "fixed",
                    bottom: "90px",
                    right: "24px",
                    background: "var(--surface)",
                    border: "1px solid var(--border)",
                    color: "var(--text)",
                    fontSize: "0.78rem",
                    fontWeight: 500,
                    padding: "0.4rem 0.75rem",
                    borderRadius: "0.5rem",
                    whiteSpace: "nowrap",
                    boxShadow: "0 4px 16px rgba(0,0,0,0.25)",
                    opacity: showTooltip ? 1 : 0,
                    transform: showTooltip ? "translateY(0)" : "translateY(4px)",
                    transition: "opacity 0.2s ease, transform 0.2s ease",
                    pointerEvents: "none",
                    zIndex: 999,
                }}
            >
                Ask AI Assistant
                {/* Arrow */}
                <span style={{
                    position: "absolute",
                    bottom: "-5px",
                    right: "22px",
                    width: "10px",
                    height: "10px",
                    background: "var(--surface)",
                    border: "1px solid var(--border)",
                    borderTop: "none",
                    borderLeft: "none",
                    transform: "rotate(45deg)",
                }} />
            </div>

            {/* Trigger button */}
            <button
                onClick={onClick}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                aria-label="Ask AI Assistant"
                style={{
                    position: "fixed",
                    bottom: "24px",
                    right: "24px",
                    zIndex: 1000,
                    width: "56px",
                    height: "56px",
                    borderRadius: "50%",
                    border: "1px solid rgba(99,102,241,0.4)",
                    background: hovered
                        ? "var(--accent2)"
                        : "var(--accent)",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: hovered
                        ? "0 0 0 8px rgba(99,102,241,0.12), 0 8px 32px rgba(99,102,241,0.45)"
                        : "0 0 0 0px rgba(99,102,241,0.0), 0 4px 24px rgba(99,102,241,0.3)",
                    transform: hovered ? "scale(1.08)" : "scale(1)",
                    transition: "background 0.2s ease, box-shadow 0.3s ease, transform 0.2s ease",
                }}
            >
                {/* AI sparkle icon (SVG, no dep) */}
                <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                >
                    <path
                        d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z"
                        fill="white"
                        opacity="0.9"
                    />
                    <path
                        d="M19 2L19.75 4.25L22 5L19.75 5.75L19 8L18.25 5.75L16 5L18.25 4.25L19 2Z"
                        fill="white"
                        opacity="0.6"
                    />
                    <path
                        d="M5 16L5.5 17.5L7 18L5.5 18.5L5 20L4.5 18.5L3 18L4.5 17.5L5 16Z"
                        fill="white"
                        opacity="0.5"
                    />
                </svg>

                {/* Pulse ring */}
                <span
                    style={{
                        position: "absolute",
                        inset: 0,
                        borderRadius: "50%",
                        border: "2px solid rgba(99,102,241,0.5)",
                        animation: "aiPulse 2.4s ease-out infinite",
                        pointerEvents: "none",
                    }}
                />
            </button>

            <style>{`
                @keyframes aiPulse {
                    0%   { transform: scale(1);   opacity: 0.7; }
                    70%  { transform: scale(1.55); opacity: 0;   }
                    100% { transform: scale(1.55); opacity: 0;   }
                }
                @media (max-width: 480px) {
                    .ai-trigger-btn { bottom: 16px !important; right: 16px !important; }
                    .ai-tooltip     { bottom: 82px !important; right: 16px !important; }
                }
            `}</style>
        </>
    );
}
