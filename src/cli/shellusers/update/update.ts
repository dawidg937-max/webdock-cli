import { Command } from "@cliffy/command";
import { Table } from "@cliffy/table";
import { Webdock } from "../../../webdock/webdock.ts";
import { wrapId } from "../../../test_utils.ts";
import { stringify } from "csv-stringify/sync";

export const updateCommand = new Command()
	.name("update")
	.description("Update a shell user's public keys")
	.arguments("<slug:string> <id:number>")
	.option("--wait", "Wait until the operation is done")
	.option(
		"-k, --public-keys <keys:number[]>",
		"Comma-separated list of public key IDs to assign to the user",
		{
			separator: ",",
		},
	)
	.option(
		"--json",
		"Display the results in a json format instead of a Table",
		{ conflicts: ["csv"] },
	)
	.option("--csv", "Print the result as a CSV", { conflicts: ["json"] })
	.option("-t, --token <token:string>", "API token for authentication")
	.action(async (options, slug, id) => {
		const client = new Webdock(!options.csv && !options.json, !options.csv && !options.json);
		const response = await client.shellUsers.edit({
			keys: options.publicKeys || [],
			slug: slug,
			id: id,
		});

		if (!response.success) {
			if (response.code == 404) {
				console.error("Error 404 Server or shell user not found");
			}
			if (response.code == 400) console.error(response.error);

			Deno.exit(1);
		}

		if (options.wait) {
			await client.waitForEvent(response.data.headers["x-callback-id"]);
		}

		if (options.json) {
			console.log(JSON.stringify(response.data));
			return;
		}

		if (options.csv) {
			const data = response.data.body as unknown as Record<string, unknown>;
			const keys = [
				"id",
				"username",
				"group",
				"shell",
				"publicKeys",
				"created",
			] as const;
			const body = keys.map((key) => {
				if (key == "publicKeys") {
					return (data[key] as { id: number }[]).map((e) => e.id).join(",");
				}
				return data[key];
			});
			console.log(
				stringify([body], {
					columns: keys,
					header: true,
				}).trim(),
			);

			return;
		}

		const data = response.data.body;
		new Table().header([
			"ID",
			"Username",
			"Group",
			"Shell",
			"Public Keys",
		]).align("center")
			.body([[
				wrapId(data.id),
				data.username,
				data.group,
				data.shell,
				data.publicKeys.map((e) => e.id).join(","),
			]]).border().render();
	});
