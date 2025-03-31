"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
export function Hero() {
  return (
    <div className="relative overflow-hidden bg-white py-20 sm:py-32">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-8">
          <div className="flex flex-col justify-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              <span className="block">Transform Hiring with</span>
              <span className="block text-primary">AI-Powered Recruitment</span>
            </h1>
            <p className="mt-6 text-lg text-gray-600">
              Connect employers with talent through smart, bias-free AI interviews. 
              Save time, reduce costs, and find the perfect match for your team.
            </p>
            <div className="mt-10 flex items-center gap-4">
              <Button size="lg" asChild>
                <Link href="/auth/signup">Get Started</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="#how-it-works">Learn More</Link>
              </Button>
            </div>
          </div>
          <div className="relative flex items-center justify-center lg:justify-end">
            <div className="relative h-[400px] w-[400px] overflow-hidden rounded-2xl bg-gray-100 shadow-xl">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-64 w-64 rounded-full bg-primary/20"></div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <img
                  src="/hero-image2.png"
                  alt="AI Recruiter"
                  className="h-72 w-72 object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 