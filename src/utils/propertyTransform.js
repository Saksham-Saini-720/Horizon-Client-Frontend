
export function transformProperty(apiProperty) {
  if (!apiProperty) return null;

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
    stats,          
    createdAt,
    updatedAt
  } = apiProperty;

  const formattedPrice    = formatPrice(price, currency, purpose);
  const formattedLocation = formatLocation(location);
  const formattedArea     = formatArea(details?.squareFeet);
  const imageUrl          = getPropertyImage(images);
  const allImages         = getAllPropertyImages(images);
  const tag               = formatPurpose(purpose);

  const coords = location?.coordinates?.coordinates ?? location?.coordinates;
  const lng = Array.isArray(coords) ? coords[0] : (location?.lng ?? location?.longitude ?? null);
  const lat = Array.isArray(coords) ? coords[1] : (location?.lat ?? location?.latitude  ?? null);

  return {
    id:       _id,
    price:    formattedPrice,
    rawPrice: price,
    title:    title || description || 'Untitled Property',
    location: formattedLocation,
    beds:     details?.bedrooms  ? `${details.bedrooms} Bed${details.bedrooms > 1 ? 's' : ''}`   : null,
    baths:    details?.bathrooms ? `${details.bathrooms} Bath${details.bathrooms > 1 ? 's' : ''}` : null,
    area:     formattedArea,
    img:      imageUrl,
    images:   allImages,
    tag:      tag,
    purpose:  purpose,
    type:     type,
    amenities: amenities || [],
    status:   status,
    viewCount: stats?.views || 0, 
    // lat/lng for map markers
    latitude:  lat,
    longitude: lng,
    owner: owner ? {
      id:     owner._id,
      name:   `${owner.firstName || ''} ${owner.lastName || ''}`.trim() || 'Agent',
      avatar: owner.avatar,
      phone:  owner.phone,
      email:  owner.email,
    } : null,
    createdAt,
    updatedAt,
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
 * Transform API response — handles ALL response shapes
 */
export function transformPropertyResponse(apiResponse) {
  if (!apiResponse) return { properties: [], pagination: null };

  const data = apiResponse.data || apiResponse || {};

  let properties = [];
  let pagination  = null;


  if (Array.isArray(data)) {
    properties = transformProperties(data);

  } else if (Array.isArray(data.properties)) {
    properties = transformProperties(data.properties);
    pagination  = data.pagination ?? null;

  } else if (Array.isArray(data.items)) {
    properties = transformProperties(data.items);
    pagination  = data.pagination ?? null;

  } else if (Array.isArray(data.nearby)) {
    properties = transformProperties(data.nearby);

  } else if (Array.isArray(data.results)) {
    properties = transformProperties(data.results);

  } else if (Array.isArray(data.data)) {
    properties = transformProperties(data.data);

  } 

  return { properties, pagination };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function formatPrice(price, currency = 'ZMW', purpose = 'sale') {
  if (!price) return 'Price not available';
  const symbol         = getCurrencySymbol(currency);
  const formattedPrice = new Intl.NumberFormat('en-US').format(price);
  return purpose === 'rent' ? `${symbol} ${formattedPrice}/mo` : `${symbol} ${formattedPrice}`;
}

export function getCurrencySymbol(currency) {
  const symbols = { USD: '$', EUR: '€', GBP: '£', INR: '₹', ZMW: 'ZMW' };
  return symbols[currency] || 'ZMW';
}

export function formatLocation(location) {
  if (!location) return 'Location not available';
  const parts = [];
  if (location.city)  parts.push(location.city);
  if (location.state) parts.push(location.state);
  return parts.length > 0 ? parts.join(', ') : 'Location not available';
}

export function formatArea(squareFeet) {
  if (!squareFeet) return null;
  return `${new Intl.NumberFormat('en-US').format(squareFeet)} sq ft`;
}

export function getPropertyImage(images) {
  if (!images?.featured) {
    return 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800';
  }
  const f = images.featured;
  return (
    f.medium?.url ||
    f.large?.url  ||
    f.thumbnail?.url ||
    f.original?.url  ||
    'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800'
  );
}

export function getAllPropertyImages(images) {
  const urls = [];
  if (images?.featured) urls.push(getPropertyImage(images));
  if (Array.isArray(images?.gallery)) {
    images.gallery.forEach(img => {
      const url = img.medium?.url || img.large?.url || img.thumbnail?.url || img.original?.url;
      if (url) urls.push(url);
    });
  }
  return urls.length > 0
    ? urls
    : ['https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800'];
}

export function formatPurpose(purpose) {
  if (!purpose) return 'For Sale';
  const map = { sale: 'For Sale', rent: 'For Rent', 'for-sale': 'For Sale', 'for-rent': 'For Rent' };
  return map[purpose.toLowerCase()] || 'For Sale';
}
