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
    <header style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000, transition: "all 0.3s ease" }}>
      {/* Top Gov Bar */}
      <div style={{ background: "#111827", padding: "4px 24px", display: "flex", justifyContent: "space-between", fontSize: 11, color: "#D1D5DB", letterSpacing: 0.5, fontFamily: "'Inter', sans-serif" }}>
        <div style={{ display: "flex", gap: 16 }}>
          <span>🇮🇳 GOVERNMENT OF INDIA</span>
          <span style={{ display: "none" }} className="mobile-hide">MINISTRY OF ELECTRONICS AND INFORMATION TECHNOLOGY</span>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <span>A-</span><span>A</span><span>A+</span>
          <span style={{ borderLeft: "1px solid #374151", paddingLeft: 12 }}>English</span>
        </div>
      </div>

      {/* Main Navbar */}
      <nav style={{
        background: scrolled ? "rgba(255,255,255,0.95)" : "#FFFFFF",
        backdropFilter: scrolled ? "blur(10px)" : "none",
        boxShadow: scrolled ? "0 4px 12px rgba(0,0,0,0.05)" : "none",
        borderBottom: "3px solid transparent",
        borderImage: "linear-gradient(to right, #FF9933 33%, #FFFFFF 33%, #FFFFFF 66%, #138808 66%) 1",
        transition: "all 0.4s ease",
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", height: 72, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {/* Logo */}
          <Link to="/" style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none" }}>
            <img src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg" alt="Emblem" style={{ height: 46 }} />
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800, fontSize: 18, color: "#1565C0", letterSpacing: 0.5, lineHeight: 1.2 }}>
                E-VOTING SYSTEM
              </span>
              <span style={{ fontSize: 11, color: "#475569", fontWeight: 600, letterSpacing: 1 }}>DIGITAL INDIA</span>
            </div>
          </Link>

          {/* Desktop Links */}
          <div style={{ display: "flex", gap: 4, alignItems: "center" }} className="desktop-nav">
            {navLinks.map(n => (
              <Link key={n.link} to={n.link} style={{
                padding: "8px 16px", borderRadius: 4, textDecoration: "none",
                fontSize: 14, fontWeight: 600,
                color: location.pathname === n.link ? "#1565C0" : "#374151",
                background: location.pathname === n.link ? "#F1F5F9" : "transparent",
                borderBottom: location.pathname === n.link ? "2px solid #1565C0" : "2px solid transparent",
                transition: "all 0.2s",
              }}>{n.title}</Link>
            ))}
            <Link to="/vote" style={{
              marginLeft: 12, padding: "8px 20px", borderRadius: 4, textDecoration: "none",
              background: "#1565C0", color: "white", border: "1px solid #0D47A1",
              fontSize: 14, fontWeight: 700, boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              transition: "background 0.2s",
            }}>Cast Vote →</Link>
          </div>

          {/* Mobile hamburger */}
          <button onClick={() => setMenuOpen(o => !o)} style={{
            display: "none", background: "none", border: "1px solid #CBD5E1",
            color: "#1E293B", padding: "8px 12px", borderRadius: 4, cursor: "pointer", fontSize: 18
          }} id="mobile-menu-btn">☰</button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div style={{
            background: "#FFFFFF", borderTop: "1px solid #E2E8F0", padding: "16px 24px 24px",
            boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)"
          }}>
            {[...navLinks, { title: "Cast Vote", link: "/vote" }].map(n => (
              <Link key={n.link} to={n.link} style={{
                display: "block", padding: "12px 0", borderBottom: "1px solid #F1F5F9",
                textDecoration: "none", color: location.pathname === n.link ? "#1565C0" : "#475569",
                fontSize: 15, fontWeight: 600
              }}>{n.title}</Link>
            ))}
          </div>
        )}
      </nav>

      <style>{`
        @media (max-width:768px) {
          .desktop-nav { display: none !important; }
          #mobile-menu-btn { display: block !important; }
          .mobile-hide { display: none !important; }
        }
      `}</style>
    </header>
  );
}
