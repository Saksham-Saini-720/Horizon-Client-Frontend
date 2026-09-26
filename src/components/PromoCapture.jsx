import { useEffect } from "react";
import { useLocation } from "react-router-dom";

import { capturePromoCode } from "../utils/promo";

/**
 * Picks up `?promo=` from wherever the visitor lands.
 *
 * A promo link or QR points at a property, not at the booking form, and the
 * code has to survive the browsing in between — so it is taken out of the URL
 * the moment it appears and kept until a tour is booked.
 *
 * Mounted once, inside the router, watching every navigation rather than only
 * the first load: a single-page app can reach a `?promo=` URL through an
 * in-app link without ever remounting.
 *
 * Renders nothing. An effect is genuinely the right tool here — this
 * synchronises two external systems, the URL and browser storage, with no
 * React state of its own.
 */
export default function PromoCapture() {
  const { search } = useLocation();

  useEffect(() => {
    capturePromoCode(search);
  }, [search]);

  return null;
}
