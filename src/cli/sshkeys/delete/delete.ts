import { client } from "../../../main.ts";
import { colors } from "@cliffy/ansi/colors";
import { Command } from "@cliffy/command";

export const deleteCommand = new Command()
	.description("Delete an SSH key")
	.arguments("<id:number>")
	.option("-t, --token <token:string>", "API token for authentication")
	.action(async (options, id) => {
		const response = await client.sshkeys.delete({ id, token: options.token });

		if (!response.success) {
			console.error(response.error);
			Deno.exit(1);
		}

		console.log(colors.bgGreen("SSH key deleted successfully"));
	});
