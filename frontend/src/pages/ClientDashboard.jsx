import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, Calendar, Settings, LogOut, CheckCircle2, 
  Search, Heart, MapPin, Clock, Edit3, Map as MapIcon
} from 'lucide-react';
import MapWidget from '../components/MapWidget';
import './Dashboard.css';

function ClientDashboard() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();

  // Mock coordinates for Accra salons
  const ACCRA_CENTER = [5.6037, -0.1870];
  const mockSalons = [
    { lat: 5.6037, lng: -0.1870, title: 'Your Location', description: 'Current pinned location', isSelf: true },
    { lat: 5.6130, lng: -0.1900, title: 'Glow Up Studio', description: 'Hair & Nails', rating: 4.8 },
    { lat: 5.5900, lng: -0.1750, title: 'Luxe Barber', description: 'Premium Men Grooming', rating: 4.9 },
    { lat: 5.6100, lng: -0.1700, title: 'Osu Beauty Hub', description: 'Makeup & Facials', rating: 4.7 }
  ];

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/login');
    } else {
      setUser(JSON.parse(userData));
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (!user) return null;

  return (
    <div className="dashboard-layout">
      {/* Sidebar Navigation */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-profile mb-5 text-center">
          {user.avatar_url ? (
            <img 
              src={user.avatar_url} 
              alt="Profile" 
              style={{ width: '90px', height: '90px', borderRadius: '50%', objectFit: 'cover', margin: '0 auto 15px', border: '3px solid var(--primary)' }} 
            />
          ) : (
            <div className="avatar-placeholder flex-center" style={{ width: '90px', height: '90px', borderRadius: '50%', background: 'var(--primary)', color: 'white', margin: '0 auto 15px' }}>
              <User size={40} />
            </div>
          )}
          <h3 style={{ margin: '0 0 5px' }}>{user.name}</h3>
          <span className="status-badge" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', fontSize: '0.7rem' }}>Client Profile</span>
        </div>

        <ul className="sidebar-nav">
          <li className={`sidebar-item ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
            <User className="sidebar-icon" size={18} /> Overview
          </li>
          <li className={`sidebar-item ${activeTab === 'appointments' ? 'active' : ''}`} onClick={() => setActiveTab('appointments')}>
            <Calendar className="sidebar-icon" size={18} /> My Appointments
          </li>
          <li className={`sidebar-item ${activeTab === 'map' ? 'active' : ''}`} onClick={() => setActiveTab('map')}>
            <MapIcon className="sidebar-icon" size={18} /> Discover Map
          </li>
          <li className={`sidebar-item ${activeTab === 'favorites' ? 'active' : ''}`} onClick={() => setActiveTab('favorites')}>
            <Heart className="sidebar-icon" size={18} /> Saved Salons
          </li>
          <li className={`sidebar-item ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>
            <Settings className="sidebar-icon" size={18} /> Settings
          </li>
        </ul>

        <div className="sidebar-footer mt-auto pt-4 border-t border-gray-800">
          <button onClick={handleLogout} className="btn w-100 flex-center" style={{ background: 'rgba(255, 89, 131, 0.1)', color: '#ff5983', gap: '8px', border: '1px solid rgba(255, 89, 131, 0.2)' }}>
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="dashboard-main animate-fade-in">
        <div className="dashboard-header-banner" style={{ background: 'linear-gradient(135deg, rgba(89, 162, 255, 0.15), rgba(162, 89, 255, 0.15))' }}>
          <div>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>
              Welcome back, <span className="text-gradient-primary">{user.name.split(' ')[0]}</span>!
            </h1>
            <p className="text-muted text-lg mb-0">Ready for your next glow up?</p>
          </div>
          <button onClick={() => navigate('/')} className="btn btn-primary shadow-glow flex-center" style={{ gap: '8px' }}>
            <Search size={18} /> Find Salons
          </button>
        </div>

        {activeTab === 'overview' && (
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
            {/* Upcoming Appointments */}
            <div className="glass-card" style={{ padding: '1.5rem', borderRadius: '16px' }}>
              <div className="flex-between mb-4">
                <h3 style={{ margin: 0 }}><Clock size={20} className="inline-icon text-primary" /> Upcoming Appointments</h3>
                <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>View History</button>
              </div>
              
              <div className="empty-state text-muted mt-2 text-center py-5">
                <CheckCircle2 size={48} className="mb-3 mx-auto opacity-50 text-primary" />
                <h4 className="mb-2">No upcoming appointments</h4>
                <p className="mb-4">You haven't booked anything yet. Discover top-rated salons near you!</p>
                <button onClick={() => navigate('/')} className="btn btn-primary">Browse Salons</button>
              </div>
            </div>

            {/* Profile Info */}
            <div className="glass-card" style={{ padding: '1.5rem', borderRadius: '16px' }}>
              <h3 style={{ margin: '0 0 15px' }}><User size={20} className="inline-icon text-primary" /> My Profile</h3>
              
              <div className="mb-4">
                <p className="text-sm text-muted mb-1">Email</p>
                <p style={{ fontWeight: 500 }}>{user.email}</p>
              </div>
              
              <div className="mb-4">
                <p className="text-sm text-muted mb-1">Primary Location</p>
                <p style={{ fontWeight: 500 }} className="flex-center" style={{ justifyContent: 'flex-start', gap: '5px' }}>
                  <MapPin size={16} className="text-muted" /> {user.location || 'No location set'}
                </p>
              </div>
              
              <div className="mb-4">
                <p className="text-sm text-muted mb-1">Style Preferences</p>
                <p style={{ fontSize: '0.9rem', lineHeight: '1.5' }}>{user.bio || 'Add a bio to let providers know your style!'}</p>
              </div>

              <hr style={{ borderColor: 'rgba(255,255,255,0.05)', margin: '20px 0' }} />
              
              <button className="btn btn-secondary w-100 flex-center mb-2" style={{ gap: '8px' }}>
                <Edit3 size={16} /> Edit Profile
              </button>
            </div>
          </div>
        )}

        {activeTab === 'map' && (
          <div className="animate-fade-in">
            <div className="flex-between mb-3">
              <h2 style={{ margin: 0 }}>Discover Salons Near You</h2>
              <div className="text-muted text-sm flex-center" style={{ gap: '5px' }}>
                <div style={{ width: '12px', height: '12px', background: '#2e86de', borderRadius: '50%' }}></div> You
                <div style={{ width: '12px', height: '12px', background: '#9c88ff', borderRadius: '50%', marginLeft: '10px' }}></div> Salons
              </div>
            </div>
            <p className="text-muted mb-4">Interactive map showing top-rated providers around your area.</p>
            <MapWidget locations={mockSalons} center={ACCRA_CENTER} zoom={13} height="500px" />
          </div>
        )}

        {/* Placeholders for other tabs */}
        {activeTab !== 'overview' && activeTab !== 'map' && (
          <div className="glass-card flex-center flex-column" style={{ padding: '5rem', borderRadius: '16px', minHeight: '400px' }}>
            <Settings size={48} className="text-muted mb-3 opacity-50" />
            <h2 className="text-muted">Section in Development</h2>
            <p className="text-muted">The {activeTab} section will be available soon.</p>
            <button className="btn btn-primary mt-3" onClick={() => setActiveTab('overview')}>Go Back to Overview</button>
          </div>
        )}
      </main>
    </div>
  );
}

export default ClientDashboard;
