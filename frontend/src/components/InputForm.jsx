import { useState } from "react"

const DEMO = {
  main_url: "https://www.amazon.com/dp/B07FNH2P9F",
  competitor_urls: ["https://www.amazon.com/dp/B00E4V9RJM", "https://www.amazon.com/dp/B01N5G7INW"],
  shopper_query: "best magnesium supplement for seniors with sleep issues",
}

export default function InputForm({ onSubmit, loading }) {
  const [mainUrl, setMainUrl] = useState("")
  const [compUrls, setCompUrls] = useState(["", ""])
  const [query, setQuery] = useState("")
  const [manualText, setManualText] = useState("")
  const [showManual, setShowManual] = useState(false)

  const loadDemo = () => {
    setMainUrl(DEMO.main_url)
    setCompUrls(DEMO.competitor_urls)
    setQuery(DEMO.shopper_query)
  }

  const handleSubmit = () => {
    onSubmit({
      main_url: mainUrl,
      competitor_urls: compUrls.filter(u => u.trim()),
      shopper_query: query,
      main_text: manualText || undefined,
    })
  }

  const canSubmit = !loading && (mainUrl.trim() || manualText.trim()) && query.trim().length >= 5

  return (
    <div className="card" style={{ marginBottom: 32 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h2 style={{ fontFamily: "Syne", fontSize: 18, margin: 0 }}>Run a Rufus Simulation</h2>
        <button
          onClick={loadDemo}
          style={{ background: "transparent", border: "1px solid var(--border)", color: "var(--muted)", padding: "6px 14px", borderRadius: 6, cursor: "pointer", fontSize: 13 }}
        >
          Load Demo
        </button>
      </div>

      <label style={{ display: "block", fontSize: 13, color: "var(--muted)", marginBottom: 6 }}>Your Amazon Product URL</label>
      <input
        value={mainUrl}
        onChange={e => setMainUrl(e.target.value)}
        placeholder="https://www.amazon.com/dp/..."
        style={{ marginBottom: 16 }}
      />

      <label style={{ display: "block", fontSize: 13, color: "var(--muted)", marginBottom: 6 }}>Competitor URLs (up to 4, optional)</label>
      {compUrls.map((url, i) => (
        <input
          key={i}
          value={url}
          onChange={e => { const u = [...compUrls]; u[i] = e.target.value; setCompUrls(u) }}
          placeholder={`Competitor ${i + 1} — https://www.amazon.com/dp/...`}
          style={{ marginBottom: 8 }}
        />
      ))}
      {compUrls.length < 4 && (
        <button
          onClick={() => setCompUrls([...compUrls, ""])}
          style={{ background: "transparent", border: "1px dashed var(--border)", color: "var(--muted)", padding: "8px 14px", borderRadius: 6, cursor: "pointer", fontSize: 13, width: "100%", marginBottom: 16 }}
        >
          + Add competitor
        </button>
      )}

      <label style={{ display: "block", fontSize: 13, color: "var(--muted)", marginBottom: 6 }}>Shopper Query</label>
      <input
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="e.g. best magnesium supplement for seniors with sleep issues"
        style={{ marginBottom: 8 }}
      />
      <p style={{ fontSize: 12, color: "var(--muted)", marginBottom: 20 }}>
        Type a real question a shopper would ask Rufus about your product category.
      </p>

      <button
        onClick={() => setShowManual(!showManual)}
        style={{ background: "transparent", border: "none", color: "var(--muted)", fontSize: 12, cursor: "pointer", marginBottom: showManual ? 8 : 0, textDecoration: "underline" }}
      >
        {showManual ? "Hide" : "Scraping blocked? Paste your listing text manually"}
      </button>
      {showManual && (
        <textarea
          value={manualText}
          onChange={e => setManualText(e.target.value)}
          rows={6}
          placeholder="Paste your full listing text here: title, bullet points, description..."
          style={{ resize: "vertical", fontFamily: "IBM Plex Mono", marginBottom: 16 }}
        />
      )}

      <button className="btn-primary" onClick={handleSubmit} disabled={!canSubmit} style={{ width: "100%", marginTop: 8 }}>
        {loading ? "Analyzing..." : "Run Rufus Simulation"}
      </button>
    </div>
  )
}
