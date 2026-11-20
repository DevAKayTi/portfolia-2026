// ── Groq Provider ─────────────────────────────────────────────────
// Uses Groq's OpenAI-compatible chat/completions endpoint with streaming.
// Free-tier model: qwen/qwen3.8-27b (verified free as of 2026)
// Docs: https://console.groq.com/docs/openai

import type { AIProvider, ChatMessage } from "./types";
import { ProviderError, buildSSEStream } from "./types";
import { SYSTEM_INSTRUCTION } from "@/app/components/ai-assistant/portfolio-context";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

// Free-tier models on Groq — verified available from this key's access list
// openai/gpt-oss-120b: Qwen 3.8 27B general-purpose LLM, free tier
const GROQ_MODEL = "openai/gpt-oss-120b";

export class GroqProvider implements AIProvider {
    readonly name = "groq";

    constructor(private readonly apiKey: string) { }

    async generateStream(
        messages: ChatMessage[],
        systemInstruction: string,
        signal: AbortSignal
    ): Promise<ReadableStream> {
        // Build OpenAI-compatible messages with system prompt
        const payload = {
            model: GROQ_MODEL,
            stream: true,
            temperature: 0.7,
            max_tokens: 1024,
            messages: [
                { role: "system", content: systemInstruction },
                ...messages.map((m) => ({
                    role: m.role,
                    content: m.content,
                })),
            ],
        };

        const res = await fetch(GROQ_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${this.apiKey}`,
            },
            body: JSON.stringify(payload),
            signal,
        });

        if (!res.ok) {
            let detail = `HTTP ${res.status}`;
            try {
                const body = await res.json();
                detail = body?.error?.message ?? detail;
            } catch {
                // ignore parse failure
            }
            throw new ProviderError(
                `Groq API error: ${detail}`,
                res.status,
                this.name
            );
        }

        // Wrap Groq's SSE stream into our standard SSE format
        return buildSSEStream(async (enqueue, abortSignal) => {
            const reader = res.body?.getReader();
            if (!reader) throw new Error("No response body from Groq.");

            const decoder = new TextDecoder();
            let buffer = "";

            try {
                while (!abortSignal.aborted) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    buffer += decoder.decode(value, { stream: true });
                    const lines = buffer.split("\n");
                    buffer = lines.pop() ?? "";

                    for (const line of lines) {
                        const trimmed = line.trim();
                        if (!trimmed.startsWith("data: ")) continue;

                        const data = trimmed.slice(6);
                        if (data === "[DONE]") return;

                        try {
                            const parsed: {
                                choices?: {
                                    delta?: { content?: string };
                                    finish_reason?: string | null;
                                }[];
                            } = JSON.parse(data);

                            const content =
                                parsed?.choices?.[0]?.delta?.content;
                            if (content) enqueue(content);
                        } catch {
                            // skip malformed SSE line
                        }
                    }
                }
            } finally {
                reader.releaseLock();
            }
        }, signal);
    }
}

// Export system instruction re-export for convenience
export { SYSTEM_INSTRUCTION };
