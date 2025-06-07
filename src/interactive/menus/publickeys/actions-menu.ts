import { deleteSSHKey } from "../../functions/public-keys/delete.ts";
import { Select } from "@cliffy/prompt/select";
import { addGoToMainMenuToOptions, isMainMenu } from "../../goto/options/go-to-main-menu-to-options.ts";

export async function KeyActions(PARENT: () => void, id: number) {
	const _COME_BACK_HERE = () => KeyActions(PARENT, id);
	const action = await Select.prompt({
		message: "Please choose an action: (Some operations cannot be undone)",
		options: [
			{
				value: "DELETE",
				name: "❌Delete Key",
			},
		].concat(addGoToMainMenuToOptions),
	});

	if (isMainMenu(action)) return PARENT();

	switch (action) {
		case "DELETE":
			await deleteSSHKey(_COME_BACK_HERE, id);
			break;
	}
}
