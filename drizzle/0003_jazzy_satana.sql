CREATE TABLE `payment_methods` (
	`id` int AUTO_INCREMENT NOT NULL,
	`key` varchar(64) NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`type` enum('redsys_card','redsys_bizum','transfer','paypal','cash_on_delivery','other') NOT NULL,
	`enabled` boolean NOT NULL DEFAULT false,
	`config` json,
	`position` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `payment_methods_id` PRIMARY KEY(`id`),
	CONSTRAINT `payment_methods_key_unique` UNIQUE(`key`)
);
