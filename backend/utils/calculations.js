const axios = require('axios');

// Haversine formula for calculating distance between two coordinates
function calculateHaversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of Earth in kilometers
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return distance;
}

function toRad(degrees) {
  return degrees * (Math.PI / 180);
}

// Bangalore landmarks with coordinates (for demo purposes)
const bangaloreLocations = {
  'majestic': { lat: 12.9767, lng: 77.5709, name: 'Majestic' },
  'national college metro': { lat: 12.9656, lng: 77.5960, name: 'National College Metro Station' },
  'koramangala': { lat: 12.9352, lng: 77.6245, name: 'Koramangala' },
  'indiranagar': { lat: 12.9716, lng: 77.6412, name: 'Indiranagar' },
  'whitefield': { lat: 12.9698, lng: 77.7500, name: 'Whitefield' },
  'electronic city': { lat: 12.8456, lng: 77.6603, name: 'Electronic City' },
  'hebbal': { lat: 13.0358, lng: 77.5970, name: 'Hebbal' },
  'jp nagar': { lat: 12.9081, lng: 77.5850, name: 'JP Nagar' },
  'marathahalli': { lat: 12.9591, lng: 77.7010, name: 'Marathahalli' },
  'yeswanthpur': { lat: 13.0227, lng: 77.5363, name: 'Yeswanthpur' },
  'mg road': { lat: 12.9750, lng: 77.6070, name: 'MG Road' },
  'brigade road': { lat: 12.9720, lng: 77.6070, name: 'Brigade Road' },
  'residency road': { lat: 12.9716, lng: 77.6214, name: 'Residency Road' },
  'kr market': { lat: 12.9591, lng: 77.5723, name: 'KR Market' },
  'silk board': { lat: 12.9180, lng: 77.6236, name: 'Silk Board' }
};

// Find location coordinates from name
function getLocationCoordinates(locationName) {
  const normalized = locationName.toLowerCase().trim();
  
  // Check if it's a known location
  if (bangaloreLocations[normalized]) {
    return bangaloreLocations[normalized];
  }
  
  // Check for partial matches
  for (const [key, value] of Object.entries(bangaloreLocations)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return value;
    }
  }
  
  return null;
}

// Calculate distance using Google Maps Distance Matrix API
async function calculateDistanceGoogle(origin, destination, apiKey) {
  try {
    const response = await axios.get('https://maps.googleapis.com/maps/api/distancematrix/json', {
      params: {
        origins: origin,
        destinations: destination,
        key: apiKey,
        mode: 'driving'
      }
    });
    
    if (response.data.status === 'OK' && response.data.rows[0].elements[0].status === 'OK') {
      const distance = response.data.rows[0].elements[0].distance.value / 1000; // Convert to km
      const duration = response.data.rows[0].elements[0].duration.value / 60; // Convert to minutes
      return { distance, duration };
    }
    
    return null;
  } catch (error) {
    console.error('Google Maps API error:', error.message);
    return null;
  }
}

// Calculate distance (with fallback)
async function calculateDistance(origin, destination, apiKey) {
  // Try Google Maps API first if available
  if (apiKey && apiKey !== 'your_google_maps_api_key_here') {
    const googleResult = await calculateDistanceGoogle(origin, destination, apiKey);
    if (googleResult) {
      return googleResult;
    }
  }
  
  // Fallback to Haversine formula with known locations
  const originCoords = getLocationCoordinates(origin);
  const destCoords = getLocationCoordinates(destination);
  
  if (originCoords && destCoords) {
    const distance = calculateHaversineDistance(
      originCoords.lat,
      originCoords.lng,
      destCoords.lat,
      destCoords.lng
    );
    return { distance, duration: null };
  }
  
  // Default fallback (estimate based on Bangalore average)
  return { distance: 8.5, duration: null };
}

// Provider configurations
const providerConfigs = {
  rapido_bike: {
    name: 'Rapido',
    type: 'bike',
    baseFare: 25,
    perKm: 9,
    perMin: 1,
    avgSpeed: 30, // km/h
    color: '#FFD700',
    icon: '🏍️'
  },
  rapido_auto: {
    name: 'Rapido',
    type: 'auto',
    baseFare: 30,
    perKm: 12,
    perMin: 1.5,
    avgSpeed: 22,
    color: '#FFD700',
    icon: '🛺'
  },
  ola_auto: {
    name: 'Ola',
    type: 'auto',
    baseFare: 35,
    perKm: 13,
    perMin: 1.5,
    avgSpeed: 22,
    color: '#00E700',
    icon: '🛺'
  },
  ola_cab: {
    name: 'Ola',
    type: 'cab',
    baseFare: 50,
    perKm: 15,
    perMin: 2,
    avgSpeed: 25,
    color: '#00E700',
    icon: '🚗'
  },
  uber_auto: {
    name: 'Uber',
    type: 'auto',
    baseFare: 38,
    perKm: 13.5,
    perMin: 1.5,
    avgSpeed: 22,
    color: '#000000',
    icon: '🛺'
  },
  uber_cab: {
    name: 'Uber',
    type: 'cab',
    baseFare: 55,
    perKm: 16,
    perMin: 2,
    avgSpeed: 25,
    color: '#000000',
    icon: '🚗'
  },
  namma_yatri: {
    name: 'Namma Yatri',
    type: 'auto',
    baseFare: 30,
    perKm: 11,
    perMin: 1.5,
    avgSpeed: 22,
    color: '#FF6B35',
    icon: '🛺'
  }
};

// Metro fare calculation (slab-based)
function calculateMetroFare(distance) {
  if (distance <= 2) return 10;
  if (distance <= 4) return 15;
  if (distance <= 6) return 20;
  if (distance <= 8) return 25;
  if (distance <= 10) return 30;
  if (distance <= 15) return 40;
  return 50;
}

// BMTC Bus fare calculation
function calculateBMTCFare(distance) {
  if (distance <= 5) return 10;
  if (distance <= 10) return 15;
  if (distance <= 15) return 20;
  if (distance <= 20) return 25;
  return 30;
}

// Calculate fare and time for all providers
function calculateProviderEstimates(distance, mood = 'neutral', weather = 'clear') {
  const providers = [];
  
  // Ride-hailing providers
  for (const [key, config] of Object.entries(providerConfigs)) {
    const estimatedTime = (distance / config.avgSpeed) * 60; // minutes
    const fare = Math.round(config.baseFare + (config.perKm * distance) + (config.perMin * estimatedTime));
    
    // Weather-based exclusions
    if (weather === 'rain' && config.type === 'bike') {
      continue; // Skip bikes in rain
    }
    
    providers.push({
      id: key,
      name: config.name,
      type: config.type,
      fare: fare,
      eta: Math.round(estimatedTime),
      color: config.color,
      icon: config.icon,
      features: getProviderFeatures(config.type)
    });
  }
  
  // Metro
  const metroTime = (distance / 35) * 60 + 10; // +10 min for wait/walk
  providers.push({
    id: 'metro',
    name: 'Namma Metro',
    type: 'metro',
    fare: calculateMetroFare(distance),
    eta: Math.round(metroTime),
    color: '#9C27B0',
    icon: '🚇',
    features: ['AC', 'Reliable', 'No Traffic']
  });
  
  // BMTC Bus
  const busTime = (distance / 18) * 60 + 12; // +12 min for wait/stops
  providers.push({
    id: 'bmtc',
    name: 'BMTC Bus',
    type: 'bus',
    fare: calculateBMTCFare(distance),
    eta: Math.round(busTime),
    color: '#4CAF50',
    icon: '🚌',
    features: ['Eco-friendly', 'Budget', 'Frequent']
  });
  
  // Sort and tag providers
  return tagProviders(providers, mood);
}

// Get provider features based on type
function getProviderFeatures(type) {
  const features = {
    bike: ['Fast', 'Flexible', 'Solo'],
    auto: ['Shared', 'Affordable', 'Quick'],
    cab: ['Comfortable', 'AC', 'Safe'],
    metro: ['AC', 'Reliable', 'No Traffic'],
    bus: ['Eco-friendly', 'Budget', 'Frequent']
  };
  return features[type] || [];
}

// Tag providers based on criteria
function tagProviders(providers, mood) {
  // Find fastest
  const fastest = providers.reduce((min, p) => p.eta < min.eta ? p : min, providers[0]);
  fastest.tags = fastest.tags || [];
  fastest.tags.push('Fastest');
  
  // Find cheapest
  const cheapest = providers.reduce((min, p) => p.fare < min.fare ? p : min, providers[0]);
  cheapest.tags = cheapest.tags || [];
  cheapest.tags.push('Cheapest');
  
  // Find balanced (best time-to-cost ratio)
  const balanced = providers.reduce((best, p) => {
    const pScore = p.fare / p.eta;
    const bestScore = best.fare / best.eta;
    return pScore < bestScore ? p : best;
  }, providers[0]);
  balanced.tags = balanced.tags || [];
  if (!balanced.tags.includes('Fastest') && !balanced.tags.includes('Cheapest')) {
    balanced.tags.push('Balanced');
  }
  
  // Mood-based recommendations
  const moodRecommendations = {
    tired: ['metro', 'cab', 'uber_cab', 'ola_cab'],
    stressed: providers.filter(p => p.tags && p.tags.includes('Fastest')).map(p => p.id),
    energetic: ['bike', 'rapido_bike'],
    happy: providers.filter(p => p.tags && p.tags.includes('Cheapest')).map(p => p.id)
  };
  
  if (mood !== 'neutral' && moodRecommendations[mood]) {
    providers.forEach(p => {
      if (moodRecommendations[mood].includes(p.id) || moodRecommendations[mood].includes(p.type)) {
        p.tags = p.tags || [];
        if (!p.tags.includes('Mood Pick')) {
          p.tags.push('Mood Pick');
        }
      }
    });
  }
  
  // Sort by ETA (fastest first)
  return providers.sort((a, b) => a.eta - b.eta);
}

// Get weather information
async function getWeather(apiKey) {
  if (!apiKey || apiKey === 'your_openweather_api_key_here') {
    return { condition: 'clear', temp: 25 }; // Default
  }
  
  try {
    const response = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
      params: {
        q: 'Bangalore,IN',
        appid: apiKey,
        units: 'metric'
      }
    });
    
    return {
      condition: response.data.weather[0].main.toLowerCase(),
      temp: response.data.main.temp,
      description: response.data.weather[0].description
    };
  } catch (error) {
    console.error('Weather API error:', error.message);
    return { condition: 'clear', temp: 25 };
  }
}

module.exports = {
  calculateDistance,
  calculateProviderEstimates,
  getWeather,
  getLocationCoordinates,
  bangaloreLocations
};
