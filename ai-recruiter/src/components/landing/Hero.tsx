"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";

export function Hero() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-white via-blue-50 to-indigo-100 py-20 sm:py-32 border-b border-gray-200">
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-8">
          <div className="flex flex-col justify-center">
            <motion.h1 
              className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <motion.span 
                className="block"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Transform the Hiring Process
              </motion.span>
              <motion.span 
                className="block text-primary"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                with AI-Powered Recruitment
              </motion.span>
            </motion.h1>
            <motion.p 
              className="mt-6 text-lg text-gray-600"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              Connect employers with talent through smart, bias-free AI interviews. 
              Save time, reduce costs, and find the perfect match for your team.
            </motion.p>
            <motion.div 
              className="mt-10 flex items-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <motion.div whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 300 }}>
                <Button size="lg" className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700" asChild>
                  <Link href="/auth/signup">Get Started</Link>
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 300 }}>
                <Button size="lg" variant="outline" asChild>
                  <Link href="#how-it-works">Learn More</Link>
                </Button>
              </motion.div>
            </motion.div>
          </div>
          <div className="relative flex items-center justify-center lg:justify-end">
            <motion.div 
              className="relative h-[400px] w-[400px] overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-100 shadow-xl"
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-72 w-72 rounded-lg bg-indigo-500/5"></div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="relative"
                >
                  <Image
                    src="/image1.png"
                    alt="AI Recruiter"
                    width={300}
                    height={300}
                    className="object-contain"
                    priority
                  />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
} 