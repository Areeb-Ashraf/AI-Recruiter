"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Briefcase, ClipboardList, Calendar, ChevronRight, Filter, Clock, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { Job } from "@/types/job";
import { JobDetailDialog } from "@/components/jobs/job-detail-dialog";

// Define Interview type
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
    location: string;
    salary: string | null;
  }
}

export default function CandidateDashboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get('tab');
  const { data: session, status } = useSession();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [jobTypeFilter, setJobTypeFilter] = useState<string>("All");
  const [showFilters, setShowFilters] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isInterviewsLoading, setIsInterviewsLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isJobDetailOpen, setIsJobDetailOpen] = useState(false);

  // Fetch all jobs and interviews from the database
  useEffect(() => {
    if (status === "authenticated") {
      fetchJobs();
      fetchInterviews();
    }
  }, [status]);

  // Authentication check
  useEffect(() => {
    if (status === "loading") return;
    
    if (status === "unauthenticated") {
      router.push("/auth/login");
      return;
    }
    
    // Check if user is a candidate
    if (session?.user?.role !== "CANDIDATE") {
      router.push("/dashboard/employer");
    }
  }, [session, status, router]);

  // Handle tab selection from URL parameter
  useEffect(() => {
    if (activeTab === 'interviews') {
      const interviewsTab = document.querySelector('[data-value="interviews"]');
      if (interviewsTab instanceof HTMLElement) {
        interviewsTab.click();
      }
    }
  }, [activeTab]);

  // Fetch jobs from the API
  const fetchJobs = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/jobs/public');
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch jobs');
      }
      
      const data = await response.json();
      setJobs(data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast.error('Failed to load available jobs');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch interviews from the API
  const fetchInterviews = async () => {
    try {
      setIsInterviewsLoading(true);
      const response = await fetch('/api/interviews');
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch interviews');
      }
      
      const data = await response.json();
      setInterviews(data);
    } catch (error) {
      console.error('Error fetching interviews:', error);
      toast.error('Failed to load your interviews');
    } finally {
      setIsInterviewsLoading(false);
    }
  };

  // Filter out jobs that the candidate has already interviewed for
  const interviewedJobIds = interviews.map(interview => interview.jobId);
  const availableJobs = jobs.filter(job => !interviewedJobIds.includes(job.id));

  // All available skills for filter (extracted from jobs)
  const allSkills = Array.from(
    new Set(availableJobs.flatMap(job => job.requiredSkills))
  ).sort();

  // Filtered jobs based on search and filters
  const filteredJobs = availableJobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          job.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          job.company.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesSkills = selectedSkills.length === 0 || 
                          selectedSkills.some(skill => job.requiredSkills.includes(skill));
    
    const matchesJobType = jobTypeFilter === "All" || job.jobType === jobTypeFilter;
    
    return matchesSearch && matchesSkills && matchesJobType;
  });

  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: "/" });
  };

  const toggleSkillFilter = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleTakeInterview = (jobId: string) => {
    router.push(`/interview/${jobId}`);
  };

  const handleViewJobDetails = (job: Job) => {
    setSelectedJob(job);
    setIsJobDetailOpen(true);
  };

  if (status === "loading") {
    return <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin" />
    </div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="py-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Candidate Dashboard</h1>
              <p className="text-gray-600 mt-1">Welcome, {session?.user?.name}</p>
            </div>
            <Button onClick={handleLogout} variant="outline" className="shrink-0 cursor-pointer">Logout</Button>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="py-6">
          <Tabs defaultValue="jobs" className="w-full">
            <div className="flex justify-center mb-8">
              <TabsList className="grid grid-cols-2 w-full h-full max-w-md ">
                <TabsTrigger value="jobs" className="flex items-center justify-center gap-2 py-3 text-base cursor-pointer">
                  <Briefcase className="h-4 w-4" />
                  <span>Find Jobs</span>
                </TabsTrigger>
                <TabsTrigger value="interviews" className="flex items-center justify-center gap-2 py-3 text-base cursor-pointer" data-value="interviews">
                  <ClipboardList className="h-4 w-4" />
                  <span>My Interviews</span>
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="jobs" className="space-y-6">
              {/* Search and filters */}
              <div className="rounded-lg bg-white shadow-sm p-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search jobs by title, company, or keywords..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <div className="mt-4 flex items-center justify-between">
                  <Button 
                    variant="outline" 
                    className="text-sm cursor-pointer"
                    onClick={() => setShowFilters(!showFilters)}
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    Filters {selectedSkills.length > 0 ? `(${selectedSkills.length})` : ''}
                  </Button>
                  
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="jobType" className="text-sm font-medium">Job Type:</Label>
                    <select
                      id="jobType"
                      className="text-sm border border-gray-300 rounded-md p-1.5 cursor-pointer"
                      value={jobTypeFilter}
                      onChange={(e) => setJobTypeFilter(e.target.value)}
                    >
                      <option value="All">All Types</option>
                      <option value="Full-Time">Full-Time</option>
                      <option value="Part-Time">Part-Time</option>
                      <option value="Remote">Remote</option>
                      <option value="Contract">Contract</option>
                      <option value="Hybrid">Hybrid</option>
                    </select>
                  </div>
                </div>
                
                {showFilters && (
                  <div className="mt-4 border-t pt-4">
                    <h3 className="text-sm font-medium mb-2">Filter by Skills:</h3>
                    <div className="flex flex-wrap gap-2">
                      {allSkills.map(skill => (
                        <button
                          key={skill}
                          className={`px-3 py-1 rounded-full text-xs font-medium cursor-pointer ${
                            selectedSkills.includes(skill)
                              ? "bg-blue-100 text-blue-800 border border-blue-200"
                              : "bg-gray-100 text-gray-800 border border-gray-200 hover:bg-gray-200"
                          }`}
                          onClick={() => toggleSkillFilter(skill)}
                        >
                          {skill}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Job listings */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-900">Available Positions</h2>
                  <p className="text-sm text-gray-500">{filteredJobs.length} jobs found</p>
                </div>
                
                {isLoading ? (
                  <div className="flex justify-center items-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                ) : filteredJobs.length === 0 ? (
                  <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                    <p className="text-gray-500">No jobs match your search criteria. Try adjusting your filters.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredJobs.map((job) => (
                      <Card key={job.id} className="overflow-hidden hover:shadow-md transition-shadow">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-xl">{job.title}</CardTitle>
                              <p className="text-gray-600 mt-1">{job.company}</p>
                            </div>
                            <div className="flex flex-col items-end">
                              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded">{job.jobType}</span>
                              <span className="text-xs text-gray-500 mt-1">Posted: {new Date(job.postedDate).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <div className="text-sm text-gray-600 mb-3 whitespace-pre-line line-clamp-3">
                            {job.description}
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Skills:</p>
                            <div className="flex flex-wrap gap-1">
                              {job.requiredSkills.map((skill, index) => (
                                <span key={index} className="bg-gray-100 text-gray-800 text-xs font-medium px-2 py-0.5 rounded">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="mt-3 flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium">{job.salary}</p>
                              <p className="text-xs text-gray-500 mt-0.5">{job.location}</p>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter className="bg-gray-50 pt-3 pb-3 flex justify-between items-center">
                          <Button 
                            variant="default" 
                            className="text-xs sm:text-sm bg-indigo-600 hover:bg-indigo-700 cursor-pointer"
                            onClick={() => handleTakeInterview(job.id)}
                          >
                            Take AI Interview
                          </Button>
                          <Button variant="ghost" size="sm" className="text-xs sm:text-sm flex items-center cursor-pointer" onClick={() => handleViewJobDetails(job)}>
                            View Details
                            <ChevronRight className="h-4 w-4 ml-1" />
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="interviews">
              <div className="rounded-lg bg-white shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Interview History</h2>
                
                {isInterviewsLoading ? (
                  <div className="flex justify-center items-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                ) : interviews.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">You haven't completed any interviews yet.</p>
                    <p className="text-gray-500 mt-2">Start by browsing available jobs and taking an interview.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {interviews.map((interview) => (
                      <Card key={interview.id} className="overflow-hidden">
                        <div className={`w-full h-1.5 ${
                          parseInt(interview.score) > 85 ? "bg-green-500" : 
                          parseInt(interview.score) > 70 ? "bg-amber-500" : "bg-red-500"
                        }`}></div>
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-lg">{interview.job.title}</CardTitle>
                              <p className="text-gray-600 text-sm">{interview.job.company}</p>
                            </div>
                            <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded text-xs font-medium">
                              <Clock className="h-3 w-3" />
                              <span>{interview.duration}</span>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <div className="flex items-center gap-4 mb-3">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4 text-gray-500" />
                              <span className="text-sm text-gray-600">{new Date(interview.date).toLocaleDateString()}</span>
                            </div>
                            <div className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                              {interview.status}
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <div>
                              <p className="text-xs text-gray-500">Performance Score:</p>
                              <div className="flex items-center gap-2">
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                  <div 
                                    className={`h-2.5 rounded-full ${
                                      parseInt(interview.score) > 85 ? "bg-green-500" : 
                                      parseInt(interview.score) > 70 ? "bg-amber-500" : "bg-red-500"
                                    }`} 
                                    style={{ width: interview.score }}
                                  ></div>
                                </div>
                                <span className="text-sm font-medium">{interview.score}</span>
                              </div>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Feedback:</p>
                              <p className="text-sm">{interview.feedback}</p>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter className="bg-gray-50 pt-3 pb-3">
                          <Button variant="outline" size="sm" className="w-full text-xs sm:text-sm cursor-pointer">
                            View Interview Details
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
      {selectedJob && (
        <JobDetailDialog
          job={selectedJob}
          isOpen={isJobDetailOpen}
          onClose={() => setIsJobDetailOpen(false)}
          onApply={handleTakeInterview}
        />
      )}
    </div>
  );
} 