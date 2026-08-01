"use client";

import { useMemo, useState } from "react";

export type ProfileCard = {
  participant_email: string;
  name: string;
  country?: string | null;
  professional_background: string;
  ai_interests: string;
  ai_model?: string | null;
  course_goals: string;
  fun_fact: string;
  updated_at: string;
};

type Props = {
  profiles: ProfileCard[];
};

const filters = [
  { id: "all", label: "الكل" },
  { id: "country", label: "البلد" },
  { id: "professional_background", label: "الخلفية" },
  { id: "course_goals", label: "الأهداف" },
] as const;

type FilterId = (typeof filters)[number]["id"];

export function ProfileBoard({ profiles }: Props) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<FilterId>("all");

  const filteredProfiles = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    if (!normalized) {
      return profiles;
    }

    return profiles.filter((profile) => {
      const searchable =
        filter === "all"
          ? [
              profile.name,
              profile.country ?? "",
              profile.professional_background,
              profile.course_goals,
              profile.fun_fact,
            ].join(" ")
          : String(profile[filter]);

      return searchable.toLowerCase().includes(normalized);
    });
  }, [filter, profiles, query]);

  return (
    <section className="intro-board">
      <div className="intro-toolbar">
        <label>
          البحث في بطاقات المشاركين
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="ابحث بالاسم، البلد، الخلفية، أو الأهداف..."
          />
        </label>
        <div className="intro-filter" aria-label="تصفية النتائج">
          {filters.map((item) => (
            <button
              key={item.id}
              type="button"
              className={filter === item.id ? "active" : ""}
              onClick={() => setFilter(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="intro-count">
        {filteredProfiles.length} بطاقة تعارف ظاهرة من أصل {profiles.length}
      </div>

      {filteredProfiles.length ? (
        <div className="intro-card-grid">
          {filteredProfiles.map((profile) => (
            <article className="intro-profile-card" key={profile.participant_email}>
              <div className="profile-card-head">
                <span>{profile.name.slice(0, 1)}</span>
                <div>
                  <h2>{profile.name}</h2>
                  <p>
                    {[profile.country, profile.professional_background]
                      .filter(Boolean)
                      .join(" | ")}
                  </p>
                </div>
              </div>
              <dl>
                <div>
                  <dt>يحضر من</dt>
                  <dd>{profile.country || "لم يحدد"}</dd>
                </div>

                <div>
                  <dt>أهدافه من الدورة</dt>
                  <dd>{profile.course_goals}</dd>
                </div>
                <div>
                  <dt>حقيقة ممتعة</dt>
                  <dd>{profile.fun_fact}</dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
      ) : (
        <div className="empty-board">
          لا توجد بطاقات مطابقة حالياً. جرّب عبارة بحث أخرى أو أزل التصفية.
        </div>
      )}
    </section>
  );
}
