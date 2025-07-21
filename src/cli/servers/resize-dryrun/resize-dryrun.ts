import { Command } from "@cliffy/command";
import { Table } from "@cliffy/table";
import { Webdock } from "../../../webdock/webdock.ts";
import { stringify } from "csv-stringify/sync";

export const resizeDryRunCommand = new Command()
	.name("resize-dryrun")
	.description("Perform a dry run to preview server profile change")
	.arguments("<serverSlug:string> <profile:string>")
	.option("-t, --token <token:string>", "")
	.option(
		"--json",
		"Display the results in a json format instead of a Table",
		{ conflicts: ["csv"] },
	)
	.option("--csv", "Print the result as a CSV", { conflicts: ["json"] }).action(
		async (options, serverSlug, profile) => {
			const client = new Webdock(!options.csv && !options.json, !options.csv && !options.json);
			const response = await client.servers.resizeDryRun(
				{
					profileSlug: profile,
					serverSlug,
					token: options.token,
				},
			);

			if (!response.success) {
				if (response.code == 404) console.error("Error 404 Server not found!");
				else console.error(response.error);

				Deno.exit(1);
			}

			if (options.json) {
				console.log(JSON.stringify(response.data));
				return;
			}

			const data = response.data;
			const rows = [];
			for (const item of data.body.chargeSummary.items) {
				const parts = item.text.split(/ - (.*)/s);
				rows.push([parts[0], formatPrice(item.price)]);
				if (parts[1]) rows.push([parts[1], ""]);
			}

			rows.push([
				"Subtotal",
				formatPrice(data.body.chargeSummary.total.subTotal),
			]);
			rows.push(["VAT", formatPrice(data.body.chargeSummary.total.vat)]);
			rows.push(["Total", formatPrice(data.body.chargeSummary.total.total)]);

			if (options.csv) {
				console.log(stringify(rows, {
					columns: ["description", "amount"],
					header: true,
				}));
				return;
			}
			new Table()
				.header(["Description", "Amount"])
				.body(rows)
				.border(true)
				.render();
		},
	);

// Price formatter
function formatPrice(
	{ amount, currency }: { amount: number; currency: string },
): string {
	return `${currency === "USD" ? "$" : currency} ${(amount / 100).toFixed(2)}`;
}
