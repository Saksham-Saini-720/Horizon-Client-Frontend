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
 * GET /referrals/me — the code, everyone referred, and the state of each
 * reward. The code is minted on the spot for an account that predates the
 * referral programme, so this never comes back empty-handed.
 */
export const fetchMyReferrals = async () => {
  const data = await apiGet("/referrals/me");
  return data?.data ?? { code: null, referrals: [], earned: [] };
};
