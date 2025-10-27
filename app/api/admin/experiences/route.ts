import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db("interview_hub")
    const experiences = await db.collection("experiences").find({}).sort({ timestamp: -1 }).toArray()
    return NextResponse.json(experiences)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch experiences" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json()
    const client = await clientPromise
    const db = client.db("interview_hub")

    await db.collection("experiences").deleteOne({ _id: id })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete experience" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, ...updateData } = await request.json()
    const client = await clientPromise
    const db = client.db("interview_hub")

    await db.collection("experiences").updateOne({ _id: id }, { $set: updateData })

    const updated = await db.collection("experiences").findOne({ _id: id })
    return NextResponse.json(updated)
  } catch (error) {
    return NextResponse.json({ error: "Failed to update experience" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { id } = await request.json()
    const client = await clientPromise
    const db = client.db("interview_hub")

    const experience = await db.collection("experiences").findOne({ _id: id })
    if (!experience) {
      return NextResponse.json({ error: "Experience not found" }, { status: 404 })
    }

    const newVerifiedStatus = !experience.verified

    await db.collection("experiences").updateOne({ _id: id }, { $set: { verified: newVerifiedStatus } })

    const updatedExperience = await db.collection("experiences").findOne({ _id: id })
    return NextResponse.json(updatedExperience)
  } catch (error) {
    return NextResponse.json({ error: "Failed to toggle verification status" }, { status: 500 })
  }
}
