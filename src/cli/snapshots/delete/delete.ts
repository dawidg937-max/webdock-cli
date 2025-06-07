import { client } from "../../../main.ts";
import { colors } from "@cliffy/ansi/colors";
import { Command } from "@cliffy/command";

export const deleteCommand = new Command()
	.description("Delete a snapshot")
	.arguments("<serverSlug:string> <snapshotId:number>")
	.option("-t, --token <token:string>", "API token for authentication")
	.option("--wait", "Wait until the operation is finished")
	.action(
		async (
			options,
			serverSlug: string,
			snapshotId: number,
		) => {
			const response = await client.snapshots.delete({
				serverSlug,
				snapshotId,
				token: options.token,
			});
			if (!response.success) {
				console.error("Error 404 Server or Snapshot not found!");

				Deno.exit(1);
			}

			if (options.wait) {
				await client.waitForEvent(response.data.headers["x-callback-id"]);

				console.log(
					colors.bgGreen.underline.bold.italic(
						`Snapshot ${snapshotId} was successfully deleted to server ${serverSlug}`,
					),
				);

				Deno.exit(0);
			}

			console.log(
				colors.bgYellow.underline.bold.italic(
					`Snapshot deletion has been initiated. Please check again in a minute.`,
				),
			);
		},
	);
