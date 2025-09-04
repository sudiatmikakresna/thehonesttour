"use client";

import Image from "next/image";
import Link from "next/link";
import { Search, Filter, MapPin, Star, Heart, Share2, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const destinations = [
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
    image: "https://images.unsplash.com/photo-1582662167791-74d9b17e7210?w=400&h=300&fit=crop",
    category: "Nature Reserve",
    description: "Sacred sanctuary home to hundreds of long-tailed macaques in their natural habitat.",
    amenities: ["Guided Tours", "Walking Trails", "Gift Shop", "Educational Center"]
  },
  {
    id: 4,
    name: "Kuta Beach",
    location: "Kuta, Bali",
    rating: 4.2,
    reviews: 8765,
    price: 0,
    image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop",
    category: "Beach",
    description: "Popular beach destination known for surfing, golden sand, and vibrant nightlife.",
    amenities: ["Surfing", "Beach Clubs", "Restaurants", "Shopping"]
  },
  {
    id: 5,
    name: "Tegallalang Rice Terraces",
    location: "Ubud, Bali",
    rating: 4.7,
    reviews: 2156,
    price: 10,
    image: "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=400&h=300&fit=crop",
    category: "Cultural Site",
    description: "Spectacular terraced rice fields offering breathtaking views and traditional Balinese agriculture.",
    amenities: ["Photography", "Cafe", "Swing", "Walking Trails"]
  },
  {
    id: 6,
    name: "Four Seasons Resort Bali at Sayan",
    location: "Ubud, Bali",
    rating: 4.9,
    reviews: 1432,
    price: 650,
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=300&fit=crop",
    category: "Luxury Resort",
    description: "Jungle luxury resort surrounded by tropical rainforest with award-winning spa.",
    amenities: ["Spa", "Infinity Pool", "Yoga", "Fine Dining"]
  }
];

export default function Home() {
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
            <h1 className="text-2xl font-bold text-green-600">TravelGuide</h1>
            <nav className="hidden md:flex space-x-6">
              <a href="#" className="text-foreground/60 hover:text-foreground">Hotels</a>
              <a href="#" className="text-foreground/60 hover:text-foreground">Restaurants</a>
              <a href="#" className="text-foreground/60 hover:text-foreground">Things to do</a>
              <a href="#" className="text-foreground/60 hover:text-foreground">Flights</a>
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Search Section */}
        <div className="mb-8 space-y-6">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold">Discover Amazing Places</h2>
            <p className="text-muted-foreground text-lg">Find the perfect destination for your next adventure</p>
          </div>
          
          <div className="flex gap-4 max-w-2xl mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Where do you want to go?" 
                className="pl-10"
              />
            </div>
            <Button size="lg" className="px-8">
              Search
            </Button>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 justify-center">
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              All Filters
            </Button>
            <Button variant="outline" size="sm">Price</Button>
            <Button variant="outline" size="sm">Rating</Button>
            <Button variant="outline" size="sm">Distance</Button>
            <Button variant="outline" size="sm">Category</Button>
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

        {/* Listings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {destinations.map((destination) => (
            <Card key={destination.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <Image
                  src={destination.image}
                  alt={destination.name}
                  width={400}
                  height={300}
                  className="w-full h-48 object-cover"
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
                  <Link href={`/destination/${destination.id}`}>
                    <Button>View Details</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            Load More Results
          </Button>
        </div>
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
    </div>
  );
}
