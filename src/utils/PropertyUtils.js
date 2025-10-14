/**
 * Utility functions for property data transformation
 * Ensures AI chat property data is compatible with existing listing detail screen
 */

const deepGetImageUrl = (val, depth = 0) => {
  if (!val || depth > 3) return '';
  if (typeof val === 'string') return val;
  if (Array.isArray(val)) return deepGetImageUrl(val[0], depth + 1);
  if (typeof val === 'object') {
    const direct = typeof val.uri === 'string' ? val.uri : (typeof val.url === 'string' ? val.url : '');
    if (direct) return direct;
    const keys = ['image', 'src', 'source', 'main_image'];
    for (let k of keys) {
      if (val[k]) {
        const nested = deepGetImageUrl(val[k], depth + 1);
        if (nested) return nested;
      }
    }
  }
  return '';
};

export const transformAIChatPropertyToListing = (aiProperty) => {
  const rawImg = aiProperty?.main_image ?? aiProperty?.image;
  const imageUrl = deepGetImageUrl(rawImg);
  return {
    id: aiProperty.id,
    ListingKey: aiProperty.listing_key || aiProperty.id,
    ListPrice: aiProperty.price,
    StreetNumber: aiProperty.address?.split(' ')[0] || '',
    StreetName: aiProperty.address?.split(' ').slice(1).join(' ') || aiProperty.address || '',
    StreetSuffix: '',
    StreetSuffixModifier: '',
    PostalCity: aiProperty.city || '',
    StateOrProvince: aiProperty.state || '',
    PostalCode: aiProperty.zip || '',
    BedroomsTotal: aiProperty.bedrooms || 0,
    BathroomsFull: aiProperty.bathrooms_full || 0,
    BathroomsHalf: aiProperty.bathrooms_half || 0,
    LivingArea: aiProperty.living_area || 0,
    LotSizeArea: aiProperty.lot_size || 0,
    LotSizeUnits: aiProperty.lot_size_units || '',
    YearBuilt: aiProperty.year_built || '',
    PublicRemarks: aiProperty.description || '',
    ListOfficeName: aiProperty.listing_office || '',
    MlsStatus: aiProperty.status || 'Active',
    PoolPrivateYN: aiProperty.has_pool ? 'Yes' : 'No',
    GarageYN: aiProperty.has_garage ? 'Yes' : 'No',
    FireplaceYN: aiProperty.has_fireplace ? 'Yes' : 'No',
    WaterfrontYN: aiProperty.is_waterfront ? 'Yes' : 'No',
    NewConstructionYN: aiProperty.is_new_construction ? 'Yes' : 'No',
    photo: imageUrl,
    photos: imageUrl ? [{ MediaURL: imageUrl }] : [],
    region: aiProperty.region || `${aiProperty.city} ${aiProperty.state} ${aiProperty.zip}`.trim(),
    size: aiProperty.living_area ? `${aiProperty.living_area} ft²` : '',
    amenities: aiProperty.amenities || []
  };
};

export const formatPropertyPrice = (price) => {
  if (!price) return 'N/A';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

export const formatPropertyAddress = (property) => {
  const parts = [];
  if (property.StreetNumber) parts.push(property.StreetNumber);
  if (property.StreetName) parts.push(property.StreetName);
  if (property.StreetSuffix) parts.push(property.StreetSuffix);
  if (property.StreetSuffixModifier) parts.push(property.StreetSuffixModifier);
  
  return parts.join(' ') || 'Dirección no disponible';
};

export const getPropertyRegion = (property) => {
  const parts = [];
  if (property.PostalCity) parts.push(property.PostalCity);
  if (property.StateOrProvince) parts.push(property.StateOrProvince);
  if (property.PostalCode) parts.push(property.PostalCode);
  
  return parts.join(' ') || 'Ubicación no disponible';
};
