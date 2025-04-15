"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Loader2, Search, Filter, ChevronRight, ChevronDown, ChevronUp, User, Briefcase, Calendar, Star } from "lucide-react";
import { toast } from "react-hot-toast";

interface Interview {
  id: string;
  jobId: string;
  candidateId: string;
  date: string;
  duration: string;
  status: string;
  score: string;
  feedback: string;
  job: {
    id: string;
    title: string;
    company: string;
    jobType: string;
  };
  candidate: {
    id: string;
    name: string;
    email: string;
  };
}

interface Job {
  id: string;
  title: string;
}

export function ApplicantsList() {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedJob, setSelectedJob] = useState<string>("all");
  const [expandedInterview, setExpandedInterview] = useState<string | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    fetchInterviews();
    fetchJobs();
  }, []);

  const fetchInterviews = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/interviews/employer');
      
      if (!response.ok) {
        throw new Error('Failed to fetch interviews');
      }
      
      const data = await response.json();
      setInterviews(data);
    } catch (error) {
      console.error('Error fetching interviews:', error);
      toast.error('Failed to load applicants');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchJobs = async () => {
    try {
      const response = await fetch('/api/jobs');
      
      if (!response.ok) {
        throw new Error('Failed to fetch jobs');
      }
      
      const data = await response.json();
      setJobs(data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  };

  const filteredInterviews = interviews.filter(interview => {
    const matchesSearch = 
      interview.candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      interview.candidate.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      interview.job.title.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesJob = selectedJob === "all" || interview.jobId === selectedJob;
    
    return matchesSearch && matchesJob;
  });

  const getScoreColor = (score: string) => {
    const scoreNum = parseInt(score);
    if (scoreNum >= 85) return "bg-green-100 text-green-800";
    if (scoreNum >= 70) return "bg-amber-100 text-amber-800";
    return "bg-red-100 text-red-800";
  };

  const toggleExpand = (interviewId: string) => {
    setExpandedInterview(expandedInterview === interviewId ? null : interviewId);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by candidate name, email, or job title..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={selectedJob} onValueChange={setSelectedJob}>
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Filter by job" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Jobs</SelectItem>
            {jobs.map(job => (
              <SelectItem key={job.id} value={job.id}>
                {job.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Applicants List */}
      {filteredInterviews.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500">No applicants found for your jobs yet.</p>
            <p className="text-gray-500 mt-2">Candidates will appear here once they complete their interviews.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredInterviews.map(interview => (
            <Card key={interview.id} className="overflow-hidden">
              <div className={`w-full h-1.5 ${
                parseInt(interview.score) > 85 ? "bg-green-500" : 
                parseInt(interview.score) > 70 ? "bg-amber-500" : "bg-red-500"
              }`}></div>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <CardTitle className="text-lg">{interview.candidate.name}</CardTitle>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{interview.candidate.email}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleExpand(interview.id)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    {expandedInterview === interview.id ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pb-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Briefcase className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{interview.job.title}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">
                        {new Date(interview.date).toLocaleDateString()}
                      </span>
                    </div>
                    <Badge variant="outline" className={getScoreColor(interview.score)}>
                      <Star className="h-3 w-3 mr-1" />
                      {interview.score}
                    </Badge>
                  </div>
                  
                  {expandedInterview === interview.id && (
                    <div className="mt-4 space-y-4 border-t pt-4">
                      <div>
                        <h4 className="text-sm font-medium mb-2">Interview Details</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs text-gray-500">Duration</p>
                            <p className="text-sm">{interview.duration}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Status</p>
                            <p className="text-sm">{interview.status}</p>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium mb-2">Feedback</h4>
                        <p className="text-sm text-gray-700">{interview.feedback}</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
} 