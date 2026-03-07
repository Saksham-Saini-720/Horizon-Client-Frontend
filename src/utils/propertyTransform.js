// src/utils/propertyTransform.js
/**
 * Transform API property to component format
 */
export function transformProperty(apiProperty) {
  if (!apiProperty) return null;

  // Extract data
  const {
    _id,
    price,
    currency,
    purpose,
    title,
    description,
    location,
    details,
    images,
    owner,
    type,
    amenities,
    status,
    createdAt,
    updatedAt
  } = apiProperty;

  // Format price with currency symbol
  const formattedPrice = formatPrice(price, currency, purpose);

  // Format location
  const formattedLocation = formatLocation(location);

  // Format area
  const formattedArea = formatArea(details?.squareFeet);

  // Get image URL
  const imageUrl = getPropertyImage(images);

  // ⭐ FIXED: Format purpose to tag
  const tag = formatPurpose(purpose);

  // Build transformed property
  return {
    id: _id,
    price: formattedPrice,
    rawPrice: price, // Keep raw price for sorting
    title: title || description || 'Untitled Property',
    location: formattedLocation,
    beds: details?.bedrooms ? `${details.bedrooms} Bed${details.bedrooms > 1 ? 's' : ''}` : null,
    baths: details?.bathrooms ? `${details.bathrooms} Bath${details.bathrooms > 1 ? 's' : ''}` : null,
    area: formattedArea,
    img: imageUrl,
    tag: tag, // ⭐ CRITICAL: Tag for filters
    purpose: purpose, // ⭐ Keep original purpose too
    type: type,
    amenities: amenities || [],
    status: status,
    owner: owner ? {
      id: owner._id,
      name: `${owner.firstName || ''} ${owner.lastName || ''}`.trim() || 'Agent',
      avatar: owner.avatar,
      phone: owner.phone,
      email: owner.email
    } : null,
    createdAt: createdAt,
    updatedAt: updatedAt,
  };
}

/**
 * Transform multiple properties
 */
export function transformProperties(apiProperties) {
  if (!Array.isArray(apiProperties)) return [];
  return apiProperties.map(transformProperty).filter(Boolean);
}

/**
 * Transform API response with pagination
 */
export function transformPropertyResponse(apiResponse) {
  if (!apiResponse) return { properties: [], pagination: null };

  // Handle both formats:
  // 1. { data: { properties } } - For paginated responses
  // 2. { data: { items, pagination } } - For search responses
  const data = apiResponse.data || {};
  
  let properties = [];
  let pagination = null;

  if (data.properties) {
    // Format 1: Featured/New listings
    properties = transformProperties(data.properties);
  } else if (data.items) {
    // Format 2: Search results
    properties = transformProperties(data.items);
    pagination = data.pagination;
  } else if (Array.isArray(data)) {
    // Format 3: Direct array
    properties = transformProperties(data);
  }

  return {
    properties,
    pagination
  };
}

/**
 * Format price with currency and purpose
 */
export function formatPrice(price, currency = 'USD', purpose = 'sale') {
  if (!price) return 'Price not available';

  const symbol = getCurrencySymbol(currency);
  const formattedPrice = new Intl.NumberFormat('en-US').format(price);

  // For rent, add "/mo"
  if (purpose === 'rent') {
    return `${symbol}${formattedPrice}/mo`;
  }

  return `${symbol}${formattedPrice}`;
}

/**
 * Get currency symbol
 */
export function getCurrencySymbol(currency) {
  const symbols = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    INR: '₹',
    ZMW: 'K',
  };
  return symbols[currency] || '$';
}

/**
 * Format location
 */
export function formatLocation(location) {
  if (!location) return 'Location not available';

  const parts = [];
  if (location.city) parts.push(location.city);
  if (location.state) parts.push(location.state);

  return parts.length > 0 ? parts.join(', ') : 'Location not available';
}

/**
 * Format area
 */
export function formatArea(squareFeet) {
  if (!squareFeet) return null;
  return `${new Intl.NumberFormat('en-US').format(squareFeet)} sq ft`;
}

/**
 * Get property image URL
 */
export function getPropertyImage(images) {
  if (!images || !images.featured) {
    return 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800';
  }

  // Priority: medium > large > thumbnail > original
  const featured = images.featured;
  return (
    featured.medium?.url ||
    featured.large?.url ||
    featured.thumbnail?.url ||
    featured.original?.url ||
    'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800'
  );
}

/**
 * Get all property images
 */
export function getAllPropertyImages(images) {
  const imageUrls = [];

  if (images?.featured) {
    const url = getPropertyImage(images);
    imageUrls.push(url);
  }

  if (images?.gallery && Array.isArray(images.gallery)) {
    images.gallery.forEach(img => {
      const url = img.medium?.url || img.large?.url || img.original?.url;
      if (url) imageUrls.push(url);
    });
  }

  return imageUrls.length > 0
    ? imageUrls
    : ['https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800'];
}

/**
 * ⭐ FIXED: Format purpose to display tag
 */
export function formatPurpose(purpose) {
  if (!purpose) return 'For Sale'; // Default
  
  const purposeMap = {
    'sale': 'For Sale',
    'rent': 'For Rent',
    'for-sale': 'For Sale',
    'for-rent': 'For Rent',
  };

  return purposeMap[purpose.toLowerCase()] || 'For Sale';
}
