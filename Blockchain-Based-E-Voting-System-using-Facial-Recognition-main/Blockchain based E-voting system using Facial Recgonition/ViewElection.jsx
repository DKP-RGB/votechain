import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ELECTION_DATA, PARTIES } from "./Variables";

export default function ViewElection() {
  const el = ELECTION_DATA;
  const navigate = useNavigate();

  return (
    <div className="page" style={{ paddingTop: 100, paddingBottom: 80 }}>
      <div className="container">
        <div style={{ marginBottom: 40, animation: "fadeInUp 0.5s ease" }}>
          <Link to="/election" style={{ color: "#6366F1", fontSize: 14, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 16 }}>← Back to Elections</Link>
          <h1 style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 36, fontWeight: 700, color: "#F9FAFB", marginBottom: 8 }}>
            {el.name} — Candidates
          </h1>
          <p style={{ color: "#6B7280", fontSize: 14 }}>Select a candidate below to cast your vote using facial recognition.</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))", gap: 28 }}>
          {el.candidates.map((candidate, i) => {
            const party = PARTIES[candidate.partyId.toUpperCase()];
            return (
              <div key={candidate.id} className="card" style={{
                borderColor: `${party.color}44`,
                background: `linear-gradient(145deg, #111827, ${party.color}08)`,
                animation: `fadeInUp ${0.3 + i * 0.15}s ease forwards`,
              }}>
                {/* Party banner */}
                <div style={{
                  display: "flex", alignItems: "center", gap: 12,
                  background: `${party.color}15`, border: `1px solid ${party.color}33`,
                  borderRadius: 12, padding: "12px 16px", marginBottom: 20
                }}>
                  <img src={party.logo} alt={party.shortName} style={{ width: 40, height: 40, objectFit: "contain" }} />
                  <div>
                    <p style={{ color: party.color, fontWeight: 700, fontSize: 16, fontFamily: "'Rajdhani',sans-serif" }}>{party.shortName}</p>
                    <p style={{ color: "#9CA3AF", fontSize: 12 }}>{party.name}</p>
                  </div>
                </div>

                {/* Avatar */}
                <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
                  <div style={{
                    width: 90, height: 90, borderRadius: "50%",
                    background: `linear-gradient(135deg, ${party.color}33, ${party.color}66)`,
                    border: `3px solid ${party.color}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 36, boxShadow: `0 0 24px ${party.color}44`
                  }}>
                    {candidate.partyId === "bjp" ? "🪷" : "✋"}
                  </div>
                </div>

                <h2 style={{ color: "#F9FAFB", textAlign: "center", fontSize: 22, fontWeight: 700, marginBottom: 4 }}>{candidate.name}</h2>
                <p style={{ color: party.color, textAlign: "center", fontSize: 13, fontWeight: 500, marginBottom: 20 }}>{party.shortName} Candidate • {candidate.constituency}</p>

                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
                  {[
                    ["Age", candidate.age + " years"],
                    ["Education", candidate.education],
                    ["Experience", candidate.experience],
                  ].map(([k, v]) => (
                    <div key={k} style={{ display: "flex", gap: 8, fontSize: 13 }}>
                      <span style={{ color: "#4B5563", minWidth: 90 }}>{k}:</span>
                      <span style={{ color: "#D1D5DB", flex: 1 }}>{v}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => navigate("/vote", { state: { candidate, party } })}
                  className="btn"
                  style={{
                    width: "100%", background: `linear-gradient(135deg, ${party.color}, ${party.lightColor})`,
                    color: "white", fontSize: 15, fontWeight: 700,
                    boxShadow: `0 4px 20px ${party.color}44`
                  }}
                >
                  🗳️ Vote for {party.shortName}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
