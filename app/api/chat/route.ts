// ── POST /api/chat ────────────────────────────────────────────────
// Multi-provider AI chat API route.
// Architecture: Groq (primary) → OpenRouter (fallback)
// All API keys are server-side only. Never exposed to the browser.

import { generateWithFallback } from "./providers/manager";
import type { ChatMessage } from "./providers/manager";

// ── Runtime: Node.js (required for streaming on Vercel) ───────────
export const runtime = "nodejs";

// ── In-memory rate limiting ───────────────────────────────────────
// NOTE: In-memory rate limiting is per-instance and not globally
// shared across Vercel serverless function replicas. For production
// distributed rate limiting, use Vercel KV, Upstash Redis, etc.
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
const RATE_LIMIT_MAX = 20;           // requests per window per IP

function checkRateLimit(ip: string): boolean {
    const now = Date.now();
    const entry = rateLimitMap.get(ip);
    if (!entry || now > entry.resetAt) {
        rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
        return false; // not limited
    }
    entry.count++;
    return entry.count > RATE_LIMIT_MAX;
}

// ── Validation ────────────────────────────────────────────────────
const MAX_MESSAGE_LENGTH = 1000;   // chars per message
const MAX_HISTORY_MESSAGES = 40;   // total messages in history

function validateMessages(body: unknown): ChatMessage[] | null {
    if (!body || typeof body !== "object") return null;

    const { messages } = body as Record<string, unknown>;
    if (!Array.isArray(messages)) return null;
    if (messages.length === 0 || messages.length > MAX_HISTORY_MESSAGES) return null;

    const validated: ChatMessage[] = [];

    for (const msg of messages) {
        if (!msg || typeof msg !== "object") return null;
        const { role, content } = msg as Record<string, unknown>;

        if (role !== "user" && role !== "assistant") return null;
        if (typeof content !== "string") return null;

        const trimmed = content.trim();
        if (trimmed.length === 0) return null;
        if (trimmed.length > MAX_MESSAGE_LENGTH) return null;

        validated.push({ role, content: trimmed });
    }

    // Conversation must end with a user message
    if (validated.at(-1)?.role !== "user") return null;
    console.log(validated);
    return validated;
}

// ── Sanitize user content (basic XSS prevention) ─────────────────
function sanitizeMessages(messages: ChatMessage[]): ChatMessage[] {
    return messages.map((m) => ({
        ...m,
        content: m.content.replace(/[<>]/g, "").trim(),
    }));
}

// ── Friendly error classifier ─────────────────────────────────────
function classifyError(err: unknown): { message: string; status: number } {
    const raw = err instanceof Error ? err.message : String(err);

    if (raw.includes("Authentication failed") || raw.includes("API key")) {
        return { message: "AI service authentication failed. Contact the site owner.", status: 503 };
    }
    if (raw.includes("No AI provider")) {
        return { message: "AI service is not configured.", status: 503 };
    }
    if (raw.includes("All AI providers failed")) {
        return { message: "AI service is temporarily unavailable. Please try again later.", status: 503 };
    }

    // Generic — do not leak internal details
    console.error("[AI Chat] Unhandled error:", raw);
    return { message: "Failed to generate a response. Please try again.", status: 500 };
}

// ── POST handler ──────────────────────────────────────────────────
export async function POST(request: Request): Promise<Response> {
    // ── Rate limit ───────────────────────────────────────────────
    const ip =
        request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
        request.headers.get("x-real-ip") ||
        "unknown";

    if (checkRateLimit(ip)) {
        return Response.json(
            { error: "Too many requests. Please slow down and try again." },
            { status: 429 }
        );
    }

    // ── Parse body ───────────────────────────────────────────────
    let body: unknown;
    try {
        body = await request.json();
    } catch {
        return Response.json(
            { error: "Invalid request format." },
            { status: 400 }
        );
    }

    // ── Validate ─────────────────────────────────────────────────
    const messages = validateMessages(body);
    if (!messages) {
        return Response.json(
            { error: "Invalid message data. Check message format and length." },
            { status: 400 }
        );
    }

    const sanitized = sanitizeMessages(messages);

    // ── Abort controller (client disconnect cancels upstream req) ─
    const abortController = new AbortController();
    request.signal.addEventListener("abort", () => abortController.abort(), {
        once: true,
    });

    // ── Generate stream ──────────────────────────────────────────
    try {
        const { stream, providerUsed } = await generateWithFallback(
            sanitized,
            abortController.signal
        );

        // Log which provider served the request (no sensitive data)
        console.log(`[AI Chat] Serving request via: ${providerUsed}`);

        return new Response(stream, {
            status: 200,
            headers: {
                "Content-Type": "text/event-stream",
                "Cache-Control": "no-cache, no-transform",
                "Connection": "keep-alive",
                "X-Accel-Buffering": "no", // disable Nginx buffering on some hosts
            },
        });
    } catch (err) {
        const { message, status } = classifyError(err);
        return Response.json({ error: message }, { status });
    }
}
