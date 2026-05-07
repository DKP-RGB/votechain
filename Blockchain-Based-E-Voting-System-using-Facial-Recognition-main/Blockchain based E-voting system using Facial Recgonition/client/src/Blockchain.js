/**
 * FrontendBlockchain.js
 * A pure frontend SHA-256 blockchain stored in localStorage.
 * No backend required.
 */

// --- SHA-256 helper (Web Crypto API) ---
async function sha256(message) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

const STORAGE_KEY = "evoting_blockchain";

function loadChain() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveChain(chain) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(chain));
}

function getChain() {
  return loadChain();
}

async function addBlock(data) {
  const chain = loadChain();
  const previousHash =
    chain.length > 0 ? chain[chain.length - 1].hash : "0".repeat(64);
  const timestamp = new Date().toISOString();
  const blockData = JSON.stringify({ ...data, previousHash, timestamp });
  const hash = await sha256(blockData);
  const block = { ...data, previousHash, timestamp, hash };
  chain.push(block);
  saveChain(chain);
  return block;
}

async function validateChain() {
  const chain = loadChain();
  if (chain.length === 0) return { valid: true, totalBlocks: 0 };
  for (let i = 1; i < chain.length; i++) {
    const prev = chain[i - 1];
    const curr = chain[i];
    if (curr.previousHash !== prev.hash) {
      return { valid: false, totalBlocks: chain.length };
    }
  }
  return { valid: true, totalBlocks: chain.length };
}

function hasAlreadyVoted(userId, electionId) {
  const chain = loadChain();
  return chain.some(
    (block) => block.user_id === userId && block.election_id === electionId
  );
}

function resetChain() {
  localStorage.removeItem(STORAGE_KEY);
}

export const Blockchain = {
  getChain,
  addBlock,
  validateChain,
  hasAlreadyVoted,
  resetChain,
};
