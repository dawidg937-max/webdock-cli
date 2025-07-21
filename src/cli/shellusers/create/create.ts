import { wrapId } from "../../../test_utils.ts";
import { Command } from "@cliffy/command";
import { Table } from "@cliffy/table";
import { Webdock } from "../../../webdock/webdock.ts";
import { stringify } from "csv-stringify/sync";

export const createCommand = new Command()
	.name("create")
	.description("Create a new shell user on a server")
	.arguments("<slug:string> <username:string> <password:string>")
	.option("-t, --token <token:string>", "API token for authentication")
	.option("--wait", "Wait until the operation is finished")
	.option("-s, --shell <shell:string>", "", { default: "/bin/bash" })
	.option("-g, --group <group:string>", "", { default: "sudo" })
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
	.action(async (options, serverSlug, username, password) => {
		const client = new Webdock(!options.csv && !options.json, !options.csv && !options.json);
		const response = await client.shellUsers.create({
			username: username,
			password: password,
			group: options.group,
			shell: options.shell,
			publicKeys: options.publicKeys ?? [],
			serverSlug,
			token: options.token,
		});

		if (!response.success) {
			if (response.code == 404) console.error("Error 404 Server Not found");
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

		const data = response.data.body;

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
		new Table().header([
			"ID",
			"Username",
			"Group",
			"Shell",
			"Public Keys",
			"Created",
		]).align("center").body([
			[
				wrapId(data.id),
				data.username,
				data.group,
				data.shell,
				data.publicKeys.join(", "),
				data.created,
			],
		]).border().render();
	});
