/**
 * VotePage.jsx
 * The core voting flow:
 * 1) Shows selected candidate + party
 * 2) Runs face scan to verify voter identity
 * 3) Records vote on frontend blockchain
 */
import React, { useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import FaceScanner from "./FaceScanner";
import { Storage } from "./Storage";
import { TransactionContext } from "./TransactionContext";
import { ELECTION_DATA } from "./Variables";

const STEPS = { CONFIRM: 1, FACE: 2, PROCESSING: 3, SUCCESS: 4, ERROR: 5 };

export default function VotePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { sendTransaction } = useContext(TransactionContext);
  const state = location.state;

  const [step, setStep] = useState(STEPS.CONFIRM);
  const [result, setResult] = useState(null);
  const [errMsg, setErrMsg] = useState("");

  if (!state?.candidate) {
    return (
      <div className="page" style={{ paddingTop: 120, textAlign: "center" }}>
        <h2 style={{ color: "#F9FAFB", marginBottom: 16 }}>No candidate selected</h2>
        <button onClick={() => navigate("/election")} className="btn btn-primary">Go to Elections</button>
      </div>
    );
  }

  const { candidate, party } = state;

  const handleFaceDetected = async (descriptor) => {
    setStep(STEPS.PROCESSING);

    // Match face against registered users
    const match = Storage.getUserByFaceDescriptor(Array.from(descriptor), 0.6);

    if (!match.success) {
      setErrMsg("Face not recognized. Please register first or try again in better lighting.");
      setStep(STEPS.ERROR);
      return;
    }

    const user = match.user;

    // Check if already voted
    if (user.hasVoted) {
      setErrMsg(`${user.firstName}, you have already cast your vote in this election.`);
      setStep(STEPS.ERROR);
      return;
    }

    // Cast vote on blockchain
    const voteResult = await sendTransaction(ELECTION_DATA.id, candidate.id, user.id);

    if (voteResult.valid) {
      setResult({ user, hash: voteResult.hash });
      setStep(STEPS.SUCCESS);
    } else {
      setErrMsg(voteResult.mess);
      setStep(STEPS.ERROR);
    }
  };

  return (
    <div className="page" style={{ paddingTop: 100, paddingBottom: 80 }}>
      <div className="container" style={{ maxWidth: 620, margin: "0 auto" }}>

        {/* Candidate summary card */}
        <div style={{
          background: `linear-gradient(135deg, ${party.color}15, #111827)`,
          border: `1px solid ${party.color}44`, borderRadius: 16,
          padding: "20px 24px", marginBottom: 32, display: "flex", alignItems: "center", gap: 16
        }}>
          <img src={party.logo} alt={party.shortName} style={{ width: 48, height: 48, objectFit: "contain" }} />
          <div>
            <p style={{ color: "#6B7280", fontSize: 12, textTransform: "uppercase", letterSpacing: "0.05em" }}>Voting for</p>
            <p style={{ color: "#F9FAFB", fontWeight: 700, fontSize: 18 }}>{candidate.name}</p>
            <p style={{ color: party.color, fontSize: 13 }}>{party.name}</p>
          </div>
          <div style={{ marginLeft: "auto" }}>
            <span className="badge" style={{ background: `${party.color}20`, color: party.color, border: `1px solid ${party.color}44` }}>
              {party.shortName}
            </span>
          </div>
        </div>

        {/* Step: Confirm */}
        {step === STEPS.CONFIRM && (
          <div className="card" style={{ textAlign: "center", animation: "fadeInUp 0.5s ease" }}>
            <div style={{ fontSize: 60, marginBottom: 16 }}>🗳️</div>
            <h2 style={{ color: "#F9FAFB", fontFamily: "'Rajdhani',sans-serif", fontSize: 28, marginBottom: 12 }}>Confirm Your Vote</h2>
            <p style={{ color: "#9CA3AF", marginBottom: 8, fontSize: 15 }}>
              You are about to vote for <strong style={{ color: party.color }}>{candidate.name}</strong> ({party.shortName})
            </p>
            <p style={{ color: "#6B7280", fontSize: 13, marginBottom: 32 }}>
              Your identity will be verified using facial recognition. This action is irreversible once confirmed.
            </p>
            <div style={{ background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.3)", borderRadius: 10, padding: "12px 16px", marginBottom: 24 }}>
              <p style={{ color: "#F59E0B", fontSize: 13 }}>⚠️ You can only vote once. Make sure your choice is correct.</p>
            </div>
            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              <button onClick={() => navigate(-1)} className="btn btn-secondary">← Change Candidate</button>
              <button onClick={() => setStep(STEPS.FACE)} className="btn" style={{ background: `linear-gradient(135deg,${party.color},${party.lightColor})`, color: "white", boxShadow: `0 4px 20px ${party.color}44` }}>
                📸 Verify & Vote →
              </button>
            </div>
          </div>
        )}

        {/* Step: Face Scan */}
        {step === STEPS.FACE && (
          <div className="card" style={{ animation: "fadeInUp 0.5s ease" }}>
            <h2 style={{ color: "#F9FAFB", fontFamily: "'Rajdhani',sans-serif", fontSize: 26, textAlign: "center", marginBottom: 8 }}>
              🧬 Identity Verification
            </h2>
            <p style={{ color: "#6B7280", fontSize: 13, textAlign: "center", marginBottom: 24 }}>
              Look at the camera. We'll match your face with your registered profile.
            </p>
            <FaceScanner
              mode="detect"
              onDetected={handleFaceDetected}
              onError={e => { setErrMsg(e); setStep(STEPS.ERROR); }}
            />
            <button onClick={() => setStep(STEPS.CONFIRM)} className="btn btn-secondary" style={{ width: "100%", marginTop: 16 }}>← Cancel</button>
          </div>
        )}

        {/* Step: Processing */}
        {step === STEPS.PROCESSING && (
          <div className="card" style={{ textAlign: "center", padding: "60px 32px" }}>
            <div className="loader-ring" style={{ margin: "0 auto 24px" }} />
            <h3 style={{ color: "#F9FAFB", marginBottom: 8 }}>Recording your vote…</h3>
            <p style={{ color: "#6B7280", fontSize: 13 }}>Writing to blockchain. Please wait.</p>
          </div>
        )}

        {/* Step: Success */}
        {step === STEPS.SUCCESS && result && (
          <div className="card" style={{ textAlign: "center", animation: "fadeInUp 0.5s ease" }}>
            <div style={{ fontSize: 80, marginBottom: 16, animation: "voteSuccess 0.6s ease" }}>🎊</div>
            <h2 style={{ color: "#10B981", fontFamily: "'Rajdhani',sans-serif", fontSize: 32, marginBottom: 8 }}>Vote Cast Successfully!</h2>
            <p style={{ color: "#9CA3AF", marginBottom: 4, fontSize: 15 }}>
              Thank you, <strong style={{ color: "#F9FAFB" }}>{result.user.firstName}</strong>! Your vote has been recorded.
            </p>
            <p style={{ color: "#6B7280", fontSize: 13, marginBottom: 24 }}>Your vote has been sealed on the blockchain.</p>

            <div style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.25)", borderRadius: 12, padding: "16px 20px", marginBottom: 28, textAlign: "left" }}>
              <p style={{ color: "#6B7280", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>Blockchain Transaction Hash</p>
              <p style={{ color: "#10B981", fontSize: 11, fontFamily: "monospace", wordBreak: "break-all" }}>{result.hash}</p>
            </div>

            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              <button onClick={() => navigate("/")} className="btn btn-secondary">Go Home</button>
              <button onClick={() => navigate("/result")} className="btn btn-success">View Results →</button>
            </div>
          </div>
        )}

        {/* Step: Error */}
        {step === STEPS.ERROR && (
          <div className="card" style={{ textAlign: "center", animation: "fadeInUp 0.5s ease" }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>❌</div>
            <h2 style={{ color: "#EF4444", fontFamily: "'Rajdhani',sans-serif", fontSize: 28, marginBottom: 12 }}>Verification Failed</h2>
            <p style={{ color: "#9CA3AF", marginBottom: 28, fontSize: 14 }}>{errMsg}</p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              <button onClick={() => navigate("/register")} className="btn btn-primary">Register Face</button>
              <button onClick={() => { setStep(STEPS.FACE); setErrMsg(""); }} className="btn btn-secondary">Try Again</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
