import { useQuery } from '@tanstack/react-query';

import { fetchFeaturedPromo } from '../../api/tourApi';

/**
 * The campaign currently on offer, or null when none is running.
 *
 * The framework asks for the feature to appear when a campaign starts and be
 * hidden when none is active, so null is the ordinary answer and every caller
 * treats it as "render nothing" rather than as a failure.
 *
 * Cached for five minutes: a campaign does not start or end mid-session, and
 * refetching on every navigation would put a request behind every page for a
 * value that changes a few times a year.
 */
export default function useFeaturedPromo() {
  return useQuery({
    queryKey: ['promo', 'featured'],
    queryFn: fetchFeaturedPromo,
    staleTime: 1000 * 60 * 5,
    retry: false,
  });
}
