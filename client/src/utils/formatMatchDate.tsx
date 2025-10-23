import { format } from "date-fns";

const formatMatchDate = (startTime: string) => {
  const matchDate = new Date(startTime);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const isToday = matchDate.toDateString() === today.toDateString();
  const isTomorrow = matchDate.toDateString() === tomorrow.toDateString();

  if (isToday) {
    return `Today ${format(matchDate, "HH:mm")}`;
  } else if (isTomorrow) {
    return `Tomorrow ${format(matchDate, "HH:mm")}`;
  } else {
    return format(matchDate, "EEE, MMM dd · HH:mm");
  }
};

export default formatMatchDate;
