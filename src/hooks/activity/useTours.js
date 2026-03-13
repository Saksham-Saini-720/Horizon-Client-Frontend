
import { useQuery } from '@tanstack/react-query';
import { getUserTours } from '../../api/tourApi';

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
 * Transform API tour data to component format
 */
const transformTour = (tour) => {
  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return null;
    if (/^\d{2}:\d{2}$/.test(timeString)) return timeString;
    const date = new Date(timeString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false
    });
  };

  return {
    id: tour._id || tour.id,
    property: {
      id: tour.property?._id || tour.property?.id,
      img: tour.property?.images?.featured?.thumbnail?.url || tour.property?.image || '/placeholder.jpg',
      title: tour.property?.title || 'Property',
      location: formatLocation(tour.property?.location),
    },
    status: tour.status || 'pending',
    visitType: tour.visitType || 'in-person',
    date: tour.confirmedDateTime 
      ? formatDate(tour.confirmedDateTime) 
      : formatDate(tour.preferredDate),
    time: tour.confirmedDateTime
      ? formatTime(tour.confirmedDateTime)
      : tour.preferredTime || null,
    agent: {
      name: tour.agent?.firstName && tour.agent?.lastName
        ? `${tour.agent.firstName} ${tour.agent.lastName}`.trim()
        : tour.agent?.name || 'Agent',
      avatar: tour.agent?.avatar || tour.agent?.profileImage || null,
    },
    proposedTimes: tour.status === 'pending' 
      ? (tour.preferredTimes || [tour.preferredTime]).filter(Boolean)
      : null,
    createdAt: tour.createdAt,
  };
};

/**
 * useTours Hook - FIXED: Filters null properties
 * Reduced API calls, better caching, handles deleted properties
 */
export const useTours = (filters = {}, options = {}) => {
  return useQuery({
    queryKey: ['tours', filters],
    queryFn: async () => {
      
      const response = await getUserTours(filters);
      const tours = response.data?.tours || response.data || [];
      
      //  FILTER OUT NULL PROPERTIES (deleted properties)
      const validTours = tours.filter(tour => {
        if (!tour.property || tour.property === null) {
          return false;
        }
        return true;
      });
      
      return validTours.map(transformTour);
    },
    staleTime: 5 * 60 * 1000, // ✅ 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnMount: false, // ✅ Changed from 'always'
    refetchOnWindowFocus: false, // ✅ Changed from true
    retry: 1, // ✅ Only retry once
    ...options,
  });
};

export default useTours;
