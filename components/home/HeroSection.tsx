"use client";

import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface HeroSectionProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export function HeroSection({
  searchTerm,
  setSearchTerm,
}: HeroSectionProps) {
  const [parallaxLoaded, setParallaxLoaded] = useState(false);
  const [parallaxOffset, setParallaxOffset] = useState(0);

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

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative h-[85vh] min-h-[650px] overflow-hidden">
      {/* Parallax Background */}
      <div
        className="absolute inset-0 bg-cover bg-center will-change-transform"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3')",
          transform: `translateY(${parallaxOffset}px)`,
          height: "120%", // Make background taller for parallax effect
          top: "-10%", // Offset to prevent white space
        }}
      >
        {/* Animated Fade Overlay */}
        <div
          className={`absolute inset-0 bg-white transition-opacity duration-1000 ease-out ${
            parallaxLoaded ? "opacity-0" : "opacity-100"
          }`}
        ></div>
        {/* Main Overlay */}
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-center items-center px-4">
        <div
          className={`text-center text-white max-w-4xl mx-auto space-y-8 transition-all duration-1000 ease-out delay-300 ${
            parallaxLoaded
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-12"
          }`}
        >
          {/* Main Hero Content */}
          <div
            className={`space-y-6 transition-all duration-1000 ease-out delay-500 ${
              parallaxLoaded
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            <h2 className="text-4xl md:text-6xl font-bold leading-tight">
              Discover the Magic of Bali
            </h2>
            <p className="text-xl md:text-2xl leading-relaxed opacity-90">
              From ancient temples to pristine beaches, experience
              Indonesia&apos;s island paradise
            </p>
          </div>

          {/* Search Section */}
          <div
            className={`space-y-6 max-w-3xl mx-auto transition-all duration-1000 ease-out delay-700 ${
              parallaxLoaded
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            <div className="space-y-4">
              <h3 className="text-2xl md:text-3xl font-bold">
                Find Your Perfect Adventure
              </h3>
              <p className="text-lg opacity-90">
                Search thousands of destinations and experiences
              </p>
            </div>

            {/* Search Bar */}
            <div
              className={`flex gap-4 max-w-2xl mx-auto transition-all duration-800 ease-out delay-900 ${
                parallaxLoaded
                  ? "opacity-100 translate-y-0 scale-100"
                  : "opacity-0 translate-y-4 scale-95"
              }`}
            >
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Where do you want to go?"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/95 backdrop-blur-md border-white/20 text-gray-900 placeholder:text-gray-600"
                />
              </div>
              <Button
                size="lg"
                className="px-8 bg-green-600 hover:bg-green-700 text-white"
              >
                Search
              </Button>
            </div>

          </div>

          {/* Action Buttons */}
          <div
            className={`flex flex-col sm:flex-row gap-4 justify-center pt-4 transition-all duration-800 ease-out delay-1100 ${
              parallaxLoaded
                ? "opacity-100 translate-y-0 scale-100"
                : "opacity-0 translate-y-4 scale-95"
            }`}
          >
            <Button
              size="lg"
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg"
            >
              Explore Tours
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-green-400 text-green-400 hover:bg-green-400 hover:text-white px-8 py-3 text-lg"
            >
              Watch Video
            </Button>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div
        className={`absolute top-1/4 left-1/4 w-2 h-2 bg-white rounded-full animate-pulse transition-all duration-1500 ease-out delay-1200 ${
          parallaxLoaded ? "opacity-50 scale-100" : "opacity-0 scale-0"
        }`}
      ></div>
      <div
        className={`absolute top-3/4 right-1/3 w-1 h-1 bg-white rounded-full animate-pulse transition-all duration-1500 ease-out delay-1400 ${
          parallaxLoaded ? "opacity-60 scale-100" : "opacity-0 scale-0"
        }`}
      ></div>
      <div
        className={`absolute bottom-1/3 left-1/2 w-1.5 h-1.5 bg-white rounded-full animate-pulse transition-all duration-1500 ease-out delay-1600 ${
          parallaxLoaded ? "opacity-40 scale-100" : "opacity-0 scale-0"
        }`}
      ></div>
    </div>
  );
}
