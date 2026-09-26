import { useEffect } from "react";
import { useLocation } from "react-router-dom";

import { captureReferralCode, firstVisitOf, getVisitorKey } from "../utils/referral";
import { recordReferralVisit } from "../api/walletApi";

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
    // Only when this navigation actually carried a ?ref= — not on every page.
    if (!new URLSearchParams(search).get("ref")) return;
    const captured = captureReferralCode(search);
    if (!captured?.code || !firstVisitOf(captured.code)) return;
    const visitorKey = getVisitorKey();
    if (!visitorKey) return;
    // The top of the referral funnel: someone opened the link.
    recordReferralVisit({
      code: captured.code,
      source: captured.source,
      visitorKey,
      path: window.location.pathname,
    });
  }, [search]);

  return null;
}
