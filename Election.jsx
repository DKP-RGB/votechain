import React from "react";
import { Link } from "react-router-dom";
import { ELECTION_DATA, PARTIES } from "./Variables";

export default function Election() {
  const el = ELECTION_DATA;
  const partyList = Object.values(PARTIES);

  return (
    <div className="page" style={{ paddingTop: 100, paddingBottom: 80 }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: 48, animation: "fadeInUp 0.5s ease" }}>
          <span className="badge" style={{ background: "#E3F2FD", color: "#1565C0", border: "1px solid #BBDEFB", marginBottom: 16 }}>🗳️ Active Election</span>
          <h1 style={{ fontFamily: "'Inter',sans-serif", fontSize: 40, fontWeight: 800, color: "#111827", marginBottom: 12 }}>
            {el.name}
          </h1>
          <p style={{ color: "#475569", fontSize: 16, maxWidth: 600, fontWeight: 500 }}>{el.description}</p>
          <div style={{ display: "flex", gap: 16, marginTop: 20, flexWrap: "wrap" }}>
            <span style={{ color: "#374151", fontSize: 14, fontWeight: 600 }}>📅 {el.startDate} → {el.endDate}</span>
            <span style={{ color: "#374151", fontSize: 14, fontWeight: 600 }}>🏛️ {el.totalSeats} Seats</span>
          </div>
        </div>

        <h2 style={{ color: "#111827", fontFamily: "'Inter',sans-serif", fontSize: 26, fontWeight: 800, marginBottom: 24 }}>
          Competing Parties
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))", gap: 24, marginBottom: 48 }}>
          {partyList.map((party, i) => (
            <div key={party.id} className="card" style={{
              borderColor: `#DEE2E6`, animation: `fadeInUp ${0.3 + i * 0.15}s ease forwards`,
              background: `linear-gradient(135deg, #FFFFFF, ${party.color}05)`, boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
              borderTop: `4px solid ${party.color}`
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
                <div style={{
                  width: 70, height: 70, borderRadius: 12,
                  background: `${party.color}10`, border: `1px solid ${party.color}33`,
                  display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden"
                }}>
                  <img src={party.logo} alt={party.name} style={{ width: 52, height: 52, objectFit: "contain" }} />
                </div>
                <div>
                  <h3 style={{ color: party.color, fontFamily: "'Inter',sans-serif", fontSize: 24, fontWeight: 800, lineHeight: 1 }}>
                    {party.shortName}
                  </h3>
                  <p style={{ color: "#475569", fontSize: 14, marginTop: 6, fontWeight: 600 }}>{party.name}</p>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
                {[
                  ["Symbol", party.symbol],
                  ["Founded", party.founded],
                  ["Leader", party.leader],
                  ["Slogan", party.slogan],
                ].map(([k, v]) => (
                  <div key={k} style={{ background: "#F8FAFC", borderRadius: 8, padding: "10px 12px", border: "1px solid #F1F5F9" }}>
                    <p style={{ color: "#64748B", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 2, fontWeight: 700 }}>{k}</p>
                    <p style={{ color: "#111827", fontSize: 13, fontWeight: 700 }}>{v}</p>
                  </div>
                ))}
              </div>
              <div style={{ padding: "12px 14px", borderRadius: 8, background: `${party.color}08`, border: `1px solid ${party.color}22`, marginBottom: 20 }}>
                <p style={{ color: "#475569", fontSize: 12, fontWeight: 700 }}>Ideology</p>
                <p style={{ color: party.color, fontSize: 13, fontWeight: 500 }}>{party.ideology}</p>
              </div>
            </div>
          ))}
        </div>

        {/* View candidates button */}
        <div style={{ textAlign: "center" }}>
          <Link to={`/election/${el.id}`} className="btn" style={{ fontSize: 16, padding: "14px 40px", background: "#1565C0", color: "white", boxShadow: "0 4px 12px rgba(21,101,192,0.2)" }}>
            View Candidates & Vote →
          </Link>
        </div>
      </div>
    </div>
  );
}
