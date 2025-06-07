import { deleteSnapshot } from "../../functions/snapshot/delete.ts";
import { Select } from "@cliffy/prompt";
import { addGoToMainMenuToOptions, isMainMenu } from "../../goto/options/go-to-main-menu-to-options.ts";
import { restoreSnapshot } from "../../functions/servers/restore.ts";

export async function snapshotActionMenu(
	PARENT: () => void,
	serverSlug: string,
	snapshotId: number,
) {
	const _COME_BACK_HERE = () =>
		snapshotActionMenu(
			PARENT,
			serverSlug,
			snapshotId,
		);
	const choice = await Select.prompt({
		message: "Chose an operation to perform",
		options: [{
			value: "RESTORE",
			name: "Restore Snapshot",
		}, {
			name: `Delete Snapshot ${snapshotId}`,
			value: "DELETE",
		}].concat(addGoToMainMenuToOptions),
	});

	if (isMainMenu(choice)) return PARENT();

	if (choice == "DELETE") {
		await deleteSnapshot(_COME_BACK_HERE, serverSlug, snapshotId);
	} else if (choice == "RESTORE") {
		await restoreSnapshot(_COME_BACK_HERE, serverSlug, snapshotId);
	}
}
