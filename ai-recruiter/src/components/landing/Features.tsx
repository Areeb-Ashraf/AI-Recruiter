"use client";

import { motion } from "framer-motion";
import { 
  Brain, 
  Clock, 
  Users, 
  BarChart3, 
  Shield, 
  Zap 
} from "lucide-react";

const features = [
  {
    name: "AI-Powered Interviews",
    description: "Conduct intelligent interviews with our advanced AI system that adapts to each candidate's responses.",
    icon: Brain,
  },
  {
    name: "Time-Saving Automation",
    description: "Automate repetitive tasks and focus on what matters most - finding the perfect candidate.",
    icon: Clock,
  },
  {
    name: "Bias-Free Selection",
    description: "Ensure fair hiring practices with our AI that eliminates unconscious bias from the recruitment process.",
    icon: Users,
  },
  {
    name: "Data-Driven Insights",
    description: "Make informed decisions with comprehensive analytics and candidate performance metrics.",
    icon: BarChart3,
  },
  {
    name: "Secure & Compliant",
    description: "Rest easy knowing your recruitment process meets all security and compliance requirements.",
    icon: Shield,
  },
  {
    name: "Real-Time Processing",
    description: "Get instant feedback and results, allowing for quick decision-making in your hiring process.",
    icon: Zap,
  },
];

export function Features() {
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
            Revolutionizing Recruitment Through{" "}
            <span className="text-primary">Artificial Intelligence</span>
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Our platform combines cutting-edge AI technology with human expertise to transform your hiring process.
          </p>
        </motion.div>

        <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={feature.name}
              className="relative group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="relative p-6 bg-white rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-indigo-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-indigo-600 text-white shadow-lg">
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-gray-900 group-hover:text-primary transition-colors duration-300">
                    {feature.name}
                  </h3>
                  <p className="mt-2 text-gray-600">
                    {feature.description}
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