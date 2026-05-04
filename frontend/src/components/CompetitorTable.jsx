export default function CompetitorTable({ main, competitors }) {
  const dims = Object.keys(main.dimensions)
  const allProducts = [{ title: "Your Product", ...main }, ...competitors]

  return (
    <div className="card" style={{ marginBottom: 24, overflowX: "auto", animation: "fadeUp 0.5s 0.2s ease both" }}>
      <h2 style={{ fontFamily: "Syne", fontSize: 18, marginBottom: 20 }}>Competitor Comparison</h2>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
        <thead>
          <tr>
            <th style={{ textAlign: "left", padding: "8px 12px", color: "var(--muted)", fontWeight: 500, borderBottom: "1px solid var(--border)" }}>
              Dimension
            </th>
            {allProducts.map((p, i) => (
              <th
                key={i}
                style={{ textAlign: "center", padding: "8px 12px", color: i === 0 ? "var(--accent)" : "var(--muted)", fontWeight: 500, borderBottom: "1px solid var(--border)", fontSize: 12 }}
              >
                {(p.title || "Product").slice(0, 30)}...
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {dims.map(dk => (
            <tr key={dk} style={{ borderBottom: "1px solid var(--border)" }}>
              <td style={{ padding: "10px 12px", color: "var(--text)", fontFamily: "IBM Plex Mono", fontSize: 12 }}>
                {main.dimensions[dk].label}
              </td>
              {allProducts.map((p, i) => {
                const dim = p.dimensions?.[dk]
                return (
                  <td key={i} style={{ textAlign: "center", padding: "10px 12px" }}>
                    <span style={{ fontFamily: "IBM Plex Mono", color: dim ? `var(--${dim.status})` : "var(--muted)", fontWeight: 600 }}>
                      {dim ? `${dim.score}/20` : "N/A"}
                    </span>
                  </td>
                )
              })}
            </tr>
          ))}
          <tr>
            <td style={{ padding: "10px 12px", fontWeight: 600 }}>Total</td>
            {allProducts.map((p, i) => (
              <td key={i} style={{ textAlign: "center", padding: "10px 12px", fontFamily: "IBM Plex Mono", fontWeight: 700, color: i === 0 ? "var(--accent)" : "var(--text)", fontSize: 15 }}>
                {p.total ?? "N/A"}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  )
}
