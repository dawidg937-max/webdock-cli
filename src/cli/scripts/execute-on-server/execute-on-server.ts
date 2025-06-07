import { client } from "../../../main.ts";
import { colors } from "@cliffy/ansi/colors";
import { Command } from "@cliffy/command";

export const serverScriptsExecuteCommand = new Command()
	.description("Execute a script on a server")
	.arguments("<serverSlug:string> <scriptId:number>")
	.option(
		"-t, --token <token:string>",
		"API token used for authentication (required for secure endpoints)",
	)
	.option(
		"--wait",
		"Wait until the operation has completed before exiting",
	)
	.action(async (options, serverSlug: string, scriptID: number) => {
		const response = await client.scripts.executeOnServer({
			scriptID,
			serverSlug,
			token: options.token,
		});

		if (!response.success) {
			console.error(response.error);
			Deno.exit(1);
		}

		if (options.wait) {
			await client.waitForEvent(response.data.headers["x-callback-id"]);
			console.log(colors.bgGreen("script Executed successfully"));

			Deno.exit(0);
		}
		console.log(colors.bgGreen("script Execution initiated!"));

		Deno.exit(0);
	});
