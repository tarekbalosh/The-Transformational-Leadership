import { NextResponse } from "next/server";
import { saveExerciseAnswer } from "@/app/lib/course-store";

type RuntimeEnv = {
  OPENAI_API_KEY?: string;
  OPENAI_MODEL?: string;
};

type CriterionKey =
  | "context"
  | "audience"
  | "surveyDesign"
  | "questionQuality"
  | "outputFormat";

type Evaluation = {
  score: number;
  level: string;
  summary: string;
  strengths: string[];
  improvements: string[];
  missingComponents: string[];
  criteriaScores: Record<CriterionKey, number>;
  revisedPrompt: string;
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

const runtime: RuntimeEnv = {
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  OPENAI_MODEL: process.env.OPENAI_MODEL,
};

const criterionLabels: Record<CriterionKey, string> = {
  context: "السياق",
  audience: "الجمهور المستهدف",
  surveyDesign: "تصميم الاستبيان",
  questionQuality: "جودة الأسئلة",
  outputFormat: "تنسيق المخرجات",
};

const criterionKeys = Object.keys(criterionLabels) as CriterionKey[];

const evaluationSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    score: { type: "number", minimum: 0, maximum: 100 },
    level: { type: "string" },
    summary: { type: "string" },
    strengths: { type: "array", items: { type: "string" } },
    improvements: { type: "array", items: { type: "string" } },
    missingComponents: { type: "array", items: { type: "string" } },
    criteriaScores: {
      type: "object",
      additionalProperties: false,
      properties: {
        context: { type: "number", minimum: 0, maximum: 100 },
        audience: { type: "number", minimum: 0, maximum: 100 },
        surveyDesign: { type: "number", minimum: 0, maximum: 100 },
        questionQuality: { type: "number", minimum: 0, maximum: 100 },
        outputFormat: { type: "number", minimum: 0, maximum: 100 },
      },
      required: criterionKeys,
    },
    revisedPrompt: { type: "string" },
    nextAction: { type: "string" },
  },
  required: [
    "score",
    "level",
    "summary",
    "strengths",
    "improvements",
    "missingComponents",
    "criteriaScores",
    "revisedPrompt",
    "nextAction",
  ],
};

function normalizePrompt(value: unknown) {
  return String(value ?? "").trim();
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

function normalizeEvaluation(value: unknown): Evaluation {
  const parsed = value as Partial<Evaluation>;
  const criteriaScores = criterionKeys.reduce((accumulator, key) => {
    accumulator[key] = clampScore(parsed.criteriaScores?.[key]);
    return accumulator;
  }, {} as Record<CriterionKey, number>);

  return {
    score: clampScore(parsed.score),
    level: String(parsed.level ?? "تقييم أولي"),
    summary: String(parsed.summary ?? "تم تقييم البرومبت."),
    strengths: Array.isArray(parsed.strengths)
      ? parsed.strengths.map(String).slice(0, 4)
      : [],
    improvements: Array.isArray(parsed.improvements)
      ? parsed.improvements.map(String).slice(0, 4)
      : [],
    missingComponents: Array.isArray(parsed.missingComponents)
      ? parsed.missingComponents.map(String).slice(0, 6)
      : [],
    criteriaScores,
    revisedPrompt: String(parsed.revisedPrompt ?? ""),
    nextAction: String(parsed.nextAction ?? ""),
  };
}

async function evaluateSurveyPrompt(prompt: string) {
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
        "أنت مقيم تدريبي عربي متخصص في أبحاث العملاء وتصميم الاستبيانات وبناء الأوامر العملية للذكاء الاصطناعي. قيّم برومبت المشارك بعدل ووضوح، ثم اقترح صياغة محسنة كاملة. لا تذكر أنك نموذج لغوي.",
      input: [
        "قيّم البرومبت التالي لبناء استبيان عملاء باستخدام الذكاء الاصطناعي.",
        "السيناريو: شركة الأناقة متخصصة في تجارة الألبسة والأزياء في السوق السعودي. تأسست قبل 5 سنوات، لديها قاعدة عملاء قوية ومبيعات شهرية مستقرة، ومعدل رضا العملاء 4.2 من 5. المنافسون يحققون نتائج قوية عبر TikTok Shop والبيع المباشر داخل التطبيق من خلال البثوث المباشرة. الإدارة تريد استبياناً للعملاء الحاليين قبل الاستثمار في متجر تيك توك.",
        "معايير التقييم: وضوح السياق 20، تحديد الجمهور والهدف 15، تصميم الاستبيان والمحاور 25، جودة الأسئلة وتنوعها 25، تنسيق المخرجات وقابليتها للاستخدام الإداري 15.",
        "أعد النتيجة باللغة العربية فقط، واجعل الصياغة المحسنة قابلة للنسخ والاستخدام مباشرة.",
        prompt,
      ].join("\n\n"),
      max_output_tokens: 1800,
      temperature: 0.2,
      text: {
        format: {
          type: "json_schema",
          name: "survey_prompt_evaluation",
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
    const prompt = normalizePrompt(body.prompt);

    let evaluation: Evaluation | null = null;
    let message = "شكراً، لقد تم استلام إجابتك.";

    try {
      evaluation = await evaluateSurveyPrompt(prompt);
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
      "survey-builder",
      JSON.stringify(
        {
          exerciseId: "survey-builder",
          prompt,
          combinedPrompt: prompt,
          evaluation,
          submittedAt: new Date().toISOString(),
        },
        null,
        2
      )
    );

    return NextResponse.json({ ok: true, evaluation, message });
  } catch (error) {
    return NextResponse.json(
      {
        message: error instanceof Error ? error.message : "تعذر حفظ الإجابة حالياً.",
      },
      { status: 400 }
    );
  }
}
