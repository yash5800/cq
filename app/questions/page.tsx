"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, Filter, ArrowLeft } from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

interface Question {
  question: string
  type: string
  companies: string[]
  difficulties: string[]
  languages: string[]
  count: number
}

export default function QuestionsPage() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCompany, setSelectedCompany] = useState("")
  const [selectedLanguage, setSelectedLanguage] = useState("")
  const [selectedType, setSelectedType] = useState("")
  const [companies, setCompanies] = useState<string[]>([])
  const [languages, setLanguages] = useState<string[]>([])

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true)
        const response = await fetch("/api/questions")
        const data = await response.json()
        setQuestions(data)
        setFilteredQuestions(data)

        // Extract unique companies and languages
        const uniqueCompanies = new Set<string>()
        const uniqueLanguages = new Set<string>()

        data.forEach((q: Question) => {
          q.companies.forEach((c) => uniqueCompanies.add(c))
          q.languages.forEach((l) => uniqueLanguages.add(l))
        })

        setCompanies(Array.from(uniqueCompanies).sort())
        setLanguages(Array.from(uniqueLanguages).sort())
      } catch (error) {
        console.error("Error fetching questions:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchQuestions()
  }, [])

  useEffect(() => {
    let filtered = questions

    if (selectedType) {
      filtered = filtered.filter((q) => q.type === selectedType)
    }

    if (searchTerm) {
      filtered = filtered.filter((q) => q.question.toLowerCase().includes(searchTerm.toLowerCase()))
    }

    if (selectedCompany) {
      filtered = filtered.filter((q) => q.companies.includes(selectedCompany))
    }

    if (selectedLanguage) {
      filtered = filtered.filter((q) => q.languages.includes(selectedLanguage))
    }

    setFilteredQuestions(filtered)
  }, [searchTerm, selectedCompany, selectedLanguage, selectedType, questions])

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case "Coding":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "HR/Behavioral":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "General":
        return "bg-cyan-100 text-cyan-800 border-cyan-200"
      default:
        return "bg-slate-100 text-slate-800 border-slate-200"
    }
  }

  // ✅ Group questions by company
  const groupedByCompany: Record<string, Question[]> = {}
  filteredQuestions.forEach((question) => {
    question.companies.forEach((company) => {
      if (!groupedByCompany[company]) groupedByCompany[company] = []
      groupedByCompany[company].push(question)
    })
  })

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="mb-4 text-slate-600 hover:text-slate-900">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Interview Question Bank</h1>
          <p className="text-slate-600">
            Search through {questions.length} interview questions asked across companies
          </p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8 border-slate-200 bg-white">
          <CardContent className="pt-6">
            <div className="space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                <Input
                  placeholder="Search questions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">Question Type</label>
                <div className="flex flex-wrap gap-2">
                  {["All", "Coding", "General", "HR/Behavioral"].map((type) => (
                    <Button
                      key={type}
                      onClick={() => setSelectedType(type === "All" ? "" : type)}
                      variant={selectedType === (type === "All" ? "" : type) ? "default" : "outline"}
                      className={`${
                        selectedType === (type === "All" ? "" : type)
                          ? "bg-blue-600 text-white border-blue-600"
                          : "border-slate-300 text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      {type}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Filters */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Filter by Company</label>
                  <select
                    value={selectedCompany}
                    onChange={(e) => setSelectedCompany(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Companies</option>
                    {companies.map((company) => (
                      <option key={company} value={company}>
                        {company}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Filter by Language</label>
                  <select
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Languages</option>
                    {languages.map((language) => (
                      <option key={language} value={language}>
                        {language}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Clear Filters */}
              {(searchTerm || selectedCompany || selectedLanguage || selectedType) && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("")
                    setSelectedCompany("")
                    setSelectedLanguage("")
                    setSelectedType("")
                  }}
                  className="w-full border-slate-300 text-slate-700 hover:bg-slate-50"
                >
                  Clear Filters
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Questions grouped by company */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Card key={i} className="border-slate-200 bg-white animate-pulse">
                <CardContent className="pt-6">
                  <div className="h-6 bg-slate-200 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : Object.keys(groupedByCompany).length === 0 ? (
          <Card className="border-slate-200 bg-white">
            <CardContent className="pt-12 pb-12 text-center">
              <Filter className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">No questions found</h3>
              <p className="text-slate-600">Try adjusting your search or filters</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedByCompany).map(([company, questions]) => (
              <Card
                key={company}
                className="border-slate-200 bg-white hover:shadow-md transition-shadow"
              >
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-slate-900">{company}</h2>
                    <Link href={`/company/${encodeURIComponent(company)}`}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-slate-300 text-slate-700 hover:bg-slate-50 bg-transparent"
                      >
                        View Experiences
                      </Button>
                    </Link>
                  </div>

                  <div className="space-y-4">
                    {questions.map((q, i) => (
                      <div
                        key={i}
                        className="border border-slate-100 rounded-lg p-4 hover:bg-slate-50 transition"
                      >
                        <div className="flex items-start justify-between">
                          <h3 className="text-lg font-medium text-slate-800">{q.question}</h3>
                          <Badge className={getTypeBadgeColor(q.type)}>{q.type}</Badge>
                        </div>

                        <p className="text-sm text-slate-600 mt-2">
                          Asked <span className="font-semibold text-slate-900">{q.count}</span> time
                          {q.count !== 1 ? "s" : ""}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Results Count */}
        {!loading && (
          <div className="mt-8 text-center text-slate-600">
            <p>
              Showing{" "}
              <span className="font-semibold text-slate-900">{filteredQuestions.length}</span> of{" "}
              <span className="font-semibold text-slate-900">{questions.length}</span> total questions
            </p>
          </div>
        )}
      </div>

      <Footer />
    </main>
  )
}
