
export const PLAN_LIMITS = {
    free_user: { books: 1,   sessionsPerMonth: 5,        maxSessionMinutes: 5,  sessionHistory: false },
    lite:      { books: 25,  sessionsPerMonth: 250,       maxSessionMinutes: 20, sessionHistory: true  },
    pro:       { books: 100, sessionsPerMonth: Infinity,  maxSessionMinutes: 60, sessionHistory: true  },
} as const;

export type PlanKey = keyof typeof PLAN_LIMITS;

export const getCurrentBillingPeriodStart = () => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
}