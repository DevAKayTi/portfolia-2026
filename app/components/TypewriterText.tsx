"use client";

import { useEffect, useState } from "react";

const WORDS = ["Developer", "Engineer", "Architect", "Creator"];
const TYPE_SPEED = 80;
const DELETE_SPEED = 45;
const PAUSE_AFTER_TYPE = 1800;
const PAUSE_AFTER_DELETE = 400;

export default function TypewriterText() {
    const [displayed, setDisplayed] = useState("");
    const [wordIndex, setWordIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const current = WORDS[wordIndex];

        let timeout: ReturnType<typeof setTimeout>;

        if (!isDeleting && displayed === current) {
            // Finished typing — pause then delete
            timeout = setTimeout(() => setIsDeleting(true), PAUSE_AFTER_TYPE);
        } else if (isDeleting && displayed === "") {
            // Finished deleting — move to next word
            timeout = setTimeout(() => {
                setIsDeleting(false);
                setWordIndex((i) => (i + 1) % WORDS.length);
            }, PAUSE_AFTER_DELETE);
        } else {
            timeout = setTimeout(() => {
                setDisplayed(
                    isDeleting
                        ? current.slice(0, displayed.length - 1)
                        : current.slice(0, displayed.length + 1)
                );
            }, isDeleting ? DELETE_SPEED : TYPE_SPEED);
        }

        return () => clearTimeout(timeout);
    }, [displayed, isDeleting, wordIndex]);

    return (
        <span style={{ color: "var(--accent2)" }}>
            {displayed}
            <span
                style={{
                    display: "inline-block",
                    width: "2px",
                    height: "1em",
                    background: "var(--accent)",
                    marginLeft: "2px",
                    verticalAlign: "text-bottom",
                    animation: "blink 1s step-end infinite",
                }}
            />
        </span>
    );
}
