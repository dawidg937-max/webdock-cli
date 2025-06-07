import { client } from "../../../main.ts";
import { Command } from "@cliffy/command";

export const deleteCommand = new Command()
	.description("Delete an account script")
	.arguments("<id:number>")
	.option(
		"-t, --token <token:string>",
		"API token used for authentication (required for secure endpoints)",
	)
	.action(async (options, id: number) => {
		const response = await client.scripts.delete({
			id,
			token: options.token,
		});

		if (!response.success) {
			console.error(response.error);
			Deno.exit(1);
		}

		console.log("Account script deleted successfully");
	});
