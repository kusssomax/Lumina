import { PricingTable } from "@clerk/nextjs";
import { getUserPlan } from "@/lib/planUtils";
import { PLAN_LIMITS } from "@/lib/subscriptionConstants";

export default async function SubscriptionsPage() {
    const plan = await getUserPlan();
    const limits = PLAN_LIMITS[plan];
    const planLabel = plan === "free_user" ? "Free" : plan.charAt(0).toUpperCase() + plan.slice(1);

    return (
        <div className="max-w-7xl h-full mx-auto px-5 py-12">
            <h1 className="font-serif text-3xl font-semibold mb-2">Choose your plan</h1>
            <p className="text-[var(--muted-foreground)] mb-8">
                Current plan: <strong>{planLabel}</strong> —{" "}
                {limits.books} book{limits.books === 1 ? "" : "s"},{" "}
                {limits.sessionsPerMonth === Infinity ? "unlimited" : limits.sessionsPerMonth} sessions/month,{" "}
                {limits.maxSessionMinutes} min/session
            </p>
            <PricingTable />
        </div>
    );
}
