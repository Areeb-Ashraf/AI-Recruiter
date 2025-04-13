"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, Building2, MapPin, ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";

export default function InterviewPage() {
  const router = useRouter();
  const { jobId } = useParams();
  const { data: session, status } = useSession();
  const [job, setJob] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  
  // Sample interview questions (will be replaced with actual AI interview later)
  const sampleQuestions = [
    "Tell me about your experience with the technologies mentioned in the job description.",
    "Describe a challenging project you've worked on and how you approached it.",
    "How do you stay updated with the latest trends in your field?",
    "What interests you about this position and company?",
    "Do you have any questions for us?"
  ];
  
  const [answers, setAnswers] = useState<string[]>(Array(sampleQuestions.length).fill(""));
  
  // Auth check and fetch job data
  useEffect(() => {
    if (status === "loading") return;
    
    if (status === "unauthenticated") {
      router.push("/auth/login");
      return;
    }
    
    if (session?.user?.role !== "CANDIDATE") {
      router.push("/dashboard/employer");
      return;
    }
    
    fetchJob();
  }, [session, status, router, jobId]);
  
  const fetchJob = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/jobs/${jobId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch job details');
      }
      
      const data = await response.json();
      setJob(data);
    } catch (error) {
      console.error('Error fetching job:', error);
      toast.error('Failed to load job details');
      router.push('/dashboard/candidate');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleAnswerChange = (index: number, value: string) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };
  
  const goToNextQuestion = () => {
    if (currentStep < sampleQuestions.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };
  
  const goToPreviousQuestion = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const handleSubmitInterview = async () => {
    try {
      setIsSubmitting(true);
      
      const response = await fetch('/api/interviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          jobId,
          // In a real implementation, we would also submit answers
        })
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to submit interview');
      }
      
      toast.success('Interview submitted successfully!');
      // Navigate back to dashboard
      router.push('/dashboard/candidate?tab=interviews');
    } catch (error: any) {
      console.error('Error submitting interview:', error);
      toast.error(error.message || 'Failed to submit interview');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isLoading || !job) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <Button 
          variant="ghost" 
          className="mb-6 flex items-center gap-2"
          onClick={() => router.push('/dashboard/candidate')}
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Dashboard</span>
        </Button>
        
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
              <Briefcase className="h-4 w-4" />
              <span>{job.jobType}</span>
              {job.location && (
                <>
                  <span className="mx-1">•</span>
                  <MapPin className="h-4 w-4" />
                  <span>{job.location}</span>
                </>
              )}
            </div>
            <CardTitle className="text-2xl">{job.title}</CardTitle>
            <div className="flex items-center gap-2 mt-1 text-gray-600">
              <Building2 className="h-4 w-4" />
              <span>{job.company}</span>
            </div>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>AI Interview</CardTitle>
            <p className="text-gray-500 text-sm mt-1">
              Question {currentStep + 1} of {sampleQuestions.length}
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <h3 className="text-lg font-medium">{sampleQuestions[currentStep]}</h3>
              <textarea
                className="w-full min-h-[200px] p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Type your answer here..."
                value={answers[currentStep]}
                onChange={(e) => handleAnswerChange(currentStep, e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={goToPreviousQuestion}
              disabled={currentStep === 0}
            >
              Previous
            </Button>
            <div>
              {currentStep === sampleQuestions.length - 1 ? (
                <Button 
                  onClick={handleSubmitInterview}
                  className="bg-indigo-600 hover:bg-indigo-700 cursor-pointer"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Interview'
                  )}
                </Button>
              ) : (
                <Button 
                  onClick={goToNextQuestion}
                >
                  Next
                </Button>
              )}
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
} 