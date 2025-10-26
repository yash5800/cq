import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db("interview_hub")

    const experiences = await db.collection("experiences").find({}).toArray()
    const companies = Array.from(new Set(experiences.map((e) => e.company_name)))

    return NextResponse.json(companies)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch companies" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { company_name } = await request.json()
    const client = await clientPromise
    const db = client.db("interview_hub")

    await db.collection("experiences").deleteMany({ company_name })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete company" }, { status: 500 })
  }
}
