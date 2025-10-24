import { type NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET(
  request: NextRequest,
  context: { params: any } // mark as any because it might be a Promise
) {
  try {
    // Await the params before accessing name
    const params = await context.params;
    const companyName = decodeURIComponent(params.name);

    const client = await clientPromise;
    const db = client.db("interview_hub");

    const experiences = await db
      .collection("experiences")
      .find({ company_name: companyName })
      .sort({ timestamp: -1 })
      .toArray();

    return NextResponse.json(experiences);
  } catch (error) {
    console.error("Error fetching company experiences:", error);
    return NextResponse.json({ error: "Failed to fetch experiences" }, { status: 500 });
  }
}
