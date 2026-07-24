"use client";

import { CSSProperties, FormEvent, useMemo, useState } from "react";

import { assessments, exercises } from "@/app/lib/course-content";
import { useDashboardSubscription } from "@/app/hooks/use-dashboard-subscription";

export type DashboardData = {
  participants: Array<{ email: string; name?: string | null; updated_at: string }>;
  participantProfiles: Array<{
    participant_email: string;
    name: string;
    country: string;
    professional_background: string;
    ai_interests: string;
    ai_model: string;
    course_goals: string;
    fun_fact: string;
    updated_at: string;
  }>;
  exerciseAnswers: Array<{
    participant_email: string;
    exercise_id: string;
    answer: string;
    updated_at: string;
  }>;
  assessmentAnswers: Array<{
    participant_email: string;
    assessment_id: string;
    payload: string;
    score?: number | null;
    updated_at: string;
  }>;
  stats: {
    participantCount: number;
    profileCount: number;
    completedExerciseCount: number;
    completedAssessmentCount: number;
    completionRate: number;
    averageScore: number;
  };
};

type CompletionSurveyPayload = {
  exerciseId?: string;
  participantEmail?: string;
  name?: string;
  affiliation?: string;
  experienceRating?: number | null;
  usefulnessRating?: number | null;
  mostUseful?: string;
  application?: string;
  improvement?: string;
  recommendationScore?: number | null;
  testimonial?: string;
  testimonialConsent?: string;
  submittedAt?: string;
};

type CompletionSurveyRow = CompletionSurveyPayload & {
  participant_email: string;
  updated_at: string;
};

type AssessmentPayload = {
  result?: string;
  distribution?: Record<string, number>;
};

type ActivityBar = {
  label: string;
  type: string;
  count: number;
  percent: number;
  details?: Array<{ name: string; email: string; date: string }>;
};

type RecentActivity = {
  participant: string;
  type: string;
  title: string;
  detail: string;
  updated_at: string;
};

type ParsedAnswerItem = {
  label: string;
  value: string;
  status?: "correct" | "incorrect" | "neutral";
};

type ParsedAnswer = {
  score?: string;
  items: ParsedAnswerItem[];
  rawText?: string;
};

const exerciseTitleById = new Map(exercises.map((item) => [item.id, item.title]));
const assessmentTitleById = new Map(
  assessments.map((item) => [item.id, item.title])
);

function clampPercent(value: number) {
  return Math.min(100, Math.max(0, Math.round(value)));
}

function percent(part: number, total: number) {
  return total ? clampPercent((part / total) * 100) : 0;
}

function average(values: Array<number | undefined>) {
  const valid = values.filter((value): value is number => typeof value === "number");

  if (!valid.length) {
    return 0;
  }

  return Number((valid.reduce((sum, value) => sum + value, 0) / valid.length).toFixed(1));
}

function countBy<T extends string>(values: T[]) {
  return values.reduce<Record<string, number>>((counts, value) => {
    counts[value] = (counts[value] ?? 0) + 1;
    return counts;
  }, {});
}

function formatDate(value: string) {
  return new Date(value).toLocaleString("ar");
}

function truncate(text: string, max = 150) {
  return text.length > max ? `${text.slice(0, max)}...` : text;
}

function parseAssessmentPayload(payload: string): AssessmentPayload {
  try {
    return JSON.parse(payload) as AssessmentPayload;
  } catch {
    return {};
  }
}

function formatAssessmentPayload(payload: string) {
  const parsed = parseAssessmentPayload(payload);
  const distribution = parsed.distribution
    ? Object.entries(parsed.distribution)
        .map(([name, value]) => `${name}: ${value}%`)
        .join("، ")
    : "";

  return [parsed.result ? `النتيجة: ${parsed.result}` : "", distribution]
    .filter(Boolean)
    .join(" | ");
}

function parseCompletionSurveyAnswer(answer: {
  participant_email: string;
  exercise_id: string;
  answer: string;
  updated_at: string;
}): CompletionSurveyRow | null {
  if (answer.exercise_id !== "course-completion-survey") {
    return null;
  }

  try {
    const parsed = JSON.parse(answer.answer) as CompletionSurveyPayload;

    return {
      ...parsed,
      participant_email: answer.participant_email,
      updated_at: answer.updated_at,
    };
  } catch {
    return {
      participant_email: answer.participant_email,
      updated_at: answer.updated_at,
    };
  }
}

function formatExerciseAnswer(answer: string) {
  try {
    const parsed = JSON.parse(answer) as {
      exerciseId?: string;
      combinedPrompt?: string;
      answers?:
        | Record<string, string>
        | Array<{
            label?: string;
            sentence?: string;
            tokens?: string;
            characters?: string;
          }>;
      reflection?: string;
      summary?: {
        verifiedFact?: string;
        firstDecision?: string;
        revisedDecision?: string;
        hallucination?: string;
      };
      evaluation?: {
        score?: number;
        level?: string;
        summary?: string;
        missingComponents?: string[];
        nextAction?: string;
      };
    };

    if (parsed.exerciseId === "course-completion-survey") {
      const survey = parsed as CompletionSurveyPayload;

      return [
        survey.experienceRating
          ? `تقييم التجربة: ${survey.experienceRating} / 5`
          : "",
        survey.usefulnessRating
          ? `فائدة المحتوى: ${survey.usefulnessRating} / 5`
          : "",
        typeof survey.recommendationScore === "number"
          ? `الترشيح: ${survey.recommendationScore} / 10`
          : "",
        survey.mostUseful ? `الأكثر فائدة: ${survey.mostUseful}` : "",
        survey.application ? `سيطبق: ${survey.application}` : "",
        survey.improvement ? `تحسين مقترح: ${survey.improvement}` : "",
      ]
        .filter(Boolean)
        .join(" | ");
    }

    if (parsed.exerciseId === "leader-impact") {
      const leaderAnswers =
        parsed.answers && !Array.isArray(parsed.answers)
          ? parsed.answers
          : undefined;

      return [
        leaderAnswers?.reason ? `السبب: ${leaderAnswers.reason}` : "",
        leaderAnswers?.behavior1 ? `السلوك الأول: ${leaderAnswers.behavior1}` : "",
        leaderAnswers?.behavior2 ? `السلوك الثاني: ${leaderAnswers.behavior2}` : "",
      ]
        .filter(Boolean)
        .join(" | ");
    }

    if (!parsed.evaluation) {
      if (parsed.exerciseId === "prompt-anatomy") {
        const anatomyAnswers =
          parsed.answers && !Array.isArray(parsed.answers)
            ? parsed.answers
            : undefined;

        return anatomyAnswers
          ? [
              anatomyAnswers.tone ? `النبرة: ${anatomyAnswers.tone}` : "",
              anatomyAnswers.task ? `المهمة: ${anatomyAnswers.task}` : "",
              anatomyAnswers.context
                ? `السياق: ${anatomyAnswers.context}`
                : "",
              anatomyAnswers.role ? `الدور: ${anatomyAnswers.role}` : "",
            ]
              .filter(Boolean)
              .join(" | ")
          : answer;
      }

      if (parsed.exerciseId === "thinking-partner-crisis") {
        return [
          parsed.summary?.verifiedFact
            ? `المعلومة المتحقق منها: ${parsed.summary.verifiedFact}`
            : "",
          parsed.summary?.firstDecision
            ? `أول قرار: ${parsed.summary.firstDecision}`
            : "",
          parsed.summary?.revisedDecision
            ? `القرار المعدل: ${parsed.summary.revisedDecision}`
            : "",
          parsed.summary?.hallucination
            ? `الهلوسة المرصودة: ${parsed.summary.hallucination}`
            : "",
        ]
          .filter(Boolean)
          .join(" | ");
      }

      if (parsed.exerciseId === "token-count") {
        const rows = Array.isArray(parsed.answers)
          ? parsed.answers.map((item) =>
              [
                item.label ?? "جملة",
                item.tokens ? `الرموز: ${item.tokens}` : "",
                item.characters ? `المحارف: ${item.characters}` : "",
              ]
                .filter(Boolean)
                .join(" - ")
            )
          : [];

        return [
          ...rows,
          parsed.reflection ? `الملاحظة: ${parsed.reflection}` : "",
        ]
          .filter(Boolean)
          .join(" | ");
      }

      return answer;
    }

    if (parsed.exerciseId === "thinking-partner-crisis") {
      return [
        `الدرجة: ${parsed.evaluation.score ?? "-"} / 100`,
        parsed.evaluation.level ? `المستوى: ${parsed.evaluation.level}` : "",
        parsed.evaluation.summary ? `الملخص: ${parsed.evaluation.summary}` : "",
        parsed.summary?.firstDecision
          ? `أول قرار: ${parsed.summary.firstDecision}`
          : "",
        parsed.summary?.revisedDecision
          ? `القرار المعدل: ${parsed.summary.revisedDecision}`
          : "",
        parsed.summary?.hallucination
          ? `الهلوسة المرصودة: ${parsed.summary.hallucination}`
          : "",
      ]
        .filter(Boolean)
        .join(" | ");
    }

    if (parsed.exerciseId === "prompt-anatomy") {
      const anatomyAnswers =
        parsed.answers && !Array.isArray(parsed.answers)
          ? parsed.answers
          : undefined;

      return [
        `الدرجة: ${parsed.evaluation.score ?? "-"} / 100`,
        parsed.evaluation.level ? `المستوى: ${parsed.evaluation.level}` : "",
        parsed.evaluation.summary ? `الملخص: ${parsed.evaluation.summary}` : "",
        anatomyAnswers?.tone ? `النبرة: ${anatomyAnswers.tone}` : "",
        anatomyAnswers?.task ? `المهمة: ${anatomyAnswers.task}` : "",
      ]
        .filter(Boolean)
        .join(" | ");
    }

    return [
      `الدرجة: ${parsed.evaluation.score ?? "-"} / 100`,
      parsed.evaluation.level ? `المستوى: ${parsed.evaluation.level}` : "",
      parsed.evaluation.summary ? `الملخص: ${parsed.evaluation.summary}` : "",
      parsed.evaluation.missingComponents?.length
        ? `مكونات تحتاج تحسيناً: ${parsed.evaluation.missingComponents.join("، ")}`
        : "",
      parsed.evaluation.nextAction
        ? `الخطوة التالية: ${parsed.evaluation.nextAction}`
        : "",
      parsed.combinedPrompt ? `الأمر الأصلي: ${parsed.combinedPrompt}` : "",
    ]
      .filter(Boolean)
      .join(" | ");
  } catch {
    return answer;
  }
}

function parseAnswerData(answer: string, type: "exercise" | "assessment"): ParsedAnswer {
  if (type === "assessment") {
    try {
      const parsed = JSON.parse(answer) as AssessmentPayload;
      const items: ParsedAnswerItem[] = [];
      if (parsed.distribution) {
        Object.entries(parsed.distribution).forEach(([name, value]) => {
          items.push({ label: name, value: `${value}%`, status: "neutral" });
        });
      }
      return { score: parsed.result, items };
    } catch {
      return { items: [], rawText: answer };
    }
  }

  try {
    const parsed = JSON.parse(answer);
    const items: ParsedAnswerItem[] = [];
    
    if (parsed.exerciseId === "course-completion-survey") {
      const survey = parsed as CompletionSurveyPayload;
      if (survey.experienceRating) items.push({ label: "تقييم التجربة", value: `${survey.experienceRating} / 5` });
      if (survey.usefulnessRating) items.push({ label: "فائدة المحتوى", value: `${survey.usefulnessRating} / 5` });
      if (typeof survey.recommendationScore === "number") items.push({ label: "الترشيح", value: `${survey.recommendationScore} / 10` });
      if (survey.mostUseful) items.push({ label: "الأكثر فائدة", value: survey.mostUseful });
      if (survey.application) items.push({ label: "سيطبق", value: survey.application });
      if (survey.improvement) items.push({ label: "تحسين مقترح", value: survey.improvement });
      return { items };
    }

    if (parsed.exerciseId === "leader-impact") {
      const leaderAnswers = parsed.answers && !Array.isArray(parsed.answers) ? parsed.answers : undefined;
      if (leaderAnswers?.reason) items.push({ label: "السبب", value: leaderAnswers.reason });
      if (leaderAnswers?.behavior1) items.push({ label: "السلوك الأول", value: leaderAnswers.behavior1 });
      if (leaderAnswers?.behavior2) items.push({ label: "السلوك الثاني", value: leaderAnswers.behavior2 });
      return { items };
    }

    if (!parsed.evaluation) {
      if (parsed.exerciseId === "prompt-anatomy") {
        const anatomyAnswers = parsed.answers && !Array.isArray(parsed.answers) ? parsed.answers : undefined;
        if (anatomyAnswers?.tone) items.push({ label: "النبرة", value: anatomyAnswers.tone });
        if (anatomyAnswers?.task) items.push({ label: "المهمة", value: anatomyAnswers.task });
        if (anatomyAnswers?.context) items.push({ label: "السياق", value: anatomyAnswers.context });
        if (anatomyAnswers?.role) items.push({ label: "الدور", value: anatomyAnswers.role });
        return { items };
      }
      if (parsed.exerciseId === "thinking-partner-crisis") {
        if (parsed.summary?.verifiedFact) items.push({ label: "المعلومة المتحقق منها", value: parsed.summary.verifiedFact });
        if (parsed.summary?.firstDecision) items.push({ label: "أول قرار", value: parsed.summary.firstDecision });
        if (parsed.summary?.revisedDecision) items.push({ label: "القرار المعدل", value: parsed.summary.revisedDecision });
        if (parsed.summary?.hallucination) items.push({ label: "الهلوسة المرصودة", value: parsed.summary.hallucination });
        return { items };
      }
      if (parsed.exerciseId === "token-count") {
        if (Array.isArray(parsed.answers)) {
          parsed.answers.forEach((item: any) => {
            const val = [item.tokens ? `الرموز: ${item.tokens}` : "", item.characters ? `المحارف: ${item.characters}` : ""].filter(Boolean).join(" | ");
            if (val) items.push({ label: item.label ?? "جملة", value: val });
          });
        }
        if (parsed.reflection) items.push({ label: "الملاحظة", value: parsed.reflection });
        return { items };
      }
    }

    let score = undefined;
    if (parsed.evaluation) {
      if (parsed.evaluation.score !== undefined) score = `${parsed.evaluation.score} / 100`;
      if (parsed.evaluation.level) items.push({ label: "المستوى", value: parsed.evaluation.level });
      if (parsed.evaluation.summary) items.push({ label: "الملخص", value: parsed.evaluation.summary });
      if (parsed.evaluation.missingComponents?.length) items.push({ label: "مكونات تحتاج تحسيناً", value: parsed.evaluation.missingComponents.join("، ") });
      if (parsed.evaluation.nextAction) items.push({ label: "الخطوة التالية", value: parsed.evaluation.nextAction });
    }
    
    if (parsed.exerciseId === "thinking-partner-crisis") {
      if (parsed.summary?.firstDecision) items.push({ label: "أول قرار", value: parsed.summary.firstDecision });
      if (parsed.summary?.revisedDecision) items.push({ label: "القرار المعدل", value: parsed.summary.revisedDecision });
      if (parsed.summary?.hallucination) items.push({ label: "الهلوسة المرصودة", value: parsed.summary.hallucination });
    } else if (parsed.exerciseId === "prompt-anatomy") {
      const anatomyAnswers = parsed.answers && !Array.isArray(parsed.answers) ? parsed.answers : undefined;
      if (anatomyAnswers?.tone) items.push({ label: "النبرة", value: anatomyAnswers.tone });
      if (anatomyAnswers?.task) items.push({ label: "المهمة", value: anatomyAnswers.task });
    } else if (parsed.combinedPrompt) {
      items.push({ label: "الأمر الأصلي", value: parsed.combinedPrompt });
    }

    return { score, items };

  } catch {
    if (answer.includes("إجابة المشارك:") || answer.includes("النتيجة:")) {
      const result: ParsedAnswer = { items: [] };
      const lines = answer.split('\n');
      let currentItem: ParsedAnswerItem | null = null;
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        if (line.startsWith("النتيجة:")) {
          result.score = line.replace("النتيجة:", "").trim();
        } else if (line.match(/^\d+\./)) { 
          if (currentItem) result.items.push(currentItem);
          currentItem = { label: line.replace(/^\d+\./, '').trim(), value: '', status: 'neutral' };
        } else if (line.startsWith("إجابة المشارك:")) {
          if (currentItem) {
            let val = line.replace("إجابة المشارك:", "").trim();
            if (val.includes("(صحيحة)")) {
              currentItem.status = "correct";
              val = val.replace("(صحيحة)", "").trim();
            } else if (val.includes("(خاطئة)")) {
              currentItem.status = "incorrect";
              val = val.replace("(خاطئة)", "").trim();
            }
            currentItem.value = val;
          }
        }
      }
      if (currentItem) result.items.push(currentItem);
      
      return result;
    }

    return { items: [], rawText: answer };
  }
}

function ParticipantDetailCard({
  name,
  email,
  date,
  parsedData
}: {
  name: string;
  email: string;
  date: string;
  parsedData: ParsedAnswer;
}) {
  return (
    <div className="admin-detail-card" style={{
      background: 'var(--surface-1, #fff)',
      borderRadius: '16px',
      border: '1px solid var(--line, #e5e7eb)',
      overflow: 'hidden',
      marginTop: '16px'
    }}>
      <div style={{
        padding: '20px',
        borderBottom: '1px solid var(--line, #e5e7eb)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'var(--surface-2, #f9fafb)',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px', height: '40px', borderRadius: '50%', background: 'var(--navy)',
            color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 'bold', fontSize: '16px', flexShrink: 0
          }}>
            {name !== "مشارك بدون اسم" ? name.charAt(0).toUpperCase() : email.charAt(0).toUpperCase()}
          </div>
          <div>
            <div style={{ fontWeight: 'bold', color: 'var(--navy)', fontSize: '16px' }}>{name}</div>
            <div style={{ fontSize: '13px', color: 'var(--text-3)' }}>{email} • {formatDate(date)}</div>
          </div>
        </div>
        {parsedData.score && (
          <div style={{
            background: 'var(--primary-light, #fff5eb)',
            color: 'var(--primary-dark, #b35900)',
            padding: '8px 16px',
            borderRadius: '20px',
            fontWeight: 'bold',
            fontSize: '14px',
            border: '1px solid rgba(var(--primary-rgb), 0.2)'
          }}>
            النتيجة: {parsedData.score}
          </div>
        )}
      </div>

      <div style={{ padding: '20px' }}>
        {parsedData.items.length > 0 ? (
          <div style={{ display: 'grid', gap: '16px' }}>
            {parsedData.items.map((item, idx) => (
              <div key={idx} style={{
                background: 'var(--bg-2, #f3f4f6)',
                padding: '16px',
                borderRadius: '12px',
                borderRight: item.status === 'correct' ? '4px solid var(--green)' : 
                             item.status === 'incorrect' ? '4px solid var(--red)' : 
                             '4px solid var(--line, #e5e7eb)'
              }}>
                <div style={{ fontWeight: 'bold', color: 'var(--navy)', marginBottom: '8px', fontSize: '15px' }}>
                  {item.label}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', flexWrap: 'wrap' }}>
                  <div style={{ fontSize: '14px', color: 'var(--text-1)', lineHeight: '1.6', flex: 1 }}>
                    {item.value}
                  </div>
                  {item.status && item.status !== 'neutral' && (
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '4px 10px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      background: item.status === 'correct' ? 'var(--green-light)' : 'var(--red-light)',
                      color: item.status === 'correct' ? 'var(--green-dark)' : 'var(--red-dark)',
                    }}>
                      {item.status === 'correct' ? '✔ صحيحة' : '✘ خاطئة'}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.8', color: 'var(--text-1)', fontSize: '14px' }}>
            {parsedData.rawText || "لا توجد تفاصيل."}
          </div>
        )}
      </div>
    </div>
  );
}

function RingMetric({
  label,
  value,
  caption,
}: {
  label: string;
  value: number;
  caption: string;
}) {
  return (
    <article className="admin-ring-card">
      <div
        className="admin-ring"
        style={{ "--ring-value": `${clampPercent(value) * 3.6}deg` } as CSSProperties}
      >
        <span>{clampPercent(value)}%</span>
      </div>
      <div>
        <strong>{label}</strong>
        <p>{caption}</p>
      </div>
    </article>
  );
}

function HorizontalBar({ item }: { item: ActivityBar }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasDetails = item.details && item.details.length > 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <article 
        className="admin-bar-row"
        onClick={() => setIsExpanded(!isExpanded)}
        style={{ cursor: "pointer" }}
      >
        <div>
          <strong>{item.label}</strong>
          <span>{item.type}</span>
        </div>
        <div className="admin-bar-track" aria-label={`${item.percent}%`}>
          <span style={{ width: `${item.percent}%` }} />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", justifySelf: "flex-end" }}>
          <em>
            {item.count} / {item.percent}%
          </em>
          <svg 
            width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
            style={{ transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s", color: "var(--navy)" }}
          >
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </div>
      </article>
      {isExpanded && (
        <div style={{ padding: "16px", background: "var(--surface-2, #f9fafb)", borderRadius: "12px", border: "1px solid var(--line, #e5e7eb)", marginBottom: "8px", display: "flex", flexDirection: "column", gap: "12px" }}>
          {hasDetails ? (
            item.details!.map((detail, idx) => (
              <div key={`${detail.email}-${idx}`} style={{ paddingBottom: idx < item.details!.length - 1 ? "12px" : "0", borderBottom: idx < item.details!.length - 1 ? "1px solid var(--line, #e5e7eb)" : "none" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <strong style={{ fontSize: "14px", color: "var(--navy)" }}>{detail.name !== "-" ? detail.name : "مشارك بدون اسم"}</strong>
                  <span style={{ fontSize: "12px", color: "var(--text-3, #6b7280)" }}>{formatDate(detail.date)}</span>
                </div>
                <div style={{ fontSize: "13px", color: "var(--text-2, #4b5563)", marginTop: "4px" }}>{detail.email}</div>
              </div>
            ))
          ) : (
            <div style={{ textAlign: "center", color: "var(--text-3, #6b7280)", fontSize: "14px", padding: "8px 0" }}>
              لا توجد مشاركات حتى الآن
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function AdminDashboard() {
  const [token, setToken] = useState("");
  const [activeToken, setActiveToken] = useState("");
  
  const { data, isLoading, error, isReconnecting, reload: reloadDashboard } = useDashboardSubscription(activeToken);
  const message = error || "";
  
  const [deletingEmail, setDeletingEmail] = useState<string | null>(null);
  const [deleteMessage, setDeleteMessage] = useState("");
  const [activeTab, setActiveTab] = useState<"exercises" | "assessments">("exercises");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<{name: string, email: string, date: string, parsedData: ParsedAnswer} | null>(null);

  const dashboard = useMemo(() => {
    if (!data) {
      return null;
    }

    const participantTotal = data.stats.participantCount;
    const completionSurveyRows = data.exerciseAnswers
      .map(parseCompletionSurveyAnswer)
      .filter((row): row is CompletionSurveyRow => row !== null);
    const exerciseRows = data.exerciseAnswers.filter(
      (answer) => answer.exercise_id !== "course-completion-survey"
    );
    const profilesByEmail = new Map(
      data.participantProfiles.map((profile) => [
        profile.participant_email,
        profile,
      ])
    );
    const surveysByEmail = new Map(
      completionSurveyRows.map((survey) => [survey.participant_email, survey])
    );
    const exerciseCountsByEmail = countBy(
      exerciseRows.map((answer) => answer.participant_email)
    );
    const assessmentCountsByEmail = countBy(
      data.assessmentAnswers.map((answer) => answer.participant_email)
    );
    const surveyCount = completionSurveyRows.length;
    const testimonialRows = completionSurveyRows.filter((row) =>
      row.testimonial?.trim()
    );
    const consentedTestimonials = testimonialRows.filter(
      (row) => !row.testimonialConsent?.startsWith("لا")
    );
    const averageExperience = average(
      completionSurveyRows.map((row) => row.experienceRating)
    );
    const averageUsefulness = average(
      completionSurveyRows.map((row) => row.usefulnessRating)
    );
    const averageRecommendation = average(
      completionSurveyRows.map((row) => row.recommendationScore)
    );
    const promoters = completionSurveyRows.filter(
      (row) => typeof row.recommendationScore === "number" && row.recommendationScore >= 9
    ).length;
    const detractors = completionSurveyRows.filter(
      (row) => typeof row.recommendationScore === "number" && row.recommendationScore <= 6
    ).length;
    const nps = surveyCount
      ? Math.round(((promoters - detractors) / surveyCount) * 100)
      : 0;
    const consentBreakdown = Object.entries(
      countBy(
        completionSurveyRows.map(
          (row) => row.testimonialConsent || "لم يتم تحديد الموافقة"
        )
      )
    ).map(([label, count]) => ({
      label,
      count,
      percent: percent(count, surveyCount),
    }));
    const activityBars: ActivityBar[] = [
      {
        label: "بطاقات تعارف المشاركين",
        type: "تعارف",
        count: data.stats.profileCount,
        percent: percent(data.stats.profileCount, participantTotal),
        details: data.participantProfiles.map(p => ({
           name: p.name || "-",
           email: p.participant_email,
           date: p.updated_at
        })).sort((a, b) => b.date.localeCompare(a.date))
      },
      ...exercises.map((exercise) => {
        const answers = data.exerciseAnswers.filter(
          (answer) => answer.exercise_id === exercise.id
        );

        return {
          label: exercise.title,
          type: "تمرين",
          count: answers.length,
          percent: percent(answers.length, participantTotal),
          details: answers.map(a => {
            const pName = profilesByEmail.get(a.participant_email)?.name || surveysByEmail.get(a.participant_email)?.name;
            return {
              name: pName || "-",
              email: a.participant_email,
              date: a.updated_at
            };
          }).sort((a, b) => b.date.localeCompare(a.date))
        };
      }),
      ...assessments.map((assessment) => {
        const answers = data.assessmentAnswers.filter(
          (answer) => answer.assessment_id === assessment.id
        );

        return {
          label: assessment.title,
          type: "مقياس",
          count: answers.length,
          percent: percent(answers.length, participantTotal),
          details: answers.map(a => {
            const pName = profilesByEmail.get(a.participant_email)?.name || surveysByEmail.get(a.participant_email)?.name;
            return {
              name: pName || "-",
              email: a.participant_email,
              date: a.updated_at
            };
          }).sort((a, b) => b.date.localeCompare(a.date))
        };
      }),
    ];
    const leaderStyleCounts = Object.entries(
      countBy(
        data.assessmentAnswers
          .filter((answer) => answer.assessment_id === "ai-leader-style")
          .map((answer) => parseAssessmentPayload(answer.payload).result ?? "غير محدد")
      )
    ).map(([label, count]) => ({
      label,
      count,
      percent: percent(count, data.assessmentAnswers.length),
    }));
    const participantRows = data.participants.map((participant) => {
      const profile = profilesByEmail.get(participant.email);
      const survey = surveysByEmail.get(participant.email);
      const lastUpdated = [
        participant.updated_at,
        profile?.updated_at,
        survey?.updated_at,
      ]
        .filter((value): value is string => Boolean(value))
        .sort()
        .at(-1);

      return {
        email: participant.email,
        name: profile?.name || survey?.name || participant.name || "-",
        affiliation: survey?.affiliation || "-",
        hasProfile: Boolean(profile),
        exerciseCount: exerciseCountsByEmail[participant.email] ?? 0,
        assessmentCount: assessmentCountsByEmail[participant.email] ?? 0,
        hasSurvey: Boolean(survey),
        lastUpdated: lastUpdated ?? participant.updated_at,
      };
    });
    const recentActivity: RecentActivity[] = [
      ...data.participantProfiles.map((profile) => ({
        participant: profile.participant_email,
        type: "تعارف",
        title: "بطاقة تعارف المشاركين",
        detail: profile.name,
        updated_at: profile.updated_at,
      })),
      ...exerciseRows.map((answer) => ({
        participant: answer.participant_email,
        type: "تمرين",
        title: exerciseTitleById.get(answer.exercise_id) ?? answer.exercise_id,
        detail: truncate(formatExerciseAnswer(answer.answer)),
        updated_at: answer.updated_at,
      })),
      ...completionSurveyRows.map((survey) => ({
        participant: survey.participant_email,
        type: "استبيان",
        title: "استبيان ما بعد الدورة التدريبية",
        detail: survey.testimonial || survey.mostUseful || "تم استلام الاستبيان",
        updated_at: survey.updated_at,
      })),
      ...data.assessmentAnswers.map((answer) => ({
        participant: answer.participant_email,
        type: "مقياس",
        title: assessmentTitleById.get(answer.assessment_id) ?? answer.assessment_id,
        detail: truncate(formatAssessmentPayload(answer.payload)),
        updated_at: answer.updated_at,
      })),
    ]
      .sort((a, b) => b.updated_at.localeCompare(a.updated_at))
      .slice(0, 8);

    const leaderImpactRows = data.exerciseAnswers
      .filter((answer) => answer.exercise_id === "leader-impact")
      .map((answer) => {
        try {
          const parsed = JSON.parse(answer.answer) as {
            exerciseId?: string;
            answers?: { reason?: string; behavior1?: string; behavior2?: string };
          };
          return {
            email: answer.participant_email,
            reason: parsed.answers?.reason ?? "",
            behavior1: parsed.answers?.behavior1 ?? "",
            behavior2: parsed.answers?.behavior2 ?? "",
            updated_at: answer.updated_at,
          };
        } catch {
          return null;
        }
      })
      .filter((row): row is NonNullable<typeof row> => row !== null);

    return {
      activityBars,
      averageExperience,
      averageRecommendation,
      averageUsefulness,
      completionSurveyRows,
      consentBreakdown,
      consentedTestimonials,
      exerciseRows,
      leaderImpactRows,
      leaderStyleCounts,
      nps,
      participantRows,
      profileCoverage: percent(data.stats.profileCount, participantTotal),
      recentActivity,
      surveyCoverage: percent(surveyCount, participantTotal),
      surveyCount,
      testimonialRows,
    };
  }, [data]);

  const filteredActivities = useMemo(() => {
    if (!data || !dashboard) return [];

    let items = [];
    if (activeTab === "exercises") {
      items = exercises.map(ex => {
        const answers = dashboard.exerciseRows.filter(a => a.exercise_id === ex.id);
        return {
          id: ex.id,
          title: ex.title,
          type: "exercise",
          count: answers.length,
          percent: percent(answers.length, data.stats.participantCount),
          answers: answers.map(a => {
            const pName = dashboard.participantRows.find(p => p.email === a.participant_email)?.name;
            const finalName = (!pName || pName === "-") ? "مشارك بدون اسم" : pName;
            return {
              email: a.participant_email,
              name: finalName,
              date: a.updated_at,
              content: formatExerciseAnswer(a.answer),
              parsedData: parseAnswerData(a.answer, "exercise")
            };
          })
        };
      });
    } else {
      items = assessments.map(ass => {
        const answers = data.assessmentAnswers.filter(a => a.assessment_id === ass.id);
        return {
          id: ass.id,
          title: ass.title,
          type: "assessment",
          count: answers.length,
          percent: percent(answers.length, data.stats.participantCount),
          answers: answers.map(a => {
            const pName = dashboard.participantRows.find(p => p.email === a.participant_email)?.name;
            const finalName = (!pName || pName === "-") ? "مشارك بدون اسم" : pName;
            return {
              email: a.participant_email,
              name: finalName,
              date: a.updated_at,
              content: formatAssessmentPayload(a.payload),
              parsedData: parseAnswerData(a.payload, "assessment"),
              score: a.score
            };
          })
        };
      });
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      items = items.filter(item => 
        item.title.toLowerCase().includes(q) || 
        item.answers.some(a => a.name.toLowerCase().includes(q) || a.email.toLowerCase().includes(q))
      );
    }

    return items.sort((a, b) => {
      if (a.count === 0 && b.count > 0) return 1;
      if (b.count === 0 && a.count > 0) return -1;
      return b.count - a.count;
    });
  }, [data, dashboard, activeTab, searchQuery]);

  async function load(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setActiveToken(token);
  }

  async function handleDeleteParticipant(email: string) {
    const confirmed = window.confirm(
      `هل أنت متأكد من حذف المشارك ${email}؟\n\nسيتم حذف جميع بياناته بما في ذلك:\n- بطاقة التعارف\n- إجابات التمارين\n- نتائج المقاييس\n- بيانات التقدم\n\nهذا الإجراء لا يمكن التراجع عنه.`
    );

    if (!confirmed) {
      return;
    }

    setDeletingEmail(email);
    setDeleteMessage("");

    try {
      const response = await fetch("/api/admin/participants", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-admin-token": token,
        },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (!response.ok) {
        setDeleteMessage(result.message ?? "تعذر حذف المشارك.");
        return;
      }

      setDeleteMessage(`تم حذف المشارك ${email} وجميع بياناته بنجاح.`);
      await reloadDashboard();
    } catch {
      setDeleteMessage("حدث خطأ أثناء حذف المشارك.");
    } finally {
      setDeletingEmail(null);
    }
  }

  function exportCsv() {
    const url = `/api/admin/export?token=${encodeURIComponent(token)}`;
    window.location.href = url;
  }

  return (
    <div className="admin-layout">
      <form className="admin-access" onSubmit={load}>
        <label htmlFor="admin-token">رمز دخول المسؤول</label>
        <div className="entry-row">
          <input
            id="admin-token"
            type="password"
            value={token}
            onChange={(event) => setToken(event.target.value)}
            placeholder="أدخل الرمز"
            required
          />
          <button type="submit">{isLoading ? "جار الفتح" : "فتح اللوحة"}</button>
        </div>
        <p className="form-note">
          استخدم رمز المسؤول الذي تم تزويدك به لعرض بيانات المشاركين.
        </p>
        {message ? <p className="form-message">{message}</p> : null}
      </form>

      {data && dashboard ? (
        <>
          <section className="admin-command-center">
            <div>
              <div className="section-kicker">ملخص تنفيذي</div>
              <h2>صورة الدورة في لمحة واحدة</h2>
              <p>
                تجمع هذه اللوحة بين الحضور، المشاركة، نتائج المقاييس،
                والاستبيان الختامي حتى تظهر حالة الدورة بسرعة قبل الرجوع
                للتفاصيل.
              </p>
            </div>
            <button type="button" onClick={exportCsv}>
              تصدير CSV
            </button>
          </section>

          <section className="metrics-row infographic" aria-label="مؤشرات عامة">
            <article>
              <span>المشاركون</span>
              <strong>{data.stats.participantCount}</strong>
              <small>بريد مسجل</small>
            </article>
            <article>
              <span>بطاقات التعارف</span>
              <strong>{data.stats.profileCount}</strong>
              <small>{dashboard.profileCoverage}% من المشاركين</small>
            </article>
            <article>
              <span>إجابات التمارين</span>
              <strong>{dashboard.exerciseRows.length}</strong>
              <small>لا تشمل الاستبيان الختامي</small>
            </article>
            <article>
              <span>نتائج المقاييس</span>
              <strong>{data.stats.completedAssessmentCount}</strong>
              <small>متوسط {data.stats.averageScore || "-"}</small>
            </article>
            <article>
              <span>الاستبيان الختامي</span>
              <strong>{dashboard.surveyCount}</strong>
              <small>{dashboard.surveyCoverage}% من المشاركين</small>
            </article>
            <article>
              <span>شهادات قابلة للاستخدام</span>
              <strong>{dashboard.consentedTestimonials.length}</strong>
              <small>حسب موافقة المشارك</small>
            </article>
          </section>

          <section className="admin-visual-grid">
            <div className="admin-panel">
              <div className="admin-panel-head">
                <div>
                  <div className="section-kicker">مؤشرات الإكمال</div>
                  <h2>تغطية الأنشطة الأساسية</h2>
                </div>
              </div>
              <div className="admin-ring-grid">
                <RingMetric
                  label="معدل الإكمال العام"
                  value={data.stats.completionRate}
                  caption="إجابات التمارين والمقاييس مقارنة بعدد المشاركين"
                />
                <RingMetric
                  label="تغطية التعارف"
                  value={dashboard.profileCoverage}
                  caption="من أكمل بطاقة التعارف"
                />
                <RingMetric
                  label="تغطية الاستبيان"
                  value={dashboard.surveyCoverage}
                  caption="من أرسل استبيان ما بعد الدورة"
                />
              </div>
            </div>

            <div className="admin-panel">
              <div className="admin-panel-head">
                <div>
                  <div className="section-kicker">رضا المشاركين</div>
                  <h2>قراءة الاستبيان الختامي</h2>
                </div>
              </div>
              <div className="admin-score-grid">
                <article>
                  <span>تقييم التجربة</span>
                  <strong>{dashboard.averageExperience || "-"}</strong>
                  <em>من 5</em>
                </article>
                <article>
                  <span>فائدة المحتوى</span>
                  <strong>{dashboard.averageUsefulness || "-"}</strong>
                  <em>من 5</em>
                </article>
                <article>
                  <span>متوسط الترشيح</span>
                  <strong>{dashboard.averageRecommendation || "-"}</strong>
                  <em>من 10</em>
                </article>
                <article>
                  <span>NPS</span>
                  <strong>{dashboard.nps}</strong>
                  <em>مروجون ناقص منتقدين</em>
                </article>
              </div>
            </div>
          </section>

          <section className="admin-panel">
            <div className="admin-panel-head">
              <div>
                <div className="section-kicker">خريطة المشاركة</div>
                <h2>اكتمال كل نشاط</h2>
              </div>
            </div>
            <div className="admin-bar-list">
              {dashboard.activityBars.map((item) => (
                <HorizontalBar item={item} key={`${item.type}-${item.label}`} />
              ))}
            </div>
          </section>

          <section className="admin-visual-grid">
            <div className="admin-panel">
              <div className="admin-panel-head">
                <div>
                  <div className="section-kicker">مقياس القيادة</div>
                  <h2>توزيع أنماط قيادة الذكاء الاصطناعي</h2>
                </div>
              </div>
              <div className="admin-mini-chart-list">
                {dashboard.leaderStyleCounts.length ? (
                  dashboard.leaderStyleCounts.map((item) => (
                    <HorizontalBar
                      item={{ ...item, type: "نمط", percent: item.percent }}
                      key={item.label}
                    />
                  ))
                ) : (
                  <p className="admin-empty-state">لا توجد نتائج مقياس بعد.</p>
                )}
              </div>
            </div>

            <div className="admin-panel">
              <div className="admin-panel-head">
                <div>
                  <div className="section-kicker">موافقات الشهادات</div>
                  <h2>قابلية استخدام الاستشهادات</h2>
                </div>
              </div>
              <div className="admin-mini-chart-list">
                {dashboard.consentBreakdown.length ? (
                  dashboard.consentBreakdown.map((item) => (
                    <HorizontalBar
                      item={{ ...item, type: "موافقة", percent: item.percent }}
                      key={item.label}
                    />
                  ))
                ) : (
                  <p className="admin-empty-state">لا توجد موافقات مسجلة بعد.</p>
                )}
              </div>
            </div>
          </section>

          <section className="admin-panel">
            <div className="admin-panel-head">
              <div>
                <div className="section-kicker">الشهادات</div>
                <h2>اقتباسات المشاركين</h2>
              </div>
            </div>
            {dashboard.testimonialRows.length ? (
              <div className="testimonial-card-grid">
                {dashboard.testimonialRows.map((row) => (
                  <article key={`${row.participant_email}-${row.updated_at}`}>
                    <blockquote>{row.testimonial}</blockquote>
                    <div>
                      <strong>{row.name || row.participant_email}</strong>
                      <span>{row.affiliation || row.participant_email}</span>
                      <em>{row.testimonialConsent || "لم يتم تحديد الموافقة"}</em>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <p className="admin-empty-state">لا توجد شهادات مكتوبة بعد.</p>
            )}
          </section>

          <section className="admin-visual-grid">
            <div className="admin-panel">
              <div className="admin-panel-head">
                <div>
                  <div className="section-kicker">النشاط الأخير</div>
                  <h2>آخر التحديثات</h2>
                </div>
              </div>
              <div className="admin-timeline">
                {dashboard.recentActivity.map((item) => (
                  <article key={`${item.type}-${item.participant}-${item.updated_at}`}>
                    <span>{item.type}</span>
                    <div>
                      <strong>{item.title}</strong>
                      <p>{item.detail || item.participant}</p>
                      <small>
                        {item.participant} - {formatDate(item.updated_at)}
                      </small>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <div className="admin-panel">
              <div className="admin-panel-head">
                <div>
                  <div className="section-kicker">ملفات المشاركين</div>
                  <h2>حالة كل مشارك</h2>
                </div>
              </div>
              <div className="participant-status-list">
                {dashboard.participantRows.map((participant) => (
                  <article key={participant.email}>
                    <div>
                      <strong>{participant.name}</strong>
                      <span>{participant.email}</span>
                    </div>
                    <div className="participant-status-badges">
                      <em data-active={participant.hasProfile}>تعارف</em>
                      <em data-active={participant.exerciseCount > 0}>
                        {participant.exerciseCount} تمرين
                      </em>
                      <em data-active={participant.assessmentCount > 0}>
                        {participant.assessmentCount} مقياس
                      </em>
                      <em data-active={participant.hasSurvey}>استبيان</em>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section className="admin-table-wrap">
            <h2>المشاركون</h2>
            {deleteMessage ? (
              <p className={`admin-delete-message ${deleteMessage.includes("بنجاح") ? "success" : "error"}`}>
                {deleteMessage}
              </p>
            ) : null}
            <table>
              <thead>
                <tr>
                  <th>الاسم</th>
                  <th>البريد</th>
                  <th>الجهة أو المسمى</th>
                  <th>التعارف</th>
                  <th>التمارين</th>
                  <th>المقاييس</th>
                  <th>الاستبيان</th>
                  <th>آخر تحديث</th>
                  <th>إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {dashboard.participantRows.map((participant) => (
                  <tr key={participant.email}>
                    <td>{participant.name}</td>
                    <td>{participant.email}</td>
                    <td>{participant.affiliation}</td>
                    <td>{participant.hasProfile ? "مكتمل" : "-"}</td>
                    <td>{participant.exerciseCount}</td>
                    <td>{participant.assessmentCount}</td>
                    <td>{participant.hasSurvey ? "مكتمل" : "-"}</td>
                    <td>{formatDate(participant.lastUpdated)}</td>
                    <td>
                      <button
                        type="button"
                        className="admin-delete-btn"
                        disabled={deletingEmail === participant.email}
                        onClick={() => handleDeleteParticipant(participant.email)}
                        title={`حذف ${participant.email}`}
                      >
                        {deletingEmail === participant.email ? (
                          <span className="admin-delete-spinner" />
                        ) : (
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                            <line x1="10" y1="11" x2="10" y2="17" />
                            <line x1="14" y1="11" x2="14" y2="17" />
                          </svg>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <section className="admin-table-wrap">
            <h2>بطاقات تعارف المشاركين</h2>
            <table>
              <thead>
                <tr>
                  <th>الاسم</th>
                  <th>البريد</th>
                  <th>البلد</th>
                  <th>الخلفية المهنية</th>
                  <th>الاهتمامات</th>
                  <th>النموذج المستخدم</th>
                  <th>الأهداف</th>
                  <th>حقيقة ممتعة</th>
                </tr>
              </thead>
              <tbody>
                {data.participantProfiles.map((profile) => (
                  <tr key={profile.participant_email}>
                    <td>{profile.name}</td>
                    <td>{profile.participant_email}</td>
                    <td>{profile.country || "-"}</td>
                    <td>{profile.professional_background}</td>
                    <td>{profile.ai_interests}</td>
                    <td>{profile.ai_model || "-"}</td>
                    <td>{profile.course_goals}</td>
                    <td>{profile.fun_fact}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <section className="admin-panel" style={{ marginTop: "40px" }}>
            <div className="admin-activity-controls">
              <div className="admin-tabs" role="tablist">
                <button
                  role="tab"
                  className="admin-tab-btn"
                  aria-selected={activeTab === "exercises"}
                  onClick={() => { setActiveTab("exercises"); setExpandedCardId(null); }}
                >
                  التمارين
                </button>
                <button
                  role="tab"
                  className="admin-tab-btn"
                  aria-selected={activeTab === "assessments"}
                  onClick={() => { setActiveTab("assessments"); setExpandedCardId(null); }}
                >
                  المقاييس والاختبارات
                </button>
              </div>
              <input
                type="search"
                className="admin-search-input"
                placeholder="ابحث باسم النشاط أو المشارك..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="admin-activity-grid">
              {filteredActivities.map(activity => (
                <article
                  key={activity.id}
                  className="admin-activity-card"
                  data-empty={activity.count === 0}
                >
                  <div className="admin-activity-header">
                    <h3 className="admin-activity-title">{activity.title}</h3>
                  </div>

                  <div className="admin-activity-stats">
                    <div className="admin-stat-item">
                      <span>إجمالي المشاركين</span>
                      <strong className="admin-stat-value">{activity.count}</strong>
                    </div>
                  </div>

                  <div className="admin-progress-wrap">
                    <div className="admin-progress-header">
                      <span>نسبة الإكمال</span>
                      <span>{activity.percent}%</span>
                    </div>
                    <div className="admin-progress-track">
                      <div
                        className="admin-progress-bar"
                        style={{ width: `${activity.percent}%` }}
                      />
                    </div>
                  </div>

                  <button
                    className="admin-details-btn"
                    aria-expanded={expandedCardId === activity.id}
                    onClick={() => setExpandedCardId(
                      expandedCardId === activity.id ? null : activity.id
                    )}
                    disabled={activity.count === 0}
                  >
                    {expandedCardId === activity.id ? "إخفاء التفاصيل" : "عرض التفاصيل"}
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: expandedCardId === activity.id ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </button>

                  {expandedCardId === activity.id && (
                    <div className="admin-accordion-content">
                      {activity.answers.map((answer, i) => (
                        <div
                          key={`${answer.email}-${i}`}
                          className="admin-participant-row"
                          onClick={() => setSelectedAnswer(answer)}
                        >
                          <div className="admin-participant-header">
                            <div>
                              <div className="admin-participant-name">{answer.name}</div>
                              <div className="admin-participant-date">{formatDate(answer.date)}</div>
                            </div>
                            {answer.score !== undefined && (
                              <div className="admin-participant-score">النتيجة: {answer.score}</div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </article>
              ))}
              
              {filteredActivities.length === 0 && (
                <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "40px", color: "var(--text-3)" }}>
                  لا توجد نتائج مطابقة للبحث.
                </div>
              )}
            </div>
          </section>

          {dashboard.leaderImpactRows.length > 0 && (
            <section className="admin-panel" style={{ marginTop: "32px" }}>
              <div className="admin-panel-head">
                <div>
                  <div className="section-kicker">تمرين التفكير القيادي</div>
                  <h2>قائد أثّر فيّ — إجابات المشاركين</h2>
                </div>
                <span
                  style={{
                    background: "var(--gold)",
                    color: "var(--navy)",
                    borderRadius: "20px",
                    padding: "4px 14px",
                    fontWeight: 700,
                    fontSize: "14px",
                  }}
                >
                  {dashboard.leaderImpactRows.length} مشارك
                </span>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
                  gap: "20px",
                  marginTop: "20px",
                }}
              >
                {dashboard.leaderImpactRows.map((row) => (
                  <article
                    key={row.email}
                    style={{
                      background: "var(--surface-2, #f8f9fb)",
                      border: "1px solid var(--line, #e5e7eb)",
                      borderRadius: "16px",
                      padding: "20px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "14px",
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    {/* Decorative accent */}
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        right: 0,
                        width: "4px",
                        height: "100%",
                        background: "var(--gold)",
                        borderRadius: "0 16px 16px 0",
                      }}
                    />

                    {/* Participant email */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        paddingBottom: "10px",
                        borderBottom: "1px solid var(--line, #e5e7eb)",
                      }}
                    >
                      <div
                        style={{
                          width: "36px",
                          height: "36px",
                          borderRadius: "50%",
                          background: "var(--navy)",
                          color: "#fff",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: 700,
                          fontSize: "16px",
                          flexShrink: 0,
                        }}
                      >
                        {row.email.charAt(0).toUpperCase()}
                      </div>
                      <span
                        style={{
                          fontSize: "13px",
                          color: "var(--text-3, #6b7280)",
                          wordBreak: "break-all",
                        }}
                      >
                        {row.email}
                      </span>
                    </div>

                    {/* Reason */}
                    {row.reason && (
                      <div>
                        <div
                          style={{
                            fontSize: "11px",
                            fontWeight: 700,
                            color: "var(--gold)",
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                            marginBottom: "6px",
                          }}
                        >
                          💡 لماذا اختار هذا القائد؟
                        </div>
                        <p
                          style={{
                            margin: 0,
                            fontSize: "14px",
                            lineHeight: 1.6,
                            color: "var(--text-1, #111)",
                            fontStyle: "italic",
                          }}
                        >
                          {row.reason}
                        </p>
                      </div>
                    )}

                    {/* Behavior 1 */}
                    {row.behavior1 && (
                      <div
                        style={{
                          background: "var(--blue-track, #eef2ff)",
                          borderRadius: "10px",
                          padding: "12px",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "11px",
                            fontWeight: 700,
                            color: "var(--navy)",
                            marginBottom: "4px",
                          }}
                        >
                          🔹 السلوك الأول
                        </div>
                        <p style={{ margin: 0, fontSize: "14px", lineHeight: 1.5 }}>
                          {row.behavior1}
                        </p>
                      </div>
                    )}

                    {/* Behavior 2 */}
                    {row.behavior2 && (
                      <div
                        style={{
                          background: "var(--blue-track, #eef2ff)",
                          borderRadius: "10px",
                          padding: "12px",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "11px",
                            fontWeight: 700,
                            color: "var(--navy)",
                            marginBottom: "4px",
                          }}
                        >
                          🔸 السلوك الثاني
                        </div>
                        <p style={{ margin: 0, fontSize: "14px", lineHeight: 1.5 }}>
                          {row.behavior2}
                        </p>
                      </div>
                    )}

                    {/* Date */}
                    <div
                      style={{
                        fontSize: "11px",
                        color: "var(--text-3, #9ca3af)",
                        marginTop: "auto",
                        paddingTop: "8px",
                        borderTop: "1px solid var(--line, #e5e7eb)",
                      }}
                    >
                      {formatDate(row.updated_at)}
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}

          <section className="admin-table-wrap">
            <h2>استبيان ما بعد الدورة التدريبية</h2>
            <table>
              <thead>
                <tr>
                  <th>المشارك</th>
                  <th>الاسم</th>
                  <th>المسمى أو الجهة</th>
                  <th>تقييم التجربة</th>
                  <th>فائدة المحتوى</th>
                  <th>أكثر جزء مفيد</th>
                  <th>ما سيطبقه</th>
                  <th>التحسين المقترح</th>
                  <th>الترشيح</th>
                  <th>الشهادة</th>
                  <th>الموافقة</th>
                  <th>آخر تحديث</th>
                </tr>
              </thead>
              <tbody>
                {dashboard.completionSurveyRows.map((row) => (
                  <tr key={`${row.participant_email}-${row.updated_at}`}>
                    <td>{row.participant_email}</td>
                    <td>{row.name || "-"}</td>
                    <td>{row.affiliation || "-"}</td>
                    <td>{row.experienceRating ?? "-"}</td>
                    <td>{row.usefulnessRating ?? "-"}</td>
                    <td>{row.mostUseful || "-"}</td>
                    <td>{row.application || "-"}</td>
                    <td>{row.improvement || "-"}</td>
                    <td>{row.recommendationScore ?? "-"}</td>
                    <td>{row.testimonial || "-"}</td>
                    <td>{row.testimonialConsent || "-"}</td>
                    <td>{formatDate(row.updated_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          {selectedAnswer && (
            <div className="admin-modal-overlay" onClick={() => setSelectedAnswer(null)}>
              <div className="admin-modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="admin-modal-header">
                  <h3>تفاصيل إجابة المشارك</h3>
                  <button className="admin-modal-close" onClick={() => setSelectedAnswer(null)}>
                    &times;
                  </button>
                </div>
                <div style={{ maxHeight: '70vh', overflowY: 'auto', padding: '4px' }}>
                  <ParticipantDetailCard
                    name={selectedAnswer.name}
                    email={selectedAnswer.email}
                    date={selectedAnswer.date}
                    parsedData={selectedAnswer.parsedData}
                  />
                </div>
              </div>
            </div>
          )}

        </>
      ) : null}
    </div>
  );
}
