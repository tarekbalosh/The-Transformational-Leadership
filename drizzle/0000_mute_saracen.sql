CREATE TABLE `assessment_answers` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`participant_email` text NOT NULL,
	`assessment_id` text NOT NULL,
	`payload` text NOT NULL,
	`score` real,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `assessment_answers_participant_assessment_idx` ON `assessment_answers` (`participant_email`,`assessment_id`);--> statement-breakpoint
CREATE TABLE `assessments` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`type` text NOT NULL,
	`status` text NOT NULL,
	`sort_order` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `exercise_answers` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`participant_email` text NOT NULL,
	`exercise_id` text NOT NULL,
	`answer` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `exercise_answers_participant_exercise_idx` ON `exercise_answers` (`participant_email`,`exercise_id`);--> statement-breakpoint
CREATE TABLE `exercises` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`status` text NOT NULL,
	`sort_order` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `participants` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`email` text NOT NULL,
	`name` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `participants_email_idx` ON `participants` (`email`);--> statement-breakpoint
CREATE TABLE `progress` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`participant_email` text NOT NULL,
	`item_type` text NOT NULL,
	`item_id` text NOT NULL,
	`status` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `progress_participant_item_idx` ON `progress` (`participant_email`,`item_type`,`item_id`);