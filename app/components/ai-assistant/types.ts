// ── AI Assistant — Shared Types ────────────────────────────────────

export type DisplayState = "hidden" | "compact" | "expanded";

export interface Message {
    id: string;
    role: "user" | "assistant";
    content: string;
    timestamp: Date;
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

// ── Mock responses keyed on rough intent ─────────────────────────
const MOCK_RESPONSES: Record<string, string> = {
    tech: "I work across the full stack — on the frontend with **React**, **Next.js**, and TypeScript, and on the backend with **PHP/Laravel** and **Node.js**. I'm also comfortable with Docker, MySQL, PostgreSQL, and Git-based CI/CD workflows. 10+ technologies in total! 🚀",
    experience: "I have **4+ years** of professional experience spanning **3 companies**. My background covers building scalable SaaS platforms, internal business tools, and customer-facing web applications — always with a focus on clean architecture and performance.",
    projects: "I've shipped a range of projects: from full-featured e-commerce platforms and CRM dashboards to custom REST APIs and real-time web apps. Each one is built with maintainability and user experience in mind. Check out the **Projects** section for highlights!",
    freelance: "Yes, I'm **currently open to freelance and contract opportunities**! Whether you need a new web app, a Laravel backend, or a Next.js front end, feel free to reach out via the Contact section. I'd love to hear about your project.",
    contact: "The best way to reach me is through the **Contact** section below. You can also download my CV from the hero section. I typically respond within 24 hours. 📬",
    default: "Great question! I'm Aung Kyaw Thu — a Full Stack Developer with 4+ years of experience building modern web applications. Feel free to ask me about my skills, projects, or how to get in touch. I'm happy to help! 😊",
};

function pickResponse(text: string): string {
    const lower = text.toLowerCase();
    if (/tech|stack|language|framework|react|next|laravel|php|docker/.test(lower)) return MOCK_RESPONSES.tech;
    if (/experience|work|career|job|year|company/.test(lower)) return MOCK_RESPONSES.experience;
    if (/project|built|build|portfolio|app|platform/.test(lower)) return MOCK_RESPONSES.projects;
    if (/freelance|contract|hire|available|opportunity/.test(lower)) return MOCK_RESPONSES.freelance;
    if (/contact|email|reach|touch|message/.test(lower)) return MOCK_RESPONSES.contact;
    return MOCK_RESPONSES.default;
}

export function getMockResponse(userMessage: string): Promise<string> {
    const delay = 800 + Math.random() * 600; // 0.8 – 1.4 s
    return new Promise((resolve) =>
        setTimeout(() => resolve(pickResponse(userMessage)), delay)
    );
}
