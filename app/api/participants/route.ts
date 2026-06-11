import { NextResponse } from "next/server";
import { upsertParticipant } from "@/app/lib/course-store";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const participant = await upsertParticipant(body.email, body.name);

    return NextResponse.json({ participant });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "تعذر تسجيل الدخول." },
      { status: 400 }
    );
  }
}
