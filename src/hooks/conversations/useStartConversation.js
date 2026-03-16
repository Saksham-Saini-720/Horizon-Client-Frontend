
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
      // Backend no longer needs recipientId — it's determined by property owner
      const conversationResponse = await startConversation({
        propertyId:     property?.id || property?._id,
        subject:        `Enquiry: ${property?.title || 'Property'}`,
        initialMessage: message,
      });

      // Submit enquiry (non-blocking)
      await submitPropertyEnquiry(property?.id || property?._id, {
        name, email, phone, message,
      }).catch((e) => console.warn('⚠️ Enquiry API failed:', e.message));

      // Backend now returns { conversation, thread }
      const conv   = conversationResponse?.data?.conversation || conversationResponse?.data;
      const thread = conversationResponse?.data?.thread;

      const conversationId = conv?._id || conv?.id;
      const threadId       = thread?._id || thread?.id;

      if (!conversationId) throw new Error('No conversationId in response');

      return { conversationId, threadId };
    },

    onSuccess: ({ conversationId, threadId }, variables) => {
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

      // Save to localStorage
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

      dispatch(addMessage({ id: conversationId, conversationId, threadId, agent: agentData, property: propertyData, message: variables.message }));
      dispatch(addInquiry({ ...newInquiry }));

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
