
import { useQuery } from "@tanstack/react-query";
import { getPropertyById, viewPropertyTracked } from "../../api/propertyApi";
import { useAuth } from "../utils/useRedux";
import { toTitleCase } from "../../utils/propertyTransform";

/**
 * Hook to fetch property details from API
 * Automatically tracks view if user is authenticated
 */
export default function usePropertyDetail(propertyId) {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ["property", propertyId],
    queryFn: async () => {
      // Fetch property details
      // If authenticated, use tracked view endpoint
      const response = isAuthenticated 
        ? await viewPropertyTracked(propertyId)
        : await getPropertyById(propertyId);

      // Extract property data
      const propertyData = response.data?.property || response.data;

      if (!propertyData) {
        throw new Error('Property not found');
      }

      // Transform to component format
      return transformPropertyDetail(propertyData);
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30,   // 30 minutes cache
    enabled: !!propertyId,     // Only fetch if propertyId exists
    retry: 1,                  // Retry once on failure
  });
}

/**
 * Transform API property to component format
 */
function transformPropertyDetail(apiProperty) {
  const {
    _id,
    title,
    description,
    price,
    currency,
    purpose,
    type,
    location,
    details,
    images,
    amenities,
    owner,
    status,
    createdAt,
    updatedAt
  } = apiProperty;

  // Get ordered media items (videos first, then images)
  const mediaItems = getAllMediaItems(apiProperty);

  // Format price
  const formattedPrice = formatPrice(price, currency, purpose);

  // Format location
  const formattedLocation = location?.city && location?.state
    ? `${location.city}, ${location.state}`
    : location?.city || location?.state || 'Location not available';

  // Format tag (For Sale / For Rent)
  const tag = purpose === 'rent' ? 'For Rent' : 'For Sale';

  // Get all images
  const allImages = getAllImages(images);

  // Format amenities
  const formattedAmenities = amenities || [];

  // Format agent/owner
  const agent = owner ? {
    name: `${owner.firstName || ''} ${owner.lastName || ''}`.trim() || 'Property Agent',
    title: owner.role === 'agent' ? 'Property Agent' : 'Property Owner',
    avatar: owner.avatar || null,
    phone: owner.phone || null,
    email: owner.email || null,
    id: owner._id
  } : {
    name: 'Property Agent',
    title: 'Agent',
    avatar: null,
    phone: null,
    email: null,
    id: null
  };

  return {
    id: _id,
    price: formattedPrice,
    rawPrice: price,
    title: toTitleCase(title || 'Untitled Property'),
    location: formattedLocation,
    tag: tag,
    type: type?.toUpperCase() || 'PROPERTY',
    purpose: purpose,
    bedrooms: details?.bedrooms || 0,
    bathrooms: details?.bathrooms || 0,
    area: details?.squareFeet?.toString() || '0',
    areaUnit: 'sq ft',
    description: description || 'No description available',
    amenities: formattedAmenities,
    images: allImages,
    mediaItems: mediaItems,
    agent: agent,
    status: status,
    createdAt: createdAt,
    updatedAt: updatedAt,
    // Additional useful fields
    fullLocation: location,
    fullDetails: details,
    rawData: apiProperty // Keep raw data for reference
  };
}

/**
 * Format price with currency
 */
function formatPrice(price, currency = 'USD', purpose = 'sale') {
  if (!price) return 'Price not available';

  const symbol = getCurrencySymbol(currency);
  const formatted = new Intl.NumberFormat('en-US').format(price);

  if (purpose === 'rent') {
    return `${symbol} ${formatted}/mo`;
  }

  return `${symbol} ${formatted}`;
}

/**
 * Get currency symbol
 */
function getCurrencySymbol(currency) {
  const symbols = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    INR: '₹',
    ZMW: 'ZK',
  };
  return symbols[currency] || '$';
}

/**
 * Get ordered media items: videos first, then featured image, then gallery images
 */
function getAllMediaItems(apiProperty) {
  const items = [];

  // Videos first — from the computed gallery array (type === 'video')
  // Falls back to apiProperty.videos if gallery has no video entries
  const galleryVideos = (apiProperty.gallery || []).filter(m => m.type === 'video');
  if (galleryVideos.length > 0) {
    galleryVideos.forEach(v => {
      items.push({ type: 'video', url: v.url, thumbnail: v.thumbnail || null, caption: v.caption || '' });
    });
  } else if (Array.isArray(apiProperty.videos)) {
    apiProperty.videos.forEach(v => {
      items.push({ type: 'video', url: v.url, thumbnail: v.thumbnail || null, caption: v.caption || '' });
    });
  }

  // Featured image
  const featured = apiProperty.images?.featured;
  if (featured) {
    const url = featured.large?.url || featured.medium?.url || featured.original?.url;
    if (url) items.push({ type: 'image', url, thumbnail: featured.thumbnail?.url || url, caption: '' });
  }

  // Gallery images (deduped by url)
  const seen = new Set(items.map(i => i.url));
  (apiProperty.images?.gallery || []).forEach(img => {
    const url = img.large?.url || img.medium?.url || img.original?.url;
    if (url && !seen.has(url)) {
      seen.add(url);
      items.push({ type: 'image', url, thumbnail: img.thumbnail?.url || url, caption: '' });
    }
  });

  // Fallback placeholder when nothing found
  if (items.length === 0) {
    items.push({ type: 'image', url: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800', thumbnail: null, caption: '' });
  }

  return items;
}

/**
 * Get all property images
 */
function getAllImages(images) {
  const imageUrls = [];

  // Add featured image first
  if (images?.featured) {
    const url = images.featured.large?.url ||
                images.featured.medium?.url ||
                images.featured.original?.url;
    if (url) imageUrls.push(url);
  }

  // Add gallery images
  if (images?.gallery && Array.isArray(images.gallery)) {
    images.gallery.forEach(img => {
      const url = img.large?.url || img.medium?.url || img.original?.url;
      if (url && !imageUrls.includes(url)) {
        imageUrls.push(url);
      }
    });
  }

  // Fallback to placeholder if no images
  return imageUrls.length > 0
    ? imageUrls
    : ['https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800'];
}
