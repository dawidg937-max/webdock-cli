import { client } from "../../../main.ts";
import { colors } from "@cliffy/ansi/colors";
import { Command } from "@cliffy/command";

export const reinstallCommand = new Command()
	.description("Reinstall a server")
	.arguments("<serverSlug:string> <imageSlug:string>")
	.option("-t, --token <token:string>", "API token for authentication")
	.option(
		"--wait",
		"Wait until the server is fully up and running before exiting",
	)
	.action(async (options, serverSlug, imageSlug) => {
		const response = await client.servers.reinstall({
			imageSlug,
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
					"Your server has been successfully reinstalled!",
				),
			);

			Deno.exit(0);
		}

		console.log(
			colors.bgGreen.bold.underline.italic(
				"Server reinstall initiated. Please check its status in a couple of minutes.",
			),
		);
	});
