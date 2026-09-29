import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, ArrowRight, Lock, CheckCircle2 } from 'lucide-react';
import './LoginPage.css';

function LoginPage() {
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const navigate = useNavigate();

  const handleRequestOtp = (e) => {
    e.preventDefault();
    if (phone.length > 8) {
      setStep(2);
    }
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (otp.length === 4) {
      setStep(3);
      setTimeout(() => {
        navigate('/');
      }, 1500);
    }
  };

  return (
    <div className="login-page flex-center page-wrapper">
      <div className="login-container glass-card animate-fade-in">
        <div className="login-header text-center">
          <h2>GlowGH</h2>
          <p className="text-muted">Your beauty & wellness marketplace</p>
        </div>

        {step === 1 && (
          <form onSubmit={handleRequestOtp} className="login-form animate-fade-in">
            <div className="form-group">
              <label>Phone Number</label>
              <div className="input-with-icon">
                <Phone className="input-icon" size={18} />
                <input 
                  type="tel" 
                  className="input-field pl-10" 
                  placeholder="e.g. 054 123 4567" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
            </div>
            <button type="submit" className="btn btn-primary w-100">
              Continue <ArrowRight size={16} />
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyOtp} className="login-form animate-fade-in">
            <div className="text-center mb-4">
              <p className="text-sm">We sent a 4-digit code to <br/><strong className="text-primary-light">{phone}</strong></p>
            </div>
            <div className="form-group">
              <label>One-Time Password (OTP)</label>
              <div className="input-with-icon">
                <Lock className="input-icon" size={18} />
                <input 
                  type="text" 
                  className="input-field pl-10 text-center tracking-widest text-lg" 
                  placeholder="• • • •" 
                  maxLength={4}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />
              </div>
            </div>
            <button type="submit" className="btn btn-primary w-100">
              Verify & Login
            </button>
            <div className="text-center mt-4">
              <button type="button" className="text-btn text-muted text-sm" onClick={() => setStep(1)}>
                Wrong number? Go back
              </button>
            </div>
          </form>
        )}

        {step === 3 && (
          <div className="success-state flex-center flex-col animate-fade-in">
            <CheckCircle2 size={48} className="text-accent mb-4" />
            <h3>Verified Successfully!</h3>
            <p className="text-muted text-sm mt-2">Redirecting you to the app...</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default LoginPage;
