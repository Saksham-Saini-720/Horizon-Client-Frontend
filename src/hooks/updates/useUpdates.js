import { useQuery } from "@tanstack/react-query";
import { getUpdates, getUpdateBySlug } from "../../api/updatesApi";
import { formatPostedLabel, formatPostedDateFull } from "../../utils/postedDate";

// Published news and updates.
//
// The posted date is formatted here, once, by the same helper the property cards
// use — so an article and a listing posted on the same day never word it two
// different ways.

export const updateKeys = {
  all: ["updates"],
  list: (params) => [...updateKeys.all, "list", params],
  detail: (slug) => [...updateKeys.all, "detail", slug],
};

const decorate = (article) => {
  if (!article) return null;
  return {
    ...article,
    id: article._id,
    postedLabel: formatPostedLabel(article.publishedAt),
    postedExact: formatPostedDateFull(article.publishedAt),
  };
};

/** Published articles, newest first. */
export function useUpdates(params = {}, options = {}) {
  return useQuery({
    queryKey: updateKeys.list(params),
    queryFn: async () => {
      const response = await getUpdates(params);
      const data = response?.data ?? {};
      return {
        updates: (Array.isArray(data.updates) ? data.updates : []).map(decorate),
        pagination: data.pagination ?? null,
      };
    },
    // Short, like the property lists: an article archived in the admin console
    // should stop appearing here promptly rather than lingering in a cache.
    staleTime: 1000 * 30,
    gcTime: 1000 * 60 * 15,
    ...options,
  });
}

/** One article by slug. A draft or archived piece 404s — see updatesApi. */
export function useUpdateBySlug(slug, options = {}) {
  return useQuery({
    queryKey: updateKeys.detail(slug),
    queryFn: async () => {
      const response = await getUpdateBySlug(slug);
      return decorate(response?.data ?? null);
    },
    enabled: Boolean(slug),
    staleTime: 1000 * 30,
    gcTime: 1000 * 60 * 15,
    // An article that is not published is gone, not a transient failure — a
    // retry would just repeat the 404 three times before showing the same
    // "not found" the first response already gave.
    retry: false,
    ...options,
  });
}

export default useUpdates;
