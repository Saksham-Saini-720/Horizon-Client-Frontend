
import { memo } from 'react';
import { useSelector } from 'react-redux';
import { clearActivity, selectAllInquiries } from '../../store/slices/activitySlice';
import InquiryCard from './InquiryCard';
import { useDispatch } from 'react-redux';

/**
 * InquiriesTab Component
 * Lists all property inquiries from Redux
 */
const InquiriesTab = memo(() => {
  // Get inquiries from Redux
  const inquiries = useSelector(selectAllInquiries);
  console.log('Inquiries from Redux:', inquiries);

  // Show empty state if no inquiries
  if (inquiries.length === 0) {
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
        <h3 className="text-[18px] font-bold text-gray-600 font-['DM_Sans',sans-serif] mb-2">
          No Inquiries Yet
        </h3>
        <p className="text-[14px] text-gray-400 font-['DM_Sans',sans-serif]">
          Your property inquiries will appear here
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {inquiries.map((inquiry) => (
        <InquiryCard key={inquiry.id} inquiry={inquiry} />
      ))}
    </div>
  );
});

InquiriesTab.displayName = 'InquiriesTab';

export default InquiriesTab;
