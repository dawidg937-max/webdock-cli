import { createSnapshot } from "../../functions/snapshot/create.ts";
import { addGoToMainMenuToOptions, isMainMenu } from "../../goto/options/go-to-main-menu-to-options.ts";
import { listAllServersSnapshots } from "./snapshots.ts";
import { Select } from "@cliffy/prompt";

export async function manageServersSnapshots(PARENT: () => void, slug: string) {
	const _COME_BACK_HERE = () => manageServersSnapshots(PARENT, slug);
	const choice = await Select.prompt({
		message: "What do you want to do ?",
		options: [
			{ name: "Create new snapshot!", value: "NEW" },
			{ name: "List and Restore Snapshots", value: "LIST_SNAPSHOTS" },
		].concat(addGoToMainMenuToOptions),
	});

	if (isMainMenu(choice)) return PARENT();

	switch (choice) {
		case "LIST_SNAPSHOTS":
			await listAllServersSnapshots(_COME_BACK_HERE, slug);
			return;
		case "NEW":
			await createSnapshot(_COME_BACK_HERE, slug);
			return;
	}
}
