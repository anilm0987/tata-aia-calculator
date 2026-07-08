import React from 'react';
import { NavLink } from 'react-router-dom';
import { Phone, Shield, User } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="navbar">
      <NavLink to="/" className="logo-container">
        <div className="logo-text">
          <span className="logo-tata" style={{ color: '#38BDF8', fontWeight: 800 }}>TATA</span>
          <span className="logo-aia" style={{ color: 'var(--brand-orange)', fontWeight: 800, marginLeft: '0.25rem' }}>AIA</span>
          <span className="logo-insurance" style={{ color: 'var(--text-primary)', fontWeight: 600, marginLeft: '0.35rem' }}>Insurance</span>
          <span className="logo-badge">Param Raksha</span>
        </div>
      </NavLink>

      <div className="nav-links">
        <NavLink 
          to="/" 
          className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
          end
        >
          Home
        </NavLink>
        <NavLink 
          to="/calculator" 
          className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
        >
          Calculator
        </NavLink>
        <NavLink 
          to="/leads" 
          className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
        >
          Agent Leads
        </NavLink>
      </div>

      <div className="agent-card">
        <div className="agent-avatar">
          <User size={20} />
        </div>
        <div className="agent-info">
          <span className="agent-name">BALAGA SRINU</span>
          <span className="agent-role">Tata AIA Insurance Advisor</span>
          <a href="tel:7207462690" className="agent-contact">
            <Phone size={14} />
            <span>7207462690</span>
          </a>
        </div>
      </div>
    </nav>
  );
}
