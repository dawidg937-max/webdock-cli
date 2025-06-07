import { serverScriptsCreateCommand } from "./create-on-server/create-on-server.ts";
import { createCommand } from "./create/create.ts";
import { serverScriptsDeleteCommand } from "./delete-from-server/delete-from-server.ts";
import { deleteCommand } from "./delete/delete.ts";
import { serverScriptsExecuteCommand } from "./execute-on-server/execute-on-server.ts";
import { getCommand } from "./get/get.ts";
import { serverScriptsListCommand } from "./list-on-server/list-on-server.ts";
import { listCommand } from "./list/list.ts";
import { updateCommand } from "./update/update.ts";
import { Command } from "@cliffy/command";
// Scripts command module
export const scriptsCommand = new Command()
	.name("scripts")
	.description("Manage Scripts")
	.default("help")
	.command(
		"help",
		new Command().action(() => {
			scriptsCommand.showHelp();
			Deno.exit(1);
		}),
	).hidden()
	.description("Manage server scripts")
	.command("list", listCommand)
	.command("create", createCommand)
	.command("update", updateCommand)
	.command("delete", deleteCommand)
	.command("get", getCommand)
	.command("server-list", serverScriptsListCommand)
	.command("server-create", serverScriptsCreateCommand)
	.command("server-delete", serverScriptsDeleteCommand)
	.command("server-execute", serverScriptsExecuteCommand);
