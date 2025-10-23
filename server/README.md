# Live Score Backend API

Real-time football match score tracking system with WebSocket support.

## Features

- RESTful API for match management (CRUD operations)
- Real-time updates via Socket.io
- Integration with Football-Data.org API
- Automatic match synchronization (every 5 minutes)
- MongoDB database with Mongoose ODM
- Input validation with express-validator
- Comprehensive error handling and middleware
- TypeScript for type safety
- Live match scores and events tracking
- Unit and Integration tests with Jest

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** MongoDB
- **ODM:** Mongoose
- **Real-time:** Socket.io
- **Validation:** express-validator
- **Testing:** Jest, Supertest, MongoDB Memory Server

## Prerequisites

Before running this project, make sure you have:

- Node.js (v18 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- npm or yarn package manager

## Football API Setup

This application fetches real match data from [Football-Data.org](https://www.football-data.org/).

### Getting API Key

1. Go to [Football-Data.org](https://www.football-data.org/)
2. Click **"Register"** (top right)
3. Fill in email and password
4. Verify your email
5. Login and copy your API key
6. Add it to `.env` file

### Supported Leagues

The application automatically syncs matches from:

- **Premier League** (England)
- **La Liga** (Spain)
- **Bundesliga** (Germany)
- **Serie A** (Italy)
- **Ligue 1** (France)

### API Limits (Free Tier)

- 10 requests per minute
- All major European leagues available
- Match data updated every ~1 minute on their side

## Installation

1. **Clone the repository**

```bash
git clone <your-repo-url>
cd server
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/live-score-dev

# Football-Data.org API Key (Required!)
FOOTBALL_API_KEY=your_api_key_here

# Client URL (for CORS)
CLIENT_URL=http://localhost:5173
```

**Important:** Without `FOOTBALL_API_KEY`, real match data won't sync!

4. **Start MongoDB**

Make sure MongoDB is running locally:

```bash
# Windows
net start MongoDB

# macOS/Linux
sudo systemctl start mongod

# Or use MongoDB Compass / Atlas
```

5. **Seed the database (optional)**

Populate the database with sample data:

```bash
npm run seed
```

This will create 30 sample matches with different statuses (live, scheduled, finished).

## Running the Application

### Development mode (with hot reload)

```bash
npm run dev
```

### Production mode

```bash
npm run build
npm start
```

Server will start on `http://localhost:8080`

## Testing

The project includes comprehensive unit and integration tests.

### Running Tests

```bash
# Run all tests
npm test
```

### Test Structure

```
src/__tests__/
├── setup.ts                    # Test configuration & MongoDB Memory Server
├── unit/
│   └── models/
│       └── Match.test.ts       # Match model validation & queries
└── integration/
    └── api/
        └── matches.test.ts     # API endpoint tests
```

### What's Tested

**Unit Tests (Match Model):**

- Creating valid matches
- Validation of required fields
- Field type validation
- Database queries (find by status, league, etc.)

**Integration Tests (API Endpoints):**

- GET /api/v1/matches - All matches
- GET /api/v1/matches?status=live - Filter by status
- GET /api/v1/matches?league=Premier%20League - Filter by league
- GET /api/v1/matches/:id - Single match
- Error handling (404, 400 responses)
- Empty result handling

### Test Technologies

- **Jest** - Testing framework
- **Supertest** - HTTP assertions
- **MongoDB Memory Server** - In-memory database for isolated tests
- **ts-jest** - TypeScript support for Jest

### Example Test Output

```bash
PASS  src/__tests__/unit/models/Match.test.ts
PASS  src/__tests__/integration/api/matches.test.ts

Test Suites: 2 passed, 2 total
Tests:       14 passed, 14 total
Snapshots:   0 total
Time:        2.341 s
```

## Match Synchronization

### Automatic Sync (Recommended)

When you run the server with `npm run dev`, matches automatically sync every 5 minutes:

```bash
npm run dev

# You'll see:
# Starting live sync job (every 5 minutes)...
# [LIVE SYNC] Starting...
# Syncing all leagues...
# [LIVE SYNC] Done in 32.5s - Synced 42 matches
```

### Manual Sync

You can also manually sync matches without starting the server:

```bash
npm run sync
```

This is useful for:

- Initial database population
- Testing API connection
- One-time data refresh

### How Sync Works

```
Football-Data API → Backend (every 5 min) → MongoDB → WebSocket → Frontend (instant!)
```

1. **Every 5 minutes**: Backend fetches latest match data from Football-Data.org
2. **Detects changes**: Compares with existing database records
3. **Updates database**: Saves new scores, statuses, etc.
4. **Emits WebSocket events**: Connected clients receive instant updates

**No polling needed!** Frontend gets real-time updates via WebSocket.

### Sync Logs

```bash
[LIVE SYNC] 14:30:00 - Starting...

PREMIER_LEAGUE...
Syncing league 2021...
Score updated: Liverpool FC 2-1 Manchester United FC
Status changed: Chelsea FC vs Arsenal FC → live
Synced 9 matches

LA_LIGA...
Syncing league 2014...
Synced 8 matches

...

[LIVE SYNC] Done in 32.5s - Synced 42 matches
```

## API Endpoints

### Matches

| Method | Endpoint                          | Description                             |
| ------ | --------------------------------- | --------------------------------------- |
| GET    | `/api/v1/matches`                 | Get all matches (supports query params) |
| GET    | `/api/v1/matches/live`            | Get all live matches                    |
| GET    | `/api/v1/matches/scheduled`       | Get all scheduled matches               |
| GET    | `/api/v1/matches/finished`        | Get all finished matches                |
| GET    | `/api/v1/matches/:matchId`        | Get single match by ID                  |
| POST   | `/api/v1/matches`                 | Create a new match                      |
| PATCH  | `/api/v1/matches/:matchId`        | Update match details                    |
| DELETE | `/api/v1/matches/:matchId`        | Delete a match                          |
| PATCH  | `/api/v1/matches/:matchId/score`  | Update match score                      |
| PATCH  | `/api/v1/matches/:matchId/status` | Update match status                     |
| POST   | `/api/v1/matches/:matchId/events` | Add event to match                      |

### Query Parameters (GET /api/v1/matches)

- `status` - Filter by match status (scheduled, live, finished, postponed)
- `league` - Filter by league name
- `limit` - Limit number of results (default: 20, max: 100)

## Example Requests

### Create a Match

```http
POST /api/v1/matches
Content-Type: application/json

{
  "homeTeam": "Crvena Zvezda",
  "awayTeam": "Partizan",
  "league": "Superliga Srbije",
  "startTime": "2025-10-20T18:00:00Z",
  "venue": "Rajko Mitić",
  "referee": "Srđan Jovanović"
}
```

### Update Score

```http
PATCH /api/v1/matches/:matchId/score
Content-Type: application/json

{
  "homeScore": 2,
  "awayScore": 1
}
```

### Add Event (Goal, Card, etc.)

```http
POST /api/v1/matches/:matchId/events
Content-Type: application/json

{
  "type": "goal",
  "minute": 25,
  "player": "Mirko Ivanić",
  "team": "home",
  "description": "Header from corner kick"
}
```

## WebSocket Events

The server emits real-time events via Socket.io:

### Client → Server Events

- `subscribe:all` - Subscribe to all match updates
- `subscribe:match` - Subscribe to specific match updates (requires matchId)
- `unsubscribe:match` - Unsubscribe from specific match

### Server → Client Events

- `match:created` - New match created
- `match:updated` - Match data updated
- `match:deleted` - Match deleted
- `score:updated` - Match score updated
- `status:changed` - Match status changed
- `match:event` - New event added (goal, card, substitution, etc.)

### Example Client Usage

```javascript
import io from "socket.io-client";

const socket = io("http://localhost:3000");

// Subscribe to all matches
socket.emit("subscribe:all");

// Listen for score updates
socket.on("score:updated", (match) => {
  console.log("Score updated:", match);
});

// Subscribe to specific match
socket.emit("subscribe:match", "matchId123");
```

## Project Structure

```
server/
├── src/
│   ├── __tests__/       # Test files
│   │   ├── setup.ts     # Test configuration
│   │   ├── unit/        # Unit tests
│   │   └── integration/ # Integration tests
│   ├── config/          # Database configuration
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Express middlewares
│   ├── models/          # Mongoose models
│   ├── routes/          # API routes
│   ├── scripts/         # Utility scripts (seed, etc.)
│   ├── services/        # External API integrations (Football-Data.org)
│   ├── jobs/            # Background jobs (sync job - every 5 min)
│   ├── socket/          # Socket.io configuration
│   ├── validators/      # Input validation rules
│   └── server.ts        # Application entry point
├── .env                 # Environment variables
├── jest.config.cjs      # Jest configuration
├── package.json
└── tsconfig.json
```

## Data Models

### Match

```typescript
{
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  status: "scheduled" | "live" | "finished" | "postponed";
  league: string;
  startTime: Date;
  venue?: string;
  referee?: string;
  events: Event[];
}
```

### Event

```typescript
{
  type: "goal" | "yellow_card" | "red_card" | "substitution" | "penalty" | "own_goal";
  minute: number;
  player: string;
  team: "home" | "away";
  description?: string;
}
```

## Available Scripts

| Script                  | Description                                    |
| ----------------------- | ---------------------------------------------- |
| `npm run dev`           | Start development server with hot reload       |
| `npm run build`         | Compile TypeScript to JavaScript               |
| `npm start`             | Start production server (requires build first) |
| `npm test`              | Run all tests                                  |
| `npm run test:watch`    | Run tests in watch mode                        |
| `npm run test:coverage` | Run tests with coverage report                 |
| `npm run seed`          | Populate database with 30 sample matches       |
| `npm run sync`          | Manually sync matches from Football-Data.org   |
| `npm run clean`         | Remove compiled files from `dist/` folder      |
| `npm run type-check`    | Check TypeScript types without compiling       |

## Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "status": 400,
  "message": "Validation failed",
  "errors": [
    {
      "field": "homeTeam",
      "message": "Home team is required"
    }
  ]
}
```

## Environment Variables

| Variable         | Description               | Example                                  |
| ---------------- | ------------------------- | ---------------------------------------- |
| PORT             | Server port               | 3000                                     |
| NODE_ENV         | Environment mode          | development / production / test          |
| MONGODB_URI      | MongoDB connection string | mongodb://localhost:27017/live-score-dev |
| CLIENT_URL       | Frontend URL for CORS     | http://localhost:5173                    |
| FOOTBALL_API_KEY | Football-Data.org API key | abc123xyz                                |

## License

MIT

## Author

Milos Srejic - [GitHub](https://github.com/MilosS994)

---
