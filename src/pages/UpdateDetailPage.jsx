import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useUpdateBySlug } from '../hooks/updates/useUpdates';
import EmptyState from '../components/states/EmptyState';

// A single published article.
//
// There is deliberately no "this article is a draft" or "this was archived"
// state to render. The API answers a request for either with a 404, so from
// here an unpublished article and a slug that never existed are the same thing,
// which is what "removed from public view" has to mean.

export default function UpdateDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { data: article, isLoading, isError } = useUpdateBySlug(slug);

  // Start at the top of the article.
  //
  // There is no global scroll restoration in this app — SearchPage and
  // PropertyDetailPage each do their own — and the router preserves window
  // scroll across a navigation. The Latest Updates rail sits well down the
  // Explore page, so without this you open an article already scrolled into the
  // middle of its body. Keyed on slug so tapping through to a second article
  // resets too.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  return (
    <div className="min-h-screen bg-white">
      <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100">
        <div className="flex items-center gap-3 px-4 pt-12 pb-3 max-w-2xl mx-auto">
          <button
            onClick={() => navigate('/updates')}
            aria-label="Back to updates"
            className="p-1 -ml-1 rounded-xl hover:bg-gray-100 active:bg-gray-200 transition-colors"
          >
            <svg className="w-6 h-6 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-[18px] font-semibold text-primary font-myriad truncate">
            News &amp; Updates
          </h1>
        </div>
      </div>

      <div className="pt-[104px] pb-28 max-w-2xl mx-auto px-6">
        {isLoading ? (
          <div>
            <div className="h-[220px] bg-gray-100 rounded-3xl animate-pulse mb-6" />
            <div className="h-3 w-28 bg-gray-100 rounded animate-pulse mb-4" />
            <div className="h-6 w-4/5 bg-gray-100 rounded animate-pulse mb-3" />
            <div className="h-4 w-full bg-gray-100 rounded animate-pulse mb-2" />
            <div className="h-4 w-11/12 bg-gray-100 rounded animate-pulse" />
          </div>
        ) : isError || !article ? (
          <EmptyState
            icon="search"
            title="Update not found"
            message="This article may have been removed."
            action={
              <button
                onClick={() => navigate('/updates')}
                className="px-5 py-2.5 rounded-xl text-[14px] font-semibold text-white font-myriad"
                style={{ background: '#C96C38' }}
              >
                Back to updates
              </button>
            }
          />
        ) : (
          <article>
            {article.heroImage?.url && (
              <img
                src={article.heroImage.url}
                alt={article.heroImage.alt ?? ''}
                className="w-full max-h-[300px] object-cover rounded-3xl mb-6"
              />
            )}

            {article.postedLabel && (
              <p className="text-[12px] text-gray-400 font-myriad tracking-wide mb-2">
                Posted {article.postedExact ?? article.postedLabel}
              </p>
            )}

            <h2 className="text-[26px] font-bold text-secondary font-display leading-tight mb-3">
              {article.title}
            </h2>

            {article.excerpt && (
              <p className="text-[16px] text-gray-600 font-myriad leading-[1.7] font-semibold mb-6">
                {article.excerpt}
              </p>
            )}

            {/* Plain text, not HTML. The body is authored in a textarea and is
                rendered as written — interpreting it as markup would make the
                admin console an injection route into every reader's browser. */}
            <div className="text-[15px] text-gray-600 font-myriad leading-[1.8] whitespace-pre-wrap">
              {article.body}
            </div>
          </article>
        )}
      </div>
    </div>
  );
}
