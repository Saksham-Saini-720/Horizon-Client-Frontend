
import { memo } from "react";

const MenuItem = memo(({ icon, label, onClick, danger = false }) => (
  <button
    onClick={onClick}
    className={`w-full px-5 py-4 flex items-center justify-between border-b border-gray-100 last:border-b-0 hover:bg-gray-50 active:bg-gray-100 transition-colors ${
      danger ? 'hover:bg-red-50 active:bg-red-100' : ''
    }`}
  >
    <div className="flex items-center gap-3">
      <div className={`w-10 h-10 rounded-full ${
        danger ? 'bg-red-50' : 'bg-gray-50'
      } flex items-center justify-center`}>
        <span className="text-[20px]">{icon}</span>
      </div>
      <span className={`text-[15px] font-semibold font-['DM_Sans',sans-serif] ${
        danger ? 'text-red-500' : 'text-[#1C2A3A]'
      }`}>
        {label}
      </span>
    </div>
    <svg 
      className={`w-5 h-5 ${danger ? 'text-red-400' : 'text-gray-400'}`} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round"
    >
      <path d="M9 18l6-6-6-6"/>
    </svg>
  </button>
));

const SectionTitle = memo(({ children }) => (
  <h3 className="px-5 pt-4 pb-2 text-[13px] font-bold text-gray-400 uppercase tracking-wider font-['DM_Sans',sans-serif]">
    {children}
  </h3>
));

const SettingsMenu = memo(({ onLogout }) => {
  return (
    <div className="space-y-4">
      
      {/* Account Settings */}
      <div>
        <SectionTitle>Account</SectionTitle>
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
          <MenuItem icon="🔔" label="Notifications" onClick={() => {}} />
          <MenuItem icon="🔒" label="Privacy & Security" onClick={() => {}} />
          <MenuItem icon="💳" label="Payment Methods" onClick={() => {}} />
        </div>
      </div>

      {/* Preferences */}
      <div>
        <SectionTitle>Preferences</SectionTitle>
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
          <MenuItem icon="🌍" label="Language" onClick={() => {}} />
          <MenuItem icon="🌙" label="Dark Mode" onClick={() => {}} />
          <MenuItem icon="📍" label="Location Services" onClick={() => {}} />
        </div>
      </div>

      {/* Support */}
      <div>
        <SectionTitle>Support</SectionTitle>
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
          <MenuItem icon="❓" label="Help Center" onClick={() => {}} />
          <MenuItem icon="📧" label="Contact Support" onClick={() => {}} />
          <MenuItem icon="⭐" label="Rate Us" onClick={() => {}} />
          <MenuItem icon="ℹ️" label="About" onClick={() => {}} />
        </div>
      </div>

      {/* Danger Zone */}
      <div>
        <SectionTitle>Danger Zone</SectionTitle>
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
          <MenuItem 
            icon="🚪" 
            label="Log Out" 
            onClick={onLogout} 
            danger 
          />
        </div>
      </div>

    </div>
  );
});

export default SettingsMenu;
