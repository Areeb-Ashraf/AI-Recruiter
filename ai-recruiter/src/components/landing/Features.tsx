"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Users, Clock, BarChart3, Award, Shield } from "lucide-react";

const features = [
  {
    title: "AI-Powered Interviews",
    description: "Our AI conducts personalized interviews, evaluating skills and fit without bias.",
    icon: Brain,
  },
  {
    title: "Talent Matching",
    description: "Advanced algorithms match candidates to the perfect roles based on skills and preferences.",
    icon: Users,
  },
  {
    title: "Time-Saving",
    description: "Reduce hiring time by 70% with automated screening and interview processes.",
    icon: Clock,
  },
  {
    title: "Data-Driven Insights",
    description: "Access comprehensive analytics to make informed hiring decisions.",
    icon: BarChart3,
  },
  {
    title: "Quality Candidates",
    description: "Focus on top performers identified through objective skill assessments.",
    icon: Award,
  },
  {
    title: "Secure & Compliant",
    description: "Enterprise-grade security ensures your data is protected at all times.",
    icon: Shield,
  },
];

export function Features() {
  return (
    <section id="features" className="bg-gray-50 py-20">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Transforming Recruitment with AI
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Discover how our platform makes hiring faster, fairer, and more effective.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Card key={index} className="border-none shadow-md">
              <CardHeader>
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
} 