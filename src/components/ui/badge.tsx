import * as React from "react";
import { cn } from "@/lib/utils";

function Badge({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="badge"
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-medium text-foreground shadow-sm ring-1 ring-border",
        className
      )}
      {...props}
    />
  );
}

export { Badge };
