import { Confirm } from "@cliffy/prompt";
import { Webdock } from "../../../webdock/webdock.ts";
import { Spinner } from "@std/cli/unstable-spinner";
import { goToServerActionMenu } from "../../goto/server-actions-menu.ts";
import { goToMainMenu } from "../../goto/main-menu.ts";

export async function stopServer(PARENT: () => void, slug: string) {
	const client = new Webdock(false);
	const spinner = new Spinner();

	const confirm = await Confirm.prompt({
		message: "⚠️  Are you sure you want to STOP this server?",
		hint: "This will interrupt all running services",
	});

	if (!confirm) {
		return PARENT();
	}

	spinner.message = "🛑 Initiating shutdown sequence...";
	spinner.start();

	const response = await client.servers.stop({
		serverSlug: slug,
	});
	spinner.stop();

	if (!response.success) {
		switch (response.code) {
			case 404:
				console.error("❌ Error: Server not found");
				break;
			case 409:
				console.error("❌ Server already stopped");
				break;
			default:
				console.error("❌ Shutdown failed:", response.error);
		}
		return goToMainMenu();
	}

	const event = await client.waitForEvent(
		response.data.headers["x-callback-id"],
	);

	if (!event) return goToMainMenu();

	console.log("✅ Server stopped successfully!");
	goToServerActionMenu(slug);
}
