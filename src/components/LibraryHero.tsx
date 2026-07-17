export default function LibraryHero() {
  return (
    <section className="relative overflow-hidden" style={{ padding: "72px 64px 56px", maxWidth: "1400px", margin: "0 auto" }}>
      {/* Ambient glow */}
      <div
        className="pointer-events-none absolute"
        style={{
          top: "-80px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "900px",
          height: "480px",
          background: "radial-gradient(ellipse at 50% 30%, rgba(200,149,108,0.09) 0%, transparent 68%)",
        }}
        aria-hidden
      />

      <div className="relative z-10">
        {/* Eyebrow */}
        <p
          className="text-primary font-medium uppercase mb-[18px]"
          style={{ fontSize: "12px", letterSpacing: "0.1em" }}
        >
          Your Library
        </p>

        {/* Title */}
        <h1
          className="font-serif font-normal text-foreground mb-[22px]"
          style={{ fontSize: "clamp(52px, 6.5vw, 88px)", lineHeight: 1.08 }}
        >
          Your library <em className="italic text-primary">awaits.</em>
        </h1>

        {/* Subtitle */}
        <p
          className="text-muted-foreground mb-[28px]"
          style={{ fontSize: "16px", lineHeight: 1.65, maxWidth: "460px", color: "var(--text-2)" }}
        >
          Open any book and begin a real-time voice conversation with its contents.
        </p>
      </div>
    </section>
  );
}
