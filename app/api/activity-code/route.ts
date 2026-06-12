import { NextResponse } from "next/server";
import { activityAccessCodes } from "@/app/lib/course-content";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const activityId = String(body.activityId ?? "");
    const code = String(body.code ?? "").trim();
    const activity = activityAccessCodes.find((item) => item.id === activityId);

    if (!activity || activity.code !== code) {
      return NextResponse.json(
        { message: "كود الدخول غير صحيح." },
        { status: 401 }
      );
    }

    return NextResponse.json({
      ok: true,
      activity: {
        id: activity.id,
        title: activity.title,
        category: activity.category,
      },
    });
  } catch {
    return NextResponse.json(
      { message: "تعذر التحقق من كود الدخول." },
      { status: 400 }
    );
  }
}
