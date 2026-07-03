CREATE TABLE `experience_slides` (
	`id` int AUTO_INCREMENT NOT NULL,
	`step` varchar(8) NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`imageUrl` text,
	`imageKey` text,
	`sortOrder` int NOT NULL DEFAULT 0,
	`active` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `experience_slides_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `site_popups` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`badge` varchar(255),
	`title` varchar(512) NOT NULL,
	`titleHighlight` varchar(255),
	`subtitle` varchar(255),
	`body` text,
	`items` json,
	`ctaLabel` varchar(255) NOT NULL DEFAULT 'Ver la colección',
	`ctaUrl` varchar(512) NOT NULL DEFAULT '/coleccion',
	`dismissLabel` varchar(255) NOT NULL DEFAULT 'No, gracias',
	`footerNote` varchar(512),
	`active` boolean NOT NULL DEFAULT false,
	`delayMs` int NOT NULL DEFAULT 2000,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `site_popups_id` PRIMARY KEY(`id`)
);
