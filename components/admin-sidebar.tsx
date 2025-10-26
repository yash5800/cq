"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Menu, X, BarChart3, Users, FileText, Eye, LogOut, Home } from "lucide-react"
import { Button } from "@/components/ui/button"

interface AdminSidebarProps {
  onLogout: () => void
}

export default function AdminSidebar({ onLogout }: AdminSidebarProps) {
  const [isOpen, setIsOpen] = useState(true)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const router = useRouter()

  const handleLogout = () => {
    onLogout()
    router.push("/admin/login")
  }

  const navItems = [
    { icon: BarChart3, label: "Dashboard", href: "#dashboard", color: "text-blue-600" },
    { icon: FileText, label: "Experiences", href: "#experiences", color: "text-purple-600" },
    { icon: Users, label: "Companies", href: "#companies", color: "text-green-600" },
    { icon: Eye, label: "Traffic", href: "#traffic", color: "text-orange-600" },
  ]

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="sticky top-4 left-4 z-50 md:hidden bg-white p-2 rounded-lg border border-slate-200 hover:bg-slate-50"
      >
        {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white transition-all duration-300 z-40 ${
          isOpen ? "w-64" : "w-20"
        } ${isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-slate-700 flex items-center justify-between">
          {isOpen && <h1 className="text-xl font-bold">InterviewHub</h1>}
          <button onClick={() => setIsOpen(!isOpen)} className="hidden md:block p-1 hover:bg-slate-700 rounded">
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={() => setIsMobileOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-700 transition-colors group"
            >
              <item.icon className={`w-5 h-5 ${item.color}`} />
              {isOpen && <span className="text-sm font-medium">{item.label}</span>}
            </a>
          ))}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-700 space-y-2">
          <Link href="/">
            <Button
              variant="outline"
              className="w-full justify-start gap-2 bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
            >
              <Home className="w-4 h-4" />
              {isOpen && <span className="text-sm">Back Home</span>}
            </Button>
          </Link>
          <Button onClick={handleLogout} variant="destructive" className="w-full justify-start gap-2">
            <LogOut className="w-4 h-4" />
            {isOpen && <span className="text-sm">Logout</span>}
          </Button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setIsMobileOpen(false)} />
      )}
    </>
  )
}
