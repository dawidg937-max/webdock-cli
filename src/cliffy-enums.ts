import { EnumType } from "@cliffy/command";

const ProfileSlug = [
	"webdockpico4-2024",
	"webdockepyc-nano4",
	"webdocknano4-2023",
	"webdockepyc-bit",
	"webdockbit-2024",
	"webdockepyc-premium",
	"webdockpremium-2024",
];

export const profileEnum = new EnumType(ProfileSlug);

export const ImageSlug = [
	"krellide:webdock-noble-lemp",
	"krellide:webdock-noble-lamp",
	"webdock-ubuntu-noble-cloud",
	"webdock-ubuntu-jammy-cloud",
	"webdock-ubuntu-focal-cloud",
	"webdock-almalinux-9-cloud",
	"webdock-centos-9-cloud",
	"webdock-debian-bookworm-cloud",
	"webdock-ubuntu-noble-gnome-desktop",
	"webdock-ubuntu-noble-kdeplasma-desktop",
];

export const imageEnum = new EnumType(ImageSlug);
