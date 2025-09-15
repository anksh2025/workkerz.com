import { NextRequest, NextResponse } from "next/server";

// This will receive JSON POST requests
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    // Example: log data or save to Supabase/DB
    console.log("Survey received:", data);

    // TODO: Replace with your DB insert logic
    // e.g., await supabase.from("survey").insert([data]);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: "Failed to save data" }, { status: 500 });
  }
}
