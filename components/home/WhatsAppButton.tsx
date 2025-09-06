import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function WhatsAppButton() {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <a
        href="https://wa.me/6281234567890?text=Hi! I'm looking for travel recommendations. Can you help me?"
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
  );
}
