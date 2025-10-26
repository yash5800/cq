"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
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
import { toast } from "react-toastify"

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
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => {
    fetchExperiences()
  }, [])

  const fetchExperiences = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/admin/experiences")
      const data = await response.json()
      setExperiences(data)
    } catch (error) {
      console.error("Failed to fetch experiences:", error)
    } finally {
      setLoading(false)
    }
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
        setExperiences(experiences.filter((e) => e._id !== id))
      }
    } catch (error) {
      console.error("Failed to delete experience:", error)
    } finally {
      setDeleting(null)
      toast.success("Experience deleted successfully!")
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
                <h1 className="text-3xl font-bold text-slate-900">Manage Experiences</h1>
                <p className="text-slate-600 mt-1">Total: {experiences.length} experiences</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card className="border-slate-200 bg-white">
          <CardHeader>
            <CardTitle>All Experiences</CardTitle>
            <CardDescription>View and manage all interview experiences</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
              </div>
            ) : experiences.length === 0 ? (
              <p className="text-center text-slate-600 py-8">No experiences found</p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Company</TableHead>
                      <TableHead>LPA</TableHead>
                      <TableHead>Feedback</TableHead>
                      <TableHead>Rounds</TableHead>
                      <TableHead>Languages</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {experiences.map((exp) => (
                      <TableRow key={exp._id}>
                        <TableCell className="font-medium">{exp.company_name}</TableCell>
                        <TableCell>{exp.lpa}</TableCell>
                        <TableCell>
                          <Badge
                            className={
                              exp.feedback_rating === "positive"
                                ? "bg-green-100 text-green-800"
                                : exp.feedback_rating === "negative"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-yellow-100 text-yellow-800"
                            }
                          >
                            {exp.feedback_rating}
                          </Badge>
                        </TableCell>
                        <TableCell>{exp.selection_rounds}</TableCell>
                        <TableCell className="text-sm">{exp.languages_used}</TableCell>
                        <TableCell className="text-sm">
                          {new Date(
                            typeof exp.timestamp === "string" ? exp.timestamp : exp.timestamp,
                          ).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogTitle>Delete Experience</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this experience? This action cannot be undone.
                              </AlertDialogDescription>
                              <div className="flex gap-4 justify-end">
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(exp._id)}
                                  disabled={deleting === exp._id}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  {deleting === exp._id ? "Deleting..." : "Delete"}
                                </AlertDialogAction>
                              </div>
                            </AlertDialogContent>
                          </AlertDialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
