import { NextResponse } from "next/server";
import { assertAdmin, dashboardData } from "@/app/lib/course-store";

export async function GET(request: Request) {
  if (!assertAdmin(request)) {
    return NextResponse.json({ message: "رمز دخول المسؤول غير صحيح." }, { status: 401 });
  }

  return NextResponse.json(await dashboardData());
}
