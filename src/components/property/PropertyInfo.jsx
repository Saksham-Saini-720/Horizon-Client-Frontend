
import { memo } from "react";

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

  // Price per sqft
  const sqftNum = parseInt((property.area || '').replace(/,/g, ''), 10);
  const pricePerSqft = rawPrice && sqftNum > 0
    ? Math.round(rawPrice / sqftNum)
    : null;

  return (
    <div className="px-5 pt-5 pb-4">

      {/* Status / type tag badges */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-[10px] font-semibold px-3 py-1.5 rounded-full border border-teal-500 text-teal-600 tracking-widest uppercase font-myriad">
          {property.tag}
        </span>
        {property.type && (
          <span className="text-[10px] font-semibold px-3 py-1.5 rounded-full border border-amber-400 text-amber-600 tracking-widest uppercase font-myriad">
            {property.type}
          </span>
        )}
      </div>

      {/* Title — last word is italic orange for the premium look */}
      <h1 className="text-[24px] font-bold text-primary font-myriad leading-tight mb-1.5">
        {titlePrefix && <span>{titlePrefix} </span>}
        <span className="italic text-primary-light">{lastWord}</span>
      </h1>

      {/* Location */}
      <p className="text-[13px] text-gray-500 font-myriad mb-4">
        <span className="text-gray-400 mr-1">—</span>
        {property.location}
      </p>

      {/* Dark navy price banner */}
      <div className="bg-gradient-to-br from-[#1a2550] to-secondary rounded-2xl px-5 py-4 flex items-center justify-between">
        <div className="flex items-baseline gap-2">
          {rawCurrency && (
            <span className="text-[11px] text-white/50 font-semibold font-myriad uppercase tracking-wider">
              {rawCurrency}
            </span>
          )}
          <span className="text-[28px] font-bold text-white font-myriad tracking-tight">
            {formattedNumber}
          </span>
        </div>
        {pricePerSqft && (
          <span className="text-[13px] text-white/55 font-myriad">
            ${pricePerSqft}/sqft
          </span>
        )}
      </div>

    </div>
  );
});

PropertyInfo.displayName = 'PropertyInfo';
export default PropertyInfo;
