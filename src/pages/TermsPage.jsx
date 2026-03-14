
import { useNavigate } from 'react-router-dom';

const SECTIONS = [
  {
    title: '1. Acceptance of Terms',
    content: [
      {
        type: 'text',
        text: 'By accessing or using the Horizon Properties mobile application ("App"), you agree to be bound by these Terms and Conditions ("Terms"). If you do not agree to these Terms, please do not use the App.',
      },
      {
        type: 'text',
        text: 'These Terms constitute a legally binding agreement between you ("User") and Horizon Properties Ltd ("Company", "we", "us", or "our"), a property technology company registered in the Republic of Zambia.',
      },
    ],
  },
  {
    title: '2. Description of Services',
    content: [
      {
        type: 'text',
        text: 'Horizon Properties provides a digital platform that enables users to:',
      },
      {
        type: 'bullets',
        items: [
          'Browse and search residential and commercial property listings',
          'View property details including photos, specifications, and pricing',
          'Contact property agents via in-app messaging, phone calls, or WhatsApp',
          'Schedule property viewings (physical or virtual)',
          'Save favorite properties and set alerts',
          'Submit inquiries about specific listings',
        ],
      },
      {
        type: 'text',
        text: 'We act solely as an intermediary platform connecting property seekers with licensed real estate agents and property owners. We do not own, sell, rent, or manage any properties listed on the platform.',
      },
    ],
  },
  {
    title: '3. User Accounts & Registration',
    content: [
      {
        type: 'text',
        text: 'To access certain features of the App, you must create an account. You agree to:',
      },
      {
        type: 'bullets',
        items: [
          'Provide accurate, current, and complete registration information',
          'Maintain the security of your password and account credentials',
          'Promptly update your account information if it changes',
          'Accept responsibility for all activities under your account',
          'Not create multiple accounts for deceptive purposes',
        ],
      },
      {
        type: 'text',
        text: 'We reserve the right to suspend or terminate accounts that violate these Terms or engage in fraudulent activity.',
      },
    ],
  },
  {
    title: '4. Property Listings',
    content: [
      {
        type: 'text',
        text: 'All property listings on Horizon Properties are provided by third-party agents and property owners. While we strive to ensure accuracy:',
      },
      {
        type: 'bullets',
        items: [
          'We do not guarantee the accuracy, completeness, or reliability of any listing information',
          'Property prices, availability, and specifications are subject to change without notice',
          'Photos and virtual tours may not reflect current property conditions',
          'Listed amenities and features should be verified independently before making decisions',
        ],
      },
      {
        type: 'text',
        text: 'Users are advised to conduct their own due diligence, including property inspections and legal verification, before entering into any property transaction.',
      },
    ],
  },
  {
    title: '5. User Conduct',
    content: [
      {
        type: 'text',
        text: 'You agree not to:',
      },
      {
        type: 'bullets',
        items: [
          'Use the App for any unlawful purpose or in violation of applicable laws',
          'Post false, misleading, or fraudulent information',
          'Harass, threaten, or abuse other users or agents',
          'Attempt to gain unauthorized access to our systems or other user accounts',
          'Scrape, copy, or redistribute content from the App without permission',
          'Use automated systems (bots) to access or interact with the App',
          'Interfere with or disrupt the App\'s functionality or infrastructure',
        ],
      },
    ],
  },
  {
    title: '6. Intellectual Property',
    content: [
      {
        type: 'text',
        text: 'All content on the Horizon Properties App, including but not limited to text, graphics, logos, icons, images, software, and design elements, is the property of Horizon Properties Ltd or its licensors and is protected by copyright, trademark, and other intellectual property laws.',
      },
      {
        type: 'text',
        text: 'You may not reproduce, distribute, modify, or create derivative works from any content without our prior written consent.',
      },
    ],
  },
  {
    title: '7. Communications & Notifications',
    content: [
      {
        type: 'text',
        text: 'By using the App, you consent to receive communications from us, including:',
      },
      {
        type: 'bullets',
        items: [
          'Push notifications about property updates and new listings',
          'In-app messages from agents regarding your inquiries',
          'Email notifications about account activity and promotions',
          'SMS alerts for tour confirmations and reminders',
        ],
      },
      {
        type: 'text',
        text: 'You can manage your notification preferences in the App settings at any time.',
      },
    ],
  },
  {
    title: '8. Limitation of Liability',
    content: [
      {
        type: 'text',
        text: 'To the maximum extent permitted by law:',
      },
      {
        type: 'bullets',
        items: [
          'Horizon Properties shall not be liable for any indirect, incidental, special, consequential, or punitive damages',
          'We are not responsible for any losses arising from property transactions conducted through our platform',
          'Our total liability shall not exceed the fees paid by you (if any) in the twelve months preceding the claim',
          'We do not guarantee uninterrupted or error-free access to the App',
        ],
      },
      {
        type: 'text',
        text: 'This limitation applies regardless of the legal theory under which liability is asserted.',
      },
    ],
  },
  {
    title: '9. Dispute Resolution',
    content: [
      {
        type: 'text',
        text: 'Any disputes arising from or related to these Terms shall be:',
      },
      {
        type: 'bullets',
        items: [
          'First attempted to be resolved through good-faith negotiation between the parties',
          'If unresolved within 30 days, submitted to mediation in Lusaka, Zambia',
          'If mediation fails, resolved through binding arbitration under Zambian law',
        ],
      },
      {
        type: 'text',
        text: 'You agree to waive any right to a jury trial and to participate in class action lawsuits.',
      },
    ],
  },
  {
    title: '10. Modifications to Terms',
    content: [
      {
        type: 'text',
        text: 'We reserve the right to modify these Terms at any time. Changes will be effective upon posting the updated Terms in the App. Your continued use of the App after changes are posted constitutes acceptance of the modified Terms.',
      },
      {
        type: 'text',
        text: 'We will make reasonable efforts to notify users of material changes via in-app notifications or email.',
      },
    ],
  },
  {
    title: '11. Governing Law',
    content: [
      {
        type: 'text',
        text: 'These Terms shall be governed by and construed in accordance with the laws of the Republic of Zambia, without regard to conflict of law provisions.',
      },
    ],
  },
  {
    title: '12. Contact Information',
    content: [
      {
        type: 'text',
        text: 'For questions about these Terms, please contact us at:',
      },
      {
        type: 'contact',
        lines: [
          'Horizon Properties Ltd',
          'Plot 1234, Great East Road',
          'Lusaka, Zambia',
          '',
          'Email: legal@horizonproperties.zm',
          'Phone: +260 211 123 456',
        ],
      },
    ],
  },
];

const TermsPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100">
        <div className="flex items-center gap-3 px-4 pt-12 pb-3 max-w-2xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="p-1 -ml-1 rounded-xl hover:bg-gray-100 active:bg-gray-200 transition-colors"
          >
            <svg
              className="w-6 h-6 text-primary"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-[18px] font-black text-primary font-playfair">
            Terms & Conditions
          </h1>
        </div>
      </div>

      {/* Scrollable Content — pt accounts for fixed header height, pb for footer */}
      <div className="pt-[104px] pb-28 max-w-2xl mx-auto px-6">

        {/* Doc Icon + Title Block */}
        <div className="flex items-start gap-4 py-8 border-b border-gray-200 mb-8">
          <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
            <svg
              className="w-6 h-6 text-gray-500"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
          </div>
          <div>
            <h2 className="text-[20px] font-black text-primary font-playfair mb-1">
              Terms & Conditions
            </h2>
            <div className="flex items-center gap-1.5 mb-2">
              <svg
                className="w-3.5 h-3.5 text-gray-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <span className="text-[13px] text-gray-400 font-inter">
                Last updated: March 1, 2026
              </span>
            </div>
            <p className="text-[13px] text-gray-500 font-inter leading-[1.5]">
              Please read these terms carefully before using the Horizon Properties application.
            </p>
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-8">
          {SECTIONS.map((section) => (
            <Section key={section.title} section={section} />
          ))}
        </div>

        {/* Divider + Footer */}
        <div className="border-t border-gray-200 mt-10 pt-6 text-center">
          <p className="text-[13px] text-gray-400 font-inter">
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
    <h3 className="text-[16px] font-bold text-primary font-inter mb-3">
      {section.title}
    </h3>
    <div className="space-y-3">
      {section.content.map((block, idx) => {
        if (block.type === 'text') {
          return (
            <p
              key={idx}
              className="text-[14px] text-gray-600 font-inter leading-[1.7]"
            >
              {block.text}
            </p>
          );
        }

        if (block.type === 'bullets') {
          return (
            <div key={idx} className="space-y-1.5">
              {block.items.map((item, i) => (
                <p
                  key={i}
                  className="text-[14px] text-gray-600 font-inter leading-[1.7]"
                >
                  • {item}
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
                  <p
                    key={i}
                    className="text-[14px] text-gray-600 font-inter leading-[1.7]"
                  >
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

export default TermsPage;
