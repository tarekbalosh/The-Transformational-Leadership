CREATE TABLE `participant_profiles` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`participant_email` text NOT NULL,
	`name` text NOT NULL,
	`professional_background` text NOT NULL,
	`ai_interests` text NOT NULL,
	`course_goals` text NOT NULL,
	`fun_fact` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `participant_profiles_email_idx` ON `participant_profiles` (`participant_email`);