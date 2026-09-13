import { addDays, format } from "date-fns";

// Shared by the hero availability bar and the List page so both agree on defaults and limits.
export const counters = [
  { name: "adult", label: "Adults", min: 1 },
  { name: "children", label: "Children", min: 0 },
  { name: "room", label: "Rooms", min: 1 },
];

export const defaultOptions = { adult: 2, children: 0, room: 1 };

export const defaultDates = () => [{ startDate: new Date(), endDate: addDays(new Date(), 3), key: "selection" }];

export const formatStayDate = (date) => format(date, "EEE, d MMM");

// Local calendar date for <input type="date" min>. toISOString would give the UTC date.
export const todayIso = () => format(new Date(), "yyyy-MM-dd");

export const clampOption = (name, value) => {
  const min = counters.find((c) => c.name === name)?.min ?? 0;
  return Math.max(min, Math.floor(Number(value) || 0));
};
