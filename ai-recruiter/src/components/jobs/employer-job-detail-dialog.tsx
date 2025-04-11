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
import { Calendar, MapPin, DollarSign, Briefcase, Edit, Trash2 } from "lucide-react";

interface EmployerJobDetailDialogProps {
  job: Job | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (job: Job) => void;
  onDelete: (jobId: string) => void;
}

export function EmployerJobDetailDialog({ 
  job, 
  isOpen, 
  onClose, 
  onEdit, 
  onDelete 
}: EmployerJobDetailDialogProps) {
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
          
          {/* Applicants info */}
          <div className="mt-4">
            <div className="bg-blue-50 p-3 rounded-md border border-blue-100 flex items-center justify-between">
              <span className="text-sm font-medium text-blue-700">Total Applicants: {job.applicantsCount}</span>
            </div>
          </div>
        </div>
        
        <div className="flex gap-2 justify-end">
          <Button 
            variant="outline" 
            className="flex items-center gap-1"
            onClick={onClose}
          >
            Close
          </Button>
          <Button 
            variant="outline"
            className="flex items-center gap-1 text-red-600 border-red-200 hover:bg-red-50"
            onClick={() => onDelete(job.id)}
          >
            <Trash2 className="h-4 w-4" />
            <span>Delete</span>
          </Button>
          <Button 
            className="flex items-center gap-1"
            onClick={() => onEdit(job)}
          >
            <Edit className="h-4 w-4" />
            <span>Edit</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 