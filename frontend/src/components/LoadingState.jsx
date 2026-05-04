import { useEffect, useState } from "react"

const STEPS = [
  "Scraping Amazon listings...",
  "Chunking and embedding product content...",
  "Querying vector store...",
  "Simulating Rufus response...",
  "Scoring your listing...",
  "Generating listing fixes...",
]

export default function LoadingState() {
  const [step, setStep] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => setStep(s => Math.min(s + 1, STEPS.length - 1)), 2500)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="card" style={{ textAlign: "center", padding: "48px 24px", marginTop: 32 }}>
      <div style={{
        width: 40, height: 40,
        border: "3px solid var(--border)",
        borderTop: "3px solid var(--accent)",
        borderRadius: "50%",
        margin: "0 auto 24px",
        animation: "spin 0.8s linear infinite",
      }} />
      <p style={{ fontFamily: "IBM Plex Mono", color: "var(--accent)", fontSize: 13 }}>{STEPS[step]}</p>
      <p style={{ color: "var(--muted)", fontSize: 12, marginTop: 8 }}>This takes 15–30 seconds. Rufus has high standards.</p>
    </div>
  )
}
