import { Spinner } from "@std/cli/unstable-spinner";
import { Webdock } from "../../../webdock/webdock.ts";
import { addGoToMainMenuToOptions, isMainMenu } from "../../goto/options/go-to-main-menu-to-options.ts";
import { formatServerOption } from "../../utils/format-server-options.ts";
import { serverActionsInterface } from "./actions-menu.ts";
import { Select } from "@cliffy/prompt/select";
import { goToMainMenu } from "../../goto/main-menu.ts";
import { colors } from "@cliffy/ansi/colors";
import { Server } from "../../../webdock/sub/servers.ts";

export async function listAllServers(PARENT: () => void) {
	const _COME_BACK_HERE = () => listAllServers(PARENT);
	const spinner = new Spinner();
	const client = new Webdock(false);
	spinner.message = "🔍 Loading server list...";
	spinner.start();

	const response = await client.servers.list();
	spinner.stop();
	if (!response.success) {
		console.error("❌ Failed to load servers:", response.error);
		return goToMainMenu();
	}

	if (!response.success || response.data.body.length == 0) {
		console.log(colors.bgRed("No Server were found!"));
		return PARENT();
	}

	const options = getServerOptions(response.data.body);

	if (options.length === 0) {
		console.log("ℹ️  No servers found. Create one first!");
		return PARENT();
	}

	const serverChoice = await Select.prompt({
		message: "Select a server to manage:",
		options: options.concat(addGoToMainMenuToOptions),
	});
	if (isMainMenu(serverChoice)) return PARENT();

	console.log("\n✅ Selected server:", serverChoice);
	await serverActionsInterface(_COME_BACK_HERE, serverChoice);
}

export function getServerOptions(servers: Server[]) {
	const activeServers = servers.filter((server) => server.status !== "suspended");
	const formattedServers = activeServers.map(formatServerOption);
	return [...formattedServers];
}
