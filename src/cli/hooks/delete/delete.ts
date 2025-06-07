import { client } from "../../../main.ts";
import { Command } from "@cliffy/command";
import { Confirm } from "@cliffy/prompt";

export const deleteCommand = new Command()
	.name("delete")
	.description("Delete an event hook")
	.arguments("<id:number>")
	.option(
		"-f, --force",
		"Force deletion without confirmation prompt. Use with caution.",
		{ default: false },
	)
	.option(
		"-t, --token <token:string>",
		"API token used for authentication. Required for protected endpoints.",
	)
	.action(async (options, id: number) => {
		if (!options.force) {
			const confirmed = await Confirm.prompt(
				`Are you sure you want to delete event hook with ID ${id}? This action cannot be undone.`,
			);

			if (!confirmed) {
				console.log("Operation cancelled.");
				Deno.exit(0);
			}
		}

		const response = await client.hooks.deleteById({
			id,
			token: options.token,
		});
		console.log(response);

		if (!response.success) {
			console.error(response.error);

			Deno.exit(1);
		}

		console.log(`Event hook with ID ${id} deleted successfully.`);
		Deno.exit(0);
	});
