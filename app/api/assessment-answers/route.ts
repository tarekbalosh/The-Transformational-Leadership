import { NextResponse } from "next/server";
import { saveAssessmentAnswer } from "@/app/lib/course-store";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    await saveAssessmentAnswer(body.email, body.assessmentId, body.payload, body.score);

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "تعذر حفظ النتيجة." },
      { status: 400 }
    );
  }
}
