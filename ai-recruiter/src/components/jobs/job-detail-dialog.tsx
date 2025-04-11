"use client";

import { Job } from "@/types/job";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, DollarSign, Briefcase } from "lucide-react";

interface JobDetailDialogProps {
  job: Job | null;
  isOpen: boolean;
  onClose: () => void;
  onApply: (jobId: string) => void;
}

export function JobDetailDialog({ job, isOpen, onClose, onApply }: JobDetailDialogProps) {
  if (!job) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{job.title}</DialogTitle>
          <DialogDescription className="text-base font-medium text-gray-700">
            {job.company}
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          {/* Job details */}
          <div className="flex flex-wrap gap-3 mb-4">
            <div className="flex items-center text-sm text-gray-600">
              <Briefcase className="w-4 h-4 mr-1" />
              <span>{job.jobType}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <MapPin className="w-4 h-4 mr-1" />
              <span>{job.location}</span>
            </div>
            {job.salary && (
              <div className="flex items-center text-sm text-gray-600">
                <DollarSign className="w-4 h-4 mr-1" />
                <span>{job.salary}</span>
              </div>
            )}
            <div className="flex items-center text-sm text-gray-600">
              <Calendar className="w-4 h-4 mr-1" />
              <span>Posted: {new Date(job.postedDate).toLocaleDateString()}</span>
            </div>
          </div>
          
          {/* Required skills */}
          <div className="mb-4">
            <h3 className="text-sm font-semibold mb-2">Required Skills:</h3>
            <div className="flex flex-wrap gap-2">
              {job.requiredSkills.map((skill, index) => (
                <span key={index} className="bg-gray-100 text-gray-800 text-xs font-medium px-2 py-1 rounded">
                  {skill}
                </span>
              ))}
            </div>
          </div>
          
          {/* Job description */}
          <div>
            <h3 className="text-sm font-semibold mb-2">Job Description:</h3>
            <div className="whitespace-pre-line text-sm bg-gray-50 p-4 rounded-md border border-gray-100">
              {job.description}
            </div>
          </div>
        </div>
        
        <div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button 
            className="bg-indigo-600 hover:bg-indigo-700 cursor-pointer"
            onClick={() => onApply(job.id)}
          >
            Take AI Interview
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 