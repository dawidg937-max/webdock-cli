import { infoCommand } from "./info/info.ts";
import { Command } from "@cliffy/command";

export const accountCommand = new Command()
	.name("account")
	.description("Manage account information")
	.default("help")
	.command(
		"help",
		new Command().action(() => {
			accountCommand.showHelp();
			Deno.exit(1);
		}),
	).hidden()
	.command("info", infoCommand);
