"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save, Building2, Users, Mail, Phone, Globe, Briefcase } from "lucide-react";
import { motion } from "framer-motion";

export default function CompanyProfilePage() {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [companyInfo, setCompanyInfo] = useState({
    name: "",
    description: "",
    lookingFor: "",
    contactEmail: "",
    contactPhone: "",
    website: "",
    industry: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCompanyInfo(prev => ({
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
      router.push("/dashboard/employer");
    }, 1500);
  };

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
              <h1 className="text-2xl font-bold text-white">Company Profile</h1>
            </div>
            <Button 
              onClick={() => router.push("/dashboard/employer")} 
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
            <div className="h-1 bg-[#101828]"></div>
            <CardHeader>
              <CardTitle className="text-2xl">Company Information</CardTitle>
              <CardDescription>Tell us about your company and what you're looking for</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center gap-1">
                    <Building2 className="h-4 w-4 text-[#2a1b3d]" />
                    <span>Company Name</span>
                  </Label>
                  <Input 
                    id="name" 
                    name="name"
                    placeholder="Enter your company name" 
                    value={companyInfo.name}
                    onChange={handleChange}
                    className="transition-all duration-200 focus:ring-2 focus:ring-[#2a1b3d]/20"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="flex items-center gap-1">
                    <Briefcase className="h-4 w-4 text-[#2a1b3d]" />
                    <span>Company Description</span>
                  </Label>
                  <Textarea 
                    id="description" 
                    name="description"
                    placeholder="Describe your company, its mission, and values" 
                    value={companyInfo.description}
                    onChange={handleChange}
                    className="min-h-[120px] transition-all duration-200 focus:ring-2 focus:ring-[#2a1b3d]/20"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lookingFor" className="flex items-center gap-1">
                    <Users className="h-4 w-4 text-[#2a1b3d]" />
                    <span>What You're Looking For</span>
                  </Label>
                  <Textarea 
                    id="lookingFor" 
                    name="lookingFor"
                    placeholder="Describe the type of employees you're looking for, skills, experience, and qualities" 
                    value={companyInfo.lookingFor}
                    onChange={handleChange}
                    className="min-h-[120px] transition-all duration-200 focus:ring-2 focus:ring-[#2a1b3d]/20"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contactEmail" className="flex items-center gap-1">
                      <Mail className="h-4 w-4 text-[#2a1b3d]" />
                      <span>Contact Email</span>
                    </Label>
                    <Input 
                      id="contactEmail" 
                      name="contactEmail"
                      type="email"
                      placeholder="contact@company.com" 
                      value={companyInfo.contactEmail}
                      onChange={handleChange}
                      className="transition-all duration-200 focus:ring-2 focus:ring-[#2a1b3d]/20"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contactPhone" className="flex items-center gap-1">
                      <Phone className="h-4 w-4 text-[#2a1b3d]" />
                      <span>Contact Phone</span>
                    </Label>
                    <Input 
                      id="contactPhone" 
                      name="contactPhone"
                      placeholder="+1 (555) 123-4567" 
                      value={companyInfo.contactPhone}
                      onChange={handleChange}
                      className="transition-all duration-200 focus:ring-2 focus:ring-[#2a1b3d]/20"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="website" className="flex items-center gap-1">
                      <Globe className="h-4 w-4 text-[#2a1b3d]" />
                      <span>Company Website</span>
                    </Label>
                    <Input 
                      id="website" 
                      name="website"
                      placeholder="https://www.company.com" 
                      value={companyInfo.website}
                      onChange={handleChange}
                      className="transition-all duration-200 focus:ring-2 focus:ring-[#2a1b3d]/20"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="industry" className="flex items-center gap-1">
                      <Briefcase className="h-4 w-4 text-[#2a1b3d]" />
                      <span>Industry</span>
                    </Label>
                    <Input 
                      id="industry" 
                      name="industry"
                      placeholder="e.g. Technology, Healthcare, Finance" 
                      value={companyInfo.industry}
                      onChange={handleChange}
                      className="transition-all duration-200 focus:ring-2 focus:ring-[#2a1b3d]/20"
                    />
                  </div>
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button 
                onClick={handleSave}
                className="relative overflow-hidden bg-[#9f7aea] hover:bg-[#805ad5] text-white shadow-lg transition-all duration-300 transform hover:shadow-xl group"
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