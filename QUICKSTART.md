# 🚀 Quick Start Guide

## Fastest Way to Run BangaloreFlow

### Prerequisites Check
```bash
node --version   # Should be v16 or higher
npm --version    # Should be 7 or higher
```

### Option 1: Run Both Servers Separately (Recommended for Beginners)

**Terminal 1 - Backend:**
```bash
cd backend
npm install
cp .env.example .env
# Edit .env if you want to add MongoDB
npm start
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm install
npm run dev
```

**Open Browser:** http://localhost:5173

### Option 2: Run Both Servers at Once

```bash
# From root directory
npm install
npm run install:all
npm run dev
```

## Minimum Setup (No Database Required)

You can run the app **without MongoDB** for testing:

1. **Backend Setup:**
```bash
cd backend
npm install
echo "PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173" > .env
npm start
```

2. **Frontend Setup:**
```bash
cd frontend
npm install
npm run dev
```

That's it! The app will work with in-memory calculations.

## Adding MongoDB (Optional but Recommended)

1. Sign up at https://www.mongodb.com/cloud/atlas (Free)
2. Create a Free M0 Cluster
3. Get connection string
4. Add to `backend/.env`:
```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/bangaloreflow
```
5. Restart backend

## Test Locations

Try these in the app:
- **Origin:** Majestic
- **Destination:** National College Metro
- **Origin:** Koramangala
- **Destination:** Indiranagar

## Troubleshooting

**Backend won't start?**
- Check if port 5000 is free
- Verify Node.js is installed
- Run `npm install` in backend folder

**Frontend shows errors?**
- Ensure backend is running first
- Check if port 5173 is available
- Run `npm install` in frontend folder

**Can't connect to backend?**
- Backend must be running on http://localhost:5000
- Check backend terminal for errors
- Verify `.env` file exists in backend

## Next Steps

Once running:
1. Enter a journey (origin and destination)
2. Select your mood (optional)
3. Click "Compare Options"
4. View different transport providers
5. Click "Open App" to go to provider's website

Enjoy using BangaloreFlow! 🎉
