
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { startConversation } from '../../api/conversationApi';
import { submitPropertyEnquiry } from '../../api/enquiryApi';
import { addMessage, addInquiry } from '../../store/slices/activitySlice';
import toast from 'react-hot-toast';

export const useStartConversation = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ agent, property, message, name, email, phone }) => {
      const recipientId = agent?.id || agent?._id;
      if (!recipientId) throw new Error('Agent ID missing');

      // Step 1: Start conversation
      const conversationResponse = await startConversation({
        recipientId,
        propertyId: property?.id || property?._id,
        subject: `Enquiry: ${property?.title || 'Property'}`,
        initialMessage: message,
      });

      // Step 2: Submit enquiry (non-blocking)
      await submitPropertyEnquiry(property?.id || property?._id, {
        name, email, phone, message,
      }).catch((e) => console.warn('⚠️ Enquiry API failed:', e.message));

      const conv =
        conversationResponse?.data?.conversation ||
        conversationResponse?.data ||
        conversationResponse;

      const conversationId = conv?._id || conv?.id;
      if (!conversationId) throw new Error('No conversationId in response');

      return { conversationId };
    },

    onSuccess: ({ conversationId }, variables) => {
      const agentData = {
        name:   variables.agent?.name || 'Agent',
        avatar: variables.agent?.photo || variables.agent?.avatar || null,
        role:   variables.agent?.title || variables.agent?.role || 'Property Agent',
      };
      const propertyData = {
        id:       variables.property?.id,
        title:    variables.property?.title || 'Property',
        img:      variables.property?.images?.[0] || variables.property?.img || null,
        location: variables.property?.location || '',
        price:    variables.property?.price || '',
      };

      // Save to localStorage so it persists after refresh
      const newInquiry = {
        id:        'local-' + Date.now(),
        property:  propertyData,
        message:   variables.message,
        agent:     agentData,
        status:    'submitted',
        timestamp: 'just now',
        createdAt: new Date().toISOString(),
      };

      try {
        const saved = localStorage.getItem('localEnquiries');
        const existing = saved ? JSON.parse(saved) : [];
        localStorage.setItem('localEnquiries', JSON.stringify([newInquiry, ...existing]));
      } catch(e) { console.warn('localStorage failed', e); }

      // Update Redux
      dispatch(addMessage({ id: conversationId, conversationId, agent: agentData, property: propertyData, message: variables.message }));
      dispatch(addInquiry({ ...newInquiry }));

      // Refresh queries
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      queryClient.invalidateQueries({ queryKey: ['enquiries'] });

      return conversationId;
    },

    onError: (error) => {
      toast.error(error.message || 'Failed to send message.', { duration: 4000, position: 'top-center' });
    },

    retry: false,
  });

  return {
    start: mutation.mutateAsync,
    isStarting: mutation.isPending,
    isError: mutation.isError,
  };
};

export default useStartConversation;
