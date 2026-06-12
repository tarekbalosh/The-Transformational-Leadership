import { env } from "cloudflare:workers";
import { NextResponse } from "next/server";
import { saveExerciseAnswer } from "@/app/lib/course-store";

type D1RuntimeEnv = {
  OPENAI_API_KEY?: string;
  OPENAI_MODEL?: string;
};

type PromptFieldKey =
  | "role"
  | "context"
  | "task"
  | "format"
  | "constraints"
  | "example"
  | "tone";

type PromptFields = Record<PromptFieldKey, string>;

type Evaluation = {
  score: number;
  level: string;
  summary: string;
  strengths: string[];
  improvements: string[];
  missingComponents: string[];
  componentScores: Record<PromptFieldKey, number>;
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

const runtime = env as unknown as D1RuntimeEnv;

const fieldLabels: Record<PromptFieldKey, string> = {
  role: "الدور",
  context: "السياق",
  task: "المهمة",
  format: "تنسيق المخرجات",
  constraints: "القيود",
  example: "مثال توضيحي",
  tone: "النبرة والأسلوب",
};

const fieldKeys = Object.keys(fieldLabels) as PromptFieldKey[];

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
    componentScores: {
      type: "object",
      additionalProperties: false,
      properties: {
        role: { type: "number", minimum: 0, maximum: 100 },
        context: { type: "number", minimum: 0, maximum: 100 },
        task: { type: "number", minimum: 0, maximum: 100 },
        format: { type: "number", minimum: 0, maximum: 100 },
        constraints: { type: "number", minimum: 0, maximum: 100 },
        example: { type: "number", minimum: 0, maximum: 100 },
        tone: { type: "number", minimum: 0, maximum: 100 },
      },
      required: fieldKeys,
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
    "componentScores",
    "revisedPrompt",
    "nextAction",
  ],
};

function normalizeFields(fields: unknown): PromptFields {
  const source = (fields ?? {}) as Record<string, unknown>;
  const normalized = fieldKeys.reduce((accumulator, key) => {
    accumulator[key] = String(source[key] ?? "").trim();
    return accumulator;
  }, {} as PromptFields);

  const missing = fieldKeys.filter((key) => !normalized[key]);
  if (missing.length) {
    throw new Error(
      `يرجى تعبئة المكونات التالية قبل التقييم: ${missing
        .map((key) => fieldLabels[key])
        .join("، ")}.`
    );
  }

  const combinedLength = fieldKeys.reduce(
    (total, key) => total + normalized[key].length,
    0
  );

  if (combinedLength < 160) {
    throw new Error(
      "يرجى إضافة تفاصيل أكثر في الأمر قبل التقييم حتى تكون التغذية الراجعة مفيدة."
    );
  }

  return normalized;
}

function combinedPrompt(fields: PromptFields) {
  return fieldKeys
    .map((key) => `${fieldLabels[key]}:\n${fields[key]}`)
    .join("\n\n");
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
  const componentScores = fieldKeys.reduce((accumulator, key) => {
    accumulator[key] = clampScore(parsed.componentScores?.[key]);
    return accumulator;
  }, {} as Record<PromptFieldKey, number>);

  return {
    score: clampScore(parsed.score),
    level: String(parsed.level ?? "تقييم أولي"),
    summary: String(parsed.summary ?? "تم تقييم الأمر."),
    strengths: Array.isArray(parsed.strengths)
      ? parsed.strengths.map(String).slice(0, 4)
      : [],
    improvements: Array.isArray(parsed.improvements)
      ? parsed.improvements.map(String).slice(0, 4)
      : [],
    missingComponents: Array.isArray(parsed.missingComponents)
      ? parsed.missingComponents.map(String).slice(0, 7)
      : [],
    componentScores,
    revisedPrompt: String(parsed.revisedPrompt ?? ""),
    nextAction: String(parsed.nextAction ?? ""),
  };
}

async function evaluatePrompt(fields: PromptFields) {
  if (!runtime.OPENAI_API_KEY) {
    throw new Error(
      "تقييم الذكاء الاصطناعي غير مفعّل بعد. يرجى إضافة OPENAI_API_KEY في إعدادات بيئة الموقع ثم إعادة نشر النسخة."
    );
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
        "أنت مقيم تدريبي عربي متخصص في تصميم الأوامر القيادية لاستخدام الذكاء الاصطناعي في المؤسسات الحكومية. قيّم إجابة المشارك بعدل ووضوح، وقدم تغذية راجعة عملية مختصرة، ثم اقترح صياغة محسنة كاملة للأمر. لا تذكر أنك نموذج لغوي.",
      input: [
        "قيّم الأمر التالي وفق سبعة مكونات: الدور، السياق، المهمة، تنسيق المخرجات، القيود، المثال، النبرة والأسلوب.",
        "السيناريو: مدير في هيئة حكومية خدمية تضم 1,200 موظف. المطلوب أتمتة 60% من الخدمات خلال 18 شهراً، تقليل زمن إنجاز المعاملات بنسبة 40%، رفع رضا المستفيدين إلى 90%. التحديات: مقاومة داخلية، ضعف المهارات الرقمية لدى 40% من القوى العاملة، أنظمة تقنية قديمة، وميزانية محدودة.",
        "معايير التقييم: وضوح الدور 15، اكتمال السياق 20، دقة المهمة 15، قابلية تنسيق المخرجات للتنفيذ 15، واقعية القيود 15، جودة المثال 10، مناسبة النبرة للجنة حكومية 10.",
        "أعد النتيجة باللغة العربية فقط.",
        combinedPrompt(fields),
      ].join("\n\n"),
      max_output_tokens: 1800,
      temperature: 0.2,
      text: {
        format: {
          type: "json_schema",
          name: "prompt_evaluation",
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
    const fields = normalizeFields(body.fields);
    const evaluation = await evaluatePrompt(fields);

    await saveExerciseAnswer(
      email,
      "prompt-writing",
      JSON.stringify(
        {
          exerciseId: "prompt-writing",
          fields,
          combinedPrompt: combinedPrompt(fields),
          evaluation,
          submittedAt: new Date().toISOString(),
        },
        null,
        2
      )
    );

    return NextResponse.json({ ok: true, evaluation });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "تعذر تقييم الأمر حالياً.";
    const status = message.includes("OPENAI_API_KEY") ? 503 : 400;

    return NextResponse.json({ message }, { status });
  }
}
