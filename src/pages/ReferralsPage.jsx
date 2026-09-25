import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { HiOutlineGift, HiOutlineShare, HiOutlineClipboard, HiArrowLeft } from "react-icons/hi2";

import { fetchMyReferrals } from "../api/walletApi";
import { formatMoney } from "../utils/money";

/**
 * My referrals — the code to share, and how each person you referred is doing.
 *
 * The code is the point of the page, so it is the first and largest thing on
 * it. Everything else is evidence that sharing it does something.
 */

const STATUS_COPY = {
  pending: {
    label: "Signed up",
    tone: "bg-slate-100 text-slate-600",
    note: "Waiting to qualify",
  },
  qualified: {
    label: "Earned",
    tone: "bg-amber-100 text-amber-700",
    note: "Awaiting approval",
  },
  approved: {
    label: "Approved",
    tone: "bg-blue-100 text-blue-700",
    note: "Payment on its way",
  },
  paid: {
    label: "Paid",
    tone: "bg-green-100 text-green-700",
    note: "Sent to you",
  },
  rejected: {
    label: "Not approved",
    tone: "bg-red-50 text-red-600",
    note: "",
  },
  cancelled: {
    label: "Cancelled",
    tone: "bg-slate-100 text-slate-500",
    note: "",
  },
};

export default function ReferralsPage() {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["my-referrals"],
    queryFn: fetchMyReferrals,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 1,
  });

  const code = data?.code ?? "";
  const shareLink = code
    ? `${window.location.origin}/?ref=${encodeURIComponent(code)}`
    : "";

  const copy = async (value, what) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      toast.success(`${what} copied`);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard is blocked in insecure contexts and some in-app browsers.
      // Saying so beats a button that silently does nothing.
      toast.error("Could not copy — select the code and copy it by hand");
    }
  };

  const share = async () => {
    // The native sheet is the natural thing on a phone, which is where this
    // page will mostly be opened. Falls back to copying where it is absent.
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Horizon Properties",
          text: `Use my referral code ${code} when you sign up.`,
          url: shareLink,
        });
        return;
      } catch {
        // The user dismissed the sheet. Not an error worth reporting.
        return;
      }
    }
    copy(shareLink, "Link");
  };

  return (
    <div className="min-h-screen bg-canvas pb-24">
      <div className="bg-gradient-to-br from-primary to-secondary px-4 pt-6 pb-10 text-white">
        <button
          onClick={() => navigate("/profile")}
          className="mb-4 flex items-center gap-2 text-[13px] text-white/80"
        >
          <HiArrowLeft size={16} /> Profile
        </button>
        <h1 className="text-[22px] font-bold">Refer a friend</h1>
        <p className="mt-1 max-w-md text-[14px] text-white/80">
          Share your code. When someone you refer qualifies, you earn a reward.
        </p>
      </div>

      <div className="mx-auto -mt-6 max-w-2xl px-4">
        <div className="rounded-2xl bg-white p-5 shadow-card">
          {isLoading ? (
            <div className="h-24 animate-pulse rounded-xl bg-slate-100" />
          ) : (
            <>
              <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
                Your code
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-3">
                <span
                  data-testid="referral-code"
                  className="font-mono text-[26px] font-bold tracking-wider text-bold"
                >
                  {code || "—"}
                </span>
                <button
                  onClick={() => copy(code, "Code")}
                  className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-[13px] text-slate-600 hover:bg-slate-50"
                >
                  <HiOutlineClipboard size={15} />
                  {copied ? "Copied" : "Copy"}
                </button>
                <button
                  onClick={share}
                  className="flex items-center gap-1.5 rounded-lg bg-primary-light px-3 py-1.5 text-[13px] font-bold text-white"
                >
                  <HiOutlineShare size={15} /> Share
                </button>
              </div>

              {(data?.earned ?? []).length > 0 && (
                <div className="mt-5 flex flex-wrap gap-3 border-t border-slate-100 pt-4">
                  {data.earned.map((entry) => (
                    <div key={entry.currency} data-testid="referral-earned">
                      <p className="text-[11px] uppercase tracking-wide text-slate-400">
                        Earned
                      </p>
                      <p className="text-[18px] font-bold text-bold">
                        {formatMoney(entry.amountMinor, entry.currency)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        <h2 className="mt-8 mb-3 text-[15px] font-bold text-bold">
          People you referred
        </h2>

        {isLoading ? (
          <div className="h-32 animate-pulse rounded-2xl bg-white" />
        ) : (data?.referrals ?? []).length === 0 ? (
          <div className="rounded-2xl bg-white p-8 text-center shadow-card">
            <HiOutlineGift size={32} className="mx-auto text-slate-300" />
            <p className="mt-3 text-[14px] font-bold text-bold">
              Nobody yet
            </p>
            <p className="mx-auto mt-1 max-w-xs text-[13px] text-slate-500">
              Share your code with someone looking for a property. You will see
              them here as soon as they sign up.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl bg-white shadow-card">
            {data.referrals.map((referral, index) => {
              const copy = STATUS_COPY[referral.status] ?? {
                label: referral.status,
                tone: "bg-slate-100 text-slate-600",
                note: "",
              };
              const name =
                `${referral.referee?.firstName ?? ""} ${referral.referee?.lastName ?? ""}`.trim() ||
                "Someone you referred";

              return (
                <div
                  key={referral._id}
                  // `data-status` carries the raw status the row is rendering,
                  // alongside the customer-facing label. The e2e suite waits on
                  // it: the labels are written for a reader and are free to
                  // change, and a browser test that has to be edited every time
                  // someone improves the wording stops being run.
                  data-testid="referral-row"
                  data-status={referral.status}
                  className={`flex items-center gap-3 px-4 py-3.5 ${
                    index > 0 ? "border-t border-slate-100" : ""
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[14px] font-bold text-bold">
                      {name}
                    </p>
                    <p className="text-[12px] text-slate-500">
                      {copy.note ||
                        new Date(referral.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="text-right">
                    {referral.reward?.amountMinor != null && (
                      <p className="text-[14px] font-bold text-bold">
                        {formatMoney(
                          referral.reward.amountMinor,
                          referral.reward.currency,
                        )}
                      </p>
                    )}
                    <span
                      className={`mt-0.5 inline-block rounded-full px-2 py-0.5 text-[11px] font-bold ${copy.tone}`}
                    >
                      {copy.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
