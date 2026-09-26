import { apiGet, apiPost } from "./apiHelper";

/**
 * A customer's own money: receipts, refunds and referrals.
 *
 * One module because they are one story from the customer's side — I paid, I
 * want some of it back, and I told a friend about you. Splitting them would put
 * three imports at the top of a page that shows a refund next to the receipt it
 * is against.
 *
 * Amounts arrive as `…Minor` integers with a currency code and are rendered
 * through `utils/money.js`. They are *sent* as ordinary numbers, because that
 * is what somebody types into a form.
 */

// ── Receipts ───────────────────────────────────────────────────────────────

/**
 * GET /receipts — the customer's own, narrowed by the session on the server.
 *
 * Reversed payments are already excluded by the API: that money was never
 * kept, so there is nothing to show and nothing to refund.
 */
export const fetchMyReceipts = async (params = {}) => {
  const data = await apiGet("/receipts", {
    params: { page: 1, limit: 20, ...params },
  });

  const payload = data?.data ?? {};
  return {
    receipts: payload.payments ?? [],
    totals: payload.totals ?? [],
    pagination: payload.pagination ?? { page: 1, pages: 1, total: 0 },
  };
};

// ── Refunds ────────────────────────────────────────────────────────────────

export const fetchMyRefunds = async (params = {}) => {
  const data = await apiGet("/refunds", {
    params: { page: 1, limit: 20, ...params },
  });

  const payload = data?.data ?? {};
  return {
    refunds: payload.refunds ?? [],
    totals: payload.totals ?? [],
    pagination: payload.pagination ?? { page: 1, pages: 1, total: 0 },
  };
};

/** The dropdown — the same list the admin console offers. */
export const fetchRefundReasons = async () => {
  const data = await apiGet("/refunds/reasons");
  return data?.data?.reasons ?? [];
};

export const raiseRefund = async ({ receiptNumber, amount, reason, detail }) => {
  const data = await apiPost("/refunds", {
    receiptNumber,
    amount,
    reason,
    detail,
  });
  return data?.data ?? null;
};

// ── Referrals ──────────────────────────────────────────────────────────────

/**
 * GET /referrals/me — the campaign running now, this person's code for it
 * (minted on first view), and everyone they have referred under any campaign.
 *
 * `campaign` is null when nothing is running; `code` is null then, or when the
 * campaign is for customers only and this account is not one.
 */
export const fetchMyReferrals = async () => {
  const data = await apiGet("/referrals/me");
  return (
    data?.data ?? {
      campaign: null,
      eligible: false,
      code: null,
      codeSuspended: false,
      referrals: [],
      earned: [],
      points: 0,
    }
  );
};

/**
 * GET /referrals/campaign — public. The referral campaign running now, or
 * null. Everything referral-shaped in the app is shown only while this is
 * non-null.
 */
export const fetchReferralCampaign = async () => {
  const data = await apiGet("/referrals/campaign");
  return data?.data?.campaign ?? null;
};

/**
 * POST /referrals/check — public. Will this code be accepted at signup?
 * Always resolves `{ valid, message?, campaign? }`; an unusable code is an
 * answer, not a failure.
 */
export const checkReferralCode = async (code) => {
  const data = await apiPost("/referrals/check", { code });
  return data?.data ?? { valid: false, message: "Could not check that code" };
};

/**
 * POST /referrals/visits — public. Someone opened a referral link. Fire and
 * forget: a visit that fails to record must never disturb the page.
 */
export const recordReferralVisit = async ({ code, source, visitorKey, path }) => {
  try {
    await apiPost("/referrals/visits", { code, source, visitorKey, path });
  } catch {
    // Counting is best-effort; the code is still captured for signup.
  }
};
