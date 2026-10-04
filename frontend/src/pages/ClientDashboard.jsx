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
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Cancellation State
  const [cancellingId, setCancellingId] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  
  const navigate = useNavigate();

  const ACCRA_CENTER = [5.6037, -0.1870];
  const [salons, setSalons] = useState([
    { lat: 5.6037, lng: -0.1870, title: 'Your Location', description: 'Current pinned location', isSelf: true }
  ]);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    // If no user exists, maybe mock it for now since we are in dev without fully strict auth
    if (!userData) {
      const mockUser = { name: 'Edwin Allotey', email: 'edwin@example.com', id: '11111111-1111-1111-1111-111111111111' };
      localStorage.setItem('user', JSON.stringify(mockUser));
      setUser(mockUser);
    } else {
      setUser(JSON.parse(userData));
    }
  }, [navigate]);

  useEffect(() => {
    if (user && activeTab === 'overview') {
      setLoading(true);
      fetch('http://localhost:3000/appointments/me')
        .then(res => res.json())
        .then(data => {
          setAppointments(data);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [user, activeTab]);

  useEffect(() => {
    if (user) {
      fetch('http://localhost:3000/providers')
        .then(res => res.json())
        .then(data => {
          const mapPins = data.map((p, i) => ({
            id: p.id,
            // Randomly scatter them around Accra center for demo purposes
            lat: ACCRA_CENTER[0] + (Math.random() - 0.5) * 0.04,
            lng: ACCRA_CENTER[1] + (Math.random() - 0.5) * 0.04,
            title: p.business_name,
            description: p.category,
            rating: p.avg_rating
          }));
          setSalons([
            { lat: ACCRA_CENTER[0], lng: ACCRA_CENTER[1], title: 'Your Location', description: 'Current pinned location', isSelf: true },
            ...mapPins
          ]);
        })
        .catch(err => console.error(err));
    }
  }, [user]);

  const handleCancelAppointment = async (id) => {
    if (!cancelReason.trim()) return alert('Please provide a reason for cancellation.');
    
    try {
      const res = await fetch(`http://localhost:3000/appointments/${id}/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: cancelReason, role: 'client' })
      });
      
      if (res.ok) {
        // Refresh appointments
        fetch('http://localhost:3000/appointments/me')
          .then(r => r.json())
          .then(data => setAppointments(data));
          
        setCancellingId(null);
        setCancelReason('');
        alert('Appointment successfully cancelled.');
      } else {
        alert('Failed to cancel appointment. It may already be cancelled.');
      }
    } catch (err) {
      console.error(err);
    }
  };

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
                <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }} onClick={() => setActiveTab('appointments')}>View All</button>
              </div>
              
              {loading ? (
                <div className="text-center py-5 text-muted">Loading appointments...</div>
              ) : appointments.length === 0 ? (
                <div className="empty-state text-muted mt-2 text-center py-5">
                  <CheckCircle2 size={48} className="mb-3 mx-auto opacity-50 text-primary" />
                  <h4 className="mb-2">No upcoming appointments</h4>
                  <p className="mb-4">You haven't booked anything yet. Discover top-rated salons near you!</p>
                  <button onClick={() => navigate('/')} className="btn btn-primary">Browse Salons</button>
                </div>
              ) : (
                <div className="appointments-list" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {appointments.slice(0, 3).map(apt => (
                    <div key={apt.id} className="appointment-card glass flex-between" style={{ padding: '16px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <div>
                        <h4 style={{ margin: '0 0 4px', fontSize: '1.1rem' }}>{apt.service?.name}</h4>
                        <div className="text-muted text-sm flex-center" style={{ gap: '16px' }}>
                          <span className="flex-center" style={{ gap: '6px' }}><User size={14} /> {apt.provider?.business_name}</span>
                          <span className="flex-center" style={{ gap: '6px' }}><Calendar size={14} /> {new Date(apt.start_time).toLocaleDateString()} at {new Date(apt.start_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="badge" style={{ background: apt.status === 'confirmed' ? 'rgba(16, 185, 129, 0.2)' : apt.status === 'cancelled' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(245, 158, 11, 0.2)', color: apt.status === 'confirmed' ? '#10b981' : apt.status === 'cancelled' ? '#ef4444' : '#f59e0b', padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '8px', display: 'inline-block' }}>
                          {apt.status}
                        </div>
                        <div style={{ fontWeight: '600', color: 'var(--primary-light)' }}>₵{apt.service?.price}</div>
                        {apt.status === 'cancelled' && apt.penalty_fee > 0 && (
                          <div style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: '4px' }}>Penalty: ₵{apt.penalty_fee}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
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
            <MapWidget locations={salons} center={ACCRA_CENTER} zoom={13} height="500px" />
          </div>
        )}

        {activeTab === 'appointments' && (
          <div className="animate-fade-in glass-card" style={{ padding: '2rem', borderRadius: '16px' }}>
            <h2 className="mb-4">My Appointments</h2>
            {loading ? (
              <div className="text-center py-5 text-muted">Loading appointments...</div>
            ) : appointments.length === 0 ? (
              <div className="empty-state text-muted text-center py-5">
                <Calendar size={48} className="mb-3 mx-auto opacity-50 text-primary" />
                <h4>No appointments found</h4>
                <p className="mb-4">Book your first service today.</p>
                <button onClick={() => navigate('/')} className="btn btn-primary">Find Salons</button>
              </div>
            ) : (
              <div className="appointments-grid" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {appointments.map(apt => (
                  <div key={apt.id} className="appointment-card glass-card" style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                      <div className="date-block text-center" style={{ background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '12px', minWidth: '80px' }}>
                        <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{new Date(apt.start_time).toLocaleString('default', { month: 'short' })}</div>
                        <div style={{ fontSize: '1.8rem', fontWeight: '700', color: '#fff', margin: '4px 0' }}>{new Date(apt.start_time).getDate()}</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--primary-light)' }}>{new Date(apt.start_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                      </div>
                      <div>
                        <h3 style={{ fontSize: '1.4rem', margin: '0 0 8px' }}>{apt.service?.name}</h3>
                        <p className="text-muted flex-center" style={{ gap: '6px', margin: '0 0 12px' }}><MapPin size={16} /> {apt.provider?.business_name} - {apt.provider?.address}</p>
                        <div className="badge" style={{ background: apt.status === 'confirmed' ? 'rgba(16, 185, 129, 0.2)' : apt.status === 'cancelled' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(245, 158, 11, 0.2)', color: apt.status === 'confirmed' ? '#10b981' : apt.status === 'cancelled' ? '#ef4444' : '#f59e0b', padding: '6px 12px', borderRadius: '6px', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                          Status: {apt.status}
                        </div>
                        {apt.status === 'cancelled' && apt.cancellation_reason && (
                          <div style={{ fontSize: '0.85rem', color: '#ef4444', marginTop: '10px', fontStyle: 'italic' }}>
                            Reason: "{apt.cancellation_reason}" {apt.penalty_fee > 0 ? ` (Penalty: ₵${apt.penalty_fee})` : ''}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-right" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px' }}>
                      <div style={{ fontSize: '1.8rem', fontWeight: '600', color: '#fff' }}>₵{apt.service?.price}</div>
                      <button className="btn btn-secondary flex-center" style={{ gap: '8px', padding: '10px 20px' }}>
                        <Clock size={16} /> {apt.service?.duration}
                      </button>
                      
                      {apt.status !== 'cancelled' && cancellingId !== apt.id && (
                        <button 
                          onClick={() => setCancellingId(apt.id)}
                          className="btn" 
                          style={{ background: 'transparent', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '6px 16px', fontSize: '0.85rem', marginTop: '10px' }}
                        >
                          Cancel Appointment
                        </button>
                      )}
                      
                      {cancellingId === apt.id && (
                        <div className="glass-card" style={{ padding: '15px', borderRadius: '8px', marginTop: '10px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', width: '250px', textAlign: 'left' }}>
                          <p style={{ margin: '0 0 10px', fontSize: '0.85rem', color: '#ef4444' }}>
                            <strong>Warning:</strong> Cancelling within 24 hours incurs a 20% penalty fee.
                          </p>
                          <textarea 
                            value={cancelReason}
                            onChange={(e) => setCancelReason(e.target.value)}
                            placeholder="Reason for cancellation..."
                            style={{ width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '8px', borderRadius: '4px', fontSize: '0.8rem', marginBottom: '10px', minHeight: '60px' }}
                          />
                          <div className="flex-between">
                            <button onClick={() => setCancellingId(null)} className="btn" style={{ fontSize: '0.75rem', padding: '4px 8px', background: 'transparent', color: '#fff' }}>Back</button>
                            <button onClick={() => handleCancelAppointment(apt.id)} className="btn btn-primary" style={{ fontSize: '0.75rem', padding: '4px 12px', background: '#ef4444', borderColor: '#ef4444' }}>Confirm Cancel</button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Placeholders for other tabs */}
        {activeTab !== 'overview' && activeTab !== 'map' && activeTab !== 'appointments' && (
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
