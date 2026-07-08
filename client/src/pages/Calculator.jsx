import React, { useState, useEffect } from 'react';
import { getPremiumDetails, formatIndianCurrency } from '../data/premiumData';
import { ShieldCheck, Info, Sparkles, Check, AlertCircle } from 'lucide-react';

export default function Calculator() {
  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    phone: '',
    age: '',
    product: 'Param Raksha Life', // Default product
    sumAssured: '6000000' // Default to 60 Lakhs
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(null); // { type: 'success'|'error', message: '' }
  const [calcResult, setCalcResult] = useState(null);

  // Auto-calculate age from DOB
  useEffect(() => {
    if (!formData.dob) {
      setFormData(prev => ({ ...prev, age: '' }));
      return;
    }

    const birthDate = new Date(formData.dob);
    const today = new Date();
    
    let calculatedAge = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      calculatedAge--;
    }

    setFormData(prev => ({ ...prev, age: calculatedAge }));

    // Validate age on changes
    const newErrors = { ...errors };
    if (calculatedAge < 18 || calculatedAge > 50) {
      newErrors.dob = 'Policy is only available for ages between 18 and 50.';
    } else {
      delete newErrors.dob;
    }
    setErrors(newErrors);
  }, [formData.dob]);

  // Recalculate policy results on selection / input change
  useEffect(() => {
    const ageNum = parseInt(formData.age, 10);
    const saNum = parseInt(formData.sumAssured, 10);

    if (formData.name && formData.phone && !errors.dob && !errors.phone && ageNum >= 18 && ageNum <= 50 && saNum) {
      const details = getPremiumDetails(saNum, ageNum);
      setCalcResult(details);
    } else {
      // If we change age or sumAssured, and they are valid, but name or phone aren't filled yet, 
      // we can still display the illustration! This fulfills "On Submit / On Selection Change".
      if (ageNum >= 18 && ageNum <= 50 && saNum) {
        const details = getPremiumDetails(saNum, ageNum);
        setCalcResult(details);
      } else {
        setCalcResult(null);
      }
    }
  }, [formData.age, formData.sumAssured, formData.name, formData.phone, errors]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Real-time phone validation
    if (name === 'phone') {
      const phoneRegex = /^[6-9]\d{9}$/;
      const newErrors = { ...errors };
      if (value && !phoneRegex.test(value)) {
        newErrors.phone = 'Please enter a valid 10-digit mobile number (starts with 6-9).';
      } else {
        delete newErrors.phone;
      }
      setErrors(newErrors);
    }

    // Name validation
    if (name === 'name') {
      const newErrors = { ...errors };
      if (value.trim().length === 0) {
        newErrors.name = 'Customer Name is required.';
      } else {
        delete newErrors.name;
      }
      setErrors(newErrors);
    }
  };

  const validateForm = () => {
    const tempErrors = {};
    if (!formData.name.trim()) tempErrors.name = 'Customer Name is required.';
    
    if (!formData.dob) {
      tempErrors.dob = 'Date of Birth is required.';
    } else {
      const ageNum = parseInt(formData.age, 10);
      if (isNaN(ageNum) || ageNum < 18 || ageNum > 50) {
        tempErrors.dob = 'Policy is only available for ages between 18 and 50.';
      }
    }

    const phoneRegex = /^[6-9]\d{9}$/;
    if (!formData.phone) {
      tempErrors.phone = 'Phone Number is required.';
    } else if (!phoneRegex.test(formData.phone)) {
      tempErrors.phone = 'Please enter a valid 10-digit mobile number.';
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const triggerToast = (type, message) => {
    setShowToast({ type, message });
    setTimeout(() => {
      setShowToast(null);
    }, 4000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm() || !calcResult) {
      triggerToast('error', 'Please fix the errors before submitting.');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        name: formData.name,
        dob: formData.dob,
        phone: formData.phone,
        age: parseInt(formData.age, 10),
        product: formData.product,
        sumAssured: parseInt(formData.sumAssured, 10),
        policyTerm: calcResult.pt,
        calculatedPremium: calcResult.premium,
        fundValue: calcResult.fundValue
      };

      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error('Failed to save calculation details');
      }

      triggerToast('success', 'Calculation details successfully saved to agent database!');
      
      // Keep calculation shown, but clear core contact details if user wants to enter new details
      // setFormData({ name: '', dob: '', phone: '', age: '', sumAssured: '6000000' });
    } catch (error) {
      console.error('Error submitting form:', error);
      triggerToast('error', 'Could not connect to database. Storing calculations failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="calculator-layout">
      {/* Toast Notification */}
      {showToast && (
        <div className={`toast ${showToast.type}`}>
          {showToast.type === 'success' ? <Check size={20} /> : <AlertCircle size={20} />}
          <span>{showToast.message}</span>
        </div>
      )}

      {/* Form Section */}
      <div>
        <h2 className="calc-section-title">
          <Sparkles className="text-gradient-orange" size={24} />
          Premium Calculator
        </h2>

        <div className="card">
          <form onSubmit={handleSubmit} noValidate>
            {/* Customer Name */}
            <div className="form-group">
              <label className="form-label" htmlFor="name">Customer Name</label>
              <div className="form-input-wrapper">
                <input
                  type="text"
                  id="name"
                  name="name"
                  className={`form-input ${errors.name ? 'error' : ''}`}
                  placeholder="Enter customer's full name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              {errors.name && <span className="form-error"><AlertCircle size={14} /> {errors.name}</span>}
            </div>

            {/* Date of Birth */}
            <div className="form-group">
              <label className="form-label" htmlFor="dob">Date of Birth</label>
              <input
                type="date"
                id="dob"
                name="dob"
                className={`form-input ${errors.dob ? 'error' : ''}`}
                value={formData.dob}
                onChange={handleInputChange}
                required
              />
              {errors.dob && <span className="form-error"><AlertCircle size={14} /> {errors.dob}</span>}
            </div>

            {/* Phone Number */}
            <div className="form-group">
              <label className="form-label" htmlFor="phone">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                maxLength="10"
                className={`form-input ${errors.phone ? 'error' : ''}`}
                placeholder="10-digit mobile number"
                value={formData.phone}
                onChange={handleInputChange}
                required
              />
              {errors.phone && <span className="form-error"><AlertCircle size={14} /> {errors.phone}</span>}
            </div>

            {/* Age (Auto-calculated) */}
            <div className="form-group">
              <label className="form-label" htmlFor="age">Age (Auto-calculated)</label>
              <input
                type="text"
                id="age"
                name="age"
                className="form-input"
                value={formData.age !== '' ? `${formData.age} Years` : ''}
                placeholder="Calculated from DOB"
                readOnly
              />
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginTop: '0.25rem' }}>
                * Target policy entry age is 18 to 50.
              </span>
            </div>

            {/* Term Product Dropdown */}
            <div className="form-group">
              <label className="form-label" htmlFor="product">Term Product</label>
              <select
                id="product"
                name="product"
                className="form-input"
                value={formData.product}
                onChange={handleInputChange}
              >
                <option value="Param Raksha Life">Param Raksha Life</option>
              </select>
            </div>

            {/* Sum Assured Dropdown */}
            <div className="form-group">
              <label className="form-label" htmlFor="sumAssured">Sum Assured</label>
              <select
                id="sumAssured"
                name="sumAssured"
                className="form-input"
                value={formData.sumAssured}
                onChange={handleInputChange}
              >
                <option value="6000000">₹60 Lakhs (60,00,000)</option>
                <option value="10000000">₹1 Crore (1,00,00,000)</option>
              </select>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              className="submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving Lead...' : 'Save Policy Lead Details'}
            </button>
          </form>
        </div>
      </div>

      {/* Results Section */}
      <div>
        <h2 className="calc-section-title">
          <ShieldCheck style={{ color: '#10B981' }} size={24} />
          Premium Illustration
        </h2>

        {calcResult ? (
          <div className="card results-card">
            <div className="results-header">
              <span className="results-tag">Tata AIA Param Raksha Life</span>
              <h3 className="results-title">{formatIndianCurrency(calcResult.sumAssured)} Life Cover</h3>
              <p className="results-subtitle">{calcResult.description}</p>
            </div>

            <div className="results-grid">
              <div className="result-item full-width">
                <div className="result-label">Annual Premium (PPT 12)</div>
                <div className="result-value">{formatIndianCurrency(calcResult.premium)}</div>
              </div>

              <div className="result-item">
                <div className="result-label">Policy Term (PT)</div>
                <div className="result-value">40 Years</div>
              </div>

              <div className="result-item">
                <div className="result-label">Premium Payment Term (PPT)</div>
                <div className="result-value">12 Years</div>
              </div>

              <div className="result-item full-width" style={{ border: '1px solid rgba(16, 185, 129, 0.2)', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(37, 99, 235, 0.02) 100%)' }}>
                <div className="result-label" style={{ color: 'var(--success)' }}>Estimated Fund Value (Maturity)</div>
                <div className="result-value" style={{ color: 'var(--success)', fontSize: '1.75rem' }}>{formatIndianCurrency(calcResult.fundValue)}</div>
              </div>
            </div>

            <div className="policy-info-box">
              <div className="info-row">
                <span className="info-label">Customer Name:</span>
                <span className="info-val">{formData.name || 'Not Provided'}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Entry Age:</span>
                <span className="info-val">{formData.age ? `${formData.age} Years` : 'Not Calculated'}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Accidental Cover:</span>
                <span className="info-val">{formatIndianCurrency(calcResult.accidentalCover)}</span>
              </div>
              <div className="info-row">
                <span className="info-label">ATPD Cover:</span>
                <span className="info-val">{formatIndianCurrency(calcResult.atpdCover)}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="card" style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center',
            height: '460px',
            color: 'var(--text-secondary)',
            textAlign: 'center',
            borderStyle: 'dashed'
          }}>
            <Info size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Awaiting Input</h3>
            <p style={{ maxWidth: '300px', fontSize: '0.9rem' }}>
              Select a valid date of birth (corresponding to age 18–50) and choose a Sum Assured to display premium rates and maturity fund values.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
