import { NextResponse } from "next/server";
import { supabase } from "../../../lib/supabaseClient";

export async function POST(req: Request) {
  try {
    const data = await req.json();

    // Insert into Supabase table "surveys"
    const { error } = await supabase.from("surveys").insert([
      {
        full_name: data.full_name,
        phone: data.phone,
        q3: data.q3,
        q4: data.q4,
        q5: data.q5,
        q6: data.q6, // array
        q7: data.q7, // array
        q8: data.q8,
        q9: data.q9,
        q10: data.q10,
        q11: data.q11,
      },
    ]);

    if (error) {
      console.error(error);
      return NextResponse.json({ error: "Failed to save survey" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
