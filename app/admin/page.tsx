"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BarChart3, Users, FileText, Eye, LogOut } from "lucide-react"

interface AdminStats {
  total_experiences: number
  total_companies: number
  total_visits: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats>({ total_experiences: 0, total_companies: 0, total_visits: 0 })
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("adminAuth")
    if (!isAuthenticated) {
      router.push("/admin/login")
      return
    }

    const fetchStats = async () => {
      try {
        const [expRes, visitsRes] = await Promise.all([fetch("/api/admin/experiences"), fetch("/api/visits")])

        const experiences = await expRes.json()
        const visitsData = await visitsRes.json()

        const companies = new Set(experiences.map((e: any) => e.company_name)).size

        setStats({
          total_experiences: experiences.length,
          total_companies: companies,
          total_visits: visitsData.total_pageviews || 0,
        })
      } catch (error) {
        console.error("Failed to fetch stats:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("adminAuth")
    router.push("/admin/login")
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
              <p className="text-slate-600 mt-1">Manage platform data and monitor activity</p>
            </div>
            <div className="flex gap-4">
              <Link href="/">
                <Button variant="outline">Back to Home</Button>
              </Link>
              <Button onClick={handleLogout} variant="destructive" className="flex items-center gap-2">
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="border-slate-200 bg-white">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Total Experiences</p>
                  <p className="text-3xl font-bold text-slate-900 mt-2">{stats.total_experiences}</p>
                </div>
                <FileText className="w-8 h-8 text-blue-600 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 bg-white">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Companies</p>
                  <p className="text-3xl font-bold text-slate-900 mt-2">{stats.total_companies}</p>
                </div>
                <Users className="w-8 h-8 text-green-600 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 bg-white">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Site Visits</p>
                  <p className="text-3xl font-bold text-slate-900 mt-2">{stats.total_visits}</p>
                </div>
                <Eye className="w-8 h-8 text-purple-600 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 bg-white">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Status</p>
                  <p className="text-3xl font-bold text-green-600 mt-2">Active</p>
                </div>
                <BarChart3 className="w-8 h-8 text-orange-600 opacity-20" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Management Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-slate-200 bg-white hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-orange-600" />
                Analytics
              </CardTitle>
              <CardDescription>View detailed visit analytics and trends</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/admin/analytics">
                <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white">Go to Analytics</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-slate-200 bg-white hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                Manage Experiences
              </CardTitle>
              <CardDescription>View, edit, and delete interview experiences</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/admin/experiences">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">Go to Experiences</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-slate-200 bg-white hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-green-600" />
                Manage Companies
              </CardTitle>
              <CardDescription>View and delete companies and their data</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/admin/companies">
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white">Go to Companies</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
