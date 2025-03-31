"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

export function Navbar() {
  return (
    <nav className="border-b py-4">
      <div className="container flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold pl-6">
          AI Recruiter
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden items-center gap-6 md:flex">
          <Link href="#features" className="text-sm font-medium hover:underline">
            Features
          </Link>
          <Link href="#how-it-works" className="text-sm font-medium hover:underline">
            How It Works
          </Link>
          <Link href="#pricing" className="text-sm font-medium hover:underline">
            Pricing
          </Link>
          <div className="flex items-center gap-2">
            <Button variant="outline" asChild>
              <Link href="/auth/login">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/auth/signup">Sign Up</Link>
            </Button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="outline" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <div className="flex flex-col gap-4 mt-8">
              <Link href="#features" className="text-base font-medium hover:underline">
                Features
              </Link>
              <Link href="#how-it-works" className="text-base font-medium hover:underline">
                How It Works
              </Link>
              <Link href="#pricing" className="text-base font-medium hover:underline">
                Pricing
              </Link>
              <Button variant="outline" asChild className="w-full mt-2">
                <Link href="/auth/login">Login</Link>
              </Button>
              <Button asChild className="w-full">
                <Link href="/auth/signup">Sign Up</Link>
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
} 