import {
  Show,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";

export default async function ClerkNavAuth() {
  const user = await currentUser();

  return (
    <div className="flex items-center gap-2 shrink-0">
      <Show when="signed-out">
        <SignInButton mode="modal" />
        <SignUpButton mode="modal" />
      </Show>
      <Show when="signed-in">
        <div className='flex items-center gap-2 hover:opacity-70 transition-opacity'>
        <UserButton />
        {
            <Link href="/subscriptions" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              {user?.firstName && "Subscription"}
            </Link>
        }
        </div>
      </Show>
    </div>
  );
}
