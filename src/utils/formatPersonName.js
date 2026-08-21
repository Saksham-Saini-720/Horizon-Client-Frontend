/**
 * Person-name casing, applied where names are read.
 *
 * The API normalises names on write (formatPersonName in horizon-prop's
 * validation layer), so this is a failsafe: it covers accounts created before
 * that rule existed, and anything that reaches the client from an import or a
 * direct database edit. Same algorithm as the server's and as the admin
 * console's copy in Horizon-Admin/src/utils/formatters.js — lowercase
 * everything, then capitalise after each space, hyphen or apostrophe — so the
 * three cannot show the same person differently.
 *
 * It flattens intentional inner capitals ("McDonald" → "Mcdonald"). That is
 * inherent to normalising casing you cannot trust, and it beats greeting
 * someone as "shorya".
 */
export const formatPersonName = (raw) => {
  if (!raw || typeof raw !== "string") return raw ?? "";
  return raw
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase()
    .replace(/(^|[\s'’-])(\p{L})/gu, (_, boundary, letter) => boundary + letter.toUpperCase());
};

export default formatPersonName;
