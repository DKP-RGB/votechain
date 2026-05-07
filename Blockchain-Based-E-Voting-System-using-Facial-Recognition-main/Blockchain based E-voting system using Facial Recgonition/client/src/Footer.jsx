import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer style={{
      background: "#080E1C", borderTop: "1px solid rgba(255,255,255,0.06)",
      padding: "48px 24px 24px"
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 40, marginBottom: 40 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <span style={{ fontSize: 22 }}>🗳️</span>
              <span style={{ fontFamily: "'Rajdhani',sans-serif", fontWeight: 700, fontSize: 18, color: "#F9FAFB" }}>
                VOTE<span style={{ color: "#6366F1" }}>CHAIN</span>
              </span>
            </div>
            <p style={{ color: "#6B7280", fontSize: 13, lineHeight: 1.8 }}>
              Blockchain-powered secure e-voting with facial recognition. Transparent, tamper-proof democracy.
            </p>
          </div>
          <div>
            <h4 style={{ color: "#9CA3AF", fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>Navigation</h4>
            {[["Home","/"],["Elections","/election"],["Results","/result"],["Register","/register"]].map(([t,l]) => (
              <Link key={l} to={l} style={{ display: "block", color: "#6B7280", fontSize: 14, marginBottom: 8, textDecoration: "none", transition: "color 0.2s" }}
                onMouseEnter={e => e.target.style.color="#6366F1"}
                onMouseLeave={e => e.target.style.color="#6B7280"}
              >{t}</Link>
            ))}
          </div>
          <div>
            <h4 style={{ color: "#9CA3AF", fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>Technology</h4>
            {["SHA-256 Blockchain","Face-API.js Recognition","LocalStorage Security","Zero Backend Architecture"].map(t => (
              <p key={t} style={{ color: "#6B7280", fontSize: 13, marginBottom: 6 }}>✓ {t}</p>
            ))}
          </div>
          <div>
            <h4 style={{ color: "#9CA3AF", fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>Security</h4>
            <div style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: 10, padding: "14px 16px" }}>
              <p style={{ color: "#34D399", fontSize: 13, fontWeight: 600, marginBottom: 4 }}>🔒 Fully Secure</p>
              <p style={{ color: "#6B7280", fontSize: 12 }}>All votes are cryptographically hashed and stored on an immutable frontend blockchain.</p>
            </div>
          </div>
        </div>
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 20, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <p style={{ color: "#4B5563", fontSize: 13 }}>© 2024 VoteChain. Blockchain-Based E-Voting System.</p>
          <p style={{ color: "#4B5563", fontSize: 13 }}>🇮🇳 Made for India's Digital Democracy</p>
        </div>
      </div>
    </footer>
  );
}
