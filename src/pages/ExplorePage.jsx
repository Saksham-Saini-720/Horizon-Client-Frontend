// src/pages/ExplorePage.jsx
import { useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import useRecentSearches from "../hooks/searches/useRecentSearches";
import useSearchSubmit from "../hooks/utils/useDebounceSearch";
import { useFeaturedPropertiesFiltered, useNewListingsFiltered } from "../hooks/properties/usePropertiesWithFilters";
import EmptyState from "../components/states/EmptyState";
import ErrorState from "../components/states/ErrorState";
import ExploreHeader from "../components/explore/ExploreHeader";
import FeaturedCard from "../components/explore/FeaturedCard";
import NewListingCard from "../components/explore/NewListingCard";
import SectionHeader from "../components/explore/SectionHeader";
import { FeaturedCardSkeleton, NewListingCardSkeleton } from "../components/ui/SkeletonCards";

// Filter Modals
import PriceFilterModal from "../components/explore/filters/PriceFilterModal";
import BedroomsFilterModal from "../components/explore/filters/BedroomsFilterModal";
import FullFiltersModal from "../components/explore/filters/FullFiltersModal";

const ExplorePage = () => {
  const navigate = useNavigate();
  
  // Filter state
  const [filters, setFilters] = useState({
    purpose: null, // 'sale' or 'rent'
    minPrice: undefined,
    maxPrice: undefined,
    bedrooms: undefined,
    bathrooms: undefined,
    type: undefined,
    amenities: undefined,
  });

  // Modal states
  const [activeModal, setActiveModal] = useState(null); // 'price', 'bedrooms', 'filters'

  const recent = useRecentSearches();
  const { submitSearch } = useSearchSubmit({ onSearch: recent.add });

  // Build filter object for API
  const apiFilters = useMemo(() => {
    const cleanFilters = {};
    if (filters.purpose) cleanFilters.purpose = filters.purpose;
    if (filters.minPrice) cleanFilters.minPrice = filters.minPrice;
    if (filters.maxPrice) cleanFilters.maxPrice = filters.maxPrice;
    if (filters.bedrooms) cleanFilters.bedrooms = filters.bedrooms;
    if (filters.bathrooms) cleanFilters.bathrooms = filters.bathrooms;
    if (filters.type) cleanFilters.type = filters.type;
    if (filters.amenities && filters.amenities.length > 0) {
      cleanFilters.amenities = filters.amenities;
    }
    return cleanFilters;
  }, [filters]);

  // Fetch data with filters
  const featuredQuery = useFeaturedPropertiesFiltered(apiFilters);
  const newListingsQuery = useNewListingsFiltered(apiFilters);
  // console.log("Applied Filters:", newListingsQuery);

  // Filter chip handlers
  const handleFilterToggle = useCallback((id) => {
    if (id === 'buy') {
      setFilters(prev => ({
        ...prev,
        purpose: prev.purpose === 'sale' ? null : 'sale'
      }));
    } else if (id === 'rent') {
      setFilters(prev => ({
        ...prev,
        purpose: prev.purpose === 'rent' ? null : 'rent'
      }));
    } else if (id === 'price') {
      setActiveModal('price');
    } else if (id === 'bedrooms') {
      setActiveModal('bedrooms');
    } else if (id === 'nearme') {
      // Navigate to map page with GPS
      navigate('/map?nearme=true');
    } else if (id === 'filters') {
      setActiveModal('filters');
    }
  }, [navigate]);

  // Get active filter for chips
  const activeFilter = useMemo(() => {
    if (filters.purpose === 'sale') return 'buy';
    if (filters.purpose === 'rent') return 'rent';
    return null;
  }, [filters.purpose]);

  // Apply filter handlers
  const handlePriceApply = useCallback((priceFilters) => {
    setFilters(prev => ({
      ...prev,
      minPrice: priceFilters.minPrice,
      maxPrice: priceFilters.maxPrice,
    }));
  }, []);

  const handleBedroomsApply = useCallback((bedroomsFilter) => {
    setFilters(prev => ({
      ...prev,
      bedrooms: bedroomsFilter.bedrooms,
    }));
  }, []);

  const handleFullFiltersApply = useCallback((allFilters) => {
    setFilters(prev => ({
      ...prev,
      ...allFilters,
    }));
  }, []);

  const isFeaturedLoading = featuredQuery.isLoading || featuredQuery.isFetching;
  const isListingsLoading = newListingsQuery.isLoading || newListingsQuery.isFetching;

  return (
    <div className="min-h-screen bg-[#F7F6F2]">
      
      <ExploreHeader
        onSubmitSearch={submitSearch}
        recentSearches={recent.searches}
        onRemoveRecent={recent.remove}
        onClearAllRecent={recent.clearAll}
        activeFilter={activeFilter}
        onFilterToggle={handleFilterToggle}
        filtersDimmed={isFeaturedLoading || isListingsLoading}
      />

      <div className="pb-28">
        
        {/* Featured Section */}
        <div className="mt-4 mb-6">
          <SectionHeader
            title="Featured"
            onSeeAll={() => navigate("/search?featured=true")}
          />

          <div className="flex gap-3 px-4 overflow-x-auto scrollbar-hide">
            {isFeaturedLoading ? (
              Array(4).fill(0).map((_, i) => <FeaturedCardSkeleton key={i} />)
            ) : featuredQuery.isError ? (
              <div className="w-full">
                <ErrorState
                  title="Failed to load featured properties"
                  message={featuredQuery.error?.message}
                  onRetry={() => featuredQuery.refetch()}
                />
              </div>
            ) : featuredQuery.data && featuredQuery.data.length > 0 ? (
              featuredQuery.data.map((p) => (
                <FeaturedCard
                  key={p.id}
                  {...p}
                  onClick={() => navigate(`/property/${p.id}`)}
                />
              ))
            ) : (
              <EmptyState
                icon="home"
                title="No featured properties"
                message="Try adjusting your filters"
              />
            )}
          </div>
        </div>

        {/* New Listings Section */}
        <div>
          <SectionHeader
            title="New Listings"
            onSeeAll={() => navigate("/search?new=true")}
          />

          <div className="px-4 flex flex-col gap-4">
            {isListingsLoading ? (
              Array(3).fill(0).map((_, i) => <NewListingCardSkeleton key={i} />)
            ) : newListingsQuery.isError ? (
              <ErrorState
                title="Failed to load new listings"
                message={newListingsQuery.error?.message}
                onRetry={() => newListingsQuery.refetch()}
              />
            ) : newListingsQuery.data && newListingsQuery.data.length > 0 ? (
              newListingsQuery.data.map((p) => (
                <NewListingCard
                  key={p.id}
                  {...p}
                  onClick={() => navigate(`/property/${p.id}`)}
                />
              ))
            ) : (
              <EmptyState
                icon="home"
                title="No new listings"
                message="Try adjusting your filters"
              />
            )}
          </div>
        </div>

      </div>

      {/* Filter Modals */}
      <PriceFilterModal
        isOpen={activeModal === 'price'}
        onClose={() => setActiveModal(null)}
        onApply={handlePriceApply}
        currentFilters={filters}
      />

      <BedroomsFilterModal
        isOpen={activeModal === 'bedrooms'}
        onClose={() => setActiveModal(null)}
        onApply={handleBedroomsApply}
        currentFilters={filters}
      />

      <FullFiltersModal
        isOpen={activeModal === 'filters'}
        onClose={() => setActiveModal(null)}
        onApply={handleFullFiltersApply}
        currentFilters={filters}
      />
    </div>
  );
};

export default ExplorePage;
