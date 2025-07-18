import { listCommand } from "./list/list.ts";
import { Command } from "@cliffy/command";
// Profiles command module
export const profilesCommand = new Command()
	.name("profiles")
	.description("Manage Profiles")
	.default("help")
	.command(
		"help",
		new Command().action(() => {
			profilesCommand.showHelp();
			Deno.exit(1);
		}),
	).hidden()
	.description("Manage server profiles")
	.command("list", listCommand);
