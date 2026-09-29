import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, MapPin, Clock, ArrowLeft, Check, Calendar as CalendarIcon, Heart, MessageSquare } from 'lucide-react';
import './ProviderProfile.css';

const formatTime = (timeString) => {
  if (!timeString) return '';
  const [hours, minutes] = timeString.split(':');
  const h = parseInt(hours, 10);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const displayH = h % 12 || 12;
  return `${displayH}:${minutes} ${ampm}`;
};

function ProviderProfile() {
  const { id } = useParams();
  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [selectedService, setSelectedService] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);

  useEffect(() => {
    const fetchProvider = async () => {
      try {
        setLoading(true);
        // If an ID is passed, fetch that specific provider. Otherwise, grab the first one (useful for testing with dummy data).
        const url = id 
          ? `http://localhost:3000/providers/${id}` 
          : 'http://localhost:3000/providers';
          
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch provider details');
        
        const data = await response.json();
        setProvider(Array.isArray(data) ? data[0] : data);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProvider();
  }, [id]);

  const handleBookClick = (service) => {
    setSelectedService(service);
    setShowBookingModal(true);
  };

  if (loading) return <div className="provider-profile page-wrapper container flex-center" style={{ minHeight: '60vh' }}>Loading provider...</div>;
  if (error) return <div className="provider-profile page-wrapper container flex-center text-danger" style={{ minHeight: '60vh' }}>{error}</div>;
  if (!provider) return <div className="provider-profile page-wrapper container flex-center" style={{ minHeight: '60vh' }}>Provider not found.</div>;

  return (
    <div className="provider-profile page-wrapper container animate-fade-in">
      <Link to="/" className="back-link">
        <ArrowLeft size={16} /> Back to search
      </Link>
      
      <div className="profile-header">
        <div className="profile-cover">
          <img src="https://images.unsplash.com/photo-1585747860715-2ba37e788b70?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" alt="Cover" />
        </div>
        
        <div className="profile-info-card glass-card">
          <div className="profile-title-group">
            <h1>{provider.business_name}</h1>
            <div className="badge badge-primary">{provider.category}</div>
          </div>
          
          <div className="profile-stats flex-center">
            <div className="stat-item flex-center">
              <Star size={16} className="star-icon" fill="currentColor" />
              <span className="stat-value">{provider.avg_rating}</span>
              <span className="stat-label">({provider.rating_count} reviews)</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item flex-center">
              <MapPin size={16} className="icon-muted" />
              <span className="stat-label">{provider.address}</span>
            </div>
          </div>
          
          <p className="profile-bio">
            {provider.bio}
          </p>
        </div>
      </div>

      <div className="profile-content">
        <div className="services-section">
          <h2>Services</h2>
          
          <div className="services-list">
            {provider.services?.map(service => (
              <div key={service.id} className="service-card glass-card">
                <div className="service-info">
                  <h3>{service.name}</h3>
                  <p className="service-desc">{service.description}</p>
                  <div className="service-meta flex-center">
                    <span className="service-duration flex-center">
                      <Clock size={14} /> {service.duration}
                    </span>
                  </div>
                </div>
                <div className="service-action">
                  <div className="service-price">₵{service.price}</div>
                  <button 
                    className="btn btn-primary"
                    onClick={() => handleBookClick(service)}
                  >
                    Book
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="portfolio-section mt-4">
          <h2>Portfolio & Feed</h2>
          <div className="portfolio-grid">
            {provider.portfolio?.map(post => (
              <div key={post.id} className="post-card glass-card">
                <div className="post-image">
                  <img src={post.image_url} alt="Work example" />
                  {post.service_tag && <div className="post-service-tag badge badge-primary">{post.service_tag}</div>}
                </div>
                <div className="post-content">
                  <p className="post-caption">{post.caption}</p>
                  <div className="post-actions flex-between">
                    <div className="action-group flex-center">
                      <button className="action-btn flex-center"><Heart size={18} /> <span className="action-count">{post.likes}</span></button>
                      <button className="action-btn flex-center"><MessageSquare size={18} /> <span className="action-count">{post.comments}</span></button>
                    </div>
                    {post.rating && (
                      <div className="post-rating flex-center">
                        <Star size={16} fill="#f59e0b" color="#f59e0b" /> <span className="text-sm">{post.rating}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="about-section mt-4">
          <div className="glass-card business-hours">
            <h3>Business Hours</h3>
            <ul className="hours-list">
              {provider.business_hours?.map(hour => (
                <li key={hour.id} className="flex-between">
                  <span>{hour.day_of_week}</span> 
                  {hour.is_closed ? (
                    <span className="text-muted">Closed</span>
                  ) : (
                    <span>{formatTime(hour.open_time)} - {formatTime(hour.close_time)}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {showBookingModal && (
        <div className="modal-overlay flex-center">
          <div className="modal-content glass-card animate-fade-in">
            <button className="modal-close" onClick={() => setShowBookingModal(false)}>×</button>
            <h2>Book Appointment</h2>
            
            <div className="selected-service-summary glass">
              <div className="flex-between">
                <h4>{selectedService?.name}</h4>
                <span>₵{selectedService?.price}</span>
              </div>
              <div className="text-muted text-sm">{selectedService?.duration}</div>
            </div>
            
            <div className="booking-step">
              <h3>Select Date & Time</h3>
              <div className="calendar-mockup">
                <div className="calendar-header flex-between">
                  <span>September 2026</span>
                  <div className="flex-center" style={{gap: '8px'}}>
                    <button className="calendar-nav-btn">&lt;</button>
                    <button className="calendar-nav-btn">&gt;</button>
                  </div>
                </div>
                <div className="calendar-grid">
                  {['S','M','T','W','T','F','S'].map(d => <div key={d} className="calendar-day-header">{d}</div>)}
                  {Array.from({length: 30}).map((_, i) => (
                    <div key={i} className={`calendar-day ${i === 14 ? 'selected' : ''} ${i < 10 ? 'disabled' : ''}`}>
                      {i + 1}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="time-slots">
                <button className="time-slot">10:00 AM</button>
                <button className="time-slot selected">11:30 AM</button>
                <button className="time-slot">1:00 PM</button>
                <button className="time-slot">2:30 PM</button>
              </div>
            </div>
            
            <button className="btn btn-accent book-confirm-btn" onClick={() => setShowBookingModal(false)}>
              <Check size={18} /> Confirm Booking
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProviderProfile;
