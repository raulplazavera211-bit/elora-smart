ALTER TABLE `orders` ADD `redsysOrderId` varchar(32);--> statement-breakpoint
ALTER TABLE `orders` ADD `paymentStatus` enum('unpaid','pending_payment','paid','failed') DEFAULT 'unpaid' NOT NULL;