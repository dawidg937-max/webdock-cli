import { client } from "../../../main.ts";
import { colors } from "@cliffy/ansi/colors";
import { Command } from "@cliffy/command";

export const resizeCommand = new Command()
	.description("Resize a server (change profile)")
	.arguments("<serverSlug:string> <profileSlug:profile>")
	.option("-t, --token <token:string>", "API token for authentication")
	.option("--wait", "Wait until the action is complete")
	.action(async (options, serverSlug: string, profileSlug) => {
		const response = await client.servers.resize(
			{
				profileSlug: String(profileSlug),
				serverSlug,
				token: options.token,
			},
		);
		if (!response.success) {
			console.error(response.error);
			Deno.exit(1);
		}

		if (options.wait) {
			await client.waitForEvent(response.data.headers["x-callback-id"]);

			console.log(
				colors.bgGreen.white.bold(`\n ⚡️ SERVER ACTION: `) +
					colors.bgWhite.green.bold.italic(` Resized successfully! `) +
					"\n",
			);
			Deno.exit(0);
		}

		console.log(
			colors.bgWhite.cyan(
				` Server resize process started!, check again in a minute`,
			),
		);
	});
