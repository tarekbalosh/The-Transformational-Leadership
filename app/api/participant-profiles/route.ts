import { NextResponse } from "next/server";
import {
  participantProfilesData,
  saveParticipantProfile,
} from "@/app/lib/course-store";

export async function GET() {
  return NextResponse.json({ profiles: await participantProfilesData() });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await saveParticipantProfile({
      email: body.email,
      name: body.name,
      professionalBackground: body.professionalBackground,
      aiInterests: body.aiInterests,
      courseGoals: body.courseGoals,
      funFact: body.funFact,
    });

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "تعذر حفظ بيانات التعارف.",
      },
      { status: 400 }
    );
  }
}
