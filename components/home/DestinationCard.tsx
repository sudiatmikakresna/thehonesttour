"use client";

import Link from "next/link";
import { MapPin, Star, Share2, Facebook, Twitter, Link as LinkIcon, Check } from "lucide-react";
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
import { useState, useEffect } from "react";
import { FeedbackService } from "@/services/feedback";

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
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [feedbackStats, setFeedbackStats] = useState({
    total: 0,
    averageRating: 0,
    ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  });

  // Fetch feedback stats from database
  useEffect(() => {
    const fetchFeedbackStats = async () => {
      try {
        let stats;
        if (destination.documentId) {
          stats = await FeedbackService.getFeedbackStatsByTourDocumentId(destination.documentId);
        } else {
          stats = await FeedbackService.getFeedbackStatsByTourId(destination.id);
        }

        if (stats) {
          setFeedbackStats(stats);
        }
      } catch (error) {
        console.error("Error fetching feedback stats:", error);
      }
    };

    fetchFeedbackStats();
  }, [destination.id, destination.documentId]);

  const getDestinationUrl = () => {
    if (typeof window !== "undefined") {
      return `${window.location.origin}/destination/${destination.documentId || destination.id}`;
    }
    return "";
  };

  const handleShareToFacebook = () => {
    const url = encodeURIComponent(getDestinationUrl());
    const text = encodeURIComponent(`Check out ${destination.name}!`);
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`,
      "_blank"
    );
    setShowShareMenu(false);
  };

  const handleShareToTwitter = () => {
    const url = encodeURIComponent(getDestinationUrl());
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
      await navigator.clipboard.writeText(getDestinationUrl());
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch {
      const textArea = document.createElement("textarea");
      textArea.value = getDestinationUrl();
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
    setShowShareMenu(false);
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        <ImageCarousel
          images={destination.images || [destination.image]}
          alt={destination.name}
        />
        <div className="absolute top-3 right-3 flex gap-2">
          <div className="relative">
            <Button
              size="icon"
              variant="secondary"
              className="h-8 w-8 rounded-full bg-white/80 hover:bg-white"
              onClick={() => setShowShareMenu(!showShareMenu)}
            >
              <Share2 className="h-4 w-4" />
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
        </div>
        {showToast && (
          <div className="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-50 flex items-center gap-2">
            <Check className="w-4 h-4" />
            Link copied to clipboard!
          </div>
        )}
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
              <span className="font-semibold">
                {feedbackStats.averageRating > 0
                  ? feedbackStats.averageRating
                  : "0"}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              ({feedbackStats.total.toLocaleString()})
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
