import { useQuery } from "@tanstack/react-query";

import { apiGet } from "../api/apiHelper";
import { NO_FEATURES } from "../config/features";

/**
 * Which business features are switched on (GET /features, public).
 *
 * Off until answered, and off on error. Cached for five minutes — a programme
 * is switched on or off a few times a year, not mid-session.
 */
export default function useFeatures() {
  const { data, isLoading } = useQuery({
    queryKey: ["features"],
    queryFn: async () => {
      const body = await apiGet("/features");
      return { ...NO_FEATURES, ...(body?.data?.features ?? {}) };
    },
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });

  return { ...(data ?? NO_FEATURES), isLoading };
}
