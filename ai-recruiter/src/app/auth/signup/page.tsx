"use client";

import { useState } from "react";
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

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <Link href="/" className="mb-8 text-2xl font-bold">
        AI Recruiter
      </Link>
      
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Create An Account</CardTitle>
          <CardDescription className="text-center">
            Join AI Recruiter to start hiring or find your next opportunity
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="employer" className="mb-6" onValueChange={(value) => {
            setRole(value as "employer" | "candidate");
            reset(); // Reset form on role change
          }}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="employer">I'm an Employer</TabsTrigger>
              <TabsTrigger value="candidate">I'm a Candidate</TabsTrigger>
            </TabsList>
            <TabsContent value="employer" className="mt-2 text-center text-sm text-gray-600">
              Create job postings and find the best candidates
            </TabsContent>
            <TabsContent value="candidate" className="mt-2 text-center text-sm text-gray-600">
              Discover opportunities and showcase your skills
            </TabsContent>
          </Tabs>
          
          {error && (
            <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md mb-4">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className={cn(errors.name && "text-destructive")}>Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                {...register("name")}
                className={cn(errors.name && "border-destructive")}
              />
              {errors.name && (
                <p className="text-xs text-destructive mt-1">{errors.name.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email" className={cn(errors.email && "text-destructive")}>Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                {...register("email")}
                className={cn(errors.email && "border-destructive")}
              />
              {errors.email && (
                <p className="text-xs text-destructive mt-1">{errors.email.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className={cn(errors.password && "text-destructive")}>Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                {...register("password")}
                className={cn(errors.password && "border-destructive")}
              />
              {errors.password && (
                <p className="text-xs text-destructive mt-1">{errors.password.message}</p>
              )}
            </div>
            
            <div className="text-xs text-gray-600">
              By signing up, you agree to our{" "}
              <Link href="#" className="text-primary hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="#" className="text-primary hover:underline">
                Privacy Policy
              </Link>
              .
            </div>
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creating Account..." : `Sign Up as ${role === "employer" ? "Employer" : "Candidate"}`}
            </Button>
          </form>
        </CardContent>
        
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-center text-sm">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-primary hover:underline">
              Log in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
} 