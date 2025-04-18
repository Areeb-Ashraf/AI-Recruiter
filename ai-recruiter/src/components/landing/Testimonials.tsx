"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const testimonials = [
  {
    content: "AI Recruiter has transformed our hiring process. We've reduced our time-to-hire by 60% while finding better-qualified candidates.",
    author: {
      name: "Sarah Johnson",
      role: "HR Director",
      company: "TechCorp Inc.",
      image: "/testimonials/sarah.jpg"
    }
  },
  {
    content: "The AI-powered interviews are incredibly insightful. We're making more confident hiring decisions with comprehensive candidate data.",
    author: {
      name: "Michael Chen",
      role: "Talent Acquisition Manager",
      company: "InnovateTech",
      image: "/testimonials/michael.jpg"
    }
  },
  {
    content: "Finally, a recruitment platform that combines the efficiency of AI with the human touch. It's been a game-changer for our team.",
    author: {
      name: "Emily Rodriguez",
      role: "Recruitment Lead",
      company: "Global Solutions",
      image: "/testimonials/emily.jpg"
    }
  }
];

export function Testimonials() {
  return (
    <div className="relative py-24 sm:py-32 overflow-hidden border-b border-gray-200">
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Trusted by Leading Companies
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            See how AI Recruiter is transforming recruitment processes across industries.
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.author.name}
              className="relative group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="relative p-6 bg-white rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-indigo-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden">
                      <Image
                        src={testimonial.author.image}
                        alt={testimonial.author.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors duration-300">
                        {testimonial.author.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {testimonial.author.role}
                      </p>
                      <p className="text-sm text-gray-500">
                        {testimonial.author.company}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-600 italic">
                    "{testimonial.content}"
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
} 