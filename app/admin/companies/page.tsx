"use client"

import { use, useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trash2, ArrowLeft, Loader2 } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface CompanyData {
  name: string
  experience_count: number
}

export default function ManageCompanies() {
  const [companies, setCompanies] = useState<CompanyData[]>([])
  const [experiences, setExperiences] = useState<any[]>([])
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
          setExperiences(experiencesList)

          const companyData = companiesList.map((name: string) => ({
            name,
            experience_count: experiencesList.filter((e: any) => e.company_name === name).length,
          }))

          setCompanies((companyData as CompanyData[]).sort((a: CompanyData, b: CompanyData) => b.experience_count - a.experience_count))
        } catch (error) {
          console.error("Failed to fetch companies:", error)
        } finally {
          setLoading(false)
        }
      }

      fetchData().finally(() => setLoading(false))
  }, [])

  const handleDelete = async (company_name: string) => {
    try {
      setDeleting(company_name)
      const response = await fetch("/api/admin/companies", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ company_name }),
      })

      if (response.ok) {
        setCompanies(companies.filter((c) => c.name !== company_name))
        setExperiences(experiences.filter((e) => e.company_name !== company_name))
      }
    } catch (error) {
      console.error("Failed to delete company:", error)
    } finally {
      setDeleting(null)
    }
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
                <h1 className="text-3xl font-bold text-slate-900">Manage Companies</h1>
                <p className="text-slate-600 mt-1">Total: {companies.length} companies</p>
              </div>
            </div>
          </div>
        </div>
      </div>



      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          </div>
        ) : companies.length === 0 ? (
          <Card className="border-slate-200 bg-white">
            <CardContent className="pt-6">
              <p className="text-center text-slate-600 py-8">No companies found</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {companies.map((company) => (
              <Card key={company.name} className="border-slate-200 bg-white hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{company.name}</CardTitle>
                      <CardDescription className="mt-1">
                        {company.experience_count} experience{company.experience_count !== 1 ? "s" : ""}
                      </CardDescription>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800">{company.experience_count}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" className="w-full" disabled={deleting === company.name}>
                        <Trash2 className="w-4 h-4 mr-2" />
                        {deleting === company.name ? "Deleting..." : "Delete Company"}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogTitle>Delete Company</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete {company.name} and all {company.experience_count} associated
                        experience(s)? This action cannot be undone.
                      </AlertDialogDescription>
                      <div className="flex gap-4 justify-end">
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(company.name)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Delete
                        </AlertDialogAction>
                      </div>
                    </AlertDialogContent>
                  </AlertDialog>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
