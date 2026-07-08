import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Car, Calendar, ArrowRight, Award, HeartHandshake, CheckCircle } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-glow"></div>
        <h1 className="hero-title">
          Secure Your Future with <br />
          <span className="text-gradient-orange">TATA AIA Insurance </span>
        </h1>

        <p className="hero-subtitle">
          A comprehensive wealth-secure insurance plan providing unmatched protection, accidental covers, and market-linked returns.
        </p>

        <div className="badge-group">
          <span className="hero-badge highlight">60L & 1 Cr Life Cover</span>
          <span className="hero-badge">Accidental Cover</span>
          <span className="hero-badge highlight">12 Years PPT</span>
          <span className="hero-badge">Cover till 85 Years</span>
        </div>

        <button
          onClick={() => navigate('/calculator')}
          className="cta-button"
        >
          Calculate Your Premium
          <ArrowRight size={20} />
        </button>
      </section>

      {/* Features Section */}
      <section style={{ marginTop: '3rem' }}>
        <h2 className="features-title">Plan Highlights & Key Benefits</h2>

        <div className="features-grid">
          {/* Card 1 */}
          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <Shield className="text-gradient-orange" size={32} />
            </div>
            <h3 className="feature-card-title">🛡️ Natural Life Cover</h3>
            <p className="feature-card-description">
              Ensure your family's future is secure with flexible base sum assured options of <strong>₹60 Lakhs</strong> or <strong>₹1 Crore</strong>. Provides comprehensive financial protection in your absence.
            </p>
          </div>

          {/* Card 2 */}
          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <Car style={{ color: '#2563EB' }} size={32} />
            </div>
            <h3 className="feature-card-title">🚗 Accidental Cover</h3>
            <p className="feature-card-description">
              Enhanced security with double accidental cover benefits. Get up to <strong>₹1.2 Crore</strong> or <strong>₹2 Crore</strong> of additional cover to support your family through accidental emergencies.
            </p>
          </div>

          {/* Card 3 */}
          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <Calendar style={{ color: '#10B981' }} size={32} />
            </div>
            <h3 className="feature-card-title">📅 Only 12 Years PPT</h3>
            <p className="feature-card-description">
              Enjoy hassle-free coverage. Pay premiums for just <strong>12 years</strong> (Premium Payment Term) while staying protected all the way up to <strong>85 years</strong> of age.
            </p>
          </div>
        </div>
      </section>

      {/* Trust Badges section for premium feel */}
      <section style={{
        background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.4) 0%, rgba(15, 23, 42, 0.6) 100%)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--border-radius-lg)',
        padding: '3rem 2rem',
        marginBottom: '4rem',
        textAlign: 'center'
      }}>
        <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '2rem' }}>Why Choose Tata AIA ?</h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '2rem'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
            <Award size={36} style={{ color: 'var(--brand-orange)' }} />
            <span style={{ fontWeight: 600, fontSize: '1.1rem' }}>99.01% Claim Settlement</span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Industry-leading claim settlement ratio (FY 2023-24)</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
            <HeartHandshake size={36} style={{ color: '#38BDF8' }} />
            <span style={{ fontWeight: 600, fontSize: '1.1rem' }}>Tax Benefits</span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Tax savings under Sec 80C & Sec 10(10D) as per income tax laws</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle size={36} style={{ color: '#10B981' }} />
            <span style={{ fontWeight: 600, fontSize: '1.1rem' }}>Market Linked Growth</span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Potential to grow your wealth with top-performing funds</span>
          </div>
        </div>
      </section>
    </div>
  );
}
