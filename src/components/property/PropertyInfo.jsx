
import { memo } from "react";
import { getCurrencySymbol } from "../../utils/propertyTransform";
import { areaUnitLabel } from "../../config/areaUnits";

const PropertyInfo = memo(({ property }) => {
  // Split title so the last word gets italic orange styling
  const words = (property.title || '').trim().split(' ');
  const lastWord = words.pop();
  const titlePrefix = words.join(' ');

  // Parse the formatted price string (e.g. "$ 1,650,000") to extract currency vs number
  const rawCurrency = property.rawData?.currency || '';
  const rawPrice = property.rawPrice;

  const formattedNumber = rawPrice
    ? new Intl.NumberFormat('en-US').format(rawPrice)
    : property.price;

  const currencySymbol = getCurrencySymbol(rawCurrency);
  const isRent = property.purpose === 'rent';

  // Price per unit of area. `rawArea` and `areaUnit` come straight off the
  // transform now, so there is no string to parse and no unit to guess — the
  // previous version sniffed `/acre/i` against the formatted string because the
  // unit was not carried through the API projection at all.
  const areaNum = Number(property.rawArea);
  const areaLabel = areaUnitLabel(property.areaUnit, 1) ?? '';

  const pricePerUnit = rawPrice && areaNum > 0 ? rawPrice / areaNum : null;

  // Sub-unit rates are common in ZMW, where rounding to 0 or 1 loses the number.
  const formattedPerUnit = pricePerUnit === null
    ? null
    : pricePerUnit >= 10
      ? new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(pricePerUnit)
      : pricePerUnit.toFixed(2);

  return (
    <div className="px-5 pt-5 pb-4">

      {/* Status / type tag badges */}
      <div className="flex items-center gap-2 mb-3">
        <span
          className="text-[11px] font-semibold px-3 py-[2px] rounded-full tracking-widest uppercase font-myriad"
          style={{
            background: "rgba(20,184,166,0.10)",
            border: "1px solid rgba(20,184,166,0.28)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            color: "#0d9488",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.5)",
          }}
        >
          {property.tag}
        </span>
        {property.type && (
          <span
            className="text-[11px] font-semibold px-3 py-[2px] rounded-full tracking-widest uppercase font-myriad"
            style={{
              background: "rgba(245,158,11,0.10)",
              border: "1px solid rgba(245,158,11,0.28)",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
              color: "#d97706",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.5)",
            }}
          >
            {property.type}
          </span>
        )}
      </div>

      {/* Title — last word is italic orange for the premium look */}
      <h1 className="text-[24px] font-bold text-secondary font-display leading-tight mb-1.5">
        {titlePrefix && <span>{titlePrefix} </span>}
        <span className="italic text-primary-light">{lastWord}</span>
      </h1>

      {/* Location */}
      <p className="text-[13px] text-gray-500 italic font-display mb-2">
        <span className="text-gray-400 mr-1">—</span>
        {property.location}
      </p>

      {/* Posted date. Spelled out in full here rather than relatively: on the
          detail page the reader is deciding, and "Posted 4 December 2019" is
          the fact that matters. */}
      {property.postedExact && (
        <p className="text-[12px] text-gray-400 font-myriad mb-4">
          Posted {property.postedExact}
        </p>
      )}

      {/* Dark navy price banner */}
      {/* shadow-card is navy-tinted, which is what lets a navy banner cast a
          shadow that reads as depth rather than as grey haze around it. */}
      <div className="bg-gradient-to-br from-[#1a2550] to-secondary rounded-2xl px-5 py-3 flex items-center justify-between shadow-card">
        <div className="flex items-baseline gap-2">
          {rawCurrency && (
            <span className="text-[11px] text-primary-light font-semibold font-display uppercase tracking-wider">
              {rawCurrency}
            </span>
          )}
          <span className="text-[32px] font-bold text-white font-display tracking-tight">
            {formattedNumber}
          </span>
          {isRent && (
            <span className="text-[13px] text-white/55 font-display">/mo</span>
          )}
        </div>
        {formattedPerUnit !== null && (
          <span className="text-[13px] text-white/55 font-display">
            {currencySymbol} {formattedPerUnit}/{areaLabel}{isRent ? '/mo' : ''}
          </span>
        )}
      </div>

    </div>
  );
});

PropertyInfo.displayName = 'PropertyInfo';
export default PropertyInfo;
