"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const closeMenu = () => {
    setIsOpen(false)
  }

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">IH</span>
              </div>
              <span className="text-xl font-bold text-slate-900 hidden sm:inline">InterviewHub</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-slate-600 hover:text-slate-900 transition-colors font-medium">
              Home
            </Link>
            <Link href="/posting" className="text-slate-600 hover:text-slate-900 transition-colors font-medium">
              Share Experience
            </Link>
            <Link href="/admin/login" className="text-slate-600 hover:text-slate-900 transition-colors font-medium">
              Admin
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white animate-in slide-in-from-top-2">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link href="/" onClick={closeMenu}>
                <button className="w-full text-left px-3 py-2 rounded-md text-slate-700 hover:bg-slate-100 transition-colors font-medium">
                  Home
                </button>
              </Link>
              <Link href="/admin/login" onClick={closeMenu}>
                <button className="w-full text-left px-3 py-2 rounded-md text-slate-700 hover:bg-slate-100 
                transition-colors font-medium">
                  Admin Panel
                </button>
              </Link>
              <div className="pt-2 space-y-2">
                <Link href="/posting" onClick={closeMenu} className="block">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">Share Your Experience</Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
