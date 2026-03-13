
import { useQuery } from '@tanstack/react-query';
import { getUserEnquiries } from '../../api/enquiryApi';

/**
 * Format location from object or string
 */
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

/**
 * Format timestamp to relative time
 */
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

/**
 * Transform API enquiry data to component format
 */
const transformEnquiry = (enquiry) => {

  return {
    id: enquiry._id || enquiry.id,
    property: {
      id: enquiry.property?._id || enquiry.property?.id,
      // FIXED: Changed from tour.property to enquiry.property
      img: enquiry.property?.images?.featured?.thumbnail?.url || enquiry.property?.image || '/placeholder.jpg',
      title: enquiry.property?.title || 'Property',
      location: formatLocation(enquiry.property?.location),
      price: enquiry.property?.price || 'Price',
    },
    message: enquiry.message || '',
    agent: {
      name: enquiry.agent?.firstName && enquiry.agent?.lastName
        ? `${enquiry.agent.firstName} ${enquiry.agent.lastName}`.trim()
        : enquiry.agent?.name || 'Agent',
      role: enquiry.agent?.role || 'Property Agent',
      avatar: enquiry.agent?.avatar || enquiry.agent?.profileImage || null,
    },
    status: enquiry.status || 'submitted',
    timestamp: formatTimestamp(enquiry.createdAt),
    createdAt: enquiry.createdAt,
  };
};

/**
 * useEnquiries Hook - FIXED: Filters null properties
 * Reduced API calls, better caching, handles deleted properties
 */
export const useEnquiries = (filters = {}, options = {}) => {
  return useQuery({
    queryKey: ['enquiries', filters],
    queryFn: async () => {
      
      const response = await getUserEnquiries(filters);
      const enquiries = response.data?.enquiries || response.data || [];
      
      // FILTER OUT NULL PROPERTIES (deleted properties)
      const validEnquiries = enquiries.filter(enquiry => {
        if (!enquiry.property || enquiry.property === null) {
          
          return false;
        }
        return true;
      });
      
      return validEnquiries.map(transformEnquiry);
    },
    staleTime: 5 * 60 * 1000, // ✅ 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnMount: false, // ✅ Changed from 'always'
    refetchOnWindowFocus: false, // ✅ Changed from true
    retry: 1, // ✅ Only retry once
    ...options,
  });
};

export default useEnquiries;
