"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save, User, Briefcase, GraduationCap, Mail, Phone, Globe, Code, Award } from "lucide-react";
import { motion } from "framer-motion";

export default function CandidateProfilePage() {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [candidateInfo, setCandidateInfo] = useState({
    name: "",
    title: "",
    bio: "",
    skills: "",
    experience: "",
    education: "",
    contactEmail: "",
    contactPhone: "",
    portfolio: "",
    certifications: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCandidateInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    setIsSaving(true);
    // Simulate saving
    setTimeout(() => {
      setIsSaving(false);
      // Show success message or redirect
      router.push("/dashboard/candidate");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-[#1e3a8a] to-[#3b82f6] shadow-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-white/10 p-2 rounded-md">
                <User className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white">Candidate Profile</h1>
            </div>
            <Button 
              onClick={() => router.push("/dashboard/candidate")} 
              variant="outline" 
              className="flex items-center gap-2 border-white/20 text-black hover:text-white hover:bg-white/10"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Back to Dashboard</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="shadow-lg border-0 overflow-hidden">
            <div className="h-1 bg-[#1e3a8a]"></div>
            <CardHeader>
              <CardTitle className="text-2xl">Professional Information</CardTitle>
              <CardDescription>Tell us about yourself and your professional background</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="flex items-center gap-1">
                      <User className="h-4 w-4 text-[#3b82f6]" />
                      <span>Full Name</span>
                    </Label>
                    <Input 
                      id="name" 
                      name="name"
                      placeholder="Enter your full name" 
                      value={candidateInfo.name}
                      onChange={handleChange}
                      className="transition-all duration-200 focus:ring-2 focus:ring-[#3b82f6]/20"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="title" className="flex items-center gap-1">
                      <Briefcase className="h-4 w-4 text-[#3b82f6]" />
                      <span>Professional Title</span>
                    </Label>
                    <Input 
                      id="title" 
                      name="title"
                      placeholder="e.g. Senior Software Engineer" 
                      value={candidateInfo.title}
                      onChange={handleChange}
                      className="transition-all duration-200 focus:ring-2 focus:ring-[#3b82f6]/20"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio" className="flex items-center gap-1">
                    <User className="h-4 w-4 text-[#3b82f6]" />
                    <span>Professional Bio</span>
                  </Label>
                  <Textarea 
                    id="bio" 
                    name="bio"
                    placeholder="Write a brief professional summary about yourself" 
                    value={candidateInfo.bio}
                    onChange={handleChange}
                    className="min-h-[120px] transition-all duration-200 focus:ring-2 focus:ring-[#3b82f6]/20"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="skills" className="flex items-center gap-1">
                    <Code className="h-4 w-4 text-[#3b82f6]" />
                    <span>Skills</span>
                  </Label>
                  <Textarea 
                    id="skills" 
                    name="skills"
                    placeholder="List your key skills (comma separated)" 
                    value={candidateInfo.skills}
                    onChange={handleChange}
                    className="min-h-[80px] transition-all duration-200 focus:ring-2 focus:ring-[#3b82f6]/20"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experience" className="flex items-center gap-1">
                    <Briefcase className="h-4 w-4 text-[#3b82f6]" />
                    <span>Work Experience</span>
                  </Label>
                  <Textarea 
                    id="experience" 
                    name="experience"
                    placeholder="Describe your work experience, including company names, roles, and dates" 
                    value={candidateInfo.experience}
                    onChange={handleChange}
                    className="min-h-[120px] transition-all duration-200 focus:ring-2 focus:ring-[#3b82f6]/20"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="education" className="flex items-center gap-1">
                    <GraduationCap className="h-4 w-4 text-[#3b82f6]" />
                    <span>Education</span>
                  </Label>
                  <Textarea 
                    id="education" 
                    name="education"
                    placeholder="List your educational background, including degrees, institutions, and graduation years" 
                    value={candidateInfo.education}
                    onChange={handleChange}
                    className="min-h-[120px] transition-all duration-200 focus:ring-2 focus:ring-[#3b82f6]/20"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="certifications" className="flex items-center gap-1">
                    <Award className="h-4 w-4 text-[#3b82f6]" />
                    <span>Certifications</span>
                  </Label>
                  <Textarea 
                    id="certifications" 
                    name="certifications"
                    placeholder="List any relevant certifications or professional qualifications" 
                    value={candidateInfo.certifications}
                    onChange={handleChange}
                    className="min-h-[80px] transition-all duration-200 focus:ring-2 focus:ring-[#3b82f6]/20"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contactEmail" className="flex items-center gap-1">
                      <Mail className="h-4 w-4 text-[#3b82f6]" />
                      <span>Contact Email</span>
                    </Label>
                    <Input 
                      id="contactEmail" 
                      name="contactEmail"
                      type="email"
                      placeholder="your.email@example.com" 
                      value={candidateInfo.contactEmail}
                      onChange={handleChange}
                      className="transition-all duration-200 focus:ring-2 focus:ring-[#3b82f6]/20"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contactPhone" className="flex items-center gap-1">
                      <Phone className="h-4 w-4 text-[#3b82f6]" />
                      <span>Contact Phone</span>
                    </Label>
                    <Input 
                      id="contactPhone" 
                      name="contactPhone"
                      placeholder="+1 (555) 123-4567" 
                      value={candidateInfo.contactPhone}
                      onChange={handleChange}
                      className="transition-all duration-200 focus:ring-2 focus:ring-[#3b82f6]/20"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="portfolio" className="flex items-center gap-1">
                      <Globe className="h-4 w-4 text-[#3b82f6]" />
                      <span>Portfolio/LinkedIn</span>
                    </Label>
                    <Input 
                      id="portfolio" 
                      name="portfolio"
                      placeholder="https://www.linkedin.com/in/yourprofile" 
                      value={candidateInfo.portfolio}
                      onChange={handleChange}
                      className="transition-all duration-200 focus:ring-2 focus:ring-[#3b82f6]/20"
                    />
                  </div>
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button 
                onClick={handleSave}
                className="relative overflow-hidden bg-[#3b82f6] hover:bg-[#2563eb] text-white shadow-lg transition-all duration-300 transform hover:shadow-xl group"
                disabled={isSaving}
              >
                {isSaving ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Saving...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Save className="h-4 w-4" />
                    <span>Save Profile</span>
                  </div>
                )}
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </div>
  );
} 