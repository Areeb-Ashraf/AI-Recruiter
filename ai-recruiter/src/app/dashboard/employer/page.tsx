"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, Briefcase, Users, Edit, Trash2, Loader2, ChevronRight, LogOut, User, Building2, MapPin, Calendar, DollarSign, Code, CheckCircle2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { Job } from "@/types/job";
import { JobEditForm } from "@/components/jobs/job-edit-form";
import { EmployerJobDetailDialog } from "@/components/jobs/employer-job-detail-dialog";
import { ApplicantsList } from "@/components/applicants/applicants-list";
import { motion, AnimatePresence } from "framer-motion";

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
  // Add state for active tab
  const [activeTab, setActiveTab] = useState("jobs");

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };

  const cardVariants = {
    hidden: { scale: 0.95, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    },
    hover: {
      scale: 1.02,
      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      transition: { duration: 0.2 }
    }
  };

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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-[#101828] mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700">Loading your dashboard...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-[#101828] to-[#2a1b3d] shadow-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-white/10 p-2 rounded-md">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white">Employer Dashboard</h1>
            </div>
            <div className="flex items-center gap-4">
              <div 
                className="hidden md:flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full cursor-pointer hover:bg-white/20 transition-colors"
                onClick={() => router.push("/dashboard/employer/company-profile")}
              >
                <User className="h-4 w-4 text-white" />
                <span className="text-sm font-medium text-white">{session?.user?.name}</span>
              </div>
              <Button 
                onClick={handleLogout} 
                variant="outline" 
                className="flex items-center gap-2 border-white/20 text-black hover:text-white hover:bg-white/10"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <Tabs 
            defaultValue="jobs" 
            className="w-full" 
            onValueChange={setActiveTab}
          >
            <TabsList className="mb-6 bg-gray-100 p-1 rounded-lg">
              <TabsTrigger 
                value="jobs" 
                className={`flex items-center gap-2 cursor-pointer data-[state=active]:bg-white data-[state=active]:text-[#101828] data-[state=active]:shadow-sm transition-all ${activeTab === "jobs" ? "bg-white text-[#101828] shadow-sm" : ""}`}
              >
                <Briefcase className="h-4 w-4" />
                <span>My Jobs</span>
              </TabsTrigger>
              <TabsTrigger 
                value="applicants" 
                className={`flex items-center gap-2 cursor-pointer data-[state=active]:bg-white data-[state=active]:text-[#101828] data-[state=active]:shadow-sm transition-all ${activeTab === "applicants" ? "bg-white text-[#101828] shadow-sm" : ""}`}
              >
                <Users className="h-4 w-4" />
                <span>All Applicants</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="jobs">
              <motion.div variants={itemVariants}>
                {!isAddingJob ? (
                  <div className="mb-6">
                    <Button 
                      onClick={() => setIsAddingJob(true)} 
                      className="flex items-center gap-2 bg-gradient-to-r from-[#101828] to-[#2a1b3d] hover:from-[#0a1420] hover:to-[#1f1530] text-white shadow-md transition-all duration-200 transform hover:scale-[1.02]"
                    >
                      <PlusCircle className="h-4 w-4" />
                      <span>Add New Job</span>
                    </Button>
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="mb-8 shadow-lg border-0 overflow-hidden">
                      <div className="h-1 bg-gradient-to-r from-[#101828] to-[#2a1b3d]"></div>
                      <CardHeader>
                        <CardTitle className="text-xl">Create New Job Posting</CardTitle>
                        <CardDescription>Fill in the details for your new job opening</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <form onSubmit={handleAddJob} className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="title" className="flex items-center gap-1">
                                <Briefcase className="h-4 w-4 text-[#2a1b3d]" />
                                <span>Job Title</span>
                              </Label>
                              <Input 
                                id="title" 
                                placeholder="e.g. Frontend Developer" 
                                value={newJob.title}
                                onChange={(e) => setNewJob({...newJob, title: e.target.value})}
                                required
                                className="transition-all duration-200 focus:ring-2 focus:ring-[#2a1b3d]/20"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="company" className="flex items-center gap-1">
                                <Building2 className="h-4 w-4 text-[#2a1b3d]" />
                                <span>Company Name</span>
                              </Label>
                              <Input 
                                id="company" 
                                placeholder="e.g. TechCorp Inc." 
                                value={newJob.company}
                                onChange={(e) => setNewJob({...newJob, company: e.target.value})}
                                required
                                className="transition-all duration-200 focus:ring-2 focus:ring-[#2a1b3d]/20"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="jobType" className="flex items-center gap-1">
                                <Calendar className="h-4 w-4 text-[#2a1b3d]" />
                                <span>Job Type</span>
                              </Label>
                              <select 
                                id="jobType"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2a1b3d]/20 cursor-pointer transition-all duration-200"
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
                              <Label htmlFor="requiredSkills" className="flex items-center gap-1">
                                <Code className="h-4 w-4 text-[#2a1b3d]" />
                                <span>Required Skills (comma separated)</span>
                              </Label>
                              <Input 
                                id="requiredSkills" 
                                placeholder="e.g. React, JavaScript, CSS" 
                                value={newJob.requiredSkills}
                                onChange={(e) => setNewJob({...newJob, requiredSkills: e.target.value})}
                                required
                                className="transition-all duration-200 focus:ring-2 focus:ring-[#2a1b3d]/20"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="salary" className="flex items-center gap-1">
                                <DollarSign className="h-4 w-4 text-[#2a1b3d]" />
                                <span>Salary Range (optional)</span>
                              </Label>
                              <Input 
                                id="salary" 
                                placeholder="e.g. $80,000 - $100,000" 
                                value={newJob.salary}
                                onChange={(e) => setNewJob({...newJob, salary: e.target.value})}
                                className="transition-all duration-200 focus:ring-2 focus:ring-[#2a1b3d]/20"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="location" className="flex items-center gap-1">
                                <MapPin className="h-4 w-4 text-[#2a1b3d]" />
                                <span>Location</span>
                              </Label>
                              <Input 
                                id="location" 
                                placeholder="e.g. Remote, New York, Hybrid" 
                                value={newJob.location}
                                onChange={(e) => setNewJob({...newJob, location: e.target.value})}
                                required
                                className="transition-all duration-200 focus:ring-2 focus:ring-[#2a1b3d]/20"
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <Label htmlFor="description" className="flex items-center gap-1">
                                <CheckCircle2 className="h-4 w-4 text-[#2a1b3d]" />
                                <span>Job Description</span>
                              </Label>
                              <span className="text-xs text-gray-500">Formatting: Use line breaks for paragraphs and bullet points (•)</span>
                            </div>
                            <textarea 
                              id="description"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2a1b3d]/20 min-h-[200px] font-mono text-sm transition-all duration-200"
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
                              className="cursor-pointer transition-all duration-200 hover:bg-gray-100"
                              disabled={isSubmitting}
                            >
                              Cancel
                            </Button>
                            <Button 
                              type="submit" 
                              className="cursor-pointer flex items-center gap-2 bg-gradient-to-r from-[#101828] to-[#2a1b3d] hover:from-[#0a1420] hover:to-[#1f1530] text-white shadow-md transition-all duration-200 transform hover:scale-[1.02]"
                              disabled={isSubmitting}
                            >
                              {isSubmitting ? (
                                <>
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                  <span>Creating...</span>
                                </>
                              ) : (
                                <>
                                  <CheckCircle2 className="h-4 w-4" />
                                  <span>Create Job Posting</span>
                                </>
                              )}
                            </Button>
                          </div>
                        </form>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </motion.div>

              {isLoading ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-[#2a1b3d]" />
                </div>
              ) : jobs.length === 0 ? (
                <motion.div 
                  variants={itemVariants}
                  className="bg-white p-8 rounded-lg shadow-lg text-center border-0"
                >
                  <div className="bg-gradient-to-r from-[#101828]/10 to-[#2a1b3d]/10 p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                    <Briefcase className="h-10 w-10 text-[#2a1b3d]" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">No jobs posted yet</h3>
                  <p className="text-gray-600 mb-6">Create your first job posting to start recruiting candidates</p>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    className="inline-block"
                  >
                    <Button 
                      onClick={() => setIsAddingJob(true)} 
                      className="relative overflow-hidden bg-[#9f7aea] hover:bg-[#805ad5] text-white shadow-lg transition-all duration-300 transform hover:shadow-xl group"
                    >
                      <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 transform translate-x-[-100%] group-hover:translate-x-[100%]"></span>
                      <div className="flex items-center gap-2">
                        <PlusCircle className="h-5 w-5 animate-pulse" />
                        <span className="font-medium">Add Your First Job</span>
                      </div>
                    </Button>
                  </motion.div>
                </motion.div>
              ) : (
                <motion.div 
                  variants={containerVariants}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  <AnimatePresence>
                    {jobs.map((job) => (
                      <motion.div
                        key={job.id}
                        variants={cardVariants}
                        initial="hidden"
                        animate="visible"
                        whileHover="hover"
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Card className="flex flex-col h-full shadow-md border-0 overflow-hidden transition-all duration-300">
                          <div className="h-1 bg-gradient-to-r from-[#101828] to-[#2a1b3d]"></div>
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                              <div>
                                <CardTitle className="text-xl">{job.title}</CardTitle>
                                <p className="text-gray-600 text-sm mt-1 mb-3">{job.company}</p>
                                <CardDescription className="flex items-center gap-2 mt-1">
                                  <span className="bg-[#101828]/10 text-[#101828] text-xs font-medium px-2 py-0.5 rounded">{job.jobType}</span>
                                  <span className="bg-[#2a1b3d]/10 text-[#2a1b3d] text-xs font-medium px-2 py-0.5 rounded">{job.location}</span>
                                </CardDescription>
                              </div>
                              <div className="flex gap-1">
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-8 w-8 cursor-pointer hover:bg-[#101828]/10 transition-colors"
                                  onClick={() => handleEditJob(job)}
                                >
                                  <Edit className="h-4 w-4 text-[#101828]" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-8 w-8 text-red-500 cursor-pointer hover:bg-red-50 transition-colors" 
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
                                  <span key={index} className="bg-[#2a1b3d]/10 text-[#2a1b3d] text-xs font-medium px-2 py-0.5 rounded">
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            </div>
                            {job.salary && (
                              <div className="mt-3 flex items-center gap-1">
                                <DollarSign className="h-3 w-3 text-[#101828]" />
                                <p className="text-sm font-medium">{job.salary}</p>
                              </div>
                            )}
                          </CardContent>
                          <CardFooter className="border-t pt-4 flex justify-between">
                            <div className="text-xs text-gray-500 flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span>Posted: {new Date(job.postedDate).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="flex items-center gap-1 cursor-pointer hover:bg-[#101828]/10 transition-colors"
                              >
                                <Users className="h-3 w-3" />
                                <span>Applicants ({job.applicantsCount})</span>
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="flex items-center gap-1 cursor-pointer hover:bg-[#2a1b3d]/10 transition-colors"
                                onClick={() => handleViewJobDetails(job)}
                              >
                                <ChevronRight className="h-3 w-3" />
                                <span>Details</span>
                              </Button>
                            </div>
                          </CardFooter>
                        </Card>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              )}
            </TabsContent>
            
            <TabsContent value="applicants">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <ApplicantsList />
              </motion.div>
            </TabsContent>
          </Tabs>
        </motion.div>
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