backend - https://bangaloreflowbackend-likhithajagadeesh.onrender.com
frontend- https://bangalore-flow-likhithajagadeesh.vercel.app/
# 🚀 BangaloreFlow - Smart Mobility Decision Platform

BangaloreFlow is a full-stack web application that helps users in Bangalore compare transportation options across multiple ride-hailing services, metro, and public transport. Make smarter travel decisions by seeing fares, times, and recommendations all in one place.

## ✨ Features

- **Multi-Provider Comparison**: Compare Ola, Uber, Rapido, Namma Metro, and BMTC buses
- **Real-time Estimates**: Get fare and time estimates for your journey
- **Mood-Based Recommendations**: Personalized suggestions based on your current mood
- **Weather Integration**: Weather-aware recommendations (e.g., skip bikes in rain)
- **Search History**: Track your past searches (MongoDB)
- **Popular Routes Analytics**: See trending routes in Bangalore
- **Responsive Design**: Works seamlessly on desktop and mobile

## 🏗️ Architecture

```
┌─────────────────┐
│   React + Vite  │  Frontend (Port 5173)
│   (Brutalist    │
│   Modern UI)    │
└────────┬────────┘
         │ REST API
         ↓
┌────────────────┐
│ Node.js +      │  Backend (Port 5000)
│ Express API    │
└────────┬───────┘
         │
    ┌────┴────┐
    ↓         ↓
┌────────┐  ┌─────────────┐
│MongoDB │  │External APIs│
│(Atlas) │  │(Optional)   │
└────────┘  └─────────────┘
```

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** (comes with Node.js)
- **MongoDB Account** (Free) - [Sign up at MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- **Git** (optional) - [Download](https://git-scm.com/)

## 🚀 Quick Start

### Step 1: Clone or Download

```bash
# If you have the project folder, navigate to it
cd bangaloreflow

# Or clone if you have a git repository
git clone <your-repo-url>
cd bangaloreflow
```

### Step 2: Setup Backend

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Copy environment variables template
cp .env.example .env

# Edit .env file with your configuration
# You can use nano, vim, or any text editor
nano .env
```

**Configure your `.env` file:**

```env
PORT=5000
NODE_ENV=development

# MongoDB Atlas (Free Tier)
# Get your connection string from https://www.mongodb.com/cloud/atlas
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/bangaloreflow?retryWrites=true&w=majority

# Optional: Google Maps API for accurate distances
# Get free API key from https://console.cloud.google.com/
GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here

# Optional: Weather API
# Get free API key from https://openweathermap.org/api
WEATHER_API_KEY=your_openweather_api_key_here

FRONTEND_URL=http://localhost:5173
```

**Start the backend server:**

```bash
npm start

# Or for development with auto-reload
npm run dev
```

You should see:
```
✅ MongoDB Connected Successfully
🚀 BangaloreFlow API Server Running on Port: 5000
```

### Step 3: Setup Frontend

Open a **new terminal window** (keep backend running):

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Copy environment variables (optional)
cp .env.example .env

# Start the development server
npm run dev
```

You should see:
```
  VITE v5.0.8  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### Step 4: Open in Browser

Open your browser and go to:
```
http://localhost:5173
```

🎉 **You're all set!** Start comparing mobility options.

## 🗄️ MongoDB Setup (Free Tier)

### Create MongoDB Atlas Account (100% Free)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Click "Try Free"
3. Sign up with email or Google
4. Create a **Free M0 Cluster** (512 MB storage - perfect for this project)

### Get Connection String

1. In MongoDB Atlas Dashboard, click **"Connect"**
2. Choose **"Connect your application"**
3. Copy the connection string
4. Replace `<password>` with your database password
5. Replace `<dbname>` with `bangaloreflow`

Example:
```
mongodb+srv://myuser:mypassword@cluster0.xxxxx.mongodb.net/bangaloreflow?retryWrites=true&w=majority
```

6. Paste this in your backend `.env` file as `MONGODB_URI`

### Network Access

1. In MongoDB Atlas, go to **"Network Access"**
2. Click **"Add IP Address"**
3. Choose **"Allow Access from Anywhere"** (0.0.0.0/0) for development
4. Or add your specific IP address for production

## 📁 Project Structure

```
bangaloreflow/
├── backend/                    # Node.js Express Backend
│   ├── models/
│   │   └── Search.js          # MongoDB schemas
│   ├── utils/
│   │   └── calculations.js    # Distance & fare logic
│   ├── server.js              # Main server file
│   ├── package.json
│   └── .env                   # Environment variables
│
├── frontend/                   # React + Vite Frontend
│   ├── src/
│   │   ├── api/
│   │   │   └── index.js       # API service
│   │   ├── App.jsx            # Main component
│   │   ├── App.css            # Component styles
│   │   ├── index.css          # Global styles
│   │   └── main.jsx           # Entry point
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
└── README.md                   # This file
```

## 🔌 API Endpoints

### Health Check
```http
GET /api/health
```

### Get Available Locations
```http
GET /api/locations
```

### Calculate Fare (Main Endpoint)
```http
POST /api/fare
Content-Type: application/json

{
  "origin": "Majestic",
  "destination": "National College Metro",
  "mood": "neutral"  // optional: tired, stressed, energetic, happy
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "origin": "Majestic",
    "destination": "National College Metro",
    "distance": 3.44,
    "weather": {
      "condition": "clear",
      "temp": 25
    },
    "providers": [
      {
        "id": "rapido_bike",
        "name": "Rapido",
        "type": "bike",
        "fare": 56,
        "eta": 7,
        "tags": ["Fastest"],
        "features": ["Fast", "Flexible", "Solo"]
      }
      // ... more providers
    ]
  }
}
```

### Get Search History
```http
GET /api/history?limit=10
```

### Get Popular Routes
```http
GET /api/popular-routes?limit=5
```

### Get Analytics
```http
GET /api/analytics
```

## 🛠️ Testing the Application

### Test Backend Only

```bash
# Using curl
curl http://localhost:5000/api/health

# Using browser
Open: http://localhost:5000/api/health

# Test fare calculation
curl -X POST http://localhost:5000/api/fare \
  -H "Content-Type: application/json" \
  -d '{"origin":"Majestic","destination":"Koramangala"}'
```

### Test Full Application

1. Start both backend and frontend
2. Open http://localhost:5173
3. Enter locations:
   - Origin: `Majestic`
   - Destination: `National College Metro`
4. Select a mood (optional)
5. Click "Compare Options"
6. View results with different providers

### Available Test Locations

The backend includes these Bangalore locations:
- Majestic
- National College Metro
- Koramangala
- Indiranagar
- Whitefield
- Electronic City
- Hebbal
- JP Nagar
- Marathahalli
- Yeswanthpur
- MG Road
- Brigade Road
- Residency Road
- KR Market
- Silk Board

## 🚀 Deployment

### Backend Deployment (Render.com - Free)

1. Create account at [Render.com](https://render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment**: Add all `.env` variables
5. Click "Create Web Service"
6. Copy your backend URL (e.g., `https://your-app.onrender.com`)

### Frontend Deployment (Vercel - Free)

1. Create account at [Vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Environment Variable**: `VITE_API_URL` = your backend URL
5. Click "Deploy"

### Alternative: Netlify for Frontend

1. Create account at [Netlify.com](https://netlify.com)
2. Drag and drop your `frontend/dist` folder after building:
   ```bash
   cd frontend
   npm run build
   ```
3. Configure environment variables in Netlify dashboard

## 🎨 Design Philosophy

BangaloreFlow uses a **Brutalist-Modern** design aesthetic:

- **Bold Typography**: Archivo for headers, DM Sans for body
- **Dark Theme**: High contrast with neon accents (#00ff88 primary)
- **Animated Grid Background**: Subtle tech feel
- **Micro-interactions**: Hover effects and transitions
- **No Generic AI Look**: Custom designed, not templated

## 🔧 Troubleshooting

### Backend won't start

**Error**: `MongoDB connection failed`
- Check if your MongoDB URI is correct in `.env`
- Ensure IP address is whitelisted in MongoDB Atlas
- Verify username and password are correct

**Error**: `Port 5000 already in use`
```bash
# Find and kill the process
# On Mac/Linux:
lsof -ti:5000 | xargs kill -9

# On Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### Frontend won't start

**Error**: `Cannot connect to backend`
- Ensure backend is running on port 5000
- Check `VITE_API_URL` in frontend `.env`
- Verify CORS is enabled in backend

**Error**: `Module not found`
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### MongoDB Issues

**Can't connect to MongoDB**
- Use the MongoDB connection string tester: `mongosh "your-connection-string"`
- Ensure you're using the correct database name
- Check if cluster is active in MongoDB Atlas

**Note**: The app will run without MongoDB, but history and analytics won't work.

## 🧪 Running Without MongoDB

The application can run without MongoDB for testing:

1. Don't set `MONGODB_URI` in `.env` or use dummy value
2. Backend will show: `⚠️ MongoDB not configured - running without database`
3. All fare calculations will work
4. History and analytics endpoints will return error

This is perfect for:
- Quick local testing
- Demo purposes
- Development without database setup

## 📝 Environment Variables Reference

### Backend `.env`

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `PORT` | No | Server port | `5000` |
| `NODE_ENV` | No | Environment | `development` |
| `MONGODB_URI` | No* | MongoDB connection | `mongodb+srv://...` |
| `GOOGLE_MAPS_API_KEY` | No | Google Maps API | `AIza...` |
| `WEATHER_API_KEY` | No | OpenWeather API | `abc123...` |
| `FRONTEND_URL` | No | CORS origin | `http://localhost:5173` |

*Not required for basic functionality, but needed for history/analytics

### Frontend `.env`

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `VITE_API_URL` | No | Backend API URL | `http://localhost:5000/api` |

## 🎯 How It Works

### Distance Calculation
1. **Primary**: Google Maps Distance Matrix API (if API key provided)
2. **Fallback**: Haversine formula with known Bangalore locations
3. **Default**: Estimated average (8.5 km)

### Fare Calculation
- **Rule-based**: `base_fare + (per_km × distance) + (per_min × time)`
- **Metro/BMTC**: Slab-based pricing
- **No scraping**: All estimates are calculated, not fetched

### Recommendation Logic
- **Fastest**: Lowest ETA
- **Cheapest**: Lowest fare
- **Balanced**: Best time-to-cost ratio
- **Mood Pick**: Based on user's selected mood

### Weather Integration
- Fetches current Bangalore weather
- Excludes bikes in rain
- Shows weather info in results

## 🤝 Contributing

This is a learning project! Feel free to:
- Add more providers (Bounce, Yulu, etc.)
- Improve fare calculation accuracy
- Add more Bangalore locations
- Enhance UI/UX
- Add unit tests

## 📄 License

MIT License - Feel free to use this project for learning and personal use.

## 🙏 Acknowledgments

- Built for Bangalore's mobility ecosystem
- Inspired by real transport challenges
- Uses estimated data, not real-time pricing
- Redirects to official apps for actual booking

## 📞 Support

If you encounter issues:
1. Check this README's troubleshooting section
2. Ensure all prerequisites are installed
3. Verify environment variables are set correctly
4. Check that both backend and frontend are running

---

**Note**: This is a decision-support platform. We don't book rides or store payment information. Users are redirected to official provider apps for actual booking.

Built with ❤️ for Bangalore


