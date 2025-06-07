import { colors } from "@cliffy/ansi/colors";
import { Command } from "@cliffy/command";
import { Confirm } from "@cliffy/prompt";
import { Webdock } from "../../../webdock/webdock.ts";

export const archiveCommand = new Command()
	.name("archive")
	.description("Put this server in cold storage and free up resources and IPs")
	.arguments("<slug:string>")
	.option("-f, --force", "Force archive without confirmation")
	.option("--wait", "Wait until the operation is finished").option(
		"-t, --token <token:string>",
		"API token for authentication",
	)
	.option("--csv", "Print the result as a CSV", { conflicts: ["json"] })
	.action(async (options, slug) => {
		const client = new Webdock(!options.csv, !options.csv);
		if (!options.force) {
			const confirmed = await Confirm.prompt(
				`Are you sure you want to archive server '${slug}'? This will make the server inaccessible.`,
			);

			if (!confirmed) {
				console.log("Operation cancelled.");
				return;
			}
		}

		const response = await client.servers.archive({
			serverSlug: slug,
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
					"Your server has been successfully archived!",
				),
			);

			Deno.exit(0);
		}

		console.log(
			colors.bgGreen.bold.underline.italic(
				"Server archived initiated. Please check its status in a couple of minutes.",
			),
		);
	});
