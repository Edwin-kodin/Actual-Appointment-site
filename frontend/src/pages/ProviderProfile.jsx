import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, MapPin, Clock, ArrowLeft, Check, Calendar as CalendarIcon, Heart, MessageSquare } from 'lucide-react';
import './ProviderProfile.css';
import BookingModal from '../components/BookingModal';

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
  
  // Feed Interactions State
  const [activeCommentPostId, setActiveCommentPostId] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [likedPosts, setLikedPosts] = useState([]); // Track which posts the user has liked

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

  const handleLike = async (postId) => {
    // Prevent multiple likes from the same user session
    if (likedPosts.includes(postId)) return;
    
    try {
      const res = await fetch(`http://localhost:3000/providers/portfolio/${postId}/like`, { method: 'POST' });
      if (res.ok) {
        // Optimistically update UI
        setLikedPosts([...likedPosts, postId]);
        setProvider(prev => ({
          ...prev,
          portfolio: prev.portfolio.map(post => post.id === postId ? { ...post, likes: post.likes + 1 } : post)
        }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCommentSubmit = async (postId) => {
    if (!commentText.trim()) return;
    
    try {
      const res = await fetch(`http://localhost:3000/providers/portfolio/${postId}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: commentText })
      });
      
      if (res.ok) {
        const updatedPost = await res.json();
        // Update specific post in the provider state
        setProvider(prev => ({
          ...prev,
          portfolio: prev.portfolio.map(post => post.id === postId ? updatedPost : post)
        }));
        setCommentText('');
      }
    } catch (err) {
      console.error(err);
    }
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
          <img src="/images/barbershop_cover.jpg" alt="Cover" />
        </div>
        
        <div className="profile-info-card glass-card">
          <div className="profile-title-group">
            <h1>{provider.business_name}</h1>
            <div className="badge badge-primary">{provider.category}</div>
          </div>
          
          <div className="profile-stats flex-center">
            <div className="stat-item flex-center">
              <Star size={16} className="star-icon" fill="currentColor" />
              <span className="stat-value">{Number(provider.avg_rating).toFixed(1)}</span>
              <span className="stat-label">({provider.rating_count} reviews)</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item flex-center">
              <MapPin size={16} className="icon-muted" />
              <span className="stat-label">{provider.address}</span>
            </div>
          </div>
          
          <p className="profile-bio">
            {provider.bio || "No bio available."}
          </p>
          
          {/* Global Book Button */}
          {provider.services?.length > 0 && (
            <div className="profile-actions mt-4 flex-center">
              <button 
                className="btn btn-accent book-main-btn"
                onClick={() => handleBookClick(provider.services[0])}
              >
                <CalendarIcon size={18} /> Book Appointment
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="profile-content">
        <div className="left-column">
          <div className="services-section">
            <h2>Services</h2>
            
            <div className="services-list">
              {(!provider.services || provider.services.length === 0) ? (
                <div className="empty-state glass-card">
                  <p className="text-muted">No services listed yet.</p>
                </div>
              ) : (
                provider.services.map(service => (
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
                ))
              )}
            </div>
          </div>
          
          <div className="portfolio-section mt-4">
            <h2>Portfolio & Feed</h2>
            <div className="portfolio-grid">
              {(!provider.portfolio || provider.portfolio.length === 0) ? (
                <div className="empty-state glass-card" style={{gridColumn: '1 / -1'}}>
                  <p className="text-muted">No portfolio items yet.</p>
                </div>
              ) : (
                provider.portfolio.map(post => (
                  <div key={post.id} className="post-card glass-card">
                    <div className="post-image">
                      <img src={post.image_url.includes('unsplash') ? (post.service_tag === 'Beard Trim' ? '/images/beard_trim.jpg' : '/images/fade_haircut.jpg') : post.image_url} alt="Work example" />
                      {post.service_tag && <div className="post-service-tag badge badge-primary">{post.service_tag}</div>}
                    </div>
                    <div className="post-content">
                      <p className="post-caption">{post.caption}</p>
                      <div className="post-actions flex-between">
                        <div className="action-group flex-center">
                          <button onClick={() => handleLike(post.id)} className="action-btn flex-center" style={{ cursor: 'pointer', background: 'transparent', border: 'none', color: likedPosts.includes(post.id) ? '#ef4444' : 'inherit' }}>
                            <Heart size={18} fill={likedPosts.includes(post.id) ? '#ef4444' : 'transparent'} /> <span className="action-count">{post.likes}</span>
                          </button>
                          <button onClick={() => setActiveCommentPostId(activeCommentPostId === post.id ? null : post.id)} className="action-btn flex-center" style={{ cursor: 'pointer', background: 'transparent', border: 'none', color: 'inherit' }}>
                            <MessageSquare size={18} /> <span className="action-count">{post.comments}</span>
                          </button>
                        </div>
                        {post.rating && (
                          <div className="post-rating flex-center">
                            <Star size={16} fill="#f59e0b" color="#f59e0b" /> <span className="text-sm">{post.rating}</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Comments Section */}
                      {activeCommentPostId === post.id && (
                        <div className="comments-section" style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                          <div className="comments-list" style={{ maxHeight: '150px', overflowY: 'auto', marginBottom: '10px' }}>
                            {(!post.comments_list || post.comments_list.length === 0) ? (
                              <p className="text-muted text-sm text-center">No comments yet. Be the first!</p>
                            ) : (
                              post.comments_list.map((c, i) => (
                                <div key={i} style={{ marginBottom: '8px', fontSize: '0.85rem' }}>
                                  <strong style={{ color: 'var(--primary-light)' }}>{c.userName}</strong> <span className="text-muted text-sm">{new Date(c.createdAt).toLocaleDateString()}</span>
                                  <p style={{ margin: '2px 0 0' }}>{c.text}</p>
                                </div>
                              ))
                            )}
                          </div>
                          <div className="comment-input-area flex-center" style={{ gap: '8px' }}>
                            <input 
                              type="text" 
                              className="input-field" 
                              placeholder="Add a comment..." 
                              value={commentText}
                              onChange={(e) => setCommentText(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleCommentSubmit(post.id)}
                              style={{ padding: '8px 12px', fontSize: '0.85rem' }}
                            />
                            <button onClick={() => handleCommentSubmit(post.id)} className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>Post</button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
        
        <div className="about-section mt-4">
          <div className="glass-card business-hours">
            <h3>Business Hours</h3>
            {(!provider.business_hours || provider.business_hours.length === 0) ? (
              <p className="text-muted text-sm text-center py-4">Hours not set</p>
            ) : (
              <ul className="hours-list">
                {provider.business_hours.map(hour => (
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
            )}
          </div>
        </div>
      </div>

      {showBookingModal && (
        <BookingModal 
          provider={provider} 
          service={selectedService} 
          onClose={() => setShowBookingModal(false)} 
        />
      )}
    </div>
  );
}

export default ProviderProfile;
