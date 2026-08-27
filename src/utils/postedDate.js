// Formatting for a listing's posting date.
//
// The date shown is `sourcePostedAt` — when the listing was actually posted —
// not `createdAt`, which for this catalogue is the bulk-import timestamp. The
// two differ by more than a week on 84% of listings, and by up to 2,400 days at
// the extreme, so displaying createdAt would date a 2019 listing to last month.
//
// The year is never dropped for anything outside the current year. Listings here
// span 2019 to 2026, and "Dec 4" on a six-year-old post reads as this December.

const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

/** "4 Dec 2019", or "22 Aug" for dates inside the current year. */
export const formatPostedDate = (value) => {
  const date = toDate(value);
  if (!date) return null;
  const sameYear = date.getFullYear() === new Date().getFullYear();
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    ...(sameYear ? {} : { year: 'numeric' }),
  });
};

/** The unambiguous form, for tooltips and accessible labels. */
export const formatPostedDateFull = (value) => {
  const date = toDate(value);
  if (!date) return null;
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

/**
 * What a card shows: relative wording only while it is genuinely useful, then a
 * real date. "437 days ago" is not information anyone can act on, and most of
 * this catalogue is older than that.
 */
export const formatPostedLabel = (value) => {
  const date = toDate(value);
  if (!date) return null;

  const diff = Date.now() - date.getTime();

  // A future post date means clock skew or a bad import, not a scheduled post.
  // Showing "in 3 days" would look like a bug to a user; the date does not.
  if (diff < 0) return formatPostedDate(value);

  if (diff < HOUR) return 'Just now';
  if (diff < DAY) {
    const hours = Math.floor(diff / HOUR);
    return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  }
  if (diff < 7 * DAY) {
    const days = Math.floor(diff / DAY);
    return days === 1 ? 'Yesterday' : `${days} days ago`;
  }
  return formatPostedDate(value);
};

function toDate(value) {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}
