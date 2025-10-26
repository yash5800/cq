import { NextResponse } from "next/server"
import { headers } from "next/headers"
import clientPromise from "@/lib/mongodb"

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db("interview_hub")

    const visitsDoc = await db.collection("site_stats").findOne({ id: "visits" })
    const uniqueVisitors = visitsDoc?.unique_visitors || 0
    const totalPageViews = visitsDoc?.total_pageviews || 0

    return NextResponse.json({ unique_visitors: uniqueVisitors, total_pageviews: totalPageViews })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch visits" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const client = await clientPromise
    const db = client.db("interview_hub")
    const headersList = await headers()

    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();

    const ip = data?.ip || "unknown"

    console.log("Visitor IP:", ip)

    const { sessionId } = await request.json()

    const today = new Date().toISOString().split("T")[0]
    const sessionKey = `${sessionId}-${today}`

    const existingSession = await db.collection("visitor_sessions").findOne({ session_key: sessionKey })

    if (existingSession) {
      // Session already counted today, just return current stats
      const visitsDoc = await db.collection("site_stats").findOne({ id: "visits" })
      return NextResponse.json({
        unique_visitors: visitsDoc?.unique_visitors || 0,
        total_pageviews: visitsDoc?.total_pageviews || 0,
        already_counted: true,
      })
    }

    await db.collection("visitor_sessions").insertOne({
      session_key: sessionKey,
      session_id: sessionId,
      ip_address: ip,
      timestamp: new Date(),
      date: today,
    })

    // Increment both unique visitors and total pageviews
    await db.collection("site_stats").updateOne(
      { id: "visits" },
      {
        $inc: { unique_visitors: 1, total_pageviews: 1 },
        $set: { last_updated: new Date() },
      },
      { upsert: true },
    )

    const visitsDoc = await db.collection("site_stats").findOne({ id: "visits" })
    return NextResponse.json({
      unique_visitors: visitsDoc?.unique_visitors || 1,
      total_pageviews: visitsDoc?.total_pageviews || 1,
      already_counted: false,
    })
  } catch (error) {
    console.error("Visit tracking error:", error)
    return NextResponse.json({ error: "Failed to update visits" }, { status: 500 })
  }
}
