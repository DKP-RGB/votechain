import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const navLinks = [
  { title: "Home", link: "/" },
  { title: "Elections", link: "/election" },
  { title: "Results", link: "/result" },
  { title: "Register", link: "/register" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [location]);

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
      background: scrolled ? "rgba(6,11,24,0.95)" : "transparent",
      backdropFilter: scrolled ? "blur(20px)" : "none",
      borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "none",
      transition: "all 0.4s ease",
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", height: 72, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        {/* Logo */}
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <div style={{
            width: 38, height: 38, borderRadius: 10,
            background: "linear-gradient(135deg,#6366F1,#4F46E5)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 18, boxShadow: "0 0 20px rgba(99,102,241,0.4)"
          }}>🗳️</div>
          <span style={{ fontFamily: "'Rajdhani',sans-serif", fontWeight: 700, fontSize: 20, color: "#F9FAFB", letterSpacing: 1 }}>
            VOTE<span style={{ color: "#6366F1" }}>CHAIN</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div style={{ display: "flex", gap: 8, alignItems: "center" }} className="desktop-nav">
          {navLinks.map(n => (
            <Link key={n.link} to={n.link} style={{
              padding: "8px 18px", borderRadius: 8, textDecoration: "none",
              fontSize: 14, fontWeight: 500,
              color: location.pathname === n.link ? "#6366F1" : "#9CA3AF",
              background: location.pathname === n.link ? "rgba(99,102,241,0.1)" : "transparent",
              border: location.pathname === n.link ? "1px solid rgba(99,102,241,0.3)" : "1px solid transparent",
              transition: "all 0.2s",
            }}>{n.title}</Link>
          ))}
          <Link to="/vote" style={{
            marginLeft: 8, padding: "9px 22px", borderRadius: 10, textDecoration: "none",
            background: "linear-gradient(135deg,#6366F1,#4F46E5)", color: "white",
            fontSize: 14, fontWeight: 600, boxShadow: "0 4px 15px rgba(99,102,241,0.4)",
            transition: "transform 0.2s",
          }}>Cast Vote</Link>
        </div>

        {/* Mobile hamburger */}
        <button onClick={() => setMenuOpen(o => !o)} style={{
          display: "none", background: "none", border: "1px solid rgba(255,255,255,0.1)",
          color: "#F9FAFB", padding: "8px 12px", borderRadius: 8, cursor: "pointer", fontSize: 18
        }} id="mobile-menu-btn">☰</button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{
          background: "rgba(6,11,24,0.98)", backdropFilter: "blur(20px)",
          borderTop: "1px solid rgba(255,255,255,0.06)", padding: "16px 24px 24px",
        }}>
          {[...navLinks, { title: "Cast Vote", link: "/vote" }].map(n => (
            <Link key={n.link} to={n.link} style={{
              display: "block", padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,0.05)",
              textDecoration: "none", color: location.pathname === n.link ? "#6366F1" : "#9CA3AF",
              fontSize: 15, fontWeight: 500
            }}>{n.title}</Link>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width:768px) {
          .desktop-nav { display: none !important; }
          #mobile-menu-btn { display: block !important; }
        }
      `}</style>
    </nav>
  );
}
