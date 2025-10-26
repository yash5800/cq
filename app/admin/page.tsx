"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { FileText, Users, Eye, TrendingUp, AlertCircle } from "lucide-react"
import AdminSidebar from "@/components/admin-sidebar"

interface Experience {
  _id: string
  company_name: string
  lpa: number
  feedback: string
  timestamp: string
}

interface AnalyticsData {
  daily: Array<{ _id: string; visits: number }>
  monthly: Array<{ _id: string; visits: number }>
}

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [stats, setStats] = useState({ experiences: 0, companies: 0, visits: 0 })
  const [recentExperiences, setRecentExperiences] = useState<Experience[]>([])
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({ daily: [], monthly: [] })
  const [companyStats, setCompanyStats] = useState<Array<{ name: string; count: number; avgLPA: number }>>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("adminAuth")
    if (!isAuthenticated) {
      router.push("/admin/login")
      return
    }

    const fetchData = async () => {
      try {
        const [expRes, visitsRes, dailyRes, monthlyRes] = await Promise.all([
          fetch("/api/admin/experiences"),
          fetch("/api/visits"),
          fetch("/api/analytics/visits?period=daily"),
          fetch("/api/analytics/visits?period=monthly"),
        ])

        const experiences = await expRes.json()
        const visitsData = await visitsRes.json()
        const dailyData = await dailyRes.json()
        const monthlyData = await monthlyRes.json()

        // Calculate stats
        const companies = new Set(experiences.map((e: any) => e.company_name)).size
        const recentExp = experiences.slice(0, 5)

        // Calculate company statistics
        const companyMap = new Map<string, { count: number; totalLPA: number }>()
        experiences.forEach((exp: any) => {
          const current = companyMap.get(exp.company_name) || { count: 0, totalLPA: 0 }
          companyMap.set(exp.company_name, {
            count: current.count + 1,
            totalLPA: current.totalLPA + (exp.lpa || 0),
          })
        })

        const companyStatsArray = Array.from(companyMap.entries())
          .map(([name, data]) => ({
            name,
            count: data.count,
            avgLPA: Math.round(data.totalLPA / data.count),
          }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5)

        setStats({
          experiences: experiences.length,
          companies,
          visits: visitsData.total_pageviews || 0,
        })
        setRecentExperiences(recentExp)
        setAnalyticsData({
          daily: dailyData.data || [],
          monthly: monthlyData.data || [],
        })
        setCompanyStats(companyStatsArray)
      } catch (error) {
        console.error("Failed to fetch data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [router])


  return (
    <div className="flex h-screen bg-slate-50">
      {/* Main Content */}
      <main className="flex-1 overflow-auto md:ml-0">
        {/* Header */}
        <div className="bg-white border-b border-slate-200 sticky top-0 z-30 pt-16 md:pt-0">
          <div className="px-6 py-6">
            <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
            <p className="text-slate-600 mt-1">Real-time platform analytics and management</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Key Metrics */}
          <div id="dashboard" className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-600 font-medium">Total Experiences</p>
                    <p className="text-3xl font-bold text-blue-900 mt-2">{stats.experiences}</p>
                  </div>
                  <FileText className="w-10 h-10 text-blue-300" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-green-600 font-medium">Companies</p>
                    <p className="text-3xl font-bold text-green-900 mt-2">{stats.companies}</p>
                  </div>
                  <Users className="w-10 h-10 text-green-300" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-purple-600 font-medium">Site Visits</p>
                    <p className="text-3xl font-bold text-purple-900 mt-2">{stats.visits}</p>
                  </div>
                  <Eye className="w-10 h-10 text-purple-300" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-orange-600 font-medium">Growth</p>
                    <p className="text-3xl font-bold text-orange-900 mt-2">
                      {stats.experiences > 0 ? Math.round((stats.visits / stats.experiences) * 10) / 10 : 0}
                    </p>
                  </div>
                  <TrendingUp className="w-10 h-10 text-orange-300" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Daily Visits Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Daily Visits (Last 30 Days)</CardTitle>
                <CardDescription>Site traffic over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={analyticsData.daily}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="_id" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="visits" stroke="#3b82f6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Monthly Visits Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Monthly Visits (Last 12 Months)</CardTitle>
                <CardDescription>Monthly traffic trends</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analyticsData.monthly}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="_id" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="visits" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Charts Row 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Companies */}
            <Card id="companies">
              <CardHeader>
                <CardTitle>Top Companies by Experiences</CardTitle>
                <CardDescription>Most discussed companies</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={companyStats} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={100} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8b5cf6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Company LPA Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Average LPA by Company</CardTitle>
                <CardDescription>Salary distribution</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={companyStats} dataKey="avgLPA" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                      {companyStats.map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"][index % 5]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Recent Experiences */}
          <Card id="experiences">
            <CardHeader>
              <CardTitle>Recent Experiences</CardTitle>
              <CardDescription>Latest interview submissions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentExperiences.length > 0 ? (
                  recentExperiences.map((exp) => (
                    <div
                      key={exp._id}
                      className="flex items-start justify-between p-4 bg-slate-50 rounded-lg border border-slate-200"
                    >
                      <div className="flex-1">
                        <p className="font-semibold text-slate-900">{exp.company_name}</p>
                        <p className="text-sm text-slate-600 mt-1">LPA: ₹{exp.lpa}</p>
                        <p
                          className={`text-xs font-medium mt-2 ${exp.feedback === "positive" ? "text-green-600" : "text-orange-600"}`}
                        >
                          {exp.feedback?.toUpperCase()}
                        </p>
                      </div>
                      <p className="text-xs text-slate-500">{new Date(exp.timestamp).toLocaleDateString()}</p>
                    </div>
                  ))
                ) : (
                  <div className="flex items-center gap-2 text-slate-500">
                    <AlertCircle className="w-4 h-4" />
                    <p>No experiences yet</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Traffic Section */}
          <Card id="traffic">
            <CardHeader>
              <CardTitle>Traffic Summary</CardTitle>
              <CardDescription>Platform engagement metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-600 font-medium">Avg Daily Visits</p>
                  <p className="text-2xl font-bold text-blue-900 mt-2">
                    {analyticsData.daily.length > 0
                      ? Math.round(
                          analyticsData.daily.reduce((sum, d) => sum + d.visits, 0) / analyticsData.daily.length,
                        )
                      : 0}
                  </p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm text-green-600 font-medium">Total Experiences</p>
                  <p className="text-2xl font-bold text-green-900 mt-2">{stats.experiences}</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <p className="text-sm text-purple-600 font-medium">Conversion Rate</p>
                  <p className="text-2xl font-bold text-purple-900 mt-2">
                    {stats.visits > 0 ? Math.round((stats.experiences / stats.visits) * 100) : 0}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
