"use client";

import { useState } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, Briefcase, Users, Edit, Trash2 } from "lucide-react";

// Sample job data (will be replaced with API calls later)
const sampleJobs = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    description: "Looking for an experienced frontend developer proficient in React, Next.js, and TypeScript.",
    requiredSkills: ["React", "Next.js", "TypeScript", "CSS"],
    jobType: "Full-Time",
    salary: "$120,000 - $150,000",
    location: "Remote",
    applicantsCount: 12,
    postedDate: "2023-12-15"
  },
  {
    id: 2,
    title: "Backend Engineer",
    description: "We need a skilled backend developer with experience in Node.js and database design.",
    requiredSkills: ["Node.js", "MongoDB", "Express", "API Design"],
    jobType: "Full-Time",
    salary: "$110,000 - $140,000",
    location: "On-site",
    applicantsCount: 8,
    postedDate: "2023-12-10"
  },
  {
    id: 3,
    title: "UX/UI Designer",
    description: "Create beautiful user interfaces and experiences for our web applications.",
    requiredSkills: ["Figma", "UI Design", "User Research", "Prototyping"],
    jobType: "Part-Time",
    salary: "$80,000 - $100,000",
    location: "Hybrid",
    applicantsCount: 5,
    postedDate: "2023-12-05"
  }
];

export default function EmployerDashboardPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isAddingJob, setIsAddingJob] = useState(false);
  const [newJob, setNewJob] = useState({
    title: "",
    description: "",
    requiredSkills: "",
    jobType: "Full-Time",
    salary: "",
    location: ""
  });
  const [jobs, setJobs] = useState(sampleJobs);

  useEffect(() => {
    if (status === "loading") return;
    
    if (status === "unauthenticated") {
      router.push("/auth/login");
      return;
    }
    
    // Check if user is an employer
    if (session?.user?.role !== "EMPLOYER") {
      router.push("/dashboard/candidate");
    }
  }, [session, status, router]);

  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: "/" });
  };

  const handleAddJob = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // In a real app, this would send data to the backend
    const newJobWithId = {
      ...newJob,
      id: jobs.length + 1,
      requiredSkills: newJob.requiredSkills.split(",").map(skill => skill.trim()),
      applicantsCount: 0,
      postedDate: new Date().toISOString().split("T")[0]
    };
    setJobs([newJobWithId, ...jobs]);
    setIsAddingJob(false);
    setNewJob({
      title: "",
      description: "",
      requiredSkills: "",
      jobType: "Full-Time",
      salary: "",
      location: ""
    });
  };

  const handleDeleteJob = (id: number) => {
    setJobs(jobs.filter(job => job.id !== id));
  };

  if (status === "loading") {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-b border-gray-200 py-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Employer Dashboard</h1>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600 hidden md:block">Welcome, {session?.user?.name}</div>
            <Button onClick={handleLogout} variant="outline">Logout</Button>
          </div>
        </div>

        <div className="py-8">
          <Tabs defaultValue="jobs" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="jobs" className="flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                <span>My Jobs</span>
              </TabsTrigger>
              <TabsTrigger value="applicants" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>All Applicants</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="jobs">
              {!isAddingJob ? (
                <div className="mb-6">
                  <Button 
                    onClick={() => setIsAddingJob(true)} 
                    className="flex items-center gap-2"
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
                          <Label htmlFor="jobType">Job Type</Label>
                          <select 
                            id="jobType"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
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
                        <Label htmlFor="description">Job Description</Label>
                        <textarea 
                          id="description"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary min-h-[100px]"
                          placeholder="Describe the job responsibilities and requirements..."
                          value={newJob.description}
                          onChange={(e) => setNewJob({...newJob, description: e.target.value})}
                          required
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={() => setIsAddingJob(false)}>Cancel</Button>
                        <Button type="submit">Create Job Posting</Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {jobs.map((job) => (
                  <Card key={job.id} className="flex flex-col h-full">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-xl">{job.title}</CardTitle>
                          <CardDescription className="flex items-center gap-2 mt-1">
                            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded">{job.jobType}</span>
                            <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded">{job.location}</span>
                          </CardDescription>
                        </div>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500" onClick={() => handleDeleteJob(job.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <p className="text-sm text-gray-600 line-clamp-3 mb-3">{job.description}</p>
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
                        Posted: {job.postedDate}
                      </div>
                      <Button variant="outline" size="sm" className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        <span>Applicants ({job.applicantsCount})</span>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="applicants">
              <div className="bg-white p-8 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">All Applicants</h2>
                <p className="text-gray-600">This section will show all applicants across all your job postings.</p>
                <p className="text-gray-600 mt-2">Coming soon...</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
} 