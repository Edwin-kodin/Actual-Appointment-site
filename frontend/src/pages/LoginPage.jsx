import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, MapPin, Briefcase, Info, Image as ImageIcon, CheckCircle2, Navigation } from 'lucide-react';
import './LoginPage.css';

function LoginPage() {
  const [isLogin, setIsLogin] = useState(false);
  const [accountType, setAccountType] = useState('client');
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    location: '',
    bio: '',
    profilePic: null,
    businessName: '',
    category: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({ ...prev, profilePic: e.target.files[0] }));
  };

  const handleGetLocation = () => {
    setLoadingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Mock reverse geocoding for UI purposes
          setTimeout(() => {
            setFormData(prev => ({ ...prev, location: 'Osu, Accra (Pinned)' }));
            setLoadingLocation(false);
          }, 800);
        },
        (error) => {
          console.error("Error getting location", error);
          setFormData(prev => ({ ...prev, location: 'Location access denied' }));
          setLoadingLocation(false);
        }
      );
    } else {
      setLoadingLocation(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccess(true);
    setTimeout(() => {
      // Redirect to home/search page with location parameters applied (mocked)
      navigate('/');
    }, 1500);
  };

  if (success) {
    return (
      <div className="login-page flex-center page-wrapper">
        <div className="login-container glass-card animate-fade-in text-center">
          <CheckCircle2 size={64} className="text-accent mb-4 mx-auto" />
          <h3>{isLogin ? 'Welcome Back!' : 'Account Created Successfully!'}</h3>
          <p className="text-muted text-sm mt-2">
            {isLogin 
              ? 'Taking you to your dashboard...' 
              : 'Finding the best routes to nearby salons for you...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="login-page flex-center page-wrapper py-5">
      <div className="login-container detailed-form glass-card animate-fade-in">
        <div className="login-header text-center mb-2">
          <h2>GlowBook</h2>
          <p className="text-muted">{isLogin ? 'Welcome back to your beauty hub' : 'Join our beauty & wellness marketplace'}</p>
        </div>

        <div className="auth-toggle flex-center mb-4">
          <button type="button" className={`toggle-btn ${!isLogin ? 'active' : ''}`} onClick={() => setIsLogin(false)}>Sign Up</button>
          <button type="button" className={`toggle-btn ${isLogin ? 'active' : ''}`} onClick={() => setIsLogin(true)}>Sign In</button>
        </div>

        {!isLogin && (
          <div className="account-type-selector flex-center mb-4">
            <button type="button" className={`type-btn ${accountType === 'client' ? 'active' : ''}`} onClick={() => setAccountType('client')}>
              I'm a Client
            </button>
            <button type="button" className={`type-btn ${accountType === 'provider' ? 'active' : ''}`} onClick={() => setAccountType('provider')}>
              I'm a Provider
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          {/* Email & Password for both login and signup */}
          <div className="form-group">
            <label>Email Address</label>
            <div className="input-with-icon">
              <Mail className="input-icon" size={18} />
              <input type="email" name="email" className="input-field pl-10" placeholder="your@email.com" value={formData.email} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="input-with-icon">
              <Lock className="input-icon" size={18} />
              <input type="password" name="password" className="input-field pl-10" placeholder="••••••••" value={formData.password} onChange={handleChange} required />
            </div>
          </div>

          {!isLogin && (
            <>
              {/* Common Sign Up Fields */}
              <div className="form-group">
                <label>Full Name / Signing Person</label>
                <div className="input-with-icon">
                  <User className="input-icon" size={18} />
                  <input type="text" name="name" className="input-field pl-10" placeholder="John Doe" value={formData.name} onChange={handleChange} required />
                </div>
              </div>

              <div className="form-group">
                <label>Profile Picture</label>
                <div className="file-input-wrapper">
                  <ImageIcon size={18} className="text-muted mr-2" />
                  <input type="file" accept="image/*" onChange={handleFileChange} className="file-input" required />
                </div>
              </div>

              <div className="form-group">
                <label>Current Location</label>
                <div className="location-input-group flex-between gap-2">
                  <div className="input-with-icon" style={{ flex: 1 }}>
                    <MapPin className="input-icon" size={18} />
                    <input type="text" name="location" className="input-field pl-10" placeholder="E.g. Osu, Accra" value={formData.location} onChange={handleChange} required />
                  </div>
                  <button type="button" className="btn btn-secondary flex-center" onClick={handleGetLocation} disabled={loadingLocation} style={{ whiteSpace: 'nowrap' }}>
                    <Navigation size={16} style={{ marginRight: '6px' }} /> {loadingLocation ? 'Pinning...' : 'Pin Location'}
                  </button>
                </div>
                <small className="text-muted">We use this to route you to nearby shops & salons.</small>
              </div>

              {/* Provider specific fields */}
              {accountType === 'provider' && (
                <>
                  <div className="form-group">
                    <label>Business Name & Details</label>
                    <div className="input-with-icon">
                      <Briefcase className="input-icon" size={18} />
                      <input type="text" name="businessName" className="input-field pl-10" placeholder="E.g. Fade & Flow Barbershop" value={formData.businessName} onChange={handleChange} required />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Business Category</label>
                    <select name="category" className="input-field" value={formData.category} onChange={handleChange} required>
                      <option value="">Select a category</option>
                      <option value="Barbershop">Barbershop</option>
                      <option value="Hair Salon">Hair Salon</option>
                      <option value="Nail Salon">Nail Salon</option>
                      <option value="Spa">Spa & Massage</option>
                    </select>
                  </div>
                </>
              )}

              {/* Bio for both, customized label */}
              <div className="form-group">
                <label>
                  {accountType === 'client' 
                    ? 'A little bit more about yourself' 
                    : 'Everything that helps you run or set up your business'}
                </label>
                <div className="input-with-icon" style={{ alignItems: 'flex-start' }}>
                  <Info className="input-icon" size={18} style={{ top: '14px' }} />
                  <textarea 
                    name="bio" 
                    className="input-field pl-10 py-2" 
                    rows="3" 
                    placeholder={accountType === 'client' ? "Tell us about your style preferences..." : "Describe your services, experience, and what makes your salon unique..."}
                    value={formData.bio} 
                    onChange={handleChange} 
                    required
                  ></textarea>
                </div>
              </div>
            </>
          )}

          <button type="submit" className="btn btn-primary w-100 mt-2">
            {isLogin ? 'Sign In' : (accountType === 'client' ? 'Register as Client' : 'Set Up Business')}
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
