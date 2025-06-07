import { createShellUser } from "../../functions/servers/shellusers/create.ts";
import { addGoToMainMenuToOptions, isMainMenu } from "../../goto/options/go-to-main-menu-to-options.ts";
import { listShellUsers } from "./shellusers-menu.ts";
import { Select } from "@cliffy/prompt";
// deleteShellUser
export async function listServerShellUsers(
	PARENT: () => void,
	{ slug }: { slug: string },
) {
	const _COME_BACK_HERE = () => listServerShellUsers(PARENT, { slug });
	const action = await Select.prompt({
		"message": "Select an action",
		"options": [
			{ name: "Create a new shell user", value: "create" },
			{ name: "List shell users", value: "list" },
		].concat(addGoToMainMenuToOptions),
	});
	if (isMainMenu(action)) return PARENT();

	if (action === "create") await createShellUser(_COME_BACK_HERE, slug);
	if (action === "list") await listShellUsers(_COME_BACK_HERE, slug);
}
