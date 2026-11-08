CREATE TABLE `kitchen_meta` (
	`owner` text PRIMARY KEY NOT NULL,
	`revision` integer NOT NULL,
	CONSTRAINT "revision_positive" CHECK("kitchen_meta"."revision" > 0)
);
--> statement-breakpoint
CREATE TABLE `kitchen_operations` (
	`owner` text NOT NULL,
	`id` text NOT NULL,
	`fingerprint` text NOT NULL,
	`result` text NOT NULL,
	`created_at` text NOT NULL,
	PRIMARY KEY(`owner`, `id`)
);
--> statement-breakpoint
CREATE TABLE `kitchen_records` (
	`owner` text NOT NULL,
	`id` text NOT NULL,
	`kind` text NOT NULL,
	`data` text NOT NULL,
	`updated_at` text NOT NULL,
	PRIMARY KEY(`owner`, `id`)
);
