import { useState, useEffect } from "react";
import { IMatch, MatchStatus } from "../types/match";
import { matchService } from "../services/matchService";
import socketService from "../services/socketService";
import Spinner from "../components/ui/Spinner";
import formatMatchDate from "../utils/formatMatchDate";
import MatchModal from "../components/matches/MatchModal";

const HomePage = () => {
  const [matches, setMatches] = useState<IMatch[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<null | string>(null);
  const [statusFilter, setStatusFilter] = useState<MatchStatus | "all">("all");

  const [matchCardOpen, setMatchCardOpen] = useState<boolean>(false);
  const [matchData, setMatchData] = useState<IMatch | null>(null);

  useEffect(() => {
    const socket = socketService.connect();

    // Subscribe na sve mečeve
    socket.emit("subscribe:all");

    // Match updated
    socketService.on("match:updated", (updatedMatch: IMatch) => {
      setMatches((prev) =>
        prev.map((m) => (m._id === updatedMatch._id ? updatedMatch : m))
      );
    });

    // Score updated
    socketService.on("score:updated", (updatedMatch: IMatch) => {
      console.log("Score updated!");
      setMatches((prev) =>
        prev.map((m) => (m._id === updatedMatch._id ? updatedMatch : m))
      );
    });

    // Status changed
    socketService.on("status:changed", ({ matchId, status }) => {
      setMatches((prev) =>
        prev.map((m) =>
          m._id === matchId ? { ...m, status: status as MatchStatus } : m
        )
      );
    });

    // Match event
    socketService.on("match:event", ({ matchId, event }) => {
      setMatches((prev) =>
        prev.map((m) =>
          m._id === matchId ? { ...m, events: [...m.events, event] } : m
        )
      );

      if (matchData && matchData._id === matchId) {
        setMatchData({ ...matchData, events: [...matchData.events, event] });
      }
    });

    // Match created
    socketService.on("match:created", (newMatch: IMatch) => {
      setMatches((prev) => [newMatch, ...prev]);
    });

    // Match deleted
    socketService.on("match:deleted", ({ matchId }) => {
      setMatches((prev) => prev.filter((m) => m._id !== matchId));
      if (matchData?._id === matchId) {
        setMatchCardOpen(false);
        setMatchData(null);
      }
    });

    fetchMatches();

    // Cleanup
    return () => {
      socketService.off("match:updated");
      socketService.off("score:updated");
      socketService.off("status:changed");
      socketService.off("match:event");
      socketService.off("match:created");
      socketService.off("match:deleted");
      socketService.disconnect();
    };
  }, [statusFilter]);
  const fetchMatches = async () => {
    try {
      setLoading(true);
      setError(null);

      const params: any = { limit: 50 };

      if (statusFilter !== "all") {
        params.status = statusFilter;
      }

      const response = await matchService.getAllMatches(params);
      setMatches(response.matches || []);
    } catch (error) {
      setError("Failed to fetch matches");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const groupedMatches: Record<string, IMatch[]> = {};

  matches.forEach((match) => {
    const league = match.league;

    if (!groupedMatches[league]) {
      groupedMatches[league] = [];
    }

    groupedMatches[league].push(match);
  });

  // If loading matches, just show loader with text
  if (loading === true)
    return (
      <div className="flex-1 flex flex-col gap-1 items-center justify-center">
        <Spinner />
        <p className="font-light text-gray-800">Loading matches...</p>
      </div>
    );

  // If there is an error, display it as a text
  // Additionally we add the button for trying to fetch matches again
  if (error !== null)
    return (
      <div className="flex-1 flex flex-col gap-1 items-center justify-center">
        <p className="font-semibold text-red-400">{error}</p>
        <button
          onClick={fetchMatches}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Try Again
        </button>
      </div>
    );

  return (
    <div className="flex-1 py-4">
      {/* Header */}
      <section className="px-2">
        {/* Title */}
        <h1 className="text-2xl md:text-3xl font-bold text-center mb-4 text-red-800 text-shadow-sm text-shadow-red-200">
          Football Live Score
        </h1>
        {/* Filter buttons */}

        <div className="flex gap-2 flex-wrap mt-4 items-center justify-center text-xs sm:text-sm">
          <button
            onClick={() => setStatusFilter("all")}
            className={`
  px-2 py-1 rounded-lg font-medium shadow-sm cursor-pointer hover:bg-slate-200
  ${
    statusFilter === "all"
      ? "bg-slate-600 text-white"
      : "bg-white text-gray-700"
  }
`}
          >
            All
          </button>
          <button
            onClick={() => setStatusFilter("live")}
            className={`
  px-2 py-1 rounded-lg font-medium shadow-sm cursor-pointer hover:bg-slate-200
  ${
    statusFilter === "live"
      ? "bg-slate-600 text-white"
      : "bg-white text-gray-700"
  }
`}
          >
            Live
          </button>
          <button
            onClick={() => setStatusFilter("scheduled")}
            className={`
  px-2 py-1 rounded-lg font-medium shadow-sm cursor-pointer hover:bg-slate-200
  ${
    statusFilter === "scheduled"
      ? "bg-slate-600 text-white"
      : "bg-white text-gray-700"
  }
`}
          >
            Scheduled
          </button>
          <button
            onClick={() => setStatusFilter("finished")}
            className={`
  px-2 py-1 rounded-lg font-medium shadow-sm cursor-pointer hover:bg-slate-200
  ${
    statusFilter === "finished"
      ? "bg-slate-600 text-white"
      : "bg-white text-gray-700"
  }
`}
          >
            Finished
          </button>
        </div>
      </section>

      {/* Matches */}
      <main className="mt-8">
        {Object.entries(groupedMatches).map(([league, leagueMatches]) => (
          <div key={league} className="mb-6 bg-white p-4 rounded shadow">
            {/* League name */}
            <h2 className="text-xl font-bold mb-4 text-shadow-sm">{league}</h2>
            {/* Matches of that league */}
            {leagueMatches.map((match) => (
              <div
                onClick={() => {
                  setMatchData(match), setMatchCardOpen(true);
                }} // When clicked on the match, we set the match data in the matchData and forward it to matchCard modal and we open the modal
                className="flex justify-between items-center text-xs sm:text-sm md:text-base px-2 md:px-4 rounded-lg cursor-pointer hover:bg-red-50 hover:shadow-sm shadow-red-50 transition-all duration-75"
              >
                {/* Home vs away team */}
                <div
                  key={match._id}
                  className="p-2 border-b border-gray-400 text-red-800 flex justify-between w-2/5"
                >
                  {match.homeTeam} vs {match.awayTeam}
                </div>
                {/* Match score */}
                <p className="w-1/5 text-right font-semibold">
                  {match.status === "scheduled" ? "-" : match.homeScore}:
                  {match.status === "scheduled" ? "-" : match.awayScore}
                </p>
                {/* Match status */}
                <div
                  className={`w-2/5 text-right ${
                    match.status === "live" && "animate-pulse text-green-600"
                  }`}
                >
                  {match.status === "live"
                    ? "🔴 Live"
                    : match.status === "scheduled"
                    ? formatMatchDate(match.startTime)
                    : match.status.charAt(0).toUpperCase() +
                      match.status.slice(1)}
                </div>
              </div>
            ))}
          </div>
        ))}
      </main>

      {/* Match Card */}
      {matchCardOpen && matchData && (
        <MatchModal
          onClose={() => {
            setMatchCardOpen(false), setMatchData(null);
          }}
          isOpen={matchCardOpen}
          matchData={matchData!}
        />
      )}
    </div>
  );
};

export default HomePage;
