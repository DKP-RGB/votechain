import React, { useState, useEffect, useContext } from "react";
import { TransactionContext } from "./TransactionContext";
import { ELECTION_DATA, PARTIES } from "./Variables";

export default function ResultElection() {
  const { getAllTransactions, validateChain } = useContext(TransactionContext);
  const [votes, setVotes] = useState({});
  const [chainStatus, setChainStatus] = useState(null);
  const [totalVotes, setTotalVotes] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const txns = await getAllTransactions();
      const status = await validateChain();
      setChainStatus(status);

      // Count votes per candidate
      const tally = {};
      ELECTION_DATA.candidates.forEach(c => { tally[c.id] = 0; });
      txns.forEach(b => {
        if (b.election_id === ELECTION_DATA.id && tally[b.candidate_id] !== undefined) {
          tally[b.candidate_id]++;
        }
      });
      setVotes(tally);
      setTotalVotes(txns.filter(b => b.election_id === ELECTION_DATA.id).length);
      setLoading(false);
    }
    load();
  }, [getAllTransactions, validateChain]);

  const maxVotes = Math.max(...Object.values(votes), 1);
  const winner = ELECTION_DATA.candidates.find(c => votes[c.id] === maxVotes && maxVotes > 0);

  return (
    <div className="page" style={{ paddingTop: 100, paddingBottom: 80 }}>
      <div className="container">
        <div style={{ marginBottom: 48, animation: "fadeInUp 0.5s ease" }}>
          <h1 style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 40, fontWeight: 700, color: "#F9FAFB", marginBottom: 8 }}>
            Election Results
          </h1>
          <p style={{ color: "#9CA3AF", fontSize: 15 }}>{ELECTION_DATA.name} — Live Blockchain Tally</p>
        </div>

        {/* Chain status */}
        {chainStatus && (
          <div className={`alert ${chainStatus.valid ? "alert-success" : "alert-error"}`} style={{ marginBottom: 32 }}>
            <span>{chainStatus.valid ? "🔒" : "⚠️"}</span>
            <span>Blockchain Integrity: <strong>{chainStatus.valid ? "VALID" : "COMPROMISED"}</strong> · {chainStatus.totalBlocks} blocks · {totalVotes} total votes</span>
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: "center", padding: 80 }}>
            <div className="loader-ring" style={{ margin: "0 auto 16px" }} />
            <p style={{ color: "#9CA3AF" }}>Loading blockchain data…</p>
          </div>
        ) : (
          <>
            {/* Winner banner */}
            {winner && totalVotes > 0 && (
              <div style={{
                background: "linear-gradient(135deg, rgba(99,102,241,0.15), rgba(167,139,250,0.08))",
                border: "1px solid rgba(99,102,241,0.3)", borderRadius: 16,
                padding: "24px 32px", marginBottom: 40, textAlign: "center",
                animation: "fadeInUp 0.5s ease"
              }}>
                <div style={{ fontSize: 40, marginBottom: 8 }}>🏆</div>
                <h2 style={{ color: "#F9FAFB", fontFamily: "'Rajdhani',sans-serif", fontSize: 28, marginBottom: 4 }}>
                  {winner.name} is Leading
                </h2>
                <p style={{ color: "#A5B4FC", fontSize: 14 }}>
                  {PARTIES[winner.partyId.toUpperCase()].name} · {votes[winner.id]} votes ({totalVotes > 0 ? Math.round((votes[winner.id] / totalVotes) * 100) : 0}%)
                </p>
              </div>
            )}

            {/* Candidate result cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 24 }}>
              {ELECTION_DATA.candidates.map((candidate, i) => {
                const party = PARTIES[candidate.partyId.toUpperCase()];
                const voteCount = votes[candidate.id] || 0;
                const pct = totalVotes > 0 ? Math.round((voteCount / totalVotes) * 100) : 0;
                const isWinner = winner?.id === candidate.id && totalVotes > 0;

                return (
                  <div key={candidate.id} className="card" style={{
                    borderColor: isWinner ? party.color : `${party.color}33`,
                    boxShadow: isWinner ? `0 0 30px ${party.color}33` : undefined,
                    background: `linear-gradient(145deg,#111827,${party.color}08)`,
                    animation: `fadeInUp ${0.3 + i * 0.15}s ease`
                  }}>
                    {isWinner && (
                      <div style={{ textAlign: "center", marginBottom: 12 }}>
                        <span className="badge" style={{ background: `${party.color}20`, color: party.color, border: `1px solid ${party.color}44` }}>
                          🏆 Leading
                        </span>
                      </div>
                    )}
                    <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
                      <img src={party.logo} alt={party.shortName} style={{ width: 48, height: 48, objectFit: "contain" }} />
                      <div>
                        <h3 style={{ color: "#F9FAFB", fontSize: 18, fontWeight: 700 }}>{candidate.name}</h3>
                        <p style={{ color: party.color, fontSize: 13 }}>{party.shortName}</p>
                      </div>
                    </div>

                    {/* Vote count */}
                    <div style={{ textAlign: "center", marginBottom: 16 }}>
                      <div style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 56, fontWeight: 700, color: party.color, lineHeight: 1 }}>
                        {voteCount}
                      </div>
                      <div style={{ color: "#9CA3AF", fontSize: 13 }}>votes received</div>
                    </div>

                    {/* Progress bar */}
                    <div style={{ marginBottom: 8 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#6B7280", marginBottom: 6 }}>
                        <span>Vote Share</span><span>{pct}%</span>
                      </div>
                      <div style={{ height: 8, background: "rgba(255,255,255,0.06)", borderRadius: 4 }}>
                        <div style={{
                          height: "100%", width: pct + "%", borderRadius: 4,
                          background: `linear-gradient(90deg,${party.color},${party.lightColor})`,
                          transition: "width 1s ease", boxShadow: `0 0 12px ${party.color}66`
                        }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {totalVotes === 0 && (
              <div style={{ textAlign: "center", padding: "60px 24px" }}>
                <div style={{ fontSize: 56, marginBottom: 16 }}>📊</div>
                <h3 style={{ color: "#9CA3AF", marginBottom: 8 }}>No votes cast yet</h3>
                <p style={{ color: "#4B5563", fontSize: 14 }}>Results will appear here once votes are recorded on the blockchain.</p>
              </div>
            )}

            {/* Blockchain raw data */}
            {totalVotes > 0 && (
              <div style={{ marginTop: 40 }}>
                <h3 style={{ color: "#F9FAFB", fontFamily: "'Rajdhani',sans-serif", fontSize: 22, marginBottom: 16 }}>
                  ⛓️ Blockchain Ledger
                </h3>
                <div style={{ background: "#080E1C", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: 20, maxHeight: 280, overflowY: "auto" }}>
                  {ELECTION_DATA.candidates.map(c => {
                    const party = PARTIES[c.partyId.toUpperCase()];
                    return (
                      <div key={c.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <img src={party.logo} alt="" style={{ width: 24, height: 24, objectFit: "contain" }} />
                          <span style={{ color: "#D1D5DB", fontSize: 14 }}>{c.name}</span>
                        </div>
                        <span style={{ color: party.color, fontWeight: 700, fontFamily: "monospace" }}>{votes[c.id] || 0} votes</span>
                      </div>
                    );
                  })}
                  <div style={{ padding: "10px 0", display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "#6B7280", fontSize: 13 }}>Total Blockchain Blocks</span>
                    <span style={{ color: "#6366F1", fontFamily: "monospace", fontWeight: 700 }}>{chainStatus?.totalBlocks || 0}</span>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
