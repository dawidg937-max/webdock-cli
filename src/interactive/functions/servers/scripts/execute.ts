import { colors } from "@cliffy/ansi/colors";
import { Webdock } from "../../../../webdock/webdock.ts";
import { Spinner } from "@std/cli/unstable-spinner";
import { goToServerActionMenu } from "../../../goto/server-actions-menu.ts";
import { Confirm } from "@cliffy/prompt/confirm";
import { goToMainMenu } from "../../../goto/main-menu.ts";

export async function executeScriptOnServer(
	PARENT: () => void,
	serverSlug: string,
	scriptID: number,
) {
	const client = new Webdock(false);
	const confirmed = await Confirm.prompt({
		message: `Are you sure you want to execute script #${scriptID} on server ${serverSlug}?`,
		default: false,
	});
	if (!confirmed) {
		return PARENT();
	}

	const spinner = new Spinner();
	spinner.message = "Initiating server execution";
	spinner.start();
	const response = await client.scripts.executeOnServer({
		scriptID: scriptID,
		serverSlug: serverSlug,
	});
	spinner.stop();
	if (!response.success) {
		console.error(response.error);
		return goToMainMenu();
	}

	const event = await client.waitForEvent(
		response.data.headers["x-callback-id"],
	);

	if (!event) return goToMainMenu();

	console.log(colors.bgGreen("script Executed successfully"));
	goToServerActionMenu(serverSlug);
}
