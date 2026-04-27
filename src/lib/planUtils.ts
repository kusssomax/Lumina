import { auth } from "@clerk/nextjs/server";
import { PLAN_LIMITS, PlanKey } from "./subscriptionConstants";

export async function getUserPlan(): Promise<PlanKey> {
    const { has } = await auth();
    if (has({ plan: "pro" }))   return "pro";
    if (has({ plan: "lite" }))  return "lite";
    return "free_user";
}

export async function getPlanLimits() {
    return PLAN_LIMITS[await getUserPlan()];
}
