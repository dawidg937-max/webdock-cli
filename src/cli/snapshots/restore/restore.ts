import { client } from "../../../main.ts";
import { colors } from "@cliffy/ansi/colors";
import { Command } from "@cliffy/command";

export const restoreCommand = new Command()
	.description("Restore a server from a snapshot")
	.arguments("<serverSlug:string> <snapshotId:number>")
	.option("-t, --token <token:string>", "API token for authentication")
	.option("--wait", "Wait until the operation is finished")
	.action(async (options, serverSlug, snapshotId) => {
		const response = await client.snapshots.restore({
			serverSlug,
			snapshotId,
			token: options.token,
		});
		if (!response.success) {
			if (response.code == 404) {
				console.error("Error 404 Snapshot or Server not found!");
			}
			if (response.code == 400) console.error(response.error);
			Deno.exit(1);
		}

		if (options.wait) {
			await client.waitForEvent(response.data.headers["x-callback-id"]);

			console.log(
				colors.bgGreen.underline.bold.italic(
					`Snapshot ${snapshotId} was successfully applied to server ${serverSlug}`,
				),
			);

			Deno.exit(0);
		}

		console.log(
			colors.bgYellow.underline.bold.italic(
				`Snapshot restore has been initiated. Please check again in a minute.`,
			),
		);
	});
