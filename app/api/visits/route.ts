import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db("interview_hub")

    const visitsDoc = await db.collection("site_stats").findOne({ _id: "visits" } as any)
    const visits = visitsDoc?.count || 0

    return NextResponse.json({ visits })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch visits" }, { status: 500 })
  }
}

export async function POST() {
  try {
    const client = await clientPromise
    const db = client.db("interview_hub")

    await db.collection("site_stats").updateOne({ _id: "visits" } as any, { $inc: { count: 1 } }, { upsert: true })

    const visitsDoc = await db.collection("site_stats").findOne({ _id: "visits" } as any)
    return NextResponse.json({ visits: visitsDoc?.count || 1 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to update visits" }, { status: 500 })
  }
}
