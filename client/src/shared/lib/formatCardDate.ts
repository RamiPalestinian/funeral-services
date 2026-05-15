const CARD_DATE_PART_OPTIONS: Intl.DateTimeFormatOptions = {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
};

const CARD_TIME_PART_OPTIONS: Intl.DateTimeFormatOptions = {
  hour: "2-digit",
  minute: "2-digit",
};

export function formatCardDate(iso?: string | null): string {
  if (!iso) return "Дата не указана";

  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "Дата не указана";

  const datePart = date.toLocaleDateString("ru-RU", CARD_DATE_PART_OPTIONS);
  const timePart = date.toLocaleTimeString("ru-RU", CARD_TIME_PART_OPTIONS);

  return `${datePart} ${timePart}`;
}
