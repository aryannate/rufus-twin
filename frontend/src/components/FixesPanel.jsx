import { useState } from "react"

export default function FixesPanel({ fixes }) {
  const [copied, setCopied] = useState(false)

  const copyAll = () => {
    const text = fixes
      .map(f => `[${f.element}]\nCurrent: ${f.current_text}\nWhy: ${f.reason}\nNew copy:\n${f.suggested_copy}`)
      .join("\n\n---\n\n")
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!fixes || fixes.length === 0) {
    return (
      <div className="card" style={{ marginBottom: 24, animation: "fadeUp 0.5s 0.3s ease both" }}>
        <h2 style={{ fontFamily: "Syne", fontSize: 18, marginBottom: 12 }}>Listing Fixes for Rufus</h2>
        <p style={{ color: "var(--muted)", fontSize: 14 }}>No fixes generated.</p>
      </div>
    )
  }

  return (
    <div className="card" style={{ marginBottom: 24, animation: "fadeUp 0.5s 0.3s ease both" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h2 style={{ fontFamily: "Syne", fontSize: 18, margin: 0 }}>Listing Fixes for Rufus</h2>
        <button
          onClick={copyAll}
          style={{ background: "transparent", border: "1px solid var(--border)", color: copied ? "var(--green)" : "var(--muted)", padding: "6px 14px", borderRadius: 6, cursor: "pointer", fontSize: 13 }}
        >
          {copied ? "Copied!" : "Copy All"}
        </button>
      </div>

      {fixes.map((fix, i) => (
        <div key={i} className="fix-card">
          <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
            <span style={{ fontFamily: "IBM Plex Mono", fontSize: 11, color: "var(--accent)", background: "rgba(245,158,11,0.1)", padding: "2px 8px", borderRadius: 4 }}>
              {fix.element}
            </span>
          </div>
          <p style={{ fontSize: 12, color: "var(--muted)", marginBottom: 4 }}>
            Current: <span style={{ fontFamily: "IBM Plex Mono" }}>{fix.current_text}</span>
          </p>
          <p style={{ fontSize: 13, color: "var(--text)", marginBottom: 12 }}>
            <strong>Why:</strong> {fix.reason}
          </p>
          <div style={{ background: "#0D1F0D", border: "1px solid #1A3A1A", borderRadius: 8, padding: "12px 16px" }}>
            <p style={{ fontSize: 11, color: "#4ADE80", fontFamily: "IBM Plex Mono", marginBottom: 6, letterSpacing: 1 }}>
              SUGGESTED COPY
            </p>
            <p style={{ fontFamily: "IBM Plex Mono", fontSize: 13, color: "#86EFAC", margin: 0, lineHeight: 1.6 }}>
              {fix.suggested_copy}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
