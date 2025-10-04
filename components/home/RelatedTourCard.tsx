"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FeedbackService } from "@/services/feedback";

interface RelatedTourCardProps {
  tour: {
    id: number;
    documentId?: string;
    name: string;
    location: string;
    rating: number;
    reviews: number;
    price: number;
    image: string;
    category: string;
    description: string;
  };
}

export function RelatedTourCard({ tour }: RelatedTourCardProps) {
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
        if (tour.documentId) {
          stats = await FeedbackService.getFeedbackStatsByTourDocumentId(tour.documentId);
        } else {
          stats = await FeedbackService.getFeedbackStatsByTourId(tour.id);
        }

        if (stats) {
          setFeedbackStats(stats);
        }
      } catch (error) {
        console.error("Error fetching feedback stats:", error);
      }
    };

    fetchFeedbackStats();
  }, [tour.id, tour.documentId]);

  return (
    <Card className="overflow-hidden group hover:shadow-xl transition-all duration-300 border-0 bg-white">
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
                  {feedbackStats.averageRating > 0
                    ? feedbackStats.averageRating
                    : "0"}
                </span>
              </div>
              <span className="text-sm text-gray-500">
                ({feedbackStats.total.toLocaleString()})
              </span>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-green-600">
                ${tour.price}
              </div>
              <div className="text-xs text-gray-500">per person</div>
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
  );
}
