"use client";

import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="text-xl font-bold text-white">AI Recruiter</h3>
            <p className="mt-4 text-sm">
              Transforming recruitment with AI-powered interviews and candidate matching.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-white">Resources</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link href="#" className="hover:text-white hover:underline">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white hover:underline">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white hover:underline">
                  Case Studies
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white hover:underline">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-white">Company</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link href="#" className="hover:text-white hover:underline">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white hover:underline">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white hover:underline">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white hover:underline">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-white">Stay Updated</h3>
            <p className="mt-4 text-sm">
              Subscribe to our newsletter for the latest updates.
            </p>
            <div className="mt-4 flex">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full rounded-l-md border-0 bg-gray-800 px-3 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button className="rounded-r-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary">
                Subscribe
              </button>
            </div>
          </div>
        </div>
        
        <div className="mt-12 border-t border-gray-800 pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} AI Recruiter. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
} 