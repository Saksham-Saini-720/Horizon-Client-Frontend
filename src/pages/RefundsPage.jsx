import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { HiArrowLeft, HiOutlineReceiptRefund, HiOutlineDocumentText } from "react-icons/hi2";

import {
  fetchMyReceipts,
  fetchMyRefunds,
  fetchRefundReasons,
  raiseRefund,
} from "../api/walletApi";
import { formatMoney, fromMinor } from "../utils/money";

/**
 * My refunds — raise a request against a past receipt, and track it.
 *
 * Two tabs rather than two pages: the receipt and the request against it are
 * the same conversation, and someone checking on a refund usually wants to see
 * what they paid in the first place.
 *
 * A refund is always raised *from a receipt* — the receipt is picked from the
 * list rather than typed — because a customer does not reliably have the
 * number to hand, and a mistyped one is a support ticket.
 */

const TABS = ["Requests", "Receipts"];

const STATUS_TONE = {
  requested: "bg-amber-100 text-amber-700",
  approved: "bg-blue-100 text-blue-700",
  paid: "bg-green-100 text-green-700",
  rejected: "bg-red-50 text-red-600",
};

const STATUS_NOTE = {
  requested: "We are reviewing this",
  approved: "Approved — payment on its way",
  paid: "Sent to you",
  rejected: "Not approved",
};

export default function RefundsPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [tab, setTab] = useState("Requests");
  const [target, setTarget] = useState(null);

  const { data: refunds, isLoading: loadingRefunds } = useQuery({
    queryKey: ["my-refunds"],
    queryFn: () => fetchMyRefunds(),
    staleTime: 60 * 1000,
    retry: 1,
  });

  const { data: receipts, isLoading: loadingReceipts } = useQuery({
    queryKey: ["my-receipts"],
    queryFn: () => fetchMyReceipts(),
    staleTime: 60 * 1000,
    retry: 1,
  });

  return (
    <div className="min-h-screen bg-canvas pb-24">
      <div className="bg-gradient-to-br from-primary to-secondary px-4 pt-6 pb-10 text-white">
        <button
          onClick={() => navigate("/profile")}
          className="mb-4 flex items-center gap-2 text-[13px] text-white/80"
        >
          <HiArrowLeft size={16} /> Profile
        </button>
        <h1 className="text-[22px] font-bold">Refunds</h1>
        <p className="mt-1 max-w-md text-[14px] text-white/80">
          Ask for money back on something you have paid for, and follow what
          happens next.
        </p>
      </div>

      <div className="mx-auto -mt-6 max-w-2xl px-4">
        <div className="mb-5 flex gap-1 rounded-xl bg-white p-1 shadow-card">
          {TABS.map((name) => (
            <button
              key={name}
              onClick={() => setTab(name)}
              className={`flex-1 rounded-lg py-2 text-[13px] font-bold transition-colors ${
                tab === name
                  ? "bg-primary text-white"
                  : "text-slate-500 hover:bg-slate-50"
              }`}
            >
              {name}
            </button>
          ))}
        </div>

        {tab === "Requests" ? (
          <RequestList
            refunds={refunds?.refunds ?? []}
            isLoading={loadingRefunds}
            onStart={() => setTab("Receipts")}
          />
        ) : (
          <ReceiptList
            receipts={receipts?.receipts ?? []}
            isLoading={loadingReceipts}
            onRefund={setTarget}
          />
        )}
      </div>

      {target && (
        <RaiseRefundSheet
          receipt={target}
          onClose={() => setTarget(null)}
          onDone={() => {
            queryClient.invalidateQueries({ queryKey: ["my-refunds"] });
            queryClient.invalidateQueries({ queryKey: ["my-receipts"] });
            setTarget(null);
            setTab("Requests");
          }}
        />
      )}
    </div>
  );
}

function RequestList({ refunds, isLoading, onStart }) {
  if (isLoading) {
    return <div className="h-32 animate-pulse rounded-2xl bg-white" />;
  }

  if (refunds.length === 0) {
    return (
      <div className="rounded-2xl bg-white p-8 text-center shadow-card">
        <HiOutlineReceiptRefund size={32} className="mx-auto text-slate-300" />
        <p className="mt-3 text-[14px] font-bold text-bold">No requests yet</p>
        <p className="mx-auto mt-1 max-w-xs text-[13px] text-slate-500">
          A refund is raised against something you have paid for.
        </p>
        <button
          onClick={onStart}
          className="mt-4 rounded-lg bg-primary-light px-4 py-2 text-[13px] font-bold text-white"
        >
          See my receipts
        </button>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-card">
      {refunds.map((refund, index) => (
        <div
          key={refund._id}
          className={`px-4 py-4 ${index > 0 ? "border-t border-slate-100" : ""}`}
        >
          <div className="flex items-start gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-[14px] font-bold text-bold">{refund.reason}</p>
              <p className="mt-0.5 text-[12px] text-slate-500">
                Receipt {refund.receiptNumber} ·{" "}
                {new Date(refund.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[15px] font-bold text-bold">
                {formatMoney(refund.netMinor, refund.currency)}
              </p>
              <span
                className={`mt-0.5 inline-block rounded-full px-2 py-0.5 text-[11px] font-bold ${
                  STATUS_TONE[refund.status] ?? "bg-slate-100 text-slate-600"
                }`}
              >
                {refund.status}
              </span>
            </div>
          </div>

          {/* A deduction is the thing most likely to prompt a phone call, so
              it is spelled out rather than left as a difference between two
              numbers the customer has to spot. */}
          {refund.deductionMinor > 0 && (
            <p className="mt-2 rounded-lg bg-slate-50 px-3 py-2 text-[12px] text-slate-600">
              {formatMoney(refund.requestedMinor, refund.currency)} requested,
              less {formatMoney(refund.deductionMinor, refund.currency)}
              {refund.deductionReason ? ` — ${refund.deductionReason}` : ""}
            </p>
          )}

          <p className="mt-2 text-[12px] text-slate-500">
            {STATUS_NOTE[refund.status] ?? ""}
          </p>
        </div>
      ))}
    </div>
  );
}

function ReceiptList({ receipts, isLoading, onRefund }) {
  if (isLoading) {
    return <div className="h-32 animate-pulse rounded-2xl bg-white" />;
  }

  if (receipts.length === 0) {
    return (
      <div className="rounded-2xl bg-white p-8 text-center shadow-card">
        <HiOutlineDocumentText size={32} className="mx-auto text-slate-300" />
        <p className="mt-3 text-[14px] font-bold text-bold">No receipts</p>
        <p className="mx-auto mt-1 max-w-xs text-[13px] text-slate-500">
          Receipts appear here once a payment has been recorded against your
          account.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-card">
      {receipts.map((receipt, index) => {
        const remaining = receipt.amountMinor - (receipt.refundedMinor ?? 0);
        const fullyRefunded = remaining <= 0;

        return (
          <div
            key={receipt._id}
            className={`flex items-center gap-3 px-4 py-4 ${
              index > 0 ? "border-t border-slate-100" : ""
            }`}
          >
            <div className="min-w-0 flex-1">
              <p className="text-[14px] font-bold text-bold">
                {receipt.receiptNumber}
              </p>
              <p className="mt-0.5 text-[12px] text-slate-500">
                {new Date(receipt.receivedAt).toLocaleDateString()}
                {receipt.invoice?.kind ? ` · ${receipt.invoice.kind}` : ""}
              </p>
              {receipt.refundedMinor > 0 && (
                <p className="mt-0.5 text-[12px] text-amber-700">
                  {formatMoney(receipt.refundedMinor, receipt.currency)} already
                  refunded
                </p>
              )}
            </div>

            <div className="text-right">
              <p className="text-[15px] font-bold text-bold">
                {formatMoney(receipt.amountMinor, receipt.currency)}
              </p>
              {fullyRefunded ? (
                <span className="text-[12px] text-slate-400">
                  Fully refunded
                </span>
              ) : (
                <button
                  onClick={() => onRefund({ ...receipt, remaining })}
                  className="mt-1 rounded-lg border border-slate-200 px-3 py-1 text-[12px] font-bold text-slate-600 hover:bg-slate-50"
                >
                  Request refund
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/**
 * The request form.
 *
 * Prefilled with the full refundable amount, which is what most people want,
 * and capped at it — the server enforces the ceiling against prior refunds
 * too, so the hint explains the number rather than just rejecting one.
 */
function RaiseRefundSheet({ receipt, onClose, onDone }) {
  const max = fromMinor(receipt.remaining, receipt.currency);

  const [amount, setAmount] = useState(String(max));
  const [reason, setReason] = useState("");
  const [detail, setDetail] = useState("");

  const { data: reasons = [] } = useQuery({
    queryKey: ["refund-reasons"],
    queryFn: fetchRefundReasons,
    staleTime: 5 * 60 * 1000,
  });

  const mutation = useMutation({
    mutationFn: () =>
      raiseRefund({
        receiptNumber: receipt.receiptNumber,
        amount: Number(amount),
        reason,
        detail: detail.trim() || undefined,
      }),
    onSuccess: (refund) => {
      toast.success(`Request ${refund.number} submitted`);
      onDone();
    },
    onError: (error) => toast.error(error.message),
  });

  const value = Number(amount);
  const invalid =
    !Number.isFinite(value) || value <= 0 || value > max || !reason;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center">
      <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-t-2xl bg-white p-5 sm:rounded-2xl">
        <h2 className="text-[17px] font-bold text-bold">Request a refund</h2>
        <p className="mt-1 text-[13px] text-slate-500">
          Receipt {receipt.receiptNumber} ·{" "}
          {formatMoney(receipt.amountMinor, receipt.currency)} paid
        </p>

        <label className="mt-5 block text-[13px] font-bold text-bold">
          Amount ({receipt.currency})
        </label>
        <input
          type="number"
          step="any"
          min="0"
          max={max}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
          className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2 text-[14px] outline-none focus:border-primary"
        />
        <p className="mt-1.5 text-[12px] text-slate-500">
          Up to {formatMoney(receipt.remaining, receipt.currency)} can still be
          refunded on this receipt.
        </p>

        <label className="mt-4 block text-[13px] font-bold text-bold">
          Reason
        </label>
        <select
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2 text-[14px] outline-none focus:border-primary"
        >
          <option value="">Choose a reason</option>
          {reasons.map((option) => (
            <option key={option._id} value={option.label}>
              {option.label}
            </option>
          ))}
        </select>

        <label className="mt-4 block text-[13px] font-bold text-bold">
          Anything else
        </label>
        <textarea
          rows={3}
          value={detail}
          onChange={(e) => setDetail(e.target.value.slice(0, 1000))}
          placeholder="Enter anything else"
          className="mt-1.5 w-full resize-y rounded-lg border border-slate-200 px-3 py-2 text-[14px] outline-none focus:border-primary"
        />
        <p className="mt-1.5 text-[12px] text-slate-500">
          Optional. Anything that helps us review it faster.
        </p>

        <div className="mt-6 flex gap-2">
          <button
            onClick={onClose}
            disabled={mutation.isPending}
            className="flex-1 rounded-lg border border-slate-200 py-2.5 text-[14px] font-bold text-slate-600"
          >
            Cancel
          </button>
          <button
            onClick={() => mutation.mutate()}
            disabled={invalid || mutation.isPending}
            className="flex-1 rounded-lg bg-primary-light py-2.5 text-[14px] font-bold text-white disabled:opacity-50"
          >
            {mutation.isPending ? "Sending…" : "Submit request"}
          </button>
        </div>
      </div>
    </div>
  );
}
