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
          <h1 style={{ fontFamily: "'Inter',sans-serif", fontSize: 40, fontWeight: 800, color: "#111827", marginBottom: 8 }}>
            Election Results
          </h1>
          <p style={{ color: "#475569", fontSize: 16, fontWeight: 600 }}>{ELECTION_DATA.name} — Live Official Blockchain Tally</p>
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
                background: "#E3F2FD",
                border: "1px solid #BBDEFB", borderRadius: 12,
                padding: "24px 32px", marginBottom: 40, textAlign: "center",
                animation: "fadeInUp 0.5s ease", boxShadow: "0 4px 12px rgba(21,101,192,0.1)"
              }}>
                <div style={{ fontSize: 40, marginBottom: 8 }}>🏆</div>
                <h2 style={{ color: "#0D47A1", fontFamily: "'Inter',sans-serif", fontSize: 28, marginBottom: 4, fontWeight: 800 }}>
                  {winner.name} is Leading
                </h2>
                <p style={{ color: "#1565C0", fontSize: 15, fontWeight: 600 }}>
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
                    borderColor: isWinner ? party.color : `#DEE2E6`,
                    boxShadow: isWinner ? `0 4px 20px ${party.color}22` : `0 4px 12px rgba(0,0,0,0.05)`,
                    background: isWinner ? `${party.color}05` : `#FFFFFF`,
                    animation: `fadeInUp ${0.3 + i * 0.15}s ease`,
                    borderTop: `4px solid ${party.color}`
                  }}>
                    {isWinner && (
                      <div style={{ textAlign: "center", marginBottom: 12 }}>
                        <span className="badge" style={{ background: `${party.color}15`, color: party.color, border: `1px solid ${party.color}33`, fontWeight: 700 }}>
                          🏆 Leading
                        </span>
                      </div>
                    )}
                    <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
                      <img src={party.logo} alt={party.shortName} style={{ width: 48, height: 48, objectFit: "contain" }} />
                      <div>
                        <h3 style={{ color: "#111827", fontSize: 18, fontWeight: 800 }}>{candidate.name}</h3>
                        <p style={{ color: party.color, fontSize: 13, fontWeight: 600 }}>{party.shortName}</p>
                      </div>
                    </div>

                    {/* Vote count */}
                    <div style={{ textAlign: "center", marginBottom: 16 }}>
                      <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 56, fontWeight: 800, color: party.color, lineHeight: 1 }}>
                        {voteCount}
                      </div>
                      <div style={{ color: "#475569", fontSize: 13, fontWeight: 600, marginTop: 4 }}>votes received</div>
                    </div>

                    {/* Progress bar */}
                    <div style={{ marginBottom: 8 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#374151", marginBottom: 6, fontWeight: 700 }}>
                        <span>Vote Share</span><span>{pct}%</span>
                      </div>
                      <div style={{ height: 8, background: "#E9ECEF", borderRadius: 4 }}>
                        <div style={{
                          height: "100%", width: pct + "%", borderRadius: 4,
                          background: party.color,
                          transition: "width 1s ease"
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
                <h3 style={{ color: "#111827", fontFamily: "'Inter',sans-serif", fontSize: 22, marginBottom: 16, fontWeight: 800 }}>
                  ⛓️ Official Blockchain Ledger
                </h3>
                <div style={{ background: "#F8FAFC", border: "1px solid #DEE2E6", borderRadius: 8, padding: 20, maxHeight: 280, overflowY: "auto" }}>
                  {ELECTION_DATA.candidates.map(c => {
                    const party = PARTIES[c.partyId.toUpperCase()];
                    return (
                      <div key={c.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid #E2E8F0" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <img src={party.logo} alt="" style={{ width: 24, height: 24, objectFit: "contain" }} />
                          <span style={{ color: "#374151", fontSize: 14, fontWeight: 600 }}>{c.name}</span>
                        </div>
                        <span style={{ color: party.color, fontWeight: 800, fontFamily: "monospace", fontSize: 15 }}>{votes[c.id] || 0} votes</span>
                      </div>
                    );
                  })}
                  <div style={{ padding: "12px 0", display: "flex", justifyContent: "space-between", fontWeight: 700 }}>
                    <span style={{ color: "#475569", fontSize: 13 }}>Total Blockchain Blocks Generated</span>
                    <span style={{ color: "#1565C0", fontFamily: "monospace", fontSize: 15 }}>{chainStatus?.totalBlocks || 0}</span>
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
