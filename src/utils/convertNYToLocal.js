import moment from "moment-timezone";

const convertNYToLocal = (time, date) => {
  // Format the date using moment
  const formatted = moment(date).format("YYYY-MM-DD");

  // Create moment object for NY time
  const nyTime = moment.tz(
    `${formatted} ${time}`,
    "YYYY-MM-DD hh:mm A",
    "America/New_York"
  );

  // Convert to user's local timezone
  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const userTime = nyTime.clone().tz(userTimezone);

  return userTime.format("hh:mm A");
};

export default convertNYToLocal;
