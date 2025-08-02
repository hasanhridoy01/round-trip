"use client";
import {
  Bus,
  Plane,
  Train,
  Ship,
  Calendar,
  MapPin,
  Search,
  ArrowLeftRight,
  Phone,
  User,
  CreditCard,
  CheckCircle,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <Hero />

      {/* Welcome Section */}
      {/* <section className="bg-gradient-to-r from-green-500 to-emerald-600 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between">
            <div className="text-center lg:text-left mb-6 lg:mb-0">
              <h2 className="text-3xl font-bold text-white mb-2 flex items-center justify-center lg:justify-start">
                🎉 Welcome to a Smarter TravelHub Login!
              </h2>
              <p className="text-green-100 mb-2">
                If you're an existing user, just reset your password once to
                continue.
              </p>
              <p className="text-green-100">
                Now access <strong>Bus</strong>, <strong>Air</strong>, and{" "}
                <strong>Park</strong> with a single TravelHub account. Easy and
                secure!
              </p>
            </div>
            <Button className="bg-white text-green-600 hover:bg-gray-100 font-semibold px-8 py-3">
              Reset Password
            </Button>
          </div>
        </div>
      </section> */}

      {/* Steps Section */}
      <section className="pb-20 md:pt-64 pt-[450px] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Buy <span className="text-green-600">tickets</span> in{" "}
              <span className="text-gray-600">3 easy steps</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Step 1: Search */}
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Search className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Search</h3>
              <p className="text-gray-600 leading-relaxed">
                Choose your origin, destination, journey dates and search for
                buses, trains, or flights.
              </p>
            </div>

            {/* Step 2: Select */}
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <CheckCircle className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Select</h3>
              <p className="text-gray-600 leading-relaxed">
                Select your desired trip and choose your seats from available
                options.
              </p>
            </div>

            {/* Step 3: Pay */}
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <CreditCard className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Pay</h3>
              <p className="text-gray-600 leading-relaxed">
                Pay by bank cards or mobile banking. Secure and fast payment
                processing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
