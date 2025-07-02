import moment from "moment-timezone";

export const convertFromUTC = (utcDate, timezone) => {
  try {
    const momentDate = moment.utc(utcDate).tz(timezone);
    return {
      time: momentDate.format("h:mm A"),
      date: momentDate.format("YYYY-MM-DD"),
      fullDateTime: momentDate.format("YYYY-MM-DD h:mm A"),
      abbreviation: momentDate.format("z"),
    };
  } catch (error) {
    console.error("Error converting UTC to timezone:", error);
    return {
      time: moment.utc(utcDate).format("h:mm A"),
      date: moment.utc(utcDate).format("YYYY-MM-DD"),
      fullDateTime: moment.utc(utcDate).format("YYYY-MM-DD h:mm A"),
      abbreviation: "UTC",
    };
  }
};

export const formatTimeForTimezone = (
  appointmentTimeUTC,
  timezone,
  fallbackTime,
  fallbackDate
) => {
  if (appointmentTimeUTC && timezone) {
    const converted = convertFromUTC(appointmentTimeUTC, timezone);
    return `${converted.date} at ${converted.time} (${converted.abbreviation})`;
  }
  // Fallback to original format if timezone data is not available
  return `${fallbackDate} at ${fallbackTime}`;
};
