import { env } from "cloudflare:workers";
import { NextResponse } from "next/server";
import { saveExerciseAnswer } from "@/app/lib/course-store";

type RuntimeEnv = {
  OPENAI_API_KEY?: string;
  OPENAI_MODEL?: string;
};

type Answers = {
  compositePrompt: string;
  verifiedFact: string;
  sourceCheck: string;
  firstDecision: string;
  secondDecision: string;
  thirdDecision: string;
  preMortem: string;
  revisedDecision: string;
  rejectedNote: string;
  addedIdea: string;
  hallucination: string;
};

type Evaluation = {
  score: number;
  level: string;
  summary: string;
  strengths: string[];
  improvements: string[];
  hallucinationReview: string;
  nextAction: string;
};

type OpenAIResponse = {
  output_text?: string;
  output?: Array<{
    content?: Array<{
      type?: string;
      text?: string;
    }>;
  }>;
  error?: {
    message?: string;
  };
};

const runtime = env as unknown as RuntimeEnv;

const evaluationSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    score: { type: "number", minimum: 0, maximum: 100 },
    level: { type: "string" },
    summary: { type: "string" },
    strengths: { type: "array", items: { type: "string" } },
    improvements: { type: "array", items: { type: "string" } },
    hallucinationReview: { type: "string" },
    nextAction: { type: "string" },
  },
  required: [
    "score",
    "level",
    "summary",
    "strengths",
    "improvements",
    "hallucinationReview",
    "nextAction",
  ],
};

function requireText(value: unknown, label: string) {
  const text = String(value ?? "").trim();
  if (!text) {
    throw new Error(`يرجى تعبئة حقل ${label}.`);
  }
  return text;
}

function normalizeAnswers(input: unknown): Answers {
  const source = (input ?? {}) as Record<string, unknown>;

  return {
    compositePrompt: requireText(source.compositePrompt, "البرومبت المركب"),
    verifiedFact: requireText(
      source.verifiedFact,
      "المعلومة الواقعية التي اخترتها للتحقق"
    ),
    sourceCheck: requireText(
      source.sourceCheck,
      "المصدر أو نتيجة التحقق التي وصلت إليها"
    ),
    firstDecision: requireText(source.firstDecision, "القرار الأول"),
    secondDecision: requireText(source.secondDecision, "القرار الثاني"),
    thirdDecision: requireText(source.thirdDecision, "القرار الثالث"),
    preMortem: requireText(
      source.preMortem,
      "أسباب الفشل الأكثر ترجيحاً بعد تحليل ما قبل الوفاة"
    ),
    revisedDecision: requireText(
      source.revisedDecision,
      "القرار الذي عدّلته بعد النقد"
    ),
    rejectedNote: requireText(
      source.rejectedNote,
      "الملاحظة التي رفضتها ولماذا"
    ),
    addedIdea: requireText(
      source.addedIdea,
      "الفكرة التي أضافها الذكاء الاصطناعي"
    ),
    hallucination: requireText(
      source.hallucination,
      "الهلوسة التي اصطدتها وكيف اكتشفتها"
    ),
  };
}

function extractOutputText(payload: OpenAIResponse) {
  if (payload.output_text) return payload.output_text;

  return (
    payload.output
      ?.flatMap((item) => item.content ?? [])
      .find((content) => content.type === "output_text" && content.text)?.text ??
    ""
  );
}

function clampScore(value: unknown) {
  const score = Number(value);
  if (Number.isNaN(score)) return 0;
  return Math.min(100, Math.max(0, score));
}

function normalizeEvaluation(input: unknown): Evaluation {
  const parsed = input as Partial<Evaluation>;
  return {
    score: clampScore(parsed.score),
    level: String(parsed.level ?? "تقييم أولي"),
    summary: String(parsed.summary ?? "تم تقييم الإجابة."),
    strengths: Array.isArray(parsed.strengths)
      ? parsed.strengths.map(String).slice(0, 4)
      : [],
    improvements: Array.isArray(parsed.improvements)
      ? parsed.improvements.map(String).slice(0, 4)
      : [],
    hallucinationReview: String(parsed.hallucinationReview ?? ""),
    nextAction: String(parsed.nextAction ?? ""),
  };
}

async function evaluateAnswers(answers: Answers) {
  if (!runtime.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY");
  }

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${runtime.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: runtime.OPENAI_MODEL || "gpt-4.1-mini",
      instructions:
        "أنت مقيم تدريبي عربي مختص باستخدام الذكاء الاصطناعي كشريك في التفكير واتخاذ القرار. قيّم جودة عمل المشارك وفق معيار النجاح المذكور، وقدم تغذية راجعة مختصرة وعملية باللغة العربية فقط.",
      input: [
        "التمرين: الذكاء الاصطناعي شريكاً في التفكير - أزمة منصة مهيمنة: حالة Unity الحقيقية.",
        "معيار النجاح: جودة الأسئلة للذكاء الاصطناعي، واصطياد هلوسة واحدة على الأقل، وقرار معدل بوعي يحتفظ فيه المشارك بالكلمة الأخيرة.",
        "قيّم إجابة المشارك وفق: جودة البرومبت، التحقق من المعلومات، نضج القرارات الثلاثة، جودة تحليل ما قبل الوفاة، جودة التعديل بعد النقد، والقدرة على رصد الهلوسة.",
        JSON.stringify(answers, null, 2),
      ].join("\n\n"),
      max_output_tokens: 1600,
      temperature: 0.2,
      text: {
        format: {
          type: "json_schema",
          name: "thinking_partner_evaluation",
          schema: evaluationSchema,
          strict: true,
        },
      },
    }),
  });

  const payload = (await response.json()) as OpenAIResponse;

  if (!response.ok) {
    throw new Error(
      payload.error?.message ??
        "تعذر الاتصال بخدمة تقييم الذكاء الاصطناعي حالياً."
    );
  }

  const outputText = extractOutputText(payload);
  if (!outputText) {
    throw new Error("وصل رد فارغ من خدمة التقييم.");
  }

  return normalizeEvaluation(JSON.parse(outputText));
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = String(body.email ?? "").trim().toLowerCase();
    const answers = normalizeAnswers(body.answers);

    let evaluation: Evaluation | null = null;
    let message = "شكراً، لقد تم استلام إجابتك.";

    try {
      evaluation = await evaluateAnswers(answers);
    } catch (error) {
      const errorText =
        error instanceof Error ? error.message : "evaluation-error";
      if (errorText === "OPENAI_API_KEY") {
        message += " تم حفظ الإجابة في الموقع، وسيظهر التقييم الذكي بعد تفعيل المفتاح.";
      } else {
        message += " تم حفظ الإجابة، لكن تعذر التقييم الذكي حالياً.";
      }
    }

    await saveExerciseAnswer(
      email,
      "thinking-partner-crisis",
      JSON.stringify(
        {
          exerciseId: "thinking-partner-crisis",
          title: "تمرين شريك التفكير - أزمة منصة مهيمنة",
          summary: {
            verifiedFact: answers.verifiedFact,
            firstDecision: answers.firstDecision,
            revisedDecision: answers.revisedDecision,
            hallucination: answers.hallucination,
          },
          answers,
          evaluation,
          savedAt: new Date().toISOString(),
        },
        null,
        2
      )
    );

    return NextResponse.json({ ok: true, evaluation, message });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "تعذر حفظ الإجابة حالياً.",
      },
      { status: 400 }
    );
  }
}
