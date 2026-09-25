import { useEffect } from "react";
import { useLocation } from "react-router-dom";

import { captureReferralCode } from "../utils/referral";

/**
 * Picks up `?ref=` from wherever the visitor lands.
 *
 * A referral link points at a property, not at the signup page, and the code
 * has to survive the browsing in between — so it is taken out of the URL the
 * moment it appears and kept until an account is created.
 *
 * Mounted once, inside the router, and watching every navigation rather than
 * only the first load: a single-page app can reach a `?ref=` URL through an
 * in-app link without ever remounting.
 *
 * Renders nothing. An effect is the right tool here in a way it usually is not
 * — this synchronises an external system (the URL, and browser storage) with
 * nothing in React's own state.
 */
export default function ReferralCapture() {
  const { search } = useLocation();

  useEffect(() => {
    captureReferralCode(search);
  }, [search]);

  return null;
}
