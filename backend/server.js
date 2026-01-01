require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { calculateDistance, calculateProviderEstimates, getWeather, bangaloreLocations } = require('./utils/calculations');
const { SearchHistory, PopularRoute } = require('./models/Search');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
app.use(express.json());

// MongoDB Connection
const connectDB = async () => {
  try {
    if (process.env.MONGODB_URI && process.env.MONGODB_URI !== 'mongodb+srv://username:password@cluster.mongodb.net/bangaloreflow?retryWrites=true&w=majority') {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log('✅ MongoDB Connected Successfully');
    } else {
      console.log('⚠️  MongoDB not configured - running without database');
    }
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    console.log('⚠️  Continuing without database...');
  }
};

connectDB();

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'BangaloreFlow API is running',
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
  });
});

// Get Available Locations
app.get('/api/locations', (req, res) => {
  const locations = Object.values(bangaloreLocations).map(loc => ({
    name: loc.name,
    coordinates: { lat: loc.lat, lng: loc.lng }
  }));
  
  res.json({
    success: true,
    count: locations.length,
    locations
  });
});

// Main Fare Comparison Endpoint
app.post('/api/fare', async (req, res) => {
  try {
    const { origin, destination, mood = 'neutral' } = req.body;
    
    // Validation
    if (!origin || !destination) {
      return res.status(400).json({
        success: false,
        error: 'Both origin and destination are required'
      });
    }
    
    if (origin.toLowerCase().trim() === destination.toLowerCase().trim()) {
      return res.status(400).json({
        success: false,
        error: 'Origin and destination cannot be the same'
      });
    }
    
    // Calculate distance
    const distanceData = await calculateDistance(
      origin,
      destination,
      process.env.GOOGLE_MAPS_API_KEY
    );
    
    if (!distanceData) {
      return res.status(500).json({
        success: false,
        error: 'Unable to calculate distance'
      });
    }
    
    const { distance, duration } = distanceData;
    
    // Get weather
    const weather = await getWeather(process.env.WEATHER_API_KEY);
    
    // Calculate provider estimates
    const providers = calculateProviderEstimates(distance, mood, weather.condition);
    
    // Save to database (if connected)
    if (mongoose.connection.readyState === 1) {
      try {
        // Save search history
        await SearchHistory.create({
          origin,
          destination,
          distance,
          mood
        });
        
        // Update popular routes
        const routeKey = `${origin.toLowerCase()} → ${destination.toLowerCase()}`;
        await PopularRoute.findOneAndUpdate(
          { route: routeKey },
          { 
            $inc: { count: 1 },
            $set: { lastSearched: new Date() }
          },
          { upsert: true }
        );
      } catch (dbError) {
        console.error('Database save error:', dbError.message);
        // Continue even if database save fails
      }
    }
    
    // Response
    res.json({
      success: true,
      data: {
        origin,
        destination,
        distance: Number(distance.toFixed(2)),
        estimatedDuration: duration ? Math.round(duration) : null,
        weather: {
          condition: weather.condition,
          temp: weather.temp,
          description: weather.description || 'Clear'
        },
        mood,
        providers,
        timestamp: new Date().toISOString()
      }
    });
    
  } catch (error) {
    console.error('Fare calculation error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
});

// Get Search History
app.get('/api/history', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        success: false,
        error: 'Database not connected'
      });
    }
    
    const limit = parseInt(req.query.limit) || 10;
    const history = await SearchHistory
      .find()
      .sort({ searchedAt: -1 })
      .limit(limit)
      .select('-__v');
    
    res.json({
      success: true,
      count: history.length,
      history
    });
  } catch (error) {
    console.error('History fetch error:', error);
    res.status(500).json({
      success: false,
      error: 'Unable to fetch history'
    });
  }
});

// Get Popular Routes
app.get('/api/popular-routes', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        success: false,
        error: 'Database not connected'
      });
    }
    
    const limit = parseInt(req.query.limit) || 5;
    const routes = await PopularRoute
      .find()
      .sort({ count: -1 })
      .limit(limit)
      .select('-__v');
    
    res.json({
      success: true,
      count: routes.length,
      routes
    });
  } catch (error) {
    console.error('Popular routes fetch error:', error);
    res.status(500).json({
      success: false,
      error: 'Unable to fetch popular routes'
    });
  }
});

// Analytics Endpoint
app.get('/api/analytics', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        success: false,
        error: 'Database not connected'
      });
    }
    
    const totalSearches = await SearchHistory.countDocuments();
    const todaySearches = await SearchHistory.countDocuments({
      searchedAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) }
    });
    
    const moodDistribution = await SearchHistory.aggregate([
      { $group: { _id: '$mood', count: { $sum: 1 } } }
    ]);
    
    const avgDistance = await SearchHistory.aggregate([
      { $group: { _id: null, avgDistance: { $avg: '$distance' } } }
    ]);
    
    res.json({
      success: true,
      analytics: {
        totalSearches,
        todaySearches,
        moodDistribution,
        averageDistance: avgDistance[0]?.avgDistance?.toFixed(2) || 0
      }
    });
  } catch (error) {
    console.error('Analytics fetch error:', error);
    res.status(500).json({
      success: false,
      error: 'Unable to fetch analytics'
    });
  }
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    availableEndpoints: [
      'GET /api/health',
      'GET /api/locations',
      'POST /api/fare',
      'GET /api/history',
      'GET /api/popular-routes',
      'GET /api/analytics'
    ]
  });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error('Unexpected error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║    🚀 BangaloreFlow API Server Running                   ║
║                                                           ║
║    📍 Port: ${PORT}                                        ║
║    🌍 Environment: ${process.env.NODE_ENV || 'development'}                           ║
║    🗄️  Database: ${mongoose.connection.readyState === 1 ? 'Connected    ' : 'Disconnected'}                          ║
║                                                           ║
║    📡 Available Endpoints:                                ║
║    • GET  /api/health                                     ║
║    • GET  /api/locations                                  ║
║    • POST /api/fare                                       ║
║    • GET  /api/history                                    ║
║    • GET  /api/popular-routes                             ║
║    • GET  /api/analytics                                  ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
  `);
});

module.exports = app;
