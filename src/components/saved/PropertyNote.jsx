
import { memo, useState, useCallback, useRef, useEffect } from 'react';
import { usePropertyNote } from '../../hooks/properties/usePropertyNotes';

/**
 * PropertyNote Component - Inline Button Version
 * Simple button that opens modal for editing
 */
const PropertyNote = memo(({ propertyId }) => {
  const { note, hasNote, saveNote } = usePropertyNote(propertyId);
  
  const [isEditing, setIsEditing] = useState(false);
  const [localNote, setLocalNote] = useState('');
  const textareaRef = useRef(null);

  // Handle click
  const handleClick = useCallback((e) => {
    e.stopPropagation();
    setLocalNote(note);
    setIsEditing(true);
  }, [note]);

  // Focus textarea when editing starts
  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      const len = localNote.length;
      textareaRef.current.setSelectionRange(len, len);
    }
  }, [isEditing, localNote.length]);

  // Handle save
  const handleSave = useCallback((e) => {
    e.stopPropagation();
    saveNote(localNote);
    setIsEditing(false);
  }, [localNote, saveNote]);

  // Handle cancel
  const handleCancel = useCallback((e) => {
    e.stopPropagation();
    setIsEditing(false);
    setLocalNote('');
  }, []);

  // Handle textarea change
  const handleChange = useCallback((e) => {
    setLocalNote(e.target.value);
  }, []);

  // ─── Editing Modal ────────────────────────────────────────────────────────

  if (isEditing) {
    return (
      <>
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={handleCancel}
        />
        
        {/* Note Editor Modal */}
        <div 
          className="fixed inset-x-4 top-1/2 -translate-y-1/2 bg-white rounded-2xl p-5 shadow-2xl z-50 max-w-md mx-auto animate-in zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          <h3 className="text-[17px] font-bold text-[#1C2A3A] font-['DM_Sans',sans-serif] mb-3">
            {hasNote ? 'Edit Note' : 'Add Note'}
          </h3>

          <textarea
            ref={textareaRef}
            value={localNote}
            onChange={handleChange}
            placeholder="Add a note about this property..."
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-amber-400 bg-white text-[14px] text-gray-700 font-['DM_Sans',sans-serif] placeholder-gray-400 focus:outline-none resize-none transition-colors"
            rows={5}
            maxLength={500}
          />
          
          <div className="flex items-center justify-between mt-3">
            <span className="text-[11px] text-gray-400 font-['DM_Sans',sans-serif]">
              {localNote.length}/500
            </span>
            
            <div className="flex gap-2">
              <button
                onClick={handleCancel}
                className="px-4 py-2 rounded-lg text-[13px] font-semibold text-gray-600 hover:bg-gray-100 font-['DM_Sans',sans-serif] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-5 py-2 rounded-lg bg-[#1C2A3A] text-white text-[13px] font-semibold hover:bg-[#2A3A4A] font-['DM_Sans',sans-serif] transition-colors"
              >
                Save Note
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  // ─── Inline Button ────────────────────────────────────────────────────────

  return (
    <button
      onClick={handleClick}
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
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
      </svg>
      Add Note
    </button>
  );
});

PropertyNote.displayName = 'PropertyNote';

export default PropertyNote;
