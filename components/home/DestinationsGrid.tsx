import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DestinationCard } from "./DestinationCard";
import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

interface DestinationsGridProps {
  destinations: any[];
  filteredDestinations: any[];
  loading: boolean;
  error: string | null;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  setSelectedCategory: (category: string) => void;
  setSelectedLocation: (location: string) => void;
  setPriceRange: (range: { min: number; max: number }) => void;
  onSortChange?: (sortBy: 'none' | 'price-asc' | 'price-desc') => void;
}

export function DestinationsGrid({
  destinations,
  filteredDestinations,
  loading,
  error,
  searchTerm,
  setSearchTerm,
  setSelectedCategory,
  setSelectedLocation,
  setPriceRange,
  onSortChange,
}: DestinationsGridProps) {
  const [displayCount, setDisplayCount] = useState(6);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [sortBy, setSortBy] = useState<'none' | 'price-asc' | 'price-desc'>('none');
  const sortButtonRef = useRef<HTMLButtonElement>(null);

  const clearAllFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setSelectedLocation("");
    setPriceRange({ min: 0, max: 1000 });
    setDisplayCount(6);
  };

  const loadMore = () => {
    setDisplayCount(prev => prev + 3);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sortButtonRef.current && !sortButtonRef.current.contains(event.target as Node)) {
        setShowSortDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Use filteredDestinations directly since sorting is now handled by parent
  const displayedDestinations = filteredDestinations.slice(0, displayCount);

  const handleSortSelect = (sortOption: 'none' | 'price-asc' | 'price-desc') => {
    setSortBy(sortOption);
    setShowSortDropdown(false);
    // Notify parent component about sort change
    if (onSortChange) {
      onSortChange(sortOption);
    }
  };

  return (
    <>
      {/* Results Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold">Bali, Indonesia</h3>
          <p className="text-muted-foreground">
            {destinations.length} places found
          </p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Button
              ref={sortButtonRef}
              variant="outline"
              size="sm"
              onClick={() => setShowSortDropdown(!showSortDropdown)}
              className="flex items-center gap-1"
            >
              Sort by
              <ChevronDown className="w-4 h-4" />
            </Button>

            {/* Sort Dropdown */}
            {showSortDropdown && (
              <div className="absolute top-full mt-1 right-0 bg-white border border-gray-200 rounded-md shadow-lg z-10 min-w-[160px]">
                <div className="py-1">
                  <button
                    onClick={() => handleSortSelect('none')}
                    className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 ${
                      sortBy === 'none' ? 'bg-gray-50 font-medium' : ''
                    }`}
                  >
                    Default
                  </button>
                  <button
                    onClick={() => handleSortSelect('price-asc')}
                    className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 ${
                      sortBy === 'price-asc' ? 'bg-gray-50 font-medium' : ''
                    }`}
                  >
                    Price: Low to High
                  </button>
                  <button
                    onClick={() => handleSortSelect('price-desc')}
                    className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 ${
                      sortBy === 'price-desc' ? 'bg-gray-50 font-medium' : ''
                    }`}
                  >
                    Price: High to Low
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2 text-yellow-800">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <span className="font-medium">{error}</span>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="overflow-hidden">
              <div className="animate-pulse">
                <div className="w-full h-48 bg-gray-300"></div>
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-300 rounded w-full"></div>
                  <div className="flex justify-between items-center">
                    <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                    <div className="h-8 bg-gray-300 rounded w-1/3"></div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Results Summary */}
      {!loading && (
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold">
              {searchTerm
                ? `Search results for "${searchTerm}"`
                : "Popular Destinations"}
            </h2>
            <p className="text-muted-foreground">
              Showing {displayedDestinations.length} of {filteredDestinations.length}{" "}
              destinations
            </p>
          </div>
        </div>
      )}

      {/* Listings Grid */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedDestinations.map((destination) => (
            <DestinationCard key={destination.id} destination={destination} />
          ))}
        </div>
      )}

      {/* No Results Message */}
      {!loading && displayedDestinations.length === 0 && (
        <div className="text-center py-12">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">No destinations found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search terms or filters to find what
              you&apos;re looking for.
            </p>
            <Button variant="outline" onClick={clearAllFilters}>
              Clear All Filters
            </Button>
          </div>
        </div>
      )}

      {/* Load More (only show if we have results) */}
      {!loading &&
        displayedDestinations.length > 0 &&
        displayCount < filteredDestinations.length && (
          <div className="text-center mt-12">
            <Button variant="outline" size="lg" onClick={loadMore}>
              Load More Results
            </Button>
          </div>
        )}
    </>
  );
}
