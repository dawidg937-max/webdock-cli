import { snapshotActionMenu } from "./action-menu.ts";
import { Select } from "@cliffy/prompt/select";
import { Webdock } from "../../../webdock/webdock.ts";
import { addGoToMainMenuToOptions, isMainMenu } from "../../goto/options/go-to-main-menu-to-options.ts";
import { Spinner } from "@std/cli/unstable-spinner";

export async function listAllServersSnapshots(
	PARENT: () => void,
	slug: string,
) {
	const _COME_BACK_HERE = () => listAllServersSnapshots(PARENT, slug);
	const spinner = new Spinner();
	const client = new Webdock(false);
	spinner.message = "🔍 Loading server snapshots...";
	spinner.start();
	const response = await client.snapshots.list({ serverSlug: slug });
	spinner.stop();

	if (!response.success) {
		console.error("❌ Failed to load server snapshots:", response.error);
		return PARENT();
	}

	if (response.data.body.length == 0) {
		console.error("No snapshots were found for this server");
		return PARENT();
	}

	const snapshotChoice = await Select.prompt({
		message: "Select a snapshot to manage:",
		options: response.data.body.map((e) => ({
			value: e.id,
			name: e.name,
			// @ts-expect-error:
		})).concat(addGoToMainMenuToOptions),
	});
	if (isMainMenu(snapshotChoice)) return PARENT();

	await snapshotActionMenu(_COME_BACK_HERE, slug, snapshotChoice);
}
