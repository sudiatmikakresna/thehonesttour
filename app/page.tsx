"use client";

import { useState, useEffect, useCallback } from "react";
import { Separator } from "@/components/ui/separator";
import {
  ToursService,
  ApiTour,
  transformApiTourToLocal,
} from "@/services/tours";
import { Header } from "@/components/home/Header";
import { HeroSection } from "@/components/home/HeroSection";
import { DestinationsGrid } from "@/components/home/DestinationsGrid";
import { LoginModal } from "@/components/home/LoginModal";
import { WhatsAppButton } from "@/components/home/WhatsAppButton";
import { Footer } from "@/components/home/Footer";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: GoogleConfig) => void;
          prompt: (
            callback?: (notification: GooglePromptCallback) => void
          ) => void;
          disableAutoSelect: () => void;
        };
      };
    };
  }
}

interface GoogleLoginResponse {
  credential: string;
  select_by: string;
}

interface GoogleConfig {
  client_id: string;
  callback: (response: GoogleLoginResponse) => void;
  auto_select?: boolean;
  cancel_on_tap_outside?: boolean;
}

interface GooglePromptCallback {
  isNotDisplayed?: () => boolean;
  isSkippedMoment?: () => boolean;
  getNotDisplayedReason?: () => string;
}

interface User {
  name: string;
  email: string;
  picture: string;
}

// Fallback destinations (used when API fails)
const fallbackDestinations = [
  {
    id: 1,
    name: "The Ritz-Carlton, Bali",
    location: "Nusa Dua, Bali",
    rating: 4.8,
    reviews: 2847,
    price: 450,
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop",
    category: "Luxury Hotel",
    description:
      "Experience ultimate luxury at this clifftop resort with stunning ocean views and world-class amenities.",
    amenities: ["Pool", "Spa", "Restaurant", "Beach Access"],
  },
  {
    id: 2,
    name: "Tanah Lot Temple",
    location: "Tabanan, Bali",
    rating: 4.6,
    reviews: 5432,
    price: 15,
    image:
      "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=400&h=300&fit=crop",
    category: "Temple",
    description:
      "Ancient Hindu temple perched on a rock formation, famous for its sunset views.",
    amenities: ["Parking", "Gift Shop", "Restaurant", "Photography"],
  },
  {
    id: 3,
    name: "Ubud Monkey Forest Sanctuary",
    location: "Ubud, Bali",
    rating: 4.3,
    reviews: 3921,
    price: 8,
    image:
      "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=400&h=300&fit=crop",
    category: "Nature Reserve",
    description:
      "Sacred sanctuary home to hundreds of long-tailed macaques in their natural habitat.",
    amenities: [
      "Guided Tours",
      "Walking Trails",
      "Gift Shop",
      "Educational Center",
    ],
  },
];

export default function Home() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  // API data state
  const [destinations, setDestinations] = useState<any[]>([]);
  const [filteredDestinations, setFilteredDestinations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [sortBy, setSortBy] = useState<'none' | 'price-asc' | 'price-desc'>('none');

  // Google OAuth configuration
  const googleClientId =
    "647803137473-nu8tum4gjfg0cd8ankduhtsi53qisvp5.apps.googleusercontent.com";

  // Auth utilities for localStorage
  const saveAuthState = (userData: User) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(
        "honestTourAuth",
        JSON.stringify({
          user: userData,
          timestamp: Date.now(),
        })
      );
    }
  };

  const loadAuthState = (): User | null => {
    if (typeof window !== "undefined") {
      try {
        const authData = localStorage.getItem("honestTourAuth");
        if (authData) {
          const parsed = JSON.parse(authData);
          // Optional: Check if auth is still valid (e.g., within 30 days)
          const thirtyDays = 30 * 24 * 60 * 60 * 1000;
          if (Date.now() - parsed.timestamp < thirtyDays) {
            return parsed.user;
          } else {
            // Remove expired auth
            localStorage.removeItem("honestTourAuth");
          }
        }
      } catch (error) {
        console.error("Error loading auth state:", error);
        localStorage.removeItem("honestTourAuth");
      }
    }
    return null;
  };

  const clearAuthState = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("honestTourAuth");
    }
  };

  // Load auth state from localStorage on component mount
  useEffect(() => {
    const savedUser = loadAuthState();
    if (savedUser) {
      setUser(savedUser);
    }
  }, []);

  // Fetch tours data from API with sorting
  const fetchTours = async (sortOption?: 'none' | 'price-asc' | 'price-desc') => {
    try {
      setLoading(true);
      setError(null);

      // Convert UI sort option to Strapi format
      let strapiSort: 'price:asc' | 'price:desc' | null = null;
      if (sortOption === 'price-asc') {
        strapiSort = 'price:asc';
      } else if (sortOption === 'price-desc') {
        strapiSort = 'price:desc';
      }

      const apiTours = await ToursService.getAllTours(strapiSort);
      const transformedTours = apiTours.map(transformApiTourToLocal);

      setDestinations(transformedTours);
      setFilteredDestinations(transformedTours);
      console.log(
        "✅ Tours loaded from API:",
        transformedTours.length,
        "tours",
        sortOption ? `sorted by ${sortOption}` : ""
      );
    } catch (error) {
      console.error("❌ Failed to fetch tours from API:", error);
      setError("Failed to load tours. Using offline data.");

      // Fallback to static data
      setDestinations(fallbackDestinations);
      setFilteredDestinations(fallbackDestinations);
      console.log(
        "⚠️ Using fallback destinations:",
        fallbackDestinations.length,
        "tours"
      );
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchTours();
  }, []);

  // Filter logic (sorting is now handled by API)
  useEffect(() => {
    let filtered = [...destinations];

    // Search filter
    if (searchTerm.trim()) {
      filtered = filtered.filter(
        (dest) =>
          dest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          dest.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
          dest.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory && selectedCategory !== "all") {
      filtered = filtered.filter((dest) => dest.category === selectedCategory);
    }

    // Location filter
    if (selectedLocation && selectedLocation !== "all") {
      filtered = filtered.filter((dest) =>
        dest.location.includes(selectedLocation)
      );
    }

    // Price range filter
    filtered = filtered.filter(
      (dest) => dest.price >= priceRange.min && dest.price <= priceRange.max
    );

    setFilteredDestinations(filtered);
  }, [
    destinations,
    searchTerm,
    selectedCategory,
    selectedLocation,
    priceRange,
  ]);

  // Handle sort change from DestinationsGrid - refetch data with sorting
  const handleSortChange = (newSortBy: 'none' | 'price-asc' | 'price-desc') => {
    setSortBy(newSortBy);
    fetchTours(newSortBy); // Refetch with new sorting
  };

  useEffect(() => {
    // Load Google OAuth script
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = initializeGoogle;
    script.onerror = () => {
      console.error("Failed to load Google OAuth script");
    };
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  const handleGoogleLogin = useCallback((response: GoogleLoginResponse) => {
    try {
      // Decode the JWT token to get user info
      const token = response.credential;
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map(function (c) {
            return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join("")
      );

      const userData = JSON.parse(jsonPayload);
      setUser(userData);
      saveAuthState(userData); // Save to localStorage
      setShowLoginModal(false);
      console.log("User logged in:", userData);
    } catch (error) {
      console.error("Error processing login:", error);
    }
  }, []);

  const initializeGoogle = useCallback(() => {
    if (window.google?.accounts?.id) {
      try {
        window.google.accounts.id.initialize({
          client_id: googleClientId,
          callback: handleGoogleLogin,
          auto_select: false,
          cancel_on_tap_outside: true,
        });
      } catch (error) {
        console.error("Failed to initialize Google OAuth:", error);
      }
    }
  }, [googleClientId, handleGoogleLogin]);

  const openLoginModal = () => {
    setShowLoginModal(true);
  };

  const closeLoginModal = () => {
    setShowLoginModal(false);
  };

  const handleGoogleSignIn = () => {
    try {
      if (window.google?.accounts?.id) {
        // Try to use the prompt method
        window.google.accounts.id.prompt((notification) => {
          if (
            notification.isNotDisplayed?.() ||
            notification.isSkippedMoment?.()
          ) {
            console.log(
              "Google Sign-In prompt not displayed:",
              notification.getNotDisplayedReason?.()
            );
            // Fallback: Show manual sign-in option
            showManualSignInFallback();
          }
        });
      } else {
        console.error("Google OAuth not loaded");
        showManualSignInFallback();
      }
    } catch (error) {
      console.error("Error with Google Sign-In:", error);
      showManualSignInFallback();
    }
  };

  const showManualSignInFallback = () => {
    alert(
      "Google Sign-In is currently unavailable. This might be due to:\n\n1. Running on localhost (Google OAuth requires HTTPS in production)\n2. Domain not configured in Google Cloud Console\n3. Browser blocking third-party cookies\n\nFor testing purposes, you can use a mock login or configure the domain in Google Cloud Console."
    );
  };

  const logout = () => {
    setUser(null);
    clearAuthState(); // Clear from localStorage
    if (window.google?.accounts?.id) {
      window.google.accounts.id.disableAutoSelect();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 relative overflow-hidden">
      {/* Abstract Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-200/30 to-purple-200/30 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 -left-20 w-60 h-60 bg-gradient-to-br from-green-200/30 to-blue-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-1/4 w-40 h-40 bg-gradient-to-br from-yellow-200/30 to-orange-200/30 rounded-full blur-2xl"></div>
        <div className="absolute bottom-40 left-1/3 w-32 h-32 bg-gradient-to-br from-pink-200/30 to-purple-200/30 rounded-full blur-2xl"></div>
      </div>

      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(0,0,0,0.15) 1px, transparent 0)`,
            backgroundSize: "50px 50px",
          }}
        ></div>
      </div>

      {/* Header */}
      <Header user={user} openLoginModal={openLoginModal} logout={logout} />

      {/* Hero Section */}
      <HeroSection
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      <main className="container mx-auto px-4 py-8">

        {/* Destinations Grid */}
        <DestinationsGrid
          destinations={destinations}
          filteredDestinations={filteredDestinations}
          loading={loading}
          error={error}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          setSelectedCategory={setSelectedCategory}
          setSelectedLocation={setSelectedLocation}
          setPriceRange={setPriceRange}
          onSortChange={handleSortChange}
        />
      </main>

      {/* Floating WhatsApp Button */}
      <WhatsAppButton />

      {/* Footer */}
      <Footer />

      {/* Login Modal */}
      <LoginModal
        showLoginModal={showLoginModal}
        closeLoginModal={closeLoginModal}
        handleGoogleSignIn={handleGoogleSignIn}
        setUser={setUser}
        saveAuthState={saveAuthState}
        setShowLoginModal={setShowLoginModal}
      />
    </div>
  );
}
