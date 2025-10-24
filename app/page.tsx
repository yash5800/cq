"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Users, Award, Zap, Calendar, DollarSign, CheckCircle } from "lucide-react"

interface Experience {
  _id: string
  company_name: string
  lpa: string
  feedback_rating: "positive" | "negative" | "neutral"
  selection_rounds: string
  timestamp: string | number
  languages_used: string
}

interface CompanyCard {
  name: string
  total_experiences: number
  positive_feedback: number
  average_lpa: string
  latest_experience: Experience
  success_rate: number
  most_used_languages: string[]
  latest_date: string
}

function CompanyCardSkeleton() {
  return (
    <Card className="h-full border-slate-200 animate-pulse">
      <CardHeader>
        <div className="h-6 bg-slate-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-slate-200 rounded w-1/2"></div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="h-12 bg-slate-200 rounded"></div>
          <div className="h-12 bg-slate-200 rounded"></div>
        </div>
        <div className="h-8 bg-slate-200 rounded"></div>
        <div className="h-4 bg-slate-200 rounded"></div>
      </CardContent>
    </Card>
  )
}

export default function Home() {
  const [companies, setCompanies] = useState<CompanyCard[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalStats, setTotalStats] = useState({ total_experiences: 0, total_companies: 0, avg_success_rate: 0 })

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await fetch("/api/experiences")

        if (!response.ok) {
          throw new Error("Failed to fetch experiences")
        }

        const experiences: Experience[] = await response.json()

        const companyMap = new Map<string, Experience[]>()
        experiences.forEach((exp) => {
          if (!companyMap.has(exp.company_name)) {
            companyMap.set(exp.company_name, [])
          }
          companyMap.get(exp.company_name)!.push(exp)
        })

        const stats: CompanyCard[] = Array.from(companyMap.entries()).map(([name, exps]) => {
          const positive = exps.filter((e) => e.feedback_rating === "positive").length
          const lpaValues = exps
            .map((e) => {
              const match = e.lpa.match(/\d+/)
              return match ? Number.parseInt(match[0]) : 0
            })
            .filter((v) => v > 0)
          const avgLpa =
            lpaValues.length > 0 ? (lpaValues.reduce((a, b) => a + b, 0) / lpaValues.length).toFixed(1) : "N/A"

          const languageMap = new Map<string, number>()
          exps.forEach((exp) => {
            if (exp.languages_used) {
              exp.languages_used.split(",").forEach((lang) => {
                const trimmed = lang.trim()
                languageMap.set(trimmed, (languageMap.get(trimmed) || 0) + 1)
              })
            }
          })
          const mostUsedLanguages = Array.from(languageMap.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([lang]) => lang)

          const success_rate = Math.round((positive / exps.length) * 100)
          const latestExp = exps.sort((a, b) => {
            const timeA = typeof a.timestamp === "string" ? new Date(a.timestamp).getTime() : a.timestamp
            const timeB = typeof b.timestamp === "string" ? new Date(b.timestamp).getTime() : b.timestamp
            return timeB - timeA
          })[0]

          return {
            name,
            total_experiences: exps.length,
            positive_feedback: positive,
            average_lpa: avgLpa,
            latest_experience: latestExp,
            success_rate,
            most_used_languages: mostUsedLanguages,
            latest_date: new Date(
              typeof latestExp.timestamp === "string" ? latestExp.timestamp : latestExp.timestamp,
            ).toLocaleDateString(),
          }
        })

        const sortedStats = stats.sort((a, b) => b.total_experiences - a.total_experiences)
        const avgSuccessRate =
          stats.length > 0 ? Math.round(stats.reduce((sum, s) => sum + s.success_rate, 0) / stats.length) : 0

        setCompanies(sortedStats)
        setTotalStats({
          total_experiences: experiences.length,
          total_companies: stats.length,
          avg_success_rate: avgSuccessRate,
        })
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load experiences")
        console.error("Error fetching experiences:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchExperiences()
  }, [])

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 top-0 z-50 ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between max-[600px]:flex-col gap-4">
            <div className="max-[600px]:text-center ">
              <h1 className="text-3xl font-bold text-slate-900">InterviewHub</h1>
              <p className="text-slate-600 mt-1">Learn from real student interview experiences</p>
            </div>
            <Link href="/posting">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">Share Your Experience</Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div>
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Platform Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <Card key={i} className="border-slate-200 bg-white animate-pulse">
                    <CardContent className="pt-6">
                      <div className="h-12 bg-slate-200 rounded"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Companies</h2>
              <div className="h-6 bg-slate-200 rounded w-1/3 mt-4"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <CompanyCardSkeleton key={i} />
              ))}
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">Error: {error}</p>
            <Button onClick={() => window.location.reload()} className="bg-blue-600 hover:bg-blue-700 text-white">
              Try Again
            </Button>
          </div>
        ) : companies.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-600 mb-4">No experiences shared yet.</p>
            <Link href="/posting">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">Be the first to share!</Button>
            </Link>
          </div>
        ) : (
          <div>
            {/* Platform Overview */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Platform Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="border-slate-200 bg-white">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-slate-600">Total Experiences</p>
                        <p className="text-3xl font-bold text-slate-900 mt-2">{totalStats.total_experiences}</p>
                      </div>
                      <Zap className="w-8 h-8 text-blue-600 opacity-20" />
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-slate-200 bg-white">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-slate-600">Companies</p>
                        <p className="text-3xl font-bold text-slate-900 mt-2">{totalStats.total_companies}</p>
                      </div>
                      <Users className="w-8 h-8 text-green-600 opacity-20" />
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-slate-200 bg-white">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-slate-600">Avg Success Rate</p>
                        <p className="text-3xl font-bold text-slate-900 mt-2">{totalStats.avg_success_rate}%</p>
                      </div>
                      <Award className="w-8 h-8 text-purple-600 opacity-20" />
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-slate-200 bg-white">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-slate-600">Community</p>
                        <p className="text-3xl font-bold text-slate-900 mt-2">Active</p>
                      </div>
                      <TrendingUp className="w-8 h-8 text-orange-600 opacity-20" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Companies Section */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Companies</h2>
              <p className="text-slate-600">
                {companies.length} companies • {totalStats.total_experiences} total experiences
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {companies.map((company) => (
                <Link key={company.name} href={`/company/${encodeURIComponent(company.name)}`}>
                  <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer border-slate-200 hover:border-blue-300">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-xl text-slate-900">{company.name}</CardTitle>
                          <CardDescription className="mt-1">
                            {company.total_experiences} experience{company.total_experiences !== 1 ? "s" : ""}
                          </CardDescription>
                        </div>
                        <Badge
                          className={`ml-2 ${
                            company.success_rate >= 70
                              ? "bg-green-100 text-green-800"
                              : company.success_rate >= 40
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                          }`}
                        >
                          {company.success_rate}%
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Key Stats */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-start gap-2">
                          <DollarSign className="w-4 h-4 text-slate-600 mt-1 flex-shrink-0" />
                          <div>
                            <p className="text-xs text-slate-600">Avg LPA</p>
                            <p className="text-sm font-semibold text-slate-900">
                              {company.average_lpa === "N/A" ? "N/A" : `₹${company.average_lpa}L`}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                          <div>
                            <p className="text-xs text-slate-600">Positive</p>
                            <p className="text-sm font-semibold text-green-600">
                              {company.positive_feedback}/{company.total_experiences}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Languages */}
                      {company.most_used_languages.length > 0 && (
                        <div className="pt-2 border-t border-slate-200">
                          <p className="text-xs text-slate-600 mb-2">Top Languages</p>
                          <div className="flex flex-wrap gap-2">
                            {company.most_used_languages.map((lang) => (
                              <Badge
                                key={lang}
                                variant="outline"
                                className="bg-blue-50 text-blue-700 border-blue-200 text-xs"
                              >
                                {lang}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Latest Update */}
                      <div className="pt-2 border-t border-slate-200 flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-slate-600" />
                        <p className="text-xs text-slate-500">Latest: {company.latest_date}</p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
