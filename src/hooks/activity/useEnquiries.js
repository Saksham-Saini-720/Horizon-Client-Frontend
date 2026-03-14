
import { useQuery } from '@tanstack/react-query';
import { getUserEnquiries } from '../../api/enquiryApi';

const formatLocation = (location) => {
  if (typeof location === 'string') return location;
  if (location && typeof location === 'object') {
    const parts = [];
    if (location.city) parts.push(location.city);
    if (location.state) parts.push(location.state);
    if (parts.length > 0) return parts.join(', ');
    if (location.address) return location.address;
  }
  return 'Location';
};

const formatTimestamp = (dateString) => {
  if (!dateString) return 'Recently';
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const transformEnquiry = (enquiry) => ({
  id:       enquiry._id || enquiry.id,
  property: {
    id:       enquiry.property?._id || enquiry.property?.id,
    img:      enquiry.property?.images?.featured?.thumbnail?.url || enquiry.property?.image || '/placeholder.jpg',
    title:    enquiry.property?.title || 'Property',
    location: formatLocation(enquiry.property?.location),
    price:    enquiry.property?.price || 'Price',
  },
  message:   enquiry.message || '',
  agent: {
    name:   enquiry.agent?.firstName && enquiry.agent?.lastName
              ? `${enquiry.agent.firstName} ${enquiry.agent.lastName}`.trim()
              : enquiry.agent?.name || 'Agent',
    role:   enquiry.agent?.role || 'Property Agent',
    avatar: enquiry.agent?.avatar || enquiry.agent?.profileImage || null,
  },
  status:    enquiry.status || 'submitted',
  timestamp: formatTimestamp(enquiry.createdAt),
  createdAt: enquiry.createdAt,
});

// Load locally saved enquiries (backend links to lead, not user)
const getLocalEnquiries = () => {
  try {
    const saved = localStorage.getItem('localEnquiries');
    return saved ? JSON.parse(saved) : [];
  } catch { return []; }
};

export const useEnquiries = (filters = {}, options = {}) => {
  return useQuery({
    queryKey: ['enquiries', filters],
    queryFn: async () => {
      const response = await getUserEnquiries(filters);
      const enquiries = response.data?.enquiries || response.data || [];

      // Transform API enquiries (filter null properties)
      const fromAPI = enquiries
        .filter(e => e.property && e.property !== null)
        .map(transformEnquiry);

      // Merge with localStorage — backend returns [] because linked to lead not user
      const localEnquiries = getLocalEnquiries();

      // Deduplicate — if same property+message exists in API, skip local
      const apiKeys = new Set(fromAPI.map(e => `${e.property?.id}-${e.message}`));
      const uniqueLocal = localEnquiries.filter(
        e => !apiKeys.has(`${e.property?.id}-${e.message}`)
      );

      const merged = [...fromAPI, ...uniqueLocal];
      
      return merged;
    },
    staleTime:            0,
    gcTime:               1000 * 60 * 10,
    refetchOnMount:       true,
    refetchOnWindowFocus: false,
    retry: 1,
    ...options,
  });
};

export default useEnquiries;
