/**
 * FrontendTransactionContext.jsx
 * Pure frontend blockchain context — no backend, no MetaMask.
 * Uses localStorage SHA-256 blockchain.
 */

import React, { useState, useCallback, createContext } from "react";
import { Blockchain } from "./Blockchain";
import { Storage } from "./Storage";

export const TransactionContext = createContext();

export const TransactionProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);
  const [currentAccount] = useState("frontend-blockchain");

  const connectWallet = useCallback(async () => {
    // No-op — frontend mode
  }, []);

  const sendTransaction = useCallback(async (election_id, candidate_id, user_id) => {
    try {
      // Check for duplicate vote
      const alreadyVoted = Blockchain.hasAlreadyVoted(user_id, election_id);
      if (alreadyVoted) {
        return { valid: false, mess: "You have already voted in this election" };
      }

      const block = await Blockchain.addBlock({
        election_id,
        candidate_id,
        user_id,
      });

      // Mark user as voted in localStorage
      Storage.markVoted(user_id);

      return {
        valid: true,
        mess: "Vote cast successfully on blockchain!",
        hash: block.hash,
      };
    } catch (error) {
      console.error("sendTransaction error:", error);
      return { valid: false, mess: "Failed to record vote on blockchain" };
    }
  }, []);

  const getAllTransactions = useCallback(async () => {
    const chain = Blockchain.getChain();
    setTransactions(chain);
    return chain;
  }, []);

  const validateChain = useCallback(async () => {
    return await Blockchain.validateChain();
  }, []);

  return (
    <TransactionContext.Provider
      value={{
        connectWallet,
        currentAccount,
        sendTransaction,
        getAllTransactions,
        validateChain,
        transactions,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};
