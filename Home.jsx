import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

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
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    const particles = Array.from({ length: 80 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.5 + 0.3,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      alpha: Math.random() * 0.5 + 0.1,
    }));
    let raf;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(99,102,241,${p.alpha})`;
        ctx.fill();
      });
      // Connect nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(99,102,241,${0.08 * (1 - dist / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div style={{ minHeight: "100vh" }}>
      {/* Hero */}
      <div style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", overflow: "hidden" }}>
        <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(99,102,241,0.12) 0%, transparent 70%)"
        }} />
        <div style={{ position: "relative", maxWidth: 1200, margin: "0 auto", padding: "0 24px", textAlign: "center", width: "100%" }}>
          <div style={{ animation: "fadeInUp 0.7s ease forwards" }}>
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.3)",
              borderRadius: 20, padding: "6px 18px", fontSize: 13, color: "#A5B4FC",
              fontWeight: 500, marginBottom: 32
            }}>
              🔒 Secured by SHA-256 Blockchain Technology
            </span>
            <h1 style={{
              fontFamily: "'Rajdhani',sans-serif", fontWeight: 700,
              fontSize: "clamp(42px,7vw,88px)", lineHeight: 1.1,
              background: "linear-gradient(135deg,#F9FAFB 40%,#6366F1 70%,#A78BFA)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              backgroundClip: "text", marginBottom: 24
            }}>
              Democracy Secured<br />by Blockchain
            </h1>
            <p style={{ color: "#9CA3AF", fontSize: "clamp(15px,2vw,19px)", maxWidth: 600, margin: "0 auto 48px", lineHeight: 1.7 }}>
              India's first facial recognition–powered e-voting platform. Every vote is cryptographically sealed, immutable, and publicly verifiable.
            </p>
            <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
              <Link to="/election" className="btn btn-primary" style={{ fontSize: 16, padding: "14px 36px" }}>
                🗳️ Vote Now
              </Link>
              <Link to="/register" className="btn btn-secondary" style={{ fontSize: 16, padding: "14px 36px" }}>
                📝 Register to Vote
              </Link>
            </div>
          </div>

          {/* Party logos */}
          <div style={{ display: "flex", justifyContent: "center", gap: 32, marginTop: 64, flexWrap: "wrap" }}>
            {[
              { name: "BJP", logo: "/bjp_logo.png", color: "#FF6B00", bg: "rgba(255,107,0,0.1)" },
              { name: "INC", logo: "/congress_logo.png", color: "#1565C0", bg: "rgba(21,101,192,0.1)" },
            ].map(p => (
              <div key={p.name} style={{
                background: p.bg, border: `1px solid ${p.color}33`,
                borderRadius: 16, padding: "16px 32px", display: "flex", alignItems: "center", gap: 16,
                animation: "fadeInUp 0.8s ease forwards", backdropFilter: "blur(10px)"
              }}>
                <img src={p.logo} alt={p.name} style={{ width: 48, height: 48, objectFit: "contain", borderRadius: 8 }} />
                <span style={{ color: p.color, fontWeight: 700, fontSize: 18, fontFamily: "'Rajdhani',sans-serif" }}>{p.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ background: "#080E1C", padding: "48px 24px", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 32 }}>
          {stats.map((s, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 36, fontWeight: 700, color: "#6366F1" }}>{s.value}</div>
              <div style={{ color: "#9CA3AF", fontSize: 13, marginTop: 4 }}>{s.suffix}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 24px" }}>
        <h2 style={{ textAlign: "center", fontFamily: "'Rajdhani',sans-serif", fontSize: 38, fontWeight: 700, color: "#F9FAFB", marginBottom: 12 }}>
          Why VoteChain?
        </h2>
        <p style={{ textAlign: "center", color: "#6B7280", marginBottom: 56, fontSize: 15 }}>
          The most secure, transparent, and accessible e-voting platform
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 24 }}>
          {features.map((f, i) => (
            <div key={i} className="card" style={{ textAlign: "center" }}>
              <div style={{ fontSize: 44, marginBottom: 16 }}>{f.icon}</div>
              <h3 style={{ color: "#F9FAFB", fontSize: 18, fontWeight: 600, marginBottom: 10 }}>{f.title}</h3>
              <p style={{ color: "#6B7280", fontSize: 14, lineHeight: 1.7 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.15), rgba(167,139,250,0.08))", borderTop: "1px solid rgba(99,102,241,0.2)", borderBottom: "1px solid rgba(99,102,241,0.2)", padding: "72px 24px", textAlign: "center" }}>
        <h2 style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 36, color: "#F9FAFB", marginBottom: 16 }}>Ready to Cast Your Vote?</h2>
        <p style={{ color: "#9CA3AF", marginBottom: 32, fontSize: 15 }}>Register your face and vote securely in under 2 minutes</p>
        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
          <Link to="/register" className="btn btn-primary">Register Now →</Link>
          <Link to="/election" className="btn btn-secondary">View Elections</Link>
        </div>
      </div>
    </div>
  );
}
