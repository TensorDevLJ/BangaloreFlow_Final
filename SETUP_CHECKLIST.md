# ✅ BangaloreFlow Setup Checklist

Use this checklist to ensure everything is set up correctly.

## 📋 Pre-Installation

- [ ] Node.js v16+ installed (`node --version`)
- [ ] npm v7+ installed (`npm --version`)
- [ ] Text editor installed (VS Code, Sublime, etc.)
- [ ] Terminal/Command Prompt access
- [ ] Internet connection

## 🔧 Backend Setup

- [ ] Navigate to `backend` folder
- [ ] Run `npm install`
- [ ] Copy `.env.example` to `.env`
- [ ] Edit `.env` file
- [ ] Set `PORT=5000`
- [ ] Set `NODE_ENV=development`
- [ ] (Optional) Add MongoDB URI
- [ ] (Optional) Add Google Maps API key
- [ ] (Optional) Add Weather API key
- [ ] Run `npm start`
- [ ] Backend shows "✅ BangaloreFlow API Server Running"
- [ ] Test: Visit http://localhost:5000/api/health

## 🎨 Frontend Setup

- [ ] Open new terminal
- [ ] Navigate to `frontend` folder
- [ ] Run `npm install`
- [ ] (Optional) Copy `.env.example` to `.env`
- [ ] (Optional) Set `VITE_API_URL` if backend is not on localhost:5000
- [ ] Run `npm run dev`
- [ ] Frontend shows "Local: http://localhost:5173/"
- [ ] Test: Visit http://localhost:5173

## 🗄️ MongoDB Setup (Optional)

- [ ] Go to https://www.mongodb.com/cloud/atlas
- [ ] Create free account
- [ ] Create M0 (free) cluster
- [ ] Create database user
- [ ] Set strong password
- [ ] Go to Network Access
- [ ] Add IP address (0.0.0.0/0 for dev)
- [ ] Get connection string
- [ ] Replace `<password>` with your password
- [ ] Replace `<dbname>` with `bangaloreflow`
- [ ] Add to backend `.env` as `MONGODB_URI`
- [ ] Restart backend
- [ ] Check backend logs for "✅ MongoDB Connected"

## ✨ First Test

- [ ] Backend running on port 5000
- [ ] Frontend running on port 5173
- [ ] Open http://localhost:5173 in browser
- [ ] Enter origin: "Majestic"
- [ ] Enter destination: "National College Metro"
- [ ] Select mood (optional)
- [ ] Click "Compare Options"
- [ ] Results show provider cards
- [ ] Fares and times displayed
- [ ] Tags show (Fastest, Cheapest, etc.)
- [ ] "Open App" links work

## 🐛 Troubleshooting

If something doesn't work, check:

### Backend Issues
- [ ] Port 5000 not in use by another app
- [ ] All dependencies installed (`npm install`)
- [ ] `.env` file exists in backend folder
- [ ] MongoDB URI is correct (if using database)
- [ ] No syntax errors in console

### Frontend Issues
- [ ] Port 5173 not in use
- [ ] All dependencies installed (`npm install`)
- [ ] Backend is running and accessible
- [ ] No errors in browser console (F12)
- [ ] API URL is correct (if changed)

### MongoDB Issues
- [ ] Cluster is active in Atlas
- [ ] Password is correct (no special characters issues)
- [ ] IP address is whitelisted
- [ ] Connection string format is correct
- [ ] Database name is included in URI

## 🎯 Quick Test Commands

**Test Backend:**
```bash
# Health check
curl http://localhost:5000/api/health

# Test fare calculation
curl -X POST http://localhost:5000/api/fare \
  -H "Content-Type: application/json" \
  -d '{"origin":"Majestic","destination":"Koramangala"}'
```

**Test Frontend:**
- Just open http://localhost:5173 in browser

## 📦 Files Checklist

Ensure these files exist:

**Backend:**
- [ ] `backend/package.json`
- [ ] `backend/server.js`
- [ ] `backend/.env` (created from .env.example)
- [ ] `backend/models/Search.js`
- [ ] `backend/utils/calculations.js`

**Frontend:**
- [ ] `frontend/package.json`
- [ ] `frontend/vite.config.js`
- [ ] `frontend/index.html`
- [ ] `frontend/src/main.jsx`
- [ ] `frontend/src/App.jsx`
- [ ] `frontend/src/App.css`
- [ ] `frontend/src/index.css`
- [ ] `frontend/src/api/index.js`

**Documentation:**
- [ ] `README.md`
- [ ] `QUICKSTART.md`
- [ ] `DEPLOYMENT.md`
- [ ] `ARCHITECTURE.md`

## 🚀 Ready for Development

Once all checkboxes are ticked:
- ✅ Backend is running
- ✅ Frontend is running
- ✅ First test passed
- ✅ No errors in console

You're ready to:
- Add more features
- Customize the design
- Deploy to production
- Share with others

## 📝 Common Terminal Commands

**Start Backend:**
```bash
cd backend
npm start
```

**Start Frontend:**
```bash
cd frontend
npm run dev
```

**Install All Dependencies:**
```bash
# From root directory
cd backend && npm install && cd ../frontend && npm install
```

**Build Frontend for Production:**
```bash
cd frontend
npm run build
```

**View Backend Logs:**
- Check terminal where backend is running

**Stop Servers:**
- Press `Ctrl + C` in terminal

## 🎉 Success Indicators

You'll know everything is working when:

1. **Backend Terminal Shows:**
   ```
   ✅ MongoDB Connected Successfully (if MongoDB is configured)
   🚀 BangaloreFlow API Server Running
   ```

2. **Frontend Terminal Shows:**
   ```
   VITE ready in XXXms
   ➜ Local: http://localhost:5173/
   ```

3. **Browser Shows:**
   - Beautiful dark UI with neon green accents
   - Search form with origin and destination fields
   - Mood selection buttons
   - "Compare Options" button
   - Results with provider cards after search

4. **API Status:**
   - Green "Live" indicator in top right
   - No error messages

## 💡 Pro Tips

- Keep both terminals open while developing
- Use `npm run dev` for auto-reload during development
- Check browser console (F12) for frontend errors
- Check terminal for backend errors
- MongoDB is optional - app works without it
- Use test locations from README for quick testing

---

Happy Coding! 🚀

If you need help, refer to:
- README.md - Full documentation
- QUICKSTART.md - Quick start guide
- ARCHITECTURE.md - Technical details
- DEPLOYMENT.md - Production deployment

Built with ❤️ for Bangalore
