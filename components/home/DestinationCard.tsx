import Link from "next/link";
import { MapPin, Star, Heart, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ImageCarousel } from "./ImageCarousel";

interface DestinationCardProps {
  destination: {
    id: number;
    documentId?: string;
    name: string;
    location: string;
    rating: number;
    reviews: number;
    price: number;
    image: string;
    images?: string[];
    category: string;
    description: string;
    amenities: string[];
  };
}

export function DestinationCard({ destination }: DestinationCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        <ImageCarousel
          images={destination.images || [destination.image]}
          alt={destination.name}
        />
        <div className="absolute top-3 right-3 flex gap-2">
          <Button
            size="icon"
            variant="secondary"
            className="h-8 w-8 rounded-full bg-white/80 hover:bg-white"
          >
            <Heart className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="secondary"
            className="h-8 w-8 rounded-full bg-white/80 hover:bg-white"
          >
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
            <CardTitle className="text-lg leading-tight">
              {destination.name}
            </CardTitle>
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
            <p className="text-sm text-muted-foreground">
              ({destination.reviews.toLocaleString()})
            </p>
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
                  {destination.category.includes("Hotel") ||
                  destination.category.includes("Resort")
                    ? "per night"
                    : "per person"}
                </span>
              </>
            )}
          </div>
          <Link
            href={`/destination/${destination.documentId || destination.id}`}
          >
            <Button>View Details</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
