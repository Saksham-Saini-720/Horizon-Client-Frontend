import { useQuery } from "@tanstack/react-query";
import { getPropertyAgent } from "../../api/propertyApi";
import { useAuth } from "../utils/useRedux";

export default function usePropertyAgent(propertyId) {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ["property-agent", propertyId],
    queryFn: async () => {
      try {
        const response = await getPropertyAgent(propertyId);
        const agentData = response.data?.agent;

        if (!agentData) {
          return null; // No agent data available
        }

        // Transform agent data to component format
        return transformAgentData(agentData);
      } catch (error) {
        // Handle "No agent assigned" error gracefully
        const errorMessage = error.message || '';
        const isNoAgentError = errorMessage.includes('No agent is assigned') || 
                               errorMessage.includes('Agent not found') ||
                               errorMessage.includes('not assigned');
        
        if (isNoAgentError) {
          // Return null instead of throwing - this is expected behavior
          return null;
        }
        
        // For other errors, throw them
        throw error;
      }
    },
    staleTime: 1000 * 60 * 10,  // 10 minutes (agent data doesn't change often)
    gcTime: 1000 * 60 * 30,     // 30 minutes cache
    enabled: !!propertyId && isAuthenticated, // Only fetch if authenticated and propertyId exists
    retry: (failureCount, error) => {
      // Don't retry if it's a "no agent assigned" error
      const errorMessage = error?.message || '';
      const isNoAgentError = errorMessage.includes('No agent is assigned') || 
                             errorMessage.includes('Agent not found') ||
                             errorMessage.includes('not assigned');
      
      if (isNoAgentError) {
        return false; // Don't retry
      }
      
      // Retry once for other errors
      return failureCount < 1;
    },
  });
}

/**
 * Transform API agent data to component format
 */
function transformAgentData(apiAgent) {
  const {
    user,
    agency,
    bio,
    specializations,
    experience,
    languages,
    certifications,
    social,
    availability,
    stats
  } = apiAgent;

  // Format name
  const name = user 
    ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Property Agent'
    : 'Property Agent';

  // Format phone (clean formatting)
  const phone = user?.phone ? formatPhone(user.phone) : null;

  // Format experience
  const experienceYears = experience?.years 
    ? `${experience.years}+ years`
    : null;

  // Format rating
  const rating = stats?.averageRating 
    ? parseFloat(stats.averageRating).toFixed(1)
    : null;

  // Format reviews count
  const reviews = stats?.totalReviews || 0;

  return {
    // Basic info
    id: user?._id,
    name: name,
    title: agency?.name || 'Property Agent',
    avatar: user?.avatar || null,
    
    // Contact info
    phone: phone,
    email: user?.email || null,
    
    // Professional info
    bio: bio || null,
    experience: experienceYears,
    specializations: specializations || [],
    languages: languages || [],
    certifications: certifications || [],
    
    // Agency info
    agency: agency ? {
      name: agency.name,
      logo: agency.logo,
      phone: agency.phone
    } : null,
    
    // Stats
    rating: rating,
    reviews: reviews,
    propertiesSold: stats?.propertiesSold || 0,
    
    // Availability
    availability: formatAvailability(availability),
    isOnline: user?.status === 'active',
    
    // Social
    social: social || {},
    
    // Raw data for reference
    rawData: apiAgent
  };
}

/**
 * Format phone number (basic cleaning)
 */
function formatPhone(phone) {
  if (!phone) return null;
  
  // Remove all non-numeric characters except + at start
  let cleaned = phone.replace(/[^\d+]/g, '');
  
  // Ensure + is only at the start
  if (cleaned.includes('+')) {
    cleaned = '+' + cleaned.replace(/\+/g, '');
  }
  
  return cleaned;
}

/**
 * Format availability text
 */
function formatAvailability(availability) {
  if (!availability) {
    return 'Mon–Fri 8:00 AM – 6:00 PM  •  Sat 9:00 AM – 1:00 PM';
  }

  // If availability is a string, return as is
  if (typeof availability === 'string') {
    return availability;
  }

  // If availability is an object with schedule
  if (availability.schedule) {
    // Format schedule object to readable string
    const { weekdays, weekends } = availability.schedule;
    
    if (weekdays && weekends) {
      return `${weekdays}  •  ${weekends}`;
    }
    
    if (weekdays) {
      return weekdays;
    }
  }

  // Default fallback
  return 'Mon–Fri 8:00 AM – 6:00 PM  •  Sat 9:00 AM – 1:00 PM';
}
