
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/utils/useRedux";

// ─── Not Logged In State ──────────────────────────────────────────────────────

const NotLoggedInState = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F7F6F2] flex flex-col items-center justify-center px-4 pb-28">
      {/* Icon */}
      <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-6">
        <svg className="w-12 h-12 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <path d="M8 10h.01M12 10h.01M16 10h.01"/>
          <path d="M9 16H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-5l-5 5v-5z"/>
        </svg>
      </div>

      {/* Heading */}
      <h2 className="text-[24px] font-bold text-[#1C2A3A] font-['DM_Sans',sans-serif] mb-2">
        No inquiries yet
      </h2>

      {/* Description */}
      <p className="text-[14px] text-gray-500 font-['DM_Sans',sans-serif] text-center max-w-xs mb-8">
        Log in to see your inquiries
      </p>

      {/* Login Button */}
      <button
        onClick={() => navigate("/login")}
        className="px-8 py-3.5 rounded-xl bg-[#1C2A3A] text-white text-[15px] font-semibold font-['DM_Sans',sans-serif] hover:bg-[#2A3A4A] active:scale-95 transition-all shadow-lg"
      >
        Log In
      </button>
    </div>
  );
};

// ─── Empty Inquiries (Logged In) ──────────────────────────────────────────────

const EmptyInquiries = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F7F6F2] flex flex-col items-center justify-center px-4 pb-28">
      <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-6">
        <svg className="w-10 h-10 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <path d="M8 10h.01M12 10h.01M16 10h.01"/>
          <path d="M9 16H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-5l-5 5v-5z"/>
        </svg>
      </div>

      <h3 className="text-[22px] font-bold text-[#1C2A3A] font-['DM_Sans',sans-serif] mb-2">
        No inquiries yet
      </h3>

      <p className="text-[14px] text-gray-500 font-['DM_Sans',sans-serif] text-center max-w-sm mb-8">
        When you inquire about properties, they'll appear here
      </p>

      <button
        onClick={() => navigate("/")}
        className="px-8 py-3.5 rounded-xl text-[15px] font-semibold text-white shadow-lg hover:shadow-xl transition-all active:scale-95"
        style={{ background: "linear-gradient(135deg, #F5B731, #E8A020)" }}
      >
        Browse Properties
      </button>
    </div>
  );
};

// ─── Inquiries List (Logged In with Data) ─────────────────────────────────────

const InquiriesList = ({ inquiries }) => {
  return (
    <div className="min-h-screen bg-[#F7F6F2] pb-28">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-5 pt-6 pb-5">
        <h1 className="text-[24px] font-bold text-[#1C2A3A] font-['DM_Sans',sans-serif] mb-1">
          Inquiries
        </h1>
        <p className="text-[14px] text-gray-500 font-['DM_Sans',sans-serif]">
          {inquiries.length} active {inquiries.length === 1 ? "inquiry" : "inquiries"}
        </p>
      </div>

      {/* Inquiries List */}
      <div className="px-4 pt-4 space-y-3">
        {inquiries.map((inquiry) => (
          <InquiryCard key={inquiry.id} inquiry={inquiry} />
        ))}
      </div>
    </div>
  );
};

const InquiryCard = ({ inquiry }) => (
  <div className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-start gap-3">
      <img 
        src={inquiry.propertyImage} 
        alt={inquiry.propertyTitle}
        className="w-20 h-20 rounded-xl object-cover"
      />
      <div className="flex-1">
        <h3 className="text-[15px] font-bold text-[#1C2A3A] font-['DM_Sans',sans-serif] mb-1">
          {inquiry.propertyTitle}
        </h3>
        <p className="text-[13px] text-gray-500 font-['DM_Sans',sans-serif] mb-2">
          {inquiry.message}
        </p>
        <span className="text-[12px] text-gray-400 font-['DM_Sans',sans-serif]">
          {inquiry.date}
        </span>
      </div>
    </div>
  </div>
);

// ─── InquiriesPage ────────────────────────────────────────────────────────────

const InquiriesPage = () => {
  const { isAuthenticated } = useAuth();

  // Mock data - replace with actual API call
  const inquiries = [];

  // Show not logged in state
  if (!isAuthenticated) {
    return <NotLoggedInState />;
  }

  // Show empty state if no inquiries
  if (inquiries.length === 0) {
    return <EmptyInquiries />;
  }

  // Show inquiries list
  return <InquiriesList inquiries={inquiries} />;
};

export default InquiriesPage;
