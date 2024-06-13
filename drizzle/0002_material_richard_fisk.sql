CREATE TABLE `fieldsScoutPoints` (
	`id` text PRIMARY KEY NOT NULL,
	`fieldId` text NOT NULL,
	`isDirty` integer DEFAULT false NOT NULL,
	`isNew` integer DEFAULT false,
	`date` integer NOT NULL,
	`location` text NOT NULL,
	`severity` text NOT NULL,
	`category` text NOT NULL,
	`notes` text,
	`reply` text,
	`lastUpdate` text NOT NULL,
	`photosKeys` text,
	`voiceNoteKey` text,
	`videoKey` text,
	`photosFiles` text,
	`voiceNoteFile` text,
	`voiceReplyFile` text
);
