import { Command } from "@cliffy/command";
import { Table } from "@cliffy/table";
import { Webdock } from "../../../webdock/webdock.ts";
import { colors } from "@cliffy/ansi/colors";
import { stringify } from "csv-stringify/sync";
import { eventTypeEnum } from "../../event-types.ts";

export const listCommand = new Command()
	.description("List all events")
	.type("event-type", eventTypeEnum)
	.option(
		"-t, --token <token:string>",
		"API token for authentication. Required if the API needs secure access.",
	)
	.option(
		"-p, --page <page:number>",
		"Page number for paginated results. Defaults to 1.",
		{ default: 1 },
	)
	.option(
		"-l, --limit <limit:number>",
		"Number of events to display per page. Defaults to 15.",
		{ default: 15 },
	)
	.option(
		"--json",
		"Display the results in a json format instead of a Table",
		{ conflicts: ["csv"] },
	)
	.option("--csv", "Print the result as a CSV", { conflicts: ["json"] })
	.option(
		"-y, --type <type:event-type>",
		"Filter events by type",
	)
	.action(async (options) => {
		const client = new Webdock(!options.csv && !options.json, !options.csv && !options.json);
		const response = await client.events.list(options);

		if (!response.success) {
			console.error(colors.bgRed(response.error));
			Deno.exit(1);
		}
		if (options.csv) {
			if (response.data.body.length === 0) Deno.exit(0);
			const keys = [
				"id",
				"startTime",
				"endTime",
				"callbackId",
				"serverSlug",
				"eventType",
				"action",
				"actionData",
				"status",
				"message",
			];

			const data = response.data.body.map((item) => {
				// @ts-expect-error:
				return keys.map((key) => item?.[key]);
			});
			console.log(stringify(data, {
				columns: keys,
				header: true,
			}));

			return;
		}

		if (options.json) {
			console.log(JSON.stringify(response.data));
			return;
		}

		const table = new Table()
			.header(["ID", "Slug", "Type", "StartTime", "End time", "Details"])
			.body(
				response.data.body.map((event) => [
					event.id,
					event.serverSlug,
					event.eventType.toString(),
					event.startTime.toString(),
					event.endTime?.toString(),

					event.action.slice(0, 25) + (event.action.length > 25 ? "..." : ""),
				]),
			)
			.border(true);

		console.log(table.toString());
	});
