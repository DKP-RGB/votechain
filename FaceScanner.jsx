/**
 * FaceScanner.jsx
 * Full browser-based facial recognition using face-api.js
 * Includes animated scan UI with scanning line, corner markers, pulse ring.
 */
import React, { useEffect, useRef, useState, useCallback } from "react";
import * as faceapi from "@vladmandic/face-api";

const MODEL_URL = "https://cdn.jsdelivr.net/npm/@vladmandic/face-api@1.7.13/model/";

const PHASES = {
  LOADING: "loading",
  READY: "ready",
  SCANNING: "scanning",
  DETECTED: "detected",
  ERROR: "error",
};

export default function FaceScanner({ onDetected, onError, mode = "detect" }) {
  // mode: "register" → capture descriptor | "detect" → match against stored
  const videoRef = useRef(null);
  // overlayRef removed — CSS overlays used instead
  const streamRef = useRef(null);
  const rafRef = useRef(null);
  const [phase, setPhase] = useState(PHASES.LOADING);
  const [statusMsg, setStatusMsg] = useState("Loading AI models…");
  const [scanProgress, setScanProgress] = useState(0);
  const [faceBox, setFaceBox] = useState(null);
  const [modelsReady, setModelsReady] = useState(false);

  // Load models
  useEffect(() => {
    let cancelled = false;
    async function loadModels() {
      try {
        setStatusMsg("Loading face detection models…");
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68TinyNet.loadFromUri(MODEL_URL),
          faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        ]);
        if (!cancelled) {
          setModelsReady(true);
          setPhase(PHASES.READY);
          setStatusMsg("Models loaded. Starting camera…");
        }
      } catch (err) {
        if (!cancelled) {
          setPhase(PHASES.ERROR);
          setStatusMsg("Failed to load AI models. Check internet connection.");
          onError?.("Model load failed: " + err.message);
        }
      }
    }
    loadModels();
    return () => { cancelled = true; };
  }, [onError]);

  // Start camera once models ready
  useEffect(() => {
    if (!modelsReady) return;
    let cancelled = false;
    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: "user" },
        });
        if (cancelled) { stream.getTracks().forEach(t => t.stop()); return; }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            videoRef.current.play();
            setPhase(PHASES.SCANNING);
            setStatusMsg("Scanning for face… Please look at the camera");
          };
        }
      } catch (err) {
        if (!cancelled) {
          setPhase(PHASES.ERROR);
          setStatusMsg("Camera access denied. Please allow camera permission.");
          onError?.("Camera error: " + err.message);
        }
      }
    }
    startCamera();
    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach(t => t.stop());
      cancelAnimationFrame(rafRef.current);
    };
  }, [modelsReady, onError]);

  // Detection loop
  const detectLoop = useCallback(async () => {
    if (!videoRef.current || videoRef.current.readyState < 3) {
      rafRef.current = requestAnimationFrame(detectLoop);
      return;
    }
    try {
      const det = await faceapi
        .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions({ inputSize: 320 }))
        .withFaceLandmarks(true)
        .withFaceDescriptor();

      if (det) {
        const box = det.detection.box;
        const vw = videoRef.current.videoWidth;
        const vh = videoRef.current.videoHeight;
        setFaceBox({
          left: (box.x / vw) * 100 + "%",
          top: (box.y / vh) * 100 + "%",
          width: (box.width / vw) * 100 + "%",
          height: (box.height / vh) * 100 + "%",
        });
        setScanProgress(p => {
          const next = Math.min(p + 4, 100);
          if (next >= 100) {
            setPhase(PHASES.DETECTED);
            setStatusMsg("✅ Face detected successfully!");
            onDetected?.(det.descriptor, det);
            streamRef.current?.getTracks().forEach(t => t.stop());
            return 100;
          }
          return next;
        });
      } else {
        setFaceBox(null);
        setScanProgress(p => Math.max(p - 2, 0));
        setStatusMsg("Scanning… Position your face in the frame");
      }
    } catch { /* ignore frame errors */ }
    rafRef.current = requestAnimationFrame(detectLoop);
  }, [onDetected]);

  useEffect(() => {
    if (phase === PHASES.SCANNING) {
      rafRef.current = requestAnimationFrame(detectLoop);
    }
    return () => cancelAnimationFrame(rafRef.current);
  }, [phase, detectLoop]);

  const phaseColors = {
    [PHASES.LOADING]: "#6366F1",
    [PHASES.READY]: "#6366F1",
    [PHASES.SCANNING]: "#F59E0B",
    [PHASES.DETECTED]: "#10B981",
    [PHASES.ERROR]: "#EF4444",
  };
  const color = phaseColors[phase] || "#6366F1";

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
      {/* Camera viewport */}
      <div style={{
        position: "relative", width: "100%", maxWidth: 480, aspectRatio: "4/3",
        borderRadius: 20, overflow: "hidden",
        background: "#0D1526", border: `2px solid ${color}44`,
        boxShadow: `0 0 40px ${color}22`,
        transition: "border-color 0.5s, box-shadow 0.5s",
      }}>
        {/* Video */}
        <video ref={videoRef} muted playsInline style={{
          width: "100%", height: "100%", objectFit: "cover",
          transform: "scaleX(-1)", // mirror
          display: phase === PHASES.LOADING ? "none" : "block"
        }} />

        {/* Overlay canvas placeholder (we use CSS overlays) */}
        {phase !== PHASES.LOADING && phase !== PHASES.ERROR && (
          <>
            {/* Scan line animation */}
            {phase === PHASES.SCANNING && (
              <div style={{
                position: "absolute", left: 0, right: 0, height: 2,
                background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
                boxShadow: `0 0 12px ${color}`,
                animation: "scanLine 2s linear infinite",
                zIndex: 10,
              }} />
            )}

            {/* Corner brackets */}
            {["topLeft","topRight","botLeft","botRight"].map(c => {
              const isTop = c.startsWith("top");
              const isLeft = c.includes("Left");
              return (
                <div key={c} style={{
                  position: "absolute",
                  top: isTop ? 16 : "auto", bottom: !isTop ? 16 : "auto",
                  left: isLeft ? 16 : "auto", right: !isLeft ? 16 : "auto",
                  width: 28, height: 28, zIndex: 11,
                  borderTop: isTop ? `3px solid ${color}` : "none",
                  borderBottom: !isTop ? `3px solid ${color}` : "none",
                  borderLeft: isLeft ? `3px solid ${color}` : "none",
                  borderRight: !isLeft ? `3px solid ${color}` : "none",
                  animation: "cornerBlink 1.5s ease-in-out infinite",
                  boxShadow: `0 0 8px ${color}88`,
                }} />
              );
            })}

            {/* Face bounding box */}
            {faceBox && phase === PHASES.SCANNING && (
              <div style={{
                position: "absolute",
                left: faceBox.left, top: faceBox.top,
                width: faceBox.width, height: faceBox.height,
                border: `2px solid ${color}`,
                borderRadius: 6, zIndex: 12,
                boxShadow: `0 0 16px ${color}66`,
                animation: "scanPulse 1s ease-in-out infinite",
              }} />
            )}

            {/* Success overlay */}
            {phase === PHASES.DETECTED && (
              <div style={{
                position: "absolute", inset: 0, zIndex: 20,
                background: "rgba(16,185,129,0.15)", backdropFilter: "blur(2px)",
                display: "flex", alignItems: "center", justifyContent: "center",
                animation: "fadeIn 0.4s ease",
              }}>
                <div style={{ fontSize: 72, animation: "voteSuccess 0.6s ease" }}>✅</div>
              </div>
            )}

            {/* Pulse ring when face detected */}
            {faceBox && phase === PHASES.SCANNING && (
              <div style={{
                position: "absolute", inset: 0, zIndex: 9,
                display: "flex", alignItems: "center", justifyContent: "center",
                pointerEvents: "none"
              }}>
                <div style={{
                  width: 140, height: 140, borderRadius: "50%",
                  border: `2px solid ${color}44`,
                  animation: "scanPulse 1.2s ease-in-out infinite",
                }} />
              </div>
            )}
          </>
        )}

        {/* Loading state */}
        {phase === PHASES.LOADING && (
          <div style={{
            position: "absolute", inset: 0, display: "flex",
            flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16
          }}>
            <div style={{
              width: 48, height: 48, border: "3px solid rgba(99,102,241,0.2)",
              borderTop: "3px solid #6366F1", borderRadius: "50%",
              animation: "spin 0.8s linear infinite"
            }} />
            <p style={{ color: "#6366F1", fontSize: 13, fontWeight: 500 }}>Initializing AI…</p>
          </div>
        )}

        {/* Error state */}
        {phase === PHASES.ERROR && (
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, padding: 24 }}>
            <span style={{ fontSize: 40 }}>📷</span>
            <p style={{ color: "#EF4444", fontSize: 14, textAlign: "center" }}>{statusMsg}</p>
          </div>
        )}

        {/* Progress bar */}
        {phase === PHASES.SCANNING && (
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 4, background: "rgba(0,0,0,0.5)", zIndex: 15 }}>
            <div style={{
              height: "100%", width: scanProgress + "%",
              background: `linear-gradient(90deg, ${color}, #A78BFA)`,
              transition: "width 0.2s ease",
              boxShadow: `0 0 8px ${color}`,
            }} />
          </div>
        )}
      </div>

      {/* Status message */}
      <div style={{
        padding: "12px 20px", borderRadius: 10,
        background: `${color}15`, border: `1px solid ${color}33`,
        color: color, fontSize: 14, fontWeight: 500, textAlign: "center",
        minWidth: 280, transition: "all 0.3s",
      }}>
        {phase === PHASES.SCANNING && "🔍 "}{statusMsg}
      </div>

      {/* Progress indicator */}
      {phase === PHASES.SCANNING && (
        <div style={{ width: "100%", maxWidth: 480 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#6B7280", marginBottom: 6 }}>
            <span>Face Lock Progress</span>
            <span>{scanProgress}%</span>
          </div>
          <div style={{ height: 6, background: "rgba(255,255,255,0.06)", borderRadius: 3 }}>
            <div style={{
              height: "100%", width: scanProgress + "%", borderRadius: 3,
              background: `linear-gradient(90deg, #6366F1, #A78BFA)`,
              transition: "width 0.2s",
            }} />
          </div>
        </div>
      )}
    </div>
  );
}
