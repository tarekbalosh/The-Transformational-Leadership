import { NextResponse } from "next/server";
import { assertAdmin, deleteParticipant } from "@/app/lib/course-store";

export async function DELETE(request: Request) {
  if (!assertAdmin(request)) {
    return NextResponse.json(
      { message: "رمز دخول المسؤول غير صحيح." },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const email = body.email;

    if (!email) {
      return NextResponse.json(
        { message: "يرجى تحديد البريد الإلكتروني للمشارك." },
        { status: 400 }
      );
    }

    const result = await deleteParticipant(email);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "تعذر حذف المشارك.",
      },
      { status: 500 }
    );
  }
}
