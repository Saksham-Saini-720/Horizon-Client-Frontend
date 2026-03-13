
import { useNavigate } from 'react-router-dom';

// ─── Data We Collect Cards ────────────────────────────────────────────────────

const DATA_CARDS = [
  {
    icon: (
      <svg className="w-5 h-5 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
      </svg>
    ),
    title: 'Personal Info',
    desc: 'Name, email, phone number',
  },
  {
    icon: (
      <svg className="w-5 h-5 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
    ),
    title: 'Usage Data',
    desc: 'Search history, viewed properties',
  },
  {
    icon: (
      <svg className="w-5 h-5 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
      </svg>
    ),
    title: 'Location',
    desc: 'Approximate location for nearby listings',
  },
  {
    icon: (
      <svg className="w-5 h-5 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
      </svg>
    ),
    title: 'Device Info',
    desc: 'Device type, OS, app version',
  },
];

const COMMITMENTS = [
  'We never sell your personal data',
  'Your messages to agents are private',
  'You can delete your account and data anytime',
  'All data transmission is encrypted',
];

// ─── Sections ─────────────────────────────────────────────────────────────────

const SECTIONS = [
  {
    title: '1. Information We Collect',
    content: [
      { type: 'text', text: 'We collect information that you provide directly and data generated through your use of the App.' },
      { type: 'subheading', text: 'Information You Provide:' },
      {
        type: 'bullets',
        items: [
          'Account registration details (name, email, phone number)',
          'Profile information and preferences',
          'Property search criteria and saved filters',
          'Messages sent to agents through the platform',
          'Tour booking details and scheduling preferences',
          'Feedback, reviews, and support requests',
        ],
      },
      { type: 'subheading', text: 'Automatically Collected Information:' },
      {
        type: 'bullets',
        items: [
          'Device identifiers and technical information',
          'App usage patterns and interaction data',
          'Search queries and browsing history within the App',
          'Approximate location data (with your permission)',
          'Crash reports and performance diagnostics',
        ],
      },
    ],
  },
  {
    title: '2. How We Use Your Information',
    content: [
      { type: 'text', text: 'We use collected information to:' },
      {
        type: 'bullets',
        items: [
          'Provide, maintain, and improve our services',
          'Personalize property recommendations based on your preferences',
          'Connect you with relevant real estate agents',
          'Process and manage tour bookings',
          'Send property alerts and notifications',
          'Analyze usage patterns to improve user experience',
          'Detect and prevent fraud, abuse, and security threats',
          'Comply with legal obligations and enforce our Terms',
          'Communicate important updates about the service',
        ],
      },
    ],
  },
  {
    title: '3. Information Sharing',
    content: [
      { type: 'text', text: 'We may share your information with:' },
      {
        type: 'bold_items',
        items: [
          { label: 'Real Estate Agents:', text: 'When you submit an inquiry, schedule a tour, or send a message, your contact information and inquiry details are shared with the relevant agent to facilitate communication.' },
          { label: 'Service Providers:', text: 'Third-party companies that assist us in operating the App, including cloud hosting, analytics, push notifications, and customer support services.' },
          { label: 'Legal Requirements:', text: 'When required by law, regulation, legal process, or governmental request.' },
          { label: 'Business Transfers:', text: 'In connection with a merger, acquisition, or sale of assets.' },
        ],
      },
      { type: 'text', text: 'We do NOT sell your personal information to third parties for advertising purposes.' },
    ],
  },
  {
    title: '4. Data Security',
    content: [
      { type: 'text', text: 'We implement industry-standard security measures to protect your information:' },
      {
        type: 'bullets',
        items: [
          'End-to-end encryption for sensitive data transmission',
          'Secure data storage with access controls',
          'Regular security audits and vulnerability assessments',
          'Employee access restrictions and training',
          'Two-factor authentication options for user accounts',
        ],
      },
      { type: 'text', text: 'While we strive to protect your data, no method of electronic transmission or storage is 100% secure. We cannot guarantee absolute security.' },
    ],
  },
  {
    title: '5. Data Retention',
    content: [
      { type: 'text', text: 'We retain your personal information for as long as:' },
      {
        type: 'bullets',
        items: [
          'Your account remains active',
          'Necessary to provide you with our services',
          'Required by applicable legal, tax, or regulatory requirements',
          'Needed to resolve disputes or enforce agreements',
        ],
      },
      { type: 'text', text: 'When you delete your account, we will remove or anonymize your personal data within 30 days, except where retention is required by law.' },
    ],
  },
  {
    title: '6. Your Rights & Choices',
    content: [
      { type: 'text', text: 'You have the right to:' },
      {
        type: 'bold_inline',
        items: [
          { label: 'Access', text: 'your personal data stored by us' },
          { label: 'Correct', text: 'inaccurate or incomplete information' },
          { label: 'Delete', text: 'your account and associated data' },
          { label: 'Export', text: 'your data in a portable format' },
          { label: 'Opt-out', text: 'of marketing communications at any time' },
          { label: 'Restrict', text: 'processing of your data in certain circumstances' },
          { label: 'Withdraw consent', text: 'for location tracking and notifications' },
        ],
      },
      { type: 'text', text: 'To exercise these rights, contact us at privacy@horizonproperties.zm or through the App settings.' },
    ],
  },
  {
    title: '7. Cookies & Tracking',
    content: [
      { type: 'text', text: 'The App uses local storage and similar technologies to:' },
      {
        type: 'bullets',
        items: [
          'Remember your preferences and settings',
          'Analyze app performance and usage',
          'Provide personalized content and recommendations',
          'Maintain your session and login status',
        ],
      },
      { type: 'text', text: 'You can clear local storage through your device settings, though this may affect App functionality.' },
    ],
  },
  {
    title: "8. Children's Privacy",
    content: [
      { type: 'text', text: 'Horizon Properties is not intended for use by individuals under the age of 18. We do not knowingly collect personal information from children. If we become aware that a child under 18 has provided us with personal data, we will take steps to delete such information promptly.' },
    ],
  },
  {
    title: '9. International Data Transfers',
    content: [
      { type: 'text', text: 'Your information may be transferred to and processed in countries other than Zambia where our servers and service providers are located. We ensure appropriate safeguards are in place for such transfers, including standard contractual clauses and data processing agreements.' },
    ],
  },
  {
    title: '10. Changes to This Policy',
    content: [
      { type: 'text', text: 'We may update this Privacy Policy periodically. We will notify you of significant changes through:' },
      {
        type: 'bullets',
        items: [
          'In-app notifications',
          'Email notifications to registered users',
          'A prominent notice on our App',
        ],
      },
      { type: 'text', text: 'Your continued use of the App after changes constitutes acceptance of the updated policy.' },
    ],
  },
  {
    title: '11. Contact Us',
    content: [
      { type: 'text', text: 'For privacy-related questions or requests:' },
      {
        type: 'contact',
        lines: [
          'Data Protection Officer',
          'Horizon Properties Ltd',
          'Plot 1234, Great East Road',
          'Lusaka, Zambia',
          '',
          'Email: privacy@horizonproperties.zm',
          'Phone: +260 211 123 456',
          '',
          'We aim to respond to all privacy inquiries within 14 business days.',
        ],
      },
    ],
  },
];

// ─── PrivacyPage ──────────────────────────────────────────────────────────────

const PrivacyPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100">
        <div className="flex items-center gap-3 px-4 pt-12 pb-3 max-w-2xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="p-1 -ml-1 rounded-xl hover:bg-gray-100 active:bg-gray-200 transition-colors"
          >
            <svg className="w-6 h-6 text-[#1C2A3A]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-[17px] font-bold text-[#1C2A3A] font-['DM_Sans',sans-serif]">
            Privacy Policy
          </h1>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="pt-[104px] pb-28 max-w-2xl mx-auto px-6">

        {/* Shield Icon + Title Block */}
        <div className="flex items-start gap-4 py-8 border-b border-gray-200 mb-8">
          <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <div>
            <h2 className="text-[20px] font-bold text-[#1C2A3A] font-['DM_Sans',sans-serif] mb-1">
              Privacy Policy
            </h2>
            <div className="flex items-center gap-1.5 mb-2">
              <svg className="w-3.5 h-3.5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <span className="text-[13px] text-gray-400 font-['DM_Sans',sans-serif]">
                Last updated: March 1, 2026
              </span>
            </div>
            <p className="text-[13px] text-gray-500 font-['DM_Sans',sans-serif] leading-[1.5]">
              Your privacy matters. Here's how we collect, use, and protect your data.
            </p>
          </div>
        </div>

        {/* Data Cards Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {DATA_CARDS.map((card) => (
            <div key={card.title} className="border border-gray-200 rounded-2xl p-4 flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">{card.icon}</div>
              <div>
                <p className="text-[13px] font-bold text-[#1C2A3A] font-['DM_Sans',sans-serif]">
                  {card.title}
                </p>
                <p className="text-[12px] text-gray-500 font-['DM_Sans',sans-serif]">
                  {card.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Our Commitments Box */}
        <div className="border border-gray-200 rounded-2xl p-5 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <svg className="w-5 h-5 text-[#1C2A3A]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <span className="text-[15px] font-bold text-[#1C2A3A] font-['DM_Sans',sans-serif]">
              Our Commitments
            </span>
          </div>
          <div className="space-y-2.5">
            {COMMITMENTS.map((item) => (
              <div key={item} className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-amber-500 flex-shrink-0" />
                <p className="text-[13px] text-gray-600 font-['DM_Sans',sans-serif]">{item}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 mb-8" />

        {/* Sections */}
        <div className="space-y-8">
          {SECTIONS.map((section) => (
            <Section key={section.title} section={section} />
          ))}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 mt-10 pt-6 text-center space-y-1">
          <div className="flex items-center justify-center gap-2">
            <svg className="w-3.5 h-3.5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <p className="text-[12px] text-gray-400 font-['DM_Sans',sans-serif]">
              Your data is encrypted & secure
            </p>
          </div>
          <p className="text-[12px] text-gray-400 font-['DM_Sans',sans-serif]">
            © 2026 Horizon Properties Ltd. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

// ─── Section Component ────────────────────────────────────────────────────────

const Section = ({ section }) => (
  <div>
    <h3 className="text-[16px] font-bold text-[#1C2A3A] font-['DM_Sans',sans-serif] mb-3">
      {section.title}
    </h3>
    <div className="space-y-3">
      {section.content.map((block, idx) => {
        if (block.type === 'text') {
          return (
            <p key={idx} className="text-[14px] text-gray-600 font-['DM_Sans',sans-serif] leading-[1.7]">
              {block.text}
            </p>
          );
        }

        if (block.type === 'subheading') {
          return (
            <p key={idx} className="text-[14px] font-bold text-[#1C2A3A] font-['DM_Sans',sans-serif] mt-2">
              {block.text}
            </p>
          );
        }

        if (block.type === 'bullets') {
          return (
            <div key={idx} className="space-y-1.5">
              {block.items.map((item, i) => (
                <p key={i} className="text-[14px] text-gray-600 font-['DM_Sans',sans-serif] leading-[1.7]">
                  • {item}
                </p>
              ))}
            </div>
          );
        }

        if (block.type === 'bold_items') {
          return (
            <div key={idx} className="space-y-3">
              {block.items.map((item, i) => (
                <p key={i} className="text-[14px] text-gray-600 font-['DM_Sans',sans-serif] leading-[1.7]">
                  <span className="font-bold text-[#1C2A3A]">{item.label}</span>{' '}
                  {item.text}
                </p>
              ))}
            </div>
          );
        }

        if (block.type === 'bold_inline') {
          return (
            <div key={idx} className="space-y-1.5">
              {block.items.map((item, i) => (
                <p key={i} className="text-[14px] text-gray-600 font-['DM_Sans',sans-serif] leading-[1.7]">
                  • <span className="font-bold text-[#1C2A3A]">{item.label}</span>{' '}
                  {item.text}
                </p>
              ))}
            </div>
          );
        }

        if (block.type === 'contact') {
          return (
            <div key={idx} className="space-y-0.5">
              {block.lines.map((line, i) =>
                line === '' ? (
                  <div key={i} className="h-3" />
                ) : (
                  <p key={i} className="text-[14px] text-gray-600 font-['DM_Sans',sans-serif] leading-[1.7]">
                    {line}
                  </p>
                )
              )}
            </div>
          );
        }

        return null;
      })}
    </div>
  </div>
);

export default PrivacyPage;
