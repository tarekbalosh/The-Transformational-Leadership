import { assertAdmin, dashboardCsv } from "@/app/lib/course-store";

export async function GET(request: Request) {
  if (!assertAdmin(request)) {
    return new Response("رمز دخول المسؤول غير صحيح.", { status: 401 });
  }

  return new Response(await dashboardCsv(), {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": 'attachment; filename="ai-leaders-course-export.csv"',
    },
  });
}
