
import { memo } from "react";
import { useSaved } from "../../hooks/utils/useRedux";
import { useNavigate } from "react-router-dom";

const StatCard = memo(({ icon, label, value, onClick }) => (
  <button
    onClick={onClick}
    className="flex-1 bg-white rounded-2xl p-4 shadow-sm hover:shadow-md active:scale-[0.98] transition-all"
  >
    <div className="flex flex-col items-center text-center">
      <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center mb-2">
        <span className="text-[24px]">{icon}</span>
      </div>
      <p className="text-[20px] font-bold text-[#1C2A3A] font-['DM_Sans',sans-serif] mb-0.5">
        {value}
      </p>
      <p className="text-[12px] text-gray-500 font-['DM_Sans',sans-serif]">
        {label}
      </p>
    </div>
  </button>
));

const ProfileStats = memo(() => {
  const navigate = useNavigate();
  const { count } = useSaved();

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm -mt-16 relative z-10 mb-4">
      <div className="flex gap-3">
        <StatCard 
          icon="💚" 
          label="Saved" 
          value={count}
          onClick={() => navigate("/saved")}
        />
        <StatCard 
          icon="💬" 
          label="Inquiries" 
          value={0}
          onClick={() => navigate("/inquiries")}
        />
        <StatCard 
          icon="👁️" 
          label="Views" 
          value={0}
          onClick={() => {}}
        />
      </div>
    </div>
  );
});

export default ProfileStats;
