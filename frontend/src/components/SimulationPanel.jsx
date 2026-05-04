export default function SimulationPanel({ data }) {
  const lines = data.text.split("\n").filter(l => !l.trim().startsWith("RECOMMENDED:"))

  return (
    <div className="card" style={{ marginBottom: 24, animation: "fadeUp 0.5s ease forwards" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
        <h2 style={{ fontFamily: "Syne", fontSize: 18, margin: 0 }}>Rufus Response Simulation</h2>
        {data.recommended_product && (
          <span style={{
            background: "rgba(245,158,11,0.1)",
            border: "1px solid var(--accent)",
            color: "var(--accent)",
            fontSize: 12,
            padding: "4px 10px",
            borderRadius: 20,
            fontFamily: "IBM Plex Mono",
          }}>
            Recommends: {data.recommended_product.slice(0, 40)}{data.recommended_product.length > 40 ? "..." : ""}
          </span>
        )}
      </div>
      <div className="rufus-bubble">
        {lines.map((l, i) => <p key={i} style={{ margin: "0 0 8px" }}>{l}</p>)}
      </div>
      <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 12, fontFamily: "IBM Plex Mono" }}>
        Simulated using RAG over scraped listing data. Not a real Rufus output.
      </p>
    </div>
  )
}
