// ── Shared Provider Types ──────────────────────────────────────────
// All AI providers implement this contract.

export interface ChatMessage {
    role: "user" | "assistant";
    content: string;
}

export interface StreamChunk {
    text: string;
}

/**
 * A provider streams tokens via Server-Sent Events.
 * Returns a ReadableStream that emits:
 *   data: {"text":"…"}\n\n
 *   data: [DONE]\n\n
 *
 * On error before streaming starts, throws an ProviderError.
 * On error mid-stream, emits data: {"error":"…"} then closes.
 */
export interface AIProvider {
    name: string;
    generateStream(
        messages: ChatMessage[],
        systemInstruction: string,
        signal: AbortSignal
    ): Promise<ReadableStream>;
}

/**
 * Typed error that carries HTTP status so the manager can decide
 * whether to fall back (5xx / 429) or propagate (4xx auth errors).
 */
export class ProviderError extends Error {
    constructor(
        message: string,
        public readonly status: number,
        public readonly provider: string
    ) {
        super(message);
        this.name = "ProviderError";
    }

    /** True when falling back to the next provider is appropriate */
    get isFallbackable(): boolean {
        return this.status === 429 || this.status >= 500;
    }

    /** True when the error is a client auth failure — never retry */
    get isAuthError(): boolean {
        return this.status === 401 || this.status === 403;
    }
}

// ── Shared SSE encoder helper ─────────────────────────────────────
export function buildSSEStream(
    asyncFn: (
        enqueue: (text: string) => void,
        signal: AbortSignal
    ) => Promise<void>,
    signal: AbortSignal
): ReadableStream {
    const encoder = new TextEncoder();

    return new ReadableStream({
        async start(controller) {
            const enqueue = (text: string) => {
                controller.enqueue(
                    encoder.encode(`data: ${JSON.stringify({ text })}\n\n`)
                );
            };

            try {
                await asyncFn(enqueue, signal);
                controller.enqueue(encoder.encode("data: [DONE]\n\n"));
                controller.close();
            } catch (err) {
                if (!signal.aborted) {
                    const msg =
                        err instanceof Error
                            ? err.message
                            : "Stream error";
                    controller.enqueue(
                        encoder.encode(
                            `data: ${JSON.stringify({ error: msg })}\n\n`
                        )
                    );
                }
                controller.close();
            }
        },
        cancel() {
            // Client disconnected — signal propagated upstream by AbortController
        },
    });
}
