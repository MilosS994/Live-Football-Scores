import {
  syncAllLeagues,
  getTodayDateRange,
} from "../services/footballApiService.js";

const syncLiveMatches = async () => {
  try {
    const startTime = new Date();
    console.log(
      `\n[LIVE SYNC] ${startTime.toLocaleTimeString()} - Starting...`
    );

    const { dateFrom, dateTo } = getTodayDateRange();
    const count = await syncAllLeagues(dateFrom, dateTo);

    const endTime = new Date();
    const duration = ((endTime.getTime() - startTime.getTime()) / 1000).toFixed(
      1
    );

    console.log(`[LIVE SYNC] Done in ${duration}s - Synced ${count} matches\n`);
  } catch (error) {
    console.error("ERROR: [LIVE SYNC] failed!", error);
  }
};

export const startLiveSyncJob = () => {
  console.log("Starting live sync job every 5 minutes...\n");

  syncLiveMatches(); // Inital call

  //   Now call it every 5 minutes
  setInterval(() => {
    syncLiveMatches();
  }, 5 * 60 * 1000);
};
