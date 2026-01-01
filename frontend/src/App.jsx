import React, { useState, useEffect } from 'react';
import { 
  Navigation, 
  MapPin, 
  ArrowRight, 
  Zap, 
  DollarSign, 
  Clock, 
  Heart,
  TrendingUp,
  Cloud,
  Sun,
  CloudRain,
  Smile,
  Frown,
  Meh,
  Battery,
  ExternalLink
} from 'lucide-react';
import { calculateFare, healthCheck } from './api';
import './App.css';

function App() {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [mood, setMood] = useState('neutral');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [apiStatus, setApiStatus] = useState('checking');

  useEffect(() => {
    checkAPI();
  }, []);

  const checkAPI = async () => {
    try {
      await healthCheck();
      setApiStatus('online');
    } catch (err) {
      setApiStatus('offline');
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!origin.trim() || !destination.trim()) {
      setError('Please enter both origin and destination');
      return;
    }

    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const data = await calculateFare(origin, destination, mood);
      if (data.success) {
        setResults(data.data);
      } else {
        setError(data.error || 'Failed to calculate fare');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Network error. Please check if backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const moods = [
    { value: 'neutral', label: 'Neutral', icon: Meh, color: '#a0a0a0' },
    { value: 'tired', label: 'Tired', icon: Battery, color: '#ff9500' },
    { value: 'stressed', label: 'Stressed', icon: Zap, color: '#ff3366' },
    { value: 'energetic', label: 'Energetic', icon: TrendingUp, color: '#00ff88' },
    { value: 'happy', label: 'Happy', icon: Smile, color: '#ffaa00' }
  ];

  const getProviderUrl = (provider) => {
    const urls = {
      'rapido_bike': 'https://www.rapido.bike/',
      'rapido_auto': 'https://www.rapido.bike/',
      'ola_auto': 'https://www.olacabs.com/',
      'ola_cab': 'https://www.olacabs.com/',
      'uber_auto': 'https://www.uber.com/',
      'uber_cab': 'https://www.uber.com/',
      'namma_yatri': 'https://nammayatri.in/',
      'metro': 'https://english.bmrc.co.in/',
      'bmtc': 'https://www.mybmtc.com/'
    };
    return urls[provider.id] || '#';
  };

  const getWeatherIcon = (condition) => {
    const icons = {
      clear: Sun,
      rain: CloudRain,
      clouds: Cloud
    };
    return icons[condition] || Sun;
  };

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="container">
          <div className="header-content">
            <div className="logo">
              <Navigation className="logo-icon" />
              <h1 className="logo-text">BangaloreFlow</h1>
            </div>
            <div className="api-status">
              <span className={`status-dot ${apiStatus}`}></span>
              <span className="status-text">{apiStatus === 'online' ? 'Live' : 'Offline'}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h2 className="hero-title">
              <span className="gradient-text">Smart Mobility</span>
              <br />
              Decision Platform
            </h2>
            <p className="hero-subtitle">
              Compare fares, times, and options across Bangalore's transport ecosystem. 
              Make smarter travel decisions instantly.
            </p>
          </div>
        </div>
      </section>

      {/* Search Form */}
      <section className="search-section">
        <div className="container">
          <form className="search-form" onSubmit={handleSearch}>
            <div className="input-grid">
              <div className="input-group">
                <label htmlFor="origin" className="input-label">
                  <MapPin size={16} />
                  Origin
                </label>
                <input
                  id="origin"
                  type="text"
                  className="input-field"
                  placeholder="e.g., Majestic"
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  disabled={loading}
                />
              </div>

              <div className="arrow-separator">
                <ArrowRight size={24} />
              </div>

              <div className="input-group">
                <label htmlFor="destination" className="input-label">
                  <MapPin size={16} />
                  Destination
                </label>
                <input
                  id="destination"
                  type="text"
                  className="input-field"
                  placeholder="e.g., National College Metro"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            {/* Mood Selection */}
            <div className="mood-section">
              <label className="mood-label">How are you feeling?</label>
              <div className="mood-grid">
                {moods.map((m) => {
                  const Icon = m.icon;
                  return (
                    <button
                      key={m.value}
                      type="button"
                      className={`mood-btn ${mood === m.value ? 'active' : ''}`}
                      onClick={() => setMood(m.value)}
                      disabled={loading}
                      style={{ '--mood-color': m.color }}
                    >
                      <Icon size={20} />
                      <span>{m.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <button 
              type="submit" 
              className="search-btn"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="spinner"></div>
                  <span>Calculating...</span>
                </>
              ) : (
                <>
                  <Zap size={20} />
                  <span>Compare Options</span>
                </>
              )}
            </button>
          </form>

          {error && (
            <div className="error-box">
              <p>{error}</p>
            </div>
          )}
        </div>
      </section>

      {/* Results Section */}
      {results && (
        <section className="results-section">
          <div className="container">
            {/* Trip Info */}
            <div className="trip-info">
              <div className="trip-route">
                <h3>{results.origin}</h3>
                <ArrowRight className="route-arrow" />
                <h3>{results.destination}</h3>
              </div>
              <div className="trip-stats">
                <div className="stat">
                  <Navigation size={16} />
                  <span>{results.distance} km</span>
                </div>
                {results.weather && (
                  <div className="stat">
                    {React.createElement(getWeatherIcon(results.weather.condition), { size: 16 })}
                    <span>{Math.round(results.weather.temp)}°C</span>
                  </div>
                )}
                {results.mood !== 'neutral' && (
                  <div className="stat mood-badge">
                    <Heart size={16} />
                    <span>{results.mood}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Provider Cards */}
            <div className="providers-grid">
              {results.providers.map((provider, index) => (
                <div 
                  key={provider.id} 
                  className="provider-card"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="provider-header">
                    <div className="provider-info">
                      <span className="provider-icon">{provider.icon}</span>
                      <div>
                        <h4 className="provider-name">{provider.name}</h4>
                        <p className="provider-type">{provider.type}</p>
                      </div>
                    </div>
                    {provider.tags && provider.tags.length > 0 && (
                      <div className="provider-tags">
                        {provider.tags.map((tag) => (
                          <span 
                            key={tag} 
                            className={`tag tag-${tag.toLowerCase().replace(' ', '-')}`}
                          >
                            {tag === 'Fastest' && <Zap size={12} />}
                            {tag === 'Cheapest' && <DollarSign size={12} />}
                            {tag === 'Mood Pick' && <Heart size={12} />}
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="provider-details">
                    <div className="detail-item">
                      <DollarSign size={18} className="detail-icon" />
                      <div>
                        <span className="detail-label">Fare</span>
                        <span className="detail-value">₹{provider.fare}</span>
                      </div>
                    </div>
                    <div className="detail-item">
                      <Clock size={18} className="detail-icon" />
                      <div>
                        <span className="detail-label">Time</span>
                        <span className="detail-value">{provider.eta} min</span>
                      </div>
                    </div>
                  </div>

                  {provider.features && (
                    <div className="provider-features">
                      {provider.features.map((feature) => (
                        <span key={feature} className="feature-badge">
                          {feature}
                        </span>
                      ))}
                    </div>
                  )}

                  <a 
                    href={getProviderUrl(provider)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="provider-action"
                  >
                    Open App
                    <ExternalLink size={16} />
                  </a>
                </div>
              ))}
            </div>

            {/* Disclaimer */}
            <div className="disclaimer">
              <p>
                <strong>Note:</strong> Fares and times are estimates based on average conditions. 
                Actual prices may vary. This platform does not book rides - you will be redirected 
                to the official provider apps.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <p>
            Built with <Heart size={14} style={{ display: 'inline', color: 'var(--accent-secondary)' }} /> for Bangalore By LikhithaJagadeesh
          </p>
          <p className="footer-note">
            BangaloreFlow is a decision-support platform. We don't book rides or store payment information.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
