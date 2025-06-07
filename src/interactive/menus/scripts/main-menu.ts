import { createScript } from "../../functions/scripts/create.ts";
import { addGoToMainMenuToOptions, isMainMenu } from "../../goto/options/go-to-main-menu-to-options.ts";
import { ListscriptsMenu } from "./scripts-menu.ts";
import { Select } from "@cliffy/prompt";

export async function ScriptMainMenu(PARENT: () => void) {
	const _COME_BACK_HERE = () => ScriptMainMenu(PARENT);
	const choice = await Select.prompt({
		message: "What do you want to do?",
		options: [
			{
				name: "New Script",
				value: "CREATE",
			},
			{
				name: "List Scripts",
				value: "LIST",
			},
		].concat(addGoToMainMenuToOptions),
	});

	if (isMainMenu(choice)) return PARENT();

	switch (choice) {
		case "CREATE":
			createScript(_COME_BACK_HERE);
			break;
		case "LIST":
			ListscriptsMenu(_COME_BACK_HERE);
			break;
		default:
			break;
	}
}
