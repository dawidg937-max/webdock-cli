import { createSSHKey } from "../../functions/public-keys/create.ts";
import { addGoToMainMenuToOptions, isMainMenu } from "../../goto/options/go-to-main-menu-to-options.ts";
import { listSSHKeys } from "./keys-menu.ts";
import { Select } from "@cliffy/prompt";

export async function KeysInterface(PARENT: () => void) {
	const _COME_BACK_HERE = () => KeysInterface(PARENT);
	const action = await Select.prompt({
		message: "SSH Key Management",
		options: [
			{
				name: "Add New SSH Key",
				value: "CREATE_KEY",
			},
			{
				name: "View Existing Keys",
				value: "LIST_KEYS",
			},
		].concat(addGoToMainMenuToOptions),
	});
	if (isMainMenu(action)) return PARENT();

	switch (action) {
		case "CREATE_KEY":
			createSSHKey(_COME_BACK_HERE);
			break;

		case "LIST_KEYS":
			listSSHKeys(_COME_BACK_HERE);
			break;
		default:
			break;
	}
}
