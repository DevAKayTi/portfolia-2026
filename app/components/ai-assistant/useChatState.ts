"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import type { Message, DisplayState, ChatApiMessage } from "./types";

// ── Helpers ───────────────────────────────────────────────────────
let msgCounter = 0;
function uid() {
    return `msg-${Date.now()}-${++msgCounter}`;
}

const MAX_INPUT_LENGTH = 1000;

// ── Send messages to /api/chat and stream the response ───────────
async function fetchChatStream(
    messages: ChatApiMessage[],
    onChunk: (text: string) => void,
    signal?: AbortSignal
): Promise<void> {
    const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages }),
        signal,
    });

    if (!res.ok) {
        let errorMsg = "Something went wrong. Please try again.";
        try {
            const data = await res.json();
            if (data.error) errorMsg = data.error;
        } catch {
            // ignore parse errors
        }
        throw new Error(errorMsg);
    }

    const reader = res.body?.getReader();
    if (!reader) throw new Error("No response stream available.");

    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        // Process SSE lines
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? ""; // keep incomplete line in buffer

        for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed.startsWith("data: ")) continue;

            const payload = trimmed.slice(6);
            if (payload === "[DONE]") return;

            try {
                const parsed = JSON.parse(payload);
                if (parsed.error) throw new Error(parsed.error);
                if (parsed.text) onChunk(parsed.text);
            } catch (e) {
                if (e instanceof Error && e.message !== payload) throw e;
            }
        }
    }
}

// ── Hook ──────────────────────────────────────────────────────────
export function useChatState() {
    const [displayState, setDisplayState] = useState<DisplayState>("hidden");
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const abortRef = useRef<AbortController | null>(null);

    // Auto-scroll to the bottom whenever messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isTyping]);

    const open = useCallback(() => setDisplayState("compact"), []);
    const close = useCallback(() => setDisplayState("hidden"), []);
    const expand = useCallback(() => setDisplayState("expanded"), []);
    const collapse = useCallback(() => setDisplayState("compact"), []);

    const clearMessages = useCallback(() => {
        // Abort any in-flight request
        abortRef.current?.abort();
        abortRef.current = null;
        setMessages([]);
        setIsTyping(false);
    }, []);

    const sendMessage = useCallback(
        async (text: string) => {
            const content = text.trim().slice(0, MAX_INPUT_LENGTH);
            if (!content || isTyping) return;

            // Create user message
            const userMsg: Message = {
                id: uid(),
                role: "user",
                content,
                timestamp: new Date(),
            };

            // Create a placeholder for the assistant response (streaming)
            const assistantId = uid();

            setMessages((prev) => [...prev, userMsg]);
            setInputValue("");
            setIsTyping(true);

            // Build conversation history for the API
            const apiMessages: ChatApiMessage[] = [
                ...messages.map((m) => ({ role: m.role, content: m.content })),
                { role: "user" as const, content },
            ];

            // Set up abort controller
            const controller = new AbortController();
            abortRef.current = controller;

            try {
                // Add empty streaming message
                setMessages((prev) => [
                    ...prev,
                    {
                        id: assistantId,
                        role: "assistant",
                        content: "",
                        timestamp: new Date(),
                        isStreaming: true,
                    },
                ]);

                await fetchChatStream(
                    apiMessages,
                    (chunk) => {
                        // Append each chunk to the streaming message
                        setMessages((prev) =>
                            prev.map((m) =>
                                m.id === assistantId
                                    ? { ...m, content: m.content + chunk }
                                    : m
                            )
                        );
                    },
                    controller.signal
                );

                // Mark streaming complete
                setMessages((prev) =>
                    prev.map((m) =>
                        m.id === assistantId
                            ? { ...m, isStreaming: false }
                            : m
                    )
                );
            } catch (err) {
                if ((err as Error).name === "AbortError") return;

                const errorContent =
                    err instanceof Error
                        ? err.message
                        : "Something went wrong. Please try again.";

                setMessages((prev) => {
                    // Replace streaming placeholder or add new error message
                    const hasPlaceholder = prev.some((m) => m.id === assistantId);
                    if (hasPlaceholder) {
                        return prev.map((m) =>
                            m.id === assistantId
                                ? {
                                      ...m,
                                      content: errorContent,
                                      isStreaming: false,
                                      isError: true,
                                  }
                                : m
                        );
                    }
                    return [
                        ...prev,
                        {
                            id: assistantId,
                            role: "assistant",
                            content: errorContent,
                            timestamp: new Date(),
                            isError: true,
                        },
                    ];
                });
            } finally {
                setIsTyping(false);
                abortRef.current = null;
            }
        },
        [isTyping, messages]
    );

    return {
        displayState,
        messages,
        inputValue,
        isTyping,
        messagesEndRef,
        open,
        close,
        expand,
        collapse,
        clearMessages,
        sendMessage,
        setInputValue,
    };
}
