import { Command } from "@cliffy/command";
import { Table } from "@cliffy/table";
import { Webdock } from "../../../webdock/webdock.ts";
import { stringify } from "csv-stringify/sync";

export const listCommand = new Command()
	.name("list")
	.description("List all profiles")
	.arguments("<locationId:string>")
	.option(
		"-t, --token <token:string>",
		"API token used for authentication (required for protected endpoints)",
	)
	.option(
		"--json",
		"Display the results in a json format instead of a Table",
		{ conflicts: ["csv"] },
	)
	.option("--csv", "Print the result as a CSV", { conflicts: ["json"] })
	.action(async (options, locationId: string) => {
		const api = new Webdock(!options.csv, !options.csv);

		const response = await api.profiles.list({
			token: options.token,
			locationId: locationId,
		});
		if (!response.success) {
			console.error(response.error);
			Deno.exit(1);
		}
		if (options.csv) {
			// deno-lint-ignore no-explicit-any
			const data = response.data.body.map((item: Record<string, any>) => {
				return Object.keys(item).reduce((acc: unknown[], key) => {
					if (key === "cpu") {
						acc.push(item.cpu.threads);
					} else if (key === "price") {
						acc.push(`${item.price.amount / 100} ${item.price.currency}`);
					} else {
						acc.push(item[key] ?? "N/A");
					}
					return acc;
				}, []);
			});

			const csvOutput = stringify(data, {
				header: true,
				columns: Object.keys(response.data.body[0]),
			});

			console.log(csvOutput.trim());
			return;
		}
		if (options.json) {
			console.log(response.data);
			Deno.exit(0);
		}

		const table = new Table()
			.header(["Slug", "Name", "CPU", "RAM", "Disk", "Price"])
			.body(
				response.data.body.map((profile) => [
					profile.slug || "N/A",
					profile.name || "N/A",
					profile.cpu ? `${profile.cpu.threads} ${String(profile.cpu.threads).length === 1 ? " " : ""}vCPU` : "N/A",
					profile.ram ? `${profile.ram / 1000} GB` : "N/A",
					profile.disk ? `${profile.disk / 1000} GB` : "N/A",
					profile.price ? `${profile.price.amount / 100} ${profile.price.currency}` : "N/A",
				]),
			)
			.align("left")
			.border(true);

		console.log(table.toString());
	});
