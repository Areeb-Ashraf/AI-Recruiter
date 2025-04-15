"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, Briefcase, Users, Edit, Trash2, Loader2, ChevronRight } from "lucide-react";
import { toast } from "react-hot-toast";
import { Job } from "@/types/job";
import { JobEditForm } from "@/components/jobs/job-edit-form";
import { EmployerJobDetailDialog } from "@/components/jobs/employer-job-detail-dialog";
import { ApplicantsList } from "@/components/applicants/applicants-list";

export default function EmployerDashboardPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isAddingJob, setIsAddingJob] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [newJob, setNewJob] = useState({
    title: "",
    company: "",
    description: "",
    requiredSkills: "",
    jobType: "Full-Time",
    salary: "",
    location: ""
  });
  // Add state for job editing
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  // Add state for job detail dialog
  const [viewingJob, setViewingJob] = useState<Job | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);

  // Fetch jobs on component mount
  useEffect(() => {
    if (status === "loading") return;
    
    if (status === "unauthenticated") {
      router.push("/auth/login");
      return;
    }
    
    // Check if user is an employer
    if (session?.user?.role !== "EMPLOYER") {
      router.push("/dashboard/candidate");
      return;
    }

    // Fetch jobs from the API
    fetchJobs();
  }, [session, status, router]);

  // Fetch jobs from the API
  const fetchJobs = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/jobs');
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch jobs');
      }
      
      const data = await response.json();
      setJobs(data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast.error('Failed to load your jobs');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: "/" });
  };

  const handleAddJob = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      
      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newJob)
      });
      
      if (!response.ok) {
        throw new Error('Failed to create job');
      }
      
      const createdJob = await response.json();
      
      // Update the local state with the new job
      setJobs([createdJob, ...jobs]);
      setIsAddingJob(false);
      toast.success('Job posted successfully!');
      
      // Reset the form
      setNewJob({
        title: "",
        company: "",
        description: "",
        requiredSkills: "",
        jobType: "Full-Time",
        salary: "",
        location: ""
      });
    } catch (error) {
      console.error('Error creating job:', error);
      toast.error('Failed to create job');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteJob = async (id: string) => {
    if (!confirm('Are you sure you want to delete this job?')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/jobs/${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete job');
      }
      
      // Update the local state by removing the deleted job
      setJobs(jobs.filter(job => job.id !== id));
      toast.success('Job deleted successfully!');
    } catch (error) {
      console.error('Error deleting job:', error);
      toast.error('Failed to delete job');
    }
  };

  const handleEditJob = (job: Job) => {
    setEditingJob(job);
    setIsEditDialogOpen(true);
  };

  const handleJobUpdated = (updatedJob: Job) => {
    // Update the job in the local state
    setJobs(jobs.map(job => job.id === updatedJob.id ? updatedJob : job));
  };

  const handleViewJobDetails = (job: Job) => {
    setViewingJob(job);
    setIsDetailDialogOpen(true);
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-b border-gray-200 py-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Employer Dashboard</h1>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600 hidden md:block">Welcome, {session?.user?.name}</div>
            <Button onClick={handleLogout} variant="outline" className="cursor-pointer">Logout</Button>
          </div>
        </div>

        <div className="py-8">
          <Tabs defaultValue="jobs" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="jobs" className="flex items-center gap-2 cursor-pointer">
                <Briefcase className="h-4 w-4" />
                <span>My Jobs</span>
              </TabsTrigger>
              <TabsTrigger value="applicants" className="flex items-center gap-2 cursor-pointer">
                <Users className="h-4 w-4" />
                <span>All Applicants</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="jobs">
              {!isAddingJob ? (
                <div className="mb-6">
                  <Button 
                    onClick={() => setIsAddingJob(true)} 
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <PlusCircle className="h-4 w-4" />
                    <span>Add New Job</span>
                  </Button>
                </div>
              ) : (
                <Card className="mb-8">
                  <CardHeader>
                    <CardTitle>Create New Job Posting</CardTitle>
                    <CardDescription>Fill in the details for your new job opening</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleAddJob} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="title">Job Title</Label>
                          <Input 
                            id="title" 
                            placeholder="e.g. Frontend Developer" 
                            value={newJob.title}
                            onChange={(e) => setNewJob({...newJob, title: e.target.value})}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="company">Company Name</Label>
                          <Input 
                            id="company" 
                            placeholder="e.g. TechCorp Inc." 
                            value={newJob.company}
                            onChange={(e) => setNewJob({...newJob, company: e.target.value})}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="jobType">Job Type</Label>
                          <select 
                            id="jobType"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
                            value={newJob.jobType}
                            onChange={(e) => setNewJob({...newJob, jobType: e.target.value})}
                          >
                            <option value="Full-Time">Full-Time</option>
                            <option value="Part-Time">Part-Time</option>
                            <option value="Remote">Remote</option>
                            <option value="Hybrid">Hybrid</option>
                            <option value="Contract">Contract</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="requiredSkills">Required Skills (comma separated)</Label>
                          <Input 
                            id="requiredSkills" 
                            placeholder="e.g. React, JavaScript, CSS" 
                            value={newJob.requiredSkills}
                            onChange={(e) => setNewJob({...newJob, requiredSkills: e.target.value})}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="salary">Salary Range (optional)</Label>
                          <Input 
                            id="salary" 
                            placeholder="e.g. $80,000 - $100,000" 
                            value={newJob.salary}
                            onChange={(e) => setNewJob({...newJob, salary: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="location">Location</Label>
                          <Input 
                            id="location" 
                            placeholder="e.g. Remote, New York, Hybrid" 
                            value={newJob.location}
                            onChange={(e) => setNewJob({...newJob, location: e.target.value})}
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <Label htmlFor="description">Job Description</Label>
                          <span className="text-xs text-gray-500">Formatting: Use line breaks for paragraphs and bullet points (•)</span>
                        </div>
                        <textarea 
                          id="description"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary min-h-[200px] font-mono text-sm"
                          placeholder="Describe the job responsibilities and requirements...

Example formatting:
• Responsibility 1
• Responsibility 2

Required Qualifications:
• Qualification 1
• Qualification 2"
                          value={newJob.description}
                          onChange={(e) => setNewJob({...newJob, description: e.target.value})}
                          required
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => setIsAddingJob(false)} 
                          className="cursor-pointer"
                          disabled={isSubmitting}
                        >
                          Cancel
                        </Button>
                        <Button 
                          type="submit" 
                          className="cursor-pointer flex items-center gap-2"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              <span>Creating...</span>
                            </>
                          ) : (
                            <span>Create Job Posting</span>
                          )}
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              )}

              {isLoading ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : jobs.length === 0 ? (
                <div className="bg-white p-8 rounded-lg shadow text-center">
                  <Briefcase className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No jobs posted yet</h3>
                  <p className="text-gray-600 mb-6">Create your first job posting to start recruiting candidates</p>
                  <Button 
                    onClick={() => setIsAddingJob(true)} 
                    className="cursor-pointer"
                  >
                    Add Your First Job
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {jobs.map((job) => (
                    <Card key={job.id} className="flex flex-col h-full">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-xl">{job.title}</CardTitle>
                            <p className="text-gray-600 text-sm mt-1 mb-3">{job.company}</p>
                            <CardDescription className="flex items-center gap-2 mt-1">
                              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded">{job.jobType}</span>
                              <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded">{job.location}</span>
                            </CardDescription>
                          </div>
                          <div className="flex gap-1">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 cursor-pointer"
                              onClick={() => handleEditJob(job)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-red-500 cursor-pointer" 
                              onClick={() => handleDeleteJob(job.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="flex-grow">
                        <div className="text-sm text-gray-600 mb-3 whitespace-pre-line line-clamp-3">{job.description}</div>
                        <div className="mt-2">
                          <p className="text-xs text-gray-500 mb-1">Required Skills:</p>
                          <div className="flex flex-wrap gap-1">
                            {job.requiredSkills.map((skill, index) => (
                              <span key={index} className="bg-gray-100 text-gray-800 text-xs font-medium px-2 py-0.5 rounded">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                        {job.salary && (
                          <div className="mt-3">
                            <p className="text-sm font-medium">{job.salary}</p>
                          </div>
                        )}
                      </CardContent>
                      <CardFooter className="border-t pt-4 flex justify-between">
                        <div className="text-xs text-gray-500">
                          Posted: {new Date(job.postedDate).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" className="flex items-center gap-1 cursor-pointer">
                            <Users className="h-3 w-3" />
                            <span>Applicants ({job.applicantsCount})</span>
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="flex items-center gap-1 cursor-pointer"
                            onClick={() => handleViewJobDetails(job)}
                          >
                            <ChevronRight className="h-3 w-3" />
                            <span>Details</span>
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="applicants">
              <ApplicantsList />
            </TabsContent>
          </Tabs>
        </div>
      </div>
      {editingJob && (
        <JobEditForm
          job={editingJob}
          isOpen={isEditDialogOpen}
          onClose={() => setIsEditDialogOpen(false)}
          onJobUpdated={handleJobUpdated}
        />
      )}
      {viewingJob && (
        <EmployerJobDetailDialog
          job={viewingJob}
          isOpen={isDetailDialogOpen}
          onClose={() => setIsDetailDialogOpen(false)}
          onEdit={handleEditJob}
          onDelete={handleDeleteJob}
        />
      )}
    </div>
  );
} 