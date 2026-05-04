import { useState } from "react"
import InputForm from "./components/InputForm"
import SimulationPanel from "./components/SimulationPanel"
import ScoreCard from "./components/ScoreCard"
import CompetitorTable from "./components/CompetitorTable"
import FixesPanel from "./components/FixesPanel"
import LoadingState from "./components/LoadingState"

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000"

export default function App() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [result, setResult] = useState(null)

  const handleAnalyze = async (formData) => {
    setLoading(true)
    setError("")
    setResult(null)
    try {
      const res = await fetch(`${API_BASE}/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || "Analysis failed")
      setResult(data)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <header style={{ padding: "40px 0 32px", borderBottom: "1px solid var(--border)", marginBottom: 32 }}>
        <p style={{ fontFamily: "IBM Plex Mono", color: "var(--accent)", fontSize: 12, letterSpacing: 2, marginBottom: 8 }}>RUFUS TWIN</p>
        <h1 style={{ fontFamily: "Syne", fontSize: 36, fontWeight: 800, margin: "0 0 8px" }}>See Yourself Through Rufus's Eyes</h1>
        <p style={{ color: "var(--muted)", fontSize: 15 }}>Simulate how Amazon's AI shopping assistant responds to shoppers asking about your product — and exactly what to fix.</p>
      </header>

      <InputForm onSubmit={handleAnalyze} loading={loading} />

      {error && (
        <div style={{ background: "#1A0A0A", border: "1px solid var(--red)", borderRadius: 8, padding: "16px 20px", color: "var(--red)", marginTop: 24, fontSize: 14 }}>
          {error}
        </div>
      )}

      {loading && <LoadingState />}

      {result && !loading && (
        <div>
          {result.scrape_warning && (
            <div style={{ background: "#1A1400", border: "1px solid var(--amber)", borderRadius: 8, padding: "12px 16px", color: "var(--amber)", marginBottom: 24, fontSize: 13 }}>
              Warning: {result.scrape_warning}
            </div>
          )}
          <SimulationPanel data={result.simulation} />
          <ScoreCard score={result.score} />
          {result.competitor_scores?.length > 0 && (
            <CompetitorTable main={result.score} competitors={result.competitor_scores} />
          )}
          <FixesPanel fixes={result.fixes} />
        </div>
      )}

      <footer style={{ borderTop: "1px solid var(--border)", marginTop: 64, padding: "24px 0", color: "var(--muted)", fontSize: 12, fontFamily: "IBM Plex Mono" }}>
        Built by Aryan Natekar — Autonova AI LLP — Not affiliated with Amazon.
      </footer>
    </div>
  )
}
