type LoadingOverlayProps = {
  visible: boolean
}

export function LoadingOverlay({ visible }: LoadingOverlayProps) {
  if (!visible) return null
  return (
    <div
      className="pointer-events-auto fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(12,11,10,0.88)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)" }}
      aria-busy="true"
      aria-live="polite"
    >
      <div className="flex flex-col items-center gap-4">
        {/* Spinner */}
        <div
          className="animate-spin"
          style={{
            width: "44px",
            height: "44px",
            borderRadius: "50%",
            border: "2px solid var(--surface-3)",
            borderTopColor: "var(--primary)",
          }}
          aria-hidden
        />
        <p
          className="font-serif font-normal text-foreground"
          style={{ fontSize: "26px" }}
        >
          Synthesizing your book
        </p>
        <p style={{ fontSize: "13px", color: "var(--text-2)" }}>
          This may take a moment…
        </p>
      </div>
    </div>
  )
}
