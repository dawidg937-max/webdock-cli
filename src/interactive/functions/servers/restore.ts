import { Confirm } from "@cliffy/prompt";
import { Spinner } from "@std/cli/unstable-spinner";
import { Webdock } from "../../../webdock/webdock.ts";
import { goToMainMenu } from "../../goto/main-menu.ts";
import { goToServerActionMenu } from "../../goto/server-actions-menu.ts";

export async function restoreSnapshot(
	PARENT: () => void,
	serverSlug: string,
	snapshotId: number,
) {
	const confirm = await Confirm.prompt({
		message: `Are you sure you want to restore snapshot #${serverSlug} to server #${snapshotId}`,
		default: false,
	});
	const client = new Webdock(false);
	if (!confirm) {
		console.log("🚫 Snapshot restoration cancelled");
		return PARENT();
	}

	const spinner = new Spinner();
	spinner.message = "Restoring snapshot!";
	spinner.start();
	const restore = await client.snapshots.restore({ serverSlug, snapshotId });
	spinner.stop();

	if (!restore.success) {
		console.log(restore.error);
		return goToServerActionMenu(serverSlug);
	}

	const event = await client.waitForEvent(
		restore.data.headers["x-callback-id"],
	);

	if (!event) return goToMainMenu();

	console.log("Snapshot restored successfully");

	goToServerActionMenu(serverSlug);
}
