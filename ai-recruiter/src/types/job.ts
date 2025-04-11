export interface Job {
  id: string;
  title: string;
  company: string;
  description: string;
  requiredSkills: string[];
  jobType: string;
  salary: string | null;
  location: string;
  postedDate: string;
  employerId: string;
  applicantsCount: number;
} 