import { createCommand } from "./create/create.ts";
import { deleteCommand } from "./delete/delete.ts";
import { listCommand } from "./list/list.ts";
import { restoreCommand } from "./restore/restore.ts";
import { Command } from "@cliffy/command";
// Snapshots command module
export const snapshotsCommand = new Command()
	.name("snapshots")
	.description("Manage Snapshots")
	.default("help")
	.command(
		"help",
		new Command().action(() => {
			snapshotsCommand.showHelp();
			Deno.exit(1);
		}),
	).hidden()
	.description("Manage server snapshots")
	.command("list", listCommand)
	.command("create", createCommand)
	.command("delete", deleteCommand)
	.command("restore", restoreCommand);
