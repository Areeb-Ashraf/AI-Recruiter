"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { UserRole } from "@prisma/client";
import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import { Building2, User, Mail, Lock, CheckCircle2, AlertCircle } from "lucide-react";

const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
});

type SignupFormValues = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const router = useRouter();
  const [role, setRole] = useState<"employer" | "candidate">("employer");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: SignupFormValues) => {
    try {
      setError(null);
      setIsLoading(true);
      
      // Create user with the selected role via API
      const userRole = role === "employer" ? UserRole.EMPLOYER : UserRole.CANDIDATE;
      
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
          role: userRole
        })
      });
      
      const responseData = await response.json();
      
      if (!response.ok) {
        setError(responseData.error || "Failed to create account. Please try again.");
        setIsLoading(false);
        return;
      }
      
      // Sign in the user
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });
      
      if (result?.error) {
        setError("Authentication failed after signup. Please log in manually.");
        setIsLoading(false);
        return;
      }
      
      // Direct redirect based on selected role
      if (role === "employer") {
        window.location.href = "/dashboard/employer";
      } else {
        window.location.href = "/dashboard/candidate";
      }
      
    } catch (error) {
      console.error("Signup error:", error);
      setError("An error occurred during signup. Please try again.");
      setIsLoading(false);
    }
  };

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

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Header Bar */}
      <nav className="py-4 shadow-md" style={{ backgroundColor: '#101828' }}>
        <div className="container flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold pl-6 text-white flex items-center gap-2">
            <span className="bg-white/10 p-1 rounded-md">AI</span> Recruiter
          </Link>
        </div>
      </nav>
      
      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="w-full max-w-md"
        >
          <Card className="w-full shadow-lg border-0 overflow-hidden transition-all duration-300 hover:shadow-xl hover:translate-y-[-4px]">
            <CardHeader className="pb-2">
              <motion.div variants={itemVariants}>
                <CardTitle className="text-2xl text-center font-bold">Create Account</CardTitle>
                <CardDescription className="text-center mt-2">
                  Join AI Recruiter to start hiring or find your next opportunity
                </CardDescription>
              </motion.div>
            </CardHeader>
            
            <CardContent>
              <motion.div variants={itemVariants}>
                <Tabs 
                  defaultValue="employer" 
                  className="mb-6" 
                  onValueChange={(value) => {
                    setRole(value as "employer" | "candidate");
                    reset(); // Reset form on role change
                  }}
                >
                  <TabsList className="grid w-full grid-cols-2 p-1 bg-gray-100">
                    <TabsTrigger 
                      value="employer" 
                      className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm transition-all"
                    >
                      <Building2 className="w-4 h-4 mr-2" />
                      I'm an Employer
                    </TabsTrigger>
                    <TabsTrigger 
                      value="candidate" 
                      className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm transition-all"
                    >
                      <User className="w-4 h-4 mr-2" />
                      I'm a Candidate
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="employer" className="mt-2 text-center text-sm text-gray-600">
                    Create job postings and find the best candidates
                  </TabsContent>
                  <TabsContent value="candidate" className="mt-2 text-center text-sm text-gray-600">
                    Discover opportunities and showcase your skills
                  </TabsContent>
                </Tabs>
              </motion.div>
              
              {error && (
                <motion.div 
                  variants={itemVariants}
                  className="bg-red-50 text-red-600 text-sm p-3 rounded-md mb-4 flex items-center gap-2"
                >
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </motion.div>
              )}
              
              <motion.form 
                variants={containerVariants}
                onSubmit={handleSubmit(onSubmit)} 
                className="space-y-4"
              >
                <motion.div variants={itemVariants} className="space-y-2">
                  <Label htmlFor="name" className={cn(errors.name && "text-red-600")}>Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="John Doe"
                      {...register("name")}
                      className={cn(
                        "pl-10 transition-all duration-200 focus:ring-2 focus:ring-blue-500/20",
                        errors.name ? "border-red-500" : "border-gray-200"
                      )}
                    />
                  </div>
                  {errors.name && (
                    <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.name.message}
                    </p>
                  )}
                </motion.div>
                
                <motion.div variants={itemVariants} className="space-y-2">
                  <Label htmlFor="email" className={cn(errors.email && "text-red-600")}>Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      {...register("email")}
                      className={cn(
                        "pl-10 transition-all duration-200 focus:ring-2 focus:ring-blue-500/20",
                        errors.email ? "border-red-500" : "border-gray-200"
                      )}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.email.message}
                    </p>
                  )}
                </motion.div>
                
                <motion.div variants={itemVariants} className="space-y-2">
                  <Label htmlFor="password" className={cn(errors.password && "text-red-600")}>Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      {...register("password")}
                      className={cn(
                        "pl-10 transition-all duration-200 focus:ring-2 focus:ring-blue-500/20",
                        errors.password ? "border-red-500" : "border-gray-200"
                      )}
                    />
                  </div>
                  {errors.password && (
                    <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.password.message}
                    </p>
                  )}
                </motion.div>
                
                <motion.div variants={itemVariants} className="text-xs text-gray-600">
                  By signing up, you agree to our{" "}
                  <Link href="#" className="text-blue-600 hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="#" className="text-blue-600 hover:underline">
                    Privacy Policy
                  </Link>
                  .
                </motion.div>
                
                <motion.div variants={itemVariants}>
                  <Button 
                    type="submit" 
                    className="w-full bg-[#101828] hover:bg-[#0a1420] text-white shadow-md transition-all duration-200 transform hover:scale-[1.02]" 
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating Account...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" />
                        Sign Up as {role === "employer" ? "Employer" : "Candidate"}
                      </span>
                    )}
                  </Button>
                </motion.div>
              </motion.form>
            </CardContent>
            
            <CardFooter className="flex flex-col space-y-4 pt-2 pb-6">
              <motion.div variants={itemVariants} className="text-center text-sm">
                Already have an account?{" "}
                <Link href="/auth/login" className="text-blue-600 hover:underline font-medium">
                  Log in
                </Link>
              </motion.div>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </div>
  );
} 