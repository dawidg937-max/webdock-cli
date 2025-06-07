import { deleteScript } from "../../functions/scripts/delete.ts";
import { updateScript } from "../../functions/scripts/update.ts";
import { Select } from "@cliffy/prompt/select";
import { addGoToMainMenuToOptions, isMainMenu } from "../../goto/options/go-to-main-menu-to-options.ts";

export async function ScriptActions(PARENT: () => void, id: number) {
	const _COME_BACK_HERE = () => ScriptActions(PARENT, id);
	const action = await Select.prompt({
		message: "Please choose an action: (Some operations cannot be undone)",
		options: [
			{
				value: "DELETE",
				name: `Delete script #${id}`,
			},
			{
				value: "UPDATE",
				name: `Update script #${id}`,
			},
		].concat(addGoToMainMenuToOptions),
	});

	if (isMainMenu(action)) return PARENT();

	switch (action) {
		case "DELETE":
			await deleteScript(_COME_BACK_HERE, id);
			break;
		case "UPDATE":
			await updateScript(_COME_BACK_HERE, id);
			break;
	}
}
