"use client";
import { useEffect, useRef } from "react";
import { Mic } from "lucide-react";
import { Messages } from "@/types";

interface ChatConversationProps {
    messages: Messages[];
    currentMessage: string;
    currentUserMessage: string;
}

const ChatConversation = ({ messages, currentMessage, currentUserMessage }: ChatConversationProps) => {
    const bottomRef = useRef<HTMLDivElement>(null);
    const isEmpty = messages.length === 0 && !currentMessage && !currentUserMessage;

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, currentMessage, currentUserMessage]);

    if (isEmpty) {
        return (
            <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
                <Mic className="size-12 text-muted-foreground" />
                <p className="text-base font-bold">No conversation yet</p>
                <p className="text-sm text-muted-foreground">
                    Click the mic button above to start talking
                </p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-3 overflow-y-auto px-4 py-4 max-h-[500px]">
            {messages.map((msg, i) => (
                <div
                    key={i}
                    className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
                        msg.role === "user"
                            ? "ml-auto bg-primary text-primary-foreground rounded-tr-none"
                            : "mr-auto bg-muted text-foreground rounded-tl-none"
                    }`}
                >
                    {msg.content}
                </div>
            ))}

            {currentUserMessage && (
                <div className="max-w-[80%] ml-auto bg-primary text-primary-foreground rounded-2xl rounded-tr-none px-4 py-2 text-sm">
                    {currentUserMessage}<span className="animate-pulse">|</span>
                </div>
            )}

            {currentMessage && (
                <div className="max-w-[80%] mr-auto bg-muted text-foreground rounded-2xl rounded-tl-none px-4 py-2 text-sm">
                    {currentMessage}<span className="animate-pulse">|</span>
                </div>
            )}

            <div ref={bottomRef} />
        </div>
    );
};

export default ChatConversation;
