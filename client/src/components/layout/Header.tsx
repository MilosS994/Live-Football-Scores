import { format } from "date-fns";
import { useEffect, useState } from "react";
import LOGO from "../../assets/football-live-score-logo.png";

const Header = () => {
  const [time, setTime] = useState(format(new Date(), "HH:mm:ss"));
  const [dayOfTheWeek, setDayOfTheWeek] = useState(format(new Date(), "EEEE"));
  const [date, setDate] = useState(format(new Date(), "dd/MM/yyyy"));

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setTime(format(now, "HH:mm:ss"));
      setDayOfTheWeek(format(now, "EEEE"));
      setDate(format(now, "dd/MM/yyyy"));
    }, 1000); // Update time, day of the week and date

    return () => {
      clearInterval(interval);
    };
  });
  return (
    <header className="flex justify-between items-center p-4 border-b-2 bg-gradient-to-b from-gray-200 via-neutral-200 to-white border-gray-300 shadow-inner">
      <div className="w-24 cursor-pointer">
        <img src={LOGO} alt="Football Live" />
      </div>
      <div className="flex flex-col items-end text-sm font-semibold">
        <p className="text-gray-800">
          {dayOfTheWeek} {date}
        </p>
        <p className="text-blue-900">{time}</p>
      </div>
    </header>
  );
};

export default Header;
