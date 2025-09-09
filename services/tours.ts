import apiClient from '@/lib/api';

// Types for media/image fields
interface StrapiMedia {
  id: number;
  documentId: string;
  name: string;
  alternativeText?: string;
  caption?: string;
  width: number;
  height: number;
  formats?: {
    thumbnail?: { url: string; width: number; height: number; };
    small?: { url: string; width: number; height: number; };
    medium?: { url: string; width: number; height: number; };
    large?: { url: string; width: number; height: number; };
  };
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl?: string;
  provider: string;
  provider_metadata?: any;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

// Types for rich text content
interface RichTextContent {
  type: string;
  children?: Array<{
    type: string;
    text?: string;
    bold?: boolean;
  }>;
  format?: string;
}

// Types for the actual API response
export interface ApiTour {
  id: number;
  documentId: string;
  title: string;
  location: string;
  price: number;
  description: string;
  introduction_text: string;
  post_label?: string;
  
  // Media fields (populated)
  featured_image?: StrapiMedia;
  gallery?: StrapiMedia[];
  
  // Rich text fields (or feature objects when populated)
  features_main?: RichTextContent[] | any[];
  includes: RichTextContent[];
  what_to_bring: RichTextContent[];
  additional_information: RichTextContent[];
  
  // Rating and review fields (if present)
  rating?: number;
  review_count?: number;
  
  // SEO and metadata
  slug?: string;
  meta_title?: string;
  meta_description?: string;
  
  // Contact information (if populated)
  contact?: {
    phone?: string;
    email?: string;
    website?: string;
  };
  
  // Additional populated fields
  itenary?: Array<{
    id: number;
    itenary_caption: string;
  }>;
  
  faq_main?: Array<{
    id: number;
    caption: string;
    faq_desc: string;
  }>;
  
  notes_main?: Array<{
    id: number;
    title: string;
    desc: string;
    notes_type: 'warning' | 'calm' | 'good' | 'emergency' | 'destroy';
  }>;
  
  main_important_notes?: {
    id: number;
    caption: string;
    description: string;
  };
  
  gallery_main?: Array<{
    id: number;
    url: string;
  }>;
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
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

// Tours API Service
export class ToursService {
  // Get all tours
  static async getAllTours(): Promise<ApiTour[]> {
    try {
      const response = await apiClient.get<ApiResponse<ApiTour[]>>('/tours', {
        params: {
          populate: '*'
        }
      });
      return response.data.data || response.data as ApiTour[];
    } catch (error) {
      console.error('Error fetching tours:', error);
      throw new Error('Failed to fetch tours data');
    }
  }

  // Get single tour by ID (numeric)
  static async getTourById(id: number): Promise<ApiTour> {
    try {
      const response = await apiClient.get<ApiResponse<ApiTour>>(`/tours/${id}`, {
        params: {
          populate: '*'
        }
      });
      return response.data.data || response.data as ApiTour;
    } catch (error) {
      console.error(`Error fetching tour ${id}:`, error);
      throw new Error(`Failed to fetch tour with ID ${id}`);
    }
  }

  // Get single tour by documentId (string)
  static async getTourByDocumentId(documentId: string): Promise<ApiTour> {
    try {
      const response = await apiClient.get<ApiResponse<ApiTour>>(`/tours/${documentId}`, {
        params: {
          populate: '*'
        }
      });
      return response.data.data || response.data as ApiTour;
    } catch (error) {
      console.error(`Error fetching tour ${documentId}:`, error);
      throw new Error(`Failed to fetch tour with documentId ${documentId}`);
    }
  }

  // Search tours (if API supports it)
  static async searchTours(query: string): Promise<ApiTour[]> {
    try {
      const response = await apiClient.get<ApiResponse<ApiTour[]>>('/tours/search', {
        params: { 
          q: query,
          populate: '*'
        }
      });
      return response.data.data || response.data as ApiTour[];
    } catch (error) {
      console.error('Error searching tours:', error);
      throw new Error('Failed to search tours');
    }
  }

  // Filter tours by category
  static async getToursByCategory(category: string): Promise<ApiTour[]> {
    try {
      const response = await apiClient.get<ApiResponse<ApiTour[]>>('/tours', {
        params: { 
          category,
          populate: '*'
        }
      });
      return response.data.data || response.data as ApiTour[];
    } catch (error) {
      console.error(`Error fetching tours by category ${category}:`, error);
      throw new Error(`Failed to fetch tours in category ${category}`);
    }
  }
}

// Helper function to extract text from rich text fields
const extractTextFromRichText = (richTextArray: any[]): string[] => {
  if (!Array.isArray(richTextArray)) return [];
  
  const extractedTexts: string[] = [];
  
  // Function to recursively extract text from nested structures
  const extractText = (item: any): void => {
    if (!item) return;
    
    // Handle direct text nodes
    if (item.type === 'text' && item.text && item.text.trim()) {
      extractedTexts.push(item.text.trim());
      return;
    }
    
    // Handle list items
    if (item.type === 'list-item' && item.children) {
      const text = item.children
        .filter((child: any) => child.type === 'text' && child.text)
        .map((child: any) => child.text.trim())
        .join(' ')
        .trim();
      
      if (text) {
        extractedTexts.push(text);
      }
      return;
    }
    
    // Handle lists and other containers
    if (item.children && Array.isArray(item.children)) {
      item.children.forEach(extractText);
    }
  };
  
  // Process each item in the rich text array
  richTextArray.forEach(extractText);
  
  // Remove duplicates and empty strings
  return [...new Set(extractedTexts.filter(text => text && text.trim() !== ''))];
};

// Helper function to get image URL from Strapi media or fallback
const getImageUrl = (media?: StrapiMedia, category?: string, title?: string): string => {
  // First priority: Use API media if available
  if (media?.url) {
    // If it's a relative URL, prepend the API base URL
    if (media.url.startsWith('/')) {
      return `http://209.97.173.149:1337${media.url}`;
    }
    return media.url;
  }
  
  // Fallback: Use category-based Unsplash images
  const imageMap: Record<string, string> = {
    'best seller': 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop',
    'hotel': 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=400&h=300&fit=crop',
    'resort': 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=300&fit=crop',
    'temple': 'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=400&h=300&fit=crop',
    'beach': 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop',
    'tour': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
    'spa': 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&h=300&fit=crop',
    'default': 'https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=400&h=300&fit=crop'
  };
  
  const key = category ? category.toLowerCase() : 'default';
  return imageMap[key] || imageMap.default;
};

// Utility function to transform API data to match existing component structure
export const transformApiTourToLocal = (apiTour: ApiTour) => {
  // Extract amenities from features_main field (priority), fallback to includes
  let amenities: string[] = [];
  
  if (apiTour.features_main && apiTour.features_main.length > 0) {
    // Check if features_main is an array of objects with 'features' property
    if (typeof apiTour.features_main[0] === 'object' && 'features' in apiTour.features_main[0]) {
      amenities = (apiTour.features_main as any[]).map((item: any) => item.features).filter(Boolean);
      console.log('✅ Extracted amenities from features_main objects:', amenities);
    } else {
      // Fallback to rich text extraction
      amenities = extractTextFromRichText(apiTour.features_main);
      console.log('✅ Extracted amenities from features_main rich text:', amenities);
    }
  } else {
    amenities = extractTextFromRichText(apiTour.includes);
    console.log('⚠️ Fallback to includes for amenities:', amenities);
  }
  
  // Generate category from post_label or use default
  const category = apiTour.post_label || 'Tour Experience';
  
  // Generate rating based on price (higher price = higher rating, with some randomness)
  const baseRating = Math.min(4.2 + (apiTour.price / 200), 4.9);
  const rating = Math.round((baseRating + Math.random() * 0.3) * 10) / 10;
  
  // Generate review count based on rating and price
  const reviewCount = Math.floor(1000 + (rating * 500) + Math.random() * 2000);

  return {
    id: apiTour.id,
    name: apiTour.title,
    location: apiTour.location,
    rating: rating,
    reviewCount: reviewCount,
    reviews: reviewCount,
    price: apiTour.price,
    image: (() => {
      // Priority order: gallery_main[0], featured_image, fallback
      if (apiTour.gallery_main && apiTour.gallery_main.length > 0) {
        return apiTour.gallery_main[0].url;
      }
      return getImageUrl(apiTour.featured_image, category, apiTour.title);
    })(),
    images: (() => {
      // Priority order: gallery_main, gallery, featured_image fallback
      if (apiTour.gallery_main && apiTour.gallery_main.length > 0) {
        return apiTour.gallery_main.map(img => img.url);
      }
      if (apiTour.gallery && apiTour.gallery.length > 0) {
        return apiTour.gallery.map(img => getImageUrl(img, category, apiTour.title));
      }
      return [getImageUrl(apiTour.featured_image, category, apiTour.title)];
    })(),
    category: category,
    description: apiTour.introduction_text || apiTour.description,
    fullDescription: apiTour.description,
    amenities: amenities.length > 0 ? amenities.slice(0, 6) : ['Professional Guide', 'Transportation', 'Entrance Fees'],
    contact: {
      phone: '+62 812 3456 7890',
      email: 'info@thehonesttour.com'
    },
    hours: '8:00 AM - 6:00 PM',
    tourSchedule: [
      {
        day: 1,
        title: 'Day 1 - Tour Experience',
        activities: [
          {
            time: '08:00',
            activity: 'Hotel Pickup',
            description: 'Professional guide will pick you up from your hotel'
          },
          {
            time: '09:00',
            activity: 'Tour Begins',
            description: apiTour.introduction_text || 'Start your amazing experience'
          }
        ]
      }
    ],
    // Keep the raw API data for reference
    documentId: apiTour.documentId,
    features_main: apiTour.features_main,
    includes: apiTour.includes,
    what_to_bring: apiTour.what_to_bring,
    additional_information: apiTour.additional_information,
    
    // Additional API fields for detail page sections
    itenary: apiTour.itenary || [],
    faq_main: apiTour.faq_main || [],
    notes_main: apiTour.notes_main || [],
    main_important_notes: apiTour.main_important_notes,
    gallery_main: apiTour.gallery_main || [],
    
    // Extract text arrays for easy display
    includesText: extractTextFromRichText(apiTour.includes),
    whatToBringText: extractTextFromRichText(apiTour.what_to_bring),
    additionalInfoText: extractTextFromRichText(apiTour.additional_information)
  };
};

export default ToursService;