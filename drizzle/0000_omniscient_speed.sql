CREATE TABLE `fields` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`farmId` text,
	`location` text NOT NULL,
	`position` text NOT NULL,
	`bounds` text NOT NULL
);
