export const separator = ":;,;:";

export const profiles = [
	{
		slug: "webdockpico4-2024",
		name: "SSD Pico4",
		ram: 768,
		disk: 9537,
		cpu: { cores: 0, threads: 1 },
		price: { amount: 95, currency: "USD" },
	},
	{
		slug: "webdockepyc-nano4",
		name: "NVMe Epyc® Nano4",
		ram: 1907,
		disk: 14305,
		cpu: { cores: 0, threads: 1 },
		price: { amount: 430, currency: "USD" },
	},
	{
		slug: "webdocknano4-2023",
		name: "NVMe Nano4",
		ram: 1907,
		disk: 14305,
		cpu: { cores: 0, threads: 1 },
		price: { amount: 215, currency: "USD" },
	},
	{
		slug: "webdockepyc-bit",
		name: "NVMe Epyc® Bit",
		ram: 9537,
		disk: 95367,
		cpu: { cores: 5, threads: 10 },
		price: { amount: 3200, currency: "USD" },
	},
	{
		slug: "webdockbit-2024",
		name: "NVMe Bit",
		ram: 9537,
		disk: 95367,
		cpu: { cores: 5, threads: 10 },
		price: { amount: 1600, currency: "USD" },
	},
	{
		slug: "webdockepyc-premium",
		name: "NVMe Epyc® Premium",
		ram: 61035,
		disk: 476837,
		cpu: { cores: 15, threads: 30 },
		price: { amount: 13640, currency: "USD" },
	},
	{
		slug: "webdockpremium-2024",
		name: "NVMe Premium",
		ram: 61035,
		disk: 476837,
		cpu: { cores: 15, threads: 30 },
		price: { amount: 6820, currency: "USD" },
	},
];

export const images = [
	{
		slug: "krellide:webdock-noble-lemp",
		name: "Noble LEMP",
		webServer: "Nginx",
		phpVersion: "8.3",
	},
	{
		slug: "krellide:webdock-noble-lamp",
		name: "Noble LAMP",
		webServer: "Apache",
		phpVersion: "8.3",
	},
	{
		slug: "webdock-ubuntu-noble-cloud",
		name: "Ubuntu Noble 24.04",
		webServer: null,
		phpVersion: null,
	},
	{
		slug: "webdock-ubuntu-jammy-cloud",
		name: "Ubuntu Jammy 22.04",
		webServer: null,
		phpVersion: null,
	},
	{
		slug: "webdock-ubuntu-focal-cloud",
		name: "Ubuntu Focal 20.04",
		webServer: null,
		phpVersion: null,
	},
	{
		slug: "webdock-almalinux-9-cloud",
		name: "AlmaLinux 9",
		webServer: null,
		phpVersion: null,
	},
	{
		slug: "webdock-centos-9-cloud",
		name: "CentOS 9",
		webServer: null,
		phpVersion: null,
	},
	{
		slug: "webdock-debian-bookworm-cloud",
		name: "Debian 12 Bookworm",
		webServer: null,
		phpVersion: null,
	},
	{
		slug: "webdock-ubuntu-noble-gnome-desktop",
		name: "Ubuntu Gnome Desktop",
		webServer: null,
		phpVersion: null,
	},
	{
		slug: "webdock-ubuntu-noble-kdeplasma-desktop",
		name: "Ubuntu KDE Plasma Desktop",
		webServer: null,
		phpVersion: null,
	},
];
