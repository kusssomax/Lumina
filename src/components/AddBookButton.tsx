"use client";
import Link from "next/link";
import { Plus } from "lucide-react";
import { useState } from "react";

export default function AddBookButton() {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      href="/books/new"
      className="flex items-center gap-[7px] transition-colors duration-200"
      style={{
        background: "var(--surface-2)",
        border: `1px solid ${hovered ? "var(--border-warm)" : "var(--border)"}`,
        color: hovered ? "var(--text-1)" : "var(--text-2)",
        fontSize: "13px",
        padding: "7px 14px",
        borderRadius: "8px",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Plus size={13} />
      Add Book
    </Link>
  );
}
