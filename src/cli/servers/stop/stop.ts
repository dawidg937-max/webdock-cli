import { client } from "../../../main.ts";

import { colors } from "@cliffy/ansi/colors";
import { Command } from "@cliffy/command";

export const stopCommand = new Command()
	.description("Start a server")
	.arguments("<serverSlug:string>")
	.option("-t, --token <token:string>", "API token for authentication")
	.option(
		"--wait",
		"Wait until the server is fully up and running before exiting",
	).action(async (options, serverSlug) => {
		const response = await client.servers.stop({
			serverSlug,
			token: options.token,
		});

		if (!response.success) {
			console.error(response.error);
			Deno.exit(1);
		}

		if (options.wait) {
			await client.waitForEvent(response.data.headers["x-callback-id"]);

			console.log(
				colors.bgGreen.bold.underline.italic(
					"Your server has been successfully shutdown!",
				),
			);

			Deno.exit(0);
		}

		console.log(
			colors.bgGreen.bold.underline.italic(
				"Server shutdown initiated. Please check its status in a couple of minutes.",
			),
		);
		Deno.exit(0);
	});
