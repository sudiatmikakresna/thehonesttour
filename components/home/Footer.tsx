import Link from "next/link";
import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Phone,
  Mail,
  Globe,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-green-400">TheHonestTour</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Discover amazing destinations around the world with our curated
              travel experiences. Your journey to unforgettable memories starts
              here.
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
                  info@thehonesttour.com
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Globe className="w-4 h-4 text-green-400 flex-shrink-0" />
                <span className="text-gray-300 text-sm">
                  www.thehonesttour.com
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
            © 2024 TheHonestTour. All rights reserved.
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
  );
}
