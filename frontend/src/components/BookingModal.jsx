import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock, Check, X, Loader } from 'lucide-react';
import './BookingModal.css';

const BookingModal = ({ provider, service, onClose }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [bookingStatus, setBookingStatus] = useState('idle'); // idle, loading, success, error
  const [errorMsg, setErrorMsg] = useState('');

  const currentMonth = selectedDate.getMonth();
  const currentYear = selectedDate.getFullYear();

  // Generate days for calendar
  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();
  
  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

  const calendarDays = [];
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i);
  }

  // Generate slots mockup or fetch from API
  useEffect(() => {
    if (!selectedDate) return;
    
    const fetchAvailability = async () => {
      setLoadingSlots(true);
      try {
        const dateStr = selectedDate.toISOString().split('T')[0];
        const res = await fetch(`http://localhost:3000/appointments/availability/${provider.id}?date=${dateStr}`);
        
        if (!res.ok) throw new Error('Failed to fetch availability');
        
        const data = await res.json();
        
        if (!data.businessHour || data.availableSlots?.length === 0) {
          setAvailableSlots([]);
          setSelectedTime(null);
          return;
        }

        // Parse open and close times (assuming "HH:MM:SS" format)
        const openTimeParts = data.businessHour.open_time.split(':');
        const closeTimeParts = data.businessHour.close_time.split(':');
        const openHour = parseInt(openTimeParts[0], 10);
        const openMin = parseInt(openTimeParts[1], 10);
        const closeHour = parseInt(closeTimeParts[0], 10);
        const closeMin = parseInt(closeTimeParts[1], 10);

        // Generate mock slots every 30 mins
        const generatedSlots = [];
        let currentHour = openHour;
        let currentMin = openMin;

        while (currentHour < closeHour || (currentHour === closeHour && currentMin < closeMin)) {
          const ampm = currentHour >= 12 ? 'PM' : 'AM';
          const displayH = currentHour % 12 || 12;
          const displayM = currentMin === 0 ? '00' : '30';
          const timeString = `${displayH}:${displayM} ${ampm}`;
          
          // Basic conflict check
          // In a real scenario we parse bookedAppointments and check overlap
          // For simplicity we'll just check if start time precisely matches
          // data.bookedAppointments has { startTime, endTime } iso strings
          const conflict = data.bookedAppointments?.some(appt => {
            const apptDate = new Date(appt.startTime);
            return apptDate.getHours() === currentHour && apptDate.getMinutes() === currentMin;
          });

          if (!conflict) {
            generatedSlots.push(timeString);
          }

          currentMin += 30;
          if (currentMin >= 60) {
            currentHour += 1;
            currentMin -= 60;
          }
        }
        
        setAvailableSlots(generatedSlots);
        setSelectedTime(null);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingSlots(false);
      }
    };
    
    fetchAvailability();
  }, [selectedDate, provider.id]);

  const handleBook = async () => {
    if (!selectedTime) return;
    setBookingStatus('loading');
    
    try {
      // Parse selectedTime back into a Date object for startTime
      const [time, modifier] = selectedTime.split(' ');
      let [hours, minutes] = time.split(':');
      hours = parseInt(hours, 10);
      if (modifier === 'PM' && hours < 12) hours += 12;
      if (modifier === 'AM' && hours === 12) hours = 0;
      
      const startTime = new Date(selectedDate);
      startTime.setHours(hours, parseInt(minutes, 10), 0, 0);

      const res = await fetch('http://localhost:3000/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          providerId: provider.id,
          serviceId: service.id,
          startTime: startTime.toISOString()
        })
      });

      if (!res.ok) throw new Error('Booking failed');
      
      setBookingStatus('success');
    } catch (err) {
      setBookingStatus('error');
      setErrorMsg('Failed to complete booking. Please try again.');
    }
  };

  const handlePrevMonth = () => {
    setSelectedDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const handleNextMonth = () => {
    setSelectedDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const isPastDay = (day) => {
    const today = new Date();
    today.setHours(0,0,0,0);
    const checkDate = new Date(currentYear, currentMonth, day);
    return checkDate < today;
  };

  return (
    <div className="modal-overlay flex-center">
      <div className="modal-content glass-card animate-fade-in booking-engine-modal">
        <button className="modal-close" onClick={onClose}><X size={20} /></button>
        
        {bookingStatus === 'success' ? (
          <div className="booking-success-state flex-center flex-column">
            <div className="success-icon-wrapper">
              <Check size={40} className="success-icon" />
            </div>
            <h2>Booking Confirmed!</h2>
            <p className="text-muted">You are all set for {service.name} with {provider.business_name}.</p>
            <div className="appointment-details-card glass">
              <div className="detail-row">
                <CalendarIcon size={16} />
                <span>{selectedDate.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</span>
              </div>
              <div className="detail-row">
                <Clock size={16} />
                <span>{selectedTime}</span>
              </div>
            </div>
            <button className="btn btn-primary mt-4" onClick={onClose}>Done</button>
          </div>
        ) : (
          <>
            <h2 className="modal-title">Book Appointment</h2>
            
            <div className="selected-service-summary glass">
              <div className="service-header flex-between">
                <h4>{service.name}</h4>
                <span className="price-tag">₵{service.price}</span>
              </div>
              <div className="text-muted text-sm flex-center" style={{gap: '6px'}}>
                <Clock size={14} /> {service.duration}
              </div>
            </div>
            
            <div className="booking-layout">
              <div className="booking-calendar-section">
                <h3 className="section-title">Select Date</h3>
                <div className="calendar-widget glass">
                  <div className="calendar-header flex-between">
                    <span className="calendar-month-year">
                      {selectedDate.toLocaleString('default', { month: 'long' })} {currentYear}
                    </span>
                    <div className="calendar-nav flex-center">
                      <button className="calendar-nav-btn" onClick={handlePrevMonth}>&lt;</button>
                      <button className="calendar-nav-btn" onClick={handleNextMonth}>&gt;</button>
                    </div>
                  </div>
                  
                  <div className="calendar-grid">
                    {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => (
                      <div key={d} className="calendar-day-header">{d}</div>
                    ))}
                    
                    {calendarDays.map((day, idx) => {
                      if (!day) return <div key={`empty-${idx}`} className="calendar-day empty"></div>;
                      
                      const isSelected = selectedDate.getDate() === day;
                      const disabled = isPastDay(day);
                      
                      return (
                        <div 
                          key={day} 
                          className={`calendar-day ${isSelected ? 'selected' : ''} ${disabled ? 'disabled' : 'selectable'}`}
                          onClick={() => !disabled && setSelectedDate(new Date(currentYear, currentMonth, day))}
                        >
                          {day}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              
              <div className="booking-time-section">
                <h3 className="section-title">Available Times</h3>
                
                <div className="time-slots-container glass">
                  {loadingSlots ? (
                    <div className="loading-slots flex-center">
                      <Loader size={24} className="spin-anim" />
                    </div>
                  ) : availableSlots.length === 0 ? (
                    <div className="no-slots text-muted text-sm">No availability on this date.</div>
                  ) : (
                    <div className="time-slots">
                      {availableSlots.map(time => (
                        <button 
                          key={time}
                          className={`time-slot ${selectedTime === time ? 'selected' : ''}`}
                          onClick={() => setSelectedTime(time)}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {bookingStatus === 'error' && <div className="error-msg text-danger mt-2">{errorMsg}</div>}
            
            <div className="booking-footer flex-between mt-4">
              <div className="total-section">
                <span className="text-muted text-sm">Total</span>
                <div className="total-price">₵{service.price}</div>
              </div>
              <button 
                className={`btn btn-accent book-confirm-btn ${(!selectedTime || bookingStatus === 'loading') ? 'disabled' : ''}`} 
                onClick={handleBook}
                disabled={!selectedTime || bookingStatus === 'loading'}
              >
                {bookingStatus === 'loading' ? <Loader size={18} className="spin-anim" /> : <><Check size={18} /> Confirm Booking</>}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BookingModal;
