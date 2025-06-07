import { client } from "../../../main.ts";
import { colors } from "@cliffy/ansi/colors";
import { Command } from "@cliffy/command";
import { sanitizePath } from "../../../utils/sanitize-path.ts";
// Fetch file command
export const fetchFileCommand = new Command()
	.name("fetch-file")
	.arguments("<slug:string> <path:string>")
	.description("Fetch a file from a server")
	.option(
		"-t, --token <token:string>",
		"API token used for authentication",
	)
	.option(
		"--wait",
		"Wait until the operation is complete before exiting",
	)
	.action(async (options, slug, path) => {
		const sanitizedPath = await sanitizePath(path);
		if (!sanitizedPath) {
			console.log(colors.bgRed("Invalid Path"));
			Deno.exit(1);
		}

		const response = await client.servers.fetchFile({
			path: sanitizedPath,
			slug,
			token: options.token,
		});

		if (!response.success) {
			if (response.code == 404) console.error("Error 404 Server Not Found!");
			Deno.exit(1);
		}

		if (options.wait) {
			await client.waitForEvent(response.data.headers["x-callback-id"]);

			console.log(
				colors.bgGreen.underline.bold(
					"File fetched successfully. Check the event history on your dashboard to view its content.",
				),
			);

			Deno.exit(0);
		}

		console.log(
			colors.bgGreen.underline.bold(
				"File fetched initiated. Check the event history on your dashboard to view its content.",
			),
		);
	});
