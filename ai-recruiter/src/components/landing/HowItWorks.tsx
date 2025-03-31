"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClipboardCheck, Users, MessagesSquare, Trophy } from "lucide-react";

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            How AI Recruiter Works
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Our platform brings together employers and job seekers through a seamless, AI-powered process.
          </p>
        </div>
        
        <Tabs defaultValue="employers" className="mx-auto max-w-4xl">
          <div className="flex justify-center mb-8">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="employers">For Employers</TabsTrigger>
              <TabsTrigger value="candidates">For Candidates</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="employers" className="mt-2">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                  <ClipboardCheck className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">1. Post Job</h3>
                <p className="mt-2 text-gray-600">
                  Create a detailed job post with requirements and qualifications.
                </p>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                  <Users className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">2. AI Screening</h3>
                <p className="mt-2 text-gray-600">
                  Our AI screens and interviews candidates that match your requirements.
                </p>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                  <MessagesSquare className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">3. Review Results</h3>
                <p className="mt-2 text-gray-600">
                  Review detailed interview responses and AI-generated insights.
                </p>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                  <Trophy className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">4. Select Top Talent</h3>
                <p className="mt-2 text-gray-600">
                  Choose from ranked candidates and proceed with final interviews.
                </p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="candidates" className="mt-2">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                  <ClipboardCheck className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">1. Create Profile</h3>
                <p className="mt-2 text-gray-600">
                  Build your professional profile with skills and experience.
                </p>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                  <Users className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">2. Find Opportunities</h3>
                <p className="mt-2 text-gray-600">
                  Browse jobs matching your skills and experience.
                </p>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                  <MessagesSquare className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">3. AI Interview</h3>
                <p className="mt-2 text-gray-600">
                  Complete AI-powered interviews at your convenience.
                </p>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                  <Trophy className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">4. Get Hired</h3>
                <p className="mt-2 text-gray-600">
                  Get matched with employers looking for your exact skills.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
} 