# Live Score Frontend

Modern, real-time football match score tracking application with WebSocket support.

## Features

- **Real-time Updates** - Live match scores update instantly via WebSocket
- **Match Filtering** - Filter by status (All, Live, Scheduled, Finished)
- **Detailed Match View** - Modal with events, venue, referee, and statistics
- **League Grouping** - Matches organized by leagues for easy browsing
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices
- **Modern UI** - Clean interface built with Tailwind CSS
- **Auto-sync** - Matches automatically update when backend changes occur
- **Smart Date Formatting** - Displays "Today", "Tomorrow", or formatted dates

## Tech Stack

- **React 19.1** - UI library
- **TypeScript 5.9** - Type safety
- **Vite 7.1** - Build tool and dev server
- **Tailwind CSS 4.1** - Utility-first CSS framework
- **Socket.io Client 4.8** - Real-time WebSocket communication
- **Axios 1.12** - HTTP client for REST API calls
- **date-fns 4.1** - Date formatting utilities
- **Lucide React 0.546** - Icon library
- **React Router DOM 7.9** - Client-side routing

## Prerequisites

Before running this project, make sure you have:

- **Node.js** (v18 or higher)
- **npm** or **yarn** package manager
- **Backend server** running (see backend README)

## Installation

1. **Clone the repository**

```bash
git clone https://github.com/MilosS994/Live-Football-Scores.git
cd client
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:8080/api/v1
```

**Important:** Make sure backend server is running on port 8080!

4. **Start development server**

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Running the Application

### Development mode (with hot reload)

```bash
npm run dev
```

- Server starts at: `http://localhost:5173`
- Hot reload enabled
- Source maps for debugging

### Production build

```bash
# Build for production
npm run build

# Preview production build locally
npm run preview
```

Production files will be in the `dist/` folder.

## How It Works

### Data Flow

```
Backend REST API → Initial Load → React State → UI Display
         ↓
WebSocket Events → State Updates → Instant UI Updates (No Refresh!)
```

1. **Initial Load**: Frontend fetches matches from REST API
2. **WebSocket Connection**: Establishes real-time connection to backend
3. **Subscribe**: Subscribes to "all-matches" room
4. **Live Updates**: Receives instant updates when matches change
5. **UI Updates**: React automatically re-renders with new data

### Real-time Updates

The app listens to these WebSocket events:

| Event            | Description                         | Action                   |
| ---------------- | ----------------------------------- | ------------------------ |
| `match:updated`  | Match data changed                  | Update match in list     |
| `score:updated`  | Score changed                       | Update score + animation |
| `status:changed` | Status changed (live/finished/etc.) | Update status badge      |
| `match:event`    | New event added (goal, card, etc.)  | Add to events list       |
| `match:created`  | New match created                   | Add to top of list       |
| `match:deleted`  | Match deleted                       | Remove from list         |

**No polling needed!** All updates are pushed from server instantly.

## Key Components

### HomePage (`src/pages/HomePage.tsx`)

Main page that displays all matches grouped by leagues.

**Features:**

- Fetches matches from REST API on load
- Connects to WebSocket for real-time updates
- Filters matches by status (All, Live, Scheduled, Finished)
- Groups matches by league
- Opens match details modal on click

**WebSocket Integration:**

```typescript
useEffect(() => {
  const socket = socketService.connect();
  socket.emit("subscribe:all");

  socketService.on("match:updated", (match) => {
    // Update match in state
  });

  return () => {
    socketService.disconnect();
  };
}, []);
```

### MatchModal (`src/components/matches/MatchModal.tsx`)

Detailed modal view for individual matches.

**Displays:**

- Match score and status (with live animation)
- League name
- Match date/time (formatted: "Today 19:30", "Tomorrow 15:00", etc.)
- Venue and referee information
- Match events timeline:
  - Goals
  - Yellow cards
  - Red cards
  - Substitutions
  - Penalties
- Quick statistics (home goals, away goals, total cards)

### socketService (`src/services/socketService.ts`)

WebSocket client singleton that manages connection to backend.

**Methods:**

- `connect()` - Establish WebSocket connection
- `disconnect()` - Close connection
- `on(event, callback)` - Listen to events
- `off(event)` - Stop listening to events

**Usage:**

```typescript
import socketService from "../services/socketService";

// Connect
const socket = socketService.connect();

// Subscribe to all matches
socket.emit("subscribe:all");

// Listen for updates
socketService.on("score:updated", (match) => {
  console.log("Score updated:", match);
});

// Cleanup
socketService.disconnect();
```

### matchService (`src/services/matchService.ts`)

REST API client for match operations.

**Available Methods:**

```typescript
getAllMatches(params?)    // GET /matches
getMatchById(id)          // GET /matches/:id
createMatch(data)         // POST /matches
updateMatch(id, data)     // PATCH /matches/:id
deleteMatch(id)           // DELETE /matches/:id
updateScore(id, scores)   // PATCH /matches/:id/score
updateStatus(id, status)  // PATCH /matches/:id/status
addEvent(id, event)       // POST /matches/:id/events
```

**Example:**

```typescript
import { matchService } from "../services/matchService";

// Get all live matches
const response = await matchService.getAllMatches({
  status: "live",
  limit: 50,
});

// Update score
await matchService.updateScore(matchId, {
  homeScore: 2,
  awayScore: 1,
});
```

## Project Structure

```
client/
├── public/              # Static assets
├── src/
│   ├── assets/          # Logo image
│   ├── components/      # React components
│   │   ├── layout/      # Layout components
│   │   │   │── Header.tsx
│   │   │   │── Footer.tsx
│   │   │   └── Layout.tsx
│   │   ├── matches/     # Match components
│   │   │   └── MatchModal.tsx
│   │   └── ui/          # Reusable UI components
│   │       └── Spinner.tsx
│   ├── pages/           # Page components
│   │   │── HomePage.tsx
│   │   └── NotFoundPage.tsx
│   ├── services/        # API and WebSocket services
│   │   ├── api.ts             # Axios configuration
│   │   ├── matchService.ts    # Match API calls
│   │   └── socketService.ts   # WebSocket client
│   ├── types/           # TypeScript interfaces
│   │   └── match.ts
│   ├── utils/           # Utility functions
│   │   └── formatMatchDate.ts
│   ├── App.tsx          # Root component
│   ├── main.tsx         # App entry point
│   └── index.css        # Global styles (Tailwind imports)
├── .env                 # Environment variables
├── index.html           # HTML entry point
├── package.json         # Dependencies and scripts
├── tsconfig.json        # TypeScript configuration
├── vite.config.ts       # Vite configuration
└── README.md            # This file
```

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Compile TypeScript and build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint to check code quality

## Environment Variables

| Variable          | Description          | Example                      |
| ----------------- | -------------------- | ---------------------------- |
| VITE_API_BASE_URL | Backend REST API URL | http://localhost:8080/api/v1 |

**Note:** All environment variables must be prefixed with `VITE_` to be exposed to the client.

## Data Models

### IMatch

```typescript
interface IMatch {
  _id: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  status: MatchStatus;
  league: string;
  startTime: string;
  venue?: string;
  referee?: string;
  events: IEvent[];
  createdAt?: string;
  updatedAt?: string;
}
```

### MatchStatus

```typescript
type MatchStatus = "scheduled" | "live" | "finished" | "postponed";
```

### IEvent

```typescript
interface IEvent {
  _id: string;
  type: EventType;
  minute: number;
  player: string;
  team: "home" | "away";
  description?: string;
}
```

### EventType

```typescript
type EventType =
  | "goal"
  | "yellow_card"
  | "red_card"
  | "substitution"
  | "penalty"
  | "own_goal";
```

## WebSocket Usage

### Connect and Subscribe

```typescript
// Connect to WebSocket
const socket = socketService.connect();

// Subscribe to all matches
socket.emit("subscribe:all");

// Subscribe to specific match
socket.emit("subscribe:match", matchId);

// Unsubscribe from specific match
socket.emit("unsubscribe:match", matchId);
```

### Listen to Events

```typescript
// Match updated
socketService.on("match:updated", (updatedMatch: IMatch) => {
  console.log("Match updated:", updatedMatch);
});

// Score updated
socketService.on("score:updated", (updatedMatch: IMatch) => {
  console.log("⚽ Goal! Score updated:", updatedMatch);
});

// Status changed
socketService.on("status:changed", ({ matchId, status }) => {
  console.log(`Match ${matchId} is now ${status}`);
});

// New event (goal, card, etc.)
socketService.on("match:event", ({ matchId, event }) => {
  console.log("New event:", event);
});

// Match created
socketService.on("match:created", (newMatch: IMatch) => {
  console.log("New match created:", newMatch);
});

// Match deleted
socketService.on("match:deleted", ({ matchId }) => {
  console.log("Match deleted:", matchId);
});
```

### Cleanup

```typescript
// Stop listening to specific event
socketService.off("match:updated");

// Disconnect (stops listening to all events)
socketService.disconnect();
```

## License

MIT

## Author

Milos Srejic - [GitHub](https://github.com/MilosS994)

---

**Note:** This is a portfolio project built to demonstrate full-stack development skills with real-time features using React, TypeScript, and WebSocket.
