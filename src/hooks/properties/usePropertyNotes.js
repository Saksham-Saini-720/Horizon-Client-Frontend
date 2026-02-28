
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setNote, deleteNote, selectPropertyNote } from '../../store/slices/savedSlice';

/**
 * Hook for managing property notes
 * @param {number|string} propertyId - Property ID
 */
export const usePropertyNote = (propertyId) => {
  const dispatch = useDispatch();
  const note = useSelector(selectPropertyNote(propertyId));

  const saveNote = useCallback((noteText) => {
    dispatch(setNote({ propertyId, note: noteText }));
  }, [dispatch, propertyId]);

  const removeNote = useCallback(() => {
    dispatch(deleteNote(propertyId));
  }, [dispatch, propertyId]);

  return {
    note,
    hasNote: !!note,
    saveNote,
    removeNote,
  };
};
