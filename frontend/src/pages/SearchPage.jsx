import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Star, Filter, ArrowRight } from 'lucide-react';
import './SearchPage.css';

const mockProviders = [
  {
    id: 1,
    name: 'Fade & Flow Barbershop',
    type: 'Barbershop',
    rating: 4.9,
    reviews: 128,
    distance: '1.2 km',
    image: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    tags: ['Haircut', 'Beard Trim', 'Styling']
  },
  {
    id: 2,
    name: 'Lumiere Salon',
    type: 'Hair Salon',
    rating: 4.8,
    reviews: 94,
    distance: '2.0 km',
    image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    tags: ['Color', 'Blowout', 'Extensions']
  },
  {
    id: 3,
    name: 'The Grooming Lounge',
    type: 'Barber & Spa',
    rating: 4.7,
    reviews: 215,
    distance: '4.0 km',
    image: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    tags: ['Hot Towel', 'Shave', 'Facial']
  }
];

function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="search-page">
      <div className="search-hero">
        <div className="container">
          <h1 className="hero-title animate-fade-in">
            Discover and book the <br/>
            <span className="text-gradient-primary">best beauty pros</span> near you.
          </h1>
          
          <div className="search-bar glass-card animate-fade-in" style={{animationDelay: '0.1s'}}>
            <div className="search-input-group">
              <Search className="search-icon" size={20} />
              <input 
                type="text" 
                placeholder="What service are you looking for?" 
                className="search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="search-divider"></div>
            <div className="search-input-group">
              <MapPin className="search-icon" size={20} />
              <input 
                type="text" 
                placeholder="Current location" 
                className="search-input"
                defaultValue="Accra, Ghana"
              />
            </div>
            <button className="btn btn-primary search-btn">
              Search
            </button>
          </div>
          
          <div className="popular-tags animate-fade-in" style={{animationDelay: '0.2s'}}>
            <span className="tag-label">Popular:</span>
            <span className="badge badge-primary">Fade</span>
            <span className="badge badge-primary">Balayage</span>
            <span className="badge badge-primary">Braids</span>
            <span className="badge badge-primary">Nails</span>
          </div>
        </div>
      </div>

      <div className="search-layout container">
        <div className="results-section">
          <div className="results-header flex-between">
            <h2>{mockProviders.length} professionals nearby</h2>
            <button className="btn btn-secondary filter-btn">
              <Filter size={16} /> Filters
            </button>
          </div>
          
          <div className="providers-grid">
            {mockProviders.map((provider) => (
              <Link to={`/provider/${provider.id}`} key={provider.id} className="provider-card glass-card">
                <div className="provider-image-container">
                  <img src={provider.image} alt={provider.name} className="provider-image" />
                  <div className="provider-distance glass">
                    <MapPin size={12} /> {provider.distance}
                  </div>
                </div>
                <div className="provider-info">
                  <div className="provider-type">{provider.type}</div>
                  <h3 className="provider-name">{provider.name}</h3>
                  <div className="provider-rating flex-center">
                    <Star size={14} className="star-icon" fill="currentColor" />
                    <span className="rating-score">{provider.rating}</span>
                    <span className="rating-count">({provider.reviews} reviews)</span>
                  </div>
                  <div className="provider-tags">
                    {provider.tags.map(tag => (
                      <span key={tag} className="service-tag">{tag}</span>
                    ))}
                  </div>
                </div>
                <div className="provider-footer">
                  <span className="book-text">Book now</span>
                  <ArrowRight size={16} className="arrow-icon" />
                </div>
              </Link>
            ))}
          </div>
        </div>
        
        <div className="map-section glass-card map-container">
          {/* Map Placeholder */}
          <div className="map-overlay-content">
            <button className="btn btn-primary map-btn">
              Search this area
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchPage;
