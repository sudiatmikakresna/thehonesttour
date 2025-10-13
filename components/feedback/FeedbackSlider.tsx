"use client";

import { useState, useEffect } from "react";
import { Star, ChevronLeft, ChevronRight, Quote, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FeedbackService, transformApiFeedbackToLocal } from "@/services/feedback";

interface FeedbackItem {
  id: number;
  user: {
    name: string;
    initials: string;
    backgroundColor: string;
  };
  rating: number;
  comment: string;
  date: string;
}

interface FeedbackSliderProps {
  tourId?: number;
  tourDocumentId?: string;
  title?: string;
  subtitle?: string;
}

export function FeedbackSlider({
  tourId,
  tourDocumentId,
  title = "What Our Travelers Say",
  subtitle = "Real experiences from real travelers",
}: FeedbackSliderProps) {
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Fetch feedbacks on mount
  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        setLoading(true);
        let apiFeedbacks;

        // If tourDocumentId is provided, fetch feedbacks for that tour
        if (tourDocumentId) {
          apiFeedbacks = await FeedbackService.getFeedbackByTourDocumentId(tourDocumentId);
        }
        // If tourId is provided, fetch feedbacks for that tour
        else if (tourId) {
          apiFeedbacks = await FeedbackService.getFeedbackByTourId(tourId);
        }
        // Otherwise, fetch all feedbacks
        else {
          apiFeedbacks = await FeedbackService.getAllFeedback();
        }

        // Transform to local format
        const transformedFeedbacks = apiFeedbacks.map(transformApiFeedbackToLocal);
        setFeedbacks(transformedFeedbacks);
        console.log(`✅ Loaded ${transformedFeedbacks.length} feedbacks for slider`);
      } catch (error) {
        console.error("❌ Failed to fetch feedbacks for slider:", error);
        setFeedbacks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, [tourId, tourDocumentId]);

  // Auto-advance slider every 5 seconds
  useEffect(() => {
    if (!isAutoPlaying || feedbacks.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % feedbacks.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, feedbacks.length]);

  const goToPrevious = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) =>
      prev === 0 ? feedbacks.length - 1 : prev - 1
    );
  };

  const goToNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % feedbacks.length);
  };

  const goToSlide = (index: number) => {
    setIsAutoPlaying(false);
    setCurrentIndex(index);
  };

  // Show loading state
  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-green-600 animate-spin" />
          </div>
        </div>
      </section>
    );
  }

  // Don't render if no feedbacks
  if (feedbacks.length === 0) {
    return null;
  }

  // Determine how many slides to show based on screen size
  const getVisibleSlides = () => {
    if (typeof window === 'undefined') return 1;
    if (window.innerWidth >= 1024) return 3; // lg
    if (window.innerWidth >= 768) return 2; // md
    return 1; // mobile
  };

  return (
    <section className="py-16 bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-green-200/20 to-blue-200/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-200/20 to-pink-200/20 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            {title}
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            {subtitle}
          </p>
          <div className="flex items-center justify-center gap-2 mt-4">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className="w-5 h-5 fill-yellow-400 text-yellow-400"
                />
              ))}
            </div>
            <span className="text-sm text-gray-600 font-medium">
              {feedbacks.length} {feedbacks.length === 1 ? 'review' : 'reviews'}
            </span>
          </div>
        </div>

        {/* Slider Container */}
        <div className="relative max-w-6xl mx-auto">
          {/* Main Slider */}
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{
                transform: `translateX(-${currentIndex * (100 / Math.min(feedbacks.length, 3))}%)`,
              }}
            >
              {feedbacks.map((feedback) => (
                <div
                  key={feedback.id}
                  className="w-full md:w-1/2 lg:w-1/3 flex-shrink-0 px-3"
                >
                  <div className="bg-white rounded-xl shadow-lg p-6 h-full flex flex-col transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
                    {/* Quote Icon */}
                    <div className="mb-4">
                      <Quote className="w-8 h-8 text-green-600 opacity-50" />
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-1 mb-4">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < feedback.rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>

                    {/* Comment */}
                    <p className="text-gray-700 text-sm md:text-base leading-relaxed mb-6 flex-grow line-clamp-4">
                      &ldquo;{feedback.comment}&rdquo;
                    </p>

                    {/* User Info */}
                    <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold ${feedback.user.backgroundColor}`}
                      >
                        {feedback.user.initials}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {feedback.user.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {feedback.date}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          {feedbacks.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={goToPrevious}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 bg-white hover:bg-gray-100 shadow-lg rounded-full w-10 h-10 md:w-12 md:h-12 z-10"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={goToNext}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 bg-white hover:bg-gray-100 shadow-lg rounded-full w-10 h-10 md:w-12 md:h-12 z-10"
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
              </Button>
            </>
          )}

          {/* Dots Indicator */}
          {feedbacks.length > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {feedbacks.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? "bg-green-600 w-8"
                      : "bg-gray-300 w-2 hover:bg-gray-400"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
