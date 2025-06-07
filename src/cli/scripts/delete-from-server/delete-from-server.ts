import { client } from "../../../main.ts";
import { Command } from "@cliffy/command";

export const serverScriptsDeleteCommand = new Command()
	.description("Delete a script from a server")
	.arguments("<serverSlug:string> <scriptId:number>")
	.option(
		"-t, --token <token:string>",
		"API token used for authentication (required for secure endpoints)",
	)
	.action(async (options, serverSlug: string, scriptId: number) => {
		const response = await client.scripts.deleteScriptFromServer({
			scriptId,
			serverSlug,
			token: options.token,
		});

		if (!response.success) {
			if (response.code == 404) {
				console.error("Error 404 server or script not found!");
			}

			Deno.exit(1);
		}

		console.log("Script deleted successfully");
	});
