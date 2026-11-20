// ── OpenRouter Provider ───────────────────────────────────────────
// Uses OpenRouter's OpenAI-compatible API endpoint with streaming.
// Free model: meta-llama/llama-3.2-3b-instruct:free
// Docs: https://openrouter.ai/docs
//
// OpenRouter free models are marked with ":free" suffix.
// Always verify at https://openrouter.ai/models?order=pricing-asc

import type { AIProvider, ChatMessage } from "./types";
import { ProviderError, buildSSEStream } from "./types";

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

// Free-tier model on OpenRouter — ":free" suffix guarantees no charge
const OPENROUTER_MODEL = "meta-llama/llama-3.2-3b-instruct:free";

// Site info for OpenRouter HTTP referrer headers (recommended by their docs)
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://localhost:3000";
const SITE_NAME = "Aung Kyaw Thu Portfolio";

export class OpenRouterProvider implements AIProvider {
    readonly name = "openrouter";

    constructor(private readonly apiKey: string) {}

    async generateStream(
        messages: ChatMessage[],
        systemInstruction: string,
        signal: AbortSignal
    ): Promise<ReadableStream> {
        const payload = {
            model: OPENROUTER_MODEL,
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

        const res = await fetch(OPENROUTER_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${this.apiKey}`,
                "HTTP-Referer": SITE_URL,
                "X-Title": SITE_NAME,
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
                `OpenRouter API error: ${detail}`,
                res.status,
                this.name
            );
        }

        // Wrap OpenRouter's SSE stream into our standard format
        return buildSSEStream(async (enqueue, abortSignal) => {
            const reader = res.body?.getReader();
            if (!reader) throw new Error("No response body from OpenRouter.");

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
                                    delta?: { content?: string | null };
                                    finish_reason?: string | null;
                                }[];
                                error?: { message: string };
                            } = JSON.parse(data);

                            // OpenRouter may embed errors in the stream
                            if (parsed?.error?.message) {
                                throw new Error(parsed.error.message);
                            }

                            const content =
                                parsed?.choices?.[0]?.delta?.content;
                            if (content) enqueue(content);
                        } catch (e) {
                            if (e instanceof Error && e.message !== data)
                                throw e; // real error, not a parse error
                        }
                    }
                }
            } finally {
                reader.releaseLock();
            }
        }, signal);
    }
}
