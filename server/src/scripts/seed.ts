import mongoose from "mongoose";
import Match from "../models/Match.js";
import connectDB from "../config/db.js";
import "dotenv/config";

const leagues = [
  "Premier League",
  "La Liga",
  "Serie A",
  "Bundesliga",
  "Superliga Srbije",
  "Ligue 1",
];

const teams: Record<string, string[]> = {
  "Premier League": [
    "Manchester City",
    "Arsenal",
    "Liverpool",
    "Chelsea",
    "Manchester United",
    "Tottenham",
  ],
  "La Liga": [
    "Real Madrid",
    "Barcelona",
    "Atletico Madrid",
    "Sevilla",
    "Valencia",
    "Villarreal",
  ],
  "Serie A": ["Inter Milan", "AC Milan", "Juventus", "Napoli", "Roma", "Lazio"],
  Bundesliga: [
    "Bayern Munich",
    "Borussia Dortmund",
    "RB Leipzig",
    "Bayer Leverkusen",
    "Union Berlin",
    "Eintracht Frankfurt",
  ],
  "Superliga Srbije": [
    "Crvena Zvezda",
    "Partizan",
    "Vojvodina",
    "TSC Bačka Topola",
    "Čukarički",
    "Radnički Niš",
  ],
  "Ligue 1": ["PSG", "Marseille", "Monaco", "Lyon", "Lille", "Nice"],
};

const venues: Record<string, string[]> = {
  "Premier League": [
    "Etihad Stadium",
    "Emirates Stadium",
    "Anfield",
    "Stamford Bridge",
  ],
  "Superliga Srbije": [
    "Rajko Mitić",
    "Stadion Partizana",
    "Karađorđe",
    "TSC Arena",
  ],
  "La Liga": ["Santiago Bernabéu", "Camp Nou", "Wanda Metropolitano"],
  "Serie A": ["San Siro", "Allianz Stadium", "Stadio Olimpico"],
  Bundesliga: ["Allianz Arena", "Signal Iduna Park", "Deutsche Bank Park"],
  "Ligue 1": ["Parc des Princes", "Stade Vélodrome", "Groupama Stadium"],
};

const getRandomElement = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)]!;
};

const getRandomNumber = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const generateMatches = () => {
  const matches = [];
  const now = new Date();

  for (let i = 0; i < 30; i++) {
    const league = getRandomElement(leagues);
    const leagueTeams = teams[league] || [];
    const leagueVenues = venues[league] || ["Stadium"];

    let startTime: Date;
    let status: "scheduled" | "live" | "finished";
    let homeScore = 0;
    let awayScore = 0;

    const random = Math.random();

    if (random < 0.25) {
      // 25% - finished matches
      startTime = new Date(
        now.getTime() - getRandomNumber(1, 72) * 60 * 60 * 1000
      );
      status = "finished";
      homeScore = getRandomNumber(0, 4);
      awayScore = getRandomNumber(0, 4);
    } else if (random < 0.4) {
      // 15% - live matches
      startTime = new Date(now.getTime() - getRandomNumber(10, 90) * 60 * 1000);
      status = "live";
      homeScore = getRandomNumber(0, 3);
      awayScore = getRandomNumber(0, 3);
    } else {
      // 60% - scheduled matches
      startTime = new Date(
        now.getTime() + getRandomNumber(1, 168) * 60 * 60 * 1000
      );
      status = "scheduled";
    }

    let homeTeam = getRandomElement(leagueTeams);
    let awayTeam = getRandomElement(leagueTeams);
    while (homeTeam === awayTeam) {
      awayTeam = getRandomElement(leagueTeams);
    }

    matches.push({
      homeTeam,
      awayTeam,
      league,
      startTime,
      status,
      homeScore,
      awayScore,
      venue: getRandomElement(leagueVenues),
      referee: `Referee ${getRandomNumber(1, 50)}`,
    });
  }

  return matches;
};

const seed = async () => {
  try {
    console.log("Starting database seed...\n");

    await connectDB();

    console.log("Clearing existing data...");
    await Match.deleteMany({});
    console.log("Existing data cleared\n");

    console.log("Generating mock matches...");
    const matches = generateMatches();

    console.log("Inserting matches into database...");
    const insertedMatches = await Match.insertMany(matches);
    console.log(`Inserted ${insertedMatches.length} matches\n`);

    const liveCount = await Match.countDocuments({ status: "live" });
    const scheduledCount = await Match.countDocuments({ status: "scheduled" });
    const finishedCount = await Match.countDocuments({ status: "finished" });

    console.log("Database Statistics:");
    console.log(`   - Live matches: ${liveCount}`);
    console.log(`   - Scheduled matches: ${scheduledCount}`);
    console.log(`   - Finished matches: ${finishedCount}`);
    console.log(`   - Total: ${insertedMatches.length}\n`);

    console.log("Database seeded successfully!");

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seed();
