export default function ScoreCard({ score }) {
  const dims = Object.values(score.dimensions)
  const band =
    score.total >= 80 ? ["Rufus-Ready", "green"] :
    score.total >= 60 ? ["Competitive", "amber"] :
    score.total >= 40 ? ["Vulnerable", "amber"] :
                        ["Invisible", "red"]

  return (
    <div className="card" style={{ marginBottom: 24, animation: "fadeUp 0.5s 0.1s ease both" }}>
      <h2 style={{ fontFamily: "Syne", fontSize: 18, marginBottom: 24 }}>Rufus Readiness Score</h2>

      <div style={{ display: "flex", alignItems: "flex-end", gap: 16, marginBottom: 32 }}>
        <span className="score-total">{score.total}</span>
        <div>
          <span
            className={`tag-${band[1]}`}
            style={{ fontSize: 13, fontWeight: 600, marginBottom: 4, display: "inline-block" }}
          >
            {band[0]}
          </span>
          <p style={{ color: "var(--muted)", fontSize: 12, margin: 0 }}>out of 100</p>
        </div>
      </div>

      {dims.map(d => (
        <div key={d.label} style={{ marginBottom: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontSize: 14, fontWeight: 500 }}>{d.label}</span>
            <span style={{ fontFamily: "IBM Plex Mono", fontSize: 13, color: `var(--${d.status})` }}>
              {d.score}/20
            </span>
          </div>
          <div style={{ background: "var(--border)", borderRadius: 4, height: 6, marginBottom: 6 }}>
            <div
              className="score-bar"
              style={{
                width: `${(d.score / 20) * 100}%`,
                height: "100%",
                background: `var(--${d.status})`,
                borderRadius: 4,
              }}
            />
          </div>
          <p style={{ fontSize: 12, color: "var(--muted)", margin: 0 }}>{d.explanation}</p>
        </div>
      ))}
    </div>
  )
}
