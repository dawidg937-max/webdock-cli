import { client } from "../../../main.ts";
import { colors } from "@cliffy/ansi/colors";
import { Command } from "@cliffy/command";
import { Confirm } from "@cliffy/prompt";

export const deleteCommand = new Command()
	.name("delete")
	.description("Delete a shell user from a server")
	.arguments("<slug:string> <id:number>")
	.option("-f, --force", "Force deletion without confirmation", {
		default: false,
	})
	.option("-t, --token <token:string>", "API token for authentication")
	.option("--wait", "Wait until the operation is completed")
	.action(async (options, serverSlug, userId) => {
		if (!options.force) {
			const confirmed = await Confirm.prompt(
				`Are you sure you want to delete shell user with ID ${userId}? This action cannot be undone.`,
			);

			if (!confirmed) {
				console.log("Operation cancelled.");
				return;
			}
		}

		const response = await client.shellUsers.delete({
			serverSlug,
			userId,
			token: options.token,
		});

		if (!response.success) {
			console.error(response.error);
			Deno.exit(1);
		}
		if (options.wait) {
			await client.waitForEvent(response.data.headers["x-callback-id"]);

			console.log(
				colors.bgGreen.underline.bold.italic(
					`Shell user with ID ${userId} deleted successfully.`,
				),
			);
			Deno.exit(0);
		}

		console.log(
			colors.bgGreen.bold.italic.underline(
				"Shelluser deletion initiated. Please check again in a minute.",
			),
		);
	});
