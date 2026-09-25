/**
 * Money formatting.
 *
 * The API stores and returns every amount as an integer count of the
 * currency's smallest unit (`amountMinor`) with a three-letter code, never as
 * a float. This turns those integers back into something a person reads.
 *
 * The number of decimal places is a property of the currency, not a constant:
 * ISO 4217 gives JPY an exponent of 0 and KWD 3, while most use 2. Dividing
 * everything by 100 would show a ¥1,500 receipt as ¥15.00. The table mirrors
 * `src/utils/money.js` in horizon-prop, which is the server's own copy — the
 * two have to agree about where the point goes.
 */

const EXPONENTS = {
  // Zero-decimal
  BIF: 0, CLP: 0, DJF: 0, GNF: 0, ISK: 0, JPY: 0, KMF: 0, KRW: 0,
  PYG: 0, RWF: 0, UGX: 0, VND: 0, VUV: 0, XAF: 0, XOF: 0, XPF: 0,
  // Three-decimal
  BHD: 3, IQD: 3, JOD: 3, KWD: 3, LYD: 3, OMR: 3, TND: 3,
};

const DEFAULT_EXPONENT = 2;

const normalize = (currency) => String(currency ?? "").trim().toUpperCase();

export const exponentFor = (currency) =>
  EXPONENTS[normalize(currency)] ?? DEFAULT_EXPONENT;

/** Minor units to a major-unit number, for prefilling an input. */
export const fromMinor = (minor, currency) =>
  Number(minor ?? 0) / 10 ** exponentFor(currency);

/** Render an amount with its currency. Always shows the code or symbol. */
export const formatMoney = (minor, currency, { locale = "en-GB" } = {}) => {
  const code = normalize(currency);
  const digits = exponentFor(code);
  const value = fromMinor(minor, code);

  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: code,
      minimumFractionDigits: digits,
      maximumFractionDigits: digits,
    }).format(value);
  } catch {
    return `${code} ${value.toFixed(digits)}`;
  }
};
