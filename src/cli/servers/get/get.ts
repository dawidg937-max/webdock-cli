import { Command } from "@cliffy/command";
import { Table } from "@cliffy/table";

import { Webdock } from "../../../webdock/webdock.ts";
import { wrapSlug } from "../../../test_utils.ts";
import { stringify } from "csv-stringify/sync";

export const getCommand = new Command()
	.name("get")
	.description("Get details of a specific server")
	.arguments("<slug:string>")
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
	.action(async (options, slug) => {
		const client = new Webdock(!options.csv, !options.csv);
		const response = await client.servers.getBySlug({
			serverSlang: slug,
			token: options.token,
		});

		if (!response.success) {
			Deno.exit(1);
		}

		if (options.json) {
			console.log(response.data);
			return;
		}

		if (options.csv) {
			const keys = ["slug", "name", "location", "status", "ipv4"];
			const data = response.data.body as unknown as Record<string, unknown>;
			const body = keys.map((key) => data[key]);
			console.log(stringify([body], {
				columns: keys,
				header: true,
			}));
			return;
		}

		new Table()
			.header(["Slug", "Name", "Location", "Status", "IP"])
			.body([
				[
					wrapSlug(response.data.body.slug),
					response.data.body.name,
					response.data.body.location,
					response.data.body.status,
					response.data.body.ipv4 ?? "",
				],
			])
			.border(true).render();
	});
