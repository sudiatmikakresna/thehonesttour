const axios = require('axios');

// API Configuration
const API_BASE_URL = 'https://api.thehonesttour.com/api';
const API_TOKEN = 'f84ab428034ccbe4a176bd8d75bfbdd07cd5327ea2681a3740b0448ad44cb3dba49bb89aafefb383b0345cba68a175cd263767346fcc2fe4712460d107a6aa96ffb6a43a08f2c636d463a58e5bbbba2a8c252bef104d3151cb20e460bcabd24d77b211cefcd83b3e53b73a9d8685fe1815f464a00ef2baa26637afff59070925';

// Create axios client
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Authorization': `Bearer ${API_TOKEN}`,
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 10000,
});

// Dummy tour data
const dummyTours = [
  {
    title: "Sunset Temple & Rice Terrace Adventure",
    location: "Ubud, Bali",
    price: 85,
    description: "Experience the magical beauty of Bali's most iconic temples during golden hour, combined with a peaceful walk through emerald rice terraces. This tour offers the perfect blend of spiritual discovery and natural beauty.",
    introduction_text: "Discover Bali's spiritual heart through ancient temples and stunning landscapes in this unforgettable sunset adventure.",
    post_label: "Best seller",
    includes: [
      {"type":"paragraph","children":[{"type":"text","text":"Included","bold":true}]},
      {"type":"list","format":"unordered","children":[
        {"type":"list-item","children":[{"type":"text","text":"Professional English-speaking guide"}]},
        {"type":"list-item","children":[{"type":"text","text":"Transportation in air-conditioned vehicle"}]},
        {"type":"list-item","children":[{"type":"text","text":"All temple entrance fees"}]},
        {"type":"list-item","children":[{"type":"text","text":"Traditional Balinese lunch"}]},
        {"type":"list-item","children":[{"type":"text","text":"Bottled water and refreshments"}]},
        {"type":"list-item","children":[{"type":"text","text":"Sarongs for temple visits"}]}
      ]}
    ],
    what_to_bring: [
      {"type":"paragraph","children":[{"type":"text","text":"Essential Items","bold":true}]},
      {"type":"list","format":"unordered","children":[
        {"type":"list-item","children":[{"type":"text","text":"Comfortable walking shoes"}]},
        {"type":"list-item","children":[{"type":"text","text":"Sun hat and sunglasses"}]},
        {"type":"list-item","children":[{"type":"text","text":"Sunscreen (SPF 30+)"}]},
        {"type":"list-item","children":[{"type":"text","text":"Camera for stunning photos"}]},
        {"type":"list-item","children":[{"type":"text","text":"Light jacket for evening"}]}
      ]}
    ],
    additional_information: [
      {"type":"paragraph","children":[{"type":"text","text":"Important Information","bold":true}]},
      {"type":"paragraph","children":[{"type":"text","text":"• Minimum age: 8 years old"}]},
      {"type":"paragraph","children":[{"type":"text","text":"• Tour operates daily, weather permitting"}]},
      {"type":"paragraph","children":[{"type":"text","text":"• Vegetarian meal options available"}]},
      {"type":"paragraph","children":[{"type":"text","text":"• Free cancellation up to 24 hours before"}]},
      {"type":"paragraph","children":[{"type":"text","text":"Cultural Respect","bold":true}]},
      {"type":"paragraph","children":[{"type":"text","text":"Please dress modestly when visiting temples. Shoulders and knees must be covered."}]}
    ],
    itenary: [
      {"itenary_caption": "Day 1: Temple Discovery & Rice Terrace Walk"}
    ],
    faq_main: [
      {"caption": "What if it rains during the tour?", "faq_desc": "We provide umbrellas and have covered areas at temples. Light rain adds atmosphere, but tours may be rescheduled for heavy storms."},
      {"caption": "Is this tour suitable for elderly visitors?", "faq_desc": "Yes, with moderate walking involved. Please inform us of any mobility concerns when booking."},
      {"caption": "Can we customize the itinerary?", "faq_desc": "Absolutely! We can adjust temple visits and timing based on your interests and physical comfort."}
    ],
    notes_main: [
      {"title": "Temple Etiquette", "desc": "Remove shoes before entering temple grounds. Women cannot enter temples during menstruation.", "notes_type": "warning"},
      {"title": "Photography Guidelines", "desc": "Photography is allowed in most areas, but please be respectful during ceremonies.", "notes_type": "calm"},
      {"title": "Support Local Communities", "desc": "This tour directly supports local communities and temple maintenance.", "notes_type": "good"}
    ],
    main_important_notes: {
      "caption": "Weather & Timing",
      "description": "Best sunset views are from 5:30-6:30 PM. We adjust start times seasonally for optimal lighting. Rice terrace walks are easier in dry season (April-October)."
    },
    gallery_main: [
      {"url": "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=1920&h=1080&fit=crop"},
      {"url": "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=1920&h=1080&fit=crop"},
      {"url": "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1920&h=1080&fit=crop"}
    ],
    features_main: [
      {"features": "temple tour"},
      {"features": "rice terrace"},
      {"features": "sunset viewing"},
      {"features": "cultural experience"}
    ]
  },
  {
    title: "Volcano Hiking & Hot Springs Experience",
    location: "Mount Batur, Bali",
    price: 120,
    description: "Challenge yourself with an early morning hike up Mount Batur volcano to witness a breathtaking sunrise, followed by relaxation in natural hot springs. This adventure combines physical activity with stunning natural beauty.",
    introduction_text: "Conquer Bali's sacred volcano at dawn and reward yourself with therapeutic hot springs in this ultimate adventure.",
    post_label: "popular",
    includes: [
      {"type":"paragraph","children":[{"type":"text","text":"Included","bold":true}]},
      {"type":"list","format":"unordered","children":[
        {"type":"list-item","children":[{"type":"text","text":"Professional mountain guide"}]},
        {"type":"list-item","children":[{"type":"text","text":"Early morning hotel pickup"}]},
        {"type":"list-item","children":[{"type":"text","text":"Flashlight and safety equipment"}]},
        {"type":"list-item","children":[{"type":"text","text":"Simple breakfast on summit"}]},
        {"type":"list-item","children":[{"type":"text","text":"Hot springs entrance fee"}]},
        {"type":"list-item","children":[{"type":"text","text":"Towel rental at hot springs"}]}
      ]}
    ],
    what_to_bring: [
      {"type":"paragraph","children":[{"type":"text","text":"Essential Items","bold":true}]},
      {"type":"list","format":"unordered","children":[
        {"type":"list-item","children":[{"type":"text","text":"Sturdy hiking boots"}]},
        {"type":"list-item","children":[{"type":"text","text":"Warm jacket (summit gets cold)"}]},
        {"type":"list-item","children":[{"type":"text","text":"Backpack for water and snacks"}]},
        {"type":"list-item","children":[{"type":"text","text":"Swimming attire for hot springs"}]},
        {"type":"list-item","children":[{"type":"text","text":"Extra clothes (you'll get sweaty)"}]}
      ]}
    ],
    additional_information: [
      {"type":"paragraph","children":[{"type":"text","text":"Important Information","bold":true}]},
      {"type":"paragraph","children":[{"type":"text","text":"• Minimum age: 15 years old"}]},
      {"type":"paragraph","children":[{"type":"text","text":"• Good fitness level required"}]},
      {"type":"paragraph","children":[{"type":"text","text":"• 2-hour hike uphill in darkness"}]},
      {"type":"paragraph","children":[{"type":"text","text":"• Weather dependent activity"}]},
      {"type":"paragraph","children":[{"type":"text","text":"Safety First","bold":true}]},
      {"type":"paragraph","children":[{"type":"text","text":"This is a challenging hike. Please assess your fitness level honestly and inform us of any health conditions."}]}
    ],
    itenary: [
      {"itenary_caption": "Day 1: Pre-dawn Volcano Hike & Hot Springs"}
    ],
    faq_main: [
      {"caption": "How difficult is the hike?", "faq_desc": "Moderately challenging. 2-hour uphill climb on rocky terrain. Good fitness level required but achievable for most people."},
      {"caption": "What time do we start?", "faq_desc": "Pickup is at 2:00 AM to reach the summit for sunrise around 6:00 AM. Early start is essential for the experience."},
      {"caption": "What if I can't complete the hike?", "faq_desc": "Guides assess your condition regularly. There are rest points, and you can turn back safely at any time."}
    ],
    notes_main: [
      {"title": "Physical Demands", "desc": "This hike is strenuous. Not suitable for people with heart conditions, pregnancy, or serious health issues.", "notes_type": "warning"},
      {"title": "Weather Conditions", "desc": "Summit temperature can drop to 10°C (50°F). Dress in layers and bring warm clothing.", "notes_type": "calm"},
      {"title": "Achievement Reward", "desc": "Witnessing sunrise from 1,717m above sea level is truly life-changing. You'll feel incredibly accomplished!", "notes_type": "good"}
    ],
    main_important_notes: {
      "caption": "Fitness & Preparation",
      "description": "We recommend light training before the hike. Bring your own water and energy snacks. The descent can be harder on knees than the ascent."
    },
    gallery_main: [
      {"url": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop"},
      {"url": "https://images.unsplash.com/photo-1464822759844-d150baec93d5?w=1920&h=1080&fit=crop"},
      {"url": "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&h=1080&fit=crop"}
    ],
    features_main: [
      {"features": "volcano hiking"},
      {"features": "sunrise viewing"},
      {"features": "hot springs"},
      {"features": "adventure"},
      {"features": "mountain climbing"}
    ]
  },
  {
    title: "Traditional Cooking Class & Market Tour",
    location: "Ubud, Bali",
    price: 65,
    description: "Immerse yourself in authentic Balinese culture through a hands-on cooking experience. Start with a vibrant local market visit to select fresh ingredients, then learn to prepare traditional dishes in a beautiful village setting.",
    introduction_text: "Learn the secrets of Balinese cuisine from local experts in this immersive cultural and culinary adventure.",
    post_label: "popular",
    includes: [
      {"type":"paragraph","children":[{"type":"text","text":"Included","bold":true}]},
      {"type":"list","format":"unordered","children":[
        {"type":"list-item","children":[{"type":"text","text":"Local cooking instructor"}]},
        {"type":"list-item","children":[{"type":"text","text":"Traditional market tour"}]},
        {"type":"list-item","children":[{"type":"text","text":"All ingredients and materials"}]},
        {"type":"list-item","children":[{"type":"text","text":"Full meal that you prepare"}]},
        {"type":"list-item","children":[{"type":"text","text":"Recipe cards to take home"}]},
        {"type":"list-item","children":[{"type":"text","text":"Transportation to/from market"}]}
      ]}
    ],
    what_to_bring: [
      {"type":"paragraph","children":[{"type":"text","text":"Essential Items","bold":true}]},
      {"type":"list","format":"unordered","children":[
        {"type":"list-item","children":[{"type":"text","text":"Comfortable casual clothing"}]},
        {"type":"list-item","children":[{"type":"text","text":"Closed-toe shoes for market"}]},
        {"type":"list-item","children":[{"type":"text","text":"Apron (provided but you can bring your own)"}]},
        {"type":"list-item","children":[{"type":"text","text":"Camera to capture the experience"}]},
        {"type":"list-item","children":[{"type":"text","text":"Appetite for delicious food!"}]}
      ]}
    ],
    additional_information: [
      {"type":"paragraph","children":[{"type":"text","text":"Important Information","bold":true}]},
      {"type":"paragraph","children":[{"type":"text","text":"• Suitable for all ages (children must be supervised)"}]},
      {"type":"paragraph","children":[{"type":"text","text":"• Vegetarian and vegan options available"}]},
      {"type":"paragraph","children":[{"type":"text","text":"• Classes limited to 12 people for personal attention"}]},
      {"type":"paragraph","children":[{"type":"text","text":"• Morning and afternoon sessions available"}]},
      {"type":"paragraph","children":[{"type":"text","text":"Dietary Requirements","bold":true}]},
      {"type":"paragraph","children":[{"type":"text","text":"Please inform us of any food allergies or dietary restrictions when booking."}]}
    ],
    itenary: [
      {"itenary_caption": "Day 1: Market Visit & Cooking Experience"}
    ],
    faq_main: [
      {"caption": "Do I need cooking experience?", "faq_desc": "No experience needed! Our instructors guide you through every step, from basic techniques to complex spice combinations."},
      {"caption": "Can children participate?", "faq_desc": "Yes! Children 6+ can participate with adult supervision. They love learning about spices and helping with preparation."},
      {"caption": "Are the recipes difficult to recreate at home?", "faq_desc": "We provide recipe cards and tips for finding ingredients abroad. Many dishes use simple techniques with complex flavors."}
    ],
    notes_main: [
      {"title": "Food Safety", "desc": "We maintain high hygiene standards. Please wash hands frequently and inform us of any food allergies.", "notes_type": "warning"},
      {"title": "Cultural Learning", "desc": "This experience teaches you about Balinese Hindu food traditions and the cultural significance of meals.", "notes_type": "calm"},
      {"title": "Supporting Locals", "desc": "Your participation directly supports local farmers, spice vendors, and traditional cooking instructors.", "notes_type": "good"}
    ],
    main_important_notes: {
      "caption": "Class Schedule",
      "description": "Morning classes (9 AM - 1 PM) include market visit. Afternoon classes (2 PM - 6 PM) focus more on cooking techniques. Both include full meal."
    },
    gallery_main: [
      {"url": "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1920&h=1080&fit=crop"},
      {"url": "https://images.unsplash.com/photo-1574484284002-952d92456975?w=1920&h=1080&fit=crop"},
      {"url": "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=1920&h=1080&fit=crop"}
    ],
    features_main: [
      {"features": "cooking class"},
      {"features": "market tour"},
      {"features": "cultural experience"},
      {"features": "traditional recipes"},
      {"features": "local ingredients"}
    ]
  }
];

// Function to post a single tour
async function postTour(tourData) {
  try {
    console.log(`\n🚀 Posting tour: ${tourData.title}`);
    
    const response = await apiClient.post('/tours', {
      data: tourData
    });
    
    console.log(`✅ Successfully created tour: ${tourData.title}`);
    console.log(`   ID: ${response.data.data.id}`);
    console.log(`   Document ID: ${response.data.data.documentId}`);
    return response.data.data;
    
  } catch (error) {
    console.error(`❌ Error posting tour: ${tourData.title}`);
    console.error(`   Status: ${error.response?.status}`);
    console.error(`   Message: ${error.response?.data?.error?.message || error.message}`);
    if (error.response?.data?.error?.details) {
      console.error(`   Details:`, error.response.data.error.details);
    }
    return null;
  }
}

// Function to post all tours
async function postAllTours() {
  console.log('🎯 Starting to post dummy tour data to Strapi...');
  console.log(`📡 API Base URL: ${API_BASE_URL}`);
  console.log(`📊 Number of tours to post: ${dummyTours.length}`);
  
  const results = [];
  
  for (const tour of dummyTours) {
    const result = await postTour(tour);
    results.push(result);
    
    // Add small delay between requests to be nice to the API
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  const successful = results.filter(r => r !== null);
  const failed = results.filter(r => r === null);
  
  console.log('\n📈 Summary:');
  console.log(`✅ Successful posts: ${successful.length}`);
  console.log(`❌ Failed posts: ${failed.length}`);
  
  if (successful.length > 0) {
    console.log('\n🎉 Successfully created tours:');
    successful.forEach(tour => {
      console.log(`   - ${tour.title} (ID: ${tour.id})`);
    });
  }
  
  console.log('\n✨ Script completed!');
}

// Run the script
if (require.main === module) {
  postAllTours().catch(error => {
    console.error('💥 Script failed:', error.message);
    process.exit(1);
  });
}

module.exports = { postAllTours, postTour, dummyTours };