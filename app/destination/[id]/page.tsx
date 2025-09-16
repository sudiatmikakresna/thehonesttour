"use client";

import { useState, useEffect, useCallback, use } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  MapPin,
  Star,
  Heart,
  Share2,
  Wifi,
  Car,
  Coffee,
  Utensils,
  Waves,
  Dumbbell,
  Users,
  Calendar,
  Clock,
  Phone,
  Mail,
  Globe,
  ChevronDown,
  ChevronUp,
  MessageCircle,
  X,
  ChevronLeft,
  ChevronRight,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  CalendarDays,
  Minus,
  Plus,
  Link as LinkIcon,
  Check,
  User,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ToursService, transformApiTourToLocal } from "@/services/tours";
import {
  FeedbackService,
  transformApiFeedbackToLocal,
  FeedbackPayload,
} from "@/services/feedback";

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

const fallbackDestinations = [
  {
    id: 1,
    name: "The Ritz-Carlton, Bali",
    location: "Nusa Dua, Bali",
    rating: 4.8,
    reviewCount: 2847,
    price: 450,
    images: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=600&fit=crop",
    ],
    category: "Luxury Hotel",
    description:
      "Experience ultimate luxury at this clifftop resort with stunning ocean views and world-class amenities. The Ritz-Carlton, Bali offers an unparalleled experience with its dramatic clifftop setting, pristine beaches, and exceptional service. Each suite and villa features contemporary Balinese design with modern luxury touches.",
    fullDescription:
      "Perched on a dramatic clifftop in Nusa Dua, The Ritz-Carlton, Bali redefines luxury with its stunning ocean views and world-class amenities. This award-winning resort features beautifully appointed suites and villas, each designed with contemporary Balinese touches and modern luxury amenities. The resort's dramatic setting offers breathtaking views of the Indian Ocean, while its pristine beach provides the perfect setting for relaxation and water activities. With exceptional dining options, a world-class spa, and impeccable service, The Ritz-Carlton, Bali creates unforgettable experiences for discerning travelers.",
    tourSchedule: [
      {
        day: 1,
        title: "Arrival & Resort Orientation",
        activities: [
          {
            time: "15:00",
            activity: "Check-in and welcome drink",
            duration: "30 mins",
          },
          {
            time: "16:00",
            activity: "Resort tour and amenities briefing",
            duration: "45 mins",
          },
          {
            time: "17:30",
            activity: "Sunset cocktails at The Lounge",
            duration: "1 hour",
          },
          {
            time: "19:00",
            activity: "Welcome dinner at Bejana Restaurant",
            duration: "2 hours",
          },
        ],
      },
      {
        day: 2,
        title: "Beach & Spa Experience",
        activities: [
          {
            time: "08:00",
            activity: "Breakfast at Senses Restaurant",
            duration: "1 hour",
          },
          {
            time: "10:00",
            activity: "Beach club access and water activities",
            duration: "3 hours",
          },
          {
            time: "14:00",
            activity: "Lunch at Beach Club",
            duration: "1 hour",
          },
          {
            time: "16:00",
            activity: "Signature spa treatment",
            duration: "2 hours",
          },
          {
            time: "19:30",
            activity: "Dinner at Raku Japanese Restaurant",
            duration: "2 hours",
          },
        ],
      },
      {
        day: 3,
        title: "Cultural Discovery",
        activities: [
          {
            time: "08:00",
            activity: "Breakfast at resort",
            duration: "1 hour",
          },
          {
            time: "09:30",
            activity: "Visit to Uluwatu Temple",
            duration: "3 hours",
          },
          {
            time: "13:00",
            activity: "Traditional Balinese lunch",
            duration: "1 hour",
          },
          {
            time: "15:00",
            activity: "Kecak Fire Dance performance",
            duration: "1.5 hours",
          },
          {
            time: "18:00",
            activity: "Sunset viewing at clifftop",
            duration: "1 hour",
          },
          {
            time: "20:00",
            activity: "Farewell dinner with cultural show",
            duration: "2.5 hours",
          },
        ],
      },
      {
        day: 4,
        title: "Departure",
        activities: [
          {
            time: "08:00",
            activity: "Final breakfast at resort",
            duration: "1 hour",
          },
          {
            time: "10:00",
            activity: "Last-minute spa or pool time",
            duration: "2 hours",
          },
          {
            time: "12:00",
            activity: "Check-out and departure",
            duration: "30 mins",
          },
        ],
      },
    ],
    amenities: [
      {
        name: "Infinity Pool",
        icon: Waves,
        description:
          "Stunning clifftop infinity pool overlooking the Indian Ocean",
        details: "Open 6AM - 10PM • Pool bar service • Adult & children areas",
      },
      {
        name: "Spa & Wellness",
        icon: Heart,
        description: "World-class spa with traditional Balinese treatments",
        details:
          "6 treatment rooms • Couples suites • Yoga classes • Meditation garden",
      },
      {
        name: "Fine Dining",
        icon: Utensils,
        description:
          "Multiple award-winning restaurants with international cuisine",
        details:
          "3 restaurants • Room service 24/7 • Private dining • Wine cellar",
      },
      {
        name: "Beach Access",
        icon: Waves,
        description: "Private pristine white sand beach with water sports",
        details:
          "Private beach club • Water sports • Beach butler • Sunset lounge",
      },
      {
        name: "Fitness Center",
        icon: Dumbbell,
        description: "State-of-the-art fitness facility with personal trainers",
        details:
          "24/7 access • Personal trainers • Group classes • Ocean views",
      },
      {
        name: "WiFi",
        icon: Wifi,
        description:
          "Complimentary high-speed internet throughout the property",
        details:
          "Free unlimited WiFi • Business center • Meeting rooms • Work desks",
      },
      {
        name: "Valet Parking",
        icon: Car,
        description: "Complimentary valet parking and car care services",
        details:
          "24/7 valet service • Car washing • Airport transfers • Rental cars",
      },
      {
        name: "Concierge",
        icon: Users,
        description: "Dedicated concierge team for personalized assistance",
        details:
          "24/7 concierge • Tour bookings • Restaurant reservations • Local expertise",
      },
    ],
    contact: {
      phone: "+62 82236969768",
      email: "reservations.bali@ritzcarlton.com",
      website: "https://www.ritzcarlton.com/bali",
    },
    hours: "Check-in: 3:00 PM | Check-out: 12:00 PM",
    reviews: [
      {
        id: 1,
        name: "Sarah Johnson",
        rating: 5,
        date: "2024-01-15",
        text: "Absolutely stunning resort! The clifftop location provides breathtaking views, and the service is impeccable. The infinity pool overlooking the ocean is simply magical.",
        helpful: 24,
      },
      {
        id: 2,
        name: "Michael Chen",
        rating: 5,
        date: "2024-01-10",
        text: "Perfect honeymoon destination. The villa was spacious and beautifully designed. The spa treatments were incredible, and the dining options exceeded our expectations.",
        helpful: 18,
      },
      {
        id: 3,
        name: "Emma Wilson",
        rating: 4,
        date: "2024-01-08",
        text: "Luxury at its finest. The beach club is amazing, and the staff goes above and beyond to make your stay memorable. The only downside is the price, but worth it for special occasions.",
        helpful: 15,
      },
    ],
  },
  {
    id: 2,
    name: "Tanah Lot Temple",
    location: "Tabanan, Bali",
    rating: 4.6,
    reviewCount: 5432,
    price: 15,
    images: [
      "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1555400081-71e467b6ec49?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop",
    ],
    category: "Temple",
    description:
      "Ancient Hindu temple perched on a rock formation, famous for its sunset views.",
    fullDescription:
      "Tanah Lot is one of Bali's most iconic and photographed temples, dramatically positioned on a rocky outcrop surrounded by crashing waves. This 16th-century Hindu temple is dedicated to the sea gods and offers breathtaking sunset views. The temple becomes inaccessible during high tide, adding to its mystique. Visitors can explore the surrounding area, enjoy traditional Balinese performances, and witness one of the world's most spectacular sunsets from this sacred location.",
    tourSchedule: [
      {
        day: 1,
        title: "Temple Discovery & Sunset Experience",
        activities: [
          {
            time: "15:00",
            activity: "Arrival and temple entrance",
            duration: "30 mins",
          },
          {
            time: "15:30",
            activity: "Guided temple tour and history",
            duration: "1 hour",
          },
          {
            time: "16:30",
            activity: "Explore surrounding area and shops",
            duration: "1 hour",
          },
          {
            time: "17:30",
            activity: "Best sunset viewing spots",
            duration: "1.5 hours",
          },
          {
            time: "19:00",
            activity: "Traditional Kecak dance performance",
            duration: "1 hour",
          },
        ],
      },
    ],
    amenities: [
      {
        name: "Parking",
        icon: Car,
        description: "Convenient parking facilities for all vehicle types",
        details: "Free parking • Security • Bus parking • Motorcycle area",
      },
      {
        name: "Gift Shop",
        icon: Coffee,
        description: "Authentic Balinese souvenirs and local crafts",
        details:
          "Local crafts • Traditional textiles • Religious items • Postcards",
      },
      {
        name: "Restaurant",
        icon: Utensils,
        description: "Local Indonesian cuisine with temple views",
        details:
          "Balinese cuisine • Seafood • Vegetarian options • Temple views",
      },
      {
        name: "Photography",
        icon: Users,
        description: "Professional photography services and best photo spots",
        details:
          "Photo guides • Best viewing angles • Sunset timing • Equipment rental",
      },
    ],
    contact: {
      phone: "+62 82236969768",
      email: "info@tanahlot.com",
      website: "https://www.tanahlot-bali.com",
    },
    hours: "Open daily 7:00 AM - 7:00 PM",
    reviews: [
      {
        id: 1,
        name: "David Kim",
        rating: 5,
        date: "2024-01-12",
        text: "Absolutely magical sunset views! The temple's location is breathtaking and the Kecak dance performance was incredible. A must-visit when in Bali.",
        helpful: 32,
      },
      {
        id: 2,
        name: "Maria Santos",
        rating: 4,
        date: "2024-01-08",
        text: "Beautiful temple with stunning architecture. Can get quite crowded during sunset, but the views are worth it. The surrounding area has nice shops too.",
        helpful: 28,
      },
    ],
  },
  {
    id: 3,
    name: "Ubud Monkey Forest Sanctuary",
    location: "Ubud, Bali",
    rating: 4.3,
    reviewCount: 3921,
    price: 8,
    images: [
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1590736969955-71cc94901144?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop",
    ],
    category: "Nature Reserve",
    description:
      "Sacred sanctuary home to hundreds of long-tailed macaques in their natural habitat.",
    fullDescription:
      "The Sacred Monkey Forest Sanctuary is a spiritual and conservation center located in the heart of Ubud. This ancient forest is home to over 700 Balinese long-tailed macaques and contains three Hindu temples dating from the 14th century. The 27-acre sanctuary serves as an important spiritual, economic, educational, and conservation center for the local community, offering visitors a unique opportunity to observe these playful primates in their natural environment while exploring sacred Balinese architecture.",
    tourSchedule: [
      {
        day: 1,
        title: "Wildlife & Cultural Experience",
        activities: [
          {
            time: "09:00",
            activity: "Forest entrance and orientation",
            duration: "15 mins",
          },
          {
            time: "09:15",
            activity: "Guided monkey observation tour",
            duration: "1 hour",
          },
          {
            time: "10:15",
            activity: "Temple exploration and history",
            duration: "45 mins",
          },
          {
            time: "11:00",
            activity: "Nature walk through sacred forest",
            duration: "30 mins",
          },
          {
            time: "11:30",
            activity: "Visit conservation center",
            duration: "30 mins",
          },
        ],
      },
    ],
    amenities: [
      {
        name: "Guided Tours",
        icon: Users,
        description: "Expert guides sharing monkey behavior and forest ecology",
        details:
          "English speaking guides • Wildlife education • Temple history • Safety briefing",
      },
      {
        name: "Walking Trails",
        icon: MapPin,
        description: "Well-maintained paths through the sacred forest",
        details:
          "Paved walkways • Trail maps • Rest areas • Accessibility options",
      },
      {
        name: "Gift Shop",
        icon: Coffee,
        description: "Eco-friendly souvenirs and educational materials",
        details:
          "Conservation merchandise • Books • Local crafts • Donation options",
      },
      {
        name: "Educational Center",
        icon: Globe,
        description:
          "Interactive displays about conservation and monkey behavior",
        details:
          "Wildlife exhibits • Conservation programs • Research information • Children's activities",
      },
    ],
    contact: {
      phone: "+62 82236969768",
      email: "info@monkeyforestubud.com",
      website: "https://www.monkeyforestubud.com",
    },
    hours: "Open daily 8:30 AM - 6:00 PM",
    reviews: [
      {
        id: 1,
        name: "Jennifer Walsh",
        rating: 4,
        date: "2024-01-14",
        text: "Amazing experience watching the monkeys in their natural habitat! The temples are beautiful and the guides are very knowledgeable. Just be careful with your belongings!",
        helpful: 45,
      },
      {
        id: 2,
        name: "Thomas Mueller",
        rating: 5,
        date: "2024-01-09",
        text: "Fantastic conservation project. The monkeys are playful and the ancient temples add a mystical atmosphere. Educational and entertaining for the whole family.",
        helpful: 38,
      },
    ],
  },
  {
    id: 4,
    name: "Kuta Beach",
    location: "Kuta, Bali",
    rating: 4.2,
    reviewCount: 8765,
    price: 0,
    images: [
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=600&fit=crop",
    ],
    category: "Beach",
    description:
      "Popular beach destination known for surfing, golden sand, and vibrant nightlife.",
    fullDescription:
      "Kuta Beach is one of Bali's most famous and vibrant beaches, stretching along the southwestern coast with its iconic golden sand and consistent surf breaks. This bustling beach destination offers something for everyone - from beginner-friendly surf lessons to world-class beach clubs and restaurants. The beach comes alive at sunset with spectacular views and transforms into a lively nightlife hub after dark. Kuta's central location makes it perfect for exploring other parts of Bali, while its wide range of accommodations and dining options cater to every budget.",
    tourSchedule: [
      {
        day: 1,
        title: "Beach, Surf & Sunset Experience",
        activities: [
          {
            time: "09:00",
            activity: "Beach arrival and setup",
            duration: "30 mins",
          },
          {
            time: "09:30",
            activity: "Surf lesson for beginners",
            duration: "2 hours",
          },
          {
            time: "12:00",
            activity: "Beachside lunch and relaxation",
            duration: "1.5 hours",
          },
          {
            time: "14:00",
            activity: "Beach activities and water sports",
            duration: "2 hours",
          },
          {
            time: "16:30",
            activity: "Sunset viewing and photography",
            duration: "1.5 hours",
          },
          {
            time: "18:30",
            activity: "Dinner at beachfront restaurant",
            duration: "1.5 hours",
          },
        ],
      },
    ],
    amenities: [
      {
        name: "Surfing",
        icon: Waves,
        description: "Perfect waves for beginners and intermediate surfers",
        details:
          "Surf schools • Board rentals • Lessons available • Safe swimming areas",
      },
      {
        name: "Beach Clubs",
        icon: Utensils,
        description: "Trendy beach clubs with dining and entertainment",
        details:
          "Day beds • Pool access • DJ events • Cocktail bars • International cuisine",
      },
      {
        name: "Restaurants",
        icon: Coffee,
        description:
          "Wide variety of dining options from local warungs to fine dining",
        details:
          "Beachfront dining • Local Indonesian food • International cuisine • Sunset dining",
      },
      {
        name: "Shopping",
        icon: Users,
        description: "Shopping centers, markets, and souvenir shops",
        details:
          "Beachwalk Mall • Local markets • Souvenir shops • Surf gear • Fashion boutiques",
      },
    ],
    contact: {
      phone: "+62 82236969768",
      email: "info@kutabeach.com",
      website: "https://www.kutabeach-bali.com",
    },
    hours: "Open 24 hours (Beach access)",
    reviews: [
      {
        id: 1,
        name: "Jake Morrison",
        rating: 4,
        date: "2024-01-16",
        text: "Great beach for surfing! The waves are perfect for beginners and the surf instructors are really helpful. Can get crowded but that's part of the fun. Amazing sunsets!",
        helpful: 52,
      },
      {
        id: 2,
        name: "Lisa Chen",
        rating: 4,
        date: "2024-01-13",
        text: "Love the energy here! Lots of great restaurants and bars right on the beach. Perfect for people watching and the shopping is excellent too.",
        helpful: 41,
      },
    ],
  },
  {
    id: 5,
    name: "Tegallalang Rice Terraces",
    location: "Ubud, Bali",
    rating: 4.7,
    reviewCount: 2156,
    price: 10,
    images: [
      "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1590736969955-71cc94901144?w=800&h=600&fit=crop",
    ],
    category: "Cultural Site",
    description:
      "Spectacular terraced rice fields offering breathtaking views and traditional Balinese agriculture.",
    fullDescription:
      "The Tegallalang Rice Terraces represent centuries of traditional Balinese agricultural artistry, carved into the hillsides north of Ubud. These stunning emerald-green terraces showcase the ancient Subak irrigation system, a UNESCO World Heritage practice that demonstrates the harmonious relationship between humans, nature, and spirituality in Balinese culture. Visitors can walk through the terraces, learn about traditional farming methods, enjoy local coffee, and capture some of the most Instagram-worthy shots in Bali. The site offers a peaceful escape from busy tourist areas while providing insight into Bali's agricultural heritage.",
    tourSchedule: [
      {
        day: 1,
        title: "Rice Terrace & Cultural Experience",
        activities: [
          {
            time: "08:00",
            activity: "Early morning arrival for best lighting",
            duration: "30 mins",
          },
          {
            time: "08:30",
            activity: "Guided walk through rice terraces",
            duration: "1.5 hours",
          },
          {
            time: "10:00",
            activity: "Learn about traditional farming methods",
            duration: "45 mins",
          },
          {
            time: "10:45",
            activity: "Coffee tasting at scenic cafe",
            duration: "45 mins",
          },
          {
            time: "11:30",
            activity: "Photography and swing experience",
            duration: "1 hour",
          },
          {
            time: "12:30",
            activity: "Traditional lunch with terrace views",
            duration: "1 hour",
          },
        ],
      },
    ],
    amenities: [
      {
        name: "Photography",
        icon: Users,
        description: "Perfect spots for capturing stunning landscape photos",
        details:
          "Best viewpoints • Golden hour timing • Professional photo services • Drone photography",
      },
      {
        name: "Cafe",
        icon: Coffee,
        description:
          "Scenic cafes overlooking the terraces with local specialties",
        details:
          "Luwak coffee • Traditional snacks • Terrace views • Local art displays",
      },
      {
        name: "Swing",
        icon: Heart,
        description: "Famous jungle swings with spectacular terrace backdrop",
        details:
          "Multiple swing locations • Safety equipment • Photo assistance • Various heights",
      },
      {
        name: "Walking Trails",
        icon: MapPin,
        description: "Well-maintained paths through the rice fields",
        details:
          "Guided trails • Self-guided options • Cultural information • Rest stops",
      },
    ],
    contact: {
      phone: "+62 82236969768",
      email: "info@tegallalang.com",
      website: "https://www.tegallalang-riceterrace.com",
    },
    hours: "Open daily 8:00 AM - 6:00 PM",
    reviews: [
      {
        id: 1,
        name: "Anna Rodriguez",
        rating: 5,
        date: "2024-01-17",
        text: "Absolutely breathtaking! The rice terraces are even more beautiful in person. The swing was so much fun and the coffee was delicious. A must-see in Ubud!",
        helpful: 67,
      },
      {
        id: 2,
        name: "Mark Thompson",
        rating: 5,
        date: "2024-01-11",
        text: "Stunning views and great for photography. The early morning visit was perfect - fewer crowds and beautiful light. The local guides were very informative about the farming traditions.",
        helpful: 54,
      },
    ],
  },
  {
    id: 6,
    name: "Four Seasons Resort Bali at Sayan",
    location: "Ubud, Bali",
    rating: 4.9,
    reviewCount: 1432,
    price: 650,
    images: [
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=600&fit=crop",
    ],
    category: "Luxury Resort",
    description:
      "Jungle luxury resort surrounded by tropical rainforest with award-winning spa.",
    fullDescription:
      "Four Seasons Resort Bali at Sayan is an extraordinary jungle sanctuary that redefines luxury hospitality in the heart of Ubud's cultural landscape. Nestled within a tropical rainforest along the Ayung River, this architectural marvel features treetop suites and villas that blend seamlessly with the natural environment. The resort's iconic lotus pond entrance leads to a world-class spa, innovative dining experiences, and unparalleled views of the Ayung River valley. Every detail has been crafted to provide guests with an intimate connection to Bali's spiritual and natural essence while maintaining the highest standards of luxury and service.",
    tourSchedule: [
      {
        day: 1,
        title: "Arrival & Jungle Immersion",
        activities: [
          {
            time: "15:00",
            activity: "Arrival and lotus pond entrance experience",
            duration: "45 mins",
          },
          {
            time: "16:00",
            activity: "Villa tour and rainforest orientation",
            duration: "1 hour",
          },
          {
            time: "17:30",
            activity: "Sunset yoga session",
            duration: "1 hour",
          },
          {
            time: "19:00",
            activity: "Welcome dinner at Ayung Terrace",
            duration: "2 hours",
          },
        ],
      },
      {
        day: 2,
        title: "Wellness & Cultural Discovery",
        activities: [
          {
            time: "07:00",
            activity: "Morning meditation by the river",
            duration: "1 hour",
          },
          {
            time: "08:30",
            activity: "Breakfast with jungle views",
            duration: "1 hour",
          },
          {
            time: "10:00",
            activity: "Balinese cooking class",
            duration: "2.5 hours",
          },
          {
            time: "14:00",
            activity: "Sacred Water Blessing ceremony",
            duration: "1.5 hours",
          },
          {
            time: "16:00",
            activity: "Spa treatment at award-winning spa",
            duration: "2 hours",
          },
          {
            time: "19:30",
            activity: "Private dining in treetop pavilion",
            duration: "2.5 hours",
          },
        ],
      },
    ],
    amenities: [
      {
        name: "Spa",
        icon: Heart,
        description: "World-renowned spa with riverside treatment pavilions",
        details:
          "Riverside treatments • Traditional healing • Couples pavilions • Wellness programs",
      },
      {
        name: "Infinity Pool",
        icon: Waves,
        description: "Three-tiered infinity pool cascading into the jungle",
        details:
          "Jungle views • Three levels • Pool bar • Private cabanas • River sounds",
      },
      {
        name: "Yoga",
        icon: Users,
        description: "Daily yoga and meditation sessions in natural settings",
        details:
          "Riverside yoga • Private sessions • Meditation programs • Wellness retreats",
      },
      {
        name: "Fine Dining",
        icon: Utensils,
        description:
          "Award-winning restaurants with innovative Indonesian cuisine",
        details:
          "Ayung Terrace • Jati Bar • In-villa dining • Cooking classes • Wine cellar",
      },
    ],
    contact: {
      phone: "+62 82236969768",
      email: "reservations.bali@fourseasons.com",
      website: "https://www.fourseasons.com/sayan",
    },
    hours: "Check-in: 3:00 PM | Check-out: 12:00 PM",
    reviews: [
      {
        id: 1,
        name: "Victoria Hamilton",
        rating: 5,
        date: "2024-01-18",
        text: "Pure magic! The jungle setting is incredible and the service is flawless. The spa treatments were heavenly and the food was exceptional. Worth every penny for this once-in-a-lifetime experience.",
        helpful: 89,
      },
      {
        id: 2,
        name: "Robert Kim",
        rating: 5,
        date: "2024-01-15",
        text: "Absolutely stunning resort! The architecture blends perfectly with nature. The infinity pool overlooking the rainforest is breathtaking. Perfect for a romantic getaway or spiritual retreat.",
        helpful: 76,
      },
    ],
  },
];

export default function DestinationDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  // API state management
  const [destination, setDestination] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for collapsible sections
  const [collapsedSections, setCollapsedSections] = useState({
    tourDetails: false,
    additionalInfo: false,
    schedule: false,
    includes: false,
    whatToBring: false,
    faq: false,
    notes: false,
  });

  // State for image gallery
  const [galleryState, setGalleryState] = useState({
    isOpen: false,
    currentImageIndex: 0,
  });

  // State for booking form
  const [bookingForm, setBookingForm] = useState({
    date: "2024-12-20",
    guests: 2,
    startTime: "8 AM",
    duration: "8 hours",
  });

  // State for share dropdown
  const [showShareMenu, setShowShareMenu] = useState(false);

  // State for toast notification
  const [showToast, setShowToast] = useState(false);

  // State for authentication
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  // State for related tours
  const [relatedTours, setRelatedTours] = useState<any[]>([]);

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

  // State for comments
  const [comments, setComments] = useState<any[]>([]);
  const [loadingComments, setLoadingComments] = useState(true);
  const [submittingComment, setSubmittingComment] = useState(false);
  const [feedbackStats, setFeedbackStats] = useState({
    total: 0,
    averageRating: 0,
    ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  });

  const [newComment, setNewComment] = useState({
    rating: 5,
    comment: "",
  });

  const toggleSection = (section: keyof typeof collapsedSections) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const openGallery = (imageIndex: number) => {
    setGalleryState({
      isOpen: true,
      currentImageIndex: imageIndex,
    });
  };

  const closeGallery = useCallback(() => {
    setGalleryState({
      isOpen: false,
      currentImageIndex: 0,
    });
  }, []);

  const navigateGallery = useCallback(
    (direction: "prev" | "next") => {
      if (!destination) return;
      const maxIndex = destination.images.length - 1;
      setGalleryState((prev) => ({
        ...prev,
        currentImageIndex:
          direction === "next"
            ? (prev.currentImageIndex + 1) % (destination?.images.length || 1)
            : prev.currentImageIndex === 0
            ? maxIndex
            : prev.currentImageIndex - 1,
      }));
    },
    [destination]
  );

  const selectImage = (index: number) => {
    setGalleryState((prev) => ({
      ...prev,
      currentImageIndex: index,
    }));
  };

  const handleShareToFacebook = () => {
    if (!destination) return;
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(
      `Check out ${destination.name} - ${destination.description}`
    );
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`,
      "_blank"
    );
    setShowShareMenu(false);
  };

  const handleShareToTwitter = () => {
    if (!destination) return;
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(
      `Check out ${destination.name} - ${destination.description}`
    );
    window.open(
      `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
      "_blank"
    );
    setShowShareMenu(false);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = window.location.href;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
    setShowShareMenu(false);
  };

  const toggleShareMenu = () => {
    setShowShareMenu(!showShareMenu);
  };

  // Load auth state from localStorage on component mount
  useEffect(() => {
    const savedUser = loadAuthState();
    if (savedUser) {
      setUser(savedUser);
    }
  }, []);

  // Fetch specific tour data from API
  useEffect(() => {
    const fetchTour = async () => {
      try {
        setLoading(true);
        setError(null);

        // First check if id is a documentId (string) or numeric ID
        if (isNaN(parseInt(id))) {
          // Try to get tour by documentId
          try {
            const apiTour = await ToursService.getTourByDocumentId(id);
            const transformedTour = transformApiTourToLocal(apiTour);
            setDestination(transformedTour);
            console.log(
              "✅ Tour loaded from API by documentId:",
              transformedTour
            );
            return;
          } catch (docIdError) {
            console.log("⚠️ Tour documentId not found:", id);
          }
        } else {
          // Try to get specific tour by numeric ID
          try {
            const apiTour = await ToursService.getTourById(parseInt(id));
            const transformedTour = transformApiTourToLocal(apiTour);
            setDestination(transformedTour);
            console.log("✅ Tour loaded from API by ID:", transformedTour);
            return;
          } catch (idError) {
            console.log(
              "⚠️ Tour ID not found, will try documentId approach..."
            );
          }
        }

        // Fallback: Get all tours and find by ID, then fetch full details by documentId
        const allTours = await ToursService.getAllTours();
        const tourMatch = allTours.find((tour) => tour.id === parseInt(id));

        if (tourMatch && tourMatch.documentId) {
          // Fetch full tour details using documentId to get all populated fields
          try {
            const fullApiTour = await ToursService.getTourByDocumentId(
              tourMatch.documentId
            );
            const transformedTour = transformApiTourToLocal(fullApiTour);
            setDestination(transformedTour);
            console.log(
              "✅ Full tour details loaded by documentId:",
              transformedTour
            );
          } catch (docIdError) {
            console.log(
              "⚠️ DocumentId fetch failed, using basic tour data:",
              tourMatch
            );
            const transformedTour = transformApiTourToLocal(tourMatch);
            setDestination(transformedTour);
          }
        } else {
          throw new Error(`Tour with ID ${id} not found`);
        }
      } catch (error) {
        console.error("❌ Failed to fetch tour:", error);
        setError("Failed to load tour details. Using offline data.");

        // Fallback to static data
        const fallbackTour = fallbackDestinations.find(
          (d) => d.id === parseInt(id)
        );
        if (fallbackTour) {
          setDestination(fallbackTour);
          console.log("⚠️ Using fallback destination:", fallbackTour);
        } else {
          setDestination(fallbackDestinations[0]); // Use first fallback
          console.log("⚠️ Using first fallback destination");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTour();
  }, [id]);

  // Fetch related tours
  useEffect(() => {
    const fetchRelatedTours = async () => {
      try {
        const allTours = await ToursService.getAllTours();
        // Transform all tours and filter out current tour
        const availableTours = allTours
          .map(transformApiTourToLocal)
          .filter(
            (tour) =>
              tour.documentId !== destination?.documentId &&
              tour.id !== destination?.id
          );

        // Shuffle array using Fisher-Yates algorithm for better randomization
        const shuffledTours = [...availableTours];
        for (let i = shuffledTours.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffledTours[i], shuffledTours[j]] = [
            shuffledTours[j],
            shuffledTours[i],
          ];
        }

        // Take first 3 from shuffled array
        const transformedTours = shuffledTours.slice(0, 3);
        setRelatedTours(transformedTours);
      } catch (error) {
        console.error("Error fetching related tours:", error);
      }
    };

    // Only fetch related tours if we have the current destination loaded
    if (destination) {
      fetchRelatedTours();
    }
  }, [destination]);

  // Fetch feedback for the current destination
  useEffect(() => {
    const fetchFeedback = async () => {
      if (!destination) return;

      try {
        setLoadingComments(true);

        // Get tour slug from destination
        const tourSlug =
          destination.slug ||
          destination.name.toLowerCase().replace(/\s+/g, "-");

        // Fetch feedback and stats
        const [feedbacks, stats] = await Promise.all([
          FeedbackService.getFeedbackByTourSlug(tourSlug),
          FeedbackService.getFeedbackStats(tourSlug),
        ]);

        // Transform feedback to local format
        const transformedFeedbacks = feedbacks.map(transformApiFeedbackToLocal);

        setComments(transformedFeedbacks);
        setFeedbackStats(stats);

        console.log(
          "✅ Feedback loaded from API:",
          transformedFeedbacks.length,
          "reviews"
        );
        console.log("✅ Feedback stats:", stats);
      } catch (error) {
        console.error("❌ Failed to fetch feedback:", error);
        // Keep empty array on error
        setComments([]);
        setFeedbackStats({
          total: 0,
          averageRating: 0,
          ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
        });
      } finally {
        setLoadingComments(false);
      }
    };

    fetchFeedback();
  }, [destination]);

  // Google OAuth functions
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
    } catch {
      console.error("Error processing login");
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
      } catch {
        console.error("Failed to initialize Google OAuth");
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
        window.google.accounts.id.prompt((notification) => {
          if (
            notification.isNotDisplayed?.() ||
            notification.isSkippedMoment?.()
          ) {
            console.log(
              "Google Sign-In prompt not displayed:",
              notification.getNotDisplayedReason?.()
            );
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
      "Google Sign-In is currently unavailable. Use the mock login for testing."
    );
  };

  const logout = () => {
    setUser(null);
    clearAuthState(); // Clear from localStorage
    if (window.google?.accounts?.id) {
      window.google.accounts.id.disableAutoSelect();
    }
  };

  const handleBookNow = () => {
    if (!destination) return;

    const message = `Hi! I'd like to book a tour:

🏖️ *${destination.name}*
📍 Location: ${destination.location}
📅 Date: ${bookingForm.date}
👥 Guests: ${bookingForm.guests} ${
      bookingForm.guests === 1 ? "person" : "people"
    }
⏰ Start Time: ${bookingForm.startTime}
⏳ Duration: ${bookingForm.duration}
💰 Total Price: $${destination.price * bookingForm.guests}

Please confirm availability and provide payment details. Thank you!`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappURL = `https://wa.me/6282236969768?text=${encodedMessage}`;

    window.open(whatsappURL, "_blank");
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newComment.comment.trim() || !destination) return;

    setSubmittingComment(true);

    try {
      const feedbackPayload: FeedbackPayload = {
        name: user.name,
        rating_star: newComment.rating,
        comment: newComment.comment.trim(),
      };

      const submittedFeedback = await FeedbackService.submitFeedback(
        feedbackPayload
      );
      const transformedFeedback =
        transformApiFeedbackToLocal(submittedFeedback);

      // Add to local state
      setComments((prev) => [transformedFeedback, ...prev]);

      // Update stats
      setFeedbackStats((prev) => ({
        total: prev.total + 1,
        averageRating:
          (prev.averageRating * prev.total + newComment.rating) /
          (prev.total + 1),
        ratingDistribution: {
          ...prev.ratingDistribution,
          [newComment.rating]: prev.ratingDistribution[newComment.rating] + 1,
        },
      }));

      // Reset form
      setNewComment({ rating: 5, comment: "" });

      console.log("✅ Feedback submitted successfully:", submittedFeedback);
    } catch (error) {
      console.error("❌ Failed to submit feedback:", error);
      alert("Failed to submit review. Please try again.");
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleHelpful = (commentId: number) => {
    setComments((prev) =>
      prev.map((comment) =>
        comment.id === commentId
          ? { ...comment, helpful: comment.helpful + 1 }
          : comment
      )
    );
  };

  // Keyboard navigation for gallery
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!galleryState.isOpen) return;

      switch (event.key) {
        case "Escape":
          closeGallery();
          break;
        case "ArrowLeft":
          event.preventDefault();
          navigateGallery("prev");
          break;
        case "ArrowRight":
          event.preventDefault();
          navigateGallery("next");
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [galleryState.isOpen, navigateGallery, closeGallery]);

  // Close share menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showShareMenu) {
        const target = event.target as HTMLElement;
        if (!target.closest(".relative")) {
          setShowShareMenu(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showShareMenu]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            {/* Header skeleton */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 bg-gray-300 rounded-lg"></div>
              <div className="h-6 bg-gray-300 rounded w-32"></div>
            </div>

            {/* Hero section skeleton */}
            <div className="w-full h-96 bg-gray-300 rounded-lg mb-8"></div>

            {/* Content skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="h-8 bg-gray-300 rounded w-3/4"></div>
                <div className="h-4 bg-gray-300 rounded w-full"></div>
                <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="border rounded-lg p-4">
                      <div className="h-6 bg-gray-300 rounded w-1/2 mb-2"></div>
                      <div className="h-4 bg-gray-300 rounded w-full"></div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <div className="border rounded-lg p-6">
                  <div className="h-6 bg-gray-300 rounded w-3/4 mb-4"></div>
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-300 rounded w-full"></div>
                    <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                    <div className="h-10 bg-green-300 rounded w-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state (destination not found)
  if (!destination) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Destination Not Found
          </h1>
          <p className="text-gray-600 mb-4">
            The destination you&apos;re looking for doesn&apos;t exist.
          </p>
          <Link href="/" className="text-green-600 hover:text-green-700">
            Return to Home
          </Link>
        </div>
      </div>
    );
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
      <header className="border-b border-gray-200 bg-white/90 md:bg-white/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/70 supports-[backdrop-filter]:md:bg-white/60 shadow-sm md:shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 md:gap-4 min-w-0 flex-1">
              <Link href="/">
                <Button variant="ghost" size="sm" className="p-2 md:px-3">
                  <ArrowLeft className="w-4 h-4 md:mr-2" />
                  <span className="hidden md:inline">Back to search</span>
                </Button>
              </Link>
              <h1 className="text-lg md:text-2xl font-bold text-green-600 truncate">
                The honest Tour
              </h1>
            </div>
            <div className="flex gap-1 md:gap-2 flex-shrink-0">
              <Button variant="outline" size="sm" className="p-2 md:px-3">
                <Heart className="w-4 h-4 md:mr-2" />
                <span className="hidden md:inline">Save</span>
              </Button>
              <div className="relative">
                <Button
                  variant="outline"
                  size="sm"
                  className="p-2 md:px-3"
                  onClick={toggleShareMenu}
                >
                  <Share2 className="w-4 h-4 md:mr-2" />
                  <span className="hidden md:inline">Share</span>
                </Button>
                {showShareMenu && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                    <div className="py-2">
                      <button
                        onClick={handleShareToFacebook}
                        className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3 text-sm"
                      >
                        <Facebook className="w-4 h-4 text-blue-600" />
                        Share to Facebook
                      </button>
                      <button
                        onClick={handleShareToTwitter}
                        className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3 text-sm"
                      >
                        <Twitter className="w-4 h-4 text-blue-400" />
                        Share to Twitter
                      </button>
                      <button
                        onClick={handleCopyLink}
                        className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3 text-sm"
                      >
                        <LinkIcon className="w-4 h-4 text-gray-600" />
                        Copy Link
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Authentication Button */}
              {user ? (
                <div className="flex items-center gap-2 ml-2">
                  <div className="flex items-center gap-2">
                    <Image
                      src={user.picture}
                      alt={user.name}
                      width={32}
                      height={32}
                      className="w-6 h-6 md:w-8 md:h-8 rounded-full"
                    />
                    <span className="hidden md:inline text-sm font-medium truncate max-w-[100px]">
                      {user.name}
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={logout}
                    className="text-xs p-1 md:p-2"
                  >
                    <span className="hidden md:inline">Logout</span>
                    <span className="md:hidden">Out</span>
                  </Button>
                </div>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  className="p-2 md:px-3 ml-2"
                  onClick={openLoginModal}
                >
                  <User className="w-4 h-4 md:mr-2" />
                  <span className="hidden md:inline">Login</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main>
        {/* Error Message */}
        {error && (
          <div className="container mx-auto px-4 pt-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2 text-yellow-800">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="font-medium">{error}</span>
              </div>
            </div>
          </div>
        )}

        {/* Title Section */}
        <div className="container mx-auto px-4 py-6 md:py-8">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl md:text-3xl font-bold mb-2 leading-tight">
                {destination.name}
              </h1>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-muted-foreground">
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                  <span className="text-sm md:text-base">
                    {destination.location}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 flex-shrink-0" />
                  <span className="font-semibold text-sm md:text-base">
                    {feedbackStats.averageRating > 0
                      ? feedbackStats.averageRating
                      : "No rating"}
                  </span>
                  <span className="text-sm md:text-base">
                    ({feedbackStats.total.toLocaleString()} reviews)
                  </span>
                </div>
                <Badge className="bg-green-600 hover:bg-green-700 self-start">
                  {destination.category}
                </Badge>
              </div>
            </div>
            <div className="text-left md:text-right flex-shrink-0">
              <div className="text-2xl md:text-3xl font-bold">
                ${destination.price}
              </div>
              <div className="text-sm text-muted-foreground">
                {destination.category.includes("Hotel") ||
                destination.category.includes("Resort")
                  ? "per night"
                  : destination.price === 0
                  ? "Free admission"
                  : "per person"}
              </div>
            </div>
          </div>
        </div>

        {/* Image Gallery Section */}
        <div className="w-full">
          <div className="container mx-auto px-4">
            {/* Mobile Carousel */}
            <div className="md:hidden">
              <div className="relative h-64 rounded-lg overflow-hidden">
                <div
                  className="flex transition-transform duration-300 ease-in-out h-full"
                  style={{
                    transform: `translateX(-${
                      galleryState.currentImageIndex * 100
                    }%)`,
                  }}
                >
                  {destination.images.map((image, index) => (
                    <div
                      key={index}
                      className="w-full h-full flex-shrink-0 relative"
                    >
                      <Image
                        src={image}
                        alt={`${destination.name} - Image ${index + 1}`}
                        width={800}
                        height={600}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>

                {/* Navigation Arrows */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigateGallery("prev")}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-700 w-8 h-8 rounded-full"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigateGallery("next")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-700 w-8 h-8 rounded-full"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>

                {/* Dots Indicator */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {destination.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => selectImage(index)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === galleryState.currentImageIndex
                          ? "bg-white w-6"
                          : "bg-white/50 hover:bg-white/80"
                      }`}
                    />
                  ))}
                </div>

                {/* View All Photos Button */}
                <div className="absolute top-4 right-4">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => openGallery(galleryState.currentImageIndex)}
                    className="bg-black/50 text-white hover:bg-black/70"
                  >
                    View all ({destination.images.length})
                  </Button>
                </div>
              </div>
            </div>

            {/* Desktop Grid */}
            <div
              className="hidden md:grid grid-cols-4 gap-2"
              style={{ height: "400px" }}
            >
              <div
                className="col-span-2 row-span-2 cursor-pointer overflow-hidden rounded-l-lg"
                onClick={() => openGallery(0)}
              >
                <Image
                  src={destination.images[0]}
                  alt={destination.name}
                  width={800}
                  height={600}
                  className="w-full h-full object-cover hover:brightness-110 transition-all duration-300"
                />
              </div>
              <div
                className="cursor-pointer overflow-hidden"
                onClick={() => openGallery(1)}
              >
                <Image
                  src={destination.images[1]}
                  alt={destination.name}
                  width={400}
                  height={300}
                  className="w-full h-full object-cover hover:brightness-110 transition-all duration-300"
                />
              </div>
              <div
                className="cursor-pointer overflow-hidden rounded-tr-lg"
                onClick={() => openGallery(2)}
              >
                <Image
                  src={destination.images[2]}
                  alt={destination.name}
                  width={400}
                  height={300}
                  className="w-full h-full object-cover hover:brightness-110 transition-all duration-300"
                />
              </div>
              <div
                className="cursor-pointer overflow-hidden"
                onClick={() => openGallery(3)}
              >
                <Image
                  src={destination.images[3]}
                  alt={destination.name}
                  width={400}
                  height={300}
                  className="w-full h-full object-cover hover:brightness-110 transition-all duration-300"
                />
              </div>
              <div
                className="relative cursor-pointer overflow-hidden rounded-br-lg"
                onClick={() => openGallery(0)}
              >
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
              {/* Tour Details */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Tour Details</CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleSection("tourDetails")}
                      className="p-2"
                    >
                      {collapsedSections.tourDetails ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronUp className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </CardHeader>
                {!collapsedSections.tourDetails && (
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-muted-foreground leading-relaxed">
                        {destination.fullDescription}
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                        <div className="space-y-2">
                          <h4 className="font-semibold flex items-center gap-2">
                            <Clock className="w-4 h-4 text-green-600" />
                            Duration
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            4 days, 3 nights
                          </p>
                        </div>
                        <div className="space-y-2">
                          <h4 className="font-semibold flex items-center gap-2">
                            <Users className="w-4 h-4 text-green-600" />
                            Group Size
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            Maximum 12 people
                          </p>
                        </div>
                        <div className="space-y-2">
                          <h4 className="font-semibold flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-green-600" />
                            Meeting Point
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {destination.location}
                          </p>
                        </div>
                        <div className="space-y-2">
                          <h4 className="font-semibold flex items-center gap-2">
                            <Star className="w-4 h-4 text-green-600" />
                            Difficulty Level
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            Easy to Moderate
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>

              {/* Additional Information */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Additional Information</CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleSection("additionalInfo")}
                      className="p-2"
                    >
                      {collapsedSections.additionalInfo ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronUp className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </CardHeader>
                {!collapsedSections.additionalInfo && (
                  <CardContent>
                    <div className="space-y-4">
                      {destination?.additional_information &&
                      destination.additional_information.length > 0 ? (
                        destination.additional_information.map(
                          (section, sectionIndex) => {
                            // Handle different types of content sections
                            if (
                              section.type === "paragraph" &&
                              section.children
                            ) {
                              return (
                                <div key={sectionIndex} className="text-sm">
                                  <p>
                                    {section.children.map(
                                      (child, childIndex) => {
                                        if (child.type === "text") {
                                          return (
                                            <span
                                              key={childIndex}
                                              className={`${
                                                child.bold
                                                  ? "font-semibold text-foreground"
                                                  : "text-muted-foreground"
                                              }`}
                                            >
                                              {child.text}
                                            </span>
                                          );
                                        }
                                        return null;
                                      }
                                    )}
                                  </p>
                                </div>
                              );
                            }

                            // Handle list sections (if any)
                            if (section.type === "list" && section.children) {
                              return (
                                <ul
                                  key={sectionIndex}
                                  className="space-y-1 text-sm text-muted-foreground ml-4"
                                >
                                  {section.children.map(
                                    (listItem, listIndex) => (
                                      <li key={listIndex} className="list-disc">
                                        {listItem.children
                                          ?.map((child, childIndex) => (
                                            <span key={childIndex}>
                                              {child.text}
                                            </span>
                                          ))
                                          .join(" ")}
                                      </li>
                                    )
                                  )}
                                </ul>
                              );
                            }

                            return null;
                          }
                        )
                      ) : (
                        <div>
                          <h4 className="font-semibold mb-2">
                            Important Information
                          </h4>
                          <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>• Minimum age requirement: 12 years old</li>
                            <li>
                              • Weather dependent activities - alternative
                              indoor options available
                            </li>
                            <li>
                              • Professional photography service available for
                              additional cost
                            </li>
                            <li>
                              • Vegetarian and dietary restrictions can be
                              accommodated
                            </li>
                            <li>
                              • Free cancellation up to 24 hours before the tour
                            </li>
                          </ul>
                        </div>
                      )}
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
                        {destination?.itenary && destination.itenary.length > 0
                          ? `${destination.itenary.length}-Day Itinerary`
                          : "Tour Itinerary"}
                      </CardTitle>
                      <CardDescription>
                        Complete schedule for your {destination?.name || "tour"}{" "}
                        experience
                      </CardDescription>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleSection("schedule")}
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
                      {destination?.itenary && destination.itenary.length > 0
                        ? destination.itenary.map((daySchedule, index) => (
                            <div
                              key={daySchedule.id}
                              className="border-l-2 border-green-200 pl-6 relative"
                            >
                              <div className="absolute -left-2 top-0 w-4 h-4 bg-green-600 rounded-full"></div>
                              <div className="mb-4">
                                <h3 className="text-lg font-semibold text-green-600">
                                  {daySchedule.itenary_caption}
                                </h3>
                              </div>
                            </div>
                          ))
                        : destination?.tourSchedule?.map((daySchedule) => (
                            <div
                              key={daySchedule.day}
                              className="border-l-2 border-green-200 pl-6 relative"
                            >
                              <div className="absolute -left-2 top-0 w-4 h-4 bg-green-600 rounded-full"></div>
                              <div className="mb-4">
                                <h3 className="text-lg font-semibold text-green-600">
                                  Day {daySchedule.day}: {daySchedule.title}
                                </h3>
                              </div>
                              <div className="space-y-3">
                                {daySchedule.activities.map(
                                  (activity, activityIndex) => (
                                    <div
                                      key={activityIndex}
                                      className="flex items-start gap-4 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                                    >
                                      <div className="flex items-center gap-2 text-sm text-green-600 font-mono min-w-0">
                                        <Clock className="w-4 h-4 flex-shrink-0" />
                                        <span className="font-semibold">
                                          {activity.time}
                                        </span>
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <p className="font-medium text-foreground">
                                          {activity.activity}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                          {activity.description}
                                        </p>
                                      </div>
                                    </div>
                                  )
                                )}
                              </div>
                            </div>
                          ))}
                    </div>
                    {destination?.main_important_notes && (
                      <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-white text-xs">!</span>
                          </div>
                          <div>
                            <p className="font-medium text-green-800">
                              {destination.main_important_notes.caption}
                            </p>
                            <p className="text-sm text-green-700 mt-1">
                              {destination.main_important_notes.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                )}
              </Card>

              {/* Includes */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Includes</CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleSection("includes")}
                      className="p-2"
                    >
                      {collapsedSections.includes ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronUp className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </CardHeader>
                {!collapsedSections.includes && (
                  <CardContent>
                    <div className="grid grid-cols-1 gap-6">
                      <div>
                        {destination?.includes &&
                        destination.includes.length > 0 ? (
                          destination.includes.map((section, sectionIndex) => {
                            // Handle different types of content sections
                            if (
                              section.type === "paragraph" &&
                              section.children
                            ) {
                              return (
                                <div key={sectionIndex} className="mb-3">
                                  <h4 className="font-semibold text-green-600">
                                    {section.children.map(
                                      (child, childIndex) => {
                                        if (child.type === "text") {
                                          return (
                                            <span
                                              key={childIndex}
                                              className={
                                                child.bold
                                                  ? "font-bold"
                                                  : "font-semibold"
                                              }
                                            >
                                              ✓ {child.text}
                                            </span>
                                          );
                                        }
                                        return null;
                                      }
                                    )}
                                  </h4>
                                </div>
                              );
                            }

                            // Handle list sections
                            if (section.type === "list" && section.children) {
                              return (
                                <ul
                                  key={sectionIndex}
                                  className="space-y-2 mb-4"
                                >
                                  {section.children.map(
                                    (listItem, listIndex) => (
                                      <li
                                        key={listIndex}
                                        className="flex items-start gap-2 text-sm"
                                      >
                                        <span className="text-green-600 mt-0.5">
                                          •
                                        </span>
                                        <span>
                                          {listItem.children?.map(
                                            (child, childIndex) => (
                                              <span
                                                key={childIndex}
                                                className={
                                                  child.bold
                                                    ? "font-semibold"
                                                    : ""
                                                }
                                              >
                                                {child.text}
                                              </span>
                                            )
                                          )}
                                        </span>
                                      </li>
                                    )
                                  )}
                                </ul>
                              );
                            }

                            return null;
                          })
                        ) : (
                          <>
                            <h4 className="font-semibold mb-3 text-green-600">
                              ✓ Included
                            </h4>
                            <ul className="space-y-2">
                              <li className="flex items-start gap-2 text-sm">
                                <span className="text-green-600 mt-0.5">•</span>
                                <span>Professional English-speaking guide</span>
                              </li>
                              <li className="flex items-start gap-2 text-sm">
                                <span className="text-green-600 mt-0.5">•</span>
                                <span>All entrance fees and tickets</span>
                              </li>
                              <li className="flex items-start gap-2 text-sm">
                                <span className="text-green-600 mt-0.5">•</span>
                                <span>
                                  Transportation in air-conditioned vehicle
                                </span>
                              </li>
                            </ul>
                          </>
                        )}
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>

              {/* What to Bring */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>What to Bring</CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleSection("whatToBring")}
                      className="p-2"
                    >
                      {collapsedSections.whatToBring ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronUp className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </CardHeader>
                {!collapsedSections.whatToBring && (
                  <CardContent>
                    <div className="grid grid-cols-1 gap-6">
                      <div>
                        {destination?.what_to_bring &&
                        destination.what_to_bring.length > 0 ? (
                          destination.what_to_bring.map(
                            (section, sectionIndex) => {
                              // Handle different types of content sections
                              if (
                                section.type === "paragraph" &&
                                section.children
                              ) {
                                return (
                                  <div key={sectionIndex} className="mb-3">
                                    <h4 className="font-semibold text-blue-600">
                                      {section.children.map(
                                        (child, childIndex) => {
                                          if (child.type === "text") {
                                            return (
                                              <span
                                                key={childIndex}
                                                className={
                                                  child.bold
                                                    ? "font-bold"
                                                    : "font-semibold"
                                                }
                                              >
                                                {child.text}
                                              </span>
                                            );
                                          }
                                          return null;
                                        }
                                      )}
                                    </h4>
                                  </div>
                                );
                              }

                              // Handle list sections
                              if (section.type === "list" && section.children) {
                                return (
                                  <ul
                                    key={sectionIndex}
                                    className="space-y-2 mb-4"
                                  >
                                    {section.children.map(
                                      (listItem, listIndex) => (
                                        <li
                                          key={listIndex}
                                          className="flex items-center gap-2 text-sm"
                                        >
                                          <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                                          <span>
                                            {listItem.children?.map(
                                              (child, childIndex) => (
                                                <span
                                                  key={childIndex}
                                                  className={
                                                    child.bold
                                                      ? "font-semibold"
                                                      : ""
                                                  }
                                                >
                                                  {child.text}
                                                </span>
                                              )
                                            )}
                                          </span>
                                        </li>
                                      )
                                    )}
                                  </ul>
                                );
                              }

                              return null;
                            }
                          )
                        ) : (
                          <>
                            <h4 className="font-semibold mb-3 text-blue-600">
                              Essential Items
                            </h4>
                            <ul className="space-y-2">
                              <li className="flex items-center gap-2 text-sm">
                                <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                                <span>Comfortable walking shoes</span>
                              </li>
                              <li className="flex items-center gap-2 text-sm">
                                <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                                <span>Sun hat and sunglasses</span>
                              </li>
                              <li className="flex items-center gap-2 text-sm">
                                <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                                <span>Sunscreen (SPF 30+ recommended)</span>
                              </li>
                            </ul>
                          </>
                        )}
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>

              {/* FAQ */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>FAQ</CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleSection("faq")}
                      className="p-2"
                    >
                      {collapsedSections.faq ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronUp className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </CardHeader>
                {!collapsedSections.faq && (
                  <CardContent>
                    <div className="space-y-6">
                      {destination?.faq_main &&
                      destination.faq_main.length > 0 ? (
                        destination.faq_main.map((faq, index) => (
                          <div
                            key={faq.id}
                            className={
                              index < destination.faq_main.length - 1
                                ? "border-b border-gray-100 pb-4"
                                : ""
                            }
                          >
                            <h4 className="font-semibold mb-2">
                              {faq.caption}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {faq.faq_desc}
                            </p>
                          </div>
                        ))
                      ) : (
                        <>
                          <div className="border-b border-gray-100 pb-4">
                            <h4 className="font-semibold mb-2">
                              What happens if it rains?
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              We provide covered areas and indoor alternatives.
                              Tours continue in light rain with provided rain
                              gear, but may be postponed in heavy storms for
                              safety.
                            </p>
                          </div>
                          <div className="border-b border-gray-100 pb-4">
                            <h4 className="font-semibold mb-2">
                              Can I cancel my booking?
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              Yes, free cancellation is available up to 24 hours
                              before the tour. Cancellations within 24 hours are
                              subject to a 50% charge.
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  </CardContent>
                )}
              </Card>

              {/* Notes */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Notes</CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleSection("notes")}
                      className="p-2"
                    >
                      {collapsedSections.notes ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronUp className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </CardHeader>
                {!collapsedSections.notes && (
                  <CardContent>
                    <div className="space-y-4">
                      {destination?.notes_main &&
                      destination.notes_main.length > 0 ? (
                        destination.notes_main.map((note) => {
                          const getNotesStyle = (type: string) => {
                            switch (type) {
                              case "warning":
                                return {
                                  bg: "bg-yellow-50",
                                  border: "border-yellow-200",
                                  iconBg: "bg-yellow-500",
                                  textColor: "text-yellow-800",
                                  descColor: "text-yellow-700",
                                  icon: "!",
                                };
                              case "calm":
                                return {
                                  bg: "bg-blue-50",
                                  border: "border-blue-200",
                                  iconBg: "bg-blue-500",
                                  textColor: "text-blue-800",
                                  descColor: "text-blue-700",
                                  icon: "i",
                                };
                              case "good":
                                return {
                                  bg: "bg-green-50",
                                  border: "border-green-200",
                                  iconBg: "bg-green-500",
                                  textColor: "text-green-800",
                                  descColor: "text-green-700",
                                  icon: "✓",
                                };
                              case "emergency":
                                return {
                                  bg: "bg-red-50",
                                  border: "border-red-200",
                                  iconBg: "bg-red-500",
                                  textColor: "text-red-800",
                                  descColor: "text-red-700",
                                  icon: "⚠",
                                };
                              case "destroy":
                              default:
                                return {
                                  bg: "bg-gray-50",
                                  border: "border-gray-200",
                                  iconBg: "bg-gray-500",
                                  textColor: "text-gray-800",
                                  descColor: "text-gray-700",
                                  icon: "•",
                                };
                            }
                          };

                          const style = getNotesStyle(note.notes_type);

                          return (
                            <div
                              key={note.id}
                              className={`p-4 ${style.bg} rounded-lg border ${style.border}`}
                            >
                              <div className="flex items-start gap-3">
                                <div
                                  className={`w-6 h-6 ${style.iconBg} rounded-full flex items-center justify-center flex-shrink-0`}
                                >
                                  <span className="text-white text-xs font-bold">
                                    {style.icon}
                                  </span>
                                </div>
                                <div>
                                  <p
                                    className={`font-semibold ${style.textColor} mb-1`}
                                  >
                                    {note.title}
                                  </p>
                                  <p className={`text-sm ${style.descColor}`}>
                                    {note.desc}
                                  </p>
                                </div>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <>
                          <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                            <div className="flex items-start gap-3">
                              <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-white text-xs font-bold">
                                  !
                                </span>
                              </div>
                              <div>
                                <p className="font-semibold text-yellow-800 mb-1">
                                  Important Safety Information
                                </p>
                                <p className="text-sm text-yellow-700">
                                  Please follow all safety instructions from
                                  your guide. Some activities may not be
                                  suitable for pregnant women or people with
                                  heart conditions.
                                </p>
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </CardContent>
                )}
              </Card>

              {/* Comments Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageCircle className="w-5 h-5" />
                    Reviews & Comments ({feedbackStats.total})
                  </CardTitle>
                  {feedbackStats.total > 0 && (
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < Math.round(feedbackStats.averageRating)
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="font-semibold">
                          {feedbackStats.averageRating}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          ({feedbackStats.total} review
                          {feedbackStats.total !== 1 ? "s" : ""})
                        </span>
                      </div>
                    </div>
                  )}
                </CardHeader>
                <CardContent>
                  {/* Comment Form - Only show if user is logged in */}
                  {user ? (
                    <div className="mb-8 p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3 mb-4">
                        <Image
                          src={user.picture}
                          alt={user.name}
                          width={40}
                          height={40}
                          className="w-10 h-10 rounded-full"
                        />
                        <div>
                          <p className="font-semibold text-sm">{user.name}</p>
                          <p className="text-xs text-muted-foreground">
                            Share your experience
                          </p>
                        </div>
                      </div>

                      <form
                        onSubmit={handleSubmitComment}
                        className="space-y-4"
                      >
                        {/* Rating */}
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Your Rating
                          </label>
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() =>
                                  setNewComment((prev) => ({
                                    ...prev,
                                    rating: star,
                                  }))
                                }
                                className="focus:outline-none"
                              >
                                <Star
                                  className={`w-6 h-6 ${
                                    star <= newComment.rating
                                      ? "fill-yellow-400 text-yellow-400"
                                      : "text-gray-300"
                                  }`}
                                />
                              </button>
                            ))}
                            <span className="ml-2 text-sm text-muted-foreground">
                              ({newComment.rating} star
                              {newComment.rating !== 1 ? "s" : ""})
                            </span>
                          </div>
                        </div>

                        {/* Comment Text */}
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Your Review
                          </label>
                          <textarea
                            value={newComment.comment}
                            onChange={(e) =>
                              setNewComment((prev) => ({
                                ...prev,
                                comment: e.target.value,
                              }))
                            }
                            placeholder="Share your thoughts about this tour..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                            rows={4}
                          />
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end">
                          <Button
                            type="submit"
                            className="bg-green-600 hover:bg-green-700"
                            disabled={
                              !newComment.comment.trim() || submittingComment
                            }
                          >
                            {submittingComment ? (
                              <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Submitting...
                              </>
                            ) : (
                              "Post Review"
                            )}
                          </Button>
                        </div>
                      </form>
                    </div>
                  ) : (
                    <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center gap-3">
                        <MessageCircle className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="text-sm font-medium text-blue-800">
                            Want to leave a review?
                          </p>
                          <p className="text-sm text-blue-600">
                            <button
                              onClick={openLoginModal}
                              className="underline hover:no-underline font-medium"
                            >
                              Sign in
                            </button>{" "}
                            to share your experience with other travelers.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Comments List */}
                  {loadingComments ? (
                    <div className="space-y-6">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="animate-pulse border-b border-gray-100 pb-6"
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-gray-300 rounded-full flex-shrink-0"></div>
                            <div className="flex-1 space-y-2">
                              <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                              <div className="flex items-center gap-1">
                                {Array.from({ length: 5 }).map((_, j) => (
                                  <div
                                    key={j}
                                    className="w-4 h-4 bg-gray-300 rounded"
                                  ></div>
                                ))}
                              </div>
                              <div className="space-y-2">
                                <div className="h-4 bg-gray-300 rounded w-full"></div>
                                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {comments.length > 0 ? (
                        comments.map((comment) => (
                          <div
                            key={comment.id}
                            className="border-b border-gray-100 pb-6 last:border-b-0 last:pb-0"
                          >
                            <div className="flex items-start gap-3">
                              <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0 ${comment.user.backgroundColor}`}
                              >
                                {comment.user.initials}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-2">
                                  <div>
                                    <p className="font-semibold text-sm">
                                      {comment.user.name}
                                    </p>
                                    <div className="flex items-center gap-2">
                                      <div className="flex items-center">
                                        {Array.from({
                                          length: comment.rating,
                                        }).map((_, i) => (
                                          <Star
                                            key={i}
                                            className="w-4 h-4 fill-yellow-400 text-yellow-400"
                                          />
                                        ))}
                                      </div>
                                      <span className="text-xs text-muted-foreground">
                                        {comment.date}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                                  {comment.comment}
                                </p>
                                <div className="flex items-center gap-4">
                                  <button
                                    onClick={() => handleHelpful(comment.id)}
                                    className="flex items-center gap-1 text-xs text-muted-foreground hover:text-green-600 transition-colors"
                                  >
                                    <Heart className="w-4 h-4" />
                                    Helpful ({comment.helpful})
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8">
                          <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                          <h3 className="text-lg font-medium text-gray-900 mb-2">
                            No reviews yet
                          </h3>
                          <p className="text-gray-500">
                            Be the first to share your experience with this
                            tour!
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Load More Button - Only show if there are comments and not loading */}
                  {!loadingComments && comments.length > 0 && (
                    <div className="mt-8 text-center">
                      <Button variant="outline">Load More Reviews</Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Booking Card */}
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Book Your Tour</span>
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      {destination.rating}
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <h3 className="font-semibold">
                      Select Date and Participants
                    </h3>

                    {/* Date Selection */}
                    <div>
                      <label className="text-sm font-medium mb-1 block">
                        Date
                      </label>
                      <div className="relative">
                        <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="date"
                          value={bookingForm.date}
                          onChange={(e) =>
                            setBookingForm((prev) => ({
                              ...prev,
                              date: e.target.value,
                            }))
                          }
                          className="w-full pl-10 pr-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    {/* Guest Selection */}
                    <div>
                      <label className="text-sm font-medium mb-1 block">
                        Guests
                      </label>
                      <div className="flex items-center border rounded-md">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            setBookingForm((prev) => ({
                              ...prev,
                              guests: Math.max(1, prev.guests - 1),
                            }))
                          }
                          className="h-10 px-3 rounded-none"
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <div className="flex-1 text-center py-2 text-sm font-medium">
                          {bookingForm.guests}{" "}
                          {bookingForm.guests === 1 ? "guest" : "guests"}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            setBookingForm((prev) => ({
                              ...prev,
                              guests: Math.min(12, prev.guests + 1),
                            }))
                          }
                          className="h-10 px-3 rounded-none"
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Maximum 12 guests
                      </p>
                    </div>

                    {/* Starting Time */}
                    <div>
                      <label className="text-sm font-medium mb-1 block">
                        Starting Time
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {["4 AM", "6 AM", "8 AM"].map((time) => (
                          <Button
                            key={time}
                            variant={
                              bookingForm.startTime === time
                                ? "default"
                                : "outline"
                            }
                            size="sm"
                            onClick={() =>
                              setBookingForm((prev) => ({
                                ...prev,
                                startTime: time,
                              }))
                            }
                            className="h-9"
                          >
                            {time}
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Duration */}
                    <div>
                      <label className="text-sm font-medium mb-1 block">
                        Duration
                      </label>
                      <div className="flex items-center gap-2 p-2 border rounded-md bg-gray-50">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">{bookingForm.duration}</span>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Pricing Breakdown */}
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>
                        ${destination.price} x {bookingForm.guests} guests
                      </span>
                      <span>${destination.price * bookingForm.guests}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total Price</span>
                      <span>${destination.price * bookingForm.guests}</span>
                    </div>
                  </div>

                  <Button
                    className="w-full bg-green-600 hover:bg-green-700"
                    size="lg"
                    onClick={handleBookNow}
                  >
                    Book Now
                  </Button>
                  <p className="text-xs text-center text-muted-foreground">
                    Free cancellation up to 24 hours before the tour
                  </p>

                  <Separator />

                  {/* Contact Information */}
                  <div className="space-y-3">
                    <h4 className="font-semibold">Contact Information</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="w-4 h-4 text-green-600" />
                        <span>{destination.contact.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="w-4 h-4 text-green-600" />
                        <span>{destination.contact.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Globe className="w-4 h-4 text-green-600" />
                        <span>Visit website</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-green-600" />
                        <span>{destination.hours}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      {/* You Might Also Like Section */}
      {relatedTours.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                You might also like
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Discover more amazing experiences that other travelers have
                loved
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedTours.map((tour) => (
                <Card
                  key={tour.documentId || tour.id}
                  className="overflow-hidden group hover:shadow-xl transition-all duration-300 border-0 bg-white"
                >
                  <div className="relative">
                    <div className="aspect-[4/3] relative overflow-hidden">
                      <Image
                        src={tour.image}
                        alt={tour.name}
                        width={400}
                        height={300}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    {tour.category && (
                      <Badge className="absolute top-3 left-3 bg-green-600 hover:bg-green-700 text-white font-medium px-3 py-1">
                        {tour.category}
                      </Badge>
                    )}
                  </div>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-green-600 transition-colors line-clamp-2">
                          {tour.name}
                        </h3>
                        <div className="flex items-center text-gray-500 text-sm mt-1">
                          <MapPin className="w-4 h-4 mr-1" />
                          {tour.location}
                        </div>
                      </div>

                      <p className="text-gray-600 text-sm line-clamp-2">
                        {tour.description}
                      </p>

                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-semibold text-gray-900 ml-1">
                              {tour.rating}
                            </span>
                          </div>
                          {tour.reviews && (
                            <span className="text-sm text-gray-500">
                              ({tour.reviews.toLocaleString()})
                            </span>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-green-600">
                            ${tour.price}
                          </div>
                          <div className="text-xs text-gray-500">
                            per person
                          </div>
                        </div>
                      </div>

                      <Link
                        href={`/destination/${tour.documentId || tour.id}`}
                        className="block"
                      >
                        <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link href="/">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white px-8"
                >
                  View All Tours
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-green-400">
                The honest Tour
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Discover amazing destinations around the world with our curated
                travel experiences. Your journey to unforgettable memories
                starts here.
              </p>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="text-gray-400 hover:text-green-400 transition-colors"
                >
                  <Facebook className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-green-400 transition-colors"
                >
                  <Twitter className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-green-400 transition-colors"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-green-400 transition-colors"
                >
                  <Youtube className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/"
                    className="text-gray-300 hover:text-green-400 transition-colors text-sm"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-green-400 transition-colors text-sm"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-green-400 transition-colors text-sm"
                  >
                    Destinations
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-green-400 transition-colors text-sm"
                  >
                    Tours & Packages
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-green-400 transition-colors text-sm"
                  >
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
                  <a
                    href="#"
                    className="text-gray-300 hover:text-green-400 transition-colors text-sm"
                  >
                    Hotel Booking
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-green-400 transition-colors text-sm"
                  >
                    Flight Reservations
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-green-400 transition-colors text-sm"
                  >
                    Tour Packages
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-green-400 transition-colors text-sm"
                  >
                    Travel Insurance
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-green-400 transition-colors text-sm"
                  >
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
                  <span className="text-gray-300 text-sm">+62 82236969768</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-4 h-4 text-green-400 flex-shrink-0" />
                  <span className="text-gray-300 text-sm">
                    info@travelguide.com
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <Globe className="w-4 h-4 text-green-400 flex-shrink-0" />
                  <span className="text-gray-300 text-sm">
                    www.travelguide.com
                  </span>
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
                  Subscribe to our newsletter for the latest travel deals and
                  destinations.
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
              <a
                href="#"
                className="text-gray-400 hover:text-green-400 transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-green-400 transition-colors"
              >
                Terms of Service
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-green-400 transition-colors"
              >
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <a
          href={`https://wa.me/6282236969768?text=Hi! I'm interested in ${destination.name}. Can you help me with more information?`}
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
                    {galleryState.currentImageIndex + 1} of{" "}
                    {destination.images.length} photos
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
                  alt={`${destination.name} - Image ${
                    galleryState.currentImageIndex + 1
                  }`}
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
                      onClick={() => navigateGallery("prev")}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 w-12 h-12"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => navigateGallery("next")}
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
                        ? "border-white shadow-lg"
                        : "border-white/30 hover:border-white/60"
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

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-4 right-4 z-[70] bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-in slide-in-from-right-5 duration-300">
          <Check className="w-4 h-4" />
          <span>Link copied to clipboard!</span>
        </div>
      )}

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/50 z-[80] flex items-center justify-center p-4">
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
                <h2 className="text-2xl font-bold text-gray-900">
                  Welcome Back
                </h2>
                <p className="text-gray-600">
                  Sign in to access your account and continue your journey
                </p>
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
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    <span className="font-medium text-gray-700 group-hover:text-gray-900">
                      Continue with Google
                    </span>
                  </button>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">
                      For development testing
                    </span>
                  </div>
                </div>

                {/* Mock Login for Development */}
                <div className="space-y-4">
                  <Button
                    onClick={() => {
                      // Mock user data for development
                      const mockUser = {
                        name: "John Doe",
                        email: "john.doe@example.com",
                        picture:
                          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
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
                  Don&apos;t have an account?{" "}
                  <a
                    href="#"
                    className="text-green-600 hover:text-green-700 font-medium"
                  >
                    Sign up
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
