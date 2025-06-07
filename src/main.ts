#!/usr/bin/env -S  deno  run --allow-env --allow-read --allow-write --allow-net --allow-run  

import { imageEnum, profileEnum } from "./cliffy-enums.ts";
import { Command } from "@cliffy/command";
import { Webdock } from "./webdock/webdock.ts";
import { accountCommand } from "./cli/account/mod.ts";
import { eventsCommand } from "./cli/events/mod.ts";
import { hooksCommand } from "./cli/hooks/mod.ts";
import { imagesCommand } from "./cli/images/mod.ts";
import { initCommand } from "./cli/init.ts";
import { locationsCommand } from "./cli/locations/mod.ts";
import { profilesCommand } from "./cli/profiles/mod.ts";
import { scriptsCommand } from "./cli/scripts/mod.ts";
import { serversCommand } from "./cli/servers/mod.ts";
import { shellusersCommand } from "./cli/shellusers/mod.ts";
import { snapshotsCommand } from "./cli/snapshots/mod.ts";
import { sshkeysCommand } from "./cli/sshkeys/mod.ts";
import { main } from "./interactive/index.ts";
import { eventTypeEnum } from "./cli/event-types.ts";

export const client = new Webdock(true);

// Create the main CLI command
export const cli = new Command()
	.name("webdock")
	.version("1.0.0")
	.globalType("event-type", eventTypeEnum)
	.globalType("profile", profileEnum)
	.globalType("image", imageEnum)
	.description(
		`Webdock CLI - A command-line interface for the Webdock API\nRun Webdock CLI without arguments to enter interactive mode`,
	)
	.default("it")
	.command(
		"help",
		new Command().action(() => {
			cli.showHelp();
			Deno.exit(1);
		}),
	).hidden()
	.command("it", new Command().action(() => main())).description(
		"Enter the interactive mode",
	).hidden()
	.command("init", initCommand)
	.command("servers", serversCommand)
	.command("locations", locationsCommand)
	.command("images", imagesCommand)
	.command("profiles", profilesCommand)
	.command("scripts", scriptsCommand)
	.command("snapshots", snapshotsCommand)
	.command("sshkeys", sshkeysCommand)
	.command("events", eventsCommand)
	.command("account", accountCommand)
	.command("shellusers", shellusersCommand)
	.command("hooks", hooksCommand);

await cli.parse(Deno.args);
