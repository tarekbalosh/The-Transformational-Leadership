import { integer, real, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

export const participants = sqliteTable(
  "participants",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    email: text("email").notNull(),
    name: text("name"),
    createdAt: text("created_at").notNull(),
    updatedAt: text("updated_at").notNull(),
  },
  (table) => [uniqueIndex("participants_email_idx").on(table.email)]
);

export const exercises = sqliteTable("exercises", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  status: text("status").notNull(),
  sortOrder: integer("sort_order").notNull(),
});

export const exerciseAnswers = sqliteTable(
  "exercise_answers",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    participantEmail: text("participant_email").notNull(),
    exerciseId: text("exercise_id").notNull(),
    answer: text("answer").notNull(),
    createdAt: text("created_at").notNull(),
    updatedAt: text("updated_at").notNull(),
  },
  (table) => [
    uniqueIndex("exercise_answers_participant_exercise_idx").on(
      table.participantEmail,
      table.exerciseId
    ),
  ]
);

export const assessments = sqliteTable("assessments", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  type: text("type").notNull(),
  status: text("status").notNull(),
  sortOrder: integer("sort_order").notNull(),
});

export const assessmentAnswers = sqliteTable(
  "assessment_answers",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    participantEmail: text("participant_email").notNull(),
    assessmentId: text("assessment_id").notNull(),
    payload: text("payload").notNull(),
    score: real("score"),
    createdAt: text("created_at").notNull(),
    updatedAt: text("updated_at").notNull(),
  },
  (table) => [
    uniqueIndex("assessment_answers_participant_assessment_idx").on(
      table.participantEmail,
      table.assessmentId
    ),
  ]
);

export const progress = sqliteTable(
  "progress",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    participantEmail: text("participant_email").notNull(),
    itemType: text("item_type").notNull(),
    itemId: text("item_id").notNull(),
    status: text("status").notNull(),
    updatedAt: text("updated_at").notNull(),
  },
  (table) => [
    uniqueIndex("progress_participant_item_idx").on(
      table.participantEmail,
      table.itemType,
      table.itemId
    ),
  ]
);

export const participantProfiles = sqliteTable(
  "participant_profiles",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    participantEmail: text("participant_email").notNull(),
    name: text("name").notNull(),
    professionalBackground: text("professional_background").notNull(),
    aiInterests: text("ai_interests").notNull(),
    courseGoals: text("course_goals").notNull(),
    funFact: text("fun_fact").notNull(),
    createdAt: text("created_at").notNull(),
    updatedAt: text("updated_at").notNull(),
  },
  (table) => [
    uniqueIndex("participant_profiles_email_idx").on(table.participantEmail),
  ]
);
