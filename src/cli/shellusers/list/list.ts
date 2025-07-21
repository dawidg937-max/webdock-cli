import { stringify } from "csv-stringify/sync";
import { wrapId } from "../../../test_utils.ts";
import { Command } from "@cliffy/command";
import { Table } from "@cliffy/table";
import { Webdock } from "../../../webdock/webdock.ts";

export const listCommand = new Command()
	.name("list")
	.arguments("<slug:string>")
	.description("List shell users for a server")
	.option("-t, --token <token:string>", "API token for authentication")
	.option(
		"--json",
		"Display the results in a json format instead of a Table",
		{ conflicts: ["csv"] },
	)
	.option("--csv", "Print the result as a CSV", { conflicts: ["json"] })
	.action(async (options, serverSlug) => {
		const client = new Webdock(!options.csv && !options.json, !options.csv && !options.json);
		const response = await client.shellUsers.list({
			serverSlug,
			token: options.token,
		});

		if (!response.success) {
			console.error(response.error);
			Deno.exit(1);
		}

		if (options.json) {
			console.log(JSON.stringify(response.data));
			Deno.exit(0);
		}

		if (options.csv) {
			const data = response.data.body as unknown as Record<string, unknown>[];
			const keys = [
				"id",
				"username",
				"group",
				"shell",
				"publicKeys",
				"created",
			] as const;
			const body = data.map((item) => {
				console.log(item);

				return keys.map((key) => {
					if (key == "publicKeys") {
						return (item[key] as { id: number }[]).map((e) => e.id).join(",");
					}
					return item[key];
				});
			});
			console.log(
				stringify(body, {
					columns: keys,
					header: true,
				}).trim(),
			);

			return;
		}
		new Table()
			.header([
				"ID",
				"Username",
				"Group",
				"Shell",
				"Created",
				"Public Keys",
			])
			.body(
				response.data.body.map((user) => [
					wrapId(user.id),
					user.username,
					user.group,
					user.shell,
					user.created,
					user.publicKeys ? user.publicKeys.length : 0,
				]),
			)
			.border(true).render();
	});
