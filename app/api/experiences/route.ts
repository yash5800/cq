import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db("interview_hub")
    const experiences = await db.collection("experiences").find({}).toArray()
    return NextResponse.json(experiences)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch experiences" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const client = await clientPromise
    const db = client.db("interview_hub")

    const experience = {
      ...body,
      timestamp: new Date(),
      _id: new Date().getTime().toString(),
    }

    await db.collection("experiences").insertOne(experience)
    return NextResponse.json(experience, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create experience" }, { status: 500 })
  }
}
