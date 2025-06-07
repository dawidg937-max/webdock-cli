import { colors } from "@cliffy/ansi/colors";
import { Command } from "@cliffy/command";
import { Table } from "@cliffy/table";
import { Webdock } from "../../../webdock/webdock.ts";
import { wrapSlug } from "../../../test_utils.ts";
import { stringify } from "csv-stringify/sync";

export const listCommand = new Command()
	.name("list")
	.description("List all servers")
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
	.action(async (options) => {
		const client = new Webdock(!options.csv, !options.csv);
		const response = await client.servers.list(options.token);

		if (!response.success) {
			console.error(colors.bgRed.bold.underline.italic(response.error));
			Deno.exit(1);
		}
		if (options.json) {
			console.log(response.data);
			return;
		}

		if (options.csv) {
			const keys = ["slug", "name", "location", "status", "ipv4"] as const;
			const data = response.data.body as unknown as Record<string, unknown>[];
			const body = data.map((item) => {
				return keys.map((key) => {
					return item[key];
				});
			});
			console.log(stringify(body, {
				columns: keys,
				header: true,
			}));
			return;
		}
		new Table()
			.header([
				"Name",
				"Location",
				"Status",
				"Slug",
				"Created",
				"Profile",
				"IPv4",
				"Virtualization",
				"Web Server",
				"SSH Auth",
			])
			.body(
				response.data.body.map((server) => [
					server.name,
					server.location,
					server.status,
					wrapSlug(server.slug),
					server.date,
					server.profile ?? "N/A",
					server.ipv4 ?? "N/A",
					server.virtualization ?? "N/A",
					server.webServer ?? "N/A",
					server.SSHPasswordAuthEnabled ? "Yes" : "No",
				]),
			)
			.border(true).render();
	});
