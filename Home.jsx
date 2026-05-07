import React from "react";
import { Link } from "react-router-dom";
import bjpLogo from "./bjp_logo.png";
import congressLogo from "./congress_logo.png";

const stats = [
  { label: "Registered Voters", value: "2", suffix: "+ Registered" },
  { label: "Blockchain Secured", value: "SHA-256", suffix: "Encryption" },
  { label: "Parties", value: "2", suffix: "Active Parties" },
  { label: "Transparency", value: "100%", suffix: "Verifiable" },
];

const features = [
  { icon: "🧬", title: "Facial Recognition", desc: "AI-powered face scan verifies your identity before voting. Powered by face-api.js running entirely in your browser." },
  { icon: "⛓️", title: "Blockchain Voting", desc: "Every vote is hashed with SHA-256 and stored on an immutable chain. Tamper-proof and permanently auditable." },
  { icon: "🔐", title: "Zero Backend", desc: "Fully client-side architecture. Your data never leaves your device. Maximum privacy guaranteed." },
  { icon: "📊", title: "Live Results", desc: "Real-time vote counting and verification. Chain integrity validated on every query." },
];

export default function Home() {
  return (
    <div style={{ minHeight: "100vh", background: "#F8FAFC" }}>
      {/* Hero */}
      <div style={{ position: "relative", padding: "140px 24px 80px", display: "flex", alignItems: "center", overflow: "hidden", background: "#FFFFFF", borderBottom: "1px solid #E2E8F0" }}>
        
        {/* Subtle Background Pattern */}
        <div style={{
          position: "absolute", inset: 0, opacity: 0.03,
          backgroundImage: "radial-gradient(#1565C0 1px, transparent 1px)", backgroundSize: "24px 24px"
        }} />
        
        <div style={{ position: "relative", maxWidth: 1200, margin: "0 auto", textAlign: "center", width: "100%" }}>
          <div className="animate-fadeInUp">
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "#E3F2FD", border: "1px solid #BBDEFB",
              borderRadius: 20, padding: "6px 18px", fontSize: 13, color: "#1565C0",
              fontWeight: 700, marginBottom: 32, textTransform: "uppercase", letterSpacing: 0.5
            }}>
              <span style={{ color: "#FF9933" }}>●</span> Official Portal <span style={{ color: "#138808" }}>●</span>
            </span>
            <h1 style={{
              fontFamily: "'Inter',sans-serif", fontWeight: 800,
              fontSize: "clamp(36px,6vw,72px)", lineHeight: 1.15,
              color: "#0F172A", marginBottom: 24, letterSpacing: -1
            }}>
              E-Voting System<br />
              <span style={{ color: "#1565C0" }}>Government of India</span>
            </h1>
            <p style={{ color: "#475569", fontSize: "clamp(16px,2vw,20px)", maxWidth: 700, margin: "0 auto 48px", lineHeight: 1.6, fontWeight: 500 }}>
              Secure, transparent, and accessible digital voting platform empowered by facial recognition and cryptographic blockchain technology.
            </p>
            <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
              <Link to="/election" className="btn" style={{ fontSize: 16, padding: "14px 36px", background: "#1565C0", color: "white", boxShadow: "0 4px 12px rgba(21, 101, 192, 0.2)" }}>
                Cast Your Vote
              </Link>
              <Link to="/register" className="btn" style={{ fontSize: 16, padding: "14px 36px", background: "white", color: "#1565C0", border: "2px solid #1565C0" }}>
                Voter Registration
              </Link>
            </div>
          </div>

          {/* Party logos */}
          <div style={{ display: "flex", justifyContent: "center", gap: 24, marginTop: 72, flexWrap: "wrap" }}>
            {[
              { name: "Bharatiya Janata Party", logo: bjpLogo, color: "#FF6B00", bg: "#FFF4ED" },
              { name: "Indian National Congress", logo: congressLogo, color: "#1565C0", bg: "#F0F7FF" },
            ].map(p => (
              <div key={p.name} style={{
                background: p.bg, border: `1px solid ${p.color}33`,
                borderRadius: 8, padding: "12px 24px", display: "flex", alignItems: "center", gap: 16,
                animation: "fadeInUp 0.8s ease forwards", boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
              }}>
                <img src={p.logo} alt={p.name} style={{ width: 40, height: 40, objectFit: "contain" }} />
                <span style={{ color: p.color, fontWeight: 700, fontSize: 15, fontFamily: "'Inter',sans-serif" }}>{p.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ background: "#FFFFFF", padding: "48px 24px", borderBottom: "1px solid #E2E8F0" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 32 }}>
          {stats.map((s, i) => (
            <div key={i} style={{ textAlign: "center", padding: "20px", background: "#F8FAFC", borderRadius: 8, border: "1px solid #F1F5F9" }}>
              <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 40, fontWeight: 800, color: "#1565C0" }}>{s.value}</div>
              <div style={{ color: "#475569", fontSize: 14, marginTop: 8, fontWeight: 600 }}>{s.suffix}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 24px" }}>
        <h2 style={{ textAlign: "center", fontFamily: "'Inter',sans-serif", fontSize: 32, fontWeight: 800, color: "#111827", marginBottom: 12 }}>
          Key Features of the Platform
        </h2>
        <div style={{ width: 60, height: 4, background: "#1565C0", margin: "0 auto 48px", borderRadius: 2 }} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 24 }}>
          {features.map((f, i) => (
            <div key={i} className="card" style={{ textAlign: "center", padding: "32px 24px", background: "white", boxShadow: "0 4px 12px rgba(0,0,0,0.05)", borderTop: `4px solid ${i%2===0 ? "#FF9933" : "#138808"}` }}>
              <div style={{ fontSize: 44, marginBottom: 16 }}>{f.icon}</div>
              <h3 style={{ color: "#111827", fontSize: 18, fontWeight: 700, marginBottom: 10 }}>{f.title}</h3>
              <p style={{ color: "#475569", fontSize: 14, lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ background: "#1565C0", padding: "72px 24px", textAlign: "center", borderTop: "4px solid #FF9933" }}>
        <h2 style={{ fontFamily: "'Inter',sans-serif", fontSize: 32, fontWeight: 700, color: "#FFFFFF", marginBottom: 16 }}>Secure Your Vote Today</h2>
        <p style={{ color: "#BBDEFB", marginBottom: 32, fontSize: 16 }}>Participate in the world's largest digital democracy.</p>
        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
          <Link to="/register" className="btn" style={{ background: "white", color: "#1565C0", fontWeight: 700 }}>Register as Voter</Link>
          <Link to="/election" className="btn" style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.4)", color: "white" }}>View Elections</Link>
        </div>
      </div>
    </div>
  );
}
