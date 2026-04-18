import { useState, useRef, useEffect } from "react";
import { IBook, Messages } from "@/types";
import { useAuth } from "@clerk/nextjs";
import { ASSISTANT_ID, DEFAULT_VOICE, VOICE_SETTINGS } from "../lib/constants";
import { startNewSession } from "@/lib/actions/sessions.actions";
import Vapi from "@vapi-ai/web";

export type CallStatus = 'idle' | 'connecting' | 'starting' | 'listening' | 'thinking' | 'speaking';

export const useLatestRef = <T,>(value: T) => {
    const ref = useRef<T>(value);
    useEffect(() => {
        ref.current = value;
    }, [value]);

    return ref;
}

const VAPI_API_KEY = process.env.NEXT_PUBLIC_VAPI_API_KEY;

let vapi: InstanceType<typeof Vapi>

const getVapi = () => {
    if (!vapi) {
        if (!VAPI_API_KEY) {
            throw new Error("VAPI API key is not set. Please set the NEXT_PUBLIC_VAPI_API_KEY environment variable.");
        }
        vapi = new Vapi(VAPI_API_KEY);
    }
    return vapi;
}

export const useVapi = (book: IBook) => {
    const  { userId } = useAuth();
    const [status, setStatus] = useState<CallStatus>('idle');
    const [messages, setMessages] = useState<Messages[]>([]);
    const [currentMessage, setCurrentMessage] = useState<string>('');
    const [currentUserMessage, setCurrentUserMessage] = useState<string>('');
    const [duration, setDuration] = useState<number>(0);
    const [limitError, setLimitError] = useState<string | null>(null);

    //TODO: Implemet limits 

    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const startTimerRef = useRef<NodeJS.Timeout | null>(null);
    const sessionIdRef = useRef<string | null>(null);
    const isStoppingRef = useRef<boolean>(false);
    
    const bookRef = useLatestRef(book);
    // const maxDurationRef = useLatestRef(limits.maxSessionMinutes * 60)
    const durationRef = useLatestRef(duration);
    const voice = book.persona || DEFAULT_VOICE;

    const isActive = status === 'listening' || status === 'thinking' || status === 'speaking' || status === 'starting';

    useEffect(() => {
        const vapiInstance = getVapi();
        if (!vapiInstance) return;

        const handleMessage = (message: {
            type: string;
            role: "user" | "assistant";
            transcriptType: "partial" | "final";
            transcript: string;
        }) => {
            if (message.type !== "transcript") return;

            const { role, transcriptType, transcript } = message;

            if (role === "user") {
                if (transcriptType === "partial") {
                    setCurrentUserMessage(transcript);
                } else {
                    // final user message
                    setCurrentUserMessage("");
                    setStatus("thinking");
                    setMessages((prev) => {
                        const last = prev[prev.length - 1];
                        if (last?.role === "user" && last.content === transcript) return prev;
                        return [...prev, { role: "user", content: transcript }];
                    });
                }
            } else if (role === "assistant") {
                if (transcriptType === "partial") {
                    setCurrentMessage(transcript);
                } else {
                    // final assistant message
                    setCurrentMessage("");
                    setMessages((prev) => {
                        const last = prev[prev.length - 1];
                        if (last?.role === "assistant" && last.content === transcript) return prev;
                        return [...prev, { role: "assistant", content: transcript }];
                    });
                }
            }
        };

        const handleSpeechStart = () => setStatus("speaking");
        const handleSpeechEnd = () => setStatus("listening");
        const handleCallStart = () => setStatus("starting");
        const handleCallEnd = () => {
            setStatus("idle");
            setCurrentMessage("");
            setCurrentUserMessage("");
        };

        vapiInstance.on("message", handleMessage);
        vapiInstance.on("speech-start", handleSpeechStart);
        vapiInstance.on("speech-end", handleSpeechEnd);
        vapiInstance.on("call-start", handleCallStart);
        vapiInstance.on("call-end", handleCallEnd);

        return () => {
            vapiInstance.off("message", handleMessage);
            vapiInstance.off("speech-start", handleSpeechStart);
            vapiInstance.off("speech-end", handleSpeechEnd);
            vapiInstance.off("call-start", handleCallStart);
            vapiInstance.off("call-end", handleCallEnd);
        };
    }, []);

    const startSession = async () => {
        if (!userId) {
            setLimitError("You must be signed in to use this feature.");
            return;
        }

        setLimitError(null);
        setStatus('connecting');

        try {
            const result = await startNewSession(userId, book._id);
            if (!result.success) {
                sessionIdRef.current = result.sessionId || null;
            }

            const firstMessage = `Hello, good to meet you! Quick question before we start: have you read "${book.title}" yet? Or are we starting fresh ?`;

            await getVapi()?.start(ASSISTANT_ID, {
                firstMessage,
                variableValues: {
                    title: book.title,
                    author: book.author,
                    bookId: book._id,
                },
                // voice: {
                //     provider: "11labs",
                //     voiceId: getVoice(voice).id,
                //     model: 'eleven_turbo_v2_5' as const,
                //     stability: VOICE_SETTINGS.stability,
                //     similarityBoost: VOICE_SETTINGS.similarityBoost,
                //     style: VOICE_SETTINGS.style,
                //     useSpeakerBoost: VOICE_SETTINGS.useSpeakerBoost,
                // },
            })

        } catch (error) {
            console.error("Error starting session:", error);
            setStatus('idle');
            setLimitError("An error occurred while starting the session. Please try again.");
        }
    }
    const stopSession = async () => {
        isStoppingRef.current = true;
        await getVapi()?.stop();
    }
    const clearError = async () => {};

    return {
        status,
        isActive,
        messages,
        currentMessage,
        currentUserMessage,
        duration, 
        startSession,
        stopSession,
        clearError,
    }

}

export default useVapi;