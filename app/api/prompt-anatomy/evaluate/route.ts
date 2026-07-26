import { NextResponse } from "next/server";
import { saveExerciseAnswer } from "@/app/lib/course-store";

type RuntimeEnv = {
  OPENAI_API_KEY?: string;
  OPENAI_MODEL?: string;
};

type AnatomyKey =
  | "tone"
  | "task"
  | "context"
  | "role"
  | "example"
  | "constraints"
  | "format";

type AnatomyAnswers = Record<AnatomyKey, string>;

type Evaluation = {
  score: number;
  level: string;
  summary: string;
  correctComponents: string[];
  needsReview: string[];
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

const fieldLabels: Record<AnatomyKey, string> = {
  tone: "النبرة",
  task: "المهمة",
  context: "السياق",
  role: "الدور",
  example: "الأمثلة التوضيحية",
  constraints: "القيود",
  format: "التنسيق المطلوب",
};

const fieldKeys = Object.keys(fieldLabels) as AnatomyKey[];

const evaluationSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    score: { type: "number", minimum: 0, maximum: 100 },
    level: { type: "string" },
    summary: { type: "string" },
    correctComponents: { type: "array", items: { type: "string" } },
    needsReview: { type: "array", items: { type: "string" } },
    nextAction: { type: "string" },
  },
  required: [
    "score",
    "level",
    "summary",
    "correctComponents",
    "needsReview",
    "nextAction",
  ],
};

function optionalText(value: unknown) {
  return String(value ?? "").trim();
}

function normalizeAnswers(input: unknown): AnatomyAnswers {
  const source = (input ?? {}) as Record<string, unknown>;
  return fieldKeys.reduce((accumulator, key) => {
    accumulator[key] = optionalText(source[key]);
    return accumulator;
  }, {} as AnatomyAnswers);
}

function extractOutputText(payload: OpenAIResponse) {
  return (
    payload.output_text ??
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
  return {
    score: clampScore(parsed.score),
    level: String(parsed.level ?? "تقييم أولي"),
    summary: String(parsed.summary ?? "تم تقييم تشريح الأمر."),
    correctComponents: Array.isArray(parsed.correctComponents)
      ? parsed.correctComponents.map(String).slice(0, 7)
      : [],
    needsReview: Array.isArray(parsed.needsReview)
      ? parsed.needsReview.map(String).slice(0, 7)
      : [],
    nextAction: String(parsed.nextAction ?? ""),
  };
}

async function evaluateAnatomy(answers: AnatomyAnswers) {
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
        "أنت مقيم تدريبي عربي متخصص في هندسة الأوامر. قيّم تشريح المشارك لمكونات البرومبت بدقة ووضوح، وقدم تغذية راجعة مختصرة وعملية. لا تذكر أنك نموذج لغوي.",
      input: [
        "المطلوب تقييم تصنيف المشارك لهذه المكونات: النبرة، المهمة، السياق، الدور، الأمثلة التوضيحية، القيود، التنسيق المطلوب.",
        "الإجابات المرجعية:",
        "الدور: أنت خبير استراتيجي في إدارة المواهب والموارد البشرية، متخصص في شركات التقنية ذات حجم 200–500 موظف.",
        "السياق: وصف شركة تك إنوفيت، موقعها، حجمها، معدل الاستقالة، الفئة الأكثر مغادرة، ونتائج مقابلات الخروج.",
        "المهمة: طوّر استراتيجية شاملة لخفض معدل الاستقالة إلى 15% خلال 12 شهرًا.",
        "التنسيق المطلوب: ملخص تنفيذي، تحليل أسباب جذرية، استراتيجية من 3 محاور مع الهدف والخطوات والمؤشرات والميزانية والزمن، وقسم المخاطر والحلول البديلة.",
        "القيود: الميزانية 800,000 ريال، عدم زيادة الرواتب بأكثر من 10%، تنفيذ المحور الأول خلال 3 أشهر، والالتزام بأنظمة العمل السعودية.",
        "الأمثلة التوضيحية: مثال المحور 1: برنامج التطوير المهني المتسارع...",
        "النبرة: لغة احترافية مبنية على البيانات وواقعية، مع تجنب الحلول العامة أو المكررة، وأفكار مبتكرة وقابلة للتطبيق ومراعية للسياق السعودي.",
        "قيّم الإجابة من 100، واذكر المكونات الصحيحة والمكونات التي تحتاج مراجعة.",
        JSON.stringify(answers, null, 2),
      ].join("\n\n"),
      max_output_tokens: 1200,
      temperature: 0.2,
      text: {
        format: {
          type: "json_schema",
          name: "prompt_anatomy_evaluation",
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
      evaluation = await evaluateAnatomy(answers);
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
      "prompt-anatomy",
      JSON.stringify(
        {
          exerciseId: "prompt-anatomy",
          answers,
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
