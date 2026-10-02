import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Briefcase, Calendar, Settings, LogOut, TrendingUp, 
  Users, Clock, MapPin, Edit3, Image as ImageIcon, Star, Plus, CheckCircle2, Map as MapIcon 
} from 'lucide-react';
import MapWidget from '../components/MapWidget';
import './Dashboard.css';

function ProviderDashboard() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();

  // Mock coordinates
  const ACCRA_CENTER = [5.6037, -0.1870];
  const mockClients = [
    { lat: 5.6037, lng: -0.1870, title: 'Your Salon', description: 'Your business location', isSelf: true },
    { lat: 5.6150, lng: -0.1800, title: 'Upcoming Client', description: 'Jane Doe - 2:30 PM' },
    { lat: 5.5950, lng: -0.1900, title: 'Upcoming Client', description: 'John Smith - 4:00 PM' }
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
              style={{ width: '90px', height: '90px', borderRadius: '50%', objectFit: 'cover', margin: '0 auto 15px', border: '3px solid var(--accent)' }} 
            />
          ) : (
            <div className="avatar-placeholder flex-center" style={{ width: '90px', height: '90px', borderRadius: '50%', background: 'var(--accent)', color: 'black', margin: '0 auto 15px' }}>
              <Briefcase size={40} />
            </div>
          )}
          <h3 style={{ margin: '0 0 5px' }}>{user.businessName || user.name}</h3>
          <span className="status-badge confirmed" style={{ fontSize: '0.7rem' }}>Active Provider</span>
        </div>

        <ul className="sidebar-nav">
          <li className={`sidebar-item ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
            <TrendingUp className="sidebar-icon" size={18} /> Overview
          </li>
          <li className={`sidebar-item ${activeTab === 'appointments' ? 'active' : ''}`} onClick={() => setActiveTab('appointments')}>
            <Calendar className="sidebar-icon" size={18} /> Appointments
          </li>
          <li className={`sidebar-item ${activeTab === 'map' ? 'active' : ''}`} onClick={() => setActiveTab('map')}>
            <MapIcon className="sidebar-icon" size={18} /> Client Map
          </li>
          <li className={`sidebar-item ${activeTab === 'services' ? 'active' : ''}`} onClick={() => setActiveTab('services')}>
            <Briefcase className="sidebar-icon" size={18} /> Services
          </li>
          <li className={`sidebar-item ${activeTab === 'portfolio' ? 'active' : ''}`} onClick={() => setActiveTab('portfolio')}>
            <ImageIcon className="sidebar-icon" size={18} /> Portfolio
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
        <div className="dashboard-header-banner">
          <div>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>
              Hello, <span className="text-gradient-primary">{user.name.split(' ')[0]}</span> 👋
            </h1>
            <p className="text-muted text-lg mb-0">Here is what's happening with your business today.</p>
          </div>
          <button onClick={() => navigate(`/provider/${user.id}`)} className="btn btn-primary shadow-glow">
            View Public Page
          </button>
        </div>

        {activeTab === 'overview' && (
          <>
            {/* Quick Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '30px' }}>
              <div className="stat-card">
                <div className="stat-icon-wrapper" style={{ color: '#2ed573' }}>
                  <TrendingUp size={24} />
                </div>
                <div>
                  <h2 style={{ margin: 0, fontSize: '1.8rem' }}>GHS 0.00</h2>
                  <p className="text-muted text-sm mb-0">Today's Revenue</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon-wrapper" style={{ color: '#ffa502' }}>
                  <Calendar size={24} />
                </div>
                <div>
                  <h2 style={{ margin: 0, fontSize: '1.8rem' }}>0</h2>
                  <p className="text-muted text-sm mb-0">Appointments</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon-wrapper" style={{ color: '#ff4757' }}>
                  <Star size={24} />
                </div>
                <div>
                  <h2 style={{ margin: 0, fontSize: '1.8rem' }}>0.0</h2>
                  <p className="text-muted text-sm mb-0">Average Rating</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon-wrapper" style={{ color: '#1e90ff' }}>
                  <Users size={24} />
                </div>
                <div>
                  <h2 style={{ margin: 0, fontSize: '1.8rem' }}>0</h2>
                  <p className="text-muted text-sm mb-0">Total Clients</p>
                </div>
              </div>
            </div>

            {/* Layout Grid for Tables/Info */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
              {/* Upcoming Appointments */}
              <div className="glass-card" style={{ padding: '1.5rem', borderRadius: '16px' }}>
                <div className="flex-between mb-4">
                  <h3 style={{ margin: 0 }}><Clock size={20} className="inline-icon text-accent" /> Upcoming Schedule</h3>
                  <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>View All</button>
                </div>
                
                <table className="appointment-table">
                  <thead>
                    <tr>
                      <th>Client</th>
                      <th>Service</th>
                      <th>Time</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td colSpan="4" className="text-center py-5 text-muted">
                        <CheckCircle2 size={40} className="mb-2 mx-auto opacity-50" />
                        <p>No appointments for today. You're all caught up!</p>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Business Info / Quick Actions */}
              <div className="glass-card" style={{ padding: '1.5rem', borderRadius: '16px' }}>
                <h3 style={{ margin: '0 0 15px' }}><MapPin size={20} className="inline-icon text-accent" /> Business Details</h3>
                
                <div className="mb-4">
                  <p className="text-sm text-muted mb-1">Location</p>
                  <p style={{ fontWeight: 500 }}>{user.location || 'No location set'}</p>
                </div>
                
                <div className="mb-4">
                  <p className="text-sm text-muted mb-1">Bio</p>
                  <p style={{ fontSize: '0.9rem', lineHeight: '1.5' }}>{user.bio || 'Tell clients about your business...'}</p>
                </div>

                <hr style={{ borderColor: 'rgba(255,255,255,0.05)', margin: '20px 0' }} />
                
                <button className="btn btn-secondary w-100 flex-center mb-2" style={{ gap: '8px' }}>
                  <Edit3 size={16} /> Edit Profile
                </button>
                <button className="btn btn-primary w-100 flex-center" style={{ gap: '8px' }}>
                  <Plus size={16} /> Add New Service
                </button>
              </div>
            </div>
          </>
        )}

        {activeTab === 'map' && (
          <div className="animate-fade-in">
            <div className="flex-between mb-3">
              <h2 style={{ margin: 0 }}>Client Coverage Map</h2>
              <div className="text-muted text-sm flex-center" style={{ gap: '5px' }}>
                <div style={{ width: '12px', height: '12px', background: '#2e86de', borderRadius: '50%' }}></div> Your Salon
                <div style={{ width: '12px', height: '12px', background: '#9c88ff', borderRadius: '50%', marginLeft: '10px' }}></div> Upcoming Clients
              </div>
            </div>
            <p className="text-muted mb-4">View where your upcoming clients are located for mobile services.</p>
            <MapWidget locations={mockClients} center={ACCRA_CENTER} zoom={13} height="500px" />
          </div>
        )}

        {/* Placeholders for other tabs */}
        {activeTab !== 'overview' && activeTab !== 'map' && (
          <div className="glass-card flex-center flex-column" style={{ padding: '5rem', borderRadius: '16px', minHeight: '400px' }}>
            <Settings size={48} className="text-muted mb-3 opacity-50" />
            <h2 className="text-muted">Module in Development</h2>
            <p className="text-muted">The {activeTab} section will be available soon.</p>
            <button className="btn btn-primary mt-3" onClick={() => setActiveTab('overview')}>Go Back to Overview</button>
          </div>
        )}
      </main>
    </div>
  );
}

export default ProviderDashboard;
