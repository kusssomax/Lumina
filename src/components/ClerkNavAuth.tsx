import {
  Show,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import Link from "next/link";

export default async function ClerkNavAuth() {
  return (
    <div className="flex items-center gap-3 shrink-0">
      <Show when="signed-out">
        <SignInButton mode="modal">
          <button
            className="transition-all duration-200"
            style={{
              background: "none",
              border: "1px solid var(--border-warm)",
              color: "var(--text-2)",
              fontSize: "13px",
              padding: "6px 14px",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            Sign In
          </button>
        </SignInButton>
        <SignUpButton mode="modal">
          <button
            className="transition-opacity hover:opacity-85"
            style={{
              background: "var(--primary)",
              border: "none",
              color: "var(--primary-foreground)",
              fontSize: "13px",
              fontWeight: 500,
              padding: "6px 14px",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            Sign Up
          </button>
        </SignUpButton>
      </Show>
      <Show when="signed-in">
        <Link
          href="/subscriptions"
          className="transition-colors duration-200"
          style={{ fontSize: "14px", color: "var(--text-2)" }}
        >
          Subscription
        </Link>
        <UserButton />
      </Show>
    </div>
  );
}
