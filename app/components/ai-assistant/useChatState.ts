"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import type { Message, DisplayState } from "./types";
import { getMockResponse } from "./types";

let msgCounter = 0;
function uid() {
    return `msg-${Date.now()}-${++msgCounter}`;
}

export function useChatState() {
    const [displayState, setDisplayState] = useState<DisplayState>("hidden");
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to the bottom whenever messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isTyping]);

    const open = useCallback(() => setDisplayState("compact"), []);
    const close = useCallback(() => setDisplayState("hidden"), []);
    const expand = useCallback(() => setDisplayState("expanded"), []);
    const collapse = useCallback(() => setDisplayState("compact"), []);

    const clearMessages = useCallback(() => setMessages([]), []);

    const sendMessage = useCallback(
        async (text: string) => {
            const content = text.trim();
            if (!content || isTyping) return;

            const userMsg: Message = {
                id: uid(),
                role: "user",
                content,
                timestamp: new Date(),
            };

            setMessages((prev) => [...prev, userMsg]);
            setInputValue("");
            setIsTyping(true);

            try {
                const response = await getMockResponse(content);
                const assistantMsg: Message = {
                    id: uid(),
                    role: "assistant",
                    content: response,
                    timestamp: new Date(),
                };
                setMessages((prev) => [...prev, assistantMsg]);
            } finally {
                setIsTyping(false);
            }
        },
        [isTyping]
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
