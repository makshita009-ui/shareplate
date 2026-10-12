# SharePlate: Food Rescue Network (MERN)

Donors list surplus food. Verified NGOs claim it and collect it. No maps or live location: donors type the address, and the exact street and phone stay hidden until an NGO claims the food.

**Stack:** MongoDB Atlas, Express, React (Vite), Node, Mongoose, JWT, bcryptjs, Axios, React Router, React Hot Toast. Plain CSS.

## Run it locally

1. Create a free cluster at https://www.mongodb.com/atlas and copy the connection string.
2. **Backend**
   ```
   cd server
   npm install
   cp .env.example .env     # then paste your MONGO_URI and set JWT_SECRET
   npm run seed             # creates the admin (admin@shareplate.com / admin123)
   npm run dev              # http://localhost:5000
   ```
3. **Frontend** (new terminal)
   ```
   cd client
   npm install
   npm run dev              # http://localhost:5173
   ```

## How it works

| Role | Can do |
|---|---|
| Donor | List food, cancel available listings, see who claimed it, report issues |
| NGO | Filter food by city/area, claim it (after admin verification), mark collected |
| Admin | Verify NGOs and donors, resolve reported issues, view all food |

Status flow: `available` → `claimed` → `collected` (or `cancelled`).
The Impact page uses: 1 meal ≈ 0.4 kg food, 1 kg food ≈ 2.5 kg CO₂ (change in `server/routes/stats.js`).

## Folder map
```
server/  models/ (User, Donation, Report)  routes/  middleware/auth.js  server.js  seed.js
client/  src/pages/  src/components/  src/AuthContext.jsx  src/api.js  src/index.css
```

## Deploy (free)
Backend on Render (root `server`, start `npm start`, add the .env values), frontend on Vercel (root `client`, set `VITE_API_URL`), and set `CLIENT_URL` on the backend to your Vercel URL.
