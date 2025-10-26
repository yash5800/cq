"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
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
  Legend,
  ResponsiveContainer,
} from "recharts"
import { ArrowLeft, TrendingUp } from "lucide-react"

interface AnalyticsData {
  _id: string
  visits: number
}

export default function AnalyticsPage() {
  const [dailyData, setDailyData] = useState<AnalyticsData[]>([])
  const [monthlyData, setMonthlyData] = useState<AnalyticsData[]>([])
  const [yearlyData, setYearlyData] = useState<AnalyticsData[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"]

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("adminAuth")
    if (!isAuthenticated) {
      router.push("/admin/login")
      return
    }

    const fetchAnalytics = async () => {
      try {
        const [dailyRes, monthlyRes, yearlyRes] = await Promise.all([
          fetch("/api/analytics/visits?period=daily"),
          fetch("/api/analytics/visits?period=monthly"),
          fetch("/api/analytics/visits?period=yearly"),
        ])

        const daily = await dailyRes.json()
        const monthly = await monthlyRes.json()
        const yearly = await yearlyRes.json()

        setDailyData(daily.data || [])
        setMonthlyData(monthly.data || [])
        setYearlyData(yearly.data || [])
      } catch (error) {
        console.error("Failed to fetch analytics:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [router])

  const calculateStats = (data: AnalyticsData[]) => {
    if (data.length === 0) return { total: 0, average: 0, peak: 0 }
    const total = data.reduce((sum, item) => sum + item.visits, 0)
    const average = Math.round(total / data.length)
    const peak = Math.max(...data.map((item) => item.visits))
    return { total, average, peak }
  }

  const dailyStats = calculateStats(dailyData)
  const monthlyStats = calculateStats(monthlyData)
  const yearlyStats = calculateStats(yearlyData)

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <p className="text-slate-600">Loading analytics...</p>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin">
                <Button variant="outline" size="icon">
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Analytics Dashboard</h1>
                <p className="text-slate-600 mt-1">Monitor site visits and traffic patterns</p>
              </div>
            </div>
            <TrendingUp className="w-8 h-8 text-blue-600 opacity-20" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Daily Analytics */}
        <div className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="border-slate-200 bg-white">
              <CardContent className="pt-6">
                <p className="text-sm text-slate-600">Total Daily Visits</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">{dailyStats.total}</p>
                <p className="text-xs text-slate-500 mt-2">Last 30 days</p>
              </CardContent>
            </Card>
            <Card className="border-slate-200 bg-white">
              <CardContent className="pt-6">
                <p className="text-sm text-slate-600">Daily Average</p>
                <p className="text-3xl font-bold text-green-600 mt-2">{dailyStats.average}</p>
                <p className="text-xs text-slate-500 mt-2">Per day</p>
              </CardContent>
            </Card>
            <Card className="border-slate-200 bg-white">
              <CardContent className="pt-6">
                <p className="text-sm text-slate-600">Peak Daily Visits</p>
                <p className="text-3xl font-bold text-purple-600 mt-2">{dailyStats.peak}</p>
                <p className="text-xs text-slate-500 mt-2">Highest day</p>
              </CardContent>
            </Card>
          </div>

          <Card className="border-slate-200 bg-white">
            <CardHeader>
              <CardTitle>Daily Visits (Last 30 Days)</CardTitle>
              <CardDescription>Line chart showing daily visitor trends</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dailyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="_id" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="visits" stroke="#3b82f6" name="Visits" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Monthly Analytics */}
        <div className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="border-slate-200 bg-white">
              <CardContent className="pt-6">
                <p className="text-sm text-slate-600">Total Monthly Visits</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">{monthlyStats.total}</p>
                <p className="text-xs text-slate-500 mt-2">Last 12 months</p>
              </CardContent>
            </Card>
            <Card className="border-slate-200 bg-white">
              <CardContent className="pt-6">
                <p className="text-sm text-slate-600">Monthly Average</p>
                <p className="text-3xl font-bold text-green-600 mt-2">{monthlyStats.average}</p>
                <p className="text-xs text-slate-500 mt-2">Per month</p>
              </CardContent>
            </Card>
            <Card className="border-slate-200 bg-white">
              <CardContent className="pt-6">
                <p className="text-sm text-slate-600">Peak Monthly Visits</p>
                <p className="text-3xl font-bold text-purple-600 mt-2">{monthlyStats.peak}</p>
                <p className="text-xs text-slate-500 mt-2">Highest month</p>
              </CardContent>
            </Card>
          </div>

          <Card className="border-slate-200 bg-white">
            <CardHeader>
              <CardTitle>Monthly Visits (Last 12 Months)</CardTitle>
              <CardDescription>Bar chart showing monthly visitor distribution</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="_id" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="visits" fill="#10b981" name="Visits" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Yearly Analytics */}
        <div className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="border-slate-200 bg-white">
              <CardContent className="pt-6">
                <p className="text-sm text-slate-600">Total Yearly Visits</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">{yearlyStats.total}</p>
                <p className="text-xs text-slate-500 mt-2">Last 5 years</p>
              </CardContent>
            </Card>
            <Card className="border-slate-200 bg-white">
              <CardContent className="pt-6">
                <p className="text-sm text-slate-600">Yearly Average</p>
                <p className="text-3xl font-bold text-green-600 mt-2">{yearlyStats.average}</p>
                <p className="text-xs text-slate-500 mt-2">Per year</p>
              </CardContent>
            </Card>
            <Card className="border-slate-200 bg-white">
              <CardContent className="pt-6">
                <p className="text-sm text-slate-600">Peak Yearly Visits</p>
                <p className="text-3xl font-bold text-purple-600 mt-2">{yearlyStats.peak}</p>
                <p className="text-xs text-slate-500 mt-2">Highest year</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-slate-200 bg-white">
              <CardHeader>
                <CardTitle>Yearly Visits (Last 5 Years)</CardTitle>
                <CardDescription>Bar chart showing yearly visitor trends</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={yearlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="_id" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="visits" fill="#f59e0b" name="Visits" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="border-slate-200 bg-white">
              <CardHeader>
                <CardTitle>Yearly Distribution</CardTitle>
                <CardDescription>Pie chart showing visit distribution by year</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={yearlyData} dataKey="visits" nameKey="_id" cx="50%" cy="50%" outerRadius={80} label>
                      {yearlyData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}
