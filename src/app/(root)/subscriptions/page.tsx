import { PricingTable } from "@clerk/nextjs";
import { getUserPlan } from "@/lib/planUtils";
import { PLAN_LIMITS } from "@/lib/subscriptionConstants";

export default async function SubscriptionsPage() {
    const plan = await getUserPlan();
    const limits = PLAN_LIMITS[plan];
    const planLabel = plan === "free_user" ? "Free" : plan.charAt(0).toUpperCase() + plan.slice(1);

    return (
        <div className="flex flex-col items-center w-full" style={{ padding: "52px 24px 90px" }}>
            <div className="w-full" style={{ maxWidth: "900px" }}>
                {/* Page header */}
                <div className="text-center mb-12">
                    <h1
                        className="font-serif font-normal text-foreground mb-[10px]"
                        style={{ fontSize: "52px" }}
                    >
                        Choose your plan
                    </h1>
                    <p style={{ fontSize: "15px", color: "var(--text-2)" }}>
                        Unlock more books, sessions, and listening time.
                    </p>
                </div>

                {/* Current plan bar */}
                <div
                    className="flex items-center justify-between mb-10 rounded-xl px-6 py-5"
                    style={{
                        border: "1px solid var(--border-warm)",
                        background: "rgba(200,149,108,0.05)",
                    }}
                >
                    <div>
                        <p style={{ fontSize: "11px", color: "var(--text-3)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "4px" }}>
                            Current plan
                        </p>
                        <p
                            className="font-serif font-normal"
                            style={{ fontSize: "30px", color: "var(--primary)" }}
                        >
                            {planLabel}
                        </p>
                    </div>
                    <div className="text-right">
                        <p style={{ fontSize: "13px", color: "var(--text-2)" }}>
                            {limits.books} book{limits.books === 1 ? "" : "s"} ·{" "}
                            {limits.sessionsPerMonth === Infinity ? "unlimited" : limits.sessionsPerMonth} sessions/month ·{" "}
                            {limits.maxSessionMinutes} min/session
                        </p>
                        <p style={{ fontSize: "12px", color: "var(--text-3)", marginTop: "4px" }}>
                            Upgrade below to unlock more
                        </p>
                    </div>
                </div>

                <PricingTable />
            </div>
        </div>
    );
}
