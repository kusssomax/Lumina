'use server'

import { IStartSessionResult, IEndSessionResult } from "@/types";
import { connectToMongoDB } from "@/database/mongoose";
import VoiceSession from "@/database/models/voice-session.model";
import { getCurrentBillingPeriodStart, PLAN_LIMITS, PlanKey } from "../subscriptionConstants";
import { auth } from "@clerk/nextjs/server";


export const startNewSession = async (clerkId: string, bookId: string): Promise<IStartSessionResult> => {

    try {
        await connectToMongoDB();

        const { has } = await auth();
        const plan: PlanKey = has({ plan: "pro" }) ? "pro" : has({ plan: "lite" }) ? "lite" : "free_user";
        const limits = PLAN_LIMITS[plan];

        if (limits.sessionsPerMonth !== Infinity) {
            const periodStart = getCurrentBillingPeriodStart();
            const sessionCount = await VoiceSession.countDocuments({
                clerkId,
                billingPeriodStart: periodStart,
            });
            if (sessionCount >= limits.sessionsPerMonth) {
                return {
                    success: false,
                    error: `You've used all ${limits.sessionsPerMonth} sessions for this month. Upgrade your plan for more.`,
                };
            }
        }

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
            maxDurationMinutes: limits.maxSessionMinutes,
        }

    } catch (error) {
        console.error("Error starting session:", error);
        return {
            success: false,
            error: "Failed to start a voice session. Please try again."
        }
    }
}

export const endVoiceSession = async (sessionId: string, durationSeconds: number, clerkId: string): Promise<IEndSessionResult> => {
    try {
        await connectToMongoDB();

        const session = await VoiceSession.findOneAndUpdate(
            { _id: sessionId, clerkId },
            { endedAt: new Date(), durationSeconds },
        );

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
