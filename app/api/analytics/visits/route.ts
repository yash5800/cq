import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const period = searchParams.get("period") || "daily" // daily, monthly, yearly

    const client = await clientPromise
    const db = client.db("interview_hub")

    let pipeline: any[] = []
    let groupFormat = ""

    if (period === "daily") {
      // Last 30 days
      groupFormat = "$date"
      pipeline = [
        {
          $match: {
            timestamp: {
              $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
            },
          },
        },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$timestamp" },
            },
            visits: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]
    } else if (period === "monthly") {
      // Last 12 months
      pipeline = [
        {
          $match: {
            timestamp: {
              $gte: new Date(Date.now() - 12 * 30 * 24 * 60 * 60 * 1000),
            },
          },
        },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m", date: "$timestamp" },
            },
            visits: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]
    } else if (period === "yearly") {
      // Last 5 years
      pipeline = [
        {
          $match: {
            timestamp: {
              $gte: new Date(Date.now() - 5 * 365 * 24 * 60 * 60 * 1000),
            },
          },
        },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y", date: "$timestamp" },
            },
            visits: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]
    }

    const data = await db.collection("visitor_sessions").aggregate(pipeline).toArray()

    return NextResponse.json({ data, period })
  } catch (error) {
    console.error("Analytics error:", error)
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 })
  }
}
