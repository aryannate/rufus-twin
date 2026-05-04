import { useState, useEffect } from "react"

const STORAGE_KEY = "rufus_twin_api_keys"

export default function ApiKeysForm({ onKeysChange }) {
  const [keys, setKeys] = useState({ scraperapi_key: "", openai_api_key: "", anthropic_api_key: "" })
  const [save, setSave] = useState(false)
  const [show, setShow] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        setKeys(parsed)
        setSave(true)
        onKeysChange(parsed)
      }
    } catch {}
  }, [])

  const update = (field, value) => {
    const next = { ...keys, [field]: value }
    setKeys(next)
    onKeysChange(next)
    if (save) localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  }

  const toggleSave = (checked) => {
    setSave(checked)
    if (checked) localStorage.setItem(STORAGE_KEY, JSON.stringify(keys))
    else localStorage.removeItem(STORAGE_KEY)
  }

  const allFilled = keys.scraperapi_key && keys.openai_api_key && keys.anthropic_api_key

  return (
    <div className="card" style={{ marginBottom: 24, borderColor: allFilled ? "var(--green)" : "var(--border)" }}>
      <button
        onClick={() => setShow(s => !s)}
        style={{ background: "none", border: "none", cursor: "pointer", width: "100%", textAlign: "left", padding: 0 }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <p style={{ fontFamily: "IBM Plex Mono", color: "var(--accent)", fontSize: 11, letterSpacing: 2, marginBottom: 4 }}>STEP 1</p>
            <h2 style={{ fontFamily: "Syne", fontSize: 18, margin: 0 }}>Your API Keys</h2>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {allFilled && (
              <span style={{ fontFamily: "IBM Plex Mono", fontSize: 11, color: "var(--green)", background: "rgba(34,197,94,0.1)", padding: "3px 8px", borderRadius: 4 }}>
                READY
              </span>
            )}
            <span style={{ color: "var(--muted)", fontSize: 18 }}>{show ? "▲" : "▼"}</span>
          </div>
        </div>
      </button>

      {show && (
        <div style={{ marginTop: 20 }}>
          <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 16 }}>
            Keys used only for your request. Never stored on the server.
          </p>

          {[
            { field: "scraperapi_key", label: "ScraperAPI Key", placeholder: "Get free key at scraperapi.com" },
            { field: "openai_api_key", label: "OpenAI API Key", placeholder: "sk-..." },
            { field: "anthropic_api_key", label: "Anthropic API Key", placeholder: "sk-ant-..." },
          ].map(({ field, label, placeholder }) => (
            <div key={field} style={{ marginBottom: 14 }}>
              <label style={{ display: "block", fontSize: 13, color: "var(--muted)", marginBottom: 6 }}>{label}</label>
              <input
                type="password"
                value={keys[field]}
                onChange={e => update(field, e.target.value)}
                placeholder={placeholder}
                style={{ fontFamily: "IBM Plex Mono" }}
              />
            </div>
          ))}

          <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--muted)", cursor: "pointer", marginTop: 8 }}>
            <input
              type="checkbox"
              checked={save}
              onChange={e => toggleSave(e.target.checked)}
              style={{ width: "auto", accentColor: "var(--accent)" }}
            />
            Save keys in this browser (localStorage)
          </label>
        </div>
      )}
    </div>
  )
}
