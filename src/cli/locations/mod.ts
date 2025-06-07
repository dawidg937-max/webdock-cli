import { listCommand } from "./list/list.ts";
import { Command } from "@cliffy/command";
// Locations command module
export const locationsCommand = new Command()
	.name("locations")
	.description("Manage Locations")
	.default("help")
	.command(
		"help",
		new Command().action(() => {
			locationsCommand.showHelp();
			Deno.exit(1);
		}),
	).hidden()
	.description("Manage server locations")
	.command("list", listCommand);
