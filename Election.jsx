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
          <span className="badge badge-accent" style={{ marginBottom: 16 }}>🗳️ Active Election</span>
          <h1 style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 40, fontWeight: 700, color: "#F9FAFB", marginBottom: 12 }}>
            {el.name}
          </h1>
          <p style={{ color: "#9CA3AF", fontSize: 15, maxWidth: 600 }}>{el.description}</p>
          <div style={{ display: "flex", gap: 16, marginTop: 20, flexWrap: "wrap" }}>
            <span style={{ color: "#6B7280", fontSize: 13 }}>📅 {el.startDate} → {el.endDate}</span>
            <span style={{ color: "#6B7280", fontSize: 13 }}>🏛️ {el.totalSeats} Seats</span>
          </div>
        </div>

        <h2 style={{ color: "#F9FAFB", fontFamily: "'Rajdhani',sans-serif", fontSize: 26, fontWeight: 700, marginBottom: 24 }}>
          Competing Parties
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))", gap: 24, marginBottom: 48 }}>
          {partyList.map((party, i) => (
            <div key={party.id} className="card" style={{
              borderColor: `${party.color}44`, animation: `fadeInUp ${0.3 + i * 0.15}s ease forwards`,
              background: `linear-gradient(135deg, #111827, ${party.color}08)`,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
                <div style={{
                  width: 70, height: 70, borderRadius: 16,
                  background: `${party.color}18`, border: `2px solid ${party.color}44`,
                  display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden"
                }}>
                  <img src={party.logo} alt={party.name} style={{ width: 52, height: 52, objectFit: "contain" }} />
                </div>
                <div>
                  <h3 style={{ color: party.color, fontFamily: "'Rajdhani',sans-serif", fontSize: 24, fontWeight: 700, lineHeight: 1 }}>
                    {party.shortName}
                  </h3>
                  <p style={{ color: "#9CA3AF", fontSize: 13, marginTop: 4 }}>{party.name}</p>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
                {[
                  ["Symbol", party.symbol],
                  ["Founded", party.founded],
                  ["Leader", party.leader],
                  ["Slogan", party.slogan],
                ].map(([k, v]) => (
                  <div key={k} style={{ background: "rgba(255,255,255,0.03)", borderRadius: 8, padding: "10px 12px" }}>
                    <p style={{ color: "#6B7280", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 2 }}>{k}</p>
                    <p style={{ color: "#F9FAFB", fontSize: 13, fontWeight: 500 }}>{v}</p>
                  </div>
                ))}
              </div>
              <div style={{ padding: "12px 14px", borderRadius: 10, background: `${party.color}10`, border: `1px solid ${party.color}22`, marginBottom: 20 }}>
                <p style={{ color: "#9CA3AF", fontSize: 12 }}>Ideology</p>
                <p style={{ color: party.color, fontSize: 13, fontWeight: 500 }}>{party.ideology}</p>
              </div>
            </div>
          ))}
        </div>

        {/* View candidates button */}
        <div style={{ textAlign: "center" }}>
          <Link to={`/election/${el.id}`} className="btn btn-primary" style={{ fontSize: 16, padding: "14px 40px" }}>
            View Candidates & Vote →
          </Link>
        </div>
      </div>
    </div>
  );
}
