"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Trash2, ArrowLeft, Loader2, IndianRupee, CheckCircle, Calendar } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from "react-toastify"
import Bin from "@/components/bin"

interface Experience {
  _id: string
  company_name: string
  lpa: string
  feedback_rating: "positive" | "negative" | "neutral"
  selection_rounds: string
  timestamp: string | number
  languages_used: string
  interview_questions: string
}

export default function ManageExperiences() {
  const [companies, setCompanies] = useState<string[]>([])
  const [experiences, setExperiences] = useState<any[]>([])
  const [selectedCompanyExperiences, setSelectedCompanyExperiences] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [selectedCompany, setSelectedCompany] = useState<string>("")

  useEffect(() => {
      const fetchData = async () => {
        try {
          setLoading(true)
          const [companiesRes, experiencesRes] = await Promise.all([
            fetch("/api/admin/companies"),
            fetch("/api/admin/experiences"),
          ])

          const companiesList = await companiesRes.json()
          const experiencesList = await experiencesRes.json()
          const clean_experiencesList = experiencesList.map((exp: any) => ({
            ...exp,
            languages_used: exp.languages_used.split(",").map((lang: string) => lang.trim()),
          }))
          setExperiences(clean_experiencesList)

          console.log("clean_experiencesList:", clean_experiencesList);

          const companyData = companiesList;

          setCompanies(companyData)
          setSelectedCompany(companyData[0] || "")
          const filteredExperiences = clean_experiencesList.filter((e: any) => e.company_name === companyData[0])

          setSelectedCompanyExperiences(filteredExperiences)

        } catch (error) {
          console.error("Failed to fetch companies:", error)
        } finally {
          setLoading(false)
        }
      }

      fetchData().finally(() => 
        {
          setLoading(false)
        })
  }, [])


  const handleCompanySelect = (company_name: string) => {
    setSelectedCompany(company_name)

    const filteredExperiences = experiences.filter((e) => e.company_name === company_name)

    setSelectedCompanyExperiences(filteredExperiences)
  }

  const handleDelete = async (id: string) => {
    try {
      setDeleting(id)
      const response = await fetch("/api/admin/experiences", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })

      if (response.ok) {
        setSelectedCompanyExperiences((prev) => prev.filter((e) => e._id !== id))
      }
    } catch (error) {
      console.error("Failed to delete experience:", error)
    } finally {
      setDeleting(null)
      toast.success("Experience deleted successfully!")
    }
  }

  console.log(selectedCompanyExperiences);

  return (
    <main className="min-screen bg-gradient-to-br from-slate-50 to-slate-100 relative">
      {/* Header */}
      <div className="bg-white border-b border-slate-200  top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin">
                <Button variant="outline" size="icon">
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Manage Experiences</h1>
                <p className="text-slate-600 mt-1">Total: {selectedCompanyExperiences.length} experiences</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Company Selection */}
      <div
       className="flex justify-start items-center px-6 py-4 max-w-7xl mx-auto gap-3"
      >
        <div className="font-medium  text-zinc-800">
          filter by Company :
        </div>
        <div className="space-y-3">
          {loading ? (
            <div className="h-10 bg-slate-200 rounded animate-pulse"></div>
          ) : companies.length > 0 && (
            <div>
              <select
                value={selectedCompany}
                onChange={(e) => handleCompanySelect(e.target.value)}
                className="w-full p-1 border border-slate-300 rounded-xl 
                text-slate-900
                bg-gradient-to-tr from-white to-orange-300
                focus:outline-none focus:ring-2 focus:ring-blue-500
                font-medium 
                "
              >
                {companies.map((company) => (
                  <option key={company} value={company}>
                    {company}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="px-4 sm:px-6 lg:px-8">
        <Card className="border-slate-200 bg-white relative">
          <CardHeader>
            <CardTitle>All Experiences</CardTitle>
            <CardDescription>View and manage all interview experiences</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
              </div>
            ) : selectedCompanyExperiences.length === 0 ? (
              <p className="text-center text-slate-600 py-8">No Experiences found</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {selectedCompanyExperiences.map((exp, idx) => (
                  <Card key={exp._id ?? `experience-${idx}`} className="flex-1 hover:shadow-lg transition-shadow cursor-pointer border-slate-200 hover:border-blue-300 exp-card relative">
                    <Bin id={exp._id} handler={handleDelete} />
                    <CardHeader>
                      <div className="flex items-start justify-between mt-1.5">
                        <div className="flex-1">
                          <CardTitle className="text-xl text-slate-900">{exp.company_name}</CardTitle>
                          <CardDescription className="mt-1">
                            {exp.total_experiences} experience{exp.total_experiences !== 1 ? "s" : ""}
                          </CardDescription>
                        </div>
                        <Badge
                          className={`ml-2 ${
                            exp.feedback_rating === "easy"
                              ? "bg-green-100 text-green-800"
                              : exp.feedback_rating === "medium"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                          }`}
                        >
                          {exp.feedback_rating}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Key Stats */}
                      <div className="grid grid-cols-2 gap-2">
                      {exp.lpa && 
                        <div className="flex items-start gap-2">
                          <IndianRupee className="w-4 h-4 text-slate-600 mt-1 flex-shrink-0" />
                          <div>
                            <p className="text-xs text-slate-600">LPA</p>
                            <p className="text-sm font-semibold text-slate-900">
                              {exp.lpa === "N/A" ? "N/A" : `${exp.lpa}L`}
                            </p>
                          </div>
                        </div>
                      }
                      { 
                       exp.selection_rounds && <div>
                          <p className="text-xs text-slate-600">Selection Rounds</p>
                          <p className="font-medium text-sm">{exp?.selection_rounds.split(/->/g).map((round :string, index:number) => (
                            <span key={`round-${index}`}>
                              {index + 1}. {round } <br />
                            </span>
                          ))}</p>
                        </div>
                      }
                      </div>

                      {/* Interview Questions */}
                      {exp.interview_questions &&
                      <div>
                        <p className="text-xs text-slate-600 mb-2">Interview Questions</p>
                        <ul className="list-disc list-inside max-h-24 overflow-y-auto">
                          {exp.interview_questions.split("\n").map((question: string, qidx: number) => (
                            question && <li key={`question-${qidx}`}>{question.trim()}</li>
                          ))}
                        </ul>
                      </div>
                      }
                    

                      {/* Languages */}
                      {exp.languages_used.length > 0 && (
                        <div className="pt-2 border-t border-slate-200">
                          <p className="text-xs text-slate-600 mb-2">Languages</p>
                          <div className="flex flex-wrap gap-2">
                            {exp.languages_used.map((lang: string, lidx: number) => (
                              <Badge key={`${lang}-${lidx}`} className="bg-slate-100 text-slate-800">
                                {lang}
                              </Badge>
                            ))
                            }
                          </div>
                        </div>
                      )}

                      {/* Latest Update */}
                      <div className="pt-2 border-t border-slate-200 flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-slate-600" />
                        <p className="text-xs text-slate-500">Latest: {new Date(exp.timestamp).toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric'})}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
