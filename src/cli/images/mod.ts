import { listCommand } from "./list/list.ts";
import { Command } from "@cliffy/command";
// Images command module
export const imagesCommand = new Command()
	.name("images")
	.description("Manage Images").default("help")
	.command(
		"help",
		new Command().action(() => {
			imagesCommand.showHelp();
			Deno.exit(1);
		}),
	).hidden()
	.description("Manage server images")
	.command("list", listCommand);
