"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Plus, X } from "lucide-react"
import { toast } from "react-toastify"
import Footer from "@/components/footer"

interface FormData {
  company_name: string
  languages_used: string
  interview_questions: string
  selection_rounds: Round[]
  lpa: string
  other_details: string
  feedback_rating: "easy" | "hard" | "medium",
  verified: boolean
}

interface Round {
  id: number
  roundName: string
  daysGap: number
}

function capitalizeFirstLetter(string : String) {
   return string.charAt(0).toUpperCase() + string.slice(1); 
}

export default function PostingPage() {
  const router = useRouter()
  const [existingCompanies, setExistingCompanies] = useState<string[]>([])
  const [showNewCompany, setShowNewCompany] = useState(false)
  const [newCompanyName, setNewCompanyName] = useState("")
  const [formData, setFormData] = useState<FormData>({
    company_name: "",
    languages_used: "",
    interview_questions: "",
    selection_rounds: [],
    lpa: "",
    other_details: "",
    feedback_rating: "medium",
    verified: false,
  })
  const [loading, setLoading] = useState(false)
  const [companiesLoading, setCompaniesLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectionRounds, setSelectionRounds] = useState<Round[]>([{ id: 1, roundName: "", daysGap: 0 }])
  // const roundRef = useRef<string>("");

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setCompaniesLoading(true)
        const response = await fetch("/api/experiences")

        if (!response.ok) {
          throw new Error("Failed to fetch companies")
        }

        const experiences = await response.json()
        const companies = Array.from(new Set(experiences.map((exp: any) => exp.company_name))).sort()
        setExistingCompanies(companies as string[])
      } catch (err) {
        console.error("Error fetching companies:", err)
      } finally {
        setCompaniesLoading(false)
      }
    }

    fetchCompanies()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleLPA = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    setFormData((prev) => ({
      ...prev,
      lpa: value.toLowerCase().replace(/lpa/g, "").trim(),
    }))
  }

  // const handleRoundsChange = (rounds: Round[]) => {
  //   setFormData((prev) => ({
  //     ...prev,
  //     selection_rounds: rounds,
  //   }))
  // }

  const handleLanguagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    const languages = value.split(",").map((lang) => capitalizeFirstLetter(lang.trim()))
    setFormData((prev) => ({
      ...prev,
      languages_used: languages.join(", ")
    }))
  }

  const handleInterviewQuestionsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target
    setFormData((prev) => ({
      ...prev,
      interview_questions: value.replace(/^\s*[\d\W_]+/gm, ""), // removes leading digits/symbols per line
    }))
  }


  const handleSelectCompany = (company: string) => {
    setFormData((prev) => ({
      ...prev,
      company_name: company,
    }))
    setShowNewCompany(false)
    setNewCompanyName("")
  }

  const handleAddNewCompany = () => {
    if (newCompanyName.trim()) {
      setFormData((prev) => ({
        ...prev,
        company_name: newCompanyName.trim(),
      }))
      setShowNewCompany(false)
      setExistingCompanies((prev) => Array.from(new Set([...prev, newCompanyName.trim()])).sort())
      setNewCompanyName("")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!formData.company_name.trim()) {
      setError("Company name is required")
      toast.error("Company name is required!")
      return
    } else if (!formData.languages_used.trim()) {
      setError("Please provide the languages used")
      toast.error("Please provide the languages used")
      return
    } else if (!formData.interview_questions.trim()) {
      setError("Please provide the interview questions asked")
      toast.error("Please provide the interview questions asked")
      return
    } else if (!formData.feedback_rating.trim()) {
      setError("Please provide your overall experience feedback")
      toast.error("Please provide your overall experience feedback")
      return
    }

    setLoading(true)

    formData.selection_rounds = selectionRounds;
    console.log("Submitting form data:", formData);

    try {
      const response = await fetch("/api/experiences", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Failed to save experience")
      }

      router.push("/")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save experience. Please try again.")
      console.error("Error submitting form:", err)
    } finally {
      setLoading(false)
      toast.success("Experience submitted successfully!")
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link href="/" className="flex items-center text-blue-600 hover:text-blue-700 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-slate-900">Share Your Interview Experience</h1>
          <p className="text-slate-600 mt-2">Help other students prepare for their interviews</p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle>Interview Details</CardTitle>
            <CardDescription>Fill in as much detail as you can remember</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">{error}</div>}

              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">Company Name *</label>
                <div className="space-y-3">
                  {companiesLoading ? (
                    <div className="h-10 bg-slate-200 rounded animate-pulse"></div>
                  ) : existingCompanies.length > 0 && !showNewCompany ? (
                    <div>
                      <select
                        value={formData.company_name}
                        onChange={(e) => handleSelectCompany(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-md text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select an existing company...</option>
                        {existingCompanies.map((company) => (
                          <option key={company} value={company}>
                            {company}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={() => setShowNewCompany(true)}
                        className="mt-2 flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        <Plus className="w-4 h-4" />
                        Add New Company
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <Input
                          type="text"
                          value={showNewCompany ? newCompanyName : formData.company_name}
                          onChange={(e) => (showNewCompany ? setNewCompanyName(e.target.value) : handleChange(e))}
                          placeholder="e.g., Google, Microsoft, Amazon"
                          className="border-slate-300 flex-1"
                          name={showNewCompany ? undefined : "company_name"}
                        />
                        {showNewCompany && (
                          <>
                            <Button
                              type="button"
                              onClick={handleAddNewCompany}
                              className="bg-blue-600 hover:bg-blue-700 text-white"
                            >
                              Add
                            </Button>
                            <Button
                              type="button"
                              onClick={() => {
                                setShowNewCompany(false)
                                setNewCompanyName("")
                              }}
                              variant="outline"
                              className="border-slate-300"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                      </div>
                      {existingCompanies.length > 0 && showNewCompany && (
                        <button
                          type="button"
                          onClick={() => setShowNewCompany(false)}
                          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                          Back to existing companies
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Selection Rounds */}
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-4">Selection Rounds</label>

                <div className="space-y-8 relative">
                  {/* Glowing wire connecting rounds */}
                  <div className="absolute left-5 top-8 bottom-8 w-0.5 bg-gradient-to-b from-blue-400 via-blue-300 to-blue-400 animate-pulse"></div>

                  {selectionRounds
                    .map((round, index) => {
                      const trimmedRound = round
                      return (
                        <div
                          key={index}
                          className="relative pl-10"
                        >
                          {/* Glowing connector point */}
                          <div className="absolute left-[15px] top-6 w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_10px_3px_rgba(59,130,246,0.7)]"></div>

                          <Card className="border border-blue-200 bg-white shadow-sm hover:shadow-md transition-all duration-200">
                            <CardContent className="pt-5 pb-5 space-y-3">
                              <div className="flex justify-between items-center">
                                <h3 className="font-semibold text-slate-900">
                                  Round {index + 1}
                                </h3>
                                {selectionRounds.length > 1 && (
                                  <Button
                                    type="button"
                                    size="icon"
                                    variant="ghost"
                                    onClick={() => {
                                      setSelectionRounds((prev) => prev.filter((_, i) => i !== index))
                                    }}
                                    className="text-red-500 hover:text-red-600"
                                  >
                                    <X className="w-4 h-4" />
                                  </Button>
                                )}
                              </div>

                              <Input
                                type="text"
                                placeholder="Enter round name (e.g., Online Test)"
                                value={trimmedRound.roundName}
                                onChange={(e)=>{
                                  setSelectionRounds((prev)=>{
                                    const updated = [...prev];
                                    updated[index].roundName = e.target.value;
                                    return updated
                                  })
                                }}
                                className="border-slate-300"
                              />

                              {/* Optional: Time Gap */}
                              {index > 0 && (
                                <Input
                                  type="text"
                                  placeholder="Time gap from previous round (e.g., 2 days)"
                                  onChange={(e) => {
                                    setSelectionRounds((prev)=>{
                                      const updated = [...prev];
                                      updated[index].daysGap = parseInt(e.target.value) || 0;
                                      return updated
                                    })
                                  }}
                                  className="border-slate-300"
                                />
                              )}
                            </CardContent>
                          </Card>
                        </div>
                      )
                    })}

                  {/* Add Round Button */}
                  <div className="flex justify-center">
                    <Button
                      type="button"
                      onClick={(e) => {
                        setSelectionRounds((prev) => {
                          if(prev[prev.length - 1].roundName === "") return prev; // Prevent adding new round if last is empty

                          const nextId = prev.length > 0 ? prev[prev.length - 1].id + 1 : 1;
                          return [...prev, { id: nextId, roundName: "", daysGap: 0 }];
                        });
                      }}
                      className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Round
                    </Button>
                  </div>
                </div>
              </div>

              {/* Languages Used */}
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">Languages Used *</label>
                <Input
                  type="text"
                  name="languages_used"
                  value={formData.languages_used}
                  onChange={handleLanguagesChange}
                  placeholder="e.g., Java, Python, C++"
                  className="border-slate-300"
                />
              </div>

              {/* Interview Questions */}
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">Interview Questions Asked *</label>
                <Textarea
                  name="interview_questions"
                  value={formData.interview_questions}
                  onChange={handleInterviewQuestionsChange}
                  placeholder="List the questions you were asked during the interview like Write a java code of object? Explain polymorphism?"
                  rows={4}
                  className="border-slate-300"
                />
              </div>

              {/* LPA */}
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">LPA (Annual Salary)</label>
                <Input
                  type="text"
                  name="lpa"
                  value={formData.lpa}
                  onChange={handleLPA}
                  placeholder="e.g., 4, 12-20"
                  className="border-slate-300"
                />
              </div>

              {/* Feedback Rating */}
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">Overall Experience *</label>
                <select
                  name="feedback_rating"
                  value={formData.feedback_rating}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="easy">Easy - Good experience</option>
                  <option value="medium">Medium - Average experience</option>
                  <option value="hard">Hard - Difficult experience</option>
                </select>
              </div>

              {/* Other Details */}
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">Other Details</label>
                <Textarea
                  name="other_details"
                  value={formData.other_details}
                  onChange={handleChange}
                  placeholder="Any additional information, tips, or observations"
                  rows={3}
                  className="border-slate-300"
                />
              </div>

              {/* Submit Button */}
              <div className="flex gap-4 pt-6">
                <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white">
                  {loading ? "Sharing..." : "Share Experience"}
                </Button>
                <Link href="/">
                  <Button variant="outline" className="border-slate-300 bg-transparent">
                    Cancel
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </main>
  )
}
