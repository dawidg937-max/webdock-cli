import { Command } from "@cliffy/command";
import { Table } from "@cliffy/table";
import { Webdock } from "../../../webdock/webdock.ts";
import { wrapId } from "../../../test_utils.ts";
import { stringify } from "csv-stringify/sync";

export const getCommand = new Command()
	.name("get")
	.description("Get details of a specific hook")
	.arguments("<id:number>")
	.option(
		"-t, --token <token:string>",
		"API token used for authentication. Required if the endpoint is protected.",
	)
	.option(
		"--json",
		"Display the results in a json format instead of a Table",
		{ conflicts: ["csv"] },
	)
	.option("--csv", "Print the result as a CSV", { conflicts: ["json"] })
	.action(async (options, id: number) => {
		const client = new Webdock(!options.csv && !options.json, !options.csv && !options.json);
		const response = await client.hooks.getById({
			id: id,
			token: options.token,
		});

		if (!response.success) {
			Deno.exit(1);
		}
		if (options.csv) {
			const csvData: Record<string, unknown> = response.data.body;
			const keys = ["id", "callbackUrl", "filters"];

			// Process array data
			const processedData = keys.reduce((acc: Record<string, unknown>, key) => {
				const value = csvData[key];
				acc[key] = Array.isArray(value) ? value.map((item) => `${item.type}:${item.value}`).join(" ") : value;
				return acc;
			}, {});

			const csvOutput = stringify([processedData], {
				header: true,
				columns: keys,
			});

			console.log(csvOutput.trim());
			return;
		}

		if (options.json) {
			console.log(JSON.stringify(response.data));
			return;
		}

		const table = new Table()
			.header(["ID", "Callback URL", "Filters"])
			.body([
				[
					wrapId(response.data.body.id),
					response.data.body.callbackUrl,
					response.data.body.filters
						? response.data.body.filters.map((f) => `${f.type}:${f.value}`)
							.join("\n")
						: "None",
				],
			])
			.border(true);

		console.log(table.toString());
	});
