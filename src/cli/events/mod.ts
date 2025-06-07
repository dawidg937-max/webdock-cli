import { listCommand } from "./list/list.ts";
import { Command } from "@cliffy/command";
// Events command module
export const eventsCommand = new Command()
	.name("events")
	.description("Manage Events")
	.default("help")
	.command(
		"help",
		new Command().action(() => {
			eventsCommand.showHelp();
			Deno.exit(1);
		}),
	).hidden()
	.description("Manage account events")
	.command("list", listCommand);
