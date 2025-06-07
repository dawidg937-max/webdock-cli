import { colors } from "@cliffy/ansi/colors";
import { Confirm } from "@cliffy/prompt";
import { Webdock } from "../../../webdock/webdock.ts";
import { Spinner } from "@std/cli/unstable-spinner";
import { goToServerActionMenu } from "../../goto/server-actions-menu.ts";

export async function deleteSnapshot(
	PARENT: () => void,
	slug: string,
	snapshotId: number,
) {
	const spinner = new Spinner();
	const client = new Webdock();

	const confirm = await Confirm.prompt({
		message: colors.red(
			`⚠️  DELETE snapshot ${colors.cyan(snapshotId.toString())} from server ${colors.yellow(slug)}?`,
		),
		hint: "This action is irreversible and will permanently remove the snapshot",
		default: false,
	});

	if (!confirm) {
		console.log(
			colors.yellow("🚫  Deletion cancelled for snapshot"),
			colors.cyan(snapshotId.toString()),
		);

		return PARENT();
	}

	spinner.message = colors.blue(
		`🗑️  Initiating deletion of snapshot ${colors.cyan(snapshotId.toString())}...`,
	);
	spinner.start();
	const response = await client.snapshots.delete({
		serverSlug: slug,
		snapshotId: snapshotId,
	});
	spinner.stop();

	if (!response.success) {
		let errorMessage = `❌  Failed to delete snapshot ${colors.cyan(snapshotId.toString())}`;

		switch (response.code) {
			case 404:
				errorMessage += "\nℹ️  Server or snapshot not found - verify the IDs are correct";
				break;
			case 403:
				errorMessage += "\n🔒  Permission denied - check your API token permissions";
				break;
			case 409:
				errorMessage += "\n⏳  Snapshot is currently in use - try again later";
				break;
			default:
				errorMessage += `\n💻  API Error: ${response.error ?? "Unknown error"}`;
		}

		console.error(colors.red(errorMessage));
		return goToServerActionMenu(slug);
	}

	console.log(colors.green(
		`✅  Successfully deleted snapshot ${colors.cyan(snapshotId.toString())}`,
	));

	console.log(colors.dim(`   Server: ${colors.yellow(slug)}`));
	console.log(
		colors.dim(`   Snapshot ID: ${colors.cyan(snapshotId.toString())}`),
	);
	console.log(
		colors.underline.dim(
			`   https://webdock.io/en/dash/server/${slug}/snapshots`,
		),
	);
	goToServerActionMenu(slug);
}
