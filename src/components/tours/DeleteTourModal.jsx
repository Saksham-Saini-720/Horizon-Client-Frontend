
import { memo } from 'react';
import { useDeleteTour } from '../../hooks/tours/useTourActions';

/**
 * DeleteTourModal Component
 * Modal for permanently deleting a tour from the list
 */
const DeleteTourModal = memo(({ isOpen, onClose, tour }) => {
  const deleteMutation = useDeleteTour();

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    
    deleteMutation.mutate(
      { tourId: tour.id },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  const handleClose = () => {
    if (!deleteMutation.isPending) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bold/50 animate-fadeIn">
      <div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
                <svg className="w-5 h-5 text-red-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  <line x1="10" y1="11" x2="10" y2="17" />
                  <line x1="14" y1="11" x2="14" y2="17" />
                </svg>
              </div>
              <div>
                <h2 className="text-[18px] font-semibold text-primary font-inter">
                  Delete Tour Request
                </h2>
                <p className="text-[12px] text-gray-500 font-inter">
                  {tour?.property?.title}
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              disabled={deleteMutation.isPending}
              className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors disabled:opacity-50"
            >
              <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-6">
          {/* Warning Message */}
          <div className="mb-5 p-4 rounded-xl bg-red-50 border border-red-100">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
              <div>
                <p className="text-[15px] font-semibold text-red-800 font-inter mb-1">
                  Permanently Delete?
                </p>
                <p className="text-[12px] text-red-700 font-inter">
                  This will permanently remove this tour request from your activity list. This action cannot be undone.
                </p>
              </div>
            </div>
          </div>

          {/* Tour Info */}
          <div className="mb-6 p-3 rounded-xl bg-gray-50 border border-gray-100">
            <div className="flex items-center gap-3">
              <img
                src={tour?.property?.img}
                alt={tour?.property?.title}
                className="w-12 h-12 rounded-lg object-cover"
              />
              <div className="flex-1 min-w-0">
                <p className="text-[15px] font-semibold text-gray-700 font-inter truncate">
                  {tour?.property?.title}
                </p>
                <p className="text-[11px] text-gray-500 font-inter">
                  {tour?.status === 'cancelled' ? 'Cancelled Request' : 'Tour Request'}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleClose}
              disabled={deleteMutation.isPending}
              className="flex-1 px-6 py-3 rounded-xl border border-gray-200 text-[15px] font-semibold text-gray-700 font-inter hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Keep
            </button>
            <button
              type="submit"
              disabled={deleteMutation.isPending}
              className="flex-1 px-6 py-3 rounded-xl bg-red-600 text-white text-[15px] font-semibold font-inter hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {deleteMutation.isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete Permanently'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
});

DeleteTourModal.displayName = 'DeleteTourModal';

export default DeleteTourModal;
