CREATE TABLE `fieldsMapInfo` (
	`id` text PRIMARY KEY NOT NULL,
	`defaultOverlayImgKey` text,
	`defaultOverlayImgPath` text,
	`nitrogenOverlayImgKey` text,
	`nitrogenOverlayImgPath` text,
	`anomalyOverlayImgKey` text,
	`anomalyOverlayImgPath` text,
	`growthOverlayImgKey` text,
	`growthOverlayImgPath` text,
	`irrigationOverlayImgKey` text,
	`irrigationOverlayImgPath` text
);
--> statement-breakpoint
CREATE TABLE `fieldsDetail` (
	`id` text PRIMARY KEY NOT NULL,
	`cropType` text,
	`cropAge` text,
	`lastInfoUpdate` text,
	`lastCropUpdate` text,
	`lastIrrigationUpdate` text,
	`lastScoutUpdate` text,
	`growthPercentage` text,
	`nutrientsPercentage` text,
	`stressPercentage` text,
	`growthTrend` numeric,
	`nutrientsTrend` numeric,
	`stressTrend` numeric
);
