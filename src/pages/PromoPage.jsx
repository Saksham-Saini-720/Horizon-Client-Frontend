import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import QRCode from 'qrcode';
import toast from 'react-hot-toast';
import { HiOutlineClipboard, HiArrowLeft, HiOutlineEnvelope } from 'react-icons/hi2';

import useFeaturedPromo from '../hooks/promo/useFeaturedPromo';
import { buildPromoLink } from '../utils/promo';

/**
 * The current promotion, and the two ways to pass it on.
 *
 * Email and QR only. WhatsApp and SMS were considered and left out: both hand
 * off to an app that rewrites the message, so what arrives is an ordinary link
 * and tagging it as anything else would be a claim the data cannot support.
 * Two channels that report honestly beat six that do not.
 *
 * Hidden entirely when no campaign is running — see `useFeaturedPromo`.
 */
export default function PromoPage() {
  const navigate = useNavigate();
  const { data: promo, isLoading } = useFeaturedPromo();
  const canvasRef = useRef(null);
  const [copied, setCopied] = useState(false);

  const qrLink = promo ? buildPromoLink(promo.code, '/', 'qr') : '';
  const shareLink = promo ? buildPromoLink(promo.code, '/', 'email') : '';

  useEffect(() => {
    if (!promo || !canvasRef.current) return;
    QRCode.toCanvas(canvasRef.current, qrLink, {
      width: 220,
      margin: 2,
      errorCorrectionLevel: 'M',
      color: { dark: '#1a1a1a', light: '#ffffff' },
    }).catch(() => {
      /* A missing QR is not worth an error state; the code is still on screen. */
    });
  }, [promo, qrLink]);

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(promo.code);
      setCopied(true);
      toast.success('Code copied');
      setTimeout(() => setCopied(false), 1800);
    } catch {
      toast.error('Could not copy — select the code and copy it by hand');
    }
  };

  const shareByEmail = () => {
    const subject = encodeURIComponent(`A Horizon Properties offer: ${promo.perkLabel}`);
    const body = encodeURIComponent(
      `I thought you might like this.\n\n` +
        `Use the code ${promo.code} when you book a viewing with Horizon Properties ` +
        `and you'll get: ${promo.perkLabel}.\n\n${shareLink}\n`
    );
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-secondary rounded-full animate-spin" />
      </div>
    );
  }

  // No campaign running. The framework asks for the feature to be hidden
  // rather than shown as empty, and the route is unreachable from the app when
  // there is nothing on — this is the direct-URL case.
  if (!promo) {
    return (
      <div className="min-h-screen bg-gray-50 px-5 py-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[15px] text-gray-600 font-myriad mb-8"
        >
          <HiArrowLeft size={18} /> Back
        </button>
        <div className="text-center mt-16">
          <p className="text-[17px] font-semibold text-primary font-myriad">
            No offer running right now
          </p>
          <p className="text-[14px] text-gray-500 font-myriad mt-2">
            Check back — we run promotions through the year.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-5 py-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-[15px] text-gray-600 font-myriad mb-6"
      >
        <HiArrowLeft size={18} /> Back
      </button>

      <h1 className="text-[22px] font-semibold text-primary font-myriad">
        {promo.perkLabel}
      </h1>
      <p className="text-[14px] text-gray-500 font-myriad mt-1">
        Use this code when you book a viewing.
        {promo.endsAt
          ? ` Ends ${new Date(promo.endsAt).toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}.`
          : ''}
      </p>

      <div className="bg-white rounded-2xl shadow-card-sm p-6 mt-5 text-center">
        <p className="text-[12px] text-gray-400 font-myriad uppercase tracking-wide">
          Your code
        </p>
        <p
          data-testid="promo-code"
          className="text-[28px] font-semibold text-primary font-myriad tracking-widest mt-1"
        >
          {promo.code}
        </p>

        <button
          onClick={copyCode}
          className="mt-3 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 text-[14px] text-gray-700 font-myriad hover:border-secondary transition-colors"
        >
          <HiOutlineClipboard size={16} />
          {copied ? 'Copied' : 'Copy code'}
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-card-sm p-6 mt-4 text-center">
        <p className="text-[15px] font-semibold text-gray-700 font-myriad">
          Let someone scan it
        </p>
        <p className="text-[12px] text-gray-500 font-myriad mt-1 mb-4">
          Opens our site with the code already applied.
        </p>
        <canvas ref={canvasRef} className="mx-auto rounded-xl" />
      </div>

      <button
        onClick={shareByEmail}
        className="w-full mt-4 flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-secondary text-white text-[16px] font-semibold font-myriad hover:bg-primary-light transition-all shadow-lg"
      >
        <HiOutlineEnvelope size={18} /> Send by email
      </button>
    </div>
  );
}
