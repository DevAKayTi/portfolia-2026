// ── AI Assistant — Shared Types ────────────────────────────────────

export type DisplayState = "hidden" | "compact" | "expanded";

export interface Message {
    id: string;
    role: "user" | "assistant";
    content: string;
    timestamp: Date;
    isError?: boolean;
    isStreaming?: boolean;
}

export interface SuggestedQuestion {
    id: string;
    text: string;
}

export const SUGGESTED_QUESTIONS: SuggestedQuestion[] = [
    { id: "q1", text: "What technologies do you work with?" },
    { id: "q2", text: "Tell me about your work experience." },
    { id: "q3", text: "What projects have you built?" },
    { id: "q4", text: "Are you available for freelance work?" },
    { id: "q5", text: "How can I contact you?" },
];

// ── API types ────────────────────────────────────────────────────
export interface ChatApiMessage {
    role: "user" | "assistant";
    content: string;
}
