import { memo } from "react";

/**
 * The single source of truth for how a property price looks.
 *
 * Every card was styling its own price inline, so the currency colour, face and
 * size drifted apart card by card (orange vs grey, Fraunces vs Manrope, 27px vs
 * 16px). Anything that renders a price should use this component rather than
 * re-declaring the treatment — that is what keeps them in step.
 *
 * The rule, fixed for every size:
 *   currency — Manrope, bold, uppercase, 0.12em tracking, brand orange
 *   amount   — Fraunces (the display face), 700, near-black, -0.3px tracking
 * Only the two font sizes vary, and only via the named steps in SIZES.
 */

// Prices arrive from the API pre-formatted, e.g. "ZMW 2,400,000".
const DEFAULT_CURRENCY = "ZMW";

const splitPrice = (price) => {
  const parts = String(price ?? "").trim().split(" ");
  // No space means no currency prefix to peel off — treat the whole value as
  // the amount rather than mistaking it for a currency code.
  if (parts.length < 2) return { currency: DEFAULT_CURRENCY, amount: price };
  return { currency: parts[0], amount: parts.slice(1).join(" ") };
};

/**
 * Compact form for narrow cards: 1250000 → "1,250k".
 *
 * Built from rawPrice, which carries no period suffix, so the "/mo" on a rental
 * has to be carried over from the formatted string — otherwise a rent price
 * silently renders as though it were a sale price.
 */
const abbreviateAmount = (rawPrice, formattedAmount) => {
  const suffix = String(formattedAmount ?? "").match(/\/\w+$/)?.[0] ?? "";
  const value =
    rawPrice >= 1000
      ? `${(rawPrice / 1000).toLocaleString("en-US")}k`
      : rawPrice.toLocaleString("en-US");
  return `${value}${suffix}`;
};

/**
 * Two steps, not free-form numbers — a card picks the step that matches its
 * width instead of inventing a size.
 *   md — full-width list cards, where the price is the card's headline
 *   sm — compact grid/carousel cards, where it sits under the details
 */
const SIZES = {
  sm: { currency: 10, amount: "text-[19px]" },
  md: { currency: 10.5, amount: "text-[22px] sm:text-[27px]" },
};

const PropertyPrice = memo(({
  price,
  // Pass both to abbreviate: rawPrice is the number, price supplies the currency
  // and any "/mo" suffix. Without rawPrice the flag is ignored rather than
  // guessing at the digits in the formatted string.
  rawPrice,
  abbreviate = false,
  size = "md",
  className = "",
}) => {
  const { currency, amount } = splitPrice(price);
  const step = SIZES[size] ?? SIZES.md;
  const display =
    abbreviate && rawPrice != null ? abbreviateAmount(rawPrice, amount) : amount;

  return (
    <div className={`flex items-baseline gap-1.5 ${className}`}>
      <span
        className="font-myriad font-bold uppercase tracking-[0.12em] text-primary-light flex-shrink-0"
        style={{ fontSize: step.currency }}
      >
        {currency}
      </span>
      <p
        className={`leading-none font-display font-bold text-primary ${step.amount}`}
        style={{ letterSpacing: "-0.3px" }}
      >
        {display}
      </p>
    </div>
  );
});

PropertyPrice.displayName = "PropertyPrice";

export default PropertyPrice;
