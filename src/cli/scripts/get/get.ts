import { Command } from "@cliffy/command";
import { Table } from "@cliffy/table";
import { stringify } from "csv-stringify/sync";
import { Webdock } from "../../../webdock/webdock.ts";

export const getCommand = new Command()
	.description("Get an account script by ID")
	.arguments("<id:number>")
	.option(
		"-t, --token <token:string>",
		"API token used for authentication (required for secure endpoints)",
	)
	.option(
		"--json",
		"Display the results in a json format instead of a Table",
		{ conflicts: ["csv"] },
	)
	.option("--csv", "Print the result as a CSV", { conflicts: ["json"] })
	.action(async (options, id: number) => {
		const client = new Webdock(!options.csv && !options.json, !options.csv && !options.json);
		const response = await client.scripts.getById({
			scriptId: id,
			token: options.token,
		});

		if (!response.success) {
			console.error(`Failed to The script with id ${id}`);
			Deno.exit(1);
		}

		if (options.json) {
			console.log(JSON.stringify(response.data));
			return;
		}
		const data = response.data.body;

		if (options.csv) {
			const keys = [
				"id",
				"name",
				"description",
				"filename",
				"content",
			] as const;
			const body = response.data.body as unknown as Record<string, unknown>;

			const data = keys.map((key) => {
				if (key == "content") return "[Content Hidden]";
				return body[key] || "N/A";
			});

			console.log(stringify([data], {
				columns: keys,
				header: true,
			}));

			return;
		}
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
	});
