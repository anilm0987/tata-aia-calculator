import React, { useState, useEffect } from 'react';
import { formatIndianCurrency } from '../data/premiumData';
import { Search, Trash2, Calendar, Phone, Shield, Loader2, Sparkles, Check, AlertCircle, Lock, LogOut, KeyRound } from 'lucide-react';

export default function AdminLeads() {
  // Authentication states
  const [isAuthenticated, setIsAuthenticated] = useState(
    sessionStorage.getItem('agent_authenticated') === 'true'
  );
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Leads states
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showToast, setShowToast] = useState(null);

  // Fetch leads only when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchLeads();
    }
  }, [isAuthenticated]);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/leads');
      if (!response.ok) {
        throw new Error('Failed to fetch leads');
      }
      const data = await response.json();
      setLeads(data);
    } catch (error) {
      console.error('Error fetching leads:', error);
      triggerToast('error', 'Failed to load leads from the server.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    
    // Auth Validation (Agent ID matches phone/name, password matches tata123)
    const validId = '7207462690';
    const validName = 'balagasrinu';
    const validPassword = 'tata123';

    const normalizedId = loginId.trim().toLowerCase();
    
    if ((normalizedId === validId || normalizedId === validName) && password === validPassword) {
      sessionStorage.setItem('agent_authenticated', 'true');
      setIsAuthenticated(true);
      setLoginError('');
      // Clear credentials immediately so they don't persist in memory
      setLoginId('');
      setPassword('');
      triggerToast('success', 'Welcome back, BALAGA SRINU!');
    } else {
      setLoginError('Invalid Agent ID or Password. Please try again.');
      triggerToast('error', 'Authentication failed.');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('agent_authenticated');
    setIsAuthenticated(false);
    setLoginId('');
    setPassword('');
    setLeads([]);
    triggerToast('success', 'Logged out successfully. Customer data is locked.');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this policy lead?')) {
      return;
    }

    try {
      const response = await fetch(`/api/leads/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete lead');
      }

      setLeads(prev => prev.filter(lead => lead._id !== id));
      triggerToast('success', 'Lead successfully deleted.');
    } catch (error) {
      console.error('Error deleting lead:', error);
      triggerToast('error', 'Failed to delete lead from the server.');
    }
  };

  const triggerToast = (type, message) => {
    setShowToast({ type, message });
    setTimeout(() => {
      setShowToast(null);
    }, 4000);
  };

  const filteredLeads = leads.filter(lead => {
    const term = searchTerm.toLowerCase();
    return (
      lead.name.toLowerCase().includes(term) ||
      lead.phone.includes(term) ||
      lead.age.toString().includes(term)
    );
  });

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatDOB = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Render Login Card if not authenticated
  if (!isAuthenticated) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '65vh', padding: '1rem' }}>
        {/* Toast Notification */}
        {showToast && (
          <div className={`toast ${showToast.type}`}>
            {showToast.type === 'success' ? <Check size={20} /> : <AlertCircle size={20} />}
            <span>{showToast.message}</span>
          </div>
        )}

        <div className="card" style={{ width: '100%', maxWidth: '420px', boxShadow: 'var(--shadow-glow)' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div className="feature-icon-wrapper" style={{ margin: '0 auto 1.25rem', width: '56px', height: '56px', borderRadius: '50%' }}>
              <Lock className="text-gradient-orange" size={24} />
            </div>
            <h3 style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--text-primary)' }}>Agent Verification</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.35rem' }}>
              Access restricted to authorized Tata AIA Advisors only.
            </p>
          </div>

          <div className="login-form">
            {/* Agent ID */}
            <div className="form-group">
              <label className="form-label" htmlFor="loginId">Agent ID / Username</label>
              <input
                type="text"
                id="loginId"
                className="form-input"
                placeholder="Enter valid username"
                value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
                required
                autoComplete="off"
                onKeyDown={(e) => e.key === 'Enter' && handleLogin(e)}
              />
            </div>

            {/* Password */}
            <div className="form-group" style={{ marginBottom: '2rem' }}>
              <label className="form-label" htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                className="form-input"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
                onKeyDown={(e) => e.key === 'Enter' && handleLogin(e)}
              />
              {loginError && (
                <span className="form-error" style={{ marginTop: '0.6rem' }}>
                  <AlertCircle size={14} />
                  {loginError}
                </span>
              )}
            </div>

            {/* Submit */}
            <button onClick={handleLogin} className="submit-btn" style={{ gap: '0.6rem' }}>
              <KeyRound size={18} />
              <span>Verify & Unlock Leads</span>
            </button>
          </div>


        </div>
      </div>
    );
  }

  // Render Leads Table if authenticated
  return (
    <div>
      {/* Toast Notification */}
      {showToast && (
        <div className={`toast ${showToast.type}`}>
          {showToast.type === 'success' ? <Check size={20} /> : <AlertCircle size={20} />}
          <span>{showToast.message}</span>
        </div>
      )}

      <div className="admin-header">
        <div className="admin-title-section">
          <Sparkles className="text-gradient-orange" size={28} />
          <div>
            <h2 style={{ fontSize: '1.85rem', fontWeight: 800, margin: 0 }}>Customer Policy Leads</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>
              Advisor: <strong>BALAGA SRINU</strong> (Logged In)
            </p>
          </div>
        </div>

        {/* Search & Logout */}
        <div className="admin-actions-bar">
          <div className="search-bar" style={{ flex: 1, maxWidth: 'none' }}>
            <div className="form-input-wrapper" style={{ width: '100%' }}>
              <input
                type="text"
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
                placeholder="Search by name, phone or age..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search 
                size={18} 
                style={{ 
                  position: 'absolute', 
                  left: '1rem', 
                  top: '50%', 
                  transform: 'translateY(-50%)', 
                  color: 'var(--text-muted)' 
                }} 
              />
            </div>
          </div>

          <button 
            onClick={handleLogout}
            style={{ 
              backgroundColor: 'rgba(239, 68, 68, 0.1)', 
              border: '1px solid rgba(239, 68, 68, 0.2)', 
              color: 'var(--danger)',
              height: '46px',
              padding: '0 1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              borderRadius: 'var(--border-radius-md)',
              cursor: 'pointer',
              fontWeight: 600,
              transition: 'var(--transition-fast)'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--danger)';
              e.currentTarget.style.color = 'white';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
              e.currentTarget.style.color = 'var(--danger)';
            }}
          >
            <LogOut size={16} />
            <span>Log Out</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center', 
          padding: '5rem 0',
          color: 'var(--text-secondary)'
        }}>
          <Loader2 className="animate-spin" size={48} style={{ color: 'var(--brand-orange)', animation: 'spin 1s linear infinite', marginBottom: '1rem' }} />
          <span>Loading client leads...</span>
          <style>{`
            @keyframes spin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      ) : filteredLeads.length > 0 ? (
        <div className="table-responsive">
          <table className="leads-table">
            <thead>
              <tr>
                <th>Customer Info</th>
                <th>Age / DOB</th>
                <th>Cover Type</th>
                <th>Annual Premium</th>
                <th>Fund Value</th>
                <th>Date Submitted</th>
                <th style={{ textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.map((lead) => (
                <tr key={lead._id}>
                  {/* Name & Phone */}
                  <td>
                    <div style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--text-primary)' }}>{lead.name}</div>
                    <div style={{ marginTop: '0.2rem' }}>
                      <a href={`tel:${lead.phone}`} className="phone-link">
                        <Phone size={12} />
                        <span>{lead.phone}</span>
                      </a>
                    </div>
                  </td>

                  {/* Age & DOB */}
                  <td>
                    <div style={{ fontWeight: 500 }}>{lead.age} Yrs</div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '0.1rem' }}>
                      DOB: {formatDOB(lead.dob)}
                    </div>
                  </td>

                  {/* Sum Assured & Cover Details */}
                  <td>
                    <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                      {lead.product || 'Param Raksha Life'}
                    </div>
                    <span className={`badge-sa ${lead.sumAssured === 10000000 ? 'cr' : ''}`}>
                      {lead.sumAssured === 10000000 ? '₹1 Crore' : '₹60 Lakhs'}
                    </span>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginTop: '0.35rem' }}>
                      PT: {lead.policyTerm} Yrs | 12 PPT
                    </div>
                  </td>

                  {/* Annual Premium */}
                  <td>
                    <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                      {formatIndianCurrency(lead.calculatedPremium)}
                    </div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>/ year</div>
                  </td>

                  {/* Fund Value */}
                  <td>
                    <div style={{ fontWeight: 700, color: 'var(--success)' }}>
                      {formatIndianCurrency(lead.fundValue !== undefined ? lead.fundValue : lead.finalMaturity)}
                    </div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Fund value at PT</div>
                  </td>

                  {/* Date Created */}
                  <td style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Calendar size={14} style={{ color: 'var(--text-muted)' }} />
                      <span>{formatDate(lead.createdAt)}</span>
                    </div>
                  </td>

                  {/* Actions */}
                  <td style={{ textAlign: 'center' }}>
                    <button 
                      onClick={() => handleDelete(lead._id)} 
                      className="action-btn-delete"
                      title="Delete Lead"
                    >
                      <Trash2 size={14} />
                      <span>Delete</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="card empty-state">
          <Shield className="empty-state-icon" size={48} />
          <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>No leads found</h3>
          <p style={{ maxWidth: '400px', margin: '0 auto', fontSize: '0.9rem' }}>
            {searchTerm 
              ? `No results match your search term "${searchTerm}". Try checking for spelling or searching for another customer.`
              : 'Saved premium illustrations will appear here once customers submit calculations from the Premium Calculator page.'}
          </p>
        </div>
      )}
    </div>
  );
}
