// src/components/property/EnquiryButton.jsx
import { memo, useState } from 'react';
import EnquiryForm from './EnquiryForm';

/**
 * EnquiryButton Component
 * Button to open enquiry form
 * Can be used in PropertyDetailsPage
 */
const EnquiryButton = memo(({ property, agent, variant = 'primary' }) => {
  const [showEnquiryForm, setShowEnquiryForm] = useState(false);

  // Button variants
  const variants = {
    primary: 'bg-[#1C2A3A] text-white hover:bg-[#2A3A4A]',
    secondary: 'bg-white text-[#1C2A3A] border-2 border-[#1C2A3A] hover:bg-gray-50',
    amber: 'bg-amber-500 text-white hover:bg-amber-600',
  };

  return (
    <>
      <button
        onClick={() => setShowEnquiryForm(true)}
        className={`w-full flex items-center justify-center gap-2 px-6 py-4 rounded-2xl text-[16px] font-bold font-['DM_Sans',sans-serif] transition-all active:scale-[0.98] shadow-lg ${variants[variant]}`}
      >
        <svg
          className="w-5 h-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
        Enquire Now
      </button>

      <EnquiryForm
        isOpen={showEnquiryForm}
        onClose={() => setShowEnquiryForm(false)}
        property={property}
        agent={agent}
      />
    </>
  );
});

EnquiryButton.displayName = 'EnquiryButton';

export default EnquiryButton;
