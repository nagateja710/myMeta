// components/media/BackgroundStyles.jsx

export const BACKGROUND_STYLES = {
  anime: {
    bgClass: "bg-gradient-to-br from-amber-950 via-yellow-950 to-zinc-950",
    pattern: (
      <>
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "repeating-conic-gradient(from 0deg at 50% 50%, transparent 0deg, rgba(251,191,36,0.03) 2deg, transparent 4deg)",
          }}
        />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
      </>
    ),
  },

  movie: {
    bgClass: "bg-gradient-to-br from-purple-950 via-fuchsia-950 to-zinc-950",
    pattern: (
      <>
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(90deg, rgba(168,85,247,0.03) 1px, transparent 1px),
              linear-gradient(rgba(168,85,247,0.03) 1px, transparent 1px)
            `,
            backgroundSize: "80px 80px",
          }}
        />
        <div className="absolute top-1/4 right-0 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-0 w-72 h-72 bg-fuchsia-500/10 rounded-full blur-3xl" />
      </>
    ),
  },

  series: {
    bgClass: "bg-gradient-to-br from-indigo-950 via-violet-950 to-zinc-950",
    pattern: (
      <>
        {/* Horizontal episode stripes */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              repeating-linear-gradient(
                0deg,
                transparent,
                transparent 28px,
                rgba(99,102,241,0.05) 28px,
                rgba(99,102,241,0.05) 29px
              )
            `,
          }}
        />

        {/* Soft timeline glow */}
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl" />
      </>
    ),
  },

  game: {
    bgClass: "bg-gradient-to-br from-slate-950 via-gray-900 to-zinc-950",
    pattern: (
      <>
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(45deg, rgba(148,163,184,0.03) 25%, transparent 25%),
              linear-gradient(-45deg, rgba(148,163,184,0.03) 25%, transparent 25%),
              linear-gradient(45deg, transparent 75%, rgba(148,163,184,0.03) 75%),
              linear-gradient(-45deg, transparent 75%, rgba(148,163,184,0.03) 75%)
            `,
            backgroundSize: "40px 40px",
            backgroundPosition: "0 0, 0 20px, 20px -20px, -20px 0px",
          }}
        />
        <div className="absolute top-0 left-0 w-96 h-96 bg-slate-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gray-500/10 rounded-full blur-3xl" />
      </>
    ),
  },

  book: {
    bgClass: "bg-gradient-to-br from-blue-950 via-cyan-950 to-zinc-950",
    pattern: (
      <>
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 35px, rgba(59,130,246,0.03) 35px, rgba(59,130,246,0.03) 36px)",
          }}
        />
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(59,130,246,0.05) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
        <div className="absolute top-1/3 left-1/3 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl" />
      </>
    ),
  },
};
