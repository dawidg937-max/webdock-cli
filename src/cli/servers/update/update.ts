import { Command } from "@cliffy/command";
import { Table } from "@cliffy/table";
import { wrapSlug } from "../../../test_utils.ts";
import { Webdock } from "../../../webdock/webdock.ts";
import { stringify } from "csv-stringify/sync";

export const updateCommand = new Command()
	.description("Update server metadata")
	.arguments(
		"<serverSlug:string> <name:string> <description:string> <notes:string> <nextActionDate:string>",
	)
	.option("-t, --token <token:string>", "API token for authentication")
	.option(
		"--json",
		"Display the results in a json format instead of a Table",
		{ conflicts: ["csv"] },
	)
	.option("--csv", "Print the result as a CSV", { conflicts: ["json"] }).action(
		async (
			options,
			serverSlug,
			name,
			description,
			notes,
			nextActionDate,
		) => {
			const client = new Webdock(!options.csv && !options.json, !options.csv && !options.json);
			const response = await client.servers.update({
				nextActionDate,
				name,
				description,
				notes,
				serverSlug,
				token: options.token,
			});

			if (!response.success) {
				console.error(response.error);
				Deno.exit(1);
			}

			if (options.json) {
				console.log(JSON.stringify(response.data));
				return;
			}
			if (options.csv) {
				const keys = ["slug", "name", "location", "ipv4"];
				const data = response.data.body as unknown as Record<string, unknown>;
				const body = keys.map((key) => {
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
			new Table()
				.header([
					"Slug",
					"Name",
					"Location",
					"IP",
					"Description",
					"Notes",
					"Next Action Date",
				])
				.body([
					[
						wrapSlug(data.slug),
						data.name,
						data.location,
						data.ipv4 ?? "N/A",
						data.description.slice(0, 30),
						data.nextActionDate,
					],
				]).align("center").border().render();
		},
	);
