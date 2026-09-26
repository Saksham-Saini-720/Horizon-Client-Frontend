import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  HiOutlineShare,
  HiOutlineClipboard,
  HiOutlineGift,
} from "react-icons/hi2";

import { fetchMyReferrals } from "../../api/walletApi";
import { buildReferralLink } from "../../utils/referral";
import useReferralCampaign from "../../hooks/referrals/useReferralCampaign";

/**
 * "Know someone who'd like this?" — on the property page.
 *
 * Referral codes live on their own page under Profile, which is the right home
 * for managing them and the wrong place to be when the thought actually
 * occurs. The thought occurs while looking at a property, so the prompt
 * belongs here.
 *
 * ## The link points at this property, not at the home page
 *
 * A bare referral link drops someone on a site they have no reason to be on.
 * Carrying the property means the friend lands on the thing they were told
 * about, and the code rides along in the same URL — captured on arrival and
 * held until they sign up, so the referrer is credited even though the signup
 * happens later and somewhere else.
 *
 * Signed-out visitors get a short prompt instead of a code, because they do
 * not have one yet. Nothing here is shown to them as if it were theirs.
 *
 * Renders nothing while no referral campaign is running, and nothing for a
 * signed-in person who has no usable code (not eligible, or code suspended).
 */
export default function ReferPropertyCard({ propertyId, isAuthenticated }) {
  const [copied, setCopied] = useState(false);
  const { data: campaign } = useReferralCampaign();

  const { data, isLoading } = useQuery({
    queryKey: ["my-referrals"],
    queryFn: fetchMyReferrals,
    // Only for people who have a code. An anonymous visitor would get a 401,
    // and asking is pointless when the answer cannot be used.
    enabled: Boolean(isAuthenticated && campaign),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  const code = data?.code && !data?.codeSuspended ? data.code : null;
  const link = code
    ? buildReferralLink(code, `/property/${propertyId}`, "link")
    : null;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      toast.success("Link copied");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Blocked in insecure contexts and some in-app browsers. Saying so beats
      // a button that silently does nothing.
      toast.error("Could not copy — try the share button");
    }
  };

  const share = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "A property on Horizon",
          text: "Thought you might like this one.",
          url: link,
        });
        return;
      } catch {
        // Sheet dismissed. Not a failure worth reporting.
        return;
      }
    }
    copy();
  };

  if (!campaign) return null;

  if (!isAuthenticated) {
    return (
      <div className="mx-4 mb-4 rounded-2xl bg-white p-5 shadow-card-sm">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-light/10">
            <HiOutlineGift size={18} className="text-primary-light" />
          </div>
          <div className="min-w-0">
            <p className="font-myriad text-[15px] font-semibold text-primary">
              Refer a friend, earn a reward
            </p>
            <p className="mt-1 font-myriad text-[13px] text-gray-500">
              Sign in to get your referral code and share this property with it
              {campaign.reward?.summary ? ` — earn ${campaign.reward.summary}.` : "."}
            </p>
            <Link
              to="/login"
              className="mt-3 inline-block font-myriad text-[13px] font-semibold text-primary-light"
            >
              Sign in →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Signed in, but the code has not arrived yet. A skeleton rather than an
  // empty card, so the section does not appear to pop in late.
  if (isLoading) {
    return (
      <div className="mx-4 mb-4 h-28 animate-pulse rounded-2xl bg-white shadow-card-sm" />
    );
  }

  // Loaded, and there is nothing this person can share.
  if (!code) return null;

  return (
    <div className="mx-4 mb-4 rounded-2xl bg-white p-5 shadow-card-sm">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-light/10">
          <HiOutlineGift size={18} className="text-primary-light" />
        </div>

        <div className="min-w-0 flex-1">
          <p className="font-myriad text-[15px] font-semibold text-primary">
            Know someone who&rsquo;d like this?
          </p>
          <p className="mt-1 font-myriad text-[13px] text-gray-500">
            Share it with your code and earn a reward when they qualify.
          </p>

          <div className="mt-3 flex items-center gap-2 rounded-xl bg-canvas px-3 py-2">
            <span className="font-mono text-[15px] font-bold tracking-wider text-bold">
              {code}
            </span>
            <span className="ml-auto font-myriad text-[11px] text-gray-400">
              your code
            </span>
          </div>

          <div className="mt-3 flex gap-2">
            <button
              onClick={share}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-primary-light py-2 font-myriad text-[13px] font-semibold text-white"
            >
              <HiOutlineShare size={15} /> Share this property
            </button>
            <button
              onClick={copy}
              aria-label="Copy referral link"
              className="flex items-center justify-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 font-myriad text-[13px] text-gray-600"
            >
              <HiOutlineClipboard size={15} />
              {copied ? "Copied" : "Copy"}
            </button>
          </div>

          <Link
            to="/referrals"
            className="mt-3 inline-block font-myriad text-[12px] text-gray-500 underline"
          >
            See everyone you have referred
          </Link>
        </div>
      </div>
    </div>
  );
}
