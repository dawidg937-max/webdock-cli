import { createHook } from "../../functions/hooks/create.ts";
import { Select } from "@cliffy/prompt";
import { manageWebhooks } from "./list-hooks.ts";
import { addGoToMainMenuToOptions, isMainMenu } from "../../goto/options/go-to-main-menu-to-options.ts";

export async function hooksMainMenu(PARENT: () => void) {
	const _COME_BACK_HERE = () => hooksMainMenu(PARENT);
	const choice = await Select.prompt({
		message: "Choose",
		options: [
			{
				name: "Create a New Hook!",
				value: "NEW",
			},
			{
				name: "List hooks",
				value: "LIST",
			},
		].concat(addGoToMainMenuToOptions),
	});
	if (isMainMenu(choice)) return PARENT();
	switch (choice) {
		case "NEW":
			createHook(_COME_BACK_HERE);
			break;
		case "LIST":
			manageWebhooks(_COME_BACK_HERE);
			break;
		default:
			break;
	}
}
