import { Loader2 } from "lucide-react"

type LoadingOverlayProps = {
  visible: boolean
}

export function LoadingOverlay({ visible }: LoadingOverlayProps) {
  if (!visible) return null
  return (
    <div
      className="pointer-events-auto fixed inset-0 z-50 flex items-center justify-center bg-background/70 backdrop-blur-sm"
      aria-busy="true"
      aria-live="polite"
    >
      <div className="flex flex-col items-center gap-3 rounded-lg border border-border bg-card px-8 py-6 shadow-lg">
        <Loader2
          className="size-10 animate-spin text-primary"
          aria-hidden
        />
        <p className="font-medium text-foreground">Synthesizing…</p>
      </div>
    </div>
  )
}
