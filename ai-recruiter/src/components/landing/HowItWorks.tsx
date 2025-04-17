"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClipboardCheck, Users, MessagesSquare, Trophy } from "lucide-react";
import { motion } from "framer-motion";

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20">
      <div className="container mx-auto px-4">
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
              {[
                {
                  icon: ClipboardCheck,
                  title: "1. Post Job",
                  description: "Create a detailed job post with requirements and qualifications."
                },
                {
                  icon: Users,
                  title: "2. AI Screening",
                  description: "Our AI screens and interviews candidates that match your requirements."
                },
                {
                  icon: MessagesSquare,
                  title: "3. Review Results",
                  description: "Review detailed interview responses and AI-generated insights."
                },
                {
                  icon: Trophy,
                  title: "4. Select Top Talent",
                  description: "Choose from ranked candidates and proceed with final interviews."
                }
              ].map((step, index) => (
                <motion.div
                  key={index}
                  className="flex flex-col items-center text-center"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                    <step.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">{step.title}</h3>
                  <p className="mt-2 text-gray-600">
                    {step.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="candidates" className="mt-2">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  icon: ClipboardCheck,
                  title: "1. Create Profile",
                  description: "Build your professional profile with skills and experience."
                },
                {
                  icon: Users,
                  title: "2. Find Opportunities",
                  description: "Browse jobs matching your skills and experience."
                },
                {
                  icon: MessagesSquare,
                  title: "3. AI Interview",
                  description: "Complete AI-powered interviews at your convenience."
                },
                {
                  icon: Trophy,
                  title: "4. Get Hired",
                  description: "Get matched with employers looking for your exact skills."
                }
              ].map((step, index) => (
                <motion.div
                  key={index}
                  className="flex flex-col items-center text-center"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                    <step.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">{step.title}</h3>
                  <p className="mt-2 text-gray-600">
                    {step.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
} 