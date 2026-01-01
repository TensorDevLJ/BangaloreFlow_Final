const mongoose = require('mongoose');

// Search History Schema
const searchHistorySchema = new mongoose.Schema({
  origin: {
    type: String,
    required: true
  },
  destination: {
    type: String,
    required: true
  },
  distance: {
    type: Number,
    required: true
  },
  searchedAt: {
    type: Date,
    default: Date.now
  },
  selectedProvider: {
    type: String,
    default: null
  },
  mood: {
    type: String,
    enum: ['tired', 'stressed', 'energetic', 'happy', 'neutral'],
    default: 'neutral'
  }
});

// Index for faster queries
searchHistorySchema.index({ searchedAt: -1 });
searchHistorySchema.index({ origin: 1, destination: 1 });

const SearchHistory = mongoose.model('SearchHistory', searchHistorySchema);

// Popular Routes Schema (for analytics)
const popularRouteSchema = new mongoose.Schema({
  route: {
    type: String,
    required: true,
    unique: true
  },
  count: {
    type: Number,
    default: 1
  },
  lastSearched: {
    type: Date,
    default: Date.now
  }
});

const PopularRoute = mongoose.model('PopularRoute', popularRouteSchema);

module.exports = {
  SearchHistory,
  PopularRoute
};
