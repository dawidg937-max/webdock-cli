import { Webdock } from "../../../webdock/webdock.ts";
import { deleteServer } from "../../functions/servers/delete.ts";
import { fetchFile } from "../../functions/servers/fetch-file-service.ts";
import { metricsService } from "../../functions/servers/metrics.ts";
import { reboot } from "../../functions/servers/reboot.ts";
import { reinstall } from "../../functions/servers/reinstall.ts";
import { resizeServerAction } from "../../functions/servers/resize.ts";
import { startServerAction } from "../../functions/servers/start.ts";
import { stopServer } from "../../functions/servers/stop.ts";
import { archive } from "../../functions/servers/archive.ts";
import serverActionsOptions from "../../utils/server-actions-options.ts";
import { listServerShellUsers } from "../shellusers/main-menu.ts";
import { manageServersSnapshots } from "../snapshots/main-menu.ts";
import { serverScriptsMenu } from "./scripts/main-menu.ts";
import { Select } from "@cliffy/prompt";
import { colors } from "@cliffy/ansi/colors";

export async function serverActionsInterface(PARENT: () => void, slug: string) {
	const _COME_BACK_HERE = () => serverActionsInterface(PARENT, slug);
	const client = new Webdock(false);

	const response = await client.servers.getBySlug({ serverSlang: slug });

	if (!response.success) {
		console.error(colors.red("Failed to connect to server:"), response.error);
		Deno.exit(1);
	}

	console.log(
		colors.bgBlue.white(`MANAGING SERVER: ${response.data.body.name} `),
	);
	console.log(colors.italic(`Status: ${response.data.body.status}`));
	console.log(colors.italic(`IP: ${response.data.body.ipv4}\n`));

	const action = await Select.prompt({
		message: "Choose an action:",
		options: serverActionsOptions.map((item, idx) => {
			return {
				...item,
				name: `${String(idx + 1).padStart(2, "0")}. ${item.name}`,
			};
		}),
		maxRows: 20,
	});

	if (action === "EXIT") {
		return PARENT();
	}

	switch (action) {
		case "REBOOT":
			await reboot(_COME_BACK_HERE, slug);
			break;
		case "FETCH":
			await fetchFile(_COME_BACK_HERE, slug);
			break;
		case "METRICS":
			await metricsService(_COME_BACK_HERE, slug);
			break;
		case "STOP":
			await stopServer(_COME_BACK_HERE, slug);
			break;
		case "START":
			await startServerAction(_COME_BACK_HERE, slug);
			break;
		case "DELETE":
			await deleteServer(_COME_BACK_HERE, slug);
			break;
		case "REINSTALL":
			await reinstall(_COME_BACK_HERE, slug);
			break;
		case "RESIZE":
			await resizeServerAction(_COME_BACK_HERE, slug);
			break;
		case "ARCHIVE":
			await archive(_COME_BACK_HERE, slug);
			break;
		case "SHELL":
			await listServerShellUsers(_COME_BACK_HERE, { slug });
			break;
		case "SNAPSHOTS":
			await manageServersSnapshots(_COME_BACK_HERE, slug);
			break;
		case "SCRIPTS":
			await serverScriptsMenu(_COME_BACK_HERE, slug);
			break;
		default:
			console.error("Unknown action:", action);
			Deno.exit(1);
	}
}
