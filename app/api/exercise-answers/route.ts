import { NextResponse } from "next/server";
import { saveExerciseAnswer } from "@/app/lib/course-store";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    await saveExerciseAnswer(body.email, body.exerciseId, body.answer);

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "تعذر حفظ الإجابة." },
      { status: 400 }
    );
  }
}
