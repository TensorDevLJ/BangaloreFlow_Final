# 📐 BangaloreFlow - Technical Architecture

## System Overview

BangaloreFlow is a full-stack web application that provides mobility decision support for Bangalore users. It compares transportation options across multiple providers and recommends the best choice based on fare, time, and user preferences.

## Technology Stack

### Frontend
- **Framework**: React 18.2
- **Build Tool**: Vite 5.0
- **Styling**: Custom CSS (Brutalist-Modern design)
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **State Management**: React Hooks (useState, useEffect)

### Backend
- **Runtime**: Node.js 16+
- **Framework**: Express 4.18
- **Database**: MongoDB (via Mongoose ODM)
- **APIs**: Google Maps (optional), OpenWeather (optional)
- **CORS**: Enabled for cross-origin requests

### Database
- **Type**: NoSQL (MongoDB)
- **Hosting**: MongoDB Atlas (Free M0 tier)
- **Models**: SearchHistory, PopularRoute

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    User Browser                          │
│                                                           │
│  ┌──────────────────────────────────────────────────┐  │
│  │         React Application (SPA)                   │  │
│  │  • Search Form                                     │  │
│  │  • Results Display                                 │  │
│  │  • Mood Selection                                  │  │
│  │  • Provider Cards                                  │  │
│  └────────────────┬─────────────────────────────────┘  │
└────────────────────┼──────────────────────────────────────┘
                     │
                     │ HTTP/REST API
                     │ (JSON)
                     ↓
┌─────────────────────────────────────────────────────────┐
│                 Express.js Server                        │
│                                                           │
│  ┌──────────────────────────────────────────────────┐  │
│  │              API Endpoints                        │  │
│  │  • POST /api/fare                                 │  │
│  │  • GET  /api/health                               │  │
│  │  • GET  /api/history                              │  │
│  │  • GET  /api/popular-routes                       │  │
│  │  • GET  /api/analytics                            │  │
│  └────────────────┬─────────────────────────────────┘  │
│                   │                                       │
│  ┌────────────────┴─────────────────────────────────┐  │
│  │         Business Logic Layer                      │  │
│  │  • Distance Calculation                           │  │
│  │  • Fare Calculation                               │  │
│  │  • Provider Ranking                               │  │
│  │  • Mood-based Recommendations                     │  │
│  └────────────────┬─────────────────────────────────┘  │
└────────────────────┼──────────────────────────────────────┘
                     │
          ┌──────────┴──────────┐
          │                     │
          ↓                     ↓
┌──────────────────┐   ┌──────────────────┐
│   MongoDB Atlas   │   │  External APIs   │
│                   │   │                   │
│  • Search History │   │  • Google Maps    │
│  • Popular Routes │   │  • OpenWeather    │
│  • Analytics      │   │    (Optional)     │
└──────────────────┘   └──────────────────┘
```

## Data Flow

### 1. User Search Request

```
User Input (Origin, Destination, Mood)
    ↓
Frontend Validation
    ↓
API Request: POST /api/fare
    ↓
Backend Receives Request
    ↓
[Distance Calculation Process]
    ↓
[Fare Calculation Process]
    ↓
[Provider Ranking Process]
    ↓
Save to MongoDB (async, non-blocking)
    ↓
JSON Response to Frontend
    ↓
UI Rendering
    ↓
User Views Results
```

### 2. Distance Calculation Flow

```
Receive Origin & Destination
    ↓
Google Maps API Available?
    ├─ YES → Use Distance Matrix API
    │         ↓
    │    Extract distance & duration
    │         ↓
    │    Return accurate data
    │
    └─ NO → Use Haversine Formula
              ↓
         Known Location?
              ├─ YES → Calculate from coordinates
              │         ↓
              │    Return calculated distance
              │
              └─ NO → Use default estimate (8.5 km)
                        ↓
                   Return estimated distance
```

### 3. Fare Calculation Algorithm

For each provider:

```javascript
// Ride-hailing (Ola, Uber, Rapido)
fare = baseFare + (perKm × distance) + (perMin × estimatedTime)

// Metro (Slab-based)
if (distance <= 2km) fare = ₹10
else if (distance <= 4km) fare = ₹15
else if (distance <= 6km) fare = ₹20
else if (distance <= 8km) fare = ₹25
else if (distance <= 10km) fare = ₹30
else if (distance <= 15km) fare = ₹40
else fare = ₹50

// BMTC Bus (Slab-based)
if (distance <= 5km) fare = ₹10
else if (distance <= 10km) fare = ₹15
else if (distance <= 15km) fare = ₹20
else if (distance <= 20km) fare = ₹25
else fare = ₹30
```

### 4. Provider Ranking Logic

```javascript
// Step 1: Calculate all providers
providers = [rapido_bike, rapido_auto, ola_auto, uber_auto, metro, bmtc, ...]

// Step 2: Tag fastest
fastest = min(providers, key: eta)
fastest.tags.push('Fastest')

// Step 3: Tag cheapest
cheapest = min(providers, key: fare)
cheapest.tags.push('Cheapest')

// Step 4: Tag balanced
balanced = min(providers, key: fare/eta ratio)
balanced.tags.push('Balanced')

// Step 5: Mood-based tagging
if (mood === 'tired') tag ['metro', 'cab']
if (mood === 'stressed') tag [fastest]
if (mood === 'energetic') tag ['bike']
if (mood === 'happy') tag [cheapest]

// Step 6: Weather filtering
if (weather === 'rain') exclude ['bike']

// Step 7: Sort by ETA
return sort(providers, key: eta)
```

## Database Schema

### SearchHistory Collection

```javascript
{
  _id: ObjectId,
  origin: String,           // "Majestic"
  destination: String,      // "Koramangala"
  distance: Number,         // 8.5
  mood: String,            // "neutral", "tired", "stressed", etc.
  selectedProvider: String, // null or provider id
  searchedAt: Date,        // Timestamp
}

// Indexes
searchedAt: -1  (for recent searches)
origin: 1, destination: 1  (for route lookup)
```

### PopularRoute Collection

```javascript
{
  _id: ObjectId,
  route: String,          // "majestic → koramangala"
  count: Number,          // 42
  lastSearched: Date      // Timestamp
}

// Unique index on 'route'
```

## API Specifications

### POST /api/fare

**Request:**
```json
{
  "origin": "Majestic",
  "destination": "Koramangala",
  "mood": "neutral"  // optional
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "origin": "Majestic",
    "destination": "Koramangala",
    "distance": 8.5,
    "estimatedDuration": 25,
    "weather": {
      "condition": "clear",
      "temp": 28,
      "description": "Clear sky"
    },
    "mood": "neutral",
    "providers": [
      {
        "id": "rapido_bike",
        "name": "Rapido",
        "type": "bike",
        "fare": 95,
        "eta": 17,
        "color": "#FFD700",
        "icon": "🏍️",
        "tags": ["Fastest"],
        "features": ["Fast", "Flexible", "Solo"]
      },
      // ... more providers
    ],
    "timestamp": "2026-01-01T12:00:00.000Z"
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Both origin and destination are required"
}
```

### GET /api/health

**Response:**
```json
{
  "status": "OK",
  "message": "BangaloreFlow API is running",
  "timestamp": "2026-01-01T12:00:00.000Z",
  "database": "Connected"
}
```

### GET /api/history?limit=10

**Response:**
```json
{
  "success": true,
  "count": 10,
  "history": [
    {
      "_id": "...",
      "origin": "Majestic",
      "destination": "Koramangala",
      "distance": 8.5,
      "mood": "neutral",
      "searchedAt": "2026-01-01T12:00:00.000Z"
    }
    // ... more records
  ]
}
```

## Provider Configuration

Each provider has these attributes:

```javascript
{
  name: String,        // Display name
  type: String,        // bike, auto, cab, metro, bus
  baseFare: Number,    // Starting fare
  perKm: Number,       // Per kilometer charge
  perMin: Number,      // Per minute charge
  avgSpeed: Number,    // Average speed (km/h)
  color: String,       // Brand color
  icon: String,        // Emoji icon
}
```

Current providers:
1. **Rapido** (Bike & Auto)
2. **Ola** (Auto & Cab)
3. **Uber** (Auto & Cab)
4. **Namma Yatri** (Auto)
5. **Namma Metro**
6. **BMTC Bus**

## Performance Considerations

### Frontend Optimization
- **Code Splitting**: Lazy load components
- **Memoization**: Use React.memo for provider cards
- **Debouncing**: Prevent rapid API calls
- **Caching**: Store recent searches in localStorage

### Backend Optimization
- **Response Caching**: Cache distance calculations (5 min)
- **Connection Pooling**: MongoDB connection reuse
- **Async Operations**: Non-blocking database writes
- **Error Handling**: Graceful degradation

### Database Optimization
- **Indexes**: On searchedAt and route fields
- **Aggregation**: For analytics queries
- **TTL**: Auto-delete old records (optional)
- **Sharding**: Not needed for current scale

## Security Measures

### Frontend
- Input validation (sanitize user input)
- HTTPS only (enforced by hosting)
- No sensitive data in localStorage
- XSS prevention (React default)

### Backend
- CORS configuration (whitelist origins)
- Rate limiting (optional, recommended)
- Environment variables for secrets
- Input validation and sanitization
- MongoDB injection prevention (Mongoose escaping)

### Database
- IP whitelisting (MongoDB Atlas)
- Strong password policy
- Encrypted connections (TLS/SSL)
- Role-based access control

## Error Handling Strategy

### Frontend Errors
```javascript
try {
  const response = await calculateFare(origin, destination);
  // Handle success
} catch (error) {
  if (error.response) {
    // Backend returned error
    displayError(error.response.data.error);
  } else if (error.request) {
    // Network error
    displayError('Network error. Check backend.');
  } else {
    // Other errors
    displayError('Unexpected error occurred.');
  }
}
```

### Backend Errors
```javascript
// Global error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});
```

## Scalability Considerations

### Current Scale (Free Tier)
- **Users**: 100-500 concurrent users
- **Requests**: 10,000-50,000 per month
- **Database**: 512 MB (thousands of searches)
- **Response Time**: < 2 seconds

### Future Scaling (If Needed)
1. **Horizontal Scaling**: Multiple backend instances
2. **Load Balancing**: Distribute traffic
3. **Caching Layer**: Redis for hot data
4. **CDN**: Serve static assets
5. **Database**: Upgrade to M10+ cluster
6. **API Gateway**: Rate limiting, authentication

## Testing Strategy

### Unit Tests (Recommended)
```javascript
// Backend tests
describe('Distance Calculation', () => {
  test('Haversine formula works correctly', () => {
    const distance = calculateHaversineDistance(12.9767, 77.5709, 12.9656, 77.5960);
    expect(distance).toBeCloseTo(3.44, 1);
  });
});

// Frontend tests
describe('SearchForm', () => {
  test('validates empty inputs', () => {
    // Test validation logic
  });
});
```

### Integration Tests
- Test API endpoints
- Test database operations
- Test external API integration

### Manual Testing Checklist
- [ ] Search with valid locations
- [ ] Search with invalid locations
- [ ] Different mood selections
- [ ] Weather-based filtering
- [ ] Provider redirects work
- [ ] Mobile responsiveness
- [ ] Error messages display correctly

## Monitoring & Analytics

### Application Monitoring
- **Logs**: Backend console logs (Render/Vercel)
- **Uptime**: UptimeRobot (ping every 14 min)
- **Errors**: Error tracking (optional: Sentry)

### Database Monitoring
- **MongoDB Atlas**: Built-in metrics
- **Connections**: Track active connections
- **Queries**: Slow query detection
- **Storage**: Monitor disk usage

### User Analytics (Optional)
- Google Analytics 4
- Track popular routes
- User flow analysis
- Conversion tracking

## Future Enhancements

### Short-term
1. Add more providers (Bounce, Yulu, Ather)
2. Save favorite routes
3. Price alerts
4. Ride sharing options
5. Real-time traffic integration

### Long-term
1. User accounts & profiles
2. Booking integration (partner APIs)
3. Push notifications
4. Native mobile apps
5. ML-based price prediction
6. Community features (reviews, ratings)

## License & Legal

### Application
- **License**: MIT
- **Purpose**: Educational & Personal Use
- **Commercial Use**: Requires proper licensing

### Legal Compliance
- **No Scraping**: All data is calculated
- **No Booking**: Redirects to official apps
- **Disclaimers**: Clearly stated
- **Privacy**: No personal data collection
- **Terms**: User must accept on provider apps

## Support & Maintenance

### Issue Resolution
1. Check logs (Render/Vercel dashboard)
2. Verify environment variables
3. Test database connection
4. Check external API status
5. Review recent code changes

### Regular Maintenance
- Update dependencies monthly
- Monitor disk usage
- Review and optimize queries
- Check API rate limits
- Update documentation

---

Built with care for Bangalore's mobility ecosystem 🚗🚇🏍️
