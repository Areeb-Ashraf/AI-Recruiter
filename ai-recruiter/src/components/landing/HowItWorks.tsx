"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClipboardCheck, Users, MessagesSquare, Trophy, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const steps = {
  employers: [
    {
      icon: ClipboardCheck,
      title: "1. Post Job",
      description: "Create a detailed job post with requirements and qualifications.",
      gradient: "from-blue-500 to-indigo-500"
    },
    {
      icon: Users,
      title: "2. AI Screening",
      description: "Our AI screens and interviews candidates that match your requirements.",
      gradient: "from-indigo-500 to-purple-500"
    },
    {
      icon: MessagesSquare,
      title: "3. Review Results",
      description: "Review detailed interview responses and AI-generated insights.",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: Trophy,
      title: "4. Select Top Talent",
      description: "Choose from ranked candidates and proceed with final interviews.",
      gradient: "from-pink-500 to-rose-500"
    }
  ],
  candidates: [
    {
      icon: ClipboardCheck,
      title: "1. Create Profile",
      description: "Build your professional profile with skills and experience.",
      gradient: "from-blue-500 to-indigo-500"
    },
    {
      icon: Users,
      title: "2. Find Opportunities",
      description: "Browse jobs matching your skills and experience.",
      gradient: "from-indigo-500 to-purple-500"
    },
    {
      icon: MessagesSquare,
      title: "3. AI Interview",
      description: "Complete AI-powered interviews at your convenience.",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: Trophy,
      title: "4. Get Hired",
      description: "Get matched with employers looking for your exact skills.",
      gradient: "from-pink-500 to-rose-500"
    }
  ]
};

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-20 overflow-hidden border-b border-gray-200 bg-gradient-to-b from-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            How AI Recruiter Works
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Our platform brings together employers and job seekers through a seamless, AI-powered process.
          </p>
        </motion.div>
        
        <Tabs defaultValue="employers" className="mx-auto max-w-4xl">
          <div className="flex justify-center mb-8">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="employers">For Employers</TabsTrigger>
              <TabsTrigger value="candidates">For Candidates</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="employers" className="mt-2">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {steps.employers.map((step, index) => (
                <motion.div
                  key={index}
                  className="group relative h-full"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="relative p-6 bg-white rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 h-full flex flex-col">
                    <div className={`absolute inset-0 bg-gradient-to-br ${step.gradient} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300`}></div>
                    <div className="relative flex flex-col h-full">
                      <div className={`mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br ${step.gradient} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <step.icon className="h-7 w-7" />
                      </div>
                      <h3 className="text-xl font-semibold group-hover:text-primary transition-colors duration-300">
                        {step.title}
                      </h3>
                      <p className="mt-2 text-gray-600 flex-grow">
                        {step.description}
                      </p>
                    </div>
                    {index < steps.employers.length - 1 && (
                      <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                        <ArrowRight className="h-6 w-6 text-gray-400" />
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="candidates" className="mt-2">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {steps.candidates.map((step, index) => (
                <motion.div
                  key={index}
                  className="group relative h-full"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="relative p-6 bg-white rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 h-full flex flex-col">
                    <div className={`absolute inset-0 bg-gradient-to-br ${step.gradient} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300`}></div>
                    <div className="relative flex flex-col h-full">
                      <div className={`mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br ${step.gradient} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <step.icon className="h-7 w-7" />
                      </div>
                      <h3 className="text-xl font-semibold group-hover:text-primary transition-colors duration-300">
                        {step.title}
                      </h3>
                      <p className="mt-2 text-gray-600 flex-grow">
                        {step.description}
                      </p>
                    </div>
                    {index < steps.candidates.length - 1 && (
                      <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                        <ArrowRight className="h-6 w-6 text-gray-400" />
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
} 