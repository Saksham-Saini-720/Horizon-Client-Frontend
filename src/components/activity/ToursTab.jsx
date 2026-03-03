
import { memo } from 'react';
import { useSelector } from 'react-redux';
import { selectAllTours } from '../../store/slices/activitySlice';
import TourCard from './TourCard';

/**
 * ToursTab Component
 * Lists all tour requests from Redux
 */
const ToursTab = memo(() => {
  // Get tours from Redux
  const tours = useSelector(selectAllTours);

  // Show empty state if no tours
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
        <h3 className="text-[18px] font-bold text-gray-600 font-['DM_Sans',sans-serif] mb-2">
          No Tour Requests Yet
        </h3>
        <p className="text-[14px] text-gray-400 font-['DM_Sans',sans-serif]">
          Your tour requests will appear here
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {tours.map((tour) => (
        <TourCard key={tour.id} tour={tour} />
      ))}
    </div>
  );
});

ToursTab.displayName = 'ToursTab';

export default ToursTab;
