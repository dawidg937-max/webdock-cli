import { client } from "../../main.ts";
import { Command } from "@cliffy/command";

export const websshTokenCommand = new Command()
	.name("webssh-token")
	.arguments("<serverSlug:string> <username:string>")
	.description("Generate a WebSSH token for a shell user")
	.option(
		"--json",
		"Display the results in a json format instead of a Table",
	).option("-t, --token <token:string>", "API token for authentication")
	.action(async (options, serverSlug, username) => {
		const response = await client.shellUsers.websshToken({
			serverSlug,
			username,
		});

		if (!response.success) {
			console.error(response.error);
			Deno.exit(0);
		}

		if (options.json) {
			response.success;
		}
	});
