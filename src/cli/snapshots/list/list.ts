import { Command } from "@cliffy/command";
import { Table } from "@cliffy/table";
import { wrapId } from "../../../test_utils.ts";
import { stringify } from "csv-stringify/sync";
import { Webdock } from "../../../webdock/webdock.ts";

export const listCommand = new Command()
	.description("List all snapshots for a server")
	.arguments("<serverSlug:string>")
	.option(
		"-t, --token <token:string>",
		"API token for authentication",
	)
	.option(
		"--json",
		"Display the results in a json format instead of a Table",
		{ conflicts: ["csv"] },
	)
	.option("--csv", "Print the result as a CSV", { conflicts: ["json"] })
	.action(async (options, serverSlug) => {
		const client = new Webdock(!options.csv, !options.csv);
		const response = await client.snapshots.list({
			serverSlug,
			token: options.token,
		});

		if (!response.success) {
			console.error(response.error);
			Deno.exit(1);
		}

		if (options.json) {
			console.log(response.data);
			Deno.exit(0);
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
			const data = response.data.body as unknown as Record<string, unknown>[];
			const body = data.map((item) => {
				return keys.map((key) => item[key] || "N/A");
			});
			console.log(stringify(body, {
				columns: keys,
				header: true,
			}));

			return;
		}
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
				response.data.body.map((snapshot) => [
					wrapId(snapshot.id),
					snapshot.name,
					snapshot.date,
					snapshot.type,
					snapshot.virtualization,
					snapshot.completed ? "YES" : "NO",
					snapshot.deletable ? "YES" : "NO",
				]),
			)
			.border(true).render();
	});
