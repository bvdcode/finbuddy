CREATE TABLE `budget_plan` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`profile_id` integer NOT NULL,
	`import_batch_id` integer NOT NULL,
	`category_key` text NOT NULL,
	`category_label` text NOT NULL,
	`planned_minor` integer NOT NULL,
	`source_sheet` text NOT NULL,
	`source_row` integer NOT NULL,
	`source_cell` text,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`profile_id`) REFERENCES `profiles`(`id`) ON UPDATE restrict ON DELETE restrict,
	FOREIGN KEY (`import_batch_id`) REFERENCES `import_batches`(`id`) ON UPDATE restrict ON DELETE restrict,
	CONSTRAINT "budget_plan_amount_check" CHECK("budget_plan"."planned_minor" >= 0),
	CONSTRAINT "budget_plan_source_row_check" CHECK("budget_plan"."source_row" > 0)
);
--> statement-breakpoint
CREATE UNIQUE INDEX `budget_plan_profile_category_unique` ON `budget_plan` (`profile_id`,`category_key`);--> statement-breakpoint
CREATE INDEX `budget_plan_import_batch_index` ON `budget_plan` (`import_batch_id`);--> statement-breakpoint
CREATE TABLE `import_batches` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`profile_id` integer NOT NULL,
	`file_hash` text NOT NULL,
	`file_name` text NOT NULL,
	`file_size_bytes` integer NOT NULL,
	`file_last_modified` integer NOT NULL,
	`currency` text NOT NULL,
	`imported_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`profile_id`) REFERENCES `profiles`(`id`) ON UPDATE restrict ON DELETE restrict,
	CONSTRAINT "import_batches_file_size_check" CHECK("import_batches"."file_size_bytes" >= 0),
	CONSTRAINT "import_batches_last_modified_check" CHECK("import_batches"."file_last_modified" >= 0),
	CONSTRAINT "import_batches_currency_check" CHECK("import_batches"."currency" = 'PLN')
);
--> statement-breakpoint
CREATE UNIQUE INDEX `import_batches_profile_file_hash_unique` ON `import_batches` (`profile_id`,`file_hash`);--> statement-breakpoint
CREATE INDEX `import_batches_profile_imported_at_index` ON `import_batches` (`profile_id`,`imported_at`);--> statement-breakpoint
CREATE TABLE `monthly_expenses` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`profile_id` integer NOT NULL,
	`import_batch_id` integer NOT NULL,
	`period_month` text NOT NULL,
	`source_date` text NOT NULL,
	`category_key` text NOT NULL,
	`category_label` text NOT NULL,
	`amount_minor` integer NOT NULL,
	`source_sheet` text NOT NULL,
	`source_row` integer NOT NULL,
	`source_cell` text,
	`source_formula` text,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`profile_id`) REFERENCES `profiles`(`id`) ON UPDATE restrict ON DELETE restrict,
	FOREIGN KEY (`import_batch_id`) REFERENCES `import_batches`(`id`) ON UPDATE restrict ON DELETE restrict,
	CONSTRAINT "monthly_expenses_amount_check" CHECK("monthly_expenses"."amount_minor" >= 0),
	CONSTRAINT "monthly_expenses_source_row_check" CHECK("monthly_expenses"."source_row" > 0)
);
--> statement-breakpoint
CREATE UNIQUE INDEX `monthly_expenses_profile_period_category_unique` ON `monthly_expenses` (`profile_id`,`period_month`,`category_key`);--> statement-breakpoint
CREATE INDEX `monthly_expenses_import_batch_index` ON `monthly_expenses` (`import_batch_id`);--> statement-breakpoint
CREATE TABLE `monthly_incomes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`profile_id` integer NOT NULL,
	`import_batch_id` integer NOT NULL,
	`period_month` text NOT NULL,
	`source_date` text NOT NULL,
	`amount_minor` integer NOT NULL,
	`source_sheet` text NOT NULL,
	`source_row` integer NOT NULL,
	`source_cell` text,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`profile_id`) REFERENCES `profiles`(`id`) ON UPDATE restrict ON DELETE restrict,
	FOREIGN KEY (`import_batch_id`) REFERENCES `import_batches`(`id`) ON UPDATE restrict ON DELETE restrict,
	CONSTRAINT "monthly_incomes_amount_check" CHECK("monthly_incomes"."amount_minor" >= 0),
	CONSTRAINT "monthly_incomes_source_row_check" CHECK("monthly_incomes"."source_row" > 0)
);
--> statement-breakpoint
CREATE UNIQUE INDEX `monthly_incomes_profile_period_unique` ON `monthly_incomes` (`profile_id`,`period_month`);--> statement-breakpoint
CREATE INDEX `monthly_incomes_import_batch_index` ON `monthly_incomes` (`import_batch_id`);--> statement-breakpoint
CREATE TABLE `profile_sessions` (
	`token_hash` text PRIMARY KEY NOT NULL,
	`profile_id` integer NOT NULL,
	`created_at` text NOT NULL,
	`expires_at` text NOT NULL,
	FOREIGN KEY (`profile_id`) REFERENCES `profiles`(`id`) ON UPDATE restrict ON DELETE restrict,
	CONSTRAINT "profile_sessions_expiry_check" CHECK("profile_sessions"."expires_at" > "profile_sessions"."created_at")
);
--> statement-breakpoint
CREATE INDEX `profile_sessions_profile_index` ON `profile_sessions` (`profile_id`);--> statement-breakpoint
CREATE INDEX `profile_sessions_expiry_index` ON `profile_sessions` (`expires_at`);--> statement-breakpoint
CREATE TABLE `profiles` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`first_name` text NOT NULL,
	`last_name` text NOT NULL,
	`normalized_name` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "profiles_first_name_check" CHECK(length("profiles"."first_name") BETWEEN 1 AND 80),
	CONSTRAINT "profiles_last_name_check" CHECK(length("profiles"."last_name") BETWEEN 1 AND 80)
);
--> statement-breakpoint
CREATE UNIQUE INDEX `profiles_normalized_name_unique` ON `profiles` (`normalized_name`);