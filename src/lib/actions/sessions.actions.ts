'use server'

import { IStartSessionResult, IEndSessionResult } from "@/types";
import { connectToMongoDB } from "@/database/mongoose";
import VoiceSession from "@/database/models/voice-session.model";
import { getCurrentBillingPeriodStart } from "../subscriptionConstants";


export const startNewSession = async (clerkId: string, bookId: string): Promise<IStartSessionResult> => {

    try {
        await connectToMongoDB();

        //Limits and plan

        const session = await VoiceSession.create({
            clerkId,
            bookId,
            startedAt: new Date(),
            billingPeriodStart: getCurrentBillingPeriodStart(),
            durationSeconds: 0,
        })

        return {
            success: true,
            sessionId: session._id.toString(),
            // maxDurationMinutes: calculateMaxDurationForPlan,
        }

    } catch (error) {
        console.error("Error starting session:", error);
        return {
            success: false,
            error: "Failed to start a voice session. Please try again."
        }
    }
}

export const endVoiceSession = async (sessionId: string, durationSeconds: number): Promise<IEndSessionResult> => {
    try {
        await connectToMongoDB();

        const session = await VoiceSession.findByIdAndUpdate(sessionId, {
            endedAt: new Date(),
            durationSeconds,
        });

        if (!session) {
            console.error("Session not found:", sessionId);
            return { success: false, error: "Session not found." };
        }

        return { success: true };
    } catch (error) {
        console.error("Error ending session:", error);
        return { success: false };
    }
}
