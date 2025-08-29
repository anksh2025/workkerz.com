import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function GET() {
  const supabase = createRouteHandlerClient({ cookies });

  const { data, error } = await supabase.from("ratings").select("rating");

  if (error) {
    console.error("Error fetching ratings:", error.message);
    return NextResponse.json({ average: 0, count: 0 });
  }

  const count = data.length;
  const average =
    count > 0 ? data.reduce((sum, r) => sum + r.rating, 0) / count : 0;

  return NextResponse.json({ average, count });
}
