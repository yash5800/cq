"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ThumbsUp, ThumbsDown, TrendingUp, Code2, Zap } from "lucide-react"

interface Experience {
  _id: string
  company_name: string
  questions_asked: string
  languages_used: string
  interview_questions: string
  selection_rounds: string
  lpa: string
  interviewer_expectations: string
  other_details: string
  feedback_rating: "positive" | "negative" | "neutral"
  timestamp: string
}

function ExperienceSkeleton() {
  return (
    <Card className="border-slate-200 animate-pulse">
      <CardHeader className="bg-slate-50 border-b border-slate-200">
        <div className="h-6 bg-slate-200 rounded w-1/3 mb-2"></div>
        <div className="h-4 bg-slate-200 rounded w-1/4"></div>
      </CardHeader>
      <CardContent className="pt-6 space-y-4">
        <div className="h-4 bg-slate-200 rounded"></div>
        <div className="h-4 bg-slate-200 rounded w-5/6"></div>
      </CardContent>
    </Card>
  )
}

export default function CompanyDetailPage() {
  const params = useParams()
  const companyName = params?.name ? decodeURIComponent(String(params.name)) : ""
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await fetch(`/api/companies/${encodeURIComponent(companyName)}`)

        if (!response.ok) {
          throw new Error("Failed to fetch experiences")
        }

        const data = await response.json()
        setExperiences(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load experiences")
        console.error("Error fetching experiences:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchExperiences()
  }, [companyName])

  const getTopLanguages = () => {
    const languageCount: Record<string, number> = {}
    experiences.forEach((exp) => {
      if (exp.languages_used) {
        const langs = exp.languages_used.split(",").map((l) => l.trim())
        langs.forEach((lang) => {
          languageCount[lang] = (languageCount[lang] || 0) + 1
        })
      }
    })
    return Object.entries(languageCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
  }

  const getTopRounds = () => {
    const roundCount: Record<string, number> = {}
    experiences.forEach((exp) => {
      if (exp.selection_rounds) {
        const rounds = exp.selection_rounds.split(",").map((r) => r.trim())
        rounds.forEach((round) => {
          roundCount[round] = (roundCount[round] || 0) + 1
        })
      }
    })
    return Object.entries(roundCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
  }

  const getCommonQuestions = () => {
    const questionCount: Record<string, number> = {}
    experiences.forEach((exp) => {
      if (exp.interview_questions) {
        const questions = exp.interview_questions.split("\n").filter((q) => q.trim())
        questions.forEach((q) => {
          const cleaned = q.trim()
          if (cleaned.length > 5) {
            questionCount[cleaned] = (questionCount[cleaned] || 0) + 1
          }
        })
      }
    })
    return Object.entries(questionCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
  }

  const getLpaRange = () => {
    const lpaValues = experiences
      .map((e) => {
        const match = e.lpa.match(/\d+/)
        return match ? Number.parseInt(match[0]) : 0
      })
      .filter((v) => v > 0)
      .sort((a, b) => a - b)

    if (lpaValues.length === 0) return { min: "N/A", max: "N/A", avg: "N/A" }

    return {
      min: lpaValues[0],
      max: lpaValues[lpaValues.length - 1],
      avg: (lpaValues.reduce((a, b) => a + b, 0) / lpaValues.length).toFixed(1),
    }
  }

  const stats = {
    total: experiences.length,
    positive: experiences.filter((e) => e.feedback_rating === "positive").length,
    neutral: experiences.filter((e) => e.feedback_rating === "neutral").length,
    negative: experiences.filter((e) => e.feedback_rating === "negative").length,
    averageLpa: (() => {
      const lpaValues = experiences
        .map((e) => {
          const match = e.lpa.match(/\d+/)
          return match ? Number.parseInt(match[0]) : 0
        })
        .filter((v) => v > 0)
      return lpaValues.length > 0 ? (lpaValues.reduce((a, b) => a + b, 0) / lpaValues.length).toFixed(1) : "N/A"
    })(),
  }

  const getFeedbackColor = (rating: string) => {
    switch (rating) {
      case "positive":
        return "bg-green-100 text-green-800"
      case "negative":
        return "bg-red-100 text-red-800"
      default:
        return "bg-yellow-100 text-yellow-800"
    }
  }

  const getFeedbackIcon = (rating: string) => {
    switch (rating) {
      case "positive":
        return <ThumbsUp className="w-4 h-4" />
      case "negative":
        return <ThumbsDown className="w-4 h-4" />
      default:
        return null
    }
  }

  const topLanguages = getTopLanguages()
  const topRounds = getTopRounds()
  const commonQuestions = getCommonQuestions()
  const lpaRange = getLpaRange()

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link href="/" className="flex items-center text-blue-600 hover:text-blue-700 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Companies
          </Link>
          <h1 className="text-3xl font-bold text-slate-900">{companyName}</h1>
          <p className="text-slate-600 mt-2">{stats.total} interview experiences shared</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[...Array(4)].map((_, i) => (
                <Card key={i} className="border-slate-200 bg-white animate-pulse">
                  <CardContent className="pt-6">
                    <div className="h-12 bg-slate-200 rounded"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="space-y-6">
              {[...Array(3)].map((_, i) => (
                <ExperienceSkeleton key={i} />
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
        ) : experiences.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-600 mb-4">No experiences found for this company.</p>
            <Link href="/posting">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">Be the first to share!</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="border-slate-200">
                <CardContent className="pt-6">
                  <p className="text-sm text-slate-600">Total Experiences</p>
                  <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
                </CardContent>
              </Card>
              <Card className="border-slate-200">
                <CardContent className="pt-6">
                  <p className="text-sm text-slate-600">Positive</p>
                  <p className="text-2xl font-bold text-green-600">{stats.positive}</p>
                </CardContent>
              </Card>
              <Card className="border-slate-200">
                <CardContent className="pt-6">
                  <p className="text-sm text-slate-600">Average LPA</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {stats.averageLpa === "N/A" ? "N/A" : `₹${stats.averageLpa}L`}
                  </p>
                </CardContent>
              </Card>
              <Card className="border-slate-200">
                <CardContent className="pt-6">
                  <p className="text-sm text-slate-600">Success Rate</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {Math.round((stats.positive / stats.total) * 100)}%
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-900">Experience Overview</h2>

              {/* LPA Range */}
              <Card className="border-slate-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                    LPA Range
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-slate-600 mb-1">Minimum</p>
                      <p className="text-xl font-bold text-slate-900">
                        {lpaRange.min === "N/A" ? "N/A" : `₹${lpaRange.min}L`}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600 mb-1">Average</p>
                      <p className="text-xl font-bold text-blue-600">
                        {lpaRange.avg === "N/A" ? "N/A" : `₹${lpaRange.avg}L`}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600 mb-1">Maximum</p>
                      <p className="text-xl font-bold text-slate-900">
                        {lpaRange.max === "N/A" ? "N/A" : `₹${lpaRange.max}L`}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Top Languages */}
              {topLanguages.length > 0 && (
                <Card className="border-slate-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Code2 className="w-5 h-5 text-blue-600" />
                      Most Used Languages
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {topLanguages.map(([lang, count]) => (
                        <Badge key={lang} variant="secondary" className="px-3 py-1">
                          {lang} <span className="ml-2 text-xs opacity-70">({count})</span>
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Top Interview Rounds */}
              {topRounds.length > 0 && (
                <Card className="border-slate-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="w-5 h-5 text-blue-600" />
                      Typical Interview Rounds
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {topRounds.map(([round, count]) => (
                        <div key={round} className="flex items-center justify-between">
                          <span className="text-slate-700">{round}</span>
                          <span className="text-sm text-slate-600">
                            {count} experience{count > 1 ? "s" : ""}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Common Questions */}
              {commonQuestions.length > 0 && (
                <Card className="border-slate-200">
                  <CardHeader>
                    <CardTitle>Frequently Asked Questions</CardTitle>
                    <CardDescription>Questions that appeared in multiple interviews</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {commonQuestions.map(([question, count]) => (
                        <li key={question} className="flex gap-3">
                          <span className="text-blue-600 font-bold min-w-fit">×{count}</span>
                          <span className="text-slate-700">{question}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* Feedback Distribution */}
              <Card className="border-slate-200">
                <CardHeader>
                  <CardTitle>Feedback Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-slate-600">Positive</span>
                        <span className="text-sm font-semibold text-green-600">
                          {stats.positive} ({Math.round((stats.positive / stats.total) * 100)}%)
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${(stats.positive / stats.total) * 100}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-slate-600">Neutral</span>
                        <span className="text-sm font-semibold text-yellow-600">
                          {stats.neutral} ({Math.round((stats.neutral / stats.total) * 100)}%)
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div
                          className="bg-yellow-500 h-2 rounded-full"
                          style={{ width: `${(stats.neutral / stats.total) * 100}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-slate-600">Negative</span>
                        <span className="text-sm font-semibold text-red-600">
                          {stats.negative} ({Math.round((stats.negative / stats.total) * 100)}%)
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div
                          className="bg-red-500 h-2 rounded-full"
                          style={{ width: `${(stats.negative / stats.total) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Experiences */}
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">All Experiences</h2>
              <div className="space-y-6">
                {experiences.map((exp, index) => (
                  <Card key={exp._id} className="border-slate-200 overflow-hidden">
                    <CardHeader className="bg-slate-50 border-b border-slate-200">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-3">
                            <CardTitle className="text-lg">Experience #{stats.total - index}</CardTitle>
                            <Badge
                              className={`${
                                exp.feedback_rating === "positive"
                                  ? "bg-green-100 text-green-800"
                                  : exp.feedback_rating === "negative"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {exp.feedback_rating === "positive" && <ThumbsUp className="w-4 h-4" />}
                              {exp.feedback_rating === "negative" && <ThumbsDown className="w-4 h-4" />}
                              <span className="ml-1 capitalize">{exp.feedback_rating}</span>
                            </Badge>
                          </div>
                          <CardDescription className="mt-2">
                            {new Date(exp.timestamp).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </CardDescription>
                        </div>
                        {exp.lpa && (
                          <div className="text-right">
                            <p className="text-sm text-slate-600">LPA</p>
                            <p className="text-lg font-bold text-slate-900">{exp.lpa}</p>
                          </div>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-6">
                      {exp.selection_rounds && (
                        <div>
                          <h3 className="font-semibold text-slate-900 mb-2">Selection Rounds</h3>
                          <p className="text-slate-700 whitespace-pre-wrap">{exp.selection_rounds}</p>
                        </div>
                      )}

                      {exp.languages_used && (
                        <div>
                          <h3 className="font-semibold text-slate-900 mb-2">Languages Used</h3>
                          <p className="text-slate-700">{exp.languages_used}</p>
                        </div>
                      )}

                      {exp.interview_questions && (
                        <div>
                          <h3 className="font-semibold text-slate-900 mb-2">Interview Questions</h3>
                          <p className="text-slate-700 whitespace-pre-wrap">{exp.interview_questions}</p>
                        </div>
                      )}

                      {exp.questions_asked && (
                        <div>
                          <h3 className="font-semibold text-slate-900 mb-2">Questions Asked by Student</h3>
                          <p className="text-slate-700 whitespace-pre-wrap">{exp.questions_asked}</p>
                        </div>
                      )}

                      {exp.interviewer_expectations && (
                        <div>
                          <h3 className="font-semibold text-slate-900 mb-2">What Interviewer Expected</h3>
                          <p className="text-slate-700 whitespace-pre-wrap">{exp.interviewer_expectations}</p>
                        </div>
                      )}

                      {exp.other_details && (
                        <div>
                          <h3 className="font-semibold text-slate-900 mb-2">Other Details</h3>
                          <p className="text-slate-700 whitespace-pre-wrap">{exp.other_details}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
