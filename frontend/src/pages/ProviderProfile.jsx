import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, MapPin, Clock, ArrowLeft, Check, Calendar as CalendarIcon } from 'lucide-react';
import './ProviderProfile.css';

const services = [
  { id: 1, name: 'Signature Haircut', duration: '45 min', price: '₵450', description: 'Premium haircut with hot towel finish.' },
  { id: 2, name: 'Beard Trim & Line Up', duration: '30 min', price: '₵250', description: 'Detailed beard sculpting with straight razor.' },
  { id: 3, name: 'The Full Experience', duration: '1 hr 15 min', price: '₵650', description: 'Haircut, beard trim, hot towel shave, and styling.' },
  { id: 4, name: 'Kids Haircut', duration: '30 min', price: '₵300', description: 'For children under 12.' }
];

function ProviderProfile() {
  const { id } = useParams();
  const [selectedService, setSelectedService] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);

  const handleBookClick = (service) => {
    setSelectedService(service);
    setShowBookingModal(true);
  };

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
            <h1>Fade & Flow Barbershop</h1>
            <div className="badge badge-primary">Barbershop</div>
          </div>
          
          <div className="profile-stats flex-center">
            <div className="stat-item flex-center">
              <Star size={16} className="star-icon" fill="currentColor" />
              <span className="stat-value">4.9</span>
              <span className="stat-label">(128 reviews)</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item flex-center">
              <MapPin size={16} className="icon-muted" />
              <span className="stat-label">Oxford Street, Osu, Accra</span>
            </div>
          </div>
          
          <p className="profile-bio">
            Premium grooming experience in the heart of the city. We specialize in classic cuts, modern fades, and straight razor shaves. Step in to relax, and step out looking your best.
          </p>
        </div>
      </div>

      <div className="profile-content">
        <div className="services-section">
          <h2>Services</h2>
          
          <div className="services-list">
            {services.map(service => (
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
                  <div className="service-price">{service.price}</div>
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
        
        <div className="about-section">
          <div className="glass-card business-hours">
            <h3>Business Hours</h3>
            <ul className="hours-list">
              <li className="flex-between"><span>Monday</span> <span className="text-muted">Closed</span></li>
              <li className="flex-between"><span>Tuesday</span> <span>9:00 AM - 7:00 PM</span></li>
              <li className="flex-between"><span>Wednesday</span> <span>9:00 AM - 7:00 PM</span></li>
              <li className="flex-between"><span>Thursday</span> <span>9:00 AM - 8:00 PM</span></li>
              <li className="flex-between"><span>Friday</span> <span>9:00 AM - 8:00 PM</span></li>
              <li className="flex-between"><span>Saturday</span> <span>10:00 AM - 6:00 PM</span></li>
              <li className="flex-between"><span>Sunday</span> <span>10:00 AM - 4:00 PM</span></li>
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
                <span>{selectedService?.price}</span>
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
