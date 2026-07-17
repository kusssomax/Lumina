"use client";
import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Library", href: "/" },
  { label: "Add Book", href: "/books/new" },
];

const NavBar = ({ children }: { children?: ReactNode }) => {
  const pathname = usePathname();

  return (
    <header
      className="w-full fixed top-0 left-0 right-0 h-[64px] z-50 flex items-center px-9"
      style={{
        borderBottom: "1px solid var(--border)",
        background: "rgba(12,11,10,0.82)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
      }}
    >
      {/* Logo */}
      <Link href="/" className="flex items-center gap-[9px] select-none">
        <span className="text-[17px] leading-none text-primary">◈</span>
        <span className="font-serif text-[22px] font-medium tracking-[0.03em] text-foreground">
          Lumina
        </span>
      </Link>

      {/* Nav links */}
      <nav className="flex gap-[2px] mx-auto">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-[14px] font-normal tracking-[0.01em] px-4 py-[7px] rounded-[8px] transition-colors duration-200",
                isActive
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/5"
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Auth */}
      <div className="flex items-center gap-3">{children}</div>
    </header>
  );
};

export default NavBar;
