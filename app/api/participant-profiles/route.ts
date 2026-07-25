import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
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
      country: body.country,
      professionalBackground: body.professionalBackground,
      courseGoals: body.courseGoals,
      funFact: body.funFact,
    });

    revalidatePath("/introductions/board");

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
