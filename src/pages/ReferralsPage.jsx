import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Navigate, useNavigate } from "react-router-dom";
import QRCode from "qrcode";
import toast from "react-hot-toast";
import {
  HiOutlineGift,
  HiOutlineClipboard,
  HiOutlineEnvelope,
  HiOutlineLink,
  HiArrowLeft,
} from "react-icons/hi2";

import { fetchMyReferrals } from "../api/walletApi";
import useFeatures from "../hooks/useFeatures";
import { buildReferralLink } from "../utils/referral";
import { formatMoney } from "../utils/money";

/**
 * My referrals — the code to share, and how each person you referred is doing.
 *
 * The code belongs to the referral campaign running now: a new campaign means
 * a new code. When nothing is running there is no code to share, but the
 * people already referred — and what they earned — are still shown, because
 * that is money the customer is owed.
 *
 * Sharing is by QR, email and copied link. Each carries `src` so the reports
 * can say which one worked; the server treats it as a hint.
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
    note: "Reward on its way",
  },
  paid: {
    label: "Rewarded",
    tone: "bg-green-100 text-green-700",
    note: "Issued to you",
  },
  rejected: {
    label: "Not approved",
    tone: "bg-red-50 text-red-600",
    note: "",
  },
  expired: {
    label: "Expired",
    tone: "bg-slate-100 text-slate-500",
    note: "Did not qualify before the campaign closed",
  },
  cancelled: {
    label: "Cancelled",
    tone: "bg-slate-100 text-slate-500",
    note: "",
  },
};

/** "When someone you refer ___": the campaign's qualifying action, as a verb. */
const ACTION_PHRASES = {
  tour_completed: "completes a viewing",
  reservation_paid: "pays a reservation",
  first_payment: "makes their first payment",
  agreement_signed: "signs an agreement",
  agreement_completed: "completes an agreement",
  commission_paid: "pays the brokerage fee in full",
};

/** A frozen reward as a person would say it. Points carry no currency. */
const rewardText = (reward) => {
  if (reward?.amountMinor == null) return null;
  if (!reward.currency) return `${reward.amountMinor} points`;
  return formatMoney(reward.amountMinor, reward.currency);
};

const fmtDate = (value) =>
  new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

export default function ReferralsPage() {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const [copied, setCopied] = useState(null);

  const features = useFeatures();

  const { data, isLoading } = useQuery({
    queryKey: ["my-referrals"],
    queryFn: fetchMyReferrals,
    enabled: features.referrals,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 1,
  });

  const campaign = data?.campaign ?? null;
  // A suspended code is still returned, so the person can be told why sharing
  // is off — but it must not be offered for sharing.
  const code = data?.code && !data?.codeSuspended ? data.code : null;
  const qrLink = code ? buildReferralLink(code, "/", "qr") : "";
  const emailLink = code ? buildReferralLink(code, "/", "email") : "";
  const plainLink = code ? buildReferralLink(code, "/", "link") : "";

  useEffect(() => {
    if (!code || !canvasRef.current) return;
    QRCode.toCanvas(canvasRef.current, qrLink, {
      width: 200,
      margin: 2,
      errorCorrectionLevel: "M",
      color: { dark: "#1a1a1a", light: "#ffffff" },
    }).catch(() => {
      /* A missing QR is not worth an error state; the code is still on screen. */
    });
  }, [code, qrLink]);

  const copy = async (value, what) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(what);
      toast.success(`${what} copied`);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      // Clipboard is blocked in insecure contexts and some in-app browsers.
      // Saying so beats a button that silently does nothing.
      toast.error("Could not copy — select it and copy it by hand");
    }
  };

  const shareByEmail = () => {
    const subject = encodeURIComponent("Join me on Horizon Properties");
    const message =
      campaign?.shareMessage ||
      "I've been using Horizon Properties to find a place — thought you might like it too.";
    const body = encodeURIComponent(
      `${message}\n\nSign up with my referral code ${code}:\n${emailLink}\n`,
    );
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const downloadQr = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = `horizon-referral-${code}.png`;
    a.click();
  };

  const earned = data?.earned ?? [];
  const points = data?.points ?? 0;


  // Switched off in Settings → Business: this page does not exist.
  if (!features.isLoading && !features.referrals) return <Navigate to="/" replace />;

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
          {campaign
            ? `Share your code. When someone you refer signs up and ${ACTION_PHRASES[campaign.qualifyingAction] ?? "qualifies"}, you earn ${campaign.reward?.summary ?? "a reward"}.`
            : "Share your code with friends when a referral campaign is running."}
        </p>
        {campaign && (
          <p data-testid="referral-campaign" className="mt-1 text-[12px] text-white/70">
            {campaign.name}
            {campaign.endsAt ? ` · ends ${fmtDate(campaign.endsAt)}` : ""}
          </p>
        )}
      </div>

      <div className="mx-auto -mt-6 max-w-2xl px-4">
        <div className="rounded-2xl bg-white p-5 shadow-card">
          {isLoading ? (
            <div className="h-24 animate-pulse rounded-xl bg-slate-100" />
          ) : !campaign ? (
            <div data-testid="referral-no-campaign" className="text-center py-2">
              <HiOutlineGift size={28} className="mx-auto text-slate-300" />
              <p className="mt-2 text-[14px] font-bold text-bold">
                No referral campaign running right now
              </p>
              <p className="mx-auto mt-1 max-w-xs text-[13px] text-slate-500">
                You will get a code to share here when the next one starts.
              </p>
            </div>
          ) : data?.codeSuspended ? (
            <div data-testid="referral-code-suspended" className="py-2">
              <p className="text-[14px] font-bold text-bold">
                Your referral code is paused
              </p>
              <p className="mt-1 text-[13px] text-slate-500">
                New sign-ups can't use it at the moment. People you already
                referred are unaffected. Contact us if you think this is a mistake.
              </p>
            </div>
          ) : !code ? (
            <div data-testid="referral-not-eligible" className="py-2">
              <p className="text-[14px] font-bold text-bold">
                This campaign is for customers
              </p>
              <p className="mt-1 text-[13px] text-slate-500">
                Referral codes for {campaign.name} are given to Horizon customers.
              </p>
            </div>
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
                  {code}
                </span>
                <button
                  onClick={() => copy(code, "Code")}
                  className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-[13px] text-slate-600 hover:bg-slate-50"
                >
                  <HiOutlineClipboard size={15} />
                  {copied === "Code" ? "Copied" : "Copy"}
                </button>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <button
                  onClick={shareByEmail}
                  className="flex items-center justify-center gap-1.5 rounded-lg bg-primary-light px-3 py-2.5 text-[13px] font-bold text-white"
                >
                  <HiOutlineEnvelope size={15} /> Email a friend
                </button>
                <button
                  onClick={() => copy(plainLink, "Link")}
                  className="flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2.5 text-[13px] text-slate-600 hover:bg-slate-50"
                >
                  <HiOutlineLink size={15} />
                  {copied === "Link" ? "Copied" : "Copy link"}
                </button>
              </div>

              <div className="mt-5 border-t border-slate-100 pt-4 text-center">
                <p className="text-[13px] font-bold text-bold">Let someone scan it</p>
                <canvas
                  ref={canvasRef}
                  data-testid="referral-qr"
                  className="mx-auto mt-3 rounded-xl"
                  aria-label={`QR code for referral code ${code}`}
                />
                <button
                  onClick={downloadQr}
                  className="mt-2 text-[12px] text-slate-500 underline"
                >
                  Save QR image
                </button>
              </div>
            </>
          )}

          {data?.visitors > 0 && (
            <p
              data-testid="referral-visitors"
              className="mt-4 border-t border-slate-100 pt-3 text-[13px] text-slate-500"
            >
              <span className="font-bold text-bold">{data.visitors}</span>{" "}
              {data.visitors === 1 ? "person has" : "people have"} opened your link
            </p>
          )}

          {(earned.length > 0 || points > 0) && (
            <div className="mt-5 flex flex-wrap gap-5 border-t border-slate-100 pt-4">
              {earned.map((entry) => (
                <div key={entry.currency} data-testid="referral-earned">
                  <p className="text-[11px] uppercase tracking-wide text-slate-400">
                    Earned
                  </p>
                  <p className="text-[18px] font-bold text-bold">
                    {formatMoney(entry.amountMinor, entry.currency)}
                  </p>
                </div>
              ))}
              {points > 0 && (
                <div data-testid="referral-points">
                  <p className="text-[11px] uppercase tracking-wide text-slate-400">
                    Points
                  </p>
                  <p className="text-[18px] font-bold text-bold">{points}</p>
                </div>
              )}
            </div>
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
            <p className="mt-3 text-[14px] font-bold text-bold">Nobody yet</p>
            <p className="mx-auto mt-1 max-w-xs text-[13px] text-slate-500">
              {code
                ? "Share your code with someone looking for a property. You will see them here as soon as they sign up."
                : "People who sign up with your code will appear here."}
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl bg-white shadow-card">
            {data.referrals.map((referral, index) => {
              const status = STATUS_COPY[referral.status] ?? {
                label: referral.status,
                tone: "bg-slate-100 text-slate-600",
                note: "",
              };
              const name =
                `${referral.referee?.firstName ?? ""} ${referral.referee?.lastName ?? ""}`.trim() ||
                "Someone you referred";
              const reward = rewardText(referral.reward);

              return (
                <div
                  key={referral._id}
                  // `data-status` carries the raw status alongside the
                  // customer-facing label, so the e2e suite does not break
                  // every time the wording improves.
                  data-testid="referral-row"
                  data-status={referral.status}
                  className={`flex items-center gap-3 px-4 py-3.5 ${
                    index > 0 ? "border-t border-slate-100" : ""
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[14px] font-bold text-bold">{name}</p>
                    <p className="text-[12px] text-slate-500">
                      {[
                        referral.campaign?.name,
                        status.note || fmtDate(referral.createdAt),
                      ]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                  </div>

                  <div className="text-right">
                    {reward && (
                      <p className="text-[14px] font-bold text-bold">{reward}</p>
                    )}
                    <span
                      className={`mt-0.5 inline-block rounded-full px-2 py-0.5 text-[11px] font-bold ${status.tone}`}
                    >
                      {status.label}
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
