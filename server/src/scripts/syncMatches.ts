import connectDB from "../config/db.js";
import {
  syncAllLeagues,
  getTodayDateRange,
} from "../services/footballApiService.js";

const syncMatches = async () => {
  try {
    await connectDB();

    console.log("Starting sync...\n");

    const { dateFrom, dateTo } = getTodayDateRange();
    console.log(`Date: ${dateFrom} to ${dateTo}\n`);

    await syncAllLeagues(dateFrom, dateTo);

    console.log("\nDone!");
    process.exit(0);
  } catch (error) {
    console.error("\nFailed:", error);
    throw error;
  }
};

syncMatches();
