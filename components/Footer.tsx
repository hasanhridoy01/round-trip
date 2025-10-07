import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="cursor-pointer flex items-center mb-2">
              <Link href={"/"}>
                <img
                  src="/logo-white.png"
                  alt="Logo"
                  className="lg:h-12 h-8 w-auto object-contain"
                />
              </Link>
            </div>
            <p className="text-gray-400">
              Your trusted travel companion for all your journey needs.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Services</h3>
            <ul className="space-y-2 text-gray-400">
              <li>Bus Booking</li>
              <li>Air Tickets</li>
              <li>Train Booking</li>
              <li>Launch Tickets</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-gray-400">
              <li>Help Center</li>
              <li>Contact Us</li>
              <li>Terms & Conditions</li>
              <li>Privacy Policy</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-gray-400">
              <li>📞 16374</li>
              <li>📧 support@Durpalla.com</li>
              <li>📍 Dhaka, Bangladesh</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 Durpalla. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
