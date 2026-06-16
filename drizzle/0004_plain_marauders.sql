ALTER TABLE `orders` ADD `shippingAddress` text;--> statement-breakpoint
ALTER TABLE `orders` ADD `shippingCity` varchar(255);--> statement-breakpoint
ALTER TABLE `orders` ADD `shippingProvince` varchar(128);--> statement-breakpoint
ALTER TABLE `orders` ADD `shippingPostalCode` varchar(10);--> statement-breakpoint
ALTER TABLE `orders` ADD `paymentMethod` varchar(32);