import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

// ⭐ GET: fetch average + count + breakdown
export async function GET() {
  const supabase = createRouteHandlerClient({ cookies });

  try {
    const { data, error } = await supabase.from("ratings").select("rating");

    if (error) {
      console.error("Error fetching ratings:", error.message);
      return NextResponse.json(
        { average: 0, count: 0, breakdown: [0, 0, 0, 0, 0] },
        { status: 500 }
      );
    }

    const count = data.length;
    const average =
      count > 0 ? data.reduce((sum, r) => sum + r.rating, 0) / count : 0;

    // breakdown: [5★, 4★, 3★, 2★, 1★]
    const breakdown = [0, 0, 0, 0, 0];
    data.forEach((r) => {
      if (r.rating >= 1 && r.rating <= 5) {
        breakdown[5 - r.rating] += 1;
      }
    });

    return NextResponse.json({ average, count, breakdown });
  } catch (err: any) {
    console.error("GET /api/ratings error:", err.message);
    return NextResponse.json(
      { average: 0, count: 0, breakdown: [0, 0, 0, 0, 0] },
      { status: 500 }
    );
  }
}

// ⭐ POST: insert new rating
export async function POST(req: Request) {
  const supabase = createRouteHandlerClient({ cookies });

  try {
    const body = await req.json();
    const { rating } = body;

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { success: false, error: "Invalid rating" },
        { status: 400 }
      );
    }

    const { error } = await supabase.from("ratings").insert([{ rating }]);

    if (error) {
      console.error("Insert error:", error.message);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("POST /api/ratings error:", err.message);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}
