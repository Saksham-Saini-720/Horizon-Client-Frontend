
import { memo } from 'react';
import { useTours } from '../../hooks/activity/useTours';
import TourCard from './TourCard';
import { NewListingCardSkeleton } from '../ui/SkeletonCards';

/**
 * ToursTab Component
 * Lists all tour requests from API
 */
const ToursTab = memo(() => {
  // Fetch tours from API
  const { data: tours = [], isLoading, isError, error, refetch } = useTours();

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        {Array(3).fill(0).map((_, i) => (
          <NewListingCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mb-4">
          <svg
            className="w-10 h-10 text-red-500"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <h3 className="text-[12px] font-bold text-gray-600 font-inter mb-2">
          Failed to Load Tours
        </h3>
        <p className="text-[16px] text-gray-400 font-inter mb-4">
          {error?.message || 'Something went wrong'}
        </p>
        <button
          onClick={() => refetch()}
          className="px-6 py-2 bg-amber-500 text-white rounded-xl font-semibold hover:bg-amber-600 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Empty state
  if (tours.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
          <svg
            className="w-10 h-10 text-gray-400"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
        </div>
        <h3 className="text-[20px] font-bold text-gray-600 font-inter mb-2">
          No Tour Requests Yet
        </h3>
        <p className="text-[16px] text-gray-400 font-inter">
          Your tour requests will appear here
        </p>
      </div>
    );
  }

  // Tours list
  return (
    <div className="space-y-6">
      {tours.map((tour) => (
        <TourCard key={tour.id} tour={tour} />
      ))}
      {/* <button onClick={()=>dispatch(clearActivity())}>clear</button> */}
    </div>
  );
});

ToursTab.displayName = 'ToursTab';

export default ToursTab;
