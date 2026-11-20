"use client";

import React from "react";
import { useChatState } from "./useChatState";
import ChatTrigger from "./ChatTrigger";
import ChatWindow from "./ChatWindow";
import ExpandedChat from "./ExpandedChat";

export default function AIAssistant() {
    const {
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
    } = useChatState();

    return (
        <>
            {/* ── Floating trigger ── always visible unless expanded */}
            {displayState !== "expanded" && (
                <ChatTrigger
                    onClick={displayState === "hidden" ? open : close}
                />
            )}

            {/* ── Compact window ── */}
            {displayState !== "expanded" && (
                <ChatWindow
                    messages={messages}
                    isTyping={isTyping}
                    inputValue={inputValue}
                    messagesEndRef={messagesEndRef}
                    onInputChange={setInputValue}
                    onSend={sendMessage}
                    onMinimize={close}
                    onExpand={expand}
                    onClose={close}
                    onClear={clearMessages}
                    visible={displayState === "compact"}
                />
            )}

            {/* ── Full-screen expanded ── */}
            {displayState === "expanded" && (
                <ExpandedChat
                    messages={messages}
                    isTyping={isTyping}
                    inputValue={inputValue}
                    messagesEndRef={messagesEndRef}
                    onInputChange={setInputValue}
                    onSend={sendMessage}
                    onCollapse={collapse}
                    onClose={close}
                    onClear={clearMessages}
                />
            )}
        </>
    );
}
