import { Command } from "@cliffy/command";
import { Table } from "@cliffy/table";

import { wrapId } from "../../../test_utils.ts";
import { Webdock } from "../../../webdock/webdock.ts";
import { stringify } from "csv-stringify/sync";

export const createCommand = new Command()
	.description("Create a snapshot for a server")
	.arguments("<serverSlug:string> <name:string>")
	.option("-t, --token <token:string>", "API token for authentication")
	.option(
		"--json",
		"Display the results in a json format instead of a Table",
		{ conflicts: ["csv"] },
	)
	.option("--csv", "Print the result as a CSV", { conflicts: ["json"] })
	.option("--wait", "Wait until the operation has finished")
	.action(async (options, serverSlug, username) => {
		const client = new Webdock(!options.csv, !options.csv);
		const response = await client.snapshots.create({
			name: username,
			serverSlug,
			token: options.token,
		});

		if (!response.success) {
			if (response.code == 404) console.error("Error 404 server not found");
			else console.error(response.error);
			Deno.exit(1);
		}

		if (options.wait) {
			await client.waitForEvent(response.data.headers["x-callback-id"]);
		}

		if (options.json) {
			console.log(response.data);
			return;
		}

		if (options.csv) {
			const keys = [
				"id",
				"name",
				"date",
				"type",
				"virtualization",
				"completed",
				"deletable",
			] as const;
			const data = response.data.body as unknown as Record<string, unknown>;
			const body = keys.map((key) => data[key]);
			console.log(stringify([body], {
				columns: keys,
				header: true,
			}));

			return;
		}

		const data = response.data;

		new Table()
			.header([
				"ID",
				"Name",
				"Created",
				"Type",
				"Virtualization",
				"Completed",
				"Deletable",
			])
			.body(
				[
					[
						wrapId(data.body.id),
						data.body.name ?? "",
						data.body.date ?? "",
						data.body.type ?? "",
						data.body.virtualization ?? "",
						data.body.completed ? "YES" : "NO",
						data.body.deletable ? "YES" : "NO",
					],
				],
			)
			.border(true).render();
	});
