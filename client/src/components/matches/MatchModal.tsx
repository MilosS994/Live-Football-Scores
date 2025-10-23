import { X } from "lucide-react";
import { IMatch } from "../../types/match";
import formatMatchDate from "../../utils/formatMatchDate";

interface MatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  matchData: IMatch;
}

const MatchModal = ({ isOpen, onClose, matchData }: MatchModalProps) => {
  if (!isOpen) return null;

  // Function to get status badge
  const getStatusBadge = () => {
    switch (matchData.status) {
      case "live":
        return (
          <span className="inline-flex items-center gap-2 bg-red-100 text-red-700 px-3 py-1 rounded-full animate-pulse font-semibold">
            <span className="w-2 h-2 bg-red-600 rounded-full"></span>
            LIVE
          </span>
        );
      case "finished":
        return (
          <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full font-semibold">
            FINISHED
          </span>
        );
      case "scheduled":
        return (
          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-semibold">
            SCHEDULED
          </span>
        );
      // Postponed only left
      default:
        return (
          <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full font-semibold uppercase">
            {matchData.status}
          </span>
        );
    }
  };

  // Function to get event icon
  const getEventIcon = (type: string) => {
    switch (type) {
      case "goal":
        return "⚽";
      case "yellow_card":
        return "🟨";
      case "red_card":
        return "🟥";
      case "substitution":
        return "🔄";
      case "penalty":
        return "⚽";
      case "own_goal":
        return "⚽(OG)";
      default:
        return "•";
    }
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-40 bg-black/5 bg-opacity-20 backdrop-blur-xs"
        onClick={onClose}
      />

      {/* Match Card */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="relative bg-gradient-to-r from-blue-50 to-red-50 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-2 right-2 z-10 p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors duration-100 cursor-pointer"
          >
            <X size={20} className="text-gray-700" />
          </button>

          <div className="p-6 text-gray-700">
            {/* Match schedule */}
            <h4 className="text-base md:text-lg text-center mb-4 italic">
              {formatMatchDate(matchData.startTime)}
            </h4>
            {/* League */}
            <h3 className="text-base md:text-lg text-center text-blue-600 font-semibold mb-2">
              {matchData.league}
            </h3>
            {/* Teams names */}
            <p className="text-center text-lg md:text-xl text-gray-900 font-semibold mb-1">
              {matchData.homeTeam} vs {matchData.awayTeam}
            </p>
            {/* Score */}
            <p className="text-center text-xl md:text-2xl text-black font-bold">
              {matchData.homeScore} : {matchData.awayScore}
            </p>
            {/* Status Badge */}
            <div className="flex justify-center mt-3 mb-4">
              {getStatusBadge()}
            </div>
            {/* Referee & Venue  */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 p-4 bg-gray-50 rounded-lg">
              {matchData.venue && (
                <div className="flex items-start gap-2">
                  <span className="text-2xl">🏟️</span>
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-semibold">
                      Venue
                    </p>
                    <p className="font-semibold text-gray-800">
                      {matchData.venue}
                    </p>
                  </div>
                </div>
              )}
              {matchData.referee && (
                <div className="flex items-start gap-2">
                  <span className="text-2xl">👨‍⚖️</span>
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-semibold">
                      Referee
                    </p>
                    <p className="font-semibold text-gray-800">
                      {matchData.referee}
                    </p>
                  </div>
                </div>
              )}
            </div>
            {/* Divider */}
            <div className="border-t border-gray-200 my-6"></div>

            {/* Match Events */}
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span>📋</span> Match Events
              </h3>

              {matchData.events.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">No events recorded yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {matchData.events
                    .sort((a, b) => a.minute - b.minute)
                    .map((event, index) => (
                      <div
                        key={index}
                        className={`flex items-start gap-3 p-3 rounded-lg transition-all hover:shadow-md ${
                          event.team === "home"
                            ? "bg-blue-50 border-l-4 border-blue-500"
                            : "bg-red-50 border-l-4 border-red-500"
                        }`}
                      >
                        {/* Minute Circle */}
                        <div className="flex-shrink-0">
                          <div className="bg-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-sm text-gray-700 shadow-sm border-2 border-gray-200">
                            {event.minute}'
                          </div>
                        </div>

                        {/* Event Details */}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xl">
                              {getEventIcon(event.type)}
                            </span>
                            <span className="font-semibold text-gray-700 capitalize text-sm">
                              {event.type.replace("_", " ")}
                            </span>
                          </div>
                          <p className="font-bold text-gray-900">
                            {event.player}
                          </p>
                          {event.description && (
                            <p className="text-xs text-gray-600 mt-1">
                              {event.description}
                            </p>
                          )}
                          <div className="mt-2">
                            <span
                              className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                                event.team === "home"
                                  ? "bg-blue-600 text-white"
                                  : "bg-red-600 text-white"
                              }`}
                            >
                              {event.team === "home"
                                ? matchData.homeTeam
                                : matchData.awayTeam}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MatchModal;
