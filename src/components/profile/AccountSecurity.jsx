
import { memo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HelpSupportModal from './HelpSupportModal';
import ChangePasswordModal from './ChangePasswordModal';

const AccountSecurity = memo(({ onLogout }) => {
  const navigate = useNavigate();
  const [showSupport,  setShowSupport]  = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="mt-8 mb-8">
      <h2 className="text-[16px] font-semibold text-[#1C2A3A] font-font-myriad mb-4">
        Account & Security
      </h2>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">

        {/* This Device */}
        <div className="p-5 flex items-center gap-4">
          <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
            <line x1="12" y1="18" x2="12.01" y2="18"/>
          </svg>
          <div className="flex-1">
            <p className="text-[15px] font-semibold text-[#1C2A3A] font-font-myriad">This Device</p>
            <p className="text-[12px] text-gray-500 font-font-myriad">Current session • Active now</p>
          </div>
          <span className="px-3 py-1 rounded-full bg-green-50 text-[12px] font-semibold text-green-600">Active</span>
        </div>

        <div className="border-t border-gray-100"/>

        {/* Change Password */}
        <button
          onClick={() => setShowPassword(true)}
          className="w-full p-5 flex items-center gap-4 hover:bg-gray-50 transition-colors text-left group"
        >
          <svg className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
          <span className="flex-1 text-[15px] font-semibold text-[#1C2A3A] font-font-myriad">Change Password</span>
          <svg className="w-5 h-5 text-gray-300 group-hover:text-gray-500 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </button>

        <div className="border-t border-gray-100"/>

        {/* Log Out */}
        <button onClick={onLogout} className="w-full p-5 flex items-center gap-4 hover:bg-gray-50 transition-colors text-left group">
          <svg className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          <span className="flex-1 text-[15px] font-semibold text-[#1C2A3A] font-font-myriad">Log Out</span>
          <svg className="w-5 h-5 text-gray-300 group-hover:text-gray-500 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </button>

        <div className="border-t border-gray-100"/>

        {/* Terms */}
        <button onClick={() => navigate('/terms')} className="w-full p-5 flex items-center gap-4 hover:bg-gray-50 transition-colors text-left group">
          <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
          </svg>
          <span className="flex-1 text-[15px] font-semibold text-[#1C2A3A] font-font-myriad">Terms & Conditions</span>
          <svg className="w-5 h-5 text-gray-300 group-hover:text-gray-500 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </button>

        <div className="border-t border-gray-100"/>

        {/* Privacy */}
        <button onClick={() => navigate('/privacy')} className="w-full p-5 flex items-center gap-4 hover:bg-gray-50 transition-colors text-left group">
          <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
          <span className="flex-1 text-[15px] font-semibold text-[#1C2A3A] font-font-myriad">Privacy Policy</span>
          <svg className="w-5 h-5 text-gray-300 group-hover:text-gray-500 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </button>

        <div className="border-t border-gray-100"/>

        {/* Help & Support */}
        <button onClick={() => setShowSupport(true)} className="w-full p-5 flex items-center gap-4 hover:bg-gray-50 transition-colors text-left group">
          <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
          <span className="flex-1 text-[15px] font-semibold text-[#1C2A3A] font-font-myriad">Help & Support</span>
          <svg className="w-5 h-5 text-gray-300 group-hover:text-gray-500 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </button>
      </div>

      <div className="mt-6 text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
          <p className="text-[12px] text-gray-500 font-font-myriad">Your data is encrypted & secure</p>
        </div>
        <p className="text-[11px] text-gray-400 font-font-myriad">Horizon Properties v1.0.0 • Phase 1</p>
      </div>

      <HelpSupportModal isOpen={showSupport} onClose={() => setShowSupport(false)}/>
      <ChangePasswordModal isOpen={showPassword} onClose={() => setShowPassword(false)}/>
    </div>
  );
});

AccountSecurity.displayName = 'AccountSecurity';
export default AccountSecurity;
