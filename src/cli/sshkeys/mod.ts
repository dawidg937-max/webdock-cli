import { createCommand } from "./create/create.ts";
import { deleteCommand } from "./delete/delete.ts";
import { listCommand } from "./list/list.ts";
import { Command } from "@cliffy/command";
// SSH keys command module
export const sshkeysCommand = new Command()
	.name("sshkeys")
	.description("Manage SSH keys")
	.default("help")
	.command(
		"help",
		new Command().action(() => {
			sshkeysCommand.showHelp();
			Deno.exit(1);
		}),
	).hidden()
	.command("list", listCommand)
	.command("create", createCommand)
	.command("delete", deleteCommand);
