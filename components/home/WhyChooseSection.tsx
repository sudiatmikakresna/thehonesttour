import { Star, Heart, MapPin } from "lucide-react";

export function WhyChooseSection() {
  return (
    <div className="mb-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Why choose The Honest Tour</h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Experience travel like never before with our commitment to
          authenticity, transparency, and unforgettable adventures.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
            <Star className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-semibold">Authentic Experiences</h3>
          <p className="text-muted-foreground">
            Discover genuine local experiences with carefully curated
            destinations that showcase the true essence of each location.
          </p>
        </div>

        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-semibold">Transparent Reviews</h3>
          <p className="text-muted-foreground">
            Read honest, unbiased reviews from real travelers. No fake reviews,
            no hidden fees - just genuine insights you can trust.
          </p>
        </div>

        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
            <MapPin className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-semibold">Local Expertise</h3>
          <p className="text-muted-foreground">
            Benefit from insider knowledge and local connections that help you
            discover hidden gems and avoid tourist traps.
          </p>
        </div>
      </div>
    </div>
  );
}
