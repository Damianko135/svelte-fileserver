CREATE TABLE `modpacks` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(255),
	`download_count` int DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `modpacks_id` PRIMARY KEY(`id`)
);
