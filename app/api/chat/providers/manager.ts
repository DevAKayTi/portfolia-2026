// ── AI Provider Manager ───────────────────────────────────────────
// Orchestrates primary → fallback provider selection.
// Rules:
//  - Try primary first (Groq by default)
//  - Fall back on: 429 (rate limit) or 5xx (server error)
//  - Never fall back on: 401/403 (auth errors — wrong key)
//  - No retry loops — one attempt per provider
//  - Never switch providers after partial tokens have been streamed

import { GroqProvider } from "./groq";
import { OpenRouterProvider } from "./openrouter";
import { ProviderError } from "./types";
import type { AIProvider, ChatMessage } from "./types";
import { SYSTEM_INSTRUCTION } from "@/app/components/ai-assistant/portfolio-context";

function buildProviders(): { primary: AIProvider | null; fallback: AIProvider | null } {
    const groqKey = process.env.GROQ_API_KEY?.trim();
    const orKey = process.env.OPENROUTER_API_KEY?.trim();

    const primary = groqKey ? new GroqProvider(groqKey) : null;
    const fallback = orKey ? new OpenRouterProvider(orKey) : null;

    return { primary, fallback };
}

export interface ManagerResult {
    stream: ReadableStream;
    providerUsed: string;
}

/**
 * Attempt to generate a streaming response.
 * Returns the stream and which provider was used.
 * Throws a descriptive Error if both providers fail.
 */
export async function generateWithFallback(
    messages: ChatMessage[],
    signal: AbortSignal
): Promise<ManagerResult> {
    const { primary, fallback } = buildProviders();

    if (!primary && !fallback) {
        throw new Error(
            "No AI provider is configured. Please set GROQ_API_KEY or OPENROUTER_API_KEY."
        );
    }

    let primaryError: ProviderError | null = null;

    // ── Try primary ──────────────────────────────────────────────
    if (primary) {
        try {
            const stream = await primary.generateStream(
                messages,
                SYSTEM_INSTRUCTION,
                signal
            );
            return { stream, providerUsed: primary.name };
        } catch (err) {
            if (err instanceof ProviderError) {
                // Auth failure — never fall back, surface immediately
                if (err.isAuthError) {
                    throw new Error(
                        `Authentication failed with ${err.provider}. Check your API key.`
                    );
                }
                // Fallback-eligible (429 / 5xx)
                if (err.isFallbackable && fallback) {
                    primaryError = err;
                    console.warn(
                        `[AI Manager] ${primary.name} failed (${err.status}) — trying fallback: ${fallback.name}`
                    );
                } else {
                    // 4xx non-auth error on primary, no fallback configured
                    throw new Error(
                        `AI provider error (${err.provider}): ${err.message}`
                    );
                }
            } else {
                // Network / fetch error on primary — try fallback if available
                if (fallback) {
                    primaryError = new ProviderError(
                        err instanceof Error ? err.message : "Unknown error",
                        503,
                        primary.name
                    );
                    console.warn(
                        `[AI Manager] ${primary.name} network error — trying fallback: ${fallback.name}`
                    );
                } else {
                    throw err;
                }
            }
        }
    }

    // ── Try fallback ─────────────────────────────────────────────
    if (fallback) {
        try {
            const stream = await fallback.generateStream(
                messages,
                SYSTEM_INSTRUCTION,
                signal
            );
            return { stream, providerUsed: fallback.name };
        } catch (err) {
            const fallbackMsg =
                err instanceof Error ? err.message : "Unknown fallback error";
            const primaryMsg = primaryError
                ? ` Primary (${primaryError.provider}) failed with: ${primaryError.message}.`
                : "";

            throw new Error(
                `All AI providers failed.${primaryMsg} Fallback (${fallback.name}): ${fallbackMsg}`
            );
        }
    }

    // primary failed and no fallback available
    throw new Error(
        primaryError?.message ?? "AI provider failed and no fallback is configured."
    );
}

export type { ChatMessage };
