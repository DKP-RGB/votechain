import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import FaceScanner from "./FaceScanner";
import { Storage } from "./Storage";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1=form, 2=face, 3=done
  const [formData, setFormData] = useState({ firstName: "", lastName: "", username: "", password: "", aadhar: "", phone: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = e => setFormData(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleFormSubmit = e => {
    e.preventDefault();
    setError("");
    const { firstName, username, password, aadhar } = formData;
    if (!firstName || !username || !password || !aadhar) { setError("Please fill all required fields."); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    if (aadhar.length !== 12 || !/^\d+$/.test(aadhar)) { setError("Aadhar must be exactly 12 digits."); return; }
    setStep(2);
  };

  const handleFaceDetected = (descriptor) => {
    setTimeout(() => completeRegistration(descriptor), 1200);
  };

  const completeRegistration = (descriptor) => {
    setLoading(true);
    const result = Storage.registerUser({ ...formData, faceDescriptor: Array.from(descriptor) });
    setLoading(false);
    if (result.success) {
      setStep(3);
    } else {
      setError(result.message);
      setStep(1);
    }
  };

  return (
    <div className="page" style={{ paddingTop: 100, minHeight: "100vh" }}>
      <div className="container" style={{ maxWidth: 560, margin: "0 auto", paddingBottom: 80 }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <h1 style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 36, fontWeight: 700, color: "#F9FAFB", marginBottom: 8 }}>
            Voter Registration
          </h1>
          <p style={{ color: "#6B7280", fontSize: 14 }}>Register once. Vote securely with your face.</p>
          {/* Steps */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 24 }}>
            {["Details","Face Scan","Complete"].map((s, i) => (
              <React.Fragment key={i}>
                <div style={{
                  display: "flex", alignItems: "center", gap: 6,
                  color: step > i ? "#10B981" : step === i + 1 ? "#6366F1" : "#4B5563",
                  fontWeight: 600, fontSize: 13
                }}>
                  <div style={{
                    width: 26, height: 26, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12,
                    background: step > i ? "#10B981" : step === i + 1 ? "#6366F1" : "#1F2937",
                    color: "white"
                  }}>{step > i ? "✓" : i + 1}</div>
                  {s}
                </div>
                {i < 2 && <div style={{ flex: 1, height: 1, background: step > i + 1 ? "#10B981" : "#1F2937", maxWidth: 40 }} />}
              </React.Fragment>
            ))}
          </div>
        </div>

        {error && <div className="alert alert-error"><span>⚠️</span> {error}</div>}

        {/* Step 1: Form */}
        {step === 1 && (
          <div className="card" style={{ animation: "fadeInUp 0.5s ease" }}>
            <form onSubmit={handleFormSubmit}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 0 }}>
                {[
                  { label: "First Name *", name: "firstName", type: "text" },
                  { label: "Last Name", name: "lastName", type: "text" },
                ].map(f => (
                  <div className="form-group" key={f.name}>
                    <label className="form-label">{f.label}</label>
                    <input className="form-input" type={f.type} name={f.name} value={formData[f.name]} onChange={handleChange} placeholder={f.label.replace(" *","")} />
                  </div>
                ))}
              </div>
              {[
                { label: "Username *", name: "username", type: "text", placeholder: "Choose a unique username" },
                { label: "Password *", name: "password", type: "password", placeholder: "Min. 6 characters" },
                { label: "Aadhar Number *", name: "aadhar", type: "text", placeholder: "12-digit Aadhar number", maxLength: 12 },
                { label: "Phone Number", name: "phone", type: "tel", placeholder: "10-digit mobile number" },
              ].map(f => (
                <div className="form-group" key={f.name}>
                  <label className="form-label">{f.label}</label>
                  <input className="form-input" type={f.type} name={f.name} value={formData[f.name]} onChange={handleChange} placeholder={f.placeholder} maxLength={f.maxLength} />
                </div>
              ))}
              <button type="submit" className="btn btn-primary" style={{ width: "100%", marginTop: 8 }}>
                Next: Face Scan →
              </button>
            </form>
          </div>
        )}

        {/* Step 2: Face Scan */}
        {step === 2 && (
          <div className="card" style={{ animation: "fadeInUp 0.5s ease" }}>
            <h3 style={{ color: "#F9FAFB", fontWeight: 600, marginBottom: 8, textAlign: "center" }}>📸 Face Registration</h3>
            <p style={{ color: "#6B7280", fontSize: 13, textAlign: "center", marginBottom: 24 }}>
              Look at the camera. Stay still while we scan and register your face.
            </p>
            {loading ? (
              <div style={{ textAlign: "center", padding: 40 }}>
                <div className="loader-ring" style={{ margin: "0 auto 16px" }} />
                <p style={{ color: "#9CA3AF" }}>Registering…</p>
              </div>
            ) : (
              <FaceScanner mode="register" onDetected={handleFaceDetected} onError={e => setError(e)} />
            )}
            <button onClick={() => setStep(1)} className="btn btn-secondary" style={{ width: "100%", marginTop: 16 }}>← Back</button>
          </div>
        )}

        {/* Step 3: Done */}
        {step === 3 && (
          <div className="card" style={{ textAlign: "center", animation: "fadeInUp 0.5s ease" }}>
            <div style={{ fontSize: 72, marginBottom: 16, animation: "voteSuccess 0.6s ease" }}>🎉</div>
            <h2 style={{ color: "#10B981", fontFamily: "'Rajdhani',sans-serif", fontSize: 28, marginBottom: 12 }}>Registration Complete!</h2>
            <p style={{ color: "#9CA3AF", marginBottom: 8 }}>Welcome, <strong style={{ color: "#F9FAFB" }}>{formData.firstName}</strong>!</p>
            <p style={{ color: "#6B7280", fontSize: 13, marginBottom: 32 }}>Your face has been registered. You can now vote using facial recognition.</p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              <button onClick={() => navigate("/election")} className="btn btn-primary">🗳️ Go Vote Now</button>
              <button onClick={() => { setStep(1); setFormData({ firstName: "", lastName: "", username: "", password: "", aadhar: "", phone: "" }); }} className="btn btn-secondary">Register Another</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
