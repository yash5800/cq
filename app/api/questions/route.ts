import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

function detectQuestionType(question: string): string {
  const question_lower = question.toLowerCase()

  // Coding/Technical questions
  if (
    question_lower.includes("code") ||
    question_lower.includes("algorithm") ||
    question_lower.includes("data structure") ||
    question_lower.includes("implement") ||
    question_lower.includes("write") ||
    question_lower.includes("debug") ||
    question_lower.includes("optimize") ||
    question_lower.includes("leetcode") ||
    question_lower.includes("problem") ||
    question_lower.includes("function") ||
    question_lower.includes("class") ||
    question_lower.includes("api") ||
    question_lower.includes("database") ||
    question_lower.includes("sql")
  ) {
    return "Coding"
  }

  // HR/Behavioral questions
  if (
    question_lower.includes("tell me about") ||
    question_lower.includes("why") ||
    question_lower.includes("strength") ||
    question_lower.includes("weakness") ||
    question_lower.includes("experience") ||
    question_lower.includes("conflict") ||
    question_lower.includes("team") ||
    question_lower.includes("leadership") ||
    question_lower.includes("failure") ||
    question_lower.includes("achievement") ||
    question_lower.includes("motivation") ||
    question_lower.includes("career")
  ) {
    return "HR/Behavioral"
  }

  // General/Technical questions
  if (
    question_lower.includes("what") ||
    question_lower.includes("how") ||
    question_lower.includes("explain") ||
    question_lower.includes("difference") ||
    question_lower.includes("concept") ||
    question_lower.includes("design") ||
    question_lower.includes("architecture")
  ) {
    return "General"
  }

  return "General"
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const company = searchParams.get("company")
    const difficulty = searchParams.get("difficulty")
    const language = searchParams.get("language")
    const type = searchParams.get("type")

    const client = await clientPromise
    const db = client.db("interview_hub")
    const experiences = await db.collection("experiences").find({}).toArray()

    // Extract questions from experiences
    const questionsMap = new Map<
      string,
      {
        question: string
        type: string
        companies: string[]
        difficulties: string[]
        languages: string[]
        count: number
      }
    >()

    experiences.forEach((exp: any) => {
      if (exp.interview_questions) {
        const questions = exp.interview_questions.split("\n").map((q: string) => q.trim())
        console.log("Extracted questions:", questions)
        
        questions.forEach((q: string) => {
          if (q) {
            const existing = questionsMap.get(q) || {
              question: q,
              type: detectQuestionType(q),
              companies: [],
              difficulties: [],
              languages: [],
              count: 0,
            }

            if (!existing.companies.includes(exp.company_name)) {
              existing.companies.push(exp.company_name)
            }
            if (exp.selection_rounds && !existing.difficulties.includes(exp.selection_rounds)) {
              existing.difficulties.push(exp.selection_rounds)
            }
            if (exp.languages_used) {
              exp.languages_used.split(",").forEach((lang: string) => {
                const trimmed = lang.trim()
                if (!existing.languages.includes(trimmed)) {
                  existing.languages.push(trimmed)
                }
              })
            }

            existing.count += 1
            questionsMap.set(q, existing)
          }
        })
      }
    })

    let questions = Array.from(questionsMap.values())

    // Apply filters
    if (company) {
      questions = questions.filter((q) => q.companies.some((c) => c.toLowerCase().includes(company.toLowerCase())))
    }

    if (difficulty) {
      questions = questions.filter((q) =>
        q.difficulties.some((d) => d.toLowerCase().includes(difficulty.toLowerCase())),
      )
    }

    if (language) {
      questions = questions.filter((q) => q.languages.some((l) => l.toLowerCase().includes(language.toLowerCase())))
    }

    if (type) {
      questions = questions.filter((q) => q.type === type)
    }

    // Sort by frequency
    questions.sort((a, b) => b.count - a.count)

    return NextResponse.json(questions)
  } catch (error) {
    console.error("Error fetching questions:", error)
    return NextResponse.json({ error: "Failed to fetch questions" }, { status: 500 })
  }
}
