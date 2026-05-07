import React from "react";
import { Link } from "react-router-dom";

export default function PageNotFound() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", padding: 24 }}>
      <div>
        <div style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 120, fontWeight: 700, color: "#6366F1", lineHeight: 1, opacity: 0.3 }}>404</div>
        <h2 style={{ color: "#F9FAFB", fontSize: 28, marginBottom: 12, marginTop: -16 }}>Page Not Found</h2>
        <p style={{ color: "#6B7280", marginBottom: 32 }}>The page you're looking for doesn't exist.</p>
        <Link to="/" className="btn btn-primary">← Go Home</Link>
      </div>
    </div>
  );
}
