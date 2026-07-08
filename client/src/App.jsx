import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Calculator from './pages/Calculator';
import AdminLeads from './pages/AdminLeads';

export default function App() {
  return (
    <Router>
      <div className="app-container">
        {/* Navigation Bar */}
        <Navbar />

        {/* Main Content Area */}
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/calculator" element={<Calculator />} />
            <Route path="/leads" element={<AdminLeads />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="footer">
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <p style={{ fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
              Disclaimer & Advisor Details
            </p>
            <p style={{ fontSize: '0.8rem', lineHeight: '1.5', marginBottom: '1rem' }}>
              This premium calculator is for illustrative purposes only. Actual premium rates, fund values, and maturity returns are subject to underwriting rules, market conditions, and policy terms and conditions of Tata AIA Life Insurance Company Limited. Standard tax laws apply.
            </p>
            <p style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--brand-orange)' }}>
              Authorized Insurance Advisor: BALAGA SRINU | Company: Tata AIA Insurance | Contact: +91 7207462690
            </p>
            <p style={{ fontSize: '0.75rem', marginTop: '1.5rem', color: 'var(--text-muted)' }}>
              © {new Date().getFullYear()} TATA AIA Life Insurance Co. Ltd. All Rights Reserved. Built with Premium Standards.
            </p>
          </div>
        </footer>
      </div>
    </Router>
  );
}
