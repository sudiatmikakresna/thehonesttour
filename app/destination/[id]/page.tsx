"use client";

import { useState, useEffect, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, MapPin, Star, Heart, Share2, Wifi, Car, Coffee, Utensils, Waves, Dumbbell, Users, Calendar, Clock, Phone, Mail, Globe, ChevronDown, ChevronUp, MessageCircle, X, ChevronLeft, ChevronRight, Facebook, Twitter, Instagram, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";
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
    images: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=600&fit=crop"
    ],
    category: "Luxury Hotel",
    description: "Experience ultimate luxury at this clifftop resort with stunning ocean views and world-class amenities. The Ritz-Carlton, Bali offers an unparalleled experience with its dramatic clifftop setting, pristine beaches, and exceptional service. Each suite and villa features contemporary Balinese design with modern luxury touches.",
    fullDescription: "Perched on a dramatic clifftop in Nusa Dua, The Ritz-Carlton, Bali redefines luxury with its stunning ocean views and world-class amenities. This award-winning resort features beautifully appointed suites and villas, each designed with contemporary Balinese touches and modern luxury amenities. The resort's dramatic setting offers breathtaking views of the Indian Ocean, while its pristine beach provides the perfect setting for relaxation and water activities. With exceptional dining options, a world-class spa, and impeccable service, The Ritz-Carlton, Bali creates unforgettable experiences for discerning travelers.",
    tourSchedule: [
      {
        day: 1,
        title: "Arrival & Resort Orientation",
        activities: [
          { time: "15:00", activity: "Check-in and welcome drink", duration: "30 mins" },
          { time: "16:00", activity: "Resort tour and amenities briefing", duration: "45 mins" },
          { time: "17:30", activity: "Sunset cocktails at The Lounge", duration: "1 hour" },
          { time: "19:00", activity: "Welcome dinner at Bejana Restaurant", duration: "2 hours" }
        ]
      },
      {
        day: 2,
        title: "Beach & Spa Experience",
        activities: [
          { time: "08:00", activity: "Breakfast at Senses Restaurant", duration: "1 hour" },
          { time: "10:00", activity: "Beach club access and water activities", duration: "3 hours" },
          { time: "14:00", activity: "Lunch at Beach Club", duration: "1 hour" },
          { time: "16:00", activity: "Signature spa treatment", duration: "2 hours" },
          { time: "19:30", activity: "Dinner at Raku Japanese Restaurant", duration: "2 hours" }
        ]
      },
      {
        day: 3,
        title: "Cultural Discovery",
        activities: [
          { time: "08:00", activity: "Breakfast at resort", duration: "1 hour" },
          { time: "09:30", activity: "Visit to Uluwatu Temple", duration: "3 hours" },
          { time: "13:00", activity: "Traditional Balinese lunch", duration: "1 hour" },
          { time: "15:00", activity: "Kecak Fire Dance performance", duration: "1.5 hours" },
          { time: "18:00", activity: "Sunset viewing at clifftop", duration: "1 hour" },
          { time: "20:00", activity: "Farewell dinner with cultural show", duration: "2.5 hours" }
        ]
      },
      {
        day: 4,
        title: "Departure",
        activities: [
          { time: "08:00", activity: "Final breakfast at resort", duration: "1 hour" },
          { time: "10:00", activity: "Last-minute spa or pool time", duration: "2 hours" },
          { time: "12:00", activity: "Check-out and departure", duration: "30 mins" }
        ]
      }
    ],
    amenities: [
      { 
        name: "Infinity Pool", 
        icon: Waves, 
        description: "Stunning clifftop infinity pool overlooking the Indian Ocean",
        details: "Open 6AM - 10PM • Pool bar service • Adult & children areas"
      },
      { 
        name: "Spa & Wellness", 
        icon: Heart, 
        description: "World-class spa with traditional Balinese treatments",
        details: "6 treatment rooms • Couples suites • Yoga classes • Meditation garden"
      },
      { 
        name: "Fine Dining", 
        icon: Utensils, 
        description: "Multiple award-winning restaurants with international cuisine",
        details: "3 restaurants • Room service 24/7 • Private dining • Wine cellar"
      },
      { 
        name: "Beach Access", 
        icon: Waves, 
        description: "Private pristine white sand beach with water sports",
        details: "Private beach club • Water sports • Beach butler • Sunset lounge"
      },
      { 
        name: "Fitness Center", 
        icon: Dumbbell, 
        description: "State-of-the-art fitness facility with personal trainers",
        details: "24/7 access • Personal trainers • Group classes • Ocean views"
      },
      { 
        name: "WiFi", 
        icon: Wifi, 
        description: "Complimentary high-speed internet throughout the property",
        details: "Free unlimited WiFi • Business center • Meeting rooms • Work desks"
      },
      { 
        name: "Valet Parking", 
        icon: Car, 
        description: "Complimentary valet parking and car care services",
        details: "24/7 valet service • Car washing • Airport transfers • Rental cars"
      },
      { 
        name: "Concierge", 
        icon: Users, 
        description: "Dedicated concierge team for personalized assistance",
        details: "24/7 concierge • Tour bookings • Restaurant reservations • Local expertise"
      }
    ],
    contact: {
      phone: "+62 361 849 8988",
      email: "reservations.bali@ritzcarlton.com",
      website: "https://www.ritzcarlton.com/bali"
    },
    hours: "Check-in: 3:00 PM | Check-out: 12:00 PM",
    reviews: [
      {
        id: 1,
        name: "Sarah Johnson",
        rating: 5,
        date: "2024-01-15",
        text: "Absolutely stunning resort! The clifftop location provides breathtaking views, and the service is impeccable. The infinity pool overlooking the ocean is simply magical.",
        helpful: 24
      },
      {
        id: 2,
        name: "Michael Chen",
        rating: 5,
        date: "2024-01-10",
        text: "Perfect honeymoon destination. The villa was spacious and beautifully designed. The spa treatments were incredible, and the dining options exceeded our expectations.",
        helpful: 18
      },
      {
        id: 3,
        name: "Emma Wilson",
        rating: 4,
        date: "2024-01-08",
        text: "Luxury at its finest. The beach club is amazing, and the staff goes above and beyond to make your stay memorable. The only downside is the price, but worth it for special occasions.",
        helpful: 15
      }
    ]
  },
  {
    id: 2,
    name: "Tanah Lot Temple",
    location: "Tabanan, Bali",
    rating: 4.6,
    reviews: 5432,
    price: 15,
    images: [
      "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1555400081-71e467b6ec49?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop"
    ],
    category: "Temple",
    description: "Ancient Hindu temple perched on a rock formation, famous for its sunset views.",
    fullDescription: "Tanah Lot is one of Bali's most iconic and photographed temples, dramatically positioned on a rocky outcrop surrounded by crashing waves. This 16th-century Hindu temple is dedicated to the sea gods and offers breathtaking sunset views. The temple becomes inaccessible during high tide, adding to its mystique. Visitors can explore the surrounding area, enjoy traditional Balinese performances, and witness one of the world's most spectacular sunsets from this sacred location.",
    tourSchedule: [
      {
        day: 1,
        title: "Temple Discovery & Sunset Experience",
        activities: [
          { time: "15:00", activity: "Arrival and temple entrance", duration: "30 mins" },
          { time: "15:30", activity: "Guided temple tour and history", duration: "1 hour" },
          { time: "16:30", activity: "Explore surrounding area and shops", duration: "1 hour" },
          { time: "17:30", activity: "Best sunset viewing spots", duration: "1.5 hours" },
          { time: "19:00", activity: "Traditional Kecak dance performance", duration: "1 hour" }
        ]
      }
    ],
    amenities: [
      { 
        name: "Parking", 
        icon: Car, 
        description: "Convenient parking facilities for all vehicle types",
        details: "Free parking • Security • Bus parking • Motorcycle area"
      },
      { 
        name: "Gift Shop", 
        icon: Coffee, 
        description: "Authentic Balinese souvenirs and local crafts",
        details: "Local crafts • Traditional textiles • Religious items • Postcards"
      },
      { 
        name: "Restaurant", 
        icon: Utensils, 
        description: "Local Indonesian cuisine with temple views",
        details: "Balinese cuisine • Seafood • Vegetarian options • Temple views"
      },
      { 
        name: "Photography", 
        icon: Users, 
        description: "Professional photography services and best photo spots",
        details: "Photo guides • Best viewing angles • Sunset timing • Equipment rental"
      }
    ],
    contact: {
      phone: "+62 361 123456",
      email: "info@tanahlot.com",
      website: "https://www.tanahlot-bali.com"
    },
    hours: "Open daily 7:00 AM - 7:00 PM",
    reviews: [
      {
        id: 1,
        name: "David Kim",
        rating: 5,
        date: "2024-01-12",
        text: "Absolutely magical sunset views! The temple's location is breathtaking and the Kecak dance performance was incredible. A must-visit when in Bali.",
        helpful: 32
      },
      {
        id: 2,
        name: "Maria Santos",
        rating: 4,
        date: "2024-01-08",
        text: "Beautiful temple with stunning architecture. Can get quite crowded during sunset, but the views are worth it. The surrounding area has nice shops too.",
        helpful: 28
      }
    ]
  },
  {
    id: 3,
    name: "Ubud Monkey Forest Sanctuary",
    location: "Ubud, Bali",
    rating: 4.3,
    reviews: 3921,
    price: 8,
    images: [
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1590736969955-71cc94901144?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop"
    ],
    category: "Nature Reserve",
    description: "Sacred sanctuary home to hundreds of long-tailed macaques in their natural habitat.",
    fullDescription: "The Sacred Monkey Forest Sanctuary is a spiritual and conservation center located in the heart of Ubud. This ancient forest is home to over 700 Balinese long-tailed macaques and contains three Hindu temples dating from the 14th century. The 27-acre sanctuary serves as an important spiritual, economic, educational, and conservation center for the local community, offering visitors a unique opportunity to observe these playful primates in their natural environment while exploring sacred Balinese architecture.",
    tourSchedule: [
      {
        day: 1,
        title: "Wildlife & Cultural Experience",
        activities: [
          { time: "09:00", activity: "Forest entrance and orientation", duration: "15 mins" },
          { time: "09:15", activity: "Guided monkey observation tour", duration: "1 hour" },
          { time: "10:15", activity: "Temple exploration and history", duration: "45 mins" },
          { time: "11:00", activity: "Nature walk through sacred forest", duration: "30 mins" },
          { time: "11:30", activity: "Visit conservation center", duration: "30 mins" }
        ]
      }
    ],
    amenities: [
      { 
        name: "Guided Tours", 
        icon: Users, 
        description: "Expert guides sharing monkey behavior and forest ecology",
        details: "English speaking guides • Wildlife education • Temple history • Safety briefing"
      },
      { 
        name: "Walking Trails", 
        icon: MapPin, 
        description: "Well-maintained paths through the sacred forest",
        details: "Paved walkways • Trail maps • Rest areas • Accessibility options"
      },
      { 
        name: "Gift Shop", 
        icon: Coffee, 
        description: "Eco-friendly souvenirs and educational materials",
        details: "Conservation merchandise • Books • Local crafts • Donation options"
      },
      { 
        name: "Educational Center", 
        icon: Globe, 
        description: "Interactive displays about conservation and monkey behavior",
        details: "Wildlife exhibits • Conservation programs • Research information • Children's activities"
      }
    ],
    contact: {
      phone: "+62 361 971304",
      email: "info@monkeyforestubud.com",
      website: "https://www.monkeyforestubud.com"
    },
    hours: "Open daily 8:30 AM - 6:00 PM",
    reviews: [
      {
        id: 1,
        name: "Jennifer Walsh",
        rating: 4,
        date: "2024-01-14",
        text: "Amazing experience watching the monkeys in their natural habitat! The temples are beautiful and the guides are very knowledgeable. Just be careful with your belongings!",
        helpful: 45
      },
      {
        id: 2,
        name: "Thomas Mueller",
        rating: 5,
        date: "2024-01-09",
        text: "Fantastic conservation project. The monkeys are playful and the ancient temples add a mystical atmosphere. Educational and entertaining for the whole family.",
        helpful: 38
      }
    ]
  },
  {
    id: 4,
    name: "Kuta Beach",
    location: "Kuta, Bali",
    rating: 4.2,
    reviews: 8765,
    price: 0,
    images: [
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=600&fit=crop"
    ],
    category: "Beach",
    description: "Popular beach destination known for surfing, golden sand, and vibrant nightlife.",
    fullDescription: "Kuta Beach is one of Bali's most famous and vibrant beaches, stretching along the southwestern coast with its iconic golden sand and consistent surf breaks. This bustling beach destination offers something for everyone - from beginner-friendly surf lessons to world-class beach clubs and restaurants. The beach comes alive at sunset with spectacular views and transforms into a lively nightlife hub after dark. Kuta's central location makes it perfect for exploring other parts of Bali, while its wide range of accommodations and dining options cater to every budget.",
    tourSchedule: [
      {
        day: 1,
        title: "Beach, Surf & Sunset Experience",
        activities: [
          { time: "09:00", activity: "Beach arrival and setup", duration: "30 mins" },
          { time: "09:30", activity: "Surf lesson for beginners", duration: "2 hours" },
          { time: "12:00", activity: "Beachside lunch and relaxation", duration: "1.5 hours" },
          { time: "14:00", activity: "Beach activities and water sports", duration: "2 hours" },
          { time: "16:30", activity: "Sunset viewing and photography", duration: "1.5 hours" },
          { time: "18:30", activity: "Dinner at beachfront restaurant", duration: "1.5 hours" }
        ]
      }
    ],
    amenities: [
      { 
        name: "Surfing", 
        icon: Waves, 
        description: "Perfect waves for beginners and intermediate surfers",
        details: "Surf schools • Board rentals • Lessons available • Safe swimming areas"
      },
      { 
        name: "Beach Clubs", 
        icon: Utensils, 
        description: "Trendy beach clubs with dining and entertainment",
        details: "Day beds • Pool access • DJ events • Cocktail bars • International cuisine"
      },
      { 
        name: "Restaurants", 
        icon: Coffee, 
        description: "Wide variety of dining options from local warungs to fine dining",
        details: "Beachfront dining • Local Indonesian food • International cuisine • Sunset dining"
      },
      { 
        name: "Shopping", 
        icon: Users, 
        description: "Shopping centers, markets, and souvenir shops",
        details: "Beachwalk Mall • Local markets • Souvenir shops • Surf gear • Fashion boutiques"
      }
    ],
    contact: {
      phone: "+62 361 756176",
      email: "info@kutabeach.com",
      website: "https://www.kutabeach-bali.com"
    },
    hours: "Open 24 hours (Beach access)",
    reviews: [
      {
        id: 1,
        name: "Jake Morrison",
        rating: 4,
        date: "2024-01-16",
        text: "Great beach for surfing! The waves are perfect for beginners and the surf instructors are really helpful. Can get crowded but that's part of the fun. Amazing sunsets!",
        helpful: 52
      },
      {
        id: 2,
        name: "Lisa Chen",
        rating: 4,
        date: "2024-01-13",
        text: "Love the energy here! Lots of great restaurants and bars right on the beach. Perfect for people watching and the shopping is excellent too.",
        helpful: 41
      }
    ]
  },
  {
    id: 5,
    name: "Tegallalang Rice Terraces",
    location: "Ubud, Bali",
    rating: 4.7,
    reviews: 2156,
    price: 10,
    images: [
      "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1590736969955-71cc94901144?w=800&h=600&fit=crop"
    ],
    category: "Cultural Site",
    description: "Spectacular terraced rice fields offering breathtaking views and traditional Balinese agriculture.",
    fullDescription: "The Tegallalang Rice Terraces represent centuries of traditional Balinese agricultural artistry, carved into the hillsides north of Ubud. These stunning emerald-green terraces showcase the ancient Subak irrigation system, a UNESCO World Heritage practice that demonstrates the harmonious relationship between humans, nature, and spirituality in Balinese culture. Visitors can walk through the terraces, learn about traditional farming methods, enjoy local coffee, and capture some of the most Instagram-worthy shots in Bali. The site offers a peaceful escape from busy tourist areas while providing insight into Bali's agricultural heritage.",
    tourSchedule: [
      {
        day: 1,
        title: "Rice Terrace & Cultural Experience",
        activities: [
          { time: "08:00", activity: "Early morning arrival for best lighting", duration: "30 mins" },
          { time: "08:30", activity: "Guided walk through rice terraces", duration: "1.5 hours" },
          { time: "10:00", activity: "Learn about traditional farming methods", duration: "45 mins" },
          { time: "10:45", activity: "Coffee tasting at scenic cafe", duration: "45 mins" },
          { time: "11:30", activity: "Photography and swing experience", duration: "1 hour" },
          { time: "12:30", activity: "Traditional lunch with terrace views", duration: "1 hour" }
        ]
      }
    ],
    amenities: [
      { 
        name: "Photography", 
        icon: Users, 
        description: "Perfect spots for capturing stunning landscape photos",
        details: "Best viewpoints • Golden hour timing • Professional photo services • Drone photography"
      },
      { 
        name: "Cafe", 
        icon: Coffee, 
        description: "Scenic cafes overlooking the terraces with local specialties",
        details: "Luwak coffee • Traditional snacks • Terrace views • Local art displays"
      },
      { 
        name: "Swing", 
        icon: Heart, 
        description: "Famous jungle swings with spectacular terrace backdrop",
        details: "Multiple swing locations • Safety equipment • Photo assistance • Various heights"
      },
      { 
        name: "Walking Trails", 
        icon: MapPin, 
        description: "Well-maintained paths through the rice fields",
        details: "Guided trails • Self-guided options • Cultural information • Rest stops"
      }
    ],
    contact: {
      phone: "+62 361 234567",
      email: "info@tegallalang.com",
      website: "https://www.tegallalang-riceterrace.com"
    },
    hours: "Open daily 8:00 AM - 6:00 PM",
    reviews: [
      {
        id: 1,
        name: "Anna Rodriguez",
        rating: 5,
        date: "2024-01-17",
        text: "Absolutely breathtaking! The rice terraces are even more beautiful in person. The swing was so much fun and the coffee was delicious. A must-see in Ubud!",
        helpful: 67
      },
      {
        id: 2,
        name: "Mark Thompson",
        rating: 5,
        date: "2024-01-11",
        text: "Stunning views and great for photography. The early morning visit was perfect - fewer crowds and beautiful light. The local guides were very informative about the farming traditions.",
        helpful: 54
      }
    ]
  },
  {
    id: 6,
    name: "Four Seasons Resort Bali at Sayan",
    location: "Ubud, Bali",
    rating: 4.9,
    reviews: 1432,
    price: 650,
    images: [
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=600&fit=crop"
    ],
    category: "Luxury Resort",
    description: "Jungle luxury resort surrounded by tropical rainforest with award-winning spa.",
    fullDescription: "Four Seasons Resort Bali at Sayan is an extraordinary jungle sanctuary that redefines luxury hospitality in the heart of Ubud's cultural landscape. Nestled within a tropical rainforest along the Ayung River, this architectural marvel features treetop suites and villas that blend seamlessly with the natural environment. The resort's iconic lotus pond entrance leads to a world-class spa, innovative dining experiences, and unparalleled views of the Ayung River valley. Every detail has been crafted to provide guests with an intimate connection to Bali's spiritual and natural essence while maintaining the highest standards of luxury and service.",
    tourSchedule: [
      {
        day: 1,
        title: "Arrival & Jungle Immersion",
        activities: [
          { time: "15:00", activity: "Arrival and lotus pond entrance experience", duration: "45 mins" },
          { time: "16:00", activity: "Villa tour and rainforest orientation", duration: "1 hour" },
          { time: "17:30", activity: "Sunset yoga session", duration: "1 hour" },
          { time: "19:00", activity: "Welcome dinner at Ayung Terrace", duration: "2 hours" }
        ]
      },
      {
        day: 2,
        title: "Wellness & Cultural Discovery",
        activities: [
          { time: "07:00", activity: "Morning meditation by the river", duration: "1 hour" },
          { time: "08:30", activity: "Breakfast with jungle views", duration: "1 hour" },
          { time: "10:00", activity: "Balinese cooking class", duration: "2.5 hours" },
          { time: "14:00", activity: "Sacred Water Blessing ceremony", duration: "1.5 hours" },
          { time: "16:00", activity: "Spa treatment at award-winning spa", duration: "2 hours" },
          { time: "19:30", activity: "Private dining in treetop pavilion", duration: "2.5 hours" }
        ]
      }
    ],
    amenities: [
      { 
        name: "Spa", 
        icon: Heart, 
        description: "World-renowned spa with riverside treatment pavilions",
        details: "Riverside treatments • Traditional healing • Couples pavilions • Wellness programs"
      },
      { 
        name: "Infinity Pool", 
        icon: Waves, 
        description: "Three-tiered infinity pool cascading into the jungle",
        details: "Jungle views • Three levels • Pool bar • Private cabanas • River sounds"
      },
      { 
        name: "Yoga", 
        icon: Users, 
        description: "Daily yoga and meditation sessions in natural settings",
        details: "Riverside yoga • Private sessions • Meditation programs • Wellness retreats"
      },
      { 
        name: "Fine Dining", 
        icon: Utensils, 
        description: "Award-winning restaurants with innovative Indonesian cuisine",
        details: "Ayung Terrace • Jati Bar • In-villa dining • Cooking classes • Wine cellar"
      }
    ],
    contact: {
      phone: "+62 361 977577",
      email: "reservations.bali@fourseasons.com",
      website: "https://www.fourseasons.com/sayan"
    },
    hours: "Check-in: 3:00 PM | Check-out: 12:00 PM",
    reviews: [
      {
        id: 1,
        name: "Victoria Hamilton",
        rating: 5,
        date: "2024-01-18",
        text: "Pure magic! The jungle setting is incredible and the service is flawless. The spa treatments were heavenly and the food was exceptional. Worth every penny for this once-in-a-lifetime experience.",
        helpful: 89
      },
      {
        id: 2,
        name: "Robert Kim",
        rating: 5,
        date: "2024-01-15",
        text: "Absolutely stunning resort! The architecture blends perfectly with nature. The infinity pool overlooking the rainforest is breathtaking. Perfect for a romantic getaway or spiritual retreat.",
        helpful: 76
      }
    ]
  }
];

export default function DestinationDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const destination = destinations.find(d => d.id === parseInt(id));
  
  // State for collapsible sections
  const [collapsedSections, setCollapsedSections] = useState({
    description: false,
    amenities: false,
    schedule: false,
    reviews: false
  });

  // State for image gallery
  const [galleryState, setGalleryState] = useState({
    isOpen: false,
    currentImageIndex: 0
  });

  const toggleSection = (section: keyof typeof collapsedSections) => {
    setCollapsedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const openGallery = (imageIndex: number) => {
    setGalleryState({
      isOpen: true,
      currentImageIndex: imageIndex
    });
  };

  const closeGallery = () => {
    setGalleryState({
      isOpen: false,
      currentImageIndex: 0
    });
  };

  const navigateGallery = (direction: 'prev' | 'next') => {
    const maxIndex = destination.images.length - 1;
    setGalleryState(prev => ({
      ...prev,
      currentImageIndex: direction === 'next' 
        ? (prev.currentImageIndex + 1) % destination.images.length
        : prev.currentImageIndex === 0 ? maxIndex : prev.currentImageIndex - 1
    }));
  };

  const selectImage = (index: number) => {
    setGalleryState(prev => ({
      ...prev,
      currentImageIndex: index
    }));
  };

  // Keyboard navigation for gallery
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!galleryState.isOpen) return;

      switch (event.key) {
        case 'Escape':
          closeGallery();
          break;
        case 'ArrowLeft':
          event.preventDefault();
          navigateGallery('prev');
          break;
        case 'ArrowRight':
          event.preventDefault();
          navigateGallery('next');
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [galleryState.isOpen]);
  
  if (!destination) {
    return <div>Destination not found</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Abstract Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-200/30 to-purple-200/30 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 -left-20 w-60 h-60 bg-gradient-to-br from-green-200/30 to-blue-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-1/4 w-40 h-40 bg-gradient-to-br from-yellow-200/30 to-orange-200/30 rounded-full blur-2xl"></div>
      </div>

      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/60 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to search
                </Button>
              </Link>
              <h1 className="text-2xl font-bold text-green-600">The honest Tour</h1>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Heart className="w-4 h-4 mr-2" />
                Save
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main>
        {/* Title Section */}
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">{destination.name}</h1>
              <div className="flex items-center gap-4 text-muted-foreground">
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  {destination.location}
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{destination.rating}</span>
                  <span>({destination.reviews.toLocaleString()} reviews)</span>
                </div>
                <Badge className="bg-green-600 hover:bg-green-700">
                  {destination.category}
                </Badge>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">${destination.price}</div>
              <div className="text-sm text-muted-foreground">per night</div>
            </div>
          </div>
        </div>

        {/* Image Gallery Section */}
        <div className="w-full">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-4 gap-2" style={{ height: '400px' }}>
              <div className="col-span-2 row-span-2 cursor-pointer overflow-hidden rounded-l-lg" onClick={() => openGallery(0)}>
                <Image
                  src={destination.images[0]}
                  alt={destination.name}
                  width={800}
                  height={600}
                  className="w-full h-full object-cover hover:brightness-110 transition-all duration-300"
                />
              </div>
              <div className="cursor-pointer overflow-hidden" onClick={() => openGallery(1)}>
                <Image
                  src={destination.images[1]}
                  alt={destination.name}
                  width={400}
                  height={300}
                  className="w-full h-full object-cover hover:brightness-110 transition-all duration-300"
                />
              </div>
              <div className="cursor-pointer overflow-hidden rounded-tr-lg" onClick={() => openGallery(2)}>
                <Image
                  src={destination.images[2]}
                  alt={destination.name}
                  width={400}
                  height={300}
                  className="w-full h-full object-cover hover:brightness-110 transition-all duration-300"
                />
              </div>
              <div className="cursor-pointer overflow-hidden" onClick={() => openGallery(3)}>
                <Image
                  src={destination.images[3]}
                  alt={destination.name}
                  width={400}
                  height={300}
                  className="w-full h-full object-cover hover:brightness-110 transition-all duration-300"
                />
              </div>
              <div className="relative cursor-pointer overflow-hidden rounded-br-lg" onClick={() => openGallery(0)}>
                <Image
                  src={destination.images[1]}
                  alt={destination.name}
                  width={400}
                  height={300}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center hover:bg-black/60 transition-all duration-300">
                  <Button variant="secondary" size="sm">
                    View all photos ({destination.images.length})
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="container mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>About this place</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleSection('description')}
                    className="p-2"
                  >
                    {collapsedSections.description ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronUp className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </CardHeader>
              {!collapsedSections.description && (
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {destination.fullDescription}
                  </p>
                </CardContent>
              )}
            </Card>

            {/* Amenities */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Amenities</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleSection('amenities')}
                    className="p-2"
                  >
                    {collapsedSections.amenities ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronUp className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </CardHeader>
              {!collapsedSections.amenities && (
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {destination.amenities.map((amenity, index) => {
                      const IconComponent = amenity.icon;
                      return (
                        <div key={index} className="flex gap-4 p-4 rounded-lg border border-gray-100 hover:border-green-200 transition-colors">
                          <div className="flex-shrink-0">
                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                              <IconComponent className="w-5 h-5 text-green-600" />
                            </div>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-foreground mb-1">{amenity.name}</h4>
                            <p className="text-sm text-muted-foreground mb-2 leading-relaxed">
                              {amenity.description}
                            </p>
                            <p className="text-xs text-green-600 font-medium">
                              {amenity.details}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              )}
            </Card>

            {/* Tour Schedule */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-green-600" />
                      4-Day Itinerary
                    </CardTitle>
                    <CardDescription>
                      Complete schedule for your luxury Bali experience
                    </CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleSection('schedule')}
                    className="p-2"
                  >
                    {collapsedSections.schedule ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronUp className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </CardHeader>
              {!collapsedSections.schedule && (
                <CardContent>
                <div className="space-y-6">
                  {destination.tourSchedule.map((daySchedule) => (
                    <div key={daySchedule.day} className="border-l-2 border-green-200 pl-6 relative">
                      <div className="absolute -left-2 top-0 w-4 h-4 bg-green-600 rounded-full"></div>
                      <div className="mb-4">
                        <h3 className="text-lg font-semibold text-green-600">
                          Day {daySchedule.day}: {daySchedule.title}
                        </h3>
                      </div>
                      <div className="space-y-3">
                        {daySchedule.activities.map((activity, activityIndex) => (
                          <div key={activityIndex} className="flex items-start gap-4 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                            <div className="flex items-center gap-2 text-sm text-green-600 font-mono min-w-0">
                              <Clock className="w-4 h-4 flex-shrink-0" />
                              <span className="font-semibold">{activity.time}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-foreground">{activity.activity}</p>
                              <p className="text-sm text-muted-foreground">Duration: {activity.duration}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xs">!</span>
                    </div>
                    <div>
                      <p className="font-medium text-green-800">Important Notes</p>
                      <p className="text-sm text-green-700 mt-1">
                        All activities are optional and can be customized based on your preferences. 
                        Weather conditions may affect outdoor activities. Transportation to external 
                        attractions is included in the package.
                      </p>
                    </div>
                  </div>
                </div>
                </CardContent>
              )}
            </Card>

            {/* Reviews */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    {destination.rating} · {destination.reviews.toLocaleString()} reviews
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">View all reviews</Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleSection('reviews')}
                      className="p-2"
                    >
                      {collapsedSections.reviews ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronUp className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              {!collapsedSections.reviews && (
                <CardContent className="space-y-6">
                {destination.reviews.map((review) => (
                  <div key={review.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                          {review.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-sm">{review.name}</p>
                          <p className="text-xs text-muted-foreground">{review.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: review.rating }).map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{review.text}</p>
                    <p className="text-xs text-muted-foreground">
                      {review.helpful} people found this helpful
                    </p>
                    <Separator className="mt-4" />
                  </div>
                ))}
                </CardContent>
              )}
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Booking Card */}
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>${destination.price} per night</span>
                  <div className="flex items-center gap-1 text-sm">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    {destination.rating}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Check-in</label>
                    <div className="border rounded-md p-2 text-sm">12/20/2024</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Check-out</label>
                    <div className="border rounded-md p-2 text-sm">12/25/2024</div>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Guests</label>
                  <div className="border rounded-md p-2 text-sm">2 guests</div>
                </div>
                <Button className="w-full" size="lg">
                  Reserve Now
                </Button>
                <p className="text-xs text-center text-muted-foreground">
                  You won't be charged yet
                </p>
                <Separator />
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>${destination.price} x 5 nights</span>
                    <span>${destination.price * 5}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Service fee</span>
                    <span>$99</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Taxes</span>
                    <span>$180</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>${destination.price * 5 + 99 + 180}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-green-600" />
                  {destination.contact.phone}
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-green-600" />
                  {destination.contact.email}
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Globe className="w-4 h-4 text-green-600" />
                  Visit website
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-green-600" />
                  {destination.hours}
                </div>
              </CardContent>
            </Card>
          </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-green-400">The honest Tour</h3>
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
                  <span className="text-gray-300 text-sm">+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-4 h-4 text-green-400 flex-shrink-0" />
                  <span className="text-gray-300 text-sm">info@travelguide.com</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Globe className="w-4 h-4 text-green-400 flex-shrink-0" />
                  <span className="text-gray-300 text-sm">www.travelguide.com</span>
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
              © 2024 The honest Tour. All rights reserved.
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

      {/* Floating WhatsApp Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <a
          href={`https://wa.me/6281234567890?text=Hi! I'm interested in ${destination.name}. Can you help me with more information?`}
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

      {/* Image Gallery Modal */}
      {galleryState.isOpen && (
        <div className="fixed inset-0 bg-black/90 z-[60] flex items-center justify-center">
          <div className="relative w-full h-full flex flex-col">
            {/* Header */}
            <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/50 to-transparent p-6">
              <div className="flex items-center justify-between text-white">
                <div>
                  <h2 className="text-xl font-semibold">{destination.name}</h2>
                  <p className="text-sm opacity-80">
                    {galleryState.currentImageIndex + 1} of {destination.images.length} photos
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={closeGallery}
                  className="text-white hover:bg-white/20"
                >
                  <X className="w-6 h-6" />
                </Button>
              </div>
            </div>

            {/* Main Image */}
            <div className="flex-1 flex items-center justify-center p-6">
              <div className="relative max-w-6xl max-h-full">
                <Image
                  src={destination.images[galleryState.currentImageIndex]}
                  alt={`${destination.name} - Image ${galleryState.currentImageIndex + 1}`}
                  width={1200}
                  height={800}
                  className="max-w-full max-h-[80vh] object-contain"
                />
                
                {/* Navigation Arrows */}
                {destination.images.length > 1 && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => navigateGallery('prev')}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 w-12 h-12"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => navigateGallery('next')}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 w-12 h-12"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* Thumbnail Selector */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-6">
              <div className="flex justify-center gap-2 overflow-x-auto pb-2">
                {destination.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => selectImage(index)}
                    className={`relative flex-shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                      index === galleryState.currentImageIndex
                        ? 'border-white shadow-lg'
                        : 'border-white/30 hover:border-white/60'
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      width={64}
                      height={48}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}