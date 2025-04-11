"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { Job } from "@/types/job";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface JobEditFormProps {
  job: Job;
  isOpen: boolean;
  onClose: () => void;
  onJobUpdated: (updatedJob: Job) => void;
}

export function JobEditForm({ job, isOpen, onClose, onJobUpdated }: JobEditFormProps) {
  const [formData, setFormData] = useState({
    title: job.title,
    company: job.company,
    description: job.description,
    requiredSkills: job.requiredSkills.join(", "),
    jobType: job.jobType,
    salary: job.salary || "",
    location: job.location,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      
      const response = await fetch(`/api/jobs/${job.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update job');
      }
      
      const updatedJob = await response.json();
      onJobUpdated(updatedJob);
      toast.success('Job updated successfully!');
      onClose();
    } catch (error) {
      console.error('Error updating job:', error);
      toast.error('Failed to update job');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Job</DialogTitle>
          <DialogDescription>
            Make changes to the job posting. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Job Title</Label>
              <Input
                id="title"
                name="title"
                placeholder="e.g. Frontend Developer"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">Company Name</Label>
              <Input
                id="company"
                name="company"
                placeholder="e.g. TechCorp Inc."
                value={formData.company}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="jobType">Job Type</Label>
              <select
                id="jobType"
                name="jobType"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
                value={formData.jobType}
                onChange={handleChange}
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
                name="requiredSkills"
                placeholder="e.g. React, JavaScript, CSS"
                value={formData.requiredSkills}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="salary">Salary Range (optional)</Label>
              <Input
                id="salary"
                name="salary"
                placeholder="e.g. $80,000 - $100,000"
                value={formData.salary}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                name="location"
                placeholder="e.g. Remote, New York, Hybrid"
                value={formData.location}
                onChange={handleChange}
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
              name="description"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary min-h-[200px] font-mono text-sm"
              placeholder="Describe the job responsibilities and requirements..."
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>
          
          <DialogFooter className="pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              disabled={isSubmitting}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Updating...</span>
                </>
              ) : (
                <span>Save Changes</span>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 