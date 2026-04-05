"use client";
import type { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  {
    label: "Library",
    href: "/",
  },
  {
    label: "Add new",
    href: "/books/new",
  },
]

const NavBar = ({ children }: { children?: ReactNode }) => {
  const pathname = usePathname();

  return (
    <header className="w-full fixed bg-background">
      <div className="max-w-7xl px-5 py-4 mx-auto w-full h-[74px] flex justify-between items-center gap-4">
        <Link href="/" className="flex items-center gap-2 p-3">
          {/* <Image src="/assets/LuminaLogo.png" alt="Lumina" width={100} height={100} /> */}
          <h1 className="text-2xl text-primary font-semibold">Lumina</h1>
        </Link>

        <div className="flex items-center gap-6 min-w-0">
          <nav className="w-fit flex items-center gap-7">
            {
              navItems.map((item) => {
                const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));

                return (
                  <Link key={item.href} href={item.href} className={cn("text-base font-medium leading-6 transition-all", isActive ? "text-foreground border-b-2 border-foreground" : "text-foreground hover:text-primary")}>
                    {item.label}
                  </Link>
                )
              })
            }
          </nav>
          {children}
        </div>
      </div>
    </header>
  )
}

export default NavBar