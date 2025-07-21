import { Command } from "@cliffy/command";
import { Table } from "@cliffy/table";
import { Webdock } from "../../../webdock/webdock.ts";
import { stringify } from "csv-stringify/sync";

export const listCommand = new Command()
	.description("List all images")
	.option(
		"-t, --token <token:string>",
		"API token used for authentication. Required if the endpoint is secured",
	)
	.option(
		"--json",
		"Display the results in a json format instead of a Table",
		{ conflicts: ["csv"] },
	)
	.option("--csv", "Print the result as a CSV", { conflicts: ["json"] })
	.action(async (options) => {
		const api = new Webdock(!options.csv && !options.json, !options.csv && !options.json);
		const response = await api.images.list(options.token);
		if (!response.success) {
			Deno.exit(1);
		}

		if (options.csv) {
			const keys = Object.keys(response.data.body[0]);

			const csvData = response.data.body.reduce(
				(acc: unknown[], item: Record<string, unknown>) => {
					acc.push(keys.map((key) => item[key] ?? "N/A"));
					return acc;
				},
				[],
			);

			console.log(stringify(csvData, {
				columns: keys,
				header: true,
			}));

			Deno.exit(0);
		}

		if (options.json) {
			console.log(JSON.stringify(response.data));
			Deno.exit(0);
		}

		const table = new Table()
			.header(["Slug", "Name", "Type", "phpVersion"])
			.body(
				response.data.body.map((image) => [
					image.slug,
					image.name,
					image.webServer || "N/A",
					image.phpVersion || "N/A",
				]),
			)
			.border(true);

		console.log(table.toString());
	});
