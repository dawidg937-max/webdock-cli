import { stringify } from "csv-stringify/sync";
import { wrapId } from "../../../test_utils.ts";
import { Command } from "@cliffy/command";
import { Table } from "@cliffy/table";
import { Webdock } from "../../../webdock/webdock.ts";

export const listCommand = new Command()
	.description("List all SSH keys")
	.option("-t, --token <token:string>", "API token for authentication")
	.option(
		"--json",
		"Display the results in a json format instead of a Table",
		{ conflicts: ["csv"] },
	)
	.option("--csv", "Print the result as a CSV", { conflicts: ["json"] })
	.action(async (options) => {
		const client = new Webdock(!options.csv, !options.csv);
		const response = await client.sshkeys.list({ token: options.token });

		if (!response.success) {
			console.error(response.error);
			Deno.exit(1);
		}

		response.data.body.forEach((e) => e.key = "🔒 CLI security: key hidden");

		if (options.csv) {
			const keys = ["id", "name", "key", "created"] as const;
			const res = response.data.body as unknown as Record<string, unknown>[];
			const data = res.map((item) => {
				return keys.map((key) => {
					if (key == "key") return "[Key Hidden]";
					return item[key];
				});
			});

			console.log(stringify(data, {
				columns: keys,
				header: true,
			}));
			return;
		}

		if (options.json) {
			console.log(response.data);
			return;
		}

		new Table()
			.header(["ID", "Name", "Key", "Created"])
			.align("center")
			.body(
				response.data.body.map((key) => [
					wrapId(key.id),
					key.name,
					key.key,
					key.created || "N/A",
				]),
			)
			.border(true).render();
	});
