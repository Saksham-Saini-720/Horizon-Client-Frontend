import { useQuery } from "@tanstack/react-query";

import { fetchReferralCampaign } from "../../api/walletApi";
import useFeatures from "../useFeatures";

/**
 * The referral campaign running now, or null.
 *
 * The framework's rule is that referral features appear while a campaign runs
 * and are hidden otherwise, so null is the ordinary answer and every caller
 * treats it as "render nothing". Never asked while the programme is switched
 * off in Settings → Business — the API would 404.
 *
 * Cached for five minutes, like the featured promo: a campaign does not start
 * or end mid-session often enough to justify a request per navigation.
 */
export default function useReferralCampaign() {
  const { referrals } = useFeatures();
  return useQuery({
    queryKey: ["referrals", "campaign"],
    queryFn: fetchReferralCampaign,
    enabled: referrals,
    staleTime: 1000 * 60 * 5,
    retry: false,
  });
}
