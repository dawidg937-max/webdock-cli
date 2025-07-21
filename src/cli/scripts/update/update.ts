import { Command } from "@cliffy/command";
import { Table } from "@cliffy/table";
import { stringify } from "csv-stringify/sync";
import { Webdock } from "../../../webdock/webdock.ts";

export const updateCommand = new Command()
	.description("Update an account script")
	.arguments("<id:number> <name:string> <filename:string> <content:string>")
	.option(
		"-t, --token <token:string>",
		"API token used for authentication (required for secure access)",
	)
	.option(
		"--json",
		"Display the results in a json format instead of a Table",
		{ conflicts: ["csv"] },
	)
	.option("--csv", "Print the result as a CSV", { conflicts: ["json"] })
	.action(
		async (
			options,
			id: number,
			name: string,
			filename: string,
			content: string,
		) => {
			const client = new Webdock(!options.csv && !options.json, !options.csv && !options.json);
			const response = await client.scripts.update({
				name: name,
				filename: filename,
				content: content,
				id: id,
				token: options.token,
			});

			if (!response.success) {
				if (response.code == 404) console.error("Error 404 script not found!");
				if (response.code == 100) console.error("Error 400 invalid input!");
				Deno.exit(1);
			}

			if (options.json) {
				return;
			}
			if (options.csv) {
				const keys = [
					"id",
					"name",
					"description",
					"filename",
					"content",
				] as const;
				const cvsData = response.data.body as unknown as Record<
					string,
					unknown
				>;
				const data = keys.map((key) => {
					if (key == "content") return "[Content Hidden]";
					return cvsData[key] || "N/A";
				});
				console.log(stringify([data], { columns: keys, header: true }));
				return;
			}
			const data = response.data.body;
			new Table().header([
				"ID",
				"Name",
				"Description",
				"Filename",
				"Content",
			]).body([[
				data.id,
				data.name,
				data.description,
				data.filename,
				data.content.slice(0, 25) + "....",
			]]).border().render();
		},
	);
