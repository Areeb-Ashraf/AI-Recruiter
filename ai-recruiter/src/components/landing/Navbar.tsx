"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

export function Navbar() {
  return (
    <nav className="py-4" style={{ backgroundColor: '#101828' }}>
      <div className="container flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold pl-6 text-white">
          AI Recruiter
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden items-center gap-6 md:flex">
          <Link href="#features" className="text-sm font-medium text-white hover:underline">
            Features
          </Link>
          <Link href="#how-it-works" className="text-sm font-medium text-white hover:underline">
            How It Works
          </Link>
          <Link href="#pricing" className="text-sm font-medium text-white hover:underline">
            Pricing
          </Link>
          <div className="flex items-center gap-2">
            <Button variant="ghost" className="text-white hover:bg-white/10 hover:text-white" asChild>
              <Link href="/auth/login">Login</Link>
            </Button>
            <Button className="bg-white text-[#101828] hover:bg-gray-200" asChild>
              <Link href="/auth/signup">Sign Up</Link>
            </Button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="outline" size="icon" className="mr-2 text-white border-white hover:bg-white hover:text-[#101828]">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetTitle className="text-center">Menu</SheetTitle>
            <div className="flex flex-col gap-4 mt-4">
              <Link href="#features" className="text-base font-medium hover:underline ml-2">
                Features
              </Link>
              <Link href="#how-it-works" className="text-base font-medium hover:underline ml-2">
                How It Works
              </Link>
              <Link href="#pricing" className="text-base font-medium hover:underline ml-2">
                Pricing
              </Link>
              <Button variant="ghost" asChild className="w-full mt-2">
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