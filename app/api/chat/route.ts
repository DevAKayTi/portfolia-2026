import { GoogleGenAI } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "@/app/components/ai-assistant/portfolio-context";

// ── Rate limiting (in-memory, per-IP) ─────────────────────────────
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
const RATE_LIMIT_MAX = 15; // max requests per window

function isRateLimited(ip: string): boolean {
    const now = Date.now();
    const entry = rateLimitMap.get(ip);

    if (!entry || now > entry.resetAt) {
        rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
        return false;
    }

    entry.count++;
    return entry.count > RATE_LIMIT_MAX;
}

// ── Validation ────────────────────────────────────────────────────
const MAX_MESSAGE_LENGTH = 1000;
const MAX_HISTORY_LENGTH = 50;

interface ChatMessage {
    role: "user" | "assistant";
    content: string;
}

function validateMessages(body: unknown): ChatMessage[] | null {
    if (!body || typeof body !== "object") return null;
    const { messages } = body as Record<string, unknown>;
    if (!Array.isArray(messages)) return null;
    if (messages.length === 0 || messages.length > MAX_HISTORY_LENGTH) return null;

    const validated: ChatMessage[] = [];
    for (const msg of messages) {
        if (!msg || typeof msg !== "object") return null;
        const { role, content } = msg as Record<string, unknown>;
        if (role !== "user" && role !== "assistant") return null;
        if (typeof content !== "string" || content.trim().length === 0) return null;
        if (content.length > MAX_MESSAGE_LENGTH) return null;
        validated.push({ role, content: content.trim() });
    }

    // Last message must be from user
    if (validated[validated.length - 1].role !== "user") return null;

    return validated;
}

// ── Sanitize ──────────────────────────────────────────────────────
function sanitize(text: string): string {
    return text
        .replace(/[<>]/g, "") // strip angle brackets
        .trim();
}

// ── POST handler ──────────────────────────────────────────────────
export async function POST(request: Request) {
    // --- API key check ---
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        return Response.json(
            { error: "AI service is not configured. Please add GEMINI_API_KEY to .env.local." },
            { status: 503 }
        );
    }

    // --- Rate limiting ---
    const ip =
        request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
        request.headers.get("x-real-ip") ||
        "unknown";

    if (isRateLimited(ip)) {
        return Response.json(
            { error: "Too many requests. Please wait a moment and try again." },
            { status: 429 }
        );
    }

    // --- Parse & validate ---
    let body: unknown;
    try {
        body = await request.json();
    } catch {
        return Response.json({ error: "Invalid request body." }, { status: 400 });
    }

    const messages = validateMessages(body);
    if (!messages) {
        return Response.json(
            { error: "Invalid message format. Please send a valid conversation." },
            { status: 400 }
        );
    }

    // --- Build Gemini request ---
    try {
        const ai = new GoogleGenAI({ apiKey });

        // Convert conversation history to Gemini format
        const contents = messages.map((msg) => ({
            role: msg.role === "assistant" ? "model" as const : "user" as const,
            parts: [{ text: sanitize(msg.content) }],
        }));

        // Stream the response
        const response = await ai.models.generateContentStream({
            model: "gemini-3.8-flash",
            config: {
                temperature: 0.7,
                maxOutputTokens: 1024,
                systemInstruction: SYSTEM_INSTRUCTION,
            },
            contents,
        });

        // Create a ReadableStream for the SSE response
        const stream = new ReadableStream({
            async start(controller) {
                const encoder = new TextEncoder();
                try {
                    for await (const chunk of response) {
                        const text = chunk.text ?? "";
                        if (text) {
                            controller.enqueue(
                                encoder.encode(`data: ${JSON.stringify({ text })}\n\n`)
                            );
                        }
                    }
                    controller.enqueue(encoder.encode("data: [DONE]\n\n"));
                    controller.close();
                } catch (err) {
                    const errorMessage =
                        err instanceof Error ? err.message : "Stream error";
                    controller.enqueue(
                        encoder.encode(
                            `data: ${JSON.stringify({ error: errorMessage })}\n\n`
                        )
                    );
                    controller.close();
                }
            },
        });

        return new Response(stream, {
            headers: {
                "Content-Type": "text/event-stream",
                "Cache-Control": "no-cache",
                Connection: "keep-alive",
            },
        });
    } catch (err) {
        console.error("[Gemini API Error]", err);

        const message =
            err instanceof Error && err.message.includes("API_KEY")
                ? "Invalid API key configuration."
                : "Failed to generate a response. Please try again.";

        return Response.json({ error: message }, { status: 500 });
    }
}
