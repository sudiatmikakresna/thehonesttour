"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, Filter, MapPin, Star, Heart, Share2, MessageCircle, Facebook, Twitter, Instagram, Youtube, Phone, Mail, Globe, User, X, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ToursService, ApiTour, transformApiTourToLocal } from "@/services/tours";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: GoogleConfig) => void;
          prompt: (callback?: (notification: GooglePromptCallback) => void) => void;
          disableAutoSelect: () => void;
        };
      };
    };
  }
}

// Image Carousel Component for Homepage Cards
interface ImageCarouselProps {
  images: string[];
  alt: string;
}

function ImageCarousel({ images, alt }: ImageCarouselProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Auto-slide functionality
  useEffect(() => {
    if (images.length <= 1 || isHovered) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(interval);
  }, [images.length, isHovered]);

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  if (!images || images.length === 0) return null;

  return (
    <div 
      className="relative w-full h-48 overflow-hidden group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Main Image */}
      <Image
        src={images[currentImageIndex]}
        alt={`${alt} - Image ${currentImageIndex + 1}`}
        width={400}
        height={300}
        className="w-full h-full object-cover transition-opacity duration-300"
      />

      {/* Navigation Arrows - Only show if more than 1 image and on hover */}
      {images.length > 1 && (
        <>
          <button
            onClick={prevImage}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          <button
            onClick={nextImage}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
            aria-label="Next image"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </>
      )}

      {/* Dot Indicators - Only show if more than 1 image */}
      {images.length > 1 && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                goToImage(index);
              }}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                index === currentImageIndex
                  ? 'bg-white scale-110'
                  : 'bg-white/50 hover:bg-white/80'
              }`}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Image Counter */}
      {images.length > 1 && (
        <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {currentImageIndex + 1}/{images.length}
        </div>
      )}
    </div>
  );
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
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop",
    category: "Luxury Hotel",
    description: "Experience ultimate luxury at this clifftop resort with stunning ocean views and world-class amenities.",
    amenities: ["Pool", "Spa", "Restaurant", "Beach Access"]
  },
  {
    id: 2,
    name: "Tanah Lot Temple",
    location: "Tabanan, Bali",
    rating: 4.6,
    reviews: 5432,
    price: 15,
    image: "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=400&h=300&fit=crop",
    category: "Temple",
    description: "Ancient Hindu temple perched on a rock formation, famous for its sunset views.",
    amenities: ["Parking", "Gift Shop", "Restaurant", "Photography"]
  },
  {
    id: 3,
    name: "Ubud Monkey Forest Sanctuary",
    location: "Ubud, Bali",
    rating: 4.3,
    reviews: 3921,
    price: 8,
    image: "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=400&h=300&fit=crop",
    category: "Nature Reserve",
    description: "Sacred sanctuary home to hundreds of long-tailed macaques in their natural habitat.",
    amenities: ["Guided Tours", "Walking Trails", "Gift Shop", "Educational Center"]
  }
];

export default function Home() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [parallaxLoaded, setParallaxLoaded] = useState(false);
  const [parallaxOffset, setParallaxOffset] = useState(0);
  
  // API data state
  const [destinations, setDestinations] = useState<any[]>([]);
  const [filteredDestinations, setFilteredDestinations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });

  // Google OAuth configuration
  const googleClientId = "647803137473-nu8tum4gjfg0cd8ankduhtsi53qisvp5.apps.googleusercontent.com";

  // Auth utilities for localStorage
  const saveAuthState = (userData: User) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('honestTourAuth', JSON.stringify({
        user: userData,
        timestamp: Date.now()
      }));
    }
  };

  const loadAuthState = (): User | null => {
    if (typeof window !== 'undefined') {
      try {
        const authData = localStorage.getItem('honestTourAuth');
        if (authData) {
          const parsed = JSON.parse(authData);
          // Optional: Check if auth is still valid (e.g., within 30 days)
          const thirtyDays = 30 * 24 * 60 * 60 * 1000;
          if (Date.now() - parsed.timestamp < thirtyDays) {
            return parsed.user;
          } else {
            // Remove expired auth
            localStorage.removeItem('honestTourAuth');
          }
        }
      } catch (error) {
        console.error('Error loading auth state:', error);
        localStorage.removeItem('honestTourAuth');
      }
    }
    return null;
  };

  const clearAuthState = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('honestTourAuth');
    }
  };

  // Load auth state from localStorage on component mount
  useEffect(() => {
    const savedUser = loadAuthState();
    if (savedUser) {
      setUser(savedUser);
    }
  }, []);

  // Fetch tours data from API
  useEffect(() => {
    const fetchTours = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const apiTours = await ToursService.getAllTours();
        const transformedTours = apiTours.map(transformApiTourToLocal);
        
        setDestinations(transformedTours);
        setFilteredDestinations(transformedTours);
        console.log('✅ Tours loaded from API:', transformedTours.length, 'tours');
      } catch (error) {
        console.error('❌ Failed to fetch tours from API:', error);
        setError('Failed to load tours. Using offline data.');
        
        // Fallback to static data
        setDestinations(fallbackDestinations);
        setFilteredDestinations(fallbackDestinations);
        console.log('⚠️ Using fallback destinations:', fallbackDestinations.length, 'tours');
      } finally {
        setLoading(false);
      }
    };

    fetchTours();
  }, []);

  // Filter logic
  useEffect(() => {
    let filtered = [...destinations];
    
    // Search filter
    if (searchTerm.trim()) {
      filtered = filtered.filter(dest => 
        dest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dest.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dest.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Category filter
    if (selectedCategory && selectedCategory !== 'all') {
      filtered = filtered.filter(dest => dest.category === selectedCategory);
    }
    
    // Location filter
    if (selectedLocation && selectedLocation !== 'all') {
      filtered = filtered.filter(dest => dest.location.includes(selectedLocation));
    }
    
    // Price range filter
    filtered = filtered.filter(dest => 
      dest.price >= priceRange.min && dest.price <= priceRange.max
    );
    
    setFilteredDestinations(filtered);
  }, [destinations, searchTerm, selectedCategory, selectedLocation, priceRange]);

  // Trigger parallax fade-in animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setParallaxLoaded(true);
    }, 300); // Small delay for smooth effect

    return () => clearTimeout(timer);
  }, []);

  // Handle parallax scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.pageYOffset;
      const parallax = scrolled * 0.5; // Adjust speed factor (0.5 = half speed)
      setParallaxOffset(parallax);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Load Google OAuth script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = initializeGoogle;
    script.onerror = () => {
      console.error('Failed to load Google OAuth script');
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
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      const userData = JSON.parse(jsonPayload);
      setUser(userData);
      saveAuthState(userData); // Save to localStorage
      setShowLoginModal(false);
      console.log('User logged in:', userData);
    } catch (error) {
      console.error('Error processing login:', error);
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
        console.error('Failed to initialize Google OAuth:', error);
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
          if (notification.isNotDisplayed?.() || notification.isSkippedMoment?.()) {
            console.log('Google Sign-In prompt not displayed:', notification.getNotDisplayedReason?.());
            // Fallback: Show manual sign-in option
            showManualSignInFallback();
          }
        });
      } else {
        console.error('Google OAuth not loaded');
        showManualSignInFallback();
      }
    } catch (error) {
      console.error('Error with Google Sign-In:', error);
      showManualSignInFallback();
    }
  };

  const showManualSignInFallback = () => {
    alert('Google Sign-In is currently unavailable. This might be due to:\n\n1. Running on localhost (Google OAuth requires HTTPS in production)\n2. Domain not configured in Google Cloud Console\n3. Browser blocking third-party cookies\n\nFor testing purposes, you can use a mock login or configure the domain in Google Cloud Console.');
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
        <div className="w-full h-full" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(0,0,0,0.15) 1px, transparent 0)`,
          backgroundSize: '50px 50px'
        }}></div>
      </div>
      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-white/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/60 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-green-600">TheHonestTour</h1>
            <div className="flex items-center gap-4">
              {user ? (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Image 
                      src={user.picture} 
                      alt={user.name}
                      width={32}
                      height={32}
                      className="w-8 h-8 rounded-full"
                    />
                    <span className="hidden md:inline text-sm font-medium">{user.name}</span>
                  </div>
                  <Button variant="outline" size="sm" onClick={logout} className="text-xs">
                    Logout
                  </Button>
                </div>
              ) : (
                <Button variant="outline" size="sm" className="flex items-center gap-2" onClick={openLoginModal}>
                  <User className="w-4 h-4" />
                  <span className="hidden md:inline">Login</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Parallax Section with Search - Full Width */}
      <div className="relative h-[85vh] min-h-[650px] overflow-hidden">
          {/* Parallax Background */}
          <div 
            className="absolute inset-0 bg-cover bg-center will-change-transform"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3')",
              transform: `translateY(${parallaxOffset}px)`,
              height: '120%', // Make background taller for parallax effect
              top: '-10%' // Offset to prevent white space
            }}
          >
            {/* Animated Fade Overlay */}
            <div className={`absolute inset-0 bg-white transition-opacity duration-1000 ease-out ${
              parallaxLoaded ? 'opacity-0' : 'opacity-100'
            }`}></div>
            {/* Main Overlay */}
            <div className="absolute inset-0 bg-black/50"></div>
          </div>
          
          {/* Content */}
          <div className="relative z-10 h-full flex flex-col justify-center items-center px-4">
            <div className={`text-center text-white max-w-4xl mx-auto space-y-8 transition-all duration-1000 ease-out delay-300 ${
              parallaxLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
            }`}>
              {/* Main Hero Content */}
              <div className={`space-y-6 transition-all duration-1000 ease-out delay-500 ${
                parallaxLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}>
                <h2 className="text-4xl md:text-6xl font-bold leading-tight">
                  Discover the Magic of Bali
                </h2>
                <p className="text-xl md:text-2xl leading-relaxed opacity-90">
                  From ancient temples to pristine beaches, experience Indonesia&apos;s island paradise
                </p>
              </div>

              {/* Search Section */}
              <div className={`space-y-6 max-w-3xl mx-auto transition-all duration-1000 ease-out delay-700 ${
                parallaxLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}>
                <div className="space-y-4">
                  <h3 className="text-2xl md:text-3xl font-bold">Find Your Perfect Adventure</h3>
                  <p className="text-lg opacity-90">Search thousands of destinations and experiences</p>
                </div>
                
                {/* Search Bar */}
                <div className={`flex gap-4 max-w-2xl mx-auto transition-all duration-800 ease-out delay-900 ${
                  parallaxLoaded ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'
                }`}>
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                    <Input 
                      placeholder="Where do you want to go?" 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-white/95 backdrop-blur-md border-white/20 text-gray-900 placeholder:text-gray-600"
                    />
                  </div>
                  <Button size="lg" className="px-8 bg-green-600 hover:bg-green-700 text-white">
                    Search
                  </Button>
                </div>

                {/* Filters */}
                <div className={`flex flex-wrap gap-4 justify-center max-w-4xl mx-auto transition-all duration-800 ease-out delay-1000 ${
                  parallaxLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}>
                  <div className="flex flex-wrap gap-2 items-center">
                    <span className="text-white font-medium">Filters:</span>
                    
                    {/* Category Filter */}
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className="w-[180px] bg-white/10 backdrop-blur-md border-white/30 text-white">
                        <SelectValue placeholder="All Categories" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {Array.from(new Set(destinations.map(d => d.category))).map((category) => (
                          <SelectItem key={category} value={category}>{category}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {/* Location Filter */}
                    <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                      <SelectTrigger className="w-[180px] bg-white/10 backdrop-blur-md border-white/30 text-white">
                        <SelectValue placeholder="All Locations" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Locations</SelectItem>
                        {Array.from(new Set(destinations.map(d => d.location.split(',')[0]))).map((location) => (
                          <SelectItem key={location} value={location}>{location}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {/* Price Range Filter */}
                    <Select 
                      value={`${priceRange.min}-${priceRange.max}`} 
                      onValueChange={(value) => {
                        const [min, max] = value.split('-').map(Number);
                        setPriceRange({ min, max });
                      }}
                    >
                      <SelectTrigger className="w-[180px] bg-white/10 backdrop-blur-md border-white/30 text-white">
                        <SelectValue placeholder="Any Price" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0-1000">Any Price</SelectItem>
                        <SelectItem value="0-50">Under $50</SelectItem>
                        <SelectItem value="50-200">$50 - $200</SelectItem>
                        <SelectItem value="200-500">$200 - $500</SelectItem>
                        <SelectItem value="500-1000">$500+</SelectItem>
                      </SelectContent>
                    </Select>

                    {/* Clear Filters */}
                    {(searchTerm || selectedCategory || selectedLocation || priceRange.min > 0 || priceRange.max < 1000) && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => {
                          setSearchTerm('');
                          setSelectedCategory('');
                          setSelectedLocation('');
                          setPriceRange({ min: 0, max: 1000 });
                        }}
                        className="bg-white/10 backdrop-blur-md border-white/30 text-white hover:bg-white/20"
                      >
                        Clear All
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className={`flex flex-col sm:flex-row gap-4 justify-center pt-4 transition-all duration-800 ease-out delay-1100 ${
                parallaxLoaded ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'
              }`}>
                <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg">
                  Explore Tours
                </Button>
                <Button size="lg" variant="outline" className="border-green-400 text-green-400 hover:bg-green-400 hover:text-white px-8 py-3 text-lg">
                  Watch Video
                </Button>
              </div>
            </div>
          </div>
          
          {/* Floating Elements */}
          <div className={`absolute top-1/4 left-1/4 w-2 h-2 bg-white rounded-full animate-pulse transition-all duration-1500 ease-out delay-1200 ${
            parallaxLoaded ? 'opacity-50 scale-100' : 'opacity-0 scale-0'
          }`}></div>
          <div className={`absolute top-3/4 right-1/3 w-1 h-1 bg-white rounded-full animate-pulse transition-all duration-1500 ease-out delay-1400 ${
            parallaxLoaded ? 'opacity-60 scale-100' : 'opacity-0 scale-0'
          }`}></div>
          <div className={`absolute bottom-1/3 left-1/2 w-1.5 h-1.5 bg-white rounded-full animate-pulse transition-all duration-1500 ease-out delay-1600 ${
            parallaxLoaded ? 'opacity-40 scale-100' : 'opacity-0 scale-0'
          }`}></div>
        </div>

      <main className="container mx-auto px-4 py-8">
        {/* Why Choose The Honest Tour Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why choose The Honest Tour</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Experience travel like never before with our commitment to authenticity, transparency, and unforgettable adventures.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold">Authentic Experiences</h3>
              <p className="text-muted-foreground">
                Discover genuine local experiences with carefully curated destinations that showcase the true essence of each location.
              </p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold">Transparent Reviews</h3>
              <p className="text-muted-foreground">
                Read honest, unbiased reviews from real travelers. No fake reviews, no hidden fees - just genuine insights you can trust.
              </p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold">Local Expertise</h3>
              <p className="text-muted-foreground">
                Benefit from insider knowledge and local connections that help you discover hidden gems and avoid tourist traps.
              </p>
            </div>
          </div>
        </div>

        <Separator className="mb-8" />

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-semibold">Bali, Indonesia</h3>
            <p className="text-muted-foreground">{destinations.length} places found</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">Sort by</Button>
            <Button variant="outline" size="sm">Map view</Button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 text-yellow-800">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
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
                {searchTerm ? `Search results for "${searchTerm}"` : 'Popular Destinations'}
              </h2>
              <p className="text-muted-foreground">
                Showing {filteredDestinations.length} of {destinations.length} destinations
              </p>
            </div>
          </div>
        )}

        {/* Listings Grid */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDestinations.map((destination) => (
            <Card key={destination.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <ImageCarousel 
                  images={destination.images || [destination.image]} 
                  alt={destination.name}
                />
                <div className="absolute top-3 right-3 flex gap-2">
                  <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full bg-white/80 hover:bg-white">
                    <Heart className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full bg-white/80 hover:bg-white">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
                <Badge className="absolute top-3 left-3 bg-green-600 hover:bg-green-700">
                  {destination.category}
                </Badge>
              </div>
              
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg leading-tight">{destination.name}</CardTitle>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4 mr-1" />
                      {destination.location}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">{destination.rating}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">({destination.reviews.toLocaleString()})</p>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <CardDescription className="mb-4">
                  {destination.description}
                </CardDescription>
                
                <div className="flex flex-wrap gap-1 mb-4">
                  {destination.amenities.slice(0, 3).map((amenity) => (
                    <Badge key={amenity} variant="secondary" className="text-xs">
                      {amenity}
                    </Badge>
                  ))}
                  {destination.amenities.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{destination.amenities.length - 3} more
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-baseline gap-1">
                    {destination.price === 0 ? (
                      <span className="text-lg font-bold text-green-600">Free</span>
                    ) : (
                      <>
                        <span className="text-lg font-bold">${destination.price}</span>
                        <span className="text-sm text-muted-foreground">
                          {destination.category.includes('Hotel') || destination.category.includes('Resort') 
                            ? 'per night' 
                            : 'per person'
                          }
                        </span>
                      </>
                    )}
                  </div>
                  <Link href={`/destination/${destination.documentId || destination.id}`}>
                    <Button>View Details</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
            ))}
          </div>
        )}

        {/* No Results Message */}
        {!loading && filteredDestinations.length === 0 && (
          <div className="text-center py-12">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">No destinations found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search terms or filters to find what you&apos;re looking for.
              </p>
              <Button 
                variant="outline"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('');
                  setSelectedLocation('');
                  setPriceRange({ min: 0, max: 1000 });
                }}
              >
                Clear All Filters
              </Button>
            </div>
          </div>
        )}

        {/* Load More (only show if we have results) */}
        {!loading && filteredDestinations.length > 0 && filteredDestinations.length === destinations.length && (
          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              Load More Results
            </Button>
          </div>
        )}
      </main>

      {/* Floating WhatsApp Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <a
          href="https://wa.me/6281234567890?text=Hi! I'm looking for travel recommendations. Can you help me?"
          target="_blank"
          rel="noopener noreferrer"
          className="group"
        >
          <Button
            size="lg"
            className="rounded-full w-14 h-14 bg-green-500 hover:bg-green-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
          >
            <MessageCircle className="w-6 h-6" />
          </Button>
        </a>
        
        {/* Tooltip */}
        <div className="absolute bottom-16 right-0 mb-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
          Chat with us on WhatsApp
          <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-green-400">TheHonestTour</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Discover amazing destinations around the world with our curated travel experiences. 
                Your journey to unforgettable memories starts here.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">
                  <Youtube className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/" className="text-gray-300 hover:text-green-400 transition-colors text-sm">
                    Home
                  </Link>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-green-400 transition-colors text-sm">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-green-400 transition-colors text-sm">
                    Destinations
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-green-400 transition-colors text-sm">
                    Tours & Packages
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-green-400 transition-colors text-sm">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            {/* Services */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Services</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-300 hover:text-green-400 transition-colors text-sm">
                    Hotel Booking
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-green-400 transition-colors text-sm">
                    Flight Reservations
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-green-400 transition-colors text-sm">
                    Tour Packages
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-green-400 transition-colors text-sm">
                    Travel Insurance
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-green-400 transition-colors text-sm">
                    24/7 Support
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Contact Info</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <MapPin className="w-4 h-4 text-green-400 flex-shrink-0" />
                  <span className="text-gray-300 text-sm">
                    123 Travel Street, Adventure City, AC 12345
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-4 h-4 text-green-400 flex-shrink-0" />
                  <span className="text-gray-300 text-sm">+62 819-3437-4633</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-4 h-4 text-green-400 flex-shrink-0" />
                  <span className="text-gray-300 text-sm">info@thehonesttour.com</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Globe className="w-4 h-4 text-green-400 flex-shrink-0" />
                  <span className="text-gray-300 text-sm">www.thehonesttour.com</span>
                </div>
              </div>
            </div>
          </div>

          {/* Newsletter Signup */}
          <div className="mt-12 pt-8 border-t border-gray-800">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-left">
                <h4 className="text-lg font-semibold mb-2">Stay Updated</h4>
                <p className="text-gray-300 text-sm">
                  Subscribe to our newsletter for the latest travel deals and destinations.
                </p>
              </div>
              <div className="flex w-full md:w-auto gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 md:w-64 px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-green-400 focus:outline-none"
                />
                <Button className="bg-green-600 hover:bg-green-700 px-6">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-8 pt-6 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-400 text-sm">
              © 2024 TheHonestTour. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm">
              <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative animate-in fade-in-0 zoom-in-95 duration-200">
            {/* Close Button */}
            <button
              onClick={closeLoginModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Content */}
            <div className="text-center space-y-6">
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
                <p className="text-gray-600">Sign in to access your account and continue your journey</p>
              </div>

              {/* Google Sign In Button */}
              <div className="space-y-4">
                <div 
                  id="google-signin-button"
                  className="flex items-center justify-center"
                >
                  <button
                    onClick={handleGoogleSignIn}
                    className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 group"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    <span className="font-medium text-gray-700 group-hover:text-gray-900">Continue with Google</span>
                  </button>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">For development testing</span>
                  </div>
                </div>

                {/* Mock Login for Development */}
                <div className="space-y-4">
                  <Button 
                    onClick={() => {
                      // Mock user data for development
                      const mockUser = {
                        name: 'John Doe',
                        email: 'john.doe@example.com',
                        picture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
                      };
                      setUser(mockUser);
                      saveAuthState(mockUser); // Save to localStorage
                      setShowLoginModal(false);
                    }}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    Mock Login (Development)
                  </Button>
                  
                  <div className="text-xs text-gray-500 text-center">
                    This creates a test user session for development purposes
                  </div>
                </div>

                <div className="text-center text-sm text-gray-500">
                  Don&apos;t have an account? <a href="#" className="text-green-600 hover:text-green-700 font-medium">Sign up</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
