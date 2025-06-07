import { createCommand } from "./create/create.ts";
import { deleteCommand } from "./delete/delete.ts";
import { getCommand } from "./get/get.ts";
import { listCommand } from "./list/list.ts";
import { Command } from "@cliffy/command";
export const hooksCommand = new Command()
	.name("hooks")
	.description("Manage Hooks")
	.default("help")
	.command(
		"help",
		new Command().action(() => {
			hooksCommand.showHelp();
			Deno.exit(1);
		}),
	).hidden()
	.description("Manage event hooks and callbacks")
	.command("list", listCommand)
	.command("create", createCommand)
	.command("get", getCommand)
	.command("delete", deleteCommand);
