# Live Football Scores

Real-time football match score tracking application with WebSocket updates and comprehensive match statistics.

## Live Demo

** Frontend:** https://live-football-scores.vercel.app  
** Backend API:** https://live-football-scores.onrender.com/api/v1

---

## About

A full-stack application that provides real-time football match updates using WebSocket technology. Users can view live scores, match events, and filter matches by status (live, scheduled, finished) across major European leagues.

The application automatically syncs with Football-Data.org API every 5 minutes to fetch the latest match data, and instantly pushes updates to all connected clients via Socket.io.

---

## Key Features

### Frontend

- **Real-time Score Updates** - Instant updates via WebSocket (no page refresh needed)
- **Match Filtering** - Filter by status: All, Live, Scheduled, Finished
- **League Grouping** - Matches organized by leagues for easy browsing
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- **Smart Date Formatting** - Displays "Today", "Tomorrow", or formatted dates
- **Modern UI** - Clean interface built with Tailwind CSS
- **Match Details Modal** - View events, venue, referee, and statistics

### Backend

- **RESTful API** - Complete CRUD operations for matches
- **WebSocket Server** - Real-time bidirectional communication
- **Auto-sync** - Fetches data from Football-Data.org every 5 minutes
- **Error Handling** - Comprehensive middleware for validation and errors
- **Input Validation** - express-validator for data integrity
- **Testing** - Unit and integration tests with Jest
- **Football API Integration** - Live data from 5 major European leagues

---

## Tech Stack

### Frontend

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **Socket.io Client** - Real-time WebSocket communication
- **Axios** - HTTP client
- **React Router** - Client-side routing
- **date-fns** - Date formatting

### Backend

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **Socket.io** - WebSocket server
- **Jest & Supertest** - Testing framework
- **express-validator** - Input validation

### Tools

- **Vercel** - Frontend hosting
- **Render** - Backend hosting
- **MongoDB Atlas** - Cloud database
- **Football-Data.org API** - Match data source
- **GitHub** - Version control

---

## Project Structure

```
Live-Football-Scores/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API & WebSocket services
│   │   ├── types/          # TypeScript interfaces
│   │   └── utils/          # Utility functions
│   ├── vercel.json         # Vercel configuration
│   └── README.md           # Frontend documentation
│
├── server/                 # Express backend
│   ├── src/
│   │   ├── __tests__/      # Unit & integration tests
│   │   ├── controllers/    # Route controllers
│   │   ├── models/         # Mongoose models
│   │   ├── routes/         # API routes
│   │   ├── services/       # External API integrations
│   │   ├── socket/         # Socket.io configuration
│   │   ├── middleware/     # Express middlewares
│   │   ├── validators/     # Input validation
│   │   └── jobs/           # Background jobs (sync)
│   ├── jest.config.cjs     # Jest configuration
│   └── README.md           # Backend documentation
│
└── README.md               # This file
```

---

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- Football-Data.org API key

### Local Development

1. **Clone the repository**

```bash
git clone https://github.com/MilosS994/Live-Football-Scores.git
cd Live-Football-Scores
```

2. **Setup Backend**

```bash
cd server
npm install
```

Create `.env` file:

```env
PORT=8080
MONGODB_URI=mongodb://localhost:27017/live-score-dev
FOOTBALL_API_KEY=your_api_key_here
CLIENT_URL=http://localhost:5173
```

Start server:

```bash
npm run dev
```

**Full backend documentation:** [server/README.md](./server/README.md)

3. **Setup Frontend**

```bash
cd ../client
npm install
```

Create `.env` file:

```env
VITE_API_URL=http://localhost:8080/api/v1
```

Start development server:

```bash
npm run dev
```

**Full frontend documentation:** [client/README.md](./client/README.md)

4. **Access the application**

- Frontend: http://localhost:5173
- Backend: http://localhost:8080

---

## Testing

The backend includes comprehensive unit and integration tests.

```bash
cd server

# Run all tests
npm test
```

**Test Coverage:**

- Match model validation & queries
- API endpoint integration tests
- Error handling (404, 400 responses)
- WebSocket event handling

---

## Deployment

### Frontend (Vercel)

1. Push code to GitHub
2. Import repository in Vercel
3. Set Root Directory: `client`
4. Add environment variable: `VITE_API_URL`
5. Deploy

### Backend (Render)

1. Create Web Service in Render
2. Connect GitHub repository
3. Set Root Directory: `server`
4. Add environment variables:

   - `MONGODB_URI` (from MongoDB Atlas)
   - `FOOTBALL_API_KEY`
   - `CLIENT_URL` (Vercel URL)

5. Deploy

### Database (MongoDB Atlas)

1. Create free M0 cluster
2. Configure Network Access: `0.0.0.0/0`
3. Create database user
4. Get connection string
5. Add to Render environment variables

---

## API Documentation

### Base URL (Production)

```
https://live-football-scores.onrender.com/api/v1
```

### Key Endpoints

| Method | Endpoint              | Description                    |
| ------ | --------------------- | ------------------------------ |
| GET    | `/matches`            | Get all matches (with filters) |
| GET    | `/matches/live`       | Get live matches               |
| GET    | `/matches/scheduled`  | Get scheduled matches          |
| GET    | `/matches/finished`   | Get finished matches           |
| GET    | `/matches/:id`        | Get single match by ID         |
| POST   | `/matches`            | Create new match               |
| PATCH  | `/matches/:id/score`  | Update match score             |
| PATCH  | `/matches/:id/status` | Update match status            |
| POST   | `/matches/:id/events` | Add event to match             |

### WebSocket Events

**Client → Server:**

- `subscribe:all` - Subscribe to all match updates
- `subscribe:match` - Subscribe to specific match

**Server → Client:**

- `match:updated` - Match data changed
- `score:updated` - Score changed
- `status:changed` - Status changed
- `match:event` - New event added
- `match:created` - New match created
- `match:deleted` - Match deleted

---

## Supported Leagues

- **Premier League** (England) 🏴󠁧󠁢󠁥󠁮󠁧󠁿
- **La Liga** (Spain) 🇪🇸
- **Bundesliga** (Germany) 🇩🇪
- **Serie A** (Italy) 🇮🇹
- **Ligue 1** (France) 🇫🇷

Data updates automatically every 5 minutes from Football-Data.org API.

---

## License

MIT

---

## Author

**Milos Srejic**

- GitHub: [@MilosS994](https://github.com/MilosS994)
- LinkedIn: [Milos Srejic](https://www.linkedin.com/in/milos-srejic/)

---

## Acknowledgments

- [Football-Data.org](https://www.football-data.org/) - Free football data API
- [Vercel](https://vercel.com) - Frontend hosting
- [Render](https://render.com) - Backend hosting
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) - Database hosting

---
