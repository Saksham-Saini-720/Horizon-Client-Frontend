// Area measurement units — mirrored from horizon-prop/src/config/areaUnits.js.
//
// Keep in step with that file: it is the origin, and the service validates
// against its key set. A unit added there but not here renders as a bare number
// with no label; a unit added here but not there is rejected on save.
//
// `AREA_UNITS` keys are the API tokens ("acres"), not display strings ("acre").
// Three different vocabularies for this field used to coexist across the app —
// the tokens, the labels, and a singular "acre" — which is why components
// resorted to regex-sniffing the formatted string to work out the unit.

export const AREA_UNITS = {
  sqm: { label: "m²", plural: "m²", toSqm: 1 },
  sqft: { label: "sq ft", plural: "sq ft", toSqm: 0.09290304 },
  acres: { label: "acre", plural: "acres", toSqm: 4046.8564224 },
  hectares: { label: "ha", plural: "hectares", toSqm: 10000 },
};

export const AREA_UNIT_KEYS = Object.keys(AREA_UNITS);

export const DEFAULT_AREA_UNIT_BY_TYPE = {
  land: "acres",
  farmland: "acres",
  plot: "acres",
  _default: "sqm",
};

export const isAreaUnit = (unit) =>
  typeof unit === 'string' && Object.prototype.hasOwnProperty.call(AREA_UNITS, unit);

export const toSqm = (value, unit) => value * (AREA_UNITS[unit]?.toSqm ?? NaN);

export const fromSqm = (sqm, unit) => sqm / (AREA_UNITS[unit]?.toSqm ?? NaN);

export const defaultUnitForType = (type) =>
  DEFAULT_AREA_UNIT_BY_TYPE[type] ?? DEFAULT_AREA_UNIT_BY_TYPE._default;

/** The unit's display label alone — "acres", "m²". */
export const areaUnitLabel = (unit, value) => {
  if (!isAreaUnit(unit)) return null;
  const { label, plural } = AREA_UNITS[unit];
  return value === 1 ? label : plural;
};

/** "5 acres", "1,200 m²" — null when there is no area to show. */
export const formatArea = (value, unit) => {
  const n = Number(value);
  if (!Number.isFinite(n) || n <= 0 || !isAreaUnit(unit)) return null;
  const formatted = new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(n);
  return `${formatted} ${areaUnitLabel(unit, n)}`;
};

export default AREA_UNITS;
