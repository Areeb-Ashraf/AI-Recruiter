"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import { Mail, Lock, LogIn, AlertCircle } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      setError(null);
      setIsLoading(true);
      
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });
      
      if (result?.error) {
        setError("Invalid email or password");
        setIsLoading(false);
        return;
      }
      
      // Sign in successful - redirect to dashboard which will handle role-based routing
      router.push("/dashboard");
      
    } catch (error) {
      console.error("Login error:", error);
      setError("An error occurred during login. Please try again.");
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
                <CardTitle className="text-2xl text-center font-bold">Welcome Back</CardTitle>
                <CardDescription className="text-center mt-2">
                  Log in to access your AI Recruiter account
                </CardDescription>
              </motion.div>
            </CardHeader>
            
            <CardContent>
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
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className={cn(errors.password && "text-red-600")}>Password</Label>
                    <Link href="/auth/forgot-password" className="text-xs text-blue-600 hover:underline">
                      Forgot password?
                    </Link>
                  </div>
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
                        Logging in...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <LogIn className="w-4 h-4" />
                        Log In
                      </span>
                    )}
                  </Button>
                </motion.div>
              </motion.form>
            </CardContent>
            
            <CardFooter className="flex flex-col space-y-4 pt-2 pb-6">
              <motion.div variants={itemVariants} className="text-center text-sm">
                Don't have an account?{" "}
                <Link href="/auth/signup" className="text-blue-600 hover:underline font-medium">
                  Sign up
                </Link>
              </motion.div>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </div>
  );
} 