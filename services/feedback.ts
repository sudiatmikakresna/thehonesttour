import apiClient from '@/lib/api';

// Types for feedback/reviews based on actual API response
export interface FeedbackPayload {
  name: string;
  rating_star: number;
  comment: string;
  // Note: tour_slug is not supported in current Strapi schema
  // Will use client-side filtering by tour name or implement tour_slug field later
}

export interface ApiFeedback {
  id: number;
  documentId: string;
  name: string;
  rating_star: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  // Note: tour_slug field doesn't exist in current schema
}

export interface ApiResponse<T> {
  data: T;
  meta?: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

// Feedback API Service
export class FeedbackService {
  // Get all feedback - since tour_slug filtering may not be available yet
  static async getAllFeedback(): Promise<ApiFeedback[]> {
    try {
      const response = await apiClient.get<ApiResponse<ApiFeedback[]>>('/feedbacks', {
        params: {
          'sort[0]': 'createdAt:desc',
          populate: '*'
        }
      });
      return response.data.data || response.data as ApiFeedback[];
    } catch (error) {
      console.error('Error fetching feedback:', error);
      throw new Error('Failed to fetch feedback');
    }
  }

  // Get all feedback for a specific tour by slug
  // Since tour_slug field doesn't exist yet, return all feedback for now
  // TODO: Add tour_slug field to Strapi schema for proper filtering
  static async getFeedbackByTourSlug(tourSlug: string): Promise<ApiFeedback[]> {
    try {
      console.log(`Getting feedback for tour: ${tourSlug} (currently returns all feedback)`);

      // For now, return all feedback since tour_slug field doesn't exist
      // In the future, when tour_slug is added to schema, use:
      // 'filters[tour_slug][$eq]': tourSlug
      const allFeedback = await this.getAllFeedback();

      // Could do client-side filtering by tour name if needed:
      // return allFeedback.filter(feedback =>
      //   feedback.comment.toLowerCase().includes(tourSlug.toLowerCase())
      // );

      return allFeedback;
    } catch (error) {
      console.error(`Error fetching feedback for tour ${tourSlug}:`, error);
      throw new Error(`Failed to fetch feedback for tour ${tourSlug}`);
    }
  }

  // Submit new feedback
  static async submitFeedback(feedback: FeedbackPayload): Promise<ApiFeedback> {
    try {
      // Build payload with only supported fields
      const payload = {
        name: feedback.name,
        rating_star: feedback.rating_star,
        comment: feedback.comment
      };

      console.log('Submitting feedback payload:', payload);

      const response = await apiClient.post<ApiResponse<ApiFeedback>>('/feedbacks', {
        data: payload
      });

      console.log('Feedback submitted successfully:', response.data);
      return response.data.data || response.data as ApiFeedback;
    } catch (error) {
      console.error('Error submitting feedback:', error);
      throw new Error('Failed to submit feedback');
    }
  }

  // Get feedback statistics for a tour
  static async getFeedbackStats(tourSlug: string): Promise<{
    total: number;
    averageRating: number;
    ratingDistribution: { [key: number]: number };
  }> {
    try {
      const feedbacks = await this.getFeedbackByTourSlug(tourSlug);

      if (feedbacks.length === 0) {
        return {
          total: 0,
          averageRating: 0,
          ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
        };
      }

      const total = feedbacks.length;
      const totalRating = feedbacks.reduce((sum, feedback) => sum + feedback.rating_star, 0);
      const averageRating = totalRating / total;

      const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      feedbacks.forEach(feedback => {
        ratingDistribution[feedback.rating_star]++;
      });

      return {
        total,
        averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
        ratingDistribution
      };
    } catch (error) {
      console.error(`Error getting feedback stats for tour ${tourSlug}:`, error);
      return {
        total: 0,
        averageRating: 0,
        ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
      };
    }
  }

  // Delete feedback (for moderation)
  static async deleteFeedback(feedbackId: number): Promise<boolean> {
    try {
      await apiClient.delete(`/feedbacks/${feedbackId}`);
      return true;
    } catch (error) {
      console.error(`Error deleting feedback ${feedbackId}:`, error);
      throw new Error(`Failed to delete feedback ${feedbackId}`);
    }
  }

  // Update feedback (for editing)
  static async updateFeedback(feedbackId: number, updates: Partial<FeedbackPayload>): Promise<ApiFeedback> {
    try {
      const response = await apiClient.put<ApiResponse<ApiFeedback>>(`/feedbacks/${feedbackId}`, {
        data: updates
      });
      return response.data.data || response.data as ApiFeedback;
    } catch (error) {
      console.error(`Error updating feedback ${feedbackId}:`, error);
      throw new Error(`Failed to update feedback ${feedbackId}`);
    }
  }
}

// Utility function to generate consistent background color based on name
const generateBackgroundColor = (name: string): string => {
  const colors = [
    'bg-red-500',
    'bg-blue-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-orange-500',
    'bg-teal-500',
    'bg-cyan-500'
  ];

  // Use name to generate consistent color
  const nameSum = name.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return colors[nameSum % colors.length];
};

// Utility function to transform API feedback to component format
export const transformApiFeedbackToLocal = (apiFeedback: ApiFeedback) => {
  // Get first character of name
  const firstChar = apiFeedback.name.charAt(0).toUpperCase();
  const backgroundColor = generateBackgroundColor(apiFeedback.name);

  return {
    id: apiFeedback.id,
    user: {
      name: apiFeedback.name,
      avatar: '', // No longer using avatar URL
      initials: firstChar,
      backgroundColor: backgroundColor
    },
    rating: apiFeedback.rating_star,
    comment: apiFeedback.comment,
    date: new Date(apiFeedback.createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).replace(/\//g, '-'),
    helpful: 0, // Could be implemented later as a separate feature
    documentId: apiFeedback.documentId
  };
};

export default FeedbackService;