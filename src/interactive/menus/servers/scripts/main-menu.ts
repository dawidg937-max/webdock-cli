import { createServerScript } from "../../../functions/servers/scripts/create.ts";
import { addGoToServerScreenOptions, isReturnToServer } from "../../../goto/options/go-to-server-screen-option.ts";
import { serverScriptsActionMenu } from "./action-menu.ts";
import { Select } from "@cliffy/prompt/select";

export async function serverScriptsMenu(PARENT: () => void, slug: string) {
	const _COME_BACK_HERE = () => serverScriptsMenu(PARENT, slug);
	const action = await Select.prompt({
		message: "Choose an action:",
		options: [
			{
				name: `Add One of your Account scripts to the server ${slug}!`,
				value: "CREATE",
			},
			{
				name: "List scripts on Server!",
				value: "LIST",
			},
		].concat(addGoToServerScreenOptions(slug)),
	});
	const GO_BACK = isReturnToServer(action);
	if (GO_BACK) return PARENT();

	if (action == "CREATE") {
		createServerScript(_COME_BACK_HERE, slug);
	}

	if (action == "LIST") {
		serverScriptsActionMenu(_COME_BACK_HERE, slug);
	}
}
