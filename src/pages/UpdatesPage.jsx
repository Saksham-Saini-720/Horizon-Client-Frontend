import { useNavigate } from 'react-router-dom';
import { useUpdates } from '../hooks/updates/useUpdates';
import EmptyState from '../components/states/EmptyState';
import ErrorState from '../components/states/ErrorState';

// News and updates from Horizon — the reader-facing half of the CMS.
//
// Only published articles ever reach here: the API matches `status: "published"`
// and nothing else, so a draft or an archived piece is a 404 rather than a
// filtered-out row. Nothing on this page has to know about statuses at all.

function UpdateCardSkeleton() {
  return (
    <div className="rounded-3xl overflow-hidden border border-black/5 bg-white shadow-card">
      <div className="h-[180px] bg-gray-100 animate-pulse" />
      <div className="px-4 py-4">
        <div className="h-3 w-24 bg-gray-100 rounded animate-pulse mb-3" />
        <div className="h-4 w-4/5 bg-gray-100 rounded animate-pulse mb-2" />
        <div className="h-3 w-full bg-gray-100 rounded animate-pulse" />
      </div>
    </div>
  );
}

function UpdateCard({ article, onClick }) {
  return (
    <article
      onClick={onClick}
      className="rounded-3xl overflow-hidden border border-black/5 bg-white shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 ease-out cursor-pointer"
    >
      {article.heroImage?.url && (
        <div className="h-[180px] overflow-hidden">
          <img
            src={article.heroImage.url}
            alt={article.heroImage.alt ?? ''}
            loading="lazy"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="px-4 py-4">
        {article.postedLabel && (
          <p
            className="text-[11px] text-gray-400 font-myriad tracking-wide mb-1.5"
            title={article.postedExact ? `Posted ${article.postedExact}` : undefined}
          >
            {article.postedLabel}
          </p>
        )}

        <h2 className="text-[17px] font-semibold text-secondary font-display leading-snug mb-1.5">
          {article.title}
        </h2>

        {article.excerpt && (
          <p className="text-[13px] text-gray-500 font-myriad leading-[1.6] line-clamp-2">
            {article.excerpt}
          </p>
        )}
      </div>
    </article>
  );
}

export default function UpdatesPage() {
  const navigate = useNavigate();
  const { data, isLoading, isError, refetch } = useUpdates({ limit: 20 });

  const updates = data?.updates ?? [];

  return (
    <div className="min-h-screen bg-white">
      {/* Fixed header, matching Terms and Privacy */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100">
        <div className="flex items-center gap-3 px-4 pt-12 pb-3 max-w-2xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            aria-label="Go back"
            className="p-1 -ml-1 rounded-xl hover:bg-gray-100 active:bg-gray-200 transition-colors"
          >
            <svg className="w-6 h-6 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-[18px] font-semibold text-primary font-myriad">
            News &amp; Updates
          </h1>
        </div>
      </div>

      <div className="pt-[104px] pb-28 max-w-2xl mx-auto px-4">
        {isLoading ? (
          <div className="grid grid-cols-1 gap-4">
            {Array(4).fill(0).map((_, i) => <UpdateCardSkeleton key={i} />)}
          </div>
        ) : isError ? (
          <ErrorState
            title="Failed to load updates"
            message="Something went wrong fetching the latest news."
            onRetry={() => refetch()}
          />
        ) : updates.length === 0 ? (
          <EmptyState
            icon="search"
            title="No updates yet"
            message="News and announcements from Horizon will appear here."
          />
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {updates.map((article) => (
              <UpdateCard
                key={article.id}
                article={article}
                onClick={() => navigate(`/updates/${article.slug}`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
