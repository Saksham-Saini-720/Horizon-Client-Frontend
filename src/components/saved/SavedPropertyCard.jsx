
import { memo, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { removeSaved, setNote, selectPropertyNote } from '../../store/slices/savedSlice';
import PropertyImage from '../ui/PropertyImage';

/**
 * SavedPropertyCard Component - FINAL WORKING VERSION
 * With complete note functionality
 */
const SavedPropertyCard = memo(({ property }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const note = useSelector(selectPropertyNote(property.id));
  const hasNote = !!note;

  const [isEditing, setIsEditing] = useState(false);
  const [localNote, setLocalNote] = useState('');

  const { id, price, title, location, beds, baths, area, tag, img } = property;

  // Navigate to property
  const handleClick = useCallback(() => {
    navigate(`/property/${id}`);
  }, [navigate, id]);

  // Remove property
  const handleRemove = useCallback((e) => {
    e.stopPropagation();
    dispatch(removeSaved(id));
  }, [dispatch, id]);

  // Add/Edit note
  const handleEditNote = useCallback((e) => {
    e.stopPropagation();
    setLocalNote(note || '');
    setIsEditing(true);
  }, [note]);

  // Save note
  const handleSaveNote = useCallback((e) => {
    e.stopPropagation();
    dispatch(setNote({ propertyId: id, note: localNote }));
    setIsEditing(false);
  }, [dispatch, id, localNote]);

  // Cancel editing
  const handleCancelNote = useCallback((e) => {
    e.stopPropagation();
    setIsEditing(false);
    setLocalNote('');
  }, []);

  return (
    <div
      onClick={handleClick}
      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer"
    >
      {/* ── Main Content: Image LEFT + Info RIGHT ── */}
      <div className="flex">
        {/* LEFT: Image */}
        <div className="relative w-32 h-32 bg-gray-100 flex-shrink-0">
          <PropertyImage
            src={img}
            alt={title}
            className="w-full h-full object-cover"
          />

          {/* Tag */}
          {tag && (
            <span
              className={`absolute top-2 left-2 text-[10px] font-bold px-2.5 py-1 rounded-full font-['DM_Sans',sans-serif] ${
                tag === 'For Sale'
                  ? 'bg-[#1C2A3A] text-white'
                  : 'bg-amber-400 text-[#1C2A3A]'
              }`}
            >
              {tag}
            </span>
          )}
        </div>

        {/* RIGHT: Content */}
        <div className="flex-1 px-4 py-3">
          {/* Price */}
          <p className="text-[18px] font-bold text-[#1C2A3A] font-['DM_Sans',sans-serif] mb-1">
            {price}
          </p>

          {/* Title */}
          <h3 className="text-[14px] font-bold text-[#1C2A3A] font-['DM_Sans',sans-serif] mb-1.5 line-clamp-1">
            {title}
          </h3>

          {/* Location */}
          <div className="flex items-center gap-1.5 mb-2">
            <svg
              className="w-3 h-3 text-gray-400 flex-shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <p className="text-[11px] text-gray-500 font-['DM_Sans',sans-serif] truncate">
              {location}
            </p>
          </div>

          {/* Specs */}
          <div className="flex items-center gap-3 mb-2">
            {beds && (
              <div className="flex items-center gap-1">
                <svg className="w-3 h-3 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                  <path d="M3 9v12h18V9M3 9l9-6 9 6M12 3v6" />
                  <rect x="5" y="13" width="4" height="4" />
                  <rect x="15" y="13" width="4" height="4" />
                </svg>
                <span className="text-[11px] text-gray-600 font-['DM_Sans',sans-serif]">{beds}</span>
              </div>
            )}

            {baths && (
              <div className="flex items-center gap-1">
                <svg className="w-3 h-3 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                  <path d="M9 6a3 3 0 1 0 6 0" />
                  <path d="M3 12h18v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-6z" />
                </svg>
                <span className="text-[11px] text-gray-600 font-['DM_Sans',sans-serif]">{baths}</span>
              </div>
            )}

            {area && (
              <div className="flex items-center gap-1">
                <svg className="w-3 h-3 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                </svg>
                <span className="text-[11px] text-gray-600 font-['DM_Sans',sans-serif]">{area}</span>
              </div>
            )}
          </div>

          {/* Timestamp */}
          <p className="text-[10px] text-gray-400 font-['DM_Sans',sans-serif]">
            Saved 4 minutes ago
          </p>
        </div>
      </div>

      {/* ── Note Section (if exists or editing) ── */}
      {(hasNote || isEditing) && (
        <div 
          className="px-4 py-3 border-t border-gray-100"
          onClick={(e) => e.stopPropagation()}
        >
          {isEditing ? (
            // Editing mode
            <>
              <textarea
                value={localNote}
                onChange={(e) => setLocalNote(e.target.value)}
                placeholder="Add a note about this property..."
                className="w-full px-4 py-3 rounded-xl border-2 border-amber-400 bg-amber-50/50 text-[14px] text-gray-700 font-['DM_Sans',sans-serif] placeholder-gray-400 focus:outline-none focus:border-amber-500 resize-none transition-colors"
                rows={4}
                maxLength={500}
                autoFocus
              />
              
              <div className="flex items-center justify-end gap-2 mt-2">
                <button
                  onClick={handleCancelNote}
                  className="px-4 py-2 rounded-lg text-[13px] font-semibold text-gray-600 hover:bg-gray-100 font-['DM_Sans',sans-serif] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveNote}
                  className="px-4 py-2 rounded-lg bg-[#1C2A3A] text-white text-[13px] font-semibold hover:bg-[#2A3A4A] font-['DM_Sans',sans-serif] transition-colors"
                >
                  Save Note
                </button>
              </div>
            </>
          ) : (
            // Saved note display
            <div className="flex items-start gap-2">
              <svg 
                className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
              </svg>
              <p className="text-[13px] text-gray-600 font-['DM_Sans',sans-serif] leading-relaxed flex-1">
                {note}
              </p>
            </div>
          )}
        </div>
      )}

      {/* ── Footer: Edit Note/Add Note | Remove ── */}
      <div 
        className="border-t border-gray-200 flex"
        onClick={(e) => e.stopPropagation()}
      >
        {/* LEFT: Add/Edit Note */}
        <div onClick={handleEditNote} className="flex-1 flex items-center justify-center py-3 hover:bg-gray-50 transition-colors">
          <button
            
            className="flex items-center gap-1.5 text-[13px] font-semibold text-gray-500 hover:text-[#1C2A3A] font-['DM_Sans',sans-serif] transition-colors"
          >
            <svg 
              className="w-3.5 h-3.5" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round"
            >
              {hasNote ? (
                <>
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </>
              ) : (
                <>
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                </>
              )}
            </svg>
            {hasNote ? 'Edit Note' : 'Add Note'}
          </button>
        </div>

        {/* VERTICAL SEPARATOR */}
        <div className="w-px bg-gray-200"></div>

        {/* RIGHT: Remove */}
        <div onClick={handleRemove} className="flex-1 flex items-center justify-center py-3 hover:bg-gray-50 transition-colors">
          <button
            
            className="flex items-center gap-1.5 text-[13px] font-semibold text-red-500 hover:text-red-600 font-['DM_Sans',sans-serif] transition-colors"
          >
            <svg
              className="w-3.5 h-3.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
            Remove
          </button>
        </div>
      </div>

    </div>
  );
});

SavedPropertyCard.displayName = 'SavedPropertyCard';

export default SavedPropertyCard;
