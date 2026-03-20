
import { memo, useRef, useCallback, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';

// ─── API ──────────────────────────────────────────────────────────────────────

// const sendSupportMessage = async ({ subject, message }) => {
//   const res = await axiosInstance.post('/support/contact', { subject, message });
//   return res.data;
// };

const sendSupportMessage = async ({ subject, message }) => {
  console.log('Sending support message:', { subject, message });
  return
};

// ─── Modal ────────────────────────────────────────────────────────────────────

const HelpSupportModal = memo(({ isOpen, onClose }) => {
  const subjectRef = useRef(null);
  const messageRef = useRef(null);
  const overlayRef = useRef(null);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    // Prevent background scroll
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  // Focus subject on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => subjectRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const mutation = useMutation({
    mutationFn: sendSupportMessage,
    onSuccess: () => {
      toast.success('Message sent! We\'ll get back to you soon.', {
        duration: 4000,
        position: 'top-center',
      });
      // Reset fields
      if (subjectRef.current) subjectRef.current.value = '';
      if (messageRef.current) messageRef.current.value = '';
      onClose();
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Failed to send message. Please try again.', {
        duration: 4000,
        position: 'top-center',
      });
    },
  });

  const handleSubmit = useCallback(() => {
    const subject = subjectRef.current?.value.trim() ?? '';
    const message = messageRef.current?.value.trim() ?? '';

    if (!subject) {
      subjectRef.current?.focus();
      toast.error('Please enter a subject', { position: 'top-center', duration: 2000 });
      return;
    }
    if (!message) {
      messageRef.current?.focus();
      toast.error('Please describe your issue', { position: 'top-center', duration: 2000 });
      return;
    }

    mutation.mutate({ subject, message });
  }, [mutation]);

  // Click outside to close
  const handleOverlayClick = useCallback((e) => {
    if (e.target === overlayRef.current) onClose();
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
    >
      <div className="bg-surface rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-6 pb-4">
          <div>
            <h2 className="text-[18px] font-semibold text-primary font-myriad">
              Contact Support
            </h2>
            <p className="text-[15px] text-gray-500 font-myriad mt-0.5">
              Have a question or issue? We're here to help.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-gray-200 active:bg-gray-300 transition-colors -mt-0.5"
          >
            <svg className="w-5 h-5 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="px-6 pb-6 space-y-4">

          {/* Subject */}
          <div>
            <label className="block text-[15px] font-semibold text-primary font-myriad mb-2">
              Subject
            </label>
            <input
              ref={subjectRef}
              type="text"
              placeholder="What can we help with?"
              disabled={mutation.isPending}
              className="w-full bg-white border-2 border-secondary rounded-xl px-4 py-3 text-[15px] text-primary placeholder-gray-400 font-myriad outline-none focus:border-secondary transition-colors disabled:opacity-60"
            />
          </div>

          {/* Message */}
          <div>
            <label className="block text-[15px] font-semibold text-primary font-myriad mb-2">
              Message
            </label>
            <textarea
              ref={messageRef}
              placeholder="Describe your issue or question..."
              rows={4}
              disabled={mutation.isPending}
              className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-[15px] text-primary placeholder-gray-400 font-myriad outline-none focus:border-secondary transition-colors resize-none disabled:opacity-60"
            />
          </div>

          {/* Send Button */}
          <button
            onClick={handleSubmit}
            disabled={mutation.isPending}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-[15px] font-semibold text-white font-myriad transition-all active:scale-[0.98] disabled:opacity-70"
            style={{ backgroundColor: '#1C2A3A' }}
          >
            {mutation.isPending ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Sending...</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                </svg>
                <span>Send Message</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
});

HelpSupportModal.displayName = 'HelpSupportModal';

export default HelpSupportModal;
