CREATE TABLE `fieldIrrigation` (
	`id` text PRIMARY KEY NOT NULL,
	`fieldId` text NOT NULL,
	`duration` integer NOT NULL,
	`date` integer NOT NULL,
	`createdOn` text NOT NULL,
	`lastUpdate` text NOT NULL
);
