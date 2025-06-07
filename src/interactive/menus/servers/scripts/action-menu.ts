import { Webdock } from "../../../../webdock/webdock.ts";
import { deleteServerScript } from "../../../functions/servers/scripts/delete.ts";
import { executeScriptOnServer } from "../../../functions/servers/scripts/execute.ts";
import { Select } from "@cliffy/prompt";
import { addGoToServerScriptsOptions, isReturnToServerScripts } from "../../../goto/options/got-to-server-scripts-options.ts";
import { addGoToMainMenuToOptions, isMainMenu } from "../../../goto/options/go-to-main-menu-to-options.ts";

export async function serverScriptsActionMenu(
	PARENT: () => void,
	serverSlug: string,
) {
	const _COME_BACK_HERE = () => serverScriptsActionMenu(PARENT, serverSlug);
	const client = new Webdock(false);
	const response = await client.scripts.listOnServer({
		serverSlug: serverSlug,
	});

	if (!response.success) {
		console.error(response.error);
		return PARENT();
	}

	if (!response.data.body || response.data.body.length == 0) {
		console.log("\n📭 No scripts available. Create one first!\n");
		return PARENT();
	}

	const maxLength = Math.max(...response.data.body.map((e) => e.name.length));
	const choice = await Select.prompt({
		message: "Select a script:",
		options: response.data.body.map((script) => {
			return ({
				name: `(${script.id}) - ${script.name.padEnd(maxLength)}`,
				value: script.id,
			});
			// @ts-expect-error:
		}).concat(addGoToServerScriptsOptions(serverSlug)),
	});
	const GO_BACK = isReturnToServerScripts(choice);

	if (GO_BACK) return PARENT();
	const action = await Select.prompt({
		message: "Please choose an action: (Some operations cannot be undone)",
		options: [
			{
				value: "DELETE",
				name: "Delete script",
			},
			{
				value: "EXECUTE",
				name: "Execute script",
			},
		].concat(addGoToMainMenuToOptions),
	});
	if (isMainMenu(action)) return PARENT();

	if (action == "DELETE") {
		deleteServerScript(_COME_BACK_HERE, serverSlug, choice);
	}
	if (action == "EXECUTE") {
		executeScriptOnServer(_COME_BACK_HERE, serverSlug, choice);
	}
}
