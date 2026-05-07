import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TransactionProvider } from "./TransactionContext";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Home from "./Home";
import Election from "./Election";
import ViewElection from "./ViewElection";
import VotePage from "./VotePage";
import ResultElection from "./ResultElection";
import RegisterPage from "./RegisterPage";
import PageNotFound from "./PageNotFound";
import './style.css';

function App() {
  return (
    <TransactionProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/election" element={<Election />} />
          <Route path="/election/:id" element={<ViewElection />} />
          <Route path="/vote" element={<VotePage />} />
          <Route path="/result" element={<ResultElection />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </TransactionProvider>
  );
}

export default App;
