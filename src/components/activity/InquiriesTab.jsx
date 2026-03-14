
import { memo, useEffect } from 'react';
import { useEnquiries } from '../../hooks/activity/useEnquiries';
import InquiryCard from './InquiryCard';
import { NewListingCardSkeleton } from '../ui/SkeletonCards';

const InquiriesTab = memo(() => {
  const { data: enquiries = [], isLoading, isError, error, refetch } = useEnquiries();

  
  useEffect(() => {
    
  }, [enquiries, isLoading, isError, error]);

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
        <h3 className="text-[20px] font-bold text-gray-600 font-inter mb-2">
          Failed to Load Inquiries
        </h3>
        <p className="text-[16px] text-gray-400 font-inter mb-4">
          {error?.message || 'Something went wrong'}
        </p>
        <button
          onClick={() => {
            refetch();
          }}
          className="px-6 py-2 bg-amber-500 text-white rounded-xl font-semibold hover:bg-amber-600 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Empty state
  if (enquiries.length === 0) {

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
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </div>
        <h3 className="text-[20px] font-bold text-gray-600 font-inter mb-2">
          No Inquiries Yet
        </h3>
        <p className="text-[16px] text-gray-400 font-inter">
          Your property inquiries will appear here
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {enquiries.map((inquiry) => (
        <InquiryCard key={inquiry.id} inquiry={inquiry} />
      ))}
    </div>
  );
});

InquiriesTab.displayName = 'InquiriesTab';

export default InquiriesTab;